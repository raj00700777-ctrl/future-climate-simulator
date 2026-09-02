# 🌍 Earth 2076 — Climate Trajectory Simulator

An interactive, data-driven web simulator that visualizes how Earth's climate could evolve between 2026 and 2076 under three different carbon emission pathways (IPCC-style SSP scenarios), built for **Hack Club's Future** program.

Built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build step. Clone it and open `index.html`.

---

## ✨ Features

- **Interactive WebGL Globe** — a rotating 3D Earth rendered with Three.js
- **SSP Scenario Simulator** — drag a slider between low, moderate, and high emission pathways and watch temperature / sea-level projections update live
- **3D Scrollable Terrain Graph** — a volumetric surface visualizing decadal temperature forcing, paired with a real, readable Chart.js line chart so the data is never just an abstract shape
- **Sectoral Emissions Inventory** — breakdown of global CO₂ output by sector
- **Regional Vulnerability Matrix** — agriculture, extreme-heat days, and GDP impact across 6 world regions, fully dynamic across all three scenarios
- **Scientific Research Library** — curated references framing the simulation
- **Emissions Timeline & Clean-Tech Roadmap** — historical context and mitigation pathways
- **Growth Sequence** — a procedurally generated, scroll-driven 3D tree that grows from seed to forest as you scroll, ending on a deliberate "without it, none of this holds" moment — the emotional throughline connecting the data above to why it matters

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, no framework) |
| Logic | Vanilla JavaScript (ES6+) |
| 3D Rendering | [Three.js](https://threejs.org/) r128 |
| Charts | [Chart.js](https://www.chartjs.org/) |

## 🚀 Running Locally

```bash
git clone https://github.com/raj00700777-ctrl/future-climate-simulator.git
cd future-climate-simulator
```

Then just open `index.html` in a browser — or, for the best experience (some browsers restrict local file access for canvas/fetch), serve it with a lightweight local server:

```bash
# Python
python -m http.server 5500

# or VS Code's "Live Server" extension
```

## 📁 Project Structure

```
future-climate-simulator/
├── index.html      # Markup for every section
├── style.css        # All styling, layout, and responsive rules
├── script.js        # Simulation logic, chart rendering, 3D scenes
└── README.md
```

## 🎯 Built For

[Hack Club's Future](https://future.hackclub.com) program — the brief: build something exploring what the future looks like, imagined or projected. This project models one specific, data-grounded version of it: the climate we're on track for, and why forests are part of every number on the page.

## 🤖 Development Notes

Parts of this project — particularly the 3D scenes and animation logic — were built with AI-assisted pair programming, then reviewed and adjusted by hand. Happy to walk through any part of the implementation on request.

## 📄 License

MIT — see [LICENSE](./LICENSE).
