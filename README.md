# 🩸 DropOfLife Frontend (জীবনের এক ফোঁটা)
> **Modern Clinical Blood Donation, Emergency Telemetry & Lifesaver Network Web Application**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38.svg)](https://zustand-demo.pmnd.rs/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4.svg?logo=google&logoColor=white)](https://developers.google.com/identity)
[![Stripe](https://img.shields.io/badge/Payments-Stripe_Elements-635BFF.svg?logo=stripe&logoColor=white)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000.svg?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 GitHub Repository Details (About Section)

* **Repository Description**:
  > 🩸 Cutting-edge, responsive Next.js 16 web application for DropOfLife (জীবনের এক ফোঁটা). Features Google OAuth 2.0 direct sign-in, strict duplicate account prevention, 60fps vascular RBC canvas animations, interactive blood compatibility matrix, real-time emergency requisitions across all 64 districts of Bangladesh, Stripe checkout, bilingual English/Bengali localization, and role-based portals for donors, hospitals, and administrators.
* **Website / Live Demo**: `https://drop-of-life.vercel.app` (or Vercel deployed URL)
* **API Backend**: `https://dropoflife-backend.onrender.com/api/v1`
* **Topics / Tags**:
  `nextjs`, `react19`, `typescript`, `tailwindcss`, `blood-donation`, `healthcare-web-app`, `google-oauth`, `stripe-checkout`, `zustand`, `bilingual-ui`, `bangladesh-healthcare`, `emergency-dispatch`, `dark-mode`, `glassmorphism`, `vercel-deployment`

---

## 📖 Overview

**DropOfLife (জীবনের এক ফোঁটা)** is a state-of-the-art emergency blood donation and dispatch web application engineered to bridge the critical gap between voluntary blood donors, patients in urgent need, and healthcare institutions across Bangladesh.

Built with **Next.js 16 (App Router)** and **React 19**, the client provides an ultra-responsive, high-contrast, dark obsidian glassmorphism user interface designed for mission-critical clarity under emergency conditions.

---

## ✨ Key Features & User Experience

### 1. 🔐 Seamless Authentication & Onboarding
- **Direct "Continue with Google" Sign-In**: Once registered, any subsequent login with Google instantly authenticates the user into their session without ever re-prompting Step 2 modal dialogs.
- **2-Step Mandatory Medical Profiling**: First-time Google lifesavers complete a streamlined Step 2 modal to register their emergency contact phone, verified blood group, and geographical district.
- **Strict Duplicate Prevention**: Prohibits creating more than one account using the same email address or phone number, with intelligent normalization across all Bangladeshi mobile operator prefixes (`+880` / `01`).
- **Silent Dual-Token Session Refresh**: Axios response interceptors automatically refresh expired JWT Access Tokens using 30-day Refresh Tokens without interrupting user activity.
- **1-Click Clinical Demo Logins**: Pre-configured test access for Super Admin, Registered Donor, and Central Blood Bank Hospital portals.

### 2. 🩸 Interactive Clinical Tools & Telemetry
- **Interactive Blood Compatibility Matrix**: Visual ABO and Rh factor compatibility engine showing universal donor ($O^-$) and universal recipient ($AB^+$) relations.
- **60fps Micro-Vascular Canvas Animation**: High-performance animated simulation of red blood cells flowing through vascular capillary networks.
- **Real-Time Emergency Dispatch Feed**: Live requisition ticker featuring urgency badges (`Standard`, `Urgent`, `Critical ICU`), units required, and direct phone dialer links.
- **Medical Eligibility Pre-Screening Quiz**: Interactive questionnaire evaluating donation readiness based on age, weight, donation history, and health criteria.

### 3. 🗺️ 64-District Geo-Aware Directory & Requisitions
- Comprehensive filtering by all 8 Divisions and 64 Districts of Bangladesh.
- Real-time availability indicator and 90-day post-donation recovery cool-down tracking.
- Instant Direct Request Modal for one-on-one donor coordination.

### 4. 🏥 Role-Based Dashboards
- **Donor Portal (`/dashboard/donor`)**: Personal donation telemetry, badges, schedule appointments, and pledge management.
- **Hospital / Provider Portal (`/dashboard/provider`)**: Real-time blood bank inventory management by component (`Whole Blood`, `PRBC`, `FFP`, `Platelets`) and emergency dispatch logs.
- **Super Administrator Portal (`/dashboard/admin`)**: Platform telemetry, user verification/suspension controls, and clinical complaint management.

### 5. 💳 Stripe Lifesaver Fund
- Embedded secure payment sheet for transparent financial contributions supporting emergency oxygen, testing kits, and volunteer logistics.
- Instant automated donation receipts.

### 6. 🌐 Native Bilingual Localization (বাংলা / English)
- Strict dual-language support with instant navbar toggle between English and Bengali across all interface components, badges, and modals.

---

## 🏛️ Project Directory Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── images/                     # Clinical hero imagery & assets
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/              # High-contrast login portal with Google OAuth & 1-click demos
│   │   │   ├── register/           # Multi-step registration with unique validation
│   │   │   └── reset-password/     # Secure OTP verification & password update
│   │   ├── (public)/
│   │   │   ├── camps/              # Blood donation camps and slot registration
│   │   │   ├── donors/             # Geo-aware searchable donor directory
│   │   │   ├── emergency-requests/ # Live emergency requisitions dispatch feed
│   │   │   └── support/            # Lifesaver Fund Stripe donation checkout
│   │   ├── dashboard/
│   │   │   ├── admin/              # Super admin system operations & moderation
│   │   │   ├── donor/              # Voluntary donor telemetry & donation history
│   │   │   └── provider/           # Hospital blood bank inventory & emergency alerts
│   │   ├── api/                    # Next.js API route handlers (Google OAuth & Stripe webhooks)
│   │   ├── globals.css             # Obsidian dark glassmorphism design tokens & utilities
│   │   ├── layout.tsx              # Root HTML layout, font optimization, navigation shell
│   │   └── page.tsx                # Clinical landing page, telemetry stats, compatibility matrix
│   ├── components/
│   │   ├── auth/                   # GoogleLoginTwoStepModal, ResetPasswordModal
│   │   ├── blood/                  # Compatibility matrix, donor cards, eligibility quiz
│   │   ├── donors/                 # Direct request modal, donor filters, donor grid
│   │   ├── emergency/              # Emergency requisition cards & creation modal
│   │   ├── home/                   # Hero banner, 3D blood canvas, clinical workflow showcase
│   │   ├── payment/                # Stripe Elements card form & receipt modal
│   │   ├── shared/                 # Ambient backgrounds, Navbar, Footer, Liquid loaders
│   │   └── ui/                     # Accessible UI atoms (Button, Card, Input, Dialog)
│   ├── lib/
│   │   ├── api.ts                  # Axios client with automatic JWT token refresh interceptors
│   │   ├── constants.ts            # Divisions, districts, blood groups, hotline definitions
│   │   └── translations.ts         # Comprehensive English/Bengali localization dictionaries
│   ├── middleware.ts               # Next.js edge route protection & RBAC dashboard guards
│   ├── stores/                     # Zustand stores (authStore, languageStore, toastStore)
│   └── types/                      # TypeScript domain models and interfaces
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# DropOfLife Backend REST API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5050/api/v1
# In production on Vercel:
# NEXT_PUBLIC_API_URL=https://dropoflife-backend.onrender.com/api/v1

# Branding & Platform Metadata
NEXT_PUBLIC_APP_NAME="DropOfLife"
NEXT_PUBLIC_APP_TAGLINE="জীবনের এক ফোঁটা — Every Drop Matters"
NEXT_PUBLIC_HOTLINE="+8801521711716"

# Google OAuth 2.0 Credentials
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rakibul263/DropOfLife-Frontend.git
cd DropOfLife-Frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### 3. Production Build & Validation
```bash
npm run build
npm start
```

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub (`https://github.com/rakibul263/DropOfLife-Frontend`).
2. Log into **[Vercel](https://vercel.com)** and import the repository.
3. Configure Environment Variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: `https://dropoflife-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_BETTER_AUTH_URL`: `https://your-domain.vercel.app`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Click **Deploy**. Vercel will build and launch your application globally on its Edge network.

---

## 📞 24/7 National Emergency Hotline
- **Mobile Hotline**: `+8801521711716`
- **Central Dispatch**: `02-9351969`
- **Compliance**: 100% DGHS (Directorate General of Health Services) & WHO Blood Transfusion Standards.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
