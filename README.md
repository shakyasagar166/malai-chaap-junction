# Svad Malai Chaap Junction 🍢🔥
### Full-Stack Restaurant Digital QR Menu & Kitchen Ordering System

A modern, fast, full-stack restaurant QR menu and table ordering application built specifically for **Svad Malai Chaap Junction** (Sanjay Nagar, Sector-23, Ghaziabad).

---

## 🌟 Key Highlights & Features

- **137 Authentic Menu Items across 13 Categories** fully transcribed from the restaurant's menu cards:
  1. **Veg. Tandoori** (19 items) - Malai Chaap, Afghani Chaap, Veg Seekh Kabab, Sunny Leoni Chaap, Mia Khalifa Chaap, etc.
  2. **Veg. Roll** (19 items) - Malai Chaap Roll, Pudina Chaap Roll, Tikka Roll, etc.
  3. **Chaap Gravy** (22 items) - Butter Chaap, Veg Butter Chicken Chaap, Champaran Chicken Chaap, Handi Mutton Chaap, Kaathi Gravy with 2 Rumali, etc.
  4. **Veg. Daal** (5 items) - Daal Makhni, Amritsari Daal, Daal Tadka (500 ml), etc.
  5. **Svad Paneer Gravy** (16 items) - Sahi Paneer, Paneer Lababdar, Paneer Butter Masala, Malai Kofta, etc.
  6. **Breads** (15 items) - Tandoori Roti, Garlic Naan, Rumali Roti, Paneer Pyaz Prantha, etc.
  7. **Rice** (5 items) - Veg Biryani, Pulao, Fried Rice, Jeera Rice.
  8. **Raita** (3 items) - Boondi Raita, Mix Raita, Plain Dahi.
  9. **Noodles** (5 items) - Hakka Noodles, Singapuri, Paneer Noodles.
  10. **Potato Masti** (5 items) - Honey Chilly Potato, Chilly Paneer, French Fries.
  11. **Special Tikka** (8 items) - Malai Paneer Tikka, Mushroom Tikka, Pudina Tikka.
  12. **Momos Magic** (9 items) - Steam, Kurkure, Afghani & Gravy Momos (Half 6 pcs / Full 10 pcs).
  13. **King Rolls** (6 items) - Spring Roll, Malai Paneer Roll, Afghani Roll.

- **Dynamic Half & Full Price Selection** right on item cards.
- **Pure Vegetarian Branding** with clean green veg indicators.
- **Table QR Standee Generator**: Print high-res QR tent standees for Tables 1 to 20. Scanning automatically opens the menu with that table pre-selected (`/?table=X`).
- **Modern Dialogs with Light-Dismiss**: Item detail customizer and table selector using native `<dialog closedby="any">` with fallback.
- **Slide-out Cart & Dual Checkout**:
  1. Live backend order submission to Spring Boot + MySQL
  2. One-click formatted WhatsApp order directly to `+91 99-1101-3993`
- **Kitchen Display System (KDS)**: Real-time order stream with status workflow (Pending ➔ Preparing ➔ Served ➔ Completed).
- **Menu Stock Control**: Instant toggle between "In Stock" and "Sold Out".

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, QR Code Generator (`qrcode.react`), Canvas Confetti.
- **Backend**: Java 17/25, Spring Boot 3.2.5, Spring Data JPA, RESTful APIs, CommandLineRunner Data Seeder.
- **Database**: MySQL 8.0 (`malai_chaap_junction_db`).

---

## 🚀 How to Run Locally

### 1. Backend (Spring Boot + MySQL)

1. Make sure MySQL service is running on port 3306.
2. In `backend/src/main/resources/application.properties`, verify your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/malai_chaap_junction_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=9058605348
   ```
3. Run the backend using the included Maven wrapper:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will automatically start on port 8080 and seed all 137 menu items into MySQL!*

### 2. Frontend (React + Vite)

1. Open a new terminal in the `frontend` folder:
   ```powershell
   cd frontend
   npm run dev
   ```
2. Open your browser at `http://localhost:5173`.
3. Try scanning or opening with a table number:
   `http://localhost:5173/?table=3`

---

## 🔑 Admin & Kitchen Login Credentials

- **URL**: `http://localhost:5173/?page=admin` or top-right Lock icon
- **Username**: `admin`
- **Password**: `malai@2026`
- **Master Quick PIN**: `1234`

---

## 📱 Mobile Phone Testing (Over Local Wi-Fi)

1. Connect your PC and Mobile phone to the same Wi-Fi or Mobile Hotspot.
2. Open the mobile network URL shown in the terminal (e.g., `http://10.136.198.117:5173/`).
3. Or click **"Open on Phone"** in the top navigation bar to scan the QR code directly with your phone camera!
