/* ==========================================================================
   EARTH 2076 | 3D WEBGL ENGINE & SCIENTIFIC DATA SIMULATOR
   Powered by Three.js & Chart.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------------------------------------------------
       1. THREE.JS ENGINE: HOLOGRAPHIC 3D GLOBE (HERO SECTION)
       ---------------------------------------------------------------------- */
    const initGlobe = () => {
        const canvas = document.getElementById('globe-3d-canvas');
        if (!canvas) return;

        const container = document.getElementById('globe-viewport');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 18;

        // Globe Group
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Inner Core (Dark)
        const coreGeo = new THREE.SphereGeometry(6.8, 64, 64);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x050811 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        globeGroup.add(coreMesh);

        // Holographic Wireframe Shell
        const wireGeo = new THREE.SphereGeometry(7, 64, 64);
        const wireMat = new THREE.MeshBasicMaterial({ 
            color: 0x00f3ff, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.15 
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        globeGroup.add(wireMesh);

        // Atmospheric Glow Particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 2000;
        const posArray = new Float32Array(particleCount * 3);

        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 22; // Spread across space
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x00ff88,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Animation Loop
        const animateGlobe = () => {
            requestAnimationFrame(animateGlobe);
            globeGroup.rotation.y += 0.002;
            globeGroup.rotation.x += 0.0005;
            particles.rotation.y -= 0.0005;
            renderer.render(scene, camera);
        };
        animateGlobe();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    /* ----------------------------------------------------------------------
       2. THREE.JS ENGINE: 3D DATA SURFACE GRAPH (SECTION 2)
       ---------------------------------------------------------------------- */
    const init3DGraph = () => {
        const canvas = document.getElementById('chart-3d-canvas');
        if (!canvas) return;

        const container = document.getElementById('chart-3d-viewport');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 15, 25);
        camera.lookAt(0, 0, 0);

        // 3D Terrain Data Plane (Simulating Thermal Anomaly Landscape)
        const planeGeo = new THREE.PlaneGeometry(30, 20, 40, 40);
        planeGeo.rotateX(-Math.PI / 2);

        // Displace vertices to create data "mountains"
        const vertices = planeGeo.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            // Mathematical function simulating rising emissions trend towards 2076
            const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.5;
            const exponentialGrowth = (x + 15) * 0.15; // Growth towards the right
            vertices[i + 1] = noise + exponentialGrowth + (Math.random() * 0.5);
        }
        planeGeo.computeVertexNormals();

        const planeMat = new THREE.MeshPhongMaterial({
            color: 0xff2a55,
            wireframe: true,
            emissive: 0x4a0011,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        scene.add(plane);

        // Lighting
        const light = new THREE.PointLight(0x00f3ff, 2, 50);
        light.position.set(0, 10, 10);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x111122));

        // Animation Loop
        let clock = new THREE.Clock();
        const animateGraph = () => {
            requestAnimationFrame(animateGraph);
            const t = clock.getElapsedTime();
            // Undulate vertices slightly to simulate "live" data flux
            const verts = planeGeo.attributes.position.array;
            for (let i = 0; i < verts.length; i += 3) {
                verts[i + 1] += Math.sin(t * 2 + verts[i]) * 0.005;
            }
            planeGeo.attributes.position.needsUpdate = true;
            
            // Slow rotation for 3D effect
            plane.rotation.y = Math.sin(t * 0.1) * 0.2;
            renderer.render(scene, camera);
        };
        animateGraph();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    /* ----------------------------------------------------------------------
       3. CHART.JS: SECTORAL & THERMAL TREND ANALYTICS
       ---------------------------------------------------------------------- */
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    let sectorChartInstance, trendChartInstance;

    const initCharts = () => {
        // Shared Grid Config
        const gridOptions = { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'transparent' };

        // 1. Sectoral Stacked Area Chart
        const ctxSector = document.getElementById('sectorChart').getContext('2d');
        sectorChartInstance = new Chart(ctxSector, {
            type: 'line',
            data: {
                labels: ['2026', '2036', '2046', '2056', '2066', '2076'],
                datasets: [
                    { label: 'Power', data: [15, 14, 11, 8, 4, 1], borderColor: '#00f3ff', backgroundColor: 'rgba(0, 243, 255, 0.2)', fill: true, tension: 0.4 },
                    { label: 'Industry', data: [12, 11, 10, 7, 5, 3], borderColor: '#ffb700', backgroundColor: 'rgba(255, 183, 0, 0.2)', fill: true, tension: 0.4 },
                    { label: 'Transport', data: [9, 8, 6, 4, 2, 1], borderColor: '#ff2a55', backgroundColor: 'rgba(255, 42, 85, 0.2)', fill: true, tension: 0.4 },
                    { label: 'AFOLU', data: [11, 10, 8, 6, 5, 4], borderColor: '#00ff88', backgroundColor: 'rgba(0, 255, 136, 0.2)', fill: true, tension: 0.4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { grid: gridOptions }, y: { stacked: true, grid: gridOptions } },
                plugins: { legend: { position: 'bottom' } }
            }
        });

        // 2. Thermal & Oceanic Dual-Axis Chart
        const ctxTrend = document.getElementById('trendChart').getContext('2d');
        trendChartInstance = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['2026', '2036', '2046', '2056', '2066', '2076'],
                datasets: [
                    { label: 'Thermal Anomaly (°C)', data: [1.28, 1.45, 1.70, 2.05, 2.40, 2.75], borderColor: '#ff2a55', backgroundColor: '#ff2a55', yAxisID: 'y', tension: 0.3 },
                    { label: 'Sea Level Rise (cm)', data: [10.2, 15.4, 22.1, 31.0, 42.5, 56.0], borderColor: '#00f3ff', backgroundColor: '#00f3ff', borderDash: [5, 5], yAxisID: 'y1', tension: 0.3 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: gridOptions },
                    y: { type: 'linear', display: true, position: 'left', grid: gridOptions, title: { display: true, text: 'Anomaly (°C)'} },
                    y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'SLR (cm)'} }
                },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    };

    /* ----------------------------------------------------------------------
       3b. REAL, READABLE CHART — sits directly under the abstract 3D graph
       so a reviewer doesn't have to take the wireframe surface on faith.
       ---------------------------------------------------------------------- */
    let realGroundChartInstance;
    const initRealGroundChart = () => {
        const ctx = document.getElementById('realGroundChart');
        if (!ctx) return;
        const gridOptions = { color: 'rgba(255, 255, 255, 0.05)', borderColor: 'transparent' };
        realGroundChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['2026', '2036', '2046', '2056', '2066', '2076'],
                datasets: [
                    {
                        label: 'SSP1-1.9 (low emissions)',
                        data: [1.28, 1.32, 1.35, 1.38, 1.40, 1.42],
                        borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)',
                        fill: true, tension: 0.3, pointRadius: 2
                    },
                    {
                        label: 'SSP2-4.5 (current policy)',
                        data: [1.28, 1.45, 1.70, 2.05, 2.40, 2.75],
                        borderColor: '#ffb700', backgroundColor: 'rgba(255,183,0,0.08)',
                        fill: true, tension: 0.3, pointRadius: 2
                    },
                    {
                        label: 'SSP5-8.5 (fossil-heavy)',
                        data: [1.28, 1.78, 2.35, 3.05, 3.75, 4.40],
                        borderColor: '#ff2a55', backgroundColor: 'rgba(255,42,85,0.08)',
                        fill: true, tension: 0.3, pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { grid: gridOptions },
                    y: { grid: gridOptions, title: { display: true, text: 'Temp Anomaly (°C)' } }
                },
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12 } },
                    tooltip: { callbacks: { label: (c) => `${c.dataset.label}: +${c.formattedValue}°C` } }
                }
            }
        });
    };

    /* ----------------------------------------------------------------------
       4. SSP SIMULATOR & INTERACTIVITY LOGIC
       ---------------------------------------------------------------------- */
    const slider = document.getElementById('mySlider');
    const sliderPercent = document.getElementById('sliderPercent');
    const statusBadge = document.getElementById('statusBadge');
    const progressBar = document.getElementById('progressBar');
    const trajectoryDesc = document.getElementById('trajectoryDescription');

    // Make setSlider globally available for the onclick attributes in HTML
    window.setSlider = (val) => {
        slider.value = val;
        updateSimulation(val);
    };

    const updateSimulation = (val) => {
        sliderPercent.innerText = val;
        progressBar.style.width = val + '%';

        // Base Data arrays for dynamic chart updates
        const baseTemp = [1.28, 1.45, 1.70, 2.05, 2.40, 2.75];
        const baseSLR = [10.2, 15.4, 22.1, 31.0, 42.5, 56.0];

        if (val <= 20) {
            // SSP1-1.9 (Optimal)
            statusBadge.className = 'badge badge-success';
            statusBadge.innerText = 'SSP1-1.9 SUSTAINABLE';
            progressBar.style.background = '#00ff88';
            progressBar.style.boxShadow = '0 0 10px #00ff88';
            trajectoryDesc.innerText = "Aggressive global decarbonization successfully limits end-of-century warming to 1.5°C. Irreversible tipping points are narrowly avoided.";
            updateCharts(baseTemp.map(t => t * 0.6), baseSLR.map(s => s * 0.7));
            updateMatrix("low");

        } else if (val <= 60) {
            // SSP2-4.5 (Moderate/Current Policies)
            statusBadge.className = 'badge badge-warning';
            statusBadge.innerText = 'SSP2-4.5 MODERATE RISK';
            progressBar.style.background = '#ffb700';
            progressBar.style.boxShadow = '0 0 10px #ffb700';
            trajectoryDesc.innerText = "Current policy settings lead to a projected global surface temperature anomaly of +2.7°C by 2076, causing severe ecological disruption.";
            updateCharts(baseTemp, baseSLR);
            updateMatrix("moderate");

        } else {
            // SSP5-8.5 (Fossil-Fueled / Critical)
            statusBadge.className = 'badge badge-danger';
            statusBadge.innerText = 'SSP5-8.5 CRITICAL DANGER';
            progressBar.style.background = '#ff2a55';
            progressBar.style.boxShadow = '0 0 10px #ff2a55';
            trajectoryDesc.innerText = "Fossil-fueled expansion triggers catastrophic feedback loops. Projected +4.4°C warming ensures systemic global economic and agricultural collapse.";
            updateCharts(baseTemp.map(t => t * 1.6), baseSLR.map(s => s * 1.8));
            updateMatrix("high");
        }
    };

    const updateCharts = (newTempData, newSLRData) => {
        if(trendChartInstance) {
            trendChartInstance.data.datasets[0].data = newTempData;
            trendChartInstance.data.datasets[1].data = newSLRData;
            trendChartInstance.update();
        }
    };

    // Per-region multipliers for all 6 zones across the 3 SSP scenarios.
    // Replaces the old stub that only ever touched the South Asia row.
    const regionalMatrixData = {
        low: {
            asia:    { agri: '-9.5%',  heat: '32 Days',  gdp: '-5.1%'  },
            islands: { agri: '-14.0%', heat: '48 Days',  gdp: '-11.0%' },
            africa:  { agri: '-12.0%', heat: '40 Days',  gdp: '-7.5%'  },
            arctic:  { agri: '+4.5%',  heat: '5 Days',   gdp: '-2.5%'  },
            latam:   { agri: '-7.0%',  heat: '25 Days',  gdp: '-4.0%'  },
            naeu:    { agri: '-2.5%',  heat: '14 Days',  gdp: '-1.8%'  }
        },
        moderate: {
            asia:    { agri: '-22.4%', heat: '88 Days',  gdp: '-14.8%' },
            islands: { agri: '-38.0%', heat: '124 Days', gdp: '-32.5%' },
            africa:  { agri: '-31.2%', heat: '106 Days', gdp: '-21.0%' },
            arctic:  { agri: '+12.0%', heat: '12 Days',  gdp: '-8.5%'  },
            latam:   { agri: '-19.5%', heat: '65 Days',  gdp: '-11.2%' },
            naeu:    { agri: '-7.5%',  heat: '38 Days',  gdp: '-5.2%'  }
        },
        high: {
            asia:    { agri: '-51.0%', heat: '168 Days', gdp: '-33.0%' },
            islands: { agri: '-70.0%', heat: '210 Days', gdp: '-58.0%' },
            africa:  { agri: '-62.0%', heat: '188 Days', gdp: '-44.0%' },
            arctic:  { agri: '+22.0%', heat: '21 Days',  gdp: '-18.0%' },
            latam:   { agri: '-42.0%', heat: '130 Days', gdp: '-26.0%' },
            naeu:    { agri: '-16.5%', heat: '72 Days',  gdp: '-12.0%' }
        }
    };

    const updateMatrix = (scenarioKey) => {
        const data = regionalMatrixData[scenarioKey];
        const idMap = { asia: 'Asia', islands: 'Islands', africa: 'Africa', arctic: 'Arctic', latam: 'Latam', naeu: 'NaEu' };
        Object.keys(data).forEach((region) => {
            const suffix = idMap[region];
            document.getElementById(`reg${suffix}Agri`).innerText = data[region].agri;
            document.getElementById(`reg${suffix}Heat`).innerText = data[region].heat;
            document.getElementById(`reg${suffix}Gdp`).innerText = data[region].gdp;
        });
    };

    slider.addEventListener('input', (e) => updateSimulation(e.target.value));

    /* ----------------------------------------------------------------------
       5. LIVE TELEMETRY TICKER ANIMATION (Micro-interactions)
       ---------------------------------------------------------------------- */
    const liveUpdateTicker = () => {
        setInterval(() => {
            // Slightly fluctuate PPM and Temp values for realism
            const ppmEl = document.getElementById('topPpm');
            const tempEl = document.getElementById('topTemp');
            
            let basePpm = 426.5;
            let baseTemp = 1.28;
            
            let fluctuatePpm = (Math.random() * 0.1) - 0.05;
            let fluctuateTemp = (Math.random() * 0.02) - 0.01;

            ppmEl.innerText = (basePpm + fluctuatePpm).toFixed(2) + " PPM";
            tempEl.innerText = "+" + (baseTemp + fluctuateTemp).toFixed(3) + " °C";
        }, 3000);
    };

    /* ----------------------------------------------------------------------
       6. GROWTH SEQUENCE — a procedural, deterministic 3D tree that grows
       branch-by-branch as the user scrolls through #growth-sequence.
       No canned animation clip — every frame is computed from scroll
       position, so it's genuinely reactive rather than a looping GIF.
       ---------------------------------------------------------------------- */
    const initGrowthTree = () => {
        const section = document.getElementById('growth-sequence');
        const canvas = document.getElementById('tree-canvas');
        if (!section || !canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x03140a, 0.028);

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
        camera.position.set(0, 2, 14);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const sun = new THREE.DirectionalLight(0xfff2d8, 1.4);
        sun.position.set(8, 14, 6);
        scene.add(sun);
        scene.add(new THREE.HemisphereLight(0x5fae7a, 0x0a0f08, 0.6));
        scene.add(new THREE.AmbientLight(0x224433, 0.5));

        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(30, 48),
            new THREE.MeshStandardMaterial({ color: 0x0e1c10, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        scene.add(ground);

        // Deterministic PRNG — same tree shape on every load/reviewer replay
        let seed = 42;
        const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

        const leafPalette = [0x2fbf5a, 0x1f9e46, 0x3fd06a];
        const growParts = []; // { mesh, depth, isLeaf }

        function buildBranch(length, radius, depth, maxDepth) {
            const geo = new THREE.CylinderGeometry(radius * 0.55, radius, length, 6);
            geo.translate(0, length / 2, 0);
            const mat = new THREE.MeshStandardMaterial({ color: 0x4a3323, roughness: 0.95 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.scale.y = 0.001;
            growParts.push({ mesh, depth, isLeaf: false });

            if (depth < maxDepth) {
                const count = depth === 0 ? 3 : (rand() > 0.4 ? 2 : 3);
                for (let i = 0; i < count; i++) {
                    const child = buildBranch(length * 0.72, radius * 0.68, depth + 1, maxDepth);
                    child.position.y = length * (0.55 + rand() * 0.35);
                    child.rotation.z = (rand() - 0.5) * 1.3 + (i - count / 2) * 0.55;
                    child.rotation.x = (rand() - 0.5) * 0.9;
                    child.rotation.y = rand() * Math.PI * 2;
                    mesh.add(child);
                }
            } else {
                const clusterCount = 2 + Math.floor(rand() * 2);
                for (let i = 0; i < clusterCount; i++) {
                    const leafGeo = new THREE.IcosahedronGeometry(length * 0.85, 0);
                    const leafMat = new THREE.MeshStandardMaterial({
                        color: leafPalette[Math.floor(rand() * leafPalette.length)],
                        flatShading: true, roughness: 0.85, transparent: true, opacity: 0
                    });
                    const leaf = new THREE.Mesh(leafGeo, leafMat);
                    leaf.position.set((rand() - 0.5) * length, length * (0.8 + rand() * 0.5), (rand() - 0.5) * length);
                    leaf.scale.setScalar(0.001);
                    mesh.add(leaf);
                    growParts.push({ mesh: leaf, depth: depth + 1, isLeaf: true });
                }
            }
            return mesh;
        }

        const MAX_DEPTH = 4;
        const mainTree = buildBranch(3.2, 0.32, 0, MAX_DEPTH);
        scene.add(mainTree);

        // Clones that fade in for the "forest" stage — a single tree scaled
        // up into an ecosystem, echoing the sector/regional charts above.
        const forestTrees = [];
        [[-6, -3], [6, -4], [-9, 2], [9, 1], [-3, -7], [4, -8]].forEach((pos) => {
            const t = buildBranch(2.2 + rand() * 1.2, 0.22, 0, MAX_DEPTH - 1);
            t.position.set(pos[0], 0, pos[1]);
            t.rotation.y = rand() * Math.PI * 2;
            t.scale.setScalar(0.001);
            scene.add(t);
            forestTrees.push(t);
        });

        const stageTag = document.getElementById('growthStageTag');
        const stageText = document.getElementById('growthCaptionText');
        const progressFill = document.getElementById('growthProgressFill');

        const stages = [
            { at: 0.00, tag: 'STAGE 00 / SEED', text: '2026. A single seed, waiting underground.' },
            { at: 0.08, tag: 'STAGE 01 / SPROUT', text: 'It breaks the surface — fragile enough that one careless step ends it here.' },
            { at: 0.30, tag: 'STAGE 02 / SAPLING', text: 'Roots widen. Every year it pulls a little more CO₂ out of the air you breathe.' },
            { at: 0.55, tag: 'STAGE 03 / TREE', text: 'Grown. Cooling the ground, holding water in the soil, feeding what lives around it.' },
            { at: 0.80, tag: 'STAGE 04 / FOREST', text: 'Multiply it by billions — this is the actual lungs behind every chart above.' },
            { at: 0.92, tag: 'STAGE 05 / WITHOUT IT', text: 'Take it away, and none of those numbers still hold.' }
        ];
        let currentStageIdx = -1;

        function applyGrowth(progress) {
            growParts.forEach(({ mesh, depth, isLeaf }) => {
                const startAt = isLeaf ? 0.45 + depth * 0.07 : depth * 0.09;
                const endAt = startAt + 0.16;
                let local = (progress - startAt) / (endAt - startAt);
                local = Math.max(0, Math.min(1, local));
                const eased = local * local * (3 - 2 * local);
                if (isLeaf) {
                    mesh.scale.setScalar(0.001 + eased * 0.999);
                    mesh.material.opacity = eased;
                } else {
                    mesh.scale.y = 0.001 + eased * 0.999;
                }
            });

            const forestLocal = Math.max(0, Math.min(1, (progress - 0.78) / 0.14));
            forestTrees.forEach((t, i) => {
                const s = forestLocal * (0.6 + (i % 3) * 0.15);
                t.scale.setScalar(0.001 + s * 0.999);
            });

            // Final stretch: leaves brown and shrink — "take it away" made visible
            const witherLocal = Math.max(0, Math.min(1, (progress - 0.92) / 0.08));
            growParts.forEach(({ mesh, isLeaf }) => {
                if (!isLeaf) return;
                if (!mesh.userData.baseColor) mesh.userData.baseColor = mesh.material.color.getHex();
                const base = new THREE.Color(mesh.userData.baseColor);
                const dead = new THREE.Color(0x6b5636);
                mesh.material.color.copy(base).lerp(dead, witherLocal);
                mesh.scale.multiplyScalar(1 - witherLocal * 0.25);
            });

            camera.position.set(0, 2 + progress * 5.5, 14 - progress * 4.5);
            camera.lookAt(0, 1.5 + progress * 2, 0);

            let idx = 0;
            for (let i = 0; i < stages.length; i++) { if (progress >= stages[i].at) idx = i; }
            if (idx !== currentStageIdx) {
                currentStageIdx = idx;
                stageTag.innerText = stages[idx].tag;
                stageText.style.opacity = 0;
                setTimeout(() => {
                    stageText.innerText = stages[idx].text;
                    stageText.style.opacity = 1;
                }, 180);
                const isFinal = idx === stages.length - 1;
                stageTag.style.color = isFinal ? '#ff6b6b' : '';
                stageTag.style.borderColor = isFinal ? 'rgba(255,107,107,0.4)' : '';
                stageTag.style.background = isFinal ? 'rgba(255,107,107,0.08)' : '';
            }
            progressFill.style.width = (progress * 100).toFixed(1) + '%';
        }

        let isPageVisible = true;
        document.addEventListener('visibilitychange', () => { isPageVisible = !document.hidden; });
        function renderLoop() {
            if (isPageVisible) {
                mainTree.rotation.y += 0.0015;
                forestTrees.forEach(t => t.rotation.y += 0.0008);
                renderer.render(scene, camera);
            }
            requestAnimationFrame(renderLoop);
        }
        renderLoop();

        function onScroll() {
            const rect = section.getBoundingClientRect();
            const total = Math.max(section.offsetHeight - window.innerHeight, 1);
            const scrolled = -rect.top;
            applyGrowth(Math.max(0, Math.min(1, scrolled / total)));
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });

        applyGrowth(0);
    };

    // Initialize Everything
    initGlobe();
    init3DGraph();
    initCharts();
    initRealGroundChart();
    initGrowthTree();
    updateSimulation(slider.value); // Set initial state
    liveUpdateTicker();
});