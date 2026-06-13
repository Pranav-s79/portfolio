// ============================================================
// Content for the portfolio. Plain, specific, minimal.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  line2: 'Electrical Engineering Honors · Texas A&M · 2029',
  line3: 'Robotics · Chip design · AI/ML',
  email: 'pranav.senthilkumar79@gmail.com',
  linkedin: 'https://linkedin.com/in/pranavsen',
  github: 'https://github.com/Pranav-s79',
}

// Section series on the landing page. Order drives the robot's reach height.
export const shelfItems = [
  { label: 'Research', path: '/research', desc: 'Published work & active studies' },
  { label: 'Projects', path: '/projects', desc: 'Hardware built end-to-end' },
  { label: 'Skills', path: '/skills', desc: 'The toolchain, mapped' },
  { label: 'Resume', path: '/resume', desc: 'The datasheet' },
  { label: 'Contact', path: '/contact', desc: 'Open to Summer 2026' },
]

// Breadcrumb sections (label shown after the name).
export const sections = {
  '/research': 'Research',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/resume': 'Resume',
  '/contact': 'Contact',
}

// ---------- Research (signal-trace timeline) ----------
export const research = [
  {
    year: '2024',
    title: 'Fine-tuning language models for ethical ambiguity',
    org: 'Algoverse AI Research',
    when: 'Jun–Oct 2024',
    detail:
      'QLoRA fine-tuning of Llama-3.1-8B, Zephyr-7B, and Mistral-7B on the Scruples moral-reasoning benchmark.',
    result:
      'Post-fine-tune Mistral-7B matched GPT-4o on the DILEMMAS task. Accepted at the NeurIPS 2024 SoLaR workshop.',
    tags: ['QLoRA', 'PyTorch', 'Llama-3.1', 'Mistral-7B', 'LLM alignment'],
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'arXiv:2410.07826',
  },
  {
    year: '2025',
    title: 'Sonar-based bridge foundation monitoring',
    org: 'Texas A&M × TxDOT',
    when: '2025–present',
    detail:
      'Acoustic sensing pipeline for scour detection at bridge foundations, with signal processing and ML anomaly detection.',
    result:
      'In progress. Targeting real-time deployment on embedded sensor nodes with the Texas Department of Transportation.',
    tags: ['Signal processing', 'Anomaly detection', 'Embedded sensing', 'Python'],
    link: null,
  },
]

// ---------- Projects ----------
// Each project is an "engineering module". Beyond the visible card data,
// `categories` drives the filter row, `skills` and `stack` are shown
// separately in the expanded view, and `media` points at a real visual.
export const projectCategories = ['Vision', 'Embedded', 'Hardware', 'Software']

export const projects = [
  {
    slug: 'haptic-portal',
    title: 'Haptic Portal',
    category: 'Vision · Hardware',
    categories: ['Vision', 'Hardware', 'Embedded', 'Software'],
    year: '2026',
    size: 'lg',
    // real media lives in public/project-media/<slug>.jpg (or .png); missing → placeholder
    media: 'project-media/haptic-portal.jpg',
    oneLine: 'Turns nearby depth into touch you can feel on your hand.',
    skills: ['Computer vision', 'Embedded firmware', 'PCB design'],
    stack: ['Python', 'C++', 'DepthAI', 'MediaPipe', 'RPi Pico', 'KiCad'],
    what: 'An OAK-D-Lite depth camera tracks the hand; a 5×5 depth matrix drives an 8-servo haptic array through a custom PCB (RPi Pico + PCA9685).',
    repo: 'https://github.com/Pranav-s79/HapticPortal',
    demo: null,
  },
  {
    slug: 'gimbal-stabilizer',
    title: '2DOF Gimbal Stabilizer',
    category: 'Embedded · Hardware',
    categories: ['Embedded', 'Hardware', 'Software'],
    year: '2025',
    size: 'tall',
    media: 'project-media/gimbal-stabilizer.jpg',
    oneLine: 'Keeps a platform level on two axes while it gets shaken.',
    skills: ['Control systems', 'Sensor fusion', 'Embedded firmware'],
    stack: ['C++', 'ESP32', 'MPU-6050', 'PID'],
    what: 'An MPU-6050 is burst-read over I2C, fused with a complementary filter, and run through a PID loop driving two servos toward sub-2° steady-state error.',
    repo: 'https://github.com/Pranav-s79/Gimbal',
    demo: null,
  },
  {
    slug: 'pushup-analyzer',
    title: 'Push-up Form Analyzer',
    category: 'Vision · Software',
    categories: ['Vision', 'Software'],
    year: '2025',
    size: 'wide',
    media: 'project-media/pushup-analyzer.jpg',
    oneLine: 'Counts reps and flags bad form from a webcam, live.',
    skills: ['Computer vision', 'Pose estimation', 'Real-time processing'],
    stack: ['Python', 'MediaPipe', 'OpenCV', 'NumPy'],
    what: '33 pose landmarks become elbow/shoulder/hip joint angles; rule thresholds count reps and warn when form leaves a biomechanically safe range.',
    repo: 'https://github.com/Pranav-s79/Pushup_Form_Checker',
    demo: null,
  },
]

// ---------- Skills (netlist / node graph) ----------
export const skillDomains = ['Silicon', 'Embedded', 'Robotics', 'ML / Software']

export const skillNodes = [
  { id: 'verilog', label: 'Verilog', domain: 'Silicon' },
  { id: 'cmos', label: 'CMOS', domain: 'Silicon' },
  { id: 'sta', label: 'STA', domain: 'Silicon' },
  { id: 'riscv', label: 'RISC-V', domain: 'Silicon' },
  { id: 'gpu', label: 'GPU arch', domain: 'Silicon' },
  { id: 'kicad', label: 'KiCad', domain: 'Silicon' },
  { id: 'pcb', label: 'PCB design', domain: 'Silicon' },
  { id: 'c', label: 'C / C++', domain: 'Embedded' },
  { id: 'esp32', label: 'ESP32', domain: 'Embedded' },
  { id: 'pico', label: 'RPi Pico', domain: 'Embedded' },
  { id: 'i2c', label: 'I2C', domain: 'Embedded' },
  { id: 'spi', label: 'SPI', domain: 'Embedded' },
  { id: 'uart', label: 'UART', domain: 'Embedded' },
  { id: 'pwm', label: 'PWM', domain: 'Embedded' },
  { id: 'pid', label: 'PID', domain: 'Robotics' },
  { id: 'control', label: 'Control loops', domain: 'Robotics' },
  { id: 'fusion', label: 'Sensor fusion', domain: 'Robotics' },
  { id: 'imu', label: 'MPU-6050', domain: 'Robotics' },
  { id: 'servo', label: 'Servos', domain: 'Robotics' },
  { id: 'oakd', label: 'OAK-D', domain: 'Robotics' },
  { id: 'python', label: 'Python', domain: 'ML / Software' },
  { id: 'pytorch', label: 'PyTorch', domain: 'ML / Software' },
  { id: 'mediapipe', label: 'MediaPipe', domain: 'ML / Software' },
  { id: 'opencv', label: 'OpenCV', domain: 'ML / Software' },
  { id: 'numpy', label: 'NumPy', domain: 'ML / Software' },
  { id: 'qlora', label: 'QLoRA', domain: 'ML / Software' },
]

export const skillEdges = [
  ['verilog', 'cmos'],
  ['verilog', 'riscv'],
  ['verilog', 'sta'],
  ['riscv', 'gpu'],
  ['cmos', 'sta'],
  ['kicad', 'pcb'],
  ['pcb', 'cmos'],
  ['c', 'esp32'],
  ['c', 'pico'],
  ['esp32', 'imu'],
  ['i2c', 'spi'],
  ['spi', 'uart'],
  ['i2c', 'imu'],
  ['pwm', 'servo'],
  ['pico', 'pwm'],
  ['pid', 'control'],
  ['control', 'fusion'],
  ['fusion', 'imu'],
  ['servo', 'control'],
  ['oakd', 'mediapipe'],
  ['python', 'pytorch'],
  ['python', 'opencv'],
  ['python', 'numpy'],
  ['pytorch', 'qlora'],
  ['mediapipe', 'opencv'],
  ['opencv', 'numpy'],
]

// ---------- Resume (datasheet) ----------
export const resume = {
  downloads: [
    { label: 'download resume-hardware.pdf', href: '#' },
    { label: 'download resume-software.pdf', href: '#' },
  ],
  education: [
    {
      head: 'B.S. Electrical Engineering, Honors',
      org: 'Texas A&M University',
      when: '2025 – 2029',
      note: 'Studying GPU architecture, RISC-V, static timing analysis, CMOS design, and Verilog FSMs.',
      tags: ['GPU arch', 'RISC-V', 'STA', 'CMOS', 'Verilog'],
    },
  ],
  experience: [
    {
      head: 'Research Team Lead',
      org: 'Algoverse AI Research',
      when: 'Jun – Oct 2024',
      note: 'Led QLoRA fine-tuning of three open-weight LLMs on moral-reasoning tasks. Post-fine-tune Mistral-7B matched GPT-4o on DILEMMAS. Accepted at NeurIPS 2024 SoLaR.',
      tags: ['QLoRA', 'PyTorch', 'NeurIPS 2024'],
    },
    {
      head: 'Student Researcher',
      org: 'Texas A&M × TxDOT',
      when: '2025 – present',
      note: 'Building acoustic signal processing and anomaly detection for bridge foundation monitoring, aimed at embedded sensor nodes.',
      tags: ['Signal processing', 'ML', 'Embedded sensing'],
    },
  ],
}
