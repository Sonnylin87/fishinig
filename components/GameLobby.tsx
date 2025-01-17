import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GameLobbyProps {
  onJoinGame: (playerName: string) => void;
  onCreateParty: (partyName: string) => void;
  onJoinParty: (partyId: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onJoinGame, onCreateParty, onJoinParty }) => {
  const [playerName, setPlayerName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [partyId, setPartyId] = useState('');

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
          加入隨機遊戲
        </Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="輸入派對名稱"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          className="mb-2"
        />
        <Button onClick={() => onCreateParty(partyName)} disabled={!partyName}>
          創建派對
        </Button>
      </div>
      <div>
        <Input
          type="text"
          placeholder="輸入派對ID"
          value={partyId}
          onChange={(e) => setPartyId(e.target.value)}
          className="mb-2"
        />
        <Button onClick={() => onJoinParty(partyId)} disabled={!partyId}>
          加入派對
        </Button>
      </div>
    </div>
  );
};

export default GameLobby;

