import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';

export default function DuaMemorizationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-dua-memorization'],
    queryFn: () => adminApi.getDuaMemorizationStats().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-display flex items-center gap-3 tracking-tight">
            Dua Memorization Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Monitor memorization of duas globally and top ranking users</p>
        </div>
      </div>

      <LeaderboardTable
        title="Dua Ranking"
        description="Users ranked by number of duas memorized"
        isLoading={isLoading}
        rows={data?.leaderboard || []}
        scoreLabel="Duas Memorized"
        scoreKey="count"
      />
    </div>
  );
}
