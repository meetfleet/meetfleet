/**
 * Empty State Components Index
 * 
 * This file exports all empty state components for easy import and usage
 * throughout the application. Each component corresponds to a specific screen
 * and provides a consistent, professional empty state experience.
 */

// Main Tab Screens
export { HomeEmptyState } from './HomeEmptyState';
export { EventsEmptyState } from './EventsEmptyState';
export { MessagesEmptyState } from './MessagesEmptyState';
export { ProfileEmptyState } from './ProfileEmptyState';
export { RequestEmptyState } from './RequestEmptyState';
export { AddCardEmptyState } from './AddCardEmptyState';
export { SettingsEmptyState } from './SettingsEmptyState';
export { EditProfileEmptyState } from './EditProfileEmptyState';

// Payment & Plans
export { PaymentMethodsEmptyState } from './PaymentMethodsEmptyState';
export { CreatePlanEmptyState } from './CreatePlanEmptyState';
export { PlansEmptyState } from './PlansEmptyState';

// Messages & Communication
export { MessagesDetailEmptyState } from './MessagesDetailEmptyState';
export { FeedbackEmptyState } from './FeedbackEmptyState';

// Settings & Profile Management
export { BlockedUsersEmptyState } from './BlockedUsersEmptyState';
export { LinkedAccountsEmptyState } from './LinkedAccountsEmptyState';
export { PasswordEmailEmptyState } from './PasswordEmailEmptyState';

// Type definitions for common props
export interface EmptyStateProps {
  onAction?: () => void;
  activeFilter?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  iconName?: string;
}