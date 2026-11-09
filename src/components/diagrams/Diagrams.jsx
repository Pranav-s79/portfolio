import { createContext, useContext, useId } from 'react'

// ============================================================
// Technical diagrams, drawn from each project's own docs or schematic.
// Plain SVG with theme tokens (see .dg-* in App.css), so they follow
// light/dark. Each diagram has a text description for screen readers.
// ============================================================

const MarkerCtx = createContext('dg')

function Defs() {
  const id = useContext(MarkerCtx)
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path className="dg-arrow" d="M0 0.6 L7.4 4 L0 7.4 Z" />
      </marker>
      <marker id={`${id}-b`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path className="dg-arrow dg-arrow--accent" d="M0 0.6 L7.4 4 L0 7.4 Z" />
      </marker>
    </defs>
  )
}

function Box({ x, y, w, h, title, sub, sub2, variant, align = 'middle' }) {
  const tx = align === 'start' ? x + 12 : x + w / 2
  const lines = [sub, sub2].filter(Boolean)
  const titleY = y + h / 2 - (lines.length * 7) + 4
  return (
    <g>
      <rect className={`dg-box${variant ? ` dg-box--${variant}` : ''}`} x={x} y={y} width={w} height={h} rx="3" />
      {title && (
        <text className="dg-title" x={tx} y={titleY} textAnchor={align}>
          {title}
        </text>
      )}
      {lines.map((s, i) => (
        <text key={s} className="dg-sub" x={tx} y={titleY + 16 + i * 14} textAnchor={align}>
          {s}
        </text>
      ))}
    </g>
  )
}

function Wire({ d, accent, dashed, end = true, start = false }) {
  const id = useContext(MarkerCtx)
  const m = `url(#${id}-${accent ? 'b' : 'a'})`
  return (
    <path
      className={`dg-wire${accent ? ' dg-wire--accent' : ''}${dashed ? ' dg-wire--dashed' : ''}`}
      d={d}
      markerEnd={end ? m : undefined}
      markerStart={start ? m : undefined}
    />
  )
}

function Label({ x, y, children, anchor = 'middle', variant }) {
  return (
    <text className={`dg-label${variant ? ` dg-label--${variant}` : ''}`} x={x} y={y} textAnchor={anchor}>
      {children}
    </text>
  )
}

function Frame({ viewBox, title, desc, minWidth = 620, children }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = `dg${raw}`
  return (
    <MarkerCtx.Provider value={id}>
      <div className="dg-scroll" tabIndex={0} aria-label={`${title} (scrollable)`}>
        <svg
          className="dg"
          viewBox={viewBox}
          style={{ minWidth }}
          role="img"
          aria-labelledby={`${id}-t ${id}-d`}
        >
          <title id={`${id}-t`}>{title}</title>
          <desc id={`${id}-d`}>{desc}</desc>
          <Defs />
          {children}
        </svg>
      </div>
      <p className="dg-hint" aria-hidden="true">
        Scroll sideways to see the whole diagram →
      </p>
    </MarkerCtx.Provider>
  )
}

// ---------------------------------------------------------------- POLITE
export function PoliteDiagram() {
  const ax = 392
  const ay = 128
  const pe = 40
  const gap = 14
  const step = pe + gap
  const arrayW = 4 * pe + 3 * gap
  const cols = [0, 1, 2, 3]
  return (
    <Frame
      viewBox="0 0 780 420"
      title="POLITE accelerator block diagram"
      desc="The host sends commands over an SPI-style link to a command decoder. A weight loader fills a 4 by 4 array of processing elements, one column per cycle. Activations pass through an input skew stage into the array rows. A controller sequences load, compute, and drain. After compute, accumulators shift down row by row into an output collector, then an optional residual add and ReLU stage, and results return to the host."
    >
      <Box x={16} y={40} w={104} h={58} title="Host" sub="SPI-style link" />
      <Box x={160} y={40} w={150} h={58} title="Command decode" sub="8 opcodes" />
      <Box x={160} y={178} w={150} h={58} title="Controller" sub="load → compute → drain" />
      <Box x={ax} y={40} w={arrayW} h={58} title="Weight loader" sub="1 column / cycle · 2 banks" />

      {/* input skew */}
      <rect className="dg-box" x={336} y={ay} width={36} height={arrayW} rx="3" />
      <text className="dg-title" transform={`translate(358 ${ay + arrayW / 2}) rotate(-90)`} textAnchor="middle">
        Input skew
      </text>

      {/* PE array */}
      <rect className="dg-region" x={ax - 10} y={ay - 10} width={arrayW + 20} height={arrayW + 20} rx="4" />
      {cols.map((r) =>
        cols.map((c) => (
          <rect
            key={`${r}${c}`}
            className={r === 0 && c === 3 ? 'dg-pe dg-pe--focus' : 'dg-pe'}
            x={ax + c * step}
            y={ay + r * step}
            width={pe}
            height={pe}
            rx="2"
          />
        )),
      )}
      {/* activations flow right along each row, weights come down each column */}
      {cols.map((r) => (
        <Wire key={`a${r}`} d={`M372 ${ay + r * step + pe / 2} H${ax - 2}`} />
      ))}
      {cols.map((c) => (
        <Wire key={`w${c}`} d={`M${ax + c * step + pe / 2} 98 V${ay - 2}`} />
      ))}

      <Wire d="M120 69 H158" />
      <Wire d="M310 69 H390" />
      <Label x={350} y={62}>
        weights
      </Label>
      <Wire d="M235 98 V150 H354 V126" />
      <Label x={296} y={144}>
        act_in[31:0]
      </Label>
      <Wire d="M235 98 V176" dashed />
      <Wire d="M310 207 H334" dashed />
      <Label x={235} y={254} anchor="middle">
        en · load_weight · shift_en
      </Label>

      {/* drain */}
      {cols.map((c) => (
        <Wire key={`d${c}`} accent d={`M${ax + c * step + pe / 2} ${ay + arrayW + 10} V${ay + arrayW + 40}`} />
      ))}
      <Box x={ax} y={ay + arrayW + 42} w={arrayW} h={44} title="Output collect" sub="4 × INT32 per cycle" variant="accent" />
      <Box x={160} y={ay + arrayW + 42} w={150} h={44} title="Residual + ReLU" sub="optional epilogue" />
      <Wire accent d={`M${ax} ${ay + arrayW + 64} H312`} />
      <Wire accent d={`M160 ${ay + arrayW + 64} H68 V100`} />
      <Label x={60} y={ay + arrayW + 58} anchor="end">
        raw INT32
      </Label>

      {/* PE callout */}
      <path className="dg-leader" d={`M${ax + 3 * step + pe} ${ay + 8} H${ax + arrayW + 26}`} />
      <text className="dg-title" x={ax + arrayW + 32} y={ay + 12}>
        Each PE
      </text>
      <text className="dg-sub" x={ax + arrayW + 32} y={ay + 30}>
        acc += a × w
      </text>
      <text className="dg-sub" x={ax + arrayW + 32} y={ay + 46}>
        INT8 × INT8 → INT32
      </text>
      <text className="dg-sub" x={ax + arrayW + 32} y={ay + 62}>
        w held for the tile
      </text>
      <text className="dg-label" x={ax + arrayW + 32} y={ay + arrayW + 26}>
        drain: rows shift down,
      </text>
      <text className="dg-label" x={ax + arrayW + 32} y={ay + arrayW + 40}>
        bottom row first
      </text>
    </Frame>
  )
}

// ---------------------------------------------------------------- RV32I
export function Rv32iDiagram() {
  // main datapath in one row; feedback runs only along the top and bottom
  const y = 110
  const h = 52
  const w = 86
  const xs = [9, 115, 221, 327, 433, 539, 645]
  const cy = y + h / 2
  const mid = (i) => xs[i] + w / 2
  return (
    <Frame
      viewBox="0 0 740 330"
      title="RV32I single-cycle datapath"
      desc="The program counter addresses instruction memory. The decoder produces control signals, register addresses, and an immediate. The register file feeds the ALU, whose result addresses data memory or goes straight to writeback. Writeback selects the ALU result, load data, or PC plus 4 and writes the destination register. A next-PC unit compares registers for branches and picks PC plus 4, PC plus immediate, or rs1 plus immediate, feeding back to the program counter. Instruction and data memories sit outside the core."
    >
      <Box x={xs[0]} y={y} w={w} h={h} title="PC" />
      <Box x={xs[1]} y={y} w={w} h={h} title="Instr mem" sub="4 KiB" variant="sunk" />
      <Box x={xs[2]} y={y} w={w} h={h} title="Decode" sub="+ control" />
      <Box x={xs[3]} y={y} w={w} h={h} title="Reg file" sub="32 × 32" />
      <Box x={xs[4]} y={y} w={w} h={h} title="ALU" sub="10 ops" variant="accent" />
      <Box x={xs[5]} y={y} w={w} h={h} title="Data mem" sub="4 KiB" variant="sunk" />
      <Box x={xs[6]} y={y} w={w} h={h} title="Writeback" sub="ALU / load /" sub2="PC + 4" />
      <Box x={xs[2]} y={200} w={w} h={44} title="Immediate" sub="I/S/B/U/J" />
      <Box x={xs[3]} y={266} w={278} h={46} title="Next PC + branch compare" sub="PC + 4 · PC + imm · (rs1 + imm) & ~1" />

      {xs.slice(0, -1).map((x, i) => (
        <Wire key={x} d={`M${x + w} ${cy} H${xs[i + 1] - 2}`} />
      ))}

      {/* ALU result can skip memory */}
      <Wire d={`M${xs[4] + w} 152 H${xs[5] - 10} V184 H${mid(6)} V${y + h + 2}`} />
      {/* immediate into the ALU and the next-PC adder */}
      <Wire d={`M${mid(2)} ${y + h} V198`} />
      <Wire d={`M${xs[2] + w} 222 H${xs[4] + 30} V${y + h + 2}`} />
      <Wire d={`M${mid(2)} 244 V289 H${xs[3] - 2}`} />
      {/* register values to the branch comparator / JALR */}
      <Wire d={`M${mid(3)} ${y + h} V264`} />
      <Label x={mid(3) + 6} y={196} anchor="start">
        rs1, rs2
      </Label>

      {/* writeback to the register file */}
      <Wire accent d={`M${mid(6)} ${y} V78 H${mid(3)} V${y - 2}`} />
      <Label x={(mid(3) + mid(6)) / 2} y={70}>
        rd ← writeback
      </Label>
      {/* next PC back to the program counter */}
      <Wire accent d={`M${xs[3] + 139} 312 V322 H${mid(0)} V${y + h + 2}`} />
      <Label x={150} y={316}>
        next_pc
      </Label>
    </Frame>
  )
}

// ---------------------------------------------------------------- CrossLayer
export function CrossLayerDiagram() {
  return (
    <Frame
      viewBox="0 0 740 250"
      title="CrossLayer architecture"
      desc="An experiment with a seed and optional injected faults drives a system under test such as an RTL simulation or firmware. Its raw logs go through an adapter that produces normalized events. The contract engine checks those events against YAML contracts and writes a run bundle with verdicts, evidence that links to raw log lines, and replay data. The core never imports a target system."
    >
      <Box x={16} y={36} w={150} h={66} title="System under test" sub="RTL sim · firmware" />
      <Box x={16} y={160} w={150} h={52} title="Experiment" sub="seed · injected faults" />
      <Box x={224} y={36} w={110} h={66} title="Adapter" sub="per target" />
      <Box x={402} y={36} w={152} h={66} title="Contract engine" sub="6 rule kinds" variant="accent" />
      <Box x={402} y={160} w={152} h={52} title="Contracts" sub="YAML, per boundary" />
      <Box x={594} y={28} w={132} h={82} title="Run bundle" sub="verdicts + evidence" sub2="replay · fingerprint" />

      <Wire d="M91 158 V104" />
      <Wire d="M166 69 H222" />
      <Label x={195} y={60}>
        raw logs
      </Label>
      <Wire d="M334 69 H400" />
      <Label x={367} y={60}>
        events
      </Label>
      <Wire d="M478 158 V104" />
      <Wire accent d="M554 69 H592" />
      <Label x={726} y={128} anchor="end">
        PASS · FAIL · INCONCLUSIVE
      </Label>

      <path className="dg-boundary" d="M367 86 V232" />
      <Label x={374} y={232} anchor="start" variant="accent">
        core: never imports a target
      </Label>
      <Label x={360} y={232} anchor="end">
        integrations
      </Label>
    </Frame>
  )
}

// ---------------------------------------------------------------- Regdrift
export function RegdriftDiagram() {
  return (
    <Frame
      viewBox="0 0 740 200"
      title="Regdrift pipeline"
      desc="Two CMSIS-SVD register map revisions are parsed and resolved, matched structurally at the peripheral, register, and field level, and classified against 22 rules. The result is text, JSON, or GitHub annotations, and a non-zero exit code fails CI on breaking changes."
    >
      <Box x={16} y={30} w={116} h={46} title="chip_v1.svd" sub="baseline" variant="sunk" />
      <Box x={16} y={110} w={116} h={46} title="chip_v2.svd" sub="candidate" variant="sunk" />
      <Box x={172} y={60} w={130} h={66} title="Parse + resolve" sub="derived · clusters" sub2="arrays" />
      <Box x={340} y={60} w={130} h={66} title="Match" sub="peripheral ·" sub2="register · field" />
      <Box x={508} y={60} w={92} h={66} title="Classify" sub="22 rules" variant="accent" />
      <Box x={636} y={30} w={90} h={126} />
      <text className="dg-sub dg-sub--strong" x={681} y={58} textAnchor="middle">
        BREAKING
      </text>
      <text className="dg-sub" x={681} y={78} textAnchor="middle">
        WARNING
      </text>
      <text className="dg-sub" x={681} y={98} textAnchor="middle">
        SAFE
      </text>
      <text className="dg-label" x={681} y={130} textAnchor="middle">
        exit 1 →
      </text>
      <text className="dg-label" x={681} y={144} textAnchor="middle">
        CI fails
      </text>

      <Wire d="M132 53 H150 V82 H170" />
      <Wire d="M132 133 H150 V104 H170" />
      <Wire d="M302 93 H338" />
      <Wire d="M470 93 H506" />
      <Wire accent d="M600 93 H634" />
    </Frame>
  )
}

// ---------------------------------------------------------------- Data logger
export function DataLoggerDiagram() {
  return (
    <Frame
      viewBox="0 0 740 300"
      title="MCU data logger block diagram"
      desc="An ATmega328P microcontroller runs from a 16 megahertz crystal. It is programmed through a 2 by 3 ISP header and has pin headers for power and I/O and two status LEDs. On an I2C bus with 4.7 kilohm pull-ups sit a DS1337 real-time clock, with its own 32.768 kilohertz crystal and backup battery, and two 24LC1025 EEPROMs of 128 kilobytes each."
    >
      <Box x={16} y={40} w={120} h={50} title="Pin headers" sub="power · I/O" />
      <Box x={16} y={124} w={120} h={50} title="ISP header" sub="2 × 3" />
      <Box x={16} y={208} w={120} h={46} title="Status LEDs" sub="× 2" />
      <Box x={196} y={24} w={150} h={42} title="16 MHz crystal" />
      <Box x={196} y={100} w={150} h={110} title="ATmega328P" sub="TQFP-32" variant="accent" />

      <Wire d="M136 65 H166 V130 H194" start />
      <Wire d="M136 149 H194" />
      <Label x={166} y={164} anchor="middle">
        program
      </Label>
      <Wire d="M194 190 H166 V231 H138" />
      <path className="dg-wire" d="M271 66 V98" />

      {/* I2C bus */}
      <path className="dg-bus" d="M410 36 V274" />
      <Label x={404} y={290} anchor="middle" variant="accent">
        I²C bus · 4.7 kΩ pull-ups
      </Label>
      <path className="dg-wire" d="M346 155 H410" />
      <Label x={378} y={148}>
        SDA/SCL
      </Label>

      <Box x={450} y={36} w={130} h={56} title="DS1337 RTC" sub="timestamps" />
      <Box x={604} y={28} w={122} h={32} title="32.768 kHz" />
      <Box x={604} y={70} w={122} h={32} title="Backup battery" />
      <Box x={450} y={126} w={130} h={56} title="24LC1025" sub="128 KB EEPROM" />
      <Box x={450} y={210} w={130} h={56} title="24LC1025" sub="128 KB EEPROM" />
      <path className="dg-wire" d="M410 64 H450" />
      <path className="dg-wire" d="M410 154 H450" />
      <path className="dg-wire" d="M410 238 H450" />
      <path className="dg-wire" d="M580 50 H604" />
      <path className="dg-wire" d="M580 78 H592 V86 H604" />
    </Frame>
  )
}

export const DIAGRAMS = {
  polite: PoliteDiagram,
  rv32i: Rv32iDiagram,
  crosslayer: CrossLayerDiagram,
  regdrift: RegdriftDiagram,
  datalogger: DataLoggerDiagram,
}

// ---------------------------------------------------------------- card visuals
// Small, label-light versions for the featured cards on /projects.

export function PeArrayGlyph() {
  const cells = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) cells.push([r, c])
  return (
    <svg className="glyph" viewBox="0 0 220 170" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <path className="glyph-wire" d={`M10 ${30 + r * 34} H58`} />
          {/* skewed activation arrival: each row starts one step later */}
          {Array.from({ length: r + 1 }).map((_, i) => (
            <rect key={i} className="glyph-tick" x={50 - i * 9} y={26 + r * 34} width="5" height="8" />
          ))}
        </g>
      ))}
      {cells.map(([r, c]) => (
        <rect key={`${r}${c}`} className="glyph-cell" x={66 + c * 34} y={16 + r * 34} width="26" height="26" rx="2" />
      ))}
      {[0, 1, 2, 3].map((c) => (
        <path key={c} className="glyph-wire glyph-wire--accent" d={`M${79 + c * 34} 150 V164`} />
      ))}
      <path className="glyph-wire" d="M200 16 V150" />
      <text className="glyph-text" x={206} y={86} transform="rotate(90 206 86)" textAnchor="middle">
        4 × 4 · INT8
      </text>
    </svg>
  )
}

export function DatapathGlyph() {
  const stages = ['PC', 'IMEM', 'DEC', 'RF', 'ALU', 'MEM', 'WB']
  return (
    <svg className="glyph glyph--wide" viewBox="0 0 300 120" aria-hidden="true" focusable="false">
      {stages.map((s, i) => (
        <g key={s}>
          <rect className={s === 'ALU' ? 'glyph-cell glyph-cell--accent' : 'glyph-cell'} x={4 + i * 42} y={40} width="34" height="34" rx="2" />
          <text className="glyph-text" x={21 + i * 42} y={61} textAnchor="middle">
            {s}
          </text>
          {i < stages.length - 1 && <path className="glyph-wire" d={`M${38 + i * 42} 57 H${46 + i * 42}`} />}
        </g>
      ))}
      <path className="glyph-wire glyph-wire--accent" d="M276 74 V96 H21 V74" />
      <path className="glyph-wire" d="M171 40 V22 H277 V40" />
      <text className="glyph-text" x={150} y={112} textAnchor="middle">
        single cycle · CPI 1
      </text>
    </svg>
  )
}
