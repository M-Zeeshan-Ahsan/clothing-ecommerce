export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nishat Boski Suit",
    price: 5480,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    category: "Lawn",
    badge: "New",
  },
  {
    id: 2,
    name: "Nishat China Boski",
    price: 5480,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    category: "Boski",
  },
  {
    id: 3,
    name: "Grace Men Suit",
    price: 5000,
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=80",
    category: "Men",
  },
  {
    id: 4,
    name: "Men Wash Wear",
    price: 5500,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    category: "Wash Wear",
    badge: "Sale",
  },
  {
    id: 5,
    name: "Edenrobe Premium",
    price: 3450,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    category: "Men",
  },
  {
    id: 6,
    name: "Premium Cotton Suit",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    category: "Cotton",
  },
];
