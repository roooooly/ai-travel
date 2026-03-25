import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url)
  // path = destinations, auth/login, etc
  const path = pathname.replace('/api/proxy/', '')
  
  // 转发到后端的 /api/ 路径
  const url = BACKEND_URL + '/api/' + path + (searchParams.toString() ? '?' + searchParams.toString() : '')
  const response = await fetch(url, {
    headers: {
      ...Object.fromEntries(request.headers),
      host: 'localhost:8000',
    },
  })
  
  const data = await response.text()
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function POST(request: Request) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace('/api/proxy/', '')
  const body = await request.json()
  
  const url = BACKEND_URL + '/api/' + path
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(request.headers),
      host: 'localhost:8000',
    },
    body: JSON.stringify(body),
  })
  
  const data = await response.text()
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
