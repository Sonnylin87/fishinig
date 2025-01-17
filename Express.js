const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const availableFish = [
  { id: 1, name: 'Goldfish', value: 10, image: '/fish/goldfish.png', requiredDice: [1, 2] },
  { id: 2, name: 'Trout', value: 20, image: '/fish/trout.png', requiredDice: [3, 4] },
  { id: 3, name: 'Salmon', value: 30, image: '/fish/salmon.png', requiredDice: [5, 6] },
  { id: 4, name: 'Tuna', value: 50, image: '/fish/tuna.png', requiredDice: [6] },
];

const availableRods = [
  { id: 1, name: 'Basic Rod', price: 50, image: '/rods/basic.png', catchableFish: [1, 2] },
  { id: 2, name: 'Advanced Rod', price: 100, image: '/rods/advanced.png', catchableFish: [1, 2, 3] },
  { id: 3, name: 'Pro Rod', price: 200, image: '/rods/pro.png', catchableFish: [1, 2, 3, 4] },
];

const availableBait = [
  { id: 1, name: 'Worm', price: 5, image: '/bait/worm.png' },
  { id: 2, name: 'Minnow', price: 10, image: '/bait/minnow.png' },
  { id: 3, name: 'Shrimp', price: 15, image: '/bait/shrimp.png' },
];

const players = new Map();
const waitingPlayers = [];
const parties = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinGame', (playerName) => {
    const player = {
      id: socket.id,
      name: playerName,
      money: 100,
      rods: [availableRods[0]],
      bait: [availableBait[0]],
      caughtFish: []
    };
    players.set(socket.id, player);

    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift();
      startGame(player, players.get(opponent));
    } else {
      waitingPlayers.push(socket.id);
    }
  });

  socket.on('createParty', (partyName) => {
    const partyId = Math.random().toString(36).substring(7);
    parties.set(partyId, {
      id: partyId,
      name: partyName,
      players: [socket.id]
    });
    socket.emit('partyCreated', partyId);
  });

  socket.on('joinParty', (partyId) => {
    const party = parties.get(partyId);
    if (party && party.players.length < 2) {
      party.players.push(socket.id);
      if (party.players.length === 2) {
        startGame(players.get(party.players[0]), players.get(party.players[1]));
        parties.delete(partyId);
      }
    } else {
      socket.emit('partyJoinError', 'Party not found or full');
    }
  });

  socket.on('fish', ({ rodId, baitId }) => {
    const player = players.get(socket.id);
    if (player) {
      const rod = player.rods.find(r => r.id === rodId);
      const bait = player.bait.find(b => b.id === baitId);
      if (rod && bait) {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const caughtFish = availableFish.find(f => 
          rod.catchableFish.includes(f.id) && f.requiredDice.includes(diceRoll)
        );
        if (caughtFish) {
          player.caughtFish.push(caughtFish);
          player.bait = player.bait.filter(b => b.id !== baitId);
          updateGame(player);
        }
      }
    }
  });

  socket.on('sellFish', (fishId) => {
    const player = players.get(socket.id);
    if (player) {
      const fishIndex = player.caughtFish.findIndex(f => f.id === fishId);
      if (fishIndex !== -1) {
        const fish = player.caughtFish[fishIndex];
        player.money += fish.value;
        player.caughtFish.splice(fishIndex, 1);
        updateGame(player);
      }
    }
  });

  socket.on('buyItem', ({ itemType, itemId }) => {
    const player = players.get(socket.id);
    if (player) {
      const item = itemType === 'rod' 
        ? availableRods.find(r => r.id === itemId)
        : availableBait.find(b => b.id === itemId);
      if (item && player.money >= item.price) {
        player.money -= item.price;
        if (itemType === 'rod') {
          player.rods.push(item);
        } else {
          player.bait.push(item);
        }
        updateGame(player);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    players.delete(socket.id);
    const waitingIndex = waitingPlayers.indexOf(socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }
  });
});

function startGame(player1, player2) {
  player1.opponent = player2.id;
  player2.opponent = player1.id;
  io.to(player1.id).emit('gameStart', {
    player: player1,
    opponent: { ...player2, caughtFish: [] },
    fish: availableFish,
    rods: availableRods,
    bait: availableBait
  });
  io.to(player2.id).emit('gameStart', {
    player: player2,
    opponent: { ...player1, caughtFish: [] },
    fish: availableFish,
    rods: availableRods,
    bait: availableBait
  });
}

function updateGame(player) {
  const opponent = players.get(player.opponent);
  if (opponent) {
    io.to(player.id).emit('updateGame', {
      player: player,
      opponent: { ...opponent, caughtFish: [] }
    });
    io.to(opponent.id).emit('updateGame', {
      player: opponent,
      opponent: { ...player, caughtFish: [] }
    });
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
