import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Master configurations for payment and direct checkout contacts
const customSettings = {
  upiId: "tanishq77@ybl",
  whatsappNumber: "+919876543210",
  instagramId: "tasdiqa_atelier"
};

// In-memory store for categories with beautiful default image URLs
const categories: any[] = [
  {
    id: "all",
    title: "All Collections",
    description: "Browse our entire boutique suite of bespoke celebration articles and memories.",
    badge: "Exclusive",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=300&auto=format&fit=crop",
    iconName: "Sparkles"
  },
  {
    id: "ring-platters",
    title: "Ring Platters",
    description: "Bespoke mirrors, velvets, and floral meadows designed to hold your sacred vows.",
    badge: "Most Loved",
    imageUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=300&auto=format&fit=crop",
    iconName: "Disc"
  },
  {
    id: "nikah-certificates",
    title: "Nikah Certified Frames",
    description: "Artisanal Urdu calligraphy certificates with glass frames and dried floral frames.",
    badge: "Traditional",
    imageUrl: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=300&auto=format&fit=crop",
    iconName: "FileText"
  },
  {
    id: "luxury-hampers",
    title: "Royal Gift Hampers",
    description: "Curated wooden trunks and slider boxes for bridesmaids, parents, and baby greetings.",
    badge: "Luxury Trunks",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd40?q=80&w=300&auto=format&fit=crop",
    iconName: "Gift"
  },
  {
    id: "announcements",
    title: "Baby Announcements",
    description: "Bespoke digital keepsake videos and interactive floral scrolls sharing your joy.",
    badge: "Dynamic",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?q=80&w=300&auto=format&fit=crop",
    iconName: "Video"
  },
  {
    id: "preservations",
    title: "Eternity Preservation",
    description: "Preserve wedding garlands in exquisite resin clocks, trays & plates (Tribute/Inspired).",
    badge: "Lifetime",
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop",
    iconName: "Clock"
  }
];

// In-memory store for orders and custom inquiries
const inquiries: any[] = [
  {
    id: "H4Y-8291",
    customerName: "Aisha Rehman",
    phone: "+91 98765 43210",
    email: "aisha@rehman.com",
    eventType: "Nikah Ceremony",
    eventDate: "2026-08-15",
    items: [
      { category: "Nikah Certificate", qty: 1, text: "Aisha & Zayan - August 15" }
    ],
    totalPrice: 4200,
    status: "Confirmed (Advance Paid)",
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
  },
  {
    id: "H4Y-9014",
    customerName: "Rohan Khanna",
    phone: "+91 91234 56789",
    email: "rohan@khanna.org",
    eventType: "Engagement Ring Platter",
    eventDate: "2026-09-02",
    items: [
      { category: "Ring Platter", qty: 1, text: "Rohan & Meera's Platters" }
    ],
    totalPrice: 5500,
    status: "Awaiting Flowers",
    createdAt: new Date().toISOString()
  }
];

// In-memory store for Royal Sangeet Songs
const sangeetSongs: any[] = [
  {
    id: "song-synth-1",
    title: "Santoor & Sitar Royal Raga",
    artist: "Heritage Classical Synth Drone",
    isCustomSynth: true
  },
  {
    id: "song-1",
    title: "Celestial Sitar Devotional",
    artist: "Sitars of India Ensemble",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "song-2",
    title: "Himalayan Bansuri Flute",
    artist: "Mystic Flutes of Kashmir",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "song-3",
    title: "Shahnai Wedding Mangal Dhun",
    artist: "Varanasi Heritage Players",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

// In-memory store for Products
const products: any[] = [
  {
    id: "prod-1",
    name: "Classic Royal Velvet Ring Platter",
    category: "ring-platters",
    price: 4800,
    description: "A gorgeous circular velvet cushion platter resting on a warm wooden cedar base, surrounded by high-grade hand-arranged dried flowers in ivory and dusty rose tones.",
    details: [
      "Platter diameter: 10 inches",
      "Features two soft secure slots for wedding bands with brass holders",
      "Personalized center gold plaque with elegant names & vows engraving",
      "Adorned with real dried baby's breath, mini hydrangeas, and silk roses",
      "Stays pristine for years as an elegant vanity tray"
    ],
    imageUrl: "https://images.unsplash.com/photo-1595935736128-db120a27984c?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-2",
    name: "Golden Aura Octagon Mirror Platter",
    category: "ring-platters",
    price: 5600,
    description: "Modern octagonal acrylic base with a double mirror finish. Features geometric glass holders and premium moss-and-gold bedding for a clean, editorial luxury appearance.",
    details: [
      "Dimensions: 11 x 11 inches",
      "Choice of Rose Gold, Silver, or Champagne Gold mirror detailing",
      "Two matching mini glass pentagram boxes with gold-rim borders",
      "Preserved eucalyptus and white rose arrangements",
      "Personalized couple logo engraved with signature cursive lettering"
    ],
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    isPopular: false
  },
  {
    id: "prod-3",
    name: "Gul-o-Ghar Watercolor Nikah Certificate",
    category: "nikah-certificates",
    price: 4200,
    description: "A traditional Urdu hand-painted Nikah certificate. Hand-lettered with premium gold inks on heavyweight cotton paper, surrounded by elegant watercolor washes.",
    details: [
      "Certificate size: A3 size (11.7 x 16.5 inches)",
      "Premium 300GSM acid-free archival cotton paper",
      "Handwritten names using traditional Bamboo Qalam/Pen",
      "Gold leaf accents on the borders for a subtle royal shine",
      "Shipped in an elegant protective cream sleeve"
    ],
    imageUrl: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-4",
    name: "Preserved Floral Border Nikah Frame",
    category: "nikah-certificates",
    price: 6800,
    description: "The ultimate Nikah keepsake. A gorgeous Urdu contract encased within double glass panes, framed by beautifully preserved actual flowers like roses, wax flowers, and dried ferns.",
    details: [
      "Custom premium white wood or gold metal molding frame",
      "Real dried flowers carefully arranged, mimicking a miniature garden meadow",
      "Dimensions: 14 x 18 inches",
      "Acid-free double glazing for long term floral preservation",
      "Custom text edits allowed in English and Urdu transcripts"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-9",
    name: "Imperial Gilded Jahangiri Contract",
    category: "nikah-certificates",
    price: 9500,
    description: "Inspired by Mughal courthouse manuscripts. Crafted with deep emerald borders, handmade indigo inks, and extensive double-weight 24k gold foil gilding around the signature fields.",
    details: [
      "Museum-grade preservation glass with built-in UV shelter",
      "Authentic Arabic calligraphy borders customized with your dates",
      "Accompanied by a premium customized royal wax-seal kit",
      "Hand-signed by the traditional veteran calligrapher",
      "Housed in a luxury vintage teak-molded heavy casing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-5",
    name: "Maharani Rigid Ivory Baby Hampers",
    category: "luxury-hampers",
    price: 8500,
    description: "Announce your little one's arrival with true prestige. An exquisite set of matching rigid boxes curated with artisanal candies, premium scrolls, and sweet fragrances.",
    details: [
      "Trunks constructed in thick textured ivory bookboard with golden metal keys",
      "Custom name scroll with handwritten calligraphy detailing the family line",
      "Contains: 1 Jar Rose Pistachio Honey, 1 customized copper-poured scented candle",
      "4 pieces of customized gourmet date-and-nut energy bars",
      "Delivered with coordinate silk ribbons and personalized tags"
    ],
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd40?q=80&w=600&auto=format&fit=crop",
    isPopular: false
  },
  {
    id: "prod-6",
    name: "Blossom Peony Bride-to-Be Trunk",
    category: "luxury-hampers",
    price: 11200,
    description: "An elegant, keepsake wooden trunk painted with delicate spring flowers and overflowing with premium self-care goodies for your beloved bride-to-be companion.",
    details: [
      "Handmade sturdy pine wood trunk, pastel-washed with brass clasps",
      "Personalized soft silk bridal robe (custom size & glitter vinyl printing)",
      "Premium customizable ceramic coffee mug with gold wire handle closeups",
      "Satin silk eye mask + coordinates sleep mist sachet",
      "An adorable matching bouquet of artificial blush hydrangea"
    ],
    imageUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-7",
    name: "Whimsical Watercolor Baby Invite Video",
    category: "announcements",
    price: 2500,
    description: "Skip static cards and invite guests using a fully customized video card. Features handpainted animations, serene ambient instrumentals, and beautiful family slideshow segments.",
    details: [
      "Duration: 45 - 60 seconds",
      "Includes 3 revisions for date, photographs, and event text adjustments",
      "Background music can be changed to any custom sitar/piano piece",
      "Delivered in Full HD 1080p MP4 format suitable for WhatsApp & Instagram",
      "Turnaround time: 7 working days"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eb2?q=80&w=600&auto=format&fit=crop",
    isPopular: false
  },
  {
    id: "prod-8",
    name: "Signature Eternity Garland Resin Clock",
    category: "preservations",
    price: 13500,
    description: "An incredibly high-end resin piece. Send us your actual wedding garlands (varmala) or bridal bouquet, and we will dry, preserve, and mount them inside an active 12-inch wall clock with luxury gold markers.",
    details: [
      "Diameter: 12 inches, high-grade crystal-clear non-yellowing resin",
      "Quiet, premium quartz movement with luxury metallic golden hands",
      "Bespoke floral layout based on your design wishes (dense pattern, ring border, etc.)",
      "Required: Garlands to be couriered to our workshop within 36 hours of the wedding",
      "Requires 6-8 weeks of careful dehydrating and solidifying for absolute timelessness"
    ],
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  },
  {
    id: "prod-10",
    name: "Imperial Brass Tray Varmala Casting",
    category: "preservations",
    price: 15800,
    description: "Our grandest preservation layout. Your sacred wedding roses and jasmines preserved in a heavy double-casted crystal tray bounded by authentic, high-gauge gold-plated solid brass handles.",
    details: [
      "Size: 16 x 10 inches royal oval serving platter shape",
      "Features beautiful handcrafted scalloped vintage brass frames",
      "Equipped with protective silicon heat preservation cushions underlaid",
      "Accommodates up to four complete heavy garlands cleanly",
      "Each tray features a customized gold lacquer monogram plate"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    isPopular: true
  }
];

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY missing. AI features will run with fallback recommendations.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
}

// 0. Configuration Settings API
app.get("/api/settings", (req, res) => {
  res.json({ success: true, data: customSettings });
});

app.post("/api/settings", (req, res) => {
  const { upiId, whatsappNumber, instagramId } = req.body;
  if (upiId !== undefined) customSettings.upiId = String(upiId).trim();
  if (whatsappNumber !== undefined) customSettings.whatsappNumber = String(whatsappNumber).trim();
  if (instagramId !== undefined) customSettings.instagramId = String(instagramId).trim();
  res.json({ success: true, message: "Atelier back-office configuration updated!", data: customSettings });
});

// 1. Booking & Order Inquiries API
app.get("/api/bookings", (req, res) => {
  res.json({ success: true, count: inquiries.length, data: inquiries });
});

app.post("/api/bookings", (req, res) => {
  const { customerName, phone, email, eventType, eventDate, items, customNotes, totalPrice } = req.body;
  
  if (!customerName || !eventType || !eventDate) {
    return res.status(400).json({ success: false, error: "Missing required fields (customerName, eventType, eventDate)" });
  }

  // Basic validation that eventDate is at least 2 months in advance
  const event = new Date(eventDate);
  const now = new Date();
  const diffTime = Math.abs(event.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isAdvanceOk = diffDays >= 60;

  const newInquiry = {
    id: `H4Y-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    phone: phone || "",
    email: email || "",
    eventType,
    eventDate,
    items: items || [],
    customNotes: customNotes || "",
    totalPrice: totalPrice || 0,
    isAdvanceOk,
    status: isAdvanceOk ? "Pending Verification" : "Alert: Urgent Order (Approval Pending)",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  res.status(201).json({ success: true, message: "Inquiry registered successfully! We have received your order request.", data: newInquiry });
});

app.put("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const index = inquiries.findIndex(p => p.id === bookingId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Booking/Inquiry not found" });
  }

  const { status, totalPrice, customerName, phone, email, eventType, eventDate, customNotes } = req.body;
  
  inquiries[index] = {
    ...inquiries[index],
    status: status !== undefined ? status : inquiries[index].status,
    totalPrice: totalPrice !== undefined ? Number(totalPrice) : inquiries[index].totalPrice,
    customerName: customerName !== undefined ? customerName : inquiries[index].customerName,
    phone: phone !== undefined ? phone : inquiries[index].phone,
    email: email !== undefined ? email : inquiries[index].email,
    eventType: eventType !== undefined ? eventType : inquiries[index].eventType,
    eventDate: eventDate !== undefined ? eventDate : inquiries[index].eventDate,
    customNotes: customNotes !== undefined ? customNotes : inquiries[index].customNotes
  };

  res.json({ success: true, message: "Booking inquiry updated successfully!", data: inquiries[index] });
});

app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const index = inquiries.findIndex(p => p.id === bookingId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Booking/Inquiry not found" });
  }

  const deleted = inquiries.splice(index, 1);
  res.json({ success: true, message: "Booking inquiry removed from archives permanently.", data: deleted[0] });
});

// Products Dynamic CRUD API
app.get("/api/products", (req, res) => {
  res.json({ success: true, data: products });
});

app.post("/api/products", (req, res) => {
  const { name, category, price, description, details, imageUrl, isPopular } = req.body;
  if (!name || !category || !price || !imageUrl) {
    return res.status(400).json({ success: false, error: "name, category, price and imageUrl are required" });
  }

  const newProduct = {
    id: `prod-${Math.floor(Date.now() + Math.random() * 1000)}`,
    name,
    category,
    price: Number(price),
    description,
    details: Array.isArray(details) ? details : [details],
    imageUrl,
    isPopular: !!isPopular
  };

  products.push(newProduct);
  res.status(201).json({ success: true, message: "Product added to the atelier shelves!", data: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const prodId = req.params.id;
  const index = products.findIndex(p => p.id === prodId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  const { name, category, price, description, details, imageUrl, isPopular } = req.body;

  products[index] = {
    ...products[index],
    name: name !== undefined ? name : products[index].name,
    category: category !== undefined ? category : products[index].category,
    price: price !== undefined ? Number(price) : products[index].price,
    description: description !== undefined ? description : products[index].description,
    details: details !== undefined ? (Array.isArray(details) ? details : [details]) : products[index].details,
    imageUrl: imageUrl !== undefined ? imageUrl : products[index].imageUrl,
    isPopular: isPopular !== undefined ? !!isPopular : products[index].isPopular
  };

  res.json({ success: true, message: "Product updated on the atelier shelves!", data: products[index] });
});

app.delete("/api/products/:id", (req, res) => {
  const prodId = req.params.id;
  const index = products.findIndex(p => p.id === prodId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  const deleted = products.splice(index, 1);
  res.json({ success: true, message: "Product retired from the atelier shelves.", data: deleted[0] });
});

// Categories Dynamic CRUD API
app.get("/api/categories", (req, res) => {
  res.json({ success: true, data: categories });
});

app.post("/api/categories", (req, res) => {
  const { id, title, description, badge, imageUrl, iconName } = req.body;
  if (!id || !title || !imageUrl) {
    return res.status(400).json({ success: false, error: "id, title and imageUrl are required" });
  }

  // Format the ID safely
  const formattedId = id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  
  // Check duplicates
  if (categories.some(c => c.id === formattedId)) {
    return res.status(400).json({ success: false, error: "Category ID already exists" });
  }

  const newCategory = {
    id: formattedId,
    title,
    description: description || "",
    badge: badge || "",
    imageUrl,
    iconName: iconName || "Sparkles"
  };

  categories.push(newCategory);
  res.status(201).json({ success: true, message: "Category added successfully!", data: newCategory });
});

app.put("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const index = categories.findIndex(c => c.id === categoryId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Category not found" });
  }

  const { title, description, badge, imageUrl, iconName } = req.body;
  
  categories[index] = {
    ...categories[index],
    title: title || categories[index].title,
    description: description !== undefined ? description : categories[index].description,
    badge: badge !== undefined ? badge : categories[index].badge,
    imageUrl: imageUrl || categories[index].imageUrl,
    iconName: iconName || categories[index].iconName
  };

  res.json({ success: true, message: "Category updated successfully!", data: categories[index] });
});

app.delete("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const index = categories.findIndex(c => c.id === categoryId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Category not found" });
  }

  // Do not delete 'all'
  if (categoryId === "all") {
    return res.status(400).json({ success: false, error: "The standard 'All Collections' category cannot be deleted." });
  }

  const deleted = categories.splice(index, 1);
  res.json({ success: true, message: "Category deleted successfully!", data: deleted[0] });
});

// Sangeet Songs CRUD API
app.get("/api/songs", (req, res) => {
  res.json({ success: true, data: sangeetSongs });
});

app.post("/api/songs", (req, res) => {
  const { title, artist, url, isCustomSynth } = req.body;
  
  if (!title || !artist) {
    return res.status(400).json({ success: false, error: "Title and Artist are required" });
  }

  const newSong = {
    id: `song-${Math.floor(Date.now() + Math.random() * 1000)}`,
    title,
    artist,
    url: url || "",
    isCustomSynth: !!isCustomSynth
  };

  sangeetSongs.push(newSong);
  res.status(201).json({ success: true, message: "Gilded Sangeet track added successfully!", data: newSong });
});

app.delete("/api/songs/:id", (req, res) => {
  const songId = req.params.id;
  const index = sangeetSongs.findIndex(s => s.id === songId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Sangeet song not found" });
  }

  if (songId === "song-synth-1") {
    return res.status(400).json({ success: false, error: "The default Heritage Classical Synth Drone must not be deleted." });
  }

  const deleted = sangeetSongs.splice(index, 1);
  res.json({ success: true, message: "Sangeet track removed from the active repertoire.", data: deleted[0] });
});

// 2. Core Gemini AI personalized assistant endpoint
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  const systemInstruction = `You are "Tasdiqa's Luxury Hamper & Gifting Concierge", the exclusive virtual consultant for HAMPERS_4_YOU website.
Your tone is incredibly warm, elegant, polite, and representative of premium royal Indian gifting hospitality (Tehzeeb/Adab).
You specialize in helping clients design the perfect custom items for three key categories:
1. Custom Ring Platters (Elegant flower-adorned acrylic/wooden platters for holding engagement/nikah rings).
2. Framed Nikah Certificates (Hand-painted or premium gold embossed certificates with real dried flower pressings / custom wood or glass frames).
3. Luxury Gift Hampers (Custom curated wooden slider boxes, leather trunks, and theme-coordinated gifts for baby announcements, bridesmaids, or festivals).
4. Baby Announcement Digital video invites.

Crucial guidelines for options:
- Since everything is custom, we must book orders at least 2 months in advance.
- Direct delivery/shipping is available India-wide (🇮🇳).
- We follow a strict 'No Resellers' policy (direct to brides/grooms/parents with genuine craft pricing).
- Keep formatting beautiful and easy to read. Suggest exact items (e.g. choice of dried red roses, baby's breath, lavender detailing, glass engraving, and gold leafing).
- Invite them to start a pre-order in our custom estimator on the left, or finalize by booking 2 months early.
- Keep the response response size elegant, warm, and highly structured with bullet points.`;

  if (!ai) {
    // Elegant fallback recommendations if API key is not present
    const fallbackAnswers = [
      "Welcome to HAMPERS_4_YOU. I would recommend our signature **Golden Aura Mirror Ring Platter** adorned with soft peach roses and pearls, paired with a custom calligraphed **Gold Embossed Nikah Certificate** framed in white wood with floral preservation. Since our creations are completely custom-molded, we suggest booking 2 months in advance to ensure the highest craft quality.",
      "Greetings! For high-end luxury hampers, our **Royal Velvet Trinket Box** curated with custom baby announcement invites, organic honey jars, dry fruit collections, and rose wax sachets is perfect. Shipping is available all across India.",
      "Certainly! Our custom preservation pieces (like wedding flower garlands encapsulated in wooden shadow boxes or resin floral plates) are built to endure. We'd love to adapt our themes to match your wedding color palette - whether it be royal emerald, dusty rose, or classic ivory. Feel free to use our Order Planner to submit an inquiry!"
    ];
    const item = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
    return res.json({ success: true, reply: item + "\n\n*(Note: AI simulation run due to placeholder setup. In active hosting, real-time customized proposals are fully simulated)*" });
  }

  try {
    const contents: any[] = [];
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((item: any) => {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }]
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to reach Gemini" });
  }
});

// Serve Vite Assets and configure single page application
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HAMPERS_4_YOU Server] running on http://localhost:${PORT}`);
  });
};

startServer();
