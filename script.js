/* ═══════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Divyanshu Kumar
   Performance-optimised: lazy Three.js, lazy D3, rIC deferral
═══════════════════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR (runs immediately — lightweight) ─── */
(function () {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  let crx = 0, cry = 0;
  function animateRing() {
    crx += (mx - crx) * 0.12;
    cry += (my - cry) * 0.12;
    ring.style.left = crx + 'px';
    ring.style.top  = cry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

/* ─── SCROLL PROGRESS (passive, cheap) ─── */
(function () {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─── NAV SCROLL STYLE (passive, cheap) ─── */
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(8,8,16,0.92)'
      : 'rgba(8,8,16,0.7)';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   HERO TEXT ANIMATIONS
   Runs immediately — pure DOM, no heavy libs needed
═══════════════════════════════════════════════════════════ */
(function () {
  /* Letter-by-letter name reveal via CSS animation classes */
  const name = 'Divyanshu Gour';
  const el   = document.getElementById('heroName');
  name.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    /* Use CSS animation delay instead of GSAP for zero-dependency FCP */
    span.style.cssText = `animation: charReveal 0.5s ${0.8 + i * 0.055}s forwards;`;
    el.appendChild(span);
  });

  /* Typewriter subtitle */
  const phrases = ['ML Engineer', 'Computer Vision Researcher', 'RAG Systems Builder', 'XAI Enthusiast'];
  const tw = document.getElementById('typewriter');
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      tw.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 75);
    } else {
      tw.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 1600);
})();

/* ═══════════════════════════════════════════════════════════
   HERO — THREE.JS NEURAL NETWORK
   Lazy: only initialise AFTER window load AND canvas visible
═══════════════════════════════════════════════════════════ */
function initNeuralNet(canvasId, isAmbient) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth  || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  /* Cap pixel ratio at 1.5 (perf fix #10) */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.set(0, 0, 18);

  /* Layer structure: [3, 5, 5, 4, 2] */
  const layers = [3, 5, 5, 4, 2];
  const layerSpacing = 5;
  const nodes   = [];
  const edges   = [];
  const particles = [];

  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x6C63FF });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x6C63FF, transparent: true, opacity: 0.15 });

  /* Build nodes */
  layers.forEach((count, li) => {
    const x = (li - (layers.length - 1) / 2) * layerSpacing;
    for (let ni = 0; ni < count; ni++) {
      const y   = (ni - (count - 1) / 2) * 2.2;
      const geo = new THREE.SphereGeometry(0.22, 12, 12);
      const mesh = new THREE.Mesh(geo, nodeMat.clone());
      mesh.position.set(x, y, (Math.random() - 0.5) * 1.5);
      scene.add(mesh);

      /* Glow sphere */
      const glowGeo = new THREE.SphereGeometry(0.44, 12, 12);
      const glow    = new THREE.Mesh(glowGeo, glowMat.clone());
      mesh.add(glow);

      nodes.push({ mesh, layer: li, index: ni, baseY: y });
    }
  });

  /* Build edges between consecutive layers */
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6C63FF, transparent: true, opacity: 0.18 });

  let layerStart = 0;
  for (let li = 0; li < layers.length - 1; li++) {
    const fromCount = layers[li];
    const toCount   = layers[li + 1];
    const fromNodes = nodes.slice(layerStart, layerStart + fromCount);
    const toStart   = layerStart + fromCount;
    const toNodes   = nodes.slice(toStart, toStart + toCount);

    fromNodes.forEach(fn => {
      toNodes.forEach(tn => {
        const geo  = new THREE.BufferGeometry().setFromPoints([fn.mesh.position.clone(), tn.mesh.position.clone()]);
        const line = new THREE.Line(geo, lineMat.clone());
        scene.add(line);
        edges.push({ line, from: fn, to: tn });
      });
    });
    layerStart += fromCount;
  }

  /* Signal particles */
  function spawnParticle() {
    if (isAmbient) return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const geo  = new THREE.SphereGeometry(0.08, 6, 6);
    const mat  = new THREE.MeshBasicMaterial({ color: 0x00F5D4 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    particles.push({ mesh, edge, t: 0, speed: 0.008 + Math.random() * 0.012 });
  }

  for (let i = 0; i < 12; i++) spawnParticle();
  setInterval(spawnParticle, 600);

  /* Mouse orbit (hero only) */
  let isDragging = false, prevMX = 0, prevMY = 0;
  let rotY = 0, rotX = 0;

  if (!isAmbient) {
    canvas.addEventListener('mousedown', e => { isDragging = true; prevMX = e.clientX; prevMY = e.clientY; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      rotY += (e.clientX - prevMX) * 0.005;
      rotX += (e.clientY - prevMY) * 0.005;
      prevMX = e.clientX; prevMY = e.clientY;
    });
  }

  /* Node hover tooltips (hero only) */
  const tooltipLabels = [
    'Feature Extractor','Attention Head','Skip Connection','Residual Block',
    'Batch Norm','ReLU Gate','Softmax','Max Pooling','Conv Layer','Dense Layer'
  ];
  const heroTooltip = document.createElement('div');
  heroTooltip.style.cssText = `
    position:fixed;background:rgba(8,8,16,0.9);border:1px solid #6C63FF;
    border-radius:5px;padding:5px 10px;font-family:'JetBrains Mono',monospace;
    font-size:11px;color:#00F5D4;pointer-events:none;opacity:0;
    transition:opacity 0.2s;z-index:500;
  `;
  if (!isAmbient) document.body.appendChild(heroTooltip);

  const raycaster  = new THREE.Raycaster();
  const mouse2D    = new THREE.Vector2();
  const nodeMeshes = nodes.map(n => n.mesh);

  if (!isAmbient) {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse2D.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2D.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2D, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length) {
        const idx = nodeMeshes.indexOf(hits[0].object);
        heroTooltip.textContent = tooltipLabels[idx % tooltipLabels.length];
        heroTooltip.style.left  = (e.clientX + 16) + 'px';
        heroTooltip.style.top   = (e.clientY + 8)  + 'px';
        heroTooltip.style.opacity = '1';
      } else {
        heroTooltip.style.opacity = '0';
      }
    });
  }

  /* Resize */
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  /* Animation loop */
  const clock = new THREE.Clock();
  const group = new THREE.Group();
  nodes.forEach(n => group.add(n.mesh));
  edges.forEach(e => group.add(e.line));
  scene.add(group);

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* Gentle auto-rotate */
    group.rotation.y = rotY + t * (isAmbient ? 0.05 : 0.08);
    group.rotation.x = rotX + (isAmbient ? 0 : Math.sin(t * 0.15) * 0.06);

    /* Node pulse (hero only — saves GPU in ambient) */
    if (!isAmbient) {
      nodes.forEach((n, i) => {
        const pulse = 1 + 0.12 * Math.sin(t * 1.5 + i * 0.7);
        n.mesh.scale.setScalar(pulse);
        n.mesh.material.opacity = 0.7 + 0.3 * Math.sin(t * 1.2 + i);
      });
    }

    /* Particles along edges */
    particles.forEach(p => {
      p.t += p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.edge = edges[Math.floor(Math.random() * edges.length)];
      }
      const fp = p.edge.from.mesh.position.clone().applyMatrix4(group.matrixWorld);
      const tp = p.edge.to.mesh.position.clone().applyMatrix4(group.matrixWorld);
      p.mesh.position.lerpVectors(fp, tp, p.t);
    });

    renderer.render(scene, camera);
  }
  animate();
}

/* ── Lazy-init hero Three.js: wait for window load + canvas visible ── */
window.addEventListener('load', () => {
  const heroCanvas = document.getElementById('neuralCanvas');
  if (!heroCanvas) return;

  /* Use IntersectionObserver so we don't block critical render */
  const heroIO = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    heroIO.disconnect();
    /* Give browser a frame to paint the hero text before heavy 3D work */
    requestAnimationFrame(() => initNeuralNet('neuralCanvas', false));
  }, { threshold: 0.01 });
  heroIO.observe(heroCanvas);

  /* Also init the ambient contact canvas after the hero is done */
  initNeuralNet('contactCanvas', true);
});

/* ═══════════════════════════════════════════════════════════
   HEAVY SETUP — deferred via requestIdleCallback
   Section reveals, stat counters, GSAP cards, D3 graph
   All wrapped so they don't block first paint
═══════════════════════════════════════════════════════════ */
function scheduleHeavyWork(fn) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 200); /* fallback for Safari */
  }
}

scheduleHeavyWork(function () {

  /* ─── INTERSECTION OBSERVER — section reveals ─── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-text').forEach(el => revealIO.observe(el));

  /* ─── STAT COUNTERS ─── */
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1400;
      const start = performance.now();
      function update(now) {
        const pct = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(pct * end);
        if (pct < 1) requestAnimationFrame(update);
        else el.textContent = end;
      }
      requestAnimationFrame(update);
      statIO.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => statIO.observe(el));

  /* ─── GSAP PROJECT CARDS ─── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.project-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: (i % 3) * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ─── D3 SKILLS FORCE GRAPH — lazy-loaded ─── */
  (function () {
    const container = document.querySelector('.skills-graph-container');
    if (!container) return;

    const skillData = {
      nodes: [
        /* Deep Learning */
        { id: 'PyTorch',      group: 'dl',   size: 22, ctx: 'Primary framework for all deep learning research' },
        { id: 'TensorFlow',   group: 'dl',   size: 16, ctx: 'Used for model deployment and transfer learning' },
        { id: 'HuggingFace',  group: 'dl',   size: 18, ctx: 'Transformers, tokenizers, and model hubs' },
        { id: 'ViT',          group: 'dl',   size: 15, ctx: 'Vision Transformer for image classification' },
        { id: 'U-Net',        group: 'dl',   size: 20, ctx: 'Core architecture for MRI segmentation at IIT Roorkee' },
        { id: 'SegFormer',    group: 'dl',   size: 16, ctx: 'Semantic segmentation in XAI benchmarking' },
        /* Computer Vision */
        { id: 'OpenCV',       group: 'cv',   size: 18, ctx: 'Image preprocessing and augmentation pipelines' },
        { id: 'MONAI',        group: 'cv',   size: 17, ctx: 'Medical imaging toolkit for brain MRI pipeline' },
        { id: 'FSL',          group: 'cv',   size: 14, ctx: 'MRI preprocessing at IIT Roorkee' },
        { id: 'Grad-CAM++',   group: 'cv',   size: 20, ctx: 'Saliency method benchmarked in XAI framework' },
        { id: 'LIME',         group: 'cv',   size: 16, ctx: 'Perturbation-based explainability method' },
        { id: 'SHAP',         group: 'cv',   size: 14, ctx: 'Feature attribution analysis' },
        /* RAG / LLM */
        { id: 'LangChain',    group: 'rag',  size: 18, ctx: 'Orchestration layer for RAG pipelines at EKLabs' },
        { id: 'Qdrant',       group: 'rag',  size: 20, ctx: 'Vector store for Sanskrit attribution + GraphRAG' },
        { id: 'Neo4j',        group: 'rag',  size: 17, ctx: 'Knowledge graph in GraphRAG production system' },
        { id: 'Mistral',      group: 'rag',  size: 18, ctx: 'LLM backbone for Sanskrit attribution engine' },
        { id: 'Ollama',       group: 'rag',  size: 13, ctx: 'Local LLM inference for dev/testing' },
        /* Dev Tools */
        { id: 'Python',       group: 'dev',  size: 24, ctx: 'Primary language across all projects' },
        { id: 'FastAPI',      group: 'dev',  size: 16, ctx: 'REST API backend for production ML systems' },
        { id: 'Flask',        group: 'dev',  size: 15, ctx: 'Backend for placement portal and prototypes' },
        { id: 'Docker',       group: 'dev',  size: 15, ctx: 'Containerization for production deployments' },
        { id: 'Git',          group: 'dev',  size: 14, ctx: 'Version control across all projects' },
        /* Data */
        { id: 'Pandas',       group: 'data', size: 16, ctx: 'Data wrangling and analysis pipelines' },
        { id: 'NumPy',        group: 'data', size: 16, ctx: 'Numerical computing core' },
        { id: 'scikit-learn', group: 'data', size: 15, ctx: 'Classical ML models and preprocessing' },
      ],
      links: [
        { source: 'PyTorch',    target: 'U-Net' },
        { source: 'PyTorch',    target: 'SegFormer' },
        { source: 'PyTorch',    target: 'ViT' },
        { source: 'PyTorch',    target: 'Grad-CAM++' },
        { source: 'U-Net',      target: 'MONAI' },
        { source: 'U-Net',      target: 'FSL' },
        { source: 'SegFormer',  target: 'MONAI' },
        { source: 'MONAI',      target: 'OpenCV' },
        { source: 'Grad-CAM++', target: 'LIME' },
        { source: 'LIME',       target: 'SHAP' },
        { source: 'HuggingFace',target: 'Mistral' },
        { source: 'Mistral',    target: 'Qdrant' },
        { source: 'Qdrant',     target: 'LangChain' },
        { source: 'Qdrant',     target: 'Neo4j' },
        { source: 'LangChain',  target: 'FastAPI' },
        { source: 'Python',     target: 'PyTorch' },
        { source: 'Python',     target: 'LangChain' },
        { source: 'Python',     target: 'FastAPI' },
        { source: 'Python',     target: 'Flask' },
        { source: 'Python',     target: 'Pandas' },
        { source: 'Pandas',     target: 'NumPy' },
        { source: 'NumPy',      target: 'scikit-learn' },
        { source: 'Docker',     target: 'FastAPI' },
      ]
    };

    const colors = { dl: '#6C63FF', cv: '#00F5D4', rag: '#FF4D6D', dev: '#E8E8F0', data: '#FFB347' };
    const tooltip = document.getElementById('skillTooltip');

    function initGraph() {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const svg = d3.select('#skillsGraph').attr('width', W).attr('height', H);

      const sim = d3.forceSimulation(skillData.nodes)
        .force('link', d3.forceLink(skillData.links).id(d => d.id).distance(90).strength(0.4))
        .force('charge', d3.forceManyBody().strength(-220))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide().radius(d => d.size + 8));

      const link = svg.append('g').selectAll('line')
        .data(skillData.links).join('line')
        .attr('stroke', '#6C63FF').attr('stroke-opacity', 0.2).attr('stroke-width', 1.2);

      const node = svg.append('g').selectAll('g')
        .data(skillData.nodes).join('g').attr('cursor', 'default');

      node.append('circle')
        .attr('r', d => d.size / 2)
        .attr('fill', d => colors[d.group]).attr('fill-opacity', 0.85)
        .attr('stroke', d => colors[d.group]).attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);

      node.append('text')
        .text(d => d.id).attr('text-anchor', 'middle')
        .attr('dy', d => d.size / 2 + 14).attr('fill', '#E8E8F0')
        .attr('font-family', 'JetBrains Mono').attr('font-size', 10).attr('fill-opacity', 0.7);

      /* Hover highlight */
      node.on('mouseenter', function (event, d) {
        const connected = new Set([d.id]);
        skillData.links.forEach(l => {
          if (l.source.id === d.id) connected.add(l.target.id);
          if (l.target.id === d.id) connected.add(l.source.id);
        });
        node.attr('opacity', n => connected.has(n.id) ? 1 : 0.15);
        link.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.7 : 0.03);
        tooltip.innerHTML = `<strong>${d.id}</strong>${d.ctx}`;
        tooltip.style.opacity = '1';
      });

      node.on('mousemove', function (event) {
        const rect = container.getBoundingClientRect();
        tooltip.style.left = (event.clientX - rect.left + 14) + 'px';
        tooltip.style.top  = (event.clientY - rect.top  + 8)  + 'px';
      });

      node.on('mouseleave', function () {
        node.attr('opacity', 1);
        link.attr('stroke-opacity', 0.2);
        tooltip.style.opacity = '0';
      });

      sim.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      });

      /* Breathing idle wobble */
      setInterval(() => { sim.alpha(0.05).restart(); }, 3500);
    }

    /* IntersectionObserver — load D3 dynamically when skills enters viewport */
    const skillsIO = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      skillsIO.disconnect();

      if (typeof d3 !== 'undefined') {
        initGraph();
      } else {
        /* Dynamically inject D3 only when needed */
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
        s.onload = () => initGraph();
        document.head.appendChild(s);
      }
    }, { threshold: 0.1 });

    skillsIO.observe(container);
  })();

}); /* end scheduleHeavyWork */

/* ═══════════════════════════════════════════════════════════
   CONTACT — COPY EMAIL
═══════════════════════════════════════════════════════════ */
function copyEmail() {
  const email = 'divyanshugour123@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    btn.style.color = '#00F5D4';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
  });
}

/* ═══════════════════════════════════════════════════════════
   BFCACHE — use pagehide instead of unload
   (No cleanup needed here, but this ensures bfcache works)
═══════════════════════════════════════════════════════════ */
window.addEventListener('pagehide', () => {
  /* Safe cleanup if ever needed — pagehide is bfcache-compatible */
}, { capture: true });
