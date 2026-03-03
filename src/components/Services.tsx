import React from 'react';
import { motion } from 'motion/react';
import { 
  IdCard, 
  Hotel, 
  Truck, 
  ShieldCheck, 
  Users, 
  ChevronRight,
  Globe,
  Briefcase,
  MapPin,
  Plane
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const ServiceCard = ({ icon: Icon, title, description, features }: { icon: any, title: string, description: string, features: string[] }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl group transition-all"
  >
    <div className="w-12 h-12 md:w-16 md:h-16 bg-aviation-gold/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-aviation-gold group-hover:text-black transition-all">
      <Icon className="w-6 h-6 md:w-8 md:h-8" />
    </div>
    <h3 className="text-xl md:text-2xl font-display font-bold mb-4">{title}</h3>
    <p className="text-white/50 mb-6 text-sm md:text-base leading-relaxed">{description}</p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-white/70">
          <div className="w-1.5 h-1.5 rounded-full bg-aviation-gold" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

export default function Services() {
  return (
    <div className="min-h-screen bg-[#030014] pt-24 md:pt-32">
      {/* Services Header */}
      <section className="px-6 mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6">
              OUR <span className="text-aviation-gold">SERVICES</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-base md:text-xl">
              Comprehensive aviation solutions tailored for the Middle Eastern market. From elite crew recruitment to complex ground operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 md:py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={IdCard}
              title="Immigration & Visas"
              description="Navigating the complex regulatory landscape of the Middle East with ease."
              features={["Visa Processing", "Work Permits", "Regulatory Compliance", "Fast-track Entry"]}
            />
            <ServiceCard 
              icon={Hotel}
              title="HOTAC & Housing"
              description="Premium accommodation solutions for crew and staff across all major hubs."
              features={["Hotel Contracts", "Staff Housing", "Transportation", "24/7 Support"]}
            />
            <ServiceCard 
              icon={Truck}
              title="Ramp & Ground Ops"
              description="Specialized equipment and personnel for efficient turnarounds."
              features={["GSE Maintenance", "Ramp Equipment", "Ground Staffing", "Safety Audits"]}
            />
          </div>
        </div>
      </section>

      {/* Crew Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=1000" 
                alt="Arabic Cabin Crew" 
                className="rounded-2xl md:rounded-3xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 glass p-4 md:p-6 rounded-xl md:rounded-2xl max-w-[200px] md:max-w-xs">
                <p className="text-aviation-gold font-bold mb-1 md:mb-2 text-xs md:text-base">EASA CERTIFIED</p>
                <p className="text-[10px] md:text-sm text-white/70">All our Arabic-speaking crew members hold full EASA certifications, ensuring the highest global safety standards.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8">
              Arabic Speaking <br />
              <span className="text-aviation-gold">Cabin Crew</span>
            </h2>
            <div className="space-y-4 md:space-y-6 text-white/60 leading-relaxed text-sm md:text-base">
              <p>
                In the heart of the Middle East, cultural resonance is key to passenger satisfaction. AcesAds Aero specializes in providing elite, bilingual cabin crew who bridge the gap between global service standards and local hospitality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-display font-bold text-white mb-1">100%</p>
                  <p className="text-xs uppercase tracking-widest">EASA Certified</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-display font-bold text-white mb-1">Bilingual</p>
                  <p className="text-xs uppercase tracking-widest">Arabic & English</p>
                </div>
              </div>
              <p>
                Our recruitment process is rigorous, focusing not just on technical skills but on the "Aero Spirit"—a commitment to safety, elegance, and unparalleled service.
              </p>
              <RouterLink to="/careers" className="group flex items-center gap-3 text-aviation-gold font-bold hover:gap-5 transition-all">
                View open positions <ChevronRight className="w-5 h-5" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      {/* Ground Operations */}
      <section className="py-16 md:py-24 px-6 bg-aviation-blue/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 md:mb-16 gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 md:mb-6">Ground Operations <br />& <span className="text-aviation-gold">Staffing</span></h2>
              <p className="text-white/50 text-sm md:text-base px-4 md:px-0">We provide the backbone of airport operations, ensuring every flight departs on time and every passenger experience is seamless.</p>
            </div>
            <RouterLink to="/apply" className="w-full md:w-auto px-8 py-4 glass-button text-white font-bold rounded-full active:scale-95 transition-all text-center">
              View Staffing Options
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Check-in Agents", icon: Users, count: "500+" },
              { title: "Ramp Supervisors", icon: ShieldCheck, count: "120+" },
              { title: "Equipment Operators", icon: Truck, count: "250+" }
            ].map((item, i) => (
              <div key={i} className={cn(
                "glass p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group",
                i === 2 && "sm:col-span-2 lg:col-span-1"
              )}>
                <item.icon className="absolute -right-4 -bottom-4 w-24 h-24 md:w-32 md:h-32 text-white/5 group-hover:text-aviation-gold/10 transition-colors" />
                <p className="text-aviation-gold font-bold mb-2 text-xs md:text-base">{item.count} Active</p>
                <h4 className="text-xl md:text-2xl font-display font-bold">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[2rem] md:rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aviation-gold to-transparent" />
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-8">Ready to elevate your <span className="text-aviation-gold">operations?</span></h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <RouterLink to="/partner" className="w-full md:w-auto px-12 py-5 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform">
              Partner With Us
            </RouterLink>
            <RouterLink to="/partner" className="w-full md:w-auto px-12 py-5 glass rounded-full hover:bg-white/10 transition-all">
              Contact Sales
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  );
}
