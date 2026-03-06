import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Loader2, Building2, Globe, Users, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';
import { cn } from '../utils/cn';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    operationType: 'Commercial Airline',
    fleetSize: '',
    message: ''
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services = [
    { id: 'crew', label: 'Crew Recruitment', icon: Users },
    { id: 'ground', label: 'Ground Operations', icon: Truck },
    { id: 'visa', label: 'Immigration & Visas', icon: Globe },
    { id: 'hotac', label: 'HOTAC & Housing', icon: Building2 },
    { id: 'compliance', label: 'Regulatory Compliance', icon: ShieldCheck },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'partnerships'), {
        ...formData,
        services: selectedServices,
        status: 'new',
        createdAt: new Date().toISOString()
      });

      // 2. Call backend API for email
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          services: selectedServices.map(id => services.find(s => s.id === id)?.label || id)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send partnership request email.');
      }

      if (result.warning) {
        console.warn("Email warning:", result.warning);
        setError(`Request saved, but email notification failed: ${result.warning}. Please ensure SMTP is configured.`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Partnership Submission Error:", err);
      if (err.name === 'FirebaseError') {
        handleFirestoreError(err, OperationType.CREATE, 'partnerships');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center max-w-lg w-full"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 glass-button rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
            <CheckCircle2 className="text-white w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Partnership Request Sent</h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            Thank you for reaching out to AcesAds Aero. Our business development team will review your requirements and contact you within 24-48 hours.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] pt-24 md:pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-aviation-gold font-bold mb-8 md:mb-12 hover:gap-4 transition-all text-sm md:text-base">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-6xl font-display font-bold mb-4">Partner With <span className="text-aviation-gold">AcesAds Aero</span></h1>
          <p className="text-white/50 text-lg">Optimized solutions for operators and airlines looking for excellence in the Middle East.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass p-8 md:p-10 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-display font-bold text-aviation-gold uppercase tracking-widest">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Company Name</label>
                <input 
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. Global Airways"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Operation Type</label>
                <select 
                  name="operationType"
                  value={formData.operationType}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all appearance-none"
                >
                  <option className="bg-[#030014]">Commercial Airline</option>
                  <option className="bg-[#030014]">Private Charter</option>
                  <option className="bg-[#030014]">Cargo Operator</option>
                  <option className="bg-[#030014]">Ground Handler</option>
                  <option className="bg-[#030014]">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Contact Person</label>
                <input 
                  required
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Fleet Size</label>
                <input 
                  name="fleetSize"
                  value={formData.fleetSize}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Number of aircraft"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <input 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email" 
                  placeholder="corporate@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                <input 
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel" 
                  placeholder="+000 000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="glass p-8 md:p-10 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-display font-bold text-aviation-gold uppercase tracking-widest">Services Required</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center",
                    selectedServices.includes(service.id)
                      ? "bg-aviation-gold border-aviation-gold text-black"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  )}
                >
                  <service.icon className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-tight">{service.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-8 md:p-10 rounded-[2rem] space-y-6">
            <h3 className="text-xl font-display font-bold text-aviation-gold uppercase tracking-widest">Additional Requirements</h3>
            <div className="space-y-2">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your specific operational needs..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-aviation-gold outline-none transition-all resize-none"
              />
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full py-6 glass-button text-white font-bold rounded-2xl text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Processing...
              </>
            ) : (
              'Submit Partnership Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
