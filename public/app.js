const SESSION_KEY = "carta-viva-session";
const LOCAL_DECKS_KEY = "carta-viva-local-decks";
const AUDIO_VOLUME_KEY = "carta-viva-audio-volume";
const DEFAULT_AUDIO_VOLUME = 0.05;
const FINAL_SCREEN_IMAGES = [
  {
    src: "/thanks-finish.png",
    alt: "Obrigado por jogar"
  },
  {
    src: "/finish-whatsapp-1.jpeg",
    alt: "Foto final do grupo 1"
  },
  {
    src: "/finish-whatsapp-2.jpeg",
    alt: "Foto final do grupo 2"
  }
];
const DEFAULT_ROOM_APPEARANCE = {
  cardThemeId: "azure-whisper",
  backgroundId: "midnight-veil"
};
const CARD_THEME_PRESETS = [
  {
    id: "azure-whisper",
    name: "Azul sutil",
    description: "Classico claro com traco azul e verso marinho.",
    previewTitle: "Conexao leve",
    previewQuestion: "Qual lembranca simples te faz sorrir?",
    style: {
      "--card-front": "#f5efe2",
      "--card-front-asset": "url('/card-front.svg')",
      "--card-back": "#131d28",
      "--card-back-asset": "url('/card-back.svg')",
      "--card-ink": "#233040",
      "--card-ink-soft": "rgba(35, 48, 64, 0.84)",
      "--card-label-bg": "rgba(45, 86, 146, 0.12)",
      "--card-label-border": "rgba(45, 86, 146, 0.22)",
      "--card-label-text": "#345b92",
      "--card-label-soft-bg": "rgba(35, 48, 64, 0.08)",
      "--card-label-soft-border": "rgba(35, 48, 64, 0.14)",
      "--card-label-soft-text": "rgba(35, 48, 64, 0.78)",
      "--card-note-ink": "rgba(35, 48, 64, 0.62)"
    }
  },
  {
    id: "crimson-velvet",
    name: "Veludo carmim",
    description: "Marfim quente com detalhes rubi e verso vinho.",
    previewTitle: "Segredo doce",
    previewQuestion: "Que pedido de desculpas voce sonha ouvir?",
    style: {
      "--card-front": "#fff4ed",
      "--card-front-asset": "url('/card-front-crimson.svg')",
      "--card-back": "#35171d",
      "--card-back-asset": "url('/card-back-crimson.svg')",
      "--card-ink": "#5f2a2f",
      "--card-ink-soft": "rgba(95, 42, 47, 0.84)",
      "--card-label-bg": "rgba(157, 49, 59, 0.14)",
      "--card-label-border": "rgba(157, 49, 59, 0.24)",
      "--card-label-text": "#8f2f39",
      "--card-label-soft-bg": "rgba(95, 42, 47, 0.08)",
      "--card-label-soft-border": "rgba(95, 42, 47, 0.12)",
      "--card-label-soft-text": "rgba(95, 42, 47, 0.76)",
      "--card-note-ink": "rgba(95, 42, 47, 0.58)"
    }
  },
  {
    id: "violet-lock",
    name: "Cofre violeta",
    description: "Roxo com ouro, inspirado em caixa baixa.",
    previewTitle: "Cofre aberto",
    previewQuestion: "O que voce ainda nao disse, mas queria?",
    style: {
      "--card-front": "#fbf2ff",
      "--card-front-asset": "url('/card-front-violet.svg')",
      "--card-back": "#3e2350",
      "--card-back-asset": "url('/card-back-violet.svg')",
      "--card-ink": "#4d3066",
      "--card-ink-soft": "rgba(77, 48, 102, 0.84)",
      "--card-label-bg": "rgba(145, 111, 189, 0.16)",
      "--card-label-border": "rgba(145, 111, 189, 0.3)",
      "--card-label-text": "#7c58a7",
      "--card-label-soft-bg": "rgba(77, 48, 102, 0.08)",
      "--card-label-soft-border": "rgba(77, 48, 102, 0.14)",
      "--card-label-soft-text": "rgba(77, 48, 102, 0.76)",
      "--card-note-ink": "rgba(77, 48, 102, 0.58)"
    }
  },
  {
    id: "lunar-neon",
    name: "Lunar neon",
    description: "Noite magenta com brilho mistico.",
    previewTitle: "Lua viva",
    previewQuestion: "Qual energia voce quer sentir hoje?",
    style: {
      "--card-front": "#241429",
      "--card-front-asset": "url('/card-front-lunar.svg')",
      "--card-back": "#180f22",
      "--card-back-asset": "url('/card-back-lunar.svg')",
      "--card-ink": "#ffe2ff",
      "--card-ink-soft": "rgba(255, 226, 255, 0.84)",
      "--card-label-bg": "rgba(255, 122, 236, 0.16)",
      "--card-label-border": "rgba(255, 122, 236, 0.28)",
      "--card-label-text": "#ffcfff",
      "--card-label-soft-bg": "rgba(255, 255, 255, 0.08)",
      "--card-label-soft-border": "rgba(255, 255, 255, 0.12)",
      "--card-label-soft-text": "rgba(255, 226, 255, 0.72)",
      "--card-note-ink": "rgba(255, 226, 255, 0.56)"
    }
  },
  {
    id: "obsidian-gold",
    name: "Obsidiana dourada",
    description: "Preto profundo com linhas douradas e aura celestial.",
    previewTitle: "Mapa estelar",
    previewQuestion: "Que desejo voce faria se a noite respondesse?",
    style: {
      "--card-front": "#141313",
      "--card-front-asset": "url('/card-front-obsidian.svg')",
      "--card-back": "#0b0b0c",
      "--card-back-asset": "url('/card-back-obsidian.svg')",
      "--card-ink": "#f7e3a4",
      "--card-ink-soft": "rgba(247, 227, 164, 0.84)",
      "--card-label-bg": "rgba(237, 192, 87, 0.14)",
      "--card-label-border": "rgba(237, 192, 87, 0.28)",
      "--card-label-text": "#f5d67a",
      "--card-label-soft-bg": "rgba(247, 227, 164, 0.08)",
      "--card-label-soft-border": "rgba(247, 227, 164, 0.12)",
      "--card-label-soft-text": "rgba(247, 227, 164, 0.72)",
      "--card-note-ink": "rgba(247, 227, 164, 0.56)"
    }
  }
];
const BACKGROUND_PRESETS = [
  {
    id: "midnight-veil",
    name: "Midnight veil",
    description: "Escuro classico com brilho frio e palco preto.",
    style: {
      "--room-shell-bg": "radial-gradient(circle at top left, rgba(89, 77, 163, 0.2), transparent 28%), radial-gradient(circle at top right, rgba(31, 182, 156, 0.14), transparent 32%), linear-gradient(145deg, #0c0d16 0%, #12172a 48%, #050608 100%)",
      "--room-panel-bg": "linear-gradient(180deg, rgba(26, 30, 53, 0.9), rgba(9, 12, 24, 0.94))",
      "--room-panel-border": "rgba(255, 255, 255, 0.1)",
      "--room-panel-shadow": "0 28px 80px rgba(2, 6, 23, 0.35)",
      "--room-panel-gloss": "linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 45%)",
      "--room-drawer-bg": "linear-gradient(180deg, rgba(18, 22, 43, 0.98), rgba(8, 10, 18, 0.98))",
      "--room-section-bg": "rgba(255, 255, 255, 0.04)",
      "--room-table-bg": "#000000"
    }
  },
  {
    id: "violet-lounge",
    name: "Violet lounge",
    description: "Roxo vinho com fundo de sala mais dramatico.",
    style: {
      "--room-shell-bg": "radial-gradient(circle at top left, rgba(255, 99, 180, 0.16), transparent 22%), radial-gradient(circle at right, rgba(160, 118, 255, 0.22), transparent 28%), linear-gradient(150deg, #1e1129 0%, #2f193f 46%, #0b0b16 100%)",
      "--room-panel-bg": "linear-gradient(180deg, rgba(53, 26, 76, 0.9), rgba(20, 11, 32, 0.94))",
      "--room-panel-border": "rgba(241, 193, 255, 0.14)",
      "--room-panel-shadow": "0 28px 80px rgba(16, 5, 28, 0.46)",
      "--room-panel-gloss": "linear-gradient(135deg, rgba(255, 214, 255, 0.08), transparent 48%)",
      "--room-drawer-bg": "linear-gradient(180deg, rgba(42, 19, 63, 0.98), rgba(14, 8, 24, 0.98))",
      "--room-section-bg": "rgba(255, 255, 255, 0.05)",
      "--room-table-bg": "radial-gradient(circle at center, rgba(70, 39, 104, 0.16), transparent 26%), #09070d"
    }
  },
  {
    id: "ivory-glow",
    name: "Ivory glow",
    description: "Fundo claro sofisticado com paineis ainda legiveis.",
    style: {
      "--room-shell-bg": "radial-gradient(circle at top left, rgba(245, 210, 142, 0.26), transparent 24%), radial-gradient(circle at top right, rgba(124, 168, 255, 0.18), transparent 28%), linear-gradient(145deg, #f7f0e3 0%, #eadfd1 42%, #e6ddd2 100%)",
      "--room-panel-bg": "linear-gradient(180deg, rgba(45, 37, 57, 0.9), rgba(18, 14, 28, 0.94))",
      "--room-panel-border": "rgba(255, 255, 255, 0.16)",
      "--room-panel-shadow": "0 28px 72px rgba(74, 46, 19, 0.16)",
      "--room-panel-gloss": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent 52%)",
      "--room-drawer-bg": "linear-gradient(180deg, rgba(36, 30, 47, 0.98), rgba(18, 14, 26, 0.98))",
      "--room-section-bg": "rgba(255, 255, 255, 0.06)",
      "--room-table-bg": "radial-gradient(circle at center, rgba(248, 225, 180, 0.08), transparent 26%), #111010"
    }
  },
  {
    id: "stargazer-blue",
    name: "Stargazer blue",
    description: "Azul profundo com brilho de observatorio.",
    style: {
      "--room-shell-bg": "radial-gradient(circle at top left, rgba(124, 223, 255, 0.16), transparent 24%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 26%), linear-gradient(145deg, #08111d 0%, #10243d 42%, #050a12 100%)",
      "--room-panel-bg": "linear-gradient(180deg, rgba(16, 36, 61, 0.92), rgba(5, 12, 24, 0.96))",
      "--room-panel-border": "rgba(163, 213, 255, 0.14)",
      "--room-panel-shadow": "0 28px 80px rgba(2, 8, 20, 0.42)",
      "--room-panel-gloss": "linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 45%)",
      "--room-drawer-bg": "linear-gradient(180deg, rgba(11, 30, 52, 0.98), rgba(4, 10, 20, 0.98))",
      "--room-section-bg": "rgba(255, 255, 255, 0.05)",
      "--room-table-bg": "radial-gradient(circle at center, rgba(74, 181, 255, 0.14), transparent 28%), #020507"
    }
  },
  {
    id: "ember-parlor",
    name: "Ember parlor",
    description: "Baralho em uma sala quente de vinho e cobre.",
    style: {
      "--room-shell-bg": "radial-gradient(circle at top left, rgba(255, 155, 88, 0.18), transparent 24%), radial-gradient(circle at right, rgba(255, 70, 84, 0.18), transparent 28%), linear-gradient(145deg, #211111 0%, #3a1b1f 42%, #12090a 100%)",
      "--room-panel-bg": "linear-gradient(180deg, rgba(68, 26, 28, 0.92), rgba(28, 10, 12, 0.96))",
      "--room-panel-border": "rgba(255, 202, 184, 0.14)",
      "--room-panel-shadow": "0 28px 80px rgba(25, 7, 7, 0.44)",
      "--room-panel-gloss": "linear-gradient(135deg, rgba(255, 222, 214, 0.06), transparent 48%)",
      "--room-drawer-bg": "linear-gradient(180deg, rgba(56, 18, 20, 0.98), rgba(22, 8, 9, 0.98))",
      "--room-section-bg": "rgba(255, 255, 255, 0.05)",
      "--room-table-bg": "radial-gradient(circle at center, rgba(255, 133, 88, 0.12), transparent 28%), #070304"
    }
  }
];
const CARD_THEME_MAP = new Map(CARD_THEME_PRESETS.map((preset) => [preset.id, preset]));
const BACKGROUND_MAP = new Map(BACKGROUND_PRESETS.map((preset) => [preset.id, preset]));

const state = {
  room: null,
  savedDecks: [],
  activeTab: "start",
  menuOpen: false,
  animatingDraw: false,
  animateCardReveal: false,
  tableAnimation: "idle",
  editingCardId: null,
  eventSource: null,
  connection: "connecting",
  toastTimer: null,
  animationToken: 0,
  animationTimer: null,
  animationResetTimer: null,
  audioPrimed: false,
  audioVolume: DEFAULT_AUDIO_VOLUME
};

const elements = {
  pageShell: document.querySelector(".page-shell"),
  welcomeScreen: document.getElementById("welcome-screen"),
  gameScreen: document.getElementById("game-screen"),
  openRoomMenuButton: document.getElementById("open-room-menu-btn"),
  closeRoomMenuButton: document.getElementById("close-room-menu-btn"),
  roomMenuOverlay: document.getElementById("room-menu-overlay"),
  roomDrawer: document.getElementById("room-drawer"),
  startView: document.getElementById("start-view"),
  tableView: document.getElementById("table-view"),
  cardsView: document.getElementById("cards-view"),
  themesView: document.getElementById("themes-view"),
  tabStart: document.getElementById("tab-start"),
  tabTable: document.getElementById("tab-table"),
  tabCards: document.getElementById("tab-cards"),
  tabThemes: document.getElementById("tab-themes"),
  createRoomForm: document.getElementById("create-room-form"),
  joinRoomForm: document.getElementById("join-room-form"),
  joinCodeInput: document.getElementById("join-code"),
  roomCode: document.getElementById("room-code"),
  drawerRoomCode: document.getElementById("drawer-room-code"),
  drawerRoomCodeInline: document.getElementById("drawer-room-code-inline"),
  copyRoomButton: document.getElementById("copy-room-btn"),
  leaveRoomButton: document.getElementById("leave-room-btn"),
  connectionIndicator: document.getElementById("connection-indicator"),
  connectionText: document.getElementById("connection-text"),
  startPhasePill: document.getElementById("start-phase-pill"),
  playersCount: document.getElementById("players-count"),
  playersList: document.getElementById("players-list"),
  drawerPlayersCount: document.getElementById("drawer-players-count"),
  drawerPlayersList: document.getElementById("drawer-players-list"),
  drawerBoardCopy: document.getElementById("drawer-board-copy"),
  editorTitle: document.getElementById("editor-title"),
  editorPhase: document.getElementById("editor-phase"),
  cardForm: document.getElementById("card-form"),
  cardFormFieldset: document.getElementById("card-form-fieldset"),
  cardTitle: document.getElementById("card-title"),
  cardCategory: document.getElementById("card-category"),
  cardQuestion: document.getElementById("card-question"),
  cardColor: document.getElementById("card-color"),
  deckNameInput: document.getElementById("deck-name"),
  saveDeckButton: document.getElementById("save-deck-btn"),
  cancelEditButton: document.getElementById("cancel-edit-btn"),
  saveCardButton: document.getElementById("save-card-btn"),
  boardTitle: document.getElementById("board-title"),
  boardSubtitle: document.getElementById("board-subtitle"),
  currentCardSlot: document.getElementById("current-card-slot"),
  totalCardsStat: document.getElementById("total-cards-stat"),
  revealedCardsStat: document.getElementById("revealed-cards-stat"),
  remainingCardsStat: document.getElementById("remaining-cards-stat"),
  startTotalCardsStat: document.getElementById("start-total-cards-stat"),
  startRevealedCardsStat: document.getElementById("start-revealed-cards-stat"),
  startRemainingCardsStat: document.getElementById("start-remaining-cards-stat"),
  startGameButton: document.getElementById("start-game-btn"),
  nextCardButton: document.getElementById("next-card-btn"),
  resetGameButton: document.getElementById("reset-game-btn"),
  deckCountPill: document.getElementById("deck-count-pill"),
  deckList: document.getElementById("deck-list"),
  savedDecksCount: document.getElementById("saved-decks-count"),
  savedDecksList: document.getElementById("saved-decks-list"),
  themesCopy: document.getElementById("themes-copy"),
  cardThemeGrid: document.getElementById("card-theme-grid"),
  backgroundGrid: document.getElementById("background-grid"),
  audioVolume: document.getElementById("audio-volume"),
  audioVolumeValue: document.getElementById("audio-volume-value"),
  shuffleAudio: document.getElementById("shuffle-audio"),
  drawAudio: document.getElementById("draw-audio"),
  finishAudio: document.getElementById("finish-audio"),
  lobbyAudio: document.getElementById("lobby-audio"),
  toast: document.getElementById("toast")
};

function setActiveTab(tabName) {
  state.activeTab = tabName;

  const tabs = [
    { name: "start", button: elements.tabStart, view: elements.startView },
    { name: "table", button: elements.tabTable, view: elements.tableView },
    { name: "cards", button: elements.tabCards, view: elements.cardsView },
    { name: "themes", button: elements.tabThemes, view: elements.themesView }
  ];

  tabs.forEach(({ name, button, view }) => {
    const isActive = name === state.activeTab;
    button.classList.toggle("is-active", isActive);
    view.classList.toggle("hidden", !isActive);
  });

  elements.pageShell.classList.toggle("is-room", Boolean(state.room));
  elements.pageShell.classList.toggle("is-table-tab", Boolean(state.room) && state.activeTab === "table");
}

function setRoomMenuOpen(isOpen) {
  state.menuOpen = Boolean(isOpen) && Boolean(state.room);

  elements.pageShell.classList.toggle("is-menu-open", state.menuOpen);
  elements.roomDrawer.classList.toggle("is-open", state.menuOpen);
  elements.roomMenuOverlay.classList.toggle("is-open", state.menuOpen);
  elements.roomDrawer.inert = !state.menuOpen;
  elements.roomDrawer.setAttribute("aria-hidden", state.menuOpen ? "false" : "true");
  elements.openRoomMenuButton.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
}

function handleTabChange(tabName) {
  setActiveTab(tabName);
  setRoomMenuOpen(false);
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");

  state.toastTimer = window.setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2800);
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clearTableAnimationTimers() {
  window.clearTimeout(state.animationTimer);
  window.clearTimeout(state.animationResetTimer);
  state.animationTimer = null;
  state.animationResetTimer = null;
}

function stopAudio(audioElement) {
  if (!audioElement) {
    return;
  }

  audioElement.pause();
  audioElement.currentTime = 0;
}

function primeAudio() {
  if (state.audioPrimed) {
    return;
  }

  state.audioPrimed = true;
  getManagedAudioElements().forEach((audioElement) => {
    audioElement?.load();
  });
  syncLobbyAudio();
}

async function playAudio(audioElement) {
  if (!audioElement) {
    return;
  }

  try {
    audioElement.currentTime = 0;
    await audioElement.play();
  } catch (error) {
    audioElement.pause();
  }
}

function queueAnimationReset(token, delay = 760) {
  window.clearTimeout(state.animationResetTimer);
  state.animationResetTimer = window.setTimeout(() => {
    if (state.animationToken !== token) {
      return;
    }

    state.tableAnimation = "idle";
    render();
  }, delay);
}

function triggerTableAnimation(kind) {
  clearTableAnimationTimers();
  state.animationToken += 1;
  const token = state.animationToken;

  if (kind === "intro") {
    stopAudio(elements.finishAudio);
    stopAudio(elements.lobbyAudio);
    state.tableAnimation = "shuffle";
    stopAudio(elements.drawAudio);
    playAudio(elements.shuffleAudio);
    render();

    state.animationTimer = window.setTimeout(() => {
      if (state.animationToken !== token) {
        return;
      }

      stopAudio(elements.shuffleAudio);
      state.tableAnimation = "reveal";
      state.animateCardReveal = true;
      playAudio(elements.drawAudio);
      render();
      queueAnimationReset(token);
    }, 1500);

    return;
  }

  if (kind === "draw") {
    stopAudio(elements.finishAudio);
    stopAudio(elements.shuffleAudio);
    stopAudio(elements.lobbyAudio);
    state.tableAnimation = "reveal";
    state.animateCardReveal = true;
    playAudio(elements.drawAudio);
    render();
    queueAnimationReset(token);
    return;
  }

  stopAudio(elements.shuffleAudio);
  stopAudio(elements.finishAudio);
  stopAudio(elements.lobbyAudio);
  state.tableAnimation = "idle";
}

function loadSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function saveSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function loadStoredAudioVolume() {
  try {
    const rawValue = Number(window.localStorage.getItem(AUDIO_VOLUME_KEY));

    if (Number.isFinite(rawValue)) {
      return Math.min(1, Math.max(0, rawValue));
    }
  } catch (error) {
    return DEFAULT_AUDIO_VOLUME;
  }

  return DEFAULT_AUDIO_VOLUME;
}

function getManagedAudioElements() {
  return [
    elements.shuffleAudio,
    elements.drawAudio,
    elements.finishAudio,
    elements.lobbyAudio
  ].filter(Boolean);
}

function applyAudioVolume() {
  const normalizedVolume = Math.min(1, Math.max(0, state.audioVolume));

  getManagedAudioElements().forEach((audioElement) => {
    audioElement.volume = normalizedVolume;
  });

  if (elements.audioVolume) {
    elements.audioVolume.value = String(Math.round(normalizedVolume * 100));
  }

  if (elements.audioVolumeValue) {
    elements.audioVolumeValue.textContent = `${Math.round(normalizedVolume * 100)}%`;
  }
}

function setAudioVolume(nextVolume) {
  state.audioVolume = Math.min(1, Math.max(0, nextVolume));
  window.localStorage.setItem(AUDIO_VOLUME_KEY, String(state.audioVolume));
  applyAudioVolume();
}

function syncLobbyAudio() {
  const shouldPlay = Boolean(state.room && state.room.phase === "lobby" && state.audioPrimed);

  if (!shouldPlay) {
    stopAudio(elements.lobbyAudio);
    return;
  }

  if (!elements.lobbyAudio.paused) {
    return;
  }

  elements.lobbyAudio.currentTime = 0;
  elements.lobbyAudio.play().catch(() => {
    elements.lobbyAudio.pause();
  });
}

function initializeAudioPreferences() {
  state.audioVolume = loadStoredAudioVolume();
  applyAudioVolume();
}

function getCardThemePreset(themeId) {
  return CARD_THEME_MAP.get(themeId) || CARD_THEME_MAP.get(DEFAULT_ROOM_APPEARANCE.cardThemeId);
}

function getBackgroundPreset(backgroundId) {
  return BACKGROUND_MAP.get(backgroundId) || BACKGROUND_MAP.get(DEFAULT_ROOM_APPEARANCE.backgroundId);
}

function getRoomAppearance(room) {
  return {
    cardThemeId: room?.appearance?.cardThemeId || DEFAULT_ROOM_APPEARANCE.cardThemeId,
    backgroundId: room?.appearance?.backgroundId || DEFAULT_ROOM_APPEARANCE.backgroundId
  };
}

function applyStyleVariables(target, variables = {}) {
  Object.entries(variables).forEach(([name, value]) => {
    target.style.setProperty(name, value);
  });
}

function applyRoomAppearance(room) {
  const appearance = getRoomAppearance(room);
  const cardTheme = getCardThemePreset(appearance.cardThemeId);
  const backgroundTheme = getBackgroundPreset(appearance.backgroundId);
  const mergedVariables = {
    ...cardTheme.style,
    ...backgroundTheme.style
  };

  applyStyleVariables(elements.pageShell, mergedVariables);
  elements.pageShell.dataset.cardTheme = cardTheme.id;
  elements.pageShell.dataset.backgroundTheme = backgroundTheme.id;
}

function normalizeSingleLine(value, maxLength, fallback = "") {
  const cleaned = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  return (cleaned || fallback).slice(0, maxLength);
}

function normalizeMultiLine(value, maxLength) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeCardColor(value) {
  const cleaned = String(value || "").trim();
  return /^#([\da-f]{3}|[\da-f]{6})$/i.test(cleaned) ? cleaned : "#c79d51";
}

function createLocalDeckId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `deck-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapCardsForLocalDeck(cards) {
  return cards
    .map((card) => ({
      title: normalizeSingleLine(card.title, 36, "Carta sem titulo"),
      category: normalizeSingleLine(card.category, 24, "Pergunta"),
      question: normalizeMultiLine(card.question, 280),
      color: normalizeCardColor(card.color)
    }))
    .filter((card) => card.question);
}

function normalizeStoredDeck(deck) {
  const cards = mapCardsForLocalDeck(Array.isArray(deck?.cards) ? deck.cards : []);

  if (!cards.length) {
    return null;
  }

  const createdAt = Number(deck?.createdAt) || Date.now();
  const updatedAt = Number(deck?.updatedAt) || createdAt;

  return {
    id: typeof deck?.id === "string" && deck.id ? deck.id : createLocalDeckId(),
    name: normalizeSingleLine(deck?.name, 40, "Deck sem nome"),
    cards,
    cardCount: cards.length,
    previewQuestion: cards[0]?.question || "",
    createdAt,
    updatedAt
  };
}

function loadLocalDeckLibrary() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_DECKS_KEY) || "[]");

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeStoredDeck)
      .filter(Boolean)
      .sort((left, right) => right.updatedAt - left.updatedAt);
  } catch (error) {
    return [];
  }
}

function persistLocalDeckLibrary(decks) {
  const serializableDecks = decks.map((deck) => ({
    id: deck.id,
    name: deck.name,
    cards: mapCardsForLocalDeck(deck.cards || []),
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt
  }));

  window.localStorage.setItem(LOCAL_DECKS_KEY, JSON.stringify(serializableDecks));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Nao foi possivel completar a acao.");
  }

  return payload;
}

async function refreshSavedDecks() {
  state.savedDecks = loadLocalDeckLibrary();
}

function session() {
  return loadSession();
}

function currentPlayer() {
  if (!state.room) {
    return null;
  }

  return state.room.players.find((player) => player.id === state.room.viewerId) || null;
}

function setConnectionStatus(mode) {
  state.connection = mode;
  elements.connectionIndicator.classList.remove("live", "offline");

  if (mode === "live") {
    elements.connectionIndicator.classList.add("live");
    elements.connectionText.textContent = "Ao vivo";
    return;
  }

  if (mode === "offline") {
    elements.connectionIndicator.classList.add("offline");
    elements.connectionText.textContent = "Reconectando";
    return;
  }

  elements.connectionText.textContent = "Conectando";
}

function closeEventStream() {
  if (state.eventSource) {
    state.eventSource.close();
    state.eventSource = null;
  }
}

function resetEditor() {
  state.editingCardId = null;
  elements.editorTitle.textContent = "Nova carta";
  elements.saveCardButton.textContent = "Salvar carta";
  elements.cancelEditButton.classList.add("hidden");
  elements.cardForm.reset();
  elements.cardColor.value = "#c79d51";
}

function beginEdit(cardId) {
  if (!state.room) {
    return;
  }

  const card = state.room.cards.find((item) => item.id === cardId);

  if (!card) {
    return;
  }

  state.editingCardId = card.id;
  elements.editorTitle.textContent = "Editar carta";
  elements.saveCardButton.textContent = "Salvar alteracoes";
  elements.cancelEditButton.classList.remove("hidden");
  elements.cardTitle.value = card.title;
  elements.cardCategory.value = card.category;
  elements.cardQuestion.value = card.question;
  elements.cardColor.value = card.color;
  elements.cardQuestion.focus();
}

function applyRoom(snapshot) {
  const previousPhase = state.room?.phase || null;
  const previousCardId = state.room?.currentCard?.id || null;
  const nextCardId = snapshot.currentCard?.id || null;
  const shouldPlayFinishTheme =
    snapshot.phase === "finished" && previousPhase !== "finished";
  const shouldRunIntro =
    previousPhase === "lobby" &&
    snapshot.phase === "playing" &&
    Boolean(nextCardId);
  const shouldAnimateDraw =
    previousPhase === "playing" &&
    snapshot.phase === "playing" &&
    previousCardId !== nextCardId &&
    Boolean(nextCardId);

  state.animateCardReveal = shouldAnimateDraw;

  state.room = snapshot;

  if (
    state.editingCardId &&
    !snapshot.cards.some((card) => card.id === state.editingCardId)
  ) {
    resetEditor();
  }

  if (snapshot.phase !== "lobby" && state.editingCardId) {
    resetEditor();
  }

  if (snapshot.phase !== "playing") {
    clearTableAnimationTimers();
    stopAudio(elements.shuffleAudio);
    state.tableAnimation = "idle";
  }

  if (snapshot.phase !== "lobby") {
    stopAudio(elements.lobbyAudio);
  }

  if (snapshot.phase !== "finished") {
    stopAudio(elements.finishAudio);
  }

  if (shouldRunIntro) {
    triggerTableAnimation("intro");
    return;
  }

  if (shouldAnimateDraw) {
    triggerTableAnimation("draw");
    return;
  }

  if (shouldPlayFinishTheme) {
    stopAudio(elements.shuffleAudio);
    stopAudio(elements.drawAudio);
    playAudio(elements.finishAudio);
  }

  syncLobbyAudio();
  render();
}

function connectEvents(roomCode, playerId) {
  closeEventStream();
  setConnectionStatus("connecting");

  const source = new EventSource(
    `/api/rooms/${encodeURIComponent(roomCode)}/events?playerId=${encodeURIComponent(playerId)}`
  );

  source.addEventListener("open", () => {
    setConnectionStatus("live");
  });

  source.addEventListener("sync", (event) => {
    applyRoom(JSON.parse(event.data));
    setConnectionStatus("live");
  });

  source.addEventListener("room-closed", (event) => {
    const data = JSON.parse(event.data);
    showToast(data.message || "A sala foi encerrada.");
    disconnectFromRoom(false);
  });

  source.onerror = () => {
    setConnectionStatus("offline");
  };

  state.eventSource = source;
}

function disconnectFromRoom(clearRemote = true) {
  const activeSession = session();
  closeEventStream();
  clearTableAnimationTimers();
  stopAudio(elements.shuffleAudio);
  stopAudio(elements.drawAudio);
  stopAudio(elements.finishAudio);
  stopAudio(elements.lobbyAudio);
  state.room = null;
  state.savedDecks = [];
  state.activeTab = "start";
  state.menuOpen = false;
  state.tableAnimation = "idle";
  resetEditor();
  clearSession();
  setRoomMenuOpen(false);
  render();

  if (clearRemote && activeSession) {
    api(`/api/rooms/${activeSession.roomCode}/leave`, {
      method: "POST",
      body: { playerId: activeSession.playerId }
    }).catch(() => {});
  }
}

function createTextElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function createFrontCard(options = {}) {
  const shell = document.createElement("article");
  shell.className = "ornate-card ornate-card--front";

  if (options.compact) {
    shell.classList.add("ornate-card--compact");
  }

  if (options.plain) {
    shell.classList.add("ornate-card--plain");
  }

  if (options.message) {
    shell.classList.add("ornate-card--message");
  }

  const content = document.createElement("div");
  content.className = "ornate-card__content";

  if (options.categoryText || options.counterText) {
    const head = document.createElement("div");
    head.className = "ornate-card__head";

    if (options.categoryText) {
      head.append(createTextElement("span", options.categoryText, "card-label"));
    }

    if (options.counterText) {
      head.append(createTextElement("span", options.counterText, "card-label card-label--soft"));
    }

    content.append(head);
  }

  const body = document.createElement("div");
  body.className = "ornate-card__body";
  body.append(createTextElement("h3", options.titleText || "", "ornate-card__title"));
  body.append(createTextElement("p", options.questionText || "", "ornate-card__question"));

  if (options.noteText) {
    body.append(createTextElement("small", options.noteText, "ornate-card__note"));
  }

  content.append(body);

  if (options.footerLeft || options.footerRight) {
    const foot = document.createElement("div");
    foot.className = "ornate-card__footer";

    if (options.footerLeft) {
      foot.append(createTextElement("span", options.footerLeft));
    }

    if (options.footerRight) {
      foot.append(createTextElement("span", options.footerRight));
    }

    content.append(foot);
  }

  shell.append(content);
  return shell;
}

function createCardStack(frontCard, compact = false) {
  const stack = document.createElement("div");
  stack.className = compact ? "card-stack card-stack--compact" : "card-stack";

  const back = document.createElement("div");
  back.className = compact
    ? "ornate-card ornate-card--back ornate-card--compact card-stack__back"
    : "ornate-card ornate-card--back card-stack__back";
  back.setAttribute("aria-hidden", "true");

  frontCard.classList.add("card-stack__front");
  stack.append(back, frontCard);
  return stack;
}

function buildMessageCard(title, description, categoryText) {
  const front = createFrontCard({
    message: true,
    titleText: title,
    questionText: description,
    categoryText
  });

  return createCardStack(front);
}

function getActivePlayer(room) {
  if (!room?.activePlayerId) {
    return null;
  }

  return room.players.find((player) => player.id === room.activePlayerId) || null;
}

function canViewerAdvanceCard(room) {
  if (!room || room.phase !== "playing" || !room.currentCard) {
    return false;
  }

  if (!room.activePlayerId) {
    return true;
  }

  return room.viewerId === room.activePlayerId;
}

function getSeatPosition(index, total) {
  const layouts = {
    1: [{ x: 10, y: 50 }],
    2: [{ x: 10, y: 50 }, { x: 90, y: 50 }],
    3: [{ x: 10, y: 50 }, { x: 28, y: 92 }, { x: 72, y: 92 }],
    4: [{ x: 10, y: 50 }, { x: 26, y: 92 }, { x: 74, y: 92 }, { x: 90, y: 50 }],
    5: [{ x: 10, y: 50 }, { x: 22, y: 84 }, { x: 50, y: 94 }, { x: 78, y: 84 }, { x: 90, y: 50 }],
    6: [{ x: 10, y: 30 }, { x: 10, y: 70 }, { x: 26, y: 92 }, { x: 74, y: 92 }, { x: 90, y: 70 }, { x: 90, y: 30 }],
    7: [{ x: 10, y: 30 }, { x: 10, y: 70 }, { x: 24, y: 92 }, { x: 50, y: 94 }, { x: 90, y: 70 }, { x: 90, y: 34 }, { x: 58, y: 8 }],
    8: [{ x: 10, y: 24 }, { x: 10, y: 70 }, { x: 24, y: 92 }, { x: 50, y: 94 }, { x: 90, y: 76 }, { x: 90, y: 28 }, { x: 58, y: 8 }, { x: 22, y: 8 }]
  };

  if (layouts[total]) {
    return layouts[total][index];
  }

  const fallback = [
    { x: 10, y: 24 },
    { x: 10, y: 50 },
    { x: 10, y: 76 },
    { x: 24, y: 92 },
    { x: 42, y: 94 },
    { x: 58, y: 94 },
    { x: 76, y: 92 },
    { x: 90, y: 76 },
    { x: 90, y: 50 },
    { x: 90, y: 24 },
    { x: 60, y: 8 },
    { x: 24, y: 8 }
  ];

  return fallback[index % fallback.length];
}

function createTablePlayerSeat(player, index, total, room) {
  const seat = document.createElement("article");
  const position = getSeatPosition(index, total);
  const activePlayer = getActivePlayer(room);
  const isActive = activePlayer?.id === player.id;

  seat.className = "table-seat";
  seat.style.setProperty("--seat-x", `${position.x}%`);
  seat.style.setProperty("--seat-y", `${position.y}%`);

  if (isActive) {
    seat.classList.add("is-active");
  }

  if (room.phase === "lobby" && player.isReady) {
    seat.classList.add("is-ready");
  }

  const chrome = document.createElement("div");
  chrome.className = "table-seat__chrome";

  const top = document.createElement("div");
  top.className = "table-seat__topline";

  const nameWrap = document.createElement("div");
  nameWrap.className = "table-seat__name";

  nameWrap.append(createTextElement("strong", player.name));

  if (isActive) {
    const dot = document.createElement("span");
    dot.className = "seat-turn-dot";
    dot.setAttribute("aria-hidden", "true");
    nameWrap.append(dot);
  }

  top.append(nameWrap);
  chrome.append(top);
  seat.append(chrome);
  return seat;
}

function createFaceDownPile(room) {
  const pile = document.createElement("div");
  pile.className = "table-pile";

  const stack = document.createElement("div");
  stack.className = "pile-stack";

  for (let index = 0; index < 3; index += 1) {
    const backCard = document.createElement("div");
    backCard.className = "ornate-card ornate-card--back pile-stack__card";
    backCard.setAttribute("aria-hidden", "true");
    stack.append(backCard);
  }

  pile.append(stack);
  return pile;
}

async function handleReadyToggle() {
  if (!state.room || state.room.phase !== "lobby") {
    return;
  }

  const viewer = currentPlayer();

  if (!viewer) {
    return;
  }

  try {
    await api(`/api/rooms/${state.room.roomCode}/ready`, {
      method: "POST",
      body: {
        playerId: state.room.viewerId,
        ready: !viewer.isReady
      }
    });
  } catch (error) {
    showToast(error.message);
  }
}

function createTableCardPanel(label, cardElement, hint, variant = "") {
  const panel = document.createElement("div");
  panel.className = "table-card-panel";

  if (variant) {
    panel.classList.add(`table-card-panel--${variant}`);
  }

  panel.append(createTextElement("span", label, "table-card-panel__label"));

  const viewport = document.createElement("div");
  viewport.className = "table-card-panel__viewport";
  viewport.append(cardElement);
  panel.append(viewport);

  if (hint) {
    panel.append(createTextElement("small", hint, "table-card-panel__hint"));
  }

  return panel;
}

function createFinishScreen() {
  const wrap = document.createElement("section");
  wrap.className = "table-finish-screen";

  const gallery = document.createElement("div");
  gallery.className = "table-finish-screen__gallery";
  gallery.style.setProperty("--finish-slides", String(FINAL_SCREEN_IMAGES.length));

  FINAL_SCREEN_IMAGES.forEach((item, index) => {
    const image = document.createElement("img");
    image.className = "table-finish-screen__image";
    image.src = item.src;
    image.alt = item.alt;
    image.style.setProperty("--slide-index", String(index));
    gallery.append(image);
  });

  const content = document.createElement("div");
  content.className = "table-finish-screen__content";
  content.append(createTextElement("p", "Carta Viva", "table-finish-screen__eyebrow"));
  content.append(createTextElement("h2", "Obrigado por jogar", "table-finish-screen__title"));
  content.append(
    createTextElement(
      "p",
      "A rodada terminou. Curte as fotos finais e abra o menu para reiniciar a partida ou voltar ao lobby e montar novas cartas.",
      "table-finish-screen__copy"
    )
  );

  wrap.append(gallery, content);
  return wrap;
}

async function handlePileAdvance() {
  if (!state.room || state.animatingDraw) {
    return;
  }

  const activePlayer = getActivePlayer(state.room);

  if (!canViewerAdvanceCard(state.room)) {
    showToast(
      activePlayer
        ? `Agora e a vez de ${activePlayer.name} puxar a proxima carta.`
        : "Espere a rodada liberar a proxima puxada."
    );
    return;
  }

  if (state.room.phase !== "playing" || !state.room.currentCard) {
    return;
  }

  state.animatingDraw = true;

  const pile = document.querySelector(".table-pile");
  const faceUpCard = document.querySelector(".table-open-card");

  pile?.classList.add("is-engaged");
  faceUpCard?.classList.add("is-fading-out");

  await sleep(360);
  const didAdvance = await handleGameAction("next");
  state.animatingDraw = false;

  if (!didAdvance) {
    render();
  }
}

function renderPlayers(room) {
  elements.playersList.replaceChildren();
  elements.drawerPlayersList.replaceChildren();
  elements.playersCount.textContent = String(room.players.length);
  elements.drawerPlayersCount.textContent = String(room.players.length);
  const activePlayer = getActivePlayer(room);

  room.players.forEach((player) => {
    const row = document.createElement("article");
    row.className = "player-pill";

    if (activePlayer?.id === player.id) {
      row.classList.add("player-pill--active");
    }

    const meta = document.createElement("div");
    meta.className = "player-meta";
    meta.append(createTextElement("strong", player.name));
    meta.append(
      createTextElement(
        "small",
        activePlayer?.id === player.id && room.phase === "playing"
          ? "Na vez agora"
          : player.id === room.viewerId
            ? "Voce esta aqui"
            : "Acompanhando a rodada"
      )
    );

    row.append(meta);

    const labels = document.createElement("div");
    labels.className = "player-pill__badges";

    if (activePlayer?.id === player.id && room.phase === "playing") {
      labels.append(createTextElement("span", "Na vez", "host-badge host-badge--active"));
    }

    if (room.phase === "lobby" && player.isReady) {
      labels.append(createTextElement("span", "Pronto", "host-badge host-badge--ready"));
    }

    if (player.isHost) {
      labels.append(createTextElement("span", "Anfitriao", "host-badge"));
    }

    row.append(labels);

    elements.playersList.append(row);

    const drawerRow = document.createElement("article");
    drawerRow.className = "drawer-player-pill";

    if (activePlayer?.id === player.id) {
      drawerRow.classList.add("drawer-player-pill--active");
    }

    const drawerMeta = document.createElement("div");
    drawerMeta.className = "player-meta";
    drawerMeta.append(createTextElement("strong", player.name));
    drawerMeta.append(
      createTextElement(
        "small",
        activePlayer?.id === player.id && room.phase === "playing"
          ? "Na vez agora"
          : player.id === room.viewerId
            ? "Voce esta aqui"
            : "Acompanhando a mesa"
      )
    );

    const drawerLabels = document.createElement("div");
    drawerLabels.className = "player-pill__badges";

    if (activePlayer?.id === player.id && room.phase === "playing") {
      drawerLabels.append(createTextElement("span", "Na vez", "host-badge host-badge--active"));
    }

    if (room.phase === "lobby" && player.isReady) {
      drawerLabels.append(createTextElement("span", "Pronto", "host-badge host-badge--ready"));
    }

    if (player.isHost) {
      drawerLabels.append(createTextElement("span", "Anfitriao", "host-badge"));
    }

    drawerRow.append(drawerMeta, drawerLabels);
    elements.drawerPlayersList.append(drawerRow);
  });
}

function renderCurrentCard(room) {
  elements.currentCardSlot.replaceChildren();
  const tableStage = document.createElement("div");
  tableStage.className = "table-stage";
  tableStage.classList.toggle("is-shuffling", state.tableAnimation === "shuffle");
  tableStage.classList.toggle("is-revealing-card", state.tableAnimation === "reveal");

  const playersLayer = document.createElement("div");
  playersLayer.className = "table-players-layer";
  room.players.forEach((player, index) => {
    playersLayer.append(createTablePlayerSeat(player, index, room.players.length, room));
  });

  const counter = document.createElement("div");
  counter.className = "table-counter";
  counter.textContent =
    room.phase === "finished"
      ? "Fim da rodada"
      : `Carta ${room.stats.revealedCards} de ${room.stats.totalCards}`;

  const center = document.createElement("div");
  center.className = "table-center";

  if (room.phase === "finished") {
    center.append(createFinishScreen());
    tableStage.append(playersLayer, counter, center);
    elements.currentCardSlot.append(tableStage);
    state.animateCardReveal = false;
    return;
  }

  let faceUpCard;
  const isShuffleIntro = state.tableAnimation === "shuffle" && room.phase === "playing";

  if (isShuffleIntro) {
    faceUpCard = createFrontCard({
      titleText: "Embaralhando",
      questionText: "Preparando a primeira carta da rodada.",
      noteText: "Misturando o monte antes de revelar."
    });
  } else if (room.currentCard) {
    faceUpCard = createFrontCard({
      categoryText: room.currentCard.category || "Pergunta",
      titleText: room.currentCard.title,
      questionText: room.currentCard.question
    });
  } else {
    faceUpCard = createFrontCard({
      titleText: "Pronto para jogar",
      questionText: "Inicie a rodada quando todos estiverem na mesa."
    });
  }

  faceUpCard.classList.add("table-open-card");
  faceUpCard.classList.toggle("is-concealed", isShuffleIntro);

  if (state.animateCardReveal) {
    faceUpCard.classList.add("is-revealing");
  }

  const pileElement = createFaceDownPile(room);

  if (room.phase === "playing" && room.currentCard) {
    pileElement.classList.add("is-clickable");
    pileElement.setAttribute("role", "button");
    pileElement.setAttribute("tabindex", "0");
    pileElement.setAttribute("aria-label", "Virar proxima carta");
    pileElement.addEventListener("click", handlePileAdvance);
    pileElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handlePileAdvance();
      }
    });
  }

  if (state.animateCardReveal) {
    pileElement.classList.add("is-drawing");
  }

  const cardsRow = document.createElement("div");
  cardsRow.className = "table-center-cards";
  cardsRow.append(createTableCardPanel("", faceUpCard, "", "open"));
  cardsRow.append(createTableCardPanel("", pileElement, "", "pile"));

  center.append(cardsRow);
  tableStage.append(playersLayer, counter, center);

  if (room.phase === "lobby") {
    const readyRail = document.createElement("div");
    readyRail.className = "table-ready-rail";

    const viewer = currentPlayer();
    const readyButton = document.createElement("button");
    readyButton.type = "button";
    readyButton.className = "table-ready-btn";
    readyButton.textContent = viewer?.isReady ? "Pronto" : "Pronto";
    readyButton.setAttribute("aria-pressed", viewer?.isReady ? "true" : "false");

    if (viewer?.isReady) {
      readyButton.classList.add("is-active");
    }

    readyButton.addEventListener("click", () => {
      primeAudio();
      handleReadyToggle();
    });

    const readyCount = room.players.filter((player) => player.isReady).length;
    const helper = createTextElement(
      "small",
      viewer?.isReady
        ? `Voce marcou pronto. ${readyCount} de ${room.players.length} jogador${room.players.length === 1 ? "" : "es"} confirmado${readyCount === 1 ? "" : "s"}. Quando todos estiverem prontos, a rodada comeca sozinha.`
        : `${readyCount} de ${room.players.length} jogador${room.players.length === 1 ? "" : "es"} pronto${readyCount === 1 ? "" : "s"}. Quando todos confirmarem, a rodada comeca sozinha.`,
      "table-ready-copy"
    );

    readyRail.append(readyButton, helper);
    tableStage.append(readyRail);
  }

  elements.currentCardSlot.append(tableStage);
  state.animateCardReveal = false;
}

function renderDeck(room) {
  elements.deckList.replaceChildren();
  elements.deckCountPill.textContent = String(room.cards.length);

  if (!room.cards.length) {
    const emptyWrap = document.createElement("div");
    emptyWrap.className = "deck-empty";
    emptyWrap.append(
      buildMessageCard(
        "Sem cartas ainda",
        "Use o editor ao lado para escrever sua primeira pergunta personalizada.",
        "Baralho aguardando"
      )
    );
    elements.deckList.append(emptyWrap);
    return;
  }

  room.cards.forEach((card) => {
    const item = document.createElement("article");
    item.className = "deck-entry";

    const front = createFrontCard({
      compact: true,
      categoryText: card.category || "Pergunta",
      titleText: card.title,
      questionText: card.question
    });

    item.append(createCardStack(front, true));

    const toolbar = document.createElement("div");
    toolbar.className = "deck-entry__toolbar";
    toolbar.append(
      createTextElement(
        "span",
        room.phase === "lobby"
          ? "Use o verso escuro para embaralhar e a frente clara para ler a pergunta."
          : "Carta bloqueada durante a rodada.",
        "deck-entry__hint"
      )
    );

    if (room.phase === "lobby" && (card.canEdit || card.canDelete)) {
      const actions = document.createElement("div");
      actions.className = "deck-entry__actions";

      if (card.canEdit) {
        const editButton = createTextElement("button", "Editar", "mini-btn");
        editButton.type = "button";
        editButton.addEventListener("click", () => beginEdit(card.id));
        actions.append(editButton);
      }

      if (card.canDelete) {
        const deleteButton = createTextElement("button", "Excluir", "mini-btn");
        deleteButton.type = "button";
        deleteButton.addEventListener("click", async () => {
          try {
            await api(`/api/rooms/${room.roomCode}/cards/${card.id}`, {
              method: "DELETE",
              body: { playerId: room.viewerId }
            });
          } catch (error) {
            showToast(error.message);
          }
        });
        actions.append(deleteButton);
      }

      toolbar.append(actions);
    }

    item.append(toolbar);

    elements.deckList.append(item);
  });
}

function formatDeckTimestamp(value) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(value));
  } catch (error) {
    return "";
  }
}

function renderSavedDecks(room) {
  elements.savedDecksList.replaceChildren();
  elements.savedDecksCount.textContent = String(state.savedDecks.length);

  if (!state.savedDecks.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "saved-deck-empty";
    emptyState.append(createTextElement("strong", "Nenhum deck salvo ainda"));
    emptyState.append(
      createTextElement(
        "p",
        "Salve o baralho atual para reutilizar estas cartas em outras salas."
      )
    );
    elements.savedDecksList.append(emptyState);
    return;
  }

  state.savedDecks.forEach((deck) => {
    const card = document.createElement("article");
    card.className = "saved-deck-card";

    const header = document.createElement("div");
    header.className = "saved-deck-card__head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "saved-deck-card__title";
    titleWrap.append(createTextElement("strong", deck.name));
    titleWrap.append(
      createTextElement(
        "small",
        `${deck.cardCount} carta${deck.cardCount === 1 ? "" : "s"}${deck.updatedAt ? ` • ${formatDeckTimestamp(deck.updatedAt)}` : ""}`
      )
    );

    header.append(titleWrap);
    header.append(createTextElement("span", String(deck.cardCount), "number-pill"));
    card.append(header);

    if (deck.previewQuestion) {
      card.append(createTextElement("p", deck.previewQuestion, "saved-deck-card__preview"));
    }

    const actions = document.createElement("div");
    actions.className = "saved-deck-card__actions";

    const canManage = room.isHost && room.phase === "lobby";

    const loadButton = createTextElement("button", "Carregar", "mini-btn");
    loadButton.type = "button";
    loadButton.disabled = !canManage;
    loadButton.addEventListener("click", async () => {
      try {
        const payload = await api(
          `/api/rooms/${room.roomCode}/decks/${deck.id}/load`,
          {
            method: "POST",
            body: { playerId: room.viewerId }
          }
        );

        if (payload.decks) {
          state.savedDecks = payload.decks;
        }

        if (payload.state) {
          applyRoom(payload.state);
        }

        showToast(`Deck ${deck.name} carregado.`);
      } catch (error) {
        showToast(error.message);
      }
    });

    const deleteButton = createTextElement("button", "Excluir", "mini-btn");
    deleteButton.type = "button";
    deleteButton.disabled = !canManage;
    deleteButton.addEventListener("click", async () => {
      try {
        const payload = await api(
          `/api/rooms/${room.roomCode}/decks/${deck.id}`,
          {
            method: "DELETE",
            body: { playerId: room.viewerId }
          }
        );

        state.savedDecks = payload.decks || [];
        renderSavedDecks(room);
        showToast(`Deck ${deck.name} removido.`);
      } catch (error) {
        showToast(error.message);
      }
    });

    actions.append(loadButton, deleteButton);
    card.append(actions);
    elements.savedDecksList.append(card);
  });
}

function renderBoardCopy(room) {
  const activePlayer = getActivePlayer(room);

  if (room.phase === "lobby") {
    elements.boardTitle.textContent = "Prepare a mesa e distribua os jogadores";
    elements.boardSubtitle.textContent =
      "Edite cartas, escolha o tema e deixe todos marcarem pronto. Quando a sala inteira confirmar, a rodada comeca automaticamente.";
    return;
  }

  if (room.phase === "playing") {
    elements.boardTitle.textContent = activePlayer
      ? `${activePlayer.name} esta na vez`
      : "Rodada em andamento";
    elements.boardSubtitle.textContent =
      room.currentCard
        ? "Leia a pergunta aberta no centro da mesa e avance para a proxima vez quando o grupo terminar."
        : "A rodada esta fechando. Avance para encerrar.";
    return;
  }

  elements.boardTitle.textContent = "A mesa terminou esta rodada";
  elements.boardSubtitle.textContent =
    "Voce pode iniciar outra rodada com o mesmo baralho ou voltar ao lobby para customizar as cartas.";
}

function render() {
  const room = state.room;
  const inRoom = Boolean(room);
  applyRoomAppearance(room);
  elements.welcomeScreen.classList.toggle("hidden", inRoom);
  elements.gameScreen.classList.toggle("hidden", !inRoom);
  elements.openRoomMenuButton.classList.toggle("hidden", !inRoom);
  elements.pageShell.classList.toggle("is-room", inRoom);
  elements.pageShell.classList.toggle("is-table-tab", inRoom && state.activeTab === "table");
  elements.pageShell.classList.toggle("is-menu-open", inRoom && state.menuOpen);

  if (!room) {
    setRoomMenuOpen(false);
    setConnectionStatus("connecting");
    setActiveTab("start");
    return;
  }

  if (!["start", "table", "cards", "themes"].includes(state.activeTab)) {
    state.activeTab = room.phase === "playing" ? "table" : "start";
  }

  renderPlayers(room);
  renderCurrentCard(room);
  renderDeck(room);
  renderSavedDecks(room);
  renderThemeStudio(room);
  renderBoardCopy(room);

  elements.roomCode.textContent = room.roomCode;
  elements.drawerRoomCode.textContent = room.roomCode;
  elements.drawerRoomCodeInline.textContent = room.roomCode;

  const phaseLabel =
    room.phase === "lobby" ? "Lobby" : room.phase === "playing" ? "Ao vivo" : "Finalizada";

  elements.startPhasePill.textContent = phaseLabel;
  elements.editorPhase.textContent = phaseLabel;
  elements.totalCardsStat.textContent = String(room.stats.totalCards);
  elements.revealedCardsStat.textContent = String(room.stats.revealedCards);
  elements.remainingCardsStat.textContent = String(room.stats.remainingCards);
  elements.startTotalCardsStat.textContent = String(room.stats.totalCards);
  elements.startRevealedCardsStat.textContent = String(room.stats.revealedCards);
  elements.startRemainingCardsStat.textContent = String(room.stats.remainingCards);
  elements.drawerBoardCopy.textContent = elements.boardSubtitle.textContent;

  const deckEditable = room.phase === "lobby";
  elements.cardFormFieldset.disabled = !deckEditable;
  elements.saveCardButton.disabled = !deckEditable;
  const canSaveDeck = room.isHost && deckEditable && room.cards.length > 0;
  elements.saveDeckButton.disabled = !canSaveDeck;
  elements.deckNameInput.disabled = !canSaveDeck;

  if (!deckEditable) {
    elements.editorTitle.textContent = "Baralho bloqueado durante a rodada";
  } else if (!state.editingCardId) {
    elements.editorTitle.textContent = "Nova carta";
  }

  elements.startGameButton.disabled = !room.isHost || room.stats.totalCards === 0;
  elements.nextCardButton.disabled = !canViewerAdvanceCard(room);
  elements.resetGameButton.disabled = !room.isHost || room.phase === "lobby";
  elements.startGameButton.textContent =
    room.phase === "lobby" ? "Comecar rodada agora" : "Reiniciar rodada";

  setActiveTab(state.activeTab);
}

async function handleCreateRoom(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const payload = await api("/api/rooms", {
      method: "POST",
      body: { name: formData.get("name") }
    });

    state.activeTab = "start";
    setRoomMenuOpen(false);
    saveSession({ roomCode: payload.state.roomCode, playerId: payload.playerId });
    applyRoom(payload.state);
    connectEvents(payload.state.roomCode, payload.playerId);
    await refreshSavedDecks();
    render();
    form.reset();
    showToast(`Sala ${payload.state.roomCode} criada.`);
  } catch (error) {
    showToast(error.message);
  }
}

async function handleJoinRoom(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const payload = await api("/api/rooms/join", {
      method: "POST",
      body: {
        name: formData.get("name"),
        roomCode: String(formData.get("roomCode") || "").toUpperCase()
      }
    });

    state.activeTab = payload.state.phase === "playing" ? "table" : "start";
    setRoomMenuOpen(false);
    saveSession({ roomCode: payload.state.roomCode, playerId: payload.playerId });
    applyRoom(payload.state);
    connectEvents(payload.state.roomCode, payload.playerId);
    await refreshSavedDecks();
    render();
    form.reset();
    showToast(`Voce entrou na sala ${payload.state.roomCode}.`);
  } catch (error) {
    showToast(error.message);
  }
}

async function handleCardSubmit(event) {
  event.preventDefault();

  if (!state.room) {
    return;
  }

  const wasEditing = Boolean(state.editingCardId);
  const body = {
    playerId: state.room.viewerId,
    title: elements.cardTitle.value,
    category: elements.cardCategory.value,
    question: elements.cardQuestion.value,
    color: elements.cardColor.value
  };

  const path = state.editingCardId
    ? `/api/rooms/${state.room.roomCode}/cards/${state.editingCardId}`
    : `/api/rooms/${state.room.roomCode}/cards`;
  const method = state.editingCardId ? "PUT" : "POST";

  try {
    await api(path, { method, body });
    resetEditor();
    showToast(wasEditing ? "Carta atualizada." : "Carta criada.");
  } catch (error) {
    showToast(error.message);
  }
}

function getDeckCardCount(deck) {
  if (Array.isArray(deck.cards)) {
    return deck.cards.length;
  }

  return Number(deck.cardCount) || 0;
}

function getDeckPreviewQuestion(deck) {
  if (deck.previewQuestion) {
    return deck.previewQuestion;
  }

  return deck.cards?.[0]?.question || "";
}

function renderSavedDecks(room) {
  elements.savedDecksList.replaceChildren();
  elements.savedDecksCount.textContent = String(state.savedDecks.length);

  if (!state.savedDecks.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "saved-deck-empty";
    emptyState.append(createTextElement("strong", "Nenhum deck salvo neste navegador"));
    emptyState.append(
      createTextElement(
        "p",
        "Salve o baralho atual para reutilizar estas cartas neste PC, mesmo sem plano pago."
      )
    );
    elements.savedDecksList.append(emptyState);
    return;
  }

  state.savedDecks.forEach((deck) => {
    const card = document.createElement("article");
    card.className = "saved-deck-card";

    const cardCount = getDeckCardCount(deck);
    const header = document.createElement("div");
    header.className = "saved-deck-card__head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "saved-deck-card__title";
    titleWrap.append(createTextElement("strong", deck.name));
    titleWrap.append(
      createTextElement(
        "small",
        `${cardCount} carta${cardCount === 1 ? "" : "s"}${deck.updatedAt ? ` • ${formatDeckTimestamp(deck.updatedAt)}` : ""}`
      )
    );

    header.append(titleWrap);
    header.append(createTextElement("span", String(cardCount), "number-pill"));
    card.append(header);

    const previewQuestion = getDeckPreviewQuestion(deck);

    if (previewQuestion) {
      card.append(createTextElement("p", previewQuestion, "saved-deck-card__preview"));
    }

    const actions = document.createElement("div");
    actions.className = "saved-deck-card__actions";

    const canManage = room.isHost && room.phase === "lobby";

    const loadButton = createTextElement("button", "Carregar", "mini-btn");
    loadButton.type = "button";
    loadButton.disabled = !canManage;
    loadButton.addEventListener("click", async () => {
      try {
        const payload = await api(`/api/rooms/${room.roomCode}/decks/import`, {
          method: "POST",
          body: {
            playerId: room.viewerId,
            name: deck.name,
            cards: deck.cards || []
          }
        });

        if (payload.state) {
          applyRoom(payload.state);
        }

        showToast(`Deck ${deck.name} carregado.`);
      } catch (error) {
        showToast(error.message);
      }
    });

    const deleteButton = createTextElement("button", "Excluir", "mini-btn");
    deleteButton.type = "button";
    deleteButton.disabled = !canManage;
    deleteButton.addEventListener("click", () => {
      state.savedDecks = state.savedDecks.filter((item) => item.id !== deck.id);
      persistLocalDeckLibrary(state.savedDecks);
      renderSavedDecks(room);
      showToast(`Deck ${deck.name} removido do navegador.`);
    });

    actions.append(loadButton, deleteButton);
    card.append(actions);
    elements.savedDecksList.append(card);
  });
}

function renderThemeStudio(room) {
  const appearance = getRoomAppearance(room);
  const isHost = Boolean(room.isHost);
  elements.cardThemeGrid.replaceChildren();
  elements.backgroundGrid.replaceChildren();

  elements.themesCopy.textContent = isHost
    ? "Escolha um tema para as cartas e um background para a sala inteira. O visual atualiza ao vivo para todo mundo."
    : "O anfitriao escolhe o visual da sala. Voce ja acompanha as trocas ao vivo aqui.";

  CARD_THEME_PRESETS.forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-option";
    button.disabled = !isHost;

    if (appearance.cardThemeId === theme.id) {
      button.classList.add("is-selected");
    }

    const preview = document.createElement("div");
    preview.className = "theme-option__preview";
    applyStyleVariables(preview, theme.style);

    const card = createFrontCard({
      compact: true,
      categoryText: "Tema",
      titleText: theme.previewTitle,
      questionText: theme.previewQuestion
    });
    preview.append(createCardStack(card, true));

    const meta = document.createElement("div");
    meta.className = "theme-option__meta";
    meta.append(createTextElement("strong", theme.name));
    meta.append(createTextElement("p", theme.description));

    const badge = createTextElement(
      "span",
      appearance.cardThemeId === theme.id ? "Selecionado" : "Aplicar",
      "theme-option__badge"
    );

    button.append(preview, meta, badge);
    button.addEventListener("click", () => {
      handleAppearanceChange({ cardThemeId: theme.id });
    });
    elements.cardThemeGrid.append(button);
  });

  BACKGROUND_PRESETS.forEach((background) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "background-option";
    button.disabled = !isHost;

    if (appearance.backgroundId === background.id) {
      button.classList.add("is-selected");
    }

    const preview = document.createElement("div");
    preview.className = "background-option__preview";
    preview.style.background = background.style["--room-shell-bg"];

    const previewPanel = document.createElement("div");
    previewPanel.className = "background-option__panel";
    previewPanel.style.background = background.style["--room-panel-bg"];
    previewPanel.style.borderColor = background.style["--room-panel-border"];

    const previewChip = document.createElement("span");
    previewChip.className = "background-option__chip";
    previewChip.style.background = background.style["--room-table-bg"];

    previewPanel.append(previewChip);
    preview.append(previewPanel);

    const meta = document.createElement("div");
    meta.className = "background-option__meta";
    meta.append(createTextElement("strong", background.name));
    meta.append(createTextElement("p", background.description));

    const badge = createTextElement(
      "span",
      appearance.backgroundId === background.id ? "Selecionado" : "Aplicar",
      "theme-option__badge"
    );

    button.append(preview, meta, badge);
    button.addEventListener("click", () => {
      handleAppearanceChange({ backgroundId: background.id });
    });
    elements.backgroundGrid.append(button);
  });
}

async function handleAppearanceChange(partialAppearance) {
  if (!state.room) {
    return;
  }

  if (!state.room.isHost) {
    showToast("Apenas o anfitriao pode trocar o tema da sala.");
    return;
  }

  try {
    const currentAppearance = getRoomAppearance(state.room);
    const payload = await api(`/api/rooms/${state.room.roomCode}/appearance`, {
      method: "POST",
      body: {
        playerId: state.room.viewerId,
        cardThemeId: partialAppearance.cardThemeId || currentAppearance.cardThemeId,
        backgroundId: partialAppearance.backgroundId || currentAppearance.backgroundId
      }
    });

    if (payload.state) {
      applyRoom(payload.state);
    }

    showToast("Visual da sala atualizado.");
  } catch (error) {
    showToast(error.message);
  }
}

async function handleSaveDeck() {
  if (!state.room) {
    return;
  }

  try {
    if (!state.room.cards.length) {
      throw new Error("Adicione pelo menos uma carta antes de salvar o deck.");
    }

    const name = normalizeSingleLine(
      elements.deckNameInput.value,
      40,
      `Deck ${state.room.roomCode}`
    );
    const cards = mapCardsForLocalDeck(state.room.cards);

    if (!cards.length) {
      throw new Error("Esse deck nao tem perguntas validas para salvar.");
    }

    const now = Date.now();
    const existingDeck = state.savedDecks.find(
      (deck) => deck.name.toLowerCase() === name.toLowerCase()
    );
    let savedDeck;

    if (existingDeck) {
      existingDeck.name = name;
      existingDeck.cards = cards;
      existingDeck.cardCount = cards.length;
      existingDeck.previewQuestion = cards[0]?.question || "";
      existingDeck.updatedAt = now;
      savedDeck = existingDeck;
    } else {
      savedDeck = {
        id: createLocalDeckId(),
        name,
        cards,
        cardCount: cards.length,
        previewQuestion: cards[0]?.question || "",
        createdAt: now,
        updatedAt: now
      };
      state.savedDecks.unshift(savedDeck);
    }

    state.savedDecks.sort((left, right) => right.updatedAt - left.updatedAt);
    persistLocalDeckLibrary(state.savedDecks);
    renderSavedDecks(state.room);
    elements.deckNameInput.value = savedDeck.name;
    showToast(`Deck ${savedDeck.name} salvo neste navegador.`);
  } catch (error) {
    showToast(error.message);
  }
}

async function handleGameAction(action) {
  if (!state.room) {
    return false;
  }

  try {
    primeAudio();
    await api(`/api/rooms/${state.room.roomCode}/game/${action}`, {
      method: "POST",
      body: { playerId: state.room.viewerId }
    });

    if (action === "start" || action === "next") {
      state.activeTab = "table";
    }

    if (action === "reset") {
      state.activeTab = "start";
    }

    setRoomMenuOpen(false);
    setActiveTab(state.activeTab);
    return true;
  } catch (error) {
    showToast(error.message);
    return false;
  }
}

async function attemptReconnect() {
  const activeSession = session();

  if (!activeSession) {
    return;
  }

  try {
    const payload = await api("/api/rooms/reconnect", {
      method: "POST",
      body: activeSession
    });

    state.activeTab = payload.state.phase === "playing" ? "table" : "start";
    setRoomMenuOpen(false);
    applyRoom(payload.state);
    connectEvents(payload.state.roomCode, payload.playerId);
    await refreshSavedDecks();
    render();
  } catch (error) {
    clearSession();
  }
}

function hydrateInviteCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const roomCode = params.get("sala");

  if (roomCode) {
    elements.joinCodeInput.value = roomCode.toUpperCase();
  }
}

function bindEvents() {
  const primeAndContinue = () => {
    primeAudio();
    document.removeEventListener("pointerdown", primeAndContinue);
    document.removeEventListener("keydown", primeAndContinue);
  };

  document.addEventListener("pointerdown", primeAndContinue);
  document.addEventListener("keydown", primeAndContinue);
  elements.createRoomForm.addEventListener("submit", handleCreateRoom);
  elements.joinRoomForm.addEventListener("submit", handleJoinRoom);
  elements.cardForm.addEventListener("submit", handleCardSubmit);
  elements.saveDeckButton.addEventListener("click", handleSaveDeck);
  elements.audioVolume.addEventListener("input", (event) => {
    setAudioVolume(Number(event.currentTarget.value) / 100);
  });
  elements.cancelEditButton.addEventListener("click", resetEditor);
  elements.openRoomMenuButton.addEventListener("click", () => setRoomMenuOpen(!state.menuOpen));
  elements.closeRoomMenuButton.addEventListener("click", () => setRoomMenuOpen(false));
  elements.roomMenuOverlay.addEventListener("click", () => setRoomMenuOpen(false));
  elements.tabStart.addEventListener("click", () => handleTabChange("start"));
  elements.tabTable.addEventListener("click", () => handleTabChange("table"));
  elements.tabCards.addEventListener("click", () => handleTabChange("cards"));
  elements.tabThemes.addEventListener("click", () => handleTabChange("themes"));
  elements.startGameButton.addEventListener("click", () => handleGameAction("start"));
  elements.nextCardButton.addEventListener("click", () => handleGameAction("next"));
  elements.resetGameButton.addEventListener("click", () => handleGameAction("reset"));

  document.querySelectorAll("[data-open-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      handleTabChange(button.dataset.openTab);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setRoomMenuOpen(false);
    }
  });

  elements.joinCodeInput.addEventListener("input", () => {
    elements.joinCodeInput.value = elements.joinCodeInput.value.toUpperCase();
  });

  elements.copyRoomButton.addEventListener("click", async () => {
    if (!state.room) {
      return;
    }

    const inviteLink = `${window.location.origin}?sala=${state.room.roomCode}`;

    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast("Convite copiado.");
    } catch (error) {
      showToast("Nao foi possivel copiar o convite.");
    }
  });

  elements.leaveRoomButton.addEventListener("click", () => {
    disconnectFromRoom(true);
  });
}

initializeAudioPreferences();
hydrateInviteCodeFromUrl();
bindEvents();
attemptReconnect();
render();
