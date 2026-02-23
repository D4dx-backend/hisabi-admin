import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { Trash2, Eye, ChevronLeft, ChevronRight, UsersRound, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';

export default function Groups() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [successState, setSuccessState] = useState({ isOpen: false, title: '', message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups', page, query],
    queryFn: () => adminApi.getGroups({ page, limit: 20, search: query || undefined }).then((r) => r.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteGroup(id),
    onSuccess: () => {
      setSuccessState({ isOpen: true, title: 'Success!', message: 'Group deleted successfully.' });
      qc.invalidateQueries(['admin-groups']);
      setGroupToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Delete failed');
      setGroupToDelete(null);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const groups = data?.groups || [];
  const pagination = {
    total_pages: data?.total_pages || 0,
    current_page: data?.page || 1,
    total_groups: data?.total || 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Groups Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor and manage user-created groups</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by group name or code…"
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm">
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Group Overview</th>
                <th className="px-6 py-4">Group Code</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4 text-center">Members</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium animate-pulse">Loading groups...</span>
                    </div>
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UsersRound size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-slate-600 text-base mb-1">No groups found</p>
                      <p className="text-sm">We couldn't find any groups matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : groups.map((g) => (
                <tr key={g._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold uppercase shrink-0 text-sm shadow-sm border border-indigo-100/50 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                        {(g.name || 'G').charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold tracking-widest bg-slate-100 text-slate-600 rounded-lg px-3 py-1.5 border border-slate-200/50 text-xs">
                      {g.group_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {g.admin_id ? (
                      <span className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-lg text-xs">
                        {g.admin_id?.name || g.admin_id?.email}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No admin assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      <UsersRound size={12} className="text-slate-400" />
                      {g.users?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {g.created_at ? new Date(g.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/groups/${g._id}`)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                        title="View Group"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setGroupToDelete(g)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Group"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <p className="text-sm font-medium text-slate-500">
              Showing page <strong className="text-slate-800">{pagination.current_page}</strong> of <strong className="text-slate-800">{pagination.total_pages}</strong>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1.5 p-2 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={page >= pagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1.5 p-2 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!groupToDelete}
        onClose={() => setGroupToDelete(null)}
        onConfirm={() => deleteMutation.mutate(groupToDelete._id)}
        title="Delete Group"
        message={`Are you sure you want to completely remove "${groupToDelete?.name}"? All users will be removed from this group. This cannot be undone.`}
        confirmText="Yes, delete group"
        cancelText="Cancel"
        type="danger"
      />

      <SuccessModal
        isOpen={successState.isOpen}
        onClose={() => setSuccessState({ isOpen: false, title: '', message: '' })}
        title={successState.title}
        message={successState.message}
      />
    </div>
  );
}
