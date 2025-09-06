# MY Retro Portfolio

#### Video Demo:  https://youtu.be/pwf4VilXv7A
#### Description:
This is my CS50x Final Project — a **retro-themed interactive portfolio website** that looks and feels like an old-school pixel desktop.  
It showcases my academic journey, projects, timeline, and certificates in a playful, nostalgic interface.  

The site features animated parallax mountains, pixel art folders, retro windows, and even a built-in terminal with a mini-game.  

---

## Motivation
I wanted to combine my passion for **Robotics & AI** with my love for **retro computing aesthetics**.  
Instead of a traditional portfolio, I built a desktop-style website where each section (About, Projects, Timeline, Contact) feels like opening a retro window.  

This project allowed me to apply the programming foundations I learned in **CS50x** (logic, state, abstraction) in a full-stack web app.  

---

## Technologies Used
- **Next.js 14 (App Router)** — for modern React-based frontend.  
- **Tailwind CSS** — for retro pixel styling and responsive layout.  
- **TypeScript** — for type safety and better structure.  
- **Custom Retro Components**:
  - `RetroWindow` — mimics old-school OS windows.  
  - `MiniTerminal` — interactive fake boot terminal with commands + mini-game.  
  - `FileExplorer` — folder-based certificate viewer.  
- **HTML Canvas** — used in background animations (parallax mountains, pixel stars).  

---

## Features
- 🎨 **Dynamic Pixel Background** — parallax mountains, clouds, trees, and stars.  
- 📂 **Retro Folders** — click to open About, Projects, Timeline, and Contact windows.  
- 🖥️ **Mini Terminal** — fake RetroOS boot logs, command input, and Dino-like robot game.  
- 📜 **Timeline** — academic & career milestones with clickable certificates.  
- 🗂️ **File Explorer** — retro folder interface for browsing certificates.  
- 📧 **Contact Form** — retro-styled form with input validation.  
- 🔄 **Scene Switching** — toggle between multiple backgrounds.  
- ❤️ **Pixel Details** — retro navbar, fake battery/wifi/calendar icons, and footer credits.  

---

## File Structure
/public/assets/ → images, icons, backgrounds, certificates
/src/app/components/ → React components

Navbar.tsx
Background.tsx
VerticalIcons.tsx
RetroWindow.tsx
MiniTerminal.tsx
FileExplorer.tsx
About.tsx
Projects.tsx
Timeline.tsx
Contact.tsx
CertViewer.tsx
BottomInfo.tsx
/src/app/page.tsx → main entry point

---

## How to Run Locally
1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd portfolio
   npm install
   npm run dev

© Rahul D Seervi 2025. All Rights Reserved.
Made with ❤️ and the power of AI.