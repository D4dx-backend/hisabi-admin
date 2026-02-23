import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';

export default function Users() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [successState, setSuccessState] = useState({ isOpen: false, title: '', message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, query],
    queryFn: () => adminApi.getUsers({ page, limit: 20, search: query || undefined }).then((r) => r.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      setSuccessState({ isOpen: true, title: 'Success!', message: 'User deleted successfully.' });
      qc.invalidateQueries(['admin-users']);
      setUserToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Delete failed');
      setUserToDelete(null);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const users = data?.users || [];
  const pagination = {
    total_pages: data?.total_pages || 0,
    current_page: data?.page || 1,
    total_users: data?.total || 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Users Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view all registered users on the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
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
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium animate-pulse">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UserIcon size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-slate-600 text-base mb-1">No users found</p>
                      <p className="text-sm">We couldn't find any users matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase shrink-0 text-sm shadow-sm border border-slate-200/50 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                        {(u.name || (u.email && u.email.charAt(0)) || 'U').charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{u.name || 'Unnamed User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{u.email || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize border ${u.gender === 'm' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      u.gender === 'f' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {u.gender === 'm' ? 'Male' : u.gender === 'f' ? 'Female' : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/users/${u._id}`)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete User"
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
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => deleteMutation.mutate(userToDelete._id)}
        title="Delete User"
        message={`Are you sure you want to completely remove ${userToDelete?.name || 'this user'}? This action cannot be undone.`}
        confirmText="Yes, delete user"
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
