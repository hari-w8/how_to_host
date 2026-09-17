# view site: https://hari-w8.github.io/how_to_host/
Absolutely 😎 Since this README is specifically about **what you learned and did while hosting a React + Vite project on GitHub Pages**, here's a clean progression you can paste directly into `README.md`.

````md
# 🚀 Hosting a React Project with GitHub Pages

This project documents my complete learning process for hosting a **React + Vite frontend on GitHub Pages**.

The goal was to understand how a React application goes from a local development environment to a publicly accessible website using Git, GitHub, and GitHub Pages.

---

## 🧰 Technologies & Tools

- React
- Vite
- Node.js
- npm
- Git
- GitHub
- GitHub CLI (`gh`)
- GitHub Pages
- SSH

---

# 📚 Complete Progression

## 1. Created the React Project

Started with a React + Vite project.

Project location:

```text
/home/hariharan/Music/how_to_host_by_github
````

The project contains the usual Vite structure:

```text
how_to_host_by_github/
│
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 2. Installed `gh-pages`

To deploy the Vite production build to GitHub Pages:

```bash
npm install --save-dev gh-pages
```

This installed the `gh-pages` package as a development dependency.

---

# 3. Initialized Git

Initialized a Git repository inside the project:

```bash
git init
```

Initially Git created the `master` branch.

I then changed it to `main`:

```bash
git branch -M main
```

---

# 4. Created the First Git Commit

Added the project files:

```bash
git add .
```

Created the first commit:

```bash
git commit -m "Initial commit"
```

At this point, the complete React project was tracked by Git.

---

# 5. Created a GitHub Repository

Created a public GitHub repository:

```text
how_to_host
```

GitHub repository:

[https://github.com/hari-w8/how_to_host](https://github.com/hari-w8/how_to_host)

---

# 6. Connected the Local Repository to GitHub

Initially, I accidentally used the wrong repository name.

The incorrect remote was:

```text
https://github.com/hari-w8/my-react-app.git
```

The actual repository was:

```text
how_to_host
```

So I corrected the remote.

The final remote was:

```text
git@github.com:hari-w8/how_to_host.git
```

Command:

```bash
git remote set-url origin git@github.com:hari-w8/how_to_host.git
```

Verified with:

```bash
git remote -v
```

---

# 7. GitHub Authentication

When trying to push using HTTPS, Git asked for:

```text
Username for 'https://github.com':
Password for 'https://hari-w8@github.com':
```

GitHub does not use the normal account password for Git HTTPS authentication.

Instead of manually creating a Personal Access Token, I decided to use **GitHub CLI + SSH**.

---

# 8. Installed GitHub CLI

Because I was using Arch Linux, I installed GitHub CLI using `pacman`:

```bash
sudo pacman -S github-cli
```

Verified the installation:

```bash
gh --version
```

Installed version:

```text
gh version 2.101.0
```

---

# 9. Authenticated GitHub CLI

Started GitHub authentication:

```bash
gh auth login
```

Selected:

```text
GitHub.com
```

Then selected:

```text
SSH
```

And authenticated using:

```text
Login with a web browser
```

GitHub provided a one-time device authentication code.

After completing the authentication in the browser, the GitHub account was connected successfully.

---

# 10. Configured SSH Remote

The GitHub CLI authentication was configured for SSH.

Changed the Git remote from HTTPS to SSH:

```bash
git remote set-url origin git@github.com:hari-w8/how_to_host.git
```

Verified:

```bash
git remote -v
```

Result:

```text
origin  git@github.com:hari-w8/how_to_host.git (fetch)
origin  git@github.com:hari-w8/how_to_host.git (push)
```

---

# 11. Tested SSH Authentication

Tested the SSH connection:

```bash
ssh -T git@github.com
```

GitHub responded:

```text
Hi hari-w8! You've successfully authenticated, but GitHub does not provide shell access.
```

This confirmed that the SSH key was correctly connected to GitHub.

---

# 12. Pushed the React Project to GitHub

After configuring SSH:

```bash
git push -u origin main
```

The React source code was successfully uploaded to the GitHub repository.

---

# 13. Configured Vite for GitHub Pages

GitHub Pages hosts the project under a repository path.

Because the repository is:

```text
how_to_host
```

Vite needs to know that the application will be served from:

```text
/how_to_host/
```

Updated `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/how_to_host/',
})
```

The `base` configuration is important because otherwise Vite may generate incorrect paths for JavaScript and CSS assets.

---

# 14. Added Deployment Scripts

Updated `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

The important scripts are:

### Build

```bash
npm run build
```

Creates the production build:

```text
dist/
```

### Deploy

```bash
npm run deploy
```

First runs:

```bash
npm run build
```

and then publishes:

```text
dist/
```

to the `gh-pages` branch.

---

# 15. First Deployment Problem

When running:

```bash
npm run deploy
```

the Vite build succeeded:

```text
✓ built in ...
```

But deployment initially failed with:

```text
fatal: a branch named 'gh-pages' already exists
```

I checked my local branches:

```bash
git branch
```

Only `main` existed.

Therefore, the `gh-pages` branch was not a normal local branch.

The problem was caused by the deployment package's cached Git repository.

---

# 16. Cleared the `gh-pages` Cache

Removed the cached deployment repository:

```bash
rm -rf node_modules/.cache/gh-pages
```

Then ran the deployment again:

```bash
npm run deploy
```

This time the deployment succeeded:

```text
Published
```

---

# 17. GitHub Pages Configuration

Opened:

```text
GitHub Repository
    ↓
Settings
    ↓
Pages
```

Under **Build and deployment**, selected:

```text
Source: Deploy from a branch
```

Branch:

```text
gh-pages
```

Folder:

```text
/ (root)
```

GitHub then started building the Pages website from the `gh-pages` branch.

---

# 18. Final Website 🎉

The React application is now publicly hosted using GitHub Pages.

Live website:

[https://hari-w8.github.io/how_to_host/](https://hari-w8.github.io/how_to_host/)

GitHub repository:

[https://github.com/hari-w8/how_to_host](https://github.com/hari-w8/how_to_host)

---

# 🧠 What I Learned

Through this process, I learned how the different parts work together.

### Git

Git tracks changes in the local project:

```text
Project
   ↓
git add
   ↓
git commit
```

### GitHub

GitHub stores the Git repository remotely:

```text
Local Git Repository
        ↓
    git push
        ↓
      GitHub
```

### Vite

Vite converts the React development project into production-ready static files:

```text
React Source Code
       ↓
npm run build
       ↓
dist/
```

### GitHub Pages

GitHub Pages serves the production files to users:

```text
dist/
  ↓
gh-pages branch
  ↓
GitHub Pages
  ↓
Public Website
```

---

# 🔄 Complete Deployment Workflow

For future changes, the workflow is:

```bash
# 1. Make changes to the React project

# 2. Check changes
git status

# 3. Add changes
git add .

# 4. Commit changes
git commit -m "Update website"

# 5. Push source code to GitHub
git push

# 6. Build React and deploy to GitHub Pages
npm run deploy
```

---

# 🏗️ Deployment Architecture

```text
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │   Local Project     │
                    └──────────┬──────────┘
                               │
                               │ git commit
                               ▼
                    ┌─────────────────────┐
                    │    Local Git        │
                    │       main          │
                    └──────────┬──────────┘
                               │
                               │ git push
                               ▼
                    ┌─────────────────────┐
                    │       GitHub        │
                    │       main          │
                    │   Source Code       │
                    └──────────┬──────────┘
                               │
                               │ npm run deploy
                               ▼
                    ┌─────────────────────┐
                    │     Vite Build      │
                    │                     │
                    │      dist/          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      gh-pages       │
                    │   Production Files  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   GitHub Pages      │
                    │                     │
                    │   Public Website    │
                    └─────────────────────┘
```

---

# 📌 Important Commands

### Git

```bash
git init
git add .
git commit -m "message"
git branch -M main
git remote -v
git push -u origin main
```

### GitHub CLI

```bash
gh --version
gh auth login
gh auth status
```

### SSH

```bash
ssh -T git@github.com
ssh-add ~/.ssh/id_ed25519
```

### React / Vite

```bash
npm install
npm run dev
npm run build
npm run preview
```

### GitHub Pages

```bash
npm install --save-dev gh-pages
npm run deploy
```

---

# ⚠️ Important Notes

## 1. Vite `base`

For a repository called:

```text
my-project
```

the Vite configuration should generally use:

```js
base: '/my-project/'
```

For this project:

```js
base: '/how_to_host/'
```

---

## 2. GitHub Pages does not run the React development server

GitHub Pages does not run:

```bash
npm run dev
```

Instead, Vite creates static production files:

```bash
npm run build
```

which produces:

```text
dist/
```

GitHub Pages serves those files.

---

## 3. Source and deployment branches

This project uses two different purposes:

```text
main
│
└── React source code
```

and:

```text
gh-pages
│
└── Production build
```

`main` is where development code is stored.

`gh-pages` contains the files used by GitHub Pages.

---

# 🎯 Final Result

I successfully learned how to take a React + Vite project from:

```text
Local React Project
```

to:

```text
Git Repository
```

to:

```text
GitHub
```

to:

```text
Production Build
```

to:

```text
GitHub Pages
```

and finally to a publicly accessible website:

🌐 **[https://hari-w8.github.io/how_to_host/](https://hari-w8.github.io/how_to_host/)**

```

One small recommendation: since your **actual repository is `how_to_host`**, I'd rename the local folder from `how_to_host_by_github` to `how_to_host` too if you want the project structure to be less confusing. It isn't technically required.
```


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
