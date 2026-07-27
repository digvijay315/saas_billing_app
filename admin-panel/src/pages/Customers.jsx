import { useState, useEffect } from 'react';
import { Bell, Eye, Search, Plus, Trash2, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import Swal from 'sweetalert2';

export default function Customers() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch hotels from backend
  const fetchHotels = async () => {
    try {
      const response = await api.get('/superadmin/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      Swal.fire('Error', 'Failed to load hotels data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleNotify = (hotelName) => {
    Swal.fire('Notification Sent', `Notification sent to ${hotelName} regarding their subscription.`, 'success');
  };

  const handleView = (hotel) => {
    Swal.fire({
      title: `<div style="font-size: 1.25rem; font-weight: bold; color: #1e293b;">Hotel Details</div>`,
      html: `
        <div style="text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
            <div style="width: 64px; height: 64px; border-radius: 12px; overflow: hidden; background: #e0e7ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${hotel.logo ? `<img src="${hotel.logo}" alt="logo" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="font-size: 24px; font-weight: bold; color: #4338ca;">${hotel.name.charAt(0)}</span>`}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">${hotel.name}</h3>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">${hotel.email}</p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Contact</p>
              <p style="margin: 0; color: #334155; font-weight: 600;">${hotel.contact}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Status</p>
              <p style="margin: 0; color: ${hotel.isActive ? '#10b981' : '#ef4444'}; font-weight: 600;">${hotel.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; grid-column: span 2;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Address</p>
              <p style="margin: 0; color: #334155; font-weight: 600;">${hotel.address || 'N/A'}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">GST Number</p>
              <p style="margin: 0; color: #334155; font-weight: 600;">${hotel.gstNo || 'N/A'}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">CIN Number</p>
              <p style="margin: 0; color: #334155; font-weight: 600;">${hotel.cinNo || 'N/A'}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Subscription Plan</p>
              <p style="margin: 0; color: #334155; font-weight: 600; text-transform: capitalize;">${hotel.subscriptionPlan || 'Free'}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Sub Status</p>
              <p style="margin: 0; color: ${hotel.subscriptionStatus === 'active' ? '#10b981' : '#ef4444'}; font-weight: 600; text-transform: capitalize;">${hotel.subscriptionStatus}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; grid-column: span 2;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Joined Date</p>
              <p style="margin: 0; color: #334155; font-weight: 600;">${new Date(hotel.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      width: '600px'
    });
  };



  const handleToggleSubscription = async (hotel) => {
    const action = hotel.subscriptionStatus === 'active' ? 'Deactivate' : 'Activate';
    const result = await Swal.fire({
      title: `Manually ${action} Subscription?`,
      text: `Change subscription status for ${hotel.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action}!`
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/superadmin/hotels/${hotel._id}/subscription`);
        Swal.fire('Updated!', 'Subscription status changed successfully.', 'success');
        fetchHotels();
      } catch (error) {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    }
  };

  const handleDelete = async (hotel) => {
    const result = await Swal.fire({
      title: 'Are you absolutely sure?',
      text: "This action cannot be undone. This will permanently delete the hotel and all associated data.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/superadmin/hotels/${hotel._id}`);
        Swal.fire('Deleted!', 'The hotel has been deleted.', 'success');
        fetchHotels();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete hotel', 'error');
      }
    }
  };

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    hotel.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-8">


      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search hotels by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">Loading hotels...</td>
                </tr>
              ) : filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">No hotels found.</td>
                </tr>
              ) : (
                filteredHotels.map((hotel, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={hotel._id} 
                    onClick={() => handleView(hotel)}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${!hotel.isActive ? 'bg-red-50/20' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
                          {hotel.logo ? (
                            <img src={hotel.logo} alt={hotel.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-700 font-bold">{hotel.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 font-bold">{hotel.name}</p>
                          <p className="text-xs text-slate-500">{hotel.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{hotel.contact}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-semibold capitalize text-slate-700">{hotel.subscriptionPlan || 'Free'}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] rounded-full font-bold border ${
                          hotel.subscriptionStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {hotel.subscriptionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full font-bold border ${
                        hotel.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {hotel.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {!hotel.isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>}
                        {hotel.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleView(hotel)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => handleToggleSubscription(hotel)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" title="Toggle Subscription">
                        <Power className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => handleDelete(hotel)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Hotel">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
