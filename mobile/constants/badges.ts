import { ImageSourcePropType } from 'react-native';

export interface Badge {
    id: string;
    name: string; // The display name, also matches filename
    description: string;
    image: ImageSourcePropType;
    requirements: string; // "How to Earn It"
    isPremium?: boolean;
}

export const BADGE_ASSETS: Record<string, ImageSourcePropType> = {
    'The Genesis': require('@/assets/badges/The Genesis.png'),
    'The Architect': require('@/assets/badges/The Architect.png'),
    'The Real One': require('@/assets/badges/The Real One.png'),
    'The Centurion': require('@/assets/badges/The Centurion.png'),
    'High Roller': require('@/assets/badges/High Roller.png'),
    'The Explorer': require('@/assets/badges/The Explorer.png'),
    'The Watchman': require('@/assets/badges/The Watchman.png'),
    'Verified Pilot': require('@/assets/badges/Verified Pilot.png'),
    'The Natural': require('@/assets/badges/The Natural.png'),
    'The Regular': require('@/assets/badges/The Regular.png'),
    'Teaser': require('@/assets/badges/teaser.png'),
};

export const BADGES: Badge[] = [
    {
        id: 'genesis',
        name: 'The Genesis',
        description: 'Awarded to early adopters (the "Ancienty" crowd) who joined in the first 3 months.',
        requirements: 'Join in the first 3 months',
        image: BADGE_ASSETS['The Genesis'],
    },
    {
        id: 'architect',
        name: 'The Architect',
        description: 'For users who have successfully hosted/posted 10+ plans that actually happened.',
        requirements: 'Host 10+ completed plans',
        image: BADGE_ASSETS['The Architect'],
    },
    {
        id: 'real_one',
        name: 'The Real One',
        description: 'Awarded after 5 different users "vouch" for you after a dinner or match.',
        requirements: '5 vouches from unique users',
        image: BADGE_ASSETS['The Real One'],
    },
    {
        id: 'centurion',
        name: 'The Centurion',
        description: 'For completing 100 total fleet activities (joining or hosting).',
        requirements: '100 total activities',
        image: BADGE_ASSETS['The Centurion'],
    },
    {
        id: 'high_roller',
        name: 'High Roller',
        description: 'A premium or "power user" status for those with a 4.9+ rating over 20+ events.',
        requirements: '4.9+ rating over 20+ events',
        image: BADGE_ASSETS['High Roller'],
        isPremium: true,
    },
    {
        id: 'explorer',
        name: 'The Explorer',
        description: 'Earned by joining plans in 3 or more different cities or neighborhoods.',
        requirements: 'Join plans in 3+ locations',
        image: BADGE_ASSETS['The Explorer'],
    },
    {
        id: 'watchman',
        name: 'The Watchman',
        description: 'For users who help keep the community safe (reporting bots or fake plans).',
        requirements: 'Report valid safety issues',
        image: BADGE_ASSETS['The Watchman'],
    },
    {
        id: 'verified_pilot',
        name: 'Verified Pilot',
        description: "Identity verification badge (ID check) to ensure you aren't a bot.",
        requirements: 'Complete ID verification',
        image: BADGE_ASSETS['Verified Pilot'],
    },
    {
        id: 'natural',
        name: 'The Natural',
        description: 'Earned by users who consistently get "Great Vibes" tags from other participants.',
        requirements: 'Consistent "Great Vibes" tags',
        image: BADGE_ASSETS['The Natural'],
    },
    {
        id: 'regular',
        name: 'The Regular',
        description: 'For consistent weekly activity (e.g., attending one FIFA night or dinner every week for a month).',
        requirements: 'Weekly activity for 1 month',
        image: BADGE_ASSETS['The Regular'],
    },
];
