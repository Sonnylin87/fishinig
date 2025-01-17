'use client'

import { useState, useEffect } from 'react'
import PlayerHand from './components/PlayerHand'
import FishingArea from './components/FishingArea'
import Shop from './components/Shop'
import BattleArea from './components/BattleArea'
import { Card } from '@/components/ui/card'

export default function Game() {
  const [playerMoney, setPlayerMoney] = useState(100)
  const [playerHand, setPlayerHand] = useState([
    { id: 1, type: 'rod', name: '基本釣竿', level: 1 },
    { id: 2, type: 'bait', name: '基本餌料', level: 1 }
  ])
  const [caughtFish, setCaughtFish] = useState([])
  const [opponent, setOpponent] = useState({ 
    money: 100, 
    hand: [
      { id: 3, type: 'rod', name: '基本釣竿', level: 1 },
      { id: 4, type: 'bait', name: '基本餌料', level: 1 }
    ],
    caughtFish: []
  })
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'won', 'lost'

  useEffect(() => {
    // 初始化WebSocket連接
    const socket = new WebSocket('ws://localhost:3001')

    socket.onopen = () => {
      console.log('Connected to server')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleServerMessage(data)
    }

    return () => {
      socket.close()
    }
  }, [])

  const handleServerMessage = (data) => {
    switch (data.type) {
      case 'OPPONENT_CAUGHT_FISH':
        setOpponent(prev => ({
          ...prev,
          caughtFish: [...prev.caughtFish, data.fish]
        }))
        checkWinCondition(caughtFish, [...opponent.caughtFish, data.fish])
        break
      // 處理其他消息類型...
    }
  }

  const checkWinCondition = (playerFish, opponentFish) => {
    const playerBestFish = playerFish.reduce((best, fish) => fish.value > best.value ? fish : best, { value: 0 })
    const opponentBestFish = opponentFish.reduce((best, fish) => fish.value > best.value ? fish : best, { value: 0 })

    if (playerBestFish.value >= 50) {
      setGameStatus('won')
    } else if (opponentBestFish.value >= 50) {
      setGameStatus('lost')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">高級卡牌釣魚遊戲</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">你的狀態</h2>
          <div className="mb-4">金錢: {playerMoney}</div>
          <PlayerHand cards={playerHand} />
          <FishingArea 
            onCatch={(fish) => {
              setCaughtFish([...caughtFish, fish])
              checkWinCondition([...caughtFish, fish], opponent.caughtFish)
            }} 
            rod={playerHand.find(card => card.type === 'rod')}
            bait={playerHand.find(card => card.type === 'bait')}
          />
        </Card>
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">對手狀態</h2>
          <div className="mb-4">金錢: {opponent.money}</div>
          <PlayerHand cards={opponent.hand} />
          <div>已釣到的魚: {opponent.caughtFish.length}</div>
        </Card>
        <Shop 
          playerMoney={playerMoney} 
          playerHand={playerHand}
          onPurchase={(item, cost) => {
            setPlayerMoney(playerMoney - cost)
            setPlayerHand(prevHand => {
              const newHand = prevHand.filter(card => card.type !== item.type)
              return [...newHand, item]
            })
          }} 
        />
        <BattleArea 
          caughtFish={caughtFish} 
          onSell={(amount) => setPlayerMoney(playerMoney + amount)}
          onFishSold={(fishId) => setCaughtFish(caughtFish.filter(fish => fish.id !== fishId))}
        />
      </div>
      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">
              {gameStatus === 'won' ? '你贏了！' : '你輸了！'}
            </h2>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.reload()}
            >
              重新開始
            </button>
          </Card>
        </div>
      )}
    </div>
  )
}

