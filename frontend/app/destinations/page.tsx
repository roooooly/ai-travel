'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Destination {
  id: number
  name: string
  city: string
  province: string
  description: string
  image_url: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/destinations`)
      .then(r => r.json())
      .then(data => setDestinations(data || []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false))
  }, [])

  const cityList = destinations.map(d => d.city)
  const uniqueCities = cityList.filter((city, index) => cityList.indexOf(city) === index)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <main style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '20px', color: '#333' }}>📍 目的地</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>加载中...</div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>暂无数据</div>
        ) : uniqueCities.map(city => (
          <div key={city} style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '16px', color: '#333' }}>{city}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {destinations.filter(d => d.city === city).map(dest => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.id}`}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <div style={{ height: '100px', overflow: 'hidden' }}>
                    <img
                      src={dest.image_url}
                      alt={dest.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/200x100?text=目的地' }}
                    />
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#333', marginBottom: '4px' }}>{dest.name}</div>
                    <div style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dest.description.slice(0, 20)}...
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
