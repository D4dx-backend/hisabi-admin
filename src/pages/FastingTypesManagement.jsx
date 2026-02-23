import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Moon, Save, Type, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';

const EMPTY = { name: '', display_name: '', description: '' };

function ViewModal({ item, onClose }) {
  if (!item) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all w-full max-w-lg relative z-10 animate-slide-in-right flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200/50">
              <Moon size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display">Fasting Type Details</h2>
              <p className="text-xs text-slate-500 font-medium">Detailed view of the content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-2 hover:bg-slate-200 focus:outline-none">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Internal Key</h3>
              <p className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">{item.name}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Display Name</h3>
              <p className="font-bold text-slate-800">{item.display_name}</p>
            </div>
          </div>
          {item.description && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
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
              <h2 className="text-xl font-bold text-slate-800">{item ? 'Edit Fasting Type' : 'Create Fasting Type'}</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{item ? 'Modify existing catalog entry' : 'Add a new fasting category'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Type size={16} className="text-slate-400" /> Identifier (Key) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ramadan"
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                  value={form.name}
                  onChange={set('name')}
                />
                <p className="text-xs text-slate-500 font-medium mt-2 ml-1">Unique internal key.</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Type size={16} className="text-slate-400" /> Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramadan"
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                  value={form.display_name}
                  onChange={set('display_name')}
                />
                <p className="text-xs text-slate-500 font-medium mt-2 ml-1">Visible name for users.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <FileText size={16} className="text-slate-400" /> Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the fasting type..."
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm resize-none"
                value={form.description}
                onChange={set('description')}
              />
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

export default function FastingTypesManagement() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 15;
  const [modal, setModal] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successState, setSuccessState] = useState({ isOpen: false, title: '', message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-fasting-types', page],
    queryFn: () => adminApi.getFastingTypes({ page, limit }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => adminApi.createFastingType(d),
    onSuccess: () => {
      qc.invalidateQueries(['admin-fasting-types']);
      setSuccessState({ isOpen: true, title: 'Created', message: 'Fasting catalog item has been created.' });
      setModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateFastingType(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-fasting-types']);
      setSuccessState({ isOpen: true, title: 'Updated', message: 'Fasting catalog item has been updated.' });
      setModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteFastingType(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin-fasting-types']);
      setSuccessState({ isOpen: true, title: 'Deleted', message: 'Fasting catalog item has been permanently removed.' });
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

  const types = data?.fasting_types || [];
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
            Fasting Catalog
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage standard fasting types provided to users</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Fasting Type
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Internal Key</th>
                <th className="px-6 py-4">Display Name</th>
                <th className="px-6 py-4">Description</th>
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
                      <Moon size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-slate-600 text-base mb-1">No Fasting types found</p>
                      <p className="text-sm">Click the Add button to create your first content type.</p>
                    </div>
                  </td>
                </tr>
              ) : types.map((t) => (
                <tr key={t.id} onClick={() => setViewItem(t)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                    <span className="bg-slate-100 px-2 py-1 rounded-md">{t.name}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t.display_name}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-md truncate">{t.description || '—'}</td>
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
        title="Delete Fasting Type"
        message={`Are you sure you want to permanently delete "${itemToDelete?.display_name}"?`}
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
