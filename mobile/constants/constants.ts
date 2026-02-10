import { PlanItem } from '../types/types';

export const ALL_PLANS: PlanItem[] = [
  { id: 'coffee', emoji: '☕', label: 'Coffee chat' },
  { id: 'food', emoji: '🍕', label: 'Food meetup' },
  { id: 'sunset', emoji: '🌅', label: 'Sunset walk' },
  { id: 'gym', emoji: '🏋️', label: 'Gym session' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming night' },
  { id: 'movie', emoji: '🎬', label: 'Movie time' },
  { id: 'drinks', emoji: '🍷', label: 'Drinks' },
  { id: 'deep-talk', emoji: '🧠', label: 'Deep talk' },
  { id: 'city-walk', emoji: '🚶', label: 'City walk' },
  { id: 'beach', emoji: '🏖️', label: 'Beach hangout' },
  { id: 'photo', emoji: '📸', label: 'Photo walk' },
  { id: 'music', emoji: '🎧', label: 'Music sharing' },
  { id: 'study', emoji: '📚', label: 'Study session' },
  { id: 'creative', emoji: '🎨', label: 'Creative jam' },
  { id: 'breakfast', emoji: '🥐', label: 'Breakfast date' },
  { id: 'drive', emoji: '🌙', label: 'Night drive' },
  { id: 'chill', emoji: '🧘', label: 'Chill & relax' },
  { id: 'sport', emoji: '⚽', label: 'Sport activity' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping walk' },
  { id: 'ice-cream', emoji: '🍦', label: 'Ice cream stop' },
];

export const ROW_1_PLANS = ALL_PLANS.slice(0, 10);
export const ROW_2_PLANS = ALL_PLANS.slice(10, 20);

export const SUGGESTIONS = [
  { 
    id: '1', 
    title: 'Zing, 3km', 
    subtitle: 'Restaurant', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    title: 'Panda, 1km', 
    subtitle: 'Restaurant', 
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    title: 'Neon, 5km', 
    subtitle: 'Bar & Arcade', 
    image: 'https://images.unsplash.com/photo-1563296291-14f2664d5098?q=80&w=600&auto=format&fit=crop' 
  },
];

export const VIBES = [
  { id: 'chill', emoji: '😎', label: 'Chill' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'nerdy', emoji: '🤓', label: 'Nerdy' },
  { id: 'active', emoji: '💪', label: 'Active' },
  { id: 'haha', emoji: '🤪', label: 'Haha' },
  { id: 'deep', emoji: '🧠', label: 'Deep' },
  { id: 'cozy', emoji: '🍵', label: 'Cozy' },
  { id: 'romantic', emoji: '🌹', label: 'Romantic' },
  { id: 'adventurous', emoji: '🧗', label: 'Adventurous' },
  { id: 'classy', emoji: '🥂', label: 'Classy' },
  { id: 'artsy', emoji: '🎨', label: 'Artsy' },
  { id: 'spontaneous', emoji: '🎲', label: 'Spontaneous' },
];

export const INTERESTS = [
  { id: 'art', label: 'Art' },
  { id: 'sports', label: 'Sports' },
  { id: 'music', label: 'Music' },
  { id: 'pop', label: 'Pop Culture' },
  { id: 'photo', label: 'Photography' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'travel', label: 'Travel' },
  { id: 'foodie', label: 'Foodie' },
  { id: 'tech', label: 'Tech' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'reading', label: 'Reading' },
  { id: 'nature', label: 'Nature' },
  { id: 'movies', label: 'Movies' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'history', label: 'History' },
  { id: 'science', label: 'Science' },
  { id: 'animals', label: 'Animals' },
  { id: 'politics', label: 'Politics' },
  { id: 'diy', label: 'DIY' },
  { id: 'business', label: 'Business' },
];