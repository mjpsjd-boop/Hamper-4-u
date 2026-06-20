/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Heart,
  Clock,
  Gift,
  FileText,
  Disc,
  Video,
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageSquare,
  Music,
  MapPin,
  Calendar,
  Truck,
  Filter,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Instagram,
  ArrowRight,
  Info,
  ChevronRight,
  ShieldCheck,
  Award,
  ChevronLeft
} from "lucide-react";
import { CATEGORIES, PRODUCTS, TESTIMONIALS, FAQS } from "./data";
import { Product, BookingInquiry, CategoryInfo, Song } from "./types";
import AIConsultant from "./components/AIConsultant";

export default function App() {
  // Navigation & State
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; qty: number; customText: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem("luxury_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "planner" | "orders">("catalog");
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [searchQueryPhone, setSearchQueryPhone] = useState("");
  const [searchedBookings, setSearchedBookings] = useState<any[] | null>(null);

  // Dynamic Categories state with fallback to static seeding
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [newCatId, setNewCatId] = useState("");
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatBadge, setNewCatBadge] = useState("");
  const [newCatImageUrl, setNewCatImageUrl] = useState("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop");
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState({ text: "", type: "" });

  // Admin sub-tabs state
  const [adminSubTab, setAdminSubTab] = useState<"categories" | "products" | "inquiries" | "songs">("categories");

  // Product Editor Form States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodIsPopular, setProdIsPopular] = useState(false);
  const [prodDetailsInput, setProdDetailsInput] = useState(""); // Comma separated tags/bullet points

  // Royal Sangeet Songs States
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  // Dynamic payment and social options settings from back-office db
  const [storeUpiId, setStoreUpiId] = useState("tanishq77@ybl");
  const [storeWhatsapp, setStoreWhatsapp] = useState("+919876543210");
  const [storeInstagram, setStoreInstagram] = useState("tasdiqa_atelier");

  // Admin access validation state (Bespoke Royal Atelier Security)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Royal Audio Synth State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<any>(null);
  const [synthInterval, setSynthInterval] = useState<any>(null);

  // In-app order planner state
  const [plannerName, setPlannerName] = useState("");
  const [plannerPhone, setPlannerPhone] = useState("");
  const [plannerDate, setPlannerDate] = useState("");
  const [plannerEventType, setPlannerEventType] = useState("Wedding");
  const [plannerCustomText, setPlannerCustomText] = useState("");
  const [plannerItems, setPlannerItems] = useState<{ category: string; text: string }[]>([
    { category: "ring-platters", text: "" }
  ]);

  // Booked inquiries from server
  const [bookings, setBookings] = useState<any[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);
  const [isUpiCopied, setIsUpiCopied] = useState(false);

  // Load backend data on mount
  useEffect(() => {
    fetchBookings();
    fetchCategories();
    fetchProducts();
    fetchSongs();
    fetchSettings();
  }, []);

  // Persist wishlist changes to local storage
  useEffect(() => {
    localStorage.setItem("luxury_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Auto-rotating Hero Slideshow at a rate of 2 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(slideTimer);
  }, []);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Preset boutique images for easy Admin addition (like Unsplash premium files)
  const LUXURY_PRESET_IMAGES = [
    { name: "⚜️ Ring Platter Diamond View", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop" },
    { name: "🌸 Golden Autumn Floral Garland", url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=400&auto=format&fit=crop" },
    { name: "📜 Urdu Calligraphy Frame", url: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400&auto=format&fit=crop" },
    { name: "💼 Maharani Silk Gifting Box", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd40?q=80&w=400&auto=format&fit=crop" },
    { name: "🍼 Little Prince Velvet Cradle", url: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?q=80&w=400&auto=format&fit=crop" },
    { name: "🕰️ Garland Resin Preservation", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop" },
    { name: "✨ Royal Gilded Frame Border", url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=400&auto=format&fit=crop" }
  ];

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setCategories(data.data);
      }
    } catch (e) {
      console.error("Failed to load custom categories:", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      if (data.success && data.data) {
        setSongs(data.data);
        if (data.data.length > 0) {
          setCurrentSong(data.data[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load royal sangeet songs:", e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setStoreUpiId(data.data.upiId || "tanishq77@ybl");
        setStoreWhatsapp(data.data.whatsappNumber || "+919876543210");
        setStoreInstagram(data.data.instagramId || "tasdiqa_atelier");
      }
    } catch (e) {
      console.error("Failed to load back-office settings:", e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId: storeUpiId,
          whatsappNumber: storeWhatsapp,
          instagramId: storeInstagram
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: "⚜️ Atelier payment settings & social direct channels updated successfully!", type: "success" });
        fetchSettings();
      } else {
        setAdminMessage({ text: data.error || "Failed to update settings.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network failure saving configurations.", type: "error" });
    }
  };

  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle || !newSongArtist) {
      setAdminMessage({ text: "Atelier Error: Title and Artist/Instrument are required.", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSongTitle,
          artist: newSongArtist,
          url: newSongUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: `⚜️ Sangeet Song "${newSongTitle}" successfully registered in active repertoire!`, type: "success" });
        setNewSongTitle("");
        setNewSongArtist("");
        setNewSongUrl("");
        fetchSongs();
      } else {
        setAdminMessage({ text: data.error || "Failed to save song.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network error saving royal song.", type: "error" });
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const res = await fetch(`/api/songs/${songId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: "Song trace successfully removed from repertoire.", type: "success" });
        fetchSongs();
        if (currentSong?.id === songId) {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current = null;
          }
          if (synthInterval) clearInterval(synthInterval);
          if (audioCtx) {
            try { audioCtx.close(); } catch(err){}
            setAudioCtx(null);
          }
          setSynthInterval(null);
          setIsMusicPlaying(false);
          setCurrentSong(null);
        }
      } else {
        setAdminMessage({ text: data.error || "Failed to delete song.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network failure removing song.", type: "error" });
    }
  };

  // Save or Update Product handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCategory || !prodPrice || !prodImageUrl) {
      setAdminMessage({ text: "Atelier Error: Name, Category, Price and Image Backdrop are mandatory.", type: "error" });
      return;
    }

    const detailsArray = prodDetailsInput
      ? prodDetailsInput.split(/[,\n]/).map(d => d.trim()).filter(Boolean)
      : ["Premium curation", "Meticulously made by Tasdiqa", "No resellers allowed"];

    const payload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      description: prodDescription || "No custom description cataloged.",
      details: detailsArray,
      imageUrl: prodImageUrl,
      isPopular: prodIsPopular
    };

    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
      const method = editingProductId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({
          text: editingProductId
            ? `💎 Atelier item '${prodName}' modified and updated live!`
            : `💎 Exclusive product '${prodName}' crafted and posted to active client shelves!`,
          type: "success"
        });

        // Clear Form State
        setEditingProductId(null);
        setProdName("");
        setProdCategory("");
        setProdPrice("");
        setProdDescription("");
        setProdImageUrl("");
        setProdIsPopular(false);
        setProdDetailsInput("");
        
        fetchProducts(); // Refreshes the local products array and client view instantly!
      } else {
        setAdminMessage({ text: `Atelier Action Failed: ${data.error}`, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network issue updating atelier product shelves.", type: "error" });
    }
  };

  // Populate form for product editing
  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price.toString());
    setProdDescription(prod.description);
    setProdImageUrl(prod.imageUrl);
    setProdIsPopular(prod.isPopular || false);
    setProdDetailsInput(prod.details ? prod.details.join("\n") : "");
  };

  // Delete product action
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to retire '${name}' from active client shelves?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: `💎 Retraction Success: '${name}' returned to archives.`, type: "success" });
        fetchProducts();
      } else {
        setAdminMessage({ text: `Failed retracting item: ${data.error}`, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network issue communicating with product archives.", type: "error" });
    }
  };

  // Update order status action
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: `🛡️ Booking status for ${bookingId} updated to '${newStatus}'!`, type: "success" });
        fetchBookings(); // Instantly fetch updated inquiries
      } else {
        setAdminMessage({ text: `Atelier Action Failed: ${data.error}`, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Error communicating with inquiries registry.", type: "error" });
    }
  };

  // Delete/Resolve order action
  const handleDeleteBooking = async (bookingId: string, customerName: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete custom inquiry ${bookingId} for ${customerName}?`)) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminMessage({ text: `🛡️ Inquiry ${bookingId} deleted successfully from active databases.`, type: "success" });
        fetchBookings(); // Refresh inquiries array
      } else {
        setAdminMessage({ text: `Atelier Action Failed: ${data.error}`, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAdminMessage({ text: "Network issue deleting booking inquiry.", type: "error" });
    }
  };

  // Synthesize royal classical Santoor/Sitar ambient ringing frequencies and play MP3 tracks with smooth fallbacks
  const triggerSynthDrone = () => {
    try {
      const ContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!ContextClass) return;
      const ctx = new ContextClass();
      
      // Soft Tanpura droning filters
      const droneOsc = ctx.createOscillator();
      const lowDroneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      
      droneOsc.type = "sawtooth";
      droneOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3 chord drone
      
      lowDroneOsc.type = "sine";
      lowDroneOsc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2 resonance ground
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, ctx.currentTime); // Make tone extremely soft and meditative
      
      droneGain.gain.setValueAtTime(0.05, ctx.currentTime);
      
      droneOsc.connect(filter);
      lowDroneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);
      
      droneGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.0);
      
      droneOsc.start();
      lowDroneOsc.start();
      
      // Major pentatonic indian raga resonance list
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; 
      
      const triggerBell = () => {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();
        osc.type = "triangle";
        
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        osc.frequency.setValueAtTime(randomNote, ctx.currentTime);
        
        pGain.gain.setValueAtTime(0.02, ctx.currentTime);
        pGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
        
        const delay = ctx.createDelay();
        delay.delayTime.setValueAtTime(0.3, ctx.currentTime);
        const feedback = ctx.createGain();
        feedback.gain.setValueAtTime(0.35, ctx.currentTime);
        
        osc.connect(pGain);
        pGain.connect(ctx.destination);
        
        pGain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        feedback.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 3.5);
      };
      
      triggerBell();
      
      const intervalId = setInterval(() => {
        triggerBell();
      }, 1800);
      
      setSynthInterval(intervalId);
      setAudioCtx(ctx);
    } catch (e) {
      console.error("Audio Synthesis error on client sandbox:", e);
    }
  };

  const handlePlaySong = (song: Song) => {
    // 1. Stop any currently playing HTML5 audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    // 2. Stop any custom oscillators/synth running
    if (synthInterval) {
      clearInterval(synthInterval);
      setSynthInterval(null);
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (err) {}
      setAudioCtx(null);
    }

    setCurrentSong(song);
    setIsMusicPlaying(true);

    if (song.isCustomSynth) {
      triggerSynthDrone();
    } else if (song.url) {
      try {
        const audio = new Audio(song.url);
        audio.loop = true;
        audioPlayerRef.current = audio;
        audio.play().catch((e) => {
          console.warn("Audio Context playback failed or blocked by autoplay restrictions. Reverting to Synth drone.", e);
          triggerSynthDrone();
        });
      } catch (e) {
         console.error("Failed to load audio element", e);
         triggerSynthDrone();
      }
    }
  };

  const toggleRoyalMusic = () => {
    if (isMusicPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (synthInterval) clearInterval(synthInterval);
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch(err){}
      }
      setIsMusicPlaying(false);
      setSynthInterval(null);
      setAudioCtx(null);
    } else {
      const songToPlay = currentSong || songs[0];
      if (songToPlay) {
        handlePlaySong(songToPlay);
      } else {
        const fallbackSong = { id: "song-synth-1", title: "Santoor & Sitar Royal Raga", artist: "Heritage Classical Synth Drone", isCustomSynth: true };
        handlePlaySong(fallbackSong);
      }
    }
  };

  // Cart operations
  const addToCart = (product: Product, customText: string) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, qty: 1, customText }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, val: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId) {
          return { ...item, qty: Math.max(1, item.qty + val) };
        }
        return item;
      })
      .filter((item) => item.qty > 0);
    setCart(updated);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  };

  // Booking inquiry checkout submit
  const handleCheckoutInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerName || !plannerDate) {
      alert("Please enter customer name and event date.");
      return;
    }

    const bookingPayload: BookingInquiry = {
      customerName: plannerName,
      phone: plannerPhone,
      email: "client@example.com",
      eventType: plannerEventType,
      eventDate: plannerDate,
      items: cart.length > 0 
        ? cart.map(c => ({ category: c.product.name, qty: c.qty, text: c.customText }))
        : plannerItems.map(p => ({ category: p.category, qty: 1, text: p.text })),
      customNotes: plannerCustomText,
      totalPrice: cart.length > 0 ? calculateTotal() : 5000 // default mock price if custom
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      if (data.success) {
        setCreatedBooking(data.data);
        setIsSubmitSuccess(true);
        setCart([]); // reset cart
        setIsCartOpen(false);
        fetchBookings(); // refresh the verified list
      }
    } catch (e) {
      console.error("Booking failed:", e);
      alert("Uh oh! We couldn't register your reservation slots right now. Please test again.");
    }
  };

  // Advance Date Calculator (checks for his 2 months rule)
  const isDateAdvanceOk = (dateStr: string) => {
    if (!dateStr) return true;
    const event = new Date(dateStr);
    const now = new Date();
    const diff = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays >= 60;
  };

  // Helper to map category names to readable strings
  const getCategoryLabel = (cat: string) => {
    const item = categories.find((c) => c.id === cat);
    return item ? item.title : cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f020c] via-[#0b0104] to-[#290308] text-stone-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-[#8B7355] selection:text-black pb-12">
      
      {/* Dynamic Light Background Orbits (Atmospheric Glow Effects with Lotus Pink & Red Touches) */}
      <div className="absolute top-[3%] left-[-15%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] rounded-full bg-pink-500/15 blur-[130px] md:blur-[220px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[30%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-red-600/15 blur-[120px] md:blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute bottom-[25%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-rose-600/15 blur-[150px] md:blur-[200px] pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />

      {/* 1. TOP PREMIUM ANNOUNCEMENT BAR */}
      <div className="bg-[#122414] text-white py-2.5 px-4 border-b border-[#8B7355]/35 flex items-center justify-center text-center overflow-hidden relative z-20 shadow-[0_2px_15px_rgba(45,90,39,0.3)]">
        <div className="max-w-4xl flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[11px] tracking-widest uppercase font-semibold">
          <span className="flex items-center gap-1.5 font-sans text-[#ECE6D9]">
            <Clock className="w-3.5 h-3.5 text-[#8B7355] animate-pulse" />
            Book orders at least 2 months in advance
          </span>
          <span className="hidden md:inline text-[#8B7355]/50">•</span>
          <span className="flex items-center gap-1.5 font-sans text-[#ECE6D9]">
            <Truck className="w-3.5 h-3.5 text-[#8B7355]" />
            Insured Shipping across India 🇮🇳
          </span>
          <span className="hidden lg:inline text-[#8B7355]/50">•</span>
          <span className="flex items-center gap-1.5 font-sans text-[#ECEECE]">
            <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Direct Clients Only (Strictly No Resellers)
          </span>
        </div>
      </div>

      {/* 2. PREMIUM MULTI-DIMENSIONAL NAVIGATION HEADER */}
      <header className="bg-[#09170A]/85 backdrop-blur-xl sticky top-0 z-30 border-b border-[#8B7355]/20 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col text-center md:text-left cursor-pointer" onClick={() => setActiveTab("catalog")}>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B7355] animate-ping" />
              <h1 className="font-serif text-2xl md:text-3xl tracking-widest font-black text-white hover:text-[#8B7355] transition duration-300 drop-shadow-[0_2px_6px_rgba(212,175,55,0.2)]">
                HAMPERS<span className="text-[#8B7355]">_</span>4<span className="text-[#8B7355]">_</span>YOU
              </h1>
            </div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#8B7355] font-bold flex items-center justify-center md:justify-start gap-1">
              by tasdiqa 🌸 luxury curation & craft preservation
            </p>
          </div>

          <div className="bg-[#122414] border border-[#8B7355]/50 rounded-xl p-1 flex items-center gap-1 md:gap-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-3 md:px-4 py-2 rounded-lg font-serif text-[10px] md:text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "catalog"
                  ? "bg-[#8B7355] text-[#071308] font-black shadow-md scale-102"
                  : "text-[#8B7355]/80 hover:text-white hover:bg-white/5"
              }`}
            >
              Collection Bespoke
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`px-3 md:px-4 py-2 rounded-lg font-serif text-[10px] md:text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "planner"
                  ? "bg-[#8B7355] text-[#071308] font-black shadow-md scale-102"
                  : "text-[#8B7355]/80 hover:text-white hover:bg-white/5"
              }`}
            >
              Bespoke Planner
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 md:px-4 py-2 rounded-lg font-serif text-[10px] md:text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#8B7355] text-[#071308] font-black shadow-md scale-102"
                  : "text-[#8B7355]/80 hover:text-white hover:bg-white/5"
              }`}
            >
              Active Tracker
            </button>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative bg-[#112413] border border-[#8B7355]/30 p-2.5 rounded-full hover:bg-[#1E3B20] active:scale-95 transition cursor-pointer flex items-center justify-center text-[#8B7355] shadow-[0_0_10px_rgba(0,0,0,0.5)] group"
              title="View Gilded Wishlist"
            >
              <Heart className={`w-5 h-5 group-hover:scale-110 transition-all duration-300 ${wishlist.length > 0 ? "fill-[#8B7355] text-[#8B7355]" : "text-[#8B7355]"}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B7355] text-[#071308] font-sans text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#112413] animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#112413] border border-[#8B7355]/30 p-2.5 rounded-full hover:bg-[#1E3B20] active:scale-95 transition cursor-pointer flex items-center justify-center text-[#8B7355] shadow-[0_0_10px_rgba(0,0,0,0.5)] group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-sans text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#112413] animate-bounce">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>

            {/* Separate Secure Back-Office Link */}
            <button
              onClick={() => setIsAdminOverlayOpen(true)}
              className="bg-[#122A14]/80 text-[#8B7355] hover:text-white hover:bg-[#4A5D23] font-sans text-[10px] uppercase tracking-widest font-black py-2.5 px-4 rounded-full border border-[#8B7355]/35 hover:border-[#8B7355] transition duration-300 cursor-pointer shadow-sm flex items-center gap-1.5"
              title="Separate Admin back-office authentication panel"
            >
              <Award className="w-3.5 h-3.5 text-[#8B7355]" strokeWidth={2.5} /> Atelier Access 🔐
            </button>
          </div>
        </div>
      </header>

      {/* 3. DYNAMIC HERO SHOWCASE PANEL (COMPREHENSIVE & SEPARATE) */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b border-[#8B7355]/25 bg-[#09150B]/60 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#112412] border-2 border-[#8B7355]/35 text-[10px] font-bold text-[#8B7355] tracking-widest uppercase font-sans shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7355]" /> Preserving Timeless Lifelines with Bespoke Luxury
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-tight font-black tracking-wide">
              Encapsulating Sacred <br />
              <span className="italic font-normal text-[#8B7355] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">Memory Artifacts & Keepsakes</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed">
              We immortalize the deep emotional value of your celebrations. Under the meticulous hands-on supervision of master artisan Tasdiqa, we dehydrate, mold, and encase marriage garlands (Varmala) in glass clocks, hand-ink wedding certificates with real gold leaf gilding, and map breathtaking ring trays. Experience premium Indian heritage preservation directly, with a strict direct-to-consumer guarantee.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={() => { setActiveTab("catalog"); scrollIntoSection("collections-main"); }}
                className="bg-[#4A5D23] text-white px-8 py-4 rounded-full font-serif tracking-widest font-black text-xs uppercase hover:bg-emerald-950 transition duration-300 cursor-pointer flex items-center gap-2 border border-[#8B7355] btn-gold-glint shadow-[0_4px_25px_rgba(45,90,39,0.5)]"
              >
                Browse Catalog Modules <ChevronRight className="w-4 h-4 text-[#8B7355]" />
              </button>
              <button
                onClick={() => { setActiveTab("planner"); scrollIntoSection("planner-entry-anchor"); }}
                className="bg-[#122413] text-[#8B7355] border-2 border-[#8B7355]/40 hover:bg-[#1C3A1F] hover:text-white px-8 py-4 rounded-full font-sans text-xs font-black uppercase tracking-widest transition duration-300 cursor-pointer shadow-md"
              >
                Book Preservation Slot
              </button>
            </div>

            {/* HIGH-END METRIC BADGES */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#8B7355]/20 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="block font-serif text-xl md:text-3xl font-black text-white">4.9 ★</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#8B7355]/80">Client Rating</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif text-xl md:text-3xl font-black text-white flex items-center justify-center lg:justify-start gap-1">
                  100% <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500" />
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#8B7355]/80">Direct Cured</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif text-xl md:text-3xl font-black text-white">0%</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#8B7355]/80">Broker Markup</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Box - Dynamic Interactive Slideshow */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Interactive Image Frame */}
            <div className="relative w-80 md:w-96 aspect-[4/5] rounded-[2rem] bg-[#0E1F10] border-2 border-[#8B7355] p-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] group transition-all duration-500 hover:scale-[1.02]">
              {/* Slideshow Image */}
              <div className="w-full h-full rounded-[1.7rem] overflow-hidden relative">
                <img
                  src={
                    activeHeroSlide === 0
                      ? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop"
                      : activeHeroSlide === 1
                      ? "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
                  }
                  alt="Dynamic Slideshow Keepsake"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-108"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] text-[#8B7355] uppercase tracking-widest font-black mb-1">
                    {activeHeroSlide === 0 ? "🔱 Royal Accent Platter" : activeHeroSlide === 1 ? "🕰️ Botanical Resins" : "📜 Hand-Painted Contracts"}
                  </span>
                  <p className="font-serif text-white tracking-wider font-extrabold text-base mb-1">
                    {activeHeroSlide === 0 ? "Classic Gold Velvet Meadow Tray" : activeHeroSlide === 1 ? "Signature Garland Preservation Clock" : "Gul-o-Ghar Watercolor Nikah Frame"}
                  </p>
                  <p className="font-sans text-stone-300 text-[11px] leading-snug line-clamp-2">
                    {activeHeroSlide === 0 ? "Hand-spun velvet slots and brass ring loops with custom gold plates." : activeHeroSlide === 1 ? "Deep-cast non-yellowing crystal polymers that freeze your actual roses forever." : "Archival paints and heavy cotton paper signed by master calligraphers."}
                  </p>
                </div>
              </div>

              {/* Decorative Corner Stars inside frame */}
              <div className="absolute top-5 left-5 text-[#8B7355]/50 text-xs animate-spin-slow">✦</div>
              <div className="absolute top-5 right-5 text-[#8B7355]/50 text-xs">✦</div>

              {/* Absolute label badge */}
              <div className="absolute -bottom-4 bg-gradient-to-r from-[#8B7355] to-[#B88E53] text-[#071308] py-1.5 px-5 rounded-full shadow-xl text-[10px] tracking-widest uppercase font-black">
                Active Slide: 0{activeHeroSlide + 1} ⚜️
              </div>
            </div>

            {/* Slideshow controller buttons under image */}
            <div className="flex gap-2.5 mt-8 items-center bg-[#112413] border border-[#8B7355]/30 px-4 py-2 rounded-full shadow-lg">
              <button 
                onClick={() => setActiveHeroSlide(0)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeHeroSlide === 0 ? "bg-[#8B7355] scale-125" : "bg-stone-500 hover:bg-stone-300"}`}
                title="Platter showcases"
              />
              <button 
                onClick={() => setActiveHeroSlide(1)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeHeroSlide === 1 ? "bg-[#8B7355] scale-125" : "bg-stone-500 hover:bg-stone-300"}`}
                title="Resin clocks"
              />
              <button 
                onClick={() => setActiveHeroSlide(2)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeHeroSlide === 2 ? "bg-[#8B7355] scale-125" : "bg-stone-500 hover:bg-stone-300"}`}
                title="Nikah frames"
              />
              <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase ml-2 select-none border-l border-[#8B7355]/20 pl-2">
                Auto-Rotating Carousel
              </span>
            </div>
          </div>
          
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE VIEWS (Catalog vs Planner vs Order list) */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full" id="catalog-anchor-main">
        
        {/* Navigation Tabs bar */}
        <div className="flex justify-center border-b border-[#8B7355]/25 mb-8 max-w-md mx-auto gap-2 relative z-10 bg-[#122414]/70 p-1.5 rounded-2xl border border-[#8B7355]/15 shadow-md">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-black text-center focus:outline-none transition-all duration-300 cursor-pointer rounded-xl ${
              activeTab === "catalog"
                ? "bg-[#4A5D23] text-white shadow-sm border border-[#8B7355]/45"
                : "text-stone-300 hover:text-[#8B7355]"
            }`}
          >
            Our Catalog
          </button>
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-black text-center focus:outline-none transition-all duration-300 cursor-pointer rounded-xl ${
              activeTab === "planner"
                ? "bg-[#4A5D23] text-white shadow-sm border border-[#8B7355]/45"
                : "text-stone-300 hover:text-[#8B7355]"
            }`}
          >
            Custom Planner
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-black text-center focus:outline-none transition-all duration-300 cursor-pointer rounded-xl ${
              activeTab === "orders"
                ? "bg-[#4A5D23] text-white shadow-sm border border-[#8B7355]/45"
                : "text-stone-300 hover:text-[#8B7355]"
            }`}
          >
            Track Order
          </button>
        </div>

        {/* VIEW A: OUR CATALOG */}
        {activeTab === "catalog" && (
          <div id="collections-main">
            {/* Category selection - Elegant Square Pictures with Inner Gold Frames */}
            <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-10 justify-start md:justify-center scrollbar-custom">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative group shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-500 shadow-md flex flex-col justify-end p-3 cursor-pointer ${
                      isActive
                        ? "border-[#8B7355] scale-105 ring-4 ring-[#8B7355]/20 shadow-xl"
                        : "border-[#8B7355]/25 hover:border-[#8B7355]/50 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {/* Background Imagery with Royal Zoom Effect */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={cat.imageUrl || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=200&auto=format&fit=crop"}
                        alt={cat.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                      />
                      {/* Elite Brass/Royal Dark Radial Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:via-black/30 transition-colors" />
                    </div>

                    {/* Tiny Corner Badge for Status/Promo */}
                    {cat.badge && (
                      <span className="absolute top-2 right-2 z-10 bg-[#8B7355] text-white text-[8px] font-sans font-bold tracking-widest uppercase px-1.5 py-0.5 rounded shadow">
                        {cat.badge}
                      </span>
                    )}

                    {/* Interfitted Geometric Accent Line */}
                    <div className="absolute inset-2 border border-[#8B7355]/20 rounded-xl pointer-events-none z-10 group-hover:border-[#8B7355]/45 transition-colors" />

                    {/* Title Overlay with High Drop Shadow */}
                    <div className="relative z-15 w-full text-center">
                      <span className="font-serif text-[11px] md:text-xs font-semibold text-white tracking-widest uppercase block drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-tight">
                        {cat.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Catalog Banner Description - HIGH STYLE SEPARATION */}
            <div className="bg-gradient-to-r from-[#0d1f0e] to-[#081308] border-2 border-[#8B7355]/35 rounded-[2rem] p-6 text-center max-w-2xl mx-auto mb-12 shadow-[0_5px_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-15">
                <Sparkles className="w-16 h-16 text-[#8B7355] animate-pulse" />
              </div>
              <h4 className="font-serif text-xl tracking-widest text-[#EADEC9] font-semibold mb-1">
                {categories.find((c) => c.id === activeCategory)?.title || "Exclusive"} Catalog Shelves
              </h4>
              <p className="font-sans text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
                {activeCategory === "all" 
                  ? "Explore ready handcast selections. These finished products feature pre-arranged floral coordinates and precise wood framing, custom-ordered without the need to ship us your wedding garlands." 
                  : categories.find((c) => c.id === activeCategory)?.description}
              </p>
            </div>

            {/* Dynamic Curated Horizontal Channels based on Category */}
            <div className="space-y-12">
              {categories
                .filter((cat) => cat.id !== "all")
                .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
                .map((cat) => {
                  const catProds = products.filter((p) => p.category === cat.id);
                  if (catProds.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-4 group/carousel relative">
                      {/* Header with Title & Tag */}
                      <div className="flex items-end justify-between border-b border-[#8B7355]/25 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-7 bg-gradient-to-b from-[#8B7355] to-[#8C6F12] rounded-full" />
                            <h4 className="font-serif text-lg md:text-xl font-black tracking-wider text-[#EADEC9]">
                              {cat.title}
                            </h4>
                            <span className="text-[10px] font-sans font-black bg-[#122413] border border-[#8B7355]/25 text-[#8B7355] px-2.5 py-0.5 rounded-full uppercase">
                              {catProds.length} items
                            </span>
                          </div>
                          <p className="font-sans text-[11px] text-stone-300 italic">
                            Finished physical catalog pieces with standard dimension details. No garland shipping required.
                          </p>
                        </div>
                        
                        {/* Custom Sliding Controllers */}
                        <div className="flex items-center gap-1.5 z-10">
                          <button
                            onClick={() => {
                              const el = document.getElementById(`carousel-${cat.id}`);
                              if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                            }}
                            className="bg-[#122413] hover:bg-[#4A5D23] hover:text-white border border-[#8B7355]/35 text-[#8B7355] p-2.5 rounded-full transition-all duration-300 shadow-sm active:scale-90 cursor-pointer flex items-center justify-center placeholder-gray-400"
                            title="Scroll Left"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const el = document.getElementById(`carousel-${cat.id}`);
                              if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                            }}
                            className="bg-[#122413] hover:bg-[#4A5D23] hover:text-white border border-[#8B7355]/35 text-[#8B7355] p-2.5 rounded-full transition-all duration-300 shadow-sm active:scale-90 cursor-pointer flex items-center justify-center"
                            title="Scroll Right"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Scroller Area (Enforcing strict flex-row flex-nowrap to scrolls perfectly) */}
                      <div
                        id={`carousel-${cat.id}`}
                        className="flex flex-row flex-nowrap gap-6 overflow-x-auto pb-5 pt-2 scroll-smooth select-none min-w-full style-scroll-track"
                        style={{ scrollbarWidth: "auto" }}
                      >
                        {catProds.map((prod) => (
                          <motion.div
                            key={prod.id}
                            className="w-72 md:w-80 shrink-0 bg-gradient-to-b from-[#0c1f0e] to-[#050d06] rounded-[2rem] border-2 border-[#8B7355]/25 overflow-hidden shadow-md hover:shadow-[0_10px_30px_rgba(45,90,39,0.3)] hover:border-[#8B7355]/65 transition-all duration-500 relative flex flex-col justify-between group"
                          >
                            {prod.isPopular && (
                              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#8B7355] to-[#B88E53] text-[#071308] font-sans text-[9px] uppercase tracking-widest font-black py-1 px-3 rounded-full shadow-md">
                                ⚜️ Atelier Choice
                              </div>
                            )}

                            {/* Wishlist toggle button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(prod);
                              }}
                              className="absolute top-4 right-4 z-10 bg-black/60 border border-[#8B7355]/45 p-2 rounded-full hover:bg-black/80 active:scale-95 transition-all duration-300 text-[#8B7355] shadow-lg cursor-pointer flex items-center justify-center"
                              title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              <Heart className={`w-4 h-4 transition-transform duration-300 active:scale-125 ${isWishlisted(prod.id) ? "fill-[#8B7355] text-[#8B7355]" : "text-stone-300 hover:text-white"}`} />
                            </button>

                            <div>
                              <div className="aspect-[4/3] bg-[#0c1d0e]/50 overflow-hidden relative border-b border-[#8B7355]/20">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/85 to-transparent" />
                                <div className="absolute inset-3 border border-[#8B7355]/15 rounded-[1.4rem] pointer-events-none group-hover:border-[#8B7355]/35 transition-all" />
                              </div>

                              <div className="p-5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-sans font-black tracking-widest text-[#8B7355] uppercase">
                                    {cat.title}
                                  </span>
                                  <span className="text-[10px] text-emerald-300 font-sans font-bold bg-[#122413] px-2 py-0.5 rounded border border-emerald-500/15">
                                    Direct-Orderable
                                  </span>
                                </div>
                                <h5 className="font-serif text-sm md:text-base text-white font-bold tracking-wider leading-snug truncate">
                                  {prod.name}
                                </h5>
                                <p className="font-sans text-xs text-stone-300 line-clamp-3 leading-relaxed">
                                  {prod.description}
                                </p>
                              </div>
                            </div>

                            <div className="px-5 pb-5 pt-3 border-t border-[#8B7355]/15 flex items-center justify-between bg-black/15">
                              <span className="font-sans text-sm md:text-base font-black text-[#8B7355]">
                                ₹{prod.price.toLocaleString("en-IN")}
                              </span>
                              <button
                                onClick={() => setSelectedProduct(prod)}
                                className="text-[10px] font-sans font-black uppercase tracking-widest text-[#8B7355] hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-[#122413] py-2 px-4 rounded-full border border-[#8B7355]/40 hover:bg-[#4A5D23] hover:border-[#8B7355]"
                              >
                                Customize & Add <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VIEW B: BESPOKE PLANNER - DISTINCT LOGISTICS & SHIPPING PROTOCOLS */}
        {activeTab === "planner" && (
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#0e1f11] to-[#060e06] rounded-[2.5rem] border-2 border-[#8B7355]/35 p-6 md:p-8 shadow-2xl relative" id="planner-entry-anchor">
            {/* Decorative Filigree */}
            <div className="absolute top-4 left-4 text-[#8B7355]/30 text-xs">⚜️</div>
            <div className="absolute top-4 right-4 text-[#8B7355]/30 text-xs">⚜️</div>

            <div className="text-center space-y-2 mb-8">
              <span className="px-3.5 py-1 rounded-full bg-[#122412] text-[#8B7355] border border-[#8B7355]/30 text-[10px] font-bold uppercase tracking-widest">
                The Shipping & Chronology Log
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white font-black tracking-wide">
                Bespoke Keepsake Slot Registration
              </h3>
              <p className="font-sans text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Reserve your precious crafting slot below. Hand-curing real flowers takes weeks of delicate moisture extraction. Once registered, you will receive overnight premium courier protocols to safely ship your wedding garlands wrapped in aerated tissues. No middle-agents allowed.
              </p>
            </div>

            <form onSubmit={handleCheckoutInquiry} className="space-y-6">
              
              {/* Contact Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={plannerName}
                    onChange={(e) => setPlannerName(e.target.value)}
                    placeholder="e.g., Alisha Khan"
                    className="w-full bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition duration-300 placeholder-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase mb-1.5">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={plannerPhone}
                    onChange={(e) => setPlannerPhone(e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className="w-full bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition duration-300 placeholder-stone-500"
                  />
                </div>
              </div>

              {/* Celebration details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase mb-1.5">
                    Preservation Occasion
                  </label>
                  <select
                    value={plannerEventType}
                    onChange={(e) => setPlannerEventType(e.target.value)}
                    className="w-full bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition"
                  >
                    <option value="Wedding" className="bg-[#0c1e10]">Wedding Garland (Varmala) Preservation</option>
                    <option value="Nikah" className="bg-[#0c1e10]">Holy Nikah Frame Curation</option>
                    <option value="Engagement" className="bg-[#0c1e10]">Engagement Ring Platter Settings</option>
                    <option value="Baby Arrival" className="bg-[#0c1e10]">Bespoke Baby Announcements</option>
                    <option value="Bridal Shower" className="bg-[#0c1e10]">Luxury Bridesmaids Hampers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={plannerDate}
                    onChange={(e) => setPlannerDate(e.target.value)}
                    className="w-full bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition"
                  />
                </div>
              </div>

              {/* 2 Month warning indicator */}
              {plannerDate && (
                <div
                  className={`p-4 rounded-xl border flex gap-3 ${
                    isDateAdvanceOk(plannerDate)
                      ? "bg-[#112412] border-emerald-500/30 text-emerald-300"
                      : "bg-[#2d1110] border-red-500/25 text-red-300"
                  }`}
                >
                  <Calendar className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-sans space-y-1">
                    {isDateAdvanceOk(plannerDate) ? (
                      <>
                        <p className="font-bold">✅ Slot Calendar Safe!</p>
                        <p>Your wedding is over 2 months away. We have sufficient drying oven space and curing block slots for pristine, flawless flower work.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-red-400">⚠️ Rush Order Alert!</p>
                        <p>Your event date falls under 60 days. Resin floral frames require substantial dehydration time. Submission accepts, but Tasdiqa may decline if curation logs are full. Slot approved upon validation.</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Curation List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase block">
                    Choose Articles to Crate
                  </span>
                  <button
                    type="button"
                    onClick={() => setPlannerItems([...plannerItems, { category: "ring-platters", text: "" }])}
                    className="text-xs font-serif text-[#8B7355] font-semibold hover:underline"
                  >
                    + Add Additional Keepsake Item
                  </button>
                </div>

                {plannerItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center bg-[#071308] p-3 rounded-xl border border-[#8B7355]/20">
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const copy = [...plannerItems];
                        copy[index].category = e.target.value;
                        setPlannerItems(copy);
                      }}
                      className="bg-[#112413] border border-[#8B7355]/30 text-white text-xs px-2.5 py-1.5 rounded-lg font-sans focus:ring-1 focus:ring-[#8B7355]"
                    >
                      {categories.filter(c => c.id !== "all").map(c => (
                        <option key={c.id} value={c.id} className="bg-[#112413]">{c.title}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="e.g. Red roses, 'Alisha & Omar, 12th Sept'"
                      value={item.text}
                      onChange={(e) => {
                        const copy = [...plannerItems];
                        copy[index].text = e.target.value;
                        setPlannerItems(copy);
                      }}
                      className="flex-1 bg-transparent border border-[#8B7355]/20 text-white placeholder-stone-500 text-xs px-3 py-1.5 rounded-lg font-sans focus:outline-none focus:border-[#8B7355]"
                    />

                    {plannerItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPlannerItems(plannerItems.filter((_, i) => i !== index))}
                        className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Special notes */}
              <div>
                <label className="block text-[10px] font-sans font-black text-[#8B7355] tracking-widest uppercase mb-1.5">
                  Artistic guidelines & comments
                </label>
                <textarea
                  rows={3}
                  value={plannerCustomText}
                  onChange={(e) => setPlannerCustomText(e.target.value)}
                  placeholder="Tell us about the colors of secondary details, custom ribbons, your bridal dress color so we match the border, or any specific flower you are saving..."
                  className="w-full bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition duration-300 placeholder-stone-500"
                ></textarea>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-[#8B7355]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="font-sans text-[10px] uppercase tracking-wider text-stone-400">
                  🛡️ Strict Verification: direct bridal inquiries only. no resellers model.
                </div>
                <button
                  type="submit"
                  className="bg-[#4A5D23] text-white px-8 py-3.5 rounded-full font-serif font-bold hover:bg-emerald-950 transition cursor-pointer text-sm shadow-md flex items-center justify-center gap-2 border border-[#8B7355]"
                >
                  Register Keepsake Inquiry <CheckCircle className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* VIEW C: CUSTOMER INQUIRY & TRACKING DECK */}
        {activeTab === "orders" && (
          <div className="max-w-xl mx-auto bg-gradient-to-b from-[#0e1f11] to-[#060e06] rounded-[2.5rem] border-2 border-[#8B7355]/35 p-6 md:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <span className="px-3.5 py-1 rounded-full bg-[#122412] text-[#8B7355] border border-[#8B7355]/30 text-[10px] font-bold uppercase tracking-widest inline-block">
              🔱 Customer Query Deck
            </span>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl md:text-3xl text-white font-black tracking-wide">
                Track Slot Status
              </h3>
              <p className="font-sans text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                Enter your WhatsApp phone number or registered Inquiry ID below to verify your flower curing state under live Tasdiqa records.
              </p>
            </div>

            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="e.g. +91 98765 43210 or Inquiry ID"
                value={searchQueryPhone}
                onChange={(e) => setSearchQueryPhone(e.target.value)}
                className="flex-1 bg-[#071308] border border-[#8B7355]/25 text-white rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] transition duration-300 placeholder-stone-600"
              />
              <button
                onClick={() => {
                  if (!searchQueryPhone) return;
                  const query = searchQueryPhone.trim().toLowerCase();
                  const results = bookings.filter(b => 
                    b.phone.toLowerCase().includes(query) || 
                    b.id.toString().toLowerCase().includes(query) ||
                    b.customerName.toLowerCase().includes(query)
                  );
                  setSearchedBookings(results);
                }}
                className="bg-[#4A5D23] text-white px-5 py-2.5 rounded-xl font-sans text-xs font-bold hover:bg-[#122413] transition border border-[#8B7355]/30 cursor-pointer"
              >
                Track Live
              </button>
            </div>

            {/* Results Deck */}
            {searchedBookings !== null && (
              <div className="text-left pt-4 border-t border-[#8B7355]/20 space-y-4">
                {searchedBookings.length === 0 ? (
                  <div className="text-center p-6 bg-red-950/20 rounded-2xl border border-red-500/20 text-red-200 text-xs">
                    No verified slots found matching "{searchQueryPhone}". Standard bookings update within 24 hours of pre-order creation.
                  </div>
                ) : (
                  searchedBookings.map((b) => (
                    <div key={b.id} className="bg-black/35 p-4 rounded-2xl border-2 border-[#8B7355]/25 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-stone-400">ID: #{b.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-950 text-[#8B7355] border border-[#8B7355]/25">
                          {b.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-serif text-sm font-semibold text-[#E9DEC6]">Contact: {b.customerName}</p>
                        <p className="text-[11px] text-stone-300 font-sans">Occasion: {b.eventType} ({b.eventDate})</p>
                      </div>

                      <div className="bg-[#122413] p-3 rounded-xl border border-emerald-500/10 text-[11px] text-stone-300">
                        <p className="font-bold text-[#8B7355] mb-1">📋 Registered Articles:</p>
                        {b.items && Array.isArray(b.items) ? (
                          <ul className="list-disc list-inside space-y-1 text-[10px]">
                            {b.items.map((it: any, i: number) => (
                              <li key={i}>{getCategoryLabel(it.category)}: {it.text || "Standard build setup"}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[10px]">{b.customNotes || "Awaiting details"}</p>
                        )}
                      </div>

                      <div className="pt-2 text-[10px] space-y-2">
                        <p className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] inline-block mb-1">Curing Progress Timeline:</p>
                        <div className="grid grid-cols-4 gap-1 text-center scale-95 relative z-10">
                          <div className="space-y-1 text-emerald-400">
                            <span className="block mx-auto w-3 h-3 rounded-full bg-emerald-500 border border-white" />
                            <span className="block text-[8px] uppercase tracking-wider font-bold">1. Logged</span>
                          </div>
                          <div className={`space-y-1 ${b.status === "Pending Verification" ? "text-stone-500" : "text-emerald-400"}`}>
                            <span className={`block mx-auto w-3 h-3 rounded-full border ${b.status === "Pending Verification" ? "bg-stone-800 border-stone-600" : "bg-emerald-500 border-white"}`} />
                            <span className="block text-[8px] uppercase tracking-wider font-bold">2. Couriered</span>
                          </div>
                          <div className={`space-y-1 ${["Pending Verification", "Confirmed (Advance Paid)"].includes(b.status || "") ? "text-stone-500" : "text-emerald-400"}`}>
                            <span className={`block mx-auto w-3 h-3 rounded-full border ${["Pending Verification", "Confirmed (Advance Paid)"].includes(b.status || "") ? "bg-stone-800 border-stone-600" : "bg-emerald-500 border-white"}`} />
                            <span className="block text-[8px] uppercase tracking-wider font-bold">3. Curing</span>
                          </div>
                          <div className={`space-y-1 ${b.status === "Completed & Dispatched" ? "text-emerald-400" : "text-stone-500"}`}>
                            <span className={`block mx-auto w-3 h-3 rounded-full border ${b.status === "Completed & Dispatched" ? "bg-emerald-500 border-white" : "bg-stone-800 border-stone-600"}`} />
                            <span className="block text-[8px] uppercase tracking-wider font-bold">4. Arrived 📦</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW D: SECURED MASTER BACK-OFFICE WORKSPACE OVERLAY */}
        {isAdminOverlayOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col items-center justify-start p-4 md:p-8 space-y-6">
            
            {/* Absolute close button */}
            <div className="w-full max-w-5xl flex justify-end">
              <button
                 onClick={() => setIsAdminOverlayOpen(false)}
                 className="bg-[#122413] hover:bg-[#4A5D23] border-2 border-[#8B7355]/50 text-[#8B7355] px-5 py-2.5 rounded-full transition-all duration-300 font-sans text-xs uppercase tracking-widest font-black flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                 title="Close Back-office"
              >
                <X className="w-4 h-4" /> Close Atelier Vault
              </button>
            </div>

            <div className="w-full max-w-5xl space-y-10">
            {!isAdminAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-[#F2F4EF] border border-[#8B7355]/45 rounded-[2rem] p-8 shadow-xl text-center space-y-6 relative overflow-hidden"
              >
                {/* Decorative filigrees */}
                <div className="absolute top-3 left-3 text-[#8B7355]/40 text-[11px]">⚜️</div>
                <div className="absolute top-3 right-3 text-[#8B7355]/40 text-[11px]">⚜️</div>
                <div className="absolute bottom-3 left-3 text-[#8B7355]/40 text-[11px]">⚜️</div>
                <div className="absolute bottom-3 right-3 text-[#8B7355]/40 text-[11px]">⚜️</div>

                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#4A5D23]/10 text-[#4A5D23] rounded-full mx-auto flex items-center justify-center border border-[#8B7355]/30">
                    <ShieldCheck className="w-6 h-6 text-[#8B7355]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 tracking-wider">
                    Bespoke Heritage Vault
                  </h3>
                  <p className="font-sans text-xs text-[#5C4D4A] leading-relaxed">
                    Access to the curated boutique registry requires the master verification code.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const cleanP = passwordAttempt.trim();
                    if (cleanP === "tasdiqa@123321") {
                      setIsAdminAuthenticated(true);
                      setPasswordError("");
                    } else {
                      setPasswordError("Invalid royal passcode. Please try again.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#7C6E6A]">
                      Atelier Passcode
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordAttempt}
                      onChange={(e) => setPasswordAttempt(e.target.value)}
                      className="w-full bg-[#122413] text-[#8B7355] placeholder-[#8B7355]/30 border-2 border-[#8B7355]/55 rounded-xl px-4 py-2.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#8B7355] font-mono tracking-widest font-black text-sm"
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-[11px] text-red-600 font-sans italic">{passwordError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#4A5D23] text-[#ECE6D9] hover:bg-[#1E3E1A] transition rounded-xl font-serif text-xs font-bold uppercase tracking-widest border border-[#8B7355]/40 cursor-pointer"
                  >
                    Authorize Access
                  </button>
                </form>

                <p className="text-[10px] text-[#8B7355] bg-[#122413] border border-[#8B7355]/30 rounded-lg p-2.5 leading-relaxed italic">
                  🔐 <strong>Temporary Authorized Passcode:</strong> <code>tasdiqa@123321</code>
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header branding */}
                <div className="bg-gradient-to-r from-[#1E3E1A] to-[#4A5D23] text-white rounded-3xl p-8 border border-[#8B7355] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="absolute top-0 right-0 p-1 opacity-10">
                    <Sparkles className="w-32 h-32 text-[#8B7355]" />
                  </div>
                  <div className="space-y-2 relative z-10 text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#8B7355]/40 text-[10px] font-bold tracking-widest uppercase text-[#8B7355]">
                      ✨ Elite Curation Registry
                    </span>
                    <h3 className="font-serif text-3xl font-semibold tracking-wider">
                      Heritage Atelier Back-Office
                    </h3>
                    <p className="font-sans text-xs text-white/85 max-w-xl">
                      Administer luxury custom categories, update photograph backgrounds inside square tiles, and append exclusive wedding portfolios live.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shrink-0">
                    <span className="font-serif text-2xl font-bold text-[#8B7355]" id="category-counter-id">
                      {categories.length}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-wider text-white/50">Active Shelves</span>
                  </div>
                </div>

                {/* Secure Back-Office Inner Sub-Tabs */}
                <div className="flex border-b border-[#8B7355]/20 pb-2 mt-6 gap-2 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => {
                      setAdminSubTab("categories");
                      setAdminMessage({ text: "", type: "" });
                    }}
                    className={`py-2.5 px-5 rounded-t-xl font-serif text-xs uppercase tracking-widest cursor-pointer font-bold border-b-2 transition-all duration-300 ${
                      adminSubTab === "categories"
                        ? "border-[#4A5D23] bg-[#4A5D23]/5 text-[#4A5D23]"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    ⚜️ Category Shelves ({categories.length})
                  </button>
                  <button
                    onClick={() => {
                      setAdminSubTab("products");
                      setAdminMessage({ text: "", type: "" });
                      if (!prodCategory && categories.length > 0) {
                        setProdCategory(categories[1] ? categories[1].id : categories[0].id);
                      }
                    }}
                    className={`py-2.5 px-5 rounded-t-xl font-serif text-xs uppercase tracking-widest cursor-pointer font-bold border-b-2 transition-all duration-300 ${
                      adminSubTab === "products"
                        ? "border-[#4A5D23] bg-[#4A5D23]/5 text-[#4A5D23]"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    💍 Product Catalog ({products.length})
                  </button>
                  <button
                    onClick={() => {
                      setAdminSubTab("inquiries");
                      setAdminMessage({ text: "", type: "" });
                    }}
                    className={`py-2.5 px-5 rounded-t-xl font-serif text-xs uppercase tracking-widest cursor-pointer font-bold border-b-2 transition-all duration-300 ${
                      adminSubTab === "inquiries"
                        ? "border-[#4A5D23] bg-[#4A5D23]/5 text-[#4A5D23]"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    🛡️ Inquiries Registry ({bookings.length})
                  </button>
                  <button
                    onClick={() => {
                      setAdminSubTab("settings");
                      setAdminMessage({ text: "", type: "" });
                    }}
                    className={`py-2.5 px-5 rounded-t-xl font-serif text-xs uppercase tracking-widest cursor-pointer font-bold border-b-2 transition-all duration-300 ${
                      adminSubTab === "settings"
                        ? "border-[#4A5D23] bg-[#4A5D23]/5 text-[#4A5D23]"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    ⚙️ BRAND SETTINGS
                  </button>
                </div>

            {/* Notification messages */}
            {adminMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border font-sans text-xs flex items-center justify-between ${
                  adminMessage.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <span>{adminMessage.text}</span>
                <button
                  onClick={() => setAdminMessage({ text: "", type: "" })}
                  className="text-gray-400 hover:text-gray-600 font-bold focus:outline-none"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Atelier Master Interactive At-a-Glance Control Deck */}
            <div className="bg-[#112213] rounded-3xl border border-[#8B7355]/35 p-5 shadow-2xl mt-4 mb-6 space-y-3 mr-auto ml-auto text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#8B7355] flex items-center gap-1.5">
                  ⚜️ Atelier Control Bridge — Choose Quick Action Desk
                </span>
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  Secured Console Mode
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setAdminSubTab("categories")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center relative group ${
                    adminSubTab === "categories"
                      ? "bg-[#4A5D23] border-[#8B7355] text-[#F2F4EF] shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-102"
                      : "bg-[#0c180d] border-[#8B7355]/20 text-[#8B7355] hover:border-[#8B7355]/50 hover:bg-[#122413] hover:scale-102"
                  }`}
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition duration-300">⚜️</span>
                  <span className="font-serif text-[11px] font-bold tracking-wide uppercase">Categories</span>
                  <span className="text-[8px] font-mono text-stone-300 opacity-80 mt-0.5">{categories.length} Shelves Active</span>
                </button>

                <button
                  onClick={() => setAdminSubTab("products")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center relative group ${
                    adminSubTab === "products"
                      ? "bg-[#4A5D23] border-[#8B7355] text-[#F2F4EF] shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-102"
                      : "bg-[#0c180d] border-[#8B7355]/20 text-[#8B7355] hover:border-[#8B7355]/50 hover:bg-[#122413] hover:scale-102"
                  }`}
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition duration-300">💍</span>
                  <span className="font-serif text-[11px] font-bold tracking-wide uppercase">Product Catalog</span>
                  <span className="text-[8px] font-mono text-stone-300 opacity-80 mt-0.5">{products.length} Items Listed</span>
                </button>

                <button
                  onClick={() => setAdminSubTab("inquiries")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center relative group ${
                    adminSubTab === "inquiries"
                      ? "bg-[#4A5D23] border-[#8B7355] text-[#F2F4EF] shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-102"
                      : "bg-[#0c180d] border-[#8B7355]/20 text-[#8B7355] hover:border-[#8B7355]/50 hover:bg-[#122413] hover:scale-102"
                  }`}
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition duration-300">🛡️</span>
                  <span className="font-serif text-[11px] font-bold tracking-wide uppercase">Inquiries</span>
                  <span className="text-[8px] font-mono text-stone-300 opacity-80 mt-0.5">{bookings.length} Logs Saved</span>
                </button>

                <button
                  onClick={() => setAdminSubTab("settings")}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center relative group ${
                    adminSubTab === "settings"
                      ? "bg-[#4A5D23] border-[#8B7355] text-[#F2F4EF] shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-102"
                      : "bg-[#0c180d] border-[#8B7355]/20 text-[#8B7355] hover:border-[#8B7355]/50 hover:bg-[#122413] hover:scale-102"
                  }`}
                >
                  <span className="text-xl mb-1 group-hover:scale-110 transition duration-300">⚙️</span>
                  <span className="font-serif text-[11px] font-bold tracking-wide uppercase">Payment Config</span>
                  <span className="text-[8px] font-mono text-stone-300 opacity-80 mt-0.5">UPI, Social Setup</span>
                </button>
              </div>
            </div>

            {adminSubTab === "categories" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Editor (5 cols) */}
              <div className="lg:col-span-5 space-y-6" id="atelier-editor-form">
                <div className="bg-white rounded-3xl border border-[#8B7355]/25 p-6 shadow-md relative">
                  <div className="absolute top-4 right-4">
                    <Award className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider mb-4 pb-2 border-b border-[#8B7355]/15">
                    {isEditingId ? "Modify Existing Category ⚜️" : "Register Luxury Category 🌸"}
                  </h4>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newCatId || !newCatTitle) {
                        setAdminMessage({ text: "Please supply a unique identifier and descriptive title.", type: "error" });
                        return;
                      }

                      const payload = {
                        id: newCatId,
                        title: newCatTitle,
                        description: newCatDesc,
                        badge: newCatBadge,
                        imageUrl: newCatImageUrl
                      };

                      try {
                        const url = isEditingId ? `/api/categories/${isEditingId}` : "/api/categories";
                        const method = isEditingId ? "PUT" : "POST";
                        
                        const res = await fetch(url, {
                          method,
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload)
                        });
                        const data = await res.json();
                        if (data.success) {
                          setAdminMessage({
                            text: isEditingId 
                              ? `⚜️ Collection category '${newCatTitle}' updated gracefully!` 
                              : `⚜️ Bespoke category '${newCatTitle}' added successfully to our premium registry!`,
                            type: "success"
                          });
                          
                          setNewCatId("");
                          setNewCatTitle("");
                          setNewCatDesc("");
                          setNewCatBadge("");
                          setNewCatImageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop");
                          setIsEditingId(null);
                          fetchCategories();
                        } else {
                          setAdminMessage({ text: `Atelier Action Failed: ${data.error}`, type: "error" });
                        }
                      } catch(err) {
                        console.error(err);
                        setAdminMessage({ text: "Network issue authenticating back-office changes.", type: "error" });
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                        Unique Category Key (slug) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. platinum-vows, velvet-boxes"
                        disabled={!!isEditingId}
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800 disabled:opacity-50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                        Display Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Emerald Platters"
                        value={newCatTitle}
                        onChange={(e) => setNewCatTitle(e.target.value)}
                        className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                        Exclusive Promo Badge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Limited, Heritage Special, Lifetime"
                        value={newCatBadge}
                        onChange={(e) => setNewCatBadge(e.target.value)}
                        className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                        Keepsake Suite Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Provide details about materials, hand-painted calligraphy frames, glass settings..."
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      />
                    </div>

                    {/* Pre-curated photoPresets gallery selection */}
                    <div>
                      <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                        Square Backdrop Image Preset selection
                      </label>
                      <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-[#F2F4EF]/40 rounded-xl border border-[#8B7355]/10">
                        {LUXURY_PRESET_IMAGES.map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setNewCatImageUrl(preset.url)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                              newCatImageUrl === preset.url 
                                ? "border-[#8B7355] scale-103 shadow-sm" 
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Or paste any custom premium Unsplash picture URL"
                          value={newCatImageUrl}
                          onChange={(e) => setNewCatImageUrl(e.target.value)}
                          className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-[10px] font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                          required
                        />

                        {/* Interactive Gallery Pic Upload */}
                        <div className="space-y-1 bg-[#F2F4EF]/50 p-2.5 rounded-xl border border-dashed border-[#8B7355]/30 text-left">
                          <label className="block text-[9px] font-sans font-black text-[#4A5D23] uppercase tracking-wider">
                            📸 Upload Category Cover from your Gallery
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") {
                                    setNewCatImageUrl(reader.result);
                                    setAdminMessage({ text: "✨ Category cover image loaded from gallery successfully!", type: "success" });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-[10px] text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[9px] file:font-semibold file:bg-[#4A5D23]/10 file:text-[#4A5D23] hover:file:bg-[#4A5D23]/20 cursor-pointer file:cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#4A5D23] to-[#1E3E1A] text-white text-xs uppercase tracking-widest font-bold py-3 rounded-xl border border-[#8B7355] hover:opacity-90 shadow cursor-pointer transition"
                      >
                        {isEditingId ? "Save Changes" : "Create Square Category"}
                      </button>
                      {isEditingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingId(null);
                            setNewCatId("");
                            setNewCatTitle("");
                            setNewCatDesc("");
                            setNewCatBadge("");
                            setNewCatImageUrl("https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop");
                          }}
                          className="bg-gray-100 text-gray-700 text-xs py-3 px-4 rounded-xl hover:bg-gray-200 cursor-pointer transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Categories Management Grid (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl border border-[#8B7355]/25 p-6 shadow-md">
                  <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider mb-4 pb-2 border-b border-[#8B7355]/15">
                    Live Bouquet Registry
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div 
                        key={cat.id}
                        className="p-4 rounded-2xl bg-gradient-to-b from-white to-[#F2F4EF]/30 border border-[#8B7355]/15 flex gap-4 items-center relative group"
                      >
                        {/* Square image backdrop */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#8B7355]/25 relative shadow-sm">
                          <img src={cat.imageUrl} alt={cat.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          {cat.badge && (
                            <span className="text-[7px] uppercase font-bold text-[#8B7355] bg-[#F2F4EF] px-1 py-0.5 rounded border border-[#8B7355]/20">
                              {cat.badge}
                            </span>
                          )}
                          <h5 className="font-serif text-sm font-bold text-gray-900 truncate">
                            {cat.title}
                          </h5>
                          <p className="font-sans text-[10px] text-[#7C6E6A] line-clamp-2">
                            {cat.description || "No description loaded."}
                          </p>
                        </div>

                        {/* Actions overlay panel */}
                        <div className="absolute right-2 top-2 flex gap-1 items-center bg-white/90 p-1 rounded-lg shadow-sm border border-[#8B7355]/15 opacity-80 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => {
                              setIsEditingId(cat.id);
                              setNewCatId(cat.id);
                              setNewCatTitle(cat.title);
                              setNewCatDesc(cat.description);
                              setNewCatBadge(cat.badge);
                              setNewCatImageUrl(cat.imageUrl);
                              document.getElementById("atelier-editor-form")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="p-1.5 text-[#4A5D23] hover:bg-[#F2F4EF] rounded-md transition"
                            title="Edit Category Details"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={async () => {
                              if (cat.id === "all") {
                                setAdminMessage({ text: "For structural integrity, the standard 'All Collections' category is immutable.", type: "error" });
                                return;
                              }
                              if (!confirm(`Are you sure you would like to permanently remove the bespoke collection '${cat.title}' from Tasdiqa's catalog?`)) {
                                return;
                              }

                              try {
                                const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (data.success) {
                                  setAdminMessage({ text: "⚜️ Category retired from our boutique shelves.", type: "success" });
                                  fetchCategories();
                                  if (activeCategory === cat.id) {
                                    setActiveCategory("all");
                                  }
                                } else {
                                  setAdminMessage({ text: `Failed to remove category: ${data.error}`, type: "error" });
                                }
                              } catch(err) {
                                console.error(err);
                                setAdminMessage({ text: "Network error retiring category.", type: "error" });
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                            title="Retire Category"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {adminSubTab === "products" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Product Editor Form */}
                <div className="lg:col-span-5 space-y-6" id="product-editor-form-id">
                  <div className="bg-white rounded-3xl border border-[#8B7355]/25 p-6 shadow-md relative animate-fade-in">
                    <div className="absolute top-4 right-4">
                      <Award className="w-5 h-5 text-[#8B7355]" />
                    </div>
                    <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider mb-4 pb-2 border-b border-[#8B7355]/15">
                      {editingProductId ? "Modify Studio Jewel ⚜️" : "Register Luxury Keepsake 🌸"}
                    </h4>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Imperial Floral Casting Resin Tray"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                            Category Section *
                          </label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full bg-[#F2F4EF]/35 border border-[#8B7355]/30 rounded-xl px-2.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            required
                          >
                            <option value="">Choose category...</option>
                            {categories.filter(c => c.id !== "all").map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                            Bespoke Price (INR) *
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 5400"
                            value={prodPrice}
                            onChange={(e) => setProdPrice(e.target.value)}
                            className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                          Mini Brochure Description
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Provide details of artistry style, resin layer details, handwritten script..."
                          value={prodDescription}
                          onChange={(e) => setProdDescription(e.target.value)}
                          className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                          Product Brochure Bullet Points (One per line)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. Handmade pine wood trunk&#10;Choice of Rose Gold lettering&#10;Dimensions: 11 x 11 inches"
                          value={prodDetailsInput}
                          onChange={(e) => setProdDetailsInput(e.target.value)}
                          className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#4A5D23]"
                        />
                      </div>

                      {/* Backdrop image presets selection */}
                      <div>
                        <label className="block text-[10px] font-sans font-bold text-[#7C6E6A] uppercase tracking-wider mb-1">
                          Atelier Photo Backdrop Preset
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-[#F2F4EF]/40 rounded-xl border border-[#8B7355]/10 select-none">
                          {LUXURY_PRESET_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setProdImageUrl(preset.url)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                                prodImageUrl === preset.url
                                  ? "border-[#8B7355] scale-103 shadow-md"
                                  : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Or paste any custom premium Unsplash picture URL"
                            value={prodImageUrl}
                            onChange={(e) => setProdImageUrl(e.target.value)}
                            className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/30 rounded-xl px-3.5 py-2 text-[10px] font-sans focus:outline-none focus:ring-1 focus:ring-emerald-800"
                            required
                          />

                          {/* Interactive Gallery Pic Upload */}
                          <div className="space-y-1 bg-[#F2F4EF]/50 p-2.5 rounded-xl border border-dashed border-[#8B7355]/30 text-left">
                            <label className="block text-[9px] font-sans font-black text-[#4A5D23] uppercase tracking-wider">
                              📸 Upload Product Cover from your Gallery
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === "string") {
                                      setProdImageUrl(reader.result);
                                      setAdminMessage({ text: "✨ Product image loaded from gallery successfully!", type: "success" });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="block w-full text-[10px] text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[9px] file:font-semibold file:bg-[#4A5D23]/10 file:text-[#4A5D23] hover:file:bg-[#4A5D23]/20 cursor-pointer file:cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1.5 px-3.5 bg-[#F2F4EF] rounded-xl border border-amber-200/30">
                        <input
                          type="checkbox"
                          id="prodIsPopular"
                          checked={prodIsPopular}
                          onChange={(e) => setProdIsPopular(e.target.checked)}
                          className="w-4 h-4 rounded text-[#4A5D23] focus:ring-[#4A5D23] border-[#8B7355]/30 cursor-pointer"
                        />
                        <label htmlFor="prodIsPopular" className="text-[11px] font-medium text-amber-900 cursor-pointer select-none">
                          ⭐ Feature on Front-page Showcase Board
                        </label>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#4A5D23] to-[#1E3E1A] text-white text-xs uppercase tracking-widest font-bold py-3 rounded-xl border border-[#8B7355] hover:opacity-90 shadow cursor-pointer transition"
                        >
                          {editingProductId ? "Save Changes" : "Craft & Publish"}
                        </button>
                        {editingProductId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductId(null);
                              setProdName("");
                              setProdCategory("");
                              setProdPrice("");
                              setProdDescription("");
                              setProdImageUrl("");
                              setProdIsPopular(false);
                              setProdDetailsInput("");
                            }}
                            className="bg-gray-100 text-gray-700 text-xs py-3 px-4 rounded-xl hover:bg-gray-200 cursor-pointer transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Products List Table */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl border border-[#8B7355]/25 p-6 shadow-md overflow-hidden animate-fade-in">
                    <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider mb-4 pb-2 border-b border-[#8B7355]/15">
                      Studio Product Ledger ({products.length})
                    </h4>

                    <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-none">
                      {products.map((prod) => {
                        const catObj = categories.find((c) => c.id === prod.category);
                        return (
                          <div
                            key={prod.id}
                            className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-[#F2F4EF]/20 border border-[#8B7355]/15 flex items-center justify-between gap-4 relative group hover:border-[#8B7355]/50 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#8B7355]/20 relative shadow-inner">
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[8px] uppercase font-bold text-[#4A5D23] bg-[#4A5D23]/5 px-1.5 py-0.5 rounded border border-[#4A5D23]/20">
                                    {catObj ? catObj.title : prod.category}
                                  </span>
                                  {prod.isPopular && (
                                    <span className="text-[8px] uppercase font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                      ⭐ Featured
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-serif text-xs font-bold text-gray-900 truncate max-w-xs md:max-w-sm">
                                  {prod.name}
                                </h5>
                                <p className="font-sans text-[11px] font-bold text-[#4A5D23]">
                                  ₹{prod.price.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-1 items-center bg-white/90 p-1 rounded-lg border border-[#8B7355]/15">
                              <button
                                onClick={() => {
                                  handleEditProduct(prod);
                                  document.getElementById("product-editor-form-id")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="p-1.5 text-[#4A5D23] hover:bg-[#F2F4EF] rounded-md transition"
                                title="Edit Product Specs"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition hover:text-red-800"
                                title="Retire Product"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminSubTab === "inquiries" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="bg-white rounded-3xl border border-[#8B7355]/25 p-6 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#8B7355]/15 pb-4 mb-5 gap-3">
                    <div>
                      <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider">
                        Bespoke Booking & Inquiries Archives
                      </h4>
                      <p className="font-sans text-xs text-[#7C6E6A]">
                        Sensitive database logs access strictly limited to verified back-office administrators.
                      </p>
                    </div>
                    <span className="font-sans text-[10px] font-bold uppercase shrink-0 px-3 py-1.5 bg-[#4A5D23]/5 border border-[#4A5D23]/25 text-[#4A5D23] rounded-full">
                      🔑 Secured & Encrypted Logs
                    </span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-sans text-sm">
                      No customer custom requests or bookings found in database logs.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-gradient-to-b from-white to-[#F2F4EF]/20 rounded-2xl border border-[#8B7355]/20 p-5 shadow-sm hover:shadow-md transition duration-300 space-y-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E8EADF] text-[#8B7355]">
                                  {booking.id}
                                </span>
                                <span className="text-[11px] font-sans text-gray-400">
                                  Logged {booking.createdAt ? new Date(booking.createdAt).toLocaleString("en-IN") : "Just now"}
                                </span>
                              </div>
                              <h5 className="font-serif text-base text-gray-900 font-bold">
                                {booking.customerName}
                              </h5>
                              <div className="font-sans text-[11px] text-[#5C4D4A] space-y-0.5">
                                <p>📞 Phone: <strong className="text-[#111827]">{booking.phone || "Not specified"}</strong></p>
                                <p>📧 Email: <strong className="text-[#111827]">{booking.email || "Not specified"}</strong></p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              {/* Status update widget */}
                              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#8B7355]/20 text-xs">
                                <span className="text-[9px] uppercase font-sans font-bold text-gray-400">Status:</span>
                                <select
                                  value={booking.status}
                                  onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                  className="text-[11px] font-sans focus:outline-none bg-transparent cursor-pointer font-bold text-[#4A5D23]"
                                >
                                  <option value="Pending Verification">Pending Verification</option>
                                  <option value="Confirmed (Advance Paid)">Confirmed (Advance Paid)</option>
                                  <option value="Awaiting Flowers">Awaiting Flowers</option>
                                  <option value="Completed & Dispatched">Completed & Dispatched</option>
                                  <option value="Alert: Urgent Order (Approval Pending)">Urgent Order Approval</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleDeleteBooking(booking.id, booking.customerName)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
                                title="Delete Inquiry permanently"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-[#8B7355]/10 text-xs font-sans">
                            <div>
                              <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">Curation Items</span>
                              <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium">
                                {booking.items ? booking.items.map((it: any, idx: number) => (
                                  <li key={idx}>
                                    {it.category} {it.qty ? `(x${it.qty})` : ""} <span className="text-[#8B5E3C] font-mono">[{it.text}]</span>
                                  </li>
                                )) : <li>Bespoke planner consult</li>}
                              </ul>
                            </div>

                            <div>
                              <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">Event details</span>
                              <p className="text-gray-900 font-serif"><strong>Event:</strong> {booking.eventType}</p>
                              <p className="text-gray-900"><strong>Date:</strong> {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "TBD"}</p>
                            </div>

                            <div>
                              <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">Financial Estimation</span>
                              <p className="text-base text-[#4A5D23] font-bold">₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}</p>
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-200 mt-1">
                                {booking.isAdvanceOk === false ? "🚨 Advance Timeline Alert" : "✅ Standard Advance Timeline"}
                              </span>
                            </div>
                          </div>

                          {booking.customNotes && (
                            <div className="bg-[#F2F4EF] p-3 rounded-xl border border-amber-200/25 text-xs font-mono text-[#5C4D4A]">
                              💡 <strong className="font-serif">Client Custom Request Note:</strong> {booking.customNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}



            {adminSubTab === "settings" && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#8B7355]/25 p-6 md:p-8 shadow-xl text-left space-y-6 animate-fade-in text-gray-800">
                <div className="pb-3 border-b border-[#8B7355]/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg text-gray-900 font-bold tracking-wider">
                      ⚙️ Back-Office Channels & Payments configuration
                    </h4>
                    <p className="font-sans text-[11px] text-[#7C6E6A]">
                      Configure real-time UPI gateways and direct ordering channels shown to active customers.
                    </p>
                  </div>
                  <span className="text-[10px] bg-[#4A5D23]/10 text-[#4A5D23] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                    live credentials
                  </span>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5 font-sans text-xs">
                  <div className="bg-[#4A5D23]/5 border-l-4 border-[#4A5D23] p-3.5 rounded-r-xl space-y-1">
                    <h5 className="font-bold text-[#4A5D23]">🛡️ Unified Payments Interface (UPI) Gateways</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      Entering your UPI address below updates the active digital payment gateway. Customers checkout instantly by transferring money directly to this account with zero gateway fee deductions.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700 uppercase tracking-widest text-[9px]">Atelier Master UPI ID *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. tanishq77@ybl or tasdiqa12@okaxis"
                        value={storeUpiId}
                        onChange={(e) => setStoreUpiId(e.target.value)}
                        className="w-full px-3.5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A5D23] font-semibold text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Example formats: upi_address@bankname (Google Pay, PhonePe, Paytm or Custom QR compatible)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-700 uppercase tracking-widest text-[9px]">Ordering WhatsApp Hot-Line *</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={storeWhatsapp}
                        onChange={(e) => setStoreWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A5D23] font-semibold text-gray-900 placeholder-gray-400"
                        required
                      />
                      <p className="text-[10px] text-gray-400 italic">Include country code for direct API redirect.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-gray-700 uppercase tracking-widest text-[9px]">Brand Instagram Username *</label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-bold">
                          @
                        </span>
                        <input
                          type="text"
                          placeholder="atelier_tasdiqa"
                          value={storeInstagram}
                          onChange={(e) => setStoreInstagram(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#4A5D23] font-semibold text-gray-900 placeholder-gray-400"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 italic">User name for direct Instagram bio/direct logs.</p>
                    </div>
                  </div>

                  <div className="bg-[#F2F4EF] border border-[#8B7355]/35 rounded-2xl p-4 space-y-2">
                    <h6 className="font-serif font-bold text-gray-800 tracking-wide text-xs">👀 Dynamic Client Preview:</h6>
                    <div className="space-y-1 text-[11px] text-[#524442] leading-relaxed">
                      <p>✨ <strong>Active UPI Merchant Account:</strong> <code className="bg-emerald-50 px-1.5 py-0.5 border border-emerald-200/50 rounded font-semibold text-[#4A5D23]">{storeUpiId}</code></p>
                      <p>💬 <strong>WhatsApp Order Chatbot:</strong> <code className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-700">{storeWhatsapp}</code></p>
                      <p>📸 <strong>Instagram Portfolio Redirect:</strong> <code className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-700">instagram.com/{storeInstagram}</code></p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#4A5D23] text-white hover:bg-[#323A27] transition rounded-xl font-serif text-xs font-bold uppercase tracking-widest border border-[#8B7355]/50 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    ⚜️ Apply Back-Office Configurations
                  </button>
                </form>
              </div>
            )}
          </>
        )}
            </div>
          </div>
        )}

      </main>

      {/* 5. BRAND STORY ABOUT ARTISAN SECTION */}
      <section className="bg-[#0e170f]/90 py-12 md:py-16 border-t border-b border-[#8B7355]/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Avatar frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-[#8B7355] overflow-hidden shadow-2xl bg-[#122413]">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
                  alt="Tasdiqa (HAMPERS_4_YOU founder)"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-95 rounded-full"
                />
              </div>
              <div className="absolute top-2 right-2 bg-emerald-800 text-[#F2F4EF] p-3 rounded-full shadow-lg scale-95 border border-[#8B7355] animate-pulse">
                <Award className="w-5 h-5 text-[#8B7355]" />
              </div>
            </div>
          </div>

          {/* Left bio details */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#8B7355] block">Behind The Craft Cuttings</span>
            <h3 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wider">
              Tasdiqa's Dedication to Eternity
            </h3>
            <p className="font-sans text-sm text-stone-300 leading-relaxed">
              Welcome, wonderful souls! I am Tasdiqa, the head artist behind HAMPERS_4_YOU. Gifting isn't just about packing hampers; it's about casting a story. For me, preserving the actual roses from your Varmala or hand-painting your Urdu Nikah certificate marks a high honor. Each frame sits in dehydrators, curing resins under stable temperatures for weeks so it looks gorgeous for a lifetime.
            </p>
            <div className="bg-[#122414] p-4 rounded-2xl border border-[#8B7355]/35 text-xs font-sans text-stone-200 space-y-2 max-w-xl mx-auto lg:mx-0">
              <p className="font-bold flex items-center justify-center lg:justify-start gap-1.5 text-[#8B7355]">
                <ShieldCheck className="w-4 h-4 text-[#8B7355]" /> Direct-to-Consumer Guarantee
              </p>
              <p className="leading-relaxed text-stone-300">
                We follow a strict <strong>No Resellers Allowed</strong> policy to avoid commercial dilution or markup inflation. This ensures you buy genuine, meticulous artistry directly from our workshop. Each platter holds your authentic memories.
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold uppercase tracking-wider text-stone-400 pt-1">
              <span>🇮🇳 Shipping Countrywide</span>
              <span>•</span>
              <span>Based in India</span>
              <span>•</span>
              <a href="https://instagram.com/hampers_4_you_by_tasdiqa" target="_blank" className="text-[#8B7355] flex items-center gap-1.5 hover:underline">
                <Instagram className="w-3.5 h-3.5" /> @hampers_4_you_by_tasdiqa
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TRUSTED TESTIMONIALS SLIDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center space-y-2 mb-10">
          <h3 className="font-serif text-3xl font-bold text-white tracking-wider">Words from Our Coordinated Brides</h3>
          <p className="font-sans text-xs text-stone-400">Real evaluations taken from our Instagram feedback columns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-[#122414] rounded-2xl border border-[#8B7355]/35 p-6 flex flex-col justify-between shadow-md hover:shadow-lg hover:border-[#8B7355]/60 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-[#8B7355] text-sm">★</span>
                  ))}
                </div>
                <p className="font-sans text-xs italic text-stone-300 leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#8B7355]/15 mt-5 flex items-center justify-between">
                <div>
                  <span className="block font-serif text-sm font-bold text-[#8B7355]">{t.name}</span>
                  <span className="font-sans text-[10px] text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8B7355]" /> {t.location}
                  </span>
                </div>
                <span className="text-[9px] font-sans uppercase font-bold text-stone-300 tracking-widest bg-stone-900/40 px-2 py-0.5 rounded border border-stone-800">
                  {t.itemsPurchased}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED FAQs */}
      <section className="bg-[#0a0f0a] border-t border-[#8B7355]/25 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-1 mb-10">
            <h3 className="font-serif text-3xl font-bold text-white tracking-wider">Polite Curation Guidelines</h3>
            <p className="font-sans text-xs text-stone-400">Important answers to clear design and workflow questions.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, k) => (
              <div key={k} className="p-5 rounded-2xl bg-[#122413] border border-[#8B7355]/25 shadow-inner">
                <h4 className="font-serif text-base font-bold text-[#8B7355] mb-2">
                  {faq.question}
                </h4>
                <p className="font-sans text-xs md:text-sm text-stone-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER WIDGET */}
      <footer className="max-w-5xl mx-auto px-4 pt-10 border-t border-[#8B7355]/20 text-center font-sans space-y-4">
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-serif text-xl tracking-widest font-bold text-white">HAMPERS_4_YOU</h2>
          <p className="text-[10px] uppercase text-[#8B7355] tracking-widest font-bold">handcrafted with botanical love by Tasdiqa</p>
        </div>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Preserving precious wedding garlands, framing holy Nikah contracts, and curating royal brass engagement platters across India since inception.
        </p>
        <p className="text-[9px] uppercase tracking-widest text-stone-500 pt-4">
          © 2026 HAMPERS_4_YOU, Tasdiqa. Direct Client Workspace. All rights reserved.
        </p>
      </footer>

      {/* 8. PRODUCT SPECIFIC DETAILS POPUP MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black"
            />

            {/* Popup Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#F8F9F5] rounded-3xl overflow-hidden border-2 border-[#8B7355] shadow-2xl grid grid-cols-1 md:grid-cols-2 z-10"
            >
              {/* Left Picture */}
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#4A5D23] text-white font-sans text-[10px] tracking-wider uppercase font-semibold py-1 px-3 rounded-full">
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </div>
                {/* Wishlist toggle button inside modal */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="absolute top-3 right-3 bg-black/60 border border-[#8B7355]/50 p-2 rounded-full hover:bg-black/80 active:scale-95 transition-all duration-300 text-[#8B7355] shadow-lg cursor-pointer flex items-center justify-center z-10"
                  title={isWishlisted(selectedProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 transition-transform duration-300 active:scale-125 ${isWishlisted(selectedProduct.id) ? "fill-[#8B7355] text-[#8B7355]" : "text-stone-300 hover:text-white"}`} />
                </button>
              </div>

              {/* Right configs */}
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#8B7355] block">
                        Custom {selectedProduct.category.replace("-", " ")}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                        {selectedProduct.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-1 rounded-full bg-[#F2F4EF]/30 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-sans text-xs text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-1 pt-1.5 border-t border-[#8B7355]/20">
                    <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-[#7C6E6A]">Premium Inclusions</span>
                    <ul className="text-xs font-sans text-gray-600 list-inside list-disc space-y-0.5">
                      {selectedProduct.details.map((dt, j) => (
                        <li key={j}>{dt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, "Default Initial Settings Curing");
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-[#4A5D23] text-white py-2.5 rounded-xl font-serif text-sm font-semibold hover:bg-emerald-950 transition cursor-pointer flex items-center justify-center gap-2 border border-[#8B7355]"
                  >
                    Lock Booking Slot
                  </button>
                  <p className="text-[10px] font-sans text-center text-[#7C6E6A]">
                    🔒 All orders verified. Pre-payment via WhatsApp verified slots.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WISHLIST DRAWER BOX */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Cabinet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#F8F9F5] shadow-2xl h-full flex flex-col border-l border-[#8B7355]/25 z-10"
            >
              {/* Wishlist Header */}
              <div className="p-4 bg-white border-b border-[#8B7355]/20 flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#4A5D23] fill-[#4A5D23]" /> Gilded Wishlist ({wishlist.length})
                </span>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wishlist List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-24 text-gray-400 font-sans text-xs space-y-3 px-6">
                    <Heart className="w-10 h-10 text-[#8B7355]/50 mx-auto animate-pulse" />
                    <p className="font-serif text-sm font-semibold text-gray-700">Wishlist is empty</p>
                    <p className="text-stone-500 max-w-xs mx-auto">
                      Explore our handcrafted wedding garlands, resin preservations, and hampers to save your favorite treasures.
                    </p>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setActiveTab("catalog");
                        setTimeout(() => {
                          const el = document.getElementById("catalog-anchor-main");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          } else {
                            window.scrollTo({ top: 400, behavior: "smooth" });
                          }
                        }, 50);
                      }}
                      className="bg-[#4A5D23] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold hover:bg-[#122413] transition-all border border-[#8B7355]/20 mt-4 cursor-pointer"
                    >
                      Breathe in Collection ⚜️
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlist.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex gap-3 bg-white p-3.5 rounded-2xl border border-[#8B7355]/20 relative shadow-sm hover:border-[#8B7355]/40 transition duration-300"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-xl bg-gray-100 shrink-0 border border-[#8B7355]/10"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-[#8B7355]">
                            {prod.category.replace("-", " ")}
                          </span>
                          <h4 className="font-serif font-black text-xs text-gray-900 leading-snug truncate">
                            {prod.name}
                          </h4>
                          <span className="font-sans text-[11px] font-bold text-[#4A5D23] block">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </span>

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => {
                                // Add to cart
                                const cartItem = cart.find(c => c.product.id === prod.id);
                                if (cartItem) {
                                  // Increase quantity
                                  setCart(cart.map(c => c.product.id === prod.id ? { ...c, qty: c.qty + 1 } : c));
                                } else {
                                  setCart([...cart, { product: prod, qty: 1, customText: "Wishlist Curation" }]);
                                }
                                setIsCartOpen(true);
                                setIsWishlistOpen(false);
                              }}
                              className="text-[10px] font-sans font-bold text-white bg-[#4A5D23] hover:bg-[#1E3B20] border border-[#8B7355]/35 py-1 px-3 rounded-lg transition duration-300 cursor-pointer"
                            >
                              Preorder Piece
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod)}
                              className="text-[10px] font-sans font-semibold text-red-500 hover:text-red-700 transition cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. CART DRAWER BOX */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Cabinet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#F8F9F5] shadow-2xl h-full flex flex-col border-l border-[#8B7355]/25 z-10"
            >
              {/* Cart Header */}
              <div className="p-4 bg-white border-b border-[#8B7355]/20 flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#4A5D23]" /> Crate Cart ({cart.reduce((a,c) => a+c.qty, 0)})
                </span>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-gray-300 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 font-sans text-xs space-y-2">
                    <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                    <p>Your custom hamper cart is empty.</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 bg-white p-3 rounded-xl border border-[#8B7355]/20 relative"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-serif font-bold text-xs text-gray-900 leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="font-sans text-[11px] font-semibold text-emerald-800">
                            ₹{item.product.price.toLocaleString("en-IN")}
                          </span>

                          {/* Custom Text Option */}
                          <div className="pt-1.5">
                            <label className="text-[9px] font-sans text-[#7C6E6A] uppercase block font-semibold">
                              Custom Text / Initials
                            </label>
                            <input
                              type="text"
                              value={item.customText}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCart(
                                  cart.map((c) =>
                                    c.product.id === item.product.id
                                      ? { ...c, customText: val }
                                      : c
                                  )
                                );
                              }}
                              placeholder="e.g. Alisha wedding 12/9"
                              className="w-full bg-[#F2F4EF]/30 border border-[#8B7355]/15 rounded py-0.5 px-2 text-[10px] focus:outline-none"
                            />
                          </div>

                          {/* Qty count control */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 border border-gray-100 rounded-lg p-0.5 max-w-max">
                              <button
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="p-1 hover:bg-gray-50 rounded"
                              >
                                <Minus className="w-3 h-3 text-gray-500" />
                              </button>
                              <span className="font-sans text-xs px-2 font-bold text-gray-700">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="p-1 hover:bg-gray-50 rounded"
                              >
                                <Plus className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[10px] font-semibold text-red-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-4 bg-white border-t border-[#8B7355]/20 space-y-4">
                  <div className="flex justify-between items-center text-sm font-sans">
                    <span className="text-gray-400 font-semibold uppercase text-xs">Preorder Est. Price</span>
                    <span className="font-serif font-black text-lg text-gray-900">
                      ₹{calculateTotal().toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Preorder details */}
                  <form onSubmit={handleCheckoutInquiry} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Brides/Grooms Full Name"
                        value={plannerName}
                        onChange={(e) => setPlannerName(e.target.value)}
                        className="w-full bg-[#F8F9F5] text-xs px-3 py-2 rounded-lg border border-[#8B7355]/20"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp (Direct Booking)"
                        value={plannerPhone}
                        onChange={(e) => setPlannerPhone(e.target.value)}
                        className="w-full bg-[#F8F9F5] text-xs px-3 py-2 rounded-lg border border-[#8B7355]/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-sans block mb-1 uppercase font-bold">Event Date (Minimum 2 months early)</label>
                      <input
                        type="date"
                        required
                        value={plannerDate}
                        onChange={(e) => setPlannerDate(e.target.value)}
                        className="w-full bg-[#F8F9F5] text-xs px-3 py-2 rounded-lg border border-[#8B7355]/20"
                      />
                    </div>

                    {plannerDate && (
                      <div className={`p-2.5 rounded-lg text-[11px] font-sans border ${
                        isDateAdvanceOk(plannerDate)
                          ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                          : "bg-[#FFF0EF] text-red-800 border-red-100 font-bold"
                      }`}>
                        {isDateAdvanceOk(plannerDate) 
                          ? "✅ 2 Months advance verified!" 
                          : "⚠️ Rush Order! Approved only on slot availability."}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#4A5D23] text-white py-3 rounded-xl font-serif text-sm font-bold border border-[#8B7355] hover:bg-emerald-950 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      Book 2 Months Advance Curation
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. BOOKING INQUIRY SUCCESS CONFIRMATION POPUP */}
      <AnimatePresence>
        {isSubmitSuccess && createdBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitSuccess(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Popup Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 border-4 border-[#8B7355] text-center space-y-5 z-10 shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block">
                  Curation Spot Secured
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-wider text-gray-900 leading-snug">
                  Mubarak! Slot Pre-Register Completed
                </h3>
                <p className="font-sans text-xs text-gray-550 max-w-xs mx-auto leading-relaxed">
                  Your inquiry <strong>{createdBooking.id}</strong> has been successfully registered to the verified calendar!
                </p>
              </div>

              {/* Details table snippet */}
              <div className="bg-[#F2F4EF]/40 p-4 rounded-2xl border border-[#8B7355]/15 text-left font-sans text-xs text-[#524442] space-y-1">
                <p><strong>Name:</strong> {createdBooking.customerName}</p>
                <p><strong>Occasion:</strong> {createdBooking.eventType}</p>
                <p><strong>Proposed Date:</strong> {new Date(createdBooking.eventDate).toLocaleDateString("en-IN")}</p>
                <p className="pt-2 border-t border-[#8B7355]/10 flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Pre-Estimator Total:</span> 
                  <span>₹{createdBooking.totalPrice.toLocaleString("en-IN")}</span>
                </p>
              </div>

              {/* UPI INTEGRATED PAYMENT GATEWAY COMPONENT */}
              <div className="bg-gradient-to-b from-[#112213] to-[#0A150B] rounded-2xl p-4 border-2 border-[#8B7355] text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-sm">🪙</span>
                    <span className="font-serif font-bold text-[10px] tracking-wider uppercase text-[#8B7355]">
                      Merchant UPI Payment Gateway
                    </span>
                  </div>
                  <span className="text-[7px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                    DIRECT TRANSFER
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-300 font-sans">Merchant UPI ID:</span>
                    <span className="font-mono font-bold text-[#8B7355] tracking-wide select-all text-xs">{storeUpiId}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-300 font-sans">Curation Amount:</span>
                    <span className="font-serif font-black text-xs text-[#8B7355]">₹{createdBooking.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-1.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(storeUpiId);
                      setIsUpiCopied(true);
                      setTimeout(() => setIsUpiCopied(false), 2500);
                    }}
                    className="bg-[#4A5D23] hover:bg-emerald-900 text-white font-sans text-[10px] font-bold py-1.5 px-3 rounded-lg border border-[#8B7355]/50 transition cursor-pointer"
                  >
                    {isUpiCopied ? "✨ UPI ID Copied!" : "📋 Copy UPI Address"}
                  </button>
                  <a
                    href={`upi://pay?pa=${storeUpiId}&pn=Tasdiqa%20Atelier&am=${createdBooking.totalPrice}&cu=INR&tn=Order_${createdBooking.id}`}
                    className="bg-transparent hover:bg-white/5 text-[#8B7355] font-sans text-[10px] font-black py-1.5 px-3 rounded-lg border border-[#8B7355]/50 transition flex items-center justify-center gap-1"
                  >
                    ⚡ Open UPI App
                  </a>
                </div>
              </div>

              {/* WHATSAPP & INSTAGRAM ORDERING ROUTING */}
              <div className="space-y-1.5 text-left">
                <span className="block text-[9px] font-sans font-black text-[#7C6E6A] uppercase tracking-wider">
                  Contact live socials to finalize options:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${storeWhatsapp.replace(/\+/g, "").replace(/\s/g, "").replace(/-/g, "")}?text=${encodeURIComponent(
                      `Assalamu Alaikum! I just registered my Atelier Order Slot.\n\n⚜️ Booking ID: ${createdBooking.id}\n👤 Guest Name: ${createdBooking.customerName}\n💐 Event: ${createdBooking.eventType}\n✨ Slot Date: ${createdBooking.eventDate}\n💍 Estimate Total: ₹${createdBooking.totalPrice.toLocaleString("en-IN")}\n\nPlease confirm my luxury hampers slot!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-emerald-600 text-white font-sans text-[10px] font-black py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow"
                  >
                    💬 Order on WhatsApp
                  </a>

                  <a
                    href={`https://instagram.com/${storeInstagram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white font-sans text-[10px] font-black py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow"
                  >
                    📸 Order on Instagram
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsSubmitSuccess(false)}
                  className="w-full bg-[#4A5D23] text-white py-2.5 rounded-xl text-xs font-serif font-semibold hover:bg-[#323A27] transition cursor-pointer"
                >
                  Verify slots & Close Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT AI ASSISTANT CONCIERGE */}
      <AIConsultant />

    </div>
  );
}

// Helpers
function scrollIntoSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
