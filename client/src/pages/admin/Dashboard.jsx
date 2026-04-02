import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api, { IMG_BASE_URL } from '../../api/axios';
import {
   LayoutDashboard, Utensils, Calendar, Star, LogOut, Plus, Trash2, Edit2,
   CheckCircle, XCircle, Search, Filter, Loader, Menu as MenuIcon, X, BarChart3, Clock, Users, Phone, User as UserIcon,
   ChevronRight, TrendingUp, DollarSign, ShoppingBag, Bell, Image as ImageIcon, Settings as SettingsIcon, ShieldCheck, Mail, Lock, Smartphone, Globe, Download, Eye, AlertTriangle, Sun, MessageSquare, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../../components/NotificationBell';

const easing = [0.16, 1, 0.3, 1];

const Dashboard = () => {
   const { user, logout, loading: authLoading } = useContext(AuthContext);
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('Overview');
   const [menu, setMenu] = useState([]);
   const [reservations, setReservations] = useState([]);
   const [reviews, setReviews] = useState([]);
   const [gallery, setGallery] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [allUsers, setAllUsers] = useState([]);
   const [notifications, setNotifications] = useState([]);

   // Search & Filter States
   const [omniSearch, setOmniSearch] = useState('');
   const [resSearch, setResSearch] = useState('');
   const [resFilter, setResFilter] = useState('all');
   const [menuSearch, setMenuSearch] = useState('');
   const [menuCategory, setMenuCategory] = useState('all');
   const [gallerySearch, setGallerySearch] = useState('');
   const [galleryCategory, setGalleryCategory] = useState('all');

   // Form states
   const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
   const [editingItem, setEditingItem] = useState(null);
   const [menuForm, setMenuForm] = useState({ name: '', khmerName: '', category: 'Khmer Food', price: '', description: '', image: '' });
   const [imageFile, setImageFile] = useState(null);

   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
   const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Interior', description: '', image: '' });
   const [galleryImageFile, setGalleryImageFile] = useState(null);

   // Password change state
   const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
   const [pwStatus, setPwStatus] = useState(null);
   const [pwLoading, setPwLoading] = useState(false);

   const getStrength = (pw) => {
      if (!pw) return null;
      if (pw.length < 6) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-50' };
      if (pw.length < 10) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-50' };
      return { label: 'Strong', color: 'text-emerald-600', bg: 'bg-emerald-50' };
   };

   const handleChangePassword = async (e) => {
      e.preventDefault();
      if (pwForm.newPw !== pwForm.confirm) { setPwStatus({ type: 'error', msg: 'New passwords do not match.' }); return; }
      if (pwForm.newPw.length < 6) { setPwStatus({ type: 'error', msg: 'Password must be at least 6 characters.' }); return; }
      setPwLoading(true); setPwStatus(null);
      try {
         await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
         setPwStatus({ type: 'success', msg: 'Password updated successfully.' });
         setPwForm({ current: '', newPw: '', confirm: '' });
      } catch (err) {
         setPwStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update password.' });
      } finally { setPwLoading(false); }
   };

   useEffect(() => {
      if (!authLoading && (!user || user.role !== 'admin')) navigate('/admin/login');
   }, [user, authLoading, navigate]);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [menuRes, resRes, revRes, galRes] = await Promise.all([
            api.get('/menu'),
            api.get('/reservations'),
            api.get('/reviews/admin'),
            api.get('/gallery')
         ]);
         setMenu(menuRes.data);
         setReservations(resRes.data);
         setReviews(revRes.data);
         setGallery(galRes.data);

         // Mock Users for Management
         setAllUsers([
            { id: 1, name: 'Seng Kim', email: 'admin@leisurelake.com', role: 'admin', lastLogin: '2 hours ago' },
            { id: 2, name: 'Staff Member', email: 'staff@leisurelake.com', role: 'staff', lastLogin: 'Yesterday' }
         ]);

         // Organize Notifications
         setNotifications([
            ...revRes.data.map(r => ({ type: 'Review', title: `New Review from ${r.name}`, content: r.comment, time: r.createdAt, read: false })),
            { type: 'System', title: 'Daily Backup Completed', content: 'Manual database backup was successful.', time: new Date(), read: true },
            { type: 'Staff', title: 'Evening Prep', content: 'Chef reminds all staff about the lakeside gala tonight.', time: new Date(), read: false }
         ]);

      } catch (err) {
         console.error('Failed to fetch dashboard data', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user) fetchData();
   }, [user]);

   const handleMenuSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', menuForm.name);
      formData.append('khmerName', menuForm.khmerName);
      formData.append('category', menuForm.category);
      formData.append('price', menuForm.price);
      formData.append('description', menuForm.description);
      if (imageFile) formData.append('image', imageFile);
      else formData.append('image', menuForm.image);

      try {
         if (editingItem) await api.put(`/menu/${editingItem._id}`, formData);
         else await api.post('/menu', formData);
         setIsMenuModalOpen(false);
         fetchData();
      } catch (err) { alert('Error updating menu'); }
   };

   const handleGallerySubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      formData.append('category', galleryForm.category);
      formData.append('description', galleryForm.description);
      if (galleryImageFile) {
         formData.append('image', galleryImageFile);
      } else if (galleryForm.image) {
         formData.append('image', galleryForm.image);
      }

      try {
         if (editingItem) {
            await api.put(`/gallery/${editingItem._id}`, formData);
         } else {
            await api.post('/gallery', formData);
         }
         setIsGalleryModalOpen(false);
         setEditingItem(null);
         fetchData();
      } catch (err) {
         alert('Error updating gallery');
      }
   };

   const updateReservation = async (id, status) => {
      try {
         await api.put(`/reservations/${id}`, { status });
         fetchData();
      } catch (err) { alert('Error updating reservation'); }
   };

   const exportToCSV = () => {
      if (filteredReservations.length === 0) {
         alert('No reservations found matching current filters.');
         return;
      }
      
      const headers = ['Ref ID', 'Guest Name', 'Phone', 'Email', 'Date', 'Guests', 'Status'];
      const csvData = filteredReservations.map(res => [
         `#${res._id.slice(-6).toUpperCase()}`,
         `"${res.name}"`,
         `"${res.phone}"`,
         `"${res.email}"`,
         new Date(res.date).toLocaleDateString(),
         res.guests,
         res.status.toUpperCase()
      ]);

      const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leisure_lake_reservations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };




   const filteredMenu = menu.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                           dish.khmerName.toLowerCase().includes(menuSearch.toLowerCase());
      const matchesCategory = menuCategory === 'all' || dish.category === menuCategory;
      return matchesSearch && matchesCategory;
   });

   const filteredGallery = gallery.filter(img => {
      const matchesSearch = img.title.toLowerCase().includes(gallerySearch.toLowerCase()) || 
                           img.description.toLowerCase().includes(gallerySearch.toLowerCase());
      const matchesCategory = galleryCategory === 'all' || img.category === galleryCategory;
      return matchesSearch && matchesCategory;
   });

   const filteredReservations = reservations.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(resSearch.toLowerCase()) || res.phone.includes(resSearch);
      const matchesFilter = resFilter === 'all' || res.status === resFilter;
      return matchesSearch && matchesFilter;
   });

   if (authLoading || !user) return null;

   const getOmniResults = () => {
      if (!omniSearch.trim()) return null;
      const term = omniSearch.toLowerCase();
      return {
         resMatches: reservations.filter(r => r.name.toLowerCase().includes(term) || r.phone.includes(term)).slice(0, 3),
         menuMatches: menu.filter(m => m.name.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)).slice(0, 3),
         revMatches: reviews.filter(r => r.name.toLowerCase().includes(term) || r.comment.toLowerCase().includes(term)).slice(0, 3)
      };
   };
   const omniResults = getOmniResults();

   return (
      <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-700 selection:bg-earth-900 selection:text-white">
         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
            {isSidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
               />
            )}
         </AnimatePresence>

         {/* Sidebar */}
         <motion.aside
            initial={false}
            animate={{ 
               width: isSidebarOpen ? 280 : 80,
               x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -280 : 0)
            }}
            className={`bg-white border-r border-slate-100 flex flex-col fixed md:sticky left-0 top-0 h-screen transition-all shadow-[10px_0_40px_-20px_rgba(0,0,0,0.03)] z-[100] ${!isSidebarOpen && 'md:flex hidden'}`}
         >
            <div className="p-8 flex items-center gap-4">
               <Link to="/" className="shrink-0 group overflow-hidden">
                  <img src="/images/logo.png" className={`h-10 transition-all ${isSidebarOpen ? 'w-auto' : 'w-10'}`} alt="Logo" />
               </Link>
               {isSidebarOpen && (
                  <div className="flex flex-col">
                     <span className="font-black text-sm tracking-[0.2em] text-earth-900 uppercase">Leisure Lake</span>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Admin Portal</span>
                  </div>
               )}
            </div>

            <nav className="flex-grow px-4 mt-8 space-y-1.5 overflow-y-auto scrollbar-hide">
               {[
                  { id: 'Overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
                  { id: 'Reservations', icon: <Calendar size={18} />, label: 'Reservations' },
                  { id: 'Menu', icon: <Utensils size={18} />, label: 'Menu Assets' },
                  { id: 'Gallery', icon: <ImageIcon size={18} />, label: 'Gallery' },
                  { id: 'Reviews', icon: <Star size={18} />, label: 'Guest Impressions' },
                  { id: 'Settings', icon: <SettingsIcon size={18} />, label: 'Settings' },
               ].map((item) => (
                  <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id)}
                     className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${activeTab === item.id
                           ? 'bg-earth-900 text-white shadow-xl shadow-earth-900/20'
                           : 'text-slate-400 hover:bg-slate-50 hover:text-earth-900'
                        }`}
                  >
                     <span className={`shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                     {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                     {activeTab === item.id && isSidebarOpen && (
                        <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                     )}
                  </button>
               ))}
            </nav>

            <div className="p-6 border-t border-slate-50 space-y-4">
               {isSidebarOpen && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Last Secure Login</p>
                     <p className="text-xs font-bold text-slate-600">
                        {user?.lastLoginTime 
                           ? `${new Date(user.lastLoginTime).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})} • ${new Date(user.lastLoginTime).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`
                           : 'Current Session'}
                     </p>
                  </div>
               )}
               <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm"
               >
                  <LogOut size={18} strokeWidth={2.5} />
                  {isSidebarOpen && <span>Secure Logout</span>}
               </button>
            </div>
         </motion.aside>

         {/* Main Content */}
         <main className="flex-grow flex flex-col min-h-screen overflow-x-hidden pt-0 mx-auto w-full">
            {/* Navigation Bar */}
            <header className="h-20 md:h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[80] flex items-center justify-between px-4 md:px-8 lg:px-12">
               <div className="flex items-center gap-4 md:gap-6">
                  <button
                     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                     className="p-2.5 md:p-3 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-earth-900 transition-all hover:shadow-sm"
                  >
                     {isSidebarOpen && window.innerWidth < 768 ? <X size={20} /> : <MenuIcon size={20} />}
                  </button>
                  <div className="flex flex-col">
                     <h1 className="text-lg md:text-2xl font-black text-earth-900 tracking-tight">{activeTab}</h1>
                     <p className="hidden sm:block text-[10px] md:text-xs text-slate-400 font-medium tracking-wide">Managing Leisure Lake Digital Estate</p>
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="relative group hidden lg:block z-50">
                     <input
                        type="text"
                        value={omniSearch}
                        onChange={(e) => setOmniSearch(e.target.value)}
                        placeholder="Omni-search..."
                        className="bg-slate-50 border-none rounded-2xl px-12 py-3.5 text-sm w-72 focus:ring-2 focus:ring-earth-900 focus:bg-white transition-all shadow-inner placeholder:font-bold placeholder:text-slate-300"
                     />
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-earth-900 transition-colors" size={16} strokeWidth={3} />
                     
                     {omniSearch && omniResults && (
                        <div className="absolute top-full left-0 mt-3 w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden py-3">
                           {omniResults.resMatches.length === 0 && omniResults.menuMatches.length === 0 && omniResults.revMatches.length === 0 && (
                               <p className="px-5 py-3 text-sm text-slate-400 font-medium">No matches found.</p>
                           )}
                           {omniResults.resMatches.length > 0 && (
                              <div className="mb-2">
                                 <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-5 mb-1 bg-slate-50 py-1">Reservations</h4>
                                 {omniResults.resMatches.map(r => (
                                    <button key={r._id} onClick={() => { setActiveTab('Reservations'); setResSearch(r.phone); setOmniSearch(''); }} className="w-full text-left px-5 py-2 hover:bg-emerald-50 transition-colors">
                                       <p className="text-sm font-bold text-slate-800">{r.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{r.phone} • {r.date}</p>
                                    </button>
                                 ))}
                              </div>
                           )}
                           {omniResults.menuMatches.length > 0 && (
                              <div className="mb-2">
                                 <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-5 mb-1 bg-slate-50 py-1">Menu</h4>
                                 {omniResults.menuMatches.map(m => (
                                    <button key={m._id} onClick={() => { setActiveTab('Menu'); setOmniSearch(''); }} className="w-full text-left px-5 py-2 hover:bg-emerald-50 transition-colors">
                                       <p className="text-sm font-bold text-slate-800">{m.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.category} • ${m.price}</p>
                                    </button>
                                 ))}
                              </div>
                           )}
                           {omniResults.revMatches.length > 0 && (
                              <div>
                                 <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-5 mb-1 bg-slate-50 py-1">Reviews</h4>
                                 {omniResults.revMatches.map(r => (
                                    <button key={r._id} onClick={() => { setActiveTab('Reviews'); setOmniSearch(''); }} className="w-full text-left px-5 py-2 hover:bg-emerald-50 transition-colors">
                                       <p className="text-sm font-bold text-slate-800">{r.name}</p>
                                       <p className="text-xs font-medium text-slate-500 truncate">{r.comment}</p>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}
                  </div>

                  <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
                     <NotificationBell />
                  </div>

                  <div className="flex items-center gap-4 pl-2">
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-earth-900 tracking-tight leading-none mb-1 uppercase">{user?.name}</p>
                        <div className="flex items-center justify-end gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                           <p className="text-[10px] text-emerald-600 font-black tracking-widest uppercase">Active</p>
                        </div>
                     </div>
                     <div className="w-12 h-12 bg-white ring-4 ring-lake-50 text-lake-600 rounded-2xl flex items-center justify-center font-black shadow-xl text-lg transform hover:rotate-6 transition-transform cursor-pointer">
                        {user?.name?.charAt(0).toUpperCase()}
                     </div>
                  </div>
               </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="p-4 md:p-10 lg:p-12 overflow-y-auto flex-grow max-w-[100rem] w-full">
               <AnimatePresence mode="wait">
                  {/* 📊 OVERVIEW TAB */}
                  {activeTab === 'Overview' && (
                     <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: easing }} key="overview" className="space-y-10">

                        {/* ── TOP STAT CARDS ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                           {[
                              {
                                 label: 'Total Reservations', value: reservations.length,
                                 sub: `${reservations.filter(r => r.status === 'confirmed').length} confirmed`,
                                 icon: <Calendar size={22} />, color: 'bg-lake-600', glow: 'shadow-lake-600/25',
                              },
                              {
                                 label: 'Guest Impressions', value: reviews.length,
                                 sub: `${(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1)).toFixed(1)} avg rating`,
                                 icon: <Star size={22} />, color: 'bg-amber-500', glow: 'shadow-amber-500/25',
                              },
                              {
                                 label: 'Menu Items', value: menu.length,
                                 sub: `${menu.filter(m => m.isFeatured).length} featured dishes`,
                                 icon: <Utensils size={22} />, color: 'bg-emerald-600', glow: 'shadow-emerald-600/25',
                              },
                           ].map((s, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, ease: easing }}
                                 className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex items-center gap-4 md:gap-6">
                                 <div className={`w-16 h-16 ${s.color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${s.glow} group-hover:scale-110 transition-transform duration-500`}>
                                    {s.icon}
                                 </div>
                                 <div className="flex-grow">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{s.label}</p>
                                    <h3 className="text-4xl font-black text-earth-900 tracking-tighter leading-none">{s.value}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{s.sub}</p>
                                 </div>
                                 <div className="absolute -bottom-6 -right-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity">
                                    {React.cloneElement(s.icon, { size: 100, strokeWidth: 1 })}
                                 </div>
                              </motion.div>
                           ))}
                        </div>

                        {/* ── MAIN GRID ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">

                           {/* LEFT: Reservation Status + Recent List */}
                           <div className="xl:col-span-2 space-y-6 md:space-y-10">

                              {/* Reservation Status Bars */}
                              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-sm">
                                 <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-earth-900 tracking-tight flex items-center gap-3">
                                       <Calendar className="text-lake-600" size={20} /> Reservation Breakdown
                                    </h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-4 py-2 rounded-xl">{reservations.length} total</span>
                                 </div>
                                 {[
                                    { label: 'Confirmed', color: 'bg-emerald-500', value: reservations.filter(r => r.status === 'confirmed').length },
                                    { label: 'Pending',   color: 'bg-amber-400',   value: reservations.filter(r => r.status === 'pending').length },
                                    { label: 'Cancelled', color: 'bg-red-400',      value: reservations.filter(r => r.status === 'cancelled').length },
                                 ].map((bar, i) => (
                                    <div key={i} className="mb-5">
                                       <div className="flex justify-between text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">
                                          <span>{bar.label}</span><span>{bar.value}</span>
                                       </div>
                                       <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                          <motion.div
                                             initial={{ width: 0 }}
                                             animate={{ width: `${reservations.length ? (bar.value / reservations.length) * 100 : 0}%` }}
                                             transition={{ duration: 1.2, delay: i * 0.15, ease: easing }}
                                             className={`h-full ${bar.color} rounded-full`}
                                          />
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              {/* Recent Reservations */}
                              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-sm">
                                 <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-earth-900 tracking-tight flex items-center gap-3">
                                       <Clock className="text-lake-600" size={20} /> Recent Reservations
                                    </h3>
                                    <button onClick={() => setActiveTab('Reservations')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-earth-900 transition-colors flex items-center gap-1.5">
                                       View All <ChevronRight size={12} />
                                    </button>
                                 </div>
                                 <div className="space-y-3">
                                    {reservations.slice(0, 5).map((res, i) => (
                                       <motion.div key={res._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                                          className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-all group cursor-pointer">
                                          <div className="flex items-center gap-5">
                                             <div className="w-10 h-10 bg-earth-50 text-earth-800 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 group-hover:bg-earth-900 group-hover:text-white transition-all">
                                                {res.name?.charAt(0)}
                                             </div>
                                             <div>
                                                <p className="font-black text-earth-900 text-sm leading-none mb-1 group-hover:translate-x-0.5 transition-transform">{res.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                   <Calendar size={9} /> {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &nbsp;•&nbsp; {res.guests} guests
                                                </p>
                                             </div>
                                          </div>
                                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : res.status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                             {res.status}
                                          </span>
                                       </motion.div>
                                    ))}
                                    {reservations.length === 0 && (
                                       <div className="py-12 text-center text-slate-300 font-black uppercase text-xs tracking-widest">No reservations yet</div>
                                    )}
                                 </div>
                              </div>
                           </div>

                           {/* RIGHT: Rating summary + Latest reviews + Featured dishes */}
                           <div className="space-y-8">

                              {/* Rating Summary */}
                              <div className="bg-earth-900 text-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden">
                                 <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-400 mb-4">Guest Rating</p>
                                    <div className="flex items-end gap-3 mb-6">
                                       <span className="text-7xl font-black tracking-tighter leading-none">
                                          {(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                                       </span>
                                       <div className="mb-2">
                                          <div className="flex gap-1 mb-1">
                                             {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={14} className={`${s <= Math.round(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1)) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                                             ))}
                                          </div>
                                          <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest">{reviews.length} reviews</p>
                                       </div>
                                    </div>
                                    {[5,4,3,2,1].map(star => {
                                       const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                       const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                       return (
                                          <div key={star} className="flex items-center gap-3 mb-2">
                                             <span className="text-[10px] font-black text-earth-400 w-4 text-right">{star}</span>
                                             <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: (5 - star) * 0.1 }}
                                                   className="h-full bg-amber-400 rounded-full" />
                                             </div>
                                             <span className="text-[10px] font-bold text-earth-500 w-6">{count}</span>
                                          </div>
                                       );
                                    })}
                                 </div>
                                 <div className="absolute -bottom-16 -right-16 opacity-[0.04]"><Star size={200} strokeWidth={1} /></div>
                              </div>

                              {/* Latest Guest Impressions */}
                              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-sm">
                                 <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-earth-900 tracking-tight flex items-center gap-3">
                                       <MessageSquare className="text-amber-500" size={18} /> Latest Reviews
                                    </h3>
                                    <button onClick={() => setActiveTab('Reviews')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-earth-900 transition-colors flex items-center gap-1">
                                       All <ChevronRight size={11} />
                                    </button>
                                 </div>
                                 <div className="space-y-5">
                                    {reviews.slice(0, 3).map((rev, i) => (
                                       <div key={rev._id || i} className="group">
                                          <div className="flex items-center justify-between mb-1">
                                             <span className="font-black text-earth-900 text-sm">{rev.name}</span>
                                             <div className="flex gap-0.5">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)}
                                             </div>
                                          </div>
                                          <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">"{rev.comment}"</p>
                                          {i < 2 && <div className="border-b border-slate-50 mt-4" />}
                                       </div>
                                    ))}
                                    {reviews.length === 0 && <p className="text-center text-slate-300 font-black text-xs uppercase tracking-widest py-6">No reviews yet</p>}
                                 </div>
                              </div>

                              {/* Featured Dishes */}
                              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-sm">
                                 <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-earth-900 tracking-tight flex items-center gap-3">
                                       <Utensils className="text-emerald-500" size={18} /> Featured Dishes
                                    </h3>
                                    <button onClick={() => setActiveTab('Menu')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-earth-900 transition-colors flex items-center gap-1">
                                       All <ChevronRight size={11} />
                                    </button>
                                 </div>
                                 <div className="space-y-4">
                                    {menu.filter(m => m.isFeatured).slice(0, 4).map((dish, i) => (
                                       <div key={dish._id || i} className="flex items-center gap-4 group hover:bg-slate-50 p-3 rounded-2xl transition-all cursor-pointer">
                                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                             <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                          </div>
                                          <div className="flex-grow min-w-0">
                                             <p className="font-black text-earth-900 text-sm leading-none truncate group-hover:translate-x-0.5 transition-transform">{dish.name}</p>
                                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{dish.category}</p>
                                          </div>
                                          <span className="text-xs font-black text-earth-900 shrink-0">{dish.price?.toLocaleString()}៛</span>
                                       </div>
                                    ))}
                                    {menu.filter(m => m.isFeatured).length === 0 && (
                                       <p className="text-center text-slate-300 font-black text-xs uppercase tracking-widest py-4">No featured dishes yet</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* 📅 RESERVATIONS TAB (Enhanced Filters + Export) */}
                  {activeTab === 'Reservations' && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="reservations" className="space-y-10">
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 md:gap-8 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100">
                           <div className="flex items-center gap-6 w-full lg:w-auto">
                              <div className="relative w-full xl:w-96">
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                 <input
                                    type="text" placeholder="Search customer, phone, or date..."
                                    value={resSearch} onChange={e => setResSearch(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300"
                                 />
                              </div>
                              <div className="relative w-full sm:w-auto">
                                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <select
                                    value={resFilter} onChange={e => setResFilter(e.target.value)}
                                    className="bg-slate-50 border-none rounded-2xl pl-12 pr-10 py-4 text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-earth-900 appearance-none cursor-pointer"
                                 >
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed Only</option>
                                    <option value="pending">Pending Only</option>
                                    <option value="cancelled">Cancelled</option>
                                 </select>
                              </div>
                           </div>
                           <button 
                              onClick={exportToCSV}
                              className="flex items-center gap-3 bg-earth-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-earth-900/20 active:scale-95 transition-all w-full lg:w-auto"
                           >
                              <Download size={14} /> Export CSV List
                           </button>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                       <th className="px-10 py-8">Ref ID</th>
                                       <th className="px-6 py-8">Guest Profile</th>
                                       <th className="px-6 py-8">Timeline</th>
                                       <th className="px-6 py-8">Party</th>
                                       <th className="px-6 py-8">Status</th>
                                       <th className="px-10 py-8 text-right">Operations</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {filteredReservations.map((res) => (
                                       <tr key={res._id} className="group hover:bg-slate-50/50 transition-all">
                                          <td className="px-10 py-8 font-black text-slate-300 text-xs">#{res._id.slice(-6).toUpperCase()}</td>
                                          <td className="px-6 py-8">
                                             <div className="flex flex-col">
                                                <span className="font-black text-earth-900 tracking-tight">{res.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5"><Phone size={10} className="text-slate-300" /> {res.phone}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-8">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-earth-50 rounded-xl flex items-center justify-center text-earth-600 shrink-0">
                                                   <Calendar size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="font-black text-earth-900 text-xs uppercase">{new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                   <span className="text-[10px] text-slate-400 font-bold tracking-widest">{res.time}</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-6 py-8">
                                             <span className="px-4 py-2 bg-slate-100 rounded-xl font-black text-xs text-slate-600">{res.guests} GUESTS</span>
                                          </td>
                                          <td className="px-6 py-8">
                                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${res.status === 'confirmed' ? 'bg-emerald-500 text-white' :
                                                   res.status === 'cancelled' ? 'bg-red-400 text-white' : 'bg-amber-400 text-white'
                                                }`}>
                                                {res.status}
                                             </span>
                                          </td>
                                          <td className="px-10 py-8 text-right">
                                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                                                <button onClick={() => updateReservation(res._id, 'confirmed')} className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle size={18} /></button>
                                                <button onClick={() => updateReservation(res._id, 'cancelled')} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><XCircle size={18} /></button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                    {filteredReservations.length === 0 && (
                                       <tr>
                                          <td colSpan="6" className="py-24 text-center">
                                             <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Search size={48} className="text-slate-200" />
                                                <p className="font-black text-earth-900 tracking-widest uppercase text-sm">No reservations matching your filter</p>
                                             </div>
                                          </td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* 🏷️ MENU TAB */}
                  {activeTab === 'Menu' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                           <div className="w-full xl:w-auto">
                              <h2 className="text-4xl font-black text-earth-900 tracking-tighter">Kitchen Identity</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Managing the culinary aesthetic of Leisure Lake</p>
                           </div>
                           
                           <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                              <div className="relative w-full sm:w-80">
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                 <input
                                    type="text" placeholder="Search dish name..."
                                    value={menuSearch} onChange={e => setMenuSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                 />
                              </div>
                              <div className="relative w-full sm:w-auto">
                                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <select
                                    value={menuCategory} onChange={e => setMenuCategory(e.target.value)}
                                    className="w-full sm:w-auto bg-white border border-slate-100 rounded-2xl pl-12 pr-10 py-4 text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-earth-900 appearance-none cursor-pointer shadow-sm"
                                 >
                                    <option value="all">All Categories</option>
                                    <option value="Khmer Food">Traditional Khmer</option>
                                    <option value="Drinks">Library of Spirits</option>
                                    <option value="Appetizers">First Impressions</option>
                                 </select>
                              </div>
                              <button
                                 onClick={() => { setEditingItem(null); setMenuForm({ name: '', khmerName: '', category: 'Khmer Food', price: '', description: '', image: '' }); setImageFile(null); setIsMenuModalOpen(true); }}
                                 className="bg-earth-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:shadow-2xl hover:shadow-earth-900/40 transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                              >
                                 <Plus size={16} strokeWidth={3} /> Launch Dish
                              </button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                           {filteredMenu.map(dish => <DishCard key={dish._id} dish={dish} onEdit={(d) => { setEditingItem(d); setMenuForm(d); setIsMenuModalOpen(true); }} onDelete={fetchData} onFeature={fetchData} />)}
                           {filteredMenu.length === 0 && (
                              <div className="col-span-full py-24 text-center">
                                 <div className="flex flex-col items-center gap-4 opacity-30">
                                    <Search size={48} className="text-slate-200" />
                                    <p className="font-black text-earth-900 tracking-widest uppercase text-sm">No dishes matching your filter in the archive</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  )}

                  {/* 🖼️ GALLERY TAB */}
                  {activeTab === 'Gallery' && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                           <div className="w-full xl:w-auto">
                              <h2 className="text-4xl font-black text-earth-900 tracking-tighter">Gallery Curation</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Digital visual experience of the lakeside estate</p>
                           </div>
                           <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                              <div className="relative w-full sm:w-80">
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                 <input
                                    type="text" placeholder="Search visual assets..."
                                    value={gallerySearch} onChange={e => setGallerySearch(e.target.value)}
                                    className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                 />
                              </div>
                              <div className="relative w-full sm:w-auto">
                                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <select
                                    value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)}
                                    className="w-full sm:w-auto bg-white border border-slate-100 rounded-2xl pl-12 pr-10 py-4 text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-earth-900 appearance-none cursor-pointer shadow-sm"
                                 >
                                    <option value="all">All Breakpoints</option>
                                    <option value="Interior">Interior Aesthetic</option>
                                    <option value="Lake View">Lakeside Vistas</option>
                                    <option value="Food">Culinary Art</option>
                                    <option value="Drinks">Liquid Narratives</option>
                                    <option value="Events">Memorable Moments</option>
                                    <option value="Sunset">Golden Hour</option>
                                    <option value="Dining Area">Dining Spaces</option>
                                 </select>
                              </div>
                              <button
                                 onClick={() => { setEditingItem(null); setGalleryForm({ title: '', category: 'Interior', description: '', image: '' }); setGalleryImageFile(null); setIsGalleryModalOpen(true); }}
                                 className="bg-earth-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:shadow-2xl hover:shadow-earth-900/40 transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                              >
                                 <Plus size={16} strokeWidth={3} /> Upload Visual
                              </button>
                           </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                           {filteredGallery.map(img => (
                              <div key={img._id} className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-700 relative flex flex-col">
                                 <div className="h-64 relative overflow-hidden">
                                    <img src={img.imageUrl.startsWith('http') ? img.imageUrl : `${IMG_BASE_URL}${img.imageUrl}`} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-5 py-2 rounded-2xl font-black text-earth-900 shadow-xl text-xs border border-slate-100">
                                       {img.category}
                                    </div>
                                 </div>
                                 <div className="p-6 md:p-10 flex flex-col flex-grow">
                                    <h4 className="text-xl md:text-2xl font-black text-earth-900 tracking-tighter mb-4">{img.title || 'Untitled Narrative'}</h4>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic line-clamp-2">"{img.description || 'No descriptive metadata provided.'}"</p>
                                     <div className="pt-8 mt-auto border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{new Date(img.createdAt).toLocaleDateString()}</span>
                                        <div className="flex gap-2">
                                           <button 
                                              onClick={() => {
                                                 setEditingItem(img);
                                                 setGalleryForm({ 
                                                    title: img.title, 
                                                    category: img.category, 
                                                    description: img.description || '', 
                                                    image: img.imageUrl 
                                                 });
                                                 setGalleryImageFile(null);
                                                 setIsGalleryModalOpen(true);
                                              }}
                                              className="w-10 h-10 flex items-center justify-center bg-slate-50 text-earth-900 hover:bg-earth-900 hover:text-white rounded-xl transition-all shadow-sm"
                                           >
                                              <Edit2 size={18} />
                                           </button>
                                           <button
                                              onClick={async () => {
                                                 if (window.confirm('Erase this visual record?')) {
                                                    await api.delete(`/gallery/${img._id}`);
                                                    fetchData();
                                                 }
                                              }}
                                              className="w-10 h-10 flex items-center justify-center bg-slate-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                           >
                                              <Trash2 size={18} />
                                           </button>
                                        </div>
                                     </div>
                                 </div>
                              </div>
                           ))}

                           {filteredGallery.length === 0 && (
                              <div className="col-span-full py-24 text-center">
                                 <div className="flex flex-col items-center gap-4 opacity-30">
                                    <Search size={48} className="text-slate-200" />
                                    <p className="font-black text-earth-900 tracking-widest uppercase text-sm">No visual assets matching your filter</p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  )}

                  {/* ⭐ REVIEWS TAB */}
                  {activeTab === 'Reviews' && (
                     <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                        <div className="flex items-center justify-between">
                           <div>
                              <h2 className="text-4xl font-black text-earth-900 tracking-tighter">Guest Impressions</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Authentic narratives from the Leisure Lake experience</p>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                       <th className="px-6 md:px-12 py-6 md:py-10">Guest Identity</th>
                                       <th className="px-4 md:px-6 py-6 md:py-10">Sensory Rating</th>
                                       <th className="px-4 md:px-6 py-6 md:py-10">Narrative Comment</th>
                                       <th className="px-6 md:px-12 py-6 md:py-10 text-right">Moderation</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {reviews.map((rev) => (
                                       <tr key={rev._id} className="group hover:bg-slate-50/50 transition-all">
                                          <td className="px-12 py-10">
                                             <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-earth-50 text-earth-900 rounded-2xl flex items-center justify-center text-xl font-black border border-earth-100 group-hover:bg-earth-900 group-hover:text-white transition-all duration-700">
                                                   {rev.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="font-black text-earth-900 tracking-tight">{rev.name}</span>
                                                   <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-6 py-10">
                                             <div className="flex gap-1 text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                   <Star key={i} size={14} className={i < rev.rating ? "fill-current" : "text-slate-100"} />
                                                ))}
                                             </div>
                                          </td>
                                          <td className="px-6 py-10">
                                             <p className="text-sm text-slate-500 font-medium italic leading-relaxed max-w-xl line-clamp-3 group-hover:line-clamp-none transition-all">"{rev.comment}"</p>
                                          </td>
                                          <td className="px-12 py-10 text-right">
                                             <div className="flex items-center justify-end gap-3">
                                                <button
                                                   onClick={async () => {
                                                      try {
                                                         await api.patch(`/reviews/${rev._id}/visibility`);
                                                         fetchData();
                                                      } catch (e) { alert('Error toggling visibility'); }
                                                   }}
                                                   className={`w-12 h-12 rounded-2xl transition-all shadow-sm flex items-center justify-center transition-all ${rev.isVisible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                                   title={rev.isVisible ? "Visible on Website" : "Hidden from Website"}
                                                >
                                                   {rev.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>
                                                <button
                                                   onClick={async () => {
                                                      if (window.confirm('Permanently redact this guest impression?')) {
                                                         await api.delete(`/reviews/${rev._id}`);
                                                         fetchData();
                                                      }
                                                   }}
                                                   className="w-12 h-12 bg-slate-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center"
                                                >
                                                   <Trash2 size={20} />
                                                </button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                    {reviews.length === 0 && (
                                       <tr>
                                          <td colSpan="4" className="py-24 text-center">
                                             <div className="flex flex-col items-center gap-4 opacity-20">
                                                <Star size={48} className="text-slate-300" />
                                                <p className="font-black text-earth-900 tracking-widest uppercase text-sm">No guest impressions archived yet</p>
                                             </div>
                                          </td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </motion.div>
                  )}


                  {/* ⚙️ SETTINGS TAB */}
                  {activeTab === 'Settings' && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="settings" className="w-full max-w-4xl mx-auto py-4 md:py-8">
                        <div className="bg-white p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden">

                           {/* Header */}
                           <div className="flex flex-col md:flex-row items-start justify-between mb-8 md:mb-14 gap-8">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                       <Lock size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Security Settings</span>
                                 </div>
                                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-earth-900 tracking-tighter">Change Password</h2>
                                 <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">Update your admin password to keep your account secure.</p>
                              </div>
                              <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right">
                                 <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full">Encrypted Session</span>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10} /> {user?.email}</span>
                              </div>
                           </div>

                           {/* Status Alert */}
                           {pwStatus && (
                              <motion.div
                                 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                 className={`mb-10 px-8 py-5 rounded-2xl flex items-center gap-4 font-bold text-sm border ${
                                    pwStatus.type === 'success'
                                       ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                       : 'bg-red-50 text-red-600 border-red-100'
                                 }`}
                              >
                                 {pwStatus.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                                 {pwStatus.msg}
                              </motion.div>
                           )}

                           {/* Form */}
                           <form onSubmit={handleChangePassword} className="space-y-8 relative z-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                 {/* Current Password */}
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Current Password</label>
                                    <input
                                       type="password"
                                       placeholder="Your current password"
                                       value={pwForm.current}
                                       onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                                       required
                                       className="admin-input !bg-slate-50 border-none rounded-3xl p-6"
                                    />
                                 </div>

                                 {/* Password Strength indicator */}
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Password Strength Indicator</label>
                                    {getStrength(pwForm.newPw) ? (
                                       <div className={`h-[72px] flex items-center px-6 md:px-8 ${getStrength(pwForm.newPw).bg} rounded-3xl ${getStrength(pwForm.newPw).color} font-black text-[10px] uppercase tracking-widest gap-3 transition-all`}>
                                          <ShieldCheck size={16} /> Strength: {getStrength(pwForm.newPw).label}
                                       </div>
                                    ) : (
                                       <div className="h-[72px] flex items-center px-6 md:px-8 bg-slate-50 rounded-3xl text-slate-300 font-black text-[10px] uppercase tracking-widest gap-3">
                                          <Lock size={16} /> Enter New Password
                                       </div>
                                    )}
                                 </div>

                                 {/* New Password */}
                                 <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">New Password</label>
                                    <input
                                       type="password"
                                       placeholder="Minimum 6 characters"
                                       value={pwForm.newPw}
                                       onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                                       required
                                       className="admin-input !bg-slate-50 border-none rounded-3xl p-6"
                                    />
                                 </div>

                                 {/* Confirm Password */}
                                 <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Confirm New Password</label>
                                    <input
                                       type="password"
                                       placeholder="Re-enter your new password"
                                       value={pwForm.confirm}
                                       onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                                       required
                                       className={`admin-input !bg-slate-50 border-none rounded-3xl p-6 transition-all ${pwForm.confirm && pwForm.confirm !== pwForm.newPw ? '!border-2 !border-red-200' : ''}`}
                                    />
                                    {pwForm.confirm && pwForm.confirm !== pwForm.newPw && (
                                       <p className="text-red-400 text-[10px] font-black uppercase tracking-widest px-2 mt-2">Passwords do not match</p>
                                    )}
                                 </div>
                              </div>

                              <div className="pt-4">
                                 <button
                                    type="submit"
                                    disabled={pwLoading}
                                    className="w-full bg-earth-900 text-white rounded-[2rem] py-7 font-black text-xs uppercase tracking-[0.6em] shadow-2xl shadow-earth-900/30 hover:shadow-earth-900/50 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                                 >
                                    {pwLoading
                                       ? <><Loader size={16} className="animate-spin" /> Updating Password...</>
                                       : 'Update Password'
                                    }
                                 </button>
                              </div>
                           </form>

                           {/* Decorative background */}
                           <div className="absolute -bottom-20 -right-20 opacity-[0.02] pointer-events-none">
                              <Lock size={380} strokeWidth={1} />
                           </div>
                        </div>
                     </motion.div>
                  )}


               </AnimatePresence>
            </div>
         </main>

         {/* Menu Modal (Kept with Visual Upgrades) */}
         {isMenuModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-md">
               <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 max-w-2xl w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden h-[90vh] overflow-y-auto"
               >
                  <button onClick={() => setIsMenuModalOpen(false)} className="absolute top-10 right-10 p-4 text-slate-300 hover:text-earth-900 hover:bg-slate-50 rounded-3xl transition-all">
                     <X size={24} strokeWidth={3} />
                  </button>
                  <h2 className="text-4xl font-black text-earth-900 mb-2 tracking-tighter">Culinary Metadata</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-12">Articulating the essence of a dish</p>
                  <form onSubmit={handleMenuSubmit} className="space-y-10 pb-10">
                     {/* Same form logic as before but with consistent .admin-input mapping */}
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Identification (EN)</label>
                           <input type="text" required value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} className="admin-input" placeholder="e.g. Traditional Frog" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Identity (KH)</label>
                           <input type="text" value={menuForm.khmerName} onChange={e => setMenuForm({ ...menuForm, khmerName: e.target.value })} className="admin-input font-serif" placeholder="កង្កែបបោក" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Valuation (Riel)</label>
                        <input type="number" required value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} className="admin-input" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Category Domain</label>
                        <select value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} className="admin-input cursor-pointer appearance-none">
                           <option value="Khmer Food">Traditional Khmer</option>
                           <option value="Drinks">Library of Spirits</option>
                           <option value="Appetizers">First Impressions</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Narrative Description</label>
                        <textarea required rows="4" value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} className="admin-input resize-none" placeholder="Explain the complex palette..." />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Visual Evidence</label>
                        <input type="file" onChange={e => setImageFile(e.target.files[0])} className="w-full text-[10px] text-slate-400 file:mr-4 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-xs file:font-black file:bg-lake-50 file:text-lake-600 hover:file:bg-lake-100 cursor-pointer p-2 bg-slate-50 rounded-3xl" />
                     </div>
                     <button type="submit" className="w-full bg-earth-900 text-white rounded-3xl py-6 font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-earth-900/30 hover:shadow-earth-900/50 transition-all flex items-center justify-center gap-4 group">
                        {editingItem ? 'Finalize Changes' : 'Launch Offering'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
         {isGalleryModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-md">
               <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 max-w-2xl w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden h-[90vh] overflow-y-auto"
               >
                  <button onClick={() => setIsGalleryModalOpen(false)} className="absolute top-10 right-10 p-4 text-slate-300 hover:text-earth-900 hover:bg-slate-50 rounded-3xl transition-all">
                     <X size={24} strokeWidth={3} />
                  </button>
                  <h2 className="text-4xl font-black text-earth-900 mb-2 tracking-tighter">Visual Asset Metadata</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-12">Archiving the aesthetic essence of Leisure Lake</p>
                  <form onSubmit={handleGallerySubmit} className="space-y-10 pb-10">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Asset Title</label>
                        <input type="text" required value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })} className="admin-input" placeholder="e.g. Sunset over the Lake" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Category Domain</label>
                        <select value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })} className="admin-input cursor-pointer appearance-none">
                           <option value="Interior">Interior Aesthetic</option>
                           <option value="Lake View">Lakeside Vistas</option>
                           <option value="Food">Culinary Art</option>
                           <option value="Drinks">Liquid Narratives</option>
                           <option value="Events">Memorable Moments</option>
                           <option value="Sunset">Golden Hour</option>
                           <option value="Dining Area">Dining Spaces</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Narrative Description</label>
                        <textarea rows="4" value={galleryForm.description} onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })} className="admin-input resize-none" placeholder="Add a story or context to this visual..." />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">Visual File</label>
                        <input type="file" onChange={e => setGalleryImageFile(e.target.files[0])} className="w-full text-[10px] text-slate-400 file:mr-4 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-xs file:font-black file:bg-lake-50 file:text-lake-600 hover:file:bg-lake-100 cursor-pointer p-2 bg-slate-50 rounded-3xl" />
                     </div>
                     <button type="submit" className="w-full bg-earth-900 text-white rounded-3xl py-6 font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-earth-900/30 hover:shadow-earth-900/50 transition-all flex items-center justify-center gap-4 group">
                        {editingItem ? 'Finalize Asset' : 'Commit to Archive'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </form>
               </motion.div>
            </div>
         )}

         {/* Global Style Injections */}

         <style dangerouslySetInnerHTML={{
            __html: `
         .admin-input {
            width: 100%;
            background: #F8F9FA;
            border: 2px solid #F1F3F5;
            border-radius: 1.5rem;
            padding: 1.25rem 1.75rem;
            font-size: 0.875rem;
            font-weight: 700;
            color: #1A1C1E;
            transition: all 0.4s ease;
            outline: none;
         }
         .admin-input:focus {
            background: white;
            border-color: #1A1C1E;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
         }
         .btn-primary {
            background: #1A1C1E;
            color: white;
            padding: 1.25rem 2.25rem;
            border-radius: 1.5rem;
            font-weight: 900;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            transition: all 0.4s ease;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
         }
         .btn-primary:hover {
            background: black;
            box-shadow: 0 25px 50px -15px rgba(0,0,0,0.25);
            transform: translateY(-2px);
         }
         .scrollbar-hide::-webkit-scrollbar { display: none; }
      ` }} />
      </div>
   );
};

const DishCard = ({ dish, onEdit, onDelete, onFeature }) => {
   const deleteItem = async () => {
      if (window.confirm('Erase this culinary record?')) {
         try {
            await api.delete(`/menu/${dish._id}`);
            onDelete();
         } catch (e) { alert('Error erasing dish'); }
      }
   };
   const featureItem = async () => {
      try {
         await api.put(`/menu/${dish._id}/feature`);
         onFeature();
      } catch (e) { alert('Error featuring dish'); }
   };

   return (
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] group hover:shadow-2xl transition-all duration-700 flex flex-col relative">
         <div className="h-64 relative overflow-hidden">
            <img src={dish.image && (dish.image.startsWith('http') ? dish.image : `${IMG_BASE_URL}${dish.image}`)} alt={dish.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
               <button onClick={() => onEdit(dish)} className="w-full bg-white text-earth-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-xl"><Edit2 size={16} /> Edit Record</button>
            </div>
            {dish.isFeatured && (
               <div className="absolute top-6 left-6 bg-amber-400 text-earth-900 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 border border-amber-300">
                  <Star size={10} className="fill-current" /> Editorial Pick
               </div>
            )}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-5 py-2 rounded-2xl font-black text-earth-900 shadow-xl text-xs border border-slate-100">
               {dish.price.toLocaleString()}៛
            </div>
         </div>
         <div className="p-6 md:p-10 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{dish.category}</span>
               <div className="flex gap-2">
                  <button onClick={featureItem} className={`p-2 rounded-xl transition-all ${dish.isFeatured ? 'bg-amber-50 text-amber-500 shadow-sm' : 'bg-slate-50 text-slate-300 hover:text-earth-900'}`}><Star size={16} className={dish.isFeatured ? 'fill-current' : ''} /></button>
                  <button onClick={deleteItem} className="p-2 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
               </div>
            </div>
            <h4 className="text-xl md:text-2xl font-black text-earth-900 tracking-tighter group-hover:translate-x-1 transition-transform duration-500 leading-none mb-2">{dish.name}</h4>
            <p className="text-earth-900/40 font-bold text-xs mb-6 font-serif italic tracking-wide">{dish.khmerName}</p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-3 italic">"{dish.description}"</p>
         </div>
      </div>
   );
};

const Tooltip = ({ hint }) => (
   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="p-2 bg-earth-900 text-white rounded-xl shadow-2xl relative">
         <AlertTriangle size={14} className="text-amber-400" />
         <div className="absolute right-full mr-3 top-0 w-48 p-4 bg-earth-900 border border-white/10 rounded-[1.5rem] text-[10px] font-medium leading-relaxed shadow-3xl pointer-events-none translate-x-2 group-hover:translate-x-0 transition-transform">
            {hint}
            <div className="absolute right-[-4px] top-4 w-2 h-2 bg-earth-900 rotate-45 border-t border-r border-white/10" />
         </div>
      </div>
   </div>
);

export default Dashboard;
