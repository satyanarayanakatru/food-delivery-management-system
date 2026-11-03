# Food Delivery Management System 🍔🚀

A modern Food Delivery Management System built using React.js, Tailwind CSS, Context API, and Third-Party APIs.

## 🛠️ Technology Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **State Management:** React Context API + Local Storage
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Alerts & Notifications:** React Toastify
- **Icons:** Lucide React

---

## 📁 Project Structure
```
food-delivery-app/
├── public/
├── src/
│   ├── components/     # Reusable UI & module components
│   ├── context/        # Context API providers (Auth, Cart, Orders)
│   ├── pages/          # Page views for each module
│   ├── services/       # Axios & Third-Party API clients
│   ├── utils/          # Helpers, formatters & storage utils
│   ├── App.jsx         # App shell & router container
│   ├── index.css       # Tailwind CSS & global styles
│   └── main.jsx        # App entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 📋 Development Roadmap (10 Modules)
- [ ] **Module 1: Authentication** (Login, Register, Forgot Password, Form Validation, Protected Routes)
- [ ] **Module 2: Dashboard** (Metrics, Analytics, Recent Orders, Quick Actions)
- [ ] **Module 3: Restaurant Listing** (Third-party API integration, Search, Filter, Sort, Pagination)
- [ ] **Module 4: Menu Management** (Food Items, Category & Veg/Non-Veg filters, Add/Edit/Delete UI)
- [ ] **Module 5: Cart Management** (Add/Remove, Quantity Updates, Summary, Local Storage)
- [ ] **Module 6: Order Placement** (Checkout, Address, Order ID generation, Confirmation)
- [ ] **Module 7: Order Tracking** (Timeline status: Preparing, Out for delivery, Delivered)
- [ ] **Module 8: Customer Profile** (View/Edit Profile, Saved Addresses, Contact info)
- [ ] **Module 9: Coupons & Payment** (Coupon discounts, Card/UPI/Wallet payment UI)
- [ ] **Module 10: Order History** (Order logs, Reorder, Status filtering, Invoice UI)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🔗 GitHub Repository Setup
To push this project to your own GitHub repository:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
