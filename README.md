# 🎨 QWERTY Quest - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3+-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-10.16+-0055FF?style=for-the-badge&logo=framer" alt="Framer Motion" />
</div>

<div align="center">
  <h3>⚡ Modern React Frontend for QWERTY Quest</h3>
  <p><em>Responsive, animated UI built with cutting-edge web technologies</em></p>
</div>

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- Running backend server (see [main README](../README.md))

### Installation

1. **Install dependencies**
   ```bash
   cd typemaster-client
   npm install
   ```

2. **Environment setup**
   ```bash
   # Create .env file (optional for local dev)
   echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🏗️ Architecture

### Key Technologies
- **React 19**: Latest React with concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready animations
- **Socket.io**: Real-time communication
- **React Router**: Client-side routing

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI elements (buttons, inputs, etc.)
│   ├── layout/         # Layout components (navbar, footer)
│   └── features/       # Feature-specific components
├── pages/              # Route-based page components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── utils/              # Helper functions and constants
└── styles/             # Global styles and Tailwind config
```

### State Management
- **React Context**: Authentication, settings, and global state
- **Local State**: Component-level state with useState/useReducer
- **Server State**: Real-time updates via Socket.io

---

## 🎨 Design System

### Color Palette
```css
--primary: #3B82F6      /* Blue */
--primary-hover: #2563EB
--accent: #8B5CF6       /* Purple */
--success: #10B981      /* Green */
--warning: #F59E0B      /* Yellow */
--error: #EF4444        /* Red */
--background: #0F0F0F   /* Dark */
--surface: #1A1A1A      /* Dark gray */
--text: #F9FAFB         /* Light gray */
```

### Typography
- **Primary Font**: JetBrains Mono (monospace for typing)
- **Secondary Font**: Inter (sans-serif for UI)
- **Sizes**: Responsive scaling from 14px to 48px

### Animations
- **Micro-interactions**: Button hovers, form transitions
- **Page transitions**: Smooth route changes with Framer Motion
- **Loading states**: Skeleton screens and progress indicators
- **Celebration effects**: Particle systems for achievements

---

## 🔧 Development Guidelines

### Code Style
- **ESLint**: Airbnb config with React-specific rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Optional, encouraged for complex components
- **Component naming**: PascalCase, descriptive names

### Component Patterns
```jsx
// Functional component with hooks
const TypingRace = () => {
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="typing-race"
    >
      {/* Component content */}
    </motion.div>
  );
};
```

### Performance Optimization
- **React.memo**: For expensive re-renders
- **useCallback/useMemo**: For stable references
- **Lazy loading**: Route-based code splitting
- **Image optimization**: Next.js-style responsive images

---

## 🧪 Testing

```bash
npm run test        # Run test suite
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

### Testing Stack
- **Vitest**: Fast, modern test runner
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for integration tests
- **Playwright**: E2E testing (future)

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Analytics/tracking enabled
- [ ] Error boundaries implemented
- [ ] Performance monitoring set up

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 🤝 Contributing

1. Follow the [main project guidelines](../README.md#contributing)
2. Test your changes thoroughly
3. Update component documentation
4. Ensure responsive design works

### Component Documentation
```jsx
/**
 * TypingRace Component
 * @param {Object} props
 * @param {string} props.text - The text to type
 * @param {number} props.duration - Race duration in seconds
 * @param {Function} props.onComplete - Callback when race finishes
 */
const TypingRace = ({ text, duration, onComplete }) => {
  // Component implementation
};
```

---

## 📊 Performance Metrics

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Bundle Size**: ~800KB (gzipped)

---

## 🐛 Common Issues

**Hot Reload Not Working**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Styling Issues**
```bash
# Rebuild Tailwind classes
npm run build
```

**WebSocket Connection**
```bash
# Check backend is running on correct port
curl http://localhost:5000/api/health
```

---

<div align="center">

**Part of the QWERTY Quest project** • **[Main README](../README.md)** • **[Server README](../typemaster-server/README.md)**

Made with ❤️ by [Amit Raj](https://github.com/Asclepius-crown)

</div></content>
</xai:function_call name="filePath">C:\Users\Amit Raj\OneDrive\Desktop\final\QWERTY Quest\typemaster-client\README.md
