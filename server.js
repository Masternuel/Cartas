const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : __dirname;
const SAVED_DECKS_FILE = path.join(DATA_DIR, "saved-decks.json");
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_PLAYERS_PER_ROOM = 12;
const MAX_CHAT_MESSAGES = 80;
const MAX_CHAT_LENGTH = 220;
const DEFAULT_CARD_THEME_ID = "azure-whisper";
const DEFAULT_BACKGROUND_ID = "midnight-veil";
const DEFAULT_CARDS_PER_ROUND = 0;
const DEFAULT_TURN_TIMER_SECONDS = 0;
const DEFAULT_CARD_KIND = "question";
const CARD_THEME_IDS = new Set([
  "azure-whisper",
  "crimson-velvet",
  "violet-lock",
  "lunar-neon",
  "obsidian-gold"
]);
const CARD_KIND_IDS = new Set([
  "question",
  "skip-turn",
  "choose-player"
]);
const BACKGROUND_IDS = new Set([
  "midnight-veil",
  "violet-lounge",
  "ivory-glow",
  "stargazer-blue",
  "ember-parlor"
]);
const rooms = new Map();
let savedDecks = [];

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadSavedDecks() {
  try {
    ensureDataDir();

    if (!fs.existsSync(SAVED_DECKS_FILE)) {
      savedDecks = [];
      return;
    }

    const raw = fs.readFileSync(SAVED_DECKS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    savedDecks = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    savedDecks = [];
  }
}

function persistSavedDecks() {
  ensureDataDir();
  fs.writeFileSync(SAVED_DECKS_FILE, JSON.stringify(savedDecks, null, 2), "utf-8");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { error: message });
}

function collectJson(request) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 1_000_000) {
        reject(new Error("Payload muito grande."));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("JSON invalido."));
      }
    });

    request.on("error", () => reject(new Error("Falha ao ler requisicao.")));
  });
}

function cleanSingleLine(value, maxLength, fallback = "") {
  const normalized = typeof value === "string"
    ? value.trim().replace(/\s+/g, " ")
    : "";

  return (normalized.slice(0, maxLength) || fallback).trim();
}

function cleanMultiLine(value, maxLength) {
  const normalized = typeof value === "string"
    ? value.replace(/\r/g, "").trim()
    : "";

  return normalized.slice(0, maxLength);
}

function cleanColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#c79d51";
}

function makeDefaultCards() {
  return [
    {
      id: randomUUID(),
      title: "Quebra-gelo",
      category: "Conexao",
      question: "Qual memoria recente te fez sorrir sem perceber?",
      color: "#f97316",
      kind: "question",
      authorId: "system",
      authorName: "Sistema"
    },
    {
      id: randomUUID(),
      title: "Escolha dificil",
      category: "Debate",
      question: "O que voce escolheria perder por uma semana: internet ou cafe?",
      color: "#14b8a6",
      kind: "question",
      authorId: "system",
      authorName: "Sistema"
    },
    {
      id: randomUUID(),
      title: "Historia rapida",
      category: "Narrativa",
      question: "Conte uma situacao em que voce precisou improvisar e deu certo.",
      color: "#ec4899",
      kind: "question",
      authorId: "system",
      authorName: "Sistema"
    },
    {
      id: randomUUID(),
      title: "Time ideal",
      category: "Equipe",
      question: "Quais tres qualidades nao podem faltar em um parceiro de projeto?",
      color: "#8b5cf6",
      kind: "question",
      authorId: "system",
      authorName: "Sistema"
    }
  ];
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  do {
    code = "";
    for (let index = 0; index < 5; index += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  } while (rooms.has(code));

  return code;
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function createPlayer(name) {
  return {
    id: randomUUID(),
    name: cleanSingleLine(name, 24, "Jogador"),
    isReady: false
  };
}

function createRoom(hostName) {
  const host = createPlayer(hostName);
  const room = {
    code: generateRoomCode(),
    hostId: host.id,
    settings: {
      cardsPerRound: DEFAULT_CARDS_PER_ROUND,
      timerSeconds: DEFAULT_TURN_TIMER_SECONDS
    },
    appearance: {
      cardThemeId: DEFAULT_CARD_THEME_ID,
      backgroundId: DEFAULT_BACKGROUND_ID
    },
    activePlayerId: null,
    responderPlayerId: null,
    phase: "lobby",
    players: [host],
    cards: makeDefaultCards(),
    roundCardTotal: 0,
    turnEndsAt: null,
    chatMessages: [],
    currentCardId: null,
    drawPile: [],
    connections: new Set(),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  rooms.set(room.code, room);
  room.roundCardTotal = getRoundCardTarget(room);
  addChatMessage(room, {
    playerId: "system",
    playerName: "Sistema",
    text: `Sala ${room.code} criada. Monte o baralho e espere todo mundo marcar pronto.`,
    system: true
  });
  return { room, playerId: host.id };
}

function touchRoom(room) {
  room.updatedAt = Date.now();
  room.version += 1;
}

function getRoom(code) {
  return rooms.get(String(code || "").toUpperCase());
}

function getPlayer(room, playerId) {
  return room.players.find((player) => player.id === playerId);
}

function getCard(room, cardId) {
  return room.cards.find((card) => card.id === cardId);
}

function getPlayerIndex(room, playerId) {
  return room.players.findIndex((player) => player.id === playerId);
}

function getNextPlayerId(room, playerId) {
  if (!room.players.length) {
    return null;
  }

  const currentIndex = getPlayerIndex(room, playerId);

  if (currentIndex === -1) {
    return room.players[0].id;
  }

  return room.players[(currentIndex + 1) % room.players.length].id;
}

function playerCanEditCard(room, viewerId, card) {
  return viewerId === room.hostId || viewerId === card.authorId;
}

function clearRoundTimer(room) {
  if (room.turnTimerHandle) {
    clearTimeout(room.turnTimerHandle);
    room.turnTimerHandle = null;
  }

  room.turnEndsAt = null;
}

function scheduleRoundTimer(room) {
  clearRoundTimer(room);

  const timerSeconds = validateTimerSeconds(room.settings?.timerSeconds, DEFAULT_TURN_TIMER_SECONDS);

  if (room.phase !== "playing" || !room.currentCardId || timerSeconds <= 0) {
    return;
  }

  room.turnEndsAt = Date.now() + timerSeconds * 1000;
  room.turnTimerHandle = setTimeout(() => {
    room.turnTimerHandle = null;

    if (!rooms.has(room.code) || room.phase !== "playing" || !room.currentCardId) {
      return;
    }

    advanceRoom(room);
    touchRoom(room);
    broadcastRoom(room);
  }, timerSeconds * 1000);

  room.turnTimerHandle.unref?.();
}

function advanceRoom(room) {
  const currentPullerId = room.activePlayerId;
  room.currentCardId = room.drawPile.shift() || null;

  if (!room.currentCardId) {
    room.phase = "finished";
    room.activePlayerId = null;
    room.responderPlayerId = null;
    clearRoundTimer(room);
    return;
  }

  if (!room.drawPile.length) {
    room.activePlayerId = null;
    room.responderPlayerId = null;
    scheduleRoundTimer(room);
    return;
  }

  room.activePlayerId = getNextPlayerId(room, currentPullerId);
  room.responderPlayerId = room.activePlayerId;
  scheduleRoundTimer(room);
}

function serializeRoom(room, viewerId) {
  const appearance = room.appearance || {};
  const settings = room.settings || {};
  const currentCard = room.currentCardId
    ? room.cards.find((card) => card.id === room.currentCardId) || null
    : null;
  const totalCards = room.phase === "lobby"
    ? getRoundCardTarget(room)
    : room.roundCardTotal || 0;
  const revealedCount = room.phase === "lobby"
    ? 0
    : Math.min(totalCards, totalCards - room.drawPile.length);
  const responderId = getCurrentResponderId(room);
  const responder = responderId ? getPlayer(room, responderId) : null;

  return {
    roomCode: room.code,
    phase: room.phase,
    viewerId,
    isHost: viewerId === room.hostId,
    hostId: room.hostId,
    appearance: {
      cardThemeId: validateCardThemeId(appearance.cardThemeId),
      backgroundId: validateBackgroundId(appearance.backgroundId)
    },
    settings: {
      cardsPerRound: validateCardsPerRound(settings.cardsPerRound, DEFAULT_CARDS_PER_ROUND),
      timerSeconds: validateTimerSeconds(settings.timerSeconds, DEFAULT_TURN_TIMER_SECONDS)
    },
    activePlayerId: room.activePlayerId,
    responderPlayerId: responderId,
    responderName: responder?.name || null,
    version: room.version,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      isHost: player.id === room.hostId,
      isReady: Boolean(player.isReady)
    })),
    stats: {
      deckCards: room.cards.length,
      totalCards,
      remainingCards: room.phase === "lobby" ? totalCards : room.drawPile.length,
      revealedCards: revealedCount,
      turnEndsAt: room.turnEndsAt
    },
    cards: room.cards.map((card) => ({
      id: card.id,
      title: card.title,
      category: card.category,
      question: card.question,
      color: card.color,
      kind: validateCardKind(card.kind),
      authorName: card.authorName,
      canEdit: playerCanEditCard(room, viewerId, card),
      canDelete: playerCanEditCard(room, viewerId, card)
    })),
    currentCard,
    chatMessages: (room.chatMessages || []).map(serializeChatMessage),
    updatedAt: room.updatedAt
  };
}

function writeEvent(response, eventName, payload) {
  response.write(`event: ${eventName}\n`);
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastRoom(room) {
  for (const response of room.connections) {
    try {
      writeEvent(response, "sync", serializeRoom(room, response.viewerId));
    } catch (error) {
      room.connections.delete(response);
    }
  }
}

function closeRoom(room, reason = "Sala encerrada.") {
  clearRoundTimer(room);

  for (const response of room.connections) {
    try {
      writeEvent(response, "room-closed", { message: reason });
      response.end();
    } catch (error) {
      response.destroy();
    }
  }

  room.connections.clear();
  rooms.delete(room.code);
}

function disconnectPlayerConnections(room, playerId, eventName, payload) {
  for (const response of Array.from(room.connections)) {
    if (response.viewerId !== playerId) {
      continue;
    }

    try {
      writeEvent(response, eventName, payload);
      response.end();
    } catch (error) {
      response.destroy();
    }

    room.connections.delete(response);
  }
}

function removePlayerFromRoom(room, playerId) {
  const player = getPlayer(room, playerId);

  if (!player) {
    return null;
  }

  const removedWasActive = room.activePlayerId === player.id;
  room.players = room.players.filter((currentPlayer) => currentPlayer.id !== player.id);

  if (!room.players.length) {
    closeRoom(room, "A sala foi encerrada porque todos sairam.");
    return player;
  }

  if (room.hostId === player.id || !getPlayer(room, room.hostId)) {
    room.hostId = room.players[0].id;
  }

  if (removedWasActive) {
    room.activePlayerId = room.phase === "playing" ? room.players[0]?.id || null : null;
  }

  if (room.responderPlayerId === player.id || !getPlayer(room, room.responderPlayerId)) {
    room.responderPlayerId = room.activePlayerId || null;
  }

  if (room.phase === "lobby") {
    room.roundCardTotal = getRoundCardTarget(room);
  }

  scheduleRoundTimer(room);

  return player;
}

function ensureRoomAndPlayer(roomCode, playerId) {
  const room = getRoom(roomCode);

  if (!room) {
    throw Object.assign(new Error("Sala nao encontrada."), { statusCode: 404 });
  }

  const player = getPlayer(room, playerId);

  if (!player) {
    throw Object.assign(new Error("Jogador nao encontrado nessa sala."), { statusCode: 404 });
  }

  return { room, player };
}

function assertHost(room, playerId) {
  if (room.hostId !== playerId) {
    throw Object.assign(new Error("Apenas o anfitriao pode fazer isso."), { statusCode: 403 });
  }
}

function assertLobby(room) {
  if (room.phase !== "lobby") {
    throw Object.assign(new Error("Edite o baralho somente no lobby."), { statusCode: 409 });
  }
}

function validateCardInput(payload) {
  const title = cleanSingleLine(payload.title, 36, "Carta sem titulo");
  const category = cleanSingleLine(payload.category, 24, "Pergunta");
  const question = cleanMultiLine(payload.question, 280);
  const color = cleanColor(payload.color);
  const kind = validateCardKind(payload.kind);

  if (!question) {
    throw Object.assign(new Error("Escreva uma pergunta para a carta."), { statusCode: 422 });
  }

  return { title, category, question, color, kind };
}

function validateDeckName(value, fallback = "Deck sem nome") {
  return cleanSingleLine(value, 40, fallback);
}

function validateCardKind(value, fallback = DEFAULT_CARD_KIND) {
  const kind = cleanSingleLine(value, 24, fallback);
  return CARD_KIND_IDS.has(kind) ? kind : fallback;
}

function validateCardThemeId(value, fallback = DEFAULT_CARD_THEME_ID) {
  const themeId = cleanSingleLine(value, 32, fallback);
  return CARD_THEME_IDS.has(themeId) ? themeId : fallback;
}

function validateBackgroundId(value, fallback = DEFAULT_BACKGROUND_ID) {
  const backgroundId = cleanSingleLine(value, 32, fallback);
  return BACKGROUND_IDS.has(backgroundId) ? backgroundId : fallback;
}

function validateCardsPerRound(value, fallback = DEFAULT_CARDS_PER_ROUND) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return fallback;
  }

  return Math.min(50, Math.floor(numericValue));
}

function validateTimerSeconds(value, fallback = DEFAULT_TURN_TIMER_SECONDS) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return fallback;
  }

  return Math.min(300, Math.floor(numericValue));
}

function validateChatText(value) {
  return cleanMultiLine(value, MAX_CHAT_LENGTH).replace(/\n{3,}/g, "\n\n").trim();
}

function serializeDeck(deck) {
  return {
    id: deck.id,
    name: deck.name,
    cardCount: deck.cards.length,
    previewQuestion: deck.cards[0]?.question || "",
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt
  };
}

function mapCardsForDeck(cards) {
  return cards.map((card) => ({
    title: cleanSingleLine(card.title, 36, "Carta sem titulo"),
    category: cleanSingleLine(card.category, 24, "Pergunta"),
    question: cleanMultiLine(card.question, 280),
    color: cleanColor(card.color),
    kind: validateCardKind(card.kind)
  }));
}

function serializeChatMessage(message) {
  return {
    id: message.id,
    playerId: message.playerId,
    playerName: message.playerName,
    text: message.text,
    createdAt: message.createdAt,
    system: Boolean(message.system)
  };
}

function addChatMessage(room, options) {
  const text = validateChatText(options?.text);

  if (!text) {
    return null;
  }

  const message = {
    id: randomUUID(),
    playerId: cleanSingleLine(options?.playerId, 64, "system"),
    playerName: cleanSingleLine(options?.playerName, 24, "Sistema"),
    text,
    createdAt: Date.now(),
    system: Boolean(options?.system)
  };

  room.chatMessages = [...(room.chatMessages || []), message].slice(-MAX_CHAT_MESSAGES);
  return message;
}

function getRoundCardTarget(room) {
  const requestedCount = validateCardsPerRound(
    room.settings?.cardsPerRound,
    DEFAULT_CARDS_PER_ROUND
  );
  const totalCards = room.cards.length;

  if (requestedCount === 0) {
    return totalCards;
  }

  return Math.min(totalCards, requestedCount);
}

function getCurrentResponderId(room) {
  if (!room?.responderPlayerId) {
    return null;
  }

  return getPlayer(room, room.responderPlayerId)?.id || null;
}

function canAutoStartRoom(room) {
  return (
    room.phase === "lobby" &&
    room.cards.length > 0 &&
    room.players.length > 0 &&
    room.players.every((player) => player.isReady)
  );
}

function startRoomRound(room) {
  room.roundCardTotal = getRoundCardTarget(room);
  room.phase = "playing";
  room.drawPile = shuffle(room.cards.map((card) => card.id)).slice(0, room.roundCardTotal);
  room.currentCardId = room.drawPile.shift() || null;
  room.activePlayerId = room.drawPile.length > 0 || room.currentCardId
    ? room.players[0]?.id || null
    : null;
  room.responderPlayerId = room.activePlayerId;
  room.players.forEach((currentPlayer) => {
    currentPlayer.isReady = false;
  });
  scheduleRoundTimer(room);
}

function canAdvanceRound(room, playerId) {
  if (room.phase !== "playing" || !room.currentCardId) {
    return false;
  }

  if (!room.activePlayerId) {
    return true;
  }

  return room.activePlayerId === playerId;
}

async function handleCreateRoom(request, response) {
  const payload = await collectJson(request);
  const { room, playerId } = createRoom(payload.name);
  sendJson(response, 201, {
    playerId,
    state: serializeRoom(room, playerId)
  });
}

async function handleJoinRoom(request, response) {
  const payload = await collectJson(request);
  const roomCode = cleanSingleLine(payload.roomCode, 5).toUpperCase();
  const room = getRoom(roomCode);

  if (!room) {
    sendError(response, 404, "Sala nao encontrada.");
    return;
  }

  if (room.players.length >= MAX_PLAYERS_PER_ROOM) {
    sendError(response, 409, "A sala atingiu o limite de jogadores.");
    return;
  }

  const newPlayer = createPlayer(payload.name);
  room.players.push(newPlayer);
  addChatMessage(room, {
    playerId: "system",
    playerName: "Sistema",
    text: `${newPlayer.name} entrou na sala.`,
    system: true
  });
  touchRoom(room);
  broadcastRoom(room);

  sendJson(response, 200, {
    playerId: newPlayer.id,
    state: serializeRoom(room, newPlayer.id)
  });
}

async function handleReconnect(request, response) {
  const payload = await collectJson(request);
  const roomCode = cleanSingleLine(payload.roomCode, 5).toUpperCase();

  try {
    const { room } = ensureRoomAndPlayer(roomCode, payload.playerId);
    sendJson(response, 200, {
      playerId: payload.playerId,
      state: serializeRoom(room, payload.playerId)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

function handleEventStream(request, response, roomCode, playerId) {
  try {
    const { room } = ensureRoomAndPlayer(roomCode, playerId);

    response.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive"
    });

    response.viewerId = playerId;
    room.connections.add(response);
    response.write("retry: 3000\n\n");
    writeEvent(response, "sync", serializeRoom(room, playerId));

    const heartbeat = setInterval(() => {
      response.write(": ping\n\n");
    }, 20_000);

    request.on("close", () => {
      clearInterval(heartbeat);
      room.connections.delete(response);
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleLeaveRoom(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    const removedPlayer = removePlayerFromRoom(room, player.id);

    if (!removedPlayer || !rooms.has(room.code)) {
      sendJson(response, 200, { ok: true });
      return;
    }

    addChatMessage(room, {
      playerId: "system",
      playerName: "Sistema",
      text: `${removedPlayer.name} saiu da sala.`,
      system: true
    });
    touchRoom(room);
    broadcastRoom(room);
    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleKickPlayer(request, response, roomCode, targetPlayerId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);

    if (targetPlayerId === player.id) {
      throw Object.assign(new Error("O anfitriao nao pode se expulsar da propria sala."), {
        statusCode: 409
      });
    }

    const targetPlayer = getPlayer(room, targetPlayerId);

    if (!targetPlayer) {
      throw Object.assign(new Error("Jogador nao encontrado nessa sala."), {
        statusCode: 404
      });
    }

    disconnectPlayerConnections(room, targetPlayer.id, "kicked", {
      message: "Voce foi removido da sala pelo anfitriao."
    });

    removePlayerFromRoom(room, targetPlayer.id);

    if (!rooms.has(room.code)) {
      sendJson(response, 200, { ok: true });
      return;
    }

    addChatMessage(room, {
      playerId: "system",
      playerName: "Sistema",
      text: `${targetPlayer.name} foi removido da sala.`,
      system: true
    });
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      ok: true,
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleTransferHost(request, response, roomCode, targetPlayerId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);

    if (targetPlayerId === player.id) {
      throw Object.assign(new Error("Escolha outra pessoa para receber o anfitriao."), {
        statusCode: 409
      });
    }

    const targetPlayer = getPlayer(room, targetPlayerId);

    if (!targetPlayer) {
      throw Object.assign(new Error("Jogador nao encontrado nessa sala."), {
        statusCode: 404
      });
    }

    room.hostId = targetPlayer.id;
    addChatMessage(room, {
      playerId: "system",
      playerName: "Sistema",
      text: `${targetPlayer.name} agora e o anfitriao da sala.`,
      system: true
    });
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleUpdateRoomSettings(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);
    assertLobby(room);

    room.settings = {
      cardsPerRound: validateCardsPerRound(
        payload.cardsPerRound,
        room.settings?.cardsPerRound ?? DEFAULT_CARDS_PER_ROUND
      ),
      timerSeconds: validateTimerSeconds(
        payload.timerSeconds,
        room.settings?.timerSeconds ?? DEFAULT_TURN_TIMER_SECONDS
      )
    };
    room.roundCardTotal = getRoundCardTarget(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleSendChatMessage(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    const message = addChatMessage(room, {
      playerId: player.id,
      playerName: player.name,
      text: payload.text
    });

    if (!message) {
      throw Object.assign(new Error("Escreva uma mensagem antes de enviar."), {
        statusCode: 422
      });
    }

    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 201, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleChooseResponder(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);

    if (room.phase !== "playing" || !room.currentCardId) {
      throw Object.assign(new Error("Nao existe carta ativa para escolher quem responde."), {
        statusCode: 409
      });
    }

    const currentCard = getCard(room, room.currentCardId);

    if (!currentCard || currentCard.kind !== "choose-player") {
      throw Object.assign(new Error("A carta atual nao permite escolher quem responde."), {
        statusCode: 409
      });
    }

    if (room.activePlayerId && player.id !== room.activePlayerId) {
      throw Object.assign(new Error("Somente quem esta na vez pode escolher quem responde."), {
        statusCode: 403
      });
    }

    const targetPlayer = getPlayer(room, payload.responderPlayerId);

    if (!targetPlayer) {
      throw Object.assign(new Error("Jogador escolhido nao foi encontrado."), {
        statusCode: 404
      });
    }

    room.responderPlayerId = targetPlayer.id;
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleSkipResponder(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);

    if (room.phase !== "playing" || !room.currentCardId) {
      throw Object.assign(new Error("Nao existe carta ativa para pular a vez."), {
        statusCode: 409
      });
    }

    const currentCard = getCard(room, room.currentCardId);

    if (!currentCard || currentCard.kind !== "skip-turn") {
      throw Object.assign(new Error("A carta atual nao permite pular a vez."), {
        statusCode: 409
      });
    }

    if (room.activePlayerId && player.id !== room.activePlayerId) {
      throw Object.assign(new Error("Somente quem esta na vez pode pular a resposta."), {
        statusCode: 403
      });
    }

    const currentResponderId = room.responderPlayerId || room.activePlayerId || player.id;
    room.responderPlayerId = getNextPlayerId(room, currentResponderId);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleCreateCard(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertLobby(room);
    const cardInput = validateCardInput(payload);

    room.cards.push({
      id: randomUUID(),
      ...cardInput,
      authorId: player.id,
      authorName: player.name
    });
    room.roundCardTotal = getRoundCardTarget(room);

    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 201, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleUpdateCard(request, response, roomCode, cardId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertLobby(room);
    const card = getCard(room, cardId);

    if (!card) {
      throw Object.assign(new Error("Carta nao encontrada."), { statusCode: 404 });
    }

    if (!playerCanEditCard(room, player.id, card)) {
      throw Object.assign(new Error("Voce nao pode editar essa carta."), { statusCode: 403 });
    }

    Object.assign(card, validateCardInput(payload));
    room.roundCardTotal = getRoundCardTarget(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleDeleteCard(request, response, roomCode, cardId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertLobby(room);
    const card = getCard(room, cardId);

    if (!card) {
      throw Object.assign(new Error("Carta nao encontrada."), { statusCode: 404 });
    }

    if (!playerCanEditCard(room, player.id, card)) {
      throw Object.assign(new Error("Voce nao pode remover essa carta."), { statusCode: 403 });
    }

    room.cards = room.cards.filter((currentCard) => currentCard.id !== cardId);
    room.roundCardTotal = getRoundCardTarget(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleListDecks(request, response, roomCode, playerId) {
  try {
    ensureRoomAndPlayer(roomCode, playerId);
    sendJson(response, 200, {
      decks: savedDecks.map(serializeDeck)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleSaveDeck(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);
    assertLobby(room);

    if (!room.cards.length) {
      throw Object.assign(new Error("Adicione pelo menos uma carta antes de salvar o deck."), {
        statusCode: 409
      });
    }

    const name = validateDeckName(payload.name, `Deck ${room.code}`);
    const now = Date.now();
    const existingDeck = savedDecks.find(
      (deck) => deck.name.toLowerCase() === name.toLowerCase()
    );

    const mappedCards = mapCardsForDeck(room.cards);
    let savedDeck;

    if (existingDeck) {
      existingDeck.name = name;
      existingDeck.cards = mappedCards;
      existingDeck.updatedAt = now;
      savedDeck = existingDeck;
    } else {
      savedDeck = {
        id: randomUUID(),
        name,
        cards: mappedCards,
        createdAt: now,
        updatedAt: now
      };
      savedDecks.unshift(savedDeck);
    }

    persistSavedDecks();

    sendJson(response, 200, {
      savedDeck: serializeDeck(savedDeck),
      decks: savedDecks.map(serializeDeck)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleLoadDeck(request, response, roomCode, deckId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);
    assertLobby(room);

    const deck = savedDecks.find((item) => item.id === deckId);

    if (!deck) {
      throw Object.assign(new Error("Deck salvo nao encontrado."), { statusCode: 404 });
    }

    room.cards = deck.cards.map((card) => ({
      id: randomUUID(),
      title: card.title,
      category: card.category,
      question: card.question,
      color: card.color,
      kind: validateCardKind(card.kind),
      authorId: player.id,
      authorName: player.name
    }));
    room.currentCardId = null;
    room.drawPile = [];
    room.activePlayerId = null;
    room.responderPlayerId = null;
    room.roundCardTotal = getRoundCardTarget(room);
    clearRoundTimer(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id),
      decks: savedDecks.map(serializeDeck)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleImportDeck(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);
    assertLobby(room);

    if (!Array.isArray(payload.cards) || !payload.cards.length) {
      throw Object.assign(new Error("Envie pelo menos uma carta para carregar o deck."), {
        statusCode: 422
      });
    }

    const importedCards = payload.cards.map((card) => validateCardInput(card));

    room.cards = importedCards.map((card) => ({
      id: randomUUID(),
      title: card.title,
      category: card.category,
      question: card.question,
      color: card.color,
      kind: validateCardKind(card.kind),
      authorId: player.id,
      authorName: player.name
    }));
    room.currentCardId = null;
    room.drawPile = [];
    room.activePlayerId = null;
    room.responderPlayerId = null;
    room.roundCardTotal = getRoundCardTarget(room);
    clearRoundTimer(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleDeleteDeck(request, response, roomCode, deckId) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);
    assertLobby(room);

    const previousSize = savedDecks.length;
    savedDecks = savedDecks.filter((deck) => deck.id !== deckId);

    if (savedDecks.length === previousSize) {
      throw Object.assign(new Error("Deck salvo nao encontrado."), { statusCode: 404 });
    }

    persistSavedDecks();

    sendJson(response, 200, {
      decks: savedDecks.map(serializeDeck)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleUpdateAppearance(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);

    room.appearance = {
      cardThemeId: validateCardThemeId(
        payload.cardThemeId,
        room.appearance?.cardThemeId || DEFAULT_CARD_THEME_ID
      ),
      backgroundId: validateBackgroundId(
        payload.backgroundId,
        room.appearance?.backgroundId || DEFAULT_BACKGROUND_ID
      )
    };

    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleSetReady(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);

    if (room.phase !== "lobby") {
      throw Object.assign(new Error("O status pronto so pode ser usado no lobby."), {
        statusCode: 409
      });
    }

    player.isReady = payload.ready !== false;

    if (canAutoStartRoom(room)) {
      startRoomRound(room);
      addChatMessage(room, {
        playerId: "system",
        playerName: "Sistema",
        text: "Todo mundo marcou pronto. A rodada comecou!",
        system: true
      });
    }

    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleStartGame(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);

    if (!room.cards.length) {
      throw Object.assign(new Error("Adicione pelo menos uma carta antes de iniciar."), { statusCode: 409 });
    }

    startRoomRound(room);
    addChatMessage(room, {
      playerId: "system",
      playerName: "Sistema",
      text: "A rodada comecou.",
      system: true
    });
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleNextCard(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);

    if (room.phase !== "playing") {
      throw Object.assign(new Error("A rodada ainda nao comecou."), { statusCode: 409 });
    }

    if (!canAdvanceRound(room, player.id)) {
      const activePlayer = getPlayer(room, room.activePlayerId);
      throw Object.assign(
        new Error(
          activePlayer
            ? `Agora e a vez de ${activePlayer.name} puxar a proxima carta.`
            : "Ainda nao e a sua vez de puxar a proxima carta."
        ),
        { statusCode: 403 }
      );
    }

    advanceRoom(room);
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleResetGame(request, response, roomCode) {
  const payload = await collectJson(request);

  try {
    const { room, player } = ensureRoomAndPlayer(roomCode, payload.playerId);
    assertHost(room, player.id);

    room.phase = "lobby";
    room.currentCardId = null;
    room.drawPile = [];
    room.activePlayerId = null;
    room.responderPlayerId = null;
    room.roundCardTotal = getRoundCardTarget(room);
    clearRoundTimer(room);
    room.players.forEach((currentPlayer) => {
      currentPlayer.isReady = false;
    });
    addChatMessage(room, {
      playerId: "system",
      playerName: "Sistema",
      text: "A sala voltou para o lobby.",
      system: true
    });
    touchRoom(room);
    broadcastRoom(room);

    sendJson(response, 200, {
      state: serializeRoom(room, player.id)
    });
  } catch (error) {
    sendError(response, error.statusCode || 400, error.message);
  }
}

async function handleApi(request, response, pathname, url) {
  const segments = pathname.split("/").filter(Boolean);

  if (request.method === "POST" && pathname === "/api/rooms") {
    await handleCreateRoom(request, response);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/rooms/join") {
    await handleJoinRoom(request, response);
    return true;
  }

  if (request.method === "POST" && pathname === "/api/rooms/reconnect") {
    await handleReconnect(request, response);
    return true;
  }

  if (segments[0] !== "api" || segments[1] !== "rooms" || !segments[2]) {
    return false;
  }

  const roomCode = segments[2].toUpperCase();

  if (request.method === "GET" && segments[3] === "events") {
    handleEventStream(request, response, roomCode, url.searchParams.get("playerId"));
    return true;
  }

  if (request.method === "POST" && segments[3] === "leave") {
    await handleLeaveRoom(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "ready") {
    await handleSetReady(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "appearance") {
    await handleUpdateAppearance(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "settings") {
    await handleUpdateRoomSettings(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "chat") {
    await handleSendChatMessage(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "players" && segments[4] && segments[5] === "kick") {
    await handleKickPlayer(request, response, roomCode, segments[4]);
    return true;
  }

  if (request.method === "POST" && segments[3] === "players" && segments[4] && segments[5] === "host") {
    await handleTransferHost(request, response, roomCode, segments[4]);
    return true;
  }

  if (segments[3] === "cards" && request.method === "POST" && segments.length === 4) {
    await handleCreateCard(request, response, roomCode);
    return true;
  }

  if (segments[3] === "cards" && segments[4] && request.method === "PUT") {
    await handleUpdateCard(request, response, roomCode, segments[4]);
    return true;
  }

  if (segments[3] === "cards" && segments[4] && request.method === "DELETE") {
    await handleDeleteCard(request, response, roomCode, segments[4]);
    return true;
  }

  if (request.method === "GET" && segments[3] === "decks" && segments.length === 4) {
    await handleListDecks(request, response, roomCode, url.searchParams.get("playerId"));
    return true;
  }

  if (request.method === "POST" && segments[3] === "decks" && segments[4] === "save") {
    await handleSaveDeck(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "decks" && segments[4] === "import") {
    await handleImportDeck(request, response, roomCode);
    return true;
  }

  if (request.method === "POST" && segments[3] === "decks" && segments[4] && segments[5] === "load") {
    await handleLoadDeck(request, response, roomCode, segments[4]);
    return true;
  }

  if (request.method === "DELETE" && segments[3] === "decks" && segments[4]) {
    await handleDeleteDeck(request, response, roomCode, segments[4]);
    return true;
  }

  if (segments[3] === "game" && segments[4] === "start" && request.method === "POST") {
    await handleStartGame(request, response, roomCode);
    return true;
  }

  if (segments[3] === "game" && segments[4] === "next" && request.method === "POST") {
    await handleNextCard(request, response, roomCode);
    return true;
  }

  if (segments[3] === "game" && segments[4] === "respond" && request.method === "POST") {
    await handleChooseResponder(request, response, roomCode);
    return true;
  }

  if (segments[3] === "game" && segments[4] === "skip" && request.method === "POST") {
    await handleSkipResponder(request, response, roomCode);
    return true;
  }

  if (segments[3] === "game" && segments[4] === "reset" && request.method === "POST") {
    await handleResetGame(request, response, roomCode);
    return true;
  }

  return false;
}

function safePublicPath(requestPath) {
  const cleanPath = requestPath === "/" ? "/index.html" : requestPath;
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, cleanPath));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolvedPath;
}

function serveStatic(response, requestPath) {
  const filePath = safePublicPath(requestPath);

  if (!filePath) {
    sendError(response, 403, "Acesso negado.");
    return;
  }

  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendError(response, 404, "Arquivo nao encontrado.");
        return;
      }

      sendError(response, 500, "Erro ao carregar arquivo.");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(fileBuffer);
  });
}

function cleanupRooms() {
  const expiration = Date.now() - ROOM_TTL_MS;

  for (const room of rooms.values()) {
    if (room.updatedAt < expiration) {
      closeRoom(room, "A sala expirou por inatividade.");
    }
  }
}

loadSavedDecks();
setInterval(cleanupRooms, 15 * 60 * 1000).unref();

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const handledApi = await handleApi(request, response, url.pathname, url);

    if (handledApi) {
      return;
    }

    if (request.method !== "GET") {
      sendError(response, 404, "Rota nao encontrada.");
      return;
    }

    serveStatic(response, url.pathname);
  } catch (error) {
    sendError(response, error.statusCode || 500, error.message || "Erro interno.");
  }
});

server.listen(PORT, () => {
  console.log(`Carta Viva rodando em http://localhost:${PORT}`);
});
