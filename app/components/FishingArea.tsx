'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface FishingAreaProps {
  onCatch: (fish: { id: number; name: string; value: number }) => void
  rod: { level: number }
  bait: { level: number }
}

export default function FishingArea({ onCatch, rod, bait }: FishingAreaProps) {
  const [isFishing, setIsFishing] = useState(false)

  const handleFishing = () => {
    setIsFishing(true)
    setTimeout(() => {
      const baseValue = Math.floor(Math.random() * 10) + 1
      const fishValue = baseValue * (rod.level + bait.level)
      const caughtFish = {
        id: Math.random(),
        name: getFishName(fishValue),
        value: fishValue
      }
      onCatch(caughtFish)
      setIsFishing(false)
    }, 2000)
  }

  const getFishName = (value: number) => {
    if (value < 10) return '小魚'
    if (value < 20) return '中魚'
    if (value < 30) return '大魚'
    return '稀有魚'
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">釣魚區</h2>
      <Button onClick={handleFishing} disabled={isFishing}>
        {isFishing ? '釣魚中...' : '開始釣魚'}
      </Button>
    </div>
  )
}

