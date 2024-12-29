'use client'

import React, { useState, useCallback } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Input } from '../ui/input'

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState("#6366f1")

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor)
  }, [])

  return (
    <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-6">
          Choose Your Color
        </h2>
      <div className="bg-background p-8 rounded-lg shadow-sm">
        <div className="relative mb-6">
          <HexColorPicker color={color} onChange={handleColorChange} />
        </div>
        <div className="flex items-center justify-between">
          <div 
            className="w-12 h-12 rounded-full shadow-inner"
            style={{ backgroundColor: color }}
          />
          <Input 
            type="text"
            
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-grow ml-4 px-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ColorPicker

