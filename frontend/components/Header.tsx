'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { path: '/home', label: '首页', icon: '🏠' },
  { path: '/destinations', label: '目的地', icon: '📍' },
  { path: '/attractions', label: '景点', icon: '🏛️' },
  { path: '/restaurants', label: '美食', icon: '🍜' },
  { path: '/itinerary', label: 'AI规划', icon: '✨' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '12px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🧳</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>AI Travel</span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  color: isActive ? '#ffd700' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
