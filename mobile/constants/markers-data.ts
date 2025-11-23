import { MarkerData } from "@/app/interfaces/marker-data";
import { Colors } from "./theme";

export const markers: MarkerData[] = [
    {
        id: '1',
        emoji: '🍺',
        userEmoji: '👦',
        longitude: -74.0060,
        latitude: 40.7128,
        hasProgress: true,
        progressColor: '#FF6B00',
    },
    {
        id: '2',
        emoji: '☕',
        userEmoji: '👩',
        longitude: -74.0100,
        latitude: 40.7200,
        hasProgress: true,
        progressColor: Colors.light.success,
    },
    {
        id: '3',
        emoji: '🚗',
        userEmoji: '👨',
        longitude: -74.0000,
        latitude: 40.7050,
        hasProgress: true,
        progressColor: Colors.light.success,
    },
];