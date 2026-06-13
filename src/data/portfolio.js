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
  { label: 'Research', path: '/research', desc: 'Published work and active studies' },
  { label: 'Projects', path: '/projects', desc: 'Hardware built end-to-end' },
  { label: 'Skills', path: '/skills', desc: 'Focused technical stack' },
  { label: 'Resume', path: '/resume', desc: 'Role-specific PDFs' },
  { label: 'Contact', path: '/contact', desc: 'Open to Summer 2026' },
]

export const sections = {
  '/research': 'Research',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/resume': 'Resume',
  '/contact': 'Contact',
}

export const research = [
  {
    year: '2024',
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
    year: '2025',
    title: 'Sonar-based bridge foundation monitoring',
    org: 'Texas A&M x TxDOT',
    when: '2025-present',
    detail:
      'Building an acoustic sensing pipeline for bridge scour detection using signal processing and anomaly detection.',
    result:
      'Targeting real-time embedded deployment for infrastructure monitoring with the Texas Department of Transportation.',
    tags: ['Signal processing', 'Anomaly detection', 'Embedded sensing', 'Python'],
    link: null,
  },
]

export const projectCategories = ['Vision', 'Embedded', 'Hardware', 'Software']

export const projects = [
  {
    slug: 'haptic-portal',
    title: 'Haptic Portal',
    category: 'Vision - Hardware',
    categories: ['Vision', 'Hardware', 'Embedded', 'Software'],
    year: '2026',
    size: 'lg',
    media: 'project-media/haptic-portal.jpg',
    oneLine: 'A haptic telepresence system that turns depth into touch.',
    skills: ['Depth sensing', 'Hand tracking', 'Embedded output'],
    awards: ['Best Presentation @ Aggies Create 2025, 2026'],
    stack: ['Python', 'C++', 'DepthAI', 'MediaPipe', 'RPi Pico', 'Servo array'],
    what:
      'Designed software that maps camera depth and hand tracking into motor commands for a wearable haptic array, helping users feel nearby 3D space through touch.',
    repo: 'https://github.com/Pranav-s79/HapticPortal',
    demo: 'https://lilmandi.github.io/Haptic-Portal/',
    demoLabel: 'Website',
  },
  {
    slug: 'gimbal-stabilizer',
    title: '2DOF Gimbal Stabilizer',
    category: 'Embedded - Hardware',
    categories: ['Embedded', 'Hardware', 'Software'],
    year: '2026',
    size: 'tall',
    media: 'project-media/gimbal-stabilizer.jpg',
    oneLine: 'A two-axis platform that rejects motion with closed-loop control.',
    skills: ['PID control', 'Sensor fusion', 'Servo actuation'],
    stack: ['C++', 'Arduino Uno', 'GY-87', 'Servo motors'],
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
    media: 'project-media/pushup-analyzer.jpg',
    oneLine: 'Live webcam feedback for rep counting and form checks.',
    skills: ['Pose estimation', 'Joint-angle logic', 'Real-time feedback'],
    stack: ['Python', 'MediaPipe', 'OpenCV', 'NumPy'],
    what:
      'Tracks body landmarks from a webcam, converts them into elbow and torso angles, counts reps, and flags depth or alignment issues during each push-up.',
    repo: 'https://github.com/Pranav-s79/Pushup_Form_Checker',
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
  { id: 'kicad', label: 'KiCad', domain: 'Hardware', level: 'learning' },
  { id: 'pcb', label: 'PCB design', domain: 'Hardware', level: 'learning' },
  { id: 'cpp', label: 'C++', domain: 'Embedded', level: 'applied' },
  { id: 'arduino', label: 'Arduino', domain: 'Embedded', level: 'applied' },
  { id: 'pico', label: 'RPi Pico', domain: 'Embedded', level: 'applied' },
  { id: 'i2c', label: 'I2C', domain: 'Embedded', level: 'applied' },
  { id: 'pwm', label: 'PWM', domain: 'Embedded', level: 'applied' },
  { id: 'pid', label: 'PID control', domain: 'Robotics', level: 'applied' },
  { id: 'control', label: 'Control loops', domain: 'Robotics', level: 'applied' },
  { id: 'fusion', label: 'Sensor fusion', domain: 'Robotics', level: 'applied' },
  { id: 'servo', label: 'Servo motors', domain: 'Robotics', level: 'applied' },
  { id: 'python', label: 'Python', domain: 'Software / ML', level: 'applied' },
  { id: 'pytorch', label: 'PyTorch', domain: 'Software / ML', level: 'applied' },
  { id: 'mediapipe', label: 'MediaPipe', domain: 'Software / ML', level: 'applied' },
  { id: 'opencv', label: 'OpenCV', domain: 'Software / ML', level: 'applied' },
  { id: 'numpy', label: 'NumPy', domain: 'Software / ML', level: 'applied' },
  { id: 'qlora', label: 'QLoRA', domain: 'Software / ML', level: 'applied' },
]

export const skillEdges = [
  ['verilog', 'kicad'],
  ['kicad', 'pcb'],
  ['pcb', 'pico'],
  ['cpp', 'arduino'],
  ['cpp', 'pico'],
  ['arduino', 'i2c'],
  ['arduino', 'pwm'],
  ['i2c', 'fusion'],
  ['pwm', 'servo'],
  ['pid', 'control'],
  ['control', 'fusion'],
  ['fusion', 'pid'],
  ['servo', 'control'],
  ['python', 'pytorch'],
  ['python', 'opencv'],
  ['python', 'numpy'],
  ['pytorch', 'qlora'],
  ['mediapipe', 'opencv'],
  ['opencv', 'numpy'],
]

export const resume = {
  downloads: [
    { label: 'download resume-hardware.pdf', href: 'resumes/resume-hardware.pdf' },
    { label: 'download resume-software.pdf', href: 'resumes/resume-software.pdf' },
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
      head: 'Research Team Lead',
      org: 'Algoverse AI Research',
      when: 'Jun-Oct 2024',
      note: 'Led QLoRA fine-tuning of three open-weight LLMs on moral-reasoning tasks. Post-fine-tune Mistral-7B matched GPT-4o on DILEMMAS and was accepted at NeurIPS 2024 SoLaR.',
      tags: ['QLoRA', 'PyTorch', 'NeurIPS 2024'],
    },
    {
      head: 'Student Researcher',
      org: 'Texas A&M x TxDOT',
      when: '2025-present',
      note: 'Building acoustic signal processing and anomaly detection for bridge foundation monitoring, aimed at embedded sensor nodes.',
      tags: ['Signal processing', 'ML', 'Embedded sensing'],
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
