import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, Moon, ChevronDown, ChevronUp, Calendar, BookOpen, Eye } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';

const EMPTY_DESC = { arabic: '', malayalam: '', english: '', urdu: '' };
const EMPTY = { day_number: '', title: '', arabic_text: '', isQuranicFont: false, count: '', isCountless: false, malayalam: '', english: '', urdu: '', description: { ...EMPTY_DESC } };
const EMPTY_OTHER = { title: '', arabic_text: '', category: '', isQuranicFont: false, count: '', isCountless: false, malayalam: '', english: '', urdu: '', description: { ...EMPTY_DESC }, additional_categories: [] };

function ViewModal({ item, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{item.title}</h2>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">Day {item.day_number}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Arabic Text</p>
            <p className="text-right font-arabic text-xl leading-loose text-slate-800" dir="rtl">{item.arabic_text}</p>
          </div>

          {item.malayalam && (
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Malayalam</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{item.malayalam}</p>
            </div>
          )}

          {item.english && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">English</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{item.english}</p>
            </div>
          )}

          {item.urdu && (
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Urdu</p>
              <p className="text-sm text-slate-700 leading-relaxed text-right whitespace-pre-line" dir="rtl">{item.urdu}</p>
            </div>
          )}

          {(item.description?.arabic || item.description?.malayalam || item.description?.english || item.description?.urdu) && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Description</p>
              <div className="space-y-3">
                {item.description.arabic && <div><p className="text-xs text-slate-400 mb-1">Arabic</p><p className="text-sm text-slate-700 text-right" dir="rtl">{item.description.arabic}</p></div>}
                {item.description.malayalam && <div><p className="text-xs text-slate-400 mb-1">Malayalam</p><p className="text-sm text-slate-700">{item.description.malayalam}</p></div>}
                {item.description.english && <div><p className="text-xs text-slate-400 mb-1">English</p><p className="text-sm text-slate-700">{item.description.english}</p></div>}
                {item.description.urdu && <div><p className="text-xs text-slate-400 mb-1">Urdu</p><p className="text-sm text-slate-700 text-right" dir="rtl">{item.description.urdu}</p></div>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {item.count && <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">Count: ×{item.count}</span>}
            {item.isCountless && <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">Countless</span>}
            {item.isQuranicFont && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-medium">Quranic Font</span>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Modal({ item, dayNumber, onClose, onSave }) {
  const [form, setForm] = useState(
    item
      ? { ...item, description: { ...EMPTY_DESC, ...(item.description || {}) } }
      : { ...EMPTY, day_number: dayNumber || '' }
  );

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setDesc = (k) => (e) => setForm((p) => ({ ...p, description: { ...p.description, [k]: e.target.value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.arabic_text || !form.day_number) {
      toast.error('Day number, title, and arabic text are required');
      return;
    }
    onSave(form);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{item ? 'Edit Ramadan Dua' : 'Add Ramadan Dua'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Day Number *</label>
              <input type="number" min="1" max="30" value={form.day_number} onChange={set('day_number')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input value={form.title} onChange={set('title')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Arabic Text *</label>
            <textarea value={form.arabic_text} onChange={set('arabic_text')} rows={3} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-right font-arabic text-lg" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isQuranicFont} onChange={(e) => setForm((p) => ({ ...p, isQuranicFont: e.target.checked }))} className="rounded border-slate-300" />
              <span className="text-sm text-slate-700">Use Quranic Font</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isCountless} onChange={(e) => setForm((p) => ({ ...p, isCountless: e.target.checked, count: e.target.checked ? '' : p.count }))} className="rounded border-slate-300" />
              <span className="text-sm text-slate-700">Countless</span>
            </label>
          </div>

          {!form.isCountless && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Count</label>
              <input type="number" value={form.count} onChange={set('count')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Malayalam Translation</label>
            <textarea value={form.malayalam || ''} onChange={set('malayalam')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">English Translation</label>
            <textarea value={form.english || ''} onChange={set('english')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Urdu Translation</label>
            <textarea value={form.urdu || ''} onChange={set('urdu')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-right" />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Description</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Arabic</label>
                <textarea value={form.description.arabic || ''} onChange={setDesc('arabic')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Malayalam</label>
                <textarea value={form.description.malayalam || ''} onChange={setDesc('malayalam')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">English</label>
                <textarea value={form.description.english || ''} onChange={setDesc('english')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Urdu</label>
                <textarea value={form.description.urdu || ''} onChange={setDesc('urdu')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Save size={16} /> {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function DaySection({ day, duas, onAdd, onEdit, onDelete, onView }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">{day}</div>
          <span className="font-semibold text-slate-800">Day {day}</span>
          <span className="text-sm text-slate-500">({duas.length} {duas.length === 1 ? 'dua' : 'duas'})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(day); }}
            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            title="Add dua"
          >
            <Plus size={16} />
          </button>
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </button>

      {expanded && duas.length > 0 && (
        <div className="divide-y divide-slate-100">
          {duas.map((dua) => (
            <div key={dua._id || dua.id} className="px-5 py-3 flex items-start justify-between gap-4 hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{dua.title}</p>
                <p className="text-sm text-slate-500 mt-1 truncate font-arabic text-right" dir="rtl">{dua.arabic_text?.slice(0, 80)}{dua.arabic_text?.length > 80 ? '...' : ''}</p>
                <div className="flex gap-2 mt-1.5">
                  {dua.malayalam && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">ML</span>}
                  {dua.english && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">EN</span>}
                  {dua.urdu && <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">UR</span>}
                  {dua.count && <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">×{dua.count}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => onView(dua)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600" title="View"><Eye size={15} /></button>
                <button onClick={() => onEdit(dua)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600" title="Edit"><Pencil size={15} /></button>
                <button onClick={() => onDelete(dua)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && duas.length === 0 && (
        <div className="px-5 py-6 text-center text-slate-400 text-sm">
          No duas added for this day yet.
        </div>
      )}
    </div>
  );
}

export default function RamadanManagement() {
  const [activeTab, setActiveTab] = useState('days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl">
            <Moon size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Ramadan</h1>
            <p className="text-sm text-slate-500">Manage Ramadan duas and prayers</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('days')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'days' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calendar size={16} /> Days Collection
        </button>
        <button
          onClick={() => setActiveTab('others')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'others' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={16} /> Others
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'days' ? <DaysCollectionTab /> : <OtherDuasTab />}
    </div>
  );
}

// ─── Days Collection Tab ─────────────────────────────────────────────────────

function DaysCollectionTab() {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addForDay, setAddForDay] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ramadan-duas'],
    queryFn: () => adminApi.getRamadanDuas({ limit: 500 }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (form) => adminApi.createRamadanDua(form),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-duas']); setShowModal(false); setSuccessMsg('Ramadan dua created successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateRamadanDua(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-duas']); setShowModal(false); setEditItem(null); setSuccessMsg('Ramadan dua updated successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteRamadanDua(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-duas']); setDeleteTarget(null); setSuccessMsg('Ramadan dua deleted successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to delete'),
  });

  const handleSave = (form) => {
    const payload = {
      ...form,
      day_number: parseInt(form.day_number),
      count: form.isCountless ? null : (form.count ? parseInt(form.count) : null),
    };
    if (editItem) {
      updateMutation.mutate({ id: editItem._id || editItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleAdd = (day) => {
    setEditItem(null);
    setAddForDay(day);
    setShowModal(true);
  };

  const handleEdit = (dua) => {
    setEditItem(dua);
    setAddForDay(null);
    setShowModal(true);
  };

  const allDuas = data?.ramadan_duas || [];

  // Group duas by day
  const duasByDay = {};
  for (let d = 1; d <= 30; d++) duasByDay[d] = [];
  allDuas.forEach((dua) => {
    const day = dua.day_number;
    if (day >= 1 && day <= 30) duasByDay[day].push(dua);
  });

  const totalDuasCount = allDuas.length;

  return (
    <>
      <p className="text-sm text-slate-500">{totalDuasCount} duas across 30 days</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <DaySection
              key={day}
              day={day}
              duas={duasByDay[day]}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onView={setViewItem}
            />
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          item={editItem}
          dayNumber={addForDay}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {viewItem && (
        <ViewModal item={viewItem} onClose={() => setViewItem(null)} />
      )}

      {deleteTarget && (
        <ConfirmationModal
          isOpen
          title="Delete Ramadan Dua"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          confirmText="Delete"
          onConfirm={() => deleteMutation.mutate(deleteTarget._id || deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {successMsg && (
        <SuccessModal isOpen message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </>
  );
}

// ─── Others Tab (uses existing Dua model with Ramadan category) ─────────────

function OtherDuaModal({ item, categories, onClose, onSave }) {
  const [form, setForm] = useState(
    item
      ? { ...item, category: item.category?._id || item.category || '', description: { ...EMPTY_DESC, ...(item.description || {}) }, additional_categories: (item.additional_categories || []).map(c => c?._id || c), isQuranicFont: item.isQuranicFont || false, isCountless: item.isCountless || false }
      : EMPTY_OTHER
  );

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setDesc = (k) => (e) => setForm((p) => ({ ...p, description: { ...p.description, [k]: e.target.value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.arabic_text || !form.category) {
      toast.error('Title, arabic text, and category are required');
      return;
    }
    onSave(form);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{item ? 'Edit Dua' : 'Add Dua'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input value={form.title} onChange={set('title')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-category *</label>
              <select value={form.category} onChange={set('category')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Arabic Text *</label>
            <textarea value={form.arabic_text} onChange={set('arabic_text')} rows={3} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-right font-arabic text-lg" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isQuranicFont} onChange={(e) => setForm((p) => ({ ...p, isQuranicFont: e.target.checked }))} className="rounded border-slate-300" />
              <span className="text-sm text-slate-700">Use Quranic Font</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isCountless} onChange={(e) => setForm((p) => ({ ...p, isCountless: e.target.checked, count: e.target.checked ? '' : p.count }))} className="rounded border-slate-300" />
              <span className="text-sm text-slate-700">Countless</span>
            </label>
          </div>

          {!form.isCountless && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Count</label>
              <input type="number" value={form.count} onChange={set('count')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Malayalam Translation</label>
            <textarea value={form.malayalam || ''} onChange={set('malayalam')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">English Translation</label>
            <textarea value={form.english || ''} onChange={set('english')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Urdu Translation</label>
            <textarea value={form.urdu || ''} onChange={set('urdu')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-right" />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Description</h3>
            <div className="space-y-3">
              <div><label className="block text-xs text-slate-500 mb-1">Arabic</label><textarea value={form.description.arabic || ''} onChange={setDesc('arabic')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right" /></div>
              <div><label className="block text-xs text-slate-500 mb-1">Malayalam</label><textarea value={form.description.malayalam || ''} onChange={setDesc('malayalam')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              <div><label className="block text-xs text-slate-500 mb-1">English</label><textarea value={form.description.english || ''} onChange={setDesc('english')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              <div><label className="block text-xs text-slate-500 mb-1">Urdu</label><textarea value={form.description.urdu || ''} onChange={setDesc('urdu')} rows={2} dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right" /></div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <Save size={16} /> {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function OtherDuasTab() {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all dua categories to find Ramadan parent & its sub-categories
  const { data: catData } = useQuery({
    queryKey: ['admin-dua-categories-all'],
    queryFn: () => adminApi.getDuaCategories({ limit: 500 }).then((r) => r.data),
  });

  const allCategories = catData?.dua_categories || [];

  // Find the "Ramadan" parent category
  const ramadanParent = useMemo(() => {
    return allCategories.find((c) => !c.parent && c.name.toLowerCase() === 'ramadan');
  }, [allCategories]);

  // Get Ramadan sub-categories
  const ramadanSubCategories = useMemo(() => {
    if (!ramadanParent) return [];
    const parentId = ramadanParent._id || ramadanParent.id;
    return allCategories.filter((c) => {
      const pid = c.parent?._id || c.parent?.id || c.parent;
      return pid && (pid === parentId || pid.toString() === parentId.toString());
    });
  }, [allCategories, ramadanParent]);

  // Fetch duas for Ramadan sub-categories
  const ramadanCatIds = ramadanSubCategories.map((c) => c._id || c.id);
  const { data: duasData, isLoading: duasLoading } = useQuery({
    queryKey: ['admin-ramadan-other-duas', ramadanCatIds],
    queryFn: async () => {
      if (!ramadanCatIds.length) return { duas: [] };
      // Fetch duas for each Ramadan sub-category
      const results = await Promise.all(
        ramadanCatIds.map((catId) => adminApi.getDuas({ category: catId, limit: 100 }).then((r) => r.data.duas || []))
      );
      return { duas: results.flat() };
    },
    enabled: ramadanCatIds.length > 0,
  });

  const otherDuas = duasData?.duas || [];

  const createMutation = useMutation({
    mutationFn: (form) => adminApi.createDua(form),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-other-duas']); setShowModal(false); setSuccessMsg('Dua created successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateDua(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-other-duas']); setShowModal(false); setEditItem(null); setSuccessMsg('Dua updated successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteDua(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-ramadan-other-duas']); setDeleteTarget(null); setSuccessMsg('Dua deleted successfully!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to delete'),
  });

  const handleSave = (form) => {
    const payload = {
      ...form,
      count: form.isCountless ? null : (form.count ? parseInt(form.count) : null),
    };
    if (editItem) {
      updateMutation.mutate({ id: editItem._id || editItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Group by category
  const duasByCat = {};
  ramadanSubCategories.forEach((cat) => {
    const catId = cat._id || cat.id;
    duasByCat[catId] = { category: cat, duas: [] };
  });
  otherDuas.forEach((dua) => {
    const catId = dua.category?._id || dua.category?.id || dua.category;
    if (duasByCat[catId]) duasByCat[catId].duas.push(dua);
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{otherDuas.length} duas in {ramadanSubCategories.length} categories</p>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <Plus size={16} /> Add Dua
        </button>
      </div>

      {duasLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : ramadanSubCategories.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p>No Ramadan category found. Create a "Ramadan" category in Dua Categories first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.values(duasByCat).map(({ category, duas }) => (
            <div key={category._id || category.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">{duas.length}</div>
                  <span className="font-semibold text-slate-800">{category.name}</span>
                </div>
              </div>
              {duas.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {duas.map((dua) => (
                    <div key={dua._id || dua.id} className="px-5 py-3 flex items-start justify-between gap-4 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{dua.title}</p>
                        <p className="text-sm text-slate-500 mt-1 truncate font-arabic text-right" dir="rtl">{dua.arabic_text?.slice(0, 80)}{dua.arabic_text?.length > 80 ? '...' : ''}</p>
                        <div className="flex gap-2 mt-1.5">
                          {dua.malayalam && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">ML</span>}
                          {dua.english && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">EN</span>}
                          {dua.urdu && <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">UR</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setEditItem(dua); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(dua)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-center text-slate-400 text-sm">No duas in this category yet.</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <OtherDuaModal
          item={editItem}
          categories={ramadanSubCategories}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <ConfirmationModal
          isOpen
          title="Delete Dua"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          confirmText="Delete"
          onConfirm={() => deleteMutation.mutate(deleteTarget._id || deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {successMsg && (
        <SuccessModal isOpen message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </>
  );
}
