
import React from 'react';

interface RepresentativeProfileProps {
  profile: any;
  isAdminMode?: boolean;
  onAdmin?: () => void;
  onImageClick?: (src: string) => void;
}

const RepresentativeProfile: React.FC<RepresentativeProfileProps> = ({ profile, isAdminMode, onAdmin, onImageClick }) => {
  return (
    <section id="profile-section" className="py-10 border-t border-zinc-900 relative scroll-mt-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-center">
        <div className="lg:w-1/4 w-full flex justify-center lg:justify-start">
          <div className="relative group overflow-hidden rounded-[2.5rem] border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.7)] max-w-[240px] w-full">
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="w-full aspect-[4/5] object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 cursor-zoom-in group-hover:scale-105" 
              onClick={() => onImageClick?.(profile.imageUrl)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
            
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <h3 className="brand-serif text-2xl font-black text-white drop-shadow-lg">{profile.name}</h3>
              <p className="text-primary font-black text-[9px] uppercase tracking-[0.2em] mt-1 italic">
                {profile.title}
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:w-3/4 w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-900 pb-6">
            <div>
              <h2 className="wp-serif text-4xl font-black text-white tracking-tighter italic leading-none">THE VISIONARY</h2>
              <p className="text-zinc-600 font-bold tracking-[0.4em] text-[8px] uppercase mt-2">정론직필의 미디어, 혁신적인 기획 서비스</p>
            </div>
            <div className="flex gap-2">
              {profile.blogUrl && (
                <a 
                  href={profile.blogUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-zinc-900/50 text-zinc-400 border border-zinc-800 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#2DB400] hover:text-white hover:border-[#2DB400] transition-all"
                >
                  BLOG
                </a>
              )}
              {isAdminMode && (
                <button 
                  onClick={onAdmin} 
                  className="bg-primary text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all"
                >
                  EDIT
                </button>
              )}
            </div>
          </div>
          
          <div className="relative group">
             <span className="absolute -top-8 -left-5 text-[100px] text-zinc-900 font-serif leading-none opacity-40 select-none group-hover:text-primary transition-colors">"</span>
             <p className="text-zinc-300 text-lg md:text-xl italic leading-relaxed font-light relative z-10 pl-6 border-l-2 border-primary/40 group-hover:border-primary transition-all">
               {profile.description}
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 pt-2">
            {profile.careers.map((career: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 group/item">
                <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover/item:bg-primary transition-all shrink-0"></div>
                <span className="text-zinc-500 text-xs font-bold tracking-tight group-hover/item:text-zinc-200 transition-colors">
                  {career.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepresentativeProfile;
