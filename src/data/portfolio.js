// ============================================================
// Content for the portfolio. Plain, specific, and checkable.
// Sources: the resumes plus each project's own repository and docs.
// Numbers marked as targets or plans are not measurements; keep it that way.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  degree: 'B.S. Electrical Engineering (Honors) · Texas A&M · May 2028',
  focus: 'Silicon · AI/ML · Infrastructure',
  email: 'pranav.senthilkumar79@gmail.com',
  linkedin: 'https://linkedin.com/in/pranavsen',
  github: 'https://github.com/Pranav-s79',
}

export const shelfItems = [
  { label: 'Experience', path: '/experience' },
  { label: 'Research', path: '/research' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
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
      'Electrical engineering student at Texas A&M working across silicon, AI/ML, and infrastructure.',
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
    title: 'Urban Atmospheric Modeling',
    org: 'LIVE Lab · Texas A&M',
    role: 'Undergraduate ML Researcher',
    when: '2026 —',
    period: 'Jun 2026 – Present',
    current: true,
    line: 'Downscaling atmospheric data for faster, more accurate predictions at neighborhood scale.',
    about:
      'How can coarse atmospheric data be downscaled into a model that is both faster and more accurate for specific areas? I am currently focusing on urban environments, where buildings can create sharp local changes that regional forecasts do not resolve.',
    how: [
      'Built a pipeline that combines LiDAR scans with terrain and building geometry',
      'Currently using Fourier neural operators to learn the local structure in urban atmospheric data',
      'Used a residual correction model to recover atmospheric fields at four times the input resolution',
      'Reduced inference time from about three minutes to under one second',
    ],
    metrics: [
      { value: '50%', label: 'less near-ground error' },
      { value: '<1 s', label: 'per prediction, down from ~3 min' },
      { value: '+59.9%', label: '4× super-resolution over interpolation' },
    ],
    tech: ['Python', 'XGBoost', 'Fourier neural operators', 'LiDAR'],
    link: null,
  },
  {
    slug: 'algoverse',
    title: 'Moral ambiguity in LLMs',
    org: 'Algoverse AI Research',
    role: 'Student Researcher',
    when: '2024',
    period: 'Jun – Oct 2024',
    current: false,
    line: 'We calibrated open models to better reflect the spectrum of human ethics.',
    about:
      'People often disagree on morally ambiguous questions, while language models tend to return one confident answer. We calibrated open models against human response data and measured how closely their answers reflected the full distribution of those responses.',
    how: [
      'Fine-tuned three open models with parameter-efficient training',
      'Compared each model with human responses and GPT-4o',
      'Published the results at the NeurIPS 2024 SoLaR workshop',
    ],
    metrics: [
      { value: '7B', label: 'open model, matched GPT-4o' },
      { value: '31%', label: 'less error vs. human responses' },
      { value: 'NeurIPS', label: '2024 SoLaR workshop paper' },
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
    oneLine: 'We are designing a compact INT8 matrix-multiply accelerator for the open SkyWater 130 nm process.',
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
        'Neural-network inference spends much of its time on matrix multiplication, but an open 130 nm shuttle leaves little room for memory or a wide host interface. We therefore use the available area for reusable multiply-accumulate hardware and keep the rest of the workload on the host.',
      architecture: [
        'The host sends commands and data over an SPI-style interface. A loader places one INT8 weight in each of the 16 processing elements, one column per cycle. Activations enter four at a time through a skew stage that lines each row up with the right cycle.',
        'Each PE multiplies its activation by its stored weight and adds the product into its own 32-bit accumulator. When the inner dimension is finished, the accumulators turn into a shift register and drain one row per cycle into an output collector, an optional residual-add and ReLU stage, and back to the host.',
      ],
      diagramCaption:
        'One tile moving through the chip. Weights stay put; activations stream in from the left; finished sums drain downward.',
      contribution: [
        'The team is split across array and dataflow, arithmetic and verification, and integration and I/O.',
        'My work focuses on the dataflow, memory organization, and interfaces between blocks.',
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
    oneLine: 'I am building a 32-bit RISC-V core in SystemVerilog and taking it from a verified single-cycle design to a pipelined FPGA implementation.',
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
        'The first goal is to implement the full RV32I instruction set correctly, including its corner cases. Once that baseline is verified and measured, I can pipeline the design without guessing whether a later failure came from the ISA logic or the optimization.',
      architecture: [
        'Phase 1 is single-cycle: fetch through writeback in one clock. The memories live outside the core, so the core synthesizes and gets measured on its own.',
        'Illegal instructions, misaligned or out-of-range accesses, ECALL, and EBREAK halt the core with a cause code.',
      ],
      diagramCaption: 'Phase 1 datapath.',
      contribution: [
        'This is a solo project. I defined the phase plan, architecture, verification strategy, Vivado flow, and initial module designs.',
        'I finished the Phase 1 RTL with AI assistance documented in the repository. I am writing the pipeline RTL myself.',
      ],
      decisions: [
        { title: 'Single-cycle first', body: 'The single-cycle core provides a known-good CPI 1 baseline at about 58 MHz. Every later phase can be compared against it.' },
        { title: 'Branches skip the ALU', body: 'A separate adder shortens the branch path and keeps the ALU simpler.' },
        { title: 'Traps just halt', body: 'Cause and value registers provide enough state for verification. Full CSR support can come later.' },
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
      now: 'Phase 1 passes in simulation, but I have not run it on the board yet.',
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
    oneLine: 'CrossLayer checks timing, ordering, and data-loss contracts across hardware and software using evidence from real runs.',
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
      problem: 'Hardware and software can pass their own tests and still fail when they interact. CrossLayer checks the timing, data-loss, and ordering assumptions that sit between those components.',
      architecture: [
        'Adapters turn raw logs from a target, like an RTL sim or firmware, into normalized events. The core never imports a target.',
        'A contract engine checks those events against YAML contracts and writes a run bundle: verdicts, evidence linked to the exact log line, and replay data.',
      ],
      diagramCaption: 'Adapters on the left of the line, the core on the right.',
      contribution: ['I built the contract language, engine, adapters, CLI, reports, and test suite as a solo project.'],
      decisions: [
        { title: 'No evidence, no pass', body: 'Verdicts are PASS, FAIL, or INCONCLUSIVE. A run with a truncated log cannot pass.' },
        { title: 'The core knows no targets', body: 'RTL support lives in an adapter, so adding it required no changes to the core engine.' },
        { title: 'Real RTL', body: 'The reference target runs an unmodified PicoRV32 under Icarus in lockstep with an ISA model.' },
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
    oneLine: 'Regdrift compares two register maps in CI and flags changes that would break existing firmware before they merge.',
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
      problem: 'A driver can still compile after a register moves, even though every write now reaches the wrong address. Regdrift catches that kind of interface break before it reaches firmware.',
      architecture: [
        'Parses two CMSIS-SVD revisions into one resolved model, matches peripherals, registers, and fields, and classifies every difference.',
        'Output is text, JSON, or GitHub annotations, and the exit code gates the merge. Ships as a CLI and a GitHub Action.',
      ],
      diagramCaption: 'Two revisions in, one verdict out.',
      contribution: ['I built the parser, matcher, rule engine, CLI, GitHub Action, and PyPI release as a solo project.'],
      decisions: [
        { title: 'Careful with renames', body: 'Only exact structural matches count as renames. Anything less certain is reported as a removal and an addition.' },
        { title: 'Rules with IDs', body: 'Every verdict points back to one of 22 published rules, which makes CI output traceable.' },
        { title: 'Allow by path', body: 'Intentional breaks are approved one register at a time rather than disabling an entire rule.' },
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
    oneLine: 'We turned hand-depth data from a stereo camera into a 5×5 grid of vibration that updates at 30 Hz.',
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
      problem: 'Most telepresence systems carry sight and sound but provide no sense of touch. We built a prototype that maps the depth around a remote hand onto a wearable vibration array.',
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
        { title: 'MediaPipe over YOLO', body: 'Hand landmarks let us crop depth around the hand more precisely than a bounding-box detector.' },
        { title: 'A 25-zone grid', body: 'The grid is small enough to transmit every frame and maps directly to the 25 motors.' },
        { title: 'Filter before the motors', body: 'We accepted a small amount of latency to prevent noisy depth readings from making the vibration jitter.' },
      ],
      verification: ['Live FPS profiling against the 30 Hz target', 'A depth-matrix check script and baseline measurements', 'Header and size checks on every packet the Pico receives'],
      results: { text: 'Best Pitch ($250), and Best Presentation at Aggies Create.' },
      now: 'We completed and demonstrated the prototype in spring 2026.',
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
    oneLine: 'I designed a standalone ATmega328P data logger with a battery-backed clock and 256 KB of I²C EEPROM.',
    stack: ['KiCad 9', 'ATmega328P', 'I²C'],
    facts: [
      { value: '256 KB', label: 'EEPROM across two 24LC1025s' },
      { value: '2', label: 'crystals: 16 MHz MCU, 32.768 kHz RTC' },
    ],
    repo: 'https://github.com/Pranav-s79/MCU_Datalogger',
    demo: null,
    diagram: 'datalogger',
    caseStudy: {
      problem: 'The logger needs to collect sensor data for days without a computer attached and preserve accurate timestamps through a power loss.',
      architecture: [
        'An ATmega328P on a 16 MHz crystal. A DS1337 clock keeps time on its own 32.768 kHz crystal and a backup battery.',
        'Two 24LC1025 EEPROMs share the clock’s I²C bus. A 2×3 ISP header programs the chip, and two LEDs show status.',
      ],
      diagramCaption: 'Drawn from the KiCad schematic.',
      contribution: ['I selected the parts and created the footprints and schematic in KiCad 9 as a solo project.'],
      decisions: [
        { title: 'EEPROM instead of an SD card', body: 'The clock and storage share one I²C bus, which keeps the design simple. The tradeoff is a 256 KB capacity and finite write endurance.' },
        { title: 'Battery-backed clock', body: 'The separate clock keeps timestamps valid through a power loss without relying on the MCU.' },
        { title: 'ISP header', body: 'The header programs the bare chip directly, so the board does not need a USB bridge or bootloader.' },
      ],
      verification: ['ERC in KiCad before layout', 'Bring-up: I²C scan, clock set and read, EEPROM write and read-back'],
      results: { text: 'The board has not been fabricated yet, so there are no measured results.' },
      now: 'The schematic is complete. Layout has not started yet.',
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
    oneLine: 'I built and verified the arithmetic and branch logic for an RV32I processor in Verilog.',
    overview:
      'The design implements a 32-bit arithmetic logic unit and branch comparator for RV32I. Directed and randomized tests compare the Verilog output with a Python reference model.',
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
    oneLine: 'I wrote a C++ simulator for basic logic gates, including propagation delays and signal waveforms.',
    overview:
      'The simulator models six gate types with a separate delay for each gate. It plots the input and output signals over time so propagation behavior is visible.',
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
    oneLine: 'I am building a two-axis camera mount that uses IMU feedback to hold itself level.',
    overview:
      'The controller reads orientation from an IMU and drives two servos to stabilize the platform. I am adding camera-based object tracking next.',
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
    oneLine: 'ThermGuard predicts per-core temperature limits and uses them when scheduling work.',
    overview:
      'A machine-learning model predicts a safe temperature limit for each processor core, and the scheduler assigns work within those limits. A calibration step keeps the limits reliable.',
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
    oneLine: 'Tadori indexes an unfamiliar codebase into an interactive graph of its files, functions, and tests.',
    overview:
      'The index can be explored visually or queried by an AI coding agent. Re-indexing 250,000 lines takes 1.3 seconds.',
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
    oneLine: 'I built a webcam app that counts push-ups and flags depth or alignment problems in real time.',
    overview:
      'The app tracks body position from a webcam and measures joint angles. It uses those measurements to count repetitions and report form problems as they happen.',
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
    summary: 'An autonomous survey boat, sensors to navigation.',
    about:
      'A student consulting team building a boat for Shallow Sports Boats that runs surveys on its own. An ESP32 reads the sensors and drives propulsion, a Raspberry Pi handles vision, and a ROS 2 stack plans the route.',
    notes: [
      'ESP32 firmware in C++: GPS, IMU, sonar, and propulsion telemetry',
      'Quantized segmentation model on a Raspberry Pi, water and obstacles in real time',
      'ROS 2 navigation that turns a mission into a survey run',
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
    summary: 'Robot OS provisioning, desktop to cloud.',
    about:
      'A cross-platform desktop app that writes robot OS images onto SD cards, backed by an AWS serverless API. Writing raw disks is risky, so the target drive is re-verified before every write, and a first-boot script grows the partition to use the whole card.',
    notes: [
      '8 pre-write checks between the tool and a host disk',
      '90–97% of stranded storage reclaimed on first boot, clean on all 10 card sizes tested',
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
    summary: 'K–12 programming.',
    about: 'Coding classes for K–12 students in Python, Java, and Lua, plus mentoring a student robotics team.',
    notes: [],
    tech: [],
  },
  {
    id: 'rev-silicon',
    role: 'Treasurer & Architecture Team Member',
    org: 'Rev Silicon',
    when: 'Aug 2026 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'leadership',
    summary: 'Student silicon design, headed for a first SKY130 fabrication.',
    about:
      'A Texas A&M student organization designing chips, working toward its first fabrication on the open-source SKY130 process. Two hats: running the money behind fabrication and tools, and contributing to the architecture team, including ASIC concepts for high-frequency trading where every cycle of latency counts.',
    groups: [
      { label: 'Treasurer', notes: ['Budget and funding for fabrication', 'EDA tooling and hardware procurement'] },
      {
        label: 'Architecture',
        notes: ['ASIC concepts for high-frequency trading', 'Low-latency dataflow, memory, and RTL tradeoffs'],
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
    summary: 'I build and maintain the organization’s website.',
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
