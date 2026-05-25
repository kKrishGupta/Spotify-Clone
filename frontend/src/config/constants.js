import { coverCatalog } from "@/assets/images/coverCatalog";

export const roles = {
  user: "user",
  artist: "artist",
  admin: "admin",
};

export const demoUsers = {
  user: {
    id: "usr_001",
    name: "Anaya Rao",
    email: "listener@beatflow.ai",
    role: roles.user,
    plan: "Neural Plus",
  },
  artist: {
    id: "art_001",
    name: "Kairo Drift",
    email: "artist@beatflow.ai",
    role: roles.artist,
    plan: "Artist Pro",
  },
  admin: {
    id: "adm_001",
    name: "Mira Sen",
    email: "admin@beatflow.ai",
    role: roles.admin,
    plan: "Operator",
  },
};

export const sidebarSections = [
  {
    label: "Listen",
    items: [
      { label: "Home", path: "/app/home", icon: "Home", roles: ["user", "artist", "admin"] },
      { label: "Search", path: "/app/search", icon: "Search", roles: ["user", "artist", "admin"] },
      { label: "Dashboard", path: "/app/dashboard", icon: "LayoutDashboard", roles: ["user", "artist", "admin"] },
      { label: "Explore", path: "/app/explore", icon: "Compass", roles: ["user", "artist", "admin"] },
      { label: "Library", path: "/app/library", icon: "Library", roles: ["user", "artist", "admin"] },
      { label: "Liked Songs", path: "/app/liked", icon: "Heart", roles: ["user", "artist", "admin"] },
      { label: "Playlists", path: "/app/playlists", icon: "ListMusic", roles: ["user", "artist", "admin"] },
      { label: "Artists", path: "/app/artists", icon: "Mic2", roles: ["user", "artist", "admin"] },
      { label: "AI Mixes", path: "/app/ai/mood", icon: "Sparkles", roles: ["user", "artist", "admin"] },
      { label: "Live Feed", path: "/app/feed", icon: "Radio", roles: ["user", "artist", "admin"] },
      { label: "Social", path: "/app/social", icon: "UsersRound", roles: ["user", "artist", "admin"] },
      { label: "Signals", path: "/app/notifications", icon: "BellRing", roles: ["user", "artist", "admin"] },
      { label: "Premium", path: "/app/premium", icon: "Crown", roles: ["user", "artist", "admin"] },
    ],
  },
  {
    label: "AI Studio",
    items: [
      { label: "Assistant", path: "/app/ai/assistant", icon: "Sparkles", roles: ["user", "artist", "admin"] },
      { label: "Mood Engine", path: "/app/ai/mood", icon: "BrainCircuit", roles: ["user", "artist", "admin"] },
      { label: "Streaming Lab", path: "/app/streaming", icon: "RadioTower", roles: ["user", "artist", "admin"] },
      { label: "Full Player", path: "/app/player", icon: "Maximize2", roles: ["user", "artist", "admin"] },
      { label: "Analytics", path: "/app/analytics", icon: "LineChart", roles: ["artist", "admin"] },
    ],
  },
  {
    label: "Creator",
    items: [
      { label: "Artist Hub", path: "/app/artist", icon: "AudioWaveform", roles: ["artist", "admin"] },
      { label: "Upload Studio", path: "/app/artist/upload", icon: "UploadCloud", roles: ["artist", "admin"] },
      { label: "Audience", path: "/app/artist/analytics", icon: "UsersRound", roles: ["artist", "admin"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Admin Core", path: "/app/admin", icon: "ShieldCheck", roles: ["admin"] },
      { label: "Moderation", path: "/app/admin/moderation", icon: "ShieldAlert", roles: ["admin"] },
      { label: "Reports", path: "/app/admin/reports", icon: "FileWarning", roles: ["admin"] },
    ],
  },
];

export const mockSongs = [
  {
    id: "song-1",
    title: "Neon Raga",
    artist: "Kairo Drift",
    album: "Signal Bloom",
    duration: 224,
    bpm: 122,
    mood: "Electric focus",
    energy: 92,
    cover: coverCatalog.neonRaga,
    plays: 1284200,
    hlsUrl: "/streams/neon-raga/master.m3u8",
  },
  {
    id: "song-2",
    title: "Midnight Metro",
    artist: "Maya Flux",
    album: "City Afterimage",
    duration: 198,
    bpm: 104,
    mood: "Night drive",
    energy: 76,
    cover: coverCatalog.midnightMetro,
    plays: 876440,
    hlsUrl: "/streams/midnight-metro/master.m3u8",
  },
  {
    id: "song-3",
    title: "Velvet Signal",
    artist: "The Binary Saints",
    album: "Soft Machine",
    duration: 245,
    bpm: 88,
    mood: "Deep calm",
    energy: 58,
    cover: coverCatalog.velvetSignal,
    plays: 620330,
    hlsUrl: "/streams/velvet-signal/master.m3u8",
  },
  {
    id: "song-4",
    title: "Coastal Drive",
    artist: "Nira Coast",
    album: "Blue Hour Engine",
    duration: 211,
    bpm: 116,
    mood: "Sunlit motion",
    energy: 82,
    cover: coverCatalog.coastalDrive,
    plays: 1532040,
    hlsUrl: "/streams/coastal-drive/master.m3u8",
  },
  {
    id: "song-5",
    title: "Monsoon Bass",
    artist: "Rivaan",
    album: "Cloud Club",
    duration: 232,
    bpm: 128,
    mood: "High energy",
    energy: 95,
    cover: coverCatalog.monsoonBass,
    plays: 997240,
    hlsUrl: "/streams/monsoon-bass/master.m3u8",
  },
  {
    id: "song-6",
    title: "Solar Lo-Fi",
    artist: "Ada North",
    album: "Lazy Orbit",
    duration: 187,
    bpm: 74,
    mood: "Warm study",
    energy: 46,
    cover: coverCatalog.solarLoFi,
    plays: 402110,
    hlsUrl: "/streams/solar-lofi/master.m3u8",
  },
];

export const playlists = [
  {
    id: "pl-1",
    name: "AI Focus Orbit",
    description: "Adaptive tracks tuned to deep work and coding sessions.",
    collaborators: 12,
    saves: 48200,
    gradient: "from-pulse/80 via-plasma/70 to-aurora/80",
    tracks: mockSongs.slice(0, 4),
  },
  {
    id: "pl-2",
    name: "Mumbai After Dark",
    description: "Future pop, synthwave, and late-night club textures.",
    collaborators: 6,
    saves: 31200,
    gradient: "from-aurora/80 via-ember/70 to-plasma/80",
    tracks: [mockSongs[1], mockSongs[4], mockSongs[2]],
  },
  {
    id: "pl-3",
    name: "Calm Neural Reset",
    description: "Breathing-room ambience with a soft recommendation curve.",
    collaborators: 24,
    saves: 69000,
    gradient: "from-volt/70 via-pulse/70 to-plasma/70",
    tracks: [mockSongs[2], mockSongs[5], mockSongs[3]],
  },
];

export const analyticsSeries = [
  { label: "Mon", streams: 4200, saves: 820, skips: 220, revenue: 920 },
  { label: "Tue", streams: 6100, saves: 990, skips: 260, revenue: 1210 },
  { label: "Wed", streams: 7600, saves: 1440, skips: 310, revenue: 1435 },
  { label: "Thu", streams: 9800, saves: 1980, skips: 280, revenue: 1902 },
  { label: "Fri", streams: 12400, saves: 2660, skips: 380, revenue: 2400 },
  { label: "Sat", streams: 15600, saves: 3020, skips: 440, revenue: 3180 },
  { label: "Sun", streams: 13900, saves: 2880, skips: 390, revenue: 2910 },
];

export const audienceSegments = [
  { name: "Focus listeners", value: 38 },
  { name: "Night drivers", value: 27 },
  { name: "Workout energy", value: 21 },
  { name: "Discovery mode", value: 14 },
];

export const platformMetrics = [
  { label: "Live listeners", value: 128420, change: 18, icon: "Headphones" },
  { label: "Streams today", value: 3420000, change: 12, icon: "Activity" },
  { label: "AI matches", value: 914000, change: 23, icon: "Sparkles" },
  { label: "Moderation SLA", value: 96, change: 4, icon: "ShieldCheck", suffix: "%" },
];

export const feedEvents = [
  { id: "evt-1", user: "Arjun", action: "started a collaborative session", target: "AI Focus Orbit", time: "now" },
  { id: "evt-2", user: "Maya Flux", action: "released a spatial mix", target: "Midnight Metro", time: "2m" },
  { id: "evt-3", user: "Ops", action: "approved 18 songs", target: "Regional Discovery", time: "4m" },
  { id: "evt-4", user: "Nira Coast", action: "crossed 1.5M plays", target: "Coastal Drive", time: "8m" },
];

export const notifications = [
  { id: "note-1", title: "AI blend ready", body: "Your focus mix learned from the last 32 sessions.", tone: "ai" },
  { id: "note-2", title: "Artist spike", body: "Kairo Drift is trending in Bengaluru and Pune.", tone: "success" },
  { id: "note-3", title: "Moderation queue", body: "7 high-priority reports need review.", tone: "warning" },
];

export const moderationQueue = [
  { id: "mod-1", song: "Static Temple", artist: "Glass Circuit", risk: "Copyright match", score: 86, status: "Needs review" },
  { id: "mod-2", song: "Night Drip", artist: "Miz K", risk: "Explicit metadata", score: 71, status: "Policy check" },
  { id: "mod-3", song: "Hyper Rain", artist: "Sixth Lane", risk: "Artwork flag", score: 64, status: "Visual scan" },
];

export const lyrics = [
  { time: "0:12", line: "City lights begin to bend around the beat" },
  { time: "0:31", line: "Signals hum beneath the glass and concrete" },
  { time: "0:49", line: "Every pulse is mapping where we move" },
  { time: "1:08", line: "Turn the night into a neural groove" },
];

export const aiPrompts = [
  "Build a high-energy Hindi pop mix for a 30 minute commute",
  "Find songs like Neon Raga but softer and more acoustic",
  "Make a playlist that moves from calm focus to late-night dance",
];
