export interface CategoryItem {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'for-you',
    name: 'For You',
    slug: 'all',
    icon: '✨',
    description: 'Personalized picks, deals & trending campus essentials',
    count: 24,
  },
  {
    id: 'merch',
    name: 'Varsity Merch',
    slug: 'merch',
    icon: '👕',
    description: 'Official BUP winter hoodies, varsity jackets, badges & caps',
    count: 8,
  },
  {
    id: 'books-notes',
    name: 'Books & Notes',
    slug: 'books-notes',
    icon: '📚',
    description: 'Faculty-approved textbooks, solved past midterms & notes',
    count: 12,
  },
  {
    id: 'canteen',
    name: 'Canteen',
    slug: 'canteen',
    icon: '🍛',
    description: 'Central Canteen daily lunch sets, hot bhuna khichuri & ilish',
    count: 6,
  },
  {
    id: 'coffee-snacks',
    name: 'Coffee & Snacks',
    slug: 'coffee-snacks',
    icon: '☕',
    description: 'Lake Promenade slow cold brews, tea, bakery & evening munchies',
    count: 7,
  },
  {
    id: 'stationery',
    name: 'Stationery',
    slug: 'stationery',
    icon: '✒️',
    description: 'BUP embossed journals, drafting kits, calculators & pens',
    count: 9,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: '💻',
    description: 'Calculators, wireless ANC earbuds, powerbanks & flash drives',
    count: 6,
  },
  {
    id: 'stalls',
    name: 'Stall Spaces',
    slug: 'stalls',
    icon: '🎪',
    description: 'Book lakeside promenade pop-up stalls & club exhibition desks',
    count: 9,
  },
  {
    id: 'services',
    name: 'Services',
    slug: 'services',
    icon: '🛠️',
    description: 'Thesis printing, poster binding, bike pool & lost-and-found',
    count: 5,
  },
]
