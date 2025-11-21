export type ProblemStatement = {
  id: string;
  title: string;
  description: string;
  domain: string;
  faculty: string;
  tags: string[];
  isAvailable: boolean;
};

export const problemStatements: ProblemStatement[] = [
  {
    id: 'ps-001',
    title: 'AI-Powered E-commerce Recommendation System',
    description: 'Develop a recommendation system using collaborative filtering and deep learning to enhance user experience on an e-commerce platform.',
    domain: 'Artificial Intelligence',
    faculty: 'Dr. Alan Turing',
    tags: ['AI', 'Machine Learning', 'E-commerce'],
    isAvailable: true,
  },
  {
    id: 'ps-002',
    title: 'Blockchain-Based Voting System',
    description: 'Design and implement a secure and transparent voting system using blockchain technology to ensure integrity and prevent fraud.',
    domain: 'Blockchain',
    faculty: 'Dr. Ada Lovelace',
    tags: ['Blockchain', 'Security', 'Cryptography'],
    isAvailable: true,
  },
  {
    id: 'ps-003',
    title: 'IoT Smart Home Automation',
    description: 'Create a centralized system to control and monitor various home appliances and systems using IoT devices and a mobile application.',
    domain: 'Internet of Things',
    faculty: 'Dr. Grace Hopper',
    tags: ['IoT', 'Mobile App', 'Embedded Systems'],
    isAvailable: false,
  },
  {
    id: 'ps-004',
    title: 'Real-time Language Translation App',
    description: 'Build a mobile application that can translate spoken language in real-time using cloud-based translation and speech recognition APIs.',
    domain: 'Mobile Development',
    faculty: 'Dr. John McCarthy',
    tags: ['Mobile App', 'AI', 'Cloud'],
    isAvailable: true,
  },
  {
    id: 'ps-005',
    title: 'Augmented Reality Educational Tool',
    description: 'Develop an AR application that overlays educational information on real-world objects to create an interactive learning experience.',
    domain: 'Augmented Reality',
    faculty: 'Dr. Tim Berners-Lee',
    tags: ['AR', 'Mobile App', 'Education'],
    isAvailable: true,
  },
   {
    id: 'ps-006',
    title: 'Cybersecurity Threat Detection Platform',
    description: 'Build a platform that uses machine learning to detect and classify cybersecurity threats in network traffic in real-time.',
    domain: 'Cybersecurity',
    faculty: 'Dr. Vint Cerf',
    tags: ['Cybersecurity', 'AI', 'Networking'],
    isAvailable: true,
  },
];
