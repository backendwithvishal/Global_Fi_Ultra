import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, StopCircle, Trash2, Sparkles, TrendingUp,
  Brain, Loader2, User, Copy, Check, BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSharedWebSocket } from '@/components/layout/AppLayout'
import { aiApi } from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import type { SentimentResult, AssetAnalysis } from '@/types'

// Level 2 card + Level 3 input
const cardCls  = 'bg-[var(--bg-2)] border border-[var(--border-2)] rounded-xl p-5'
const inputCls = 'w-full h-9 bg-[var(--bg-input)] border border-[var(--border-2)] hover:border-[var(--border-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] rounded-lg px-3 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] transition-all duration-150'

const TAB_CLASSES = (active: boolean) =>
  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
    active
      ? 'bg-[var(--accent-subtle)] text-[var(--accent-bright)] border border-[rgba(37,99,235,0.25)]'
      : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-4)]'
  }`

export function AIInsights() {
  const toast = useToast()
  const { connected, aiMessages, isAIStreaming, sendAIChat, stopAIStream, clearAIMessages } = useSharedWebSocket()
  const [tab, setTab]               = useState<'chat' | 'sentiment' | 'analysis'>('chat')
  const [chatInput, setInput]       = useState('')
  const [sentText, setSentText]     = useState('')
  const [sentResult, setSentResult] = useState<SentimentResult | null>(null)
  const [sentLoading, setSentLoad]  = useState(false)
  const [anSym, setAnSym]           = useState('AAPL')
  const [anResult, setAnResult]     = useState<AssetAnalysis | null>(null)
  const [anLoading, setAnLoad]      = useState(false)
  const [copiedId, setCopied]       = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])

  const handleSend = () => {
    if (!chatInput.trim() || isAIStreaming) return
    sendAIChat(chatInput.trim())
    setInput('')
  }

  const handleSentiment = async () => {
    if (!sentText.trim()) return
    try {
      setSentLoad(true)
      const r = await aiApi.analyzeSentiment(sentText)
      setSentResult(r.data)
    } catch {
      toast.error('Analysis failed', 'Backend unreachable.')
    } finally { setSentLoad(false) }
  }

  const handleAnalysis = async () => {
    if (!anSym.trim()) return
    try {
      setAnLoad(true)
      const r = await aiApi.analyzeAsset(anSym.toUpperCase(), {
        current: 150, change: 2.5, changePercent: 1.7, high: 155, low: 148, volume: 50000000,
      })
      setAnResult(r.data)
    } catch {
      toast.error('Analysis failed', 'Backend unreachable.')
    } finally { setAnLoad(false) }
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Trend colour per spec
  const trendColor: Record<string, string> = {
    bullish: 'text-[var(--success-bright)]',
    bearish: 'text-[var(--danger-bright)]',
    neutral: 'text-[var(--warning-bright)]',
  }

  const PROMPTS = [
    'What factors are driving Bitcoin right now?',
    'Explain the Fed interest rate policy',
    'Compare growth vs value investing',
    'Best portfolio allocation for 2025?',
  ]

  return (
    <div className="p-5 sm:p-6 max-w-[1400px] mx-auto page-enter animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[var(--text-1)]">AI Insights</h1>
            {/* Purple accent for AI feature */}
            <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-semibold">AI</span>
            <Badge variant={connected ? 'green' : 'red'} dot>{connected ? 'Live' : 'Offline'}</Badge>
          </div>
          <p className="text-xs text-[var(--text-3)] mt-0.5">Powered by Groq LLaMA — real-time financial intelligence</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 bg-[var(--bg-2)] border border-[var(--border-2)] rounded-xl p-1 w-fit">
        <button className={TAB_CLASSES(tab === 'chat')}      onClick={() => setTab('chat')}>
          <Bot className="h-3.5 w-3.5" />AI Chat
        </button>
        <button className={TAB_CLASSES(tab === 'sentiment')} onClick={() => setTab('sentiment')}>
          <Brain className="h-3.5 w-3.5 text-[var(--ai-bright)]" />Sentiment
        </button>
        <button className={TAB_CLASSES(tab === 'analysis')}  onClick={() => setTab('analysis')}>
          <BarChart3 className="h-3.5 w-3.5" />Analysis
        </button>
      </div>

      {/* ── Chat tab ── */}
      {tab === 'chat' && (
        <div
          className="bg-[var(--bg-2)] border border-[var(--border-2)] rounded-xl flex flex-col"
          style={{ height: '580px' }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-2)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--ai-subtle)] border border-[var(--ai-border)]">
                <Bot className="h-3.5 w-3.5 text-[var(--ai-bright)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-1)]">Financial AI Assistant</span>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={clearAIMessages} aria-label="Clear chat" disabled={aiMessages.length === 0}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-5 rounded-2xl bg-[var(--ai-subtle)] border border-[var(--ai-border)] mb-4">
                  <Sparkles className="h-9 w-9 text-[var(--ai-bright)]" />
                </div>
                <h3 className="font-bold text-[var(--text-1)] mb-1">Ask me anything about finance</h3>
                <p className="text-sm text-[var(--text-2)] max-w-sm mb-5">Analyze markets, explain trends, compare assets, get AI insights.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => setInput(p)}
                      className="text-left text-xs p-3 rounded-xl border border-[var(--border-2)] bg-[var(--bg-3)] hover:bg-[var(--bg-4)] hover:border-[var(--border-3)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <AnimatePresence>
              {aiMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-[var(--accent)]' : 'bg-[var(--bg-4)]'}`}>
                    {msg.role === 'user'
                      ? <User className="h-3.5 w-3.5 text-white" />
                      : <Bot className="h-3.5 w-3.5 text-[var(--text-2)]" />
                    }
                  </div>
                  <div className={`group relative max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-tr-sm'
                        : 'bg-[var(--bg-3)] text-[var(--text-1)] border border-[var(--border-2)] rounded-tl-sm'
                    }`}>
                      {msg.content || (msg.isStreaming && (
                        <span className="flex items-center gap-1.5 text-[var(--text-3)]">
                          <Loader2 className="h-3 w-3 animate-spin" />Thinking…
                        </span>
                      ))}
                      {msg.isStreaming && msg.content && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
                    </div>
                    {msg.content && !msg.isStreaming && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute -top-1 -right-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[var(--bg-4)]"
                      >
                        {copiedId === msg.id
                          ? <Check className="h-3 w-3 text-[var(--success-bright)]" />
                          : <Copy className="h-3 w-3 text-[var(--text-3)]" />
                        }
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-[var(--border-2)] shrink-0">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={connected ? 'Ask about markets, stocks, crypto…' : 'Connect to backend to chat'}
                disabled={!connected || isAIStreaming}
                className={inputCls + ' flex-1 disabled:opacity-40'}
              />
              {isAIStreaming
                ? <Button variant="danger" size="icon" onClick={stopAIStream} aria-label="Stop">
                    <StopCircle className="h-4 w-4" />
                  </Button>
                : <Button size="icon" onClick={handleSend} disabled={!connected || !chatInput.trim()} aria-label="Send">
                    <Send className="h-4 w-4" />
                  </Button>
              }
            </div>
            <p className="text-[10px] text-[var(--text-3)] mt-2 text-center">
              AI responses are informational only. Not financial advice.
            </p>
          </div>
        </div>
      )}

      {/* ── Sentiment tab ── */}
      {tab === 'sentiment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-[var(--ai-bright)]" />
              <h3 className="text-sm font-semibold text-[var(--text-1)]">Sentiment Analysis</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5 uppercase tracking-wider">
                  Text to analyze
                </label>
                <textarea
                  value={sentText}
                  onChange={e => setSentText(e.target.value)}
                  placeholder="Paste a news headline, article, or any financial text…"
                  className={inputCls + ' py-2 resize-none'}
                  style={{ height: '8rem' }}
                />
              </div>
              <Button onClick={handleSentiment} loading={sentLoading} disabled={!sentText.trim()} className="w-full" icon={<Brain className="h-4 w-4" />}>
                Analyze Sentiment
              </Button>
            </div>
          </div>

          {sentResult && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={cardCls + ' space-y-4'}>
              <h3 className="text-sm font-semibold text-[var(--text-1)]">Result</h3>
              {/* Sentiment badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-3)]">
                <span className="text-sm text-[var(--text-2)]">Sentiment</span>
                <span className={`text-lg font-bold capitalize ${
                  sentResult.sentiment === 'bullish' || sentResult.sentiment === 'positive'
                    ? 'text-[var(--success-bright)]'
                    : sentResult.sentiment === 'bearish' || sentResult.sentiment === 'negative'
                    ? 'text-[var(--danger-bright)]'
                    : 'text-[var(--warning-bright)]'
                }`}>{sentResult.sentiment}</span>
              </div>
              {/* Confidence bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-2)]">Confidence</span>
                  <span className="font-semibold text-[var(--text-1)]">{sentResult.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-5)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sentResult.confidence}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      sentResult.sentiment === 'bullish' || sentResult.sentiment === 'positive'
                        ? 'bg-[var(--success)]'
                        : sentResult.sentiment === 'bearish' || sentResult.sentiment === 'negative'
                        ? 'bg-[var(--danger)]'
                        : 'bg-[var(--warning)]'
                    }`}
                  />
                </div>
              </div>
              {sentResult.reasoning && (
                <div className="p-3 rounded-xl bg-[var(--bg-3)] text-sm text-[var(--text-2)] leading-relaxed">
                  {sentResult.reasoning}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* ── Analysis tab ── */}
      {tab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[var(--accent-bright)]" />
              <h3 className="text-sm font-semibold text-[var(--text-1)]">Asset Analysis</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5 uppercase tracking-wider">
                  Symbol
                </label>
                <input
                  value={anSym}
                  onChange={e => setAnSym(e.target.value.toUpperCase())}
                  placeholder="AAPL, BTC, TSLA…"
                  className={inputCls}
                />
              </div>
              <p className="text-xs text-[var(--text-3)]">
                Uses mock price data for demo. Connect live feeds in production.
              </p>
              <Button onClick={handleAnalysis} loading={anLoading} disabled={!anSym.trim()} className="w-full" icon={<TrendingUp className="h-4 w-4" />}>
                Analyze Asset
              </Button>
            </div>
          </div>

          {anResult && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={cardCls + ' space-y-4'}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-1)]">{anResult.symbol}</h3>
                <Badge variant={anResult.recommendation === 'buy' ? 'green' : anResult.recommendation === 'sell' ? 'red' : 'amber'}>
                  {anResult.recommendation?.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Trend',      value: anResult.trend,     cls: trendColor[anResult.trend] ?? 'text-[var(--text-1)]' },
                  { label: 'Risk Level', value: anResult.riskLevel, cls: 'text-[var(--text-1)]' },
                  anResult.support    ? { label: 'Support',    value: `$${anResult.support}`,    cls: 'text-[var(--text-1)]' } : null,
                  anResult.resistance ? { label: 'Resistance', value: `$${anResult.resistance}`, cls: 'text-[var(--text-1)]' } : null,
                ].filter(Boolean).map((s: any) => (
                  <div key={s.label} className="p-3 rounded-xl bg-[var(--bg-3)]">
                    <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wider">{s.label}</p>
                    <p className={`text-sm font-semibold capitalize mt-0.5 ${s.cls}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              {anResult.reasoning && (
                <div className="p-3 rounded-xl bg-[var(--bg-3)] text-sm text-[var(--text-2)] leading-relaxed">
                  {anResult.reasoning}
                </div>
              )}
              <p className="text-[10px] text-[var(--text-3)]">⚠ Not financial advice. For educational purposes only.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
