import { Card } from '@/components/ui/card'

interface PlayerHandProps {
  cards: Array<{
    id: number
    type: 'rod' | 'bait'
    name: string
    level: number
  }>
}

export default function PlayerHand({ cards }: PlayerHandProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">手牌</h2>
      <div className="flex space-x-2">
        {cards.map((card) => (
          <Card key={card.id} className="p-2 w-24">
            <div>{card.name}</div>
            <div>{card.type === 'rod' ? '釣竿' : '餌料'}</div>
            <div>等級: {card.level}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

