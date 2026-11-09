// ============================================================
// Content for the portfolio. Plain, specific, and checkable.
// Sources: the resumes plus each project's own repository and docs.
// Numbers marked as targets or plans are not measurements; keep it that way.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  degree: 'B.S. Electrical Engineering (Honors) · Texas A&M · May 2028',
  focus: 'Computer architecture · Silicon · Embedded',
  email: 'pranav.senthilkumar79@gmail.com',
  linkedin: 'https://linkedin.com/in/pranavsen',
  github: 'https://github.com/Pranav-s79',
}

export const shelfItems = [
  { label: 'Experience', path: '/experience' },
  { label: 'Research', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Resume', path: '/resume' },
]

export const sections = {
  '/experience': 'Experience',
  '/research': 'Research',
  '/projects': 'Projects',
  '/skills': 'Skills',
  '/resume': 'Resume',
}

// Per-route copy for <title>, meta description, and link previews.
export const routeMeta = {
  '/': {
    title: 'Pranav Senthilkumar',
    description:
      'Electrical engineering student at Texas A&M working on computer architecture, silicon design, embedded systems, and low-level software.',
  },
  '/experience': {
    title: 'Experience',
    description: 'Employment, research, and student engineering organizations.',
  },
  '/research': {
    title: 'Research',
    description: 'Machine learning research at Texas A&M and a NeurIPS 2024 workshop paper.',
  },
  '/projects': {
    title: 'Projects',
    description: 'An RV32I processor, cross-layer verification tooling, a register-map CI gate, and embedded hardware.',
  },
  '/skills': { title: 'Skills', description: 'Hardware, embedded, robotics, and software skills, mapped by domain.' },
  '/resume': { title: 'Resume', description: 'Hardware and software resumes as PDFs, plus the full record.' },
}

// ---- Research: shared by the Research, Experience, and Resume pages ----
export const research = [
  {
    slug: 'live-lab',
    title: 'Street-level wind for cities',
    role: 'Undergraduate Machine Learning Researcher',
    org: 'LIVE Lab, Texas A&M University',
    when: 'Jun 2026 – Present',
    where: 'College Station, TX',
    current: true,
    summary:
      'Weather models forecast wind over kilometers. Buildings bend it block by block. I build models that take a regional forecast down to the street.',
    metrics: [
      { value: '50%', label: 'lower near-ground error' },
      { value: '~3 min → <1 s', label: 'per prediction' },
      { value: '+59.9%', label: '4× resolution vs. interpolation' },
    ],
    work: [
      'End-to-end pipeline that fuses LiDAR, terrain, and building data with a 3D model',
      'Residual correction model that upsamples wind fields 4× beyond what interpolation recovers',
      'Covers both dense urban blocks and open terrain',
    ],
    tech: ['Python', 'XGBoost', 'Neural operators', 'LiDAR'],
    link: null,
  },
  {
    slug: 'algoverse',
    title: 'LLMs that disagree like people do',
    role: 'Student Researcher',
    org: 'Algoverse AI Research',
    when: 'Jun – Oct 2024',
    where: 'Remote',
    current: false,
    summary:
      'Ask people a morally ambiguous question and you get a spread of answers. We tuned language models to reproduce that spread instead of collapsing to one verdict.',
    metrics: [
      { value: '31%', label: 'less error vs. human responses' },
      { value: '7B', label: 'open model matched GPT-4o' },
      { value: '3', label: 'open-source LLMs fine-tuned' },
    ],
    work: [
      'Calibrated models to reflect the spread of human opinion, using parameter-efficient fine-tuning',
      'Matched GPT-4o on moral reasoning with a 7B open-source model',
      'Published at the NeurIPS 2024 SoLaR workshop',
    ],
    tech: ['PyTorch', 'Parameter-efficient fine-tuning'],
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'arXiv:2410.07826',
  },
]

export const publications = [
  {
    authors: 'Pranav Senthilkumar, et al.',
    title:
      'Fine-Tuning Language Models for Ethical Ambiguity: A Comparative Study of Alignment with Human Responses',
    venue: 'NeurIPS 2024 SoLaR Workshop',
    year: '2024',
    link: 'https://arxiv.org/abs/2410.07826',
    linkLabel: 'arXiv:2410.07826',
  },
]

// ---- Projects ----
// status: 'complete' | 'in-progress' | 'design' (designed, not built yet)
// featured: position in the featured set (1-6); everything else is "additional".
export const STATUS_LABEL = {
  complete: 'Complete',
  'in-progress': 'In progress',
  design: 'Design stage',
}

export const projects = [
  // ------------------------------------------------------------ featured
  {
    slug: 'polite-accelerator',
    // Hidden for now: kept here so it can come back by deleting `hidden`.
    hidden: true,
    featured: 1,
    title: 'POLITE AI Inference Accelerator',
    short: 'POLITE',
    theme: 'hardware',
    when: 'Aug 2026 – Present',
    status: 'in-progress',
    statusNote: 'Architecture defined; RTL and verification in progress',
    role: 'Student chip-design team',
    oneLine: 'A small INT8 matrix-multiply accelerator sized for the open SkyWater 130 nm process.',
    stack: ['Verilog', 'SKY130', 'OpenLane'],
    facts: [
      { value: '4×4', label: 'weight-stationary PE array' },
      { value: 'INT8 → INT32', label: 'signed multiply, 32-bit accumulate' },
      { value: '16', label: 'MACs per cycle at peak' },
    ],
    repo: null,
    demo: null,
    diagram: 'polite',
    caseStudy: {
      problem:
        'Neural-network inference is mostly matrix multiplication. A chip on an open 130 nm shuttle has little area, little on-chip memory, and a narrow pin interface, so the design has to spend silicon on reusable multiply-accumulate hardware and leave everything else to the host.',
      architecture: [
        'The host sends commands and data over an SPI-style interface. A loader places one INT8 weight in each of the 16 processing elements, one column per cycle. Activations enter four at a time through a skew stage that lines each row up with the right cycle.',
        'Each PE multiplies its activation by its stored weight and adds the product into its own 32-bit accumulator. When the inner dimension is finished, the accumulators turn into a shift register and drain one row per cycle into an output collector, an optional residual-add and ReLU stage, and back to the host.',
      ],
      diagramCaption:
        'One tile moving through the chip. Weights stay put; activations stream in from the left; finished sums drain downward.',
      contribution: [
        'Team project, split into three workstreams: the systolic array and dataflow; arithmetic, back end, and verification; and integration, control, and I/O.',
        'I work on the architecture side: dataflow, memory, and the interface contracts between blocks.',
      ],
      decisions: [
        {
          title: 'Weight-stationary, local accumulate',
          body: 'Weights stay in each PE for a whole tile and partial sums never move between PEs. That cuts weight traffic over a narrow interface and keeps every PE identical. The cost is a drain phase between tiles.',
        },
        {
          title: 'Shift-register drain instead of a column mux',
          body: 'Accumulators double as a vertical shift register, so results leave over short local wires instead of a wide central mux. Draining overwrites the results, so every tile starts by clearing its accumulators.',
        },
        {
          title: '32-bit accumulators',
          body: 'An INT8 × INT8 product needs about 16 bits, and a tile can sum up to 256 of them. 32 bits keeps the sum exact and lets the chip return raw results. An earlier note proposed 24 bits; the interface contracts use 32.',
        },
        {
          title: 'Two weight banks per PE',
          body: 'The next tile’s weights load into the idle bank while the current tile computes, hiding the four-cycle load. The controller must never swap banks mid-accumulation.',
        },
        {
          title: 'The host keeps the rest',
          body: 'Softmax, normalization, and requantization stay in software. On-chip area goes to MACs, plus a small residual-add and ReLU stage.',
        },
      ],
      verificationIntro: 'Planned. Every level is checked against a bit-exact software golden model:',
      verification: [
        'MAC: signed INT8 × INT8 accumulates correctly into INT32',
        'PE and array: load, compute, and drain modes switch cleanly; skew and weight mapping give the right 16 sums',
        'Drain: rows leave bottom-first, exactly once, including when the back end stalls',
        'Controller: accumulator clear, enable, weight load, and bank swaps are legal on every cycle',
        'End to end: a host command sequence returns the golden 16-value result; then gate-level and timing checks after place-and-route',
      ],
      results: {
        text: 'No measured results yet. At the 66 MHz planning target, a fully busy array would peak at about 1.06 billion MACs per second. Real throughput will be lower once loading, draining, and I/O are counted.',
      },
      now: 'The architecture and block interfaces are defined. Two items are still open: the exact MAC pipeline latency, and how much on-chip activation buffering the area budget allows.',
      next: [
        'Settle the MAC pipeline latency across the timing contracts',
        'Decide whether a deeper activation buffer is worth its area',
        'RTL for each block, checked against the golden model',
        'Synthesis and place-and-route in OpenLane to check area and timing',
      ],
    },
  },
  {
    slug: 'riscv-processor',
    featured: 1,
    title: 'RV32I RISC-V Processor',
    short: 'RV32I',
    theme: 'hardware',
    when: 'Sep 2026 – Present',
    status: 'in-progress',
    statusNote: 'Single-cycle core verified · pipeline next',
    role: 'Solo project',
    oneLine: 'A 32-bit RISC-V core in SystemVerilog, built phase by phase for a Zybo Z7-10 FPGA.',
    stack: ['SystemVerilog', 'Icarus Verilog', 'Vivado', 'Python'],
    facts: [
      { value: '11 / 11', label: 'programs match the reference model' },
      { value: '≈36,000', label: 'self-checking unit-test checks' },
      { value: '≈58 MHz', label: 'estimated Fmax, single-cycle baseline' },
    ],
    repo: null,
    demo: null,
    diagram: 'rv32i',
    caseStudy: {
      problem:
        'Get every RV32I instruction exactly right, corner cases included, then make it fast. Each phase is verified and measured before the next one starts.',
      architecture: [
        'Phase 1 is single-cycle: fetch through writeback in one clock. The memories live outside the core, so the core synthesizes and gets measured on its own.',
        'Illegal instructions, misaligned or out-of-range accesses, ECALL, and EBREAK halt the core with a cause code.',
      ],
      diagramCaption: 'Phase 1 datapath.',
      contribution: [
        'Solo. I planned the phases, architecture, and verification, and wrote the first module drafts.',
        'The Phase 1 RTL was finished with AI help, logged in the repo. The pipeline is mine to build.',
      ],
      decisions: [
        { title: 'Single-cycle first', body: 'A known-good baseline (CPI 1, ~58 MHz) to measure every later phase against.' },
        { title: 'Branches skip the ALU', body: 'One extra adder buys a shorter branch path and a simpler ALU.' },
        { title: 'Traps just halt', body: 'Cause and value registers are enough to verify against. CSRs come later.' },
      ],
      verification: [
        '8 self-checking testbenches, ~36k checks, including 5,000 random ALU vectors',
        '11 programs, compiled C included, traced instruction by instruction against a Python ISA model',
        'The same suite passes in Icarus Verilog and Vivado xsim',
      ],
      output: {
        label: 'make test · Icarus Verilog 11 · Oct 29, 2026 (excerpt)',
        lines: [
          'PASS: tb_register_file (2102 checks)',
          'PASS: tb_alu (5025 checks)',
          'PASS: tb_immediate_generator (10020 checks)',
          'PASS: tb_control_unit (15656 checks)',
          'PASS: tb_branch_unit (3020 checks)',
          '==== ALL UNIT TESTS PASSED ====',
          'PASS: rv32i_full                397 instructions retired, trap cause=11 pc=0x000005f4',
          'PASS: c_simple                   27 instructions retired, trap cause=11 pc=0x00000008',
          'PASS: trap_illegal                3 instructions retired, trap cause= 2 pc=0x0000000c',
          'PASS: trap_store_fault            7 instructions retired, trap cause= 7 pc=0x0000001c',
          '==== CORE TESTS: all 11 programs PASSED (RTL matches reference model) ====',
        ],
      },
      results: {
        text: 'Vivado 2026.1 on an XC7Z010, against a 10 ns reference clock.',
        table: [
          ['Estimated Fmax', '≈58 MHz'],
          ['Worst negative slack', '−7.194 ns'],
          ['Critical path', '19 logic levels, 79% routing'],
          ['LUTs (core + 8 KiB memory)', '2,054 of 17,600'],
          ['Latches', '0'],
        ],
      },
      now: 'Phase 1 passes in simulation. Not on the board yet.',
      next: ['5-stage pipeline', 'Hazard detection and forwarding', 'Board bring-up and a clock sweep'],
    },
  },
  {
    slug: 'crosslayer',
    featured: 2,
    title: 'CrossLayer',
    short: 'CrossLayer',
    theme: 'software',
    when: 'Nov 2026 – Present',
    status: 'in-progress',
    statusNote: 'Phase 3 of 15 · RTL verification working',
    role: 'Solo project',
    oneLine: 'Contracts for the seams between hardware and software, checked against real runs.',
    stack: ['Python', 'Icarus Verilog', 'PicoRV32'],
    facts: [
      { value: '6', label: 'contract rule kinds' },
      { value: '7', label: 'faults injected into real RTL' },
      { value: '6.6 s → 0.21 s', label: '80k-event check after a review fix' },
    ],
    repo: 'https://github.com/Pranav-s79/Cross-Layer-Systems-Test-Platform',
    demo: null,
    diagram: 'crosslayer',
    caseStudy: {
      problem: 'Parts pass their own tests and still break together. CrossLayer tests the seams: deadlines, dropped data, ordering.',
      architecture: [
        'Adapters turn raw logs from a target, like an RTL sim or firmware, into normalized events. The core never imports a target.',
        'A contract engine checks those events against YAML contracts and writes a run bundle: verdicts, evidence linked to the exact log line, and replay data.',
      ],
      diagramCaption: 'Adapters on the left of the line, the core on the right.',
      contribution: ['Solo. Contract language, engine, adapters, CLI, reports, tests.'],
      decisions: [
        { title: 'No evidence, no pass', body: 'Verdicts are PASS, FAIL, or INCONCLUSIVE. A truncated log can’t pass.' },
        { title: 'The core knows no targets', body: 'RTL support shipped as an adapter, with zero core changes.' },
        { title: 'Real RTL', body: 'Unmodified PicoRV32 under Icarus, in lockstep with an ISA model.' },
      ],
      verification: [
        'Every injected fault has to trip exactly its target contracts; the baseline has to pass all of them',
        '7 faults planted in the RISC-V core, from an inverted BNE to a wrong store byte lane',
        'CI on Linux and Windows, Python 3.11 to 3.14',
      ],
      output: {
        label: 'crosslayer suite experiments/reference/suite.yaml · Nov 9, 2026',
        lines: [
          'suite     reference (6 experiments)',
          '  MET      baseline                 expect PASS         got PASS',
          '  MET      silent_drop              expect FAIL         got FAIL',
          '  MET      slow_consumer            expect FAIL         got FAIL',
          '  MET      corrupt_checksum         expect FAIL         got FAIL',
          '  MET      duplicate_completion     expect FAIL         got FAIL',
          '  MET      reorder                  expect FAIL         got FAIL',
          'result    PASSED',
          '',
          '$ crosslayer run experiments/reference/fault_silent_drop.yaml',
          'verdict   FAIL',
          '  FAIL    pipeline.rx_accounted          397/400 triggers answered within 5 ms; 3 violations',
          '  PASS    pipeline.packet_lifecycle      397 transitions across 400 entities; 0 illegal',
          '  FAIL    pipeline.counter_conservation  held for 0/1 events',
        ],
      },
      results: { text: 'A review pass fixed 13 bugs. The biggest one: an 80k-event check went from 6.6 s to 0.21 s.' },
      now: 'Phases 1–3 of 15 are done.',
      next: ['5G RAN and core log analysis', 'Firmware and hardware-in-the-loop', 'Fault localization'],
    },
  },
  {
    slug: 'regdrift',
    featured: 3,
    title: 'Regdrift',
    short: 'Regdrift',
    theme: 'software',
    when: 'Jun – Jul 2026',
    status: 'complete',
    statusNote: 'Public alpha on PyPI',
    role: 'Solo project',
    oneLine: 'Catches firmware-breaking register-map changes in CI, before they merge.',
    stack: ['Python', 'CMSIS-SVD', 'GitHub Actions'],
    facts: [
      { value: '22', label: 'classes of breaking change' },
      { value: '330', label: 'automated tests' },
      { value: '15', label: 'MCU definitions, 5 vendors' },
    ],
    repo: 'https://github.com/Pranav-s79/regdrift',
    demo: 'https://pypi.org/project/regdrift/',
    demoLabel: 'PyPI',
    diagram: 'regdrift',
    caseStudy: {
      problem: 'Move a register and the driver still compiles. Every write just lands in the wrong place.',
      architecture: [
        'Parses two CMSIS-SVD revisions into one resolved model, matches peripherals, registers, and fields, and classifies every difference.',
        'Output is text, JSON, or GitHub annotations, and the exit code gates the merge. Ships as a CLI and a GitHub Action.',
      ],
      diagramCaption: 'Two revisions in, one verdict out.',
      contribution: ['Solo. Parser, matcher, rules, CLI, Action, and the PyPI release.'],
      decisions: [
        { title: 'Careful with renames', body: 'Only exact structural matches count as renames. Anything else is a remove plus an add.' },
        { title: 'Rules with IDs', body: 'Every verdict points to one of 22 published rules.' },
        { title: 'Allow by path', body: 'Intentional breaks get approved one register at a time, never a whole rule.' },
      ],
      verification: [
        '330 automated tests: unit, CLI, fuzz, and golden output',
        '15 real microcontroller definitions from 5 vendors',
        'A mutation harness that proves every rule fires on real models',
      ],
      output: {
        label: 'regdrift check demo/chip_v1.svd demo/chip_v2.svd',
        lines: [
          'BREAKING (4)',
          '  RD015  interrupt ACCEL.ACCEL_DONE renumbered 17 -> 18',
          '  RD005  field ACCEL.CTRL.ENABLE renamed (was EN; exact structural match)',
          '  RD001  register ACCEL.STATUS address moved 0x8 -> 0xC',
          '  RD017  field ACCEL.STATUS.DONE write semantics changed oneToClear -> oneToSet',
          '',
          'WARNING (1)',
          '  RD010  register ACCEL.STATUS reset value changed 0x1 -> 0x0',
          '',
          '4 breaking, 1 warning, 1 safe, 0 allowed',
        ],
      },
      results: { text: '0.1.0a3 is on PyPI and works as a GitHub Action.' },
      now: 'Public alpha.',
      next: ['Close the gaps listed in RULES.md'],
    },
  },
  {
    slug: 'haptic-portal',
    featured: 4,
    title: 'Haptic Portal',
    short: 'Haptic Portal',
    theme: 'software',
    when: 'Jan – May 2026',
    status: 'complete',
    statusNote: 'Built, demoed, and won Best Pitch',
    role: 'Five-person team',
    oneLine: 'Feel what a camera sees: hand depth becomes a 5×5 grid of vibration.',
    stack: ['Python', 'OAK-D', 'MediaPipe', 'MicroPython'],
    facts: [
      { value: '30 Hz', label: 'feedback updates' },
      { value: '25', label: 'vibration zones (5×5)' },
      { value: '$250', label: 'Best Pitch' },
    ],
    awards: ['Best Pitch ($250)', 'Best Presentation, Aggies Create 2025 and 2026'],
    mediaGallery: [
      { src: 'project-media/haptic-portal/prototype.webp', label: 'Physical prototype', w: 1350, h: 664 },
      { src: 'project-media/haptic-portal/cad.webp', label: 'CAD assembly', w: 640, h: 480 },
      { src: 'project-media/haptic-portal/pipeline.webp', label: 'Depth pipeline', fit: 'contain', w: 1400, h: 644 },
    ],
    repo: 'https://github.com/ashwanthD83/HapticPortal',
    demo: 'https://lilmandi.github.io/Haptic-Portal/',
    demoLabel: 'Project site',
    diagram: null,
    caseStudy: {
      problem: 'Telepresence carries sight and sound. We wanted it to carry touch.',
      architecture: [
        'An OAK-D camera streams color and depth. MediaPipe finds the hand, and the depth around it is cropped into a 5×5 grid.',
        'Temporal and median filters calm the sensor noise, then the grid goes over UDP to a Pico W driving the motor array.',
      ],
      contribution: [
        'Depth capture and visualization on the OAK-D',
        'The hand-tracking pipeline: landmarks to a filtered 5×5 grid, with calibration that persists between runs',
        'The MicroPython UDP receiver on the Pico W',
      ],
      decisions: [
        { title: 'MediaPipe over YOLO', body: 'Hand landmarks beat a box detector for cropping depth right around the hand.' },
        { title: 'Only 25 zones', body: 'Small enough to send every frame and map one-to-one onto the motors.' },
        { title: 'Filter before the motors', body: 'A little latency for vibration that doesn’t jitter.' },
      ],
      verification: ['Live FPS profiling against the 30 Hz target', 'A depth-matrix check script and baseline measurements', 'Header and size checks on every packet the Pico receives'],
      results: { text: 'Best Pitch ($250), and Best Presentation at Aggies Create.' },
      now: 'Done. Built and demoed in spring 2026.',
      next: [],
    },
  },
  {
    slug: 'mcu-datalogger',
    featured: 5,
    title: 'MCU Data Logger PCB',
    short: 'Data Logger',
    theme: 'hardware',
    when: 'Jan 2026',
    status: 'design',
    statusNote: 'Schematic done · layout next',
    role: 'Solo project',
    oneLine: 'A standalone ATmega328P logger with a battery-backed clock and 256 KB of I²C EEPROM.',
    stack: ['KiCad 9', 'ATmega328P', 'I²C'],
    facts: [
      { value: '256 KB', label: 'EEPROM across two 24LC1025s' },
      { value: '2', label: 'crystals: 16 MHz MCU, 32.768 kHz RTC' },
    ],
    repo: 'https://github.com/Pranav-s79/MCU_Datalogger',
    demo: null,
    diagram: 'datalogger',
    caseStudy: {
      problem: 'Log sensor data for days with no computer attached, and keep real timestamps through power loss.',
      architecture: [
        'An ATmega328P on a 16 MHz crystal. A DS1337 clock keeps time on its own 32.768 kHz crystal and a backup battery.',
        'Two 24LC1025 EEPROMs share the clock’s I²C bus. A 2×3 ISP header programs the chip, and two LEDs show status.',
      ],
      diagramCaption: 'Drawn from the KiCad schematic.',
      contribution: ['Solo. Part selection, footprints, and schematic capture in KiCad 9.'],
      decisions: [
        { title: 'EEPROM, no SD card', body: 'Everything rides one I²C bus. The cost is 256 KB and finite write cycles.' },
        { title: 'Battery-backed clock', body: 'Timestamps survive power loss without the MCU keeping time.' },
        { title: 'ISP header', body: 'Programs the bare chip. No USB bridge, no bootloader.' },
      ],
      verification: ['ERC in KiCad before layout', 'Bring-up: I²C scan, clock set and read, EEPROM write and read-back'],
      results: { text: 'No boards yet, so nothing measured.' },
      now: 'Schematic captured. Layout hasn’t started.',
      next: ['Footprints and ERC', 'Two-layer layout', 'Fab and bring-up'],
    },
  },

  // ------------------------------------------------------------ additional
  {
    slug: 'riscv-alu',
    title: 'RV32I ALU',
    theme: 'hardware',
    when: 'Jun 2026',
    status: 'complete',
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
    status: 'complete',
    oneLine: 'A C++ program that simulates logic gates, their timing, and their waveforms.',
    overview:
      'Simulates six basic logic gates with per-gate timing delays. It plots input and output signals over time so timing behavior is easy to see.',
    result: { value: '6', label: 'gate types' },
    stack: ['C++'],
    repo: null,
    demo: null,
  },
  {
    slug: 'gimbal-stabilizer',
    title: '2-Axis Gimbal',
    theme: 'software',
    when: 'May 2026 – Present',
    status: 'in-progress',
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
    status: 'complete',
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
    status: 'in-progress',
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
    status: 'complete',
    oneLine: 'A webcam app that counts push-ups and flags bad form in real time.',
    overview:
      'Tracks body position from a webcam and measures joint angles. It counts reps and calls out depth or alignment problems as they happen.',
    result: null,
    stack: ['Python', 'MediaPipe'],
    repo: 'https://github.com/Pranav-s79/Pushup_Form_Checker',
    demo: null,
  },
]

const visible = projects.filter((p) => !p.hidden)
export const featuredProjects = visible.filter((p) => p.featured).sort((a, b) => a.featured - b.featured)
export const additionalProjects = visible.filter((p) => !p.featured)
export const projectBySlug = (slug) => featuredProjects.find((p) => p.slug === slug) || null

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

// ---- Experience: shared by the Experience and Resume pages ----
// category: 'employment' | 'organization'. Research entries come from `research`.
// notes: short lines. groups: labeled note lists when one role has distinct parts.
export const experience = [
  {
    id: 'aggies-create-consultancy',
    role: 'Consultancy Team Member',
    org: 'Aggies Create',
    client: 'Shallow Sports Boats',
    when: 'Sep 2026 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'professional',
    summary: 'Autonomous survey boat for a sponsor, built by a student consulting team.',
    notes: [
      'Implementing C++ firmware on an ESP32 that streams GPS, IMU, sonar, and propulsion telemetry to the navigation stack',
      'Deploying a quantized vision model on a Raspberry Pi for real-time water segmentation and obstacle detection',
      'Designing the C++ and ROS 2 navigation software that turns mission goals into autonomous survey runs',
    ],
    tech: ['C++', 'ESP32', 'Raspberry Pi', 'ROS 2'],
  },
  {
    id: 'nietzsche-labs',
    role: 'Robotics Software Engineering Intern',
    org: 'Nietzsche Labs',
    when: 'Aug – Sep 2026',
    where: 'Remote',
    current: false,
    category: 'professional',
    summary: 'Robot OS provisioning tool, from desktop app to cloud API.',
    notes: [
      'Shipped a cross-platform Electron app that flashes robot OS images onto SD cards, backed by an AWS serverless API',
      'Added 8 pre-write safety checks with target-drive re-verification so it can never overwrite a host disk',
      'Automated first-boot partition expansion on embedded Linux images, reclaiming 90–97% of storage stuck behind a fixed 2.75 GiB partition; zero failures across 10 card sizes from 2 to 256 GB',
    ],
    tech: ['Electron', 'AWS', 'Embedded Linux'],
  },
  {
    id: 'icode',
    role: 'Coding Instructor',
    org: 'iCode',
    when: 'Mar – Jul 2025',
    where: null,
    current: false,
    category: 'professional',
    summary: 'Taught programming to K–12 students.',
    notes: ['Covered Python, Java, and Lua', 'Mentored a student robotics team'],
    tech: ['Python', 'Java', 'Lua'],
  },
  {
    id: 'rev-silicon',
    role: 'Treasurer & Architecture Team Member',
    org: 'Rev Silicon',
    when: 'Aug 2026 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'leadership',
    summary: 'Student silicon design organization working toward its first fabrication on SKY130.',
    groups: [
      {
        label: 'Treasurer',
        notes: [
          'Manage the budget and funding for fabrication',
          'Coordinate hardware procurement and EDA tooling so members can take designs from concept to fab',
        ],
      },
      {
        label: 'Architecture',
        notes: [
          'Work with the architecture team on ASIC concepts, including chips aimed at high-frequency trading',
          'Explore low-latency datapaths, dataflow, memory, and RTL-level tradeoffs',
        ],
      },
    ],
  },
  {
    id: 'aggies-create-webmaster',
    role: 'Webmaster',
    org: 'Aggies Create',
    when: '2025 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'leadership',
    summary: 'Build and maintain the organization’s website.',
    notes: [],
  },
]

// ---- Resume page ----
export const resume = {
  downloads: [
    { label: 'Hardware resume', href: 'resumes/resume-hardware.pdf' },
    { label: 'Software resume', href: 'resumes/Senthilkumar,Pranav - Resume.pdf' },
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
