import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Plus, Pencil, Trash2, X, Save, Eye, Search,
  Image, Link2, Calendar, ToggleLeft, ToggleRight, ExternalLink,
  Megaphone, Upload, Globe,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';
import Pagination from '../components/Pagination';

const LIMIT = 20;
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const EMPTY = {
  title: '',
  description: { malayalam: '', arabic: '', urdu: '' },
  link_url: '',
  from_date: '',
  to_date: '',
  is_active: true,
};

function imageUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${BASE_URL}/uploads/banners/${filename}`;
}

function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(
    item
      ? {
          title: item.title || '',
          description: {
            malayalam: item.description?.malayalam || '',
            arabic: item.description?.arabic || '',
            urdu: item.description?.urdu || '',
          },
          link_url: item.link_url || '',
          from_date: item.from_date || '',
          to_date: item.to_date || '',
          is_active: item.is_active !== false,
        }
      : { ...EMPTY, description: { malayalam: '', arabic: '', urdu: '' } }
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item ? imageUrl(item.image) : null);
  const fileInputRef = useRef();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setDesc = (lang) => (e) =>
    setForm((p) => ({ ...p, description: { ...p.description, [lang]: e.target.value } }));
  const toggle = (k) => () => setForm((p) => ({ ...p, [k]: !p[k] }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all w-full max-w-lg relative z-10 animate-slide-in-right flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50">
              {item ? <Pencil size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display">{item ? 'Edit Banner' : 'Add Banner'}</h2>
              <p className="text-xs text-slate-500 font-medium">{item ? 'Update banner details' : 'Create a new home screen banner'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-2 hover:bg-slate-200 focus:outline-none">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Megaphone size={14} /> Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Ramadan Mubarak!"
            />
          </div>

          {/* Description — 3 languages */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Globe size={14} /> Description
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-1 block">Malayalam</span>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors resize-none"
                  rows={2}
                  value={form.description.malayalam}
                  onChange={setDesc('malayalam')}
                  placeholder="Malayalam description..."
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-1 block">Arabic</span>
                <textarea
                  dir="rtl"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors resize-none"
                  rows={2}
                  value={form.description.arabic}
                  onChange={setDesc('arabic')}
                  placeholder="وصف عربي..."
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-1 block">Urdu</span>
                <textarea
                  dir="rtl"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors resize-none"
                  rows={2}
                  value={form.description.urdu}
                  onChange={setDesc('urdu')}
                  placeholder="اردو تفصیل..."
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Image size={14} /> Banner Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-semibold hover:bg-black/70 transition-colors"
                >
                  <Upload size={12} /> Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-full h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
              >
                <Upload size={22} />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs">PNG, JPG, WEBP — max 5MB</span>
              </button>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Link2 size={14} /> Link URL <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="url"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors"
              value={form.link_url}
              onChange={set('link_url')}
              placeholder="https://example.com/event"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Calendar size={14} /> Display Period <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-1 block">From Date</span>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors"
                  value={form.from_date}
                  onChange={set('from_date')}
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-1 block">To Date</span>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-slate-50 focus:bg-white transition-colors"
                  value={form.to_date}
                  min={form.from_date}
                  onChange={set('to_date')}
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Banner will be visible to users for the full 24h of each day in this range.</p>
          </div>

          {/* Active toggle */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={toggle('is_active')}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors ${form.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                {form.is_active ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                {form.is_active ? 'Active — will be shown to users' : 'Inactive — hidden from users'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave(form, imageFile)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
          >
            <Save size={16} />
            {item ? 'Save Changes' : 'Create Banner'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ViewModal({ item, onClose }) {
  if (!item) return null;
  const img = imageUrl(item.image);
  const today = new Date().toISOString().split('T')[0];
  const isLive = item.is_active && item.from_date <= today && item.to_date >= today;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all w-full max-w-lg relative z-10 animate-slide-in-right flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50">
              <Megaphone size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 font-display">Banner Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-2 hover:bg-slate-200 focus:outline-none">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {img && (
            <div className="rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-50">
              <img src={img} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</h3>
            <p className="text-slate-800 font-semibold text-base">{item.title}</p>
          </div>
          {(item.description?.malayalam || item.description?.arabic || item.description?.urdu) && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <div className="space-y-2">
                {item.description?.malayalam && (
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Malayalam</span>
                    <p className="text-sm text-slate-700">{item.description.malayalam}</p>
                  </div>
                )}
                {item.description?.arabic && (
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100" dir="rtl">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Arabic</span>
                    <p className="text-sm text-slate-700">{item.description.arabic}</p>
                  </div>
                )}
                {item.description?.urdu && (
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100" dir="rtl">
                    <span className="text-xs font-bold text-slate-400 block mb-1">Urdu</span>
                    <p className="text-sm text-slate-700">{item.description.urdu}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Display Period</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200">
              <Calendar size={13} className="text-slate-400" />
              {item.from_date} → {item.to_date}
            </span>
          </div>
          {item.link_url && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Link</h3>
              <a href={item.link_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline font-medium">
                <ExternalLink size={14} /> {item.link_url}
              </a>
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</h3>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {isLive ? 'Currently Live' : item.is_active ? 'Active (outside date range)' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function BannersManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(undefined);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['banners', page],
    queryFn: () => adminApi.getBanners({ page, limit: LIMIT }).then((r) => r.data),
  });

  const banners = (data?.banners ?? []).filter((b) =>
    !search ||
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.from_date?.includes(search) ||
    b.to_date?.includes(search)
  );

  const buildFormData = (form, imageFile) => {
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', JSON.stringify(form.description));
    fd.append('link_url', form.link_url?.trim() || '');
    fd.append('from_date', form.from_date);
    fd.append('to_date', form.to_date);
    fd.append('is_active', String(form.is_active));
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const createMut = useMutation({
    mutationFn: ({ form, imageFile }) => adminApi.createBanner(buildFormData(form, imageFile)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setModalItem(undefined);
      setSuccessMsg('Banner created successfully!');
    },
    onError: (e) => toast.error(e?.response?.data?.error || 'Failed to create banner'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, form, imageFile }) => adminApi.updateBanner(id, buildFormData(form, imageFile)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setModalItem(undefined);
      setSuccessMsg('Banner updated successfully!');
    },
    onError: (e) => toast.error(e?.response?.data?.error || 'Failed to update banner'),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => adminApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setDeleteTarget(null);
      setSuccessMsg('Banner deleted successfully!');
    },
    onError: (e) => toast.error(e?.response?.data?.error || 'Failed to delete banner'),
  });

  const handleSave = (form, imageFile) => {
    if (!form.title?.trim()) return toast.error('Title is required');
    if (!form.from_date) return toast.error('From date is required');
    if (!form.to_date) return toast.error('To date is required');
    if (form.from_date > form.to_date) return toast.error('From date must be on or before To date');
    if (modalItem?._id) {
      updateMut.mutate({ id: modalItem._id, form, imageFile });
    } else {
      createMut.mutate({ form, imageFile });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const getBannerStatus = (b) => {
    if (!b.is_active) return { label: 'Inactive', color: 'slate' };
    if (today < b.from_date) return { label: 'Upcoming', color: 'blue' };
    if (today > b.to_date) return { label: 'Expired', color: 'amber' };
    return { label: 'Live', color: 'emerald' };
  };

  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  const dotMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Banners</h1>
          <p className="text-slate-500 text-sm mt-1">Home screen banners shown during a date range.</p>
        </div>
        <button
          onClick={() => setModalItem(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          placeholder="Search title or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center">
            <Megaphone size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No banners found.</p>
            <p className="text-slate-400 text-sm mt-1">Add a banner to display on the home screen.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Banner</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {banners.map((b) => {
                  const status = getBannerStatus(b);
                  const img = imageUrl(b.image);
                  return (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img src={img} alt={b.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-8 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                              <Image size={14} className="text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{b.title}</p>
                            {b.description?.malayalam && (
                              <p className="text-xs text-slate-500 truncate max-w-[200px]">{b.description.malayalam}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
                          <Calendar size={11} />
                          {b.from_date} → {b.to_date}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colorMap[status.color]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status.color]}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewItem(b)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" title="View">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setModalItem(b)} className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.total_pages > 1 && (
        <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
      )}

      {modalItem !== undefined && (
        <Modal item={modalItem} onClose={() => setModalItem(undefined)} onSave={handleSave} />
      )}
      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Banner"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={() => deleteMut.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        isDestructive
      />

      <SuccessModal
        isOpen={!!successMsg}
        message={successMsg}
        onClose={() => setSuccessMsg('')}
      />
    </div>
  );
}
