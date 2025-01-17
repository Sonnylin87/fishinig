import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';
import WaitingRoom from './components/WaitingRoom';
import { Player, Fish, Rod, Bait } from './types';

const socket: Socket = io('https://your-public-websocket-server.com');

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'game'>('lobby');
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [availableFish, setAvailableFish] = useState<Fish[]>([]);
  const [availableRods, setAvailableRods] = useState<Rod[]>([]);
  const [availableBait, setAvailableBait] = useState<Bait[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    socket.on('gameStart', (data: { player: Player; opponent: Player; fish: Fish[]; rods: Rod[]; bait: Bait[] }) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
      setAvailableFish(data.fish);
      setAvailableRods(data.rods);
      setAvailableBait(data.bait);
      setIsWaiting(false);
      setGameState('game');
    });

    socket.on('updateGame', (data: { player: Player; opponent: Player }) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
    });

    socket.on('waitingForOpponent', () => {
      console.log('Waiting for an opponent...');
    });

    socket.on('opponentFound', (opponentName: string) => {
      console.log(`Opponent found: ${opponentName}`);
    });

    return () => {
      socket.off('gameStart');
      socket.off('updateGame');
      socket.off('waitingForOpponent');
      socket.off('opponentFound');
    };
  }, []);

  const handleJoinGame = (playerName: string) => {
    setPlayer({ ...(player || {}), name: playerName });
    setIsWaiting(true);
    socket.emit('joinGame', playerName);
  };


  const handleFish = (rodId: number, baitId: number) => {
    socket.emit('fish', { rodId, baitId });
  };

  const handleSellFish = (fishId: number) => {
    socket.emit('sellFish', fishId);
  };

  const handleBuyItem = (itemType: 'rod' | 'bait', itemId: number) => {
    socket.emit('buyItem', { itemType, itemId });
  };

  return (
    <div className="container mx-auto p-4">
      {gameState === 'lobby' && !isWaiting && (
        <GameLobby
          onJoinGame={handleJoinGame}
        />
      )}
      {isWaiting && <WaitingRoom playerName={player?.name || ''} />}
      {gameState === 'game' && (
        <GameBoard
          player={player!}
          opponent={opponent!}
          availableFish={availableFish}
          availableRods={availableRods}
          availableBait={availableBait}
          onFish={handleFish}
          onSellFish={handleSellFish}
          onBuyItem={handleBuyItem}
        />
      )}
    </div>
  );
};

export default App;

