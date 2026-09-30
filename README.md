# VitaSync — by MoveOn AI Solutions

VitaSync is a multi-agent clinical decision support platform by **MoveOn AI Solutions**. It provides real-time patient monitoring, multi-agent AI swarm reasoning, and pharmacogenomic (PGx) safety checks that catch dangerous prescriptions before they are written.

## Features

- **Multi-Agent AI Swarm** — Cardiology, Pharmacogenomics, and Critic agents collaborate on every care decision
- **Real-Time Monitoring** — Live vitals, ECG waveform, and drug-allele conflict detection
- **Pharmacogenomic Safety Engine** — CPIC Level A allele scanning (CYP2C19, CYP2D6, TPMT, DPYD)
- **Prior Authorization Auto-Generation** — Payer forms pre-filled with ICD-10 codes and genotype evidence
- **Doctor Knowledge Base** — Integrated clinical guidelines and expertise repository
- **Physician Sign-Off** — HIPAA-aligned approval workflow with human override

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7 (HashRouter — GitHub Pages friendly)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server (real-time)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The dev server prints a local URL (default http://localhost:5173). Open it in the browser to run VitaSync in real time.

## Deploying to GitHub Pages

VitaSync is preconfigured for GitHub Pages:

- `vite.config.js` uses `base: './'` so assets load regardless of the repository name.
- Routing uses `HashRouter`, so deep links work without server-side rewrites.
- A `.nojekyll` file is included so Pages serves the built assets as-is.

### Option A — Automatic (GitHub Actions)

1. Push the project to a GitHub repository (branch `main`).
2. In the repo, go to **Settings → Pages → Build and deployment** and set the source to **GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option B — Manual (gh-pages CLI)

```bash
npm run deploy
```

This builds the app and publishes the `dist` folder to the `gh-pages` branch. Then set **Settings → Pages** source to the `gh-pages` branch.

## Project Structure

- `src/pages/` — Landing, Dashboard, Login, Patients
- `src/components/` — UI components (Header, sidebars, modals, monitors)
- `src/data/` — Mock database and drug-interaction engine
- `src/assets/` — Static assets

## MoveOn AI Solutions

VitaSync is developed and maintained by MoveOn AI Solutions, specializing in healthcare AI and clinical decision support systems.
