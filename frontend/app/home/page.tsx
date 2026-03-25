'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface HotItem {
  id: number
  name: string
  city: string
  description: string
  image_url: string
  ticket_price?: number
  cuisine_type?: string
  average_price?: number
  rating: number
}

export default function HomePage() {
  const [hotDestinations, setHotDestinations] = useState<HotItem[]>([])
  const [hotAttractions, setHotAttractions] = useState<HotItem[]>([])
  const [hotRestaurants, setHotRestaurants] = useState<HotItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dests, attrs, rests] = await Promise.all([
        fetch(`${API_URL}/api/hot/destinations`).then(r => r.json()),
        fetch(`${API_URL}/api/hot/attractions`).then(r => r.json()),
        fetch(`${API_URL}/api/hot/restaurants`).then(r => r.json()),
      ])
      setHotDestinations(dests.slice(0, 6) || [])
      setHotAttractions(attrs.slice(0, 4) || [])
      setHotRestaurants(rests.slice(0, 4) || [])
    } catch (err) {
      console.error('加载失败:', err)
      setError('数据加载失败')
    }
  }

  const renderCard = (item: HotItem, type: string) => (
    <div
      key={`${type}-${item.id}`}
      style={{
        minWidth: '140px',
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ height: '100px', overflow: 'hidden', background: '#f0f4ff' }}>
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e: any) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <div style={{ padding: '10px' }}>
        <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', marginBottom: '4px' }}>{item.name}</div>
        <div style={{ fontSize: '11px', color: '#888' }}>{item.city}</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <main style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(102,126,234,0.3)',
        }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>🧳 AI Travel</h1>
          <p style={{ margin: '0 0 16px', fontSize: '14px', opacity: 0.9 }}>
            智能旅行规划，让你的每一次出行都完美
          </p>
          <Link
            href="/itinerary"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'white',
              color: '#667eea',
              borderRadius: '24px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            ✨ AI智能规划行程
          </Link>
        </div>

        {error && (
          <div style={{ padding: '16px', background: '#fff5f5', borderRadius: '12px', color: '#e53935', marginBottom: '16px', textAlign: 'center' }}>
            ❌ {error}
          </div>
        )}

        {/* Hot Destinations */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#333' }}>🔥 热门目的地</h2>
            <Link href="/destinations" style={{ color: '#667eea', textDecoration: 'none', fontSize: '13px' }}>
              查看全部 →
            </Link>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            WebkitOverflowScrolling: 'touch',
          }}>
            {hotDestinations.length === 0 ? (
              <div style={{ padding: '20px', color: '#999', textAlign: 'center', width: '100%' }}>
                加载中...
              </div>
            ) : hotDestinations.map(item => renderCard(item, 'dest'))}
          </div>
        </section>

        {/* Hot Attractions */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#333' }}>🏛️ 热门景点</h2>
            <Link href="/attractions" style={{ color: '#667eea', textDecoration: 'none', fontSize: '13px' }}>
              查看全部 →
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {hotAttractions.length === 0 ? (
              <div style={{ gridColumn: '1/-1', padding: '20px', color: '#999', textAlign: 'center' }}>
                加载中...
              </div>
            ) : hotAttractions.map(item => (
              <div
                key={`attr-${item.id}`}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ height: '80px', overflow: 'hidden', background: '#f0f4ff' }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e: any) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div style={{ padding: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888' }}>
                    <span>{item.city}</span>
                    <span style={{ color: '#ffd700' }}>⭐ {item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Restaurants */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#333' }}>🍜 热门美食</h2>
            <Link href="/restaurants" style={{ color: '#667eea', textDecoration: 'none', fontSize: '13px' }}>
              查看全部 →
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {hotRestaurants.length === 0 ? (
              <div style={{ gridColumn: '1/-1', padding: '20px', color: '#999', textAlign: 'center' }}>
                加载中...
              </div>
            ) : hotRestaurants.map(item => (
              <div
                key={`rest-${item.id}`}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ height: '80px', overflow: 'hidden', background: '#f0f4ff' }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e: any) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div style={{ padding: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#333', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888' }}>
                    <span>{item.cuisine_type || item.city}</span>
                    <span style={{ color: '#ff6b6b' }}>¥{item.average_price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: '16px', color: '#333' }}>🚀 快捷功能</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link
              href="/attractions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <span style={{ fontSize: '28px' }}>🏛️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>探索景点</div>
                <div style={{ fontSize: '12px', color: '#888' }}>发现有趣的地方</div>
              </div>
            </Link>
            <Link
              href="/restaurants"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <span style={{ fontSize: '28px' }}>🍜</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>寻找美食</div>
                <div style={{ fontSize: '12px', color: '#888' }}>品味当地特色</div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
