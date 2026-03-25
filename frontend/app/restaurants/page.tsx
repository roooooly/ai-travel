'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CITIES = ['全部', '上海', '北京', '成都', '杭州', '苏州', '深圳', '广州', '重庆', '西安', '南京']
const CUISINES = ['全部', '川菜', '火锅', '粤菜', '本帮菜', '杭帮菜', '苏帮菜', '京菜', '陕菜', '苏菜']

interface Restaurant {
  id: number
  name: string
  city: string
  description: string
  address: string
  cuisine_type: string
  average_price: number
  rating: number
  image_url: string
}

export default function RestaurantsPage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants(city, cuisine)
  }, [city, cuisine])

  const fetchRestaurants = (cityParam: string, cuisineParam: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (cityParam && cityParam !== '全部') params.append('city', cityParam)
    if (cuisineParam && cuisineParam !== '全部') params.append('cuisine', cuisineParam)
    const query = params.toString()
    const url = `${API_URL}/api/restaurants${query ? '?' + query : ''}`
    
    fetch(url)
      .then(r => r.json())
      .then(data => setRestaurants(data || []))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false))
  }

  const handleCityChange = (cityParam: string) => {
    setCity(cityParam)
  }

  const handleCuisineChange = (cuisineParam: string) => {
    setCuisine(cuisineParam)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <main style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Page Title */}
        <h1 style={{ margin: '0 0 16px', fontSize: '20px', color: '#333' }}>🍜 寻找美食</h1>

        {/* City Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCityChange(c === '全部' ? '' : c)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: 'none',
                background: (city === c || (c === '全部' && city === '')) ? '#667eea' : 'white',
                color: (city === c || (c === '全部' && city === '')) ? 'white' : '#666',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cuisine Filter */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}>
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => handleCuisineChange(c === '全部' ? '' : c)}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: (cuisine === c || (c === '全部' && cuisine === '')) ? '#667eea' : '#eee',
                background: (cuisine === c || (c === '全部' && cuisine === '')) ? '#f0f4ff' : 'white',
                color: (cuisine === c || (c === '全部' && cuisine === '')) ? '#667eea' : '#888',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Restaurants List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>加载中...</div>
        ) : restaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍜</div>
            <p>暂无餐厅数据</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                    <img
                      src={rest.image_url}
                      alt={rest.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x120?text=美食' }}
                    />
                  </div>
                  <div style={{ padding: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#333' }}>{rest.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#667eea', background: '#f0f4ff', padding: '2px 8px', borderRadius: '8px' }}>
                        {rest.city}
                      </span>
                      <span style={{ fontSize: '11px', color: '#ff6b6b', background: '#fff5f5', padding: '2px 8px', borderRadius: '8px' }}>
                        {rest.cuisine_type}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#666', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {rest.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#888' }}>📍 {rest.address.slice(0, 12)}...</span>
                      <span style={{ color: '#ff6b6b', fontWeight: 700 }}>¥{rest.average_price}/人</span>
                    </div>
                  </div>
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
        <button onClick={() => router.push('/attractions')} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer' }}>
          🏛️ 景点
        </button>
        <button style={{ background: '#667eea', border: 'none', color: 'white', padding: '10px 24px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>
          🍜 美食
        </button>
      </div>
    </div>
  )
}
