'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BattleAreaProps {
  caughtFish: Array<{ id: number; name: string; value: number }>
  onSell: (amount: number) => void
  onFishSold: (fishId: number) => void
}

export default function BattleArea({ caughtFish, onSell, onFishSold }: BattleAreaProps) {
  const [selectedFish, setSelectedFish] = useState(null)
  const [diceResult, setDiceResult] = useState(null)
  const [isRolling, setIsRolling] = useState(false)

  const handleRollDice = () => {
    if (selectedFish) {
      setIsRolling(true)
      let rollCount = 0
      const rollInterval = setInterval(() => {
        setDiceResult(Math.floor(Math.random() * 6) + 1)
        rollCount++
        if (rollCount >= 10) {
          clearInterval(rollInterval)
          setIsRolling(false)
          const finalResult = Math.floor(Math.random() * 6) + 1
          setDiceResult(finalResult)
          const newValue = selectedFish.value * finalResult
          onSell(newValue)
          onFishSold(selectedFish.id)
          setSelectedFish(null)
        }
      }, 100)
    }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">對戰區域</h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {caughtFish.map((fish) => (
          <Card
            key={fish.id}
            className={`p-2 w-24 cursor-pointer flex-shrink-0 ${selectedFish === fish ? 'border-blue-500 border-2' : ''}`}
            onClick={() => setSelectedFish(fish)}
          >
            <div>{fish.name}</div>
            <div>價值: ${fish.value}</div>
          </Card>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={handleRollDice} disabled={!selectedFish || isRolling}>
          {isRolling ? '擲骰中...' : '擲骰子'}
        </Button>
        {diceResult && (
          <div className="text-2xl font-bold">
            骰子結果: {diceResult}
          </div>
        )}
      </div>
    </div>
  )
}

