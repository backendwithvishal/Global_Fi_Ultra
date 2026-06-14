import React from 'react'
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react'

export function SecurityDocs() {
  const complianceChecks = [
    { title: 'SOC 2 Type II Alignment', desc: 'Our architecture enforces detailed access control, audit logs, and encryption mapping satisfying SOC 2 framework guidelines.' },
    { title: 'GDPR Compliance', desc: 'We support permanent user removal (hardDelete) endpoints and strict local cookies storage preferences.' },
    { title: 'ISO 27001 Controls', desc: 'Logical partition segregations on MongoDB and SSL/TLS transmission channels protect financial portfolios.' }
  ]

  return (
    <div className="min-h-screen text-[var(--text-1)] bg-[var(--bg-0)] py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Security & Compliance</h1>
          <p className="text-[13px] md:text-[15px] text-[var(--text-2)] max-w-xl mx-auto">
            Learn about how we isolate data structures, secure session cookies, and enforce rate limits.
          </p>
        </div>

        {/* Audit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {complianceChecks.map((check, idx) => (
            <div key={idx} className="card p-5 border-[var(--border-2)] flex flex-col items-start bg-[var(--bg-2)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--success-bright)] mb-4" />
              <h3 className="text-[13px] font-bold text-white mb-2">{check.title}</h3>
              <p className="text-[11px] text-[var(--text-3)] leading-relaxed">{check.desc}</p>
            </div>
          ))}
        </div>

        {/* Security Specs */}
        <div className="space-y-8 mb-16">
          <div className="card p-6 border-[var(--border-3)]">
            <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--accent-bright)]" /> Cryptography & Session Isolation
            </h3>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-4">
              All client sessions use HMAC-SHA256 JWT tokens. In production, these tokens are delivered via <strong>HTTP-Only Secure SameSite=Strict cookies</strong>. This restricts script access (mitigating XSS extraction attacks) and mitigates Cross-Site Request Forgery (CSRF).
            </p>
            <div className="p-3 bg-[var(--bg-3)] border border-[var(--border-1)] rounded-lg font-mono text-[11px] text-[var(--text-3)]">
              Set-Cookie: token=jwt_payload; Secure; HttpOnly; SameSite=Strict; Max-Age=604800
            </div>
          </div>

          <div className="card p-6 border-[var(--border-3)]">
            <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--success-bright)]" /> Infrastructure Firewalls & Limits
            </h3>
            <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-4">
              To defend our database against scraping and brute-force commands, we run a multi-tier rate limiter inside Express. Requests are monitored by IP and authenticated user identifier:
            </p>
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border-2)] text-[var(--text-3)]">
                  <th className="py-2">Endpoint Group</th>
                  <th className="py-2">Threshold Limits</th>
                  <th className="py-2">Window Size</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-2)]">
                <tr className="border-b border-[var(--border-1)]">
                  <td className="py-2 font-mono">/api/v1/auth/*</td>
                  <td className="py-2">5 requests</td>
                  <td className="py-2">15 Minutes</td>
                </tr>
                <tr className="border-b border-[var(--border-1)]">
                  <td className="py-2 font-mono">/api/v1/ai/*</td>
                  <td className="py-2">10 requests</td>
                  <td className="py-2">1 Minute</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">/api/v1/financial/*</td>
                  <td className="py-2">100 requests</td>
                  <td className="py-2">15 Minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-[var(--accent-subtle)] border border-[rgba(37,99,235,0.15)] flex items-start gap-3">
          <FileText className="w-5 h-5 text-[var(--accent-bright)] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[var(--text-2)] leading-relaxed">
            <strong>Security Notice:</strong> If you identify a potential logic flaw or vulnerability in our APIs or integrations, please submit a report immediately through our support ticketing system. We enforce a strict bug-bounty program for responsible disclosures.
          </div>
        </div>

      </div>
    </div>
  )
}
