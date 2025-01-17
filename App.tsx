import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';
import { Player, Fish, Rod, Bait } from './types';

const socket: Socket = io('http://localhost:3001');

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'game'>('lobby');
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [availableFish, setAvailableFish] = useState<Fish[]>([]);
  const [availableRods, setAvailableRods] = useState<Rod[]>([]);
  const [availableBait, setAvailableBait] = useState<Bait[]>([]);

  useEffect(() => {
    socket.on('gameStart', (data: { player: Player; opponent: Player; fish: Fish[]; rods: Rod[]; bait: Bait[] }) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
      setAvailableFish(data.fish);
      setAvailableRods(data.rods);
      setAvailableBait(data.bait);
      setGameState('game');
    });

    socket.on('updateGame', (data: { player: Player; opponent: Player }) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
    });

    return () => {
      socket.off('gameStart');
      socket.off('updateGame');
    };
  }, []);

  const handleJoinGame = (playerName: string) => {
    socket.emit('joinGame', playerName);
  };

  const handleCreateParty = (partyName: string) => {
    socket.emit('createParty', partyName);
  };

  const handleJoinParty = (partyId: string) => {
    socket.emit('joinParty', partyId);
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
      {gameState === 'lobby' ? (
        <GameLobby
          onJoinGame={handleJoinGame}
          onCreateParty={handleCreateParty}
          onJoinParty={handleJoinParty}
        />
      ) : (
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

