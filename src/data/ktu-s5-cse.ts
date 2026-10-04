import { CurriculumHierarchy, ConceptDetail, Subject } from '../types/curriculum';
import { gradientDescentConcept } from './concepts/gradient-descent';
import { tcpCongestionControlConcept } from './concepts/tcp-congestion-control';
import { dijkstraAlgorithmConcept } from './concepts/dijkstra-algorithm';
import { astarSearchConcept } from './concepts/astar-search';
import { microcontroller8051Concept } from './concepts/microcontroller-8051';
import { dfaMinimizationConcept } from './concepts/dfa-minimization';

export const allConceptsList: ConceptDetail[] = [
  gradientDescentConcept,
  tcpCongestionControlConcept,
  dijkstraAlgorithmConcept,
  astarSearchConcept,
  microcontroller8051Concept,
  dfaMinimizationConcept
];

export const conceptMap: Record<string, ConceptDetail> = {
  'gradient-descent': gradientDescentConcept,
  'tcp-congestion-control': tcpCongestionControlConcept,
  'dijkstra-algorithm': dijkstraAlgorithmConcept,
  'astar-search': astarSearchConcept,
  'microcontroller-8051': microcontroller8051Concept,
  'dfa-minimization': dfaMinimizationConcept
};

export const ktuS5CseCurriculum: CurriculumHierarchy = {
  university: 'KTU',
  universityFull: 'APJ Abdul Kalam Technological University',
  regulationScheme: '2024 Scheme',
  programme: 'B.Tech',
  branch: 'CSE',
  branchFull: 'Computer Science & Engineering',
  semester: 'S5',
  academicYear: 'Semester 5 (Year 3)',
  subjects: [
    {
      id: 'pccst501',
      code: 'PCCST501',
      title: 'Computer Networks',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PCCST501: Computer Networks.",
      modules: [
        {
          id: 'pccst501-mod-1',
          number: 1,
          title: "Module 1: Introduction to Networking",
          description: "- Overview of network types: LAN, WAN, MAN, PAN - Network topologies, switching (circuit, message, packet) - Reference models: OSI and TCP/IP - Physical layer: transmission media, signal encoding, multiplexing, switching - Data Link Layer: framing, error detection and correction, flow control (stop-",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst501-mod-2',
          number: 2,
          title: "Module 2: Data Link and Medium Access Control",
          description: "- MAC protocols: ALOHA, CSMA/CD, CSMA/CA - Ethernet: IEEE 802.3, Fast Ethernet, Gigabit Ethernet, Wireless LANs (IEEE 802.11) - Switching: store-and-forward, cut-through, bridging, switching fabrics - Introduction to virtual LANs",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst501-mod-3',
          number: 3,
          title: "Module 3: Network Layer and Routing",
          description: "- IPv4, IPv6 addressing and subnetting - Datagram format and header fields - Routing algorithms: distance vector, link state - Protocols: RIP, OSPF, BGP - ICMP, ARP, DHCP, NAT",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst501-mod-4',
          number: 4,
          title: "Module 4: Transport and Application Layers",
          description: "- Transport protocols: TCP, UDP, segment format, congestion control, flow control - Application layer protocols: DNS, HTTP, FTP, SMTP, POP, IMAP - Socket programming basics - Network security fundamentals: firewalls, cryptography basics, SSL/TLS 1. Behrouz A. Forouzan, *Data Communications and Netwo",
          hours: 9,
          weightagePercent: 25,
          topics: [            {
              id: 'topic-pccst501-m4',
              title: 'Transport and Application Layers',
              concepts: [tcpCongestionControlConcept]
            }]
        },
      ]
    },
    {
      id: 'pccst502',
      code: 'PCCST502',
      title: 'Design and Analysis of Algorithms',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PCCST502: Design and Analysis of Algorithms.",
      modules: [
        {
          id: 'pccst502-mod-1',
          number: 1,
          title: "Module 1: Introduction and Asymptotic Notation",
          description: "- Importance of algorithms, steps in designing algorithms - Mathematical background: summations, recurrences - Asymptotic analysis: Big-O, Omega, Theta notations - Solving recurrences: substitution, iteration, master method",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst502-mod-2',
          number: 2,
          title: "Module 2: Divide and Conquer, Greedy Algorithms",
          description: "- Divide and conquer: merge sort, quick sort, binary search, matrix multiplication - Greedy algorithms: activity selection, fractional knapsack, Huffman coding - Greedy choice property and optimal substructure",
          hours: 9,
          weightagePercent: 25,
          topics: [            {
              id: 'topic-pccst502-m2',
              title: 'Divide and Conquer, Greedy Algorithms',
              concepts: [dijkstraAlgorithmConcept]
            }]
        },
        {
          id: 'pccst502-mod-3',
          number: 3,
          title: "Module 3: Dynamic Programming and Graph Algorithms",
          description: "- Dynamic programming: matrix chain multiplication, 0/1 knapsack, longest common subsequence - Graph algorithms: BFS, DFS, topological sort - Shortest paths: Dijkstra\u2019s and Bellman-Ford algorithms - Minimum spanning tree: Prim\u2019s and Kruskal\u2019s algorithms",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst502-mod-4',
          number: 4,
          title: "Module 4: Backtracking, Branch & Bound, and NP-Completeness",
          description: "- Backtracking: N-Queens, subset sum, graph coloring - Branch and bound: 0/1 knapsack - NP-completeness: P, NP, NP-hard, NP-complete classes - Cook-Levin theorem (concept), satisfiability, vertex cover, traveling salesman problem 1. Thomas H. Cormen et al., *Introduction to Algorithms*, MIT Press, 4",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pccst503',
      code: 'PCCST503',
      title: 'Machine Learning',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PCCST503: Machine Learning.",
      modules: [
        {
          id: 'pccst503-mod-1',
          number: 1,
          title: "Module 1: Introduction and Concept Learning",
          description: "- Introduction to machine learning, applications - Types of learning: supervised, unsupervised, reinforcement - Concept learning, version spaces, inductive bias - Decision tree learning, entropy, information gain, ID3 algorithm",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst503-mod-2',
          number: 2,
          title: "Module 2: Linear Models and Neural Networks",
          description: "- Linear regression, gradient descent - Logistic regression, overfitting, regularization - Perceptron, multilayer perceptron, backpropagation - Activation functions, training neural networks",
          hours: 9,
          weightagePercent: 25,
          topics: [            {
              id: 'topic-pccst503-m2',
              title: 'Linear Models and Neural Networks',
              concepts: [gradientDescentConcept]
            }]
        },
        {
          id: 'pccst503-mod-3',
          number: 3,
          title: "Module 3: SVMs, Ensembles, and Clustering",
          description: "- Support vector machines: linear and non-linear, kernels - Ensemble learning: bagging, boosting, random forests - Clustering: k-means, hierarchical, DBSCAN - Evaluation metrics: accuracy, precision, recall, F1-score, confusion matrix",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pccst503-mod-4',
          number: 4,
          title: "Module 4: Dimensionality Reduction and Reinforcement Learning",
          description: "- Dimensionality reduction: PCA, LDA, t-SNE - Anomaly detection - Basics of reinforcement learning: Markov decision processes, Q-learning - Ethics and challenges in machine learning 1. Tom M. Mitchell, *Machine Learning*, McGraw-Hill, 1/e, 1997 2. Ethem Alpaydin, *Introduction to Machine Learning*, ",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pbcst504',
      code: 'PBCST504',
      title: 'Microcontrollers',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PBCST504: Microcontrollers.",
      modules: [
        {
          id: 'pbcst504-mod-1',
          number: 1,
          title: "Module 1: Introduction to Microcontrollers",
          description: "- Basics of embedded systems and microcontrollers - Microcontroller vs. Microprocessor - Overview of 8051 and AVR microcontrollers - Architecture and pin configuration - Memory organization, I/O ports, and instruction set overview",
          hours: 9,
          weightagePercent: 25,
          topics: [            {
              id: 'topic-pbcst504-m1',
              title: 'Introduction to Microcontrollers',
              concepts: [microcontroller8051Concept]
            }]
        },
        {
          id: 'pbcst504-mod-2',
          number: 2,
          title: "Module 2: Programming and Peripherals",
          description: "- Assembly language programming, addressing modes - Timers and counters, interrupts - Serial communication: UART, SPI, I2C - Interfacing LEDs, switches, seven segment displays - ADC, DAC interfacing basics",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pbcst504-mod-3',
          number: 3,
          title: "Module 3: ARM Microcontrollers",
          description: "- ARM architecture and features - Cortex-M processor core, system control block - Exceptions and interrupts in ARM - GPIO, timers, and serial interfaces - Embedded C programming for ARM",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pbcst504-mod-4',
          number: 4,
          title: "Module 4: Applications and Embedded Design",
          description: "- Case studies of embedded applications - Real-time systems and RTOS basics - Interfacing sensors and actuators - Introduction to IoT applications using microcontrollers - Overview of development tools and debugging 1. Muhammad Ali Mazidi et al., *The 8051 Microcontroller and Embedded Systems*, Pear",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst521',
      code: 'PECST521',
      title: 'Software Project Management',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST521: Software Project Management.",
      modules: [
        {
          id: 'pecst521-mod-1',
          number: 1,
          title: "Module 1: Introduction to Software Project Management",
          description: "- Definition, objectives, and scope of software project management - Project life cycle and process models: waterfall, spiral, incremental, agile - Role of a software project manager - Project planning: tasks, scheduling, milestones, work breakdown structure (WBS)",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst521-mod-2',
          number: 2,
          title: "Module 2: Project Estimation and Risk Management",
          description: "- Software size estimation techniques: Function Point Analysis, Use Case Points, COCOMO II - Cost and effort estimation - Risk identification, risk analysis and assessment, risk control - Resource allocation and budgeting",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst521-mod-3',
          number: 3,
          title: "Module 3: Project Scheduling and Quality Management",
          description: "- Activity planning and network planning models (PERT, CPM) - Software configuration management - Quality assurance: reviews, testing, metrics - ISO 9001 and CMMI standards - Project monitoring and control",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst521-mod-4',
          number: 4,
          title: "Module 4: Project Execution and Closure",
          description: "- Team management, communication management - Change control and defect tracking - Software project tools (JIRA, MS Project, etc.) - Case studies and best practices - Project closure and post-mortem analysis 1. Bob Hughes, Mike Cotterell, *Software Project Management*, McGraw-Hill, 5/e, 2009 2. Roge",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst522',
      code: 'PECST522',
      title: 'Artificial Intelligence',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST522: Artificial Intelligence.",
      modules: [
        {
          id: 'pecst522-mod-1',
          number: 1,
          title: "Module 1: Introduction and Intelligent Agents",
          description: "- Definition and history of AI - Applications of AI: robotics, NLP, vision, etc. - Intelligent agents: types and structure - Environment types and agent architectures",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst522-mod-2',
          number: 2,
          title: "Module 2: Problem Solving and Search",
          description: "- Problem formulation, state space representation - Uninformed search: BFS, DFS, depth-limited, iterative deepening - Informed search: greedy best-first, A*, heuristic functions - Adversarial search: minimax algorithm, alpha-beta pruning",
          hours: 9,
          weightagePercent: 25,
          topics: [            {
              id: 'topic-pecst522-m2',
              title: 'Problem Solving and Search',
              concepts: [astarSearchConcept]
            }]
        },
        {
          id: 'pecst522-mod-3',
          number: 3,
          title: "Module 3: Knowledge and Reasoning",
          description: "- Knowledge representation: propositional and predicate logic - Inference techniques and unification - Rule-based systems and forward/backward chaining - Planning: STRIPS, planning graphs",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst522-mod-4',
          number: 4,
          title: "Module 4: Learning and Applications",
          description: "- Introduction to machine learning in AI - Supervised and unsupervised learning - Reinforcement learning basics - Natural Language Processing: parsing, information retrieval - Robotics and perception 1. Stuart Russell, Peter Norvig, *Artificial Intelligence: A Modern Approach*, Pearson, 3/e, 2010 2.",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst523',
      code: 'PECST523',
      title: 'Data Analytics',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST523: Data Analytics.",
      modules: [
        {
          id: 'pecst523-mod-1',
          number: 1,
          title: "Module 1: Introduction to Data Analytics",
          description: "- Introduction to data analytics and data science - Types of analytics: descriptive, diagnostic, predictive, prescriptive - Analytics lifecycle: discovery, data preparation, model planning, model building, deployment - Role of data analyst and data engineer",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst523-mod-2',
          number: 2,
          title: "Module 2: Data Preprocessing and Visualization",
          description: "- Data collection and cleaning - Handling missing data, outliers, encoding categorical variables - Data visualization tools and techniques - Histograms, box plots, scatter plots, heatmaps, dashboards",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst523-mod-3',
          number: 3,
          title: "Module 3: Exploratory Data Analysis and Statistics",
          description: "- Summary statistics and distributions - Correlation and covariance - Hypothesis testing, p-values, t-tests, ANOVA - Feature selection and dimensionality reduction",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst523-mod-4',
          number: 4,
          title: "Module 4: Tools and Applications",
          description: "- Introduction to R, Python for data analytics - Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn basics - Case studies in business analytics, web analytics, healthcare analytics - Ethics and privacy in data analytics 1. Cathy O\u2019Neil, Rachel Schutt, *Doing Data Science*, O\u2019Reilly, 1/e, 2013 2. Vigne",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst524',
      code: 'PECST524',
      title: 'Data Compression',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST524: Data Compression.",
      modules: [
        {
          id: 'pecst524-mod-1',
          number: 1,
          title: "Module 1: Introduction to Compression",
          description: "- Need and benefits of data compression - Basic compression models: lossless and lossy - Modeling: static and dynamic models - Shannon\u2019s entropy, source coding theorem",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst524-mod-2',
          number: 2,
          title: "Module 2: Lossless Compression Techniques",
          description: "- Huffman coding: construction, optimality, adaptive versions - Arithmetic coding: concepts and comparisons - Dictionary techniques: LZ77, LZ78, LZW - Applications and file formats (ZIP, PNG, GIF)",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst524-mod-3',
          number: 3,
          title: "Module 3: Lossy Compression Techniques",
          description: "- Quantization: scalar and vector quantization - Transform coding: DCT, KLT, wavelet transforms - Image compression standards: JPEG, JPEG2000 - Audio compression: MP3, AAC basics",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst524-mod-4',
          number: 4,
          title: "Module 4: Video Compression and Applications",
          description: "- Video compression principles - Interframe and intraframe coding - Video coding standards: MPEG-1, MPEG-2, MPEG-4, H.264 - Performance evaluation and quality metrics - Case studies in multimedia systems 1. Khalid Sayood, *Introduction to Data Compression*, Morgan Kaufmann, 5/e, 2017 2. David Salomo",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst526',
      code: 'PECST526',
      title: 'Digital Signal Processing',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST526: Digital Signal Processing.",
      modules: [
        {
          id: 'pecst526-mod-1',
          number: 1,
          title: "Module 1: Discrete-Time Signals and Systems",
          description: "- Discrete-time signals: representation, classification - Discrete-time systems: properties, LTI systems - Convolution, correlation, difference equations - Z-transform: properties, inverse, ROC, system analysis",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst526-mod-2',
          number: 2,
          title: "Module 2: Frequency Domain Analysis",
          description: "- Discrete Fourier Transform (DFT) and properties - Fast Fourier Transform (FFT): radix-2 DIT and DIF algorithms - Frequency response of systems - Applications of DFT in signal processing",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst526-mod-3',
          number: 3,
          title: "Module 3: Digital Filter Design",
          description: "- FIR filter design: windowing methods, frequency sampling - IIR filter design: impulse invariance, bilinear transformation - Filter realization structures: direct form, cascade, parallel - Finite word length effects",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst526-mod-4',
          number: 4,
          title: "Module 4: Applications and DSP Processors",
          description: "- Multirate signal processing: decimation, interpolation - DSP applications: audio, biomedical, speech, communication systems - Introduction to DSP hardware: architecture of TMS320 series - Real-time processing concepts 1. John G. Proakis, Dimitris G. Manolakis, *Digital Signal Processing*, Pearson,",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst527',
      code: 'PECST527',
      title: 'Computer Graphics and Multimedia',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST527: Computer Graphics and Multimedia.",
      modules: [
        {
          id: 'pecst527-mod-1',
          number: 1,
          title: "Module 1: Introduction to Computer Graphics",
          description: "- Applications of computer graphics - Graphics systems and output devices - Line drawing algorithms: DDA, Bresenham\u2019s algorithm - Circle and ellipse drawing algorithms - 2D transformations: translation, scaling, rotation, reflection, shearing - Matrix representation and homogeneous coordinates",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst527-mod-2',
          number: 2,
          title: "Module 2: 3D Graphics and Viewing",
          description: "- 3D transformations: translation, scaling, rotation - Projections: parallel and perspective - Viewing pipeline and coordinates - Clipping algorithms: Cohen-Sutherland, Liang-Barsky - Hidden surface removal techniques",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst527-mod-3',
          number: 3,
          title: "Module 3: Multimedia Systems",
          description: "- Introduction to multimedia and components - Text, image, audio, video representations and formats - Compression techniques: JPEG, MPEG, MP3 - Animation techniques and file formats - Hypermedia systems and applications",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst527-mod-4',
          number: 4,
          title: "Module 4: Multimedia Applications and Tools",
          description: "- Multimedia databases and authoring tools - Synchronization issues - Multimedia on the web and streaming - Case studies of multimedia applications - Virtual reality and interactive systems 1. Donald Hearn, M. Pauline Baker, *Computer Graphics with OpenGL*, Pearson, 4/e, 2010 2. Foley, van Dam, Fein",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst528',
      code: 'PECST528',
      title: 'Advanced Computer Architecture',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST528: Advanced Computer Architecture.",
      modules: [
        {
          id: 'pecst528-mod-1',
          number: 1,
          title: "Module 1: Fundamentals and ILP",
          description: "- Review of basic computer architecture - Classification: SISD, SIMD, MISD, MIMD - Pipelining: concepts, hazards, techniques to overcome hazards - Instruction-level parallelism (ILP), dynamic scheduling, Tomasulo\u2019s algorithm - Branch prediction, compiler techniques for ILP",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst528-mod-2',
          number: 2,
          title: "Module 2: Data-Level and Thread-Level Parallelism",
          description: "- Vector architecture, SIMD extensions, multimedia extensions - Graphics processing units (GPUs), CUDA architecture - Multithreading: fine-grained and coarse-grained - Simultaneous multithreading (SMT) - Chip multiprocessors (CMP) and multicore processors",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst528-mod-3',
          number: 3,
          title: "Module 3: Memory Hierarchy and Interconnection Networks",
          description: "- Cache design and memory hierarchy - Virtual memory, TLB, paging and segmentation - Shared memory and distributed memory - Interconnection networks: mesh, hypercube, fat tree, crossbar - Network topologies and performance measures",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst528-mod-4',
          number: 4,
          title: "Module 4: Multiprocessor Systems and Case Studies",
          description: "- Multiprocessor systems: UMA and NUMA - Coherence and consistency models - Directory-based and snoopy cache protocols - Case studies: Intel Xeon, AMD Ryzen, NVIDIA GPU architecture - Future trends in computer architecture 1. John L. Hennessy, David A. Patterson, *Computer Architecture: A Quantitati",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst525',
      code: 'PECST525',
      title: 'Data Mining',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST525: Data Mining.",
      modules: [
        {
          id: 'pecst525-mod-1',
          number: 1,
          title: "Module 1: Data Mining Fundamentals",
          description: "- Data Mining: concepts and applications - Knowledge Discovery in Database (KDD) vs Data Mining - Architecture of typical data mining systems - Data Mining Functionalities - Data Warehousing: operational DBs vs warehouses - Multidimensional data model: Warehouse schema, OLAP operations - Data Wareho",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst525-mod-2',
          number: 2,
          title: "Module 2: Data Preprocessing",
          description: "- Need for data preprocessing - Data cleaning: missing values, noisy data - Data integration and transformation - Data reduction: cube aggregation, attribute subset selection - Dimensionality reduction, numerosity reduction - Discretization and concept hierarchy generation",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst525-mod-3',
          number: 3,
          title: "Module 3: Classification and Clustering",
          description: "- Classification: Introduction, decision tree construction (ID3), information gain, Gini index - Neural networks, backpropagation - Evaluation measures: accuracy, precision, recall, F1 score - Clustering: Introduction, distance measures - Clustering paradigms: partitioning (k-means), hierarchical cl",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst525-mod-4',
          number: 4,
          title: "Module 4: Association Rule Analysis and Advanced Data Mining",
          description: "- Association rule mining: concepts, Apriori algorithm, FP-Growth algorithm - Web Mining: content, structure (PageRank), and usage mining - Text Mining: information retrieval, basic text measures - Text indexing and retrieval methods - Preprocessing and pattern discovery in web/text mining 1. Jiawei",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pecst595',
      code: 'PECST595',
      title: 'Advanced Graph Algorithms',
      credits: 4,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PECST595: Advanced Graph Algorithms.",
      modules: [
        {
          id: 'pecst595-mod-1',
          number: 1,
          title: "Module 1: Graph Fundamentals and Traversals",
          description: "- Graph types: directed, undirected, weighted, unweighted - Graph representations: adjacency list, adjacency matrix, edge list - Graph traversal: BFS, DFS and their applications - Cycle detection, connected components - Bipartite graphs, topological sorting",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst595-mod-2',
          number: 2,
          title: "Module 2: Shortest Paths and Network Flows",
          description: "- Dijkstra\u2019s and Bellman-Ford algorithms - Floyd-Warshall algorithm, Johnson\u2019s algorithm - Maximum flow problem: Ford-Fulkerson and Edmonds-Karp algorithms - Applications: bipartite matching, assignment problems - Flow networks and cuts",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst595-mod-3',
          number: 3,
          title: "Module 3: Trees and Decomposition",
          description: "- Minimum Spanning Tree (MST): Prim\u2019s and Kruskal\u2019s algorithms - Disjoint Set Union (DSU), Union-Find with path compression - Euler tour and Binary Lifting - Lowest Common Ancestor (LCA) algorithms - Heavy-Light Decomposition (HLD), Centroid Decomposition",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
        {
          id: 'pecst595-mod-4',
          number: 4,
          title: "Module 4: Advanced Topics and Applications",
          description: "- Graph coloring: greedy coloring, chromatic number - Planar graphs: Euler\u2019s formula, Kuratowski\u2019s theorem - Graph isomorphism and automorphisms (basics) - Spectral graph theory: Laplacian matrix overview - Applications in scheduling, VLSI design, map coloring 1. Thomas H. Cormen, Charles E. Leisers",
          hours: 9,
          weightagePercent: 25,
          topics: []
        },
      ]
    },
    {
      id: 'pccsl507',
      code: 'PCCSL507',
      title: 'Networks Lab',
      credits: 2,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PCCSL507: Networks Lab.",
      modules: [
      ]
    },
    {
      id: 'pccsl508',
      code: 'PCCSL508',
      title: 'Machine Learning Lab',
      credits: 2,
      scheme: '2024 Scheme',
      semester: 'S5',
      description: "Official KTU 2024 Scheme Syllabus for PCCSL508: Machine Learning Lab.",
      modules: [
      ]
    },
  ]
};
