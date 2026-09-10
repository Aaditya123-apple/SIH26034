# Legal Metrology Compliance Platform

A streamlined compliance inspection and analysis system for monitoring packaged commodities under Legal Metrology (Packaged Commodities) Rules, 2011.

## Features

- **Reports Management**: View and analyze compliance inspection reports
- **Factory Tracking**: Monitor manufacturing facilities and compliance across regions
- **Violation Analysis**: Smart reporting logic (1-2% individual, 3-4% concern levels)
- **PDF Generation**: Download detailed compliance reports
- **Law/Act Violations**: Detailed information about legal violations
- **Supply Chain Tracking**: Factory location, city, region, and destination information

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
## Backend API

Set `NEXT_PUBLIC_API_URL` to the backend API base URL. The frontend requests `GET /reports` and sends a JWT as `Authorization: Bearer <token>` when one has been stored after login. It also sends `credentials: include` so the backend may use a secure HttpOnly cookie instead.

The backend must allow the deployed frontend origin, not `*` when credentials are enabled:

```text
Access-Control-Allow-Origin: https://your-vercel-domain.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

The backend must answer `OPTIONS` preflight requests and validate the JWT before returning reports. Store `NEXT_PUBLIC_API_URL` in Vercel project environment variables for Preview and Production environments.
npm start
```

## Deployment

### Vercel Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy using Vercel CLI:**
   ```bash
   vercel deploy --temporary
   ```

   Or for permanent deployment:
   ```bash
   vercel login
   vercel deploy
   ```

3. **Or use Vercel Dashboard:**
   - Connect your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

### Netlify Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag and drop:**
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the project folder onto the page
   - Get your live URL instantly

## Project Structure

```
SIH26034/
├── src/
│   ├── app/
│   │   ├── reports/          # Reports management page
│   │   ├── factories/        # Factory tracking page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx         # Home page (redirects to reports)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # UI components
│   │   ├── main-layout.tsx  # Main layout wrapper
│   │   └── navigation.tsx   # Top navigation
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── pdf-generator.ts # PDF generation
│   └── types/              # TypeScript types
├── public/                  # Static assets
└── package.json            # Dependencies
```

## Application Routes

- `/` - Redirects to reports page
- `/reports` - Compliance reports and analysis
- `/factories` - Factory tracking and supply chain

## Key Features

### Smart Reporting Logic
- **1-2% violations**: Individual report
- **3-4% violations**: Concern level raised
- **5%+ violations**: Critical concern

### Report Details
- Product information and ID
- Factory location (city, region)
- Manufacturing date and destination
- Violation details with severity
- Law/Act violation references
- PDF download functionality

### Factory Tracking
- Regional compliance overview
- Factory-specific compliance rates
- Supply chain visualization
- Destination tracking

## Design

- **Professional government aesthetic**
- **Clean, modern interface**
- **Responsive design**
- **Accessible color scheme**
- **Minimal, focused layout**

## License

Developed for Smart India Hackathon 2024 (SIH26034)
