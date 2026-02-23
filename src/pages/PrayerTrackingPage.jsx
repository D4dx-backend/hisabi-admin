import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';

const FARDH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function prayerSummary(obj) {
  if (!obj) return '—';
  return FARDH_PRAYERS.filter((p) => obj[p] === true)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(', ') || '—';
}

export default function PrayerTrackingPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['model-prayer-tracking'],
    queryFn: () => adminApi.getPrayerTrackingStats().then((r) => r.data),
  });

  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['admin-prayer-tracking-records'],
    queryFn: () => adminApi.getPrayerTrackingRecords().then((r) => r.data),
  });

  const records = recordsData?.records || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Prayer Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor prayer completion rates and view detailed logs</p>
        </div>
      </div>

      <LeaderboardTable
        title="Prayer Ranking"
        description="Users ranked by total fardh prayers completed (all time)"
        isLoading={statsLoading}
        rows={statsData?.leaderboard || []}
        scoreLabel="Prayers Completed"
        scoreKey="total_prayers"
      />

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Prayer Records</h2>
          <p className="text-slate-500 text-sm mt-0.5">{recordsData?.total ?? 0} total logs registered system-wide</p>
        </div>

        {recordsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-slate-500 mt-4 animate-pulse">Loading tracking data...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 text-slate-400">
            <p className="font-bold text-slate-600 text-base mb-1">No tracked prayers</p>
            <p className="text-sm">Users have not started logging their prayers yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Fardh Completed</th>
                    <th className="px-6 py-4">Sunnah Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            {(rec.user_id?.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{rec.user_id?.name || '—'}</div>
                            <div className="text-xs text-slate-500">{rec.user_id?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {rec.date ? new Date(rec.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex py-1 px-3 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                          {prayerSummary(rec.fardh_prayers)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex py-1 px-3 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg border border-slate-200">
                          {prayerSummary(rec.sunnah_prayers)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

