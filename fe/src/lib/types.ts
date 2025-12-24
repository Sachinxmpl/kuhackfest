/* =========================
   ENUMS
========================= */
export enum ExperienceLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export enum BeaconType {
  NORMAL = "NORMAL",
  URGENT = "URGENT",
}

export enum BeaconStatus {
  OPEN = "OPEN",
  IN_SESSION = "IN_SESSION",
  CLOSED = "CLOSED",
}

export enum SessionStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/* =========================
   USER & PROFILE
========================= */

export interface User {
  id: string;
  email: string;
  createdAt?: Date;

  // optional display name used in UI
  name?: string;

  profile?: UserProfile;
  helperStats?: HelperStats;
}

export interface UserProfile {
  id: string;
  userId: string;

  name: string;
  bio?: string;
  interests: string[];
  skills: string[];
}

/* =========================
   BEACON
========================= */

export interface Beacon {
  id: string;

  title: string;
  description: string;

  type: BeaconType;
  status: BeaconStatus;

  createdAt: Date;
  expiresAt?: Date;

  creatorId: string;
  // make creator optional so mock data or API can omit it without type errors
  creator?: User;

  applications?: BeaconApplication[];
  session?: Session;
}

/* =========================
   BEACON APPLICATION
========================= */

export interface BeaconApplication {
  id: string;

  beaconId: string;
  helperId: string;

  appliedAt: Date;
  message?: string;

  beacon?: Beacon;
  helper?: User;
}

/* =========================
   PARTICIPANT (UI list)
   small cached participant info used by the left list
========================= */

export interface Participant {
  userId: string;
  role: 'learner' | 'helper' | 'both';
  name?: string;
  avatarUrl?: string;
  online?: boolean;
}

/* =========================
   MESSAGES & PREVIEWS
========================= */

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface LastMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

/* =========================
   SESSION
========================= */

export interface Session {
  id: string;

  beaconId: string;
  learnerId: string;
  helperId: string;

  status: SessionStatus;

  startedAt: Date;
  endedAt?: Date;

  beacon?: Beacon;
  learner?: User;
  helper?: User;

  ratings?: Rating[];

  // UI/list fields
  participants?: Participant[]; // small participant list for left column
  lastMessage?: LastMessage;    // preview for the list
  unreadCount?: number;
  // message history (optional — can be lazy-loaded)
  messages?: Message[];
}

/* =========================
   RATING
========================= */

export interface Rating {
  id: string;

  sessionId: string;
  fromUserId: string;
  toUserId: string;

  score: number; // 1–5
  comment?: string;

  createdAt: Date;

  session?: Session;
  fromUser?: User;
  toUser?: User;
}

/* =========================
   HELPER STATS
========================= */

export interface HelperStats {
  id: string;
  userId: string;

  helpCount: number;
  totalPoints: number;
  avgRating: number;
}