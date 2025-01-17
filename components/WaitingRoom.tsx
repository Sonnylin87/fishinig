import React from 'react';
import { Card } from '@/components/ui/card';

interface WaitingRoomProps {
  playerName: string;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ playerName }) => {
  return (
    <Card className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">等待對手中...</h2>
      <p>你好，{playerName}！我們正在為你尋找對手。</p>
      <div className="mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </Card>
  );
};

export default WaitingRoom;

