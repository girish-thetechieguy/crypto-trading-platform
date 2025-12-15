Generate a complete, production-ready cryptocurrency trading platform with the following specifications:

Core Requirements
Technology Stack:

Frontend: React.js with Tailwind CSS for responsive UI

State Management: React Context API or Redux

Authentication: JWT-based auth with secure token storage

API Integration: CoinGecko Free API (30 calls/min, 10k calls/month limit)​

Backend: Node.js/Express for user management and transactions

Database: MongoDB for user accounts and transaction history

Real-time Updates: WebSocket or polling for live price updates

Features to Implement
1. Authentication System:​

Sign Up page with email, username, password (min 8 chars, validation)

Login page with "Remember Me" option

JWT token management with refresh tokens

Password encryption (bcrypt)

Session management with auto-logout

Email verification (mock implementation)

Password reset functionality

2. Dashboard - Main Trading Interface:​

Real-time cryptocurrency price cards with live updates from CoinGecko API

Display: Current price, 24h change %, market cap, volume

Top 20 cryptocurrencies by market cap

Search functionality to find specific coins

Price charts with historical data (7-day, 30-day views)

Customizable dashboard with drag-and-drop widgets

3. Buy/Sell Functionality:

Modal/page for buying crypto with:

Amount input (USD or crypto unit)

Current price display

Total cost calculation

Wallet balance check

Confirmation dialog with transaction summary

Sell interface with similar flow

Transaction history page showing all buy/sell activities

Demo wallet with virtual $10,000 starting balance

Real-time portfolio value calculation

4. User Portfolio:​

Holdings overview with current value

Profit/loss tracking per coin

Total portfolio value with percentage changes

Asset allocation pie chart

Transaction history with filters (date, type, coin)

5. UI/UX Design Principles:​

Clean, modern interface with dark/light theme toggle

Clear visual hierarchy with prominent Buy/Sell CTAs

Responsive design (mobile, tablet, desktop)

Loading states for API calls

Error handling with user-friendly messages

Whitespace for reduced cognitive load

Color-coded price changes (green=up, red=down)

Accessible color contrast ratios

Intuitive navigation with sidebar/navbar

**API Integration Specifications **​
CoinGecko Endpoints to Use:

/coins/markets - Get top cryptocurrencies with market data

/coins/{id} - Get detailed coin information

/coins/{id}/market_chart - Historical price data

/simple/price - Current prices for multiple coins

Rate Limiting Handling:

Implement request queuing for 30 calls/min limit

Cache responses for 60 seconds to reduce API calls

Show loading indicators during data fetch

Graceful error handling for API failures

Security Best Practices:​
HTTPS only in production

Input sanitization to prevent XSS attacks

CSRF token implementation

SQL injection prevention (parameterized queries)

Secure password storage with salt and hash

API key storage in environment variables

Rate limiting on authentication endpoints

Logout on multiple failed login attempts

File Structure Required:
text
/crypto-trading-platform
  /client (React frontend)
    /src
      /components (reusable UI components)
      /pages (Login, Signup, Dashboard, Portfolio, Trade)
      /services (API calls, auth helpers)
      /context (global state)
      /utils (helpers, formatters)
      /assets (images, icons)
      App.js
      index.js
    package.json
    tailwind.config.js
  /server (Node.js backend)
    /routes (auth, user, transactions)
    /models (User, Transaction schemas)
    /middleware (auth, validation)
    /controllers (business logic)
    server.js
    package.json
  .env.example
  README.md
Additional Features:
Watchlist functionality to save favorite coins

Price alerts (simulated notifications)

Market overview with trending coins

Educational tooltips for beginners

Export transaction history as CSV

Responsive mobile-first design

Generate complete, well-commented code for all files with proper error handling, loading states, and professional UI. Include setup instructions in README.md.