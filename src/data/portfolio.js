// ============================================================
// Content for the portfolio. Plain, specific, minimal.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  line2: 'Electrical Engineering Honors - Texas A&M - 2029',
  line3: 'Robotics - Chip design - AI/ML',
  email: 'pranav.senthilkumar79@gmail.com',
  linkedin: 'https://linkedin.com/in/pranavsen',
  github: 'https://github.com/Pranav-s79',
}

export const shelfItems = [
  { label: 'Experience', path: '/experience', desc: 'Internships and open-source work' },
  { label: 'Research', path: '/research', desc: 'Published work and active studies' },
  { label: 'Projects', path: '/projects', desc: 'Hardware built end-to-end' },
  { label: 'Skills', path: '/skills', desc: 'Focused technical stack' },
  { label: 'Resume', path: '/resume', desc: 'Role-specific PDFs' },
]

export const sections = {
  '/experience': 'Experience',
  '/research': 'Research',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/resume': 'Resume',
}

export const research = [
  {
    title: 'Fine-tuning language models for ethical ambiguity',
    org: 'Algoverse AI Research',
    when: 'Jun-Oct 2024',
    detail:
      'Led QLoRA fine-tuning of Llama-3.1-8B, Zephyr-7B, and Mistral-7B on moral-reasoning tasks from the Scruples benchmark.',
    result:
      'Mistral-7B matched GPT-4o on DILEMMAS after fine-tuning. Accepted at the NeurIPS 2024 SoLaR workshop.',
    tags: ['QLoRA', 'PyTorch', 'Mistral-7B', 'LLM alignment'],
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'arXiv:2410.07826',
  },
  {
    title: 'Machine learning for atmospheric downscaling',
    org: 'LIVE Lab, Texas A&M University',
    when: 'Jun 2026-present',
    detail:
      'Converting mesoscale weather and terrain data into microscale predictions for high-resolution CFD.',
    result:
      'Benchmarking XGBoost and Fourier Neural Operators against Gaussian Process baselines, with hybrid residual pipelines for uncertainty quantification.',
    tags: ['XGBoost', 'Fourier Neural Operators', 'Gaussian Processes', 'TabPFN'],
    link: null,
  },
]

export const projectCategories = ['Vision', 'Embedded', 'Hardware', 'Software', 'AI/ML']

export const projects = [
  {
    slug: 'haptic-portal',
    title: 'Haptic Portal',
    category: 'Vision - Hardware',
    categories: ['Vision', 'Hardware', 'Embedded', 'Software'],
    year: '2026',
    size: 'lg',
    mediaGallery: [
      {
        src: 'project-media/haptic-portal/prototype.png',
        label: 'Physical prototype',
      },
      {
        src: 'project-media/haptic-portal/cad.jpg',
        label: 'CAD assembly',
      },
      {
        src: 'project-media/haptic-portal/pipeline.png',
        label: 'Depth pipeline',
        fit: 'contain',
      },
    ],
    oneLine: 'A haptic telepresence system that turns depth into touch.',
    skills: ['Computer vision', 'Embedded control'],
    awards: ['Best Presentation @ Aggies Create 2025, 2026'],
    stack: ['Python', 'C++', 'DepthAI', 'MediaPipe'],
    what:
      'Maps camera depth and hand tracking into motor commands for a wearable haptic array, letting users feel nearby 3D space through touch. Compresses each depth frame into a 5x5 grid of normalized values, with temporal and median filtering to stabilize noisy readings.',
    repo: 'https://github.com/Pranav-s79/HapticPortal',
    demo: 'https://lilmandi.github.io/Haptic-Portal/',
    demoLabel: 'Website',
  },
  {
    slug: 'tadori',
    title: 'Tadori',
    category: 'Software - AI/ML',
    categories: ['Software', 'AI/ML'],
    year: '2026 - Present',
    media: null,
    oneLine: 'Turns unfamiliar codebases into an interactive visual map.',
    skills: ['Graph algorithms', 'Developer tooling'],
    stack: ['TypeScript', 'Node.js', 'SQLite', 'MCP'],
    what:
      'A local-first tool that maps how files, functions, tests, and features connect. Incremental re-indexing with transactional SQLite snapshots refreshes a 250K-line codebase in under 1.3 seconds, and six MCP tools expose the graph to AI coding agents. Validated by 178 tests across 25 files.',
    repo: 'https://github.com/Pranav-s79/Tadori',
    demo: null,
  },
  {
    slug: 'regdrift',
    title: 'Regdrift',
    category: 'Hardware - Software',
    categories: ['Hardware', 'Software', 'Embedded'],
    year: '2026',
    media: null,
    oneLine: 'Blocks firmware-breaking register-map changes before merge.',
    skills: ['Firmware tooling', 'CI/CD automation'],
    stack: ['Python', 'CMSIS-SVD', 'GitHub Actions'],
    what:
      'A Python CLI and GitHub Action that catches 22 classes of breaking CMSIS-SVD changes, diffing inheritance, arrays, clusters, registers, fields, interrupts, and access semantics. Validated against 330 tests across 15 SVDs from STM32, Nordic, NXP, Atmel, and RP2040, and published to PyPI and the GitHub Marketplace.',
    repo: 'https://github.com/Pranav-s79/regdrift',
    demo: 'https://pypi.org/project/regdrift/',
    demoLabel: 'PyPI',
  },
  {
    slug: 'gimbal-stabilizer',
    title: '2DOF Gimbal Stabilizer',
    category: 'Embedded - Hardware',
    categories: ['Embedded', 'Hardware', 'Software'],
    year: '2026',
    size: 'tall',
    media: null,
    oneLine: 'A two-axis platform that rejects motion with closed-loop control.',
    skills: ['Control systems', 'Sensor fusion'],
    stack: ['C++', 'Arduino', 'GY-87 IMU'],
    what:
      'Reads GY-87 inertial data, estimates tilt, and drives two servo axes through a PID loop to keep the platform level under disturbance.',
    repo: 'https://github.com/Pranav-s79/Gimbal',
    demo: null,
  },
  {
    slug: 'pushup-analyzer',
    title: 'Push-up Form Analyzer',
    category: 'Vision - Software',
    categories: ['Vision', 'Software'],
    year: '2025',
    size: 'wide',
    media: null,
    oneLine: 'Live webcam feedback for rep counting and form checks.',
    skills: ['Computer vision', 'Pose estimation'],
    stack: ['Python', 'MediaPipe', 'OpenCV'],
    what:
      'Tracks body landmarks from a webcam, converts them into elbow and torso angles, counts reps, and flags depth or alignment issues in real time.',
    repo: 'https://github.com/Pranav-s79/Pushup_Form_Checker',
    demo: null,
  },
  {
    slug: 'riscv-alu',
    title: 'Verified RISC-V ALU',
    category: 'Software',
    categories: ['Software'],
    year: '2026',
    size: 'wide',
    media: null,
    oneLine: 'A verified RV32I-style ALU with directed and randomized tests.',
    skills: ['Digital design', 'Hardware verification'],
    stack: ['Verilog', 'Python', 'Icarus Verilog'],
    what:
      'A 32-bit combinational ALU and branch comparator for core RV32I operations, verified against edge cases with self-checking Verilog tests and Python-generated randomized reference vectors.',
    repo: 'https://github.com/Pranav-s79/RISCV-ALU',
    demo: null,
  },
  {
    slug: 'thermguard',
    title: 'ThermGuard',
    category: 'Hardware - AI/ML',
    categories: ['Hardware', 'AI/ML'],
    year: '2026',
    media: null,
    oneLine: 'Predicts safe thermal limits for multi-core chips.',
    skills: ['Machine learning', 'Uncertainty quantification'],
    stack: ['Python', 'PyTorch', 'scikit-learn'],
    what:
      'Trains quantile regression models and applies conformal calibration to turn raw predictions into guaranteed upper bounds on chip temperature, then schedules tasks to avoid overheating. Hit 95% coverage against a 90% target across 5 seeds, with a multi-seed harness isolating where calibration holds under distribution shift.',
    repo: 'https://github.com/Pranav-s79/ThermGuard',
    demo: null,
  },
  {
    slug: 'logic-gate-simulator',
    title: 'Logic Gate Simulator',
    category: 'Software',
    categories: ['Software'],
    year: '2025',
    size: 'tall',
    media: null,
    oneLine: 'An event-driven C++ simulator for gate timing and signal traces.',
    skills: ['Discrete-event simulation', 'Data structures'],
    stack: ['C++'],
    what:
      'An event-driven simulator for AND, OR, and multi-input gates with configurable delays, using a priority queue scheduler to model propagation and export waveform traces for timing analysis.',
    repo: null,
    demo: null,
  },
]

export const skillDomains = ['Hardware', 'Embedded', 'Robotics', 'Software / ML']

export const skillLevels = [
  { id: 'applied', label: 'Applied', note: 'Used in projects or research' },
  { id: 'learning', label: 'Learning', note: 'Building depth now' },
]

export const skillNodes = [
  { id: 'verilog', label: 'Verilog', domain: 'Hardware', level: 'learning' },
  { id: 'digital', label: 'Digital design', domain: 'Hardware', level: 'learning' },
  { id: 'pcb', label: 'PCB design', domain: 'Hardware', level: 'learning' },
  { id: 'c', label: 'C', domain: 'Embedded', level: 'learning' },
  { id: 'cpp', label: 'C++', domain: 'Embedded', level: 'applied' },
  { id: 'mcu', label: 'Microcontrollers', domain: 'Embedded', level: 'applied' },
  { id: 'linux', label: 'Linux', domain: 'Embedded', level: 'learning' },
  { id: 'control', label: 'Control systems', domain: 'Robotics', level: 'applied' },
  { id: 'fusion', label: 'Sensor fusion', domain: 'Robotics', level: 'applied' },
  { id: 'vision', label: 'Computer vision', domain: 'Robotics', level: 'applied' },
  { id: 'python', label: 'Python', domain: 'Software / ML', level: 'applied' },
  { id: 'pytorch', label: 'PyTorch', domain: 'Software / ML', level: 'applied' },
  { id: 'ml', label: 'Machine learning', domain: 'Software / ML', level: 'applied' },
  { id: 'typescript', label: 'TypeScript', domain: 'Software / ML', level: 'applied' },
]

export const skillEdges = [
  ['verilog', 'digital'],
  ['digital', 'pcb'],
  ['pcb', 'mcu'],
  ['c', 'cpp'],
  ['cpp', 'mcu'],
  ['linux', 'c'],
  ['linux', 'python'],
  ['mcu', 'control'],
  ['control', 'fusion'],
  ['fusion', 'vision'],
  ['vision', 'python'],
  ['python', 'pytorch'],
  ['pytorch', 'ml'],
  ['python', 'typescript'],
]

export const resume = {
  downloads: [
    { label: 'Software resume here!', href: 'resumes/Senthilkumar,Pranav - Resume.pdf' },
    { label: 'Hardware resume here!', href: 'resumes/resume-hardware.pdf' },
  ],
  education: [
    {
      head: 'B.S. Electrical Engineering, Honors',
      org: 'Texas A&M University',
      when: '2025-2029',
      note: 'Focused on embedded systems, robotics, software, and digital hardware fundamentals.',
      tags: ['Electrical engineering', 'Honors', 'Embedded systems'],
    },
  ],
  experience: [
    {
      head: 'Robotics Software Engineering Intern',
      org: 'Nietzsche Labs',
      when: 'Aug 2026-present',
      note: 'Building perception and control software for autonomous robots.',
      tags: ['Robotics', 'Python', 'C++'],
      category: 'industry',
    },
    {
      head: 'Research Team Lead',
      org: 'Algoverse AI Research',
      when: 'Jun-Oct 2024',
      note: 'Led QLoRA fine-tuning of three open-weight LLMs on moral-reasoning tasks. Post-fine-tune Mistral-7B matched GPT-4o on DILEMMAS and was accepted at NeurIPS 2024 SoLaR.',
      tags: ['QLoRA', 'PyTorch', 'NeurIPS 2024'],
      category: 'research',
    },
    {
      head: 'Undergraduate Machine Learning Researcher',
      org: 'LIVE Lab, Texas A&M University',
      when: 'Jun 2026-present',
      note: 'Converting mesoscale weather and terrain data into microscale predictions for high-resolution CFD.',
      tags: ['XGBoost', 'Fourier Neural Operators', 'Gaussian Processes'],
      category: 'research',
    },
    {
      head: 'Coding Instructor',
      org: 'iCode',
      when: 'Mar-Jul 2025',
      note: 'Taught Python, Java, and Lua to K-12 students and mentored a robotics team on sensor integration and autonomous control.',
      tags: ['Python', 'Java', 'Lua', 'Robotics mentoring', 'Teaching'],
      category: 'teaching',
    },
  ],
  awards: [
    {
      head: 'Best Presentation',
      org: 'Aggies Create',
      when: '2025, 2026',
      note: 'Recognized for clear technical communication and project presentation.',
      tags: ['Presentation', 'Engineering design'],
    },
  ],
}
