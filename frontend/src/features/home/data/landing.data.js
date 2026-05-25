import {
  AudioLines,
  BadgeCheck,
  Bot,
  BrainCircuit,
  Compass,
  Crown,
  Disc3,
  Headphones,
  Library,
  ListMusic,
  Mic2,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WandSparkles,
  Zap,
} from "lucide-react";

export const navItems = [
  { label: "Explore", href: "#discovery" },
  { label: "Premium", href: "#premium" },
  { label: "AI Features", href: "#ai" },
];

export const heroStats = [
  { label: "AI matches", value: "97.4%" },
  { label: "Live rooms", value: "12.8k" },
  { label: "Tracks analyzed", value: "42M" },
];

export const heroTracks = [
  {
    id: "hero-track-1",
    title: "Neon Raga",
    artist: "Kairo Drift",
    mood: "Electric focus",
    match: 98,
    cover: "from-pulse via-plasma to-aurora",
  },
  {
    id: "hero-track-2",
    title: "Midnight Metro",
    artist: "Maya Flux",
    mood: "Night drive",
    match: 94,
    cover: "from-[#101827] via-pulse to-volt",
  },
  {
    id: "hero-track-3",
    title: "Velvet Signal",
    artist: "The Binary Saints",
    mood: "Deep calm",
    match: 91,
    cover: "from-aurora via-[#37164d] to-plasma",
  },
];

export const discoveryRails = [
  {
    id: "trending",
    title: "Trending tracks",
    eyebrow: "Realtime ranked",
    items: [
      { id: "tr-1", title: "Neon Raga", artist: "Kairo Drift", meta: "1.2M plays", mood: "Electric", cover: "from-pulse via-plasma to-aurora" },
      { id: "tr-2", title: "Coastal Drive", artist: "Nira Coast", meta: "1.5M plays", mood: "Motion", cover: "from-teal-700 via-sky-400 to-ember" },
      { id: "tr-3", title: "Monsoon Bass", artist: "Rivaan", meta: "997k plays", mood: "High energy", cover: "from-indigo-950 via-indigo-500 to-cyan-300" },
      { id: "tr-4", title: "Solar Lo-Fi", artist: "Ada North", meta: "402k plays", mood: "Warm study", cover: "from-rose-400 via-amber-500 to-lime-400" },
      { id: "tr-5", title: "Velvet Signal", artist: "Binary Saints", meta: "620k plays", mood: "Deep calm", cover: "from-aurora via-plasma to-indigo-800" },
    ],
  },
  {
    id: "moods",
    title: "Mood playlists",
    eyebrow: "Made by AI",
    items: [
      { id: "mo-1", title: "Focus Orbit", artist: "Adaptive deep work", meta: "42 tracks", mood: "Flow", cover: "from-pulse/90 via-plasma/80 to-aurora/90" },
      { id: "mo-2", title: "Mumbai After Dark", artist: "Late-night synth pop", meta: "36 tracks", mood: "Night", cover: "from-aurora/90 via-ember/80 to-plasma/90" },
      { id: "mo-3", title: "Calm Neural Reset", artist: "Ambient breathing room", meta: "28 tracks", mood: "Reset", cover: "from-volt/80 via-pulse/80 to-plasma/80" },
      { id: "mo-4", title: "Commute Velocity", artist: "Energy without fatigue", meta: "31 tracks", mood: "Drive", cover: "from-sky-500 via-emerald-400 to-fuchsia-500" },
      { id: "mo-5", title: "Creator Sprint", artist: "Peak creative tempo", meta: "24 tracks", mood: "Sprint", cover: "from-orange-400 via-pink-500 to-cyan-400" },
    ],
  },
  {
    id: "artists",
    title: "Top artists",
    eyebrow: "Rising signals",
    items: [
      { id: "ar-1", title: "Kairo Drift", artist: "Future raga producer", meta: "2.8M reach", mood: "Artist", cover: "from-cyan-300 via-indigo-500 to-pink-500" },
      { id: "ar-2", title: "Maya Flux", artist: "Spatial pop architect", meta: "1.2M reach", mood: "Artist", cover: "from-fuchsia-400 via-violet-600 to-cyan-300" },
      { id: "ar-3", title: "Nira Coast", artist: "Blue hour electronic", meta: "1.6M reach", mood: "Artist", cover: "from-emerald-600 via-sky-400 to-orange-400" },
      { id: "ar-4", title: "Ada North", artist: "Solar lo-fi maker", meta: "846k reach", mood: "Artist", cover: "from-lime-300 via-amber-400 to-rose-400" },
      { id: "ar-5", title: "Rivaan", artist: "Club cloud energy", meta: "990k reach", mood: "Artist", cover: "from-indigo-700 via-pulse to-volt" },
    ],
  },
];

export const genreCollections = [
  { label: "AI Focus", gradient: "from-pulse/80 via-plasma/70 to-aurora/80", icon: BrainCircuit },
  { label: "Future Pop", gradient: "from-aurora/80 via-ember/70 to-plasma/80", icon: Sparkles },
  { label: "Synthwave", gradient: "from-plasma/90 via-pulse/70 to-aurora/70", icon: AudioLines },
  { label: "Indian Indie", gradient: "from-ember/80 via-aurora/70 to-pulse/70", icon: Mic2 },
  { label: "Deep Calm", gradient: "from-volt/70 via-pulse/70 to-plasma/70", icon: Disc3 },
  { label: "Live Rooms", gradient: "from-sky-500/80 via-emerald-400/70 to-fuchsia-500/80", icon: Radio },
];

export const aiFeatures = [
  {
    title: "Semantic search",
    description: "Search by vibe, lyric memory, tempo, scene, or emotional shape instead of exact metadata.",
    icon: Search,
    metric: "42M vectors",
  },
  {
    title: "Mood AI",
    description: "Real-time mood modeling adapts your queue as your session shifts from calm to peak energy.",
    icon: BrainCircuit,
    metric: "94% affinity",
  },
  {
    title: "Smart playlists",
    description: "Self-updating playlists learn saves, skips, replays, time of day, and social context.",
    icon: ListMusic,
    metric: "Auto-curated",
  },
  {
    title: "Conversational assistant",
    description: "Ask for a playlist like a thought: rainy drive, Hindi pop, low vocals, 30 minutes.",
    icon: Bot,
    metric: "Natural prompts",
  },
  {
    title: "Realtime suggestions",
    description: "Recommendations update from live listening signals, rooms, and collaborative sessions.",
    icon: Zap,
    metric: "Live graph",
  },
  {
    title: "Artist intelligence",
    description: "Creators get audience segments, release timing, performance signals, and moderation clarity.",
    icon: WandSparkles,
    metric: "Creator OS",
  },
];

export const liveActivity = [
  { id: "la-1", user: "Arjun", action: "started a collaborative session", target: "AI Focus Orbit", time: "now", tone: "bg-pulse" },
  { id: "la-2", user: "Maya Flux", action: "released a spatial mix", target: "Midnight Metro", time: "2m", tone: "bg-aurora" },
  { id: "la-3", user: "Nira Coast", action: "crossed 1.5M plays", target: "Coastal Drive", time: "8m", tone: "bg-volt" },
  { id: "la-4", user: "Dev", action: "joined a live room", target: "Mumbai After Dark", time: "12m", tone: "bg-ember" },
];

export const liveRooms = [
  { id: "room-1", title: "Night Drive Radio", listeners: "18.4k", icon: Radio },
  { id: "room-2", title: "Creator Sprint", listeners: "9.8k", icon: Compass },
  { id: "room-3", title: "Calm Neural Reset", listeners: "7.2k", icon: Headphones },
];

export const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Start streaming with AI discovery, public rooms, and playlist saves.",
    icon: Headphones,
    cta: "Start free",
    features: ["AI discovery radio", "Public playlists", "Standard audio", "Community rooms"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    description: "Unlimited listening, higher fidelity, offline-ready queues, and deeper personalization.",
    icon: Crown,
    cta: "Go premium",
    featured: true,
    features: ["Lossless-ready playback", "No ads", "Offline smart queue", "Advanced mood AI"],
  },
  {
    id: "artist",
    name: "Artist Pro",
    price: "$19",
    description: "Release intelligence, analytics, moderation, and audience growth tools for creators.",
    icon: BadgeCheck,
    cta: "Build audience",
    features: ["Release insights", "Audience segments", "Creator analytics", "Priority moderation"],
  },
];

export const footerColumns = [
  {
    title: "Product",
    links: ["Explore", "Premium", "AI Search", "Live Rooms", "Mobile App"],
  },
  {
    title: "Creators",
    links: ["Artist Pro", "Upload Studio", "Analytics", "Payouts", "Moderation"],
  },
  {
    title: "Developers",
    links: ["API", "SDKs", "Status", "Webhooks", "Docs"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Legal", "Privacy"],
  },
];

export const trustSignals = [
  { label: "Protected streaming", icon: ShieldCheck },
  { label: "Realtime social graph", icon: UsersRound },
  { label: "Deep library", icon: Library },
  { label: "AI-native discovery", icon: Sparkles },
];
