'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Destination {
  id: number
  name: string
  city: string
  description: string
  image_url: string
  tags: string
}

interface Attraction {
  id: number
  name: string
  city: string
  description: string
  image_url: string
  ticket_price: number
  rating: number
  recommended_duration: string
}

interface Restaurant {
  id: number
  name: string
  city: string
  cuisine_type: string
  image_url: string
  rating: number
  average_price: number
  description: string
}

export default function DestinationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [destination, setDestination] = useState<Destination | null>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    
    Promise.all([
      fetch(`${API_URL}/api/destinations/${id}`).then(r => r.json()).catch(() => null),
      fetch(`${API_URL}/api/attractions?destination_id=${id}`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/api/restaurants`).then(r => r.json()).catch(() => []),
    ]).then(([destData, attrData, restData]) => {
      setDestination(destData)
      setAttractions(attrData || [])
      // Filter restaurants by destination city
      if (destData?.city) {
        const cityRestaurants = (restData || []).filter((r: Restaurant) => r.city === destData.city)
        setRestaurants(cityRestaurants.slice(0, 4))
      } else {
        setRestaurants((restData || []).slice(0, 4))
      }
    }).finally(() => setLoading(false))
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm px-4 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">🗺️ 目的地详情</h1>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm">退出</button>
          </div>
        </div>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12 text-gray-500">加载中...</div>
        </main>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm px-4 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">🗺️ 目的地详情</h1>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm">退出</button>
          </div>
        </div>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">目的地不存在</p>
            <button onClick={() => router.push('/destinations')} className="text-primary-600 mt-2 hover:underline">返回目的地</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-lg">←</button>
            <h1 className="text-xl font-bold text-gray-900">🗺️ 目的地详情</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm">退出</button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img 
          src={destination.image_url} 
          alt={destination.name}
          className="w-full h-56 object-cover"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x224?text=目的地封面' }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{destination.name}</h2>
          <p className="text-white/80 text-sm">{destination.city}</p>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">{destination.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {destination.tags?.split(',').map((tag: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{tag.trim()}</span>
            ))}
          </div>
        </div>

        {/* Attractions */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">🏛️ 热门景点</h3>
            <button 
              onClick={() => router.push(`/attractions?destination=${id}`)}
              className="text-primary-600 text-sm hover:underline"
            >
              查看全部景点
            </button>
          </div>
          {attractions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-400 text-sm">暂无景点数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attractions.slice(0, 3).map((attr) => (
                <div key={attr.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <img 
                    src={attr.image_url} 
                    alt={attr.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x128?text=景点图片' }}
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{attr.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{attr.recommended_duration}</p>
                      </div>
                      <span className="text-primary-600 font-medium">¥{attr.ticket_price}</span>
                    </div>
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">{attr.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-yellow-500 text-xs">⭐ {attr.rating}</span>
                      <button 
                        onClick={() => router.push('/attractions')}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        查看详情 →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Restaurants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">🍜 {destination.city}美食推荐</h3>
            <button 
              onClick={() => router.push(`/restaurants`)}
              className="text-primary-600 text-sm hover:underline"
            >
              查看全部美食
            </button>
          </div>
          {restaurants.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-400 text-sm">暂无美食数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {restaurants.map((rest) => (
                <div key={rest.id} className="bg-white rounded-xl shadow-sm p-3 flex gap-3">
                  <img 
                    src={rest.image_url} 
                    alt={rest.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x80?text=美食' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 truncate">{rest.name}</h4>
                      <span className="text-primary-600 font-medium text-sm ml-2">¥{rest.average_price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{rest.cuisine_type} · ⭐{rest.rating}</p>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{rest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <button onClick={() => router.push('/home')} className="text-gray-400 hover:text-gray-600 text-sm">首页</button>
            <button onClick={() => router.push('/destinations')} className="text-gray-400 hover:text-gray-600 text-sm">目的地</button>
          </div>
          <button 
            onClick={() => router.push('/itinerary')}
            className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
          >
            AI规划行程
          </button>
        </div>
      </div>
    </div>
  )
}
