import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: 50,
    label: ''
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/temple-admin/slots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/temple-admin/slots`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSlots();
      setFormData({ date: '', startTime: '', endTime: '', maxCapacity: 50, label: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create slot.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/temple-admin/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSlots();
    } catch (err) {
      alert('Failed to delete slot.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Slots</h1>
          <p className="text-gray-500 mt-1">Configure allocation and timings for your temple.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">{error}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD SLOT FORM */}
        <div className="lg:col-span-1 border rounded-xl p-6 bg-white shadow-sm h-fit">
          <h2 className="text-lg font-semibold flex items-center mb-4"><Plus className="w-5 h-5 mr-2"/> Add New Slot</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border outline-none px-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="time" name="startTime" required value={formData.startTime} onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border outline-none px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="time" name="endTime" required value={formData.endTime} onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border outline-none px-3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input type="number" name="maxCapacity" min="1" required value={formData.maxCapacity} onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border outline-none px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Label (Opt)</label>
                <input type="text" name="label" placeholder="e.g. VIP" value={formData.label} onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border outline-none px-3" />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create Slot
            </button>
          </form>
        </div>

        {/* SLOTS LIST */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          ) : slots.length === 0 ? (
             <div className="text-center py-10 border rounded-xl border-dashed bg-gray-50"><p className="text-gray-500">No slots created yet.</p></div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {slots.map((slot) => (
                  <li key={slot._id} className="p-4 hover:bg-gray-50 flex items-center justify-between sm:flex-row flex-col gap-4 sm:gap-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 flex flex-col justify-center items-center text-indigo-700 font-semibold border border-indigo-200">
                          <span className="text-xs font-normal uppercase leading-none">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-lg leading-tight">{new Date(slot.date).getDate()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-sm text-gray-500">Booked: {slot.currentBooked} / {slot.maxCapacity}</p>
                      </div>
                      {slot.label && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{slot.label}</span>}
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      <button onClick={() => handleDelete(slot._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
