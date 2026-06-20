/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, CategoryInfo, Testimonial, FAQ } from "./types";

export const CATEGORIES: CategoryInfo[] = [
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

export const PRODUCTS: Product[] = [
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

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Zoya Siddiqui",
    location: "Mumbai",
    text: "I am speechless! The Nikah Certificate with flower preservation in white wood looks incredibly premium, like a museum centerpiece. Tasdiqa is an absolute angel to work with. She answered all my custom script alterations patiently.",
    rating: 5,
    itemsPurchased: "Preserved Floral Border Nikah Frame",
    date: "1 month ago"
  },
  {
    id: "t-2",
    name: "Farhan Malik",
    location: "Hyderabad",
    text: "We ordered the Mirror Octagonal Ring Platter. The gold mirrors reflect the details perfectly, and the geometrics are so clean. If you are a bride/groom, book at least 2 months early just like they recommend; they are fully booked for a reason! Shipping is totally safe too.",
    rating: 5,
    itemsPurchased: "Golden Aura Octagon Mirror Platter",
    date: "2 months ago"
  },
  {
    id: "t-3",
    name: "Meher Kapoor",
    location: "Delhi",
    text: "Truly premium craftsmanship. No comparison with generic market resellers who charge double. Creating the custom baby video scroll was so smooth, my entire family loved the instrumental sitar background music. Thank you Tasdiqa!",
    rating: 5,
    itemsPurchased: "Whimsical Watercolor Baby Invite Video",
    date: "3 weeks ago"
  }
];

export const FAQS: FAQ[] = [
  {
    question: "Why should I book my order at least 2 months in advance?",
    answer: "Every order is handcrafted individually by Tasdiqa from scratch. Flower preservation requires dynamic drying ovens, while resin castings take multiple thin layer curing sessions (each taking 24-48 hours) to prevent microbubbles and ensure timeless clarity. Booking early guarantees a spot in our crafting calendar."
  },
  {
    question: "How do I send my wedding garlands or flowers for preservation?",
    answer: "Once your order is registered and confirmed, we will share overnight courier instructions. Flowers should be wrapped lightly in newspaper (never plastic) and packed securely inside a cardboard container. They should ideally reach our workshop within 24 to 48 hours of the event."
  },
  {
    question: "Are rescuers or resellers allowed to book orders?",
    answer: "In order to maintain authentic pricing, premium quality controls, and a direct human connection, we follow a strict 'No Resellers allowed' policy. We only work directly with the final buyers (brides, grooms, guardians, or parents) so that each detail aligns seamlessly with their dreams."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship all across India (🇮🇳). Our premium wooden frames, glass certificates, and clocks are packed inside shockproof thick custom plywood crates with thermocol liners to guarantee zero breakage during travel."
  },
  {
    question: "How do I pay and finalize my customized design?",
    answer: "You can use our in-app Planner on the webpage to customize your selections. When you submit your pre-order request, we will review the details and event date. Tasdiqa or her assistant will then text you on WhatsApp within 24 hours to clarify calls, share background options, and provide UPI/Bank payment details."
  }
];
