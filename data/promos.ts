export interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  highlight: string
  ctaText: string
  ctaLink: string
  bgGradient: string
  badgeText: string
  image: string
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'BUP Winter Varsity Hoodie Drop',
    subtitle: 'Heavyweight 380 GSM combed fleece with embroidered gold crest.',
    highlight: 'Min. 20% Off for Registered Students',
    ctaText: 'Shop Winter Merch',
    ctaLink: '/marketplace?category=Merch',
    bgGradient: 'from-[#1f3a2e] via-[#264738] to-[#12231b]',
    badgeText: 'Official Campus Drop',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-2',
    title: 'Lake Promenade Special Catch',
    subtitle: 'Crispy fried Padma Ilish & spicy mustard bhuna khichuri platter.',
    highlight: 'Daily Fresh Catch • Central Lake Deck',
    ctaText: 'Order Canteen Special',
    ctaLink: '/marketplace?category=Dining+%26+Canteen',
    bgGradient: 'from-[#2b1810] via-[#522b1c] to-[#1a0e0a]',
    badgeText: 'Chef’s Daily Special',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-3',
    title: 'Skip Canteen Queues with Pre-Order',
    subtitle: 'Warm snacks, matir-bhaar milk tea & cold brew waiting at your break.',
    highlight: 'Ready in 10 Mins • Zero Waiting',
    ctaText: 'Pre-Order Lunch',
    ctaLink: '/marketplace?category=Coffee+%26+Snacks',
    bgGradient: 'from-[#1a2f26] via-[#1f3a2e] to-[#2e422b]',
    badgeText: 'Campus Express',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'slide-4',
    title: 'Book a Lakeside Pop-up Stall',
    subtitle: 'Central Lake boardwalk & FST concourse spaces for student clubs & enterprise.',
    highlight: 'From ৳320/Day • 4,500+ Student Footfall',
    ctaText: 'Reserve Space Now',
    ctaLink: '/stall-spaces',
    bgGradient: 'from-[#b5573a] via-[#8c3e26] to-[#592313]',
    badgeText: 'Prime Commercial Zones',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  },
]

export interface PromoCard {
  id: string
  title: string
  subtitle: string
  discount: string
  category: string
  link: string
  image: string
  accentColor: string
}

export const PROMO_CARDS: PromoCard[] = [
  {
    id: 'promo-1',
    title: 'Winter Merch Flash Sale',
    subtitle: 'Hoodies, varsity caps & badges',
    discount: 'Min. 30% Off',
    category: 'Merch',
    link: '/marketplace?category=Merch',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    accentColor: '#1f3a2e',
  },
  {
    id: 'promo-2',
    title: 'Midterm Solved Notes',
    subtitle: 'FST & FBS topper guides',
    discount: 'Up to 40% Off',
    category: 'Books & Notes',
    link: '/marketplace?category=Books+%26+Notes',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    accentColor: '#b5573a',
  },
  {
    id: 'promo-3',
    title: 'Canteen Daily Combos',
    subtitle: 'Khichuri, tea & afternoon adda',
    discount: 'Under ৳199',
    category: 'Canteen',
    link: '/marketplace?category=Dining+%26+Canteen',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    accentColor: '#2b3a1a',
  },
  {
    id: 'promo-4',
    title: 'Pop-up Stall Spaces',
    subtitle: 'Prime Central Lake spots',
    discount: 'Save 25% on Weekends',
    category: 'Stalls',
    link: '/stall-spaces',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    accentColor: '#362118',
  },
]
