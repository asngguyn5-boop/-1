
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AIMessage } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [toolType, setToolType] = useState<'search' | 'maps'>('search');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Base64 Helpers
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const userMsg: AIMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Corrected GoogleGenAI initialization as per mandatory guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = toolType === 'maps' ? 'gemini-2.5-flash' : 'gemini-3-flash-preview';
      const tools: any[] = toolType === 'maps' ? [{ googleMaps: {} }] : [{ googleSearch: {} }];
      
      let latLng = undefined;
      if (toolType === 'maps') {
        try {
          const pos: any = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
          latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) { console.error("Geolocation failed", e); }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: inputText,
        config: {
          tools,
          toolConfig: latLng ? { retrievalConfig: { latLng } } : undefined
        }
      });

      const groundingLinks: { title: string; uri: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) groundingLinks.push({ title: chunk.web.title, uri: chunk.web.uri });
          if (chunk.maps) groundingLinks.push({ title: chunk.maps.title, uri: chunk.maps.uri });
        });
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || '죄송합니다. 답변을 생성하지 못했습니다.',
        groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceSession = async () => {
    try {
      // Corrected GoogleGenAI initialization as per mandatory guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceActive(true);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: '당신은 AI천안뉴스의 AI 가이드입니다. 친절하고 전문적으로 천안 소식과 안내를 제공하세요.'
        }
      });

      sessionRef.current = await sessionPromise;
      setMessages(prev => [...prev, { role: 'model', text: '음성 대화를 시작합니다. 무엇이든 물어보세요.', isAudio: true }]);
    } catch (e) {
      console.error(e);
      alert("마이크 연결에 실패했습니다.");
    }
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsVoiceActive(false);
    setMessages(prev => [...prev, { role: 'model', text: '음성 대화가 종료되었습니다.' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 md:p-8 pointer-events-none">
      <div className="w-full max-w-lg h-[80vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#004EA2] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-black text-lg wp-serif italic">AI 가이드</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Smart Intelligence Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Message List */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 animate-bounce">
                <svg className="w-8 h-8 text-[#004EA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                <h4 className="text-white font-bold">천안의 모든 것, 물어보세요!</h4>
                <p className="text-zinc-500 text-sm mt-1">지역 소식, 추천 장소, 행정 안내 등<br/>AI가 실시간 정보를 검색해 답변합니다.</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#004EA2] text-white' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                {msg.groundingLinks && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">출처 및 관련 링크</p>
                    {msg.groundingLinks.map((link, j) => (
                      <a key={j} href={link.uri} target="_blank" rel="noreferrer" className="block text-xs text-blue-400 hover:underline truncate">
                        • {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-2">
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-pulse delay-150"></span>
              </div>
            </div>
          )}
        </div>

        {/* Footer/Input */}
        <div className="p-6 bg-zinc-900/30 border-t border-zinc-900 space-y-4">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={() => setToolType('search')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${toolType === 'search' ? 'bg-[#004EA2] text-white' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              Search
            </button>
            <button 
              onClick={() => setToolType('maps')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${toolType === 'maps' ? 'bg-[#004EA2] text-white' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            >
              Maps
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-grow relative">
              <input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendText()}
                placeholder={toolType === 'maps' ? "주변 장소를 검색하세요..." : "천안 소식을 물어보세요..."}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#004EA2] transition-colors pr-12"
              />
              <button 
                onClick={handleSendText}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004EA2] hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
            
            <button 
              onClick={isVoiceActive ? stopVoiceSession : startVoiceSession}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isVoiceActive ? 'bg-red-600 animate-pulse' : 'bg-zinc-800 hover:bg-zinc-700'}`}
            >
              {isVoiceActive ? (
                <div className="flex items-center gap-1">
                   <div className="w-1 h-4 bg-white rounded-full animate-wave"></div>
                   <div className="w-1 h-6 bg-white rounded-full animate-wave delay-75"></div>
                   <div className="w-1 h-4 bg-white rounded-full animate-wave delay-150"></div>
                </div>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>
          </div>
          
          {isVoiceActive && (
            <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-widest animate-pulse">
              Live Voice Interaction Active
            </p>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.5); }
        }
        .animate-wave { animation: wave 1s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AIAssistant;
