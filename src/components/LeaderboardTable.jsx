import { Link } from 'react-router-dom';
import { Medal, Trophy, Star } from 'lucide-react';

export default function LeaderboardTable({
  title,
  description,
  rows,
  scoreLabel = "Streak",
  scoreKey = "current_streak",
  isLoading
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border border-amber-200 shadow-sm">
            <Trophy size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
            {description && <p className="text-sm text-slate-500 font-medium">{description}</p>}
          </div>
        </div>
        <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
          {rows?.length || 0} Ranked
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-center w-16">Rank</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {scoreLabel} <Star size={12} className="text-amber-400 fill-amber-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={4} className="py-12 text-center text-slate-400">Loading...</td></tr>
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Medal size={40} className="text-slate-300" />
                    <span className="font-bold text-slate-400">No data found</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const user = row.user || {};
                const score = row[scoreKey] ?? 0;

                // Styling for top 3
                const isTop3 = i < 3;
                const top3Styles = [
                  "bg-amber-50/50 hover:bg-amber-50",
                  "bg-slate-50 hover:bg-slate-100",
                  "bg-orange-50/50 hover:bg-orange-50"
                ];

                return (
                  <tr key={row._id || i} className={`transition-colors group ${isTop3 ? top3Styles[i] : 'hover:bg-slate-50/80'}`}>
                    <td className="px-6 py-3 border-r border-slate-50 text-center">
                      {i === 0 ? <span className="text-2xl drop-shadow-sm filter">🥇</span> :
                        i === 1 ? <span className="text-2xl drop-shadow-sm filter">🥈</span> :
                          i === 2 ? <span className="text-2xl drop-shadow-sm filter">🥉</span> :
                            <div className="mx-auto w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200">
                              {i + 1}
                            </div>}
                    </td>
                    <td className="px-6 py-3">
                      {user._id ? (
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${isTop3 ? 'bg-white tracking-widest' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <Link to={`/users/${user._id}`} className={`font-bold hover:underline ${isTop3 ? 'text-slate-800' : 'text-slate-700'}`}>
                            {user.name || 'Unnamed User'}
                          </Link>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-medium px-3 py-1 bg-slate-100 rounded-lg text-xs">Deleted User</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-medium">
                      {user.email || '—'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-100 shadow-sm group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                        <span className={`font-bold text-base ${isTop3 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {score.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scoreLabel}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
