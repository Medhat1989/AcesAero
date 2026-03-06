import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, CheckCircle2, Loader2, Plane, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

export default function TalentForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    nationality: '',
    dob: '',
    crewType: 'EASA Cabin Crew'
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    cv: null,
    license: null,
    hrLetter: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Save to Firestore for database record
      await addDoc(collection(db, 'applications'), {
        fullName: `${formData.name} ${formData.surname}`,
        email: formData.email,
        role: formData.crewType,
        experience: 'N/A',
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...formData,
        hasCV: !!files.cv,
        hasLicense: !!files.license,
        hasHRLetter: !!files.hrLetter
      });

      // 2. Prepare FormData for backend API (Email with attachments)
      const apiFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, value);
      });
      
      if (files.cv) apiFormData.append('cv', files.cv);
      if (files.license) apiFormData.append('license', files.license);
      if (files.hrLetter) apiFormData.append('hrLetter', files.hrLetter);

      // 3. Call backend API to send email
      const response = await fetch('/api/apply', {
        method: 'POST',
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email notification.');
      }

      if (result.warning) {
        console.warn("Email warning:", result.warning);
        setError(`Application saved, but email notification failed: ${result.warning}. Please ensure SMTP is configured.`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission Error:", err);
      if (err.name === 'FirebaseError') {
        handleFirestoreError(err, OperationType.CREATE, 'applications');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (true) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center max-w-lg w-full border border-red-500/20"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 glass-button rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
            <X className="text-red-500 w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Recruitment Closed</h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            The recruitment window for current positions has closed. We are no longer accepting new applications at this time. Please check our Careers page for future updates.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/careers')}
              className="px-8 py-4 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              View Careers Page
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 text-white/40 hover:text-white transition-colors"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] pt-24 md:pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-aviation-gold font-bold mb-8 md:mb-12 hover:gap-4 transition-all text-sm md:text-base">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Join Our <span className="text-aviation-gold">Talent Pool</span></h1>
          <div className="p-6 md:p-8 glass border border-red-500/20 rounded-2xl md:rounded-3xl text-center">
            <p className="text-red-500 font-bold text-lg md:text-xl mb-2">We no longer accept Applications</p>
            <p className="text-white/40 text-sm">The recruitment window for current positions has closed. Please check back later for future opportunities.</p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 md:space-y-8 opacity-40 pointer-events-none grayscale">
          <div className="glass p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] space-y-6 md:space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Name</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Surname</label>
                <input 
                  required
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="Enter your surname"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Email Address</label>
              <input 
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors text-base"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Nationality</label>
                <input 
                  required
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. Emirati, British"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Date of Birth</label>
                <input 
                  required
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors text-white text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Crew Type</label>
              <select 
                name="crewType"
                value={formData.crewType}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-aviation-gold outline-none transition-colors appearance-none text-base"
              >
                <option value="EASA Cabin Crew" className="bg-black">EASA Cabin Crew</option>
                <option value="Non-EASA Cabin Crew" className="bg-black">Non-EASA Cabin Crew</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Upload CV</label>
                <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-aviation-gold mb-2" />
                  <span className="text-[10px] text-white/50 text-center px-2 line-clamp-1">
                    {files.cv ? files.cv.name : 'Click to upload CV'}
                  </span>
                  <input type="file" required className="hidden" onChange={(e) => handleFileChange(e, 'cv')} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">Upload License</label>
                <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-aviation-gold mb-2" />
                  <span className="text-[10px] text-white/50 text-center px-2 line-clamp-1">
                    {files.license ? files.license.name : 'Click to upload License'}
                  </span>
                  <input type="file" required className="hidden" onChange={(e) => handleFileChange(e, 'license')} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-aviation-gold">HR Letter (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-28 md:h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-aviation-gold mb-2" />
                  <span className="text-[10px] text-white/50 text-center px-2 line-clamp-1">
                    {files.hrLetter ? files.hrLetter.name : 'Previous operator letter'}
                  </span>
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'hrLetter')} />
                </label>
              </div>
            </div>
          </div>

          <button 
            disabled={true}
            type="button"
            className="w-full py-5 bg-white/5 border border-white/10 text-white/40 font-bold rounded-full cursor-not-allowed flex items-center justify-center gap-3"
          >
            We no longer accept Applications
          </button>
        </form>
      </div>
    </div>
  );
}
