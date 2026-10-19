# Ceylon Compass

Ceylon Compass helps visitors discover places around Panadura, Sri Lanka, view them on a map, and build a one-day itinerary. An administrator can add, edit, and delete places and upload their images.

The current application uses **React + Vite + Tailwind CSS** for the frontend, **Node.js + Express** for the API, and **MySQL/MariaDB (XAMPP)** for the database. This stack is intentional.

## Requirements

- Node.js 18 or later and npm
- XAMPP with MySQL/MariaDB; start Apache as well if you want to use phpMyAdmin
- A browser with internet access for OpenStreetMap map tiles

## Project files

| Path | Purpose |
| --- | --- |
| `backend/` | Express API, MySQL connection, admin authentication, image uploads |
| `backend/database/ceylon_compass.sql` | Database export with tables and current place/category data |
| `backend/database/createAdmin.js` | Create an admin account or reset its password |
| `backend/uploads/` | Images referenced by the database export |
| `frontend/` | React application and Tailwind styles |
| `.vscode/settings.json` | Makes VS Code accept Tailwind's CSS directives without yellow CSS warnings |

**Keep `backend/uploads/` together with `ceylon_compass.sql`.** The export contains image paths such as `/uploads/example.jpg`, but the SQL file does not contain the image bytes. If you copy the project through Git, note that uploaded images are ignored by `.gitignore`; copy them separately from your backup. `seed.sql` is not used.

## 1. Import the database

1. Start **MySQL** in XAMPP. For phpMyAdmin, also start **Apache**.
2. Open `http://localhost/phpmyadmin`.
3. Create a database named **`ceylon_compass`** with `utf8mb4` character set (choose `utf8mb4_unicode_ci` if phpMyAdmin asks for a collation).
4. Select that database, open **Import**, choose `backend/database/ceylon_compass.sql`, and click **Go**.
5. Check that `admins`, `categories`, and `places` exist.

The SQL file is an export of existing data. **Import it into a new/empty database.** It does not create the database itself and will conflict with existing tables if imported again into an already initialized database. Back up your database and `backend/uploads/` before replacing an existing installation.

## 2. Start the backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Create `backend/.env` by copying `backend/.env.example`. On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit `backend/.env` to match your local setup:

```dotenv
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ceylon_compass
JWT_SECRET=replace_with_a_long_random_private_value
JWT_EXPIRES_IN=2h
REFERENCE_LAT=6.7136
REFERENCE_LNG=79.9298
MAX_RADIUS_KM=25
CLIENT_ORIGIN=http://localhost:5173
```

For a default local XAMPP installation, the MySQL user is often `root` with an empty password. If your installation differs, update `DB_USER`, `DB_PASSWORD`, and `DB_PORT`. Set your own private `JWT_SECRET`; do not commit `.env`.

The imported SQL contains an admin account, but its existing password cannot be recovered from the hash. To set a password you know, run the script below from **`backend/`** (replace the example password):

```bash
node database/createAdmin.js admin ChooseYourOwnPassword
```

Running this command for an existing username **resets its password**. Then start the API:

```bash
npm run dev
```

Check `http://localhost:5000/api/health`; a working API returns JSON with `"status":"ok"`. `npm start` also works if you prefer to start without nodemon.

## 3. Start the frontend

Open a **second terminal** in the project root:

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux use `cp .env.example .env`. It should contain:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open the **Local** URL printed by Vite (normally `http://localhost:5173`). Keep both terminals running. To check a production frontend build, run `npm run build` from `frontend/`.

## Using the system

| Page | What you can do |
| --- | --- |
| `/` | View the homepage and destination highlights |
| `/places` | Explore places, search and filter, open details, add places to a plan |
| `/map` | Explore place markers on the interactive map |
| `/itinerary` | Generate, print, or download a one-day plan |
| `/admin/login` | Sign in using the admin account you configured |
| `/admin/dashboard` | Add, edit, and delete places; view success or error messages |

The public pages do not need login. Admin place management requires login. The place form accepts a primary image and up to two additional images; uploaded files are stored in `backend/uploads/`. The itinerary selection is kept in the browser, and downloading a plan creates a JSON file; the app does not store users' plans in MySQL.

## Reference point and distance

`REFERENCE_LAT`, `REFERENCE_LNG`, and `MAX_RADIUS_KM` in `backend/.env` control the reference point and radius. Place distances are calculated by the API from each place's coordinates; they are **not stored in the SQL table**. Restart the backend after changing these environment values, then refresh the browser. `GET /api/config` exposes the current values to the frontend.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Frontend says it could not load places | Confirm the backend is running, open `/api/health`, and verify `frontend/.env` points to the API's actual port. |
| Database connection error | Start MySQL in XAMPP; check database name, port, username, and password in `backend/.env`. |
| Images are missing | Check that `backend/uploads/` contains the files referenced by the SQL data. Copy the uploaded image folder along with the database export. |
| Admin login fails | Reset the admin password with `node database/createAdmin.js admin ChooseYourOwnPassword` from `backend/`. |
| Browser blocks API requests | Check that `CLIENT_ORIGIN` matches the frontend URL printed by Vite; restart the backend after changing it. |
| `index.css` shows yellow `Unknown at rule` warnings in VS Code | Open the **project root folder** in VS Code so `.vscode/settings.json` applies. Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`) provides Tailwind-aware editing. |

`frontend/src/index.css` intentionally uses Tailwind v3's `@tailwind`, `@apply`, `@layer`, and `theme()` syntax. The project-level VS Code setting only silences the standard CSS check for unknown at-rules; it does not change the generated styles or hide other CSS warnings.
