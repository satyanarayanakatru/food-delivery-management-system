// ─── Coupon Codes ────────────────────────────────────────────────────────────
export const COUPONS = [
  {
    code: 'WELCOME50',
    type: 'percent',
    value: 50,
    minOrder: 10,
    maxDiscount: 15,
    description: '50% off on your first order',
    expiry: '2027-12-31',
    isActive: true,
    category: 'new_user',
    usageLimit: 1,
    emoji: '🎉'
  },
  {
    code: 'SAVE20',
    type: 'percent',
    value: 20,
    minOrder: 25,
    maxDiscount: 10,
    description: '20% off on orders above $25',
    expiry: '2027-12-31',
    isActive: true,
    category: 'general',
    usageLimit: null,
    emoji: '💰'
  },
  {
    code: 'FLAT5',
    type: 'flat',
    value: 5,
    minOrder: 20,
    maxDiscount: 5,
    description: 'Flat $5 off on orders above $20',
    expiry: '2027-12-31',
    isActive: true,
    category: 'general',
    usageLimit: null,
    emoji: '🎁'
  },
  {
    code: 'FREESHIP',
    type: 'free_delivery',
    value: 0,
    minOrder: 15,
    maxDiscount: 2.99,
    description: 'Free delivery on orders above $15',
    expiry: '2027-12-31',
    isActive: true,
    category: 'delivery',
    usageLimit: null,
    emoji: '🚚'
  },
  {
    code: 'WEEKEND30',
    type: 'percent',
    value: 30,
    minOrder: 30,
    maxDiscount: 12,
    description: '30% off on weekend orders',
    expiry: '2027-12-31',
    isActive: true,
    category: 'seasonal',
    usageLimit: null,
    emoji: '🌟'
  },
  {
    code: 'PIZZA15',
    type: 'percent',
    value: 15,
    minOrder: 18,
    maxDiscount: 8,
    description: '15% off on pizza orders',
    expiry: '2027-12-31',
    isActive: true,
    category: 'category',
    usageLimit: null,
    emoji: '🍕'
  }
]

// ─── Payment Methods ──────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: 'CreditCard',
    badge: 'Most Secure',
    badgeColor: 'emerald',
    isPopular: true
  },
  {
    id: 'upi',
    name: 'UPI / Digital Wallet',
    description: 'Instant transfer via UPI ID',
    icon: 'Smartphone',
    badge: 'Instant',
    badgeColor: 'blue',
    isPopular: false
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when order arrives',
    icon: 'Banknote',
    badge: 'No Fees',
    badgeColor: 'orange',
    isPopular: false
  },
  {
    id: 'wallet',
    name: 'FoodBite Wallet',
    description: 'Balance: $42.50 available',
    icon: 'Wallet',
    badge: 'Cashback 5%',
    badgeColor: 'purple',
    isPopular: false
  }
]

// ─── Saved Cards (Demo) ───────────────────────────────────────────────────────
export const SAVED_CARDS = [
  {
    id: 'card-01',
    type: 'visa',
    last4: '4242',
    expiry: '12/26',
    holder: 'Alex Johnson',
    isDefault: true
  },
  {
    id: 'card-02',
    type: 'mastercard',
    last4: '5555',
    expiry: '08/25',
    holder: 'Alex Johnson',
    isDefault: false
  }
]

// ─── Admin: Transaction History ───────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-001',
    orderId: 'ORD-9842',
    customer: 'Katru Satyanarayana',
    amount: 34.50,
    method: 'card',
    status: 'success',
    coupon: 'SAVE20',
    discount: 8.62,
    timestamp: '2026-11-11T09:15:00Z',
    restaurant: 'Artisan Crust Pizza'
  },
  {
    id: 'TXN-002',
    orderId: 'ORD-9843',
    customer: 'John Smith',
    amount: 22.80,
    method: 'upi',
    status: 'success',
    coupon: null,
    discount: 0,
    timestamp: '2026-11-11T09:42:00Z',
    restaurant: 'Burger Republic'
  },
  {
    id: 'TXN-003',
    orderId: 'ORD-9844',
    customer: 'Emily Rose',
    amount: 18.60,
    method: 'wallet',
    status: 'success',
    coupon: 'FREESHIP',
    discount: 2.99,
    timestamp: '2026-11-11T10:08:00Z',
    restaurant: 'Sushi Zen Garden'
  },
  {
    id: 'TXN-004',
    orderId: 'ORD-9845',
    customer: 'Mark Davis',
    amount: 45.20,
    method: 'card',
    status: 'failed',
    coupon: null,
    discount: 0,
    timestamp: '2026-11-11T10:34:00Z',
    restaurant: 'Thai Orchid Kitchen'
  },
  {
    id: 'TXN-005',
    orderId: 'ORD-9846',
    customer: 'Priya Sharma',
    amount: 29.90,
    method: 'cod',
    status: 'pending',
    coupon: 'FLAT5',
    discount: 5.00,
    timestamp: '2026-11-11T11:00:00Z',
    restaurant: 'Spice Route India'
  },
  {
    id: 'TXN-006',
    orderId: 'ORD-9847',
    customer: 'Carlos Mendez',
    amount: 55.00,
    method: 'card',
    status: 'success',
    coupon: 'WELCOME50',
    discount: 15.00,
    timestamp: '2026-11-11T11:22:00Z',
    restaurant: 'Artisan Crust Pizza'
  },
  {
    id: 'TXN-007',
    orderId: 'ORD-9848',
    customer: 'Aisha Patel',
    amount: 38.75,
    method: 'upi',
    status: 'success',
    coupon: 'WEEKEND30',
    discount: 12.00,
    timestamp: '2026-11-11T11:49:00Z',
    restaurant: 'Green Bowl Vegan'
  },
  {
    id: 'TXN-008',
    orderId: 'ORD-9849',
    customer: 'Jake Wilson',
    amount: 16.40,
    method: 'wallet',
    status: 'refunded',
    coupon: null,
    discount: 0,
    timestamp: '2026-11-11T12:10:00Z',
    restaurant: 'Burger Republic'
  }
]

// ─── Admin: Payment Analytics Summary ────────────────────────────────────────
export const PAYMENT_ANALYTICS = {
  totalRevenue: 48790,
  todayRevenue: 3842.60,
  totalTransactions: 1489,
  successRate: 94.8,
  avgOrderValue: 32.76,
  couponUsageRate: 38.2,
  methodBreakdown: [
    { method: 'Credit / Debit Card', percentage: 52, amount: 25371, count: 774, color: '#10b981' },
    { method: 'UPI / Digital Wallet', percentage: 28, amount: 13661, count: 417, color: '#3b82f6' },
    { method: 'Cash on Delivery', percentage: 12, amount: 5855, count: 179, color: '#f97316' },
    { method: 'FoodBite Wallet', percentage: 8, amount: 3903, count: 119, color: '#a855f7' }
  ],
  couponStats: [
    { code: 'SAVE20', uses: 342, totalSavings: 3420, revenue: 25150 },
    { code: 'WELCOME50', uses: 218, totalSavings: 2726, revenue: 10840 },
    { code: 'FREESHIP', uses: 196, totalSavings: 585, revenue: 7840 },
    { code: 'WEEKEND30', uses: 134, totalSavings: 1540, revenue: 6210 },
    { code: 'FLAT5', uses: 112, totalSavings: 560, revenue: 4680 },
    { code: 'PIZZA15', uses: 88, totalSavings: 614, revenue: 3250 }
  ],
  revenueWeekly: [
    { day: 'Mon', revenue: 5240, refunds: 120 },
    { day: 'Tue', revenue: 6180, refunds: 90 },
    { day: 'Wed', revenue: 5890, refunds: 150 },
    { day: 'Thu', revenue: 7340, refunds: 80 },
    { day: 'Fri', revenue: 9820, refunds: 200 },
    { day: 'Sat', revenue: 12410, refunds: 310 },
    { day: 'Sun', revenue: 10670, refunds: 280 }
  ]
}
