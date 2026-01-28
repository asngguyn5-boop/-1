
import React from 'react';
// Changed AgencyService to ReceptionService as per types.ts
import { ReceptionService } from '../types';

interface AgencySectionProps {
  // Updated AgencyService to ReceptionService
  services: ReceptionService[];
  isAdminMode?: boolean;
  onAdmin?: () => void;
}

const AgencySection: React.FC<AgencySectionProps> = ({ services, isAdminMode, onAdmin }) => {
  return (
    <section className="py-16 border-t border-gray-800 relative">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="wp-serif text-4xl font-black text-white mb-2 tracking-tighter">종합기획사 SERVICE</h2>
          <p className="text-[#004EA2] font-bold tracking-[0.2em] text-xs uppercase">Premium Creative Solution</p>
        </div>
        <div className="flex items-center gap-4">
          {isAdminMode && (
            <button 
              onClick={onAdmin}
              className="bg-[#004EA2] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              SERVICE ADMIN
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="group bg-gray-900 border border-gray-800 p-8 hover:border-[#004EA2] transition-all">
            <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
            <button className="text-[10px] font-bold text-[#004EA2] uppercase">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AgencySection;
