export const INITIAL_DASHBOARD_STATS = {
  totalRestaurants: 20,
  restaurantsChange: '+4 this month',
  totalFoodItems: 30,
  foodItemsChange: '+6 new dishes',
  totalOrders: 44,
  ordersChange: '+18.4% vs last week',
  activeOrders: 7,
  activeChange: '3 out for delivery',
  deliveredOrders: 35,
  deliveredRate: '95.5% fulfillment rate',
  totalCustomers: 18,
  customersChange: '+8 new diners',
  revenueSummary: {
    totalRevenue: 1522,
    growthRate: '+19.2%',
    currency: '$',
    period: 'This Week'
  }
}

export const INITIAL_RECENT_ORDERS = [
  // ─── SUNDAY (4 Orders) ────────────────────────────────────────────────────────
  {
    id: 'FD-7901',
    day: 'Sun',
    customer: {
      name: 'Sophia Bennett',
      email: 'sophia.b@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-8901',
      address: '452 Ocean Parkway, Apt 4B'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Neapolitan Truffle Margherita', qty: 1, price: 24.5 },
      { name: 'Garlic Herb Dough Knots', qty: 2, price: 7.0 }
    ],
    totalAmount: 38.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Sunday 12:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7902',
    day: 'Sun',
    customer: {
      name: 'Emma Watson',
      email: 'emma.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-9012',
      address: '124 Elm Street, Suite 2'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Ahi Tuna Crunch Bowl', qty: 1, price: 18.0 },
      { name: 'Organic Matcha Iced Latte', qty: 1, price: 6.0 }
    ],
    totalAmount: 24.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Sunday 2:15 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7903',
    day: 'Sun',
    customer: {
      name: 'James Wilson',
      email: 'james.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 901-2345',
      address: '512 Beacon Street'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Pad Thai with Jumbo Prawns', qty: 1, price: 21.5 },
      { name: 'Crispy Vegetable Spring Rolls', qty: 1, price: 8.0 }
    ],
    totalAmount: 29.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Sunday 6:40 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7904',
    day: 'Sun',
    customer: {
      name: 'Liam Miller',
      email: 'liam.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-6789',
      address: '77 Lexington Avenue'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'Smoked Beef Brisket Platter', qty: 1, price: 32.0 },
      { name: 'Crispy Mac & Cheese Bites', qty: 1, price: 10.0 }
    ],
    totalAmount: 42.0,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Sunday 8:10 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },

  // ─── MONDAY (2 Orders) ────────────────────────────────────────────────────────
  {
    id: 'FD-7905',
    day: 'Mon',
    customer: {
      name: 'David Chen',
      email: 'd.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 432-1098',
      address: '890 Riverside Drive'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Spicy Tonkotsu Ramen Special', qty: 2, price: 18.0 }
    ],
    totalAmount: 36.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Monday 1:15 PM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7906',
    day: 'Mon',
    customer: {
      name: 'Katru Satyanarayana',
      email: 'satyanarayanayadav50@gmail.com',
      avatar: '/satyanarayana.jpg',
      phone: '+91 8179795623',
      address: 'Plot No. 42, Sri Sai Nagar, Madhapur, Hyderabad'
    },
    restaurant: "Luigi's Artisan Trattoria",
    items: [
      { name: 'Fettuccine Truffle Alfredo', qty: 1, price: 22.0 },
      { name: 'Rosemary Garlic Focaccia', qty: 1, price: 6.5 }
    ],
    totalAmount: 28.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Monday 7:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },

  // ─── TUESDAY (7 Orders) ───────────────────────────────────────────────────────
  {
    id: 'FD-7907',
    day: 'Tue',
    customer: {
      name: 'Aiden Reed',
      email: 'aiden.r@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 765-4321',
      address: '210 Sunset Blvd'
    },
    restaurant: 'Taj Royal Palace',
    items: [
      { name: 'Butter Chicken & Biryani Feast', qty: 1, price: 35.0 },
      { name: 'Garlic Butter Naan Basket', qty: 1, price: 10.0 }
    ],
    totalAmount: 45.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 12:10 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7908',
    day: 'Tue',
    customer: {
      name: 'Chloe Evans',
      email: 'chloe.e@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 876-5432',
      address: '99 Market Street'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Double Bacon Cheddar Smash', qty: 1, price: 22.0 },
      { name: 'Parmesan Truffle Fries', qty: 1, price: 10.0 }
    ],
    totalAmount: 32.0,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 1:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7909',
    day: 'Tue',
    customer: {
      name: 'Lucas King',
      email: 'lucas.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 987-6543',
      address: '55 Park Avenue'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Neapolitan Truffle Margherita', qty: 1, price: 27.5 },
      { name: 'Italian Tiramisu Cup', qty: 1, price: 12.0 }
    ],
    totalAmount: 39.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 3:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7910',
    day: 'Tue',
    customer: {
      name: 'Maya Lin',
      email: 'maya.l@example.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-1122',
      address: '33 Maple Court'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Pan-fried Pork Gyoza Bento', qty: 1, price: 18.5 },
      { name: 'Iced Jasmine Green Tea', qty: 1, price: 8.0 }
    ],
    totalAmount: 26.5,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 5:15 PM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7911',
    day: 'Tue',
    customer: {
      name: 'Oliver Brown',
      email: 'oliver.b@example.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-2233',
      address: '18 West End Avenue'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Organic Acai Berry Bowl', qty: 1, price: 15.0 },
      { name: 'Fresh Cold Pressed Orange Juice', qty: 1, price: 6.0 }
    ],
    totalAmount: 21.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 6:45 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7912',
    day: 'Tue',
    customer: {
      name: 'Nathan Drake',
      email: 'nathan.d@example.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 456-3344',
      address: '770 Broadway'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'Smokey Bandit BBQ Ribs Full Rack', qty: 1, price: 38.0 },
      { name: 'Crispy Truffle Slaw & Fries', qty: 1, price: 10.0 }
    ],
    totalAmount: 48.0,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 8:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7913',
    day: 'Tue',
    customer: {
      name: 'Hannah Abbott',
      email: 'hannah.a@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 567-4455',
      address: '142 Chestnut Street'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Pad Thai Jumbo Prawns', qty: 1, price: 21.0 },
      { name: 'Crispy Veg Spring Rolls', qty: 1, price: 6.0 }
    ],
    totalAmount: 27.0,
    paymentMethod: 'UPI / PhonePe',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Tuesday 9:15 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },

  // ─── WEDNESDAY (1 Order) ──────────────────────────────────────────────────────
  {
    id: 'FD-7914',
    day: 'Wed',
    customer: {
      name: 'Katru Satyanarayana',
      email: 'satyanarayanayadav50@gmail.com',
      avatar: '/satyanarayana.jpg',
      phone: '+91 8179795623',
      address: 'Plot No. 42, Sri Sai Nagar, Madhapur, Hyderabad'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Artisan BBQ Bacon Burger', qty: 1, price: 22.0 },
      { name: 'Parmesan Truffle Fries', qty: 1, price: 7.5 }
    ],
    totalAmount: 29.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Wednesday 1:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },

  // ─── THURSDAY (12 Orders) ─────────────────────────────────────────────────────
  {
    id: 'FD-7915',
    day: 'Thu',
    customer: {
      name: 'Zoe Kravitz',
      email: 'zoe.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-5566',
      address: '12 Franklin Street'
    },
    restaurant: "Luigi's Artisan Trattoria",
    items: [
      { name: 'Truffle Mushroom Risotto', qty: 1, price: 28.0 },
      { name: 'Garlic Focaccia', qty: 1, price: 10.0 }
    ],
    totalAmount: 38.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 11:30 AM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7916',
    day: 'Thu',
    customer: {
      name: 'Ethan Hunt',
      email: 'ethan.h@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-6677',
      address: '400 Mission Street'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Spicy Tonkotsu Ramen Special', qty: 1, price: 22.5 },
      { name: 'Pan-fried Pork Gyoza', qty: 1, price: 12.0 }
    ],
    totalAmount: 34.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 12:15 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7917',
    day: 'Thu',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 890-7788',
      address: '88 Lexington Avenue'
    },
    restaurant: 'Taj Royal Palace',
    items: [
      { name: 'Butter Chicken Gourmet Bowl', qty: 1, price: 32.0 },
      { name: 'Garlic Naan & Mango Lassi', qty: 1, price: 10.0 }
    ],
    totalAmount: 42.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 1:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7918',
    day: 'Thu',
    customer: {
      name: 'Ryan Gosling',
      email: 'ryan.g@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 901-8899',
      address: '500 Sunset Boulevard'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Pepperoni Deep Dish Specialty', qty: 1, price: 29.5 },
      { name: 'Herb Mozzarella Sticks', qty: 1, price: 7.0 }
    ],
    totalAmount: 36.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 1:45 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7919',
    day: 'Thu',
    customer: {
      name: 'Kylie Jenner',
      email: 'kylie.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 012-9900',
      address: '100 Rodeo Drive'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Grilled Salmon Teriyaki Bowl', qty: 1, price: 32.0 },
      { name: 'Fresh Green Smoothie', qty: 1, price: 9.0 }
    ],
    totalAmount: 41.0,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 2:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7920',
    day: 'Thu',
    customer: {
      name: 'Chris Evans',
      email: 'chris.e@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 123-0011',
      address: '22 Beacon Hill'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Classic Cheeseburger', qty: 1, price: 18.0 },
      { name: 'Crispy Onion Rings & Dip', qty: 1, price: 7.5 }
    ],
    totalAmount: 25.5,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 3:45 PM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7921',
    day: 'Thu',
    customer: {
      name: 'Jessica Alba',
      email: 'jessica.a@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-1123',
      address: '350 Ocean View'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Tacos Al Pastor Platter', qty: 1, price: 21.0 },
      { name: 'Guacamole & Crisp Tortillas', qty: 1, price: 7.0 }
    ],
    totalAmount: 28.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 4:50 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7922',
    day: 'Thu',
    customer: {
      name: 'Tom Holland',
      email: 'tom.h@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-2234',
      address: '77 Queens Boulevard'
    },
    restaurant: 'Taj Royal Palace',
    items: [
      { name: 'Chicken Tikka Masala Platter', qty: 1, price: 29.5 },
      { name: 'Butter Garlic Roti', qty: 2, price: 8.0 }
    ],
    totalAmount: 37.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 6:10 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7923',
    day: 'Thu',
    customer: {
      name: 'Zendaya Coleman',
      email: 'zendaya.c@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 456-3345',
      address: '888 Hollywood Way'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Woodfire Margherita', qty: 1, price: 21.0 },
      { name: 'Tomato Basil Bruschetta', qty: 1, price: 10.0 }
    ],
    totalAmount: 31.0,
    paymentMethod: 'UPI / PhonePe',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 7:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7924',
    day: 'Thu',
    customer: {
      name: 'Robert Downey',
      email: 'robert.d@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 567-4456',
      address: '10880 Malibu Point'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Mediterranean Falafel Wrap', qty: 1, price: 16.5 },
      { name: 'Crisp Hummus & Pita', qty: 1, price: 6.0 }
    ],
    totalAmount: 22.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 7:45 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7925',
    day: 'Thu',
    customer: {
      name: 'Scarlett Johansson',
      email: 'scarlett.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-5567',
      address: '42 Wall Street'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'BBQ Pulled Pork Sandwich', qty: 1, price: 24.0 },
      { name: 'Loaded Macaroni Bites', qty: 1, price: 9.0 }
    ],
    totalAmount: 33.0,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 8:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7926',
    day: 'Thu',
    customer: {
      name: 'Mark Ruffalo',
      email: 'mark.r@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-6678',
      address: '15 Central Park West'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Organic Matcha Iced Latte', qty: 1, price: 7.5 },
      { name: 'Wild Berry Acai Bowl', qty: 1, price: 17.0 }
    ],
    totalAmount: 24.5,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Thursday 9:20 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },

  // ─── FRIDAY (10 Orders) ───────────────────────────────────────────────────────
  {
    id: 'FD-7927',
    day: 'Fri',
    customer: {
      name: 'Sophia Bennett',
      email: 'sophia.b@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-8901',
      address: '452 Ocean Parkway'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Deluxe Seafood Paella Feast', qty: 1, price: 42.0 },
      { name: 'Crisp Garlic Crostini', qty: 1, price: 10.0 }
    ],
    totalAmount: 52.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    placedAt: '12 mins ago',
    estimatedDelivery: '20 mins',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7928',
    day: 'Fri',
    customer: {
      name: 'David Chen',
      email: 'd.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 432-1098',
      address: '890 Riverside Drive'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Wagyu Smash Double Burger', qty: 1, price: 34.0 },
      { name: 'Parmesan Truffle Fries', qty: 1, price: 10.0 }
    ],
    totalAmount: 44.0,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    placedAt: '18 mins ago',
    estimatedDelivery: '10 mins',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7929',
    day: 'Fri',
    customer: {
      name: 'Emma Watson',
      email: 'emma.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-9012',
      address: '124 Elm Street'
    },
    restaurant: "Luigi's Artisan Trattoria",
    items: [
      { name: 'Brick Oven Prosciutto Pizza', qty: 1, price: 29.0 },
      { name: 'Caprese Salad Skewers', qty: 1, price: 10.0 }
    ],
    totalAmount: 39.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    placedAt: '25 mins ago',
    estimatedDelivery: '25 mins',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7930',
    day: 'Fri',
    customer: {
      name: 'Liam Miller',
      email: 'liam.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-6789',
      address: '77 Lexington Avenue'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Dragon Roll & Sashimi Set', qty: 1, price: 38.5 },
      { name: 'Miso Soup & Edamame', qty: 1, price: 10.0 }
    ],
    totalAmount: 48.5,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    placedAt: '35 mins ago',
    estimatedDelivery: '8 mins',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7931',
    day: 'Fri',
    customer: {
      name: 'Olivia Martinez',
      email: 'olivia.m@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-0124',
      address: '320 Sunset Boulevard'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'Smoked Brisket & Cornbread', qty: 1, price: 36.0 },
      { name: 'Loaded Mac & Cheese', qty: 1, price: 10.0 }
    ],
    totalAmount: 46.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    placedAt: '40 mins ago',
    estimatedDelivery: '30 mins',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7932',
    day: 'Fri',
    customer: {
      name: 'James Wilson',
      email: 'james.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 901-2345',
      address: '512 Beacon Street'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Pad Thai with Jumbo Prawns', qty: 1, price: 24.0 },
      { name: 'Coconut Mango Smoothie', qty: 1, price: 8.0 }
    ],
    totalAmount: 32.0,
    paymentMethod: 'UPI / PhonePe',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    placedAt: '50 mins ago',
    estimatedDelivery: '12 mins',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7933',
    day: 'Fri',
    customer: {
      name: 'Katru Satyanarayana',
      email: 'satyanarayanayadav50@gmail.com',
      avatar: '/satyanarayana.jpg',
      phone: '+91 8179795623',
      address: 'Plot No. 42, Sri Sai Nagar, Madhapur, Hyderabad'
    },
    restaurant: 'Taj Royal Palace',
    items: [
      { name: 'Butter Chicken & Biryani Feast', qty: 1, price: 37.5 },
      { name: 'Garlic Butter Naan', qty: 1, price: 10.0 }
    ],
    totalAmount: 47.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    placedAt: '1 hour ago',
    estimatedDelivery: '35 mins',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7934',
    day: 'Fri',
    customer: {
      name: 'Aiden Reed',
      email: 'aiden.r@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 765-4321',
      address: '210 Sunset Blvd'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Crispy Truffle Parm Fries & Shakes', qty: 1, price: 24.0 }
    ],
    totalAmount: 24.0,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: '2 hours ago',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7935',
    day: 'Fri',
    customer: {
      name: 'Chloe Evans',
      email: 'chloe.e@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 876-5432',
      address: '99 Market Street'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Artisanal Thin Crust Funghi', qty: 1, price: 25.5 },
      { name: 'San Pellegrino Sparkling', qty: 1, price: 8.0 }
    ],
    totalAmount: 33.5,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: '3 hours ago',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7936',
    day: 'Fri',
    customer: {
      name: 'Lucas King',
      email: 'lucas.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 987-6543',
      address: '55 Park Avenue'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Mango Sticky Rice & Spring Rolls', qty: 1, price: 19.5 }
    ],
    totalAmount: 19.5,
    paymentMethod: 'Wallet Balance',
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    placedAt: '4 hours ago',
    estimatedDelivery: 'Cancelled by customer',
    rider: 'Unassigned'
  },

  // ─── SATURDAY (8 Orders) ──────────────────────────────────────────────────────
  {
    id: 'FD-7937',
    day: 'Sat',
    customer: {
      name: 'Maya Lin',
      email: 'maya.l@example.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 234-1122',
      address: '33 Maple Court'
    },
    restaurant: 'Smokehouse BBQ & Ribs',
    items: [
      { name: 'Ultimate Carnivore BBQ Board', qty: 1, price: 46.0 },
      { name: 'Smoked Jalapeno Poppers', qty: 1, price: 12.0 }
    ],
    totalAmount: 58.0,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 12:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7938',
    day: 'Sat',
    customer: {
      name: 'Oliver Brown',
      email: 'oliver.b@example.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 345-2233',
      address: '18 West End Avenue'
    },
    restaurant: "Luigi's Artisan Trattoria",
    items: [
      { name: 'Truffle Carbonara & Focaccia', qty: 1, price: 29.5 },
      { name: 'Cannoli Siciliani', qty: 1, price: 7.0 }
    ],
    totalAmount: 36.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 2:00 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7939',
    day: 'Sat',
    customer: {
      name: 'Hannah Abbott',
      email: 'hannah.a@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 567-4455',
      address: '142 Chestnut Street'
    },
    restaurant: 'Tokyo Craft Ramen Bar',
    items: [
      { name: 'Spicy Korean Fried Chicken', qty: 1, price: 23.0 },
      { name: 'Kimchi & Jasmine Rice', qty: 1, price: 8.0 }
    ],
    totalAmount: 31.0,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 3:45 PM',
    estimatedDelivery: 'Completed',
    rider: 'Dave Novak'
  },
  {
    id: 'FD-7940',
    day: 'Sat',
    customer: {
      name: 'Zoe Kravitz',
      email: 'zoe.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 678-5566',
      address: '12 Franklin Street'
    },
    restaurant: 'Artisan Woodfire Pizza Co.',
    items: [
      { name: 'Margherita Extra Buffalo Mozzarella', qty: 1, price: 21.5 },
      { name: 'Sparkling Lemon Soda', qty: 1, price: 6.0 }
    ],
    totalAmount: 27.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 5:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Marcus Vance'
  },
  {
    id: 'FD-7941',
    day: 'Sat',
    customer: {
      name: 'Ethan Hunt',
      email: 'ethan.h@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 789-6677',
      address: '400 Mission Street'
    },
    restaurant: 'Green Bowl Poké & Acai',
    items: [
      { name: 'Salmon Avocado Poké Bowl', qty: 1, price: 21.0 },
      { name: 'Green Detox Cold Pressed Juice', qty: 1, price: 8.0 }
    ],
    totalAmount: 29.0,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 6:50 PM',
    estimatedDelivery: 'Completed',
    rider: 'Sarah Drake'
  },
  {
    id: 'FD-7942',
    day: 'Sat',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 890-7788',
      address: '88 Lexington Avenue'
    },
    restaurant: 'Bangkok Street Wok',
    items: [
      { name: 'Chicken Quesadilla Supreme', qty: 1, price: 17.5 },
      { name: 'Tortilla Chips & Salsa', qty: 1, price: 6.0 }
    ],
    totalAmount: 23.5,
    paymentMethod: 'UPI / PhonePe',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 7:40 PM',
    estimatedDelivery: 'Completed',
    rider: 'Leo Morales (E-Bike)'
  },
  {
    id: 'FD-7943',
    day: 'Sat',
    customer: {
      name: 'Ryan Gosling',
      email: 'ryan.g@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 901-8899',
      address: '500 Sunset Boulevard'
    },
    restaurant: 'Taj Royal Palace',
    items: [
      { name: 'Lamb Rogan Josh & Saffron Rice', qty: 1, price: 33.0 },
      { name: 'Garlic Roti & Mint Chutney', qty: 1, price: 8.0 }
    ],
    totalAmount: 41.0,
    paymentMethod: 'Credit Card (Mastercard)',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    placedAt: 'Saturday 8:30 PM',
    estimatedDelivery: 'Completed',
    rider: 'Carlos Ortiz'
  },
  {
    id: 'FD-7944',
    day: 'Sat',
    customer: {
      name: 'Nathan Drake',
      email: 'nathan.d@example.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
      phone: '+1 (555) 456-3344',
      address: '770 Broadway'
    },
    restaurant: 'Burger & Brew House',
    items: [
      { name: 'Double Smash Cheeseburger', qty: 1, price: 20.0 },
      { name: 'Onion Rings Basket', qty: 1, price: 8.5 }
    ],
    totalAmount: 28.5,
    paymentMethod: 'Wallet Balance',
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    placedAt: 'Saturday 9:45 PM',
    estimatedDelivery: 'Cancelled by customer',
    rider: 'Unassigned'
  }
]
