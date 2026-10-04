import { ConceptDetail } from '../../types/curriculum';

export const microcontroller8051Concept: ConceptDetail = {
  id: 'microcontroller-8051',
  title: '8051 Microcontroller Architecture & Memory Banking',
  subjectId: 'cst-307-mpmc',
  subjectTitle: 'Microprocessors and Microcontrollers',
  moduleId: 'mod-3-8051-arch',
  moduleTitle: 'Module 3: 8051 Hardware Architecture & Memory',
  difficulty: 'intermediate',
  category: 'system_architecture',
  estimatedMinutes: 30,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: '8086-arch', title: '8086 Microprocessor Registers & Bus Structure', reason: 'Understand ALU, Address Bus, Data Bus, and Flags' },
    { id: 'assembly-basics', title: 'Assembly Language & Addressing Modes', reason: 'Understand register, direct, and indirect addressing' }
  ],
  unlocks: [
    { id: '8051-timers-counters', title: '8051 Timers, Counters & Serial Communication' },
    { id: 'embedded-c-interfacing', title: 'LCD, ADC & Stepper Motor Interfacing' }
  ],
  idea: {
    simpleExplanation: "A microprocessor (like Intel 8086) is just a brain with no hands or memory — you must solder external RAM, ROM, and I/O chips onto a motherboard for it to function. A microcontroller (like the 8051) is an entire computer built into a single slice of silicon: it has its own CPU, on-chip RAM, on-chip ROM, timers, serial ports, and 32 I/O pins all inside one 40-pin IC. It is designed to control physical appliances (washing machines, cars, microwave ovens).",
    intuitionSummary: 'Complete system-on-chip with Harvard architecture separating code ROM from data RAM and 4 switchable register banks.',
    analogy: {
      title: 'The Mobile Kitchen vs The Mega Warehouse',
      story: 'A desktop microprocessor is like an industrial cooking stove in an empty warehouse; you have to hire external trucks to bring spices, refrigerators, and water lines. An 8051 microcontroller is like a food truck: compact, fully self-contained with its own stove, pantry, water tank, and serving window.',
      moral: 'For small dedicated control tasks, an integrated microcontroller is cheaper, faster, and consumes vastly less power.'
    }
  },
  whyItExists: {
    historicalProblem: 'In the early 1980s, building embedded controllers for automobiles and industrial machines using multi-chip microprocessor systems required 10+ expensive support chips (RAM, ROM, 8255 PPI, 8253 Timer), creating bulky circuit boards prone to solder joint failures and high power consumption.',
    naiveApproachFailed: 'Using microprocessors required external memory decoders and bus latches (74LS373), generating electromagnetic interference and high manufacturing costs.',
    coreInsight: 'Intel created the 8051: an 8-bit Harvard architecture chip packing 128 bytes of RAM, 4 KB of on-chip ROM, two 16-bit timers, four 8-bit parallel I/O ports (P0-P3), and full-duplex UART onto a single 40-pin dual-inline package.'
  },
  formulaExplorer: {
    title: 'The 8051 Program Status Word (PSW) Register',
    tex: '\\text{PSW: } [CY \\mid AC \\mid F0 \\mid RS1 \\mid RS0 \\mid OV \\mid - \\mid P]',
    plain: 'PSW = [CY, AC, F0, RS1, RS0, OV, -, P]',
    explanation: 'The 8-bit Special Function Register that holds the arithmetic status flags and controls which of the four 8-byte Register Banks (Bank 0-3) is currently active.',
    variables: [
      {
        symbol: 'CY (Bit 7)',
        name: 'Carry Flag',
        meaning: 'Set by hardware if an arithmetic operation generates a carry out of bit 7.',
        effectWhenIncreased: 'Used for multi-byte addition and boolean bit operations.'
      },
      {
        symbol: 'RS1, RS0 (Bits 4,3)',
        name: 'Register Bank Select Bits',
        meaning: 'Determines which RAM bank is mapped to registers R0-R7 (00=Bank 0, 01=Bank 1, 10=Bank 2, 11=Bank 3).',
        effectWhenIncreased: 'Instantly switches the active register workspace in 1 cycle.'
      },
      {
        symbol: 'OV (Bit 2)',
        name: 'Overflow Flag',
        meaning: 'Set when an operation on signed 2\'s complement numbers overflows the -128 to +127 range.',
        effectWhenIncreased: 'Flags arithmetic error in signed operations.'
      },
      {
        symbol: 'P (Bit 0)',
        name: 'Parity Flag',
        meaning: 'Set to 1 if Accumulator A contains an ODD number of 1s; 0 if even parity.',
        effectWhenIncreased: 'Used for serial transmission error detection.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Silent Stack-RAM Collision Disaster',
    brokenCondition: 'Reset initializes Stack Pointer SP = 07H. The user pushes 10 values onto the stack while simultaneously writing variables to Register Bank 1 (08H-0FH).',
    symptom: 'Subroutines return to wild random memory addresses, crashing the microcontroller, or variables in Register Bank 1 are silently corrupted!',
    whyItFailed: 'In 8051, internal RAM addresses 08H-0FH belong to Register Bank 1. Since SP defaults to 07H and grows upwards, the very first PUSH writes to 08H (overwriting register R0 of Bank 1).',
    preventionRule: 'In the initialization section of any 8051 program, always reinitialize the Stack Pointer: MOV SP, #30H (moving the stack safely above the bit-addressable RAM).'
  },
  underTheHood: {
    formalDefinition: 'An 8-bit microcontroller designed by Intel utilizing a Harvard architecture with physically separate address spaces for Program Memory (up to 64KB ROM) and Data Memory (up to 64KB RAM).',
    keyProperties: [
      'Internal RAM: 128 Bytes (00H to 7FH). Split into: 32 bytes for Register Banks (00H-1FH), 16 bytes Bit-Addressable RAM (20H-2FH), and 80 bytes Scratchpad RAM (30H-7FH).',
      'Special Function Registers (SFRs): 128 bytes space (80H to FFH) containing ACC, B, PSW, SP, DPTR, P0-P3, TMOD, TCON, SCON, IE, IP.',
      'I/O Ports: Four 8-bit ports (P0, P1, P2, P3). Port 0 requires external pull-up resistors when used as general I/O.',
      'Buses: 16-bit Address Bus (can access 64KB ROM/RAM) and 8-bit Data Bus.'
    ],
    timeComplexity: 'Machine cycle = 12 oscillator clock cycles (at 12 MHz, 1 machine cycle = 1 microsecond)',
    spaceComplexity: '128 Bytes internal RAM; 4 KB on-chip ROM',
    invariants: [
      'EA (External Access) pin: When tied to VCC, executes from on-chip ROM (0000H-0FFFH). When tied to GND, forces execution entirely from external ROM.'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Step 0: Power-On Reset State',
        description: 'Power applied (RST pin high). Program Counter PC = 0000H, Stack Pointer SP = 07H, Port registers P0-P3 = FFH.',
        internalState: { PC: '0000H', SP: '07H', ACC: '00H', PSW: '00H (Bank 0 active)' },
        highlightNote: 'Default stack starts at 07H, mapping directly on top of Register Bank 1.'
      },
      {
        index: 2,
        actionTitle: 'Step 1: Execute MOV A, #25H',
        description: 'Immediate addressing mode: load hexadecimal literal 25H (00100101b) into Accumulator register A.',
        internalState: { PC: '0002H', ACC: '25H', Parity: 'P=1 (Odd parity: three 1s)' },
        highlightNote: 'Notice Parity bit P in PSW automatically toggles to 1 because 25H has three 1s.'
      },
      {
        index: 3,
        actionTitle: 'Step 2: Execute ADD A, #34H',
        description: 'Add 34H to 25H: 25H + 34H = 59H. No carry generated.',
        internalState: { PC: '0004H', ACC: '59H', CY: '0', AC: '0' },
        highlightNote: 'Accumulator now contains sum 59H.'
      },
      {
        index: 4,
        actionTitle: 'Step 3: Switch to Register Bank 2',
        description: 'Execute SETB PSW.4 (sets RS1=1, RS0=0). Active register bank switches from Bank 0 (00H-07H) to Bank 2 (10H-17H).',
        internalState: { PC: '0006H', PSW: '10H', ActiveBank: 'Bank 2 (10H-17H)' },
        highlightNote: 'Registers R0-R7 now point to physical RAM addresses 10H-17H without touching Bank 0 data!'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'In an 8051 microcontroller, what is the default value of the Stack Pointer (SP) immediately after a hardware reset, and what memory location is written to upon the first PUSH instruction?',
    contextState: 'Hardware Reset triggered | Default SP = ? | First PUSH write location = ?',
    options: [
      {
        id: 'pred-mpmc-1',
        text: 'SP = 00H, first PUSH writes to 00H',
        isCorrect: false,
        explanation: 'Incorrect. SP defaults to 07H, not 00H.'
      },
      {
        id: 'pred-mpmc-2',
        text: 'SP = 07H, first PUSH increments SP to 08H and writes to 08H (Bank 1 R0)',
        isCorrect: true,
        explanation: 'Spot on! The 8051 increments SP BEFORE writing (Pre-increment). Since SP=07H at reset, the first push stores data at address 08H, which overlaps with Register Bank 1.'
      },
      {
        id: 'pred-mpmc-3',
        text: 'SP = 30H, first PUSH writes to 30H',
        isCorrect: false,
        explanation: 'Incorrect. SP=30H is what good programmers manually set it to; hardware reset defaults to 07H.'
      }
    ]
  },
  codePlayground: {
    language: 'python',
    starterCode: `# 8051 RAM & Register Bank Simulator
# Simulates MOV, ADD, and Bank Switching in Python

class Microcontroller8051:
    def __init__(self):
        self.ram = [0] * 128
        self.acc = 0
        self.sp = 0x07
        self.psw = 0x00 # [CY, AC, F0, RS1, RS0, OV, -, P]
        
    def get_active_bank(self):
        rs = (self.psw >> 3) & 0x03
        return rs # 0, 1, 2, or 3
        
    def mov_r0(self, val):
        bank = self.get_active_bank()
        addr = bank * 8 + 0 # R0 address
        self.ram[addr] = val
        print(f"Stored {hex(val)} in R0 (Physical RAM: {hex(addr)})")
        
    def switch_bank(self, bank_num):
        self.psw = (self.psw & ~0x18) | ((bank_num & 0x03) << 3)
        print(f"Switched to Register Bank {bank_num}")

mcu = Microcontroller8051()
mcu.mov_r0(0xAA) # Stores in Bank 0 (addr 0x00)
mcu.switch_bank(2)
mcu.mov_r0(0xBB) # Stores in Bank 2 (addr 0x10)
print(f"Bank 0 R0 still contains: {hex(mcu.ram[0x00])}")
print(f"Bank 2 R0 contains: {hex(mcu.ram[0x10])}")
`,
    solutionCode: `class Microcontroller8051:
    def __init__(self):
        self.ram = [0]*128; self.psw = 0
    def switch_bank(self, b): self.psw = (self.psw & ~0x18) | (b << 3)
    def mov_r(self, r, val): self.ram[((self.psw>>3)&3)*8 + r] = val`,
    description: 'Simulate 8051 Register Banking across Banks 0, 1, 2, and 3.',
    expectedBehavior: 'Shows independent storage across register banks in internal RAM.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'Port 0 can be used directly as an output port without any external components.',
      whyWrong: 'Port 0 has open-drain FET outputs and lacks internal pull-up resistors. When configured as an output, it cannot drive logic HIGH (+5V) unless external 10kΩ pull-up resistor networks are wired to it!',
      truth: 'Ports 1, 2, and 3 have internal pull-ups; Port 0 requires external pull-ups for general I/O.',
      consequenceInCodeOrExam: 'In KTU exams, drawing Port 0 without external pull-ups loses 2 marks on hardware interfacing diagrams.'
    }
  ],
  comparison: {
    conceptA: 'Microprocessor (e.g. Intel 8086)',
    conceptB: 'Microcontroller (e.g. Intel 8051)',
    dimensions: [
      {
        metric: 'On-chip Components',
        valA: 'CPU only (No on-chip RAM, ROM, Timers, or I/O)',
        valB: 'Complete SoC (CPU, RAM, ROM, Timers, UART, 32 I/O pins)',
        takeaway: 'Microprocessor needs peripheral support; microcontroller is standalone.'
      },
      {
        metric: 'Memory Architecture',
        valA: 'Von Neumann (Unified memory for code and data)',
        valB: 'Harvard (Physically separate ROM and RAM address spaces)',
        takeaway: 'Harvard architecture allows simultaneous instruction fetch and data read.'
      },
      {
        metric: 'Primary Application',
        valA: 'General purpose computing (PCs, servers)',
        valB: 'Dedicated embedded control systems (Automotive, appliances)',
        takeaway: 'Low cost and low power consumption for microcontrollers.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 307 (Microprocessors and Microcontrollers)',
    examDefinition: 'The Intel 8051 is an 8-bit Harvard architecture microcontroller featuring 128 bytes of internal RAM, 4 KB on-chip ROM, four 8-bit parallel I/O ports, two 16-bit timers/counters, and an on-chip UART, packaged in a 40-pin DIP.',
    frequentYearQuestions: [
      'KTU Nov 2023: Draw the architectural block diagram of 8051 microcontroller and explain its internal memory organization. (10 Marks)',
      'KTU July 2024: Explain the bit structure of PSW register in 8051. How are register banks selected? (5 Marks)',
      'KTU Dec 2022: Why does Port 0 require external pull-up resistors when used as general purpose I/O? (3 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'What is the function of the EA pin in 8051 microcontroller?',
        modelAnswer: 'The EA (External Access) pin determines the memory source for program execution. When connected to VCC (high), 8051 executes instructions from internal 4KB ROM (0000H-0FFFH). When tied to GND (low), it ignores internal ROM and fetches all instructions from external memory.',
        keyPointsExpected: ['VCC = internal ROM', 'GND = external memory', 'Address range 0000H-0FFFH'],
        commonDeductions: ['Confusing EA with PSEN (-1 mark)']
      },
      {
        marks: 5,
        question: 'Explain the internal RAM organization of 8051 microcontroller with a neat memory map diagram.',
        modelAnswer: 'The 8051 has 128 bytes of internal RAM (00H-7FH) organized into 3 distinct sections:\n1. Register Banks (00H - 1FH, 32 bytes): Four banks (Bank 0, 1, 2, 3), each containing 8 registers (R0-R7). Selected using RS1 and RS0 bits in PSW.\n2. Bit-Addressable RAM (20H - 2FH, 16 bytes): 128 individual bit locations (00H-7FH) addressable with bit instructions like SETB and CLR.\n3. General Purpose Scratchpad RAM (30H - 7FH, 80 bytes): Used for general data storage and default stack operations.\nDiagram: Draw vertical memory block from 00H to 7FH showing the 3 partitioned regions.',
        keyPointsExpected: ['Exact address boundaries for all 3 regions', 'Explanation of Register Banks', 'Explanation of Bit-Addressable space', 'Clear memory diagram'],
        commonDeductions: ['Incorrect address ranges for bit-addressable RAM (-1.5 marks)']
      },
      {
        marks: 10,
        question: 'Detailed Essay: Draw the complete architectural block diagram of 8051 microcontroller. Explain the functions of ALU, Accumulator, B register, Program Status Word, Stack Pointer, and Data Pointer.',
        modelAnswer: 'Structured 10-Mark Answer:\n1. Detailed Architectural Block Diagram (4 marks): Showing CPU, Oscillator, 128B RAM, 4KB ROM, Timer 0 & 1, Bus control, I/O ports P0-P3, Serial Buffer, Interrupt control.\n2. ALU, ACC and B register explanation (2 marks)\n3. Program Status Word (PSW) 8-bit format explanation with RS1/RS0 bank switching (2 marks)\n4. Stack Pointer (SP) pre-increment operation and DPTR 16-bit register function (2 marks).',
        keyPointsExpected: ['Complete labeled diagram', 'All SFRs described accurately', 'PSW bit map'],
        commonDeductions: ['Omitting timer or interrupt blocks from diagram (-2 marks)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'mpmc-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: 'Which register bits in the 8051 Program Status Word (PSW) select the active Register Bank?',
      options: [
        { id: '1a', text: 'CY and AC (Bits 7 and 6)', isCorrect: false },
        { id: '1b', text: 'RS1 and RS0 (Bits 4 and 3)', isCorrect: true },
        { id: '1c', text: 'OV and P (Bits 2 and 0)', isCorrect: false }
      ],
      correctExplanation: 'Bits RS1 (PSW.4) and RS0 (PSW.3) configure the active register bank: 00=Bank 0, 01=Bank 1, 10=Bank 2, 11=Bank 3.'
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-mpmc-1',
      question: 'What is the address range of the bit-addressable RAM in the 8051 microcontroller?',
      expectedKeywords: ['20H to 2FH', '20H', '2FH', '16 bytes'],
      idealAnswer: '20H to 2FH (16 bytes, providing 128 individual addressable bits from 00H to 7FH).'
    }
  ],
  masteryCriteria: [
    'Can draw the 8051 internal RAM memory map with exact hexadecimal ranges',
    'Understands the default reset stack collision with Register Bank 1',
    'Explains why Port 0 requires external pull-up resistors',
    'Traces Register Bank switching using PSW bits RS1 and RS0'
  ]
};
