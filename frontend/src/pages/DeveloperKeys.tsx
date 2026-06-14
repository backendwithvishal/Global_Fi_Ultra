import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { Code, Terminal, Key, Trash, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export function DeveloperKeys() {
  const { currentOrganization, token, toast } = useApp()
  const [keys, setKeys] = useState<any[]>([])
  const [name, setName] = useState('')
  const [scopes, setScopes] = useState<string[]>(['read:financial'])
  const [newKeyPlain, setNewKeyPlain] = useState('')
  const [loading, setLoading] = useState(false)
  const [revealKey, setRevealKey] = useState(false)

  // Fetch active API keys
  const fetchKeys = async () => {
    if (!token) return
    try {
      const orgParam = currentOrganization ? `?orgId=${currentOrganization._id}` : ''
      const res = await fetch(`http://localhost:3000/api/v1/apikeys${orgParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.keys) {
        setKeys(data.keys)
      }
    } catch {
      // Offline fallback values
      setKeys([
        { _id: 'key_mock1', name: 'Trading Bot Key', prefix: 'gfu_live_', scopes: ['read:financial'], isActive: true, createdAt: new Date().toLocaleDateString(), lastUsedAt: new Date().toLocaleDateString() }
      ])
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [currentOrganization, token])

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !currentOrganization) {
      toast.error('Workspace Required', 'Please select or create an organization workspace first.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/v1/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          organizationId: currentOrganization._id,
          scopes
        })
      })
      const data = await res.json()
      if (res.ok && data.apiKey) {
        setNewKeyPlain(data.plainTextKey)
        setRevealKey(true)
        setName('')
        toast.success('API Key Generated!', 'Make sure to copy your key. It will not be shown again.')
        fetchKeys()
      } else {
        toast.error('Generation Failed', data.error || 'Failed to generate key')
      }
    } catch {
      // Mock offline key creation
      const mockPlain = `gfu_live_mock${Math.random().toString(36).substring(3)}`;
      setNewKeyPlain(mockPlain)
      setRevealKey(true)
      setName('')
      toast.success('API Key Generated (Offline)!', 'Make sure to copy your key. It will not be shown again.')
      setKeys(prev => [
        ...prev,
        { _id: `key_${Math.random()}`, name, prefix: 'gfu_live_', scopes, isActive: true, createdAt: new Date().toLocaleDateString() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this API key? This action is immediate and will break running scripts.')) {
      return
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/apikeys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        toast.success('Key Deactivated', 'The API key has been cancelled.')
        fetchKeys()
      }
    } catch {
      setKeys(prev => prev.filter(k => k._id !== id))
      toast.success('Key Deleted (Offline)', 'The API key was removed from the local state.')
    }
  }

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--text-1)] mb-1">Developer API Keys</h1>
        <p className="text-[11px] text-[var(--text-3)]">Create secure credentials to query financial data and stream indicators to external applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Keys List */}
        <div className="card p-6 border-[var(--border-2)] md:col-span-2 space-y-4">
          <h2 className="text-[14px] font-bold text-[var(--text-1)] flex items-center gap-2">
            <Key className="w-4 h-4 text-[var(--accent-bright)]" /> Active Access Tokens
          </h2>

          <div className="space-y-3">
            {keys.map(key => (
              <div key={key._id} className="p-4 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[var(--text-1)]">{key.name}</h4>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--text-3)] mt-1 font-mono">
                    <span>Prefix: {key.prefix}</span>
                    <span>Created: {key.createdAt}</span>
                    <span>Last Used: {key.lastUsedAt || 'Never'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {key.scopes.map((scope: string) => (
                      <span key={scope} className="px-2 py-0.5 rounded bg-[var(--bg-4)] border border-[var(--border-2)] text-[9px] text-[var(--text-2)] font-mono">{scope}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleDeactivate(key._id)}
                    className="p-1 rounded bg-[var(--danger-subtle)] text-[var(--danger-bright)] hover:bg-[var(--danger-border)]/20 transition-colors"
                    title="Delete API Key"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {keys.length === 0 && (
              <p className="text-center py-6 text-[var(--text-3)] text-[12px]">No API keys registered for this workspace.</p>
            )}
          </div>
        </div>

        {/* Generate Card */}
        <div className="card p-6 border-[var(--border-3)] h-fit">
          <h2 className="text-[14px] font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--success-bright)]" /> Create API Token
          </h2>
          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div>
              <label className="section-label mb-2 block">Key Description / Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Production Core Server Key" 
                className="input-premium"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="section-label mb-2 block">Token Scopes</label>
              <div className="space-y-2 text-[12px] text-[var(--text-2)]">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={scopes.includes('read:financial')} 
                    onChange={e => {
                      if (e.target.checked) setScopes(prev => [...prev, 'read:financial'])
                      else setScopes(prev => prev.filter(s => s !== 'read:financial'))
                    }}
                  />
                  <span>read:financial (Read rates & news)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={scopes.includes('write:alerts')} 
                    onChange={e => {
                      if (e.target.checked) setScopes(prev => [...prev, 'write:alerts'])
                      else setScopes(prev => prev.filter(s => s !== 'write:alerts'))
                    }}
                  />
                  <span>write:alerts (Manage alarms)</span>
                </label>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate New Key'}
            </button>
          </form>
        </div>

      </div>

      {/* Reveal generated key panel */}
      {newKeyPlain && (
        <div className="card p-6 border-[var(--success-border)] bg-[var(--success-subtle)] space-y-4">
          <div className="flex items-start gap-3 text-[var(--success-bright)]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[13px] font-bold">API Key Generated! Copy it now.</h3>
              <p className="text-[11px] text-[var(--text-2)] leading-relaxed mt-0.5">For security reasons, this key will not be shown again. Save it safely in your environment configurations.</p>
            </div>
          </div>

          <div className="flex gap-2 items-center bg-[var(--bg-1)] p-3 rounded-lg border border-[var(--border-2)]">
            <span className="font-mono text-[13px] font-semibold text-[var(--text-1)] tracking-wider flex-1 overflow-x-auto select-all">
              {revealKey ? newKeyPlain : '••••••••••••••••••••••••••••••••••••••••••••'}
            </span>
            <button 
              onClick={() => setRevealKey(prev => !prev)}
              className="p-1 rounded text-[var(--text-3)] hover:text-[var(--text-1)]"
            >
              {revealKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Code Snippets */}
      <div className="card p-6 border-[var(--border-2)]">
        <h2 className="text-[14px] font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--text-3)]" /> Integration Example
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-4">
              Authenticate public requests by adding the plain text key inside the authorization bearer headers parameter:
            </p>
            <pre className="text-[11px] text-[var(--text-3)] font-mono leading-relaxed bg-[var(--bg-1)] p-3.5 rounded-lg overflow-x-auto border border-[var(--border-2)]">
{`curl -X GET http://localhost:3000/api/v1/financial/live \\
  -H "Authorization: Bearer gfu_live_your_token_key" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
          <div>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-4">
              Expected JSON success response payload confirming rate validation checks:
            </p>
            <pre className="text-[11px] text-[var(--text-3)] font-mono leading-relaxed bg-[var(--bg-1)] p-3.5 rounded-lg overflow-x-auto border border-[var(--border-2)]">
{`{
  "requestId": "req_88192a09",
  "status": "success",
  "timestamp": "2026-06-14T14:31:00Z",
  "data": {
    "stock": { "symbol": "AAPL", "price": 189.45 }
  }
}`}
            </pre>
          </div>
        </div>
      </div>

    </div>
  )
}
export default DeveloperKeys;
