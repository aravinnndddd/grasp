import { ConceptDetail } from '../../types/curriculum';

export const tcpCongestionControlConcept: ConceptDetail = {
  id: 'tcp-congestion-control',
  title: 'TCP Congestion Control & AIMD Dynamics',
  subjectId: 'cst-303-cn',
  subjectTitle: 'Computer Networks',
  moduleId: 'mod-4-transport',
  moduleTitle: 'Module 4: Transport Layer Protocols',
  difficulty: 'intermediate',
  category: 'networking',
  estimatedMinutes: 28,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: 'transport-layer-basics', title: 'Transport Layer & Port Multiplexing', reason: 'Understand process-to-process delivery' },
    { id: 'tcp-handshake', title: 'TCP 3-Way Handshake & Flow Control', reason: 'Distinguish receiver flow window (rwnd) from network congestion window (cwnd)' }
  ],
  unlocks: [
    { id: 'tcp-bbr', title: 'Modern Bottleneck Bandwidth and RTT (BBR)' },
    { id: 'quic-http3', title: 'QUIC Protocol & UDP Transport' }
  ],
  idea: {
    simpleExplanation: 'Imagine driving onto a multi-lane highway during rush hour with zero traffic police. If every driver slams on the gas pedal at maximum speed, all cars immediately crash into a standstill gridlock. TCP Congestion Control is the self-regulating speed governor: every sender starts very gently, doubles speed while roads are clear, shifts to careful cruise control, and immediately slams on the brakes by 50% the second a car crash (dropped packet) is detected.',
    intuitionSummary: 'Additive Increase, Multiplicative Decrease (AIMD): cautiously probe for spare bandwidth by adding 1 packet per round-trip, but cut throughput in half immediately upon signs of congestion.',
    analogy: {
      title: 'The Water Pipe Pressure Test',
      story: 'A plumber pumps water into an unknown underground pipe system. They slowly increase the water pressure 1 liter/min at a time. The moment a drip of leakage is detected anywhere, they immediately cut the pressure valve by 50%, then resume careful incremental testing.',
      moral: 'Probing is slow and linear; reaction to failure is swift and drastic to prevent catastrophic pipeline burst.'
    }
  },
  whyItExists: {
    historicalProblem: 'In 1986, the early Internet experienced a catastrophic event called "Congestion Collapse": throughput collapsed by a factor of 1,000 (from 32 kbps to 40 bps). When intermediate routers ran out of buffer queue memory, they dropped packets. End hosts, seeing no ACKs, retransmitted those exact same packets, multiplying the congestion and suffocating the entire network.',
    naiveApproachFailed: 'Leaving senders to transmit at the receiver\'s advertised window (rwnd) alone failed because rwnd only measures the destination computer\'s RAM buffer, completely blind to whether the routers in between are on fire.',
    coreInsight: 'Introduce a sender-side variable called Congestion Window (cwnd). The effective window is min(cwnd, rwnd). cwnd is dynamically adjusted using network feedback (ACK arrivals and drop events) without needing any special hardware in routers.'
  },
  formulaExplorer: {
    title: 'The AIMD Window Adjustment Rules',
    tex: 'W(t + RTT) = \\begin{cases} W(t) + 1 & \\text{if no loss (Additive Increase)} \\\\ W(t) \\times 0.5 & \\text{if loss detected (Multiplicative Decrease)} \\end{cases}',
    plain: 'If ACK received: cwnd = cwnd + 1; If Loss: cwnd = cwnd / 2, ssthresh = cwnd',
    explanation: 'Additive Increase probes cautiously for available network bandwidth. Multiplicative Decrease rapidly frees up buffer space inside congested internet routers to restore network stability.',
    variables: [
      {
        symbol: 'cwnd',
        name: 'Congestion Window Size',
        meaning: 'Maximum number of unacknowledged packets the sender is allowed to put on the wire.',
        unit: 'MSS (Maximum Segment Size)',
        effectWhenIncreased: 'Increases instantaneous transmission throughput.'
      },
      {
        symbol: 'ssthresh',
        name: 'Slow Start Threshold',
        meaning: 'The boundary marker where TCP switches from exponential Slow Start to linear Congestion Avoidance.',
        unit: 'MSS',
        effectWhenIncreased: 'Extends aggressive exponential doubling phase.'
      },
      {
        symbol: 'RTT',
        name: 'Round Trip Time',
        meaning: 'Time taken for a data packet to travel to receiver and its ACK to return.',
        unit: 'milliseconds',
        effectWhenIncreased: 'Slows down the rate of window updates.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Retransmission Storm (Congestion Collapse)',
    brokenCondition: 'Disable AIMD multiplicative decrease upon timeout and retransmit immediately at full line rate.',
    symptom: 'Router buffer queues overflow to 100%. Packet drop rate reaches 98%. Goodput (useful data received) plummets to near zero despite 100% link utilization.',
    whyItFailed: 'Retransmitted packets flood already clogged router buffers, displacing both original packets and ACKs in a positive feedback loop of death.',
    preventionRule: 'Always back off exponentially upon timeout (Karn\'s algorithm) and set cwnd = 1 MSS to drain router queues.'
  },
  underTheHood: {
    formalDefinition: 'An end-to-end congestion control algorithm operating at the Transport Layer of the OSI stack, utilizing four intertwined mechanisms: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery (RFC 5681).',
    keyProperties: [
      'Slow Start: cwnd starts at 1 (or 10) MSS; doubles every RTT (cwnd := cwnd + 1 per ACK).',
      'Phase Change: When cwnd >= ssthresh, enters Congestion Avoidance.',
      'Congestion Avoidance: cwnd := cwnd + (1 / cwnd) per ACK (adds ~1 MSS per RTT).',
      'Fast Retransmit: Triggered by 3 duplicate ACKs before timeout timer expires.',
      'Fast Recovery: ssthresh := cwnd / 2; cwnd := ssthresh + 3 (TCP Reno).'
    ],
    timeComplexity: 'Linear convergence to fairness envelope: O(log W) during slow start',
    spaceComplexity: 'O(1) tracking state variables per socket',
    invariants: [
      'Effective Send Window = min(cwnd, rwnd) at all times.'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Phase 1: Slow Start (Exponential Ramp)',
        description: 'Connection established. cwnd = 1 MSS, ssthresh = 16 MSS. 1 packet sent, ACK arrives -> cwnd becomes 2.',
        internalState: { phase: 'Slow Start', cwnd: 2, ssthresh: 16, event: '1 ACK arrived' },
        highlightNote: 'Next RTT sends 2 packets; 2 ACKs arrive; cwnd jumps to 4 MSS.'
      },
      {
        index: 2,
        actionTitle: 'Phase 2: Reaching ssthresh Threshold',
        description: 'cwnd reaches 16 MSS. TCP transitions into Congestion Avoidance.',
        internalState: { phase: 'Congestion Avoidance', cwnd: 16, ssthresh: 16, event: 'Threshold crossed' },
        highlightNote: 'Exponential growth ceases. TCP now grows linearly (+1 MSS per entire RTT).'
      },
      {
        index: 3,
        actionTitle: 'Phase 3: Linear Bandwidth Probing',
        description: 'cwnd slowly increases: 17 -> 18 -> 19 -> 20 MSS over 4 RTTs.',
        internalState: { phase: 'Congestion Avoidance', cwnd: 20, ssthresh: 16, event: 'Linear crawl' },
        highlightNote: 'Conservative probing avoids shocking the network.'
      },
      {
        index: 4,
        actionTitle: 'Phase 4: Packet Drop & Multiplicative Decrease',
        description: 'Router buffer overflows at 20 MSS. 3 Duplicate ACKs received. Reno cuts ssthresh to 10 and continues at 10 MSS without resetting to 1.',
        internalState: { phase: 'Fast Recovery', cwnd: 10, ssthresh: 10, event: '3 Dup ACKs -> Half Window' },
        highlightNote: 'Notice the sawtooth pattern! Halved instantly to relieve queue pressure.'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'A TCP Reno connection is in Congestion Avoidance with cwnd = 24 MSS and ssthresh = 16 MSS. Suddenly, a retransmission timeout (RTO) occurs. What will be the new values of ssthresh and cwnd?',
    contextState: 'State before timeout: cwnd = 24 MSS | ssthresh = 16 MSS | Event: RTO Timeout',
    options: [
      {
        id: 'pred-tcp-1',
        text: 'ssthresh becomes 12 MSS, cwnd resets to 1 MSS',
        isCorrect: true,
        explanation: 'Spot on! On a severe timeout, ssthresh is cut to half of current cwnd (24 / 2 = 12 MSS), and cwnd collapses all the way down to 1 MSS (entering Slow Start).'
      },
      {
        id: 'pred-tcp-2',
        text: 'ssthresh remains 16 MSS, cwnd drops to 12 MSS',
        isCorrect: false,
        explanation: 'Incorrect. Dropping to half (12 MSS) happens on 3 Duplicate ACKs (Fast Retransmit), not on a coarse timeout.'
      },
      {
        id: 'pred-tcp-3',
        text: 'Both ssthresh and cwnd remain unchanged; TCP simply resends the dropped packet.',
        isCorrect: false,
        explanation: 'Dangerous! Doing this would cause Congestion Collapse across the routers.'
      }
    ]
  },
  codePlayground: {
    language: 'javascript',
    starterCode: `// Simulate TCP Reno Congestion Window Updates
function simulateTCP(events) {
  let cwnd = 1;
  let ssthresh = 16;
  const history = [];

  for (const ev of events) {
    if (ev === 'ACK') {
      if (cwnd < ssthresh) {
        // Slow Start: Exponential
        cwnd = cwnd * 2;
      } else {
        // Congestion Avoidance: Additive
        cwnd = cwnd + 1;
      }
    } else if (ev === 'DUP_ACK_3') {
      // Fast Recovery: Multiplicative Decrease
      ssthresh = Math.max(2, Math.floor(cwnd / 2));
      cwnd = ssthresh;
    } else if (ev === 'TIMEOUT') {
      // Coarse Timeout: Collapse
      ssthresh = Math.max(2, Math.floor(cwnd / 2));
      cwnd = 1;
    }
    history.push({ event: ev, cwnd, ssthresh });
  }
  return history;
}

const trace = simulateTCP(['ACK', 'ACK', 'ACK', 'ACK', 'ACK', 'DUP_ACK_3', 'ACK']);
console.log(trace);
`,
    solutionCode: `function simulateTCP(events) {
  let cwnd = 1, ssthresh = 16;
  return events.map(ev => {
    if (ev === 'ACK') cwnd += (cwnd < ssthresh ? 1 : (1 / Math.floor(cwnd)));
    if (ev === 'DUP_ACK_3') { ssthresh = Math.max(2, Math.floor(cwnd/2)); cwnd = ssthresh; }
    if (ev === 'TIMEOUT') { ssthresh = Math.max(2, Math.floor(cwnd/2)); cwnd = 1; }
    return { ev, cwnd: Math.round(cwnd), ssthresh };
  });
}`,
    description: 'Trace cwnd transitions across Slow Start, Congestion Avoidance, and Fast Recovery.',
    expectedBehavior: 'Creates authentic AIMD sawtooth oscillation curve.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'Slow Start means the data transmission is slow.',
      whyWrong: 'Slow Start is actually an aggressive exponential doubling phase (1, 2, 4, 8, 16...)! It is only "slow" compared to blasting packets at full line speed from millisecond zero.',
      truth: 'Slow Start is the fastest-growing phase in the entire TCP lifecycle.',
      consequenceInCodeOrExam: 'Common KTU exam trap: students describe Slow Start as linear and Congestion Avoidance as exponential.'
    },
    {
      wrongBelief: 'Flow Control and Congestion Control are identical mechanisms.',
      whyWrong: 'Flow control protects the destination host from having its socket buffer overwhelmed (managed by rwnd). Congestion control protects the intermediate network routers from having their queues congested (managed by cwnd).',
      truth: 'They operate in tandem: Effective Window = min(cwnd, rwnd).',
      consequenceInCodeOrExam: 'Confusing rwnd with cwnd loses full 5 marks in KTU Part B comparison questions.'
    }
  ],
  comparison: {
    conceptA: 'Flow Control (rwnd)',
    conceptB: 'Congestion Control (cwnd)',
    dimensions: [
      {
        metric: 'What is being protected?',
        valA: 'The receiving computer\'s RAM buffer',
        valB: 'The intermediate network routers & links',
        takeaway: 'Host-level vs Network-level protection.'
      },
      {
        metric: 'Governing Variable',
        valA: 'Receiver Window (rwnd)',
        valB: 'Congestion Window (cwnd)',
        takeaway: 'rwnd is explicitly advertised in TCP header; cwnd is calculated implicitly.'
      },
      {
        metric: 'Feedback Source',
        valA: 'Explicit 16-bit window field in ACK packet',
        valB: 'Packet drops, duplicate ACKs, RTT delays',
        takeaway: 'Congestion must be inferred indirectly by the sender.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 303 (Computer Networks)',
    examDefinition: 'TCP Congestion Control is a distributed algorithmic framework implemented at the transport layer to prevent sender throughput from saturating intermediate router buffers, utilizing Additive Increase Multiplicative Decrease (AIMD), Slow Start, Fast Retransmit, and Fast Recovery.',
    frequentYearQuestions: [
      'KTU Nov 2023: Explain the working of TCP Congestion Control with a neat timing diagram showing AIMD phases. (10 Marks)',
      'KTU June 2024: Differentiate between Fast Retransmit and Fast Recovery in TCP Reno. (5 Marks)',
      'KTU Dec 2022: Why does TCP use Multiplicative Decrease rather than Subtractive Decrease? (3 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'What is the significance of the 3 Duplicate ACKs threshold in TCP?',
        modelAnswer: 'Receipt of 3 duplicate ACKs indicates that a packet was lost, but subsequent packets are still successfully reaching the receiver and generating ACKs. This implies mild network congestion rather than complete path failure, allowing TCP to trigger Fast Retransmit without waiting for the slow retransmission timer (RTO).',
        keyPointsExpected: ['Distinction from timeout', 'Proof packets are still arriving', 'Trigger for Fast Retransmit'],
        commonDeductions: ['Stating that 3 duplicate ACKs mean network is completely dead (-1 mark)']
      },
      {
        marks: 5,
        question: 'Differentiate between Slow Start and Congestion Avoidance phases of TCP with suitable equations and graph.',
        modelAnswer: '1. Slow Start:\n   - Condition: cwnd < ssthresh\n   - Update rule: cwnd := cwnd + 1 MSS per received ACK (Exponential growth: doubles every RTT)\n   - Purpose: Rapidly discover available link capacity.\n2. Congestion Avoidance:\n   - Condition: cwnd >= ssthresh\n   - Update rule: cwnd := cwnd + (1 / cwnd) per received ACK (~1 MSS per RTT)\n   - Purpose: Cautious linear probing to prevent queue saturation.\n3. Graph: Draw cwnd (y-axis) vs RTT (x-axis) showing exponential curve transitioning to linear slope at ssthresh.',
        keyPointsExpected: ['Both equations explicitly written', 'Condition on ssthresh', 'Accurate labeled curve'],
        commonDeductions: ['Describing slow start as linear growth (-1.5 marks)', 'Missing the sawtooth cutoff at ssthresh (-1 mark)'],
        diagramDescription: 'Sawtooth graph showing exponential climb up to ssthresh, linear climb, drop to ssthresh/2 on 3-Dup-ACK.'
      },
      {
        marks: 10,
        question: 'Detailed Essay: Trace the complete lifecycle of a TCP Reno connection with an initial ssthresh of 32 MSS. Assume packet drops occur at cwnd = 40 MSS via 3-Dup-ACK, and later at cwnd = 24 MSS via Timeout. Show calculations.',
        modelAnswer: 'Structured 10-Mark Trace:\n1. Phase 1: Slow Start from cwnd = 1 to 32 MSS (RTT 0 to 5) (2 marks)\n2. Phase 2: Congestion Avoidance from 32 to 40 MSS (RTT 6 to 13) (2 marks)\n3. Event 1 (3-Dup-ACK at 40 MSS):\n   - ssthresh_new = 40 / 2 = 20 MSS\n   - cwnd_new = 20 MSS (Fast Recovery)\n   - Avoids dropping to 1 MSS! (2 marks)\n4. Phase 3: Resume Congestion Avoidance from 20 to 24 MSS (2 marks)\n5. Event 2 (Timeout at 24 MSS):\n   - ssthresh_new = 24 / 2 = 12 MSS\n   - cwnd_new = 1 MSS (Collapses back to Slow Start) (2 marks)\n6. Consolidated diagram depicting both events and window transitions.',
        keyPointsExpected: ['Exact numerical values for ssthresh and cwnd at each event', 'Distinction between Reno response to duplicate ACKs vs Timeout', 'Complete annotated timeline'],
        commonDeductions: ['Resetting to 1 MSS during 3 Duplicate ACKs instead of Timeout (-2 marks)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'tcp-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: 'Which of the following events triggers TCP Fast Retransmit?',
      options: [
        { id: '1a', text: 'Arrival of 1 Duplicate ACK', isCorrect: false },
        { id: '1b', text: 'Expiration of the Retransmission Timeout (RTO) timer', isCorrect: false },
        { id: '1c', text: 'Arrival of 3 Duplicate ACKs', isCorrect: true },
        { id: '1d', text: 'Receiver sending an RST packet', isCorrect: false }
      ],
      correctExplanation: 'TCP Fast Retransmit is triggered specifically upon receiving 3 duplicate ACKs for the same sequence number.'
    },
    {
      id: 'tcp-p2',
      level: 5,
      levelLabel: 'Level 5: Numerical Calculation (KTU Standard)',
      question: 'A TCP connection is currently in Slow Start with cwnd = 8 MSS. If the next 8 ACKs arrive without packet loss, what will be the new value of cwnd?',
      options: [
        { id: '5a', text: '9 MSS', isCorrect: false },
        { id: '5b', text: '12 MSS', isCorrect: false },
        { id: '5c', text: '16 MSS', isCorrect: true },
        { id: '5d', text: '64 MSS', isCorrect: false }
      ],
      correctExplanation: 'In Slow Start, each received ACK increments cwnd by 1 MSS. Receiving 8 ACKs increases cwnd by 8: 8 + 8 = 16 MSS (effectively doubling over one RTT).'
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-tcp-1',
      question: 'What is the formula for the effective send window in TCP?',
      expectedKeywords: ['min', 'cwnd', 'rwnd'],
      idealAnswer: 'Effective Window = min(cwnd, rwnd)'
    },
    {
      id: 'rec-tcp-2',
      question: 'Explain why Additive Increase Multiplicative Decrease (AIMD) converges to stability rather than Additive Increase Additive Decrease (AIAD).',
      expectedKeywords: ['fairness', 'stability', 'multiplicative decrease', 'efficiency'],
      idealAnswer: 'Multiplicative decrease rapidly sheds load proportionally during congestion, driving competing flows toward fair bandwidth sharing along the optimal Chiu-Jain vector line.'
    }
  ],
  masteryCriteria: [
    'Can clearly articulate the difference between rwnd and cwnd',
    'Understands why slow start is exponential despite its name',
    'Has simulated packet drop failure and observed AIMD sawtooth recovery',
    'Can trace ssthresh and cwnd calculations for both 3-Dup-ACK and Timeout scenarios',
    'Can write the full KTU 10-mark transport layer exam essay'
  ]
};
