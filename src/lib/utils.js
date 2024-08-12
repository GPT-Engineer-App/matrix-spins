import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as pico from '@picojs/pico';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Pre-generated image URLs
const slotAssets = [
  { symbol: 'Blue Orb', image: '/assets/matrix-blue-orb.png' },
  { symbol: 'Green Orb', image: '/assets/matrix-green-orb.png' },
  { symbol: 'Red Orb', image: '/assets/matrix-red-orb.png' },
  { symbol: 'Purple Orb', image: '/assets/matrix-purple-orb.png' },
  { symbol: 'Yellow Orb', image: '/assets/matrix-yellow-orb.png' },
  { symbol: 'Red Pill', image: '/assets/matrix-pill.png' },
  { symbol: 'Sunglasses', image: '/assets/matrix-sunglasses.png' },
  { symbol: 'Computer', image: '/assets/matrix-computer.png' },
  { symbol: 'Unlock', image: '/assets/matrix-unlock.png' },
  { symbol: 'Hourglass', image: '/assets/matrix-hourglass.png' }
];

const gameBackgrounds = [
  { game: 'Matrix Reloaded', image: '/assets/matrix-background.png' },
  { game: 'Cybernetic Spin', image: '/assets/cyber-background.png' },
  { game: 'Quantum Quandary', image: '/assets/quantum-background.png' },
  { game: 'Neural Network', image: '/assets/neural-background.png' }
];

const promotionImages = [
  '/assets/promotion-1.png',
  '/assets/promotion-2.png',
  '/assets/promotion-3.png',
  '/assets/promotion-4.png',
  '/assets/promotion-5.png',
  '/assets/promotion-6.png'
];

export function getSlotAssets() {
  return slotAssets;
}

export function getGameBackgrounds() {
  return gameBackgrounds;
}

export function getPromotionImages() {
  return promotionImages;
}
