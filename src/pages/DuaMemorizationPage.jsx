import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';
import { BookHeart } from 'lucide-react';

export default function DuaMemorizationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-dua-memorization'],
    queryFn: () => adminApi.getDuaMemorizationStats().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <LeaderboardTable
        title="Dua Memorization"
        description="Users ranked by number of duas memorized"
        isLoading={isLoading}
        rows={data?.leaderboard || []}
        scoreLabel="Duas Memorized"
        scoreKey="count"
        icon={BookHeart}
      />
    </div>
  );
}
