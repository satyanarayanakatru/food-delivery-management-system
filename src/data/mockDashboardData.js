export const INITIAL_DASHBOARD_STATS = {
  totalRestaurants: 38,
  restaurantsChange: '+4 this month',
  totalFoodItems: 284,
  foodItemsChange: '+18 new dishes',
  totalOrders: 1489,
  ordersChange: '+14.2% vs last week',
  activeOrders: 24,
  activeChange: '6 out for delivery',
  deliveredOrders: 1418,
  deliveredRate: '95.2% success rate',
  totalCustomers: 3820,
  customersChange: '+340 this month',
  revenueSummary: {
    totalRevenue: 48790,
    growthRate: '+18.6%',
    currency: '$',
    period: 'This Month'
  }
}

export const REVENUE_DATA_WEEKLY = [
  { label: 'Mon', revenue: 4200, orders: 130 },
  { label: 'Tue', revenue: 5100, orders: 154 },
  { label: 'Wed', revenue: 4800, orders: 142 },
  { label: 'Thu', revenue: 6300, orders: 195 },
  { label: 'Fri', revenue: 8900, orders: 260 },
  { label: 'Sat', revenue: 11400, orders: 320 },
  { label: 'Sun', revenue: 9800, orders: 288 },
]

export const REVENUE_DATA_MONTHLY = [
  { label: 'Week 1', revenue: 28400, orders: 860 },
  { label: 'Week 2', revenue: 34100, orders: 990 },
  { label: 'Week 3', revenue: 39500, orders: 1120 },
  { label: 'Week 4', revenue: 48790, orders: 1489 },
]

export const INITIAL_RECENT_ORDERS = [
  {
    id: 'FD-7892',
    customer: {
      name: 'Sophia Bennett',
      email: 'sophia.b@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-8901',
      address: '452 Ocean Parkway, Apt 4B'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Neapolitan Truffle Margherita', qty: 2, price: 18.5 },
      { name: 'Garlic Herb Dough Knots', qty: 1, price: 7.0 }
    ],
    totalAmount: 44.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    placedAt: '8 mins ago',
    estimatedDelivery: '14 mins',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7891',
    customer: {
      name: 'David Chen',
      email: 'd.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 432-1098',
      address: '890 Riverside Drive'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Spicy Tonkotsu Ramen Special', qty: 2, price: 16.5 },
      { name: 'Pan-fried Pork Gyoza', qty: 1, price: 8.0 }
    ],
    totalAmount: 41.0,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    placedAt: '16 mins ago',
    estimatedDelivery: '22 mins',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7890',
    customer: {
      name: 'Emma Watson',
      email: 'emma.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-9012',
      address: '124 Elm Street, Suite 2'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Ahi Tuna Crunch Bowl', qty: 1, price: 17.5 },
      { name: 'Organic Matcha Iced Latte', qty: 1, price: 5.5 }
    ],
    totalAmount: 23.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: '38 mins ago',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7889',
    customer: {
      name: 'Liam Miller',
      email: 'liam.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-6789',
      address: '77 Lexington Avenue'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'Smoked Beef Brisket Platter', qty: 1, price: 26.0 },
      { name: 'Crispy Mac & Cheese Bites', qty: 1, price: 8.5 }
    ],
    totalAmount: 34.5,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: '1 hour ago',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7888',
    customer: {
      name: 'Olivia Martinez',
      email: 'olivia.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-0124',
      address: '320 Sunset Boulevard'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Double Bacon Cheddar Smash', qty: 2, price: 15.0 },
      { name: 'Parmesan Truffle Fries', qty: 1, price: 6.5 }
    ],
    totalAmount: 36.5,
    paymentMethod: 'Wallet Balance',
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    placedAt: '2 hours ago',
    estimatedDelivery: 'Cancelled by customer',
    rider: 'Unassigned'
  },
  {
    id: 'FD-7887',
    customer: {
      name: 'James Wilson',
      email: 'james.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 901-2345',
      address: '512 Beacon Street'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Pad Thai with Jumbo Prawns', qty: 1, price: 16.0 },
      { name: 'Crispy Vegetable Spring Rolls', qty: 1, price: 6.0 }
    ],
    totalAmount: 22.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: '3 hours ago',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  }
]
