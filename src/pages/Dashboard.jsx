import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { Users, UsersRound, ScrollText, Activity, TrendingUp, UserCheck, Flame, ChevronRight, BarChart3, PieChart, Activity as ActivityIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ label, value, Icon, color, sub, trend = null, linkTo = null }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    orange: 'bg-amber-50 text-amber-600 border-amber-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const CardContent = (
    <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 p-6 relative overflow-hidden group ${linkTo ? 'hover:shadow-md transition-all cursor-pointer hover:-translate-y-1' : ''}`}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
        <Icon size={80} />
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3.5 rounded-2xl border flex items-center justify-center ${colors[color]} shadow-sm`}>
          <Icon size={24} />
        </div>

        {trend && (
          <span className="inline-flex flex-col items-end">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              +{trend}%
            </span>
          </span>
        )}

        {linkTo && !trend && (
          <span className="p-2 text-slate-300 group-hover:text-emerald-500 transition-colors bg-slate-50 group-hover:bg-emerald-50 rounded-xl">
            <ChevronRight size={18} />
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-500 font-bold text-sm tracking-wide uppercase mb-1">{label}</h3>
        <p className="text-3xl font-display font-bold text-slate-800 tracking-tight">
          {value === undefined || value === null || value === '…' ? (
            <span className="text-slate-300 inline-block animate-pulse">---</span>
          ) : typeof value === 'number' ? value.toLocaleString() : value}
        </p>

        {sub && (
          <div className="mt-3 text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
            {sub}
          </div>
        )}
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo} className="block">{CardContent}</Link> : CardContent;
}

const streakTypeLabel = {
  prayer: 'Daily Prayers',
  quran_reading: 'Quran Reading',
  dhikr: 'Daily Dhikr',
  combined: 'Perfect Day',
};

const streakIcons = {
  prayer: '🤲',
  quran_reading: '📖',
  dhikr: '📿',
  combined: '⭐',
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  });

  const stats = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time platform metrics and activity overview</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
          <ActivityIcon size={16} className="text-emerald-500 animate-pulse" />
          Live Metrics
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600 mb-6 flex items-center gap-3 font-medium shadow-sm">
          <div className="bg-red-100 p-2 rounded-lg"><Activity size={20} className="text-red-600" /></div>
          <div>
            <p className="font-bold text-red-800">Connection Error</p>
            <p>Failed to load dashboard metrics: {error.message}</p>
          </div>
        </div>
      )}

      {/* Row 1 — core platform counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Users"
          value={isLoading ? '…' : stats.total_users}
          Icon={Users}
          color="blue"
          linkTo="/users"
        />
        <StatCard
          label="Total Groups"
          value={isLoading ? '…' : stats.total_groups}
          Icon={UsersRound}
          color="green"
          linkTo="/groups"
        />
        <StatCard
          label="Activity Logs"
          value={isLoading ? '…' : stats.total_activity_logs}
          Icon={ScrollText}
          color="purple"
          linkTo="/activity"
        />
        <StatCard
          label="Today's Activity"
          value={isLoading ? '…' : stats.today_activity_count}
          Icon={Activity}
          color="orange"
          linkTo="/activity"
        />
      </div>

      {/* Row 2 — user growth */}
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-slate-400" /> User Demographics & Growth
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="New (7 days)"
          value={isLoading ? '…' : stats.new_users_last_7_days}
          Icon={TrendingUp}
          color="teal"
        />
        <StatCard
          label="New (This Month)"
          value={isLoading ? '…' : stats.new_users_this_month}
          Icon={UserCheck}
          color="green"
        />
        <StatCard
          label="Male Users"
          value={isLoading ? '…' : stats.male_users}
          Icon={Users}
          color="blue"
          sub={stats.total_users
            ? `${Math.round((stats.male_users / stats.total_users) * 100)}% of total users`
            : undefined}
        />
        <StatCard
          label="Female Users"
          value={isLoading ? '…' : stats.female_users}
          Icon={Users}
          color="rose"
          sub={stats.total_users
            ? `${Math.round((stats.female_users / stats.total_users) * 100)}% of total users`
            : undefined}
        />
      </div>

      {/* Row 3 — two panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6">

        {/* Activity Breakdown */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100/50">
              <PieChart size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Activity Breakdown</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 30 Days</p>
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 animate-pulse">Analyzing activity data...</p>
              </div>
            ) : stats.activity_breakdown && Object.keys(stats.activity_breakdown).length > 0 ? (
              <div className="space-y-5">
                {Object.entries(stats.activity_breakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    const max = Math.max(...Object.values(stats.activity_breakdown));
                    const pct = max ? (count / max) * 100 : 0;
                    return (
                      <div key={type} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <span className="capitalize font-bold text-slate-700 text-sm">{type.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 text-sm">
                              {count.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-slate-400 w-8 text-right">
                              {Math.round(pct)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80 relative"
                            style={{ width: `${Math.max(2, pct)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-600">No activity data</p>
                <p className="text-sm">Users haven't logged any activities yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Streak Averages */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl border border-orange-100/50">
                <Flame size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Streak Performance</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Global Averages</p>
              </div>
            </div>
            <Link to="/streaks" className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
              View Leaderboards <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 animate-pulse">Calculating streaks...</p>
              </div>
            ) : stats.streak_averages && Object.keys(stats.streak_averages).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats.streak_averages).map(([type, s]) => (
                  <div key={type} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-colors group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl drop-shadow-sm">{streakIcons[type] || '🔥'}</span>
                      <p className="font-bold text-slate-700">
                        {streakTypeLabel[type] || type.replace(/_/g, ' ')}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm flex-1 mr-3 group-hover:border-orange-200 transition-colors">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Avg</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold font-display text-orange-600">{s.avg_current || 0}</p>
                          <span className="text-xs font-bold text-slate-400">days</span>
                        </div>
                      </div>

                      <div className="text-right pb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Best Avg</p>
                        <p className="text-sm font-bold text-slate-600">{s.avg_longest || 0} days</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                <Flame size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-600">No streak data</p>
                <p className="text-sm">Users haven't built any streaks yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
