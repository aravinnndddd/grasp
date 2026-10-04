export interface KuroseChapter {
  id: string;
  chapterNumber: number;
  title: string;
  shortTitle: string;
  githubUrl: string;
  rawUrl: string;
  ktuModules: number[];
  summary: string;
  coreTopics: string[];
  keyConcepts: Array<{
    term: string;
    explanation: string;
  }>;
  examTakeaways: string[];
}

export interface KuroseRossRepoInfo {
  repoName: string;
  author: string;
  repoUrl: string;
  bookTitle: string;
  edition: string;
  course: string;
  description: string;
  chapters: KuroseChapter[];
}

export const kuroseRossRepoData: KuroseRossRepoInfo = {
  repoName: 'computer-networking-top-down-approach-notes',
  author: 'Vasanth Vanan',
  repoUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes',
  bookTitle: 'Computer Networking: A Top-Down Approach',
  edition: '8th Edition (James F. Kurose & Keith W. Ross)',
  course: 'ENPM694: Networks and Protocols (University of Maryland, College Park)',
  description: 'Authoritative, high-yield chapter notes covering the top-down methodology: Application Layer -> Transport -> Network (Data & Control) -> Link Layer & LANs. Directly aligned with KTU PCCST501 Computer Networks.',
  chapters: [
    {
      id: 'ch1',
      chapterNumber: 1,
      title: 'Chapter 1: Computer Networks and the Internet',
      shortTitle: 'Networks & Internet Foundations',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%201:%20Computer%20Networks%20and%20the%20Internet.md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%201%3A%20Computer%20Networks%20and%20the%20Internet.md',
      ktuModules: [1],
      summary: 'Lays the foundational architecture of the Internet: network edge (hosts, access networks), network core (packet switching vs circuit switching), network of networks (ISPs, PoPs, IXPs), protocol layering (OSI 7-layer vs 5-layer Internet stack), and four sources of packet delay (transmission, propagation, nodal processing, queuing delay).',
      coreTopics: [
        'Network Edge: End systems, client/server, P2P',
        'Access Networks: DSL, Cable, FTTH, 5G Wireless, WiFi',
        'Physical Media: Twisted pair, Coaxial, Fiber optics, Radio',
        'Network Core: Packet switching (store-and-forward), Circuit switching (FDM, TDM)',
        'Four Sources of Packet Delay: d_nodal = d_proc + d_queue + d_trans + d_prop',
        'Throughput & Bottleneck Links',
        'Protocol Layering: 5-layer Internet stack & 7-layer OSI model',
        'Encapsulation & Decapsulation (PDU hierarchy: Message -> Segment -> Datagram -> Frame -> Bits)'
      ],
      keyConcepts: [
        {
          term: 'Packet Switching vs Circuit Switching',
          explanation: 'Packet switching uses store-and-forward with statistical multiplexing where resources are shared on demand. Circuit switching pre-allocates dedicated end-to-end paths (FDM/TDM) with guaranteed bandwidth but severe resource waste during idle periods.'
        },
        {
          term: 'Transmission Delay vs Propagation Delay',
          explanation: 'Transmission delay (L/R) is the time required to push all packet bits onto the wire (function of packet length L and link rate R). Propagation delay (d/s) is the time for one bit to travel physically from router A to router B (function of distance d and wave speed s).'
        },
        {
          term: 'Layer Encapsulation Hierarchy',
          explanation: 'Application (Message) -> Transport (Segment, adds TCP/UDP port header) -> Network (Datagram, adds IP header) -> Link (Frame, adds MAC header & CRC trailer) -> Physical (raw electromagnetic bits).'
        }
      ],
      examTakeaways: [
        'Formulas for total delay: d_end-to-end = N * (d_proc + d_trans + d_prop) where d_trans = L / R and d_prop = d / s.',
        'Queuing delay is stochastic: when traffic intensity La/R -> 1, average queuing delay shoots to infinity.',
        'Why layering? Modularity allows changing implementation of a layer (e.g., upgrading link technology to 5G) without modifying software on other layers.'
      ]
    },
    {
      id: 'ch2',
      chapterNumber: 2,
      title: 'Chapter 2: Application Layer',
      shortTitle: 'Application Layer Protocols',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%202:%20Application%20Layer.md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%202%3A%20Application%20Layer.md',
      ktuModules: [4],
      summary: 'Explores core application protocols: HTTP (1.0, 1.1 with pipelining, 2 with multiplexed streams, 3 over QUIC), Electronic Mail (SMTP, POP3, IMAP), Domain Name System (DNS hierarchy, root/TLD/authoritative, iterative vs recursive queries, resource records), and Socket Programming primitives (AF_INET, SOCK_STREAM for TCP, SOCK_DGRAM for UDP).',
      coreTopics: [
        'Network Application Architectures: Client-Server vs Pure P2P',
        'Process-to-Process Addressing: IP address + Port number',
        'HTTP Protocol: Non-persistent vs Persistent connections, RTT calculation',
        'Web Caching & Conditional GET (If-Modified-Since)',
        'HTTP/1.1 vs HTTP/2 (HOL blocking, binary framing, streams) vs HTTP/3 (QUIC/UDP)',
        'Electronic Mail: SMTP (push protocol), Mail Access (POP3, IMAP pull protocols)',
        'DNS: Distributed hierarchical database, caching, DNS spoofing & security',
        'Socket Programming: socket(), bind(), listen(), accept(), connect(), send(), recv()'
      ],
      keyConcepts: [
        {
          term: 'Iterative vs Recursive DNS Resolution',
          explanation: 'In recursive queries, the queried name server assumes responsibility for obtaining the final IP mapping by questioning other servers. In iterative queries, each contacted server directly replies with a referral pointer to the next lower server in the DNS tree.'
        },
        {
          term: 'HTTP/2 Multiplexing vs HTTP/1.1 HOL Blocking',
          explanation: 'HTTP/1.1 uses multiple parallel TCP connections or pipelining, where a slow response stalls all subsequent requests (Head-of-Line blocking). HTTP/2 splits messages into independent interleaved binary frames over a single TCP connection.'
        },
        {
          term: 'Socket Abstraction',
          explanation: 'The software API gateway between the application process and transport layer. TCP sockets (SOCK_STREAM) provide full-duplex reliable byte streams with 3-way handshake; UDP sockets (SOCK_DGRAM) send connectionless datagram packets without prior setup.'
        }
      ],
      examTakeaways: [
        'Total response time for non-persistent HTTP: 2 * RTT + file transmission time (1 RTT to establish TCP, 1 RTT for HTTP request/response). Persistent HTTP saves the TCP handshake RTT.',
        'DNS Resource Record format: (Name, Value, Type, TTL). Type A = hostname to IPv4; Type AAAA = IPv6; Type CNAME = canonical alias; Type MX = mail server; Type NS = authoritative name server.',
        'Compare SMTP vs HTTP: SMTP is a push protocol (ASCII 7-bit encoded), HTTP is a pull protocol (binary/MIME capable).'
      ]
    },
    {
      id: 'ch3',
      chapterNumber: 3,
      title: 'Chapter 3: Transport Layer',
      shortTitle: 'Transport Layer & Congestion Control',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%203:%20Transport%20Layer.md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%203%3A%20Transport%20Layer.md',
      ktuModules: [1, 4],
      summary: 'Deep-dive into logical communication between processes: transport multiplexing/demultiplexing via ports, connectionless UDP (header format & 1s complement checksum), principles of Reliable Data Transfer (RDT 1.0 -> 2.0 -> 2.1 -> 2.2 -> 3.0), pipelined protocols (Go-Back-N vs Selective Repeat), and complete TCP mechanics (connection lifecycle, seq/ack numbers, round-trip time estimation, flow control rwnd, and congestion control: Slow Start, AIMD, Fast Retransmit, Fast Recovery).',
      coreTopics: [
        'Multiplexing and Demultiplexing: Connectionless (UDP) vs Connection-Oriented (TCP 4-tuple)',
        'UDP: Segment structure (8 bytes), checksum calculation (1s complement addition)',
        'Principles of RDT: Stop-and-Wait, sequence numbers, ACKs, NAKs, countdown timers',
        'Pipelined Protocols: Go-Back-N (cumulative ACK, single timer) vs Selective Repeat (individual ACKs, receiver buffer)',
        'TCP Segment Format: 20-byte base header, sequence number = byte stream offset',
        'TCP Connection Management: 3-way handshake (SYN, SYN-ACK, ACK) and 4-way teardown (FIN, ACK, FIN, ACK)',
        'TCP RTT Estimation: EstimatedRTT = (1-α)*EstimatedRTT + α*SampleRTT; DevRTT formulation',
        'TCP Flow Control: Advertised window rwnd in header prevents receiver buffer overflow',
        'TCP Congestion Control: AIMD (Additive Increase Multiplicative Decrease), Slow Start (exponential growth to ssthresh), Fast Retransmit (3 duplicate ACKs), Fast Recovery'
      ],
      keyConcepts: [
        {
          term: 'Go-Back-N vs Selective Repeat',
          explanation: 'In GBN, receiver discards all out-of-order packets and sends cumulative ACK; sender retransmits all unACKed packets starting from the lost one (W_S <= 2^m - 1). In SR, receiver buffers out-of-order packets and individually ACKs each packet; sender retransmits solely the lost packet (W_S = W_R <= 2^(m-1)).'
        },
        {
          term: 'TCP 3-Way Handshake Purpose',
          explanation: 'Synchronizes initial sequence numbers (ISN) in both directions and confirms mutual responsiveness, preventing stale duplicate SYN segments from obsolete connections from triggering unwanted resource allocations.'
        },
        {
          term: 'AIMD Congestion Control Dynamics',
          explanation: 'Sender increases cwnd linearly by 1 MSS per RTT during Congestion Avoidance to probe for spare capacity, and cuts cwnd in half multiplicatively upon packet loss (3 duplicate ACKs) to quickly release network pressure.'
        }
      ],
      examTakeaways: [
        'Effective TCP Window = min(cwnd, rwnd). cwnd is dictated by network congestion; rwnd is dictated by receiver application buffer capacity.',
        'Why 3 Duplicate ACKs trigger Fast Retransmit? Because receiving duplicate ACKs means subsequent packets are still successfully reaching the receiver, indicating a single dropped packet rather than total path collapse (unlike timeout).',
        'UDP Checksum: Sum all 16-bit words including pseudo-header; take 1s complement. Receiver sums all words including checksum; result must be 0xFFFF (all 1s).'
      ]
    },
    {
      id: 'ch4',
      chapterNumber: 4,
      title: 'Chapter 4: Network Layer: Data Plane',
      shortTitle: 'Network Data Plane & Addressing',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%204:%20Network%20Layer%20(Data%20Plane).md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%204%3A%20Network%20Layer%20(Data%20Plane).md',
      ktuModules: [3],
      summary: 'Focuses on the per-router forwarding function of the Network Layer (Data Plane): router hardware architecture (input ports, switching fabrics: memory, bus, crossbar, output queuing & HOL blocking), IPv4 Datagram format & fragmentation, CIDR addressing & longest prefix matching, DHCP (Discover, Offer, Request, ACK), NAT operation, and IPv6 fixed 40-byte header format with migration strategies (Dual-stack, Tunneling).',
      coreTopics: [
        'Data Plane (per-router forwarding) vs Control Plane (network-wide routing)',
        'Router Architecture: Input ports, switching fabrics (Memory, Bus, Crossbar), output buffering',
        'Head-of-Line (HOL) Blocking in input-queued switches',
        'IPv4 Datagram: 20-60 bytes, Identification, Flags (DF, MF), Fragment Offset (in 8-byte units)',
        'IPv4 Addressing & CIDR: Subnetting, subnet masks, Longest Prefix Matching using TCAMs',
        'DHCP (Dynamic Host Configuration Protocol): DORA handshake (Discover, Offer, Request, Ack) over UDP 67/68',
        'NAT (Network Address Translation): RFC 1918 private subnets, 16-bit port translation table',
        'IPv6 Architecture: Fixed 40-byte header, 128-bit addresses, Next Header daisy chaining, elimination of checksum & fragmentation in routers',
        'IPv4-to-IPv6 Transition: Dual-Stack nodes and IPv6-in-IPv4 Tunneling'
      ],
      keyConcepts: [
        {
          term: 'Forwarding vs Routing',
          explanation: 'Forwarding is the data-plane hardware action of transferring a packet from a router input interface to the appropriate output interface based on the forwarding table (nanosecond scale). Routing is the control-plane algorithm computing end-to-end paths across routers (second scale).'
        },
        {
          term: 'Longest Prefix Matching',
          explanation: 'When forwarding an IP datagram, the router matches the destination IP address against all entries in its forwarding table and chooses the entry with the longest subnet mask prefix, ensuring the most specific route is selected.'
        },
        {
          term: 'IP Fragmentation Mechanics',
          explanation: 'When datagram size exceeds MTU (e.g. 1500 bytes for Ethernet), routers split the payload into fragments. Identification links fragments together; Fragment Offset indicates byte offset divided by 8; MF=1 for all fragments except the last (MF=0).'
        }
      ],
      examTakeaways: [
        'IPv4 Fragment calculation: Offset = (byte index) / 8. Always ensure byte length of payload in each fragment except the last is a multiple of 8.',
        'NAT Controversy: Violates end-to-end architectural principle (routers inspecting transport layer ports), makes P2P connections complex (requires STUN/TURN traversal), but saved the IPv4 address space.',
        'IPv6 Key Changes: Header fixed at 40 bytes; no checksum (relies on L2 CRC and L4 TCP/UDP checksum); no fragmentation in intermediate routers (path MTU discovery is used instead).'
      ]
    },
    {
      id: 'ch5',
      chapterNumber: 5,
      title: 'Chapter 5: Network Layer: Control Plane',
      shortTitle: 'Network Control Plane & Routing',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%205:%20Network%20Layer%20(Control%20Plane).md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%205%3A%20Network%20Layer%20(Control%20Plane).md',
      ktuModules: [3],
      summary: 'Analyzes how routing tables are constructed across autonomous networks: Link-State routing (Dijkstra algorithm, global knowledge, OSPF protocol with hierarchical areas), Distance-Vector routing (Bellman-Ford equation, local exchanges, count-to-infinity problem, split horizon with poison reverse), Inter-Domain routing with BGP (Autonomous Systems, eBGP vs iBGP, policy routing), and ICMP network diagnostics (ping, traceroute).',
      coreTopics: [
        'Traditional Per-Router Control Plane vs Centralized SDN Control Plane',
        'Link-State (LS) Routing: Dijkstra Algorithm, time complexity O(V^2) or O(E log V)',
        'Open Shortest Path First (OSPF): Link-state advertisements (LSAs), Dijkstra tree, Area border routers (ABR), Autonomous system boundary routers (ASBR)',
        'Distance-Vector (DV) Routing: Bellman-Ford equation d_x(y) = min_v { c(x,v) + d_v(y) }',
        'Routing Information Protocol (RIP): Metric is hop count (max 15), periodic 30s updates',
        'Count-to-Infinity Problem & Solutions: Split Horizon and Poison Reverse (distance = 16)',
        'Inter-Domain Routing (BGP-4): Autonomous Systems (AS), eBGP (between AS) vs iBGP (inside AS), AS-PATH attribute, NEXT-HOP attribute, BGP import/export policies',
        'ICMP (Internet Control Message Protocol): Type 8/0 (Echo request/reply), Type 11 (TTL expired), Type 3 (Destination unreachable)'
      ],
      keyConcepts: [
        {
          term: 'Link-State vs Distance-Vector',
          explanation: 'Link-State: Every router floods local link states globally; each router constructs an identical complete network graph and runs Dijkstra. Distance-Vector: Routers only share their estimated distance vectors with direct neighbors; paths are computed iteratively based on neighbor hearsay.'
        },
        {
          term: 'Hierarchical OSPF Structure',
          explanation: 'Divides an Autonomous System into Areas with Area 0 (Backbone Area) at the core. Internal routers only know intra-area topology, while Area Border Routers (ABRs) summarize routes into Area 0, preventing LSA flood overload.'
        },
        {
          term: 'BGP Policy Routing',
          explanation: 'Inter-AS routing is determined by business contracts and political policies rather than shortest physical path. An AS can choose not to transit traffic between two commercial competitors regardless of low latency.'
        }
      ],
      examTakeaways: [
        'Dijkstra Algorithm Trace: In exam problems, always maintain three columns: N\' (visited nodes set), D(v) (cost), and p(v) (predecessor node). Show step-by-step table updates.',
        'Bellman-Ford Matrix: Update entries whenever a neighbor offers a lower path: D_x(y) = min_v { c(x,v) + D_v(y) }.',
        'Traceroute Mechanics: Sends packets with increasing TTL (1, 2, 3...). Router i discards packet when TTL drops to 0, returning ICMP Type 11 (TTL expired). Round-trip time is recorded.'
      ]
    },
    {
      id: 'ch6',
      chapterNumber: 6,
      title: 'Chapter 6: Link Layer and LANs',
      shortTitle: 'Link Layer, MAC, Switches & VLANs',
      githubUrl: 'https://github.com/VasanthVanan/computer-networking-top-down-approach-notes/blob/main/Chapter%206:%20Link%20Layer%20and%20LANs.md',
      rawUrl: 'https://raw.githubusercontent.com/VasanthVanan/computer-networking-top-down-approach-notes/main/Chapter%206%3A%20Link%20Layer%20and%20LANs.md',
      ktuModules: [1, 2],
      summary: 'Examines hop-to-hop communication over physical links and local area networks: error detection (parity, checksums, Cyclic Redundancy Check CRC), multiple access protocols (channel partitioning: TDM/FDM/CDMA, random access: Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD, CSMA/CA, taking-turns: polling, token ring), LAN addressing with ARP, Ethernet IEEE 802.3 standards, Layer-2 Switch self-learning forwarding tables, and VLAN 802.1Q tagging.',
      coreTopics: [
        'Link Layer Services: Framing, link access (MAC), reliable delivery, error detection & correction',
        'Hardware Implementation: Network Interface Controller (NIC) / adapter',
        'Error Detection Techniques: Parity bit, 16-bit Internet Checksum, CRC polynomial division',
        'Multiple Access Protocols: Channel Partitioning, Random Access, Taking-Turns',
        'ALOHA Protocols: Pure ALOHA (max efficiency 18.4%), Slotted ALOHA (max efficiency 36.8%)',
        'CSMA and CSMA/CD: Carrier sensing, collision detection, Binary Exponential Backoff algorithm',
        'Minimum Frame Size in Ethernet: T_tx >= 2 * T_prop (64 bytes for 10 Mbps Ethernet)',
        'MAC vs IP Addressing: 48-bit flat IEEE 802 hardware address vs 32-bit hierarchical IP',
        'Address Resolution Protocol (ARP): ARP table (IP, MAC, TTL), ARP Request (broadcast), ARP Reply (unicast)',
        'Ethernet Frame Format: Preamble (8B), Dest MAC (6B), Source MAC (6B), Type (2B), Data (46-1500B), CRC (4B)',
        'Ethernet Switches: Self-learning backward learning algorithm, filtering, selective forwarding, flooding',
        'Virtual LANs (VLANs): IEEE 802.1Q tag (12-bit VLAN ID), trunk ports, isolation of broadcast domains'
      ],
      keyConcepts: [
        {
          term: 'CSMA/CD Operational Sequence',
          explanation: '1. Sense medium; if idle, transmit. 2. If busy, wait according to persistence strategy. 3. While transmitting, monitor line for voltage spikes. 4. If collision detected, abort immediately and transmit 32-48 bit jam signal. 5. Enter Binary Exponential Backoff: choose r from [0, 2^k - 1], wait r * Slot_Time, and retry.'
        },
        {
          term: 'Switch Backward Learning Mechanism',
          explanation: 'When a frame arrives on port P with source MAC S and destination MAC D: 1. Record (S, P, current_time) in forwarding table. 2. Look up destination D in table: if found on port P, filter/drop (same segment); if found on port Q != P, forward solely to Q; if not found, flood out all ports except P.'
        },
        {
          term: 'CRC Modulo-2 Division',
          explanation: 'Sender appends r zero bits to data D (where r is the degree of generator polynomial G). Performs binary XOR long division of D * 2^r by G. Appends the r-bit remainder R to D. Receiver divides transmitted codeword (D, R) by G; non-zero remainder proves transmission error.'
        }
      ],
      examTakeaways: [
        'Why ARP is Link Layer + Network Layer: ARP translates between IP and MAC. An ARP request is encapsulated directly inside a Link-Layer broadcast frame (dest MAC FF:FF:FF:FF:FF:FF).',
        'Switch vs Router: Switches operate at Layer 2 (MAC tables, fast hardware ASICs, single broadcast domain per VLAN). Routers operate at Layer 3 (IP routing tables, Dijkstra/BGP, separate broadcast domains).',
        'Collision Domain vs Broadcast Domain: Hub = 1 collision, 1 broadcast. Switch with N ports = N collision domains, 1 broadcast domain. Router with N ports = N collision domains, N broadcast domains.'
      ]
    }
  ]
};

export function getKuroseChaptersForModule(moduleNum: number): KuroseChapter[] {
  return kuroseRossRepoData.chapters.filter(ch => ch.ktuModules.includes(moduleNum));
}
