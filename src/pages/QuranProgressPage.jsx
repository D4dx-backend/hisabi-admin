import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';

export default function QuranProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-quran-progress'],
    queryFn: () => adminApi.getQuranProgressStats().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Quran Progress Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor complete Quran readings (Khatms) globally</p>
        </div>
      </div>

      <LeaderboardTable
        title="Khatms Ranking"
        description="Users ranked by number of full Quran completions"
        isLoading={isLoading}
        rows={data?.leaderboard || []}
        scoreLabel="Khatms Completed"
        scoreKey="khatms_completed"
      />
    </div>
  );
}
