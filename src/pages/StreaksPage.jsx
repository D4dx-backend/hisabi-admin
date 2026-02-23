import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';

const TYPES = ['combined', 'prayer', 'quran_reading', 'dhikr'];

const TYPE_DESCRIPTIONS = {
  combined: 'Overall perfection streak across all daily goals.',
  prayer: 'Consistency in performing all 5 daily prayers.',
  quran_reading: 'Dedication to reading the Quran every single day.',
  dhikr: 'Daily remembrance and supplication streaks.'
};

export default function StreaksPage() {
  const [streakType, setStreakType] = useState('combined');

  const { data, isLoading } = useQuery({
    queryKey: ['model-streaks', streakType],
    queryFn: () => adminApi.getStreakStats(streakType).then((r) => r.data),
  });

  const rows = data?.leaderboard || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Global Leaderboards
          </h1>
          <p className="text-slate-500 text-sm mt-1">Honoring the most consistent and dedicated users</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setStreakType(t)}
            className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-bold rounded-2xl transition-all ${streakType === t
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
          >
            {t.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <LeaderboardTable
        title={`${streakType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Leaderboard`}
        description={TYPE_DESCRIPTIONS[streakType]}
        rows={rows}
        isLoading={isLoading}
        scoreLabel="Days"
        scoreKey="current_streak"
      />
    </div>
  );
}
