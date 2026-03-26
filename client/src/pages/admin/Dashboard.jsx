import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  LayoutDashboard, Utensils, Calendar, Star, LogOut, Plus, Trash2, Edit2, 
  CheckCircle, XCircle, Search, Filter, Loader, Menu as MenuIcon, X, BarChart3, Clock, Users, Phone, User as UserIcon,
  ChevronRight, TrendingUp, DollarSign, ShoppingBag, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [menu, setMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', category: 'Khmer Food', price: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin/login');
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, resRes, revRes] = await Promise.all([
        api.get('/menu'),
        api.get('/reservations'),
        api.get('/reviews')
      ]);
      setMenu(menuRes.data);
      setReservations(resRes.data);
      setReviews(revRes.data);
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
    formData.append('category', menuForm.category);
    formData.append('price', menuForm.price);
    formData.append('description', menuForm.description);
    if (imageFile) {
       formData.append('image', imageFile);
    } else {
       formData.append('image', menuForm.image);
    }

    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsMenuModalOpen(false);
      setEditingItem(null);
      setMenuForm({ name: '', category: 'Khmer Food', price: '', description: '', image: '' });
      setImageFile(null);
      fetchData();
    } catch (err) {
      alert('Error updating menu');
    }
  };

  const deleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await api.delete(`/menu/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting menu item');
      }
    }
  };

  const updateReservation = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating reservation');
    }
  };

  const stats = [
    { label: 'Total Sales', value: '$12,450', icon: <DollarSign className="w-5 h-5" />, color: 'bg-emerald-500', trend: '+12.5%' },
    { label: 'Reservations', value: reservations.length, icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500', trend: '+5.2%' },
    { label: 'Active Menu', value: menu.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-amber-500', trend: '+2 dishes' },
    { label: 'Rating', value: (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1), icon: <Star className="w-5 h-5" />, color: 'bg-purple-500', trend: 'Excellent' },
  ];

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-700">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen transition-all shadow-sm z-40"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-earth-900 rounded-xl flex items-center justify-center text-white shrink-0">
            <LayoutDashboard size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-earth-900">ADMIN</span>}
        </div>

        <nav className="flex-grow px-4 mt-8 space-y-2">
          {[
            { id: 'Overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
            { id: 'Menu', icon: <Utensils size={20} />, label: 'Menu Management' },
            { id: 'Reservations', icon: <Calendar size={20} />, label: 'Reservations' },
            { id: 'Reviews', icon: <Star size={20} />, label: 'Reviews' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all font-semibold ${
                activeTab === item.id 
                  ? 'bg-earth-900 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-earth-900'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-all"
           >
              <LogOut size={20} />
              {isSidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
         {/* Header */}
         <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
              >
                <MenuIcon size={20} />
              </button>
              <h1 className="text-xl font-bold text-earth-900">{activeTab}</h1>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="bg-slate-50 border-none rounded-xl px-10 py-2.5 text-sm w-64 focus:ring-2 focus:ring-earth-900 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               </div>
               <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-earth-900 uppercase tracking-tight">{user?.username}</p>
                     <p className="text-xs text-slate-400 font-medium">Head Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-lake-100 text-lake-600 border-2 border-white rounded-full flex items-center justify-center font-bold shadow-sm">
                     {user?.username?.charAt(0).toUpperCase()}
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-8">
            <AnimatePresence mode="wait">
               {activeTab === 'Overview' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="overview" className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {stats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="space-y-1">
                               <p className="text-sm text-slate-400 font-semibold">{stat.label}</p>
                               <h3 className="text-2xl font-black text-earth-900">{stat.value}</h3>
                               <p className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.trend}</p>
                            </div>
                            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                               {stat.icon}
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="text-emerald-500" />
                                Recent Reservations
                             </h3>
                             <button onClick={() => setActiveTab('Reservations')} className="text-xs font-bold text-lake-600 hover:underline px-4 py-2 bg-lake-50 rounded-full">View All</button>
                          </div>
                          <div className="overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="border-b border-slate-50">
                                   <tr className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                      <th className="pb-4">Customer</th>
                                      <th className="pb-4">Date & Time</th>
                                      <th className="pb-4">Guests</th>
                                      <th className="pb-4">Status</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                   {reservations.slice(0, 5).map((res) => (
                                     <tr key={res._id} className="text-sm group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 font-bold text-earth-900">{res.name}</td>
                                        <td className="py-5 text-slate-500 font-medium">
                                           {new Date(res.date).toLocaleDateString()} at {res.time}
                                        </td>
                                        <td className="py-5">
                                           <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-xs">{res.guests} PPL</span>
                                        </td>
                                        <td className="py-5">
                                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                             res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                             res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                           }`}>
                                              {res.status}
                                           </span>
                                        </td>
                                     </tr>
                                   ))}
                                   {reservations.length === 0 && <tr><td colSpan="4" className="py-10 text-center text-slate-400 italic">No recent reservations</td></tr>}
                                </tbody>
                             </table>
                          </div>
                       </div>

                       <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                             <Bell className="text-amber-500" />
                             Notifications
                          </h3>
                          <div className="space-y-6 flex-grow">
                             {reviews.slice(0, 3).map((rev, i) => (
                               <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                                     <Star size={18} />
                                  </div>
                                  <div>
                                     <p className="text-xs font-black text-earth-900 uppercase">{rev.name} left a review</p>
                                     <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">"{rev.comment}"</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="mt-8 p-6 bg-earth-900 rounded-[2rem] text-white">
                             <p className="text-xs uppercase font-black text-earth-400 tracking-widest mb-2">Staff Note</p>
                             <p className="text-sm font-medium leading-relaxed italic">"Don't forget to check the sunset reservations for tonight's big event at 6 PM!"</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'Menu' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="menu" className="space-y-8">
                    <div className="flex items-center justify-between">
                       <div>
                          <h2 className="text-3xl font-black text-earth-900 tracking-tight">Active Menu</h2>
                          <p className="text-slate-500 font-medium">Customize your lakeside offerings</p>
                       </div>
                       <button 
                         onClick={() => { setEditingItem(null); setMenuForm({ name: '', category: 'Khmer Food', price: '', description: '', image: '' }); setImageFile(null); setIsMenuModalOpen(true); }}
                         className="btn-primary flex items-center gap-2"
                       >
                          <Plus size={20} /> Add New Dish
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {menu.map((dish) => (
                         <div key={dish._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col">
                            <div className="h-52 relative overflow-hidden">
                               <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                               <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full font-black text-earth-900 shadow-sm text-sm">
                                  {dish.price.toLocaleString()}៛
                               </div>
                               <button 
                                 onClick={() => { setEditingItem(dish); setMenuForm(dish); setIsMenuModalOpen(true); }}
                                 className="absolute bottom-4 right-4 p-3 bg-earth-900 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-earth-800 shadow-xl transform translate-y-4 group-hover:translate-y-0"
                               >
                                  <Edit2 size={18} />
                               </button>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                               <div className="flex justify-between items-start mb-2 text-xs uppercase font-black text-slate-400 tracking-widest">
                                  <span>{dish.category}</span>
                               </div>
                               <h4 className="text-xl font-black text-earth-900 mb-3">{dish.name}</h4>
                               <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{dish.description}</p>
                               <div className="flex items-center pt-6 border-t border-slate-50">
                                  <button 
                                    onClick={() => deleteMenuItem(dish._id)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-tight"
                                  >
                                     <Trash2 size={16} /> Delete Entry
                                  </button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'Reservations' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="reservations" className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-3xl font-black text-earth-900 tracking-tight mb-8">Reservations Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="border-b border-slate-100">
                            <tr className="text-xs font-black text-slate-400 uppercase tracking-widest">
                               <th className="pb-4">Guest</th>
                               <th className="pb-4">Contact</th>
                               <th className="pb-4">Schedule</th>
                               <th className="pb-4">PPL</th>
                               <th className="pb-4">Status</th>
                               <th className="pb-4">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {reservations.map((res) => (
                              <tr key={res._id} className="group hover:bg-slate-50 transition-all">
                                 <td className="py-6 font-black text-earth-900">{res.name}</td>
                                 <td className="py-6">
                                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Phone size={12} /> {res.phone}</p>
                                 </td>
                                 <td className="py-6 text-sm font-semibold">
                                    <p className="text-earth-900">{new Date(res.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {res.time}</p>
                                 </td>
                                 <td className="py-6">
                                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs">{res.guests}</span>
                                 </td>
                                 <td className="py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                      res.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                      {res.status}
                                    </span>
                                 </td>
                                 <td className="py-6">
                                    <div className="flex gap-2">
                                       <button onClick={() => updateReservation(res._id, 'confirmed')} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all" title="Confirm">
                                          <CheckCircle size={20} />
                                       </button>
                                       <button onClick={() => updateReservation(res._id, 'cancelled')} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all" title="Cancel">
                                          <XCircle size={20} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden"
          >
             <button onClick={() => setIsMenuModalOpen(false)} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-earth-900 hover:bg-slate-50 rounded-2xl transition-all">
                <X size={24} />
             </button>

             <h2 className="text-3xl font-black text-earth-900 mb-2">{editingItem ? 'Refine Dish' : 'New Creation'}</h2>
             <p className="text-slate-500 font-medium mb-10">Define the flavors of Leisure Lake</p>

             <form onSubmit={handleMenuSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Dish Name</label>
                      <input 
                        type="text" required placeholder="e.g. Amok Fish" 
                        value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                        className="input-field"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Price (Riel)</label>
                      <input 
                        type="number" required placeholder="25000" 
                        value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                        className="input-field"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Category</label>
                   <select 
                     value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})}
                     className="input-field cursor-pointer"
                   >
                      <option value="Khmer Food">Khmer Food</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Appetizers">Appetizers</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Description</label>
                   <textarea 
                     required placeholder="Fresh fish steamed in banana leaf..." rows="3"
                     value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                     className="input-field resize-none"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Dish Image (JPG/PNG)</label>
                   <div className="relative">
                      <input 
                        type="file" accept="image/jpeg,image/jpg,image/png"
                        onChange={e => setImageFile(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:bg-lake-50 file:text-lake-600 hover:file:bg-lake-100 cursor-pointer p-1 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
                      />
                   </div>
                   <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest px-1 mt-2">Maximum file size: 5MB</p>
                </div>

                <button type="submit" className="w-full btn-primary !rounded-2xl py-5 mt-4 group">
                   {editingItem ? 'Publish Changes' : 'Launch Dish'}
                   <ChevronRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
