import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import LeaderboardTable from '../components/LeaderboardTable';
import { Moon } from 'lucide-react';

export default function FastingDaysPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-fasting'],
    queryFn: () => adminApi.getFastingStats().then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <LeaderboardTable
        title="Fasting Days"
        description="Users ranked by completed fasting days (all time)"
        isLoading={isLoading}
        rows={data?.leaderboard || []}
        scoreLabel="Days Fasted"
        scoreKey="completed_days"
        icon={Moon}
      />
    </div>
  );
}
