/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: "ring-platters" | "nikah-certificates" | "luxury-hampers" | "announcements" | "preservations";
  price: number;
  description: string;
  details: string[];
  imageUrl: string;
  isPopular?: boolean;
}

export interface CategoryInfo {
  id: string;
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
  iconName?: string;
}

export interface BookingInquiry {
  id?: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  items: { category: string; qty: number; text: string }[];
  customNotes?: string;
  totalPrice: number;
  status?: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  itemsPurchased: string;
  date: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url?: string;
  isCustomSynth?: boolean;
}

