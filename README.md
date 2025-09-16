# UrbanCare Services

**A localized marketplace web application connecting customers with skilled service providers in Tagum City, Davao del Norte.**

## 🏢 Project Overview

UrbanCare Services is a modern marketplace platform similar to Upwork, specifically designed for the Tagum City community. The platform connects customers with trusted, vetted service providers for home care, renovation, maintenance, and other personal services, emphasizing trust, convenience, quality, and fair pricing.

## 🎯 Target Audience

- **Customers:** Households, individuals, and small businesses in Tagum City seeking reliable, vetted services
- **Service Providers:** Independent professionals (plumbers, electricians, cleaners, handymen, laundry personnel) and small service businesses looking for consistent work and professional growth

## 🛠️ Core Services (Initial Launch)

1. **Home Cleaning & Disinfection Services**
   - Regular, deep, move-in/out cleaning
   - Post-construction cleanup
   - Specialized disinfection services

2. **Plumbing & Electrical Repairs**
   - Leak fixes and pipe repairs
   - Drain cleaning and unclogging
   - Electrical wiring and outlet repairs
   - General home maintenance

3. **General Handyman & Minor Home Repairs**
   - Furniture assembly
   - Wall mounting and installations
   - Painting and touch-ups
   - Curtain installation
   - Basic appliance fixes

4. **Laundry Care Services**
   - Pickup and delivery service
   - Wash and fold service
   - Wash and iron service

## 🚀 Technology Stack

- **Frontend Framework:** React.js with Vite
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React Context API (with potential Redux integration)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Development:** ESLint for code quality

## 📁 Project Structure

```
urbancare-services/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── services/          # API services and external integrations
│   ├── contexts/          # React context providers
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd urbancare-services
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 🌐 Live Demo

🚀 **Production Site:** [https://urbancare-services-ht104idjo-bonch223s-projects.vercel.app](https://urbancare-services-ht104idjo-bonch223s-projects.vercel.app)

📂 **GitHub Repository:** [https://github.com/bonch223/skillfoundri-urbancare-services](https://github.com/bonch223/skillfoundri-urbancare-services)

### 🔄 Deployment Information
- **Hosting Platform:** Vercel
- **Auto-Deployment:** Connected to GitHub main branch
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** React with Vite (automatically detected)

> 💡 **Note:** The site automatically redeploys when changes are pushed to the main branch on GitHub.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Design System

The project uses a custom Tailwind CSS configuration with:

- **Primary Colors:** Blue color palette (primary-50 to primary-900)
- **Secondary Colors:** Gray color palette (secondary-50 to secondary-900)
- **Typography:** Inter font family with system fallbacks
- **Components:** Custom button styles, card components, and layouts

## 🏗️ Architecture Approach

The application follows a **Client-Server Architecture** with:

- **Frontend:** React.js SPA with responsive design
- **Backend:** RESTful API (to be implemented)
- **Database:** Relational database for structured data (to be implemented)
- **Authentication:** JWT-based authentication system (to be implemented)

## 🔧 Future Implementation Plans

- **Backend API:** Node.js with Express.js or Python with Django/Flask
- **Database:** PostgreSQL or MySQL
- **Authentication:** JWT with OAuth 2.0 support
- **Payment Integration:** Local payment gateways
- **Real-time Features:** WebSocket integration for live updates
- **Mobile App:** React Native implementation

## 🤝 Contributing

This project is designed for the Tagum City community. Contributions are welcome to help improve the platform for local service providers and customers.

## 📄 License

This project is proprietary software developed for UrbanCare Services, Tagum City.

## 📞 Contact

- **Location:** Tagum City, Davao del Norte, Philippines
- **Email:** info@urbancare.services

---

*Built with ❤️ for the Tagum City community*
