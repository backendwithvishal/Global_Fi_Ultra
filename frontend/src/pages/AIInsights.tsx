import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, StopCircle, Trash2, Sparkles, TrendingUp, BarChart3, Brain, Loader2, User, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/common/PageHeader'
import { useSharedWebSocket } from '@/components/layout/AppLayout'
import { aiApi } from '@/lib/api'
import type { SentimentResult, AssetAnalysis } from '@/types'
import { getSentimentColor } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

export function AIInsights() {
  const { toast } = useApp()
  const { connected, aiMessages, isAIStreaming, sendAIChat, stopAIStream, clearAIMessages } = useSharedWebSocket()

  const [chatInput, setChatInput]           = useState('')
  const [sentimentText, setSentimentText]   = useState('')
  const [sentimentResult, setSentResult]    = useState<SentimentResult | null>(null)
  const [sentimentLoading, setSentLoading]  = useState(false)
  const [analysisSymbol, setAnalysisSym]    = useState('AAPL')
  const [analysisResult, setAnalysisResult] = useState<AssetAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoad]  = useState(false)
  const [copiedId, setCopiedId]             = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])

  const handleSend = () => {
    if (!chatInput.trim() || isAIStreaming) return
    sendAIChat(chatInput.trim()); setChatInput('')
  }

  const handleSentiment = async () => {
    if (!sentimentText.trim()) return
    try { setSentLoading(true); const r = await aiApi.analyzeSentiment(sentimentText); setSentResult(r.data) }
    catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setSentLoading(false) }
  }

  const handleAnalysis = async () => {
    if (!analysisSymbol.trim()) return
    try {
      setAnalysisLoad(true)
      const r = await aiApi.analyzeAsset(analysisSymbol.toUpperCase(), { current: 150, change: 2.5, changePercent: 1.7, high: 155, low: 148, volume: 50000000 })
      setAnalysisResult(r.data)
    } catch (err) { toast.error('Failed', err instanceof Error ? err.message : 'Unknown') }
    finally { setAnalysisLoad(false) }
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000)
  }

  const trendCls = { bullish: 'text-emerald-400', bearish: 'text-red-400', neutral: 'text-amber-400' }

  return (
    <div className="p-5 sm:p-6 max-w-[1400px] mx-auto page-enter">
      <PageHeader
        title="AI Insights"
        description="Powered by Groq LLaMA — real-time financial intelligence"
        actions={
          <Badge variant={connected ? 'success' : 'destructive'} className="text-xs">
            {connected ? '● Live' : '○ Offline'}
          </Badge>
        }
      />

      {!connected && (
        <div className="mb-4 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/8 text-sm text-amber-300 flex items-center gap-2">
          <Bot className="h-4 w-4 shrink-0" />
          WebSocket not connected. AI chat requires a live backend connection.
        </div>
      )}

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="gap-1.5"><Bot className="h-3.5 w-3.5" />AI Chat</TabsTrigger>
          <TabsTrigger value="sentiment" className="gap-1.5"><Brain className="h-3.5 w-3.5" />Sentiment</TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Analysis</TabsTrigger>
        </TabsList>

        {/* ── Chat ── */}
        <TabsContent value="chat">
          <Card className="flex flex-col" style={{ height: '600px' }}>
            <CardHeader className="pb-3 border-b border-border/60 flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                Financial AI Assistant
              </CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={clearAIMessages} disabled={aiMessages.length === 0} aria-label="Clear chat">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
              {aiMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Ask me anything about finance</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-5">
                    Analyze markets, explain trends, compare assets, and get investment insights.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                    {[
                      'What factors affect Bitcoin price?',
                      'Explain Fed interest rate policy',
                      'Growth vs value investing strategies',
                      'Good portfolio allocation for 2025?',
                    ].map((p) => (
                      <button key={p} onClick={() => setChatInput(p)}
                        className="text-left text-xs p-3 rounded-xl border border-border/60 bg-secondary/40 hover:bg-secondary hover:border-border transition-all text-muted-foreground hover:text-foreground">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {aiMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary border border-border/60'}`}>
                      {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <div className={`group relative max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-secondary border border-border/60 text-foreground rounded-tl-sm'}`}>
                        {msg.content || (msg.isStreaming && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-xs">Thinking…</span>
                          </span>
                        ))}
                        {msg.isStreaming && msg.content && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
                      </div>
                      {msg.content && !msg.isStreaming && (
                        <button onClick={() => handleCopy(msg.content, msg.id)}
                          className="absolute -top-1 -right-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-secondary"
                          aria-label="Copy">
                          {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-border/60">
              <div className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={connected ? 'Ask about markets, stocks, crypto…' : 'Connect to backend to chat'}
                  disabled={!connected || isAIStreaming} className="flex-1" />
                {isAIStreaming ? (
                  <Button variant="destructive" size="icon" onClick={stopAIStream} aria-label="Stop">
                    <StopCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="icon" onClick={handleSend} disabled={!connected || !chatInput.trim()} aria-label="Send">
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                AI responses are for informational purposes only. Not financial advice.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ── Sentiment ── */}
        <TabsContent value="sentiment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2"><Brain className="h-4 w-4 text-purple-400" />Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="sent-text" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Text to analyze</label>
                  <Textarea id="sent-text" value={sentimentText} onChange={(e) => setSentimentText(e.target.value)}
                    placeholder="Paste a news headline, article excerpt, or any financial text…" className="h-32" />
                </div>
                <Button onClick={handleSentiment} loading={sentimentLoading} disabled={!sentimentText.trim()} className="w-full gap-2">
                  <Brain className="h-4 w-4" />Analyze Sentiment
                </Button>
              </CardContent>
            </Card>

            {sentimentResult && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <Card>
                  <CardHeader className="pb-3"><CardTitle>Analysis Result</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/60 border border-border/40">
                      <span className="text-sm text-muted-foreground">Sentiment</span>
                      <span className={`text-lg font-bold capitalize ${getSentimentColor(sentimentResult.sentiment)}`}>{sentimentResult.sentiment}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-semibold text-foreground">{sentimentResult.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${sentimentResult.confidence}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${sentimentResult.sentiment === 'bullish' || sentimentResult.sentiment === 'positive' ? 'bg-emerald-500' : sentimentResult.sentiment === 'bearish' || sentimentResult.sentiment === 'negative' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      </div>
                    </div>
                    {sentimentResult.reasoning && (
                      <div className="p-3 rounded-xl bg-secondary/60 border border-border/40 text-sm text-muted-foreground leading-relaxed">{sentimentResult.reasoning}</div>
                    )}
                    {sentimentResult.keywords && sentimentResult.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {sentimentResult.keywords.map((kw) => <Badge key={kw} variant="muted" className="text-xs">{kw}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* ── Analysis ── */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-400" />Asset Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="an-sym" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Symbol</label>
                  <Input id="an-sym" value={analysisSymbol} onChange={(e) => setAnalysisSym(e.target.value.toUpperCase())} placeholder="AAPL, BTC, TSLA…" />
                </div>
                <p className="text-xs text-muted-foreground">Uses mock price data for demonstration. Connect to live feeds in production.</p>
                <Button onClick={handleAnalysis} loading={analysisLoading} disabled={!analysisSymbol.trim()} className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />Analyze Asset
                </Button>
              </CardContent>
            </Card>

            {analysisResult && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{analysisResult.symbol}</CardTitle>
                      <Badge className={`capitalize ${analysisResult.recommendation === 'buy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : analysisResult.recommendation === 'sell' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {analysisResult.recommendation?.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Trend',      value: analysisResult.trend,      cls: trendCls[analysisResult.trend as keyof typeof trendCls] ?? '' },
                        { label: 'Risk Level', value: analysisResult.riskLevel,  cls: '' },
                        ...(analysisResult.support    ? [{ label: 'Support',    value: `$${analysisResult.support}`,    cls: '' }] : []),
                        ...(analysisResult.resistance ? [{ label: 'Resistance', value: `$${analysisResult.resistance}`, cls: '' }] : []),
                      ].map((s) => (
                        <div key={s.label} className="p-3 rounded-xl bg-secondary/60 border border-border/40">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                          <p className={`text-sm font-semibold capitalize mt-0.5 text-foreground ${s.cls}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    {analysisResult.reasoning && (
                      <div className="p-3 rounded-xl bg-secondary/60 border border-border/40 text-sm text-muted-foreground leading-relaxed">{analysisResult.reasoning}</div>
                    )}
                    <p className="text-[10px] text-muted-foreground">⚠ Not financial advice. For educational purposes only.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
