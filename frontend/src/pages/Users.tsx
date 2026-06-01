import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users as UsersIcon, Trash2, Edit, Search, UserCheck, UserX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { usersApi } from '@/lib/api'
import type { User } from '@/types'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const schema = z.object({
  email:     z.string().email('Invalid email'),
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  password:  z.string().min(6, 'Min 6 chars').optional().or(z.literal('')),
})
type Form = z.infer<typeof schema>

export function Users() {
  const { toast } = useApp()
  const [users, setUsers]         = useState<User[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [search, setSearch]       = useState('')
  const [createOpen, setCreate]   = useState(false)
  const [deletingId, setDeleting] = useState<string | null>(null)
  const [page, setPage]           = useState(1)
  const [totalPages, setTotal]    = useState(1)

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', firstName: '', lastName: '', password: '' },
  })

  const fetchUsers = useCallback(async () => {
    try { setLoading(true); setError(null)
      const r = await usersApi.list({ page, limit: 20 })
      setUsers(r.users ?? [])
      if (r.pagination) setTotal(r.pagination.totalPages ?? 1)
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCreate = async (data: Form) => {
    try {
      const u = await usersApi.create({ email: data.email, firstName: data.firstName, lastName: data.lastName, password: data.password || undefined })
      setUsers((p) => [u, ...p]); setCreate(false); form.reset()
      toast.success('User created', `${u.firstName} ${u.lastName} added.`)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
  }

  const handleDelete = async (id: string, name: string) => {
    try { setDeleting(id); await usersApi.delete(id); setUsers((p) => p.filter((u) => u._id !== id)); toast.success('Deleted', `${name} removed.`) }
    catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setDeleting(null) }
  }

  const filtered = users.filter((u) =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-5 sm:p-6 max-w-[1200px] mx-auto page-enter">
      <PageHeader
        title="Users"
        description="Manage user accounts"
        actions={
          <Button size="sm" onClick={() => setCreate(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New User
          </Button>
        }
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="pl-9" />
      </div>

      {error && <ErrorState message={error} onRetry={fetchUsers} className="mb-5" />}

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
              <Skeleton className="h-5 w-14 rounded-md" />
            </CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<UsersIcon className="h-10 w-10" />}
          title={search ? 'No users found' : 'No users yet'}
          description={search ? `No users match "${search}"` : 'Create the first user account.'}
          action={!search ? { label: 'Create User', onClick: () => setCreate(true) } : undefined} />
      ) : (
        <>
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((user, i) => (
                <motion.div key={user._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }} transition={{ delay: i * 0.025 }}>
                  <Card className="hover:border-border transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 text-primary font-bold text-sm shrink-0 border border-primary/20">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{user.firstName} {user.lastName}</span>
                            <Badge variant={user.isActive ? 'success' : 'destructive'} className="text-[10px]">
                              {user.isActive
                                ? <><UserCheck className="h-2.5 w-2.5 mr-1" />Active</>
                                : <><UserX className="h-2.5 w-2.5 mr-1" />Inactive</>}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap text-[10px] text-muted-foreground">
                            <span>Currency: {user.preferences?.defaultCurrency ?? 'USD'}</span>
                            <span>Joined {formatDate(user.createdAt)}</span>
                            <span>Updated {formatRelativeTime(user.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm" aria-label="Edit"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon-sm"
                            onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                            loading={deletingId === user._id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10" aria-label="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          )}
        </>
      )}

      <Dialog open={createOpen} onOpenChange={setCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user account to the system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {(['firstName', 'lastName'] as const).map((f) => (
                <div key={f} className="space-y-1.5">
                  <label htmlFor={`u-${f}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {f === 'firstName' ? 'First Name' : 'Last Name'} *
                  </label>
                  <Input id={`u-${f}`} {...form.register(f)} placeholder={f === 'firstName' ? 'John' : 'Doe'} error={!!form.formState.errors[f]} />
                  {form.formState.errors[f] && <p className="text-xs text-red-400">{form.formState.errors[f]?.message}</p>}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="u-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email *</label>
              <Input id="u-email" type="email" {...form.register('email')} placeholder="john@example.com" error={!!form.formState.errors.email} />
              {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="u-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
              <Input id="u-pw" type="password" {...form.register('password')} placeholder="Optional…" error={!!form.formState.errors.password} />
              {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreate(false)}>Cancel</Button>
              <Button type="submit" loading={form.formState.isSubmitting}>Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
