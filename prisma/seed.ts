// Phase 1 seed — all 16 sectors, products only for those with a known Indian export HS code.
// All data is clearly labeled as SAMPLE in the database (Product.isSample = true, Source.notes).
// Real trade statistics, supplier/buyer identities, and live market figures must not be
// fabricated; when added later, they will go through the same models with isSample = false
// and proper retrievalDate on the Source.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Sectors (all 16 from the spec) -----------------------------------------
const SECTORS = [
  {
    slug: "agriculture-food",
    name: "Agriculture & Food Products",
    description:
      "Spices, rice, tea, coffee, pulses, oilseeds, fresh and processed foods with strong global demand.",
    imageEmoji: "🌾",
    order: 10,
  },
  {
    slug: "handicrafts",
    name: "Handicrafts",
    description:
      "Handmade decorative, religious, and lifestyle products including metalware, woodcraft, pottery, and textiles-based crafts.",
    imageEmoji: "🪔",
    order: 20,
  },
  {
    slug: "textiles-apparel",
    name: "Textiles & Apparel",
    description:
      "Yarn, fabric, made-ups, and ready-made garments across cotton, silk, synthetics, and technical textiles.",
    imageEmoji: "🧵",
    order: 30,
  },
  {
    slug: "chemicals-pharma",
    name: "Chemicals & Pharmaceuticals",
    description:
      "Bulk chemicals, specialty chemicals, APIs, formulations, and intermediates serving global B2B buyers.",
    imageEmoji: "🧪",
    order: 40,
  },
  {
    slug: "engineering",
    name: "Engineering Products",
    description:
      "Capital goods, transmission towers, fasteners, pumps, valves, and fabricated metal products.",
    imageEmoji: "⚙️",
    order: 50,
  },
  {
    slug: "industrial-machinery",
    name: "Industrial Machinery",
    description:
      "Textile machinery, food processing machinery, packaging machinery, and machine tools.",
    imageEmoji: "🏭",
    order: 60,
  },
  {
    slug: "automotive-components",
    name: "Automotive Components",
    description:
      "Auto parts, components, and sub-assemblies serving OEM and aftermarket buyers worldwide.",
    imageEmoji: "🚗",
    order: 70,
  },
  {
    slug: "electronics-electrical",
    name: "Electronics & Electrical Products",
    description:
      "Consumer electronics, electrical equipment, components, and lighting products.",
    imageEmoji: "💡",
    order: 80,
  },
  {
    slug: "gems-jewellery",
    name: "Gems & Jewellery",
    description:
      "Cut and polished diamonds, coloured gemstones, gold and silver jewellery, and fashion jewellery.",
    imageEmoji: "💎",
    order: 90,
  },
  {
    slug: "leather",
    name: "Leather Products",
    description:
      "Finished leather, leather goods, footwear, garments, and accessories.",
    imageEmoji: "👜",
    order: 100,
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen Products",
    description:
      "Cookware, tableware, kitchen tools, home décor, and household textiles.",
    imageEmoji: "🍳",
    order: 110,
  },
  {
    slug: "furniture-lifestyle",
    name: "Furniture & Lifestyle Products",
    description:
      "Indoor and outdoor furniture, lifestyle accessories, and lifestyle décor products.",
    imageEmoji: "🪑",
    order: 120,
  },
  {
    slug: "natural-herbal",
    name: "Natural & Herbal Products",
    description:
      "Ayurvedic and herbal extracts, essential oils, and natural ingredients for food and personal care.",
    imageEmoji: "🌿",
    order: 130,
  },
  {
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description:
      "Cosmetics, personal care, skincare, hair care, and grooming products.",
    imageEmoji: "💄",
    order: 140,
  },
  {
    slug: "packaging",
    name: "Packaging Products",
    description:
      "Paper, plastic, biodegradable, and specialty packaging materials and products.",
    imageEmoji: "📦",
    order: 150,
  },
  {
    slug: "renewable-energy",
    name: "Renewable Energy Products",
    description:
      "Solar PV modules, wind components, bio-energy equipment, and energy-efficient products.",
    imageEmoji: "☀️",
    order: 160,
  },
] as const;

// --- Products (with Indian-export HS codes) --------------------------------
// Only sectors with a known HS-code set get products in Phase 1; the rest have
// sector shells ready for content in later phases.

type ProductSeed = {
  sectorSlug: string;
  categoryName: string;
  subcategoryName?: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  hsCode: string;
  indicativePriceUsd: string;
  capitalLevel: "Low" | "Medium" | "High";
  exportDemand: "Low" | "Medium" | "High" | "Very High";
  competition: "Low" | "Medium" | "High";
  applications: string[];
  typicalBuyers: string[];
  targetIndustries: string[];
  targetMarkets: string[];
};

const PRODUCTS: ProductSeed[] = [
  // --- Agriculture & Food ---
  {
    sectorSlug: "agriculture-food",
    categoryName: "Spices",
    subcategoryName: "Whole Spices",
    name: "Turmeric (Whole & Powder)",
    slug: "turmeric",
    shortDescription:
      "High-curcumin Indian turmeric, available as whole fingers or powder, widely used in food, nutraceutical and cosmetic industries.",
    longDescription:
      "Indian turmeric (Curcuma longa) is recognised globally for its curcumin content and vibrant colour. Major producing states include Telangana, Maharashtra, Tamil Nadu and Andhra Pradesh. Exports span whole fingers, split turmeric and ground powder for retail and industrial buyers.",
    hsCode: "0910.30",
    indicativePriceUsd: "USD 1.6 – 3.2 / kg (powder, FOB)",
    capitalLevel: "Low",
    exportDemand: "High",
    competition: "High",
    applications: ["Food seasoning", "Nutraceuticals", "Cosmetics", "Ayurvedic formulations", "Natural colourant"],
    typicalBuyers: ["Spice importers", "Food manufacturers", "Nutraceutical brands", "Cosmetic formulators"],
    targetIndustries: ["Food & Beverage", "Pharmaceuticals", "Cosmetics & Personal Care", "Ayurveda"],
    targetMarkets: ["USA", "UAE", "Bangladesh", "UK", "Germany", "Japan"],
  },
  {
    sectorSlug: "agriculture-food",
    categoryName: "Spices",
    subcategoryName: "Whole Spices",
    name: "Cumin Seeds",
    slug: "cumin-seeds",
    shortDescription:
      "Indian cumin seeds (jeera) used whole or ground, with strong demand across spice blends and processed foods.",
    longDescription:
      "India is the world's largest producer and exporter of cumin seeds. Gujarat and Rajasthan are the dominant producing regions. Exports are primarily whole dried seeds, with ground cumin and oleoresins as value-added variants.",
    hsCode: "0909.31",
    indicativePriceUsd: "USD 2.0 – 4.5 / kg (whole, FOB)",
    capitalLevel: "Low",
    exportDemand: "High",
    competition: "High",
    applications: ["Spice blends", "Curry powders", "Ready meals", "Pickled products", "Seasoning mixes"],
    typicalBuyers: ["Spice traders", "Food processors", "Wholesalers", "Private-label brands"],
    targetIndustries: ["Food & Beverage", "Foodservice", "Private-label retail"],
    targetMarkets: ["Vietnam", "USA", "UAE", "Bangladesh", "Saudi Arabia", "Mexico"],
  },
  {
    sectorSlug: "agriculture-food",
    categoryName: "Rice",
    subcategoryName: "Basmati",
    name: "Basmati Rice",
    slug: "basmati-rice",
    shortDescription:
      "Long-grain aromatic Basmati rice from the Indian subcontinent — a flagship Indian agricultural export.",
    longDescription:
      "Basmati rice is grown primarily in the Indo-Gangetic plains across Punjab, Haryana, UP and Uttarakhand. India is the dominant global exporter of Basmati, supplying both retail and foodservice buyers worldwide.",
    hsCode: "1006.30",
    indicativePriceUsd: "USD 700 – 1,400 / MT (FOB)",
    capitalLevel: "Medium",
    exportDemand: "Very High",
    competition: "High",
    applications: ["Retail rice packs", "Foodservice rice", "Ready-to-eat meals", "Rice mixes"],
    typicalBuyers: ["Rice importers", "Wholesalers", "Supermarket chains", "Foodservice distributors"],
    targetIndustries: ["Retail grocery", "Foodservice", "Hospitality"],
    targetMarkets: ["Saudi Arabia", "Iran", "UAE", "USA", "UK", "Yemen"],
  },
  {
    sectorSlug: "agriculture-food",
    categoryName: "Beverages",
    subcategoryName: "Tea",
    name: "Black Tea (CTC & Orthodox)",
    slug: "black-tea",
    shortDescription:
      "Indian black tea in CTC and orthodox grades for blending, retail packs, and foodservice.",
    longDescription:
      "India is among the world's top producers and exporters of black tea. Assam, West Bengal (Darjeeling), Tamil Nadu and Kerala are key producing regions. Exports cover CTC crush, orthodox leaf, and value-added tea bags.",
    hsCode: "0902.40",
    indicativePriceUsd: "USD 2.0 – 6.0 / kg (FOB, grade dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Tea blending", "Retail tea bags", "Foodservice", "Iced tea", "RTD beverages"],
    typicalBuyers: ["Tea importers", "Blenders", "Retail tea brands", "Foodservice distributors"],
    targetIndustries: ["Beverages", "Retail", "Foodservice"],
    targetMarkets: ["UAE", "UK", "Russia", "USA", "Kenya", "Iran", "Kazakhstan"],
  },
  {
    sectorSlug: "agriculture-food",
    categoryName: "Beverages",
    subcategoryName: "Coffee",
    name: "Green & Roasted Coffee",
    slug: "coffee",
    shortDescription:
      "Indian Arabica and Robusta green coffee beans, plus roasted and instant coffee for export markets.",
    longDescription:
      "India produces both Arabica and Robusta coffee, primarily in Karnataka, Kerala and Tamil Nadu. Indian coffee is largely exported as green beans, with growing exports of roasted and instant coffee for retail and HORECA buyers.",
    hsCode: "0901.11",
    indicativePriceUsd: "USD 3.0 – 8.0 / kg (green, FOB)",
    capitalLevel: "Medium",
    exportDemand: "Medium",
    competition: "Medium",
    applications: ["Roasting", "Instant coffee", "Specialty coffee", "HORECA", "RTD coffee"],
    typicalBuyers: ["Coffee importers", "Roasters", "Instant coffee manufacturers", "Specialty buyers"],
    targetIndustries: ["Coffee", "HORECA", "Retail beverages"],
    targetMarkets: ["Italy", "Germany", "Belgium", "USA", "Russia", "Libya"],
  },
  {
    sectorSlug: "agriculture-food",
    categoryName: "Processed Foods",
    subcategoryName: "Snacks",
    name: "Makhana (Fox Nuts)",
    slug: "makhana",
    shortDescription:
      "Popped fox nuts (makhana) — a healthy snack with growing global demand in the healthy-snacking segment.",
    longDescription:
      "Makhana is produced largely in Bihar, with growing organised processing and exports. Sold as plain, flavoured, or roasted snacks, and increasingly as an ingredient in trail mixes and granola.",
    hsCode: "2008.99",
    indicativePriceUsd: "USD 6.0 – 12.0 / kg (FOB)",
    capitalLevel: "Low",
    exportDemand: "High",
    competition: "Medium",
    applications: ["Healthy snacking", "Trail mixes", "Granola", "Bakery", "Confectionery"],
    typicalBuyers: ["Snack importers", "Health-food distributors", "Retail brands", "HORECA"],
    targetIndustries: ["Healthy snacks", "Bakery & confectionery", "Retail grocery"],
    targetMarkets: ["USA", "UK", "UAE", "Singapore", "Australia", "Canada"],
  },

  // --- Textiles & Apparel ---
  {
    sectorSlug: "textiles-apparel",
    categoryName: "Made-ups & Home Textiles",
    subcategoryName: "Bedding",
    name: "Cotton Bedsheets & Pillowcases",
    slug: "cotton-bedsheets",
    shortDescription:
      "Woven and printed cotton bedsheets, pillowcases, and duvet covers — a strong Indian made-ups export.",
    longDescription:
      "India is a leading exporter of cotton home textiles, including printed, woven, and embroidered bed linen. Manufacturing hubs include Panipat, Karur, Erode, and Tiruchirappalli.",
    hsCode: "6302.21",
    indicativePriceUsd: "USD 4.0 – 14.0 / set (FOB, design dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Retail home textiles", "Hospitality", "E-commerce bedding", "Interior design"],
    typicalBuyers: ["Retail chains", "E-commerce sellers", "Hospitality buyers", "Wholesalers", "Importers"],
    targetIndustries: ["Home textiles", "Hospitality", "E-commerce"],
    targetMarkets: ["USA", "UK", "Germany", "UAE", "Australia", "Canada"],
  },
  {
    sectorSlug: "textiles-apparel",
    categoryName: "Yarn & Fabric",
    subcategoryName: "Cotton Yarn",
    name: "Combed Cotton Yarn",
    slug: "combed-cotton-yarn",
    shortDescription:
      "Combed cotton yarn for knitting and weaving — used by apparel, home textile, and technical textile manufacturers worldwide.",
    longDescription:
      "India is a major global producer of cotton yarn, with combed varieties exported to fabric and garment manufacturers in multiple regions. Key producing clusters are in Tamil Nadu, Gujarat, Maharashtra, and Madhya Pradesh.",
    hsCode: "5205.23",
    indicativePriceUsd: "USD 3.0 – 6.5 / kg (FOB, count dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Knitted apparel", "Woven fabrics", "Home textiles", "Technical textiles"],
    typicalBuyers: ["Fabric mills", "Knitting units", "Garment manufacturers", "Traders"],
    targetIndustries: ["Apparel", "Home textiles", "Technical textiles"],
    targetMarkets: ["China", "Bangladesh", "Vietnam", "Turkey", "South Korea", "Portugal"],
  },
  {
    sectorSlug: "textiles-apparel",
    categoryName: "Apparel",
    subcategoryName: "Ready-made Garments",
    name: "Cotton T-Shirts (RMG)",
    slug: "cotton-tshirts",
    shortDescription:
      "Knitted cotton T-shirts and casual tops for retail brands, private labels, and promotional markets.",
    longDescription:
      "India is a significant knitwear exporter with strong capabilities in cotton T-shirts, polos, and casual tops. Tirupur is the largest knitwear cluster in India, with extensive fabric-to-garment integration.",
    hsCode: "6109.10",
    indicativePriceUsd: "USD 1.5 – 4.5 / piece (FOB, design dependent)",
    capitalLevel: "Medium",
    exportDemand: "Very High",
    competition: "High",
    applications: ["Retail apparel", "Private-label", "Promotional merchandise", "Sportswear basics"],
    typicalBuyers: ["Retail brands", "Private-label buyers", "Importers", "Discount chains"],
    targetIndustries: ["Apparel retail", "Sportswear", "Promotional products"],
    targetMarkets: ["USA", "UK", "Germany", "Spain", "UAE", "Australia"],
  },

  // --- Gems & Jewellery ---
  {
    sectorSlug: "gems-jewellery",
    categoryName: "Diamonds",
    subcategoryName: "Cut & Polished Diamonds",
    name: "Cut & Polished Diamonds",
    slug: "cut-polished-diamonds",
    shortDescription:
      "Cut and polished natural diamonds from Surat — the world's leading diamond processing hub.",
    longDescription:
      "Surat in Gujarat accounts for a major share of the world's cut and polished diamonds. Exports cover a wide range of sizes, clarities, and cuts, serving jewellery manufacturers, retailers, and diamond dealers globally.",
    hsCode: "7102.39",
    indicativePriceUsd: "Price on application (per carat, varies by 4Cs)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Fine jewellery", "Diamond wholesalers", "Investment diamonds", "Boutique jewellery"],
    typicalBuyers: ["Diamond dealers", "Jewellery manufacturers", "Wholesalers", "Retail jewellery brands"],
    targetIndustries: ["Fine jewellery", "Luxury goods", "Wholesale diamonds"],
    targetMarkets: ["USA", "Hong Kong", "UAE", "Belgium", "Israel", "Thailand"],
  },
  {
    sectorSlug: "gems-jewellery",
    categoryName: "Gemstones",
    subcategoryName: "Coloured Gemstones",
    name: "Coloured Gemstones",
    slug: "coloured-gemstones",
    shortDescription:
      "Cut coloured gemstones including emeralds, rubies, sapphires, tanzanite and semi-precious stones.",
    longDescription:
      "India is a major hub for cutting and processing coloured gemstones, particularly emeralds (cut in Jaipur), and a wide range of semi-precious stones. Indian cutting adds value to rough sourced globally.",
    hsCode: "7103.99",
    indicativePriceUsd: "Price on application (stone-dependent)",
    capitalLevel: "High",
    exportDemand: "Medium",
    competition: "Medium",
    applications: ["Fine jewellery", "Bespoke jewellery", "Healing crystals market", "Wholesale gems"],
    typicalBuyers: ["Jewellery brands", "Gemstone dealers", "Boutique designers", "Wholesalers"],
    targetIndustries: ["Fine jewellery", "Lifestyle & wellness", "Wholesale gems"],
    targetMarkets: ["USA", "Hong Kong", "Thailand", "Germany", "UK", "Japan"],
  },
  {
    sectorSlug: "gems-jewellery",
    categoryName: "Jewellery",
    subcategoryName: "Gold Jewellery",
    name: "Gold Jewellery",
    slug: "gold-jewellery",
    shortDescription:
      "Handcrafted Indian gold jewellery in traditional, bridal, and contemporary designs for global buyers.",
    longDescription:
      "Indian gold jewellery is recognised for craftsmanship in traditional, kundan, meenakari, and contemporary designs. Manufacturing hubs include Mumbai, Jaipur, and Kerala. Exports serve the Indian diaspora, fashion jewellery, and bridal markets.",
    hsCode: "7113.19",
    indicativePriceUsd: "Price on application (gold-content driven)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "Medium",
    applications: ["Bridal jewellery", "Diaspora retail", "Designer jewellery", "Fashion jewellery"],
    typicalBuyers: ["Jewellery retailers", "Diaspora wholesalers", "Designer brands", "Department stores"],
    targetIndustries: ["Fine jewellery retail", "Bridal", "Department stores"],
    targetMarkets: ["UAE", "USA", "UK", "Singapore", "Hong Kong", "Saudi Arabia"],
  },

  // --- Leather ---
  {
    sectorSlug: "leather",
    categoryName: "Footwear",
    subcategoryName: "Leather Footwear",
    name: "Leather Footwear",
    slug: "leather-footwear",
    shortDescription:
      "Finished leather shoes, boots, sandals, and safety footwear for retail and industrial buyers.",
    longDescription:
      "India is a major exporter of leather footwear, with strong capabilities in men's, women's, and safety footwear. Kanpur, Chennai, Agra, and Bangalore are key clusters. Exports cover both fashion and industrial safety segments.",
    hsCode: "6403.99",
    indicativePriceUsd: "USD 8.0 – 35.0 / pair (FOB, segment dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Fashion footwear", "Safety footwear", "Hospitality footwear", "Casual footwear"],
    typicalBuyers: ["Footwear brands", "Retail chains", "Industrial buyers", "Importers"],
    targetIndustries: ["Footwear retail", "Industrial PPE", "Hospitality"],
    targetMarkets: ["Germany", "UK", "USA", "Italy", "France", "UAE"],
  },
  {
    sectorSlug: "leather",
    categoryName: "Leather Goods",
    subcategoryName: "Bags & Wallets",
    name: "Leather Bags & Wallets",
    slug: "leather-bags-wallets",
    shortDescription:
      "Leather handbags, wallets, belts, and small leather goods for fashion and travel retail.",
    longDescription:
      "India's leather goods sector produces handbags, wallets, belts, and travel accessories serving global fashion brands and private-label buyers. Kanpur, Chennai and Kolkata are important manufacturing hubs.",
    hsCode: "4202.21",
    indicativePriceUsd: "USD 6.0 – 60.0 / piece (FOB, segment dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Fashion handbags", "Wallets & small leather goods", "Travel accessories", "Private-label"],
    typicalBuyers: ["Fashion brands", "Private-label buyers", "Department stores", "Importers"],
    targetIndustries: ["Fashion accessories", "Travel goods", "Department stores"],
    targetMarkets: ["USA", "UK", "Germany", "France", "Italy", "Japan"],
  },

  // --- Handicrafts ---
  {
    sectorSlug: "handicrafts",
    categoryName: "Metalware",
    subcategoryName: "Brassware",
    name: "Brass Handicrafts & Utensils",
    slug: "brass-handicrafts",
    shortDescription:
      "Handcrafted brass artefacts, decorative pieces, and utensils from Moradabad and nearby clusters.",
    longDescription:
      "Moradabad in Uttar Pradesh is the brassware capital of India, producing decorative items, pooja utensils, and lifestyle products for global home décor and spiritual markets.",
    hsCode: "7419.99",
    indicativePriceUsd: "USD 3.0 – 25.0 / piece (FOB, design dependent)",
    capitalLevel: "Low",
    exportDemand: "Medium",
    competition: "High",
    applications: ["Home décor", "Spiritual & pooja items", "Lifestyle retail", "Hospitality décor"],
    typicalBuyers: ["Home décor importers", "Lifestyle retailers", "Spiritual goods distributors", "Wholesalers"],
    targetIndustries: ["Home décor", "Spiritual goods", "Lifestyle retail"],
    targetMarkets: ["USA", "UK", "Germany", "UAE", "Australia", "Canada"],
  },
  {
    sectorSlug: "handicrafts",
    categoryName: "Woodcraft",
    subcategoryName: "Decorative Wood",
    name: "Hand-carved Wooden Decor",
    slug: "wooden-decor",
    shortDescription:
      "Hand-carved wooden décor, boxes, and lifestyle pieces from Saharanpur and Jodhpur clusters.",
    longDescription:
      "Indian wooden handicrafts include carved panels, decorative boxes, kitchenware, and lifestyle products sourced from Saharanpur, Jodhpur, and Karnataka. Materials include sheesham, mango wood, and reclaimed wood.",
    hsCode: "4420.90",
    indicativePriceUsd: "USD 4.0 – 60.0 / piece (FOB, design dependent)",
    capitalLevel: "Low",
    exportDemand: "Medium",
    competition: "High",
    applications: ["Home décor", "Lifestyle retail", "Hospitality", "Gifting"],
    typicalBuyers: ["Home décor retailers", "Lifestyle brands", "Hotel & resort buyers", "Gift importers"],
    targetIndustries: ["Home décor", "Hospitality", "Gifting"],
    targetMarkets: ["USA", "UK", "Germany", "France", "UAE", "Australia"],
  },

  // --- Engineering ---
  {
    sectorSlug: "engineering",
    categoryName: "Iron & Steel Products",
    subcategoryName: "Structural",
    name: "Transmission Line Towers",
    slug: "transmission-towers",
    shortDescription:
      "Lattice-type steel transmission line towers for high-voltage power projects worldwide.",
    longDescription:
      "India is a major exporter of transmission line towers, supplying utilities and EPC contractors for power projects across Africa, the Middle East, the Americas, and Southeast Asia.",
    hsCode: "7308.20",
    indicativePriceUsd: "USD 1,200 – 2,200 / MT (FOB, project dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "Medium",
    applications: ["High-voltage transmission", "Substation structures", "Telecom towers", "Renewable energy interconnections"],
    typicalBuyers: ["Power utilities", "EPC contractors", "Telecom operators", "Project developers"],
    targetIndustries: ["Power transmission", "Telecom infrastructure", "Renewable energy"],
    targetMarkets: ["USA", "Africa", "UAE", "Saudi Arabia", "Latin America", "Southeast Asia"],
  },
  {
    sectorSlug: "engineering",
    categoryName: "Fasteners",
    subcategoryName: "Bolts & Nuts",
    name: "Bolts, Nuts & Fasteners",
    slug: "bolts-nuts-fasteners",
    shortDescription:
      "Standard and high-tensile fasteners for automotive, construction, machinery, and infrastructure.",
    longDescription:
      "India is a significant exporter of fasteners, with capabilities across high-tensile, stainless, and special-alloy bolts, nuts, screws, and washers. Ludhiana and Chennai are major clusters.",
    hsCode: "7318.15",
    indicativePriceUsd: "USD 1,500 – 4,500 / MT (FOB, grade dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Automotive assembly", "Construction", "Industrial machinery", "Wind energy"],
    typicalBuyers: ["Auto OEMs", "Tier-1 suppliers", "Distributors", "Industrial buyers"],
    targetIndustries: ["Automotive", "Construction", "Industrial machinery", "Wind energy"],
    targetMarkets: ["USA", "Germany", "UK", "Brazil", "UAE", "Italy"],
  },

  // --- Automotive components ---
  {
    sectorSlug: "automotive-components",
    categoryName: "Engine & Drivetrain",
    subcategoryName: "Engine Parts",
    name: "Auto Engine Components",
    slug: "auto-engine-components",
    shortDescription:
      "Cylinder heads, crankshafts, camshafts, and related engine parts for global OEMs and the aftermarket.",
    longDescription:
      "India is a major hub for precision-engineered auto components. Engine parts including cylinder heads, crankshafts, camshafts, and connecting rods are exported to global OEMs and Tier-1 suppliers.",
    hsCode: "8409.91",
    indicativePriceUsd: "Price on application (part dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Passenger vehicles", "Commercial vehicles", "Two-wheelers", "Aftermarket"],
    typicalBuyers: ["Auto OEMs", "Tier-1 suppliers", "Aftermarket distributors"],
    targetIndustries: ["Automotive", "Commercial vehicles", "Aftermarket"],
    targetMarkets: ["USA", "Germany", "UK", "Mexico", "Brazil", "Thailand"],
  },

  // --- Industrial machinery ---
  {
    sectorSlug: "industrial-machinery",
    categoryName: "Textile Machinery",
    subcategoryName: "Weaving & Processing",
    name: "Textile Machinery",
    slug: "textile-machinery",
    shortDescription:
      "Looms, knitting machines, processing machines, and accessories for the global textile industry.",
    longDescription:
      "India manufactures a wide range of textile machinery including knitting machines, looms, processing machines, and parts, with growing exports to textile hubs in Asia, Africa, and Latin America.",
    hsCode: "8446.21",
    indicativePriceUsd: "USD 5,000 – 100,000 / unit (FOB, machine type)",
    capitalLevel: "High",
    exportDemand: "Medium",
    competition: "Medium",
    applications: ["Weaving mills", "Knitting units", "Processing houses", "Garment units"],
    typicalBuyers: ["Textile mills", "Garment manufacturers", "Project consultants", "Distributors"],
    targetIndustries: ["Textile manufacturing", "Apparel", "Home textiles"],
    targetMarkets: ["Bangladesh", "Vietnam", "Ethiopia", "Türkiye", "Indonesia", "Egypt"],
  },

  // --- Chemicals & Pharma ---
  {
    sectorSlug: "chemicals-pharma",
    categoryName: "Pharmaceuticals",
    subcategoryName: "Generic Formulations",
    name: "Generic Formulations",
    slug: "generic-formulations",
    shortDescription:
      "Finished generic dosage forms (tablets, capsules, injectables) supplied to regulated and semi-regulated markets.",
    longDescription:
      "India is the world's largest provider of generic medicines by volume. Exports include oral solids, injectables, and specialty formulations to regulated and emerging markets, often through contract manufacturing and B2B supply.",
    hsCode: "3004.90",
    indicativePriceUsd: "Price on application (SKU and market dependent)",
    capitalLevel: "High",
    exportDemand: "Very High",
    competition: "High",
    applications: ["Retail pharmacy", "Hospital supply", "Tender business", "Institutional supply"],
    typicalBuyers: ["Pharma importers", "Wholesalers", "Tender agencies", "Hospital procurement"],
    targetIndustries: ["Pharmaceuticals", "Healthcare", "Institutional supply"],
    targetMarkets: ["USA", "Africa", "Southeast Asia", "Latin America", "UK", "UAE"],
  },
  {
    sectorSlug: "chemicals-pharma",
    categoryName: "Agrochemicals",
    subcategoryName: "Technical & Formulations",
    name: "Agrochemicals (Technical & Formulations)",
    slug: "agrochemicals",
    shortDescription:
      "Technical-grade agrochemicals and formulations for crop protection, exported to global distributors.",
    longDescription:
      "India is a leading producer and exporter of agrochemicals including technical-grade active ingredients and formulations. Gujarat and Maharashtra host the largest manufacturing base, with strong export orientation to LATAM, Africa, and Asia.",
    hsCode: "3808.91",
    indicativePriceUsd: "Price on application (molecule and grade dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Crop protection", "Public health", "Veterinary", "Industrial pest control"],
    typicalBuyers: ["Agrochemical distributors", "Formulators", "Public health agencies", "Importers"],
    targetIndustries: ["Agriculture", "Public health", "Animal health"],
    targetMarkets: ["Brazil", "USA", "Argentina", "Vietnam", "Indonesia", "Nigeria"],
  },

  // --- Electronics & Electrical ---
  {
    sectorSlug: "electronics-electrical",
    categoryName: "Electrical Equipment",
    subcategoryName: "Wiring Accessories",
    name: "Wiring Accessories & Switchgear",
    slug: "wiring-accessories-switchgear",
    shortDescription:
      "Switches, sockets, MCBs, and distribution boards for residential, commercial, and industrial wiring.",
    longDescription:
      "India's electrical equipment industry produces a wide range of wiring accessories and switchgear meeting IEC and country-specific standards. Exports serve construction, infrastructure, and industrial projects.",
    hsCode: "8536.69",
    indicativePriceUsd: "USD 0.20 – 25.0 / piece (FOB, product dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Residential wiring", "Commercial buildings", "Industrial installations", "Infrastructure"],
    typicalBuyers: ["Electrical distributors", "Project contractors", "EPC companies", "Retail brands"],
    targetIndustries: ["Construction", "Infrastructure", "Industrial electrical"],
    targetMarkets: ["Africa", "UAE", "Saudi Arabia", "Southeast Asia", "UK", "Latin America"],
  },

  // --- Beauty & Personal Care ---
  {
    sectorSlug: "beauty-personal-care",
    categoryName: "Hair Care",
    subcategoryName: "Hair Oils",
    name: "Hair Oils (Ayurvedic & Cosmetic)",
    slug: "hair-oils",
    shortDescription:
      "Ayurvedic and cosmetic-grade hair oils with herbal and natural ingredient bases for global markets.",
    longDescription:
      "India is a significant producer of hair oils, including coconut-based, ayurvedic herbal oils, and cosmetic-grade formulations. Strong demand from the Indian diaspora and growing interest in natural hair care globally.",
    hsCode: "3305.90",
    indicativePriceUsd: "USD 2.0 – 8.0 / bottle (FOB, brand dependent)",
    capitalLevel: "Low",
    exportDemand: "High",
    competition: "High",
    applications: ["Retail hair care", "Diaspora markets", "Private-label hair care", "Salon supply"],
    typicalBuyers: ["Retail brands", "Diaspora distributors", "Private-label buyers", "Salon suppliers"],
    targetIndustries: ["Personal care retail", "Diaspora retail", "Salon & spa"],
    targetMarkets: ["UAE", "USA", "UK", "Canada", "Australia", "Singapore"],
  },

  // --- Natural & Herbal ---
  {
    sectorSlug: "natural-herbal",
    categoryName: "Herbal Extracts",
    subcategoryName: "Standardised Extracts",
    name: "Herbal & Botanical Extracts",
    slug: "herbal-extracts",
    shortDescription:
      "Standardised herbal extracts including ashwagandha, turmeric, tulsi, and moringa for nutraceutical buyers.",
    longDescription:
      "India produces a wide range of standardised herbal and botanical extracts for nutraceutical, food, and cosmetic applications. Strong grower base, established processing, and growing demand from global supplement brands.",
    hsCode: "1302.19",
    indicativePriceUsd: "USD 8.0 – 80.0 / kg (FOB, extract dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "Medium",
    applications: ["Nutraceuticals", "Functional foods", "Cosmetics", "Ayurveda"],
    typicalBuyers: ["Supplement brands", "Food manufacturers", "Cosmetic formulators", "Wholesalers"],
    targetIndustries: ["Nutraceuticals", "Functional foods", "Cosmetics"],
    targetMarkets: ["USA", "Germany", "Japan", "Canada", "UK", "Australia"],
  },

  // --- Home & Kitchen ---
  {
    sectorSlug: "home-kitchen",
    categoryName: "Cookware",
    subcategoryName: "Stainless Steel Cookware",
    name: "Stainless Steel Cookware",
    slug: "stainless-steel-cookware",
    shortDescription:
      "Stainless steel pots, pans, pressure cookers, and kitchenware for retail and HORECA buyers.",
    longDescription:
      "India is a major manufacturer of stainless steel cookware, supplying retail brands, hospitality buyers, and HORECA. Manufacturing hubs include Thoothukudi, Mumbai, and the National Capital Region.",
    hsCode: "7323.93",
    indicativePriceUsd: "USD 2.0 – 25.0 / piece (FOB, product dependent)",
    capitalLevel: "Medium",
    exportDemand: "High",
    competition: "High",
    applications: ["Retail kitchenware", "HORECA", "Hospitality", "Promotional goods"],
    typicalBuyers: ["Retail brands", "Hospitality buyers", "HORECA distributors", "Importers"],
    targetIndustries: ["Retail kitchenware", "Hospitality", "HORECA"],
    targetMarkets: ["USA", "UK", "UAE", "Saudi Arabia", "Germany", "Australia"],
  },

  // --- Furniture & Lifestyle ---
  {
    sectorSlug: "furniture-lifestyle",
    categoryName: "Indoor Furniture",
    subcategoryName: "Wooden Furniture",
    name: "Solid Wood Furniture",
    slug: "solid-wood-furniture",
    shortDescription:
      "Solid wood indoor furniture — beds, tables, chairs, and storage — for residential and hospitality buyers.",
    longDescription:
      "India's furniture industry produces a wide range of solid wood indoor furniture using sheesham, mango, acacia, and reclaimed wood. Strong export presence in the USA, UK, and EU markets.",
    hsCode: "9403.60",
    indicativePriceUsd: "USD 80 – 800 / piece (FOB, design dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Residential furniture", "Hospitality", "Interior design", "E-commerce furniture"],
    typicalBuyers: ["Furniture retailers", "E-commerce sellers", "Hospitality buyers", "Interior designers"],
    targetIndustries: ["Furniture retail", "Hospitality", "Interior design"],
    targetMarkets: ["USA", "UK", "Germany", "France", "UAE", "Australia"],
  },

  // --- Packaging ---
  {
    sectorSlug: "packaging",
    categoryName: "Paper Packaging",
    subcategoryName: "Corrugated & Paperboard",
    name: "Corrugated & Paperboard Packaging",
    slug: "corrugated-paperboard-packaging",
    shortDescription:
      "Corrugated boxes, folding cartons, and paperboard packaging for industrial, e-commerce, and retail use.",
    longDescription:
      "India's paper packaging industry serves FMCG, e-commerce, and industrial segments. Exports include corrugated shipping containers, folding cartons, and specialty paperboard packaging.",
    hsCode: "4819.10",
    indicativePriceUsd: "USD 0.30 – 2.50 / piece (FOB, type dependent)",
    capitalLevel: "Medium",
    exportDemand: "Medium",
    competition: "High",
    applications: ["FMCG packaging", "E-commerce shipping", "Industrial packaging", "Retail packaging"],
    typicalBuyers: ["FMCG companies", "E-commerce platforms", "Industrial buyers", "Retail brands"],
    targetIndustries: ["FMCG", "E-commerce", "Industrial packaging", "Retail"],
    targetMarkets: ["UAE", "Saudi Arabia", "Africa", "Southeast Asia", "UK", "USA"],
  },

  // --- Renewable Energy ---
  {
    sectorSlug: "renewable-energy",
    categoryName: "Solar PV",
    subcategoryName: "Solar Modules",
    name: "Solar PV Modules",
    slug: "solar-pv-modules",
    shortDescription:
      "Crystalline silicon solar PV modules for utility, commercial, and residential installations.",
    longDescription:
      "India has built significant manufacturing capacity for solar PV modules, with strong demand from utility-scale projects and growing exports to Africa, the Middle East, and the Americas.",
    hsCode: "8541.43",
    indicativePriceUsd: "USD 0.10 – 0.22 / W (FOB, technology dependent)",
    capitalLevel: "High",
    exportDemand: "High",
    competition: "High",
    applications: ["Utility-scale solar", "Commercial & industrial rooftops", "Residential solar", "Hybrid systems"],
    typicalBuyers: ["Solar developers", "EPC contractors", "Distributors", "Government tenders"],
    targetIndustries: ["Solar power", "Utilities", "Commercial & industrial energy"],
    targetMarkets: ["USA", "Africa", "UAE", "Saudi Arabia", "Europe", "Australia"],
  },
];

// --- Sources / Citations ---------------------------------------------------
// All sources are clearly labeled SAMPLE in the notes field. Real production
// data must come with retrievalDate and proper authority level.

const SOURCES = [
  {
    name: "DGCI&S — Trade Statistics (commodity-wise export)",
    url: "https://tradestat.commerce.gov.in/eidb/commodity_wise_export",
    type: "GOVERNMENT",
    authority: "L1_OFFICIAL",
    notes: "SAMPLE: listed as a primary reference for HS-code-level export data. Live data not fetched in Phase 1.",
  },
  {
    name: "FIEO — Federation of Indian Export Organisations",
    url: "https://fieo.org/",
    type: "INDUSTRY_BODY",
    authority: "L2_INDUSTRY",
    notes: "SAMPLE: industry-body reference for sectoral export information.",
  },
  {
    name: "IndiaMART",
    url: "https://www.indiamart.com/",
    type: "MARKETPLACE",
    authority: "L4_MARKETPLACE",
    notes: "SAMPLE: marketplace reference for supplier discovery. Live integration deferred.",
  },
  {
    name: "Alibaba",
    url: "https://www.alibaba.com/",
    type: "MARKETPLACE",
    authority: "L4_MARKETPLACE",
    notes: "SAMPLE: global marketplace reference for buyer/supplier signals.",
  },
  {
    name: "ExportGenius — HS-code lookup",
    url: "https://www.exportgenius.com/",
    type: "THIRD_PARTY",
    authority: "L5_THIRD_PARTY",
    notes: "SAMPLE: third-party reference for HS-code information and trade data context.",
  },
  {
    name: "Internal catalog entry",
    url: null,
    type: "THIRD_PARTY",
    authority: "L5_THIRD_PARTY",
    notes: "SAMPLE: placeholder entry for catalog-derived facts until live sources are integrated.",
  },
] as const;

// --- Specialized attributes (configurable) --------------------------------

const SPECIALIZED_ATTRIBUTES = [
  {
    key: "gi_tag",
    label: "Geographical Indication (GI)",
    description: "Indicates whether the product has a registered GI tag in India.",
    valueType: "TEXT",
    group: "Compliance",
    order: 10,
  },
  {
    key: "trademark_requirement",
    label: "Trademark requirement",
    description: "Whether the product typically requires a registered trademark in the destination market.",
    valueType: "BOOLEAN",
    group: "Compliance",
    order: 20,
  },
  {
    key: "reach_compliance",
    label: "REACH compliance (EU)",
    description: "Whether the product is subject to REACH regulation in the European Union.",
    valueType: "BOOLEAN",
    group: "Compliance",
    order: 30,
  },
  {
    key: "fssai_requirement",
    label: "FSSAI requirement",
    description: "Whether FSSAI licensing is required for the product from India.",
    valueType: "BOOLEAN",
    group: "Compliance",
    order: 40,
  },
  {
    key: "us_fda_registration",
    label: "US FDA registration",
    description: "Whether US FDA registration is relevant for the product.",
    valueType: "BOOLEAN",
    group: "Compliance",
    order: 50,
  },
  {
    key: "ce_marking",
    label: "CE marking (EU)",
    description: "Whether CE marking is required to enter the EU market.",
    valueType: "BOOLEAN",
    group: "Compliance",
    order: 60,
  },
  {
    key: "halal_certification",
    label: "Halal certification",
    description: "Whether Halal certification is typically required for the destination market.",
    valueType: "BOOLEAN",
    group: "Certifications",
    order: 10,
  },
  {
    key: "organic_certification",
    label: "Organic certification",
    description: "Whether organic certification (e.g. NPOP, USDA Organic, EU Organic) is relevant.",
    valueType: "BOOLEAN",
    group: "Certifications",
    order: 20,
  },
  {
    key: "iso_9001",
    label: "ISO 9001",
    description: "Whether ISO 9001 quality management certification is commonly expected by buyers.",
    valueType: "BOOLEAN",
    group: "Certifications",
    order: 30,
  },
  {
    key: "iso_14001",
    label: "ISO 14001",
    description: "Whether ISO 14001 environmental management certification is commonly expected.",
    valueType: "BOOLEAN",
    group: "Certifications",
    order: 40,
  },
];

async function main() {
  console.log("🌱 Seeding Phase 1 catalog…");

  // Sources
  console.log("  → sources");
  for (const s of SOURCES) {
    await prisma.source.upsert({
      where: { id: `src-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}` },
      update: {},
      create: {
        id: `src-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
        name: s.name,
        url: s.url,
        type: s.type,
        authority: s.authority,
        notes: s.notes,
      },
    });
  }

  // Specialized attributes
  console.log("  → specialized attributes");
  for (const a of SPECIALIZED_ATTRIBUTES) {
    await prisma.specializedAttribute.upsert({
      where: { key: a.key },
      update: {
        label: a.label,
        description: a.description,
        valueType: a.valueType,
        group: a.group,
        order: a.order,
      },
      create: a,
    });
  }

  // Sectors
  console.log("  → sectors");
  for (const s of SECTORS) {
    await prisma.sector.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        imageEmoji: s.imageEmoji,
        order: s.order,
      },
      create: s,
    });
  }

  // Categories (created on demand per sector)
  console.log("  → categories & products");
  for (const p of PRODUCTS) {
    const sector = await prisma.sector.findUnique({ where: { slug: p.sectorSlug } });
    if (!sector) continue;

    const category = await prisma.category.upsert({
      where: { sectorId_slug: { sectorId: sector.id, slug: p.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") } },
      update: { name: p.categoryName },
      create: {
        slug: p.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: p.categoryName,
        description: `${p.categoryName} from the ${sector.name} sector.`,
        sectorId: sector.id,
      },
    });

    let subcategoryId: string | undefined;
    if (p.subcategoryName) {
      const sub = await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: p.subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") } },
        update: { name: p.subcategoryName },
        create: {
          slug: p.subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: p.subcategoryName,
          categoryId: category.id,
        },
      });
      subcategoryId = sub.id;
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        hsCode: p.hsCode,
        indicativePriceUsd: p.indicativePriceUsd,
        capitalLevel: p.capitalLevel,
        exportDemand: p.exportDemand,
        competition: p.competition,
        applications: p.applications.join("\n"),
        typicalBuyers: p.typicalBuyers.join("\n"),
        targetIndustries: p.targetIndustries.join("\n"),
        targetMarkets: p.targetMarkets.join("\n"),
        sectorId: sector.id,
        categoryId: category.id,
        subcategoryId,
      },
      create: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        hsCode: p.hsCode,
        indicativePriceUsd: p.indicativePriceUsd,
        capitalLevel: p.capitalLevel,
        exportDemand: p.exportDemand,
        competition: p.competition,
        applications: p.applications.join("\n"),
        typicalBuyers: p.typicalBuyers.join("\n"),
        targetIndustries: p.targetIndustries.join("\n"),
        targetMarkets: p.targetMarkets.join("\n"),
        sectorId: sector.id,
        categoryId: category.id,
        subcategoryId,
      },
    });

    // Attach generic product-level sources: the catalog entry + a trade-stats source
    const catalogSrc = await prisma.source.findFirst({ where: { name: "Internal catalog entry" } });
    const tradeSrc = await prisma.source.findFirst({ where: { name: "DGCI&S — Trade Statistics (commodity-wise export)" } });
    if (catalogSrc) {
      await prisma.productSource.upsert({
        where: { productId_sourceId_reference: { productId: product.id, sourceId: catalogSrc.id, reference: "Product profile" } },
        update: {},
        create: {
          productId: product.id,
          sourceId: catalogSrc.id,
          reference: "Product profile",
          factKind: "AI_DERIVED",
        },
      });
    }
    if (tradeSrc && p.hsCode) {
      await prisma.productSource.upsert({
        where: { productId_sourceId_reference: { productId: product.id, sourceId: tradeSrc.id, reference: `HS ${p.hsCode}` } },
        update: {},
        create: {
          productId: product.id,
          sourceId: tradeSrc.id,
          reference: `HS ${p.hsCode}`,
          factKind: "SOURCED",
        },
      });
    }
  }

  // A small set of sector-level specialized-attribute hints
  console.log("  → a few sector-level attribute hints");
  const gi = await prisma.specializedAttribute.findUnique({ where: { key: "gi_tag" } });
  const fssai = await prisma.specializedAttribute.findUnique({ where: { key: "fssai_requirement" } });
  const reach = await prisma.specializedAttribute.findUnique({ where: { key: "reach_compliance" } });
  const iso9k = await prisma.specializedAttribute.findUnique({ where: { key: "iso_9001" } });
  const fda = await prisma.specializedAttribute.findUnique({ where: { key: "us_fda_registration" } });

  if (gi && fssai) {
    const agri = await prisma.sector.findUnique({ where: { slug: "agriculture-food" } });
    if (agri) {
      const cat = await prisma.category.findFirst({ where: { sectorId: agri.id, name: "Spices" } });
      if (cat) {
        await prisma.specializedAttributeValue.upsert({
          where: { id: `sav-${cat.id}-fssai` },
          update: {},
          create: {
            id: `sav-${cat.id}-fssai`,
            attributeId: fssai.id,
            categoryId: cat.id,
            valueBool: true,
            regionCode: null,
          },
        });
      }
    }
  }
  if (reach && iso9k) {
    const eng = await prisma.sector.findUnique({ where: { slug: "engineering" } });
    if (eng) {
      const cat = await prisma.category.findFirst({ where: { sectorId: eng.id, name: "Fasteners" } });
      if (cat) {
        await prisma.specializedAttributeValue.upsert({
          where: { id: `sav-${cat.id}-iso` },
          update: {},
          create: {
            id: `sav-${cat.id}-iso`,
            attributeId: iso9k.id,
            categoryId: cat.id,
            valueBool: true,
          },
        });
      }
    }
  }
  if (fda) {
    const pharma = await prisma.sector.findUnique({ where: { slug: "chemicals-pharma" } });
    if (pharma) {
      const cat = await prisma.category.findFirst({ where: { sectorId: pharma.id, name: "Pharmaceuticals" } });
      if (cat) {
        await prisma.specializedAttributeValue.upsert({
          where: { id: `sav-${cat.id}-fda` },
          update: {},
          create: {
            id: `sav-${cat.id}-fda`,
            attributeId: fda.id,
            categoryId: cat.id,
            valueBool: true,
            regionCode: "US",
          },
        });
      }
    }
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
