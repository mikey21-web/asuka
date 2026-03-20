'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb() {
    const pathname = usePathname()
    if (!pathname || pathname === '/' || pathname === '/ethnic-home' || pathname === '/western-home') return null

    const segments = pathname.split('/').filter(Boolean)
    const crumbs = segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        return { href, label }
    })

    return (
        <nav className="breadcrumb page-width" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c, i) => (
                <span key={c.href}>
                    <span>›</span>
                    {i === crumbs.length - 1 ? (
                        <span style={{ color: '#1a1410' }}>{c.label}</span>
                    ) : (
                        <Link href={c.href}>{c.label}</Link>
                    )}
                </span>
            ))}
        </nav>
    )
}
