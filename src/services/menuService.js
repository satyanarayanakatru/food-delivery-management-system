import axios from 'axios'
import { INITIAL_FOOD_ITEMS } from '../data/mockMenuData'

const DUMMY_RECIPES_URL = 'https://dummyjson.com/recipes?limit=30'

/**
 * Maps third-party DummyJSON recipe entity to FoodDelivery FoodItem
 */
function mapRecipeToFoodItem(recipe) {
  // Determine veg / non-veg based on tags, mealType, or recipe name
  const nonVegKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon', 'shrimp', 'salmon', 'turkey', 'lamb']
  const textToCheck = `${recipe.name} ${recipe.tags?.join(' ') || ''} ${recipe.ingredients?.join(' ') || ''}`.toLowerCase()
  const isNonVeg = nonVegKeywords.some((kw) => textToCheck.includes(kw))

  // Determine category
  let category = 'Mains'
  const cuisine = recipe.cuisine?.toLowerCase() || ''
  if (recipe.mealType?.includes('Dessert') || recipe.mealType?.includes('Snack')) {
    category = 'Desserts & Sweets'
  } else if (recipe.mealType?.includes('Beverage')) {
    category = 'Beverages'
  } else if (cuisine.includes('italian') || recipe.name.toLowerCase().includes('pizza') || recipe.name.toLowerCase().includes('pasta')) {
    category = 'Pizzas'
  } else if (recipe.name.toLowerCase().includes('burger') || recipe.name.toLowerCase().includes('sandwich')) {
    category = 'Burgers'
  } else if (cuisine.includes('asian') || cuisine.includes('japanese') || cuisine.includes('thai') || recipe.name.toLowerCase().includes('noodle') || recipe.name.toLowerCase().includes('ramen')) {
    category = 'Asian & Noodles'
  } else if (cuisine.includes('mexican') || recipe.name.toLowerCase().includes('taco')) {
    category = 'Mexican & Tacos'
  } else if (cuisine.includes('indian') || recipe.name.toLowerCase().includes('curry') || recipe.name.toLowerCase().includes('tikka')) {
    category = 'Indian Curries'
  } else if (recipe.name.toLowerCase().includes('salad')) {
    category = 'Salads & Healthy'
  } else {
    category = 'Asian & Noodles'
  }

  // Restaurant assignment based on cuisine
  let restaurantName = "Luigi's Artisan Trattoria"
  if (category === 'Burgers') restaurantName = 'Smokey Bandit Craft BBQ'
  else if (category === 'Asian & Noodles') restaurantName = 'Tokyo Craft Ramen & Izakaya'
  else if (category === 'Indian Curries') restaurantName = 'Taj Royal Palace'
  else if (category === 'Mexican & Tacos') restaurantName = 'La Taqueria del Sol'

  const generatedPrice = 10.99 + ((recipe.id * 1.75) % 15)

  return {
    id: `api-recipe-${recipe.id}`,
    name: recipe.name,
    category,
    restaurantId: (recipe.id % 5) + 1,
    restaurantName,
    price: parseFloat(generatedPrice.toFixed(2)),
    isVeg: !isNonVeg,
    rating: recipe.rating || 4.7,
    reviewsCount: recipe.reviewCount || 85,
    description: recipe.instructions ? recipe.instructions.slice(0, 2).join(' ') : 'A masterfully prepared gourmet specialty made with the freshest seasonal ingredients.',
    image: recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
    prepTime: `${recipe.prepTimeMinutes || 20}-${(recipe.prepTimeMinutes || 20) + 10} mins`,
    calories: `${recipe.caloriesPerServing || 450} kcal`,
    spicyLevel: recipe.difficulty === 'Easy' ? 'Mild' : 'Medium',
    tags: recipe.tags || ['Chef Special', category]
  }
}

/**
 * Fetch menu items from API with graceful fallback and local storage persistence
 */
export async function fetchMenuItems() {
  let apiItems = []

  try {
    const response = await axios.get(DUMMY_RECIPES_URL, { timeout: 6000 })
    if (response.data && Array.isArray(response.data.recipes)) {
      apiItems = response.data.recipes.map(mapRecipeToFoodItem)
    }
  } catch (error) {
    console.warn('DummyJSON Recipes API offline or timed out. Using fallback items:', error.message)
  }

  // Read stored custom or edited menu items from localStorage
  let customItems = []
  try {
    const saved = localStorage.getItem('foodbite_menu_items')
    if (saved) {
      customItems = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error reading foodbite_menu_items from localStorage:', e)
  }

  // Merge: Custom items first (overrides / newly added), then initial curated items, then API items
  const combined = [...customItems]

  // Add initial curated items if not already modified
  INITIAL_FOOD_ITEMS.forEach((initial) => {
    if (!combined.some((item) => item.id === initial.id)) {
      combined.push(initial)
    }
  })

  // Add API items if not existing
  apiItems.forEach((apiItem) => {
    if (!combined.some((item) => item.name.toLowerCase() === apiItem.name.toLowerCase())) {
      combined.push(apiItem)
    }
  })

  return combined
}
