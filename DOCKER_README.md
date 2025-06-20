# Docker Setup for Foodie App (Frontend + Backend + SWIGGY Integration)

This setup runs your frontend and backend in containers, with SWIGGY automation triggered on demand.

## Architecture

- **Frontend Container**: React app (port 5173)
- **Backend Container**: Node.js API (port 5000)
- **SWIGGY Setup**: Separate docker-compose in SWIGGY folder (selenium-chrome + swiggy-bot)

## Quick Start

1. **Start Frontend and Backend:**
   ```bash 
   cd /Users/dhruvrawat/crazyy/Foodie
   docker-compose up --build
   ```
   This starts:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:5000

2. **Trigger SWIGGY automation from your frontend:**
   ```javascript
   fetch('http://localhost:5000/trigger', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: "Paneer Butter Masala",
       voteCount: 3,
       restaurantName: "Royal Dhaba"
     })
   })
   ```

## How It Works

1. **Frontend** → User clicks "Swiggy" button
2. **Frontend** → POST to `http://localhost:5000/trigger`
3. **Backend** → Writes data to `SWIGGY/temp_data.json`
4. **Backend** → Starts selenium-chrome container
5. **Backend** → Starts swiggy-bot container
6. **You** → Go to Docker Desktop and click "Play" on swiggy-bot container
7. **SWIGGY Bot** → Reads data and performs automation
8. **Selenium Chrome** → Executes browser automation
9. **You watch** → At http://localhost:7900

## Container Details

### frontend
- **Port:** 5173 (Vite dev server)
- **Purpose:** React application
- **Hot reload:** Enabled with volume mounts

### backend
- **Port:** 5000 (mapped from 8080)
- **Purpose:** Node.js API that triggers SWIGGY automation
- **Volume:** SWIGGY folder mounted for shared access

### SWIGGY Setup (Separate)
- **Location:** `SWIGGY/` folder
- **selenium-chrome:** Browser automation (ports 4444, 7900)
- **swiggy-bot:** Python automation script (triggered by backend)

## API Endpoints

- `POST /trigger` - Triggers SWIGGY automation
  - **Body:** `{ "name": "Food Name", "voteCount": 3, "restaurantName": "Restaurant Name" }`
  - **Response:** JSON with execution status

## Manual SWIGGY Control

### Start SWIGGY Only:
```bash
cd SWIGGY
docker-compose up --build
```

### Watch Automation:
- Open http://localhost:7900
- You'll see the Chrome browser

### Manual Play:
- Open Docker Desktop
- Find the `swiggy-bot` container
- Click the "Play" button to run the script

## Development Workflow

1. **Start the app:** `docker-compose up --build`
2. **Frontend:** http://localhost:5173
3. **Backend:** http://localhost:5000
4. **Trigger automation:** Click Swiggy button in frontend
5. **Watch automation:** http://localhost:7900
6. **Manual control:** Use Docker Desktop for swiggy-bot

## Stopping Services

```bash
# Stop frontend and backend
docker-compose down

# Stop SWIGGY services
cd SWIGGY && docker-compose down
```

## Troubleshooting

- **Frontend logs:** `docker-compose logs frontend`
- **Backend logs:** `docker-compose logs backend`
- **SWIGGY logs:** `cd SWIGGY && docker-compose logs`
- **Selenium not starting:** Check if ports 4444/7900 are free
- **SWIGGY bot not running:** Check Docker Desktop and click "Play"

## File Structure

```
Foodie/
├── docker-compose.yml          ← Frontend + Backend
├── frontend/
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── Dockerfile
│   └── ...
└── SWIGGY/
    ├── docker-compose.yml      ← Selenium + SWIGGY Bot
    ├── Dockerfile
    └── ...
``` 