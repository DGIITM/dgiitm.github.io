Build me a jaw-dropping personal portfolio website for Divyanshu Kumar (DG) — a final-year 
BS Data Science student at IIT Madras with a research background in deep learning, computer 
vision, XAI, and RAG systems. The goal: when anyone opens this site, the first reaction should 
be pure "what the fuck" — in the best way.

---

## TECH STACK

- Vanilla HTML + CSS + JavaScript only (no frameworks unless absolutely necessary for a 
  specific feature — if you use one, justify it)
- Three.js (via CDN) for 3D/WebGL effects
- GSAP (via CDN) for scroll animations and timeline-based transitions
- Single-file output preferred; bundle CSS and JS inline or in separate linked files
- Mobile responsive — but desktop is the primary experience

---

## OVERALL VISUAL DIRECTION

Dark theme by default. Not "tech bro dark" — more like a research terminal meets 
high-end digital art. The aesthetic should feel like a GPU thinking.

Color palette:
- Background: #080810 (near-black with a blue tint)
- Primary accent: #6C63FF (electric violet — for highlights, glows, borders)
- Secondary accent: #00F5D4 (cyan-teal — for data, code, metrics)
- Text primary: #E8E8F0
- Text muted: #6B6B8A
- Danger/alert: #FF4D6D (used sparingly for impact)

Typography:
- Headings: "Space Grotesk" or "DM Sans" from Google Fonts — geometric, modern
- Body: "Inter" — clean and readable
- Code/terminal: "JetBrains Mono"

---

## SECTIONS (in order)

### 1. HERO — The "WTF" moment

Full viewport. A live, interactive Neural Network Visualization built with Three.js:
- Render a 3D layered neural network (input → hidden layers → output) with nodes 
  (spheres) and edges (lines) floating in 3D space
- Nodes pulse with a slow glow animation; edges carry animated "signal" particles 
  flowing from input to output, simulating forward propagation
- The whole structure slowly rotates on the Y-axis — the user can drag to orbit it
- On hover over a node, show a tooltip with a fake neuron label (e.g., "Feature 
  Extractor", "Attention Head", "Skip Connection")
- OVER this canvas, centered:
    - A small tag in monospace: `<researcher />`
    - Name: "Divyanshu Kumar" in 72px, bold, white — with a letter-by-letter 
      reveal animation on load (stagger each character, sliding up from below)
    - Subtitle typewriter effect (loop through): "ML Engineer", "Computer Vision 
      Researcher", "RAG Systems Builder", "XAI Enthusiast"
    - Two CTA buttons: "View My Work" (scrolls to projects) and "Read My Research" 
      (scrolls to research) — styled with glowing violet borders
- Scroll indicator at the bottom: a pulsing arrow with "scroll to explore"

### 2. ABOUT — The human behind the model

Split layout:
- Left: A stylized ASCII-art or SVG illustration of a face/figure (abstract, not 
  a photo placeholder)
- Right: A short paragraph about DG:
  "Final-year BS Data Science student at IIT Madras. 14-month research intern 
   at IIT Roorkee under Prof. Millie Pant — working on deep learning, medical 
   image segmentation, and explainability. Founding ML Engineer at EKLabs, 
   building production RAG pipelines. Interested in the intersection of 
   interpretability, retrieval, and real-world deployment."
- Below the bio: animated stat counters that count up on scroll-into-view:
    - 14 months of research experience
    - 3+ published/submitted papers
    - 2 production ML systems shipped
    - 1 ICPR submission

### 3. SKILLS — Tech Stack as a Living Graph

Do NOT do a boring bar chart or icon grid. Instead:
- Render an interactive force-directed graph using D3.js (via CDN)
- Nodes = individual skills/tools, sized by proficiency
- Node categories (color-coded):
    - Deep Learning: PyTorch, TensorFlow, HuggingFace, ViT, U-Net, SegFormer
    - Computer Vision: OpenCV, MONAI, FSL, Grad-CAM++, LIME, SHAP
    - RAG/LLM: LangChain, Qdrant, Neo4j, GraphRAG, Mistral, Ollama
    - Dev Tools: Python, FastAPI, Flask, Docker, Git, Linux
    - Data: Pandas, NumPy, scikit-learn, SQL
- Edges connect related skills (e.g., PyTorch → U-Net → MONAI)
- Hovering a node highlights it + its direct connections, fades everything else
- Clicking a node shows a small tooltip: skill name + 1-line context (e.g., 
  "Used in MRI segmentation at IIT Roorkee")
- The graph gently wobbles/breathes when idle

### 4. PROJECTS — Cards with dramatic reveal

On scroll, cards animate in from below with a staggered GSAP reveal.
Each card:
- Project name in large type
- 1-line description
- Tech stack pills
- A small preview (icon, illustration, or abstract graphic — no real screenshots 
  needed, use SVG placeholder art that fits the project theme)
- "View Details" button with a glowing hover state

Projects to include:
1. IKS Sanskrit Attribution Engine — RAG system using Mistral 7B, Qdrant, 
   Streamlit for verifying claims against Sanskrit primary texts
2. XAI Benchmarking Framework — Grad-CAM++, LIME, ReciproCAM across U-Net, 
   DeepLab v3+, SegFormer on medical imaging datasets
3. GraphRAG Pipeline (EKLabs) — Production knowledge graph + vector search 
   system using Qdrant and Neo4j
4. Placement Portal (IITM MAD project) — Full-stack Flask + Vue.js portal 
   with Celery, Redis, JWT auth
5. MRI Segmentation Research System — Multi-modal brain MRI pipeline with 
   FSL preprocessing + custom deep learning architectures

### 5. RESEARCH — The AI-Powered Section (MAIN INTERACTIVE FEATURE)

This is the centrepiece interactive feature. Build an embedded AI Research 
Assistant powered by the Anthropic API:

Visual:
- Section header: "Ask My Research"
- Subtitle: "An AI trained on my work — ask it anything about my research"
- A sleek terminal-style chat UI:
    - Dark card with a monospace font
    - Message bubbles: user messages on the right (violet), AI on the left (dark 
      card with cyan text)
    - A blinking cursor input bar at the bottom: "Ask about my papers, methods, 
      or ideas..."
    - Animated "thinking" dots while waiting for response

Implementation:
- On user submit, call the Anthropic Messages API (claude-sonnet-4-20250514) 
  with a carefully crafted system prompt that makes Claude roleplay as 
  "DG's Research Assistant" with deep knowledge of his work
- System prompt to inject (use this verbatim):
  
  "You are the research assistant for Divyanshu Kumar (DG), an AI/ML researcher 
   and final-year BS Data Science student at IIT Madras. You have deep knowledge 
   of his work. Here is his research background:
   
   1. 14-month research internship at IIT Roorkee under Prof. Millie Pant in 
      deep learning, computer vision, XAI, and MRI brain segmentation.
   2. ICPR 2026 paper submission on explainability in medical image segmentation.
   3. Current paper: 'Cross-Domain Explainability Benchmarking: A Comparative 
      Study of Gradient, Perturbation, and Feature-Map Based Saliency Methods 
      Across Segmentation Architectures' — benchmarking Grad-CAM++, LIME, and 
      ReciproCAM across U-Net, DeepLab v3+, and SegFormer.
   4. IKS Sanskrit Attribution Engine — a RAG system using Mistral 7B, Qdrant 
      vector store, and Streamlit for verifying academic claims against original 
      Sanskrit texts.
   5. GraphRAG pipeline at EKLabs using Qdrant + Neo4j for production knowledge 
      retrieval.
   6. Summer 2026 Research Internship at IAAIR working on RAG for Small Language 
      Models under Dr. Srikanth Thudumu.
   
   Answer questions about his research, methodologies, tools, findings, and ideas 
   clearly and enthusiastically. If asked something outside his research, gently 
   redirect. Keep responses concise (2–4 sentences max) unless depth is requested. 
   You speak in first-person as DG's representative — 'DG's work on...' or 
   'In that project, the approach was...'"

- Suggested starter questions (clickable chips below the input):
    - "What is Grad-CAM++ used for?"
    - "Explain your GraphRAG pipeline"
    - "What's the ICPR paper about?"
    - "How does your RAG system for Sanskrit work?"

### 6. CONTACT — Clean and minimal

- Large heading: "Let's Build Something"
- A single-line email display with a "Copy" button (copies to clipboard)
- Social links: GitHub, LinkedIn, Google Scholar — icon buttons only, no labels
- Subtle background: the Three.js neural network from the hero, but at 10% opacity 
  and without interaction — just ambient movement
- A footer line: "Built with curiosity. Trained on chaos." — in small muted monospace

---

## GLOBAL EFFECTS

1. Custom cursor: Replace default cursor with a small glowing violet dot + a 
   slightly larger trailing ring (CSS + JS mouse tracking). The ring should have 
   a subtle delay (lerp/ease) to feel fluid.

2. Scroll progress bar: A 2px violet line at the very top of the viewport that 
   fills as the user scrolls down the page.

3. Section entrance animations: Every section title slides up and fades in when 
   scrolled into view (IntersectionObserver + GSAP).

4. Noise grain texture: Apply a very subtle SVG noise filter as a pseudo-element 
   over the entire background — gives it a cinematic film grain feel without 
   weighing down performance.

5. Smooth scroll: `scroll-behavior: smooth` globally; use GSAP ScrollTrigger for 
   section-pinning effects if relevant.

---

## PERFORMANCE NOTES

- The Three.js canvas must use `requestAnimationFrame` with delta-time so it 
  doesn't burn the CPU/GPU on high-refresh monitors. Cap it if needed.
- Lazy-initialize the D3 force graph only when the Skills section enters the 
  viewport.
- The Anthropic API key input: add a small overlay at the top of the Research 
  section saying "Enter your Anthropic API key to activate the assistant" with a 
  password-type input — store it in memory only (no localStorage). This way the 
  site works without a hardcoded key.

---

## DELIVERABLES

- index.html (main file)
- style.css (if externalized)
- script.js (if externalized)
- All CDN libraries loaded from cdnjs.cloudflare.com, cdn.jsdelivr.net, or unpkg.com

Make every pixel intentional. This is not a template — it's an identity.