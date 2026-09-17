# FIRDAY
> *"Your ESP32, Ready to Wake."*

[![GitHub Repo](https://img.shields.io/badge/GitHub-paras999000%2FFriday-181717?logo=github)](https://github.com/paras999000/Friday)
[![Target](https://img.shields.io/badge/Target-ESP32%20Dev%20Module-06B6D4)](#)
[![Flash](https://img.shields.io/badge/Web%20Serial-esptool--js-8B5CF6)](#)

**FIRDAY** is a futuristic yet dead-simple web-based firmware flashing platform engineered specifically for the standard **ESP32 Dev Module**, delivering voice assistant firmware powered by the XiaoZhi ESP32 source repository.

---

## ⚡ Key Highlights

- **Exclusively for ESP32 Dev Module**: No board selectors, no multi-board confusion. Automatically targets the standard ESP32 Dev Module (WROOM-32 / Xtensa Dual-Core LX6 @ 240 MHz, 4 MB SPI Flash).
- **Practical Physical Hardware Flashing**: Powered by `esptool-js` 0.6.1 with real-time serial diagnostics, physical eFuse MAC retrieval, hardware RTS/DTR reset, and automatic baud rate elevation to 460,800 baud.
- **Genuine Production Firmware**: Bundles and serves real compiled XiaoZhi `bread-compact-esp32` production firmware (`merged-binary.bin`, 3.4 MB) containing the bootloader, partition table, otadata, app image, and audio assets.
- **100% English User Interface**: Pure English across all screens, navigation, dialogs, progress stages, and terminal logs.
- **Three-Stage Intuitive Workflow**:
  `01 CONNECT` → `02 FLASH` → `03 READY`
- **Zero Toolchain Overhead**: No ESP-IDF, PlatformIO, Python virtual environments, flash addresses, or partition tables required.
- **Single-File Flash Standard**: Writes unified `merged-binary.bin` images directly at offset `0x00000000`.
- **Hardware Simulation Mode**: Built-in toggle switch (`MOCK: ON/OFF`) for testing and demonstrations without physical hardware.

---

## 📂 Project Structure

```
├── frontend/             # React + TypeScript + Vite + Tailwind CSS + esptool-js
│   ├── src/
│   │   ├── components/   # Navbar, Hero, ConnectDevice, FirmwareSummary, FlashProgress, FlashStages, TerminalLog, SuccessScreen, Modals
│   │   ├── services/     # Web Serial Flasher, Mock Flasher, API client
│   │   └── types/        # Typed schemas
├── backend/              # Node.js + Express + TypeScript service
│   ├── src/
│   │   ├── routes/       # /api/firmware endpoints (device specs, build runner, download)
│   │   ├── services/     # Build runner & artifact generator
│   │   └── utils/        # Security validators
├── firmware/             # Upstream XiaoZhi ESP32 firmware source repository
│   ├── main/boards/      # bread-compact-esp32 (ESP32 Dev Module target)
│   ├── scripts/          # build.py compilation script
│   └── partitions/v2/    # 4m.csv partition table
├── docker-compose.yml    # Full-stack container orchestration
├── .env.example          # Environment variable template
└── README.md
```

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs at `http://localhost:3001`.*

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔌 Flashing Steps

1. Plug your **ESP32 Dev Module** into a USB port using a data-capable cable (ensure it is not a charge-only cable).
2. Open `http://localhost:5173/` in **Google Chrome**, **Microsoft Edge**, or any Chromium browser supporting Web Serial.
3. Click **Start Flashing**.
4. In **Step 01 (CONNECT)**, click **Connect ESP32** and select your serial port.
   > **Hardware Tip:** If your board fails to auto-sync, hold down the **BOOT** button on the ESP32 board while clicking **Connect ESP32**, then release it once connected.
5. In **Step 02 (FLASH)**, review your connection specs and click **Flash FIRDAY**. The flasher uploads the 3.4 MB genuine firmware image at 460,800 baud.
6. In **Step 03 (READY)**, the browser triggers an RTS/DTR hardware reset, disconnects cleanly, and your ESP32 boots up FIRDAY!

---

## 🛠 Backend API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check and platform version |
| `/api/firmware/device` | `GET` | Standard ESP32 Dev Module specifications |
| `/api/firmware/build` | `POST` | Enqueue firmware compilation for ESP32 Dev Module |
| `/api/firmware/build/:jobId` | `GET` | Status and progress of active build job |
| `/api/firmware/build/:jobId/logs` | `GET` | Compiler output stream |
| `/api/firmware/build/:jobId/manifest` | `GET` | Build manifest metadata |
| `/api/firmware/build/:jobId/download` | `GET` | Download compiled 4 MB `merged-binary.bin` |
| `/api/firmware/build/:jobId/cancel` | `POST` | Cancel a running build job |

---

## 📄 License
MIT
