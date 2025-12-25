import {
  Session,
  SessionStatus,
  User,
  BeaconType,
  BeaconStatus,
  Beacon,
  BeaconApplication,
} from '@/lib/types';

/**
 * Simple users used by the mock data
 */
export const currentUser: User = {
  id: 'u1',
  email: 'alex@example.com',
  name: 'Alex',
  createdAt: new Date(),
};

export const userSam: User = {
  id: 'u2',
  email: 'sam@example.com',
  name: 'Sam',
  createdAt: new Date(),
};

export const userJordan: User = {
  id: 'u3',
  email: 'jordan@example.com',
  name: 'Jordan',
  createdAt: new Date(),
};

/**
 * Topic options used by BeaconForm (value/label)
 */
export const topicOptions = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'algorithms', label: 'Algorithms' },
  { value: 'system-design', label: 'System Design' },
] as const;

/**
 * Urgent durations used by BeaconForm (value in minutes + label)
 */
export const urgentDurations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
] as const;




/**
 * Mock beacons used on the dashboard
 */
export const mockBeacons: Beacon[] = [
  {
    id: 'b1',
    title: 'React state & hooks help',
    description: 'Need help understanding useEffect and useState patterns.',
    type: BeaconType.NORMAL,
    status: BeaconStatus.OPEN,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    expiresAt: undefined,
    creatorId: currentUser.id,
    creator: currentUser,
    applications: [],
  },
  {
    id: 'b2',
    title: 'TypeScript generics help',
    description: 'Help with generic constraints and advanced utility types.',
    type: BeaconType.NORMAL,
    status: BeaconStatus.IN_SESSION,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    expiresAt: undefined,
    creatorId: userJordan.id,
    creator: userJordan,
    applications: [],
  },
];

/**
 * Mock applications for beacons (helpers applied to help requests)
 * Exporting this so pages/components that import mockApplications will find it.
 */
export const mockApplications: BeaconApplication[] = [
  {
    id: 'a1',
    beaconId: mockBeacons[0].id,
    helperId: userSam.id,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    message: "I'd be happy to help with hooks — I've mentored several React devs.",
    beacon: mockBeacons[0],
    helper: userSam,
  },
  {
    id: 'a2',
    beaconId: mockBeacons[1].id,
    helperId: currentUser.id,
    appliedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    message: 'I can help with generics and TS utility types.',
    beacon: mockBeacons[1],
    helper: currentUser,
  },
];

/**
 * Mock sessions list
 */
export const mockSessions: Session[] = [
  {
    id: 's1',
    beaconId: 'b1',
    learnerId: 'u1',
    helperId: 'u2',
    status: SessionStatus.ACTIVE,
    startedAt: new Date(),
    endedAt: undefined,
    beacon: {
      id: 'b1',
      title: 'React state & hooks help',
      description: 'Need help understanding useEffect and useState patterns.',
      type: BeaconType.NORMAL,
      status: BeaconStatus.OPEN,
      createdAt: new Date(),
      creatorId: 'u1',
      creator: currentUser,
    },
  },

  {
    id: 's2',
    beaconId: 'b2',
    learnerId: 'u3',
    helperId: 'u1',
    status: SessionStatus.ACTIVE,
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    beacon: {
      id: 'b2',
      title: 'TypeScript typing Qs',
      description: 'Help with generic constraints and utility types',
      type: BeaconType.NORMAL,
      status: BeaconStatus.IN_SESSION,
      createdAt: new Date(),
      creatorId: 'u3',
      creator: userJordan,
    },
  },
];

/**
 * Single-session convenience export (used by older pages)
 */
export const mockSession: Session = mockSessions[0];

export const INTERESTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Economics',
  'Literature',
  'History',
  'Psychology',
  'Philosophy',
  'Languages',
];


export const SKILLS = [
  'Problem Solving',
  'Critical Thinking',
  'Communication',
  'Teamwork',
  'Leadership',
  'Time Management',
  'Research',
  'Data Analysis',
  'Public Speaking',
  'Writing',
  'Programming',
  'Project Management',
];

export const ACADEMIC_STREAMS = [
  'Science',
  'Commerce',
  'Humanities',
  'Engineering',
  'Medical',
  'Law',
  'Business Administration',
  'Information Technology',
];