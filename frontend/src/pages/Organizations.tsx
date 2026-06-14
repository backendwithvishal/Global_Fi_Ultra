import React, { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import { Users, Mail, UserPlus, ShieldAlert, X } from 'lucide-react'

export function Organizations() {
  const { currentOrganization, token, toast, refreshUserOrganizations } = useApp()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Member')
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch pending invites
  const fetchInvites = useCallback(async () => {
    if (!currentOrganization || !token) return
    try {
      const res = await fetch(`http://localhost:4000/api/v1/organizations/${currentOrganization._id}/invites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.invites) {
        setInvites(data.invites)
      }
    } catch {
      // Mock values when offline
      setInvites([
        { _id: 'invite1', email: 'analyst@starfunds.com', role: 'Manager', status: 'Pending', expiresAt: new Date(Date.now() + 864000000).toLocaleDateString() }
      ])
    }
  }, [currentOrganization, token])

  useEffect(() => {
    fetchInvites()
  }, [fetchInvites])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !currentOrganization) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/api/v1/organizations/${currentOrganization._id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, role })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Invitation Sent!', `An email invitation was registered for ${email}.`)
        setEmail('')
        fetchInvites()
      } else {
        toast.error('Invitation Failed', data.error || 'Failed to send team invitation')
      }
    } catch {
      // Mock offline invite addition
      setInvites(prev => [
        ...prev,
        { _id: `invite_${Math.random()}`, email, role, status: 'Pending', expiresAt: new Date(Date.now() + 864000000).toLocaleDateString() }
      ])
      toast.success('Invitation Registered (Offline)!', `An invitation for ${email} was created.`)
      setEmail('')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the organization workspace?')) {
      return
    }

    try {
      const res = await fetch(`http://localhost:4000/api/v1/organizations/${currentOrganization?._id}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        toast.success('Member Removed', 'The user was removed from the organization workspace.')
        refreshUserOrganizations()
      } else {
        const data = await res.json()
        toast.error('Action Failed', data.error || 'Failed to remove member')
      }
    } catch {
      toast.error('Action Failed', 'Network failure, could not remove member offline.')
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/organizations/${currentOrganization?._id}/members/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        toast.success('Role Updated', 'The user role has been successfully modified.')
        refreshUserOrganizations()
      } else {
        const data = await res.json()
        toast.error('Action Failed', data.error || 'Failed to change role')
      }
    } catch {
      toast.error('Action Failed', 'Network failure, could not change role offline.')
    }
  }

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Teams & Workspaces</h1>
        <p className="text-[11px] text-[var(--text-3)]">Manage members, configure security permissions, and invite new colleagues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Members List */}
        <div className="card p-6 border-[var(--border-2)] md:col-span-2 space-y-4">
          <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--accent-bright)]" /> Active Members in Workspace
          </h2>

          <div className="space-y-3">
            {currentOrganization?.members.map(member => (
              <div key={member.userId._id} className="p-4 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--bg-4)] flex items-center justify-center font-bold text-white text-[12px]">
                    {member.userId.firstName.charAt(0)}{member.userId.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">{member.userId.firstName} {member.userId.lastName}</h4>
                    <p className="text-[11px] text-[var(--text-3)]">{member.userId.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role Selector */}
                  {member.role !== 'Owner' ? (
                    <select
                      className="px-2.5 py-1 text-[11px] bg-[var(--bg-input)] border border-[var(--border-2)] rounded-lg text-[var(--text-2)] hover:text-white cursor-pointer"
                      value={member.role}
                      onChange={e => handleRoleChange(member.userId._id, e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Member">Member</option>
                      <option value="Guest">Guest</option>
                    </select>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-900/40 uppercase">Owner</span>
                  )}

                  {member.role !== 'Owner' && (
                    <button 
                      onClick={() => handleRemoveMember(member.userId._id)}
                      className="p-1 rounded bg-[var(--danger-subtle)] text-[var(--danger-bright)] hover:bg-[var(--danger-border)]/20 transition-colors"
                      title="Remove Member"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Form */}
        <div className="card p-6 border-[var(--border-3)] h-fit">
          <h2 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[var(--success-bright)]" /> Invite Collaborator
          </h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="section-label mb-2 block">Colleague Email</label>
              <input 
                type="email" 
                required
                placeholder="analyst@firm.com" 
                className="input-premium"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="section-label mb-2 block">Assigned Workspace Role</label>
              <select 
                className="input-premium cursor-pointer"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="Admin">Admin (Full settings access)</option>
                <option value="Manager">Manager (Edit watchlists & alerts)</option>
                <option value="Member">Member (Read/Write watchlists)</option>
                <option value="Guest">Guest (Read only)</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all disabled:opacity-50"
            >
              {loading ? 'Sending invite...' : 'Send Email Invitation'}
            </button>
          </form>
        </div>

      </div>

      {/* Pending Invites list */}
      <div className="card p-6 border-[var(--border-2)]">
        <h2 className="text-[14px] font-bold text-white mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[var(--text-3)]" /> Pending Invitations
        </h2>

        {invites.length === 0 ? (
          <p className="text-center py-6 text-[var(--text-3)] text-[12px]">No pending team invitation links.</p>
        ) : (
          <div className="space-y-3">
            {invites.map(invite => (
              <div key={invite._id} className="p-3.5 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-white font-mono">{invite.email}</span>
                  <span className="text-[10px] text-[var(--text-3)]">Role: {invite.role}</span>
                  <span className="text-[10px] text-[var(--text-3)]">Expires: {invite.expiresAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--warning-subtle)] text-[var(--warning-bright)] border border-[var(--warning-border)]">Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
export default Organizations;
