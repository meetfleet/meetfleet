export type ConversationStatus = 'active' | 'pending';

export type Conversation = {
  id: string;
  name: string;
  avatarEmoji: string;
  preview: string;
  updatedAt: string; // "2m", "1h" etc
  unreadCount?: number;
  status: ConversationStatus;
  // If active, the plan is confirmed; if pending, input is locked.
  planTitle: string;
  planMeta: string;
};

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Imad',
    avatarEmoji: '🧑‍💼',
    preview: 'Confirmed. I’ll send the pin in 5.',
    updatedAt: '2m',
    unreadCount: 1,
    status: 'active',
    planTitle: 'Coffee + walk',
    planMeta: 'Today • 6:30 PM • West Village',
  },
  {
    id: 'c2',
    name: 'Sara',
    avatarEmoji: '👩‍🦰',
    preview: 'Suggestion pending — waiting to accept.',
    updatedAt: '1h',
    unreadCount: 0,
    status: 'pending',
    planTitle: 'Gallery opening',
    planMeta: 'Fri • 8:00 PM • Chelsea',
  },
  {
    id: 'c3',
    name: 'Youssef',
    avatarEmoji: '🧑‍🦱',
    preview: 'Sounds good. See you there.',
    updatedAt: '1d',
    unreadCount: 0,
    status: 'active',
    planTitle: 'Dinner',
    planMeta: 'Sat • 7:45 PM • SoHo',
  },
];

export type ChatMessage = {
  id: string;
  from: 'me' | 'them' | 'system';
  text: string;
  time: string; // "6:12 PM"
  reaction?: string;
  replyTo?: {
    id: string;
    text: string;
    from: 'me' | 'them';
  };
};

export const chatByConversationId: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', from: 'system', text: 'Invite accepted — chat unlocked.', time: '6:10 PM' },
    { id: 'm2', from: 'them', text: 'Coffee at 6:30, quick walk after?', time: '6:11 PM' },
    { id: 'm3', from: 'me', text: 'Perfect. I’ll be there.', time: '6:12 PM' },
    { id: 'm4', from: 'them', text: 'Confirmed. I’ll send the pin in 5.', time: '6:13 PM' },
  ],
  c2: [
    { id: 'm1', from: 'system', text: 'Suggestion pending — accept to unlock chat.', time: '3:02 PM' },
    { id: 'm2', from: 'them', text: 'Gallery opening looks good. Want to go?', time: '3:03 PM' },
  ],
  c3: [
    { id: 'm1', from: 'system', text: 'Invite accepted — chat unlocked.', time: 'Yesterday' },
    { id: 'm2', from: 'them', text: 'Saturday dinner?', time: 'Yesterday' },
    { id: 'm3', from: 'me', text: 'Works. 7:45?', time: 'Yesterday' },
    { id: 'm4', from: 'them', text: 'Sounds good. See you there.', time: 'Yesterday' },
  ],
};

