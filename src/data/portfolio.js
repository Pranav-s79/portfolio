// ============================================================
// Content for the portfolio. Plain, specific, and checkable.
// Sources: the resumes plus each project's own repository and docs.
// Numbers marked as targets or plans are not measurements; keep it that way.
// ============================================================

export const profile = {
  name: 'Pranav Senthilkumar',
  degree: 'B.S. Electrical Engineering (Honors) · Texas A&M · May 2028',
  focus: 'Computer architecture · Silicon design · Embedded systems',
  tagline: 'I work on processors and accelerators, and on the firmware and verification tools around them.',
  intro:
    'Electrical engineering student at Texas A&M. I’m building an RV32I processor in SystemVerilog, contributing to a 4×4 INT8 accelerator for the SkyWater 130 nm process, and writing tools that check hardware and software against each other.',
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
    description:
      'An INT8 inference accelerator, an RV32I processor, cross-layer verification tooling, and embedded hardware.',
  },
  '/skills': { title: 'Skills', description: 'Hardware, embedded, robotics, and software skills, mapped by domain.' },
  '/resume': { title: 'Resume', description: 'Hardware and software resumes as PDFs, plus the full record.' },
}

// ---- Research: shared by the Research, Experience, and Resume pages ----
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
    featured: 2,
    title: 'RV32I RISC-V Processor',
    short: 'RV32I',
    theme: 'hardware',
    when: 'Sep 2026 – Present',
    status: 'in-progress',
    statusNote: 'Phase 1 of 8 done: single-cycle core verified',
    role: 'Solo project',
    oneLine: 'A 32-bit RISC-V processor in SystemVerilog, built in measured phases toward a pipelined core on an FPGA.',
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
        'A processor is only useful if every instruction does exactly what the ISA says, including the corners: misaligned accesses, illegal encodings, signed versus unsigned compares. This core is built in phases (single-cycle, then pipelined, then forwarding), and each phase is verified and measured before the next one starts.',
      architecture: [
        'Phase 1 is a single-cycle core. Fetch, decode, register read, ALU, memory access, and writeback all finish in one clock, and the PC, registers, and memory update together on the edge.',
        'The memories sit outside the core in a small system wrapper with an LED register, so the core can be synthesized and measured on its own. Illegal instructions, misaligned or out-of-range accesses, ECALL, and EBREAK halt the core with a cause and value.',
      ],
      diagramCaption: 'Phase 1 datapath. Branches use their own comparator and adder, not the ALU.',
      contribution: [
        'Solo project. I set the phase plan, architecture, verification strategy, and Vivado flow, and wrote the starting module drafts.',
        'The Phase 1 RTL was finished with AI assistance, as recorded in the repository’s decision log. The pipeline phases are mine to implement.',
      ],
      decisions: [
        {
          title: 'Single-cycle first',
          body: 'Characterize the simplest correct design before optimizing. It sets the baseline (CPI of 1, about 58 MHz) that every later phase is compared against at the same 10 ns reference clock.',
        },
        {
          title: 'Branches skip the ALU',
          body: 'A dedicated comparator and PC adder cost one extra 32-bit adder, but keep the ALU simple and shorten the branch path.',
        },
        {
          title: 'LUI as 0 + immediate',
          body: 'Routing LUI through the ALU keeps the writeback mux at three inputs: ALU result, load data, and PC + 4.',
        },
        {
          title: 'Traps halt the core',
          body: 'Exceptions stop the core with cause and value registers instead of jumping to a handler. That is enough for verification now; CSR-based traps can come later.',
        },
      ],
      verificationIntro: 'Three layers, each catching different bugs:',
      verification: [
        'Eight self-checking unit testbenches, including 5,000 random ALU vectors checked against a reference written with different math',
        'Eleven programs, including compiled C, run on the full system and compared line by line against a Python instruction-set simulator: PC, instruction, register writes, and memory writes',
        'The same suite runs in Icarus Verilog and in Vivado’s simulator, and planted bugs in copies of the RTL confirm the tests catch them',
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
        text: 'Vivado 2026.1, out-of-context, Zynq XC7Z010, against a fixed 10 ns reference clock that the single-cycle design is not expected to meet.',
        table: [
          ['Worst negative slack', '−7.194 ns'],
          ['Estimated Fmax', '≈58 MHz'],
          ['Critical path', '19 logic levels, 79% routing delay'],
          ['LUTs (core + 8 KiB memories)', '2,054 of 17,600'],
          ['Latches', '0'],
        ],
      },
      now: 'Phase 1 is complete: the single-cycle core passes every test in two simulators and has a measured Vivado baseline. It has not run on the board yet.',
      next: [
        'Phase 2: run more compiled software on the core',
        'Phases 3–4: a 5-stage pipeline with hazard detection and forwarding',
        'Phase 6: bring-up on the Zybo Z7-10 and a clock-period sweep',
      ],
    },
  },
  {
    slug: 'crosslayer',
    featured: 3,
    title: 'CrossLayer',
    short: 'CrossLayer',
    theme: 'software',
    when: 'Nov 2026 – Present',
    status: 'in-progress',
    statusNote: 'Phase 3 of 15: RTL processor verification done',
    role: 'Solo project',
    oneLine: 'Writes the assumptions between hardware, firmware, and software as contracts, then checks real runs against them.',
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
      problem:
        'Components often pass their own tests and still fail together. The bugs live between them: missed deadlines, dropped data, mismatched assumptions about order or timing. Neither side’s unit tests can see them.',
      architecture: [
        'A system under test, such as an RTL simulation or a firmware pipeline, produces raw logs. An adapter turns them into normalized events. The core never imports a target, and a test enforces that boundary.',
        'A contract engine checks the events against YAML contracts and writes a run bundle: a verdict per contract, evidence that links to the exact raw log line, and enough recorded state to replay the run on another machine.',
      ],
      diagramCaption: 'Adapters isolate each target; the contract engine only sees normalized events.',
      contribution: ['Solo project: contract language, engine, adapters, CLI, reports, and test suite.'],
      decisions: [
        {
          title: 'Missing evidence is never a pass',
          body: 'A truncated log can’t prove a contract held. Verdicts are PASS, FAIL, or INCONCLUSIVE, so a contract can’t pass vacuously.',
        },
        {
          title: 'The core knows no targets',
          body: 'Adding RTL processor verification needed no change under the core; it arrived as an adapter.',
        },
        {
          title: 'Real RTL, unmodified',
          body: 'The RISC-V integration runs the existing PicoRV32 core unchanged under Icarus Verilog and checks it in lockstep against a reference ISA model, so contracts are tested against real hardware behavior rather than a mock.',
        },
        {
          title: 'Reproducible by construction',
          body: 'Experiments are seeded and run bundles are hashed, so a failure can be replayed elsewhere and compared by fingerprint.',
        },
      ],
      verificationIntro: 'Every phase has a fault it must catch and a clean baseline it must not flag:',
      verification: [
        'Each injected fault must trip exactly its target contracts, and the baseline must pass all of them',
        'Contract tests run known-good and known-bad traces per contract, which catches a contract that was weakened by accident',
        'Seven faults planted in the RISC-V core: inverted BNE, SUB computed as ADD, unsigned SLT, a bad JAL immediate bit, wrong destination register, wrong store byte lane, and memory wait states',
        'CI on Linux and Windows, Python 3.11 to 3.14, with a fault-detection gate',
      ],
      output: {
        label: 'crosslayer suite experiments/reference/suite.yaml · run Nov 9, 2026',
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
      results: {
        text: 'A review after Phase 1 fixed 13 issues, each with a regression test. The largest was a quadratic path in the response rule: an 80,000-event check went from 6.6 s to 0.21 s.',
      },
      now: 'Phases 1–3 are done: the verification core, contract tooling, and RTL processor verification.',
      next: ['Phase 4: wireless log analysis for 5G RAN and core', 'Firmware and hardware-in-the-loop adapters', 'Fault localization'],
    },
  },
  {
    slug: 'regdrift',
    featured: 4,
    title: 'Regdrift',
    short: 'Regdrift',
    theme: 'software',
    when: 'Jun – Jul 2026',
    status: 'complete',
    statusNote: 'Public alpha on PyPI',
    role: 'Solo project',
    oneLine: 'A CI gate that catches register-map changes that would break firmware before they merge.',
    stack: ['Python', 'CMSIS-SVD', 'GitHub Actions'],
    facts: [
      { value: '22', label: 'published compatibility rules' },
      { value: '15', label: 'real vendor SVDs in the test corpus' },
    ],
    repo: 'https://github.com/Pranav-s79/regdrift',
    demo: 'https://pypi.org/project/regdrift/',
    demoLabel: 'PyPI',
    diagram: 'regdrift',
    caseStudy: {
      problem:
        'A moved register can leave a driver compiling cleanly while every write lands at the wrong address. Vendors describe register maps in CMSIS-SVD files, and changes between revisions are easy to miss in review.',
      architecture: [
        'Regdrift parses two SVD files into a fully resolved model: inherited register properties, derived peripherals, nested clusters, and arrays. It matches peripherals, registers, and fields structurally, then classifies every difference against a published rule set.',
        'Output is ranked text, versioned JSON, or GitHub annotations, and the exit code gates the merge. It ships as a Python CLI and as a GitHub Action.',
      ],
      diagramCaption: 'Two revisions in, one verdict out.',
      contribution: ['Solo project: parser, matcher, rule engine, CLI, GitHub Action, and PyPI release.'],
      decisions: [
        {
          title: 'Conservative rename detection',
          body: 'A rename is reported only on an exact structural match. Anything less becomes a removal plus an addition, which is the safer reading for firmware.',
        },
        {
          title: 'A published rule contract',
          body: '15 breaking, 4 warning, and 3 safe rules are documented, so every verdict traces to a rule ID.',
        },
        {
          title: 'Allow changes by exact path',
          body: 'An intentional breaking change is approved one register path at a time, not by switching a rule off.',
        },
      ],
      verificationIntro: 'Tested at several levels on Python 3.11 and 3.12:',
      verification: [
        'Unit, CLI, fuzz, and golden-output tests',
        'A pinned corpus of 15 real vendor SVD files',
        'A mutation harness that proves every published rule fires against real vendor models',
      ],
      output: {
        label: 'regdrift check demo/chip_v1.svd demo/chip_v2.svd · from the README',
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
      results: {
        text: 'Released as 0.1.0a3, a public alpha on PyPI, and usable as a composite GitHub Action. Known gaps are listed in the repository’s RULES.md.',
      },
      now: 'Public alpha. The core rule set, CLI, and Action are done.',
      next: ['Close the gaps listed under “what regdrift does not check yet” in RULES.md'],
    },
  },
  {
    slug: 'haptic-portal',
    featured: 5,
    title: 'Haptic Portal',
    short: 'Haptic Portal',
    theme: 'software',
    when: 'Jan – May 2026',
    status: 'complete',
    statusNote: 'Prototype complete and demoed',
    role: 'Five-person team',
    oneLine: 'Turns depth from a camera into a 5×5 grid of vibration you can feel on your hand.',
    stack: ['Python', 'OAK-D', 'MediaPipe', 'MicroPython'],
    facts: [
      { value: '5×5', label: 'depth matrix sent over UDP' },
      { value: '30 FPS', label: 'pipeline target' },
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
      problem:
        'Telepresence carries sight and sound but not touch. The goal was to let someone feel the shape of what is in front of a camera through a small grid of vibration motors.',
      architecture: [
        'An OAK-D camera streams color and depth. MediaPipe finds 21 hand landmarks, and the depth region around the hand is cropped, normalized to a 5×5 matrix, and smoothed over the last five frames.',
        'When a hand is detected with confidence above 0.8, the matrix is sent over UDP to a Raspberry Pi Pico W on the haptic side, which feeds the motor grid.',
      ],
      contribution: [
        'Wrote the OAK-D depth capture and visualization in the first sprint',
        'Consolidated the hand-tracking pipeline: landmarks plus depth-region extraction into the 5×5 matrix, with depth calibration that persists between runs',
        'Wrote the MicroPython UDP receiver on the Pico W that validates each packet’s header and size',
      ],
      decisions: [
        {
          title: 'MediaPipe instead of YOLO',
          body: 'An earlier version used a YOLO model. MediaPipe’s landmark model replaced it and the old model assets were removed.',
        },
        {
          title: 'A coarse 5×5 output',
          body: 'Small enough to send every frame over UDP and to map one-to-one onto a small motor grid.',
        },
        {
          title: 'Rolling-average smoothing',
          body: 'A five-frame window trades a little latency for steadier vibration, and resets when tracking is lost or the calibration changes.',
        },
      ],
      verificationIntro: 'Checked on the running system:',
      verification: [
        'On-screen FPS profiling against the 30 FPS target',
        'A depth-matrix verification script and a baseline measurement script',
        'Header and size checks on every packet the Pico W receives',
      ],
      results: {
        text: 'Won Best Pitch ($250) and Best Presentation at Aggies Create.',
      },
      now: 'Complete. The prototype was built and demoed in spring 2026.',
      next: [],
    },
  },
  {
    slug: 'mcu-datalogger',
    featured: 6,
    title: 'MCU Data Logger PCB',
    short: 'Data Logger',
    theme: 'hardware',
    when: 'Jan 2026',
    status: 'design',
    statusNote: 'Schematic captured; PCB layout not started',
    role: 'Solo project',
    oneLine: 'A standalone ATmega328P logger with a battery-backed clock and 256 KB of I²C EEPROM, designed in KiCad.',
    stack: ['KiCad 9', 'ATmega328P', 'I²C'],
    facts: [
      { value: '256 KB', label: 'EEPROM across two 24LC1025s' },
      { value: '2', label: 'crystals: 16 MHz MCU, 32.768 kHz RTC' },
    ],
    repo: 'https://github.com/Pranav-s79/MCU_Datalogger',
    demo: null,
    diagram: 'datalogger',
    caseStudy: {
      problem:
        'A data logger has to keep accurate time and store samples while unattended, across power loss, with no computer attached.',
      architecture: [
        'An ATmega328P runs from a 16 MHz crystal. A DS1337 real-time clock keeps time from its own 32.768 kHz crystal and a backup battery.',
        'Samples go to two 24LC1025 EEPROMs on the same I²C bus as the clock, with 4.7 kΩ pull-ups. A 2×3 ISP header programs the chip directly, pin headers break out power and I/O, and two LEDs show status.',
      ],
      diagramCaption: 'Block diagram drawn from the KiCad schematic.',
      contribution: ['Solo project: part selection, symbol and footprint imports, and schematic capture in KiCad 9.'],
      decisions: [
        {
          title: 'EEPROM on the shared I²C bus',
          body: 'Two EEPROMs sit on the clock’s bus, so the board needs no card socket or filesystem. The tradeoff is 256 KB of capacity and limited write endurance.',
        },
        {
          title: 'A battery-backed clock',
          body: 'Timestamps survive power loss, and the microcontroller doesn’t have to keep time itself.',
        },
        {
          title: 'Programming over ISP',
          body: 'A 2×3 header programs the bare ATmega328P, so the board needs no USB bridge or bootloader.',
        },
      ],
      verificationIntro: 'Planned once boards exist:',
      verification: [
        'Electrical rules check in KiCad before layout',
        'Bring-up: I²C bus scan, set and read the clock, write and read back both EEPROMs',
      ],
      results: { text: 'No hardware yet, so nothing measured.' },
      now: 'The schematic is captured. PCB layout has not started.',
      next: ['Footprint assignment and electrical rules check', 'Two-layer board layout', 'Fabrication and bring-up'],
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

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.featured - b.featured)
export const additionalProjects = projects.filter((p) => !p.featured)
export const projectBySlug = (slug) => projects.find((p) => p.slug === slug && p.featured) || null

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
    id: 'nietzsche-labs',
    role: 'Robotics Software Engineering Intern',
    org: 'Nietzsche Labs',
    when: 'Aug – Sep 2026',
    where: 'Remote',
    current: false,
    category: 'employment',
    summary: 'Built a desktop app that sets up operating systems on robot computers.',
    notes: ['Added safety checks so it never overwrites the wrong drive'],
  },
  {
    id: 'icode',
    role: 'Coding Instructor',
    org: 'iCode',
    when: 'Mar – Jul 2025',
    where: null,
    current: false,
    category: 'employment',
    summary: 'Taught Python, Java, and Lua to K–12 students.',
    notes: ['Mentored a student robotics team'],
  },
  {
    id: 'aggies-create-consultancy',
    role: 'Consultancy Team Member',
    org: 'Aggies Create',
    client: 'Shallow Sports Boats',
    when: 'Sep 2026 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'organization',
    summary: 'Student consulting team building an autonomous survey boat for Shallow Sports Boats.',
    groups: [
      {
        label: 'Done',
        notes: [
          'Laid out the system split: a Raspberry Pi 5 runs ROS 2 navigation and vision; an ESP32 handles sensors, motor control, and a safety watchdog over USB serial',
        ],
      },
      {
        label: 'In progress',
        notes: [
          'C++ firmware on the ESP32 for GPS, IMU, sonar, and propulsion telemetry',
          'Computer vision on the Raspberry Pi, with model quantization to fit its compute budget',
          'ROS 2 navigation nodes for autonomous survey runs',
        ],
      },
    ],
  },
  {
    id: 'rev-silicon',
    role: 'Treasurer & Architecture Team Member',
    org: 'Rev Silicon',
    when: 'Aug 2026 – Present',
    where: 'College Station, TX',
    current: true,
    category: 'organization',
    summary: 'Student chip-design organization at Texas A&M.',
    groups: [
      {
        label: 'Treasurer',
        notes: ['Plan the budget and fabrication resources', 'Coordinate EDA tooling and hardware resources for members'],
      },
      {
        label: 'Architecture',
        notes: [
          'Work with the architecture team on ASIC concepts, including chips aimed at high-frequency trading',
          'Explore low-latency designs: dataflow, memory organization, and RTL-level tradeoffs',
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
    category: 'organization',
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
