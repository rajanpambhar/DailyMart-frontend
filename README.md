# DailyMart Frontend

Modern React + TypeScript frontend migrated from PHP to a modern SPA architecture.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Routing**: React Router 6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/           # Route guards
│   │   ├── layout/         # Layout components
│   │   └── product/        # Product components
│   ├── pages/
│   │   ├── auth/           # Login, Signup
│   │   ├── admin/          # Admin panel pages
│   │   └── *.tsx           # User pages
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Setup Instructions

### Prerequisites

1. Node.js 20+ installed
2. Backend API running on port 3001

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📄 Pages

### Public Pages
- `/` - Home page with hero and best sellers
- `/category/:slug` - Category product listing
- `/product/:id` - Product detail page

### Auth Pages (Guest only)
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password recovery

### Protected Pages (Login required)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/profile` - User profile
- `/orders` - Order history
- `/orders/:id` - Order details

### Admin Pages (Admin role required)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/users` - User management

## 🎨 Styling

The project uses Tailwind CSS with a custom dark theme. Key features:
- **Dark mode by default**
- **Custom color palette** (primary cyan, secondary green)
- **Glassmorphism effects**
- **Micro-animations**
- **Responsive design**

### Custom Components

```css
.btn-primary     /* Primary action buttons */
.btn-secondary   /* Secondary buttons */
.btn-ghost       /* Ghost/text buttons */
.glass-card      /* Glassmorphism cards */
.input-field     /* Form inputs */
.badge           /* Status badges */
.product-card    /* Product display cards */
```

## 🔐 Authentication

The app uses JWT authentication with:
- Access tokens stored in memory
- Refresh tokens in HTTP-only cookies
- Auto token refresh on 401 responses
- Protected route components

## 📝 Migration from PHP

| PHP Component | React Equivalent |
|---------------|------------------|
| header.php | Header.tsx |
| footer.php | Footer.tsx |
| login.php | LoginPage.tsx |
| signup.php | SignupPage.tsx |
| profile.php | ProfilePage.tsx |
| cart.php | CartPage.tsx |
| checkout.php | CheckoutPage.tsx |
| vegetables.php | CategoryPage.tsx |
| admin_index.php | AdminDashboard.tsx |
| admin_products.php | AdminProducts.tsx |
| admin_orders.php | AdminOrders.tsx |
| admin_users.php | AdminUsers.tsx |
| $_SESSION | Zustand stores |

## 🛠️ Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

For development, the Vite proxy handles API requests to avoid CORS issues.
