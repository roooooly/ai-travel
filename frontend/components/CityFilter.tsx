'use client'
import { useState } from 'react'

const CITIES = ['全部', '上海', '北京', '成都', '杭州', '苏州']

export default function CityFilter({ onChange }: { onChange: (city: string) => void }) {
  const [selected, setSelected] = useState('全部')
  
  return (
    <select 
      value={selected} 
      onChange={(e) => { 
        setSelected(e.target.value); 
        onChange(e.target.value === '全部' ? '' : e.target.value)
      }}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {CITIES.map(city => (
        <option key={city} value={city === '全部' ? '' : city}>{city}</option>
      ))}
    </select>
  )
}

export { CITIES }
