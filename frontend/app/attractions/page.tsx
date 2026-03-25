'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CITIES = ['全部', '上海', '北京', '成都', '杭州', '苏州', '深圳', '广州', '重庆', '西安', '南京']

interface Attraction {
  id: number
  name: string
  city: string
  description: string
  address: string
  image_url: string
  ticket_price: number
  rating: number
  recommended_duration: string
  tags: string
}

export default function AttractionsPage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttractions(city)
  }, [city])

  const fetchAttractions = (cityParam: string) => {
    setLoading(true)
    let url = `${API_URL}/api/attractions`
    if (cityParam && cityParam !== '全部') {
      url += `?city=${encodeURIComponent(cityParam)}`
    }
    fetch(url)
      .then(r => r.json())
      .then(data => setAttractions(data || []))
      .catch(() => setAttractions([]))
      .finally(() => setLoading(false))
  }

  const handleCityChange = (cityParam: string) => {
    setCity(cityParam)
    fetchAttractions(cityParam)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <main style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Page Title */}
        <h1 style={{ margin: '0 0 16px', fontSize: '20px', color: '#333' }}>🏛️ 探索景点</h1>

        {/* City Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCityChange(c === '全部' ? '' : c)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: (city === c || (c === '全部' && city === '')) ? '#667eea' : 'white',
                color: (city === c || (c === '全部' && city === '')) ? 'white' : '#666',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Attractions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>加载中...</div>
        ) : attractions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏛️</div>
            <p>暂无景点数据</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {attractions.map((attr) => (
              <div
                key={attr.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img
                    src={attr.image_url}
                    alt={attr.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x160?text=景点' }}
                  />
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{attr.name}</h3>
                      <span style={{ fontSize: '12px', color: '#667eea', background: '#f0f4ff', padding: '2px 8px', borderRadius: '10px' }}>
                        {attr.city}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', color: '#ff6b6b', fontWeight: 700 }}>
                        {attr.ticket_price === 0 ? '免费' : `¥${attr.ticket_price}`}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                    {attr.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                    <span>⏱️ {attr.recommended_duration}</span>
                    <span style={{ color: '#ffd700' }}>⭐ {attr.rating}</span>
                  </div>
                  {attr.tags && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                      {attr.tags.split(',').map((tag, i) => (
                        <span key={i} style={{ marginRight: '6px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '8px' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #eee',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer' }}>
          🏠 首页
        </button>
        <button style={{ background: '#667eea', border: 'none', color: 'white', padding: '10px 24px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>
          🏛️ 景点
        </button>
        <button onClick={() => router.push('/restaurants')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer' }}>
          🍜 美食
        </button>
      </div>
    </div>
  )
}
