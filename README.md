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
npm start
```

### Local containers

The frontend and FastAPI backend can run together with Docker Compose:

```bash
docker compose up --build
```

Open `http://localhost:3000`. The backend is available at `http://localhost:8000`.
SQLite data is stored in the `backend-data` Compose volume.

### Kubernetes

Build and push both images to a container registry, replace the placeholder image
names and domains in `k8s/backend.yaml`, `k8s/frontend.yaml`, and
`k8s/ingress.yaml`, then apply the manifests:

```bash
docker build -f backend/Dockerfile -t your-registry/legal-metrology-backend:latest .
docker build -f Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://api.your-domain.example -t your-registry/legal-metrology-frontend:latest .
docker push your-registry/legal-metrology-backend:latest
docker push your-registry/legal-metrology-frontend:latest

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend.yaml -f k8s/frontend.yaml -f k8s/ingress.yaml
```

The current Kubernetes backend uses one replica and a persistent SQLite volume.
For multiple backend replicas or higher traffic, migrate the database to managed
Postgres before scaling the backend deployment.

### Performance notes

The dashboard uses `GET /api/dashboard/overview` to fetch summary statistics and
recent inspections in one request. Inspection processing remains synchronous for
the legacy `/api/detections` demo endpoint. The live upload flow processes in a
background task and streams status through a WebSocket.

### Realtime inspection demo

Open `http://localhost:3000/inspection/live` while the frontend and backend are
running. Choose **Start camera** and **Capture frame**, or use **Upload image**.
The browser sends a real multipart image to `POST /api/inspections/upload`, and
the page listens on `/ws/inspections/{inspection_id}` for processing updates.

Camera access requires HTTPS when deployed to a real server. The current live
flow uses the existing mock detection and demo OCR adapters behind the real
upload, persistence, background processing, and WebSocket contracts. To enable
YOLO detection, install `ultralytics`, mount a trained model into the backend,
and set `DETECTION_PROVIDER=yolo` plus `DETECTION_MODEL_PATH=/models/package.pt`.
The detector then reads the uploaded image and records the best detection and
bounding box. To enable real local OCR in the backend container, set `OCR_PROVIDER=tesseract`; the image
includes the native Tesseract binary and Python bindings. The default `demo`
providers keep the presentation flow deterministic until a trained detector and
representative package images are available.

## Backend API

Set `NEXT_PUBLIC_API_URL` to the backend API base URL. The frontend requests `GET /reports` and sends a JWT as `Authorization: Bearer <token>` when one has been stored after login. It also sends `credentials: include` so the backend may use a secure HttpOnly cookie instead.

Inspection analysis is backend-only. The CNN, OCR, declaration extraction, rule engine, evidence generation, and report creation run in the separate backend service. This website only displays the backend-generated reports and historical results.

The backend must allow the deployed frontend origin, not `*` when credentials are enabled:

```text
Access-Control-Allow-Origin: https://your-vercel-domain.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

The backend must answer `OPTIONS` preflight requests and validate the JWT before returning reports. Store `NEXT_PUBLIC_API_URL` in Vercel project environment variables for Preview and Production environments.

## Supabase

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the local environment and in Vercel. Run `supabase/schema.sql` in the Supabase SQL editor to create the reports table, Row Level Security policy, and private inspection image bucket.

When Supabase variables are configured, the frontend uses Supabase Auth for login, reads reports from Postgres, and uploads images to Storage. The CNN and transformer backend should use a server-side Supabase service-role key to write completed reports; never expose that key as a `NEXT_PUBLIC_` variable.

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
