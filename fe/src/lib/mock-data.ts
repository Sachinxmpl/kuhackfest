// Mock data for development
import { User, UserProfile, HelperStats, Beacon, BeaconApplication, Session, Rating, BeaconType, BeaconStatus, SessionStatus } from './types';

// Topic options for filters
export const topicOptions = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Economics',
  'Psychology',
];

// Duration options for urgent beacons
export const urgentDurations = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
  { label: '8 hours', value: 480 },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    createdAt: new Date(),
    profile: {
      id: 'p1',
      userId: '1',
      name: 'Alice Johnson',
      bio: 'Computer Science major passionate about helping others learn web development',
      interests: ['Web Development', 'Algorithms', 'Database Design'],
      skills: ['React', 'Node.js', 'SQL', 'Python'],
    },
    helperStats: {
      id: 'hs1',
      userId: '1',
      helpCount: 45,
      totalPoints: 850,
      avgRating: 4.8,
    },
  },
  {
    id: '2',
    email: 'bob@example.com',
    createdAt: new Date(),
    profile: {
      id: 'p2',
      userId: '2',
      name: 'Bob Smith',
      bio: 'Math enthusiast helping students understand complex concepts',
      interests: ['Mathematics', 'Physics', 'Statistics'],
      skills: ['Calculus', 'Linear Algebra', 'Statistics', 'MATLAB'],
    },
    helperStats: {
      id: 'hs2',
      userId: '2',
      helpCount: 28,
      totalPoints: 520,
      avgRating: 4.6,
    },
  },
  {
    id: '3',
    email: 'carol@example.com',
    createdAt: new Date(),
    profile: {
      id: 'p3',
      userId: '3',
      name: 'Carol Davis',
      bio: 'Biology student looking to share knowledge and learn from others',
      interests: ['Biology', 'Chemistry', 'Research Methods'],
      skills: ['Genetics', 'Molecular Biology', 'Lab Techniques'],
    },
    helperStats: {
      id: 'hs3',
      userId: '3',
      helpCount: 19,
      totalPoints: 340,
      avgRating: 4.9,
    },
  },
  {
    id: '4',
    email: 'david@example.com',
    createdAt: new Date(),
    profile: {
      id: 'p4',
      userId: '4',
      name: 'David Lee',
      bio: 'First-year student eager to help with basic programming concepts',
      interests: ['Programming', 'Data Structures', 'Web Design'],
      skills: ['JavaScript', 'HTML/CSS', 'Git'],
    },
    helperStats: {
      id: 'hs4',
      userId: '4',
      helpCount: 8,
      totalPoints: 120,
      avgRating: 4.5,
    },
  },
];

// Current logged in user (mock)
export const currentUser: User = mockUsers[0];

// Mock beacons
export const mockBeacons: Beacon[] = [
  {
    id: 'b1',
    title: 'Need help understanding React hooks',
    description: 'I\'m struggling to understand useEffect and useCallback. Looking for someone to explain the concepts and walk through some examples.',
    type: BeaconType.URGENT,
    status: BeaconStatus.OPEN,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    expiresAt: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    creatorId: '2',
    creator: mockUsers[1],
    applications: [],
    session: undefined,
  },
  {
    id: 'b2',
    title: 'Database normalization help needed',
    description: 'I have an assignment on 3NF and BCNF. Would love someone to review my work and help me understand where I\'m going wrong.',
    type: BeaconType.NORMAL,
    status: BeaconStatus.OPEN,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: undefined,
    creatorId: '3',
    creator: mockUsers[2],
    applications: [],
    session: undefined,
  },
  {
    id: 'b3',
    title: 'Quick help with CSS Flexbox',
    description: 'Having trouble centering items and making my layout responsive. Need someone to debug with me.',
    type: BeaconType.URGENT,
    status: BeaconStatus.OPEN,
    createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    expiresAt: new Date(Date.now() + 22 * 60 * 1000), // 22 minutes from now
    creatorId: '4',
    creator: mockUsers[3],
    applications: [],
    session: undefined,
  },
  {
    id: 'b4',
    title: 'Calculus II integration techniques',
    description: 'Working through integration by parts and trigonometric substitution. Looking for someone to practice problems with.',
    type: BeaconType.NORMAL,
    status: BeaconStatus.OPEN,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: undefined,
    creatorId: '1',
    creator: mockUsers[0],
    applications: [],
    session: undefined,
  },
];

// Mock applications
export const mockApplications: BeaconApplication[] = [
  {
    id: 'a1',
    beaconId: 'b1',
    helperId: '1',
    message: 'I\'ve been working with React hooks for 2 years and would love to help! I can explain the concepts clearly and provide real-world examples.',
    appliedAt: new Date(Date.now() - 10 * 60 * 1000),
    beacon: mockBeacons[0],
    helper: mockUsers[0],
  },
  {
    id: 'a2',
    beaconId: 'b1',
    helperId: '4',
    message: 'I recently learned React hooks and can share what helped me understand them. Happy to work through it together!',
    appliedAt: new Date(Date.now() - 5 * 60 * 1000),
    beacon: mockBeacons[0],
    helper: mockUsers[3],
  },
];

// Mock messages
export const mockMessages = [
  {
    id: 'm1',
    sessionId: 's1',
    senderId: '1',
    content: 'Hi! Thanks for selecting me to help. Let\'s start with useEffect.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'm2',
    sessionId: 's1',
    senderId: '2',
    content: 'Great! I\'m confused about the dependency array.',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
  },
];

// Mock session
export const mockSession: Session = {
  id: 's1',
  beaconId: 'b1',
  learnerId: '2',
  helperId: '1',
  status: SessionStatus.ACTIVE,
  startedAt: new Date(Date.now() - 30 * 60 * 1000),
  endedAt: undefined,
  beacon: mockBeacons[0],
  learner: mockUsers[1],
  helper: mockUsers[0],
  ratings: [],
};
