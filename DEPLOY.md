# GitHub Pages Deployment Guide

Follow these steps to host your app completely on GitHub.

## 1. Setup GitHub Repo
1.  Go to [github.com/new](https://github.com/new).
2.  Name your repository (e.g., `todo-app`).
3.  Click **Create repository**.
4.  Run these commands in your VS Code terminal (replace `YOUR_USERNAME` and `REPO_NAME`):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## 2. Configure for GitHub Pages
1.  Open `vite.config.js` in this project.
2.  Change `base: './'` to `base: '/REPO_NAME/'` (e.g. `base: '/todo-app/'`).
3.  Save the file.

## 3. Deploy
1.  Run this command in your terminal:
    ```bash
    npm run deploy
    ```
    (This builds your app and pushes it to a special `gh-pages` branch).

## 4. Final Google Config
1.  Wait a few minutes. Your site will be at: `https://YOUR_USERNAME.github.io/REPO_NAME/`
2.  Go back to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
3.  Edit your **OAuth 2.0 Client ID**.
4.  Add your new GitHub Pages URL (e.g., `https://santhosh.github.io`) to **Authorized JavaScript origins**.
5.  Add the full URL (e.g., `https://santhosh.github.io/todo-app/`) to **Authorized redirect URIs**.
6.  Save.

Done! Your app is hosted on GitHub.
