import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  LogOut, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email === 'medhat.safari@gmail.com' && currentUser.emailVerified) {
          setUser(currentUser);
          localStorage.setItem('isAdminAuthenticated', 'true');
        } else {
          localStorage.removeItem('isAdminAuthenticated');
          navigate('/login');
        }
      } else {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Real-time listeners for applications and partnerships
    const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      // Fallback if orderBy fails (e.g. missing index or missing fields)
      onSnapshot(collection(db, 'applications'), (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'applications');
      });
    });

    const qPartners = query(collection(db, 'partnerships'), orderBy('createdAt', 'desc'));
    const unsubscribePartners = onSnapshot(qPartners, (snapshot) => {
      const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPartnerships(partners);
    }, (error) => {
      // Fallback if orderBy fails
      onSnapshot(collection(db, 'partnerships'), (snapshot) => {
        const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPartnerships(partners.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'partnerships');
      });
    });

    return () => {
      unsubscribeApps();
      unsubscribePartners();
    };
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const stats = [
    { label: 'Total Applications', value: applications.length.toString(), icon: Users, color: 'text-blue-400' },
    { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-aviation-gold' },
    { label: 'Partnership Requests', value: partnerships.length.toString(), icon: FileText, color: 'text-purple-400' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-green-400' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-aviation-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Management <span className="text-aviation-gold">Portal</span></h1>
            <p className="text-white/50 mt-2">Welcome back, {user?.displayName || 'Administrator'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/10"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Live</span>
              </div>
              <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-display font-bold">All Applications ({applications.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {applications.length > 0 ? applications.map((app, i) => (
                  <div key={app.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-aviation-gold/20 flex items-center justify-center text-aviation-gold font-bold">
                        {app.fullName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-bold">{app.fullName}</p>
                        <p className="text-xs text-white/50">{app.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
                        <Clock className="w-3 h-3" /> {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                        app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        app.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400' : 
                        'bg-green-500/10 text-green-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-white/30">No applications yet</div>
                )}
              </div>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-display font-bold">All Partnership Requests ({partnerships.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {partnerships.length > 0 ? partnerships.map((partner, i) => (
                  <div key={partner.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                        {partner.companyName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-bold">{partner.companyName}</p>
                        <p className="text-xs text-white/50">{partner.contactName} • {partner.operationType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
                        <Clock className="w-3 h-3" /> {new Date(partner.createdAt).toLocaleDateString()}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                        partner.status === 'new' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'
                      }`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-white/30">No partnership requests yet</div>
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xl font-display font-bold mb-6">System Status</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm">API Server</span>
                  </div>
                  <span className="text-[10px] text-green-400 font-bold uppercase">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm">Email Service</span>
                  </div>
                  <span className="text-[10px] text-green-400 font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Database</span>
                  </div>
                  <span className="text-[10px] text-yellow-400 font-bold uppercase">Maintenance</span>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-white/10 bg-aviation-gold/5">
              <h3 className="text-lg font-display font-bold mb-2">Admin Tip</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Remember to check the "Partnership Requests" daily. High-priority airlines are marked with a gold star.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
