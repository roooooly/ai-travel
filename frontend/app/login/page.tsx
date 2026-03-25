'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || (isRegister ? '注册失败' : '登录失败'))
      }
      
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('username', username)
      
      // 跳转到首页
      router.push('/home')
    } catch (err: any) {
      setError(err.message || '操作失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '360px',
        background: 'white',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍋</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: '#333', fontWeight: 700 }}>AI Travel</h1>
          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
            {isRegister ? '创建账号开始旅程' : '登录继续你的旅程'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f5',
            color: '#e53935',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #eee',
                borderRadius: '12px',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #eee',
                borderRadius: '12px',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(102,126,234,0.4)',
            }}
          >
            {loading ? '⏳ 处理中...' : (isRegister ? '📝 注册' : '🔐 登录')}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888' }}>
          {isRegister ? '已有账号？' : '没有账号？'}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              cursor: 'pointer',
              marginLeft: '4px',
              fontWeight: 600,
            }}
          >
            {isRegister ? '登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  )
}
