'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuthStore } from '@/lib/store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ItineraryPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [destination, setDestination] = useState('杭州')
  const [days, setDays] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      
      // 设置60秒超时
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const res = await fetch(`${API_URL}/api/itineraries/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination,
          days,
          preferences: {}
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || '生成失败，请重试')
      }
      
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('请求超时，请重试')
      } else {
        setError(err.message || '生成失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      
      <main style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✨ AI智能行程规划
        </h1>

        {/* Not logged in */}
        {!isAuthenticated && (
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
            <p style={{ margin: '0 0 16px', color: '#666' }}>请先登录后再使用AI行程生成功能</p>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
              }}
            >
              去登录
            </button>
          </div>
        )}

        {/* Logged in - Form */}
        {isAuthenticated && (
          <>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                  📍 目的地
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#333',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {['杭州', '上海', '北京', '成都', '苏州', '深圳', '广州', '重庆', '西安', '南京'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                  📅 行程天数
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map(d => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: 'none',
                        borderRadius: '12px',
                        background: days === d ? '#667eea' : '#f5f5f5',
                        color: days === d ? 'white' : '#666',
                        fontSize: '15px',
                        fontWeight: days === d ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {d}天
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(102,126,234,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <>
                    <span>⏳</span>
                    <span>AI规划中...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>生成AI行程</span>
                  </>
                )}
              </button>
              
              {loading && (
                <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#999', textAlign: 'center' }}>
                  预计需要 20-40 秒，请耐心等待...
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fff5f5',
                padding: '16px',
                borderRadius: '12px',
                color: '#e53935',
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                ❌ {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <h2 style={{ margin: '0 0 16px', fontSize: '18px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🗺️ {result.title || '行程规划'}
                </h2>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: 1.8,
                  fontFamily: 'system-ui, sans-serif',
                  margin: 0,
                  background: '#f8f8f8',
                  padding: '16px',
                  borderRadius: '12px',
                  maxHeight: '400px',
                  overflow: 'auto',
                }}>
                  {typeof result.content === 'string' 
                    ? result.content 
                    : JSON.stringify(result.content, null, 2)}
                </pre>
              </div>
            )}
          </>
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
          ✨ AI规划
        </button>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer' }}>
          🚪 退出
        </button>
      </div>
    </div>
  )
}
