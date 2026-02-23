import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';
import { Sparkles } from 'lucide-react';

export default function DhikrTrackingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-dhikr-tracking'],
    queryFn: () => adminApi.getDhikrTrackingStats().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <LeaderboardTable
        title="Dhikr Tracking"
        description="Users ranked by total dhikr count (all time)"
        isLoading={isLoading}
        rows={data?.leaderboard || []}
        scoreLabel="Total Dhikr"
        scoreKey="total_dhikr"
        icon={Sparkles}
      />
    </div>
  );
}
