import { Button } from '@/components/ui/button'

interface ShopProps {
  playerMoney: number
  playerHand: Array<{ id: number; type: string; name: string; level: number }>
  onPurchase: (item: { id: number; type: string; name: string; level: number }, cost: number) => void
}

export default function Shop({ playerMoney, playerHand, onPurchase }: ShopProps) {
  const items = [
    { id: 5, type: 'rod', name: '進階釣竿', level: 2, cost: 50 },
    { id: 6, type: 'bait', name: '高級餌料', level: 2, cost: 30 },
    { id: 7, type: 'rod', name: '專業釣竿', level: 3, cost: 100 },
    { id: 8, type: 'bait', name: '特級餌料', level: 3, cost: 60 }
  ]

  const canPurchase = (item) => {
    const playerItem = playerHand.find(handItem => handItem.type === item.type)
    return playerMoney >= item.cost && (!playerItem || playerItem.level < item.level)
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">商店</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name} (等級 {item.level}) - ${item.cost}</span>
          <Button
            onClick={() => onPurchase(item, item.cost)}
            disabled={!canPurchase(item)}
          >
            購買
          </Button>
        </div>
      ))}
    </div>
  )
}

