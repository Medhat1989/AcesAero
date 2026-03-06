import React, { useState, useEffect } from 'react';
import { db, auth, signInWithGoogle, logout } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firestoreUtils';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  LogOut,
  Mail,
  Phone,
  Globe,
  FileText,
  Building2,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Application {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  nationality: string;
  crewType: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: any;
  hasCv: boolean;
  hasLicense: boolean;
  hasHrLetter: boolean;
}

interface Partnership {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  operationType: string;
  services: string[];
  status: 'pending' | 'contacted' | 'partnered' | 'archived';
  createdAt: any;
}

export default function AdminDashboard() {
  console.log('AdminDashboard rendering...');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'partnerships'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });

    const qPartners = query(collection(db, 'partnerships'), orderBy('createdAt', 'desc'));
    const unsubPartners = onSnapshot(qPartners, (snapshot) => {
      setPartnerships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partnership)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'partnerships');
    });

    return () => {
      unsubApps();
      unsubPartners();
    };
  }, [user]);

  const updateStatus = async (type: 'applications' | 'partnerships', id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, type, id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${type}/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-aviation-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[2.5rem] text-center max-w-md w-full border border-white/10"
        >
          <div className="w-20 h-20 bg-aviation-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Briefcase className="text-aviation-gold w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Admin Access</h1>
          <p className="text-white/50 mb-8">Please sign in with your authorized Google account to access the applications dashboard.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-3"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const filteredApps = applications.filter(app => 
    `${app.name} ${app.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPartners = partnerships.filter(p => 
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030014] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">Admin <span className="text-aviation-gold">Dashboard</span></h1>
            <p className="text-white/50">Welcome back, {user.displayName || 'Administrator'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2 text-sm focus:border-aviation-gold outline-none transition-all"
              />
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/50 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('applications')}
            className={cn(
              "px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'applications' ? "bg-aviation-gold text-black" : "glass text-white/50 hover:text-white"
            )}
          >
            <Users className="w-4 h-4" /> Applications ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('partnerships')}
            className={cn(
              "px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'partnerships' ? "bg-aviation-gold text-black" : "glass text-white/50 hover:text-white"
            )}
          >
            <Building2 className="w-4 h-4" /> Partnerships ({partnerships.length})
          </button>
        </div>

        {/* Content */}
        <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-aviation-gold text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">{activeTab === 'applications' ? 'Candidate' : 'Company'}</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">{activeTab === 'applications' ? 'Position' : 'Services'}</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeTab === 'applications' ? (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-xs text-white/40">
                        {app.createdAt?.toDate().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm">{app.name} {app.surname}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{app.nationality}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                          <Mail className="w-3 h-3 text-aviation-gold" /> {app.email}
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <Phone className="w-3 h-3 text-aviation-gold" /> {app.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-white/80">{app.crewType}</div>
                        <div className="flex gap-2 mt-2">
                          {app.hasCv && <FileText className="w-3 h-3 text-aviation-gold" />}
                          {app.hasLicense && <ShieldCheck className="w-3 h-3 text-aviation-gold" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          app.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                          app.status === 'reviewed' && "bg-blue-500/10 text-blue-500",
                          app.status === 'accepted' && "bg-green-500/10 text-green-500",
                          app.status === 'rejected' && "bg-red-500/10 text-red-500"
                        )}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => updateStatus('applications', app.id, 'accepted')}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus('applications', app.id, 'rejected')}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredPartners.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-xs text-white/40">
                        {p.createdAt?.toDate().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm">{p.companyName}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{p.operationType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-xs text-white/80 mb-1">{p.contactName}</div>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Mail className="w-3 h-3 text-aviation-gold" /> {p.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.services.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-white/40 uppercase">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          p.status === 'pending' && "bg-yellow-500/10 text-yellow-500",
                          p.status === 'contacted' && "bg-blue-500/10 text-blue-500",
                          p.status === 'partnered' && "bg-green-500/10 text-green-500",
                          p.status === 'archived' && "bg-white/10 text-white/40"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => updateStatus('partnerships', p.id, 'partnered')}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus('partnerships', p.id, 'archived')}
                            className="p-2 rounded-lg bg-white/10 text-white/40 hover:bg-white/20 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {(activeTab === 'applications' ? filteredApps : filteredPartners).length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-white/20 w-8 h-8" />
                </div>
                <p className="text-white/30">No records found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
