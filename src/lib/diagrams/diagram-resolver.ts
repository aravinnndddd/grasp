/**
 * Diagram Resolver Engine for Learn Anything
 * Converts technical diagram descriptions into clean, validated Mermaid diagrams or vector SVG schematics.
 */

export interface ResolvedDiagram {
  type: 'mermaid' | 'custom_svg';
  title: string;
  code: string;
  caption: string;
  sourceContext?: string;
}

export function resolveDiagram(description: string, contextTitle: string = ''): ResolvedDiagram {
  const desc = description.toLowerCase();
  const title = contextTitle.toLowerCase();

  // 1. OSI 7-Layer vs TCP/IP 4-Layer Model
  if (desc.includes('osi') && (desc.includes('tcp/ip') || desc.includes('4-layer') || desc.includes('7-layer') || desc.includes('blocks'))) {
    return {
      type: 'mermaid',
      title: 'OSI 7-Layer vs TCP/IP 4-Layer Protocol Model',
      caption: 'Side-by-side architectural mapping showing OSI abstraction layers mapped to the practical TCP/IP suite.',
      code: `graph LR
    subgraph OSI ["OSI 7-Layer Model"]
      O7["7. Application Layer"]
      O6["6. Presentation Layer"]
      O5["5. Session Layer"]
      O4["4. Transport Layer"]
      O3["3. Network Layer"]
      O2["2. Data Link Layer"]
      O1["1. Physical Layer"]
    end

    subgraph TCPIP ["TCP/IP 4-Layer Model"]
      T4["Application Layer (HTTP, DNS, SMTP)"]
      T3["Transport Layer (TCP, UDP)"]
      T2["Internet Layer (IP, ICMP, ARP)"]
      T1["Network Interface (Ethernet, Wi-Fi)"]
    end

    O7 -.-> T4
    O6 -.-> T4
    O5 -.-> T4
    O4 --> T3
    O3 --> T2
    O2 -.-> T1
    O1 -.-> T1

    style OSI fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px
    style TCPIP fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style T4 fill:#FDE68A,stroke:#B45309
    style T3 fill:#BBF7D0,stroke:#15803D
    style T2 fill:#BFDBFE,stroke:#1D4ED8
    style T1 fill:#E2E8F0,stroke:#475569`
    };
  }

  // 2. Selective Repeat / Sliding Window Timeline
  if ((desc.includes('selective repeat') || desc.includes('sliding window') || desc.includes('go-back-n')) && (desc.includes('timeline') || desc.includes('packet flow') || desc.includes('arrows'))) {
    return {
      type: 'mermaid',
      title: 'Selective Repeat Sliding Window Protocol Timing Diagram',
      caption: 'Sender & receiver timelines showing independent timeouts, out-of-order buffering, and selective single-packet retransmission.',
      code: `sequenceDiagram
    autonumber
    actor Sender
    actor Receiver

    Note over Sender,Receiver: Sender Window = [0, 1, 2, 3] (W_S = 4)
    Sender->>Receiver: Packet 0
    Sender->>Receiver: Packet 1 (LOST IN TRANSIT ❌)
    Sender->>Receiver: Packet 2
    Sender->>Receiver: Packet 3

    Receiver-->>Sender: ACK 0 (Deliver Pkt 0)
    Note over Receiver: Pkt 1 Missing! Buffer Pkt 2 & Pkt 3
    Receiver-->>Sender: ACK 2 (Selective Buffer)
    Receiver-->>Sender: ACK 3 (Selective Buffer)

    Note over Sender: Timer for Pkt 1 Expires! ⏰
    Sender->>Receiver: Retransmit Packet 1 ONLY
    Receiver-->>Sender: ACK 1 (Deliver Pkt 1, 2, 3 in Order)
    Note over Sender,Receiver: Window slides to [4, 5, 6, 7] ✅`
    };
  }

  // 3. CRC Polynomial Long Division Matrix
  if (desc.includes('crc') || desc.includes('xor') || desc.includes('polynomial division') || desc.includes('long division')) {
    return {
      type: 'mermaid',
      title: 'CRC Modulo-2 Polynomial Long Division Matrix',
      caption: 'Step-by-step modulo-2 XOR arithmetic showing generator polynomial G(x)=10011 canceling dividend to produce remainder 1110.',
      code: `graph TD
    A["Dividend: Data (1101011011) + 4 Zeros (0000)<br/><b>11010110110000</b>"] --> B["Divide by Generator G(x) = <b>10011</b> (x⁴+x+1)"]
    B --> C["Step 1: 11010 XOR 10011 = <b>01001</b> (bring down 1)"]
    C --> D["Step 2: 10011 XOR 10011 = <b>00000</b> (bring down 101)"]
    D --> E["Step 3: Sequential XOR cancellations along data bits..."]
    E --> F["Final Remainder (Frame Check Sequence): <b>1110</b>"]
    F --> G["Transmitted Codeword: Data + Remainder<br/><b>11010110111110</b>"]

    style A fill:#F1F5F9,stroke:#64748B
    style B fill:#EFF6FF,stroke:#3B82F6
    style F fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style G fill:#DCFCE7,stroke:#16A34A,stroke-width:2px`
    };
  }

  // 4. CSMA/CD with Binary Exponential Backoff Flowchart
  if (desc.includes('csma') || desc.includes('backoff') || desc.includes('jam signal') || (desc.includes('collision') && desc.includes('flowchart'))) {
    return {
      type: 'mermaid',
      title: 'IEEE 802.3 CSMA/CD Protocol & Binary Exponential Backoff',
      caption: 'Algorithmic state machine of carrier sensing, collision detection, jam broadcasting, and exponential backoff retry counter.',
      code: `flowchart TD
    Start([Frame Ready to Transmit]) --> Sense{Channel Idle?}
    Sense -- No --> Wait[Wait per persistence strategy]
    Wait --> Sense
    Sense -- Yes --> Transmit[Transmit Frame Bit-by-Bit]
    Transmit --> CollCheck{Collision Detected?}
    CollCheck -- No --> Sent([Frame Transmitted Successfully])
    CollCheck -- Yes --> Jam[Broadcast 32-48 bit Jam Signal]
    Jam --> Inc[Increment Attempt Counter: k = k + 1]
    Inc --> CheckK{k > 16?}
    CheckK -- Yes --> Abort([Abort: Transmission Error Report])
    CheckK -- No --> Range["Compute Backoff Window: R = [0, 2^min(k,10) - 1]"]
    Range --> Delay["Wait Backoff Delay = R * 51.2 μs"]
    Delay --> Sense

    style Start fill:#DCFCE7,stroke:#16A34A
    style Sent fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
    style Abort fill:#FEE2E2,stroke:#DC2626,stroke-width:2px
    style CollCheck fill:#FEF3C7,stroke:#D97706
    style Jam fill:#FEE2E2,stroke:#DC2626`
    };
  }

  // 5. RTS/CTS Handshake & Hidden/Exposed Terminal
  if (desc.includes('rts') || desc.includes('cts') || desc.includes('hidden terminal') || desc.includes('exposed terminal')) {
    return {
      type: 'mermaid',
      title: 'IEEE 802.11 RTS/CTS 4-Way Handshake & NAV Collision Avoidance',
      caption: 'Solving Hidden Terminal collisions: Station A reserves channel with RTS; Station B replies with CTS informing Station C via NAV timer.',
      code: `sequenceDiagram
    autonumber
    actor A as Station A (Sender)
    actor B as Station B (Access Point)
    actor C as Station C (Hidden Node)

    Note over A,C: Node A and Node C cannot hear each other!
    A->>B: 1. Request to Send (RTS)
    Note over A: RTS contains duration reservation
    B-->>A: 2. Clear to Send (CTS)
    B-->>C: 2. CTS Broadcast received by C!
    Note over C: Station C sets NAV (Network Allocation Vector)<br/>C remains silent for entire transmission duration 🔇
    A->>B: 3. DATA Frame Transmitted Safely
    B-->>A: 4. Acknowledgment (ACK)
    Note over A,C: Transmission Complete without Collision! ✅`
    };
  }

  // 6. Switch Backward Learning & Forwarding Table
  if (desc.includes('switch') && (desc.includes('forwarding table') || desc.includes('backward learning') || desc.includes('port mappings'))) {
    return {
      type: 'mermaid',
      title: 'Layer-2 Ethernet Switch Self-Learning (Backward Learning)',
      caption: 'Switch inspects Source MAC on arrival to populate lookup table; selectively forwards, filters, or floods based on Destination MAC.',
      code: `graph TD
    subgraph SWITCH ["Layer-2 Ethernet Switch (MAC Forwarding Table)"]
      Table["<b>Switch Table</b><br/>Port 1: Host A (00:1A..)<br/>Port 2: Host B (00:2B..)<br/>Port 3: Host C (00:3C..)<br/>Port 4: Host D (Unknown)"]
    end

    A["Host A (Port 1)"] <--> Table
    B["Host B (Port 2)"] <--> Table
    C["Host C (Port 3)"] <--> Table
    D["Host D (Port 4)"] <--> Table

    classDef host fill:#F1F5F9,stroke:#475569,stroke-width:1.5px
    classDef sw fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    class A,B,C,D host
    class Table sw`
    };
  }

  // 7. IPv4 vs IPv6 Header Format
  if (desc.includes('ipv4') && desc.includes('ipv6') && (desc.includes('header') || desc.includes('format'))) {
    return {
      type: 'mermaid',
      title: 'IPv4 Variable Header (20-60B) vs IPv6 Fixed Header (40B)',
      caption: 'IPv6 streamlines routing by removing checksum and fragmentation, fixing header size at 40 bytes with 128-bit addresses.',
      code: `graph TD
    subgraph IPv4 ["IPv4 Datagram Header (20-60 Bytes, Variable)"]
      v4_1["Ver (4b) | IHL (4b) | Type of Service (8b) | Total Length (16b)"]
      v4_2["Identification (16b) | Flags: DF, MF (3b) | Fragment Offset (13b)"]
      v4_3["Time to Live (TTL 8b) | Protocol (8b) | Header Checksum (16b)"]
      v4_4["Source IP Address (32 bits / 4 bytes)"]
      v4_5["Destination IP Address (32 bits / 4 bytes)"]
      v4_6["Options + Padding (0 - 40 bytes)"]
    end

    subgraph IPv6 ["IPv6 Datagram Header (Fixed 40 Bytes, Streamlined)"]
      v6_1["Version (4b) | Traffic Class (8b) | Flow Label (20 bits)"]
      v6_2["Payload Length (16b) | Next Header (8b) | Hop Limit (8b)"]
      v6_3["Source IP Address (128 bits / 16 bytes)"]
      v6_4["Destination IP Address (128 bits / 16 bytes)"]
      v6_5["Next Header extension daisy chain (replaces options)"]
    end

    style IPv4 fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px
    style IPv6 fill:#ECFDF5,stroke:#10B981,stroke-width:2px`
    };
  }

  // 8. NAT (Network Address Translation) Architecture
  if (desc.includes('nat') || desc.includes('network address translation') || desc.includes('pat')) {
    return {
      type: 'mermaid',
      title: 'NAT Router Architecture with Port Address Translation (PAT)',
      caption: 'Multiple internal private IPs share a single public IP via 16-bit port translation table mappings.',
      code: `graph LR
    subgraph LAN ["Private Home / Office LAN (192.168.1.0/24)"]
      H1["Host 1: 192.168.1.10:4500"]
      H2["Host 2: 192.168.1.20:5200"]
    end

    subgraph NAT_ROUTER ["Border NAT Gateway Router"]
      NAT["<b>NAT Translation Table</b><br/>192.168.1.10:4500 &lt;--&gt; 203.0.113.5:50001<br/>192.168.1.20:5200 &lt;--&gt; 203.0.113.5:50002"]
    end

    subgraph WAN ["Public Internet"]
      S1["Web Server: 142.250.190.46:80"]
    end

    H1 -->|Outbound src: 192.168.1.10:4500| NAT
    H2 -->|Outbound src: 192.168.1.20:5200| NAT
    NAT -->|Rewritten src: 203.0.113.5:50001| S1
    S1 -->|Inbound dst: 203.0.113.5:50001| NAT
    NAT -->|Restored dst: 192.168.1.10:4500| H1

    style LAN fill:#EFF6FF,stroke:#3B82F6
    style NAT_ROUTER fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style WAN fill:#F1F5F9,stroke:#64748B`
    };
  }

  // 9. Distance Vector vs Link State Routing
  if (desc.includes('distance vector') || desc.includes('link state') || desc.includes('dijkstra') || desc.includes('bellman-ford') || desc.includes('lsa flooding')) {
    return {
      type: 'mermaid',
      title: 'Link-State (Global LSA Flooding) vs Distance-Vector (Neighbor Hearsay)',
      caption: 'Link-State floods local link costs globally for independent Dijkstra execution; Distance-Vector iteratively exchanges full routing tables with direct neighbors only.',
      code: `graph TD
    subgraph LS ["Link-State Protocol (OSPF / Dijkstra)"]
      R1["Router A"] --- R2["Router B"]
      R2 --- R3["Router C"]
      R3 --- R1
      R1 -.->|"Global LSA Flooding<br/>(Full Topology Map)"| R2
      R2 -.->|"Global LSA Flooding"| R3
    end

    subgraph DV ["Distance-Vector Protocol (RIP / Bellman-Ford)"]
      D1["Router A"] <==>|"Periodic Vector Exchange<br/>(Neighbors ONLY)"| D2["Router B"]
      D2 <==>|"Periodic Vector Exchange<br/>(Neighbors ONLY)"| D3["Router C"]
    end

    style LS fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px
    style DV fill:#FEF3C7,stroke:#D97706,stroke-width:2px`
    };
  }

  // 10. TCP Segment Header
  if (desc.includes('tcp header') || desc.includes('tcp segment') || (desc.includes('tcp') && desc.includes('fields'))) {
    return {
      type: 'mermaid',
      title: 'TCP Segment Header Format (20-60 Bytes)',
      caption: 'Detailed layout of the 32-bit wide TCP header including 16-bit ports, 32-bit sequence/ACK numbers, and 6 control flags.',
      code: `graph TD
    subgraph TCP_HDR ["32-Bit Wide TCP Segment Header"]
      R1["Source Port (16 bits) | Destination Port (16 bits)"]
      R2["Sequence Number (32 bits) - Byte stream offset"]
      R3["Acknowledgment Number (32 bits) - Next expected byte"]
      R4["Data Offset (4b) | Reserved (6b) | Flags: URG, ACK, PSH, RST, SYN, FIN (6b) | Window Size (16b rwnd)"]
      R5["Checksum (16 bits) | Urgent Pointer (16 bits)"]
      R6["Options and Padding (0 - 40 bytes)"]
    end

    style TCP_HDR fill:#F8FAFC,stroke:#0F172A,stroke-width:2px
    style R2 fill:#EFF6FF,stroke:#3B82F6
    style R3 fill:#ECFDF5,stroke:#10B981
    style R4 fill:#FEF3C7,stroke:#D97706`
    };
  }

  // 11. TCP Reno Sawtooth Congestion Control
  if (desc.includes('sawtooth') || desc.includes('congestion control') || desc.includes('slow start') || desc.includes('aimd') || desc.includes('fast retransmit')) {
    return {
      type: 'mermaid',
      title: 'TCP Reno Congestion Control Sawtooth Curve Dynamics',
      caption: 'Progression through exponential Slow Start, linear Congestion Avoidance (AIMD), Fast Retransmit (halved to ssthresh), and Timeout collapse to 1 MSS.',
      code: `stateDiagram-v2
    [*] --> SlowStart: Connection Established (cwnd = 1 MSS)
    SlowStart --> SlowStart: cwnd = cwnd * 2 per RTT (Exponential)
    SlowStart --> CongestionAvoidance: cwnd >= ssthresh
    CongestionAvoidance --> CongestionAvoidance: cwnd = cwnd + 1 MSS per RTT (Linear AIMD)
    CongestionAvoidance --> FastRecovery: 3 Duplicate ACKs (Mild Loss)
    FastRecovery --> CongestionAvoidance: cwnd = ssthresh = cwnd / 2
    CongestionAvoidance --> SlowStart: Retransmission Timeout (Severe Loss)<br/>ssthresh = cwnd/2, cwnd = 1 MSS
    SlowStart --> SlowStart: Retransmission Timeout (cwnd = 1 MSS)`
    };
  }

  // 12. HTTP/1.1 vs HTTP/2 vs HTTP/3
  if (desc.includes('http/1') || desc.includes('http/2') || desc.includes('http/3') || desc.includes('multiplexed streams')) {
    return {
      type: 'mermaid',
      title: 'Evolution: HTTP/1.1 Pipelining vs HTTP/2 Multiplexing vs HTTP/3 QUIC',
      caption: 'HTTP/1.1 suffers from Head-of-Line blocking; HTTP/2 interleaves binary frames over a single TCP stream; HTTP/3 uses UDP/QUIC to eliminate transport-layer HOL blocking.',
      code: `graph LR
    subgraph H1 ["HTTP/1.1: Sequential / Multiple TCP"]
      H1_A["Req 1 -> [Wait] -> Resp 1"]
      H1_B["Req 2 -> [Blocked if Req 1 Stalls (HOL Blocking)]"]
    end

    subgraph H2 ["HTTP/2: Multiplexed Binary Streams (1 TCP)"]
      H2_A["Stream 1 Frame A | Stream 2 Frame A | Stream 1 Frame B"]
      H2_B["Single TCP Socket (TCP Packet Loss still stalls all streams)"]
    end

    subgraph H3 ["HTTP/3: Multiplexed Streams over QUIC/UDP"]
      H3_A["Independent QUIC Stream 1 (Lost packet only stalls Stream 1)"]
      H3_B["Independent QUIC Stream 2 (Continues flowing immediately!)"]
    end

    style H1 fill:#FEE2E2,stroke:#DC2626
    style H2 fill:#FEF3C7,stroke:#D97706
    style H3 fill:#DCFCE7,stroke:#16A34A,stroke-width:2px`
    };
  }

  // 13. Dynamic Programming Table (LCS / Knapsack / Edit Distance)
  if (desc.includes('dp table') || desc.includes('grid') || desc.includes('backtracking') || desc.includes('knapsack') || desc.includes('lcs')) {
    return {
      type: 'mermaid',
      title: 'Dynamic Programming Matrix with Optimal Backtracking Path',
      caption: '2D memoization grid computing subproblems with diagonal (match) and directional pointer arrows to reconstruct optimal solution.',
      code: `graph TD
    subgraph DP ["Dynamic Programming State Matrix M[i, j]"]
      C00["(0,0): 0"] --> C01["(0,1): 0"]
      C01 --> C02["(0,2): 0"]
      C10["(1,0): 0"] --> C11["(1,1): 1 ↖ Match"]
      C11 --> C12["(1,2): 1 ← Max"]
      C20["(2,0): 0"] --> C21["(2,1): 1 ↑ Max"]
      C21 --> C22["(2,2): 2 ↖ Match (Optimal)"]
    end

    C22 ==>|Backtrack Diagonal| C11
    C11 ==>|Backtrack Diagonal| C00

    style C22 fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
    style C11 fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
    style C00 fill:#FEF3C7,stroke:#D97706`
    };
  }

  // 14. Binary Tree / Huffman Tree / Parsing Tree
  if (desc.includes('tree') || desc.includes('huffman') || desc.includes('parse tree') || desc.includes('syntactic')) {
    return {
      type: 'mermaid',
      title: 'Hierarchical Syntactic / Huffman Code Tree',
      caption: 'Hierarchical tree decomposition showing root node branching into interior evaluation nodes and terminal leaf symbols.',
      code: `graph TD
    Root["Root Node (Weight 100)"] --> L1["Interior Node 0 (Weight 45)"]
    Root --> R1["Interior Node 1 (Weight 55)"]
    L1 --> LeafA["Leaf 'E': 00 (Weight 25)"]
    L1 --> LeafB["Leaf 'A': 01 (Weight 20)"]
    R1 --> LeafC["Leaf 'T': 10 (Weight 30)"]
    R1 --> LeafD["Leaf 'O': 11 (Weight 25)"]

    style Root fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style LeafA fill:#DCFCE7,stroke:#16A34A
    style LeafB fill:#DCFCE7,stroke:#16A34A
    style LeafC fill:#DCFCE7,stroke:#16A34A
    style LeafD fill:#DCFCE7,stroke:#16A34A`
    };
  }

  // 15. Software Engineering: Spiral Model 4 Quadrants
  if (desc.includes('spiral') || desc.includes('quadrant') || (desc.includes('software') && desc.includes('risk'))) {
    return {
      type: 'mermaid',
      title: 'Boehm Spiral Life Cycle Model (4 Risk-Driven Quadrants)',
      caption: 'Iterative risk-driven lifecycle expanding radially through Objective Formulation, Risk Analysis & Prototyping, Engineering, and Planning.',
      code: `graph TD
    subgraph Q1 ["Quadrant 1: Determine Objectives & Constraints"]
      O1["Requirements Gathering & Operational Goals"]
    end

    subgraph Q2 ["Quadrant 2: Risk Analysis & Prototyping"]
      O2["Identify Technical Risks & Build Proof-of-Concept Prototypes"]
    end

    subgraph Q3 ["Quadrant 3: Engineering & Verification"]
      O3["Detailed Design, Code Implementation & System Testing"]
    end

    subgraph Q4 ["Quadrant 4: Review & Next Phase Planning"]
      O4["Customer Evaluation & Milestone Approval"]
    end

    Q1 --> Q2
    Q2 --> Q3
    Q3 --> Q4
    Q4 -->|"Radial Expansion to Next Spiral Iteration"| Q1

    style Q1 fill:#EFF6FF,stroke:#3B82F6
    style Q2 fill:#FEE2E2,stroke:#DC2626,stroke-width:2px
    style Q3 fill:#FEF3C7,stroke:#D97706
    style Q4 fill:#DCFCE7,stroke:#16A34A`
    };
  }

  // 16. State Machine / Automata / FSM
  if (desc.includes('state') || desc.includes('dfa') || desc.includes('nfa') || desc.includes('automata') || desc.includes('transition')) {
    return {
      type: 'mermaid',
      title: 'Deterministic Finite Automaton / State Machine',
      caption: 'Formal state transition diagram showing start state, transition conditions, and terminal accepting state.',
      code: `stateDiagram-v2
    [*] --> q0: Start
    q0 --> q1: Input 0
    q0 --> q0: Input 1
    q1 --> q0: Input 1
    q1 --> q2: Input 0
    q2 --> q2: Input 0, 1
    q2 --> [*]: Accept State (Pattern '00' Detected) ✅`
    };
  }

  // 17. Microprocessor / 8051 Memory Map
  if (desc.includes('8051') || desc.includes('memory layout') || desc.includes('ram') || desc.includes('register')) {
    return {
      type: 'mermaid',
      title: '8051 Microcontroller Internal RAM Memory Organization (128 Bytes)',
      caption: 'Physical segmentation showing Register Banks (00H-1FH), Bit-Addressable RAM (20H-2FH), General Scratchpad RAM (30H-7FH), and Special Function Registers (80H-FFH).',
      code: `graph TD
    subgraph RAM ["8051 Internal RAM Map (00H - FFH)"]
      SFR["80H - FFH: Special Function Registers (P0, P1, PSW, ACC, B, SP, SBUF)"]
      Scratch["30H - 7FH: General Purpose Scratchpad RAM (80 Bytes)"]
      BitRAM["20H - 2FH: Bit-Addressable RAM (128 Addressable Bits 00H-7FH)"]
      Bank3["18H - 1FH: Register Bank 3 (R0 - R7)"]
      Bank2["10H - 17H: Register Bank 2 (R0 - R7)"]
      Bank1["08H - 0FH: Register Bank 1 (R0 - R7)"]
      Bank0["00H - 07H: Register Bank 0 (R0 - R7, Default upon RESET)"]
    end

    style SFR fill:#FEE2E2,stroke:#DC2626
    style Scratch fill:#EFF6FF,stroke:#3B82F6
    style BitRAM fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style Bank0 fill:#DCFCE7,stroke:#16A34A`
    };
  }

  // Generic Smart Fallback: generate a clean, responsive Mermaid Flowchart from the description
  const cleanTitle = contextTitle || 'Technical Architecture Diagram';
  return {
    type: 'mermaid',
    title: cleanTitle,
    caption: description,
    code: `graph TD
    Start["<b>[Step 1: Input / Initiation]</b><br/>${description.slice(0, 50)}..."] --> Process["<b>[Step 2: Processing & Core Transformation]</b><br/>Operational Logic & State Handling"]
    Process --> Branch{"<b>[Decision / Validation Check]</b>"}
    Branch -- Success / Valid --> Output["<b>[Step 3: Verified Output / Delivery]</b><br/>Consistent State Achieved ✅"]
    Branch -- Failure / Collision --> Feedback["<b>[Error Correction / Backoff Retry]</b><br/>Retransmit or Compensate ⚠️"]
    Feedback --> Process

    style Start fill:#EFF6FF,stroke:#3B82F6
    style Process fill:#FEF3C7,stroke:#D97706
    style Branch fill:#F1F5F9,stroke:#475569
    style Output fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
    style Feedback fill:#FEE2E2,stroke:#DC2626`
  };
}
