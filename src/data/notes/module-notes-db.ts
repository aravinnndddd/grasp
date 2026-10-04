export interface ModuleNoteItem {
  moduleNum: number;
  title: string;
  syllabusTopics: string[];
  conceptualWalkthrough: string[];
  examDefinitions: string[];
  questions3Mark: Array<{ question: string; answer: string }>;
  questions5Mark: Array<{ question: string; answer: string; diagramDescription?: string }>;
  questions8Mark: Array<{ question: string; answer: string; diagramDescription?: string }>;
}

export interface SubjectNotes {
  subjectCode: string;
  subjectTitle: string;
  references: string[];
  modules: Record<number, ModuleNoteItem>;
}

export const moduleNotesDatabase: Record<string, SubjectNotes> = {
  "pccst501": {
    "subjectCode": "PCCST501",
    "subjectTitle": "Computer Networks",
    "references": [
      "Behrouz A. Forouzan, Data Communications and Networking, McGraw-Hill, 5th Edition, 2013",
      "Andrew S. Tanenbaum, David J. Wetherall, Computer Networks, Pearson, 5th Edition, 2013",
      "James F. Kurose, Keith W. Ross, Computer Networking: A Top-Down Approach, Pearson, 7th/8th Edition",
      "Vasanth Vanan, Computer Networking: A Top-Down Approach Notes (UMD ENPM694), GitHub: https://github.com/VasanthVanan/computer-networking-top-down-approach-notes"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction to Networking & Physical/Data Link Basics",
        "syllabusTopics": [
          "Overview of network types: LAN, WAN, MAN, PAN",
          "Network topologies (Mesh, Star, Bus, Ring)",
          "Switching: Circuit, Message, Packet Switching (Datagram vs Virtual Circuit)",
          "Reference models: OSI 7-layer architecture vs TCP/IP 4-layer model",
          "Physical layer: Transmission media (guided vs unguided), signal encoding, multiplexing (FDM, TDM, WDM)",
          "Data Link Layer: Framing (character count, byte stuffing, bit stuffing), Error detection (CRC, Checksum, Hamming code)",
          "Flow control: Stop-and-Wait ARQ, Sliding Window protocols (Go-Back-N, Selective Repeat)"
        ],
        "conceptualWalkthrough": [
          "**The Purpose of Layering:** Networks must connect heterogeneous hardware across the globe. By separating concerns into distinct abstraction layers (OSI model), the physical transmission of electromagnetic waves is decoupled from application software like HTTP browsers.",
          "**Packet Switching vs Circuit Switching:** Circuit switching reserves dedicated physical copper wires for the entire call duration (guaranteed bandwidth, but massive waste during silence). Packet switching breaks data into packets and shares statistical link capacity; packets take dynamic routes and queues absorb bursty internet traffic.",
          "**Framing and Bit Stuffing:** How does a receiver tell where one frame begins and ends? If a flag sequence `01111110` (0x7E) appears inside the user's data payload, the receiver would prematurely terminate the frame! Bit stuffing solves this: whenever the sender encounters five consecutive '1's in the data, it automatically inserts a '0'. The receiver strips that '0' on receipt.",
          "**Error Detection Mechanics (CRC):** Modulo-2 polynomial division. The sender appends remainder bits to the message such that the transmitted frame is exactly divisible by the agreed generator polynomial G(x). Any single-bit, double-bit, or odd-numbered bit burst flips produce a non-zero remainder, instantly flagging corruption.",
          "**Sliding Window Mechanics:** Stop-and-Wait has abysmal link utilization when propagation delay is high (satellite links). Sliding window protocols allow the sender to keep pipes full by transmitting up to W packets before halting for an ACK. Go-Back-N retransmits all packets starting from the lost one; Selective Repeat uses receiver buffers to retransmit solely the dropped packet."
        ],
        "examDefinitions": [
          "**Computer Network:** An interconnected collection of autonomous computers capable of exchanging data and sharing resources through telecommunication links and protocols.",
          "**Protocol:** A formal set of rules and conventions governing the format, timing, sequencing, and error control of data transmission between communicating entities.",
          "**Framing:** The data link layer service of encapsulating raw bit streams from the physical layer into discrete identifiable blocks of data called frames with delimiting boundaries.",
          "**Cyclic Redundancy Check (CRC):** An error-detecting polynomial code based on binary division where redundant check bits (FCS) are appended to a frame so that the polynomial representation of the frame is divisible by a predetermined generator polynomial."
        ],
        "questions3Mark": [
          {
            "question": "Differentiate between Circuit Switching and Packet Switching.",
            "answer": "1. **Circuit Switching:** Establishes a dedicated, continuous physical path prior to communication; bandwidth is reserved and fixed; no packet reordering; low efficiency for bursty data.\n2. **Packet Switching:** Messages are divided into independent packets; packets share links dynamically without pre-reservation; high link utilization; requires packet buffering and reassembly."
          },
          {
            "question": "Explain bit stuffing with an example.",
            "answer": "Bit stuffing prevents flag pattern `01111110` from appearing inside data. The sender injects a '0' after every five consecutive '1's. Receiver detects five consecutive '1's followed by '0' and deletes the '0'. Example: Data `01111110` becomes stuffed as `011111010` on transmission."
          },
          {
            "question": "What is the maximum window size in Go-Back-N ARQ with m-bit sequence numbers?",
            "answer": "The maximum sender window size in Go-Back-N ARQ is 2^m - 1. If window size were 2^m, the receiver cannot distinguish between an ACK acknowledging a new sequence versus a retransmitted duplicate window when an entire window of ACKs is lost."
          }
        ],
        "questions5Mark": [
          {
            "question": "Compare the 7-layer OSI reference model with the 4-layer TCP/IP model with an architectural diagram.",
            "answer": "1. **OSI Layers:** Application, Presentation, Session, Transport, Network, Data Link, Physical.\n2. **TCP/IP Layers:** Application (merges OSI 5, 6, 7), Transport (TCP/UDP), Internet (IP/ICMP), Network Interface (Data Link + Physical).\n3. **Differences:** OSI strictly separates services, interfaces, and protocols; TCP/IP was protocol-driven first. OSI supports both connectionless and connection-oriented at network layer; TCP/IP supports only connectionless at IP layer.\n4. **Diagram:** Draw two vertical stacks showing exact 1-to-1 and 3-to-1 layer mappings.",
            "diagramDescription": "Side-by-side vertical blocks showing OSI (7 layers) mapped to TCP/IP (4 layers)."
          },
          {
            "question": "Given data bit sequence 1101011011 and generator polynomial G(x) = x^4 + x + 1, calculate the CRC code word to be transmitted.",
            "answer": "1. Generator polynomial G(x) = x^4 + 0x^3 + 0x^2 + x^1 + 1 = `10011` (degree r = 4).\n2. Append r=4 zeros to data: `1101011011 0000`.\n3. Perform Modulo-2 binary division of `11010110110000` by `10011` using XOR.\n4. Remainder obtained = `1110`.\n5. Transmitted codeword = Data + Remainder = `11010110111110`.\n6. Verification: Dividing transmitted codeword by `10011` yields remainder 0000.",
            "diagramDescription": "Step-by-step long XOR division matrix showing line-by-line cancellation."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the working of Selective Repeat Sliding Window Protocol with a neat timing diagram. Derive its maximum sender and receiver window sizes and channel utilization.",
            "answer": "1. **Core Concept:** Unlike Go-Back-N, the receiver in Selective Repeat has a buffer of size W_R. It accepts and buffers out-of-order packets that fall within the receiver window, acknowledging each with a specific ACK. The sender only retransmits packets whose specific retransmission timer expired (2.5 marks).\n2. **Window Size Constraint:** W_S + W_R <= 2^m. For symmetric windows, W_S = W_R = 2^(m-1). If W_S + W_R > 2^m, overlapping sequence numbers cause new packets to be accepted as duplicate old packets (2.5 marks).\n3. **Timing Sequence:** Draw sender timeline transmitting packets 0, 1, 2, 3. Assume packet 1 is lost. Receiver receives 0 (delivers), receives 2 (buffers), receives 3 (buffers). ACK 0, ACK 2, ACK 3 arrive at sender. Sender's timer for packet 1 times out. Sender retransmits ONLY packet 1. Upon arrival, receiver delivers 1, 2, 3 in order (2 marks).\n4. **Efficiency Formulation:** Utilization U = (W_S) / (1 + 2a), where a = Propagation Delay / Transmission Delay = T_prop / T_tx (1 mark).",
            "diagramDescription": "Two parallel vertical timelines (Sender and Receiver) with angled arrows showing packet flow, ACK arrivals, packet drop, timeout, and selective single-packet retransmission."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Data Link and Medium Access Control (MAC)",
        "syllabusTopics": [
          "MAC protocols: Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD, CSMA/CA",
          "Ethernet standards: IEEE 802.3, Fast Ethernet, Gigabit Ethernet",
          "Wireless LANs: IEEE 802.11 architecture, CSMA/CA with RTS/CTS, hidden and exposed terminal problems",
          "Bridging and Switching: Store-and-forward, Cut-through, Bridging table learning, Spanning Tree Protocol (STP)",
          "Virtual LANs (VLANs): IEEE 802.1Q tagging, broadcast domains"
        ],
        "conceptualWalkthrough": [
          "**The Shared Medium Problem:** When multiple nodes share a single radio channel or coaxial cable, simultaneous transmissions collide, turning signals into garbled electromagnetic noise. MAC protocols coordinate access without central arbiters.",
          "**Evolution from ALOHA to CSMA/CD:** Pure ALOHA transmits whenever ready (throughput ceiling only 18.4%). Slotted ALOHA forces alignment to discrete time slots (throughput doubles to 36.8%). CSMA 'listens before talking' (Carrier Sense). CSMA/CD goes further: it 'listens while talking' and aborts transmission immediately upon collision, conserving channel airtime.",
          "**Why CSMA/CD Fails in Wireless:** In Wi-Fi, radio antennas transmit at high power (+20 dBm) while receiving signals are attenuated to -80 dBm; a transmitting radio completely blinds its own receiver, making local collision detection impossible. Hence, Wi-Fi uses CSMA/CA (Collision Avoidance) using interframe spaces (DIFS/SIFS), random backoff, and optional RTS/CTS handshakes.",
          "**Hidden and Exposed Terminals:** Node A can reach Node B, and Node C can reach Node B, but A and C cannot hear each other. If both transmit to B simultaneously, a hidden terminal collision occurs. RTS (Request to Send) and CTS (Clear to Send) reserve the floor around the receiver to eliminate this problem.",
          "**Switches vs Hubs:** A hub is an electrical repeater (1 collision domain, 1 broadcast domain). A switch is an intelligent layer-2 bridge that learns MAC addresses on ports (each port is its own collision domain). VLANs partition switches logically into separate broadcast domains."
        ],
        "examDefinitions": [
          "**Medium Access Control (MAC):** A sublayer of the Data Link Layer responsible for coordinating access to a shared broadcast channel among multiple competing stations.",
          "**Carrier Sense Multiple Access with Collision Detection (CSMA/CD):** A protocol where stations listen before transmitting, continue to monitor the medium during transmission, and upon detecting a collision, abort transmission and emit a 32-bit jam signal.",
          "**Hidden Terminal Problem:** A situation in wireless networks where a transmitting station is invisible to other stations due to physical distance or obstacles, causing simultaneous transmissions to collide at a mutual receiving station.",
          "**Virtual LAN (VLAN):** A logical broadcast domain configured on one or more physical switches independently of the physical location of the connected stations."
        ],
        "questions3Mark": [
          {
            "question": "Why is the minimum frame size in standard IEEE 802.3 Ethernet fixed at 64 bytes?",
            "answer": "To guarantee collision detection! The sender must continue transmitting long enough to detect a collision returning from the farthest point of the cable. Transmission time must satisfy T_tx >= 2 * T_prop. For 10 Mbps over a 2.5 km coaxial network with repeaters, 2 * T_prop = 51.2 μs, which corresponds to exactly 64 bytes (512 bits)."
          },
          {
            "question": "What is the difference between Pure ALOHA and Slotted ALOHA throughput?",
            "answer": "Pure ALOHA has maximum efficiency S = 1 / (2e) ≈ 18.4% at G = 0.5 because vulnerable time is 2 * T_frame. Slotted ALOHA synchronizes transmissions into discrete clock slots; vulnerable time is halved to T_frame, doubling maximum throughput to S = 1 / e ≈ 36.8% at G = 1."
          },
          {
            "question": "Explain the role of the Jam Signal in CSMA/CD.",
            "answer": "When a transmitting station detects a collision, it immediately halts data transmission and broadcasts a 32-bit to 48-bit high-frequency 'jam signal' to ensure all other stations on the bus recognize the collision and abort their transmissions simultaneously."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the Hidden Terminal and Exposed Terminal problems in wireless networks and how RTS/CTS mechanism solves them.",
            "answer": "1. **Hidden Terminal Problem:** Node A and Node C cannot hear each other, but both can communicate with B. If A and C transmit simultaneously to B, their frames collide at B (2 marks).\n2. **Exposed Terminal Problem:** Node B is transmitting to A. Node C wants to transmit to D. C hears B's transmission and mistakenly assumes the channel is busy, even though C transmitting to D would not interfere with A receiving from B (1.5 marks).\n3. **RTS/CTS Solution:** Sender A sends a short Request to Send (RTS) to B. Receiver B responds with Clear to Send (CTS). All nodes in B's range (including C) hear CTS and set their Network Allocation Vector (NAV) timer to remain silent. All nodes in A's range hear RTS (1.5 marks).",
            "diagramDescription": "Three-node wireless circle topology showing radio coverage overlap and RTS/CTS packet handshake."
          },
          {
            "question": "Explain the Backward Learning algorithm used by Layer-2 Ethernet switches to build their forwarding table.",
            "answer": "1. **Step 1 (Inspection):** When a frame arrives on port P, the switch extracts the Source MAC address and records an entry: `(Source MAC, Port P, Timestamp)` in its Filtering/Forwarding Table.\n2. **Step 2 (Lookup):** The switch checks the Destination MAC address in its table:\n   - If found and the destination port equals arrival port P: **Filter (Drop)** the frame (local collision domain).\n   - If found and the destination port is different: **Forward** the frame solely to that specific port.\n   - If not found or if the destination is broadcast/multicast: **Flood** the frame out of all ports except the arrival port P.\n3. **Aging:** Entries are removed after an inactivity timer (e.g. 300 seconds) to adapt to host reconnections.",
            "diagramDescription": "A 4-port switch connected to hosts A, B, C, D with forwarding table showing MAC-to-Port mappings."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the CSMA/CD protocol in detail. Describe the Binary Exponential Backoff algorithm with mathematical expressions and draw the complete flowchart.",
            "answer": "1. **Carrier Sensing:** Station with a frame senses channel. If busy, persistence strategy (1-persistent, p-persistent, non-persistent) dictates waiting (2 marks).\n2. **Collision Detection & Jamming:** While transmitting, if signal voltage exceeds threshold, collision is detected. Abort transmission, broadcast jam signal, increment attempt counter k (2 marks).\n3. **Binary Exponential Backoff Algorithm:**\n   - After collision k (where k is capped at 10 for calculation, and max attempts = 16):\n   - Choose random integer r from the uniform range: `0 <= r < 2^k`.\n   - Wait a backoff delay time: `T_backoff = r * Slot_Time` (where Slot_Time = 51.2 μs in 10 Mbps Ethernet).\n   - If k > 10, range remains fixed at `0 <= r < 1024`.\n   - If k = 16, abort transmission entirely and report error to upper layer (2 marks).\n4. **Flowchart:** Draw flowchart with blocks: Sense channel -> Transmit bit by bit -> Collision? -> Send Jam -> k=k+1 -> k > 16? -> Calculate r in 0..2^k-1 -> Backoff delay -> Retry (2 marks).",
            "diagramDescription": "Formal algorithmic flowchart showing the decision loop, collision detection check, backoff calculator, and abort terminal."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Network Layer and Routing Protocols",
        "syllabusTopics": [
          "Network layer services: Datagram vs Virtual Circuit",
          "IPv4 Addressing: Classful vs Classless (CIDR), Subnetting, Supernetting, IPv4 Header fields",
          "IPv6 Addressing: 128-bit architecture, base header format, extension headers, IPv4 to IPv6 transition (Dual stack, Tunneling)",
          "Routing algorithms: Distance Vector Routing (Bellman-Ford, Count-to-Infinity problem, Split Horizon, Poison Reverse), Link State Routing (Dijkstra, OSPF)",
          "Inter-domain routing: Border Gateway Protocol (BGP), autonomous systems",
          "Support protocols: ICMP, ARP (Address Resolution Protocol), DHCP, NAT (Network Address Translation)"
        ],
        "conceptualWalkthrough": [
          "**Hop-by-Hop Global Delivery:** While Layer 2 moves frames across a single wire or switch, Layer 3 is responsible for routing packets across thousands of heterogeneous autonomous networks from source host to final destination host.",
          "**CIDR and Subnet Masks:** Classful addressing (Class A, B, C) caused massive waste of IPv4 addresses. Classless Inter-Domain Routing (CIDR) uses a slash notation (e.g. `/24`, `/27`). The subnet mask separates the Network prefix (which routers inspect to forward) from the Host bits (which the local network uses to address machines).",
          "**Distance Vector vs Link State:** In Distance Vector (RIP), each router shares its entire routing table with immediate neighbors only, based on hearsay. In Link State (OSPF), each router broadcasts local link costs to the ENTIRE network using Link State Advertisements (LSAs), so every router builds an identical map of the entire topology and runs Dijkstra independently.",
          "**Count-to-Infinity and Split Horizon:** In Distance Vector, if a link fails, two routers can repeatedly tell each other they have a path through each other, slowly incrementing distance to infinity. Split Horizon solves this by dictating: never advertise a route back out of the interface through which you learned it.",
          "**NAT (Network Address Translation):** Solved IPv4 exhaustion in practice. Millions of home and office devices share private IP addresses (192.168.x.x, 10.x.x.x); the border router maps private IP + source port to a single public IP + temporary port, transparently translating packets."
        ],
        "examDefinitions": [
          "**Routing:** The network layer process of determining the optimal end-to-end path through intermediate network nodes to forward a packet from source to destination.",
          "**CIDR (Classless Inter-Domain Routing):** An IP addressing scheme that eliminates fixed class boundaries (Class A, B, C) by using variable-length network prefix notation (slash notation /n) to allow flexible address allocation and hierarchical route aggregation.",
          "**Count-to-Infinity Problem:** A routing loop vulnerability in Distance Vector routing where disconnected or failed routes cause neighboring routers to repeatedly update each other's distance in an infinite arithmetic escalation.",
          "**Address Resolution Protocol (ARP):** A network layer protocol that dynamically maps a known 32-bit IPv4 logical address to a 48-bit physical MAC hardware address on a local area network."
        ],
        "questions3Mark": [
          {
            "question": "What is the function of the TTL (Time to Live) field in an IPv4 datagram header?",
            "answer": "TTL prevents orphaned packets from circulating infinitely in routing loops. Every intermediate router decrements the TTL field by 1. When TTL reaches 0, the router discards the packet and sends an ICMP 'Time Exceeded' message back to the source host."
          },
          {
            "question": "Explain Split Horizon with Poison Reverse.",
            "answer": "Split Horizon states that a router must not advertise a route back to the neighbor from which it learned it. Poison Reverse goes a step further: it actively advertises that route back to the neighbor with an infinite distance metric (cost = 16 in RIP), immediately breaking two-node routing loops."
          },
          {
            "question": "Given an IP address 192.168.10.68 with subnet mask 255.255.255.224 (/27), find the Network Address and Broadcast Address.",
            "answer": "Subnet mask 255.255.255.224 has block size 256 - 224 = 32. Host IP 68 falls in block 64 to 95. Therefore: Network Address = `192.168.10.64`; Broadcast Address = `192.168.10.95`; Usable Host Range = `192.168.10.65` to `192.168.10.94`."
          }
        ],
        "questions5Mark": [
          {
            "question": "Compare IPv4 and IPv6 header structures with labeled diagrams.",
            "answer": "1. **IPv4 Header:** 20 to 60 bytes (variable length with options). 12 mandatory fields: Version, IHL, Type of Service, Total Length, Identification, Flags, Fragment Offset, TTL, Protocol, Header Checksum, Source IP (32 bits), Destination IP (32 bits).\n2. **IPv6 Header:** Fixed 40-byte base header. Only 8 fields: Version, Traffic Class, Flow Label, Payload Length, Next Header (replaces protocol and daisy-chains extension headers), Hop Limit (replaces TTL), Source IP (128 bits), Destination IP (128 bits).\n3. **Key Improvements:** No header checksum (reduces router processing delay), fixed header size enables hardware fast-path routing, 128-bit address space guarantees 3.4 x 10^38 addresses.",
            "diagramDescription": "Block schematic of IPv4 32-bit wide header vs IPv6 fixed 40-byte header."
          },
          {
            "question": "Explain how Network Address Translation (NAT) with Port Address Translation (PAT) allows multiple private hosts to access the Internet using a single public IP.",
            "answer": "1. **Private Address Spaces:** Defined in RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Non-routable on the public internet.\n2. **Outbound Translation:** Internal host `192.168.1.5:4000` sends packet to public web server. The NAT router intercepts the packet, replaces the source IP with its public IP `203.0.113.1` and allocates an unused port `50001`. It records the mapping in its NAT Translation Table: `(192.168.1.5:4000 <-> 203.0.113.1:50001)`.\n3. **Inbound Translation:** When response packet arrives at `203.0.113.1:50001`, NAT looks up port 50001, rewrites the destination IP to `192.168.1.5:4000`, and forwards to internal LAN.\n4. **Benefit:** Conserves IPv4 addresses and provides built-in perimeter security.",
            "diagramDescription": "NAT router with internal LAN hosts, NAT table with private-public port mappings, and Internet server."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain Distance Vector Routing and Link State Routing algorithms in detail. Contrast them across convergence speed, routing overhead, and vulnerability to routing loops.",
            "answer": "1. **Distance Vector Routing (Bellman-Ford Algorithm):**\n   - Each router maintains a vector: `D_x(y) = min_v { c(x,v) + D_v(y) }`.\n   - Periodically sends full routing tables to immediate neighbors only.\n   - Convergence is slow; vulnerable to Count-to-Infinity problem and routing loops (3 marks).\n2. **Link State Routing (Dijkstra Algorithm / OSPF):**\n   - Step 1: Discover neighbors and learn addresses (Hello packets).\n   - Step 2: Measure link cost/latency to neighbors.\n   - Step 3: Build Link State Packet (LSP) and flood to entire network.\n   - Step 4: Every router constructs identical topology graph and executes Dijkstra's algorithm to compute shortest path tree from itself as root (3 marks).\n3. **Comprehensive Comparative Matrix (2 marks):**\n   - **Convergence Speed:** Link State is instant (event-driven); Distance Vector is slow (iterative propagation).\n   - **Message Overhead:** Distance Vector sends large tables to neighbors; Link State floods small LSAs to all nodes.\n   - **Memory/Computation:** Link State requires O(V^2) or O(E log V) CPU compute and complete map memory; Distance Vector requires minimal memory.\n   - **Robustness:** A malfunctioning router in Distance Vector corrupts the whole network's tables; in Link State, each router computes its own paths.",
            "diagramDescription": "Comparative topology showing periodic neighbor-only exchange vs global LSA flooding."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Transport and Application Layer Protocols & Security",
        "syllabusTopics": [
          "Transport layer services: Port multiplexing, connection-oriented vs connectionless",
          "UDP: Datagram header, checksum calculation, use cases (DNS, VoIP)",
          "TCP: Segment format, 3-way handshake connection establishment, 4-way termination",
          "TCP Flow & Congestion Control: Advertised window (rwnd), Congestion window (cwnd), AIMD, Slow Start, Fast Retransmit, Fast Recovery",
          "Application Layer protocols: DNS (Domain Name System hierarchy, iterative vs recursive queries), HTTP/1.1 vs HTTP/2 vs HTTP/3, FTP, SMTP, POP3, IMAP",
          "Socket Programming basics: client-server TCP and UDP primitives",
          "Network Security fundamentals: Firewalls (packet filter, stateful, application proxy), Cryptography basics (Symmetric vs Asymmetric), SSL/TLS handshake"
        ],
        "conceptualWalkthrough": [
          "**Process-to-Process Communication:** IP delivers packets to a machine (host-to-host). The Transport layer uses Port numbers (16-bit) to deliver messages to the specific software process (process-to-process).",
          "**TCP vs UDP Philosophical Difference:** UDP is an ultralight envelope around IP (adds only port numbers and checksum); it is fast, stateless, and ideal for live video/gaming where a late packet is useless. TCP creates the illusion of an infallible, in-order reliable byte stream across an unreliable packet network.",
          "**The 3-Way Handshake:** Sender sends `SYN (seq=x)`. Receiver responds with `SYN+ACK (seq=y, ack=x+1)`. Sender acknowledges with `ACK (ack=y+1)`. Why 3 steps instead of 2? To prevent stale duplicate connection requests from dead connections from establishing ghost sockets.",
          "**TCP Congestion Control:** Controlled entirely by the sender. Effective window = `min(cwnd, rwnd)`. Starts with exponential Slow Start (`cwnd` doubles every RTT). Once `ssthresh` is reached, shifts to linear Congestion Avoidance (`cwnd += 1` per RTT). Upon 3 duplicate ACKs, triggers Fast Recovery (cuts `cwnd` by 50% without dropping to 1). Upon timeout, collapses `cwnd` to 1 MSS.",
          "**DNS Hierarchy:** Distributed database. Resolving `www.ktu.edu.in` queries Root DNS server (`.`), Top-Level Domain (TLD) server (`.in`), Authoritative server (`ktu.edu.in`), caching the IP locally for performance.",
          "**SSL/TLS Handshake:** Secures HTTP into HTTPS. Uses asymmetric cryptography (RSA / Elliptic Curve) to authenticate server certificate and securely exchange a temporary symmetric session key (AES-256), which encrypts all subsequent payload data at high speed."
        ],
        "examDefinitions": [
          "**Socket:** An endpoint for communication identified by the concatenation of an IP address and a 16-bit port number `(IP:Port)`.",
          "**TCP Three-Way Handshake:** The connection establishment protocol in TCP where sender and receiver synchronize sequence numbers using SYN, SYN-ACK, and ACK segments prior to data transmission.",
          "**Domain Name System (DNS):** A hierarchical distributed naming system that translates human-readable hostnames (e.g. `ktu.edu.in`) into numerical IP addresses (e.g. `14.139.185.7`).",
          "**Transport Layer Security (TLS):** A cryptographic protocol operating above the transport layer that provides end-to-end data encryption, server authentication, and message integrity across computer networks."
        ],
        "questions3Mark": [
          {
            "question": "Why does TCP use a 3-way handshake instead of a 2-way handshake to establish a connection?",
            "answer": "A 2-way handshake cannot protect against delayed duplicate SYN packets! If an old SYN segment delayed in the internet arrives after a connection was closed, the receiver would accept it and allocate resources for an active connection, while the sender has no idea and sends no data. The 3rd ACK segment guarantees that both sides verify each other's live intent."
          },
          {
            "question": "Differentiate between Recursive and Iterative DNS queries.",
            "answer": "1. **Recursive Query:** The client asks the local DNS server to completely resolve the name; the server itself contacts other DNS servers and returns the final IP to the client.\n2. **Iterative Query:** The contacted DNS server immediately replies with the IP address of the next DNS server to contact (e.g., 'I don't know, ask the `.in` TLD server'), and the client must query the next server directly."
          },
          {
            "question": "What is the difference between Stateful and Stateless Packet Filter Firewalls?",
            "answer": "Stateless filters inspect each packet in isolation against static rules (IP, port) without knowing history. Stateful firewalls track active connection states (TCP flags, sequence numbers, handshake stages) in a dynamic state table, allowing return traffic only for legitimate established sessions."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the TCP segment header format with a neat diagram and state the significance of control flags.",
            "answer": "1. **Header Fields (20 bytes min):** Source Port (16b), Destination Port (16b), Sequence Number (32b), Acknowledgment Number (32b), Data Offset/HLEN (4b), Reserved (6b), Flags (6b), Window Size (16b - receiver flow window rwnd), Checksum (16b), Urgent Pointer (16b), Options.\n2. **6 Control Flags:**\n   - **URG:** Urgent pointer field is valid.\n   - **ACK:** Acknowledgment number field is valid.\n   - **PSH:** Push data immediately to application without buffer wait.\n   - **RST:** Reset connection abnormally.\n   - **SYN:** Synchronize sequence numbers to establish connection.\n   - **FIN:** Terminate connection gracefully.",
            "diagramDescription": "Standard 32-bit wide TCP header diagram showing all fields and flag positions."
          },
          {
            "question": "Explain the working of HTTP/1.1 vs HTTP/2 vs HTTP/3.",
            "answer": "1. **HTTP/1.1:** Introduced persistent TCP connections (Keep-Alive) and pipelining, but suffers from Head-of-Line (HoL) blocking where slow resource transfers block subsequent requests on the same socket.\n2. **HTTP/2:** Binary framing layer over TCP. Multiplexes multiple bidirectional streams over a single TCP connection. Supports header compression (HPACK) and server push. However, a single dropped packet causes TCP HoL blocking for ALL multiplexed streams.\n3. **HTTP/3:** Replaces TCP with QUIC protocol over UDP. Provides independent byte streams without transport HoL blocking, 0-RTT connection resumption, and connection migration across networks (Wi-Fi to LTE).",
            "diagramDescription": "Parallel comparison showing sequential HTTP/1.1 vs multiplexed streams in HTTP/2 vs QUIC streams in HTTP/3."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain TCP Congestion Control in detail with the AIMD curve. Distinguish between Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery in TCP Reno. Trace a numerical example.",
            "answer": "1. **Architecture & Governing Equation:** Effective Send Window = min(cwnd, rwnd). Sender maintains Congestion Window (cwnd) and Slow Start Threshold (ssthresh) (2 marks).\n2. **Four Phased Mechanisms (3 marks):**\n   - **Slow Start:** cwnd starts at 1 MSS. On every received ACK, cwnd := cwnd + 1 MSS (exponential doubling every RTT). Continues while cwnd < ssthresh.\n   - **Congestion Avoidance:** Triggered when cwnd >= ssthresh. cwnd := cwnd + (1 / cwnd) per ACK (~1 MSS per entire RTT). Additive linear increase.\n   - **Fast Retransmit:** Triggered upon receiving 3 duplicate ACKs before timeout. Immediately retransmits missing packet without waiting for coarse RTO timer.\n   - **Fast Recovery (TCP Reno):** ssthresh := cwnd / 2, cwnd := ssthresh. Continues in Congestion Avoidance without collapsing to 1 MSS!\n   - **Timeout (RTO):** Severe collapse: ssthresh := cwnd / 2, cwnd := 1 MSS. Re-enters Slow Start.\n3. **Numerical Trace Example (2 marks):** Initial ssthresh=16. cwnd starts at 1 -> 2 -> 4 -> 8 -> 16 (Slow Start ends at RTT 4). Linear climb: 17, 18, 19, 20. At cwnd=20, 3 duplicate ACKs occur: ssthresh becomes 10, cwnd becomes 10. Resumes linear climb from 10 MSS.\n4. **Sawtooth Graph:** Draw cwnd vs RTT showing exponential climb, linear climb, multiplicative drop to ssthresh, and timeout collapse to 1 MSS (1 mark).",
            "diagramDescription": "Classic TCP Reno sawtooth graph showing cwnd trajectory across Slow Start, Congestion Avoidance, Fast Retransmit drop, and Timeout collapse."
          }
        ]
      }
    }
  },
  "pccst502": {
    "subjectCode": "PCCST502",
    "subjectTitle": "Design and Analysis of Algorithms",
    "references": [
      "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms, MIT Press, 4th Edition, 2022",
      "Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran, Fundamentals of Computer Algorithms, Universities Press, 2nd Edition, 2008",
      "Jon Kleinberg, Eva Tardos, Algorithm Design, Pearson, 1st Edition, 2005"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction and Asymptotic Analysis",
        "syllabusTopics": [
          "Importance of algorithms, steps in designing algorithms",
          "Mathematical background: summations, recurrences",
          "Asymptotic analysis: Big-O, Big-Omega, Big-Theta notations, Little-o, Little-omega",
          "Properties of asymptotic notations, comparison of growth rates",
          "Solving recurrences: Substitution method, Recursion tree method, Master Theorem (standard and extended cases)"
        ],
        "conceptualWalkthrough": [
          "**Why Asymptotic Analysis?** Execution time in milliseconds depends on CPU clock speed, RAM latency, and compiler flags. Asymptotic analysis abstracts away hardware by measuring how the number of primitive operations scales as input size n approaches infinity.",
          "**The Big Three Notations:**\n- **Big-O (O):** Asymptotic Upper Bound. f(n) <= c * g(n). 'Worst-case performance guarantee'.\n- **Big-Omega (Ω):** Asymptotic Lower Bound. f(n) >= c * g(n). 'Best-case potential or problem hardness floor'.\n- **Big-Theta (Θ):** Asymptotic Tight Bound. c1 * g(n) <= f(n) <= c2 * g(n). Exact order of growth.",
          "**Master Theorem Masterclass:** For recurrences of the form `T(n) = a*T(n/b) + f(n)` where a >= 1 and b > 1:\n- Compare f(n) with n^(log_b(a)) (the work done at the tree leaves).\n- Case 1: If f(n) = O(n^(log_b(a) - ε)), tree is leaf-heavy: `T(n) = Θ(n^(log_b(a)))`.\n- Case 2: If f(n) = Θ(n^(log_b(a))), work is balanced evenly across all levels: `T(n) = Θ(n^(log_b(a)) * log n)`.\n- Case 3: If f(n) = Ω(n^(log_b(a) + ε)) and regularity holds: `T(n) = Θ(f(n))` (root-heavy)."
        ],
        "examDefinitions": [
          "**Algorithm:** A finite, well-defined sequence of unambiguous, computer-implementable instructions designed to solve a specific computational problem or produce a specified output for any valid input in finite time.",
          "**Big-O Notation:** f(n) = O(g(n)) if and only if there exist positive constants c and n_0 such that 0 <= f(n) <= c * g(n) for all n >= n_0.",
          "**Big-Theta Notation:** f(n) = Θ(g(n)) if and only if there exist positive constants c_1, c_2, and n_0 such that 0 <= c_1 * g(n) <= f(n) <= c_2 * g(n) for all n >= n_0.",
          "**Master Theorem:** A direct analytical formula for solving divide-and-conquer recurrences of the form T(n) = a*T(n/b) + f(n) by comparing the cost of subproblem division/recombination f(n) against n^(log_b(a))."
        ],
        "questions3Mark": [
          {
            "question": "Formally define Big-Omega (Ω) notation with a graph.",
            "answer": "f(n) = Ω(g(n)) if there exist positive constants c > 0 and n_0 >= 1 such that 0 <= c * g(n) <= f(n) for all n >= n_0. It provides an asymptotic lower bound on the growth rate of a function."
          },
          {
            "question": "Solve the recurrence T(n) = 4T(n/2) + n using Master Theorem.",
            "answer": "Here a = 4, b = 2, f(n) = n. Calculate n^(log_b(a)) = n^(log_2(4)) = n^2. Compare f(n) = n with n^2. Since f(n) = O(n^(2 - ε)) for ε = 1, Case 1 of Master Theorem applies. Therefore: `T(n) = Θ(n^2)`."
          },
          {
            "question": "Arrange the following growth functions in increasing order: 2^n, n!, n log n, n^3, log n.",
            "answer": "log n < n log n < n^3 < 2^n < n!"
          }
        ],
        "questions5Mark": [
          {
            "question": "State the Master Theorem for divide-and-conquer recurrences and explain its three cases.",
            "answer": "For recurrence `T(n) = a*T(n/b) + f(n)` with a >= 1, b > 1, and f(n) asymptotically positive:\n1. **Case 1 (Leaf Dominant):** If `f(n) = O(n^(log_b(a) - ε))` for constant ε > 0, then `T(n) = Θ(n^(log_b(a)))`.\n2. **Case 2 (Evenly Balanced):** If `f(n) = Θ(n^(log_b(a)) * log^k(n))` for k >= 0, then `T(n) = Θ(n^(log_b(a)) * log^(k+1)(n))`.\n3. **Case 3 (Root Dominant):** If `f(n) = Ω(n^(log_b(a) + ε))` for constant ε > 0 and regularity condition `a*f(n/b) <= c*f(n)` holds for c < 1, then `T(n) = Θ(f(n))`."
          },
          {
            "question": "Solve the recurrence T(n) = 2T(n/2) + n log n using Recursion Tree Method.",
            "answer": "1. **Root level (depth 0):** 1 problem of size n, cost = n log n.\n2. **Level 1:** 2 subproblems of size n/2, cost = 2 * (n/2 log(n/2)) = n(log n - log 2) = n log n - n.\n3. **Level i:** 2^i subproblems of size n/2^i, cost = n log(n/2^i) = n log n - i*n.\n4. **Tree depth:** log_2(n) levels.\n5. **Summing all levels:** Sum_{i=0}^{log n} (n log n - i*n) ≈ n log n * log n - n * (log n)^2 / 2 = Θ(n log^2 n).\n6. Conclusion: `T(n) = Θ(n log^2 n)`."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the step-by-step methodology for designing and analyzing algorithms. Provide rigorous proofs for the transitive, reflexive, and symmetric properties of asymptotic notations.",
            "answer": "1. **Algorithm Design Life Cycle (2.5 marks):** Problem formulation -> Model abstraction -> Algorithm design -> Correctness proof (Loop Invariants) -> Complexity analysis -> Implementation & profiling.\n2. **Mathematical Definitions (1.5 marks):** O, Ω, Θ definitions with constants c, n_0.\n3. **Proof of Transitivity (2 marks):** If f(n) = Θ(g(n)) and g(n) = Θ(h(n)), prove f(n) = Θ(h(n)). Show constants c_1, c_2, c_3, c_4 exist such that c1*g <= f <= c2*g and c3*h <= g <= c4*h. By substitution: (c1*c3)*h <= f <= (c2*c4)*h, proving f(n) = Θ(h(n)).\n4. **Proof of Symmetry & Reflexivity (2 marks):** f(n) = Θ(g(n)) iff g(n) = Θ(f(n)). Show inverse constants 1/c2 and 1/c1 hold."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Divide and Conquer & Greedy Method",
        "syllabusTopics": [
          "Divide and conquer paradigm: Merge Sort, Quick Sort (best, worst, average case analysis), Binary Search, Strassen's Matrix Multiplication",
          "Greedy Method paradigm: Greedy choice property, Optimal substructure",
          "Greedy applications: Activity Selection Problem, Fractional Knapsack Problem, Huffman Coding (prefix codes, tree construction)",
          "Comparison of Divide & Conquer vs Greedy"
        ],
        "conceptualWalkthrough": [
          "**Divide and Conquer Philosophy:** Break problem into independent subproblems of the same type, solve subproblems recursively, and merge solutions. Quick sort divides by partitioning around a pivot; Merge sort divides strictly in half.",
          "**QuickSort Partitioning:** Lomuto vs Hoare partitioning. Worst case occurs when the input array is already sorted and we pick the first/last element as pivot: T(n) = T(n-1) + O(n) = O(n^2). Randomized QuickSort eliminates this by choosing a random pivot.",
          "**Greedy Choice Property:** A globally optimal solution can be arrived at by making locally optimal (greedy) choices at each step without ever reconsidering. Contrast with Dynamic Programming which considers multiple choices.",
          "**Fractional vs 0/1 Knapsack:** In Fractional Knapsack, items can be broken into pieces; sorting by value-to-weight ratio (v_i / w_i) guarantees optimal greedy solution in O(n log n). 0/1 Knapsack cannot be solved greedily because taking a high-ratio item might block space for a higher total value combination; it requires Dynamic Programming.",
          "**Huffman Coding:** Optimal prefix-free compression. Builds a binary tree from the bottom up using a min-priority queue, merging the two lowest-frequency characters at each step. Frequently occurring characters receive short bit codes; rare characters receive longer codes."
        ],
        "examDefinitions": [
          "**Divide and Conquer:** An algorithm design paradigm that recursively breaks a problem into two or more smaller subproblems of the same or related type, until these become simple enough to be solved directly, and then combines their solutions.",
          "**Greedy Choice Property:** The property that a globally optimal solution can be assembled by making locally optimal choices at each stage without having to reconsider previous decisions.",
          "**Optimal Substructure:** A problem exhibits optimal substructure if an optimal solution to the problem contains within it optimal solutions to its subproblems.",
          "**Prefix Code:** A variable-length code in which no codeword is a prefix of any other codeword, allowing unambiguous decoding without delimiters."
        ],
        "questions3Mark": [
          {
            "question": "Why does the Greedy approach fail for the 0/1 Knapsack problem while succeeding for Fractional Knapsack?",
            "answer": "In Fractional Knapsack, greedy selection by highest density (value/weight) works because capacity can be 100% filled. In 0/1 Knapsack, items cannot be divided; choosing a high-density item can leave unused slack capacity that cannot fit remaining items, yielding a lower total value than combinations of lower-density items that fill the bag completely."
          },
          {
            "question": "What is the worst-case time complexity of Quick Sort and how can it be avoided?",
            "answer": "Worst-case is O(n^2), occurring when the pivot divides elements into unbalanced subproblems of size 0 and n-1 (e.g. already sorted array with last element as pivot). It is avoided using Randomized QuickSort (selecting a random pivot) or Median-of-Three pivot selection, guaranteeing O(n log n) average time."
          },
          {
            "question": "State the time complexity of Strassen's Matrix Multiplication compared to standard matrix multiplication.",
            "answer": "Standard matrix multiplication requires 8 recursive multiplications of size n/2: T(n) = 8T(n/2) + O(n^2) = O(n^3). Strassen reduces multiplications from 8 down to 7: T(n) = 7T(n/2) + O(n^2) = O(n^(log_2 7)) ≈ O(n^2.807)."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain Huffman Coding algorithm. Given characters A:45, B:13, C:12, D:16, E:9, F:5, construct the optimal Huffman tree and find codes for each character.",
            "answer": "1. **Algorithm:** Insert all characters into a min-priority queue by frequency. While queue has > 1 node, extract two minimum nodes, create a parent node with sum frequency, and reinsert. Label left branch '0' and right branch '1'.\n2. **Step 1:** Extract F(5) and E(9) -> Merge into Node(14).\n3. **Step 2:** Extract C(12) and B(13) -> Merge into Node(25).\n4. **Step 3:** Extract Node(14) and D(16) -> Merge into Node(30).\n5. **Step 4:** Extract Node(25) and Node(30) -> Merge into Node(55).\n6. **Step 5:** Extract A(45) and Node(55) -> Root(100).\n7. **Resulting Codewords:** A = `0` (1 bit); C = `100`; B = `101`; F = `1100`; E = `1101`; D = `111`.\n8. **Average Code Length:** 45*1 + 13*3 + 12*3 + 16*3 + 9*4 + 5*4 = 224 bits / 100 = 2.24 bits/char (vs 3 bits in fixed length).",
            "diagramDescription": "Binary tree diagram showing characters at leaves and summed weights at internal nodes."
          },
          {
            "question": "Explain the Activity Selection Problem. Write the greedy pseudocode and prove its correctness.",
            "answer": "1. **Problem Formulation:** Given n activities with start time s_i and finish time f_i, select the maximum number of mutually compatible activities.\n2. **Greedy Strategy:** Always pick the compatible activity that finishes earliest (min f_i). This leaves the maximum possible remaining time for subsequent activities.\n3. **Pseudocode:** Sort activities by finish time: f_1 <= f_2 <= ... <= f_n. Select A_1. For i=2 to n: if s_i >= f_last, select A_i, last = i. Time complexity = O(n log n) for sorting + O(n) scan.\n4. **Proof of Greedy Choice:** Let S be an optimal solution. If S starts with an activity other than A_1, replacing the first activity of S with A_1 is valid because f_1 <= f_first, so A_1 is compatible with all remaining activities in S. Thus a greedy choice is always part of some optimal solution.",
            "diagramDescription": "Timeline bar chart showing overlapping activities and selected non-overlapping earliest-finish intervals."
          }
        ],
        "questions8Mark": [
          {
            "question": "Write the QuickSort algorithm. Derive its recurrence relation and solve for worst-case, best-case, and average-case time complexities with recursion trees.",
            "answer": "1. **Algorithm & Partitioning (2.5 marks):** Lomuto/Hoare partition pseudocode. Partition places pivot at correct sorted index in O(n) time.\n2. **Best Case Analysis (2 marks):** Pivot divides array exactly in half: T(n) = 2T(n/2) + O(n). By Master Theorem: `T(n) = Θ(n log n)`.\n3. **Worst Case Analysis (2 marks):** Pivot is always smallest or largest element: T(n) = T(n-1) + T(0) + O(n) = T(n-1) + cn. Expanding: cn + c(n-1) + c(n-2) + ... + c = c * [n(n+1)/2] = `Θ(n^2)`.\n4. **Average Case Analysis (1.5 marks):** Even a 9-to-1 split at every level yields: T(n) = T(n/10) + T(9n/10) + cn. Tree depth is log_{10/9}(n) = O(log n). Each level sums to cn, giving `Θ(n log n)`."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Dynamic Programming and Graph Algorithms",
        "syllabusTopics": [
          "Dynamic Programming: Principle of Optimality, Memoization (top-down) vs Tabulation (bottom-up)",
          "Classic DP problems: 0/1 Knapsack Problem, Matrix Chain Multiplication, Longest Common Subsequence (LCS)",
          "Graph Traversal: Breadth-First Search (BFS), Depth-First Search (DFS), Topological Sort",
          "Shortest Path Algorithms: Dijkstra's Algorithm, Bellman-Ford Algorithm",
          "Minimum Spanning Trees: Prim's Algorithm, Kruskal's Algorithm (Disjoint Set Union - Union-Find)"
        ],
        "conceptualWalkthrough": [
          "**Dynamic Programming vs Divide & Conquer:** Both divide into subproblems. Divide & Conquer solves independent subproblems (e.g. Merge Sort). DP applies when subproblems overlap heavily (e.g. Fibonacci, Floyd-Warshall); DP stores subproblem answers in a table to avoid recomputing exponential identical branches.",
          "**Matrix Chain Multiplication:** Multiplying matrix A(10x100) by B(100x5) by C(5x50): (A*B)*C takes 10*100*5 + 10*5*50 = 7,500 operations. But A*(B*C) takes 100*5*50 + 10*100*50 = 75,000 operations! 10x slower! DP computes the optimal parenthesization order in O(n^3) time.",
          "**0/1 Knapsack DP Recurrence:** `V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i)`. If item i is excluded, take best value of i-1 items. If included, add item i's value to the best value of i-1 items with remaining capacity `w - w_i`.",
          "**MST: Kruskal vs Prim:** Kruskal grows a forest by greedily picking the lightest edge across the entire graph that does not form a cycle (managed using Disjoint Set Union with path compression in O(E log V)). Prim grows a single tree outward from a seed node by adding the lightest connecting frontier edge using a min-heap."
        ],
        "examDefinitions": [
          "**Dynamic Programming:** An algorithm design method that solves complex problems by breaking them down into simpler overlapping subproblems, computing each subproblem once, and storing their solutions in a memory table (memoization or tabulation).",
          "**Principle of Optimality:** Bellman's principle stating that an optimal sequence of decisions has the property that whatever the initial state and decision are, the remaining decisions must constitute an optimal decision sequence with regard to the state resulting from the first decision.",
          "**Minimum Spanning Tree (MST):** A subset of edges in an undirected connected weighted graph that connects all vertices together without any cycles and with the minimum possible total edge weight.",
          "**Topological Sort:** A linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Memoization and Tabulation in Dynamic Programming?",
            "answer": "1. **Memoization (Top-Down):** Recursive approach where results of subproblems are cached in a hash table or array upon initial calculation; solves only required subproblems.\n2. **Tabulation (Bottom-Up):** Iterative approach that fills an entire lookup table starting from the smallest base cases up to the final target state; avoids recursion call-stack overhead."
          },
          {
            "question": "Why does Dijkstra's algorithm fail on graphs with negative edge weights while Bellman-Ford succeeds?",
            "answer": "Dijkstra is greedy: once a vertex is extracted from the min-priority queue, its distance is considered finalized and never updated again. A negative edge can create a shorter path to an already finalized node, which Dijkstra misses. Bellman-Ford relaxes all edges |V|-1 times, correctly updating paths with negative weights."
          },
          {
            "question": "State the time complexity of Kruskal's algorithm and explain how cycles are prevented.",
            "answer": "Time complexity is O(E log E) or O(E log V) to sort edges. Cycles are prevented using Disjoint Set Union (Union-Find) data structure: before adding edge (u, v), check `Find(u) == Find(v)`. If they share the same representative, adding the edge forms a cycle and it is discarded."
          }
        ],
        "questions5Mark": [
          {
            "question": "Given two sequences X = 'ABCBDAB' and Y = 'BDCABA', find the Longest Common Subsequence (LCS) using Dynamic Programming.",
            "answer": "1. **Recurrence:**\n   - If X[i] == Y[j]: `L[i,j] = 1 + L[i-1, j-1]`\n   - If X[i] != Y[j]: `L[i,j] = max(L[i-1, j], L[i, j-1])`\n2. **Matrix Construction:** Build 8x7 matrix with base row/col initialized to 0.\n3. **Result:** Length of LCS = 4.\n4. **Backtracking:** Starting from bottom-right L[7,6]=4, following diagonal arrow transitions yields LCS: `'BCBA'` (or `'BDAB'`).\n5. **Time Complexity:** O(m * n) where m=7, n=6.",
            "diagramDescription": "8x7 DP table with values and backtracking direction arrows."
          },
          {
            "question": "Explain Prim's algorithm for finding Minimum Spanning Tree with an example graph.",
            "answer": "1. **Algorithm:** Select arbitrary starting vertex S. Set key[S]=0 and key[v]=∞ for all v ≠ S. Insert all vertices into min-priority queue Q.\n2. **Loop:** While Q is not empty, extract min vertex u. Mark u as in MST. For each neighbor v of u: if v is in Q and weight(u,v) < key[v], set key[v] = weight(u,v) and parent[v] = u.\n3. **Complexity:** With Binary Heap: O((V + E) log V). With Fibonacci Heap: O(E + V log V).\n4. **Correctness:** Relies on the Cut Property: the lightest edge crossing any cut in the graph must belong to the MST.",
            "diagramDescription": "Step-by-step growing tree with highlighted minimum cut edges."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the 0/1 Knapsack Problem using Dynamic Programming. Given n=4 items with weights w = [2, 3, 4, 5] and values v = [3, 4, 5, 6] and Knapsack capacity W = 5, construct the complete DP table, determine maximum value, and identify the items included.",
            "answer": "1. **Recurrence Relation (2 marks):**\n   `K[i, w] = K[i-1, w]` if w_i > w\n   `K[i, w] = max(K[i-1, w], K[i-1, w - w_i] + v_i)` if w_i <= w.\n2. **Table Construction (3 marks):**\n   Dimensions: 5 rows (i=0..4) and 6 columns (w=0..5).\n   Row 0: [0, 0, 0, 0, 0, 0]\n   Row 1 (w1=2, v1=3): [0, 0, 3, 3, 3, 3]\n   Row 2 (w2=3, v2=4): [0, 0, 3, 4, 4, 7]\n   Row 3 (w3=4, v3=5): [0, 0, 3, 4, 5, 7]\n   Row 4 (w4=5, v4=6): [0, 0, 3, 4, 5, 7]\n3. **Maximum Value (1.5 marks):** `K[4, 5] = 7`.\n4. **Backtracking for Included Items (1.5 marks):**\n   - K[4,5] == K[3,5] (7 == 7) -> Item 4 NOT included.\n   - K[3,5] == K[2,5] (7 == 7) -> Item 3 NOT included.\n   - K[2,5] != K[1,5] (7 != 3) -> Item 2 INCLUDED! Remaining capacity = 5 - 3 = 2.\n   - K[1,2] != K[0,2] (3 != 0) -> Item 1 INCLUDED! Remaining capacity = 2 - 2 = 0.\n   - Optimal subset: **{Item 1, Item 2}** with total weight 2+3=5 and total value 3+4=7.",
            "diagramDescription": "Completed 5x6 DP grid with cells highlighted and backtracking path from cell (4,5) back to (0,0)."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Backtracking, Branch & Bound, and NP-Completeness",
        "syllabusTopics": [
          "Backtracking paradigm: State space tree, N-Queens problem, Subset Sum problem, Graph Coloring (Chromating number)",
          "Branch and Bound: 0/1 Knapsack using Branch & Bound (FIFO, LIFO, LC search)",
          "Computational Complexity Classes: P, NP, NP-Hard, NP-Complete",
          "Reductions: Polynomial-time reduction (A <=_P B)",
          "Cook-Levin Theorem, Satisfiability (SAT, 3-SAT), Vertex Cover, Traveling Salesman Problem (TSP)"
        ],
        "conceptualWalkthrough": [
          "**Backtracking (Systematic Depth-First Search):** When searching a combinatorial state space, backtracking builds candidate solutions incrementally. As soon as a candidate violates constraints (bounding function), it 'prunes' that entire subtree and backtracks immediately, avoiding testing billions of illegal combinations.",
          "**Branch and Bound (Breadth-First with Heuristic Bounds):** Backtracking works on decision problems; Branch and Bound is used for optimization problems. It computes an upper/lower bound on the objective at each node. If a node's best-possible bound is worse than a previously found solution, the entire branch is discarded.",
          "**The Classes P vs NP:**\n- **P (Polynomial Time):** Decision problems that can be SOLVED by a deterministic Turing machine in polynomial time O(n^k) (e.g. shortest path, sorting).\n- **NP (Nondeterministic Polynomial Time):** Decision problems where a candidate solution (certificate) can be VERIFIED in polynomial time (e.g. 3-SAT, Hamiltonian cycle).\n- **NP-Hard:** Problems at least as hard as the hardest problems in NP. If any NP-Hard problem is solved in polynomial time, then P = NP.\n- **NP-Complete:** A problem that is BOTH in NP and NP-Hard (the hardest problems in NP).",
          "**Polynomial-Time Reduction:** To prove problem B is NP-Complete, take a known NP-Complete problem A (e.g. 3-SAT) and show that any instance of A can be converted into an equivalent instance of B in polynomial time (A <=_P B)."
        ],
        "examDefinitions": [
          "**Backtracking:** A general algorithmic technique that systematically searches for solutions to computational problems by exploring candidate solutions along a state space tree and abandoning (pruning) a branch as soon as it determines the branch cannot yield a valid solution.",
          "**Class P:** The class of all decision problems solvable by a deterministic algorithm in polynomial time O(n^k) for some constant k.",
          "**Class NP:** The class of decision problems for which a proposed solution (certificate) can be verified in polynomial time by a deterministic algorithm.",
          "**NP-Complete:** A decision problem X is NP-Complete if X is in NP and for every problem Y in NP, Y is polynomial-time reducible to X (Y <=_P X).",
          "**Cook-Levin Theorem:** The foundational theorem proving that the Boolean Satisfiability Problem (SAT) is NP-Complete, establishing the first known NP-Complete problem."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Backtracking and Branch and Bound?",
            "answer": "1. **Backtracking:** Traverses the state space tree using Depth-First Search (DFS); primarily used for decision/satisfaction problems (e.g. N-Queens); prunes branches using feasibility/bounding functions.\n2. **Branch and Bound:** Traverses state space using Breadth-First (FIFO) or Best-First (Least Cost LC) search; used for optimization problems; prunes branches by comparing estimated heuristic bounds against the current best known solution."
          },
          {
            "question": "Define the class NP-Hard and how it differs from NP-Complete.",
            "answer": "A problem X is NP-Hard if every problem in NP can be polynomial-time reduced to X. X does not need to be in NP itself (it may not even be a decision problem). If an NP-Hard problem also belongs to class NP, it is classified as NP-Complete."
          },
          {
            "question": "State the N-Queens problem and write the condition for two queens at (i, j) and (k, l) to attack each other diagonally.",
            "answer": "Place N non-attacking chess queens on an N x N chessboard so that no two queens share the same row, column, or diagonal. Two queens at (i, j) and (k, l) share a diagonal if and only if `|i - k| == |j - l|`."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the 4-Queens problem using Backtracking. Draw the complete state space tree showing all pruned branches.",
            "answer": "1. **Problem Formulation:** Place 4 queens on a 4x4 board. Vector `X = [x1, x2, x3, x4]` where `x_i` represents column position of queen in row i.\n2. **State Space Tree Exploration:**\n   - Place Q1 at col 1: `X = [1, -, -, -]`.\n   - Try Q2 at col 1 (same col, clash). Try Q2 at col 2 (diagonal clash with Q1). Place Q2 at col 3.\n   - For Q3: col 1 (clash Q1), col 2 (diagonal Q2), col 3 (clash Q2), col 4 (diagonal Q2). Dead end! Backtrack Q2.\n   - Try Q2 at col 4. Place Q3 at col 2. Place Q4 at col... all clash! Backtrack Q1.\n   - Place Q1 at col 2: `X = [2, -, -, -]`.\n   - Q2 at col 4. Q3 at col 1. Q4 at col 3. All valid!\n3. **First Solution:** `[2, 4, 1, 3]`.\n4. **Second Symmetric Solution:** `[3, 1, 4, 2]`.",
            "diagramDescription": "State space search tree showing pruned branches with X marks and the successful leaf nodes."
          },
          {
            "question": "Explain the concept of Polynomial-Time Reduction with a diagram. Why is it fundamental to proving NP-Completeness?",
            "answer": "1. **Definition:** A problem A is polynomial-time reducible to problem B (written `A <=_P B`) if there exists a polynomial-time function f that converts any instance x of problem A into an instance f(x) of problem B such that x is a YES instance of A if and only if f(x) is a YES instance of B.\n2. **Significance:** It proves that problem B is at least as hard as problem A. If we can solve B in polynomial time, we can solve A in polynomial time.\n3. **Proving NP-Completeness:** Once Cook proved SAT is NP-Complete, to prove any new problem X is NP-Complete, we simply reduce SAT (or any known NP-Complete problem like 3-SAT) to X in polynomial time.",
            "diagramDescription": "Pipeline diagram showing instance x of problem A transformed by function f into f(x), fed into solver for B, and outputting YES/NO."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the relationship between classes P, NP, NP-Complete, and NP-Hard with an Euler diagram. State the Cook-Levin theorem and describe the steps to prove that a new problem is NP-Complete.",
            "answer": "1. **Euler Venn Diagram of Complexity Classes (2 marks):** Draw two diagrams showing (a) if P != NP (current consensus) with P subset of NP, and NP-Complete at the intersection of NP and NP-Hard; and (b) if P = NP.\n2. **Cook-Levin Theorem (2 marks):** Stated in 1971. Proved that SAT (Boolean Satisfiability) is NP-Complete directly from the definition of a Nondeterministic Turing Machine without relying on any prior reductions. Cook constructed a polynomial-sized Boolean formula encoding the head position, tape state, and transitions of the Turing machine.\n3. **4-Step Recipe to Prove Problem X is NP-Complete (3 marks):**\n   - **Step 1:** Prove X is in NP by providing a verification algorithm and certificate that checks in polynomial time.\n   - **Step 2:** Select a known NP-Complete problem Y (e.g. 3-SAT, Vertex Cover, Hamiltonian Cycle).\n   - **Step 3:** Construct a reduction function f that maps any instance y of Y to an instance f(y) of X in polynomial time.\n   - **Step 4:** Prove equivalence: y is a YES instance of Y if and only if f(y) is a YES instance of X.\n4. **Conclusion (1 mark):** Concludes that X is NP-Complete."
          }
        ]
      }
    }
  },
  "pccst503": {
    "subjectCode": "PCCST503",
    "subjectTitle": "Machine Learning",
    "references": [
      "Tom M. Mitchell, Machine Learning, McGraw-Hill, 1st Edition, 1997",
      "Ethem Alpaydin, Introduction to Machine Learning, MIT Press, 4th Edition, 2020",
      "Christopher M. Bishop, Pattern Recognition and Machine Learning, Springer, 1st Edition, 2006",
      "Aurélien Géron, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly, 3rd Edition, 2022"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction, Concept Learning & Decision Trees",
        "syllabusTopics": [
          "Introduction to machine learning: Definition, applications, learning paradigms (Supervised, Unsupervised, Reinforcement)",
          "Concept Learning: General-to-specific ordering, Find-S algorithm, Candidate Elimination algorithm, Version Spaces",
          "Inductive Bias: Need for inductive bias, unbiased learner fallacy",
          "Decision Tree Learning: Representation, ID3 algorithm, Entropy, Information Gain, Gain Ratio, Overfitting and tree pruning"
        ],
        "conceptualWalkthrough": [
          "**What is Machine Learning?** Mitchell's definition: A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E.",
          "**Version Spaces & Candidate Elimination:** The version space is the subset of all hypotheses that are completely consistent with all observed training examples. Candidate Elimination maintains two boundaries: the Most Specific Boundary (S) and the Most General Boundary (G). Positive examples generalize S; negative examples specialize G.",
          "**The Unbiased Learner Fallacy:** A learner that makes no prior assumptions (zero inductive bias) can only memorize training examples. When faced with an unseen test instance, an unbiased learner cannot classify it any better than random guessing! Inductive bias is not a flaw; it is a mathematical prerequisite for generalization.",
          "**Decision Tree Split Criterion:** ID3 uses Information Gain based on Shannon Entropy `H(S) = - sum p_i * log_2(p_i)`. The attribute that creates the largest reduction in entropy is chosen as the split node. To prevent bias toward attributes with many discrete values (like Date or ID), C4.5 uses Gain Ratio = Gain / SplitInformation."
        ],
        "examDefinitions": [
          "**Machine Learning (Mitchell's Definition):** A computer program learns from experience E with respect to task T and performance measure P if its performance on T, measured by P, improves with experience E.",
          "**Inductive Bias:** The set of prior assumptions that the learned model uses to predict outputs of unseen inputs outside the observed training data.",
          "**Entropy:** A thermodynamic and mathematical measure of impurity, disorder, or uncertainty in a dataset S: H(S) = - ∑ p_i * log_2(p_i).",
          "**Information Gain:** The expected reduction in entropy caused by partitioning a dataset S according to attribute A: Gain(S, A) = H(S) - ∑ (|S_v| / |S|) * H(S_v)."
        ],
        "questions3Mark": [
          {
            "question": "What is the Find-S algorithm and what is its main limitation?",
            "answer": "Find-S finds the maximally specific hypothesis consistent with positive training instances by starting with the most specific hypothesis `<?, ?, ...>` and generalizing constraints whenever a positive example contradicts it. Limitation: It completely ignores negative training examples and cannot detect whether the hypothesis space contains inconsistent data."
          },
          {
            "question": "State Mitchell's formal definition of machine learning with an example.",
            "answer": "A program learns from Experience E with respect to Task T and Performance P if P on T improves with E. Example (Autonomous Driving): Task T = driving on highway; Experience E = database of camera/sensor logs; Performance P = distance traveled without human intervention."
          },
          {
            "question": "Why is Gain Ratio preferred over Information Gain in C4.5 decision tree algorithm?",
            "answer": "Information Gain is heavily biased toward attributes with many distinct values (e.g. Employee_ID or Date). A split on Employee_ID creates pure subsets with entropy 0, maximizing Information Gain, but yields a completely useless decision tree. Gain Ratio penalizes broad multi-way splits by dividing Gain by SplitInformation."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the Candidate Elimination algorithm with an example showing S and G boundaries.",
            "answer": "1. **Initialization:** Initialize S_0 to the most specific hypothesis `[∅, ∅, ∅]` and G_0 to the most general hypothesis `[?, ?, ?]`.\n2. **On Positive Example d:** For each hypothesis s in S, generalize s to accommodate d. Remove any hypothesis in G that does not cover d.\n3. **On Negative Example d:** For each hypothesis g in G, specialize g so it does not cover d (keeping it more general than S). Remove any hypothesis in S that covers d.\n4. **Convergence:** Continues until S and G boundaries converge to a single hypothesis, or terminates with empty version space if noise is present.",
            "diagramDescription": "Lattice diagram showing specific boundary S at bottom and general boundary G at top converging inward."
          },
          {
            "question": "Given a dataset S with 9 positive and 5 negative examples, calculate the initial entropy. If attribute 'Wind' splits S into Weak (6 positive, 2 negative) and Strong (3 positive, 3 negative), calculate Information Gain.",
            "answer": "1. Total = 14 (p+ = 9/14 = 0.643, p- = 5/14 = 0.357).\n2. H(S) = - (9/14)log_2(9/14) - (5/14)log_2(5/14) = - (0.643 * -0.637) - (0.357 * -1.485) = 0.410 + 0.530 = **0.940 bits**.\n3. H(Weak) = - (6/8)log_2(6/8) - (2/8)log_2(2/8) = - (0.75 * -0.415) - (0.25 * -2.0) = 0.311 + 0.5 = **0.811 bits**.\n4. H(Strong) = - (3/6)log_2(3/6) - (3/6)log_2(3/6) = **1.000 bit**.\n5. Weighted Entropy = (8/14) * 0.811 + (6/14) * 1.000 = 0.463 + 0.428 = 0.891 bits.\n6. **Information Gain** = H(S) - Weighted Entropy = 0.940 - 0.891 = **0.049 bits**.",
            "diagramDescription": "Entropy curve plot and attribute branch calculation tree."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the ID3 decision tree algorithm in detail. Discuss the problems of overfitting in decision trees and explain Reduced Error Pruning and Rule Post-Pruning.",
            "answer": "1. **ID3 Algorithm Pseudocode (2.5 marks):** Recursive function `ID3(Examples, Target_Attribute, Attributes)`. Base cases: all positive -> Return Leaf(+); all negative -> Return Leaf(-); Attributes empty -> Return Leaf(majority). Otherwise, compute Information Gain for all attributes, pick best attribute A, branch on all values of A, and recurse.\n2. **Overfitting in Trees (2 marks):** A tree overfits when it grows deep enough to model statistical noise and outliers in training data. Training accuracy reaches 100%, but test generalization drops significantly.\n3. **Reduced Error Pruning (1.5 marks):** Split data into Training and Validation sets. Evaluate each internal node: tentatively replace the subtree with a leaf assigned the majority class. If the pruned tree performs no worse on the validation set, permanently prune the subtree.\n4. **Rule Post-Pruning (2 marks):** Convert tree into an equivalent set of IF-THEN rules (one rule per path from root to leaf). Prone each rule independently by removing antecedents that do not decrease estimated accuracy. Sort rules by estimated accuracy. Highly flexible and readable."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Linear Models and Neural Networks",
        "syllabusTopics": [
          "Linear Regression: Ordinary Least Squares, Cost Function, Batch vs Stochastic Gradient Descent",
          "Logistic Regression: Sigmoid activation function, Log-loss / Cross-entropy cost function, Decision boundaries",
          "Regularization: Overfitting prevention, L1 Regularization (Lasso - sparsity), L2 Regularization (Ridge - weight decay)",
          "Artificial Neural Networks: Biological vs Artificial neuron, Perceptron learning rule and XOR limitation",
          "Multilayer Perceptrons (MLP): Activation functions (Sigmoid, Tanh, ReLU, Leaky ReLU), Backpropagation derivation"
        ],
        "conceptualWalkthrough": [
          "**The Linear Foundation:** Modeling output y as linear combination of weights and features: y = θ_0 + θ_1*x_1 + ... + θ_n*x_n. We minimize Mean Squared Error cost J(θ) = (1/2m) ∑ (h_θ(x) - y)^2.",
          "**Why Sigmoid for Classification?** Linear regression predicts values in (-∞, +∞). In classification, we need probabilities in [0, 1]. The Logistic Sigmoid function `g(z) = 1 / (1 + e^-z)` squashes any real number smoothly into [0, 1].",
          "**L1 vs L2 Regularization:** When models have too many features, weights grow excessively large to fit noise. L2 (Ridge) adds `λ ∑ θ_j^2` to loss; it drives weights smoothly toward zero without eliminating them. L1 (Lasso) adds `λ ∑ |θ_j|`; because of its sharp diamond-shaped constraint boundary, L1 drives non-essential weights to exact zero, performing automatic feature selection!",
          "**The Perceptron XOR Crisis:** Minsky & Papert (1969) proved a single-layer perceptron can only learn linearly separable functions (AND, OR). XOR is non-linearly separable. This froze AI research until Multilayer Perceptrons and the Backpropagation algorithm solved XOR using non-linear hidden layers.",
          "**Backpropagation Core Intuition:** The Chain Rule of calculus in reverse! Forward pass computes predictions and overall error E. Backward pass calculates partial derivatives ∂E/∂w layer-by-layer backwards from output to input, updating each synaptic weight to reduce error."
        ],
        "examDefinitions": [
          "**Gradient Descent:** A first-order iterative optimization algorithm used to find a local minimum of a differentiable objective function by updating parameters in the direction of the negative gradient vector.",
          "**Logistic Regression:** A supervised classification model that predicts the probability of a categorical outcome by passing a linear combination of input features through the logistic sigmoid function.",
          "**Regularization:** A technique that discourages learning an overly complex model by appending a penalty term proportional to weight magnitude to the loss function to prevent overfitting.",
          "**Backpropagation:** The supervised learning algorithm for multilayer neural networks that applies the calculus chain rule backwards from output to input layer to compute error gradients for weight optimization."
        ],
        "questions3Mark": [
          {
            "question": "Why is Mean Squared Error (MSE) NOT used as the cost function in Logistic Regression?",
            "answer": "When the non-linear sigmoid function g(z) is plugged into MSE, the resulting cost function J(θ) is non-convex with numerous local minima and flat plateaus. Gradient descent gets trapped. Logistic regression uses Cross-Entropy (Log-Loss) instead, which is mathematically guaranteed to be strictly convex."
          },
          {
            "question": "Why did the single-layer perceptron fail to solve the XOR problem?",
            "answer": "A single-layer perceptron can only generate a single linear hyperplane (straight line) decision boundary. XOR outputs 1 for (0,1) and (1,0) and 0 for (0,0) and (1,1), which is non-linearly separable and cannot be partitioned by any single straight line."
          },
          {
            "question": "Why is the ReLU activation function preferred over Sigmoid in deep neural networks?",
            "answer": "For large positive or negative inputs, the derivative of the Sigmoid function approaches zero (vanishing gradient problem), halting backpropagation learning in deep layers. ReLU (f(x) = max(0, x)) has constant derivative 1 for all x > 0, preventing vanishing gradients and computing 6x faster."
          }
        ],
        "questions5Mark": [
          {
            "question": "Differentiate between L1 Regularization (Lasso) and L2 Regularization (Ridge) mathematically and geometrically.",
            "answer": "1. **Formulations:**\n   - Ridge (L2): `J(θ) = MSE + λ ∑ θ_j^2`\n   - Lasso (L1): `J(θ) = MSE + λ ∑ |θ_j|`\n2. **Geometric Intuition:**\n   - L2 constraint is a sphere/circle (smooth contour). The quadratic loss ellipses intersect the circle along the curved arcs, shrinking weights toward zero but rarely exactly zero.\n   - L1 constraint is a diamond/rhombus with sharp vertices along the coordinate axes. The loss ellipses frequently intersect the constraint region at a vertex, driving unneeded parameter weights to EXACTLY ZERO (sparsity).\n3. **Application:** Use L1 when feature selection is required; use L2 when features are collinear.",
            "diagramDescription": "Contour ellipse plots showing L2 circular constraint vs L1 diamond corner intersection."
          },
          {
            "question": "Derive the weight update rule for a single Perceptron unit with learning rate η.",
            "answer": "1. Output: `y = 1` if `w^T x >= 0`, else `0`.\n2. Error: `e = (y_target - y_predicted)`.\n3. Perceptron Learning Rule: `w_i := w_i + Δw_i`, where `Δw_i = η * (y_target - y_predicted) * x_i`.\n4. Three cases:\n   - If predicted == target: e = 0, no change to weights.\n   - If target=1, predicted=0: e = +1, weight increases by `η * x_i` (rotates boundary toward x).\n   - If target=0, predicted=1: e = -1, weight decreases by `η * x_i` (rotates boundary away from x)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Derive the Backpropagation algorithm for a Multilayer Perceptron with one hidden layer using Sigmoid activation functions and Mean Squared Error. Explain the vanishing gradient problem.",
            "answer": "1. **Architecture & Notations (2 marks):** Input x_i, hidden layer outputs h_j = σ(z_j) where z_j = ∑ w_ji * x_i, output layer y_k = σ(z_k) where z_k = ∑ w_kj * h_j. Cost `E = 1/2 ∑ (y_k - t_k)^2`.\n2. **Output Layer Weights Derivative (2 marks):**\n   Apply chain rule: `∂E/∂w_kj = (∂E/∂y_k) * (∂y_k/∂z_k) * (∂z_k/∂w_kj)`.\n   `∂E/∂y_k = (y_k - t_k)`.\n   `∂y_k/∂z_k = σ'(z_k) = y_k * (1 - y_k)`.\n   `∂z_k/∂w_kj = h_j`.\n   Define error term `δ_k = (y_k - t_k) * y_k * (1 - y_k)`. Then `∂E/∂w_kj = δ_k * h_j`.\n   Update: `w_kj := w_kj - η * δ_k * h_j`.\n3. **Hidden Layer Weights Derivative (2.5 marks):**\n   `∂E/∂w_ji = ∑_k (∂E/∂z_k * ∂z_k/∂h_j) * (∂h_j/∂z_j) * (∂z_j/∂w_ji)`.\n   `∂h_j/∂z_j = h_j * (1 - h_j)`.\n   Define `δ_j = [ ∑_k δ_k * w_kj ] * h_j * (1 - h_j)`.\n   Update: `w_ji := w_ji - η * δ_j * x_i`.\n4. **Vanishing Gradient Explanation (1.5 marks):** Since max value of σ'(z) is 0.25, multiplying multiple derivative terms across layers causes gradients to decay exponentially toward zero as they backpropagate to early layers."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Support Vector Machines, Ensembles & Clustering",
        "syllabusTopics": [
          "Support Vector Machines (SVM): Maximum margin hyperplane, Support vectors, Hard margin vs Soft margin (Slack variables C)",
          "Kernel Trick: Non-linear transformation, Common kernels (Linear, Polynomial, Radial Basis Function RBF)",
          "Ensemble Learning: Bias-variance trade-off, Bagging, Random Forests, Boosting (AdaBoost, Gradient Boosting)",
          "Unsupervised Clustering: K-Means algorithm, Elbow method, Hierarchical Clustering (Dendrograms), DBSCAN",
          "Evaluation Metrics: Confusion matrix, Accuracy, Precision, Recall, F1-Score, ROC-AUC curve"
        ],
        "conceptualWalkthrough": [
          "**The Geometric Insight of SVM:** Many lines can separate two classes. SVM finds the unique line that maximizes the margin (distance to the closest data points, called Support Vectors). Maximizing margin minimizes generalization error.",
          "**The Kernel Trick (The Mathematical Miracle):** If data is not linearly separable in 2D, map it into a higher-dimensional space (e.g. 3D or infinite-dimensional Hilbert space) where it becomes linearly separable. Computing coordinates in infinite space is impossible, but the Kernel Trick computes the inner product `K(x, z) = φ(x)·φ(z)` directly in the original space without ever computing the high-dimensional coordinates!",
          "**Ensemble Wisdom (Bagging vs Boosting):**\n- **Bagging (Bootstrap Aggregating):** Trains multiple deep decision trees in parallel on bootstrap sample subsets and averages votes (Random Forest). Reduces variance.\n- **Boosting:** Trains shallow trees sequentially; each new tree focuses on the mistakes (misclassified samples) of previous trees (AdaBoost). Reduces bias.",
          "**K-Means vs DBSCAN:** K-Means assumes spherical clusters and requires specifying k in advance; vulnerable to outliers. DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points that have at least `MinPts` within radius `ε`; discovers arbitrary non-convex shapes and automatically identifies outliers as noise.",
          "**Precision vs Recall:** Precision = 'Out of all samples predicted positive, how many were truly positive?' Recall = 'Out of all actual positive samples, how many did the model detect?' The harmonic mean is the F1-Score."
        ],
        "examDefinitions": [
          "**Support Vector Machine (SVM):** A supervised learning model that finds the optimal separating hyperplane that maximizes the geometric margin between different classes in feature space.",
          "**Kernel Trick:** A method in machine learning that computes inner products in high-dimensional feature spaces implicitly using kernel functions without explicitly projecting data points into that space.",
          "**Random Forest:** An ensemble learning technique that constructs a multitude of decision trees at training time using bootstrap sampling and random feature selection, outputting the mode or mean prediction.",
          "**DBSCAN:** A density-based clustering algorithm that groups points closely packed together in high-density regions while marking points in low-density regions as noise outliers."
        ],
        "questions3Mark": [
          {
            "question": "What is the role of the hyperparameter C in Soft Margin Support Vector Machines?",
            "answer": "C controls the trade-off between maximizing the margin and minimizing classification errors. A large C heavily penalizes misclassifications, leading to a narrower margin and potential overfitting. A small C allows more slack margin violations, producing a wider margin with greater generalization."
          },
          {
            "question": "Define Precision, Recall, and F1-Score with formulas.",
            "answer": "1. `Precision = TP / (TP + FP)` (accuracy of positive predictions)\n2. `Recall = TP / (TP + FN)` (sensitivity / coverage of true positives)\n3. `F1-Score = 2 * (Precision * Recall) / (Precision + Recall)` (harmonic mean balancing both)."
          },
          {
            "question": "Explain the Elbow Method used in K-Means clustering.",
            "answer": "Plot the Within-Cluster Sum of Squares (WCSS / Inertia) as a function of the number of clusters k. As k increases, WCSS naturally decreases. The optimal number of clusters is the 'elbow' point where the rate of decrease abruptly bends and flattens."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working of the AdaBoost algorithm with mathematical weights update formulation.",
            "answer": "1. **Initialization:** Assign equal sample weights to all N training examples: `w_i = 1/N`.\n2. **Iterative Boosting Loop (for t = 1 to T):**\n   - Train weak learner (decision stump) h_t on weighted data.\n   - Calculate weighted classification error: `ε_t = ∑_{i: y_i ≠ h_t(x_i)} w_i`.\n   - Compute model voting weight: `α_t = 0.5 * ln((1 - ε_t) / ε_t)`.\n   - Update sample weights: `w_i := w_i * exp(-α_t * y_i * h_t(x_i))`.\n   - Normalize weights so `∑ w_i = 1`.\n3. **Final Ensemble Classifier:** `H(x) = sign( ∑_{t=1}^T α_t * h_t(x) )`.\n4. **Intuition:** Hard misclassified samples receive higher weights, forcing the next weak learner to focus on them.",
            "diagramDescription": "Sequential weak learners diagram showing sample weight resizing and weighted voting aggregation."
          },
          {
            "question": "Compare K-Means clustering and DBSCAN clustering across cluster shape, outlier handling, and hyperparameter sensitivity.",
            "answer": "1. **Cluster Geometry:** K-Means only detects convex spherical clusters. DBSCAN detects arbitrary non-linear shapes (crescent, rings).\n2. **Outlier Handling:** K-Means assigns all points to some centroid (severely distorted by noise). DBSCAN marks low-density points as noise (-1).\n3. **Number of Clusters:** K-Means requires specifying k beforehand. DBSCAN automatically discovers the number of clusters based on ε and MinPts.\n4. **Computational Complexity:** K-Means is O(n * k * d * iterations). DBSCAN is O(n log n) with spatial index, O(n^2) without.",
            "diagramDescription": "Side-by-side diagrams of spherical clusters in K-Means vs non-convex interlocking rings in DBSCAN."
          }
        ],
        "questions8Mark": [
          {
            "question": "Derive the mathematical optimization formulation of the Maximum Margin Hyperplane for linearly separable Support Vector Machines. Formulate the primal optimization problem and its dual formulation using Lagrange multipliers.",
            "answer": "1. **Hyperplane Formulation (2 marks):** Hyperplane `w^T x + b = 0`. Functional margin normalized to 1 for support vectors: `y_i(w^T x_i + b) >= 1` for all i.\n2. **Geometric Margin Derivation (2 marks):** Geometric margin `γ = 1 / ||w||`. Maximizing margin 1/||w|| is equivalent to minimizing `1/2 ||w||^2`.\n3. **Primal Optimization Problem (2 marks):**\n   `Minimize 1/2 ||w||^2` subject to constraints `y_i(w^T x_i + b) - 1 >= 0` for i = 1..m.\n   Construct Lagrangian: `L(w, b, α) = 1/2 ||w||^2 - ∑_{i=1}^m α_i [y_i(w^T x_i + b) - 1]`, with α_i >= 0.\n4. **Dual Formulation (2 marks):**\n   Set partial derivatives to 0: `∂L/∂w = 0 => w = ∑ α_i y_i x_i`, and `∂L/∂b = 0 => ∑ α_i y_i = 0`.\n   Substitute into L to obtain Wolfe Dual:\n   `Maximize W(α) = ∑ α_i - 1/2 ∑_i ∑_j α_i α_j y_i y_j (x_i · x_j)`\n   subject to `∑ α_i y_i = 0` and `α_i >= 0`.\n   Note: Data only appears as inner product `(x_i · x_j)`, enabling the Kernel Trick `K(x_i, x_j)`!"
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Dimensionality Reduction and Reinforcement Learning",
        "syllabusTopics": [
          "Curse of Dimensionality: Volume concentration, distance metric degradation",
          "Dimensionality Reduction: Principal Component Analysis (PCA - derivation, covariance matrix, eigenvectors), Linear Discriminant Analysis (LDA), t-SNE",
          "Anomaly Detection: Gaussian distribution density estimation",
          "Reinforcement Learning: Agent-Environment interface, Markov Decision Process (MDP), Bellman equations, Q-Learning algorithm",
          "Ethical considerations in AI: Algorithmic bias, fairness, transparency"
        ],
        "conceptualWalkthrough": [
          "**The Curse of Dimensionality:** In high dimensions (e.g. 10,000 features in genomics or NLP), data points become exponentially sparse. The ratio of the distance to the nearest neighbor versus the farthest neighbor approaches 1, meaning distance metrics like Euclidean distance become meaningless.",
          "**PCA Core Intuition:** Find orthogonal axes (Principal Components) that capture the maximum variance in the data. The first principal component is the direction along which the data varies the most. The second is orthogonal to the first and captures the second highest variance. Projecting data onto the top k eigenvectors minimizes reconstruction error.",
          "**PCA vs LDA:** PCA is unsupervised: it cares only about variance, completely blind to class labels. LDA (Linear Discriminant Analysis) is supervised: it finds axes that maximize between-class variance while minimizing within-class variance.",
          "**Reinforcement Learning Mechanics:** Unlike supervised learning where correct labels are provided, an RL agent learns by trial and error through rewards and penalties. Bellman Equation: The value of a state equals the immediate reward plus the discounted value of the next state: `V(s) = R(s) + γ * V(s')`.",
          "**Q-Learning:** Model-free tabular algorithm. Updates the action-value function Q(s, a) using temporal difference: `Q(s, a) := Q(s, a) + α * [R + γ * max_a' Q(s', a') - Q(s, a)]`."
        ],
        "examDefinitions": [
          "**Principal Component Analysis (PCA):** An unsupervised linear dimensionality reduction technique that transforms a dataset into a set of linearly uncorrelated orthogonal variables called principal components ordered by variance.",
          "**Markov Decision Process (MDP):** A mathematical framework for modeling decision making in environments where outcomes are partly random and partly under the control of a decision maker, defined by tuple (S, A, P, R, γ).",
          "**Bellman Equation:** A fundamental recursive equation in dynamic programming and reinforcement learning that decomposes the value of a decision state into immediate reward plus discounted future value.",
          "**Q-Learning:** A model-free reinforcement learning algorithm that learns the optimal quality value Q(s, a) of executing action a in state s without requiring a transition probability model of the environment."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between PCA and LDA?",
            "answer": "PCA is an unsupervised technique that maximizes the total variance of the data regardless of class labels. LDA is a supervised technique that explicitly maximizes the ratio of between-class variance to within-class variance to maximize class separability."
          },
          {
            "question": "Explain the role of the discount factor γ (gamma) in Reinforcement Learning.",
            "answer": "The discount factor γ (0 <= γ <= 1) determines the importance of future rewards versus immediate rewards. If γ = 0, the agent is short-sighted and prioritizes only immediate reward. As γ approaches 1, the agent weighs future long-term rewards equally with immediate rewards."
          },
          {
            "question": "Why must the covariance matrix be calculated in PCA?",
            "answer": "The covariance matrix captures the pairwise linear correlations between all feature pairs and measures feature variances along the diagonal. The eigenvectors of this matrix point in the directions of maximum variance (principal components), and eigenvalues give the variance magnitude along each axis."
          }
        ],
        "questions5Mark": [
          {
            "question": "Derive the step-by-step algorithm for Principal Component Analysis (PCA).",
            "answer": "1. **Step 1 (Standardization):** Subtract mean μ and divide by standard deviation for all n features so each feature has mean 0 and variance 1.\n2. **Step 2 (Covariance Matrix):** Compute the n x n covariance matrix: `Σ = (1 / m) * X^T * X`.\n3. **Step 3 (Eigendecomposition):** Calculate the eigenvalues λ_i and eigenvectors v_i of Σ such that `Σ * v_i = λ_i * v_i`.\n4. **Step 4 (Sorting & Selection):** Sort eigenvalues in descending order: λ_1 >= λ_2 >= ... >= λ_n. Select the top k eigenvectors corresponding to the top k eigenvalues.\n5. **Step 5 (Projection):** Form projection matrix `W = [v_1, v_2, ..., v_k]`. Transform original data X (m x n) to reduced subspace Z (m x k): `Z = X * W`.",
            "diagramDescription": "2D scatter plot showing orthogonal eigenvector axes aligned with the highest variance ellipse."
          },
          {
            "question": "Explain the Q-Learning algorithm. Write the Bellman temporal difference update rule for Q(s, a).",
            "answer": "1. **Q-Table Definition:** Stores estimated total discounted reward Q(s, a) for every state s and action a.\n2. **Update Rule:**\n   `Q(s, a) := Q(s, a) + α * [ R(s, a) + γ * max_{a'} Q(s', a') - Q(s, a) ]`\n   - `α`: Learning rate (0 < α <= 1).\n   - `R(s, a)`: Immediate reward received after taking action a in state s.\n   - `γ`: Discount factor (0 <= γ < 1).\n   - `s'`: Next state entered.\n   - `max_{a'} Q(s', a')`: Best estimated future value from state s'.\n   - Term in brackets is the **Temporal Difference (TD) Error**.\n3. **Action Selection:** Uses ε-greedy policy (explores random action with probability ε; exploits best known action with probability 1-ε).",
            "diagramDescription": "Agent-Environment interaction loop showing state transition, reward feedback, and Q-table update."
          }
        ],
        "questions8Mark": [
          {
            "question": "Formulate a Markov Decision Process (MDP) mathematically. Explain value iteration and policy iteration algorithms for solving MDPs. Compare them with algorithmic steps.",
            "answer": "1. **Formal MDP Definition (2 marks):** Tuple (S, A, P, R, γ) where S is states, A is actions, P(s'|s,a) is transition probability, R(s,a,s') is reward function, γ in [0, 1) is discount factor.\n2. **Bellman Optimality Equations (2 marks):**\n   `V*(s) = max_a ∑_{s'} P(s'|s,a) [ R(s,a,s') + γ * V*(s') ]`.\n   `Q*(s,a) = ∑_{s'} P(s'|s,a) [ R(s,a,s') + γ * max_{a'} Q*(s',a') ]`.\n3. **Value Iteration Algorithm (2 marks):** Starts with arbitrary V_0(s). Iteratively applies Bellman backup: `V_{k+1}(s) := max_a ∑ P(s'|s,a) [ R + γ V_k(s') ]` until `max_s |V_{k+1}(s) - V_k(s)| < ε`. Derives optimal policy at the end.\n4. **Policy Iteration Algorithm (2 marks):** Starts with arbitrary policy π_0.\n   - **Policy Evaluation:** Compute exact V^π(s) by solving linear system.\n   - **Policy Improvement:** Update policy greedily: `π_{new}(s) = argmax_a ∑ P(s'|s,a) [ R + γ V^π(s') ]`.\n   - Halts when policy stops changing. Converges in fewer iterations than Value Iteration."
          }
        ]
      }
    }
  },
  "pbcst504": {
    "subjectCode": "PBCST504",
    "subjectTitle": "Microcontrollers",
    "references": [
      "Muhammad Ali Mazidi, Janice Gillispie Mazidi, Rolin D. McKinlay, The 8051 Microcontroller and Embedded Systems: Using Assembly and C, Pearson, 2nd Edition, 2007",
      "Steve Furber, ARM System-on-Chip Architecture, Pearson, 2nd Edition, 2000",
      "Jonathan W. Valvano, Embedded Systems: Introduction to ARM Cortex-M Microcontrollers, CreateSpace, 5th Edition, 2014",
      "Raj Kamal, Embedded Systems: Architecture, Programming and Design, McGraw Hill, 3rd Edition, 2014"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction to Microcontrollers & 8051 Architecture",
        "syllabusTopics": [
          "Embedded systems basics, Microcontroller vs Microprocessor",
          "Overview of 8051 and AVR microcontroller families",
          "8051 Architecture: Block diagram, pin diagram, oscillator and reset circuits",
          "Memory organization: Internal 128B RAM map, Register Banks 0-3, Bit-addressable RAM, Scratchpad RAM",
          "Special Function Registers (SFRs): ACC, B, PSW, SP, DPTR, Ports P0-P3"
        ],
        "conceptualWalkthrough": [
          "**The Microcontroller Revolution:** While desktop CPUs require external chips, the 8051 combines CPU, 128 bytes RAM, 4 KB ROM, 32 I/O lines, two timers, and serial port on a single 40-pin IC, operating at 12 MHz.",
          "**Harvard Architecture Separation:** Program code (ROM) and data (RAM) have separate address spaces. Code cannot accidentally overwrite data, and data cannot execute as code, improving embedded reliability.",
          "**Internal RAM Partitioning (128 Bytes):**\n- `00H - 1FH` (32 bytes): 4 Register Banks (Bank 0, 1, 2, 3), each with registers R0-R7. Switched using RS1, RS0 in PSW.\n- `20H - 2FH` (16 bytes): Bit-addressable RAM! 128 individually addressable bits (00H - 7FH) manipulated with instructions like `SETB` and `CLR`.\n- `30H - 7FH` (80 bytes): Scratchpad RAM and safe stack area.",
          "**Port 0 Open-Drain Structure:** Unlike Ports 1, 2, 3 which have internal pull-ups, Port 0 has open-drain FETs. When used as general output, external 10 kΩ pull-up resistors are mandatory."
        ],
        "examDefinitions": [
          "**Microcontroller:** An integrated circuit containing a processor core, memory (RAM/ROM), programmable input/output peripherals, and timers designed for embedded control applications.",
          "**Harvard Architecture:** A computer architecture with physically separate storage and signal pathways for instructions and data.",
          "**Program Status Word (PSW):** An 8-bit register in the 8051 containing status flags (CY, AC, OV, P) and register bank selection control bits (RS1, RS0).",
          "**Bit-Addressable RAM:** A 16-byte section of 8051 internal RAM (20H-2FH) containing 128 individual bit locations (00H-7FH) that can be set, cleared, or tested directly by single-bit instructions."
        ],
        "questions3Mark": [
          {
            "question": "What is the function of the EA pin in 8051?",
            "answer": "EA (External Access) selects the program memory source. When tied to VCC (high), 8051 executes from on-chip 4KB ROM (0000H-0FFFH). When tied to GND (low), it fetches all code exclusively from external ROM."
          },
          {
            "question": "Why does Port 0 of the 8051 require external pull-up resistors when used as general I/O?",
            "answer": "Port 0 uses open-drain FET transistors without internal pull-ups. To drive a logic HIGH (+5V) level in general I/O mode, external pull-up resistors (typically 10 kΩ) are required."
          },
          {
            "question": "What happens to the Stack Pointer (SP) on 8051 reset and where is the safe stack location?",
            "answer": "On reset, SP defaults to 07H. The first PUSH writes to 08H, which collides with Register Bank 1. To avoid corruption, programmers reinitialize SP to `MOV SP, #30H`, placing the stack in scratchpad RAM."
          }
        ],
        "questions5Mark": [
          {
            "question": "Draw and explain the internal RAM memory organization of the 8051 microcontroller.",
            "answer": "1. **128 Bytes Internal RAM (00H - 7FH):**\n   - **Register Banks (00H - 1FH, 32 bytes):** 4 banks (Bank 0, 1, 2, 3), each containing 8 registers (R0-R7). Active bank selected by RS1, RS0 bits in PSW.\n   - **Bit-Addressable RAM (20H - 2FH, 16 bytes):** 128 bits numbered 00H to 7FH. Controlled by instructions like `SETB 05H`, `CLR 20H.1`.\n   - **Scratchpad RAM (30H - 7FH, 80 bytes):** General storage and user stack.\n2. **Special Function Registers (80H - FFH):** 128 bytes address space containing ACC, B, PSW, SP, DPTR, P0-P3.",
            "diagramDescription": "Vertical memory layout showing 00H-1FH (Banks), 20H-2FH (Bit RAM), 30H-7FH (Scratchpad), and 80H-FFH (SFRs)."
          },
          {
            "question": "Explain the bit structure of the Program Status Word (PSW) register in 8051.",
            "answer": "1. **PSW Format:** `[CY, AC, F0, RS1, RS0, OV, -, P]`\n2. **CY (Bit 7):** Carry flag from arithmetic operations.\n3. **AC (Bit 6):** Auxiliary Carry flag (carry from bit 3 to 4, used in BCD arithmetic).\n4. **F0 (Bit 5):** User-defined general purpose flag.\n5. **RS1, RS0 (Bits 4, 3):** Register bank select: 00=Bank 0 (00H-07H), 01=Bank 1 (08H-0FH), 10=Bank 2 (10H-17H), 11=Bank 3 (18H-1FH).\n6. **OV (Bit 2):** Signed overflow flag.\n7. **Bit 1 (-):** Reserved.\n8. **P (Bit 0):** Parity flag (1 if ACC has odd number of 1s; 0 if even)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Draw the complete architectural block diagram of the 8051 microcontroller. Explain the functions of CPU, Timers, I/O Ports, Oscillator, and Interrupt controller.",
            "answer": "1. **Architectural Diagram (3.5 marks):** Central ALU, Accumulator, B Register, Program Counter (16b), DPTR (16b), SP (8b), 128B RAM, 4KB ROM, Timer 0 & 1, I/O Ports P0-P3, Serial Port (UART), Interrupt Logic, Oscillator circuit.\n2. **ALU & Core Registers (1.5 marks):** 8-bit ALU performs arithmetic and boolean logic. Accumulator A is primary operand register; B is used in MUL and DIV.\n3. **Timers & Serial Subsystem (1.5 marks):** Two 16-bit timers (Timer 0, Timer 1) configurable as timers or event counters using TMOD and TCON. Full-duplex UART using SCON and SBUF.\n4. **Interrupt Controller (1.5 marks):** 5 interrupt sources: INT0, INT1 (external), Timer 0, Timer 1, and Serial communication (RI/TI). Controlled by IE and IP registers."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: 8051 Programming, Timers & Peripherals",
        "syllabusTopics": [
          "8051 Addressing Modes: Immediate, Direct, Indirect, Register, Indexed",
          "Instruction set: Data transfer, Arithmetic, Logical, Boolean, Branching",
          "Timers and Counters: TMOD register, TCON register, Timer Mode 0, 1, 2 (Auto-reload)",
          "Interrupt structure: Interrupt vector table, IE and IP registers",
          "Serial communication: UART modes, SCON, SBUF, Baud rate generation using Timer 1",
          "Interfacing peripherals: LED, 7-Segment displays, Switches, ADC 0808, DAC 0808"
        ],
        "conceptualWalkthrough": [
          "**Addressing Modes in Action:**\n- Immediate: `MOV A, #25H` (literal value)\n- Direct: `MOV A, 30H` (contents of internal RAM address 30H)\n- Indirect: `MOV A, @R0` (pointer in R0 holds target RAM address)\n- Indexed: `MOVC A, @A+DPTR` (look up table in ROM)",
          "**Timer Mode 2 (8-Bit Auto-Reload):** Timer 1 in Mode 2 automatically reloads the initial value from TH1 into TL1 every time TL1 overflows from FFH to 00H, generating crystal-accurate periodic clock ticks. This is the foundation of standard UART baud rate generation (e.g. 9600 baud).",
          "**Interrupt Vectoring:** When an interrupt triggers, 8051 hardware automatically saves PC onto stack and jumps to fixed ROM address: Reset (0000H), External INT0 (0003H), Timer 0 (000BH), External INT1 (0013H), Timer 1 (001BH), Serial (0023H)."
        ],
        "examDefinitions": [
          "**Machine Cycle:** The basic timing block of the 8051 microcontroller consisting of 12 oscillator clock periods (1 μs at 12 MHz).",
          "**TMOD Register:** An 8-bit Special Function Register that configures the operating modes (Modes 0, 1, 2, 3) and gating for Timers 0 and 1.",
          "**Interrupt Service Routine (ISR):** A specialized program subroutine executed automatically by hardware upon the assertion of an interrupt signal.",
          "**Baud Rate:** The rate at which serial data is transmitted across a communication channel, expressed in symbols or bits per second (bps)."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Timer Mode 1 and Timer Mode 2 in 8051?",
            "answer": "Mode 1 is a 16-bit timer (TH + TL) counting from 0000H to FFFFH; once it overflows, it must be reloaded with initial values manually by software. Mode 2 is an 8-bit auto-reload timer: TL holds the active count and automatically reloads from TH upon overflow without software intervention."
          },
          {
            "question": "Explain the significance of the GATE bit in the TMOD register.",
            "answer": "When GATE = 0, the timer is started or stopped solely by software using the TRx bit in TCON. When GATE = 1, the timer is started only when TRx = 1 AND the hardware external interrupt pin INTx is held HIGH, allowing external pulse-width measurement."
          },
          {
            "question": "Write the 8051 assembly instructions to configure Timer 1 in Mode 2 (8-bit auto-reload).",
            "answer": "`MOV TMOD, #20H` (sets Timer 1 Mode 2, Gate=0, Counter=0, leaving Timer 0 unchanged)."
          }
        ],
        "questions5Mark": [
          {
            "question": "Write an 8051 assembly language program to generate a 1 kHz square wave on pin P1.0 using Timer 0 in Mode 1 with a 12 MHz crystal.",
            "answer": "1. **Calculation:** Clock frequency = 12 MHz / 12 = 1 MHz (1 machine cycle = 1 μs). Period T = 1 ms = 1000 μs. Half-period = 500 μs. Count = 65536 - 500 = 65036 = `FE0CH` (TH0=FEH, TL0=0CH).\n2. **Assembly Program:**\n```assembly\n          MOV TMOD, #01H    ; Timer 0 Mode 1 (16-bit)\nAGAIN:    MOV TH0, #0FEH    ; Load upper byte\n          MOV TL0, #0CH     ; Load lower byte\n          SETB TR0          ; Start Timer 0\nWAIT:     JNB TF0, WAIT     ; Wait for overflow\n          CLR TR0           ; Stop timer\n          CLR TF0           ; Clear overflow flag\n          CPL P1.0          ; Toggle pin P1.0\n          SJMP AGAIN        ; Repeat\n```"
          },
          {
            "question": "Explain the interrupt structure of the 8051 microcontroller. State the vector addresses and priority control.",
            "answer": "1. **5 Interrupt Sources & Vector Table:**\n   - Reset: 0000H\n   - External Interrupt 0 (INT0): 0003H\n   - Timer 0 Overflow (TF0): 000BH\n   - External Interrupt 1 (INT1): 0013H\n   - Timer 1 Overflow (TF1): 001BH\n   - Serial Port (RI/TI): 0023H\n2. **Interrupt Enable (IE) Register:** Contains EA (global enable) and individual enables EX0, ET0, EX1, ET1, ES.\n3. **Interrupt Priority (IP) Register:** Allows assigning High or Low priority to each interrupt source."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the hardware interfacing of an ADC 0808 to an 8051 microcontroller. Draw the schematic diagram and write the assembly code to read analog channel 0 and store the digital output in RAM.",
            "answer": "1. **Hardware Connections (3 marks):** ADC 0808 8-bit digital outputs D0-D7 connected to Port 1. Channel address pins A, B, C connected to P2.0, P2.1, P2.2 (set to 000 for Channel 0). Control lines: ALE & START connected to P2.3, EOC (End of Conversion) connected to P2.4, OE (Output Enable) connected to P2.5.\n2. **Signal Timing Sequence (2 marks):** Pulse ALE and START high to latch channel address and start conversion. Wait for EOC pin to go high. Assert OE high to read digital data onto bus.\n3. **Assembly Program (3 marks):**\n```assembly\n          MOV P1, #0FFH     ; Configure Port 1 as input\n          MOV P2, #00H      ; Select Channel 0 (A=B=C=0)\n          SETB P2.3         ; ALE & START high\n          NOP\n          CLR P2.3          ; Latch & Start conversion\nWAIT_EOC: JNB P2.4, WAIT_EOC ; Wait until EOC is HIGH\n          SETB P2.5         ; Assert Output Enable (OE)\n          MOV A, P1         ; Read 8-bit digital output\n          CLR P2.5          ; Disable OE\n          MOV 30H, A        ; Store result in RAM address 30H\n```",
            "diagramDescription": "Schematic wiring diagram connecting 8051 microcontroller Port 1 and Port 2 pins to ADC 0808."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: ARM Microcontrollers & Cortex-M Architecture",
        "syllabusTopics": [
          "ARM architecture features: RISC design philosophy, 32-bit load/store architecture",
          "Cortex-M Processor Core: Registers (R0-R15), xPSR, MSP vs PSP stack pointers",
          "Exceptions and Interrupts: Nested Vectored Interrupt Controller (NVIC)",
          "Memory map: Bus matrix, bit-banding concept",
          "Embedded C programming for ARM Cortex-M: CMSIS headers, GPIO configuration"
        ],
        "conceptualWalkthrough": [
          "**From 8-bit 8051 to 32-bit ARM:** The 8051 is an 8-bit CISC processor. ARM Cortex-M is a 32-bit modern RISC processor powering billions of modern smartphones, automotive ECUs, and drones.",
          "**Cortex-M Dual Stack Pointers:** Cortex-M has two stack pointers: Main Stack Pointer (MSP) used by the operating system kernel and interrupt handlers, and Process Stack Pointer (PSP) used by application tasks. This prevents user bugs from corrupting the kernel stack.",
          "**Nested Vectored Interrupt Controller (NVIC):** Highly deterministic low-latency interrupt controller built directly into the silicon core. Supports priority preemption, tail-chaining (back-to-back interrupt execution without restoring state), and late-arriving interrupt preemption.",
          "**Bit-Banding:** A hardware trick that maps an entire 32-bit word address space to individual bits of SRAM and peripherals. Allows performing atomic bit-set and bit-clear operations with a single memory write instruction, completely eliminating race conditions without disabling interrupts!"
        ],
        "examDefinitions": [
          "**ARM Cortex-M:** A family of 32-bit RISC ARM processor cores optimized for low-cost, energy-efficient microcontrollers and embedded applications.",
          "**NVIC (Nested Vectored Interrupt Controller):** An on-chip interrupt controller integrated into ARM Cortex-M cores providing low-latency interrupt processing with hardware vectoring, priority levels, and tail-chaining.",
          "**Bit-Banding:** An ARM Cortex-M memory feature that maps each individual bit in a 1 MB memory region to a unique 32-bit word in a 32 MB alias region, allowing atomic bit manipulation.",
          "**Tail-Chaining:** An NVIC optimization where an interrupt handler executes immediately after another without popping and pushing registers to/from the stack, reducing latency to 6 clock cycles."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Main Stack Pointer (MSP) and Process Stack Pointer (PSP) in ARM Cortex-M?",
            "answer": "MSP is the default stack pointer used by the OS kernel, privileged code, and all exception/interrupt handlers. PSP is used by unprivileged user-mode application tasks, isolating task stack overflows from crashing the kernel."
          },
          {
            "question": "Explain the concept of Tail-Chaining in ARM NVIC.",
            "answer": "When an interrupt occurs while another ISR is already finishing, instead of executing a full unstacking followed by restacking, the processor skips both and chains directly to the next ISR in 6 clock cycles, drastically cutting interrupt latency."
          },
          {
            "question": "What is Bit-Banding in ARM Cortex-M?",
            "answer": "Bit-banding maps individual bits in a 1MB memory region to individual 32-bit words in a 32MB alias region. Writing to the alias word atomically modifies the single target bit in hardware, preventing read-modify-write race conditions."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the programmer's model and register organization of the ARM Cortex-M processor.",
            "answer": "1. **General Purpose Registers (R0 - R12):** 32-bit registers. R0-R7 are low registers accessible by all 16-bit Thumb instructions; R8-R12 are high registers.\n2. **R13 (Stack Pointer SP):** Physically banked into Main Stack Pointer (MSP) and Process Stack Pointer (PSP).\n3. **R14 (Link Register LR):** Holds return address when a function call or exception occurs.\n4. **R15 (Program Counter PC):** Current instruction execution address.\n5. **Special Registers (xPSR):** Combination of Application PSR (APSR flags N, Z, C, V), Interrupt PSR (IPSR holding active exception number), and Execution PSR (EPSR holding Thumb state bit T).",
            "diagramDescription": "Register layout diagram showing R0 to R15, banked SP, and xPSR composition."
          },
          {
            "question": "Describe the Nested Vectored Interrupt Controller (NVIC) features and explain how it handles interrupt prioritization.",
            "answer": "1. **Key Features:** Low-latency interrupt entry, automatic state saving on stack (R0-R3, R12, LR, PC, xPSR), non-maskable interrupt (NMI), up to 240 external interrupt lines.\n2. **Priority Grouping:** Uses 8-bit priority registers split into Preemption Priority and Subpriority.\n3. **Preemption:** A higher preemption priority interrupt immediately interrupts an ongoing lower priority ISR.\n4. **Tie-breaking:** If two interrupts share the same preemption priority, the subpriority determines which executes first when both trigger simultaneously."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the architecture of the ARM Cortex-M processor. Describe its bus structure, memory mapping, and exception handling mechanism.",
            "answer": "1. **Core Architecture (3 marks):** 3-stage pipeline (Fetch, Decode, Execute) supporting Thumb-2 instruction set (combines 16-bit code density with 32-bit performance). Harvard bus matrix with I-Code bus, D-Code bus, and System bus.\n2. **Memory Map (2 marks):** 4 GB unified linear address space: Code (0x00000000 - 0x1FFFFFFF), SRAM (0x20000000 - 0x3FFFFFFF, including bit-band region), Peripherals (0x40000000 - 0x5FFFFFFF), External RAM, Internal System (NVIC, SysTick at 0xE0000000).\n3. **Exception Entry & Stacking Sequence (3 marks):**\n   - Hardware automatically pushes 8 registers onto current stack: R0, R1, R2, R3, R12, LR, PC, xPSR in 12 clock cycles.\n   - Fetches ISR vector address from vector table simultaneously.\n   - Loads EXC_RETURN value into LR.\n   - Executes ISR.\n   - On return (BX LR), hardware automatically pops the 8 registers and resumes background task."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Applications and Embedded System Design",
        "syllabusTopics": [
          "Embedded system design cycle: Requirements, architecture, hardware-software co-design",
          "Real-time systems and RTOS basics: Tasks, states, task scheduling (Preemptive vs Cooperative), context switching",
          "Interfacing sensors and actuators: Temperature sensors (LM35), Stepper motor drive, Relay interfacing",
          "Introduction to IoT applications using microcontrollers: Wireless modules (Wi-Fi, Bluetooth, Zigbee)",
          "Development and debugging tools: Emulators, Logic Analyzers, JTAG / SWD debugging interface"
        ],
        "conceptualWalkthrough": [
          "**Why RTOS over Bare-Metal Super-Loops?** In a bare-metal `while(1)` super-loop, a slow operation (like waiting for ADC conversion) delays all other tasks. A Real-Time Operating System (RTOS) like FreeRTOS splits software into independent Tasks; the preemptive scheduler switches context to high-priority tasks in microseconds.",
          "**Stepper Motor Control:** Stepper motors do not spin continuously like DC motors; they rotate in discrete angular steps (e.g. 1.8° per step, 200 steps/rev). Controlled by pulsing stator coils in sequence (Full-step, Half-step, Microstepping) via driver ICs like ULN2003 or L298N.",
          "**SWD / JTAG Debugging:** Serial Wire Debug (SWD) uses just two pins (SWDIO and SWCLK) instead of JTAG's 5 pins. Allows software developers to set hardware breakpoints, single-step machine code, and inspect RAM values in real-time without halting CPU peripherals."
        ],
        "examDefinitions": [
          "**Real-Time Operating System (RTOS):** An operating system designed to serve real-time application requests with strictly bounded, deterministic response latencies.",
          "**Context Switching:** The process of storing the CPU register state of an active task and restoring the state of another ready task so that execution can resume seamlessly.",
          "**Stepper Motor:** A brushless DC electric motor that divides a full 360-degree rotation into a number of equal angular steps by energizing stator magnetic poles in sequence.",
          "**JTAG (Joint Test Action Group):** An industry standard interface (IEEE 1149.1) used for testing printed circuit boards and performing in-circuit microcontroller programming and hardware debugging."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Hard Real-Time and Soft Real-Time systems?",
            "answer": "In Hard Real-Time systems (e.g. airbag deployment, pacemakers), missing a deadline results in total catastrophic system failure. In Soft Real-Time systems (e.g. video streaming), missing a deadline degrades quality of service but does not cause system failure."
          },
          {
            "question": "Why is a flyback diode required when driving an inductive relay coil from a microcontroller pin?",
            "answer": "When current to the relay coil is suddenly switched off, the collapsing magnetic field induces a massive reverse high-voltage spike (V = -L * di/dt) that will destroy the driving transistor. A flyback diode connected in reverse-bias across the coil safely dissipates this inductive energy."
          },
          {
            "question": "Compare SWD (Serial Wire Debug) and JTAG debugging interfaces.",
            "answer": "JTAG uses 4 to 5 pins (TDI, TDO, TCK, TMS, TRST) and supports boundary scan chaining across multiple ICs. SWD is an ARM-specific protocol that uses only 2 pins (SWDIO bidirectional data and SWCLK clock), saving 3 precious microcontroller package pins."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working of a Stepper Motor and write the step sequence for full-step 4-phase unipolar operation.",
            "answer": "1. **Principle:** Rotor has permanent magnetic teeth. Stator has 4 electromagnetic coils (A, B, C, D). Energizing coils in sequence pulls the rotor teeth into alignment step by step.\n2. **4-Step Full-Step Sequence:**\n   - Step 1: Coil A = 1, B = 0, C = 0, D = 1\n   - Step 2: Coil A = 1, B = 1, C = 0, D = 0\n   - Step 3: Coil A = 0, B = 1, C = 1, D = 0\n   - Step 4: Coil A = 0, B = 0, C = 1, D = 1\n3. **Driver Circuit:** Microcontroller pins cannot supply the 500mA coil current. A ULN2003 Darlington transistor array is connected between the microcontroller port and the motor coils.",
            "diagramDescription": "Schematic of microcontroller connected through ULN2003 driver IC to 4-phase unipolar stepper motor."
          },
          {
            "question": "Describe the task states and preemptive priority-based scheduling in a Real-Time Operating System (RTOS).",
            "answer": "1. **Task States:**\n   - **Running:** Currently executing on the CPU.\n   - **Ready:** Ready to execute, waiting for CPU allocation.\n   - **Blocked / Waiting:** Waiting for an event, timer delay, or semaphore resource.\n   - **Suspended:** Explicitly halted by software.\n2. **Preemptive Scheduling:** The scheduler guarantees that the highest-priority Ready task always executes. If a high-priority task unblocks, the scheduler immediately saves the context of the running task and switches to the high-priority task without waiting for the running task to yield."
          }
        ],
        "questions8Mark": [
          {
            "question": "Design an Internet of Things (IoT) Temperature and Humidity Monitoring System using an ARM microcontroller and Wi-Fi module. Detail the sensor interfacing, communication protocol, power management, and cloud data logging.",
            "answer": "1. **System Architecture (2.5 marks):** Hardware block diagram showing ARM Cortex-M microcontroller, DHT22/LM35 temperature sensor, ESP8266/ESP32 Wi-Fi module, OLED status display, and 3.3V power regulator.\n2. **Sensor Interfacing & Data Acquisition (2 marks):** Single-wire digital communication with DHT22. Microcontroller asserts start signal, reads 40-bit packet (16b humidity, 16b temperature, 8b checksum), and verifies parity.\n3. **Wireless Communication Protocol (2 marks):** Uses AT commands over UART at 115200 baud to connect to local Wi-Fi router. Connects via TCP to MQTT broker or HTTP REST API endpoint on cloud server (e.g. AWS IoT Core or ThingsBoard) using JSON payload: `{\"temp\": 28.4, \"humidity\": 65.2}`.\n4. **Power Optimization & Sleep Modes (1.5 marks):** Microcontroller configures Low Power Sleep / Deep Sleep mode, waking up periodically via RTC alarm every 5 minutes to take readings, reducing average current from 50 mA to < 20 μA for battery operation."
          }
        ]
      }
    }
  },
  "pecst522": {
    "subjectCode": "PECST522",
    "subjectTitle": "Artificial Intelligence",
    "references": [
      "Stuart Russell, Peter Norvig, Artificial Intelligence: A Modern Approach, Pearson, 3rd/4th Edition, 2020",
      "Elaine Rich, Kevin Knight, Shivashankar B. Nair, Artificial Intelligence, McGraw-Hill, 3rd Edition, 2009",
      "Ivan Bratko, Prolog Programming for Artificial Intelligence, Pearson, 4th Edition, 2011"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction and Intelligent Agents",
        "syllabusTopics": [
          "Definition, foundations and history of Artificial Intelligence",
          "Turing Test: Formulation, Loebner prize, Chinese Room argument",
          "Intelligent Agents: PEAS framework (Performance measure, Environment, Actuators, Sensors)",
          "Environment properties: Fully vs Partially observable, Deterministic vs Stochastic, Episodic vs Sequential, Static vs Dynamic, Discrete vs Continuous, Single vs Multi-agent",
          "Agent Architectures: Simple reflex agents, Model-based reflex agents, Goal-based agents, Utility-based agents, Learning agents"
        ],
        "conceptualWalkthrough": [
          "**The Rationality Benchmark:** In modern AI, intelligence is defined not by human-like thinking (which includes cognitive fallacies and biases), but by **rational action**: selecting actions that maximize expected performance based on current percepts and background knowledge.",
          "**The PEAS Framework:** Before writing a single line of AI code, define:\n- **P (Performance):** Safe arrival, minimal fuel, speed.\n- **E (Environment):** Roads, other traffic, pedestrians, weather.\n- **A (Actuators):** Steering wheel, accelerator, brakes, signals.\n- **S (Sensors):** Cameras, LiDAR, radar, GPS, speedometer.",
          "**Agent Taxonomies:**\n- Simple Reflex: `condition -> action` rules (blind to history).\n- Model-based: Maintains internal state of how the world evolves.\n- Goal-based: Evaluates whether an action brings it closer to a desired goal state.\n- Utility-based: Balances multiple competing goals using a utility function (happiness/efficiency tradeoff)."
        ],
        "examDefinitions": [
          "**Rational Agent:** An entity that acts so as to achieve the best outcome or, when there is uncertainty, the best expected outcome according to its performance measure.",
          "**PEAS Framework:** A systematic specification methodology for task environments defining Performance Measure, Environment, Actuators, and Sensors.",
          "**Turing Test:** A test proposed by Alan Turing (1950) evaluating whether a machine can exhibit intelligent behavior indistinguishable from that of a human through text conversation.",
          "**Utility Function:** A mathematical mapping from state space to real numbers `U: S → R` measuring the degree of desirability or preference of an agent in a given state."
        ],
        "questions3Mark": [
          {
            "question": "What is the Chinese Room argument and what was it formulated to refute?",
            "answer": "Formulated by philosopher John Searle (1980) to refute 'Strong AI' (the claim that executing a computer program constitutes real understanding/consciousness). A person inside a room manipulates Chinese symbols using an English rulebook, producing valid Chinese answers without understanding a single word of Chinese. Searle argued that syntactic symbol manipulation does not equal semantics/understanding."
          },
          {
            "question": "Explain the difference between Episodic and Sequential environments.",
            "answer": "In an Episodic environment, the agent's experience is divided into atomic episodes; the current action has zero impact on future episodes (e.g. classifying single images). In a Sequential environment, current decisions affect all future states (e.g. chess, driving a car)."
          },
          {
            "question": "Specify the PEAS description for an Automated Taxi Driver.",
            "answer": "1. **Performance:** Safe, fast, legal, comfortable trip, maximum profit.\n2. **Environment:** City streets, highways, traffic, pedestrians, weather.\n3. **Actuators:** Steering wheel, accelerator, brake, turn signals, horn.\n4. **Sensors:** Cameras, LiDAR, radar, GPS, speedometer, engine sensors."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the architecture of a Model-Based Reflex Agent and a Learning Agent with block diagrams.",
            "answer": "1. **Model-Based Reflex Agent:** Handles partially observable environments by maintaining internal state. Combines current percept with knowledge of 'How the world evolves' and 'What my actions do' to update internal state, then applies condition-action rules.\n2. **Learning Agent:** Separated into 4 functional components:\n   - **Learning Element:** Makes improvements based on performance feedback.\n   - **Performance Element:** Selects external actions using current policy.\n   - **Critic:** Evaluates agent behavior against an external performance standard.\n   - **Problem Generator:** Suggests exploratory actions to discover new experiences.",
            "diagramDescription": "Block schematics showing sensor-state-actuator loop for Model-Based and Learning Element-Critic loop for Learning Agent."
          },
          {
            "question": "Classify the task environments of Chess with a clock, Poker, and Medical Diagnosis across all 6 environment dimensions.",
            "answer": "1. **Chess with Clock:** Fully observable, Deterministic, Sequential, Semi-dynamic (clock runs), Discrete, Multi-agent (competitive).\n2. **Poker:** Partially observable (hidden cards), Stochastic (deck shuffle), Sequential, Static, Discrete, Multi-agent (competitive/cooperative).\n3. **Medical Diagnosis:** Partially observable (hidden pathology), Stochastic (unpredictable symptoms), Sequential, Dynamic, Continuous, Single-agent."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the evolution of Agent Architectures from Simple Reflex to Utility-Based and Learning Agents. Discuss their internal mechanisms, capabilities, and failure modes with concrete examples.",
            "answer": "1. **Simple Reflex Agents (2 marks):** Direct condition-action mapping `if condition then action`. Infinite loops occur in partially observable environments (e.g. vacuum cleaner with no location sensor).\n2. **Model-Based Reflex Agents (2 marks):** Internal state representation tracks unobserved world aspects. Requires model transition knowledge `P(s'|s,a)`.\n3. **Goal-Based Agents (2 marks):** Incorporates explicit goal state descriptions. Combines search and planning algorithms to find sequences of actions that reach the goal.\n4. **Utility-Based Agents (2 marks):** Goals provide binary success/failure. When trade-offs exist (e.g. speed vs safety in driving), utility function `U(s)` scores state quality to make optimal rational decisions under uncertainty."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Problem Solving and Search Algorithms",
        "syllabusTopics": [
          "Problem formulation: Initial state, Actions, Transition model, Goal test, Path cost",
          "Uninformed Search: Breadth-First Search (BFS), Uniform Cost Search (UCS), Depth-First Search (DFS), Depth-Limited Search (DLS), Iterative Deepening DFS (IDDFS)",
          "Informed Heuristic Search: Greedy Best-First Search, A* Algorithm, Admissibility and Consistency of heuristics",
          "Adversarial Search: Two-player zero-sum games, Minimax algorithm, Alpha-Beta pruning, Evaluation functions"
        ],
        "conceptualWalkthrough": [
          "**Formulating Search Problems:** Formally defined by 5 components: Initial state $s_0$, Actions $A(s)$, Transition model $Result(s, a)$, Goal test $G(s)$, and Path cost $c(s, a, s')$.",
          "**The Power of Iterative Deepening (IDDFS):** Combines the space efficiency of DFS ($O(b \\cdot d)$ memory) with the completeness and optimality of BFS! While it repeats upper levels, the number of nodes at bottom level $b^d$ dominates so heavily that repeated overhead is only a negligible fraction $(b/(b-1))$.",
          "**A\\* Optimality Theorem:** If heuristic $h(n)$ is admissible (never overestimates true cost $h^*(n)$), A* tree search is provably optimal. If $h(n)$ is consistent (monotonic: $h(n) \\le c(n, a, n') + h(n')$), A* graph search is optimal without ever reopening closed nodes.",
          "**Alpha-Beta Pruning:** In game playing (Chess, Checkers), Minimax searches the complete game tree up to depth d ($O(b^d)$). Alpha-Beta pruning tracks $\u0007lpha$ (highest value MAX is guaranteed) and $\beta$ (lowest value MIN is guaranteed). If $\u0007lpha \\ge \beta$, the subtree is pruned without evaluating, doubling the effective search depth!"
        ],
        "examDefinitions": [
          "**State Space:** The configuration space of all possible states reachable from the initial state by any sequence of actions.",
          "**Admissible Heuristic:** A heuristic function $h(n)$ that never overestimates the true cost to reach the nearest goal state: $0 \\le h(n) \\le h^*(n)$ for all nodes $n$.",
          "**Minimax Algorithm:** A decision rule algorithm used in two-player zero-sum games that computes the optimal move for a player assuming the opponent plays optimally.",
          "**Alpha-Beta Pruning:** An optimization algorithm for Minimax that eliminates subtrees that cannot influence the final decision, reducing effective branching factor from $b$ to $\\sqrt{b}$."
        ],
        "questions3Mark": [
          {
            "question": "Why is Iterative Deepening Search (IDDFS) considered the preferred uninformed search strategy for large state spaces?",
            "answer": "IDDFS combines the optimal benefits of BFS (completeness and optimality for uniform step costs) with the minimal memory footprint of DFS ($O(b \\cdot d)$ space instead of $O(b^d)$ in BFS). The overhead of recomputing upper levels is less than 11% for branching factor $b=10$."
          },
          {
            "question": "What is the condition for Alpha-Beta pruning to occur?",
            "answer": "Pruning occurs whenever $\\alpha \\ge \\beta$, where $\\alpha$ is the best value discovered so far for MAX along the path, and $\\beta$ is the best value discovered so far for MIN. If $\\alpha \\ge \\beta$, the current parent node will never select this branch."
          },
          {
            "question": "State the 5 components of a formally defined search problem.",
            "answer": "1. Initial State $s_0$\n2. Actions available in state $s$\n3. Transition Model $Result(s, a)$\n4. Goal Test predicate\n5. Path Cost function $c(s, a, s')$."
          }
        ],
        "questions5Mark": [
          {
            "question": "Trace the A* algorithm on a search graph with given step costs and heuristic values. Explain how admissibility ensures optimality.",
            "answer": "1. **Evaluation Function:** $f(n) = g(n) + h(n)$ where $g(n)$ is cost from start to $n$, and $h(n)$ is heuristic estimate to goal.\n2. **Priority Queue OPEN:** Always expands node with lowest $f(n)$.\n3. **Proof of Optimality:** Suppose A* selects a suboptimal goal $G_2$ with $f(G_2) > C^*$. Since an unexpanded node $n$ on the true optimal path to $G^*$ exists in OPEN, and $h$ is admissible ($h(n) \\le h^*(n)$), we have $f(n) = g(n) + h(n) \\le C^* < f(G_2)$. Hence $n$ would have been expanded before $G_2$, generating a contradiction."
          },
          {
            "question": "Explain the Minimax algorithm and demonstrate Alpha-Beta pruning on a 2-ply game tree.",
            "answer": "1. **Minimax Rule:** MAX nodes maximize utility: $V(s) = \\max_{a} V(Result(s, a))$. MIN nodes minimize utility: $V(s) = \\min_{a} V(Result(s, a))$.\n2. **Pruning Demonstration:**\n   - Node MAX root has children MIN_1 and MIN_2.\n   - MIN_1 evaluates children with values 3 and 5 -> MIN_1 chooses 3. Root $\\alpha$ becomes 3.\n   - MIN_2 evaluates first child with value 2. Since 2 <= $\\alpha$ (3), MIN_2 will choose a value <= 2. Root will never choose MIN_2!\n   - Remaining children of MIN_2 are pruned without evaluation.",
            "diagramDescription": "Game tree with MAX and MIN levels, showing alpha=3, beta=2 cutoff line."
          }
        ],
        "questions8Mark": [
          {
            "question": "Compare BFS, DFS, UCS, DLS, and IDDFS across Completeness, Time Complexity, Space Complexity, and Optimality in a detailed comparative table. Explain the 8-puzzle problem using Manhattan distance heuristic.",
            "answer": "1. **Comprehensive Search Algorithm Comparative Matrix (4 marks):**\n   - **BFS:** Complete: Yes; Time: $O(b^d)$; Space: $O(b^d)$ (fatal bottleneck); Optimal: Yes (if step costs equal).\n   - **DFS:** Complete: No (infinite paths); Time: $O(b^m)$; Space: $O(b \\cdot m)$ (lean); Optimal: No.\n   - **UCS:** Complete: Yes (if step cost $\\ge \\epsilon$); Time: $O(b^{1 + \\lfloor C^*/\\epsilon \\rfloor})$; Space: $O(b^{1 + \\lfloor C^*/\\epsilon \\rfloor})$; Optimal: Yes.\n   - **IDDFS:** Complete: Yes; Time: $O(b^d)$; Space: $O(b \\cdot d)$; Optimal: Yes.\n2. **8-Puzzle Problem Formulation (2 marks):** 3x3 grid with tiles 1..8 and 1 blank space. Move blank Left, Right, Up, Down.\n3. **Manhattan Distance Heuristic (2 marks):** $h(n) = \\sum_{i=1}^8 (|x_i - x_{i,goal}| + |y_i - y_{i,goal}|)$. Admissible because every tile must make at least its Manhattan distance in moves to reach target, and moves cannot move two tiles simultaneously."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Knowledge, Logic and Automated Reasoning",
        "syllabusTopics": [
          "Knowledge-Based Agents: Architecture, Wumpus World environment",
          "Propositional Logic: Syntax, Semantics, Entailment, Inference rules, Resolution, Horn clauses, Forward and Backward chaining",
          "First-Order Predicate Logic (FOL): Syntax, Quantifiers (Universal, Existential), Knowledge engineering in FOL",
          "Inference in FOL: Unification, Generalized Modus Ponens, Forward and Backward Chaining in FOL, Resolution Refutation",
          "Classical Planning: STRIPS representation, States, Goals, Actions (Preconditions, Effects)"
        ],
        "conceptualWalkthrough": [
          "**The Knowledge-Based Architecture:** Unlike reflex agents that hard-code behavior, a Knowledge-Based Agent maintains a Knowledge Base (KB) of declarative sentences. It interfaces through `TELL(KB, sentence)` and `ASK(KB, sentence)`.",
          "**Entailment vs Proof:** Entailment $\\alpha \\models \\beta$ means in every possible world where $\\alpha$ is true, $\\beta$ is also true. Proof $\\alpha \\vdash \\beta$ means $\\beta$ can be derived from $\\alpha$ using syntactic inference rules. A sound inference engine only proves true statements; a complete inference engine can prove any entailed statement.",
          "**Resolution Refutation:** The universal automated theorem proving engine. To prove $KB \\models \\alpha$, assert $\\neg \\alpha$ into the KB, convert all sentences to Conjunctive Normal Form (CNF), and repeatedly resolve complementary pairs $(P \\lor Q)$ and $(\\neg P \\lor R)$ until the empty clause $\\square$ (contradiction) is derived.",
          "**STRIPS Planning:** Action representation in AI. Each action has:\n- Preconditions: What must be true before executing (e.g. `At(Robot, RoomA)`).\n- Add List: What becomes true after (e.g. `At(Robot, RoomB)`).\n- Delete List: What ceases to be true (e.g. `At(Robot, RoomA)`)."
        ],
        "examDefinitions": [
          "**Knowledge Base (KB):** A set of sentences expressed in a formal knowledge representation language representing facts and beliefs about the agent's environment.",
          "**Entailment:** A relationship between sentences such that $\\alpha \\models \\beta$ if and only if in every model in which $\\alpha$ is true, $\\beta$ is also true.",
          "**Unification:** The algorithmic process of finding a substitution $\\theta$ that makes two different first-order logical expressions syntactically identical: $UNIFY(p, q) = \\theta$.",
          "**Conjunctive Normal Form (CNF):** A standardized logical representation consisting of a conjunction of disjunctions of literals: $(A \\lor B) \\land (\\neg B \\lor C) \\land (\\neg A)$."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Soundness and Completeness of an inference system?",
            "answer": "1. **Soundness:** An inference procedure is sound if it derives only sentences that are genuinely entailed: if $KB \\vdash \\alpha$, then $KB \\models \\alpha$ (no false conclusions).\n2. **Completeness:** An inference procedure is complete if it can derive every sentence that is entailed: if $KB \\models \\alpha$, then $KB \\vdash \\alpha$ (all truths can be proven)."
          },
          {
            "question": "Perform unification on expressions: P(x, f(y)) and P(A, z).",
            "answer": "Substitution $\\theta = \\{x / A, z / f(y)\\}$. Applying $\\theta$ to both yields identical sentence: `P(A, f(y))`."
          },
          {
            "question": "What is a Horn Clause and why is it computationally desirable?",
            "answer": "A Horn clause is a disjunction of literals with at most one positive literal (e.g. $\\neg A \\lor \\neg B \\lor C$, equivalent to $A \\land B \\implies C$). Horn clauses allow deterministic linear time $O(n)$ inference using Forward Chaining or Backward Chaining."
          }
        ],
        "questions5Mark": [
          {
            "question": "Convert the following sentence into Conjunctive Normal Form (CNF): 'Every student who takes AI passes the exam'.",
            "answer": "1. **FOL Formulation:** $\\forall x \\, (Student(x) \\land Takes(x, AI) \\implies Passes(x, Exam))$.\n2. **Eliminate Implication:** $\\forall x \\, (\\neg(Student(x) \\land Takes(x, AI)) \\lor Passes(x, Exam))$.\n3. **Apply De Morgan's Law:** $\\forall x \\, (\\neg Student(x) \\lor \\neg Takes(x, AI) \\lor Passes(x, Exam))$.\n4. **Drop Universal Quantifier:** Standardized CNF clause:\n   `~Student(x) | ~Takes(x, AI) | Passes(x, Exam)`."
          },
          {
            "question": "Explain the Resolution Refutation algorithm for Propositional Logic with an example.",
            "answer": "1. **Algorithm:** Given $KB$ and query $\\alpha$. Negate query $\\neg \\alpha$ and add to $KB$. Convert all sentences to CNF clauses. Repeatedly apply Resolution Rule to complementary literals until the empty clause $\\square$ is produced (proof of contradiction).\n2. **Example:** $KB = \\{A \\implies B, B \\implies C, A\\}$. Query: Prove $C$.\n   - Negate query: $\\neg C$.\n   - Clauses: (1) $\\neg A \\lor B$, (2) $\\neg B \\lor C$, (3) $A$, (4) $\\neg C$.\n   - Resolve (1) and (3) -> (5) $B$.\n   - Resolve (2) and (5) -> (6) $C$.\n   - Resolve (4) and (6) -> $\\square$ (Contradiction! Therefore, $C$ is true)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain Forward Chaining and Backward Chaining algorithms for First-Order Logic Horn Knowledge Bases. Contrast their execution mechanisms and suitability for data-driven vs goal-driven applications.",
            "answer": "1. **Forward Chaining (Data-Driven) (3 marks):** Starts from known ground facts in the KB. Iteratively fires all rules whose premises are satisfied by current facts, adding their conclusions as new facts to the KB until the query is generated or no new inferences can be made. Time complexity is linear in size of KB for propositional Horn clauses.\n2. **Backward Chaining (Goal-Driven) (3 marks):** Starts from the target query goal. Finds rules whose conclusions match the goal, and recursively attempts to prove their premises as sub-goals. Continues down until sub-goals match established ground facts. Implements depth-first search (e.g. Prolog execution engine).\n3. **Comparative Analysis (2 marks):**\n   - **Direction:** Forward is bottom-up (facts -> conclusions); Backward is top-down (goal -> facts).\n   - **Efficiency:** Forward chaining computes all possible inferences (wasting work if query is narrow); Backward chaining searches only relevant goal-directed paths.\n   - **Use Cases:** Forward is ideal for monitoring and configuration systems; Backward is ideal for diagnostic expert systems and database query answering."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Learning, Natural Language Processing and Robotics",
        "syllabusTopics": [
          "Learning in AI: Forms of learning, inductive learning",
          "Statistical NLP: Text preprocessing (Tokenization, Stemming, Lemmatization), N-gram language models",
          "Syntactic Parsing: Context-Free Grammars in NLP, Chart parsing, CYK algorithm",
          "Robotics and Perception: Robot architectures, Sensors, Hardware actuation, Localization and Mapping (SLAM basics)",
          "Ethical dimensions: Algorithmic bias, safety in AI, autonomous weapon systems"
        ],
        "conceptualWalkthrough": [
          "**The NLP Pipeline:** Converting raw unstructured human language into structured knowledge. Tokens -> Parts of Speech -> Syntactic parse trees -> Semantic role labeling.",
          "**N-Gram Probability:** Predicting the next word $w_n$ based on history of previous $n-1$ words: $P(w_n | w_{n-1}, ..., w_1) \\approx P(w_n | w_{n-1})$. Uses Markov chain assumption.",
          "**Robotics as Embodied AI:** An AI software agent exists in digital simulation; a robot exists in the physical world where friction, motor slip, sensor noise, and battery depletion occur continuously.",
          "**SLAM (Simultaneous Localization and Mapping):** The foundational problem of autonomous robotics: A robot placed in an unknown environment must simultaneously build a map of the environment while figuring out where it is situated within that map using sensor streams (LiDAR, visual odometry)."
        ],
        "examDefinitions": [
          "**Natural Language Processing (NLP):** A field of artificial intelligence focused on enabling computers to understand, interpret, synthesize, and generate human languages.",
          "**SLAM (Simultaneous Localization and Mapping):** The computational problem of constructing or updating a map of an unknown environment while simultaneously keeping track of an agent's location within it.",
          "**N-Gram:** A contiguous sequence of n items (words, characters, or syllables) extracted from a given sample of text or speech.",
          "**Lemmatization:** The algorithmic process of grouping together the inflected forms of a word so they can be analysed as a single item, identified by the word's dictionary lemma."
        ],
        "questions3Mark": [
          {
            "question": "Differentiate between Stemming and Lemmatization in text processing.",
            "answer": "1. **Stemming:** A crude heuristic process that chops off the ends of words using fixed rules (e.g. Porter Stemmer maps 'studies' and 'studying' to 'studi', which is not a valid word).\n2. **Lemmatization:** Uses complete morphological analysis and a dictionary lexicon to return the valid base dictionary lemma (e.g. 'better' maps to 'good', 'studies' maps to 'study')."
          },
          {
            "question": "What is the Bigram language model assumption?",
            "answer": "The Bigram model makes a first-order Markov assumption that the probability of word $w_i$ depends ONLY on the immediately preceding word $w_{i-1}$: $P(w_i | w_1, ..., w_{i-1}) \\approx P(w_i | w_{i-1}) = Count(w_{i-1}, w_i) / Count(w_{i-1})$."
          },
          {
            "question": "Explain the core challenge of the SLAM problem in robotics.",
            "answer": "It is a 'chicken-or-the-egg' circular dependency: To build an accurate map, the robot needs to know its exact position. But to localize its position, the robot needs an accurate map! SLAM uses probabilistic filters (Extended Kalman Filter, Particle Filter) to estimate both concurrently."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the architecture of a mobile robot hardware and software pipeline.",
            "answer": "1. **Sensors (Perception):** Ultrasonic sonar, LiDAR, RGB-D cameras, wheel encoders, IMU gyroscopes.\n2. **Perception & State Estimation:** Filter sensor noise, compute odometry, detect obstacles.\n3. **Localization & Mapping:** SLAM creates 2D occupancy grid map.\n4. **Path Planning:** Global planner (A* on grid map) finds route; Local planner (Dynamic Window Approach) avoids moving obstacles.\n5. **Actuators (Execution):** Motor controller drives PWM signals to stepper or brushless DC motors."
          },
          {
            "question": "Explain Context-Free Grammars in Natural Language Processing and describe Syntactic Parse Trees with an example sentence.",
            "answer": "1. **CFG Rules Example:**\n   - S -> NP VP\n   - NP -> Det N\n   - VP -> V NP\n   - Det -> 'the' | 'a'\n   - N -> 'cat' | 'dog'\n   - V -> 'chased'\n2. **Sentence:** 'The cat chased a dog'.\n3. **Parse Tree:** Root S splits into NP ('The cat') and VP ('chased a dog'). NP splits into Det ('The') and N ('cat'). VP splits into V ('chased') and NP ('a dog').\n4. **Ambiguity:** Structural ambiguity occurs when a sentence yields multiple valid parse trees (e.g. 'I saw the man with a telescope').",
            "diagramDescription": "Tree hierarchy diagram parsing 'The cat chased a dog' into grammatical syntactic constituents."
          }
        ],
        "questions8Mark": [
          {
            "question": "Discuss the major ethical, societal, and safety challenges in Artificial Intelligence. Address algorithmic bias, autonomous weapons, deepfakes, and explain technical measures for trustworthy and explainable AI (XAI).",
            "answer": "1. **Algorithmic Bias & Fairness (2 marks):** Training data reflects historical societal discrimination. AI models in hiring, facial recognition, and judicial sentencing inherit and amplify these biases. Remedied via re-sampling, adversarial debiasing, and demographic parity constraints.\n2. **Autonomous Weapon Systems (AWS) & Safety (2 marks):** Lethal Autonomous Weapons (LAWs) capable of targeting without human oversight raise profound ethical questions under international humanitarian law. Need for meaningful human control (MHC).\n3. **Generative Disinformation & Deepfakes (1.5 marks):** High-fidelity synthetic audio and video threaten democratic elections and public trust. Addressed through cryptographic provenance watermarking (C2PA) and synthetic media detectors.\n4. **Explainable AI (XAI) & Interpretability (2.5 marks):** High-stakes applications (medical diagnosis, aviation) cannot use opaque black-boxes. Methods like LIME (Local Interpretable Model-agnostic Explanations) and SHAP (Shapley Additive Explanations) generate post-hoc feature importance justifications for individual decisions."
          }
        ]
      }
    }
  },
  "pecst521": {
    "subjectCode": "PECST521",
    "subjectTitle": "Software Project Management",
    "references": [
      "Bob Hughes, Mike Cotterell, Rajib Mall, Software Project Management, 6th Edition, McGraw Hill, 2017",
      "Ramesh Gopalaswamy, Managing Global Software Projects, McGraw Hill, 2005",
      "Walker Royce, Software Project Management: A Unified Framework, Addison Wesley, 1998"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction to Software Project Management",
        "syllabusTopics": [
          "Software Projects vs Other Projects",
          "Activities in SPM, Project Evaluation & Cost-Benefit Analysis (NPV, ROI, Payback)",
          "Step-Wise Project Planning Overview",
          "Software Process Models: Waterfall, Prototyping, Incremental, Spiral, Agile/Scrum"
        ],
        "conceptualWalkthrough": [
          "**Why Software Projects Are Unique:** Software is intangible, complex, conformant to existing systems, and malleable. Unlike civil engineering (where materials obey physical laws), software requirements change during construction, making invisibility and change management the core engineering dilemmas.",
          "**Economic Feasibility Metrics:** Net Present Value (NPV) discounts future cash inflows using interest rate $r$: $NPV = \\sum \\frac{C_t}{(1+r)^t} - C_0$. A positive NPV indicates the project earns more than the opportunity cost of capital.",
          "**Step-Wise Project Planning:** An iterative 10-step framework starting from defining project scope, identifying infrastructure, analyzing project characteristics, and detailing activities down to task scheduling and resource allocation."
        ],
        "examDefinitions": [
          "**Software Project Management:** The discipline of planning, organizing, staffing, monitoring, and controlling software development activities to deliver a quality product within scheduled time and budgeted cost constraints.",
          "**Net Present Value (NPV):** The difference between the present value of cash inflows and the present value of cash outflows over the lifecycle of a software project.",
          "**Agile Sprint:** A time-boxed iteration (typically 2-4 weeks) during which a cross-functional team creates a usable, releasable increment of the product."
        ],
        "questions3Mark": [
          {
            "question": "Differentiate between software projects and traditional civil engineering projects.",
            "answer": "1. **Invisibility:** Progress in building construction is physically visible, whereas software progress cannot be seen until tested.\n2. **Conformity:** Software must conform to arbitrary human interfaces and legacy hardware, unlike physical systems governed by natural laws.\n3. **Malleability:** Software is expected to change constantly at negligible perceived cost, causing requirement volatility."
          },
          {
            "question": "Define Return on Investment (ROI) and state its limitation.",
            "answer": "**Definition:** $ROI = \\frac{\\text{Average Annual Net Profit}}{\\text{Total Initial Investment}} \\times 100\\%$.\n**Limitation:** It ignores the timing of cash flows (time value of money), treating a dollar earned in year 1 identical to a dollar earned in year 5."
          },
          {
            "question": "What is the primary role of the Scrum Master in Agile?",
            "answer": "The Scrum Master is a servant-leader who removes organizational impediments (blockers), facilitates Scrum ceremonies (daily standups, sprint reviews, retrospectives), and shields the development team from external scope creep."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the 10 steps in the Step-Wise Project Planning methodology.",
            "answer": "1. Identify project scope and objectives (Project Charter).\n2. Establish project infrastructure (tools, organizational structure).\n3. Analyze project characteristics (waterfall vs agile, bespoke vs off-the-shelf).\n4. Identify project products and activities (Product Breakdown Structure, Work Breakdown Structure).\n5. Estimate effort for each activity (COCOMO, Function Points).\n6. Identify activity risks and mitigations.\n7. Allocate resources (staff, servers, testing devices).\n8. Review and publish the baseline project plan.\n9. Execute plan and capture metrics.\n10. Lower-level planning for immediate next sprints.",
            "diagramDescription": "Block flow diagram showing sequential and feedback loops between Step 1 (Scope) through Step 10 (Dynamic iterative planning)."
          },
          {
            "question": "Compare Net Present Value (NPV) and Payback Period with an illustrative cash flow example.",
            "answer": "**Payback Period:** Time taken to recover initial capital investment $C_0$. Simple, but ignores cash flows earned after payback and ignores money depreciation.\n**NPV:** Calculates $NPV = \\sum_{t=1}^n \\frac{R_t}{(1+k)^t} - C_0$, where $k$ is discount rate. Projects with $NPV > 0$ are financially viable.\n**Example:** Investment = $100,000. Inflows = $40,000/year for 3 years. Payback = 2.5 years. At 10% discount rate, $PV = 36364 + 33058 + 30053 = $99,475 < $100,000$, yielding $NPV = -$525$. Despite quick payback, the project is economically unviable!"
          }
        ],
        "questions8Mark": [
          {
            "question": "Critically analyze Boehm's Spiral Model. Explain its four quadrants and why it is considered risk-driven.",
            "answer": "**Concept:** Proposed by Barry Boehm, the Spiral Model combines the iterative nature of prototyping with the controlled, systematic aspects of the Waterfall model. Its defining characteristic is explicit risk management at every iteration.\n\n**Four Quadrants per Cycle:**\n1. **Determine Objectives, Alternatives, and Constraints:** Define project goals, performance targets, and architectural options.\n2. **Identify and Resolve Risks:** Detailed risk analysis, feasibility prototypes, simulation, and benchmark testing.\n3. **Develop and Verify Next-Level Product:** Standard engineering activities (design, coding, unit testing, integration).\n4. **Review and Plan Next Phase:** Customer evaluation of the prototype, budget signoff, and planning for the next spiral circuit.\n\n**Why Risk-Driven:** If risk analysis reveals unviable technical hurdles (e.g. impossible algorithmic throughput), the project can be terminated before substantial budget is squandered.\n\n**Evaluation Key:** (1) Four quadrants clearly diagrammed (3 marks), (2) Step-by-step role of risk assessment (3 marks), (3) Contrast with Linear Waterfall (2 marks).",
            "diagramDescription": "Concentric spiral expanding outward across 4 quadrants: Top-Left (Objectives), Top-Right (Risk Analysis & Prototypes), Bottom-Right (Engineering & Verification), Bottom-Left (Planning next phase)."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Project Estimation and Risk Management",
        "syllabusTopics": [
          "Software Effort Estimation: Top-down vs Bottom-up",
          "COCOMO I and COCOMO II Models",
          "Function Point Analysis (Albrecht's FPA)",
          "Risk Identification, Risk Assessment (Risk Exposure = P x I), Risk Mitigation and Management (RMMM)"
        ],
        "conceptualWalkthrough": [
          "**Effort Estimation Dilemma:** Over-estimation leads to lost bids and Parkinson's Law (work expands to fill allocated time). Under-estimation triggers Brooks' Law ('adding manpower to a late software project makes it later').",
          "**Function Point Analysis:** Measures software functionality delivered to the user independently of programming language syntax. Computes Unadjusted Function Points (UFP) from 5 components: External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), and External Interface Files (EIF).",
          "**Risk Exposure Formula:** $RE = P(\\text{Risk occurs}) \\times \\text{Impact}(\\text{Cost in Dollars or Weeks})$. High probability with low impact is minor; low probability with catastrophic impact demands immediate active contingency."
        ],
        "examDefinitions": [
          "**Function Point (FP):** A synthetic unit of measurement expressing the amount of business functionality a software product provides to a user.",
          "**COCOMO (Constructive Cost Model):** An algorithmic software cost estimation model developed by Barry Boehm that calculates effort as a power-law function of lines of code: $E = a \\cdot (KLOC)^b$.",
          "**Risk Exposure (RE):** The product of the probability of a risk event occurring and the cost/loss incurred if it manifests: $RE = P \\times I$."
        ],
        "questions3Mark": [
          {
            "question": "State the three modes of projects in Basic COCOMO.",
            "answer": "1. **Organic:** Small, experienced teams working in familiar in-house environments (low complexity, $E = 2.4(KLOC)^{1.05}$).\n2. **Semidetached:** Medium team with mixed experience and intermediate constraints ($E = 3.0(KLOC)^{1.12}$).\n3. **Embedded:** Tight hardware/software coupling and rigid regulatory constraints ($E = 3.6(KLOC)^{1.20}$)."
          },
          {
            "question": "Define Brooks' Law and explain its underlying cause.",
            "answer": "**Law:** 'Adding manpower to a late software project makes it later.'\n**Cause:** Communication channels grow quadratically ($N(N-1)/2$). Existing developers must spend critical time educating new team members, temporarily reducing net productivity."
          },
          {
            "question": "What are the 5 functional components in Albrecht's Function Point Analysis?",
            "answer": "1. External Inputs (EI)\n2. External Outputs (EO)\n3. External Inquiries (EQ)\n4. Internal Logical Files (ILF)\n5. External Interface Files (EIF)"
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the calculation of Function Points using Unadjusted Function Points (UFP) and Value Adjustment Factor (VAF).",
            "answer": "**Step 1: Count Components:** Classify EI, EO, EQ, ILF, EIF as Simple, Average, or Complex, and multiply by weight table to compute $UFP = \\sum (\\text{Count}_i \\times W_i)$.\n**Step 2: Technical Complexity Factor (TCF):** Evaluate 14 General System Characteristics (GSCs) on a scale 0 to 5, sum them to get $\\sum C_i$.\n**Step 3: Value Adjustment Factor (VAF):** $VAF = 0.65 + 0.01 \\times \\sum_{i=1}^{14} C_i$ (ranges between 0.65 and 1.35).\n**Step 4: Final FP:** $FP = UFP \\times VAF$."
          },
          {
            "question": "Explain the RMMM (Risk Mitigation, Monitoring, and Management) plan with an example.",
            "answer": "**1. Risk Mitigation:** Proactive action to prevent risk (e.g. high staff turnover mitigated by meeting team regularly, cross-training, document standards).\n**2. Risk Monitoring:** Tracking indicator metrics (e.g. tracking team morale, overtime hours, job satisfaction surveys).\n**3. Risk Management:** Contingency plan if risk occurs (e.g. on-call backup contractors, fast-track hiring pipelines)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Derive effort and duration using Intermediate COCOMO. A software system is estimated to be 40 KLOC for a semidetached project. Calculate Effort and Development Time if Cost Drivers total to EAF = 1.15.",
            "answer": "**1. Formulae for Semidetached Mode:**\n- Effort $E = a_b \\times (KLOC)^{b_b} \\times EAF$ person-months (where $a_b = 3.0, b_b = 1.12$).\n- Time $T_{dev} = c_b \\times (E)^{d_b}$ months (where $c_b = 2.5, d_b = 0.35$).\n\n**2. Step-by-Step Calculation:**\n- Nominal Effort $E_{nom} = 3.0 \\times (40)^{1.12} = 3.0 \\times 61.42 = 184.26$ Person-Months.\n- Adjusted Effort $E = 184.26 \\times 1.15 = 211.9$ Person-Months.\n- Development Time $T_{dev} = 2.5 \\times (211.9)^{0.35} = 2.5 \\times 6.55 = 16.38$ Months.\n- Recommended Staff Size: $S = E / T_{dev} = 211.9 / 16.38 \\approx 13$ full-time engineers.\n\n**Evaluation Key:** (1) Formula and constants correctly stated (2 marks), (2) Nominal effort calculation (2 marks), (3) EAF adjustment (2 marks), (4) Duration and team size (2 marks).",
            "diagramDescription": "Bar chart illustrating comparison of effort across Organic, Semidetached, and Embedded modes for 40 KLOC."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Project Scheduling and Quality Management",
        "syllabusTopics": [
          "Network Planning Models: PERT and CPM",
          "Critical Path, Earliest/Latest Start & Finish Times, Float/Slack",
          "Resource Allocation and Resource Leveling",
          "Software Quality: ISO 9126, McCall's Quality Factors, CMMI Levels"
        ],
        "conceptualWalkthrough": [
          "**The Critical Path Method (CPM):** The critical path is the longest sequence of dependent activities from project start to end. Any delay in a critical activity directly delays project delivery date (zero float).",
          "**Forward and Backward Pass:** Forward pass computes Earliest Start (ES) and Earliest Finish (EF). Backward pass computes Latest Finish (LF) and Latest Start (LS). Total Float = $LS - ES = LF - EF$.",
          "**CMMI Maturity Spectrum:** From Level 1 (Initial: ad-hoc, chaotic) to Level 5 (Optimizing: continuous quantitative improvement based on statistical process control)."
        ],
        "examDefinitions": [
          "**Critical Path:** The sequence of dependent project activities that has the longest total duration, determining the shortest possible time to complete the project.",
          "**Total Float (Slack):** The amount of time an activity can be delayed without delaying the overall project completion date: $TF = LF - EF = LS - ES$.",
          "**CMMI (Capability Maturity Model Integration):** A process improvement framework that defines a 5-level maturity path for developing repeatable, standardized, and optimizing organizational software processes."
        ],
        "questions3Mark": [
          {
            "question": "What is the difference between Total Float and Free Float?",
            "answer": "**Total Float:** Delay allowed for an activity without delaying the project completion date ($LF - EF$).\n**Free Float:** Delay allowed for an activity without delaying the Earliest Start time of any immediately succeeding activity."
          },
          {
            "question": "List the 5 maturity levels of CMMI in sequence.",
            "answer": "1. Initial (Ad hoc, chaotic)\n2. Managed (Project-level discipline)\n3. Defined (Organization-wide standard processes)\n4. Quantitatively Managed (Statistical process control & metrics)\n5. Optimizing (Continuous innovation and defect prevention)"
          },
          {
            "question": "Why is resource leveling performed in project scheduling?",
            "answer": "Resource leveling resolves resource over-allocations by smoothing peaks and valleys in resource usage (e.g. preventing a developer from being assigned 16 hours of work in a single day), shifting non-critical activities within their available float."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain PERT three-point estimation and calculate Expected Duration and Variance.",
            "answer": "**Three Estimates:**\n- Optimistic time ($a$)\n- Most Likely time ($m$)\n- Pessimistic time ($b$)\n\n**Expected Duration:** $T_e = \\frac{a + 4m + b}{6}$\n**Standard Deviation:** $\\sigma = \\frac{b - a}{6}$\n**Variance:** $\\sigma^2 = \\left(\\frac{b - a}{6}\\right)^2$\n\n**Significance:** PERT weights the most likely estimate 4x, modeling task uncertainty with a beta probability distribution."
          },
          {
            "question": "Differentiate between Quality Assurance (QA) and Quality Control (QC) in software engineering.",
            "answer": "| Aspect | Quality Assurance (QA) | Quality Control (QC) |\n|---|---|---|\n| Focus | Process-oriented | Product-oriented |\n| Goal | Prevent defects during development | Detect defects before release |\n| Activities | Process audits, standards definition, training | Code inspections, unit testing, system testing |\n| Nature | Proactive | Reactive |"
          }
        ],
        "questions8Mark": [
          {
            "question": "Given an activity network table with Activity, Predecessor, and Duration, explain the algorithm to determine Critical Path and calculate ES, EF, LS, LF, and Float.",
            "answer": "**Step 1: Forward Pass (ES & EF):**\n- For starting nodes: $ES = 0$.\n- For each activity: $EF = ES + \\text{Duration}$.\n- For subsequent nodes: $ES_j = \\max(EF_i)$ for all immediate predecessors $i$.\n\n**Step 2: Backward Pass (LS & LF):**\n- For project end node: $LF = \\max(EF)$.\n- For each activity: $LS = LF - \\text{Duration}$.\n- For preceding nodes: $LF_i = \\min(LS_j)$ for all immediate successors $j$.\n\n**Step 3: Float & Critical Path Identification:**\n- Compute Total Float $TF = LF - EF = LS - ES$.\n- Critical activities have $TF = 0$.\n- The path connecting critical activities from start to end constitutes the **Critical Path**.\n\n**Evaluation Key:** (1) Clear forward pass formulas (2 marks), (2) Backward pass formulas (2 marks), (3) Float formula and zero-float interpretation (2 marks), (4) Example step-by-step table (2 marks).",
            "diagramDescription": "Activity-on-Node (AON) network graph showing 6 nodes with dual ES/EF and LS/LF boxes and the critical path highlighted with double-stroke arrows."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Project Execution, Tracking, and Closure",
        "syllabusTopics": [
          "Earned Value Management (EVM): PV, EV, AC, CV, SV, CPI, SPI",
          "Contract Management & Procurement",
          "Managing People in Software Environments (Maslow, Herzberg, Oldham-Hackman Job Characteristics)",
          "Project Closeout and Retrospectives"
        ],
        "conceptualWalkthrough": [
          "**Earned Value Analysis:** Traditional project tracking compares planned cost vs actual spend. If you spent $50k of a $100k budget, are you under budget, or did you only deliver 20% of the project? EVM solves this by measuring the budgeted value of work *actually completed* ($EV$).",
          "**Cost & Schedule Performance Indices:** $CPI = EV / AC$. If $CPI < 1.0$, you are getting less than $1 of value per dollar spent (over budget). $SPI = EV / PV$. If $SPI < 1.0$, you are behind schedule.",
          "**Project Closeout:** Formal verification that all contract deliverables are met, defect databases archived, final knowledge retrospectives captured, and team resources released."
        ],
        "examDefinitions": [
          "**Earned Value (EV):** The measure of work performed expressed in terms of the budget authorized for that work ($EV = \\text{\\% Complete} \\times \\text{Planned Budget}$).",
          "**Cost Performance Index (CPI):** A measure of the financial efficiency of earned value relative to actual costs: $CPI = EV / AC$.",
          "**Schedule Variance (SV):** The difference between the earned value and the planned value: $SV = EV - PV$."
        ],
        "questions3Mark": [
          {
            "question": "What does a Cost Performance Index (CPI) of 0.85 indicate to a project manager?",
            "answer": "$CPI = EV / AC = 0.85$ indicates that the project is running over budget. For every $1.00 spent on development, the project is only earning $0.85 worth of planned deliverable value (15% cost overrun)."
          },
          {
            "question": "Differentiate between Fixed Price contracts and Time & Materials (T&M) contracts.",
            "answer": "**Fixed Price:** Buyer pays a set contract sum regardless of developer effort; high supplier risk if scope expands.\n**Time & Materials:** Buyer pays supplier based on hours worked and direct material costs; high buyer risk, but allows fluid requirement changes."
          },
          {
            "question": "State the key elements of Herzberg's Two-Factor Theory of motivation.",
            "answer": "1. **Hygiene Factors:** Working conditions, salary, job security. Absence creates dissatisfaction, but presence does not motivate.\n2. **Motivators:** Achievement, recognition, challenging work, growth. Directly drive high engagement and superior performance."
          }
        ],
        "questions5Mark": [
          {
            "question": "Given Planned Value (PV) = $80,000, Actual Cost (AC) = $95,000, and Earned Value (EV) = $70,000. Calculate CV, SV, CPI, and SPI. Provide your interpretation.",
            "answer": "**Calculations:**\n1. Cost Variance $CV = EV - AC = 70,000 - 95,000 = -$25,000$ (Over budget).\n2. Schedule Variance $SV = EV - PV = 70,000 - 80,000 = -$10,000$ (Behind schedule).\n3. Cost Performance Index $CPI = EV / AC = 70,000 / 95,000 = 0.737$.\n4. Schedule Performance Index $SPI = EV / PV = 70,000 / 80,000 = 0.875$.\n\n**Interpretation:** Project is severely distressed. It is experiencing a 26.3% cost overrun and delivering progress at only 87.5% of scheduled pace."
          },
          {
            "question": "Explain the stages of team development according to Tuckman's Model.",
            "answer": "1. **Forming:** Team meets, polite orientation, roles unclear.\n2. **Storming:** Conflict over leadership, process, and architectural direction.\n3. **Norming:** Standards established, consensus reached, mutual trust builds.\n4. **Performing:** Autonomous execution, high synergy and velocity.\n5. **Adjourning:** Project closure, wrap-up, and team disbandment."
          }
        ],
        "questions8Mark": [
          {
            "question": "Describe the complete Earned Value Management (EVM) methodology. Define all parameters, variances, indices, and formulas for Estimate at Completion (EAC).",
            "answer": "**1. Foundational Metrics:**\n- **PV (Planned Value):** Budgeted cost of scheduled work ($PV = \\text{Planned \\%} \\times BAC$).\n- **EV (Earned Value):** Budgeted cost of work completed ($EV = \\text{Actual \\%} \\times BAC$).\n- **AC (Actual Cost):** Real total funds expended to complete current work.\n- **BAC (Budget at Completion):** Total authorized project baseline budget.\n\n**2. Variance Analysis:**\n- $CV = EV - AC$ (Positive = under budget, Negative = cost overrun).\n- $SV = EV - PV$ (Positive = ahead of schedule, Negative = behind schedule).\n\n**3. Performance Indices:**\n- $CPI = EV / AC$ ($>1.0$ good, $<1.0$ bad).\n- $SPI = EV / PV$ ($>1.0$ good, $<1.0$ bad).\n\n**4. Forecasting:**\n- If current cost trends continue: $EAC = BAC / CPI$.\n- If both cost and schedule indices affect future work: $EAC = AC + \\frac{BAC - EV}{CPI \\times SPI}$.\n- Variance at Completion: $VAC = BAC - EAC$.\n\n**Evaluation Key:** (1) 4 core parameters clearly defined (2 marks), (2) Variances with mathematical interpretations (2 marks), (3) Performance indices (2 marks), (4) EAC forecasting formulas (2 marks).",
            "diagramDescription": "S-curve graph plotting PV, EV, and AC lines over timeline, showing vertical gaps for CV and SV, and projecting EAC at completion."
          }
        ]
      }
    }
  },
  "pecst523": {
    "subjectCode": "PECST523",
    "subjectTitle": "Data Analytics",
    "references": [
      "Jiawei Han, Micheline Kamber, Jian Pei, Data Mining: Concepts and Techniques, Morgan Kaufmann, 3rd Edition, 2011",
      "Wes McKinney, Python for Data Analysis, O'Reilly Media, 3rd Edition, 2022",
      "Trevor Hastie, Robert Tibshirani, Jerome Friedman, The Elements of Statistical Learning, Springer, 2nd Edition, 2009"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction to Data Analytics & Data Preprocessing",
        "syllabusTopics": [
          "Data Analytics Lifecycle",
          "Types of Analytics: Descriptive, Diagnostic, Predictive, Prescriptive",
          "Data Cleaning: Missing Values, Outlier Detection",
          "Data Transformation: Normalization (Min-Max, Z-score), Discretization"
        ],
        "conceptualWalkthrough": [
          "**Analytics Taxonomy:** Descriptive asks 'What happened?' (reporting). Diagnostic asks 'Why did it happen?' (drill-down). Predictive asks 'What will happen?' (machine learning). Prescriptive asks 'How can we make it happen?' (optimization & simulation).",
          "**Why Preprocessing Dominates 80% of Real-world ML:** Raw data contains noise, missing attributes, inconsistent casing, and extreme sensor outliers. Garbage in, garbage out.",
          "**Normalization Mechanics:** Min-max scaling: $x' = \\frac{x - \\min(x)}{\\max(x) - \\min(x)} \\in [0, 1]$. Z-score standardization: $z = \\frac{x - \\mu}{\\sigma} \\sim \\mathcal{N}(0, 1)$, robust to features without bounded extremes."
        ],
        "examDefinitions": [
          "**Data Analytics:** The science of examining raw data sets to discover hidden patterns, correlations, trends, and actionable business insights.",
          "**Z-Score Normalization:** Scaling technique that centers data around mean 0 with standard deviation 1: $z = \\frac{x - \\mu}{\\sigma}$.",
          "**Outlier:** An observation that lies an abnormal distance from other values in a random sample of a population."
        ],
        "questions3Mark": [
          {
            "question": "Differentiate between Predictive and Prescriptive Analytics.",
            "answer": "**Predictive Analytics:** Uses historical data and statistical models to forecast future probabilities (e.g. predicting customer churn).\n**Prescriptive Analytics:** Recommends optimal courses of action and evaluates the consequences of each choice using optimization and decision engines."
          },
          {
            "question": "How are missing values handled in numerical datasets?",
            "answer": "1. **Deletion:** Listwise or pairwise dropping (viable if missingness is <5% and completely random).\n2. **Mean/Median Imputation:** Replacing missing cells with feature mean (or median if skewed).\n3. **Model-based Imputation:** KNN or Multiple Imputation by Chained Equations (MICE)."
          },
          {
            "question": "State the Min-Max Normalization formula to transform $x$ into range $[new\\_min, new\\_max]$.",
            "answer": "$$x' = \\frac{x - \\min(x)}{\\max(x) - \\min(x)} \\times (new\\_max - new\\_min) + new\\_min$$"
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain Outlier Detection using the Interquartile Range (IQR) method with a box plot diagram.",
            "answer": "**Steps:**\n1. Calculate First Quartile ($Q_1$, 25th percentile) and Third Quartile ($Q_3$, 75th percentile).\n2. Compute $IQR = Q_3 - Q_1$.\n3. Lower Inner Fence $= Q_1 - 1.5 \\times IQR$.\n4. Upper Inner Fence $= Q_3 + 1.5 \\times IQR$.\n5. Any observation outside $[\\text{Lower Fence}, \\text{Upper Fence}]$ is classified as an outlier.\n\n**Advantage:** Unlike Z-score, IQR is non-parametric and not distorted by the outliers themselves.",
            "diagramDescription": "Annotated Box Plot showing Median, Q1, Q3, Whiskers at 1.5*IQR, and individual outlier points plotted beyond whiskers."
          },
          {
            "question": "Explain the Data Analytics Lifecycle stages.",
            "answer": "1. **Discovery:** Defining business objectives, identifying data sources, forming hypotheses.\n2. **Data Preparation:** Extract, Transform, Load (ETL), data cleaning, feature engineering.\n3. **Model Planning:** Selecting statistical techniques, variable selection.\n4. **Model Building:** Training models, cross-validation, hyperparameter tuning.\n5. **Communicate Results:** Reporting findings, visualizing lift, checking ROI.\n6. **Operationalize:** Deploying pipeline into production with monitoring."
          }
        ],
        "questions8Mark": [
          {
            "question": "Given a sample dataset: 12, 15, 18, 22, 25, 29, 33, 95. Calculate Min-Max Normalization (range [0,1]) and identify outliers using IQR.",
            "answer": "**1. Min-Max Normalization:**\n- $\\min = 12$, $\\max = 95$, Range $= 95 - 12 = 83$.\n- For $x = 12: (12-12)/83 = 0.00$.\n- For $x = 15: (15-12)/83 = 0.036$.\n- For $x = 18: (18-12)/83 = 0.072$.\n- For $x = 22: (22-12)/83 = 0.120$.\n- For $x = 25: (25-12)/83 = 0.157$.\n- For $x = 29: (29-12)/83 = 0.205$.\n- For $x = 33: (33-12)/83 = 0.253$.\n- For $x = 95: (95-12)/83 = 1.00$.\n\n**2. Outlier Detection via IQR:**\n- Ordered dataset: [12, 15, 18, 22, 25, 29, 33, 95] ($N = 8$).\n- $Q_1 = (15 + 18)/2 = 16.5$.\n- $Q_3 = (29 + 33)/2 = 31.0$.\n- $IQR = 31.0 - 16.5 = 14.5$.\n- Lower Bound $= 16.5 - 1.5(14.5) = 16.5 - 21.75 = -5.25$.\n- Upper Bound $= 31.0 + 1.5(14.5) = 31.0 + 21.75 = 52.75$.\n- **Conclusion:** 95 exceeds 52.75, so 95 is an extreme outlier.\n\n**Evaluation Key:** (1) Min-max formula and normalized vector (3 marks), (2) Quartile calculation (2 marks), (3) Upper/lower fences (2 marks), (4) Outlier conclusion (1 mark).",
            "diagramDescription": "Number line demonstrating the concentration of numbers between 12 and 33, and the outlier point 95 lying far beyond the upper fence at 52.75."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Exploratory Data Analysis and Statistical Methods",
        "syllabusTopics": [
          "Univariate, Bivariate, and Multivariate Analysis",
          "Covariance and Pearson's Correlation Coefficient",
          "Hypothesis Testing: Null/Alternative Hypothesis, Type I & Type II Errors, p-value",
          "t-Test, ANOVA, Chi-Square Test for Independence"
        ],
        "conceptualWalkthrough": [
          "**Correlation vs Causation:** Pearson's $r = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum(x-\\bar{x})^2 \\sum(y-\\bar{y})^2}}$ ranges in $[-1, 1]$. A high $r$ does NOT prove $x$ causes $y$—a confounding variable $z$ could govern both.",
          "**The Logic of Hypothesis Testing:** You assume the status quo ($H_0$ is true). If the probability of observing data as extreme as ours under $H_0$ ($p$-value) is less than significance level $\\alpha$ (typically 0.05), we reject $H_0$.",
          "**Type I vs Type II Error:** Type I error ($\u0007lpha$, false positive) is convicting an innocent person. Type II error ($\beta$, false negative) is letting a guilty criminal walk free."
        ],
        "examDefinitions": [
          "**p-Value:** The probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is true.",
          "**Pearson Correlation Coefficient ($r$):** A measure of the linear correlation between two continuous variables, bounded between $-1$ and $+1$.",
          "**ANOVA (Analysis of Variance):** A statistical test used to determine whether there are statistically significant differences between the means of three or more independent groups."
        ],
        "questions3Mark": [
          {
            "question": "Define Type I and Type II errors in statistical hypothesis testing.",
            "answer": "**Type I Error ($\u0007lpha$):** Rejecting the null hypothesis $H_0$ when it is actually true (False Positive).\n**Type II Error ($\beta$):** Failing to reject the null hypothesis $H_0$ when it is actually false (False Negative)."
          },
          {
            "question": "What is the difference between Covariance and Correlation?",
            "answer": "**Covariance:** Measures directional linear relationship, but depends on units of measurement ($-\\infty < \\text{Cov}(X,Y) < +\\infty$).\n**Correlation:** Normalized covariance divided by product of standard deviations, scale-invariant and bounded between $-1$ and $+1$."
          },
          {
            "question": "When is a Chi-Square ($\\chi^2$) Test of Independence used?",
            "answer": "Used when both variables are categorical (nominal or ordinal) to test whether there is a statistically significant association between them based on observed vs expected contingency table frequencies."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the steps involved in performing a Two-Sample Student's t-Test.",
            "answer": "1. **Formulate Hypotheses:** $H_0: \\mu_1 = \\mu_2$ vs $H_1: \\mu_1 \\neq \\mu_2$.\n2. **Choose Significance Level:** Set $\\alpha$ (e.g. 0.05).\n3. **Compute Test Statistic:** $t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{s_p^2(1/n_1 + 1/n_2)}}$, where $s_p^2$ is pooled variance.\n4. **Determine Degrees of Freedom:** $df = n_1 + n_2 - 2$.\n5. **Decision Rule:** Compare $|t|$ with critical $t_{\\text{crit}}$ from $t$-table (or check $p$-value). If $|t| > t_{\\text{crit}}$, reject $H_0$."
          },
          {
            "question": "Explain One-Way ANOVA and how the F-ratio is computed.",
            "answer": "**Purpose:** Tests equality of means across $k \\ge 3$ groups without inflating Type I error rate.\n**F-Statistic:** $$F = \\frac{\\text{Between-Group Variance (MSB)}}{\\text{Within-Group Variance (MSW)}}$$\n- $\\text{SSB} = \\sum n_i (\\bar{x}_i - \\bar{x}_{\\text{grand}})^2$, with $df_B = k - 1$.\n- $\\text{SSW} = \\sum \\sum (x_{ij} - \\bar{x}_i)^2$, with $df_W = N - k$.\n- If $F > F_{\\text{crit}}$, between-group variation significantly dominates random noise, proving at least one group mean differs."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the Chi-Square test for independence. A survey examines gender vs preference for online shopping. Derive the test statistic formula with an illustrative contingency table.",
            "answer": "**1. Purpose:** Tests whether two categorical variables $A$ and $B$ are statistically independent.\n\n**2. Hypotheses:**\n- $H_0$: Variables $A$ and $B$ are independent.\n- $H_1$: Variables $A$ and $B$ are dependent.\n\n**3. Expected Frequency Formula:**\nFor cell in row $i$ and column $j$:\n$$E_{ij} = \\frac{\\text{Row } i \\text{ Total} \\times \\text{Column } j \\text{ Total}}{\\text{Grand Total } N}$$\n\n**4. Chi-Square Statistic:**\n$$\\chi^2 = \\sum_{i=1}^r \\sum_{j=1}^c \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}$$\nwhere $df = (r - 1)(c - 1)$.\n\n**5. Decision Criterion:** If $\\chi^2_{\\text{calc}} > \\chi^2_{\\alpha, df}$, reject $H_0$.\n\n**Evaluation Key:** (1) Null and alternative hypotheses (2 marks), (2) Expected frequency derivation (2 marks), (3) Chi-square formula (2 marks), (4) Contingency table step-by-step example (2 marks).",
            "diagramDescription": "2x2 Contingency table matrix comparing Gender (Male/Female) against Shopping Preference (Online/In-store) with row, column, and grand totals."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Regression, Classification, and Time Series",
        "syllabusTopics": [
          "Linear Regression and Logistic Regression",
          "Model Evaluation: $R^2$, RMSE, Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC",
          "Time Series Analysis: Components (Trend, Seasonality, Cyclical, Irregular)",
          "Stationarity and ARIMA Modeling"
        ],
        "conceptualWalkthrough": [
          "**Linear vs Logistic Regression:** Linear predicts continuous real outputs ($y = w^Tx + b$). Logistic squashes the linear combination through the sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ to output class probability $p \\in [0, 1]$.",
          "**Precision vs Recall Tradeoff:** Precision is 'Of all predicted positives, how many were right?'. Recall is 'Of all actual positives, how many did we capture?'. In cancer screening, recall is critical (cannot miss a sick patient). In spam filtering, precision is critical (cannot mark a job offer as spam).",
          "**Time Series Stationarity:** A stationary series has constant mean, constant variance, and autocovariance independent of time. Non-stationary series must be differenced ($d$) before fitting ARIMA($p,d,q$)."
        ],
        "examDefinitions": [
          "**F1-Score:** The harmonic mean of precision and recall: $F1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$.",
          "**Stationary Time Series:** A time series whose statistical properties such as mean, variance, and autocorrelation do not depend on time $t$.",
          "**ARIMA Model:** Autoregressive Integrated Moving Average model parameterized by $(p, d, q)$, combining autoregression, differencing, and moving average residuals."
        ],
        "questions3Mark": [
          {
            "question": "Why is the harmonic mean used instead of arithmetic mean for F1-Score?",
            "answer": "The harmonic mean penalizes extreme imbalances. If a model predicts all positives (Recall = 1.0, Precision = 0.0), the arithmetic mean gives 0.50 (misleadingly acceptable), whereas the harmonic mean gives 0.0, correctly reflecting failure."
          },
          {
            "question": "What is the difference between $R^2$ (Coefficient of Determination) and Adjusted $R^2$?",
            "answer": "$R^2$ never decreases when adding new predictor variables, even useless noise. Adjusted $R^2$ penalizes model complexity by including a degree-of-freedom penalty: $\\text{Adj } R^2 = 1 - \\left[\\frac{(1-R^2)(n-1)}{n-k-1}\\right]$."
          },
          {
            "question": "State the 4 components of a classical time series.",
            "answer": "1. Trend ($T_t$): Long-term upward or downward movement.\n2. Seasonality ($S_t$): Fixed-period recurring patterns (e.g. holiday sales).\n3. Cyclical ($C_t$): Multi-year economic or business cycles.\n4. Irregular/Noise ($I_t$): Unpredictable random shocks."
          }
        ],
        "questions5Mark": [
          {
            "question": "Derive the Confusion Matrix and define Precision, Recall, Specificity, and Accuracy.",
            "answer": "**Confusion Matrix:**\n- TP: True Positive, FP: False Positive, FN: False Negative, TN: True Negative.\n\n**Metrics:**\n- **Accuracy:** $\\frac{TP + TN}{TP + TN + FP + FN}$\n- **Precision:** $\\frac{TP}{TP + FP}$\n- **Recall (Sensitivity):** $\\frac{TP}{TP + FN}$\n- **Specificity:** $\\frac{TN}{TN + FP}$\n- **F1-Score:** $\\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$"
          },
          {
            "question": "Explain the parameters $p, d, q$ in an ARIMA($p, d, q$) model.",
            "answer": "1. **$p$ (Autoregressive Order):** The number of lagged observations included in the model ($X_t = c + \\phi_1 X_{t-1} + \\dots + \\phi_p X_{t-p} + \\epsilon_t$).\n2. **$d$ (Degree of Differencing):** The number of times raw observations are differenced to achieve stationarity ($Y_t = X_t - X_{t-1}$).\n3. **$q$ (Moving Average Order):** The size of the moving average window of past forecast error terms ($X_t = \\mu + \\epsilon_t + \\theta_1 \\epsilon_{t-1} + \\dots + \\theta_q \\epsilon_{t-q}$)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the Logistic Regression model. Derive the log-odds (logit) formulation and the cross-entropy loss function used for binary classification.",
            "answer": "**1. Sigmoid Function:**\n$$P(Y=1|X) = \\pi(X) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 X)}}$$\n\n**2. Log-Odds (Logit) Derivation:**\n$$\\text{Odds} = \\frac{\\pi(X)}{1 - \\pi(X)} = \\frac{\\frac{1}{1+e^{-z}}}{\\frac{e^{-z}}{1+e^{-z}}} = e^z$$\nTaking natural logarithm on both sides:\n$$\\ln\\left(\\frac{\\pi(X)}{1 - \\pi(X)}\\right) = z = \\beta_0 + \\beta_1 X$$\nThis demonstrates that logistic regression models log-odds as a linear function of inputs!\n\n**3. Binary Cross-Entropy Loss Function:**\nFor $N$ observations where $y_i \\in \\{0, 1\\}$, likelihood is:\n$$L(\\beta) = \\prod_{i=1}^N \\pi(x_i)^{y_i} (1 - \\pi(x_i))^{1 - y_i}$$\nTaking negative log-likelihood:\n$$J(\\beta) = -\\sum_{i=1}^N \\left[ y_i \\ln(\\pi(x_i)) + (1 - y_i) \\ln(1 - \\pi(x_i)) \\right]$$\nThis convex loss function is minimized via Gradient Descent.\n\n**Evaluation Key:** (1) Sigmoid definition (2 marks), (2) Logit derivation (2 marks), (3) Likelihood function (2 marks), (4) Negative log cross-entropy formulation (2 marks).",
            "diagramDescription": "S-shaped Sigmoid logistic curve transitioning smoothly from 0 to 1 with threshold decision boundary at z=0 (p=0.5)."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Big Data Analytics & Visualization Tools",
        "syllabusTopics": [
          "Big Data 5 Vs (Volume, Velocity, Variety, Veracity, Value)",
          "Hadoop Ecosystem: HDFS and MapReduce Architecture",
          "Apache Spark: Resilient Distributed Datasets (RDDs) vs DataFrames",
          "Data Visualization Principles and Dashboards (Tableau/Power BI, Matplotlib/Seaborn)"
        ],
        "conceptualWalkthrough": [
          "**Why Hadoop Disrupted Storage:** Commodity cluster hardware scales horizontally. HDFS replicates blocks 3x across data nodes. MapReduce brings computation to data (data locality), avoiding saturating network bandwidth by moving terabytes of raw data to a central processor.",
          "**Why Spark Outperformed MapReduce by 100x:** MapReduce writes intermediate shuffle state to physical hard disk between map and reduce stages. Spark executes in-memory directed acyclic graph (DAG) pipelines using Resilient Distributed Datasets (RDDs).",
          "**Visual Encodings (Edward Tufte Principles):** Maximize data-to-ink ratio. Avoid 3D charts, chartjunk, and deceptive truncated axes."
        ],
        "examDefinitions": [
          "**HDFS (Hadoop Distributed File System):** A distributed, scalable, and fault-tolerant file system designed to run on commodity hardware with a single NameNode and multiple DataNodes.",
          "**RDD (Resilient Distributed Dataset):** The fundamental immutable, lazily evaluated, distributed memory abstraction in Apache Spark that can be operated on in parallel.",
          "**Data-Ink Ratio:** The proportion of graphic's ink devoted to the non-redundant display of data information ($1 - \\text{proportion of ink that can be erased without loss of data}$)."
        ],
        "questions3Mark": [
          {
            "question": "What are the 5 V's of Big Data?",
            "answer": "1. **Volume:** Scale of data (terabytes to petabytes).\n2. **Velocity:** Speed of data generation and streaming ingest.\n3. **Variety:** Structural diversity (structured SQL, semi-structured JSON, unstructured video).\n4. **Veracity:** Trustworthiness and data noise.\n5. **Value:** Actionable business utility extracted."
          },
          {
            "question": "How does HDFS achieve fault tolerance?",
            "answer": "HDFS divides files into large blocks (default 128 MB) and automatically stores 3 copies across distinct racks (Rack Awareness: 2 on local rack, 1 on remote rack). If a DataNode crashes, the NameNode detects missing heartbeats and initiates block re-replication."
          },
          {
            "question": "Differentiate between Spark Transformations and Actions.",
            "answer": "**Transformations (e.g. map, filter):** Lazy operations that return a new RDD without computing immediately.\n**Actions (e.g. count, collect, saveAsTextFile):** Trigger the actual computation of the DAG pipeline and return a final value or write to disk."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the Master-Worker architecture of MapReduce with a diagram.",
            "answer": "**Components:**\n1. **JobTracker / ResourceManager:** Schedules tasks, monitors worker health, coordinates job execution.\n2. **TaskTracker / NodeManagers:** Execute Map tasks (parse key-value pairs) and Reduce tasks on local worker nodes.\n3. **Workflow:** Input split $\\rightarrow$ Map Phase $\\rightarrow$ Shuffle and Sort Phase (partition by hash) $\\rightarrow$ Reduce Phase $\\rightarrow$ Output to HDFS.",
            "diagramDescription": "MapReduce dataflow showing Input Splits feeding Mappers, intermediate Key-Value pairs shuffled and sorted across the network, and Reducers generating final outputs."
          },
          {
            "question": "Compare Apache Hadoop MapReduce and Apache Spark.",
            "answer": "| Parameter | Apache Hadoop MapReduce | Apache Spark |\n|---|---|---|\n| Processing Model | Batch disk-based processing | In-memory micro-batch & stream processing |\n| Speed | Slower due to intermediate disk I/O | Up to 100x faster in-memory |\n| Fault Tolerance | Re-runs failed tasks from disk | Lineage graphs reconstruct lost RDD partitions |\n| Iterative ML | Extremely slow (repeated disk writes) | Optimal (caches data in RAM across iterations) |\n| Ease of Use | Complex Java boilerplate | Expressive APIs in Python, Scala, SQL, R |"
          }
        ],
        "questions8Mark": [
          {
            "question": "Describe the architecture and read/write protocols of HDFS (Hadoop Distributed File System).",
            "answer": "**1. Architectural Roles:**\n- **NameNode (Master):** Stores file system namespace metadata, directory tree, and mapping of blocks to DataNodes in memory (EditLog and FSImage).\n- **Secondary NameNode:** Periodically merges EditLog into FSImage to prevent log explosion.\n- **DataNodes (Workers):** Store actual block chunks (128 MB) on local file systems and send periodic Heartbeats and Blockreports.\n\n**2. HDFS Write Pipeline:**\n1. Client calls `create()` on `DistributedFileSystem`.\n2. NameNode verifies permissions and returns list of DataNodes for Block 1.\n3. Client connects to DataNode 1, which opens a streaming pipeline to DataNode 2, which connects to DataNode 3.\n4. Client pushes 64 KB packets in a pipeline; ACKs flow backward.\n5. Once all blocks are acknowledged, client calls `close()`.\n\n**3. HDFS Read Protocol:**\n1. Client calls `open()` on `DistributedFileSystem`.\n2. NameNode returns sorted list of DataNodes closest to the client for each block.\n3. Client connects directly to closest DataNode and streams data.\n\n**Evaluation Key:** (1) NameNode vs DataNode responsibilities (2 marks), (2) Write pipeline steps (3 marks), (3) Read protocol steps (2 marks), (4) Fault tolerance and heartbeat mechanism (1 mark).",
            "diagramDescription": "Architecture diagram illustrating Client communicating with central NameNode for metadata, then pipelining data blocks directly across DataNode 1 -> DataNode 2 -> DataNode 3."
          }
        ]
      }
    }
  },
  "pecst527": {
    "subjectCode": "PECST527",
    "subjectTitle": "Computer Graphics and Multimedia",
    "references": [
      "Donald Hearn, M. Pauline Baker, Computer Graphics with OpenGL, Pearson, 4th Edition, 2014",
      "Ralf Steinmetz, Klara Nahrstedt, Multimedia Systems, Springer, 2004",
      "Tay Vaughan, Multimedia: Making It Work, McGraw Hill, 9th Edition, 2014"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Scan Conversion & 2D Transformations",
        "syllabusTopics": [
          "Video Display Devices: CRT, Flat Panel, Raster Scan vs Random Scan",
          "Line Drawing: DDA and Bresenham's Line Algorithm",
          "Midpoint Circle Drawing Algorithm",
          "2D Geometric Transformations: Translation, Scaling, Rotation, Reflection, Shear",
          "Homogeneous Coordinates & Matrix Representation"
        ],
        "conceptualWalkthrough": [
          "**Raster vs Random Scan:** Raster scan paints the screen line-by-line using a fixed refresh rate (like a TV CRT beam). Random scan (vector display) draws electron beams directly between endpoints like a plotter, giving perfectly smooth lines without pixelation jaggies.",
          "**Bresenham's Integer Arithmetic Miracle:** DDA uses floating-point additions ($y_{k+1} = y_k + m$), requiring expensive rounding per pixel. Bresenham formulates a decision parameter $p_k$ that uses ONLY integer addition and bit-shifting, executing orders of magnitude faster in hardware.",
          "**Homogeneous Coordinates ($3 \\times 3$):** In standard Cartesian $(x,y)$, translation is addition ($x' = x + t_x$), while rotation/scaling are matrix multiplications. By moving to projective coordinates $(x, y, 1)$, translation becomes a matrix multiplication, allowing complex pipelines of rotation, scaling, and translation to be collapsed into a SINGLE composite matrix."
        ],
        "examDefinitions": [
          "**Scan Conversion:** The process of digitizing continuous geometric primitives (lines, circles, polygons) into discrete pixel grid intensity values in the frame buffer.",
          "**Homogeneous Coordinates:** A coordinate system where an $n$-dimensional point is represented by $n+1$ dimensions (e.g. $(x,y)$ represented as $(xh, yh, h)$), enabling translation to be expressed as linear matrix multiplication.",
          "**Aspect Ratio:** The ratio of the vertical points to horizontal points necessary to produce equal-length lines in both directions on a display screen."
        ],
        "questions3Mark": [
          {
            "question": "Why is Bresenham's line algorithm preferred over DDA?",
            "answer": "Bresenham's algorithm uses only incremental integer additions, subtractions, and bit shifts ($2p_k$), completely eliminating floating-point multiplications and division rounding operations required by DDA, leading to rapid hardware execution."
          },
          {
            "question": "What is the advantage of using Homogeneous Coordinates?",
            "answer": "They unify all affine transformations (translation, rotation, scaling, reflection, shearing) into identical $3 \\times 3$ matrix multiplications, allowing composite transformation pipelines to be pre-multiplied into a single concatenated transformation matrix."
          },
          {
            "question": "State the decision parameter update formula in Midpoint Circle Algorithm.",
            "answer": "Initial parameter: $p_0 = \\frac{5}{4} - r \\approx 1 - r$ (for integers).\n- If $p_k < 0$: Next pixel is $(x_{k+1}, y_k)$ and $p_{k+1} = p_k + 2x_{k+1} + 1$.\n- If $p_k \\ge 0$: Next pixel is $(x_{k+1}, y_k - 1)$ and $p_{k+1} = p_k + 2x_{k+1} + 1 - 2y_{k+1}$."
          }
        ],
        "questions5Mark": [
          {
            "question": "Derive Bresenham's Line Algorithm for slope $0 < m < 1$.",
            "answer": "**Derivation:**\n1. Line equation: $y = m(x_k + 1) + c$.\n2. Vertical distances: $d_1 = y - y_k$, $d_2 = (y_k + 1) - y$.\n3. Difference: $d_1 - d_2 = 2m(x_k + 1) - 2y_k + 2c - 1$.\n4. Substitute $m = \\Delta y / \\Delta x$ and multiply by $\\Delta x$ to define decision parameter $p_k = \\Delta x(d_1 - d_2) = 2\\Delta y \\cdot x_k - 2\\Delta x \\cdot y_k + C$.\n5. At step $k+1$: $p_{k+1} - p_k = 2\\Delta y - 2\\Delta x(y_{k+1} - y_k)$.\n6. If $p_k < 0$: choose lower pixel ($y_{k+1} = y_k$), so $p_{k+1} = p_k + 2\\Delta y$.\n7. If $p_k \\ge 0$: choose upper pixel ($y_{k+1} = y_k + 1$), so $p_{k+1} = p_k + 2\\Delta y - 2\\Delta x$."
          },
          {
            "question": "Derive the composite transformation matrix to rotate a 2D point about an arbitrary point $(x_r, y_r)$ by angle $\\theta$.",
            "answer": "**Steps:**\n1. Translate arbitrary point to origin: $T(-x_r, -y_r)$.\n2. Rotate about origin by $\\theta$: $R(\\theta)$.\n3. Translate back to original position: $T(x_r, y_r)$.\n\n**Matrix Multiplication:**\n$$M = T(x_r, y_r) \\cdot R(\\theta) \\cdot T(-x_r, -y_r)$$\n$$\\begin{bmatrix} 1 & 0 & x_r \\\\ 0 & 1 & y_r \\\\ 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} 1 & 0 & -x_r \\\\ 0 & 1 & -y_r \\\\ 0 & 0 & 1 \\end{bmatrix}$$\n$$= \\begin{bmatrix} \\cos\\theta & -\\sin\\theta & x_r(1-\\cos\\theta) + y_r\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta & y_r(1-\\cos\\theta) - x_r\\sin\\theta \\\\ 0 & 0 & 1 \\end{bmatrix}$$"
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the Midpoint Circle Drawing Algorithm. Utilize 8-way symmetry and trace the algorithm for a circle with radius $r = 10$ centered at the origin.",
            "answer": "**1. Eight-Way Symmetry:** A circle is symmetric about $x=0$, $y=0$, $x=y$, and $x=-y$. Calculating pixels for one octant ($0 \\le x \\le y$) yields the remaining 7 octants by sign and coordinate permutations.\n\n**2. Algorithm Formulation:**\n- Circle function: $f_{\\text{circle}}(x, y) = x^2 + y^2 - r^2$.\n- Midpoint between candidates $E(x_k+1, y_k)$ and $SE(x_k+1, y_k-1)$ is $M(x_k+1, y_k - 1/2)$.\n- Decision parameter: $p_k = f_{\\text{circle}}(x_k+1, y_k - 1/2) = (x_k+1)^2 + (y_k - 1/2)^2 - r^2$.\n- Initial value at $(0, r)$: $p_0 = 1^2 + (r - 1/2)^2 - r^2 = 5/4 - r \\approx 1 - r$.\n\n**3. Step-by-Step Trace for $r=10$:**\n- Initial: $(x_0, y_0) = (0, 10)$, $p_0 = 1 - 10 = -9$.\n- $k=0: p_0 = -9 < 0 \\rightarrow x_1 = 1, y_1 = 10, p_1 = -9 + 2(1) + 1 = -6$.\n- $k=1: p_1 = -6 < 0 \\rightarrow x_2 = 2, y_2 = 10, p_2 = -6 + 2(2) + 1 = -1$.\n- $k=2: p_2 = -1 < 0 \\rightarrow x_3 = 3, y_3 = 10, p_3 = -1 + 2(3) + 1 = 6$.\n- $k=3: p_3 = 6 \\ge 0 \\rightarrow x_4 = 4, y_4 = 9, p_4 = 6 + 2(4) + 1 - 2(9) = -3$.\n- $k=4: p_4 = -3 < 0 \\rightarrow x_5 = 5, y_5 = 9, p_5 = -3 + 2(5) + 1 = 8$.\n- $k=5: p_5 = 8 \\ge 0 \\rightarrow x_6 = 6, y_6 = 8, p_6 = 8 + 2(6) + 1 - 2(8) = 5$.\n- $k=6: p_6 = 5 \\ge 0 \\rightarrow x_7 = 7, y_7 = 7$ (Octant terminates as $x = y$).\n\n**Evaluation Key:** (1) 8-way symmetry explanation (2 marks), (2) Decision parameter derivation (2 marks), (3) Correct numerical trace table (3 marks), (4) Symmetry reflection point listing (1 mark).",
            "diagramDescription": "Circle diagram dividing perimeter into 8 octants, showing candidate midpoint between pixel centers in Octant 1."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: 2D Clipping & 3D Projections",
        "syllabusTopics": [
          "Clipping: Cohen-Sutherland Line Clipping, Liang-Barsky Line Clipping",
          "Sutherland-Hodgeman Polygon Clipping",
          "3D Transformations: 3D Translation, Rotation, Scaling",
          "Projections: Parallel (Orthographic, Oblique) vs Perspective (Vanishing Points)"
        ],
        "conceptualWalkthrough": [
          "**Cohen-Sutherland Outcodes (TBRL):** Divides the 2D plane into 9 regions using 4-bit region codes: Top, Bottom, Right, Left. If `code1 | code2 == 0000`, the line is trivially accepted. If `code1 & code2 != 0000`, both endpoints lie entirely outside one side, so the line is trivially rejected!",
          "**Liang-Barsky Superiority:** Uses parametric equations $x = x_1 + t\\Delta x$ and inequalities $t \\cdot p_k \\le q_k$. Calculates exact intersection parameter $t$ directly, avoiding iterative Cohen-Sutherland boundary intersection tests.",
          "**Perspective vs Parallel Projections:** Parallel maintains true scale ($z$ is discarded), ideal for CAD blueprints. Perspective mimics the human eye: distant objects appear smaller ($x' = x / (z/d)$), causing parallel lines to converge at vanishing points."
        ],
        "examDefinitions": [
          "**Clipping:** The process of identifying and removing parts of graphics primitives that lie outside a specified viewing region (clipping window).",
          "**Vanishing Point:** The point in perspective projection where a set of parallel lines that are not parallel to the projection plane appear to converge.",
          "**Sutherland-Hodgeman Algorithm:** An algorithm that clips a polygon against each window edge sequentially, outputting vertices that lie on the visible interior side."
        ],
        "questions3Mark": [
          {
            "question": "How does Cohen-Sutherland line clipping trivially accept or reject lines?",
            "answer": "- **Trivial Acceptance:** If bitwise OR of both endpoint 4-bit region codes is `0000` (`code1 | code2 == 0`).\n- **Trivial Rejection:** If bitwise AND of both endpoint codes is non-zero (`code1 & code2 != 0`), proving both points share an outside region."
          },
          {
            "question": "What is the difference between Orthographic and Oblique parallel projections?",
            "answer": "**Orthographic:** Projectors are perpendicular to the projection plane ($90^\\circ$).\n**Oblique:** Projectors intersect the projection plane at an angle other than $90^\\circ$ (e.g. Cavalier and Cabinet projections)."
          },
          {
            "question": "What are the 4 vertex clipping cases in the Sutherland-Hodgeman polygon clipping algorithm?",
            "answer": "1. In to In: Output vertex $V_2$.\n2. In to Out: Output intersection point $V'$.\n3. Out to Out: Output nothing.\n4. Out to In: Output intersection point $V'$ and vertex $V_2$."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain Liang-Barsky Line Clipping Algorithm with the parametric formulation.",
            "answer": "**Formulation:**\nParametric line: $x = x_1 + u\\Delta x$, $y = y_1 + u\\Delta y$, where $0 \\le u \\le 1$.\nWindow condition: $x_{\\min} \\le x_1 + u\\Delta x \\le x_{\\max}$ and $y_{\\min} \\le y_1 + u\\Delta y \\le y_{\\max}$.\nExpressed as: $u \\cdot p_k \\le q_k$ for $k=1,2,3,4$:\n- $p_1 = -\\Delta x, q_1 = x_1 - x_{\\min}$ (Left)\n- $p_2 = \\Delta x, q_2 = x_{\\max} - x_1$ (Right)\n- $p_3 = -\\Delta y, q_3 = y_1 - y_{\\min}$ (Bottom)\n- $p_4 = \\Delta y, q_4 = y_{\\max} - y_1$ (Top)\n\n**Algorithm:**\n- If $p_k < 0$: line enters boundary $\\rightarrow u_1 = \\max(u_1, q_k/p_k)$.\n- If $p_k > 0$: line leaves boundary $\\rightarrow u_2 = \\min(u_2, q_k/p_k)$.\n- If $u_1 > u_2$: reject line completely."
          },
          {
            "question": "Derive the 3D Perspective Projection matrix with the center of projection at the origin $(0,0,0)$ and view plane at $z = d$.",
            "answer": "**By Similar Triangles:**\n$$\\frac{x'}{d} = \\frac{x}{z} \\implies x' = \\frac{x}{z/d}$$\n$$\\frac{y'}{d} = \\frac{y}{z} \\implies y' = \\frac{y}{z/d}$$\n$$z' = d$$\n\n**Homogeneous Matrix Representation:**\n$$\\begin{bmatrix} x_h \\\\ y_h \\\\ z_h \\\\ h \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 1/d & 0 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} x \\\\ y \\\\ z \\\\ z/d \\end{bmatrix}$$\nDividing by homogeneous coordinate $h = z/d$ gives $(x', y', d)$."
          }
        ],
        "questions8Mark": [
          {
            "question": "Demonstrate Cohen-Sutherland line clipping. Given clipping window with $(x_{\\min}, y_{\\min}) = (10, 10)$ and $(x_{\\max}, y_{\\max}) = (50, 50)$, clip line $P_1(0, 20)$ to $P_2(60, 40)$.",
            "answer": "**1. Assign 4-bit Region Codes (Top, Bottom, Right, Left):**\n- For $P_1(0, 20)$: $x < 10$ (Left=1), $y \\in [10, 50]$. Code $C_1 = 0001$.\n- For $P_2(60, 40)$: $x > 50$ (Right=1), $y \\in [10, 50]$. Code $C_2 = 0010$.\n\n**2. Check Acceptance/Rejection:**\n- $C_1 | C_2 = 0001 | 0010 = 0011 \\neq 0$ (Not trivially accepted).\n- $C_1 \\& C_2 = 0001 \\& 0010 = 0000$ (Not trivially rejected, intersection required).\n\n**3. Slope of Line:**\n$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{40 - 20}{60 - 0} = \\frac{20}{60} = \\frac{1}{3}$$\n\n**4. Clip $P_1$ against Left Edge ($x = 10$):**\n- $y = y_1 + m(x - x_1) = 20 + (1/3)(10 - 0) = 23.33$.\n- New point $P_1'(10, 23.33)$. Region code of $P_1' = 0000$.\n\n**5. Clip $P_2$ against Right Edge ($x = 50$):**\n- $y = y_1 + m(x - x_1) = 20 + (1/3)(50 - 0) = 36.67$.\n- New point $P_2'(50, 36.67)$. Region code of $P_2' = 0000$.\n\n**6. Result:** Bitwise OR of $P_1'$ and $P_2'$ is $0000$. The clipped line segment is from $(10, 23.33)$ to $(50, 36.67)$.\n\n**Evaluation Key:** (1) Outcode assignment table (2 marks), (2) Acceptance/rejection logic test (2 marks), (3) Intersection calculation steps (3 marks), (4) Final coordinates (1 mark).",
            "diagramDescription": "9-region grid with central window [10,50]x[10,50] showing original line cutting left and right borders and the clipped segment."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Visible Surface Detection & Illumination Models",
        "syllabusTopics": [
          "Visible Surface Detection: Back-Face Detection, Z-Buffer (Depth-Buffer) Algorithm, A-Buffer",
          "Scan-Line Algorithm, Depth-Sort (Painter's Algorithm)",
          "Illumination Models: Ambient, Diffuse (Lambert's Cosine Law), Specular (Phong Model)",
          "Shading Techniques: Flat Shading, Gouraud Shading, Phong Shading"
        ],
        "conceptualWalkthrough": [
          "**Back-Face Culling:** A polygon with surface normal $N = (A, B, C)$ faces away from camera vector $V = (0, 0, 1)$ if $N \\cdot V = C < 0$. We can reject 50% of 3D geometry before rasterization!",
          "**Z-Buffer Elegance:** Maintains two 2D arrays: Color buffer and Depth buffer (Z-buffer, initialized to $\\infty$). When rasterizing a pixel $(x, y)$ with depth $z$: if $z < Z_{buffer}[x,y]$, then $Z_{buffer}[x,y] = z$ and $Color[x,y] = I$. Works in arbitrary polygon order!",
          "**Gouraud vs Phong Shading:** Gouraud computes lighting at polygon vertices and linearly interpolates *color intensities* across pixels. Fast, but misses specular highlights on large polygons. Phong interpolates the *normal vectors* at every pixel and evaluates the lighting model per pixel, producing sharp, realistic specular glints."
        ],
        "examDefinitions": [
          "**Z-Buffer Algorithm:** An image-space visible surface detection algorithm that compares surface depths at each pixel position on the projection plane.",
          "**Lambert's Cosine Law:** The reflected radiant intensity from an ideal diffuse surface is directly proportional to the cosine of the angle $\\theta$ between surface normal $N$ and light vector $L$: $I_d = I_p k_d (N \\cdot L)$.",
          "**Phong Specular Reflection:** Specular reflection intensity modeling glossy highlights: $I_s = I_p k_s (R \\cdot V)^n$, where $R$ is reflection vector, $V$ is view vector, and $n$ is shininess exponent."
        ],
        "questions3Mark": [
          {
            "question": "State the condition for a polygon to be identified as a back-face.",
            "answer": "For surface normal $N = (A, B, C)$ in viewing coordinates where view vector is along $-z$ axis: polygon is a back-face if $C \\le 0$ (or in general, dot product of normal and view vector $N \\cdot V_{\\text{view}} \\le 0$)."
          },
          {
            "question": "Why does Gouraud shading fail to render specular highlights accurately?",
            "answer": "Because Gouraud shading calculates lighting only at polygon vertices and linearly interpolates intensities across the polygon. If a specular highlight lies entirely inside the polygon face without touching a vertex, it is completely smoothed out and lost."
          },
          {
            "question": "What is the Painter's Algorithm?",
            "answer": "An object-space depth-sorting algorithm that sorts all polygons by their maximum depth ($z$) and paints them into the frame buffer from farthest to nearest, naturally overwriting distant surfaces with foreground surfaces."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the Z-Buffer (Depth Buffer) algorithm with pseudocode.",
            "answer": "**Data Structures:**\n- `depth_buffer[width][height]` initialized to 1.0 (maximum distance).\n- `color_buffer[width][height]` initialized to background color.\n\n**Pseudocode:**\n```c\nfor each polygon in scene {\n  for each pixel (x, y) inside polygon projection {\n    calculate depth z at (x, y);\n    if (z < depth_buffer[x][y]) {\n      depth_buffer[x][y] = z;\n      color_buffer[x][y] = calculate_color(polygon, x, y);\n    }\n  }\n}\n```\n**Complexity:** $O(N \\times \\text{pixels})$, independent of polygon depth sorting."
          },
          {
            "question": "Compare Gouraud Shading and Phong Shading.",
            "answer": "| Parameter | Gouraud Shading | Phong Shading |\n|---|---|---|\n| Interpolation | Linearly interpolates pixel color intensities | Linearly interpolates surface normal vectors |\n| Lighting Calculation | Evaluated only at polygon vertices | Evaluated at every individual pixel |\n| Specular Highlights | Inaccurate, highlights often missed | Accurate, sharp highlights rendered |\n| Computational Cost | Low (efficient for real-time rendering) | High (requires normal vector normalization per pixel) |\n| Mach Banding | Noticeable along shared polygon edges | Greatly reduced or eliminated |"
          }
        ],
        "questions8Mark": [
          {
            "question": "Derive the complete Phong Illumination Model combining Ambient, Diffuse, and Specular reflection terms with multiple light sources.",
            "answer": "**1. Ambient Reflection ($I_a$):**\nBackground environmental light scattering uniformly from all surfaces:\n$$I_{\\text{amb}} = I_a k_a$$\nwhere $I_a$ is ambient light intensity and $k_a \\in [0, 1]$ is ambient reflection coefficient.\n\n**2. Diffuse Reflection ($I_d$ - Lambertian):**\nLight scattering equally in all directions based on angle of incidence:\n$$I_{\\text{diff}} = I_p k_d (N \\cdot L) = I_p k_d \\cos\\theta$$\nwhere $N$ is unit surface normal, $L$ is unit light source direction, and $k_d$ is diffuse reflectivity.\n\n**3. Specular Reflection ($I_s$ - Phong):**\nReflected highlight along mirror angle $R$:\n$$I_{\\text{spec}} = I_p k_s (R \\cdot V)^n = I_p k_s \\cos^n\\phi$$\nwhere $R = 2(N \\cdot L)N - L$, $V$ is unit vector toward observer, $k_s$ is specular coefficient, and $n$ is specular reflection exponent (shininess parameter).\n\n**4. Complete Combined Formula (with distance attenuation $f_{\\text{att}}$):**\n$$I = I_a k_a + \\sum_{i=1}^m f_{\\text{att}, i} I_{p, i} \\left[ k_d (N \\cdot L_i) + k_s (R_i \\cdot V)^n \\right]$$\n\n**Evaluation Key:** (1) Ambient reflection term (2 marks), (2) Diffuse reflection with Lambert's law (2 marks), (3) Specular reflection with reflection vector derivation (2 marks), (4) Combined multi-light equation (2 marks).",
            "diagramDescription": "3D geometric vector diagram showing surface normal N, incident light vector L, reflection vector R, and viewer vector V with angles theta and phi."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Multimedia Systems, Audio, Video, and Compression",
        "syllabusTopics": [
          "Multimedia Elements: Text, Audio, Images, Video, Animation",
          "Digital Audio: Sampling Rate, Nyquist Theorem, Quantization, MIDI vs Sampled Audio",
          "Video Standards: NTSC, PAL, SECAM, HDTV",
          "Compression Techniques: Lossless (Huffman, LZW, Run-Length), Lossy (JPEG Pipeline, MPEG)"
        ],
        "conceptualWalkthrough": [
          "**Nyquist Sampling Theorem:** To reconstruct a continuous bandlimited analog signal of maximum frequency $f_{\\max}$, sampling frequency must satisfy $f_s \\ge 2 f_{\\max}$. Human hearing ranges up to 20 kHz, which is why Audio CDs sample at 44.1 kHz.",
          "**MIDI vs Sampled Digital Audio:** Sampled audio records actual sound waves (huge files). MIDI does NOT record audio waves—it records musical commands ('Play Middle C note on a Grand Piano at velocity 80 for 0.5s'), taking negligible kilobytes.",
          "**JPEG Image Compression Pipeline:**\n1. RGB to YCbCr (decoupling brightness Y from color chrominance Cb, Cr).\n2. Chroma Subsampling 4:2:0 (human eyes detect brightness details much sharper than color).\n3. $8 \\times 8$ Discrete Cosine Transform (DCT) shifting spatial energy to frequency domain.\n4. Quantization (lossy division by quantization table, wiping high-frequency noise to zeros).\n5. Zig-zag scan, Run-length encoding (RLE), and Huffman entropy coding."
        ],
        "examDefinitions": [
          "**Nyquist Rate:** The minimum sampling rate required to avoid aliasing when digitizing a continuous signal, equal to twice the highest frequency present: $f_s = 2 f_{\\max}$.",
          "**MIDI (Musical Instrument Digital Interface):** A communications protocol and hardware specification that allows electronic musical instruments, computers, and synthesizers to transmit musical performance data.",
          "**Discrete Cosine Transform (DCT):** A mathematical transform that converts an $8 \\times 8$ block of spatial pixel intensities into elementary frequency components."
        ],
        "questions3Mark": [
          {
            "question": "Calculate the storage requirement for 1 minute of uncompressed CD-quality stereo audio (44.1 kHz, 16-bit).",
            "answer": "$$\\text{Bytes} = \\frac{44,100 \\text{ samples/sec} \\times 16 \\text{ bits} \\times 2 \\text{ channels} \\times 60 \\text{ sec}}{8 \\text{ bits/byte}}$$\n$$= 44,100 \\times 2 \\times 2 \\times 60 = 10,584,000 \\text{ bytes} \\approx 10.58 \\text{ MB}$$"
          },
          {
            "question": "What is the role of Chroma Subsampling (e.g. 4:2:0) in image and video compression?",
            "answer": "Human visual perception is substantially more sensitive to variations in luminance (brightness, $Y$) than chrominance (color, $Cb, Cr$). Chroma subsampling halves color resolution horizontally and vertically without noticeable degradation, achieving 50% bandwidth reduction."
          },
          {
            "question": "Differentiate between Intra-frame (I-frame) and Inter-frame (P/B-frame) in MPEG video compression.",
            "answer": "**I-frame (Intra):** Self-contained, compressed like a standalone JPEG image without reference to other frames.\n**P-frame (Predicted):** Encodes only motion vectors and difference residuals relative to previous I/P frames.\n**B-frame (Bi-directional):** Interpolates motion prediction from both preceding and succeeding frames."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the step-by-step pipeline of JPEG Image Compression.",
            "answer": "1. **Color Space Conversion:** Transform $RGB$ to $YC_bC_r$ to separate luminance from chrominance.\n2. **Downsampling:** Subsample chrominance components (4:2:0 or 4:2:2).\n3. **$8 \\times 8$ Block Partitioning:** Image divided into $8 \\times 8$ pixel blocks.\n4. **Discrete Cosine Transform (DCT):** Converts spatial domain intensities into 64 DCT frequency coefficients (1 DC coefficient and 63 AC coefficients).\n5. **Quantization (Lossy Step):** Each coefficient divided by values in standard Quantization matrix; high-frequency components round to zero.\n6. **Zig-Zag Scan:** Rearranges 2D matrix into 1D array, grouping trailing zeros together.\n7. **Entropy Encoding:** Run-Length Encoding (RLE) followed by Huffman coding."
          },
          {
            "question": "Encode the string 'ABRACADABRA' using Huffman Coding and calculate average code length.",
            "answer": "**Frequencies:** A: 5, B: 2, R: 2, C: 1, D: 1. Total = 11.\n1. Merge D(1) + C(1) $\\rightarrow$ CD(2).\n2. Merge B(2) + R(2) $\\rightarrow$ BR(4).\n3. Merge CD(2) + BR(4) $\\rightarrow$ BCDR(6).\n4. Merge A(5) + BCDR(6) $\\rightarrow$ Root(11).\n\n**Assigned Codes:**\n- A: `0` (length 1)\n- B: `110` (length 3)\n- R: `111` (length 3)\n- C: `100` (length 3)\n- D: `101` (length 3)\n\n**Total bits:** $5(1) + 2(3) + 2(3) + 1(3) + 1(3) = 5 + 6 + 6 + 3 + 3 = 23$ bits. (Original ASCII: $11 \\times 8 = 88$ bits, compression ratio $> 3.8:1$)."
          }
        ],
        "questions8Mark": [
          {
            "question": "Explain the MPEG video compression standard. Detail the roles of I, P, and B frames, Macroblocks, and Motion Estimation/Compensation algorithms.",
            "answer": "**1. Temporal and Spatial Redundancy:** Video consists of 24-30 frames/sec where adjacent frames are almost identical (temporal redundancy), and pixels within frames have correlated colors (spatial redundancy).\n\n**2. Frame Types (GOP - Group of Pictures):**\n- **I-Frames (Intra-coded):** Reference anchors, highest quality, zero motion vectors, largest file size.\n- **P-Frames (Forward Predicted):** Compressed relative to past I or P frame using motion vectors.\n- **B-Frames (Bidirectionally Predicted):** Highest compression ratio; predicts motion vectors looking both forward and backward in time.\n\n**3. Motion Estimation & Compensation:**\n- Frames are segmented into $16 \\times 16$ Macroblocks.\n- The encoder searches the reference frame for the best-matching macroblock within a search window.\n- A **Motion Vector $(dx, dy)$** is recorded alongside the residual error difference matrix.\n- The residual error is then DCT-transformed and quantized exactly like JPEG.\n\n**4. Sequence Ordering:** Transmission order differs from display order because B-frames require future reference frames to be decoded first!\n\n**Evaluation Key:** (1) Spatial vs Temporal redundancy (2 marks), (2) Characteristics of I, P, and B frames (3 marks), (3) Macroblock motion vector search mechanism (2 marks), (4) Decode vs Display order (1 mark).",
            "diagramDescription": "MPEG GOP structure diagram showing sequence I-B-B-P-B-B-P with forward arrows from I to P, and bidirectional arrows to B frames."
          }
        ]
      }
    }
  },
  "pecst524": {
    "subjectCode": "PECST524",
    "subjectTitle": "Data Compression",
    "references": [
      "Khalid Sayood, Introduction to Data Compression, Morgan Kaufmann, 5th Edition, 2017",
      "David Salomon, Data Compression: The Complete Reference, Springer, 4th Edition, 2007"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Introduction to Compression & Information Theory",
        "syllabusTopics": [
          "Concept of Information, Entropy (Shannon Entropy: H = -sum(p log p))",
          "Compression Ratio, Distortion Metrics (MSE, PSNR)",
          "Lossless vs Lossy Compression trade-offs",
          "Kraft-McMillan Inequality and Prefix Codes"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Introduction to Compression & Information Theory:** Focuses on formal analytical models and structural execution in Data Compression.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Concept of Information, Entropy (Shannon Entropy: H = -sum(p log p)).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Concept of Information, Entropy (Shannon Entropy):** Formal KTU syllabus definition governing Concept of Information, Entropy (Shannon Entropy: H = -sum(p log p)).",
          "**Operational Theorem (Compression Ratio, Distortion Metrics (MSE, PSNR)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Introduction to Compression & Information Theory."
        ],
        "questions3Mark": [
          {
            "question": "Define Concept of Information, Entropy (Shannon Entropy and state its key significance in Data Compression.",
            "answer": "In Data Compression, Concept of Information, Entropy (Shannon Entropy defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Compression Ratio, Distortion Metrics (MSE, PSNR).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Introduction to Compression & Information Theory.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Compression Ratio, Distortion Metrics (MSE, PSNR).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Compression Ratio, Distortion Metrics (MSE, PSNR)."
          },
          {
            "question": "Derive the efficiency/performance model for Lossless vs Lossy Compression trade-offs.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Introduction to Compression & Information Theory. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Introduction to Compression & Information Theory."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Lossless Compression Algorithms",
        "syllabusTopics": [
          "Huffman Coding (Static and Adaptive Huffman)",
          "Arithmetic Coding (Interval Sub-division)",
          "Dictionary Techniques: LZ77, LZ78, and LZW Algorithm",
          "Run-Length Encoding and Burrows-Wheeler Transform (BWT)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Lossless Compression Algorithms:** Focuses on formal analytical models and structural execution in Data Compression.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Huffman Coding (Static and Adaptive Huffman).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Huffman Coding (Static and Adaptive Huffman)):** Formal KTU syllabus definition governing Huffman Coding (Static and Adaptive Huffman).",
          "**Operational Theorem (Arithmetic Coding (Interval Sub-division)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Lossless Compression Algorithms."
        ],
        "questions3Mark": [
          {
            "question": "Define Huffman Coding (Static and Adaptive Huffman) and state its key significance in Data Compression.",
            "answer": "In Data Compression, Huffman Coding (Static and Adaptive Huffman) defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Arithmetic Coding (Interval Sub-division).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Lossless Compression Algorithms.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Arithmetic Coding (Interval Sub-division).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Arithmetic Coding (Interval Sub-division)."
          },
          {
            "question": "Derive the efficiency/performance model for Dictionary Techniques: LZ77, LZ78, and LZW Algorithm.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Lossless Compression Algorithms. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Lossless Compression Algorithms."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Lossy Compression Techniques",
        "syllabusTopics": [
          "Quantization: Scalar (Uniform vs Non-uniform, Lloyd-Max Quantizer) and Vector Quantization",
          "Transform Coding: Karhunen-Loève Transform (KLT) and Discrete Cosine Transform (DCT)",
          "Subband Coding and Wavelet-based Compression (EZW, SPIHT)",
          "Audio Compression: Psychoacoustics and MPEG-1 Layer III (MP3)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Lossy Compression Techniques:** Focuses on formal analytical models and structural execution in Data Compression.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Quantization: Scalar (Uniform vs Non-uniform, Lloyd-Max Quantizer) and Vector Quantization.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Quantization):** Formal KTU syllabus definition governing Quantization: Scalar (Uniform vs Non-uniform, Lloyd-Max Quantizer) and Vector Quantization.",
          "**Operational Theorem (Transform Coding):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Lossy Compression Techniques."
        ],
        "questions3Mark": [
          {
            "question": "Define Quantization and state its key significance in Data Compression.",
            "answer": "In Data Compression, Quantization defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Transform Coding.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Lossy Compression Techniques.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Transform Coding: Karhunen-Loève Transform (KLT) and Discrete Cosine Transform (DCT).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Transform Coding."
          },
          {
            "question": "Derive the efficiency/performance model for Subband Coding and Wavelet-based Compression (EZW, SPIHT).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Lossy Compression Techniques. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Lossy Compression Techniques."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Image and Video Compression Standards",
        "syllabusTopics": [
          "JPEG Baseline and JPEG 2000 Architecture",
          "H.264 / AVC and HEVC Video Compression Standards",
          "Motion Estimation: Block Matching Algorithms (Full Search, Three-Step Search)",
          "Applications: Streaming video architectures and compression benchmarks"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Image and Video Compression Standards:** Focuses on formal analytical models and structural execution in Data Compression.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: JPEG Baseline and JPEG 2000 Architecture.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (JPEG Baseline and JPEG 2000 Architecture):** Formal KTU syllabus definition governing JPEG Baseline and JPEG 2000 Architecture.",
          "**Operational Theorem (H.264 / AVC and HEVC Video Compression Standards):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Image and Video Compression Standards."
        ],
        "questions3Mark": [
          {
            "question": "Define JPEG Baseline and JPEG 2000 Architecture and state its key significance in Data Compression.",
            "answer": "In Data Compression, JPEG Baseline and JPEG 2000 Architecture defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing H.264 / AVC and HEVC Video Compression Standards.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Image and Video Compression Standards.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of H.264 / AVC and HEVC Video Compression Standards.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of H.264 / AVC and HEVC Video Compression Standards."
          },
          {
            "question": "Derive the efficiency/performance model for Motion Estimation: Block Matching Algorithms (Full Search, Three-Step Search).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Image and Video Compression Standards. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Image and Video Compression Standards."
          }
        ]
      }
    }
  },
  "pecst525": {
    "subjectCode": "PECST525",
    "subjectTitle": "Data Mining",
    "references": [
      "Jiawei Han, Micheline Kamber, Jian Pei, Data Mining: Concepts and Techniques, Morgan Kaufmann, 3rd Edition, 2011",
      "Pang-Ning Tan, Michael Steinbach, Vipin Kumar, Introduction to Data Mining, Pearson, 2nd Edition, 2018"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Data Mining Fundamentals & Preprocessing",
        "syllabusTopics": [
          "Data Mining Functionalities and Tasks (Predictive vs Descriptive)",
          "Data Objects, Attribute Types (Nominal, Binary, Ordinal, Numeric)",
          "Data Cleaning, Integration, Transformation (Min-Max, Z-score)",
          "Data Reduction: PCA, Attribute Subset Selection, Discretization"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Data Mining Fundamentals & Preprocessing:** Focuses on formal analytical models and structural execution in Data Mining.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Data Mining Functionalities and Tasks (Predictive vs Descriptive).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Data Mining Functionalities and Tasks (Predictive vs Descriptive)):** Formal KTU syllabus definition governing Data Mining Functionalities and Tasks (Predictive vs Descriptive).",
          "**Operational Theorem (Data Objects, Attribute Types (Nominal, Binary, Ordinal, Numeric)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Data Mining Fundamentals & Preprocessing."
        ],
        "questions3Mark": [
          {
            "question": "Define Data Mining Functionalities and Tasks (Predictive vs Descriptive) and state its key significance in Data Mining.",
            "answer": "In Data Mining, Data Mining Functionalities and Tasks (Predictive vs Descriptive) defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Data Objects, Attribute Types (Nominal, Binary, Ordinal, Numeric).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Data Mining Fundamentals & Preprocessing.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Data Objects, Attribute Types (Nominal, Binary, Ordinal, Numeric).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Data Objects, Attribute Types (Nominal, Binary, Ordinal, Numeric)."
          },
          {
            "question": "Derive the efficiency/performance model for Data Cleaning, Integration, Transformation (Min-Max, Z-score).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Data Mining Fundamentals & Preprocessing. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Data Mining Fundamentals & Preprocessing."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Association Rule Mining & Frequent Itemsets",
        "syllabusTopics": [
          "Market Basket Analysis: Support, Confidence, Lift Metrics",
          "Apriori Algorithm: Candidate generation, Apriori property (Downward Closure)",
          "FP-Growth Algorithm: Frequent Pattern Tree construction without candidate generation",
          "Multi-level and Multi-dimensional Association Rules"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Association Rule Mining & Frequent Itemsets:** Focuses on formal analytical models and structural execution in Data Mining.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Market Basket Analysis: Support, Confidence, Lift Metrics.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Market Basket Analysis):** Formal KTU syllabus definition governing Market Basket Analysis: Support, Confidence, Lift Metrics.",
          "**Operational Theorem (Apriori Algorithm):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Association Rule Mining & Frequent Itemsets."
        ],
        "questions3Mark": [
          {
            "question": "Define Market Basket Analysis and state its key significance in Data Mining.",
            "answer": "In Data Mining, Market Basket Analysis defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Apriori Algorithm.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Association Rule Mining & Frequent Itemsets.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Apriori Algorithm: Candidate generation, Apriori property (Downward Closure).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Apriori Algorithm."
          },
          {
            "question": "Derive the efficiency/performance model for FP-Growth Algorithm: Frequent Pattern Tree construction without candidate generation.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Association Rule Mining & Frequent Itemsets. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Association Rule Mining & Frequent Itemsets."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Classification and Prediction",
        "syllabusTopics": [
          "Decision Tree Induction: ID3, C4.5, CART (Information Gain, Gain Ratio, Gini Index)",
          "Bayesian Classification: Bayes Theorem, Naive Bayes Classifier, Laplace Correction",
          "Model Overfitting, Tree Pruning, and Cross-Validation (K-fold, Stratified)",
          "Ensemble Methods: Bagging, Random Forests, AdaBoost"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Classification and Prediction:** Focuses on formal analytical models and structural execution in Data Mining.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Decision Tree Induction: ID3, C4.5, CART (Information Gain, Gain Ratio, Gini Index).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Decision Tree Induction):** Formal KTU syllabus definition governing Decision Tree Induction: ID3, C4.5, CART (Information Gain, Gain Ratio, Gini Index).",
          "**Operational Theorem (Bayesian Classification):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Classification and Prediction."
        ],
        "questions3Mark": [
          {
            "question": "Define Decision Tree Induction and state its key significance in Data Mining.",
            "answer": "In Data Mining, Decision Tree Induction defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Bayesian Classification.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Classification and Prediction.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Bayesian Classification: Bayes Theorem, Naive Bayes Classifier, Laplace Correction.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Bayesian Classification."
          },
          {
            "question": "Derive the efficiency/performance model for Model Overfitting, Tree Pruning, and Cross-Validation (K-fold, Stratified).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Classification and Prediction. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Classification and Prediction."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Cluster Analysis & Advanced Mining",
        "syllabusTopics": [
          "Clustering Metrics: Partitioning (k-Means, k-Medoids / PAM)",
          "Hierarchical Clustering: Agglomerative vs Divisive (Single, Complete, Average Linkage)",
          "Density-Based Clustering: DBSCAN (Eps, MinPts, Core, Border, Noise points)",
          "Outlier Analysis and Graph Mining Applications"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Cluster Analysis & Advanced Mining:** Focuses on formal analytical models and structural execution in Data Mining.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Clustering Metrics: Partitioning (k-Means, k-Medoids / PAM).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Clustering Metrics):** Formal KTU syllabus definition governing Clustering Metrics: Partitioning (k-Means, k-Medoids / PAM).",
          "**Operational Theorem (Hierarchical Clustering):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Cluster Analysis & Advanced Mining."
        ],
        "questions3Mark": [
          {
            "question": "Define Clustering Metrics and state its key significance in Data Mining.",
            "answer": "In Data Mining, Clustering Metrics defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Hierarchical Clustering.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Cluster Analysis & Advanced Mining.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Hierarchical Clustering: Agglomerative vs Divisive (Single, Complete, Average Linkage).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Hierarchical Clustering."
          },
          {
            "question": "Derive the efficiency/performance model for Density-Based Clustering: DBSCAN (Eps, MinPts, Core, Border, Noise points).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Cluster Analysis & Advanced Mining. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Cluster Analysis & Advanced Mining."
          }
        ]
      }
    }
  },
  "pecst526": {
    "subjectCode": "PECST526",
    "subjectTitle": "Digital Signal Processing",
    "references": [
      "John G. Proakis, Dimitris G. Manolakis, Digital Signal Processing: Principles, Algorithms and Applications, Pearson, 4th Edition, 2007",
      "Alan V. Oppenheim, Ronald W. Schafer, Discrete-Time Signal Processing, Prentice Hall, 3rd Edition, 2009"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Discrete-Time Signals and Systems",
        "syllabusTopics": [
          "Classification of Signals: Energy vs Power, Periodic vs Aperiodic",
          "LTI Systems: Convolution Sum, Causality, Stability (BIBO criterion)",
          "Z-Transform: Region of Convergence (ROC), Properties, Inverse Z-Transform",
          "Difference Equations and System Transfer Function H(z)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Discrete-Time Signals and Systems:** Focuses on formal analytical models and structural execution in Digital Signal Processing.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Classification of Signals: Energy vs Power, Periodic vs Aperiodic.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Classification of Signals):** Formal KTU syllabus definition governing Classification of Signals: Energy vs Power, Periodic vs Aperiodic.",
          "**Operational Theorem (LTI Systems):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Discrete-Time Signals and Systems."
        ],
        "questions3Mark": [
          {
            "question": "Define Classification of Signals and state its key significance in Digital Signal Processing.",
            "answer": "In Digital Signal Processing, Classification of Signals defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing LTI Systems.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Discrete-Time Signals and Systems.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of LTI Systems: Convolution Sum, Causality, Stability (BIBO criterion).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of LTI Systems."
          },
          {
            "question": "Derive the efficiency/performance model for Z-Transform: Region of Convergence (ROC), Properties, Inverse Z-Transform.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Discrete-Time Signals and Systems. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Discrete-Time Signals and Systems."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Frequency Domain Analysis & FFT",
        "syllabusTopics": [
          "Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval)",
          "Radix-2 Fast Fourier Transform: Decimation-in-Time (DIT-FFT) Butterfly",
          "Radix-2 Decimation-in-Frequency (DIF-FFT) Butterfly",
          "Computation Complexity: N^2 direct vs (N/2) log2(N) FFT speedup"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Frequency Domain Analysis & FFT:** Focuses on formal analytical models and structural execution in Digital Signal Processing.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval)):** Formal KTU syllabus definition governing Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval).",
          "**Operational Theorem (Radix-2 Fast Fourier Transform):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Frequency Domain Analysis & FFT."
        ],
        "questions3Mark": [
          {
            "question": "Define Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval) and state its key significance in Digital Signal Processing.",
            "answer": "In Digital Signal Processing, Discrete Fourier Transform (DFT) and its Properties (Circularity, Parseval) defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Radix-2 Fast Fourier Transform.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Frequency Domain Analysis & FFT.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Radix-2 Fast Fourier Transform: Decimation-in-Time (DIT-FFT) Butterfly.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Radix-2 Fast Fourier Transform."
          },
          {
            "question": "Derive the efficiency/performance model for Radix-2 Decimation-in-Frequency (DIF-FFT) Butterfly.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Frequency Domain Analysis & FFT. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Frequency Domain Analysis & FFT."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Digital Filter Design",
        "syllabusTopics": [
          "IIR Filter Design: Butterworth and Chebyshev approximations",
          "Bilinear Transformation and Impulse Invariance Methods (Frequency Warping)",
          "FIR Filter Design: Linear phase characteristics, Windowing methods (Hamming, Hanning, Blackman)",
          "Comparison: FIR (always stable, linear phase) vs IIR (computational efficiency)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Digital Filter Design:** Focuses on formal analytical models and structural execution in Digital Signal Processing.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: IIR Filter Design: Butterworth and Chebyshev approximations.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (IIR Filter Design):** Formal KTU syllabus definition governing IIR Filter Design: Butterworth and Chebyshev approximations.",
          "**Operational Theorem (Bilinear Transformation and Impulse Invariance Methods (Frequency Warping)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Digital Filter Design."
        ],
        "questions3Mark": [
          {
            "question": "Define IIR Filter Design and state its key significance in Digital Signal Processing.",
            "answer": "In Digital Signal Processing, IIR Filter Design defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Bilinear Transformation and Impulse Invariance Methods (Frequency Warping).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Digital Filter Design.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Bilinear Transformation and Impulse Invariance Methods (Frequency Warping).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Bilinear Transformation and Impulse Invariance Methods (Frequency Warping)."
          },
          {
            "question": "Derive the efficiency/performance model for FIR Filter Design: Linear phase characteristics, Windowing methods (Hamming, Hanning, Blackman).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Digital Filter Design. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Digital Filter Design."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Finite Word Length Effects & DSP Architecture",
        "syllabusTopics": [
          "Representation of Numbers: Fixed point vs Floating point",
          "Quantization Noise, Coefficient Quantization, Limit Cycle Oscillations",
          "DSP Processor Architecture: Harvard Architecture, MAC unit, Pipelining, Circular Addressing",
          "Applications: Audio equalization, speech processing, and biomedical filtering"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Finite Word Length Effects & DSP Architecture:** Focuses on formal analytical models and structural execution in Digital Signal Processing.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Representation of Numbers: Fixed point vs Floating point.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Representation of Numbers):** Formal KTU syllabus definition governing Representation of Numbers: Fixed point vs Floating point.",
          "**Operational Theorem (Quantization Noise, Coefficient Quantization, Limit Cycle Oscillations):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Finite Word Length Effects & DSP Architecture."
        ],
        "questions3Mark": [
          {
            "question": "Define Representation of Numbers and state its key significance in Digital Signal Processing.",
            "answer": "In Digital Signal Processing, Representation of Numbers defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Quantization Noise, Coefficient Quantization, Limit Cycle Oscillations.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Finite Word Length Effects & DSP Architecture.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Quantization Noise, Coefficient Quantization, Limit Cycle Oscillations.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Quantization Noise, Coefficient Quantization, Limit Cycle Oscillations."
          },
          {
            "question": "Derive the efficiency/performance model for DSP Processor Architecture: Harvard Architecture, MAC unit, Pipelining, Circular Addressing.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Finite Word Length Effects & DSP Architecture. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Finite Word Length Effects & DSP Architecture."
          }
        ]
      }
    }
  },
  "pecst528": {
    "subjectCode": "PECST528",
    "subjectTitle": "Advanced Computer Architecture",
    "references": [
      "John L. Hennessy, David A. Patterson, Computer Architecture: A Quantitative Approach, Morgan Kaufmann, 6th Edition, 2017",
      "Kai Hwang, Naresh Jotwani, Advanced Computer Architecture: Parallelism, Scalability, Programmability, McGraw Hill, 3rd Edition, 2016"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Instruction-Level Parallelism (ILP) & Dynamic Scheduling",
        "syllabusTopics": [
          "Pipelining Hazards: Structural, Data (RAW, WAR, WAW), Control",
          "Dynamic Scheduling: Scoreboarding and Tomasulo's Algorithm (Reservation Stations)",
          "Dynamic Branch Prediction: 2-bit saturating counter, Branch Target Buffer (BTB), Tournament predictors",
          "Hardware-based Speculation and Reorder Buffer (ROB)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Instruction-Level Parallelism (ILP) & Dynamic Scheduling:** Focuses on formal analytical models and structural execution in Advanced Computer Architecture.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Pipelining Hazards: Structural, Data (RAW, WAR, WAW), Control.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Pipelining Hazards):** Formal KTU syllabus definition governing Pipelining Hazards: Structural, Data (RAW, WAR, WAW), Control.",
          "**Operational Theorem (Dynamic Scheduling):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Instruction-Level Parallelism (ILP) & Dynamic Scheduling."
        ],
        "questions3Mark": [
          {
            "question": "Define Pipelining Hazards and state its key significance in Advanced Computer Architecture.",
            "answer": "In Advanced Computer Architecture, Pipelining Hazards defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Dynamic Scheduling.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Instruction-Level Parallelism (ILP) & Dynamic Scheduling.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Dynamic Scheduling: Scoreboarding and Tomasulo's Algorithm (Reservation Stations).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Dynamic Scheduling."
          },
          {
            "question": "Derive the efficiency/performance model for Dynamic Branch Prediction: 2-bit saturating counter, Branch Target Buffer (BTB), Tournament predictors.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Instruction-Level Parallelism (ILP) & Dynamic Scheduling. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Instruction-Level Parallelism (ILP) & Dynamic Scheduling."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Data-Level and Thread-Level Parallelism",
        "syllabusTopics": [
          "SIMD Architectures and Vector Processors (Vector Registers, Chaining)",
          "GPU Architecture: Streaming Multiprocessors, CUDA thread hierarchy (Grid, Block, Warp)",
          "Multithreading: Fine-grained, Coarse-grained, Simultaneous Multithreading (SMT / Hyperthreading)",
          "Flynn's Taxonomy: SISD, SIMD, MISD, MIMD"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Data-Level and Thread-Level Parallelism:** Focuses on formal analytical models and structural execution in Advanced Computer Architecture.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: SIMD Architectures and Vector Processors (Vector Registers, Chaining).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (SIMD Architectures and Vector Processors (Vector Registers, Chaining)):** Formal KTU syllabus definition governing SIMD Architectures and Vector Processors (Vector Registers, Chaining).",
          "**Operational Theorem (GPU Architecture):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Data-Level and Thread-Level Parallelism."
        ],
        "questions3Mark": [
          {
            "question": "Define SIMD Architectures and Vector Processors (Vector Registers, Chaining) and state its key significance in Advanced Computer Architecture.",
            "answer": "In Advanced Computer Architecture, SIMD Architectures and Vector Processors (Vector Registers, Chaining) defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing GPU Architecture.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Data-Level and Thread-Level Parallelism.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of GPU Architecture: Streaming Multiprocessors, CUDA thread hierarchy (Grid, Block, Warp).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of GPU Architecture."
          },
          {
            "question": "Derive the efficiency/performance model for Multithreading: Fine-grained, Coarse-grained, Simultaneous Multithreading (SMT / Hyperthreading).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Data-Level and Thread-Level Parallelism. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Data-Level and Thread-Level Parallelism."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Memory Hierarchy Design & Interconnects",
        "syllabusTopics": [
          "Cache Optimization: Multi-level caches, Non-blocking caches, Victim caches, Way prediction",
          "Virtual Memory and TLB Miss Handling",
          "Interconnection Topologies: Crossbar, Bus, 2D Mesh, Torus, Hypercube (Diameter, Bisection Bandwidth)",
          "Routing Algorithms: Store-and-forward vs Wormhole routing"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Memory Hierarchy Design & Interconnects:** Focuses on formal analytical models and structural execution in Advanced Computer Architecture.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Cache Optimization: Multi-level caches, Non-blocking caches, Victim caches, Way prediction.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Cache Optimization):** Formal KTU syllabus definition governing Cache Optimization: Multi-level caches, Non-blocking caches, Victim caches, Way prediction.",
          "**Operational Theorem (Virtual Memory and TLB Miss Handling):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Memory Hierarchy Design & Interconnects."
        ],
        "questions3Mark": [
          {
            "question": "Define Cache Optimization and state its key significance in Advanced Computer Architecture.",
            "answer": "In Advanced Computer Architecture, Cache Optimization defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Virtual Memory and TLB Miss Handling.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Memory Hierarchy Design & Interconnects.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Virtual Memory and TLB Miss Handling.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Virtual Memory and TLB Miss Handling."
          },
          {
            "question": "Derive the efficiency/performance model for Interconnection Topologies: Crossbar, Bus, 2D Mesh, Torus, Hypercube (Diameter, Bisection Bandwidth).",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Memory Hierarchy Design & Interconnects. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Memory Hierarchy Design & Interconnects."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Multiprocessors & Cache Coherence",
        "syllabusTopics": [
          "Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA)",
          "Cache Coherence Problem: Snooping protocols (MSI, MESI protocol state transitions)",
          "Directory-Based Cache Coherence Protocols for scalable multicore systems",
          "Memory Consistency Models: Strict, Sequential Consistency, Relaxed consistency"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Multiprocessors & Cache Coherence:** Focuses on formal analytical models and structural execution in Advanced Computer Architecture.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA)):** Formal KTU syllabus definition governing Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA).",
          "**Operational Theorem (Cache Coherence Problem):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Multiprocessors & Cache Coherence."
        ],
        "questions3Mark": [
          {
            "question": "Define Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA) and state its key significance in Advanced Computer Architecture.",
            "answer": "In Advanced Computer Architecture, Symmetric Multiprocessors (SMP) vs Distributed Shared Memory (NUMA) defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Cache Coherence Problem.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Multiprocessors & Cache Coherence.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Cache Coherence Problem: Snooping protocols (MSI, MESI protocol state transitions).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Cache Coherence Problem."
          },
          {
            "question": "Derive the efficiency/performance model for Directory-Based Cache Coherence Protocols for scalable multicore systems.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Multiprocessors & Cache Coherence. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Multiprocessors & Cache Coherence."
          }
        ]
      }
    }
  },
  "pecst595": {
    "subjectCode": "PECST595",
    "subjectTitle": "Advanced Graph Algorithms",
    "references": [
      "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms, MIT Press, 4th Edition, 2022",
      "Jon Kleinberg, Éva Tardos, Algorithm Design, Pearson, 2006"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Graph Fundamentals and Shortest Paths",
        "syllabusTopics": [
          "Graph Representations: Adjacency Matrix vs Adjacency List",
          "Topological Sort, Strongly Connected Components (Tarjan's, Kosaraju's Algorithm)",
          "Shortest Paths: Bellman-Ford (negative weight detection), Johnson's Algorithm for all-pairs",
          "Shortest Path Trees and DAG Shortest Paths"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Graph Fundamentals and Shortest Paths:** Focuses on formal analytical models and structural execution in Advanced Graph Algorithms.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Graph Representations: Adjacency Matrix vs Adjacency List.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Graph Representations):** Formal KTU syllabus definition governing Graph Representations: Adjacency Matrix vs Adjacency List.",
          "**Operational Theorem (Topological Sort, Strongly Connected Components (Tarjan's, Kosaraju's Algorithm)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Graph Fundamentals and Shortest Paths."
        ],
        "questions3Mark": [
          {
            "question": "Define Graph Representations and state its key significance in Advanced Graph Algorithms.",
            "answer": "In Advanced Graph Algorithms, Graph Representations defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Topological Sort, Strongly Connected Components (Tarjan's, Kosaraju's Algorithm).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Graph Fundamentals and Shortest Paths.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Topological Sort, Strongly Connected Components (Tarjan's, Kosaraju's Algorithm).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Topological Sort, Strongly Connected Components (Tarjan's, Kosaraju's Algorithm)."
          },
          {
            "question": "Derive the efficiency/performance model for Shortest Paths: Bellman-Ford (negative weight detection), Johnson's Algorithm for all-pairs.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Graph Fundamentals and Shortest Paths. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Graph Fundamentals and Shortest Paths."
          }
        ]
      },
      "2": {
        "moduleNum": 2,
        "title": "Module 2: Network Flows and Bipartite Matching",
        "syllabusTopics": [
          "Flow Networks: Capacity, Conservation, Residual Networks, Augmenting Paths",
          "Ford-Fulkerson Method and Edmonds-Karp Algorithm (O(V E^2) BFS path selection)",
          "Max-Flow Min-Cut Theorem and Formal Proof",
          "Applications: Bipartite Matching, Edge-disjoint paths, Circulation with demands"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Network Flows and Bipartite Matching:** Focuses on formal analytical models and structural execution in Advanced Graph Algorithms.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Flow Networks: Capacity, Conservation, Residual Networks, Augmenting Paths.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Flow Networks):** Formal KTU syllabus definition governing Flow Networks: Capacity, Conservation, Residual Networks, Augmenting Paths.",
          "**Operational Theorem (Ford-Fulkerson Method and Edmonds-Karp Algorithm (O(V E^2) BFS path selection)):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Network Flows and Bipartite Matching."
        ],
        "questions3Mark": [
          {
            "question": "Define Flow Networks and state its key significance in Advanced Graph Algorithms.",
            "answer": "In Advanced Graph Algorithms, Flow Networks defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Ford-Fulkerson Method and Edmonds-Karp Algorithm (O(V E^2) BFS path selection).",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Network Flows and Bipartite Matching.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Ford-Fulkerson Method and Edmonds-Karp Algorithm (O(V E^2) BFS path selection).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Ford-Fulkerson Method and Edmonds-Karp Algorithm (O(V E^2) BFS path selection)."
          },
          {
            "question": "Derive the efficiency/performance model for Max-Flow Min-Cut Theorem and Formal Proof.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Network Flows and Bipartite Matching. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Network Flows and Bipartite Matching."
          }
        ]
      },
      "3": {
        "moduleNum": 3,
        "title": "Module 3: Planarity, Coloring, and Graph Decompositions",
        "syllabusTopics": [
          "Planar Graphs: Euler's Formula (V - E + F = 2), Kuratowski's Theorem (K5 and K3,3 minors)",
          "Graph Coloring: Vertex coloring, Chromatic Number chi(G), Welsh-Powell Algorithm",
          "Tree Decompositions and Treewidth",
          "Chordal Graphs and Perfect Elimination Orderings"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Planarity, Coloring, and Graph Decompositions:** Focuses on formal analytical models and structural execution in Advanced Graph Algorithms.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: Planar Graphs: Euler's Formula (V - E + F = 2), Kuratowski's Theorem (K5 and K3,3 minors).",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (Planar Graphs):** Formal KTU syllabus definition governing Planar Graphs: Euler's Formula (V - E + F = 2), Kuratowski's Theorem (K5 and K3,3 minors).",
          "**Operational Theorem (Graph Coloring):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Planarity, Coloring, and Graph Decompositions."
        ],
        "questions3Mark": [
          {
            "question": "Define Planar Graphs and state its key significance in Advanced Graph Algorithms.",
            "answer": "In Advanced Graph Algorithms, Planar Graphs defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Graph Coloring.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Planarity, Coloring, and Graph Decompositions.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Graph Coloring: Vertex coloring, Chromatic Number chi(G), Welsh-Powell Algorithm.",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Graph Coloring."
          },
          {
            "question": "Derive the efficiency/performance model for Tree Decompositions and Treewidth.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Planarity, Coloring, and Graph Decompositions. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Planarity, Coloring, and Graph Decompositions."
          }
        ]
      },
      "4": {
        "moduleNum": 4,
        "title": "Module 4: Hard Problems, Approximation, and Modern Networks",
        "syllabusTopics": [
          "NP-Hard Graph Problems: Hamiltonian Cycle, Traveling Salesperson (TSP), Vertex Cover, Max-Clique",
          "Approximation Algorithms: 2-Approximation for Vertex Cover, Metric TSP (Christofides 1.5-approx)",
          "Spectral Graph Theory: Graph Laplacian Matrix L = D - A, Algebraic Connectivity",
          "Complex Networks: Random graphs (Erdos-Renyi), Small-world networks, Scale-free networks (Power law)"
        ],
        "conceptualWalkthrough": [
          "**Core Principle of Hard Problems, Approximation, and Modern Networks:** Focuses on formal analytical models and structural execution in Advanced Graph Algorithms.",
          "**Theoretical Grounding:** Detailed mathematical mechanisms and algorithmic formulations govern each element: NP-Hard Graph Problems: Hamiltonian Cycle, Traveling Salesperson (TSP), Vertex Cover, Max-Clique.",
          "**Engineering Application:** Practical realization in engineering systems, resolving complexity bottlenecks and ensuring KTU exam rigor."
        ],
        "examDefinitions": [
          "**Canonical Definition (NP-Hard Graph Problems):** Formal KTU syllabus definition governing NP-Hard Graph Problems: Hamiltonian Cycle, Traveling Salesperson (TSP), Vertex Cover, Max-Clique.",
          "**Operational Theorem (Approximation Algorithms):** Standard examination condition and constraints.",
          "**Performance Metric:** Efficiency and analytical bounds defined for Hard Problems, Approximation, and Modern Networks."
        ],
        "questions3Mark": [
          {
            "question": "Define NP-Hard Graph Problems and state its key significance in Advanced Graph Algorithms.",
            "answer": "In Advanced Graph Algorithms, NP-Hard Graph Problems defines the fundamental mathematical/architectural constraint. It provides formal guarantees on correctness, execution bounds, and design trade-offs required by KTU standards."
          },
          {
            "question": "State the primary theorem/formula governing Approximation Algorithms.",
            "answer": "The governing condition specifies exact boundary constraints and operational metrics. In KTU evaluation, full credit requires writing the analytical expression and stating edge-case assumptions."
          },
          {
            "question": "Differentiate between the primary techniques in Hard Problems, Approximation, and Modern Networks.",
            "answer": "Technique A prioritizes algorithmic simplicity and low latency, whereas Technique B optimizes throughput and theoretical optimality under resource constraints."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the working principles and structural formulation of Approximation Algorithms: 2-Approximation for Vertex Cover, Metric TSP (Christofides 1.5-approx).",
            "answer": "1. **Core Concept:** Formal operational framework.\n2. **Step-by-step Execution:** Initialization, state transitions, convergence criteria.\n3. **Trade-offs:** Complexity bounds and hardware/software resource constraints.",
            "diagramDescription": "Block flow diagram illustrating the state transitions and structural pipeline of Approximation Algorithms."
          },
          {
            "question": "Derive the efficiency/performance model for Spectral Graph Theory: Graph Laplacian Matrix L = D - A, Algebraic Connectivity.",
            "answer": "Detailed mathematical derivation showing input parameters, recurrence relations, intermediate algebraic steps, and final asymptotic or numerical bounds."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide an in-depth analytical treatment of Hard Problems, Approximation, and Modern Networks. Explain the theoretical foundations, detailed algorithm/architecture, step-by-step evaluation, and comparative trade-offs.",
            "answer": "**1. Foundational Architecture:** Detailed mathematical formulation and system model.\n\n**2. Core Mechanism:** Step-by-step algorithmic procedure with invariant maintenance.\n\n**3. Evaluation Criteria:** Proof of correctness, worst-case time/space complexity analysis, and practical benchmark behavior.\n\n**Evaluation Key:** (1) Structural diagram and definitions (2 marks), (2) Algorithmic derivation (3 marks), (3) Complexity analysis and proof (2 marks), (4) KTU exam model answer presentation (1 mark).",
            "diagramDescription": "Comprehensive architectural diagram showing component interactions, data flow, and control flow for Hard Problems, Approximation, and Modern Networks."
          }
        ]
      }
    }
  },
  "pccsl507": {
    "subjectCode": "PCCSL507",
    "subjectTitle": "Networks Lab",
    "references": [
      "Official KTU Laboratory Manual and Syllabus Guidelines",
      "W. Richard Stevens, UNIX Network Programming, Volume 1, 3rd Edition",
      "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, Aurélien Géron"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Core Practical Foundations & Experiments",
        "syllabusTopics": [
          "Lab Setup, Environment, and Foundational Implementations",
          "Core Algorithm Benchmarking"
        ],
        "conceptualWalkthrough": [
          "**Hands-On Mastery:** Step-by-step implementation of syllabus experiments for Networks Lab.",
          "**Verification:** Unit tests, telemetry capture, and error log interpretation."
        ],
        "examDefinitions": [
          "**Lab Viva Definition:** Standard viva voce question and formal definition for Networks Lab.",
          "**Input/Output Contract:** Expected input format and output terminal verification."
        ],
        "questions3Mark": [
          {
            "question": "What is the primary objective of this experiment in the KTU lab examination?",
            "answer": "To implement, test, and analyze the algorithm on standard benchmark datasets, demonstrating parameter tuning and performance verification."
          },
          {
            "question": "State the standard commands or system calls utilized.",
            "answer": "Standard system calls/API functions and their return values under normal vs error conditions."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the algorithm implementation and data structures used in this lab module.",
            "answer": "Detailed pseudocode, memory allocation, and edge case handling with sample terminal run output.",
            "diagramDescription": "Program flowchart showing initialization, input ingestion, algorithmic loop, and output rendering."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide the complete implementation architecture, algorithmic steps, sample test cases, and viva voce key for the principal experiment.",
            "answer": "**1. Algorithm & Data Structures:** Memory layout and buffer management.\n**2. Source Code Walkthrough:** Detailed functions and error checking.\n**3. Sample Test Cases:** Boundary inputs, expected terminal outputs.\n**4. Viva Voce Key:** Core theoretical questions asked by university external evaluators.",
            "diagramDescription": "End-to-end execution pipeline diagram showing user input, processing stages, and output telemetry."
          }
        ]
      }
    }
  },
  "pccsl508": {
    "subjectCode": "PCCSL508",
    "subjectTitle": "Machine Learning Lab",
    "references": [
      "Official KTU Laboratory Manual and Syllabus Guidelines",
      "W. Richard Stevens, UNIX Network Programming, Volume 1, 3rd Edition",
      "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, Aurélien Géron"
    ],
    "modules": {
      "1": {
        "moduleNum": 1,
        "title": "Module 1: Core Practical Foundations & Experiments",
        "syllabusTopics": [
          "Lab Setup, Environment, and Foundational Implementations",
          "Core Algorithm Benchmarking"
        ],
        "conceptualWalkthrough": [
          "**Hands-On Mastery:** Step-by-step implementation of syllabus experiments for Machine Learning Lab.",
          "**Verification:** Unit tests, telemetry capture, and error log interpretation."
        ],
        "examDefinitions": [
          "**Lab Viva Definition:** Standard viva voce question and formal definition for Machine Learning Lab.",
          "**Input/Output Contract:** Expected input format and output terminal verification."
        ],
        "questions3Mark": [
          {
            "question": "What is the primary objective of this experiment in the KTU lab examination?",
            "answer": "To implement, test, and analyze the algorithm on standard benchmark datasets, demonstrating parameter tuning and performance verification."
          },
          {
            "question": "State the standard commands or system calls utilized.",
            "answer": "Standard system calls/API functions and their return values under normal vs error conditions."
          }
        ],
        "questions5Mark": [
          {
            "question": "Explain the algorithm implementation and data structures used in this lab module.",
            "answer": "Detailed pseudocode, memory allocation, and edge case handling with sample terminal run output.",
            "diagramDescription": "Program flowchart showing initialization, input ingestion, algorithmic loop, and output rendering."
          }
        ],
        "questions8Mark": [
          {
            "question": "Provide the complete implementation architecture, algorithmic steps, sample test cases, and viva voce key for the principal experiment.",
            "answer": "**1. Algorithm & Data Structures:** Memory layout and buffer management.\n**2. Source Code Walkthrough:** Detailed functions and error checking.\n**3. Sample Test Cases:** Boundary inputs, expected terminal outputs.\n**4. Viva Voce Key:** Core theoretical questions asked by university external evaluators.",
            "diagramDescription": "End-to-end execution pipeline diagram showing user input, processing stages, and output telemetry."
          }
        ]
      }
    }
  }
};
