import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ title, location, type, description, requirements, benefits }: { 
  title: string, 
  location: string, 
  type: string, 
  description: string,
  requirements: string[],
  benefits?: { label: string, value: string }[]
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 hover:border-aviation-gold/30 transition-all group"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
          Recruitment Closed
        </div>
        <h3 className="text-2xl md:text-4xl font-display font-bold mb-2">{title}</h3>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-white/50 text-xs md:text-sm">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {location}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {type}</span>
          <span className="flex items-center gap-1.5 text-aviation-gold font-bold"><Languages className="w-4 h-4" /> Arabic Speaking Mandatory</span>
        </div>
      </div>
      <div 
        className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white/40 font-bold rounded-full cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base"
      >
        We no longer accept Applications
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
      <div>
        <h4 className="text-base md:text-lg font-display font-bold mb-4 text-white">Role Overview</h4>
        <p className="text-white/60 leading-relaxed mb-6 text-sm md:text-base">
          {description}
        </p>
        <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-aviation-gold w-5 h-5" />
            <span className="font-bold text-xs md:text-sm">Certification Requirement</span>
          </div>
          <p className="text-[10px] md:text-xs text-white/50">Candidates must hold a valid EASA Cabin Crew Attestation to be considered for this position.</p>
        </div>
      </div>
      <div>
        <h4 className="text-base md:text-lg font-display font-bold mb-4 text-white">Key Requirements</h4>
        <ul className="space-y-3">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-white/70">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-aviation-gold shrink-0 mt-0.5" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {benefits && (
      <div className="mt-12 pt-12 border-t border-white/10">
        <h4 className="text-base md:text-lg font-display font-bold mb-6 text-white">Benefits & Package</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-aviation-gold/20 transition-colors">
              <p className="text-aviation-gold font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2">{benefit.label}</p>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">{benefit.value}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
);

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
              OUR <br />
              <span className="text-aviation-gold">CAREERS</span>.
            </h1>
            <p className="text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-8 md:mb-12">
              The recruitment window for current positions has closed. We thank all applicants for their interest. Please check back later for future opportunities within our elite crew.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold">Open Positions</h2>
            <div className="hidden md:flex items-center gap-2 text-white/40 text-sm">
              <Globe className="w-4 h-4" /> Global Opportunities
            </div>
          </div>

          <div className="space-y-8">
            <JobCard 
              title="Experienced Cabin Crew"
              location="Jeddah, Saudi Arabia | Cairo, Egypt"
              type="Full-Time"
              description="We are seeking highly motivated and experienced Cabin Crew members to join our operations in the Middle East. As a representative of AcesAds Aero, you will be responsible for delivering world-class service while ensuring the safety and comfort of all passengers. This role requires a perfect blend of elegance, cultural awareness, and technical proficiency."
              requirements={[
                "Mandatory fluency in Arabic and English (Written & Spoken)",
                "Minimum 1-2 years of experience as Cabin Crew with a reputable airline",
                "Valid EASA Cabin Crew Attestation is mandatory",
                "Minimum age of 21 years at the time of application",
                "Minimum height of 160cm and arm reach of 212cm",
                "High school diploma or equivalent qualification",
                "No visible tattoos while in uniform",
                "Excellent health and fitness level",
                "Strong interpersonal and communication skills"
              ]}
              benefits={[
                { label: "Strategic Base Locations", value: "Fully provided accommodation in both Jeddah and Riyadh." },
                { label: "Structured Work-Life Balance", value: "Enjoy a fixed roster featuring a \"6 weeks on / 2 weeks off\" rotation." },
                { label: "Reliable Logistics", value: "Comprehensive ground transportation provided." },
                { label: "Competitive Tax-Free", value: "Monthly salary package of $1,700 USD." },
                { label: "Professional Commitment", value: "Secure 12-month initial contract." }
              ]}
            />

            {/* Placeholder for future roles */}
            <div className="glass p-8 rounded-3xl border border-white/5 text-center">
              <p className="text-white/30 text-sm italic">More positions coming soon. Stay tuned for ground operations and management roles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-aviation-gold w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Global Standards</h3>
              <p className="text-white/50 text-sm leading-relaxed">Work with EASA-certified standards and global best practices in aviation safety and service.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Globe className="text-aviation-gold w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Cultural Diversity</h3>
              <p className="text-white/50 text-sm leading-relaxed">Join a multicultural team that values diversity and specializes in Middle Eastern hospitality.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Briefcase className="text-aviation-gold w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Career Growth</h3>
              <p className="text-white/50 text-sm leading-relaxed">Access to continuous training and opportunities for advancement within our growing regional network.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
