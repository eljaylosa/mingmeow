# Meow Page 🐱💌

An interactive digital postcard site — create, customize, preview, and share a little meow with someone.

## Features
- **Landing Page**: Charming introductory screen with floating cat animation and clear call-to-action.
- **Postcard Editor**: Live-bound recipient ("To"), multiline message, sender ("From"), and cat face picker.
- **Interactive Postcard**: 3D flip interaction (front and back faces), hover lift and tilt, and interactive cat bounce reactions.
- **Sharing & Exporting**: 
  - Download postcard as a high-resolution PNG image (powered by `html2canvas`).
  - Copy postcard text directly to clipboard.
  - Native Web Share API integration on mobile devices with smart desktop fallback.
- **Responsive & Accessible**: Fully responsive across mobile, tablet, and desktop screens with keyboard navigation support and reduced-motion respect.

## Structure
```
meow-page/
├── index.html
├── create.html
├── css/
│   ├── style.css       # base layout & visual design
│   ├── animations.css  # interactions & micro-animations
│   └── responsive.css  # mobile & responsive polish
├── js/
│   ├── main.js         # general site behavior
│   ├── postcard.js     # postcard state & live preview
│   └── share.js        # download, copy & share architecture
└── assets/
    ├── cats/
    ├── backgrounds/
    ├── stickers/
    └── sounds/
```

## How to Run
Simply open `index.html` in any modern web browser. No build step, no server, and no dependencies required (other than `html2canvas` loaded via CDN).
