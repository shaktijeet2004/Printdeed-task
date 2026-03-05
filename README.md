# DesignEditor ✦

A powerful, browser-based design editor inspired by tools like Canva — built from scratch with **React 19** and **Konva**. Create posters, social media graphics, presentations, and more with a sleek, modern interface.

---

## ✨ Features

### 🎨 Design Tools
- **Text** — Add headings (H1/H2), body text, small text with 6+ font presets
- **Shapes** — 9 SVG elements: rectangle, circle, triangle, star, diamond, hexagon, pentagon, arrow, heart
- **Images** — Upload images from your device and place them on the canvas
- **Backgrounds** — 30+ color presets, custom color picker, or upload a background image

### 🧱 Panels
- **Text Panel** — Add and style text elements
- **Quick Edit** — Edit all text content at once from one place
- **Elements Panel** — Browse and add shapes to the canvas
- **Uploads Panel** — Manage uploaded images
- **Background Panel** — Customize canvas background
- **Layers Panel** — Reorder, rename, lock, and toggle visibility of elements
- **Properties Panel** — Fine-tune position, size, rotation, colors, fonts, and opacity

### ⚡ Canvas
- Drag-and-drop positioning
- Resize handles with aspect ratio control
- Inline text editing (double-click)
- Click-to-select with visual selection indicator
- Zoom in/out with percentage display

### 🛠️ Productivity
- **Undo/Redo** — Full history support
- **Keyboard Shortcuts** — Built-in shortcuts with a help modal
- **Template Presets** — 20+ canvas size presets across categories:
  - Social Media (Instagram, Facebook, Twitter/X, LinkedIn, YouTube, Pinterest, TikTok, Snapchat)
  - Video & Screen (1080p, 4K, Ultrawide, Presentation)
  - Print (A4, A3, Letter, Poster, Business Card)
  - Misc (Logo Square, Logo Wide, Custom)
- **PNG Export** — Download your design as a high-quality PNG
- **Dark / Light Theme** — Toggle between themes with smooth transitions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks & context API |
| **Vite 7** | Lightning-fast build tool & dev server |
| **Konva** | HTML5 Canvas rendering engine |
| **React-Konva** | React bindings for Konva |
| **Vanilla CSS** | Custom styling with CSS variables & dark/light theme |
| **Inter (Google Fonts)** | Modern typography |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/design-editor.git
cd design-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 📁 Project Structure

```
design-editor/
├── public/
│   └── favicon.svg            # Custom "D" logo favicon
├── src/
│   ├── components/
│   │   ├── Canvas.jsx         # Main Konva canvas with all interactions
│   │   ├── TopBar.jsx         # Top toolbar (undo, redo, zoom, export)
│   │   ├── Sidebar.jsx        # Left icon sidebar for panel navigation
│   │   ├── TemplateSizeModal.jsx
│   │   ├── KeyboardShortcutsModal.jsx
│   │   └── panels/
│   │       ├── TextPanel.jsx
│   │       ├── QuickEditPanel.jsx
│   │       ├── ElementsPanel.jsx
│   │       ├── UploadsPanel.jsx
│   │       ├── BackgroundPanel.jsx
│   │       ├── LayersPanel.jsx
│   │       └── PropertiesPanel.jsx
│   ├── context/
│   │   ├── DesignContext.jsx   # Global design state (elements, canvas, history)
│   │   └── ThemeContext.jsx    # Theme toggle state
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css              # All styles with CSS variables
├── index.html
├── vite.config.js
└── package.json
```

---

## 🌐 Live Demo

https://design-editor-omega.vercel.app/

---

