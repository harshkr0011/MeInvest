# MeInvest

MeInvest is a modern Next.js application for real-time market data, AI-powered trend analysis, portfolio management, and financial news. Built with React, Tailwind CSS, Radix UI, Genkit AI, and Firebase, it provides a seamless, interactive investment experience.

---

## Live Demo

Access the live app here:  
**[MeInvest Live Server](https://studio--studio-1782527690-60ac6.us-central1.hosted.app/)**

---

## YouTube Demo

Watch the full walkthrough:  
**[MeInvest Demo on YouTube](https://youtu.be/H-4XzFxyQDg)**

---

## Features

- Real-time market data for stocks, crypto, funds, gold, and more
- AI-powered market summaries and predictions
- Portfolio and transaction management
- Interactive dashboards and charts
- Financial news feed
- Responsive design for desktop and mobile
- Secure authentication and profile management (Firebase)
- Customizable themes (light/dark/system)

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI, Lucide Icons
- **AI:** Genkit AI, Google AI
- **Backend:** Firebase
- **Utilities:** Zod, clsx, dotenv, recharts, date-fns

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- [Firebase project & credentials](https://firebase.google.com/)
- [Gemini API Key](https://ai.google.dev/gemini-api/docs/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/harshkr0011/MeInvest.git
   cd MeInvest
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     # Add other environment variables as needed
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   - Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## Scripts

- `npm run dev` — Start the development server (Turbopack, port 9002)
- `npm run build` — Build the app for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — TypeScript type checking
- `npm run genkit:dev` — Start Genkit AI dev server
- `npm run genkit:watch` — Start Genkit AI dev server in watch mode

---

## Project Structure

```
MeInvest/
├── app/                # Next.js app directory (pages, layouts, styles)
│   ├── globals.css     # Global styles
│   └── ...             # Page components
├── components/         # Reusable UI and dashboard components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and data
├── ai/                 # Genkit AI flows and logic
├── types/              # TypeScript type definitions
├── public/             # Static assets
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
├── next.config.js      # Next.js configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

---

## Configuration

### Next.js Image Domains

If you use external images (e.g., `picsum.photos`), add this to `next.config.js`:

```js
module.exports = {
  images: {
    domains: ['picsum.photos'],
  },
};
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, open an issue or contact [harshkr0011](https://github.com/harshkr0011).
