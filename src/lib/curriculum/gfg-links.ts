export interface GfgReference {
  topicKey: string;
  title: string;
  url: string;
  category: string;
}

export const GFG_CURATED_LINKS: GfgReference[] = [
  // Computer Networks (PCCST501)
  {
    topicKey: 'osi',
    title: 'GeeksforGeeks: Layers of OSI Model',
    url: 'https://www.geeksforgeeks.org/layers-of-osi-model/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'tcp',
    title: 'GeeksforGeeks: TCP Congestion Control',
    url: 'https://www.geeksforgeeks.org/tcp-congestion-control/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'aloha',
    title: 'GeeksforGeeks: Multiple Access Protocols - ALOHA',
    url: 'https://www.geeksforgeeks.org/multiple-access-protocols-in-computer-network/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'csma',
    title: 'GeeksforGeeks: CSMA/CD and CSMA/CA Access Protocols',
    url: 'https://www.geeksforgeeks.org/carrier-sense-multiple-access-csma/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'crc',
    title: 'GeeksforGeeks: Cyclic Redundancy Check (CRC)',
    url: 'https://www.geeksforgeeks.org/cyclic-redundancy-check-python-code/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'dijkstra-routing',
    title: 'GeeksforGeeks: Link State Routing Protocol',
    url: 'https://www.geeksforgeeks.org/link-state-routing-protocol/',
    category: 'Computer Networks'
  },
  {
    topicKey: 'distance-vector',
    title: 'GeeksforGeeks: Distance Vector Routing Algorithm',
    url: 'https://www.geeksforgeeks.org/distance-vector-routing-algorithm/',
    category: 'Computer Networks'
  },

  // DAA (PCCST502)
  {
    topicKey: 'asymptotic',
    title: 'GeeksforGeeks: Analysis of Algorithms & Asymptotic Notations',
    url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/',
    category: 'DAA'
  },
  {
    topicKey: 'master-theorem',
    title: 'GeeksforGeeks: Master Theorem for Divide and Conquer',
    url: 'https://www.geeksforgeeks.org/master-theorem-for-divide-and-conquer-recurrences/',
    category: 'DAA'
  },
  {
    topicKey: 'dijkstra',
    title: "GeeksforGeeks: Dijkstra's Shortest Path Algorithm",
    url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/',
    category: 'DAA'
  },
  {
    topicKey: 'knapsack',
    title: 'GeeksforGeeks: 0/1 Knapsack Problem - Dynamic Programming',
    url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
    category: 'DAA'
  },
  {
    topicKey: 'lcs',
    title: 'GeeksforGeeks: Longest Common Subsequence (LCS)',
    url: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/',
    category: 'DAA'
  },
  {
    topicKey: 'bellman-ford',
    title: 'GeeksforGeeks: Bellman-Ford Shortest Path Algorithm',
    url: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/',
    category: 'DAA'
  },
  {
    topicKey: 'np-complete',
    title: 'GeeksforGeeks: Introduction to NP-Completeness',
    url: 'https://www.geeksforgeeks.org/np-completeness-set-1/',
    category: 'DAA'
  },

  // Machine Learning (PCCST503)
  {
    topicKey: 'gradient-descent',
    title: 'GeeksforGeeks: Gradient Descent in Machine Learning',
    url: 'https://www.geeksforgeeks.org/gradient-descent-algorithm-and-its-variants/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'linear-regression',
    title: 'GeeksforGeeks: Linear Regression Python Implementation',
    url: 'https://www.geeksforgeeks.org/linear-regression-python-implementation/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'logistic-regression',
    title: 'GeeksforGeeks: Understanding Logistic Regression',
    url: 'https://www.geeksforgeeks.org/understanding-logistic-regression/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'decision-tree',
    title: 'GeeksforGeeks: Decision Tree Algorithm Explained',
    url: 'https://www.geeksforgeeks.org/decision-tree/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'svm',
    title: 'GeeksforGeeks: Support Vector Machine (SVM) Algorithm',
    url: 'https://www.geeksforgeeks.org/support-vector-machine-algorithm/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'kmeans',
    title: 'GeeksforGeeks: K-Means Clustering in Machine Learning',
    url: 'https://www.geeksforgeeks.org/k-means-clustering-introduction/',
    category: 'Machine Learning'
  },
  {
    topicKey: 'pca',
    title: 'GeeksforGeeks: Principal Component Analysis (PCA)',
    url: 'https://www.geeksforgeeks.org/principal-component-analysis-pca/',
    category: 'Machine Learning'
  },

  // Microcontrollers (PBCST504)
  {
    topicKey: '8051',
    title: 'GeeksforGeeks: 8051 Microcontroller Architecture',
    url: 'https://www.geeksforgeeks.org/8051-microcontroller-architecture/',
    category: 'Microcontrollers'
  },
  {
    topicKey: '8051-pin',
    title: 'GeeksforGeeks: Pin Diagram of 8051 Microcontroller',
    url: 'https://www.geeksforgeeks.org/pin-diagram-of-8051-microcontroller/',
    category: 'Microcontrollers'
  },
  {
    topicKey: 'arm',
    title: 'GeeksforGeeks: Introduction to ARM Architecture',
    url: 'https://www.geeksforgeeks.org/introduction-to-arm-architecture/',
    category: 'Microcontrollers'
  },

  // Artificial Intelligence (PECST522)
  {
    topicKey: 'astar',
    title: 'GeeksforGeeks: A* Search Algorithm in AI',
    url: 'https://www.geeksforgeeks.org/a-search-algorithm/',
    category: 'AI'
  },
  {
    topicKey: 'minimax',
    title: 'GeeksforGeeks: Minimax Algorithm & Alpha-Beta Pruning',
    url: 'https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-4-alpha-beta-pruning/',
    category: 'AI'
  },
  {
    topicKey: 'bfs-dfs',
    title: 'GeeksforGeeks: Search Algorithms in AI',
    url: 'https://www.geeksforgeeks.org/search-algorithms-in-ai/',
    category: 'AI'
  },

  // Computer Graphics (PECST527)
  {
    topicKey: 'bresenham',
    title: "GeeksforGeeks: Bresenham's Line Generation Algorithm",
    url: 'https://www.geeksforgeeks.org/bresenhams-line-generation-algorithm/',
    category: 'Computer Graphics'
  },
  {
    topicKey: 'midpoint-circle',
    title: 'GeeksforGeeks: Mid-Point Circle Drawing Algorithm',
    url: 'https://www.geeksforgeeks.org/mid-point-circle-drawing-algorithm/',
    category: 'Computer Graphics'
  },
  {
    topicKey: 'cohen-sutherland',
    title: 'GeeksforGeeks: Cohen Sutherland Line Clipping Algorithm',
    url: 'https://www.geeksforgeeks.org/line-clipping-set-1-cohen-sutherland-algorithm/',
    category: 'Computer Graphics'
  }
];

export function findGfgLinks(queryOrTopic: string): Array<{ title: string; url: string }> {
  const q = queryOrTopic.toLowerCase();
  const matched = GFG_CURATED_LINKS.filter(item => {
    return q.includes(item.topicKey) || 
      item.title.toLowerCase().includes(q) ||
      q.includes(item.category.toLowerCase());
  });

  if (matched.length > 0) {
    return matched.slice(0, 3).map(m => ({ title: m.title, url: m.url }));
  }

  // Fallback to formatted Google site-search on GeeksforGeeks
  const cleanTerm = encodeURIComponent(queryOrTopic.trim() + ' geeksforgeeks');
  return [
    {
      title: `GeeksforGeeks: ${queryOrTopic.slice(0, 40)}`,
      url: `https://www.google.com/search?q=site%3Ageeksforgeeks.org+${cleanTerm}`
    }
  ];
}
