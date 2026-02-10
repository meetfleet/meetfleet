# Empty State Components Integration Guide

## Overview

This guide explains how to integrate the empty state components into your React Native application. All components are production-ready and follow consistent design patterns with proper TypeScript support.

## Directory Structure

```
/components/EmptyStates/
├── index.ts                    # Main export file
├── HomeEmptyState.tsx          # Home screen empty state
├── EventsEmptyState.tsx        # Events screen empty state
├── MessagesEmptyState.tsx      # Messages screen empty state
├── ProfileEmptyState.tsx       # Profile screen empty state
├── PaymentMethodsEmptyState.tsx # Payment methods empty state
├── CreatePlanEmptyState.tsx    # Create plan empty state
├── PlansEmptyState.tsx         # Plans detail empty state
├── MessagesDetailEmptyState.tsx # Message detail empty state
├── FeedbackEmptyState.tsx      # Feedback screen empty state
├── BlockedUsersEmptyState.tsx  # Blocked users empty state
├── LinkedAccountsEmptyState.tsx # Linked accounts empty state
├── PasswordEmailEmptyState.tsx  # Password email empty state
├── SettingsEmptyState.tsx      # Settings empty state
├── RequestEmptyState.tsx       # Request screen empty state
├── AddCardEmptyState.tsx       # Add card empty state
└── EditProfileEmptyState.tsx   # Edit profile empty state
```

## Importing Components

### Import All Components
```typescript
import {
  HomeEmptyState,
  EventsEmptyState,
  MessagesEmptyState,
  ProfileEmptyState,
  // ... other components
} from '@/components/EmptyStates';
```

### Import Individual Components
```typescript
import { HomeEmptyState } from '@/components/EmptyStates/HomeEmptyState';
```

## Integration Examples

### 1. Home Screen Integration
```typescript
// app/(tabs)/index.tsx
import { HomeEmptyState } from '@/components/EmptyStates';

const HomeScreen = () => {
  const [plans, setPlans] = useState([]);
  const router = useRouter();

  if (plans.length === 0) {
    return (
      <HomeEmptyState 
        onCreatePlan={() => router.push('/create-plan')}
      />
    );
  }

  return (
    // Your existing home screen content
  );
};
```

### 2. Events Screen Integration with Filter Support
```typescript
// app/(tabs)/events.tsx
import { EventsEmptyState } from '@/components/EmptyStates';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Discover');
  const router = useRouter();

  if (events.length === 0) {
    return (
      <EventsEmptyState 
        activeFilter={activeFilter}
        onCreatePlan={() => router.push('/create-plan')}
      />
    );
  }

  return (
    // Your existing events screen content
  );
};
```

### 3. Messages Screen Integration
```typescript
// app/(tabs)/messages.tsx
import { MessagesEmptyState } from '@/components/EmptyStates';

const MessagesScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Active');
  const router = useRouter();

  if (conversations.length === 0) {
    return (
      <MessagesEmptyState 
        activeFilter={activeFilter}
        onStartChat={() => router.push('/messages/new')}
      />
    );
  }

  return (
    // Your existing messages screen content
  );
};
```

### 4. Profile Screen Integration
```typescript
// app/(tabs)/profile.tsx
import { ProfileEmptyState } from '@/components/EmptyStates';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  if (!profileData) {
    return (
      <ProfileEmptyState 
        onAddContent={() => router.push('/edit-profile')}
      />
    );
  }

  return (
    // Your existing profile screen content
  );
};
```

### 5. Payment Methods Integration
```typescript
// app/payment/index.tsx
import { PaymentMethodsEmptyState } from '@/components/EmptyStates';

const PaymentMethodsScreen = () => {
  const [cards, setCards] = useState([]);
  const router = useRouter();

  if (cards.length === 0) {
    return (
      <PaymentMethodsEmptyState 
        onAddCard={() => router.push('/payment/add')}
      />
    );
  }

  return (
    // Your existing payment methods content
  );
};
```

## Component Props

### Common Props
All components accept these common props:

| Prop | Type | Description |
|------|------|-------------|
| `onAction` | `() => void` | Callback function for the main action button |
| `activeFilter` | `string` | Current active filter (for filter-specific components) |

### Specific Props
Some components have additional specific props:

- **EventsEmptyState**: `activeFilter` for different filter states
- **MessagesEmptyState**: `activeFilter` for different message filters
- **ProfileEmptyState**: `onAddContent` for adding profile information
- **PaymentMethodsEmptyState**: `onAddCard` for adding payment methods

## Styling and Theming

### Dark Mode Support
All components automatically support dark mode using the `useColorScheme()` hook and your app's theme configuration.

### Customization
Components use your app's existing theme from `@/constants/theme`. The styling is consistent across all components:

- **Icons**: 64px size with theme-appropriate colors
- **Headings**: 24px font size using `Fonts.bold`
- **Subtitles**: 16px font size using `Fonts.regular`
- **Buttons**: Theme primary color with white text
- **Spacing**: Consistent padding and margins

### Theme Integration
Components automatically adapt to your theme:
```typescript
const colorScheme = useColorScheme();
const theme = Colors[colorScheme ?? 'light'];
```

## Best Practices

### 1. Conditional Rendering
Always check your data before rendering empty states:
```typescript
if (data.length === 0) {
  return <EmptyStateComponent />;
}
```

### 2. Loading States
Consider showing a loading state before checking for empty data:
```typescript
if (loading) {
  return <LoadingComponent />;
}

if (data.length === 0) {
  return <EmptyStateComponent />;
}
```

### 3. Action Handlers
Always provide meaningful action handlers:
```typescript
<HomeEmptyState 
  onCreatePlan={() => {
    // Navigate to create plan screen
    router.push('/create-plan');
  }}
/>
```

### 4. Filter Context
For screens with filters, pass the active filter:
```typescript
<EventsEmptyState 
  activeFilter={activeFilter}
  onCreatePlan={handleCreatePlan}
/>
```

## Error Handling

Components are designed to gracefully handle edge cases:
- Missing data
- Network errors
- Invalid filter states
- Navigation failures

## Testing

When testing empty states:
1. Mock empty data arrays
2. Test all filter states
3. Verify action handlers work correctly
4. Test both light and dark themes

## Performance

Components are optimized for:
- Minimal re-renders
- Efficient styling
- Proper TypeScript typing
- Accessibility support

## Accessibility

All components include:
- Proper semantic structure
- Screen reader support
- High contrast colors
- Touch target sizing

## Troubleshooting

### Common Issues

1. **Theme not applied**: Ensure your theme configuration is properly exported from `@/constants/theme`

2. **Icons not showing**: Verify `@expo/vector-icons` is properly installed

3. **TypeScript errors**: Check that all props are properly typed and passed

4. **Styling issues**: Ensure your theme object has all required color properties

### Debug Steps
1. Check console for theme loading errors
2. Verify component imports
3. Test with hardcoded values first
4. Check theme configuration consistency

## Future Enhancements

Consider adding:
- Custom icon support
- Additional button variants
- Animation support
- Internationalization
- Custom styling overrides