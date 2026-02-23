import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import {
  ArrowLeft, Trash2, Users, Crown, Calendar,
  Activity, ScrollText, CheckCircle2, User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessModal from '../components/SuccessModal';
import { useState } from 'react';

const activityTypeColors = {
  daily: 'bg-blue-50 text-blue-600 border-blue-100',
  weekly: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  monthly: 'bg-purple-50 text-purple-600 border-purple-100',
  recurring: 'bg-orange-50 text-orange-600 border-orange-100',
};

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 text-sm">
      <div className="flex items-center gap-2 text-slate-500 font-medium">
        {Icon && <Icon size={16} className="text-slate-400" />}
        {label}
      </div>
      <span className="font-bold text-slate-800 text-right">{value ?? '—'}</span>
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-group', id],
    queryFn: () => adminApi.getGroupDetail(id).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteGroup(id),
    onSuccess: () => {
      qc.invalidateQueries(['admin-groups']);
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Delete failed');
      setIsDeleteModalOpen(false);
    }
  });

  if (isLoading) return (
    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
      <div className="h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Loading group profile...
    </div>
  );
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 max-w-2xl mx-auto flex flex-col items-center text-center">
      <Trash2 size={40} className="mb-3 opacity-50" />
      <h3 className="font-bold text-lg mb-1">Failed to load group</h3>
      <p className="text-sm opacity-80">This group may have been deleted.</p>
      <button onClick={() => navigate('/groups')} className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">Return to Groups</button>
    </div>
  );

  const { group, default_activities = [] } = data || {};
  const members = group?.users || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium w-fit transition-colors group/back"
        >
          <div className="p-1.5 rounded-lg group-hover/back:bg-white group-hover/back:shadow-sm">
            <ArrowLeft size={16} />
          </div>
          Back to Groups
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-white hover:bg-red-600 font-semibold bg-white border border-red-200 rounded-xl px-4 py-2 hover:shadow-sm transition-all shadow-sm"
        >
          <Trash2 size={16} /> Delete Group
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Group Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="h-24 bg-gradient-to-tr from-brand-600 to-emerald-400 absolute top-0 left-0 w-full z-0"></div>

            <div className="relative z-10 p-6 pt-12 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-2xl bg-white p-1 mb-4 shadow-sm rotate-3 hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 uppercase">
                  {group?.name?.charAt(0) || 'G'}
                </div>
              </div>

              <h1 className="text-xl font-bold text-slate-800 font-display mb-1">{group?.name || 'Unnamed Group'}</h1>
              <p className="text-sm text-slate-500 font-medium mb-4">{group?.description || 'No description provided'}</p>

              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-brand-50 text-brand-600 border border-brand-100">
                Code: {group?.group_id}
              </span>

              <div className="w-full text-left space-y-1">
                <InfoRow label="Created" value={group?.created_at ? new Date(group.created_at).toLocaleDateString() : '—'} icon={Calendar} />
                <div className="flex items-center justify-between py-3 border-b border-slate-50 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Crown size={16} className="text-amber-500" /> Admin
                  </div>
                  <span className="font-bold text-slate-800 text-right">{group?.admin_id?.name || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 text-lg font-display mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <Users size={20} className="mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-black text-slate-800">{members.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Members</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                <Activity size={20} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-2xl font-black text-slate-800">{default_activities.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Activities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activities & Members */}
        <div className="lg:col-span-2 space-y-6">

          {/* Activities List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="font-bold text-slate-800 text-lg font-display">Default Activities</h2>
            </div>

            {default_activities.length === 0 ? (
              <div className="text-center py-8 opacity-50 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="font-medium text-slate-500">No default activities defined for this group.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {default_activities.map((a) => (
                  <div key={a._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all group/act">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-700 font-display group-hover/act:text-brand-600 transition-colors">
                        {a.title}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${activityTypeColors[a.frequency] || 'bg-slate-100 text-slate-500'}`}>
                        {a.frequency}
                      </span>
                    </div>
                    {a.description && <p className="text-xs text-slate-500">{a.description}</p>}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {a.points && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">💎 {a.points} pts</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-400" />
                <h2 className="font-bold text-slate-800 text-lg font-display">Group Members</h2>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 shadow-sm">
                Total: {members.length}
              </span>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="font-medium text-slate-500">No members in this group yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Member</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {members.map((u) => {
                      const isAdmin = group?.admin_id?._id === u._id;
                      return (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => navigate(`/users/${u._id}`)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase shrink-0 text-xs">
                                {(u.name || 'U').charAt(0)}
                              </div>
                              <span className={`font-bold ${isAdmin ? 'text-amber-600' : 'text-slate-800'}`}>{u.name || 'Unnamed'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{u.email || '—'}</td>
                          <td className="px-6 py-4">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-1 rounded-md border border-amber-100">
                                <Crown size={12} /> Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Member</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Group"
        message={`Are you sure you want to permanently delete "${group?.name}"? All associated activities will be lost.`}
        confirmText="Yes, delete it"
        cancelText="Cancel"
        type="danger"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/groups');
        }}
        title="Group Deleted"
        message="The group has been permanently deleted."
      />
    </div>
  );
}
