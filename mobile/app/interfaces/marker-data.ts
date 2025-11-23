export interface MarkerData {
    id: string;
    emoji: string;
    userEmoji?: string;
    latitude: number;
    longitude: number;
    hasProgress?: boolean;
    progressColor?: string;
}