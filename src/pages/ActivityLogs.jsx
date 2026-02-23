import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { ChevronLeft, ChevronRight, ExternalLink, Filter, Calendar, ListFilter } from 'lucide-react';

const ACTIVITY_TYPES = [
  '', 'prayer', 'quran_reading', 'quran_memorization', 'dhikr',
  'fasting', 'dua_memorization', 'goal', 'streak',
];

const typeColors = {
  prayer: 'bg-blue-100 text-blue-700',
  quran_reading: 'bg-emerald-100 text-emerald-700',
  quran_memorization: 'bg-teal-100 text-teal-700',
  dhikr: 'bg-purple-100 text-purple-700',
  fasting: 'bg-orange-100 text-orange-700',
  dua_memorization: 'bg-pink-100 text-pink-700',
  goal: 'bg-amber-100 text-amber-700',
  streak: 'bg-indigo-100 text-indigo-700',
};

export default function ActivityLogs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activityType, setType] = useState('');
  const [dateFrom, setFrom] = useState('');
  const [dateTo, setTo] = useState('');
  const [userId, setUserId] = useState('');

  // Pre-populate user_id from URL query param (e.g. from UserDetail page)
  useEffect(() => {
    const uid = searchParams.get('user_id');
    if (uid) setUserId(uid);
  }, []);

  const queryParams = {
    page,
    limit: 25,
    ...(activityType && { activity_type: activityType }),
    ...(dateFrom && { start_date: dateFrom }),
    ...(dateTo && { end_date: dateTo }),
    ...(userId && { user_id: userId }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity-logs', queryParams],
    queryFn: () => adminApi.getActivityLogs(queryParams).then((r) => r.data),
    keepPreviousData: true,
  });

  const logs = data?.logs || [];
  const pagination = {
    total_pages: data?.total_pages || 0,
    current_page: data?.page || 1,
    total_logs: data?.total || 0,
  };

  const hasFilters = activityType || dateFrom || dateTo || userId;
  const resetFilters = () => {
    setType(''); setFrom(''); setTo(''); setUserId(''); setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Activity Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Browse and filter all user activity across the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <Filter size={18} className="text-emerald-500" />
          <h2 className="font-bold text-slate-700">Filter Logs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ListFilter size={14} /> Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 hover:border-slate-300"
            >
              <option value="">All types</option>
              {ACTIVITY_TYPES.filter(Boolean).map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => { setUserId(e.target.value.trim()); setPage(1); }}
              placeholder="Search by User ID..."
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 hover:border-slate-300 placeholder:text-slate-400 focus:placeholder:opacity-0"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={14} /> From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 hover:border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={14} /> To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 hover:border-slate-300"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Activity Type</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium animate-pulse">Loading activity logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ListFilter size={48} className="mb-4 opacity-20" />
                      <p className="font-bold text-slate-600 text-base mb-1">No logs found</p>
                      <p className="text-sm">We couldn't find any activities matching your filters.</p>
                      {hasFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-4 text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/users/${log.user_id?._id || log.user_id}`)}
                      className="group/btn flex items-center gap-2 max-w-[200px]"
                      title="View user profile"
                    >
                      <span className="font-semibold text-slate-700 group-hover/btn:text-emerald-600 transition-colors truncate">
                        {log.user_id?.name || log.user_id?.email || String(log.user_id || '—').slice(0, 8) + '…'}
                      </span>
                      <ExternalLink size={14} className="text-slate-300 group-hover/btn:text-emerald-500 transition-colors" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize border ${typeColors[log.activity_type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {log.activity_type?.replace(/_/g, ' ') || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                    {log.date ? new Date(log.date).toLocaleString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : '—'}
                  </td>
                  <td className="px-6 py-4 w-full">
                    <div className="flex items-center">
                      <code className="text-[11px] font-mono bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100 max-w-[400px] truncate block" title={log.details ? JSON.stringify(log.details) : ''}>
                        {log.details ? JSON.stringify(log.details) : 'No details'}
                      </code>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <p className="text-sm font-medium text-slate-500">
            {pagination.total_logs > 0 ? (
              <>Showing page <strong className="text-slate-800">{pagination.current_page}</strong> of <strong className="text-slate-800">{pagination.total_pages}</strong> <span className="text-slate-400">({pagination.total_logs} total logs)</span></>
            ) : 'No results'}
          </p>

          {pagination.total_pages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
