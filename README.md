# Signals Application

A modern signals processing and analysis application built with React, TypeScript, and Tailwind CSS.

## Features

- **Signals Management**: View and manage signals with a comprehensive table interface
- **Brand Management**: Track brand details, goals, and competitors
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support with proper interfaces
- **Modern UI**: Clean, accessible interface with proper ARIA attributes

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Main navigation
│   ├── PageHeader.tsx  # Page header with title and actions
│   └── Tabs.tsx        # Tab navigation component
├── pages/              # Page components
│   ├── SignalsPage.tsx # Signals management page
│   └── BrandPage.tsx   # Brand management page
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types and interfaces
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

### Signals Page
- Displays a table of signals with status indicators
- "New Signal" button for creating new signals
- Responsive table design with proper accessibility

### My Brand Page
- Tabbed interface with three sections:
  - **Details**: Brand information and basic details
  - **Goals**: Track brand objectives and milestones
  - **Competitors**: Monitor competitive landscape

## Accessibility Features

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Development Guidelines

- Use TypeScript for all components
- Follow React best practices
- Implement proper error handling
- Use Tailwind utility classes for styling
- Maintain accessibility standards
- Write clean, maintainable code
