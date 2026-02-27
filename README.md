# SHAKES | Luxury Milkshake Brand Experience

![SHAKES Preview](https://img.shields.io/badge/Status-Live_Ready-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Tech-HTML5_|_CSS3_|_JavaScript_|_GSAP_|_Canvas-black?style=for-the-badge)

Welcome to the **SHAKES** luxury landing page. This project was developed as an exploratory technical demonstration of high-end web design and advanced scrolling interactivity, tailored to reflect a premium fashion aesthetic.

## 🌟 The Core Innovation: Video-to-Canvas Scroll Animation

The defining feature of this project is the **Hero Section Scroll Animation**. Rather than relying on simple CSS transitions or generic video embeds, this project implements a highly optimized, scroll-bound sequence utilizing HTML5 `<canvas>` and GSAP. 

### Why Canvas over standard Video?
Traditional video playback linked to scroll events often yields choppy, unresponsive, and unpolished user experiences because browsers struggle to encode/decode video frames perfectly perfectly in sync with rapid scroll deltas. 

To overcome this and deliver a "butter-smooth" luxury experience, we engineered a custom pipeline:

1. **Frame Extraction (FFmpeg):** We took a high-quality 60fps slow-motion video of a milkshake splash and used FFmpeg to meticulously extract exactly 192 individual, uncompressed PNG frames.
2. **Preloading Architecture:** On application initialization, JavaScript preloads these high-fidelity frames into the browser's memory cache to guarantee zero latency during execution.
3. **Canvas Drawing & GSAP Sync:** Using the GSAP (GreenSock Animation Platform) `ScrollTrigger` plugin, the user's scroll position is mathematically mapped to a specific frame index `(0 to 191)`. `requestAnimationFrame` and standard Canvas 2D Context (`drawImage`) instantly paint the corresponding frame to the screen. 
4. **Visual Processing on the Fly:** The canvas is manipulated in real-time. We implemented an off-screen buffer strategy to apply live CSS-like filters (`brightness` and `contrast` modifications) natively to the canvas drawings, forcing the edges of the video frames to blend seamlessly into the pure `#000000` CSS background.

The result is a visually stunning, perfectly reactive parallax liquid scroll effect that feels tangibly connected to the user's touch/mouse wheel.

## ✨ Additional Features

* **Custom Micro-Interactions:** A bespoke, physics-based custom cursor and cursor follower crafted to invert against backgrounds (`mix-blend-mode`), elevating the navigational experience.
* **Premium UX/UI:** Adherence to luxury brand principles—extensive use of negative space, elegant typography (`Playfair Display` & `Outfit`), muted color palettes, and glassmorphism UI cards.
* **Flawless Mobile Translation:** The complex canvas sequence logic is preserved on mobile views through calculated absolute positioning and `z-index` stacking, ensuring performance does not degrade on handheld devices.
* **Direct SVG Integration:** Utilizing raw, in-line SVGs over font-icon libraries to guarantee pixel-perfect rendering and zero load-blocking dependencies.

## 🚀 Setup & Execution

This project uses Vite for lightning-fast HMR (Hot Module Replacement) and optimized production builds.

1. Clone the repository: `git clone https://github.com/InezTech/Shakes.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`

## 👨‍💻 Author

Developed with a focus on performance, physics-based UI, and premium aesthetics. Feel free to explore the `main.js` specifically for the Canvas animation logic!

---
*Created as a showcase of technical front-end fluidity and brand design.*
