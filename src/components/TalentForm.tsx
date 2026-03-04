import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, CheckCircle2, Loader2, Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function TalentForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    Object.entries(files).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      console.log("Submitting form data:", formData);
      console.log("Files to upload:", Object.keys(files).filter(k => files[k]));

      const apiUrl = '/api/apply';
      console.log(`Fetching: ${apiUrl} from origin: ${window.location.origin}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data,
      });

      console.log("Server response status:", response.status);
      
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        result = { message: `Server error (${response.status}): ${text.slice(0, 100)}` };
      }
      
      console.log("Server response body:", result);

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
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
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Application Successfully Submitted</h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            Thank you for applying to AcesAds Aero. Our recruitment team will review your application and contact you at the email provided in your CV.
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
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-aviation-gold font-bold mb-8 md:mb-12 hover:gap-4 transition-all text-sm md:text-base">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Join Our <span className="text-aviation-gold">Talent Pool</span></h1>
          <p className="text-white/50 text-sm md:text-base">Complete the form below to start your journey with AcesAds Aero.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
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
            disabled={isSubmitting}
            type="submit"
            className="w-full py-5 glass-button text-white font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit Application <Plane className="w-5 h-5 -rotate-45" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
