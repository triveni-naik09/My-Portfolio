# Triveni Naik - Personal Portfolio Web Application

A modern, responsive, and luxury-themed Personal Portfolio web application for **Triveni Kamlesh Naik**, a 3rd-year **Electronics & Telecommunication Engineering** student at **S.B. Jain Institute of Technology, Management and Research, Nagpur**.

---

## 🌟 Key Features

- **Dashboard Cards Hub**: 8 interactive cards for *Personal Information, Education, Skills, Projects, Certificates, Achievements, Experience, and Contact*. Clicking any card launches a separate interactive dashboard modal with full technical specifications, and allows direct navigation.
- **Dark Burgundy / Deep Wine Theme**: Designed according to exact aesthetic specifications with deep maroon, dark wine, muted gold, and champagne accents.
- **Light / Dark Mode Switch**: Instant toggle between Deep Burgundy mode and Champagne Ivory luxury light mode (stored in `localStorage`).
- **Profile Photo Integration**: Professional portrait seamlessly framed with animated glowing ring accents.
- **Resume Management**:
  - Download Resume button (`/assets/Triveni_Naik_Resume.pdf`).
  - To replace with your own resume, simply drop your updated PDF file into `public/assets/Triveni_Naik_Resume.pdf`.
  - Built-in interactive Resume Preview modal.
- **RESTful Node.js + Express Backend**:
  - `GET /api/portfolio`: Delivers all portfolio data as JSON.
  - `POST /api/contact`: Handles contact form submissions and records messages in `data/messages.json`.
  - `GET /api/health`: Health monitoring endpoint for Render uptime checks.
- **Easy Color Customization**: All primary and accent colors are centralized in `:root` inside `public/css/style.css` for effortless modification.
- **GitHub & Render Ready**: Includes `package.json`, `.gitignore`, `render.yaml`, and static asset serving.

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) is installed on your computer:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
```bash
npm start
```
or
```bash
node server.js
```

### 4. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🌐 Deploying to Render (Step-by-Step)

This application is 100% pre-configured and ready to deploy on **Render**.

### Method 1: Connecting your GitHub Repository (Recommended)
1. Push this project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Triveni Naik Portfolio"
   git branch -M main
   git remote add origin https://github.com/triveni-naik09/triveni-portfolio.git
   git push -u origin main
   ```
2. Log in to [Render.com](https://render.com).
3. Click **"New +"** and select **"Web Service"**.
4. Choose **"Build and deploy from a Git repository"** and select your `triveni-portfolio` repository.
5. Render will detect the configuration:
   - **Name**: `triveni-portfolio`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Click **"Create Web Service"**.
7. Render will automatically build, deploy, and provide you with a live `https://triveni-portfolio.onrender.com` URL!

### Method 2: Render Blueprint (Using `render.yaml`)
1. On Render dashboard, click **"New +"** -> **"Blueprint"**.
2. Connect your GitHub repository.
3. Render will automatically read `render.yaml` and configure the service in seconds.

---

## 🎨 How to Customize Colors & Themes

Open [public/css/style.css](file:///c:/Users/TRIVENI/Desktop/Triveni-Porfolio/public/css/style.css). The very top section contains all theme variables:

```css
:root {
  /* DARK BURGUNDY / DEEP WINE THEME */
  --bg-primary: #120407;
  --bg-secondary: #1C070C;
  --primary-burgundy: #800020;
  --accent-gold: #D4AF37;
  --accent-gold-light: #E6C594;
  --accent-champagne: #F5E8D8;
  /* ... */
}
```
Simply edit these hexadecimal color values to customize the palette anytime.

---

## 📄 How to Replace the Resume

1. Place your own PDF file into the `public/assets/` folder.
2. Name it `Triveni_Naik_Resume.pdf` (or update the filename in `data/portfolio.json`).
3. Refresh the page – the Download Resume button and in-app preview will immediately reflect the new document.

---

## 👩‍💻 Author & Contact

**Triveni Kamlesh Naik**  
- **Course**: B.Tech (Electronics and Telecommunication Engineering), 3rd Year  
- **College**: S.B. Jain Institute of technology, Management and Research, Nagpur  
- **Email**: [ntriveni959@gmail.com](mailto:ntriveni959@gmail.com)  
- **Phone**: +91 9699116908  
- **LinkedIn**: [linkedin.com/in/triveni-naik](https://www.linkedin.com/in/triveni-naik-9273613a6)  
- **GitHub**: [github.com/triveni-naik09](https://github.com/triveni-naik09)  

Developed with love ❤️ by Triveni Naik. All rights reserved.
