# Google Integration Setup Guide

Follow these steps to generate the necessary keys for your `.env` file.

## 1. Google Cloud Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **New Project** (e.g., "Todo App").
3. **Enable Sheets API**:
   - Go to **APIs & Services** > **Library**.
   - Search for **"Google Sheets API"**.
   - Click **Enable**.
4. **Configure OAuth Consent Screen**:
   - Go to **APIs & Services** > **OAuth consent screen**.
   - Choose **External** and Click **Create**.
   - Fill in the required app information (App Name, Support Email).
   - Skip "Scopes" for now (or add `.../auth/spreadsheets` if you want to be specific, but the app handles this).
   - Add yourself as a **Test User** (enter your google email).
5. **Create Credentials**:
   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** > **OAuth client ID**.
   - Application Type: **Web application**.
   - Name: "React Client".
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5173`
   - Click **Create**.
   - **COPY** the **Client ID** (it looks like `123...apps.googleusercontent.com`).

## 2. Google Sheet Setup
1. Go to [Google Sheets](https://docs.google.com/spreadsheets).
2. Create a **Blank** spreadsheet.
3. (Optional) Name it "Todo Data".
4. Look at the URL in your browser:
   `https://docs.google.com/spreadsheets/d/1aBcD...xyz/edit`
   The **ID** is the long string between `/d/` and `/edit`.
   Example: `1aBcD...xyz`
5. **COPY** this ID.

## 3. Configure Env
1. Open the `.env` file in your project:
   ```env
   VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
   VITE_GOOGLE_SPREADSHEET_ID=paste_your_sheet_id_here
   ```
2. **RESTART** your development server:
   - Click in the terminal.
   - Press `Ctrl+C` to stop.
   - Run `npm run dev` again.

## 4. Test
1. Open the app (`http://localhost:5173`).
2. Click "Sign in with Google".
3. Allow access.
4. Try adding a task!
