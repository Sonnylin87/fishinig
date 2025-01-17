import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GameLobbyProps {
  onJoinGame: (playerName: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">歡迎來到釣魚對戰！</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="輸入你的名字"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="mb-2"
        />
        <Button onClick={() => onJoinGame(playerName)} disabled={!playerName}>
          開始配對
        </Button>
      </div>
    </div>
  );
};

export default GameLobby;

