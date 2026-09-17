# FIRDAY
> *"Your ESP32, Ready to Wake."*

**FIRDAY** is a web-based firmware installation platform engineered specifically for the standard **ESP32 Dev Module**, powered by the XiaoZhi ESP32 firmware repository.

---

## ⚡ Key Highlights

- **Exclusively for ESP32 Dev Module**: No board selectors, no multi-board confusion. Automatically targets the standard ESP32 Dev Module (WROOM-32 / Xtensa Dual-Core LX6 @ 240 MHz).
- **100% English User Interface**: Pure English across all screens, navigation, dialogs, progress stages, and user-facing logs.
- **Three-Stage Workflow**:
  `01 CONNECT` → `02 FLASH` → `03 READY`
- **Zero Toolchain Overhead**: No ESP-IDF, PlatformIO, Python virtual environments, flash addresses, or partition tables required.
- **Single-File Flash Standard**: Writes unified 4 MB `merged-binary.bin` images directly at offset `0x00000000`.
- **Browser-Native Web Serial**: Directly flashes over USB via Chromium Web Serial (`esptool-js`) with automatic chip detection and baud rate negotiation.
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

1. Plug your **ESP32 Dev Module** into a USB port using a data-capable cable.
2. Open `http://localhost:5173/` in **Google Chrome** or **Microsoft Edge**.
3. Click **Start Flashing**.
4. In **Step 01 (CONNECT)**, click **Connect ESP32** and select your port.
5. In **Step 02 (FLASH)**, review your connection specs and click **Flash FIRDAY**.
6. In **Step 03 (READY)**, your ESP32 reboots into FIRDAY, verified and ready to wake.

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
