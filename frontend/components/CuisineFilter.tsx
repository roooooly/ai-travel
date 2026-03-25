'use client'
import { useState } from 'react'

const CUISINES = ['全部', '本帮菜', '川菜', '杭帮菜', '苏帮菜', '京菜', '火锅']

export default function CuisineFilter({ onChange }: { onChange: (cuisine: string) => void }) {
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
      {CUISINES.map(cuisine => (
        <option key={cuisine} value={cuisine === '全部' ? '' : cuisine}>{cuisine}</option>
      ))}
    </select>
  )
}

export { CUISINES }
