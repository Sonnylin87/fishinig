import React, { useState } from 'react';
import { Player, Fish, Rod, Bait } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameBoardProps {
  player: Player;
  opponent: Player;
  availableFish: Fish[];
  availableRods: Rod[];
  availableBait: Bait[];
  onFish: (rodId: number, baitId: number) => void;
  onSellFish: (fishId: number) => void;
  onBuyItem: (itemType: 'rod' | 'bait', itemId: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  player,
  opponent,
  availableFish,
  availableRods,
  availableBait,
  onFish,
  onSellFish,
  onBuyItem,
}) => {
  const [selectedRod, setSelectedRod] = useState<Rod | null>(null);
  const [selectedBait, setSelectedBait] = useState<Bait | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);

  const handleFish = () => {
    if (selectedRod && selectedBait) {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      onFish(selectedRod.id, selectedBait.id);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">你的庫存</h2>
        <p>金錢: ${player.money}</p>
        <h3 className="font-bold mt-2">釣竿:</h3>
        <div className="flex flex-wrap gap-2">
          {player.rods.map((rod) => (
            <Card
              key={rod.id}
              className={`p-2 cursor-pointer ${selectedRod?.id === rod.id ? 'border-blue-500 border-2' : ''}`}
              onClick={() => setSelectedRod(rod)}
            >
              <img src={rod.image || "/placeholder.svg"} alt={rod.name} className="w-16 h-16 object-contain" />
              <p>{rod.name}</p>
            </Card>
          ))}
        </div>
        <h3 className="font-bold mt-2">魚餌:</h3>
        <div className="flex flex-wrap gap-2">
          {player.bait.map((bait) => (
            <Card
              key={bait.id}
              className={`p-2 cursor-pointer ${selectedBait?.id === bait.id ? 'border-blue-500 border-2' : ''}`}
              onClick={() => setSelectedBait(bait)}
            >
              <img src={bait.image || "/placeholder.svg"} alt={bait.name} className="w-16 h-16 object-contain" />
              <p>{bait.name}</p>
            </Card>
          ))}
        </div>
        <h3 className="font-bold mt-2">已捕獲的魚:</h3>
        <div className="flex flex-wrap gap-2">
          {player.caughtFish.map((fish) => (
            <Card key={fish.id} className="p-2">
              <img src={fish.image || "/placeholder.svg"} alt={fish.name} className="w-16 h-16 object-contain" />
              <p>{fish.name}</p>
              <p>價值: ${fish.value}</p>
              <Button onClick={() => onSellFish(fish.id)}>出售</Button>
            </Card>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">對手的庫存</h2>
        <p>金錢: ${opponent.money}</p>
        <p>釣竿: {opponent.rods.length}</p>
        <p>魚餌: {opponent.bait.length}</p>
        <p>已捕獲的魚: {opponent.caughtFish.length}</p>
      </Card>
      <Card className="p-4 col-span-2">
        <h2 className="text-xl font-bold mb-2">釣魚區</h2>
        <Button onClick={handleFish} disabled={!selectedRod || !selectedBait}>
          投放釣線
        </Button>
        {diceResult !== null && (
          <p className="mt-2">骰子結果: {diceResult}</p>
        )}
      </Card>
      <Card className="p-4 col-span-2">
        <h2 className="text-xl font-bold mb-2">商店</h2>
        <h3 className="font-bold">釣竿:</h3>
        <div className="flex flex-wrap gap-2">
          {availableRods.map((rod) => (
            <Card key={rod.id} className="p-2">
              <img src={rod.image || "/placeholder.svg"} alt={rod.name} className="w-16 h-16 object-contain" />
              <p>{rod.name}</p>
              <p>價格: ${rod.price}</p>
              <Button onClick={() => onBuyItem('rod', rod.id)} disabled={player.money < rod.price}>
                購買
              </Button>
            </Card>
          ))}
        </div>
        <h3 className="font-bold mt-2">魚餌:</h3>
        <div className="flex flex-wrap gap-2">
          {availableBait.map((bait) => (
            <Card key={bait.id} className="p-2">
              <img src={bait.image || "/placeholder.svg"} alt={bait.name} className="w-16 h-16 object-contain" />
              <p>{bait.name}</p>
              <p>價格: ${bait.price}</p>
              <Button onClick={() => onBuyItem('bait', bait.id)} disabled={player.money < bait.price}>
                購買
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GameBoard;

