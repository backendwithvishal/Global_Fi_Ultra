import React, { useState } from 'react'
import { Plus, Users as UsersIcon, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { UserSearch } from '@/components/users/UserSearch'
import { UserTable } from '@/components/users/UserTable'
import { CreateUserModal } from '@/components/users/CreateUserModal'
import { useUsers } from '@/hooks/useUsers'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Users() {
  const toast = useToast()
  const { users, loading, usingMock, page, totalPages, setPage, deleteUser, addUser } = useUsers()
  const [search, setSearch]     = useState('')
  const [createOpen, setCreate] = useState(false)
  const [deletingId, setDel]    = useState<string | null>(null)

  const filtered = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, name: string) => {
    setDel(id); await deleteUser(id); setDel(null)
    toast.success('User deleted', `${name} has been removed.`)
  }

  return (
    <div className="p-5 sm:p-8 max-w-[1200px] mx-auto page-enter animate-fade-in">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight">Users</h1>
            {usingMock && <Badge variant="amber" dot>Demo</Badge>}
            {!loading && (
              <span className="text-xs text-[var(--text-3)] bg-[var(--bg-3)] border border-[var(--border-2)] px-2.5 py-1 rounded-full">
                {users.length} total
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-3)]">Manage user accounts and permissions</p>
        </div>
        <Button size="sm" onClick={() => setCreate(true)} icon={<Plus className="h-3.5 w-3.5" />}>
          New User
        </Button>
      </motion.div>

      {/* ── Search ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="mb-4"
      >
        <UserSearch value={search} onChange={setSearch} />
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <UserTable users={filtered} loading={loading} deletingId={deletingId} onDelete={handleDelete} />
      </motion.div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-[var(--text-2)] px-3 py-1.5 rounded-lg bg-[var(--bg-3)] border border-[var(--border-2)]">
            Page {page} of {totalPages}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}

      <AnimatePresence>
        {createOpen && (
          <CreateUserModal
            onClose={() => setCreate(false)}
            onCreated={u => { addUser(u); toast.success('User created', `${u.firstName} ${u.lastName} added.`) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
