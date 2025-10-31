// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { seedIfEmpty } from "./mock_server/api/db/seedData"; // 👈 import seeder

async function enableMocking() {

  try {
    const { worker } = await import("./mock_server/api/msw/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
      delay: () => Math.floor(Math.random() * 1000) + 200,
    });
    console.log("[MSW] ✅ Mock Service Worker started");
  } catch (err) {
    console.error("[MSW] ❌ Failed to start worker:", err);
  }
}

async function prepareApp() {
  // 1️⃣ Start MSW if needed
  await enableMocking();

  // 2️⃣ Seed IndexedDB with initial data (if empty)
  try {
    await seedIfEmpty();
    console.log("[DB] ✅ Seed data loaded successfully");
  } catch (err) {
    console.error("[DB] ❌ Failed to seed database:", err);
  }

  // 3️⃣ Mount the app
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

// 🚀 Initialize everything
prepareApp();
