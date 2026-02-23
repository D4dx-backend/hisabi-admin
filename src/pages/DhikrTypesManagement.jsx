import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Activity, Save, Type, Languages, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';

const EMPTY = { name: '', arabic_text: '', malayalam: '', english: '', urdu: '' };

function ViewModal({ item, onClose }) {
  if (!item) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all w-full max-w-lg relative z-10 animate-slide-in-right flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200/50">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display">Dhikr Details</h2>
              <p className="text-xs text-slate-500 font-medium">Detailed view of the content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-2 hover:bg-slate-200 focus:outline-none">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Internal Key / Name</h3>
            <p className="text-lg font-bold text-slate-800">{item.name}</p>
          </div>
          {item.arabic_text && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Arabic Text</h3>
              <p className="text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 text-lg leading-relaxed text-right font-arabic" dir="rtl">{item.arabic_text}</p>
            </div>
          )}
          <div className="space-y-4">
            {item.english && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">English Translation</h3>
                <p className="text-slate-700 font-medium">{item.english}</p>
              </div>
            )}
            {item.malayalam && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Malayalam Translation</h3>
                <p className="text-slate-700 font-medium">{item.malayalam}</p>
              </div>
            )}
            {item.urdu && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Urdu Translation</h3>
                <p className="text-slate-700 font-medium">{item.urdu}</p>
              </div>
            )}
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


function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden scale-in-center">
        <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl shadow-sm ${item ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
              {item ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{item ? 'Edit Dhikr Type' : 'Create Dhikr Type'}</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{item ? 'Modify existing catalog entry' : 'Add new dhikr translations'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Type size={16} className="text-slate-400" /> Identifier (Key) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. subhanallah"
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                value={form.name}
                onChange={set('name')}
              />
              <p className="text-xs text-slate-500 font-medium mt-2 ml-1">Unique internal key used by the application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'arabic_text', label: 'Arabic Text', icon: <Languages size={16} /> },
                { key: 'english', label: 'English Translation', icon: <Languages size={16} /> },
                { key: 'malayalam', label: 'Malayalam Translation', icon: <Languages size={16} /> },
                { key: 'urdu', label: 'Urdu Translation', icon: <Languages size={16} /> },
              ].map(({ key, label, icon }) => (
                <div key={key}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <span className="text-slate-400">{icon}</span> {label}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Enter ${label}...`}
                    className={`w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm resize-none ${key === 'arabic_text' ? 'text-lg font-bold' : ''}`}
                    value={form[key]}
                    onChange={set(key)}
                    dir={key === 'arabic_text' ? 'rtl' : 'ltr'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Save size={18} /> {item ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function DhikrTypesManagement() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 15;
  const [modal, setModal] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successState, setSuccessState] = useState({ isOpen: false, title: '', message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dhikr-types', page],
    queryFn: () => adminApi.getDhikrTypes({ page, limit }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => adminApi.createDhikrType(d),
    onSuccess: () => {
      qc.invalidateQueries(['admin-dhikr-types']);
      setSuccessState({ isOpen: true, title: 'Created', message: 'Dhikr catalog item has been created.' });
      setModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateDhikrType(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-dhikr-types']);
      setSuccessState({ isOpen: true, title: 'Updated', message: 'Dhikr catalog item has been updated.' });
      setModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteDhikrType(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin-dhikr-types']);
      setSuccessState({ isOpen: true, title: 'Deleted', message: 'Dhikr catalog item has been permanently removed.' });
      setItemToDelete(null);
    },
    onError: (e) => {
      toast.error(e.response?.data?.error || 'Failed to delete');
      setItemToDelete(null);
    },
  });

  const handleSave = (form) => {
    if (modal === 'create') createMutation.mutate(form);
    else updateMutation.mutate({ id: modal.id, data: form });
  };

  const types = data?.dhikr_types || [];
  const pagination = {
    total_pages: data?.total_pages || 0,
    current_page: data?.page || 1,
    total_items: data?.total || 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Dhikr Library
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all available dhikr translations and content</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Dhikr Item
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Internal Key</th>
                <th className="px-6 py-4 text-right">Arabic</th>
                <th className="px-6 py-4">Translations Included</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium animate-pulse">Loading catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : types.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Activity size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-slate-600 text-base mb-1">No Dhikr items found</p>
                      <p className="text-sm">Click the Add button to create your first content type.</p>
                    </div>
                  </td>
                </tr>
              ) : types.map((t) => (
                <tr key={t.id} onClick={() => setViewItem(t)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{t.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right" dir="rtl">
                    <span className="font-bold text-lg text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50 block w-max ml-auto">
                      {t.arabic_text || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {t.english && <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-lg text-xs font-bold">EN</span>}
                      {t.malayalam && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-lg text-xs font-bold">ML</span>}
                      {t.urdu && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-lg text-xs font-bold">UR</span>}
                      {!t.english && !t.malayalam && !t.urdu && <span className="text-slate-400 font-medium italic">No translations</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setModal(t); }} className="p-2 rounded-xl text-slate-400 bg-white border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm" title="Edit Item">
                        <Pencil size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setItemToDelete(t); }} className="p-2 rounded-xl text-slate-400 bg-white border border-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm" title="Delete Item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <p className="text-sm font-medium text-slate-500">
              Showing page <strong className="text-slate-800">{pagination.current_page}</strong> of <strong className="text-slate-800">{pagination.total_pages}</strong>
              <span className="text-slate-400 ml-1">({pagination.total_items} total)</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1.5 p-2 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={page >= pagination.total_pages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1.5 p-2 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => deleteMutation.mutate(itemToDelete.id)}
        title="Delete Dhikr"
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}"?`}
        confirmText="Yes, delete it"
        cancelText="Cancel"
        type="danger"
      />

      <SuccessModal
        isOpen={successState.isOpen}
        onClose={() => setSuccessState({ isOpen: false, title: '', message: '' })}
        title={successState.title}
        message={successState.message}
      />

      {modal && (
        <Modal
          item={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <ViewModal
        item={viewItem}
        onClose={() => setViewItem(null)}
      />
    </div>
  );
}
