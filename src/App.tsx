import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Users, 
  Globe, 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Truck,
  Hotel,
  IdCard
} from 'lucide-react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Link as RouterLink,
  useNavigate
} from 'react-router-dom';
import TalentForm from './components/TalentForm';
import Careers from './components/Careers';
import ServicesPage from './components/Services';
import PartnerForm from './components/PartnerForm';
import { generateCabinCrewGroupImage } from './services/imageService';
import { cn } from './lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (window.location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + id);
      return;
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-4",
      isMobileMenuOpen ? "bg-[#030014] border-b border-white/10" : "glass",
      isScrolled ? "py-3" : "py-5"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <RouterLink to="/" className="flex items-center">
          <img 
            src="https://i.ibb.co/TBx4bT9P/acesair-removebg-preview.png" 
            alt="AcesAds Aero Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </RouterLink>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <RouterLink to="/services" className="hover:text-aviation-gold transition-colors">Services</RouterLink>
          <RouterLink to="/careers" className="hover:text-aviation-gold transition-colors">Careers</RouterLink>
          <a href="#ground" onClick={(e) => handleNavClick(e, '#ground')} className="hover:text-aviation-gold transition-colors">Ground Ops</a>
          <RouterLink to="/partner" className="px-5 py-2 bg-white text-black rounded-full hover:bg-aviation-gold hover:text-white transition-all">Partner With Us</RouterLink>
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[#030014] border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="p-8 flex flex-col gap-2">
              <RouterLink to="/services" className="px-4 py-4 text-xl font-display font-bold hover:text-aviation-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</RouterLink>
              <RouterLink to="/careers" className="px-4 py-4 text-xl font-display font-bold hover:text-aviation-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Careers</RouterLink>
              <a href="#ground" className="px-4 py-4 text-xl font-display font-bold hover:text-aviation-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Ground Ops</a>
            <div className="h-px bg-white/5 my-4 mx-4" />
            <RouterLink to="/partner" className="mt-4 glass-button text-white p-5 rounded-2xl text-center font-bold text-lg active:scale-95 transition-transform" onClick={() => setIsMobileMenuOpen(false)}>Partner With Us</RouterLink>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const bgImage = "https://i.ibb.co/bqWLMsT/Aces-Ads-Crew.png";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="AcesAds Crew" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aviation-gold/20 border border-aviation-gold/30 text-aviation-gold text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
            <Globe className="w-3 h-3" /> Middle East Aviation Leaders
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-bold leading-[1.1] md:leading-[0.9] mb-8 tracking-tight">
            ELEVATING <br />
            <span className="text-aviation-gold">AVIATION</span> <br />
            EXCELLENCE.
          </h1>
          <p className="text-lg md:text-2xl text-white/80 max-w-3xl mb-12 leading-relaxed font-light">
            AcesAds Aero is your premier partner for aviation recruitment and operational services across the Middle East. From EASA-certified crew to ground support, we bridge the gap between talent and opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <RouterLink to="/services" className="px-12 py-5 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2 text-lg">
              Explore Services <ArrowRight className="w-5 h-5" />
            </RouterLink>
            <RouterLink to="/careers" className="px-12 py-5 glass rounded-full hover:bg-white/10 transition-all text-lg flex items-center justify-center">
              VIEW CAREERS
            </RouterLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, description, features }: { icon: any, title: string, description: string, features: string[] }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl group transition-all"
  >
    <div className="w-12 h-12 md:w-14 md:h-14 bg-aviation-gold/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-aviation-gold transition-colors">
      <Icon className="w-6 h-6 md:w-7 md:h-7 text-aviation-gold group-hover:text-black transition-colors" />
    </div>
    <h3 className="text-xl md:text-2xl font-display font-bold mb-4">{title}</h3>
    <p className="text-white/50 mb-6 text-xs md:text-sm leading-relaxed">{description}</p>
    <ul className="space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-xs font-medium text-white/70">
          <CheckCircle2 className="w-4 h-4 text-aviation-gold" /> {f}
        </li>
      ))}
    </ul>
  </motion.div>
);

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24 px-4 md:px-6 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 md:mb-6">Comprehensive <span className="text-aviation-gold">Aero</span> Solutions</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base px-4">
            From the cockpit to the ground, we provide end-to-end services that ensure seamless operations for airlines and aviation businesses in the Middle East.
          </p>
        </div>

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
  );
};

const CrewSection = () => {
  return (
    <section id="crew" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="relative">
            <img 
              src="https://i.ibb.co/bqWLMsT/Aces-Ads-Crew.png" 
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
              Learn about our training <ChevronRight className="w-5 h-5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
};

const GroundStaff = () => {
  return (
    <section id="ground" className="py-16 md:py-24 px-4 md:px-6 bg-aviation-blue/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-12 md:mb-16 gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-4 md:mb-6">Ground Operations <br />& <span className="text-aviation-gold">Staffing</span></h2>
            <p className="text-white/50 text-sm md:text-base px-4 md:px-0">We provide the backbone of airport operations, ensuring every flight departs on time and every passenger experience is seamless.</p>
          </div>
          <RouterLink to="/partner" className="w-full md:w-auto px-8 py-4 glass-button text-white font-bold rounded-full active:scale-95 transition-all text-center">
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
  );
};

const Footer = () => {
  return (
    <footer className="bg-black pt-16 md:pt-24 pb-12 px-4 md:px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="sm:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="https://i.ibb.co/TBx4bT9P/acesair-removebg-preview.png" 
                alt="AcesAds Aero Logo" 
                className="h-12 md:h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/40 max-w-sm mb-8 text-sm md:text-base leading-relaxed">
              Redefining aviation services in the Middle East through certified excellence and cultural resonance.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-aviation-gold hover:text-black transition-all cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-aviation-gold hover:text-black transition-all cursor-pointer">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-display font-bold mb-6 text-aviation-gold uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><RouterLink to="/services" className="hover:text-aviation-gold transition-colors">Services</RouterLink></li>
              <li><RouterLink to="/careers" className="hover:text-aviation-gold transition-colors">Careers</RouterLink></li>
              <li><a href="#" className="hover:text-aviation-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-aviation-gold transition-colors">Our Hubs</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-display font-bold mb-6 text-aviation-gold uppercase tracking-widest text-xs">Locations</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-aviation-gold shrink-0 mt-1" /> Jeddah, Saudi Arabia</li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-aviation-gold shrink-0 mt-1" /> Cairo, Egypt</li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-aviation-gold shrink-0 mt-1" /> Beirut, Lebanon</li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-aviation-gold shrink-0 mt-1" /> London, UK</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-white/20 text-xs">© 2026 ACES AERO. All rights reserved. EASA Certified Agency.</p>
          <div className="flex gap-8 text-white/20 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => (
  <>
    <Hero />
    <ServicesSection />
    <CrewSection />
    <GroundStaff />
    
    {/* CTA Section */}
    <section id="contact" className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto glass p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aviation-gold to-transparent" />
        <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8">Ready to Take Off?</h2>
        <p className="text-white/60 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto">
          Whether you're looking for elite crew or comprehensive ground support, AcesAds Aero is ready to elevate your operations.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <RouterLink to="/partner" className="w-full md:w-auto px-12 py-5 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform">
            Partner With Us
          </RouterLink>
          <RouterLink to="/careers" className="w-full md:w-auto px-12 py-5 glass rounded-full hover:bg-white/10 transition-all">
            View Careers
          </RouterLink>
        </div>
      </div>
    </section>
  </>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/apply" element={<Navigate to="/careers" replace />} />
          <Route path="/partner" element={<PartnerForm />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
