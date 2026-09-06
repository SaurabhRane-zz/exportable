// Phase 1 + Phase 2 seed — sectors, products, sources/citations, plus
// sample Indian suppliers, overseas buyers, and Q&A documents.
// All data is clearly labeled as SAMPLE in the database (Product.isSample = true,
// Company.isSample = true, QaDocument.isSample = true, Source.notes).
// Real trade statistics, supplier/buyer identities, and live market figures must
// not be fabricated; when added later, they will go through the same models with
// isSample = false and proper retrievalDate on the Source.

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

  // ---------- Phase 2: companies, company-product links, Q&A documents ----------

  // Ensure additional sources exist for the new companies and Q&A docs.
  const srcIndiaMart = await prisma.source.upsert({
    where: { id: "src-indiamart" },
    update: {},
    create: {
      id: "src-indiamart",
      name: "IndiaMART — Indian supplier marketplace",
      url: "https://www.indiamart.com/",
      type: "MARKETPLACE",
      authority: "L4_MARKETPLACE",
      retrievalDate: null,
      notes:
        "Sample/demo source pointer for Phase 2 supplier data. Real company profiles must come from verified directory pulls, not from the marketplace, which contains listings of variable quality.",
    },
  });
  const srcTradeIndia = await prisma.source.upsert({
    where: { id: "src-tradeindia" },
    update: {},
    create: {
      id: "src-tradeindia",
      name: "TradeIndia — Indian B2B directory",
      url: "https://www.tradeindia.com/",
      type: "DIRECTORY",
      authority: "L3_DIRECTORY",
      retrievalDate: null,
      notes: "Sample/demo source pointer for Phase 2 supplier data.",
    },
  });
  const srcAlibaba = await prisma.source.upsert({
    where: { id: "src-alibaba" },
    update: {},
    create: {
      id: "src-alibaba",
      name: "Alibaba — Global B2B marketplace",
      url: "https://www.alibaba.com/",
      type: "MARKETPLACE",
      authority: "L4_MARKETPLACE",
      retrievalDate: null,
      notes: "Sample/demo source pointer for Phase 2 buyer data.",
    },
  });
  const srcFieoDirectory = await prisma.source.upsert({
    where: { id: "src-fieo-directory" },
    update: {},
    create: {
      id: "src-fieo-directory",
      name: "FIEO — Federation of Indian Export Organisations member directory",
      url: "https://www.fieo.org/",
      type: "INDUSTRY_BODY",
      authority: "L2_INDUSTRY",
      retrievalDate: null,
      notes:
        "Real industry-body directory of Indian exporters. Used here as a sample pointer; production should pull live members via the FIEO public listing.",
    },
  });
  const srcEbaDirectory = await prisma.source.upsert({
    where: { id: "src-eba-directory" },
    update: {},
    create: {
      id: "src-eba-directory",
      name: "European Buying Agencies & Importers — sample directory",
      url: "https://example.org/eba-directory",
      type: "DIRECTORY",
      authority: "L3_DIRECTORY",
      retrievalDate: null,
      notes: "Placeholder directory used as a sample citation anchor for overseas buyers.",
    },
  });
  const srcReachEcha = await prisma.source.upsert({
    where: { id: "src-reach-echa" },
    update: {},
    create: {
      id: "src-reach-echa",
      name: "ECHA — EU REACH regulation guidance",
      url: "https://echa.europa.eu/regulations/reach",
      type: "GOVERNMENT",
      authority: "L1_OFFICIAL",
      retrievalDate: null,
      notes: "Official EU chemicals regulation guidance. Use for compliance Q&A.",
    },
  });
  const srcBisGov = await prisma.source.upsert({
    where: { id: "src-bis-gov" },
    update: {},
    create: {
      id: "src-bis-gov",
      name: "Bureau of Indian Standards — export quality guidance",
      url: "https://www.bis.gov.in/",
      type: "GOVERNMENT",
      authority: "L1_OFFICIAL",
      retrievalDate: null,
      notes: "BIS is the national standards body of India. Sample pointer for compliance Q&A.",
    },
  });
  const srcMpdeaGov = await prisma.source.upsert({
    where: { id: "src-mpeda-gov" },
    update: {},
    create: {
      id: "src-mpeda-gov",
      name: "MPEDA — Marine Products Export Development Authority",
      url: "https://mpeda.gov.in/",
      type: "GOVERNMENT",
      authority: "L1_OFFICIAL",
      retrievalDate: null,
      notes: "Official MPEDA portal; cited for seafood export compliance Q&A.",
    },
  });
  const srcApedaGov = await prisma.source.upsert({
    where: { id: "src-apeda-gov" },
    update: {},
    create: {
      id: "src-apeda-gov",
      name: "APEDA — Agricultural & Processed Food Products Export Development Authority",
      url: "https://apeda.gov.in/",
      type: "GOVERNMENT",
      authority: "L1_OFFICIAL",
      retrievalDate: null,
      notes: "Official APEDA portal; cited for agricultural/food product export Q&A.",
    },
  });

  // Helper: find a product by slug (Phase 1 seed creates a defined set).
  async function findProduct(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  }
  async function findSector(slug: string) {
    return prisma.sector.findUnique({ where: { slug } });
  }

  // --- Sample Indian suppliers (SUPPLIER) --------------------------------
  // These are clearly fictional entries whose names are generic placeholders
  // ("Sample Spices Pvt. Ltd."). They are NOT real companies and must not be
  // presented as such. Real supplier data must come from verified directory
  // pulls (FIEO, EEPC, MPEDA) and carry proper retrievalDate.
  const SUPPLIERS = [
    {
      slug: "sample-spices-pvt-ltd",
      name: "Sample Spices Pvt. Ltd.",
      shortDescription:
        "Illustrative Indian exporter of turmeric, cumin, and chilli powders.",
      longDescription:
        "A placeholder supplier profile used to demonstrate the structure of Phase 2 supplier data. In production, real exporter profiles from the FIEO member directory or relevant Export Promotion Council will replace these entries.",
      country: "IN",
      countryName: "India",
      state: "Kerala",
      city: "Kochi",
      website: "https://example.org/sample-spices",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.indiamart.com/sample-spices/",
      businessType: "Manufacturer & Exporter",
      yearEstablished: 2005,
      employeeBand: "50-200",
      annualRevenueBand: "USD 1-10M",
      certifications: "FSSAI\nISO 22000\nSpice Board registration",
      specialties: "Turmeric\nCumin\nChilli",
      targetMarkets: "United States\nUnited Kingdom\nGermany",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "agriculture-food",
      productSlugs: ["turmeric-powder", "cumin-seeds"],
    },
    {
      slug: "sample-handicrafts-co",
      name: "Sample Handicrafts Co.",
      shortDescription:
        "Illustrative Indian manufacturer of brass and wooden handicrafts.",
      longDescription:
        "Placeholder supplier profile for handicrafts (brassware, woodcraft). In production, real GI-tagged producer cooperatives and verified EEPC/EPCH members will replace these entries.",
      country: "IN",
      countryName: "India",
      state: "Rajasthan",
      city: "Jaipur",
      website: "https://example.org/sample-handicrafts",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.tradeindia.com/sample-handicrafts/",
      businessType: "Manufacturer",
      yearEstablished: 1998,
      employeeBand: "10-50",
      annualRevenueBand: "<USD 1M",
      certifications: "EPCH member\nGI tag — Blue Pottery (inherited via category)",
      specialties: "Brassware\nWoodcraft\nHand-painted ceramics",
      targetMarkets: "United States\nEuropean Union\nJapan",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "handicrafts",
      productSlugs: ["brass-decorative-items"],
    },
    {
      slug: "sample-cotton-textiles",
      name: "Sample Cotton Textiles Pvt. Ltd.",
      shortDescription:
        "Illustrative Indian cotton textile and made-ups manufacturer.",
      longDescription:
        "Placeholder supplier profile for cotton textiles, fabric, and made-ups. Production data should come from AEPC / TEXPROCIL member directories.",
      country: "IN",
      countryName: "India",
      state: "Tamil Nadu",
      city: "Coimbatore",
      website: "https://example.org/sample-cotton",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.indiamart.com/sample-cotton/",
      businessType: "Manufacturer & Exporter",
      yearEstablished: 2001,
      employeeBand: "200-1000",
      annualRevenueBand: "USD 10-100M",
      certifications: "OEKO-TEX Standard 100\nISO 9001",
      specialties: "Cotton fabric\nHome textiles\nMade-ups",
      targetMarkets: "European Union\nUnited States\nAustralia",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "textiles-apparel",
      productSlugs: ["cotton-fabric-grey"],
    },
    {
      slug: "sample-engineering-fasteners",
      name: "Sample Engineering Fasteners Ltd.",
      shortDescription:
        "Illustrative Indian manufacturer of bolts, nuts, and precision fasteners.",
      longDescription:
        "Placeholder supplier profile for engineering fasteners. Production data should come from EEPC India member directory.",
      country: "IN",
      countryName: "India",
      state: "Maharashtra",
      city: "Pune",
      website: "https://example.org/sample-fasteners",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.tradeindia.com/sample-fasteners/",
      businessType: "Manufacturer",
      yearEstablished: 1992,
      employeeBand: "200-1000",
      annualRevenueBand: "USD 10-100M",
      certifications: "ISO 9001\nISO/TS 16949",
      specialties: "Bolts\nNuts\nWashers",
      targetMarkets: "Germany\nUnited States\nUnited Kingdom",
      dataProvenance: "VERIFIED",
      sectorSlug: "engineering",
      productSlugs: ["bolts-nuts"],
    },
    {
      slug: "sample-pharma-api",
      name: "Sample Pharma API Pvt. Ltd.",
      shortDescription:
        "Illustrative Indian Active Pharmaceutical Ingredient (API) manufacturer.",
      longDescription:
        "Placeholder supplier profile for API / intermediates. Production data should come from Pharmexcil directory.",
      country: "IN",
      countryName: "India",
      state: "Gujarat",
      city: "Ahmedabad",
      website: "https://example.org/sample-pharma",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.indiamart.com/sample-pharma/",
      businessType: "Manufacturer & Exporter",
      yearEstablished: 2008,
      employeeBand: "50-200",
      annualRevenueBand: "USD 1-10M",
      certifications: "WHO-GMP\nUSDMF (where applicable)",
      specialties: "APIs\nIntermediates",
      targetMarkets: "United States\nEuropean Union\nBrazil",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "chemicals-pharma",
      productSlugs: [],
    },
  ] as const;

  for (const s of SUPPLIERS) {
    const sector = await findSector(s.sectorSlug);
    const company = await prisma.company.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription,
        country: s.country,
        countryName: s.countryName,
        state: s.state,
        city: s.city,
        website: s.website,
        email: s.email,
        phone: s.phone,
        marketplaceUrl: s.marketplaceUrl,
        businessType: s.businessType,
        yearEstablished: s.yearEstablished,
        employeeBand: s.employeeBand,
        annualRevenueBand: s.annualRevenueBand,
        certifications: s.certifications,
        specialties: s.specialties,
        targetMarkets: s.targetMarkets,
        dataProvenance: s.dataProvenance,
        kind: "SUPPLIER",
        sectorId: sector?.id ?? null,
        isSample: true,
      },
      create: {
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription,
        country: s.country,
        countryName: s.countryName,
        state: s.state,
        city: s.city,
        website: s.website,
        email: s.email,
        phone: s.phone,
        marketplaceUrl: s.marketplaceUrl,
        businessType: s.businessType,
        yearEstablished: s.yearEstablished,
        employeeBand: s.employeeBand,
        annualRevenueBand: s.annualRevenueBand,
        certifications: s.certifications,
        specialties: s.specialties,
        targetMarkets: s.targetMarkets,
        dataProvenance: s.dataProvenance,
        kind: "SUPPLIER",
        sectorId: sector?.id ?? null,
        isSample: true,
      },
    });

    // Attach product links
    for (const ps of s.productSlugs) {
      const product = await findProduct(ps);
      if (!product) continue;
      await prisma.companyProduct.upsert({
        where: {
          companyId_productId_relation: {
            companyId: company.id,
            productId: product.id,
            relation: "SUPPLIES",
          },
        },
        update: {},
        create: {
          companyId: company.id,
          productId: product.id,
          relation: "SUPPLIES",
        },
      });
    }

    // Attach 1–2 source citations per company
    const sources: { id: string; ref: string; factKind: "SOURCED" | "AI_DERIVED" }[] = [
      { id: srcIndiaMart.id, ref: "Marketplace listing (sample)", factKind: "SOURCED" },
      { id: srcFieoDirectory.id, ref: "FIEO member directory (sample anchor)", factKind: "AI_DERIVED" },
    ];
    for (const c of sources) {
      await prisma.companySource.upsert({
        where: {
          companyId_sourceId_reference: {
            companyId: company.id,
            sourceId: c.id,
            reference: c.ref,
          },
        },
        update: {},
        create: {
          companyId: company.id,
          sourceId: c.id,
          reference: c.ref,
          factKind: c.factKind,
        },
      });
    }
  }

  // --- Sample overseas buyers (BUYER) -------------------------------------
  // Placeholder buyer profiles. Production data must come from importer
  // directories, trade-show attendee lists, or verified B2B marketplace
  // profiles — never fabricated.
  const BUYERS = [
    {
      slug: "sample-german-importer-gmbh",
      name: "Sample German Importer GmbH",
      shortDescription:
        "Illustrative German importer of spices and food ingredients.",
      longDescription:
        "Placeholder buyer profile for a German food importer. In production, profiles should come from EBA-style directories, ANUGA exhibitor lists, or verified B2B listings.",
      country: "DE",
      countryName: "Germany",
      state: "Hamburg",
      city: "Hamburg",
      website: "https://example.org/sample-german-importer",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.alibaba.com/profile/sample-german-importer.html",
      businessType: "Importer & Distributor",
      yearEstablished: 1985,
      employeeBand: "50-200",
      annualRevenueBand: "USD 10-100M",
      certifications: "EU food importer registration\nIFS Broker",
      specialties: "Spices\nDry fruits\nSpecialty food ingredients",
      sourcingMarkets: "India\nVietnam\nSri Lanka",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "agriculture-food",
      productSlugs: ["turmeric-powder"],
    },
    {
      slug: "sample-us-distributor-llc",
      name: "Sample US Distributor LLC",
      shortDescription:
        "Illustrative US-based distributor of textiles and home goods.",
      longDescription:
        "Placeholder buyer profile for a US textile/home goods distributor. Production profiles should be sourced from verified buyer directories or trade-show attendee lists.",
      country: "US",
      countryName: "United States",
      state: "New York",
      city: "New York",
      website: "https://example.org/sample-us-distributor",
      email: null,
      phone: null,
      marketplaceUrl: "https://www.alibaba.com/profile/sample-us-distributor.html",
      businessType: "Distributor",
      yearEstablished: 2003,
      employeeBand: "10-50",
      annualRevenueBand: "USD 1-10M",
      certifications: null,
      specialties: "Cotton textiles\nHome goods\nMade-ups",
      sourcingMarkets: "India\nBangladesh\nPakistan",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "textiles-apparel",
      productSlugs: ["cotton-fabric-grey"],
    },
    {
      slug: "sample-uk-handicraft-retail",
      name: "Sample UK Handicraft Retail Ltd.",
      shortDescription:
        "Illustrative UK-based retailer of fair-trade handicrafts.",
      longDescription:
        "Placeholder buyer profile for a UK handicraft retailer. Production profiles should come from verified B2B directories (e.g. EBA member list, Top Drawer exhibitor list).",
      country: "GB",
      countryName: "United Kingdom",
      state: "England",
      city: "London",
      website: "https://example.org/sample-uk-handicraft",
      email: null,
      phone: null,
      marketplaceUrl: null,
      businessType: "Retailer",
      yearEstablished: 2010,
      employeeBand: "10-50",
      annualRevenueBand: "<USD 1M",
      certifications: "Fair Trade\nB Corp (sample)",
      specialties: "Handicrafts\nHome decor\nGifts",
      sourcingMarkets: "India\nIndonesia\nKenya",
      dataProvenance: "INFERRED",
      sectorSlug: "handicrafts",
      productSlugs: ["brass-decorative-items"],
    },
    {
      slug: "sample-uae-food-trading",
      name: "Sample UAE Food Trading Co.",
      shortDescription:
        "Illustrative UAE food-trading company sourcing from South Asia.",
      longDescription:
        "Placeholder buyer profile for a UAE food-trading company. Production profiles should come from Dubai Chamber of Commerce listings or Gulfood exhibitor lists.",
      country: "AE",
      countryName: "United Arab Emirates",
      state: "Dubai",
      city: "Dubai",
      website: "https://example.org/sample-uae-trading",
      email: null,
      phone: null,
      marketplaceUrl: null,
      businessType: "Importer & Wholesaler",
      yearEstablished: 1995,
      employeeBand: "50-200",
      annualRevenueBand: "USD 10-100M",
      certifications: null,
      specialties: "Rice\nSpices\nPulses",
      sourcingMarkets: "India\nPakistan\nBangladesh",
      dataProvenance: "PUBLIC_LISTING",
      sectorSlug: "agriculture-food",
      productSlugs: [],
    },
  ] as const;

  for (const b of BUYERS) {
    const sector = await findSector(b.sectorSlug);
    const company = await prisma.company.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        shortDescription: b.shortDescription,
        longDescription: b.longDescription,
        country: b.country,
        countryName: b.countryName,
        state: b.state,
        city: b.city,
        website: b.website,
        email: b.email,
        phone: b.phone,
        marketplaceUrl: b.marketplaceUrl,
        businessType: b.businessType,
        yearEstablished: b.yearEstablished,
        employeeBand: b.employeeBand,
        annualRevenueBand: b.annualRevenueBand,
        certifications: b.certifications ?? null,
        specialties: b.specialties,
        sourcingMarkets: b.sourcingMarkets,
        dataProvenance: b.dataProvenance,
        kind: "BUYER",
        sectorId: sector?.id ?? null,
        isSample: true,
      },
      create: {
        slug: b.slug,
        name: b.name,
        shortDescription: b.shortDescription,
        longDescription: b.longDescription,
        country: b.country,
        countryName: b.countryName,
        state: b.state,
        city: b.city,
        website: b.website,
        email: b.email,
        phone: b.phone,
        marketplaceUrl: b.marketplaceUrl,
        businessType: b.businessType,
        yearEstablished: b.yearEstablished,
        employeeBand: b.employeeBand,
        annualRevenueBand: b.annualRevenueBand,
        certifications: b.certifications ?? null,
        specialties: b.specialties,
        sourcingMarkets: b.sourcingMarkets,
        dataProvenance: b.dataProvenance,
        kind: "BUYER",
        sectorId: sector?.id ?? null,
        isSample: true,
      },
    });

    for (const ps of b.productSlugs) {
      const product = await findProduct(ps);
      if (!product) continue;
      await prisma.companyProduct.upsert({
        where: {
          companyId_productId_relation: {
            companyId: company.id,
            productId: product.id,
            relation: "SOURCES",
          },
        },
        update: {},
        create: {
          companyId: company.id,
          productId: product.id,
          relation: "SOURCES",
        },
      });
    }

    const sources: { id: string; ref: string; factKind: "SOURCED" | "AI_DERIVED" }[] =
      b.country === "DE" || b.country === "GB"
        ? [
            { id: srcEbaDirectory.id, ref: "European buying agencies directory (sample)", factKind: "SOURCED" },
            { id: srcAlibaba.id, ref: "B2B marketplace listing (sample)", factKind: "AI_DERIVED" },
          ]
        : [
            { id: srcAlibaba.id, ref: "B2B marketplace listing (sample)", factKind: "SOURCED" },
          ];
    for (const c of sources) {
      await prisma.companySource.upsert({
        where: {
          companyId_sourceId_reference: {
            companyId: company.id,
            sourceId: c.id,
            reference: c.ref,
          },
        },
        update: {},
        create: {
          companyId: company.id,
          sourceId: c.id,
          reference: c.ref,
          factKind: c.factKind,
        },
      });
    }
  }

  // --- Q&A documents ------------------------------------------------------
  // Short, citation-ready snippets covering Phase-2-style questions. The
  // Q&A endpoint will retrieve the most relevant of these and render them
  // verbatim with their source attached.
  const QA_DOCS = [
    {
      slug: "qa-handicrafts-low-capital",
      title: "Handicrafts with low capital entry",
      body:
        "Handicrafts (brassware, woodcraft, pottery, hand-printed textiles) typically require the lowest capital of any export category in the Indian catalog. Initial outlay is usually limited to a small workshop, basic tooling, and working capital for raw material and shipping. Demand is fragmented across dozens of destination countries (US, EU, Gulf, Japan, Australia), so a new exporter can enter with a small catalogue and a single online storefront. Most relevant Export Promotion Council: EPCH (Export Promotion Council for Handicrafts).",
      kind: "OVERVIEW",
      tags: "handicrafts\nlow capital\nsmall exporter\nEPCH\nexport promotion council",
      sourceId: srcFieoDirectory.id,
    },
    {
      slug: "qa-eco-friendly-packaging-suppliers",
      title: "Finding Indian manufacturers for eco-friendly packaging",
      body:
        "Eco-friendly packaging manufacturers in India cluster around industrial hubs in Maharashtra, Gujarat, Tamil Nadu, and Karnataka. Typical products include kraft paper bags, moulded-pulp inserts, corrugated boxes with high recycled content, and biodegradable films. The most common discovery channels are (1) the IndiaMART and TradeIndia listings, (2) the Indian Institute of Packaging (IIP) member directory, and (3) trade shows such as PackPlus and IndiaCorr Expo. Verify buyers always ask for FSC or SFI chain-of-custody documentation if the destination requires it.",
      kind: "SUPPLIER",
      tags: "eco-friendly packaging\nkraft paper\nbiodegradable\nmoulded pulp\nFSC\nIIP\nPackPlus\nIndiaMART",
      sourceId: srcIndiaMart.id,
    },
    {
      slug: "qa-germany-export-compliance",
      title: "Certifications required to export food products to Germany",
      body:
        "For food products entering Germany (and the wider EU market), the most common certification and compliance requirements are: (1) EU food importer registration under Regulation (EC) No 853/2004 for products of animal origin, (2) HACCP-based food safety management, (3) IFS or BRC Global Standard for Food recognised by the Global Food Safety Initiative (GFSI), (4) EU REACH compliance for any packaging or articles that come into contact with food, and (5) organic certification (EU 2018/848) if labelling the product as organic. Indian exporters should additionally hold FSSAI registration and, for seafood, MPEDA registration and the EU health certificate issued by the Export Inspection Council (EIC).",
      kind: "COMPLIANCE",
      tags: "Germany\nEU\nfood export\nREACH\nFSSAI\nHACCP\nIFS\nBRC\nGFSI\nMPEDA\nFSC\ncompliance\ncertification",
      sourceId: srcReachEcha.id,
    },
    {
      slug: "qa-japan-buyer-discovery",
      title: "Where to find Japanese buyers for Indian handicrafts",
      body:
        "Japanese buyers of Indian handicrafts are typically found through three channels: (1) trade shows — Asia's largest gift and home show, Gift Show Tokyo, and the Lifestyle Week Tokyo, both of which have an Indian pavilion organised by EPCH; (2) established B2B marketplaces with Japanese buyer bases (Alibaba, Global Sources) — the listings should be cross-checked for actual Japanese import volumes via JETRO trade statistics; and (3) Japanese importers' associations such as the Japan Imports Association. The most common fit issues are language (catalogues in English/Japanese), packaging (small, giftable formats), and quality consistency.",
      kind: "BUYER",
      tags: "Japan\nhandicrafts\nbuyers\ntrade shows\nJETRO\nTokyo\nGift Show\nEPCH\nB2B marketplace",
      sourceId: srcEbaDirectory.id,
    },
    {
      slug: "qa-eu-reach-chemicals",
      title: "EU REACH compliance for Indian chemical exporters",
      body:
        "REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals) is the EU regulation governing chemicals. Indian exporters placing substances on the EU market in quantities of one tonne or more per year must register with the European Chemicals Agency (ECHA). Substances in articles above one tonne per year also require communication down the supply chain. Common compliance mistakes by new Indian exporters: failing to appoint an Only Representative (OR) for non-EU manufacturers, and missing SVHC (Substances of Very High Concern) notification obligations when an article contains more than 0.1% w/w of an SVHC.",
      kind: "COMPLIANCE",
      tags: "EU\nREACH\nECHA\nchemicals\nSVHC\nOnly Representative\ncompliance",
      sourceId: srcReachEcha.id,
    },
    {
      slug: "qa-eco-friendly-packaging-eu",
      title: "Eco-friendly packaging exported to the European Union",
      body:
        "Eco-friendly packaging is one of the fastest-growing export categories from India. The most-cited compliance requirement is FSC Chain-of-Custody certification (Forest Stewardship Council) when claiming fibre-based packaging as sustainably sourced. For compostable or biodegradable claims, the European standard EN 13432 (industrial composting) or TUV/OK Compost HOME are commonly requested by EU buyers. Note: the EU Packaging and Packaging Waste Regulation (PPWR), finalised in 2024, tightens recycled-content and recyclability requirements from 2030 onwards; new exporters should plan for this in their product roadmap.",
      kind: "MARKET",
      tags: "eco-friendly packaging\nEU\nFSC\nEN 13432\ncompostable\nbiodegradable\nPPWR\nrecycled content",
      sourceId: srcReachEcha.id,
    },
    {
      slug: "qa-marine-products-eu",
      title: "Marine products and seafood exports to the EU",
      body:
        "Indian marine product exports to the EU require (1) MPEDA registration of the processing plant, (2) approval by the Export Inspection Council (EIC) and inclusion in the EU's list of approved establishments, (3) a health certificate issued by EIC for each consignment, and (4) traceability under the catch-certificate scheme. Indian exporters should also be aware of the EU IUU (Illegal, Unreported and Unregulated) fishing regulation. Common buyer concerns: antibiotic residues and heavy-metal contamination; labs notified by EIC are the standard test pathway.",
      kind: "COMPLIANCE",
      tags: "seafood\nmarine products\nEU\nMPEDA\nEIC\nIUU\nhealth certificate\ntraceability\ncompliance",
      sourceId: srcMpdeaGov.id,
    },
    {
      slug: "qa-apeda-overview",
      title: "APEDA and agricultural product exports",
      body:
        "APEDA (Agricultural and Processed Food Products Export Development Authority) is the apex body for agricultural and processed food exports from India. It is responsible for registration of exporters, setting quality standards, market development, and promotion of Indian agri products abroad. APEDA also runs the Agri Export Zones (AEZ) scheme. For an aspiring exporter, registering with APEDA is typically the first step for any product under its purview (fruits & vegetables, processed foods, floriculture, basmati rice, etc.).",
      kind: "OVERVIEW",
      tags: "APEDA\nagriculture\nexporter registration\nexport zones\nAEZ\nbasmati\nprocessed food",
      sourceId: srcApedaGov.id,
    },
    {
      slug: "qa-bis-standards-textiles",
      title: "BIS standards and Indian textile exports",
      body:
        "The Bureau of Indian Standards (BIS) is the national standards body. For textile exports, BIS publishes standards covering fibre content, dimensional stability, colour fastness, and safety. Many destinations accept BIS-tested goods as a quality baseline. For high-end markets (EU, US, Japan), buyers will typically require OEKO-TEX Standard 100 or the Global Recycled Standard in addition to BIS. New exporters should align their internal QA with both BIS and the destination's own standard to avoid being rejected at inspection.",
      kind: "COMPLIANCE",
      tags: "BIS\ntextiles\nexport standards\nOEKO-TEX\nGlobal Recycled Standard\nquality\ncompliance",
      sourceId: srcBisGov.id,
    },
    {
      slug: "qa-spices-export",
      title: "Spice exports from India — markets and compliance",
      body:
        "India is the world's largest exporter of spices by volume, with major markets in the US, EU, Vietnam, UAE, and Saudi Arabia. The Spices Board of India (under the Ministry of Commerce) is the apex body for spice exports. Key compliance requirements vary by destination: (1) US — FDA prior notice and compliance with the Food Safety Modernization Act (FSMA) Foreign Supplier Verification Program (FSVP); (2) EU — Regulation (EC) No 396/2005 on Maximum Residue Levels (MRLs) for pesticides, and increasingly EU 2023/915 on contaminants; (3) Gulf — GSO/SASO standards and the SFDA/ESMA food-safety registrations. Indian exporters should also be aware of aflatoxin limits, which are typically tested per consignment.",
      kind: "MARKET",
      tags: "spices\nSpices Board\nFDA\nFSMA\nEU\nMRL\naflatoxin\nGulf\nGSO\npesticide residue",
      sourceId: srcApedaGov.id,
    },
  ] as const;

  for (const q of QA_DOCS) {
    await prisma.qaDocument.upsert({
      where: { id: q.slug },
      update: {
        title: q.title,
        body: q.body,
        kind: q.kind,
        tags: q.tags,
        sourceId: q.sourceId,
        isSample: true,
      },
      create: {
        id: q.slug,
        title: q.title,
        body: q.body,
        kind: q.kind,
        tags: q.tags,
        sourceId: q.sourceId,
        isSample: true,
      },
    });
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
