import React from 'react';
import { Flame, ShieldCheck, Heart, Sparkles, Truck, Users, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Header */}
      <section className="bg-[#8B0000] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#E5E1D8]">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white/10 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Our Sacred Mission</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FDFCF8] leading-tight">
            Celebrating Authentic Indian Traditions With Reverence & Craft
          </h1>
          <p className="text-xs sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Utsav Veda was founded on a simple, timeless principle: Indian festivals should illuminate hearts, uplift artisan communities, and safeguard our homes and environment with pure, peaceful celebration.
          </p>
        </div>
      </section>

      {/* Narrative & Ethical Commerce Declaration */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#555555] leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-[#333333]">
              From Rajasthan Potters to Sacred Verandas
            </h2>
            <p>
              In an era dominated by mass-produced plastic knick-knacks and dangerous noisy explosives, Utsav Veda rekindles the divine warmth of traditional celebrations. We partner directly with master craftspeople across Rajasthan, Uttar Pradesh, West Bengal, and Tamil Nadu.
            </p>
            <p>
              Every terracotta diya is moulded from riverbed clay, fired in wood-fueled kilns, and hand-painted by women artisans using eco-friendly natural lacquers. Every brass puja thali is individually cast and engraved by fifth-generation metalsmiths.
            </p>
            <div className="p-5 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8]">
              <h4 className="font-serif font-bold text-sm text-[#8B0000] mb-1">
                Our Non-Hazardous & Peaceful Celebration Charter
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                We believe true festival joy comes from light, music, prayer, and shared sweets. Utsav Veda maintains a strict zero-tolerance policy against explosives, fireworks, and hazardous chemicals. Every product in our catalogue is 100% lawful, age-appropriate, and safe for children, seniors, and family pets.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg overflow-hidden border border-[#E5E1D8] shadow-2xs bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1574885834898-33334204d805?auto=format&fit=crop&w=800&q=80"
                alt="Indian Festive Artisan"
                className="w-full h-80 object-cover rounded-md"
              />
              <div className="p-3 text-center">
                <p className="font-serif font-bold text-xs text-[#333333]">Master Artisan Devendra Kumawat</p>
                <p className="text-[11px] text-[#777777]">Molela Terracotta Artisan Cooperative, Rajasthan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFCF8] rounded-lg border border-[#E5E1D8] p-8 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#333333]">Artisan Impact at a Glance</h3>
            <p className="text-xs text-[#666666] mt-1">Direct community empowerment with every celebration item purchased.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 bg-white rounded-md border border-[#E5E1D8] shadow-2xs">
              <span className="font-serif text-3xl font-extrabold text-[#8B0000]">250+</span>
              <p className="text-xs font-bold text-[#333333] mt-1">Rural Artisan Families</p>
              <p className="text-[11px] text-[#777777]">Directly supported</p>
            </div>
            <div className="p-5 bg-white rounded-md border border-[#E5E1D8] shadow-2xs">
              <span className="font-serif text-3xl font-extrabold text-[#8B0000]">100%</span>
              <p className="text-xs font-bold text-[#333333] mt-1">Safe & Non-Explosive</p>
              <p className="text-[11px] text-[#777777]">Zero hazardous chemicals</p>
            </div>
            <div className="p-5 bg-white rounded-md border border-[#E5E1D8] shadow-2xs">
              <span className="font-serif text-3xl font-extrabold text-[#8B0000]">50,000+</span>
              <p className="text-xs font-bold text-[#333333] mt-1">Festive Homes Adorned</p>
              <p className="text-[11px] text-[#777777]">Across 1,200 Indian pin codes</p>
            </div>
            <div className="p-5 bg-white rounded-md border border-[#E5E1D8] shadow-2xs">
              <span className="font-serif text-3xl font-extrabold text-[#8B0000]">Zero</span>
              <p className="text-xs font-bold text-[#333333] mt-1">Plastic Single-Use</p>
              <p className="text-[11px] text-[#777777]">Recyclable packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Shop */}
      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
        >
          Explore Handcrafted Festival Collection
        </button>
      </div>

    </div>
  );
};
