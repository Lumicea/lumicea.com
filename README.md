# Lumicea E-commerce Platform

A premium e-commerce website for handcrafted beaded jewelry, built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom Lumicea brand colors
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
- **Deployment**: Vercel/Netlify with GitHub Actions CI/CD
- **Icons**: Lucide React

## 🎨 Brand Identity

- **Primary Color**: Navy Blue (#10105A)
- **Accent Color**: Gold (#D3A84C)
- **Design Philosophy**: Clean, minimalist, premium boutique experience

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lumicea-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local` in the lumicea-react directory
   - Add your Supabase credentials
   - Configure other environment variables as needed

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to the URL shown in your terminal (typically `http://localhost:5173`)

## 📦 Project Structure

```
├── lumicea-react/             # React application
│   ├── src/                   # Source code
│   │   ├── components/        # UI components
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   └── index.html             # HTML template
├── supabase/                  # Supabase configuration
│   ├── functions/             # Edge functions
│   └── migrations/            # Database migrations
└── package.json               # Project configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

The project is configured for deployment on Vercel or Netlify with automatic CI/CD via GitHub Actions.

### Environment Variables Required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Additional variables as configured in `.env.example`

## 📱 Features

### Core Features
- Product catalog with categories and filtering
- Product detail pages with variants
- Shopping cart functionality
- User authentication and accounts
- Checkout and payment processing
- Order management system

### Admin Features
- Dashboard with key metrics
- Product management
- Order processing
- Customer management
- Marketing tools (promotions, campaigns)
- Analytics and reporting

## 🎯 Brand Colors Reference

```css
/* Primary Colors */
--lumicea-navy: #10105A
--lumicea-gold: #D3A84C

/* Variations */
--lumicea-navy-light: #1a1a6b
--lumicea-navy-dark: #0a0a4a
--lumicea-gold-light: #ddb866
--lumicea-gold-dark: #c19a42
```

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the development team for contribution guidelines.