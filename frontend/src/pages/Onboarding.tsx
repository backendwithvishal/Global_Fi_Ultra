import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Check, Compass, Briefcase, Settings2 } from 'lucide-react'

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [orgName, setOrgName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [defaultStock, setDefaultStock] = useState('AAPL')
  const [isLoading, setIsLoading] = useState(false)
  
  const { currentUser, token, setCurrentUser, setCurrentOrganization, toast } = useApp()
  const navigate = useNavigate()

  const handleCreateWorkspace = async () => {
    if (!orgName) {
      toast.error('Workspace Name Required', 'Please provide a name for your organization workspace.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/v1/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: orgName })
      })
      const data = await res.json()
      if (res.ok && data.org) {
        setCurrentOrganization(data.org)
        setStep(3)
      } else {
        toast.error('Workspace Setup Failed', data.error || 'Failed to create workspace')
      }
    } catch {
      // Fallback offline mock creation
      const mockOrg = {
        _id: `org_${Math.random().toString(36).substring(7)}`,
        name: orgName,
        slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ownerId: currentUser?._id || 'user_id',
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setCurrentOrganization(mockOrg)
      setStep(3)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinishOnboarding = async () => {
    if (!currentUser) return
    setIsLoading(true)

    try {
      const res = await fetch(`http://localhost:4000/api/v1/users/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: {
            ...currentUser.preferences,
            defaultCurrency: currency,
            defaultStockSymbol: defaultStock
          }
        })
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        toast.success('Setup Completed!', 'Welcome to Global-Fi Ultra console.')
        navigate('/')
      } else {
        toast.error('Saving Preferences Failed', data.error || 'Failed to update preferences')
      }
    } catch {
      // Fallback offline update
      const updatedUser = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          defaultCurrency: currency,
          defaultStockSymbol: defaultStock
        }
      }
      setCurrentUser(updatedUser)
      toast.success('Setup Completed (Offline)!', 'Welcome to Global-Fi Ultra console.')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center py-20 px-6 font-sans">
      <div className="w-full max-w-[500px] card p-8 border-[var(--border-3)] bg-[var(--bg-2)]/90 shadow-[var(--shadow-float)]">
        
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-10 border-b border-[var(--border-2)] pb-4">
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${step >= 1 ? 'text-[var(--accent-bright)] font-bold' : 'text-[var(--text-3)]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                step > 1 ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-3)]'
              }`}>{step > 1 ? <Check className="w-3 h-3" /> : '1'}</span> Info
            </div>
            <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${step >= 2 ? 'text-[var(--accent-bright)] font-bold' : 'text-[var(--text-3)]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                step > 2 ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-3)]'
              }`}>{step > 2 ? <Check className="w-3 h-3" /> : '2'}</span> Team
            </div>
            <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${step >= 3 ? 'text-[var(--accent-bright)] font-bold' : 'text-[var(--text-3)]'}`}>
              <span className="w-5 h-5 rounded-full border border-[var(--border-3)] flex items-center justify-center text-[10px]">3</span> Rules
            </div>
          </div>
        </div>

        {/* Step 1: Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-bright)] mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to Global-Fi Ultra</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed">Let's set up your team dashboard preferences to make the most of real-time market insights.</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--bg-3)] border border-[var(--border-1)] space-y-3">
              <h4 className="text-[11px] font-semibold text-[var(--text-2)] uppercase tracking-wider">Quick Walkthrough Checklist</h4>
              <p className="text-[12px] text-[var(--text-2)]">✓ Build workspaces for team members collaboration</p>
              <p className="text-[12px] text-[var(--text-2)]">✓ Run price indicators triggers to emails/sockets</p>
              <p className="text-[12px] text(--text-2)">✓ Setup API access tokens for custom scripts</p>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all"
            >
              Continue to Workspace Setup
            </button>
          </div>
        )}

        {/* Step 2: Create Organization Workspace */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--success-subtle)] flex items-center justify-center text-[var(--success-bright)] mx-auto mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Configure Collaborative Team</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed">Name your workspace. You will be able to invite managers, analysts, and traders to collaborate on watchlists.</p>
            </div>
            <div>
              <label className="section-label mb-2 block">Organization Workspace Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. BlueStar Capital, CryptoLabs" 
                className="input-premium"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
              />
              <span className="text-[10px] text-[var(--text-3)] mt-1.5 block">
                Your workspace slug will automatically generate as: <strong>{orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'workspace-slug'}</strong>
              </span>
            </div>
            <button 
              onClick={handleCreateWorkspace}
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Workspace...' : 'Create Workspace & Next'}
            </button>
          </div>
        )}

        {/* Step 3: Preferences Settings */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-950/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
                <Settings2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Display Preferences</h2>
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed">Select default currencies and stock tickers to populate dashboard layouts on launch.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="section-label mb-2 block">Default Currency Display</label>
                <div className="grid grid-cols-2 gap-3">
                  {['USD', 'EUR'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`py-2 text-[12px] font-bold rounded-lg border transition-all ${
                        currency === c 
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent-bright)]' 
                          : 'bg-[var(--bg-3)] border-[var(--border-2)] text-[var(--text-3)] hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label mb-2 block">Primary Stock Watch Ticker</label>
                <select 
                  className="input-premium cursor-pointer"
                  value={defaultStock}
                  onChange={e => setDefaultStock(e.target.value)}
                >
                  <option value="AAPL">AAPL - Apple Inc.</option>
                  <option value="MSFT">MSFT - Microsoft Corp.</option>
                  <option value="NVDA">NVDA - NVIDIA Corp.</option>
                  <option value="GOOGL">GOOGL - Alphabet Inc.</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleFinishOnboarding}
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[12px] font-bold text-white shadow-[var(--shadow-accent)] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving Setup...' : 'Finish Setup & Open Console'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
export default Onboarding;
