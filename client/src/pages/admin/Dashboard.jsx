import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api, { IMG_BASE_URL } from '../../api/axios';
import {
   LayoutDashboard, Utensils, Calendar, Star, LogOut, Plus, Trash2, Edit2,
   CheckCircle, XCircle, Search, Filter, Loader, Menu as MenuIcon, X, BarChart3, Clock, Users, Phone, User as UserIcon,
   ChevronRight, TrendingUp, DollarSign, ShoppingBag, Bell, Image as ImageIcon, Settings as SettingsIcon, ShieldCheck, Mail, Lock, Smartphone, Globe, Download, Eye, AlertTriangle, Sun, MessageSquare, EyeOff,
   ArrowUpNarrowWide, ArrowDownWideNarrow, Printer
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
   const [resStartDate, setResStartDate] = useState('');
   const [resEndDate, setResEndDate] = useState('');
   const [resSortOrder, setResSortOrder] = useState('desc');
   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

      const resDateObj = new Date(res.date);
      const start = resStartDate ? new Date(resStartDate) : null;
      const end = resEndDate ? new Date(resEndDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const matchesStartDate = !start || resDateObj >= start;
      const matchesEndDate = !end || resDateObj <= end;

      return matchesSearch && matchesFilter && matchesStartDate && matchesEndDate;
   }).sort((a, b) => new Date(b.date) - new Date(a.date));

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
      <div className="h-screen bg-[#FDFDFD] flex font-sans text-slate-700 selection:bg-earth-900 selection:text-white relative overflow-hidden text-sm">
         {/* Mobile Backdrop Overlay */}
         <AnimatePresence>
            {isSidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
               />
            )}
         </AnimatePresence>

         {/* Sidebar */}
         <motion.aside
            initial={false}
            animate={{
               width: isSidebarOpen ? 280 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 80),
               x: 0,
            }}
            className={`bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-[100] transition-all shadow-[10px_0_40px_-20px_rgba(0,0,0,0.03)] overflow-hidden ${isSidebarOpen ? 'fixed md:sticky translate-x-0' : 'fixed md:sticky md:translate-x-0 -translate-x-full'}`}
         >
            <div className="p-8 flex items-center gap-4 h-24 shrink-0">
               <Link to="/" className="shrink-0 group overflow-hidden">
                  <img src="/images/logo.png" className={`h-10 transition-all ${isSidebarOpen ? 'w-auto' : 'w-10'}`} alt="Logo" />
               </Link>
               {isSidebarOpen && (
                  <div className="flex flex-col whitespace-nowrap overflow-hidden">
                     <span className="font-black text-sm tracking-[0.2em] text-earth-900 uppercase">Leisure Lake</span>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Admin Portal</span>
                  </div>
               )}
            </div>

            <nav className="flex-grow px-4 mt-4 space-y-1.5 overflow-y-auto scrollbar-hide">
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
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold group whitespace-nowrap overflow-hidden ${activeTab === item.id
                           ? 'bg-earth-900 text-white shadow-lg shadow-earth-900/20'
                           : 'text-slate-400 hover:bg-slate-50 hover:text-earth-900'
                           }`}
                     >
                        <span className={`shrink-0 transition-transform ${activeTab === item.id ? 'scale-105' : 'group-hover:scale-105'}`}>{React.cloneElement(item.icon, { size: 16 })}</span>
                        {isSidebarOpen && <span className="text-[13px]">{item.label}</span>}
                     {activeTab === item.id && isSidebarOpen && (
                        <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
                     )}
                  </button>
               ))}
            </nav>

            <div className="p-6 border-t border-slate-50 space-y-4 shrink-0">
               {isSidebarOpen && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2 overflow-hidden">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 truncate">Secured Session</p>
                     <p className="text-[10px] font-bold text-slate-500 truncate">{user?.email}</p>
                  </div>
               )}
               <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm whitespace-nowrap overflow-hidden"
               >
                  <LogOut size={18} strokeWidth={2.5} />
                  {isSidebarOpen && <span>Logout</span>}
               </button>
            </div>
         </motion.aside>

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col min-w-0 h-full relative">
            {/* Glassmorphic Sticky Header */}
            <header className="h-16 md:h-20 bg-white/80 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-[80] flex items-center justify-between px-4 md:px-6 lg:px-8">
               <div className="flex items-center gap-3 md:gap-5">
                  <button
                     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                     className="p-2 md:p-2.5 bg-slate-50 hover:bg-white border border-slate-100 rounded-lg md:rounded-xl text-slate-400 hover:text-earth-900 transition-all active:scale-95 shadow-sm"
                  >
                     {isSidebarOpen && (typeof window !== 'undefined' && window.innerWidth < 768) ? <X size={16} /> : <MenuIcon size={16} />}
                  </button>
                  <div className="flex flex-col">
                     <h1 className="text-base md:text-xl font-black text-earth-900 tracking-tighter leading-none mb-0.5">{activeTab}</h1>
                     <p className="hidden sm:block text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Leisure Lake Admin</p>
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
                     <NotificationBell 
                        onViewSource={(type) => {
                           if (!type) return;
                           const t = type.toUpperCase();
                           if (t.startsWith('RESERVATION')) setActiveTab('Reservations');
                           else if (t.startsWith('REVIEW')) setActiveTab('Reviews');
                           else if (t.startsWith('MENU')) setActiveTab('Menu');
                           else if (t.startsWith('GALLERY')) setActiveTab('Gallery');
                        }}
                     />
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
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 admin-scrollbar">
               <AnimatePresence mode="wait">
                  {/* 📊 OVERVIEW TAB */}
                  {activeTab === 'Overview' && (
                     <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: easing }} key="overview" className="space-y-10">

                        {/* ── TOP STAT CARDS ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                           {[
                              {
                                 label: 'Reservations', value: reservations.length,
                                 sub: `${reservations.filter(r => r.status === 'confirmed').length} OK`,
                                 icon: <Calendar size={18} />, color: 'bg-lake-600', glow: 'shadow-lake-600/25',
                              },
                              {
                                 label: 'In Archive', value: menu.length,
                                 sub: 'Active Dishes',
                                 icon: <Utensils size={18} />, color: 'bg-earth-900', glow: 'shadow-earth-900/25',
                              },
                              {
                                 label: 'Narratives', value: reviews.length,
                                 sub: 'User Testimonials',
                                 icon: <Star size={18} />, color: 'bg-amber-500', glow: 'shadow-amber-500/25',
                              },
                              {
                                 label: 'Admins', value: 2,
                                 sub: 'Secure Session',
                                 icon: <ShieldCheck size={18} />, color: 'bg-slate-700', glow: 'shadow-slate-700/25',
                              },
                           ].map((stat, idx) => (
                              <div key={idx} className="bg-white p-4 md:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-lg transition-all">
                                 <div className={`w-10 h-10 ${stat.color} ${stat.glow} text-white rounded-lg flex items-center justify-center shrink-0`}>
                                    {stat.icon}
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                       <h3 className="text-xl font-black text-earth-900 tracking-tighter">{stat.value}</h3>
                                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</span>
                                    </div>
                                 </div>
                              </div>
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
                                    { label: 'Pending', color: 'bg-amber-400', value: reservations.filter(r => r.status === 'pending').length },
                                    { label: 'Cancelled', color: 'bg-red-400', value: reservations.filter(r => r.status === 'cancelled').length },
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
                                       <span className="text-4xl sm:text-7xl font-black tracking-tighter leading-none">
                                          {(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                                       </span>
                                       <div className="mb-2">
                                          <div className="flex gap-1 mb-1">
                                             {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} className={`${s <= Math.round(reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1)) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                                             ))}
                                          </div>
                                          <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest">{reviews.length} reviews</p>
                                       </div>
                                    </div>
                                    {[5, 4, 3, 2, 1].map(star => {
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
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)}
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
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 mb-6">
                           <div className="flex-grow lg:max-w-md">
                              <h2 className="text-lg md:text-xl font-black text-earth-900 tracking-tighter mb-0.5">Reservation Archive</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Managing lakeside booking logs and exports</p>
                           </div>

                           <div className="flex flex-wrap items-center gap-2.5">
                              <div className="relative flex-grow lg:w-56">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <input
                                    type="text" placeholder="Search logs..."
                                    value={resSearch} onChange={e => setResSearch(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-5 py-2.5 text-xs focus:ring-1 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                 />
                              </div>
                              <button
                                 onClick={() => setIsFilterModalOpen(true)}
                                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${resFilter !== 'all' || resStartDate || resEndDate
                                    ? 'bg-earth-50 border-earth-100 text-earth-900'
                                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                                    }`}
                              >
                                 <Filter size={12} />
                                 {(resFilter !== 'all' || resStartDate || resEndDate) && <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                              </button>
                              <button
                                 onClick={() => setResSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm shrink-0"
                              >
                                 {resSortOrder === 'asc' ? <ArrowUpNarrowWide size={12} /> : <ArrowDownWideNarrow size={12} />}
                              </button>
                              <button
                                 onClick={exportToCSV}
                                 className="flex items-center justify-center p-2.5 px-4 bg-earth-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:shadow-xl hover:shadow-earth-900/40 active:scale-95 transition-all shadow-lg"
                              >
                                 <Download size={14} strokeWidth={2.5} />
                              </button>
                           </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                       <th className="px-6 py-4">Guest</th>
                                       <th className="px-5 py-4">Timeline</th>
                                       <th className="px-5 py-4">Party</th>
                                       <th className="px-5 py-4">Status</th>
                                       <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {filteredReservations.map((res) => (
                                       <tr key={res._id} className="hover:bg-slate-50/50 transition-all">
                                          <td className="px-6 py-3">
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-earth-900 border border-slate-100">
                                                   {res.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                   <p className="text-[13px] font-black text-slate-800 leading-tight">{res.name}</p>
                                                   <p className="text-[10px] font-bold text-slate-400">{res.phone}</p>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-5 py-3 flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Calendar size={14} />
                                             </div>
                                             <div>
                                                <p className="text-[11px] font-bold uppercase text-slate-800 tracking-widest">{new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{res.time}</p>
                                             </div>
                                          </td>
                                          <td className="px-5 py-3">
                                             <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                                                {res.guests} Guests
                                             </span>
                                          </td>
                                          <td className="px-5 py-3">
                                             <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center justify-center gap-2 border ${res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : res.status === 'cancelled' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                <div className={`w-1 h-1 rounded-full ${res.status === 'confirmed' ? 'bg-emerald-500' : res.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                {res.status}
                                             </span>
                                          </td>
                                          <td className="px-6 py-3 flex items-center justify-end gap-2">
                                             <button onClick={() => updateReservation(res._id, 'confirmed')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle size={14} /></button>
                                             <button onClick={() => updateReservation(res._id, 'cancelled')} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><XCircle size={14} /></button>
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
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                           <div className="flex-grow lg:max-w-md">
                              <h2 className="text-lg md:text-xl font-black text-earth-900 tracking-tighter mb-0.5">Kitchen Identity</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Managing Culinary assets</p>
                           </div>

                           <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                              <div className="relative w-full lg:w-56">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <input
                                    type="text" placeholder="Search dish..."
                                    value={menuSearch} onChange={e => setMenuSearch(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-5 py-2.5 text-xs focus:ring-1 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                 />
                              </div>
                              <div className="relative w-full sm:w-auto">
                                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                                 <select
                                    value={menuCategory} onChange={e => setMenuCategory(e.target.value)}
                                    className="w-full sm:w-auto bg-slate-50 border-none rounded-xl pl-9 pr-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-1 focus:ring-earth-900 appearance-none cursor-pointer shadow-sm"
                                 >
                                    <option value="all">Categories</option>
                                    <option value="Khmer Food">Khmer Food</option>
                                    <option value="Drinks">Drinks</option>
                                    <option value="Appetizers">Appetizers</option>
                                    <option value="Desserts">Desserts</option>
                                 </select>
                              </div>
                              <div className="flex items-center gap-2 w-full lg:w-auto">
                                 <Link
                                    to="/admin/print-menu"
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 hover:text-earth-900 transition-all shadow-sm w-full sm:w-auto"
                                 >
                                    <Printer size={14} /> <span>Print</span>
                                 </Link>
                                 <button
                                    onClick={() => { setEditingItem(null); setMenuForm({ name: '', khmerName: '', category: 'Khmer Food', price: '', description: '', image: '' }); setImageFile(null); setIsMenuModalOpen(true); }}
                                    className="bg-earth-900 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-earth-900/40 transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                                 >
                                    <Plus size={14} strokeWidth={3} /> <span className="sm:inline">Add Dish</span>
                                 </button>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                           {filteredMenu.map(dish => (
                              <div key={dish._id} className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-lg transition-all duration-500 flex flex-col">
                                 <div className="h-40 relative overflow-hidden bg-slate-50">
                                    <img src={dish.image.startsWith('http') ? dish.image : `${IMG_BASE_URL}${dish.image}`} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg font-black text-earth-900 text-[8px] uppercase tracking-wider shadow-sm">
                                       {dish.price}៛
                                    </div>
                                 </div>
                                 <div className="p-4 flex flex-col flex-grow">
                                    <div className="mb-2">
                                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{dish.category}</span>
                                       <h4 className="text-base font-black text-earth-900 tracking-tight line-clamp-1">{dish.name}</h4>
                                       <p className="text-[10px] font-medium text-slate-400 leading-tight line-clamp-1 mb-2">{dish.khmerName}</p>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic line-clamp-2 mb-4">"{dish.description}"</p>
                                    <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                                       <div className="flex gap-1.5">
                                          <button onClick={() => { setEditingItem(dish); setMenuForm(dish); setIsMenuModalOpen(true); }} className="p-2 bg-slate-50 text-earth-900 hover:bg-earth-900 hover:text-white rounded-lg transition-all"><Edit2 size={12} /></button>
                                          <button onClick={async () => { if (window.confirm('Delete this dish?')) { try { await api.delete(`/menu/${dish._id}`); fetchData(); } catch (err) { alert('Error'); } } }} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={12} /></button>
                                       </div>
                                       <button onClick={() => fetchData()} className="p-2 text-amber-400 hover:bg-amber-50 rounded-lg transition-all"><Star size={12} fill={dish.featured ? "currentColor" : "none"} /></button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  )}

                  {/* 🖼️ GALLERY TAB */}
                  {activeTab === 'Gallery' && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                           <div className="flex-grow lg:max-w-md">
                              <h2 className="text-lg md:text-xl font-black text-earth-900 tracking-tighter mb-0.5">Gallery Curation</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Lakeside visual experience</p>
                           </div>

                           <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                              <div className="relative w-full lg:w-56">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                 <input
                                    type="text" placeholder="Search gallery..."
                                    value={gallerySearch} onChange={e => setGallerySearch(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-5 py-2.5 text-xs focus:ring-1 focus:ring-earth-900 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                 />
                              </div>
                              <div className="relative w-full sm:w-auto">
                                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                                 <select
                                    value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)}
                                    className="w-full sm:w-auto bg-slate-50 border-none rounded-xl pl-9 pr-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-1 focus:ring-earth-900 appearance-none cursor-pointer shadow-sm"
                                 >
                                    <option value="all">All Areas</option>
                                    <option value="Interior">Interior</option>
                                    <option value="Lake View">Lakeside</option>
                                    <option value="Food">Culinary</option>
                                    <option value="Drinks">Drinks</option>
                                 </select>
                              </div>
                              <button
                                 onClick={() => { setEditingItem(null); setGalleryForm({ title: '', category: 'Interior', description: '', image: '' }); setGalleryImageFile(null); setIsGalleryModalOpen(true); }}
                                 className="bg-earth-900 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-earth-900/40 transition-all active:scale-95 shrink-0 w-full sm:w-auto"
                              >
                                 <Plus size={14} strokeWidth={3} /> <span className="sm:inline">Add Visual</span>
                              </button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                           {filteredGallery.map(img => (
                              <div key={img._id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-700 relative flex flex-col">
                                 <div className="h-44 relative overflow-hidden">
                                    <img src={img.imageUrl.startsWith('http') ? img.imageUrl : `${IMG_BASE_URL}${img.imageUrl}`} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg font-black text-earth-900 shadow-xl text-[8px] uppercase tracking-widest border border-slate-100">
                                       {img.category}
                                    </div>
                                 </div>
                                 <div className="p-4 md:p-6 flex flex-col flex-grow">
                                    <h4 className="text-base md:text-lg font-black text-earth-900 tracking-tighter mb-2 line-clamp-1">{img.title || 'Untitled Narrative'}</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic line-clamp-2">"{img.description || 'No descriptive metadata provided.'}"</p>
                                    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                                       <span className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em]">{new Date(img.createdAt).toLocaleDateString()}</span>
                                       <div className="flex gap-1.5">
                                          <button
                                             onClick={() => { setEditingItem(img); setGalleryForm({ title: img.title, category: img.category, description: img.description || '', image: img.imageUrl }); setGalleryImageFile(null); setIsGalleryModalOpen(true); }}
                                             className="w-8 h-8 flex items-center justify-center bg-slate-50 text-earth-900 hover:bg-earth-900 hover:text-white rounded-lg transition-all shadow-sm"
                                          >
                                             <Edit2 size={14} />
                                          </button>
                                          <button
                                             onClick={async () => { if (window.confirm('Erase this visual record?')) { try { await api.delete(`/gallery/${img._id}`); fetchData(); } catch (err) { alert('Action failed'); } } }}
                                             className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                                          >
                                             <Trash2 size={14} />
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
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-100 mb-6">
                           <div className="flex-grow lg:max-w-md">
                              <h2 className="text-lg md:text-xl font-black text-earth-900 tracking-tighter mb-0.5">Guest Impressions</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Managing public visibility of testimonials</p>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{reviews.length} Total Narratives</span>
                           </div>
                        </div>

                        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                       <th className="px-6 py-4">Guest Identity</th>
                                       <th className="px-5 py-4">Rating</th>
                                       <th className="px-5 py-4">Comment</th>
                                       <th className="px-6 py-4 text-right">Moderation</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {reviews.map((rev) => (
                                       <tr key={rev._id} className="group hover:bg-slate-50/50 transition-all">
                                          <td className="px-6 py-3">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-earth-50 text-earth-900 rounded-xl flex items-center justify-center text-sm font-black border border-earth-100 group-hover:bg-earth-900 group-hover:text-white transition-all duration-700">
                                                   {rev.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[13px] font-black text-earth-900 tracking-tight">{rev.name}</span>
                                                   <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-5 py-3">
                                             <div className="flex gap-0.5 text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                   <Star key={i} size={12} className={i < rev.rating ? "fill-current" : "text-slate-100"} />
                                                ))}
                                             </div>
                                          </td>
                                          <td className="px-5 py-3">
                                             <p className="text-[11px] text-slate-500 font-medium italic leading-tight max-w-md line-clamp-1 group-hover:line-clamp-none transition-all">"{rev.comment}"</p>
                                          </td>
                                          <td className="px-6 py-3 text-right">
                                             <div className="flex items-center justify-end gap-2">
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
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="settings" className="space-y-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-100 mb-6">
                           <div className="flex-grow lg:max-w-md">
                              <h2 className="text-lg md:text-xl font-black text-earth-900 tracking-tighter mb-0.5">Security & Config</h2>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Account protection & preferences</p>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">Encrypted AES-256</span>
                           </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 relative z-10">
                              <div className="space-y-2">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                       <Lock size={16} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Security Access</span>
                                 </div>
                                 <h2 className="text-xl md:text-2xl font-black text-earth-900 tracking-tighter">Change Password</h2>
                                 <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">Update your credentials to maintain lakeside security protocols.</p>
                              </div>
                              <div className="flex flex-col items-start md:items-end gap-1.5 text-left md:text-right">
                                 <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Secure Session</span>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10} /> {user?.email}</span>
                              </div>
                           </div>

                           {/* Status Alert */}
                           {pwStatus && (
                              <motion.div
                                 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                 className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-xs border ${pwStatus.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-red-50 text-red-600 border-red-100'
                                    }`}
                              >
                                 {pwStatus.type === 'success' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                                 {pwStatus.msg}
                              </motion.div>
                           )}

                           {/* Form */}
                           <form onSubmit={handleChangePassword} className="space-y-6 relative z-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Current Password</label>
                                    <input
                                       type="password" placeholder="Current Key"
                                       value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                                       required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-earth-900 font-bold"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Strength</label>
                                    {getStrength(pwForm.newPw) ? (
                                       <div className={`h-[42px] flex items-center px-4 ${getStrength(pwForm.newPw).bg} rounded-xl ${getStrength(pwForm.newPw).color} font-black text-[9px] uppercase tracking-widest gap-2`}>
                                          <ShieldCheck size={14} /> {getStrength(pwForm.newPw).label}
                                       </div>
                                    ) : (
                                       <div className="h-[42px] flex items-center px-4 bg-slate-50 rounded-xl text-slate-300 font-black text-[9px] uppercase tracking-widest gap-2">
                                          <Lock size={14} /> Undetermined
                                       </div>
                                    )}
                                 </div>
                                 <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">New Password</label>
                                    <input
                                       type="password" placeholder="Min 6 characters"
                                       value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw: e.target.value })}
                                       required className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-earth-900 font-bold"
                                    />
                                 </div>
                                 <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Verification</label>
                                    <input
                                       type="password" placeholder="Match new password"
                                       value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                                       required className={`w-full bg-slate-50 border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-earth-900 font-bold transition-all ${pwForm.confirm && pwForm.confirm !== pwForm.newPw ? 'ring-1 ring-red-200' : ''}`}
                                    />
                                 </div>
                              </div>
                              <div className="pt-2">
                                 <button
                                    type="submit" disabled={pwLoading}
                                    className="w-full bg-earth-900 text-white rounded-xl py-3.5 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-earth-900/20 hover:shadow-earth-900/30 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                 >
                                    {pwLoading ? <><Loader size={14} className="animate-spin" /> Syncing...</> : 'Confirm Account Update'}
                                 </button>
                              </div>
                           </form>

                           {/* Decorative background */}
                           <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none">
                              <Lock size={200} strokeWidth={1} />
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               <AnimatePresence>
                  {isFilterModalOpen && (
                     <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300]" />
                        <motion.div
                           initial={{ scale: 0.95, opacity: 0, y: -20 }}
                           animate={{ scale: 1, opacity: 1, y: 0 }}
                           exit={{ scale: 0.95, opacity: 0, y: -20 }}
                           transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                           className="fixed left-1/2 top-10 md:top-24 -translate-x-1/2 w-[90%] max-w-sm bg-white z-[301] shadow-2xl p-6 md:p-8 rounded-[2.5rem] overflow-hidden"
                        >
                           <div className="flex items-center justify-between mb-8">
                              <div>
                                 <h2 className="text-xl font-black text-earth-900 tracking-tighter">FILTER</h2>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Refine bookings List</p>
                              </div>
                              <button onClick={() => setIsFilterModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-earth-900 transition-all active:scale-90"><X size={20} /></button>
                           </div>

                           <div className="space-y-8">
                              {/* Status Selection */}
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-1">Reservation Status</label>
                                 <div className="grid grid-cols-2 gap-2">
                                    {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                                       <button
                                          key={status} onClick={() => setResFilter(status)}
                                          className={`py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest border-2 transition-all ${resFilter === status ? 'bg-earth-900 text-white border-earth-900 shadow-xl shadow-earth-900/10' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-100'}`}
                                       >
                                          {status}
                                       </button>
                                    ))}
                                 </div>
                              </div>

                              {/* Date Range */}
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-1">Timeline Range</label>
                                 <div className="grid grid-cols-1 gap-3">
                                    <div className="relative group">
                                       <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-earth-900 transition-colors" size={14} />
                                       <input
                                          type="date" value={resStartDate} onChange={e => setResStartDate(e.target.value)}
                                          className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-earth-900 cursor-pointer"
                                       />
                                       <div className="absolute -top-2 left-4 px-2 bg-white text-[7px] font-black text-slate-300 uppercase tracking-widest">From</div>
                                    </div>
                                    <div className="relative group">
                                       <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-earth-900 transition-colors" size={14} />
                                       <input
                                          type="date" value={resEndDate} onChange={e => setResEndDate(e.target.value)}
                                          className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-earth-900 cursor-pointer"
                                       />
                                       <div className="absolute -top-2 left-4 px-2 bg-white text-[7px] font-black text-slate-300 uppercase tracking-widest">To</div>
                                    </div>
                                 </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-2">
                                 <button
                                    onClick={() => { setResFilter('all'); setResStartDate(''); setResEndDate(''); }}
                                    className="flex-1 py-4 bg-slate-50 text-slate-400 hover:text-earth-900 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                                 >
                                    Reset
                                 </button>
                                 <button
                                    onClick={() => setIsFilterModalOpen(false)}
                                    className="flex-[2] py-4 bg-earth-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-earth-900/20 active:scale-95 transition-all text-center"
                                 >
                                    Show {filteredReservations.length} Results
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     </>
                  )}
               </AnimatePresence>

            </div>
         </main>

         {/* ═══════════════════════════════════════════
              MENU MODAL — Redesigned Slide-In Drawer
         ═══════════════════════════════════════════ */}
         <AnimatePresence>
            {isMenuModalOpen && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex"
                  onClick={e => { if (e.target === e.currentTarget) setIsMenuModalOpen(false); }}
                  style={{ background: 'rgba(15,15,20,0.65)', backdropFilter: 'blur(8px)' }}
               >
                  <motion.aside
                     initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 32, stiffness: 300 }}
                     className="modal-drawer ml-auto"
                  >
                     {/* Header */}
                     <div className="modal-drawer-header">
                        <div>
                           <div className="modal-badge"><Utensils size={12} /> Menu Item</div>
                           <h2 className="modal-title">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h2>
                           <p className="modal-subtitle">Fill in the details below to {editingItem ? 'update this' : 'add a new'} menu item</p>
                        </div>
                        <button onClick={() => setIsMenuModalOpen(false)} className="modal-close-btn" aria-label="Close">
                           <X size={20} strokeWidth={2.5} />
                        </button>
                     </div>

                     {/* Form Body — Scrollable */}
                     <div className="modal-drawer-body">
                        <form id="menu-form" onSubmit={handleMenuSubmit} className="space-y-5">

                           {/* Image Preview & Upload */}
                           <div className="modal-image-zone">
                              {(imageFile || menuForm.image) ? (
                                 <img
                                    src={imageFile ? URL.createObjectURL(imageFile) : (menuForm.image?.startsWith('http') ? menuForm.image : `${IMG_BASE_URL}${menuForm.image}`)}
                                    alt="Preview"
                                    className="modal-image-preview"
                                 />
                              ) : (
                                 <div className="modal-image-placeholder">
                                    <ImageIcon size={32} className="text-slate-300 mb-2" />
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">No image selected</span>
                                 </div>
                              )}
                              <label htmlFor="menu-img-upload" className="modal-image-upload-btn">
                                 <ImageIcon size={14} />
                                 {imageFile ? 'Change Image' : (menuForm.image ? 'Replace Image' : 'Upload Image')}
                              </label>
                              <input id="menu-img-upload" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
                           </div>

                           {/* Dish Name (EN) */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="menu-name">Dish Name <span className="text-red-400">*</span></label>
                              <input
                                 id="menu-name" type="text" required
                                 value={menuForm.name}
                                 onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                                 className="admin-input"
                                 placeholder="e.g. Traditional Grilled Frog"
                              />
                           </div>

                           {/* Khmer Name */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="menu-kh">Khmer Name</label>
                              <input
                                 id="menu-kh" type="text"
                                 value={menuForm.khmerName}
                                 onChange={e => setMenuForm({ ...menuForm, khmerName: e.target.value })}
                                 className="admin-input font-serif"
                                 placeholder="កង្កែបបោក"
                              />
                           </div>

                           {/* Price + Category — side by side on wider screens */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="modal-field">
                                 <label className="modal-label" htmlFor="menu-price">Price (Riel) <span className="text-red-400">*</span></label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">៛</span>
                                    <input
                                       id="menu-price" type="number" required min="0"
                                       value={menuForm.price}
                                       onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                                       className="admin-input pl-9"
                                       placeholder="0"
                                    />
                                 </div>
                              </div>
                              <div className="modal-field">
                                 <label className="modal-label" htmlFor="menu-cat">Category <span className="text-red-400">*</span></label>
                                 <div className="relative">
                                    <select
                                       id="menu-cat"
                                       value={menuForm.category}
                                       onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}
                                       className="admin-input cursor-pointer appearance-none pr-10"
                                    >
                                       <option value="Khmer Food">🍛 Khmer Food</option>
                                       <option value="Drinks">🥤 Drinks</option>
                                       <option value="Appetizers">🥗 Appetizers</option>
                                       <option value="Desserts">🍮 Desserts</option>
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                                 </div>
                              </div>
                           </div>

                           {/* Description */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="menu-desc">Description <span className="text-red-400">*</span></label>
                              <textarea
                                 id="menu-desc" required rows={4}
                                 value={menuForm.description}
                                 onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
                                 className="admin-input resize-none"
                                 placeholder="Describe the dish — flavours, ingredients, what makes it special..."
                              />
                              <span className="text-[10px] text-slate-300 font-bold ml-1">{menuForm.description.length} chars</span>
                           </div>
                        </form>
                     </div>

                     {/* Footer Actions */}
                     <div className="modal-drawer-footer">
                        <button type="button" onClick={() => setIsMenuModalOpen(false)} className="modal-btn-cancel">Cancel</button>
                        <button form="menu-form" type="submit" className="modal-btn-submit">
                           {editingItem ? <><Edit2 size={15} /> Save Changes</> : <><Plus size={15} /> Add Dish</>}
                        </button>
                     </div>
                  </motion.aside>
               </motion.div>
            )}
         </AnimatePresence>

         {/* ═══════════════════════════════════════════════
              GALLERY MODAL — Redesigned Slide-In Drawer
         ═══════════════════════════════════════════════ */}
         <AnimatePresence>
            {isGalleryModalOpen && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex"
                  onClick={e => { if (e.target === e.currentTarget) setIsGalleryModalOpen(false); }}
                  style={{ background: 'rgba(15,15,20,0.65)', backdropFilter: 'blur(8px)' }}
               >
                  <motion.aside
                     initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 32, stiffness: 300 }}
                     className="modal-drawer ml-auto"
                  >
                     {/* Header */}
                     <div className="modal-drawer-header">
                        <div>
                           <div className="modal-badge"><ImageIcon size={12} /> Gallery Asset</div>
                           <h2 className="modal-title">{editingItem ? 'Edit Asset' : 'Upload Visual'}</h2>
                           <p className="modal-subtitle">{editingItem ? "Update this gallery image\u2019s metadata" : 'Add a new visual to the Leisure Lake gallery'}</p>
                        </div>
                        <button onClick={() => setIsGalleryModalOpen(false)} className="modal-close-btn" aria-label="Close">
                           <X size={20} strokeWidth={2.5} />
                        </button>
                     </div>

                     {/* Form Body */}
                     <div className="modal-drawer-body">
                        <form id="gallery-form" onSubmit={handleGallerySubmit} className="space-y-5">

                           {/* Image Preview & Upload */}
                           <div className="modal-image-zone">
                              {(galleryImageFile || galleryForm.image) ? (
                                 <img
                                    src={galleryImageFile ? URL.createObjectURL(galleryImageFile) : (galleryForm.image?.startsWith('http') ? galleryForm.image : `${IMG_BASE_URL}${galleryForm.image}`)}
                                    alt="Preview"
                                    className="modal-image-preview"
                                 />
                              ) : (
                                 <div className="modal-image-placeholder">
                                    <ImageIcon size={32} className="text-slate-300 mb-2" />
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">No image selected</span>
                                 </div>
                              )}
                              <label htmlFor="gallery-img-upload" className="modal-image-upload-btn">
                                 <ImageIcon size={14} />
                                 {galleryImageFile ? 'Change Image' : (galleryForm.image ? 'Replace Image' : 'Upload Image')}
                              </label>
                              <input id="gallery-img-upload" type="file" accept="image/*" onChange={e => setGalleryImageFile(e.target.files[0])} className="hidden" />
                           </div>

                           {/* Title */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="gallery-title">Asset Title <span className="text-red-400">*</span></label>
                              <input
                                 id="gallery-title" type="text" required
                                 value={galleryForm.title}
                                 onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                 className="admin-input"
                                 placeholder="e.g. Sunset over the Lake"
                              />
                           </div>

                           {/* Category */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="gallery-cat">Category <span className="text-red-400">*</span></label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                                 {[
                                    { value: 'Interior', label: 'Interior', emoji: '🏠' },
                                    { value: 'Lake View', label: 'Lake View', emoji: '🌊' },
                                    { value: 'Food', label: 'Food', emoji: '🍽️' },
                                    { value: 'Drinks', label: 'Drinks', emoji: '🥤' },
                                    { value: 'Events', label: 'Events', emoji: '🎉' },
                                    { value: 'Sunset', label: 'Sunset', emoji: '🌅' },
                                    { value: 'Dining Area', label: 'Dining', emoji: '🪑' },
                                 ].map(opt => (
                                    <button
                                       key={opt.value} type="button"
                                       onClick={() => setGalleryForm({ ...galleryForm, category: opt.value })}
                                       className={`modal-cat-pill ${galleryForm.category === opt.value ? 'modal-cat-pill--active' : ''}`}
                                    >
                                       <span>{opt.emoji}</span> {opt.label}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           {/* Description */}
                           <div className="modal-field">
                              <label className="modal-label" htmlFor="gallery-desc">Description</label>
                              <textarea
                                 id="gallery-desc" rows={4}
                                 value={galleryForm.description}
                                 onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                 className="admin-input resize-none"
                                 placeholder="Add context or a story behind this visual..."
                              />
                              <span className="text-[10px] text-slate-300 font-bold ml-1">{galleryForm.description.length} chars</span>
                           </div>
                        </form>
                     </div>

                     {/* Footer Actions */}
                     <div className="modal-drawer-footer">
                        <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="modal-btn-cancel">Cancel</button>
                        <button form="gallery-form" type="submit" className="modal-btn-submit">
                           {editingItem ? <><Edit2 size={15} /> Save Changes</> : <><Plus size={15} /> Upload Asset</>}
                        </button>
                     </div>
                  </motion.aside>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Global Style Injections */}

         <style dangerouslySetInnerHTML={{
            __html: `
         /* ─── Base Input ─── */
         .admin-input {
            width: 100%;
            background: #F8F9FA;
            border: 2px solid transparent;
            border-radius: 1rem;
            padding: 0.9rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: #1A1C1E;
            transition: all 0.25s ease;
            outline: none;
         }
         .admin-input::placeholder { color: #CBD0D8; font-weight: 500; }
         .admin-input:focus {
            background: white;
            border-color: #1A1C1E;
            box-shadow: 0 0 0 4px rgba(26,28,30,0.06), 0 8px 24px -8px rgba(0,0,0,0.08);
         }
         .admin-input:hover:not(:focus) { border-color: #E2E5EA; background: #F3F4F6; }

         /* ─── Drawer ─── */
         .modal-drawer {
            width: 100%;
            max-width: 520px;
            height: 100dvh;
            background: #fff;
            display: flex;
            flex-direction: column;
            box-shadow: -24px 0 80px -12px rgba(0,0,0,0.3);
            overflow: hidden;
         }
         @media (max-width: 540px) {
            .modal-drawer { max-width: 100%; border-radius: 0; }
         }

         .modal-drawer-header {
            flex-shrink: 0;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            padding: 1.75rem 1.75rem 1.25rem;
            border-bottom: 1px solid #F1F3F5;
            background: #FAFAFA;
         }
         .modal-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #EFF6FF;
            color: #3B82F6;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            padding: 4px 10px;
            border-radius: 999px;
            margin-bottom: 8px;
         }
         .modal-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: #1A1C1E;
            letter-spacing: -0.03em;
            line-height: 1.15;
            margin-bottom: 4px;
         }
         .modal-subtitle {
            font-size: 0.75rem;
            color: #94A3B8;
            font-weight: 500;
         }
         .modal-close-btn {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #F1F3F5;
            color: #64748B;
            transition: all 0.2s;
         }
         .modal-close-btn:hover { background: #1A1C1E; color: white; }

         .modal-drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem 1.75rem;
            scrollbar-width: thin;
            scrollbar-color: #E2E8F0 transparent;
         }
         .modal-drawer-body::-webkit-scrollbar { width: 4px; }
         .modal-drawer-body::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }

         .modal-drawer-footer {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1.25rem 1.75rem;
            border-top: 1px solid #F1F3F5;
            background: #FAFAFA;
         }

         /* ─── Image Zone ─── */
         .modal-image-zone {
            position: relative;
            background: #F8F9FA;
            border: 2px dashed #E2E5EA;
            border-radius: 1.25rem;
            overflow: hidden;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: border-color 0.2s;
            margin-bottom: 0;
         }
         .modal-image-zone:hover { border-color: #94A3B8; }
         .modal-image-preview {
            width: 100%;
            height: 220px;
            object-fit: cover;
            display: block;
         }
         .modal-image-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
         }
         .modal-image-upload-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(26,28,30,0.85);
            backdrop-filter: blur(8px);
            color: white;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 8px 14px;
            border-radius: 999px;
            cursor: pointer;
            transition: background 0.2s;
         }
         .modal-image-upload-btn:hover { background: #1A1C1E; }

         /* ─── Form Field ─── */
         .modal-field { display: flex; flex-direction: column; gap: 6px; }
         .modal-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #64748B;
            padding-left: 2px;
         }

         /* ─── Category Pills ─── */
         .modal-cat-pill {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 0.75rem;
            border: 2px solid #F1F3F5;
            background: #F8F9FA;
            font-size: 12px;
            font-weight: 700;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
         }
         .modal-cat-pill:hover { border-color: #CBD5E1; background: white; color: #1A1C1E; }
         .modal-cat-pill--active {
            border-color: #1A1C1E !important;
            background: #1A1C1E !important;
            color: white !important;
            box-shadow: 0 4px 14px -4px rgba(26,28,30,0.35);
         }

         /* ─── Footer Buttons ─── */
         .modal-btn-cancel {
            flex: 1;
            padding: 0.85rem 1rem;
            border-radius: 0.875rem;
            border: 2px solid #F1F3F5;
            background: white;
            font-size: 13px;
            font-weight: 800;
            color: #64748B;
            transition: all 0.2s;
         }
         .modal-btn-cancel:hover { border-color: #CBD5E1; color: #1A1C1E; background: #F8F9FA; }
         .modal-btn-submit {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 0.85rem 1.5rem;
            border-radius: 0.875rem;
            background: #1A1C1E;
            color: white;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            transition: all 0.2s;
            box-shadow: 0 8px 24px -8px rgba(26,28,30,0.4);
         }
         .modal-btn-submit:hover { background: #000; box-shadow: 0 12px 30px -8px rgba(0,0,0,0.5); transform: translateY(-1px); }
         .modal-btn-submit:active { transform: scale(0.98); }

         /* ─── Misc ─── */
         .btn-primary {
            background: #1A1C1E; color: white;
            padding: 1.25rem 2.25rem; border-radius: 1.5rem;
            font-weight: 900; font-size: 0.7rem; text-transform: uppercase;
            letter-spacing: 0.2em; transition: all 0.4s ease;
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
         }
         .btn-primary:hover { background: black; box-shadow: 0 25px 50px -15px rgba(0,0,0,0.25); transform: translateY(-2px); }
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
                  <button onClick={featureItem} title={dish.isFeatured ? 'Remove from featured' : 'Mark as featured'} className={`p-2 rounded-xl transition-all ${dish.isFeatured ? 'bg-amber-50 text-amber-500 shadow-sm' : 'bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}><Star size={16} className={dish.isFeatured ? 'fill-current' : ''} /></button>
                  <button onClick={() => onEdit(dish)} title="Edit dish" className="p-2 bg-slate-50 text-slate-400 hover:bg-earth-900 hover:text-white rounded-xl transition-all shadow-sm"><Edit2 size={16} /></button>
                  <button onClick={deleteItem} title="Delete dish" className="p-2 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
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
