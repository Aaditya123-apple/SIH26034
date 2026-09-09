# Legal Metrology Compliance Platform

A production-quality frontend application for the Smart India Hackathon Problem Statement SIH26034 - Packaged Commodity Compliance Inspection Platform.

## Overview

This platform enables Legal Metrology officers to inspect packaged commodities for compliance with the Legal Metrology (Packaged Commodities) Rules, 2011. The system uses AI-powered image analysis to detect violations in product labels and generate comprehensive compliance reports.

## Features

### 🔍 AI-Powered Inspection
- Upload product images via drag-and-drop, file browser, or camera capture
- Real-time AI analysis with animated processing workflow
- Automatic detection of label violations (MRP, font size, manufacturer details, etc.)
- Interactive image viewer with zoom, pan, and annotation overlays

### 📊 Comprehensive Dashboard
- Real-time KPIs: Total inspections, compliance rate, violations detected
- Interactive charts using Recharts (Line, Area, Pie charts)
- Monthly inspection trends and compliance analytics
- Recent inspections table with status indicators

### 📋 Compliance Reports
- Detailed compliance analysis with scores and risk levels
- Issue severity classification (Critical, High, Medium, Low)
- Rule references and recommendations for each violation
- PDF export functionality

### 📈 Analytics & Insights
- Category-wise compliance analysis
- Violation type distribution
- Officer performance metrics
- Regional compliance trends

### ⚙️ User Management
- Secure authentication system
- Profile management with performance tracking
- Customizable notification preferences
- System settings and themes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **HTTP Client**: Axios

## Installation

1. Navigate to the project directory:
```bash
cd legal-metrology-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
legal-metrology-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Authentication page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── inspection/        # Product inspection interface
│   │   ├── reports/           # Reports management
│   │   ├── analytics/         # Analytics and insights
│   │   ├── settings/          # User settings
│   │   ├── profile/           # User profile
│   │   └── help/              # Help center
│   ├── components/            # React components
│   │   ├── ui/                # ShadCN UI components
│   │   ├── layout/            # Layout components (Sidebar, Header)
│   │   ├── inspection/        # Inspection-specific components
│   │   └── dashboard/         # Dashboard-specific components
│   ├── lib/                   # Utility functions
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json               # Dependencies and scripts
```

## Design System

### Color Palette
- **Primary**: #0F4C81 (Government Blue)
- **Secondary**: #1E3A8A (Deep Blue)
- **Success**: #16A34A (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #DC2626 (Red)
- **Background**: #F8FAFC (Light Gray)
- **Card Background**: #FFFFFF (White)

### Design Principles
- Government SaaS aesthetic
- Microsoft Fluent-inspired design
- Clean, professional dashboards
- Large spacing and clear typography
- Smooth animations and transitions
- Enterprise-grade polish

## Key Pages

### Login Page
- Government of India branding
- Employee ID authentication
- Feature highlights
- Secure login flow

### Dashboard
- KPI cards with trend indicators
- Monthly inspection volume chart
- Compliance trend analysis
- Violation distribution pie chart
- Recent inspections table

### Inspection (Main Feature)
- **Left Panel**: Image upload with drag-and-drop, recent uploads
- **Center Panel**: Interactive image viewer with annotations, zoom/pan
- **Right Panel**: Compliance analysis, score circle, issues list
- **AI Analysis**: Animated processing workflow with 8 steps
- **Report Modal**: Detailed compliance report with PDF export

### Reports
- Searchable reports table
- Category and status filters
- Report statistics
- View, download, and delete actions

### Analytics
- Category compliance analysis
- Monthly trends
- Violation type distribution
- Officer performance metrics
- Regional compliance data

### Settings
- Profile management
- Notification preferences
- Security settings (2FA, password)
- System preferences (theme, language, timezone)

### Profile
- Officer information display
- Performance metrics
- Certifications and achievements
- Recent activity

### Help Center
- Searchable FAQs
- Video tutorials
- Contact support options
- System status

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Component Development

All UI components are built using ShadCN UI primitives and follow the established design system. When adding new components:

1. Use existing UI components from `src/components/ui/`
2. Follow the government color palette
3. Maintain consistent spacing and typography
4. Add appropriate TypeScript types
5. Ensure responsive design

## Compliance Rules Reference

The platform checks compliance against:
- **Legal Metrology (Packaged Commodities) Rules, 2011**
- MRP display requirements
- Font size minimums (1.2mm)
- Manufacturer details
- Net quantity format
- Manufacturing/packaging dates
- Consumer care information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is developed for the Smart India Hackathon 2024 (SIH26034).

## Acknowledgments

- Government of India, Ministry of Consumer Affairs
- Legal Metrology Department
- Smart India Hackathon 2024

---

**Built with ❤️ for Digital India**
