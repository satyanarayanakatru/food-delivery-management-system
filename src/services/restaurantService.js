import axios from 'axios'

// Curated high quality restaurants covering diverse cuisines and operational states
export const FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: "Luigi's Artisan Trattoria",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    cuisine: "Italian",
    rating: 4.9,
    reviewsCount: 342,
    deliveryTime: "20-30 mins",
    deliveryCharges: 2.99,
    address: "742 Evergreen Terrace, Downtown District",
    isOpen: true,
    popularity: 98,
    priceRange: "$$",
    phone: "+1 (555) 345-6789",
    openingHours: "11:00 AM - 11:00 PM",
    description: "Authentic wood-fired Neapolitan pizzas, handmade fresh pasta, and traditional Italian desserts crafted by master pizzaiolos.",
    tags: ["Wood-fired", "Handmade Pasta", "Top Rated"],
    featuredDishes: [
      { name: "Truffle Burrata Margherita", price: 18.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80" },
      { name: "Pappardelle al Cinghiale", price: 21.0, image: "https://images.unsplash.com/photo-1621996346565-e3d5d62810f5?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 2,
    name: "Tokyo Craft Ramen & Izakaya",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    cuisine: "Japanese",
    rating: 4.8,
    reviewsCount: 512,
    deliveryTime: "15-25 mins",
    deliveryCharges: 0, // Free delivery
    address: "180 Sakura Way, Midtown Metro",
    isOpen: true,
    popularity: 96,
    priceRange: "$$",
    phone: "+1 (555) 987-6543",
    openingHours: "12:00 PM - 10:30 PM",
    description: "Rich 24-hour simmered Tonkotsu broths, chewy artisan ramen noodles, and savory gyoza plates.",
    tags: ["Free Delivery", "Authentic Ramen", "Popular"],
    featuredDishes: [
      { name: "Black Garlic Tonkotsu Ramen", price: 16.5, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80" },
      { name: "Pan-Seared Pork Gyoza", price: 8.0, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 3,
    name: "Smokey Bandit Craft BBQ",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    cuisine: "American",
    rating: 4.7,
    reviewsCount: 289,
    deliveryTime: "30-40 mins",
    deliveryCharges: 3.50,
    address: "95 Texas Ridge Road, Southpoint",
    isOpen: true,
    popularity: 91,
    priceRange: "$$$",
    phone: "+1 (555) 456-7890",
    openingHours: "11:30 AM - 10:00 PM",
    description: "Slow-smoked Texas-style beef brisket, fall-off-the-bone ribs, and loaded southern mac and cheese.",
    tags: ["Pit Smoked", "Hearty Feasts"],
    featuredDishes: [
      { name: "14-Hour Smoked Brisket Platter", price: 26.0, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 4,
    name: "Taj Royal Palace",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
    cuisine: "Indian",
    rating: 4.8,
    reviewsCount: 420,
    deliveryTime: "25-35 mins",
    deliveryCharges: 1.99,
    address: "410 Curry Mile, Eastside",
    isOpen: true,
    popularity: 94,
    priceRange: "$$",
    phone: "+1 (555) 789-0123",
    openingHours: "12:00 PM - 11:00 PM",
    description: "Royal North Indian tandoor grills, creamy butter chicken, rich dal makhani, and garlic butter naans.",
    tags: ["Halal", "Tandoori", "Best Butter Chicken"],
    featuredDishes: [
      { name: "Murgh Makhani (Butter Chicken)", price: 17.0, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 5,
    name: "La Taqueria del Sol",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    cuisine: "Mexican",
    rating: 4.6,
    reviewsCount: 310,
    deliveryTime: "15-25 mins",
    deliveryCharges: 0, // Free delivery
    address: "220 Mission Street, West End",
    isOpen: true,
    popularity: 88,
    priceRange: "$",
    phone: "+1 (555) 234-5671",
    openingHours: "10:30 AM - 11:00 PM",
    description: "Street-style tacos on house-pressed corn tortillas, slow-roasted Birria with spicy dipping consommé.",
    tags: ["Free Delivery", "Birria Tacos", "Street Food"],
    featuredDishes: [
      { name: "Birria Quesatacos (3pcs)", price: 14.5, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 6,
    name: "Bangkok Street Wok",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=80",
    cuisine: "Thai",
    rating: 4.7,
    reviewsCount: 265,
    deliveryTime: "20-30 mins",
    deliveryCharges: 2.50,
    address: "88 Orchid Avenue, Chinatown Plaza",
    isOpen: true,
    popularity: 89,
    priceRange: "$$",
    phone: "+1 (555) 678-1234",
    openingHours: "11:30 AM - 10:30 PM",
    description: "Fiery wok-tossed Pad Thai, fragrant Green Curry with Thai eggplant, and refreshing mango sticky rice.",
    tags: ["Spicy", "Authentic Wok"],
    featuredDishes: [
      { name: "Pad Thai with Jumbo Prawns", price: 16.0, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 7,
    name: "Santorini Mediterranean Grill",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    cuisine: "Mediterranean",
    rating: 4.8,
    reviewsCount: 380,
    deliveryTime: "25-35 mins",
    deliveryCharges: 2.99,
    address: "312 Aegean Coastal Road",
    isOpen: true,
    popularity: 93,
    priceRange: "$$",
    phone: "+1 (555) 890-1235",
    openingHours: "11:00 AM - 10:00 PM",
    description: "Fresh Greek salads with kalamata olives, grilled souvlaki skewers, creamy tzatziki, and warm pita bread.",
    tags: ["Healthy", "Olive Oil", "Souvlaki"],
    featuredDishes: [
      { name: "Grilled Lamb Souvlaki Plate", price: 19.5, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 8,
    name: "The Golden Dragon Dumpling House",
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80",
    cuisine: "Chinese",
    rating: 4.5,
    reviewsCount: 198,
    deliveryTime: "30-45 mins",
    deliveryCharges: 3.00,
    address: "55 Lotus Garden Alley",
    isOpen: false, // Closed status demonstration
    popularity: 82,
    priceRange: "$$",
    phone: "+1 (555) 432-8765",
    openingHours: "Opens tomorrow at 11:30 AM",
    description: "Steaming bamboo baskets of handmade Xiao Long Bao (soup dumplings), spicy wontons, and Cantonese roast duck.",
    tags: ["Currently Closed", "Dim Sum", "Dumplings"],
    featuredDishes: [
      { name: "Pork & Crab Soup Dumplings (8pcs)", price: 13.0, image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 9,
    name: "Green Vitality Salad & Acai Bar",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    cuisine: "Healthy/Salad",
    rating: 4.9,
    reviewsCount: 450,
    deliveryTime: "15-20 mins",
    deliveryCharges: 0,
    address: "414 Wellness Boulevard",
    isOpen: true,
    popularity: 97,
    priceRange: "$$",
    phone: "+1 (555) 321-7654",
    openingHours: "08:00 AM - 08:00 PM",
    description: "Farm-to-table organic power grain bowls, cold-pressed green elixirs, and nutrient-dense acai bowls.",
    tags: ["Free Delivery", "Organic", "Vegan Friendly"],
    featuredDishes: [
      { name: "Superfood Avocado & Quinoa Bowl", price: 15.0, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 10,
    name: "Burger Craft Co. & Shakes",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    cuisine: "American",
    rating: 4.6,
    reviewsCount: 388,
    deliveryTime: "20-30 mins",
    deliveryCharges: 1.99,
    address: "99 Liberty Square",
    isOpen: true,
    popularity: 90,
    priceRange: "$$",
    phone: "+1 (555) 654-9870",
    openingHours: "11:00 AM - 01:00 AM",
    description: "Dry-aged double smash patties, melted cheddar, caramelized onions, and thick hand-spun malt shakes.",
    tags: ["Late Night", "Smash Burgers"],
    featuredDishes: [
      { name: "Truffle Double Smash Burger", price: 15.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 11,
    name: "Le Petit Parisien Patisserie",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    cuisine: "Desserts",
    rating: 4.9,
    reviewsCount: 520,
    deliveryTime: "15-25 mins",
    deliveryCharges: 2.50,
    address: "17 Montmartre Walk, French Quarter",
    isOpen: true,
    popularity: 99,
    priceRange: "$$",
    phone: "+1 (555) 789-4321",
    openingHours: "07:30 AM - 07:00 PM",
    description: "Flaky artisanal butter croissants, delicate fruit tarts, chocolate eclairs, and French macarons.",
    tags: ["Pastries", "French Bakery", "Top Rated"],
    featuredDishes: [
      { name: "Pistachio Raspberry Macaron Box", price: 16.0, image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300&auto=format&fit=crop&q=80" }
    ]
  },
  {
    id: 12,
    name: "Obrigado Brazilian Churrascaria",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
    cuisine: "American",
    rating: 4.4,
    reviewsCount: 175,
    deliveryTime: "35-45 mins",
    deliveryCharges: 3.99,
    address: "710 Samba Plaza",
    isOpen: false, // Closed
    popularity: 79,
    priceRange: "$$$",
    phone: "+1 (555) 876-5432",
    openingHours: "Opens today at 05:00 PM",
    description: "Fire-roasted picanha, garlic steak skewers, grilled pineapple, and traditional Brazilian cheese bread.",
    tags: ["Currently Closed", "Steakhouse"],
    featuredDishes: [
      { name: "Picanha Prime Steak Cut", price: 29.0, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80" }
    ]
  }
]

/**
 * Fetch restaurants using Third-Party API (DummyJSON Recipes API)
 * with transformation and automatic fallback for rock-solid reliability.
 */
export async function fetchRestaurants() {
  try {
    // Attempt Third-Party API call
    const response = await axios.get('https://dummyjson.com/recipes?limit=20', {
      timeout: 6000
    })

    if (response.data && response.data.recipes && response.data.recipes.length > 0) {
      // Map third party recipes into full Restaurant entities
      const apiRestaurants = response.data.recipes.map((recipe, index) => {
        const fallback = FALLBACK_RESTAURANTS[index % FALLBACK_RESTAURANTS.length]
        
        // Derive cuisine from recipe.cuisine or fallback
        const cuisine = recipe.cuisine || fallback.cuisine || 'International'
        
        return {
          id: recipe.id,
          name: `${recipe.name.split(' ')[0]}'s ${cuisine} Kitchen`,
          image: recipe.image || fallback.image,
          cuisine: cuisine,
          rating: Number((3.8 + (recipe.rating ? (recipe.rating % 1.2) : 0.8)).toFixed(1)),
          reviewsCount: recipe.reviewCount || Math.floor(100 + recipe.id * 18),
          deliveryTime: `${recipe.prepTimeMinutes || 20}-${(recipe.prepTimeMinutes || 20) + 15} mins`,
          deliveryCharges: index % 3 === 0 ? 0 : 2.99,
          address: fallback.address,
          isOpen: index % 5 !== 4, // 80% open, 20% closed
          popularity: Math.min(99, Math.floor(75 + (recipe.rating || 4) * 5)),
          priceRange: recipe.caloriesPerServing > 400 ? '$$$' : '$$',
          phone: fallback.phone,
          openingHours: '11:00 AM - 11:00 PM',
          description: `Specializing in gourmet ${recipe.name}. Fresh ingredients, balanced flavors, and speedy delivery.`,
          tags: recipe.tags || fallback.tags,
          featuredDishes: [
            {
              name: recipe.name,
              price: Number((12 + (recipe.id % 8)).toFixed(2)),
              image: recipe.image
            }
          ]
        }
      })

      return {
        data: apiRestaurants,
        source: 'Third-Party API (DummyJSON)',
        isLive: true
      }
    }

    return {
      data: FALLBACK_RESTAURANTS,
      source: 'Curated Fallback Gateway',
      isLive: false
    }
  } catch (error) {
    console.warn('Third-Party API request failed or timed out. Falling back gracefully:', error.message)
    return {
      data: FALLBACK_RESTAURANTS,
      source: 'Curated Fallback Gateway (Offline Safe)',
      isLive: false
    }
  }
}
