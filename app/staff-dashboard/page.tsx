'use client'
import { useState, useEffect } from 'react'

export default function StaffDashboard() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/reminders?all=true') 
        const data = await res.json()
        setReminders(data.reminders || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F2] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-black/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-[#1a1410] tracking-tight">Staff Dashboard</h1>
            <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] mt-2">Asuka Couture AI Management</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#a17a58] font-bold">Live Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-mono uppercase">Systems Nominal</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Active Reminders" value={reminders.length} />
          <StatCard title="Recent Leads" value="12" subtitle="+3 today" />
          <StatCard title="Conversion Rate" value="18%" subtitle="AI Assisted" />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="p-6 border-b border-black/5 bg-black/[0.02]">
            <h2 className="text-lg font-medium">Upcoming Occasion Reminders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-black/40 border-b border-black/5">
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Occasion</th>
                  <th className="p-4 font-medium">Event Date</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-12 text-center text-black/20 font-mono tracking-widest">Loading Records...</td></tr>
                ) : reminders.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-black/20 font-mono tracking-widest">No Active Reminders</td></tr>
                ) : reminders.map((r, i) => (
                  <tr key={i} className="border-b border-black/[0.02] hover:bg-black/[0.01] transition-colors">
                    <td className="p-4 font-mono text-sm">{r.email || r.phone}</td>
                    <td className="p-4 uppercase text-[11px] tracking-wider">{r.occasion}</td>
                    <td className="p-4 text-sm">{new Date(r.eventDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest ${r.sent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.sent ? 'Sent' : 'Queued'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-serif">{value}</h3>
        {subtitle && <span className="text-[10px] text-green-600 font-bold uppercase">{subtitle}</span>}
      </div>
    </div>
  )
}
