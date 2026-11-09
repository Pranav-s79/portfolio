// ============================================================
// Content for the portfolio. Plain, specific, minimal.
// Source of truth: the hardware and software resumes. Every note is one
// short line; pages render them as separate lines, never as prose.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  line2: 'B.S. Electrical Engineering (Honors) · Texas A&M · May 2028',
  line3: 'Robotics · Chip design · AI/ML',
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

// ---- Research: shared by the Research page and the Resume page ----
// overview: one plain-English sentence. result: the single headline number.
// tech: the main technologies only.
export const research = [
  {
    slug: 'live-lab',
    title: 'Machine learning for urban wind prediction',
    role: 'Undergraduate Machine Learning Researcher',
    org: 'LIVE Lab, Texas A&M University',
    when: 'Jun 2026 – Present',
    where: 'College Station, TX',
    current: true,
    overview: 'Using machine learning to turn regional wind forecasts into fast, street-level predictions.',
    result: { value: '50%', label: 'lower error near the ground' },
    tech: ['Python', 'XGBoost', 'Neural operators'],
    link: null,
  },
  {
    slug: 'algoverse',
    title: 'Fine-tuning language models for ethical ambiguity',
    role: 'Student Researcher',
    org: 'Algoverse AI Research',
    when: 'Jun – Oct 2024',
    where: 'Remote',
    current: false,
    overview: 'Fine-tuned open-source language models to better reflect how people judge moral dilemmas.',
    result: { value: '7B', label: 'open model matched GPT-4o' },
    tech: ['PyTorch', 'LLM fine-tuning'],
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'Read the paper',
  },
]

export const publications = [
  {
    authors: 'Pranav Senthilkumar, et al.',
    title:
      'Fine-Tuning Language Models for Ethical Ambiguity: A Comparative Study of Alignment with Human Responses',
    venue: 'NeurIPS 2024 SoLaR Workshop',
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'arXiv:2410.07826',
  },
]

// ---- Projects: grouped by theme so recruiters can go straight to their lane ----
// oneLine: card summary. overview: two plain sentences for the detail view.
// result: one headline number. stack: main technologies only (2-3).
export const projectThemes = [
  { id: 'hardware', label: 'Hardware', blurb: 'RTL · Processors · Chip design' },
  {
    id: 'software',
    label: 'Software & Embedded',
    short: 'Software',
    blurb: 'Firmware · Robotics · Tooling · ML',
  },
]

export const projects = [
  // -- Hardware --
  {
    slug: 'riscv-processor',
    title: 'RV32I RISC-V Processor',
    theme: 'hardware',
    when: 'Sep 2026 – Present',
    status: 'In progress',
    oneLine: 'A 32-bit RISC-V processor designed in SystemVerilog to run on an FPGA.',
    overview:
      'A 32-bit RISC-V processor with a 5-stage pipeline, written in SystemVerilog. It targets a Zybo Z7-10 FPGA and is verified in simulation before synthesis.',
    result: { value: '5-stage', label: 'pipelined design' },
    stack: ['SystemVerilog', 'FPGA'],
    repo: null,
    demo: null,
  },
  {
    slug: 'polite-accelerator',
    title: 'POLITE AI Inference Accelerator',
    theme: 'hardware',
    when: 'Aug 2026 – Present',
    status: 'In progress',
    oneLine: 'A custom chip design that speeds up the math behind AI models.',
    overview:
      'A hardware accelerator for running neural networks efficiently, built around a grid of multiply-accumulate units. It is sized to fit a real chip-fabrication budget on the open-source SKY130 process.',
    result: { value: '4×4', label: 'INT8 compute array' },
    stack: ['SKY130', 'Systolic array'],
    repo: null,
    demo: null,
  },
  {
    slug: 'riscv-alu',
    title: 'RV32I ALU',
    theme: 'hardware',
    when: 'Jun 2026',
    status: null,
    oneLine: 'The arithmetic core of a RISC-V processor, built and verified in Verilog.',
    overview:
      'A 32-bit arithmetic logic unit and branch comparator for the RISC-V instruction set. It is checked against a Python reference model with directed and randomized tests.',
    result: { value: '10', label: 'operations supported' },
    stack: ['Verilog', 'Python'],
    repo: 'https://github.com/Pranav-s79/RISCV-ALU',
    demo: null,
  },
  {
    slug: 'logic-gate-simulator',
    title: 'Digital Logic Gate Simulator',
    theme: 'hardware',
    when: 'Dec 2025',
    status: null,
    oneLine: 'A C++ program that simulates logic gates, their timing, and their waveforms.',
    overview:
      'Simulates six basic logic gates with per-gate timing delays. It plots input and output signals over time so timing behavior is easy to see.',
    result: { value: '6', label: 'gate types' },
    stack: ['C++'],
    repo: null,
    demo: null,
  },

  // -- Software & Embedded --
  {
    slug: 'haptic-portal',
    title: 'Haptic Portal',
    theme: 'software',
    when: 'Jan – May 2026',
    status: null,
    oneLine: 'Lets you feel nearby objects by turning camera depth into vibration.',
    overview:
      'A depth camera tracks your hand and the space around it. A grid of motors turns that depth into touch you can feel.',
    result: { value: '30 Hz', label: 'feedback rate' },
    stack: ['Python', 'Computer vision'],
    awards: ['Best Pitch, $250', 'Best Presentation @ Aggies Create 2025, 2026'],
    mediaGallery: [
      { src: 'project-media/haptic-portal/prototype.webp', label: 'Physical prototype' },
      { src: 'project-media/haptic-portal/cad.webp', label: 'CAD assembly' },
      { src: 'project-media/haptic-portal/pipeline.webp', label: 'Depth pipeline', fit: 'contain' },
    ],
    repo: 'https://github.com/ashwanthD83/HapticPortal',
    demo: 'https://lilmandi.github.io/Haptic-Portal/',
    demoLabel: 'Website',
  },
  {
    slug: 'regdrift',
    title: 'Regdrift',
    theme: 'software',
    when: 'Jun – Jul 2026',
    status: null,
    oneLine: 'A CI tool that stops firmware-breaking hardware changes before they merge.',
    overview:
      'Compares microcontroller register maps between versions and flags changes that would break firmware. It runs in GitHub Actions and is published on PyPI.',
    result: { value: '330', label: 'automated tests' },
    stack: ['Python', 'GitHub Actions'],
    repo: 'https://github.com/Pranav-s79/regdrift',
    demo: 'https://pypi.org/project/regdrift/',
    demoLabel: 'PyPI',
  },
  {
    slug: 'gimbal-stabilizer',
    title: '2-Axis Gimbal',
    theme: 'software',
    when: 'May 2026 – Present',
    status: 'In progress',
    oneLine: 'A camera mount that keeps itself level using motion sensors and feedback control.',
    overview:
      'Reads orientation from an IMU and drives two servos to hold the platform steady. Camera-based object tracking is being added next.',
    result: { value: '20%', label: 'less heading error' },
    stack: ['C++', 'Arduino'],
    repo: 'https://github.com/Pranav-s79/Gimbal',
    demo: null,
  },
  {
    slug: 'thermguard',
    title: 'ThermGuard',
    theme: 'software',
    when: 'May – Jun 2026',
    status: null,
    oneLine: 'Predicts processor temperatures to schedule work without overheating.',
    overview:
      'Uses machine learning to predict a safe temperature limit for each processor core, then assigns work to stay under it. Calibration keeps those limits reliable.',
    result: { value: '95%', label: 'safety limits held (target: 90%)' },
    stack: ['Python', 'PyTorch'],
    repo: 'https://github.com/Pranav-s79/ThermGuard',
    demo: null,
  },
  {
    slug: 'tadori',
    title: 'Tadori',
    theme: 'software',
    when: '2026 – Present',
    status: 'In progress',
    oneLine: 'Turns an unfamiliar codebase into an interactive map of how it fits together.',
    overview:
      'Indexes a codebase into a graph of files, functions, and tests that you can explore visually. AI coding agents can query the same graph.',
    result: { value: '1.3 s', label: 'to re-index 250K lines' },
    stack: ['TypeScript', 'Node.js'],
    repo: 'https://github.com/Pranav-s79/Tadori',
    demo: null,
  },
  {
    slug: 'pushup-analyzer',
    title: 'Push-up Form Analyzer',
    theme: 'software',
    when: '2025',
    status: null,
    oneLine: 'A webcam app that counts push-ups and flags bad form in real time.',
    overview:
      'Tracks body position from a webcam and measures joint angles. It counts reps and calls out depth or alignment problems as they happen.',
    result: null,
    stack: ['Python', 'MediaPipe'],
    repo: 'https://github.com/Pranav-s79/Pushup_Form_Checker',
    demo: null,
  },
]

// ---- Skills graph ----
export const skillDomains = ['Hardware', 'Embedded', 'Robotics', 'Software / ML']

export const skillLevels = [
  { id: 'applied', label: 'Applied', note: 'Used in projects or research' },
  { id: 'learning', label: 'Learning', note: 'Building depth now' },
]

export const skillNodes = [
  { id: 'systemverilog', label: 'SystemVerilog', domain: 'Hardware', level: 'applied' },
  { id: 'verilog', label: 'Verilog', domain: 'Hardware', level: 'applied' },
  { id: 'arch', label: 'Computer architecture', domain: 'Hardware', level: 'applied' },
  { id: 'fpga', label: 'FPGA / Vivado', domain: 'Hardware', level: 'learning' },
  { id: 'kicad', label: 'KiCad', domain: 'Hardware', level: 'learning' },
  { id: 'cpp', label: 'C++', domain: 'Embedded', level: 'applied' },
  { id: 'esp32', label: 'ESP32', domain: 'Embedded', level: 'applied' },
  { id: 'rpi', label: 'Raspberry Pi', domain: 'Embedded', level: 'applied' },
  { id: 'arduino', label: 'Arduino', domain: 'Embedded', level: 'applied' },
  { id: 'linux', label: 'Linux', domain: 'Embedded', level: 'applied' },
  { id: 'ros2', label: 'ROS 2', domain: 'Robotics', level: 'learning' },
  { id: 'control', label: 'Control systems', domain: 'Robotics', level: 'applied' },
  { id: 'fusion', label: 'Sensor fusion', domain: 'Robotics', level: 'applied' },
  { id: 'vision', label: 'Computer vision', domain: 'Robotics', level: 'applied' },
  { id: 'python', label: 'Python', domain: 'Software / ML', level: 'applied' },
  { id: 'pytorch', label: 'PyTorch', domain: 'Software / ML', level: 'applied' },
  { id: 'onnx', label: 'ONNX Runtime', domain: 'Software / ML', level: 'applied' },
  { id: 'javascript', label: 'JavaScript', domain: 'Software / ML', level: 'applied' },
  { id: 'aws', label: 'AWS', domain: 'Software / ML', level: 'applied' },
]

export const skillEdges = [
  ['systemverilog', 'verilog'],
  ['verilog', 'arch'],
  ['systemverilog', 'fpga'],
  ['arch', 'fpga'],
  ['kicad', 'esp32'],
  ['cpp', 'esp32'],
  ['cpp', 'arduino'],
  ['esp32', 'rpi'],
  ['rpi', 'linux'],
  ['linux', 'python'],
  ['arduino', 'control'],
  ['control', 'fusion'],
  ['fusion', 'vision'],
  ['ros2', 'control'],
  ['ros2', 'cpp'],
  ['vision', 'python'],
  ['vision', 'onnx'],
  ['python', 'pytorch'],
  ['pytorch', 'onnx'],
  ['javascript', 'aws'],
  ['python', 'aws'],
]

// ---- Resume page ----
export const resume = {
  downloads: [
    { label: 'Software resume here!', href: 'resumes/Senthilkumar,Pranav - Resume.pdf' },
    { label: 'Hardware resume here!', href: 'resumes/resume-hardware.pdf' },
  ],
  education: [
    {
      head: 'B.S. Electrical Engineering, Engineering Honors',
      org: 'Texas A&M University',
      when: 'Expected May 2028',
      where: 'College Station, TX',
      notes: [],
      coursework: [
        'Digital Logic Design',
        'Machine Learning',
        'Data Structures & Algorithms',
        'Multivariable Calculus',
        'Differential Equations',
      ],
    },
  ],
  // category: 'industry' | 'teaching' -> Professional, 'leadership' -> Leadership
  experience: [
    {
      head: 'Consultancy Team Member',
      org: 'Aggies Create · Shallow Sports Boats',
      when: 'Sep 2026 – Present',
      where: 'College Station, TX',
      current: true,
      notes: [
        'Working to design autonomous sports boats',
        'Building the vision, sensor, and navigation systems',
      ],
      category: 'industry',
    },
    {
      head: 'Robotics Software Engineering Intern',
      org: 'Nietzsche Labs',
      when: 'Aug – Sep 2026',
      where: 'Remote',
      current: false,
      notes: [
        'Built a desktop app that sets up operating systems for robots',
        'Added safety checks so it never overwrites the wrong drive',
      ],
      category: 'industry',
    },
    {
      head: 'Coding Instructor',
      org: 'iCode',
      when: 'Mar – Jul 2025',
      where: null,
      current: false,
      notes: [
        'Taught Python, Java, and Lua to K-12 students',
        'Mentored a student robotics team',
      ],
      category: 'teaching',
    },
    {
      head: 'Treasurer and Project Contributor',
      org: 'Rev Silicon',
      when: 'Aug 2026 – Present',
      where: 'College Station, TX',
      current: true,
      notes: [
        'Managing the budget for a student chip-design organization',
        'Supporting its first chip fabrication',
      ],
      category: 'leadership',
    },
    {
      head: 'Webmaster',
      org: 'Aggies Create',
      when: '2025 – Present',
      where: 'College Station, TX',
      current: true,
      notes: [
        'Building and maintaining the organization’s website',
      ],
      category: 'leadership',
    },
  ],
  skills: [
    { group: 'Languages', items: ['C++', 'Python', 'SystemVerilog', 'Verilog', 'Java', 'JavaScript', 'SQL'] },
    { group: 'Hardware', items: ['Digital logic design', 'Computer architecture', 'Vivado', 'FPGA', 'KiCad'] },
    { group: 'Embedded', items: ['ESP32', 'Raspberry Pi', 'Arduino', 'Linux', 'ROS 2'] },
    { group: 'ML & Vision', items: ['PyTorch', 'TensorFlow', 'ONNX Runtime', 'scikit-learn', 'OpenCV', 'MediaPipe'] },
    { group: 'Tools', items: ['Git', 'GitHub Actions', 'Docker', 'AWS', 'Electron'] },
  ],
  awards: [
    {
      head: 'Best Presentation',
      org: 'Aggies Create',
      when: '2025, 2026',
      notes: ['Recognized for technical communication and project presentation'],
    },
    {
      head: 'Best Pitch, $250',
      org: 'Haptic Portal',
      when: '2026',
      notes: ['Awarded for the haptic telepresence prototype'],
    },
  ],
}
