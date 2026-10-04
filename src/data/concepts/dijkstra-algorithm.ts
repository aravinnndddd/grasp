import { ConceptDetail } from '../../types/curriculum';

export const dijkstraAlgorithmConcept: ConceptDetail = {
  id: 'dijkstra-algorithm',
  title: "Dijkstra's Single-Source Shortest Path Algorithm",
  subjectId: 'cst-306-daa',
  subjectTitle: 'Design and Analysis of Algorithms',
  moduleId: 'mod-3-greedy',
  moduleTitle: 'Module 3: Greedy Method & Graph Algorithms',
  difficulty: 'intermediate',
  category: 'algorithm',
  estimatedMinutes: 28,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: 'graphs-rep', title: 'Graph Representations (Adjacency Matrix / List)', reason: 'Must understand vertices V, edges E and weights w(u,v)' },
    { id: 'min-heap', title: 'Priority Queue (Min-Heap)', reason: 'Crucial for extracting the minimum tentative distance node in O(log V)' }
  ],
  unlocks: [
    { id: 'bellman-ford', title: 'Bellman-Ford Algorithm (Handles Negative Edges)' },
    { id: 'astar-ai', title: 'A* Heuristic Search Algorithm in AI' }
  ],
  idea: {
    simpleExplanation: "Imagine you drop a dye of colored water into an intricate system of pipes connecting several towns. The water naturally flows outward through the shortest, fastest pipes first. As soon as the water reaches a town, that exact path is guaranteed to be the shortest path from the starting town. Dijkstra's algorithm simulates this outward expanding wave of shortest distances using a priority queue.",
    intuitionSummary: 'Greedily finalize the unvisited vertex with the smallest tentative distance, then relax all its outgoing neighbor edges.',
    analogy: {
      title: 'The Burning String Model',
      story: 'Imagine knotting pieces of string together into a network where string length represents edge weight. You light a flame at the start knot. The fire spreads along all strings at constant speed. The moment the fire reaches knot X, the string that brought it there was the fastest path.',
      moral: 'Greedy local earliest arrival guarantees global shortest path because edge weights are strictly non-negative.'
    }
  },
  whyItExists: {
    historicalProblem: 'Given a road network, packet router topology, or flight schedule with non-negative edge costs, finding the shortest path between nodes by checking all possible simple paths takes O(V!) combinatorial time, which would freeze navigation systems worldwide.',
    naiveApproachFailed: 'Breadth-First Search (BFS) finds shortest paths in unweighted graphs in O(V + E) time, but completely breaks on weighted graphs because a 3-hop path might be cheaper than a 1-hop path with weight 100.',
    coreInsight: 'Instead of exploring by hop count, explore by smallest accumulated distance. By maintaining a min-priority queue and applying the relaxation inequality d[v] = min(d[v], d[u] + w(u,v)), each vertex is finalized exactly once in O((V + E) log V) time.'
  },
  formulaExplorer: {
    title: 'The Edge Relaxation Invariant',
    tex: '\\text{if } d[u] + w(u, v) < d[v] \\implies d[v] := d[u] + w(u, v), \\, \\pi[v] := u',
    plain: 'if d[u] + weight(u, v) < d[v]: d[v] = d[u] + weight(u, v); parent[v] = u',
    explanation: 'If travelling from start through vertex u to vertex v is strictly shorter than any previously discovered path to v, update the tentative distance of v and set u as its predecessor.',
    variables: [
      {
        symbol: 'd[u]',
        name: 'Tentative Distance to u',
        meaning: 'The currently known shortest path length from start vertex S to vertex u.',
        effectWhenIncreased: 'Increases the arrival cost to all downstream neighbors.'
      },
      {
        symbol: 'w(u, v)',
        name: 'Edge Weight',
        meaning: 'The non-negative cost (distance, latency, toll) of traversing directed edge (u, v).',
        unit: 'positive scalar',
        effectWhenIncreased: 'Penalizes this route.'
      },
      {
        symbol: 'd[v]',
        name: 'Tentative Distance to v',
        meaning: 'Best known distance to neighbor v. Initialized to +Infinity for all v != S.',
        effectWhenIncreased: 'Means v has not yet been reached or only via very long paths.'
      },
      {
        symbol: '\\pi[v]',
        name: 'Predecessor (Parent Pointer)',
        meaning: 'The previous vertex on the optimal path to v, allowing full path reconstruction.',
        effectWhenIncreased: 'Changes path trajectory.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Negative Edge Weight Catastrophe',
    brokenCondition: 'Feed a graph containing an edge with negative weight w(u, v) = -7 into Dijkstra.',
    symptom: "The algorithm terminates with an incorrect, suboptimal distance to a finalized node, completely missing that taking the negative edge would have made the path significantly shorter.",
    whyItFailed: "Dijkstra's greedy proof relies on the assumption that once a node is extracted from the min-heap with distance d[u], no future path can ever decrease d[u] because all remaining edges are non-negative. A negative edge shatters this monotonicity invariant!",
    preventionRule: 'Never use Dijkstra on graphs with negative edge weights. Use the Bellman-Ford algorithm O(V·E) instead.'
  },
  underTheHood: {
    formalDefinition: 'An algorithm for single-source shortest paths on a directed or undirected graph G = (V, E) with non-negative edge weights w: E → R⁺.',
    keyProperties: [
      'Initialization: d[S] = 0; d[v] = ∞ for all v ≠ S; S is inserted into min-priority queue Q.',
      'Loop: While Q is not empty, extract vertex u with minimum d[u]. Mark u as visited (finalized).',
      'Relaxation: For each unvisited neighbor v of u, relax edge (u, v). If relaxed, decrease-key v in Q.',
      'Greedy Choice Property: The node with smallest d[u] among unvisited nodes is provably finalized.'
    ],
    timeComplexity: 'O((V + E) log V) with Min-Binary Heap; O(V² + E) with naive array; O(E + V log V) with Fibonacci Heap',
    spaceComplexity: 'O(V) for distance table and priority queue',
    invariants: [
      'For every finalized node u, d[u] equals the true shortest path distance δ(S, u).'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Step 0: Distance Table Initialization',
        description: 'Set source d[A] = 0, and all other vertices d[B]=∞, d[C]=∞, d[D]=∞. Priority Queue Q = {A:0}.',
        internalState: { 'd[A]': '0 (Start)', 'd[B]': '∞', 'd[C]': '∞', 'd[D]': '∞', visited: '{ }' },
        highlightNote: 'Source A has zero distance to itself. All other vertices are initialized to infinity.'
      },
      {
        index: 2,
        actionTitle: 'Step 1: Extract Min A & Relax Neighbors',
        description: 'Extract A (min distance 0). Inspect neighbors B (w=4) and C (w=2). Relax both: d[B]=4, d[C]=2.',
        internalState: { extracted: 'A', 'd[B]': '4 (via A)', 'd[C]': '2 (via A)', visited: '{ A }' },
        highlightNote: 'Both B and C are relaxed from infinity to 4 and 2.'
      },
      {
        index: 3,
        actionTitle: 'Step 2: Extract Min C (Distance 2)',
        description: 'Extract C because 2 < 4. Relax neighbor B through C: w(C, B)=1. Check: d[C] + 1 = 2 + 1 = 3 < d[B] (4)!',
        internalState: { extracted: 'C', 'd[B]': '3 (via C)', 'd[D]': '7 (via C)', visited: '{ A, C }' },
        highlightNote: 'Path A -> C -> B (length 3) is strictly shorter than direct path A -> B (length 4)! d[B] relaxed to 3.'
      },
      {
        index: 4,
        actionTitle: 'Step 3: Extract Min B & Finalize Graph',
        description: 'Extract B (d=3). Relax neighbor D: d[B] + 3 = 3 + 3 = 6 < 7. Update d[D]=6.',
        internalState: { extracted: 'B', 'd[D]': '6 (via B)', visited: '{ A, C, B, D }' },
        highlightNote: 'All vertices finalized. Shortest path to D is A -> C -> B -> D with total cost 6.'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'Current distance table: d[A]=0 (final), d[B]=5 (final), d[C]=7, d[D]=12. We are relaxing vertex B. Edge (B, D) has weight 4. What will happen to d[D]?',
    contextState: 'd[B] = 5 | d[D] = 12 | Edge weight w(B, D) = 4',
    options: [
      {
        id: 'pred-dijk-1',
        text: 'd[D] remains 12 because D was already discovered.',
        isCorrect: false,
        explanation: 'Incorrect. If a newly discovered path is shorter, the distance must be updated (relaxation).'
      },
      {
        id: 'pred-dijk-2',
        text: 'd[D] is relaxed from 12 down to 9 (5 + 4 = 9).',
        isCorrect: true,
        explanation: 'Exact! Since d[B] + w(B, D) = 5 + 4 = 9 < 12, the relaxation condition holds and d[D] updates to 9 with predecessor B.'
      },
      {
        id: 'pred-dijk-3',
        text: 'd[D] becomes 4 because edge weight overwrites previous distance.',
        isCorrect: false,
        explanation: 'Incorrect. We accumulate total distance from the start node: d[u] + weight.'
      }
    ]
  },
  codePlayground: {
    language: 'python',
    starterCode: `# Dijkstra's Algorithm Implementation in Python
import heapq

def dijkstra(graph, start):
    # graph: { node: [(neighbor, weight), ...] }
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        
        if curr_dist > distances[u]:
            continue
            
        for v, weight in graph[u]:
            # TODO: Complete the relaxation check
            new_dist = curr_dist + weight
            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
                
    return distances

test_graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('D', 5)],
    'C': [('B', 1), ('D', 8)],
    'D': []
}

shortest_distances = dijkstra(test_graph, 'A')
print("Shortest distances from Source A:")
for node, d in shortest_distances.items():
    print(f"Node {node}: {d}")
`,
    solutionCode: `import heapq
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        curr_dist, u = heapq.heappop(pq)
        if curr_dist > distances[u]: continue
        for v, weight in graph[u]:
            if curr_dist + weight < distances[v]:
                distances[v] = curr_dist + weight
                heapq.heappush(pq, (curr_dist + weight, v))
    return distances`,
    description: 'Execute Dijkstra using Python heapq min-priority queue.',
    expectedBehavior: 'Computes optimal path costs: A:0, C:2, B:3, D:8.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'You can fix negative edges in Dijkstra by simply adding a large constant C to all edge weights.',
      whyWrong: 'Adding C to every edge adds C · k to a path with k hops. A path with 4 hops is penalized by 4C, whereas a path with 1 hop is penalized by only 1C, completely altering which path is truly shortest!',
      truth: 'Adding a constant changes the shortest path. Only Johnson\'s algorithm (using potential reweighting) can safely reweight edges.',
      consequenceInCodeOrExam: 'Classic KTU 5-mark question trick: asking if adding a constant to edge weights allows using Dijkstra.'
    }
  ],
  comparison: {
    conceptA: "Dijkstra's Algorithm",
    conceptB: 'Bellman-Ford Algorithm',
    dimensions: [
      {
        metric: 'Negative Edge Weights',
        valA: 'Strictly NOT allowed (Produces wrong answers)',
        valB: 'Fully supported (Also detects negative cycles)',
        takeaway: 'Use Dijkstra when weights are non-negative; use Bellman-Ford otherwise.'
      },
      {
        metric: 'Time Complexity',
        valA: 'O((V + E) log V) - Extremely fast',
        valB: 'O(V · E) - Slower dynamic programming',
        takeaway: 'Dijkstra is preferred for large road networks.'
      },
      {
        metric: 'Algorithmic Paradigm',
        valA: 'Greedy Method',
        valB: 'Dynamic Programming',
        takeaway: 'Greedy commits early; DP relaxes all edges |V|-1 times.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 306 (Design & Analysis of Algorithms)',
    examDefinition: "Dijkstra's algorithm is a greedy graph search algorithm that solves the single-source shortest path problem for a directed or undirected graph with non-negative edge weights in O((V + E) log V) time by iteratively selecting the unvisited vertex with the minimum tentative distance.",
    frequentYearQuestions: [
      'KTU Nov 2023: Write and explain Dijkstra algorithm with an example graph. Analyze its time complexity. (10 Marks)',
      'KTU June 2024: Show why Dijkstra algorithm fails when negative edge weights are present. (5 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'State the edge relaxation condition used in Dijkstra algorithm.',
        modelAnswer: 'For a directed edge (u, v) with weight w(u, v), if d[u] + w(u, v) < d[v], then d[v] is updated to d[u] + w(u, v) and the predecessor π[v] is set to u.',
        keyPointsExpected: ['Correct strict inequality', 'Distance update assignment', 'Predecessor assignment'],
        commonDeductions: ['Missing predecessor pointer (-0.5 mark)']
      },
      {
        marks: 5,
        question: 'Explain why Dijkstra algorithm fails when negative edge weights are present with a counterexample.',
        modelAnswer: 'Dijkstra assumes that adding edges to a path always increases its total cost. Once a node u is extracted from the priority queue, its distance is finalized under the greedy invariant that no shorter path exists.\nCounterexample:\nVertices: S, A, B.\nEdges: (S, A)=3, (S, B)=5, (A, B)=-4.\n1. Dijkstra extracts A first (cost 3), marks A finalized.\n2. When S -> B is checked (cost 5), Dijkstra marks B finalized.\n3. However, path S -> A -> B costs 3 + (-4) = -1, which is strictly shorter than 5!\n4. Because B was already finalized, Dijkstra fails to update it, yielding an incorrect distance of 5 instead of -1.',
        keyPointsExpected: ['Clear counterexample graph with 3 nodes', 'Step-by-step failure demonstration', 'Explanation of greedy assumption violation'],
        commonDeductions: ['Giving verbal explanation without a concrete counterexample (-2 marks)']
      },
      {
        marks: 10,
        question: 'Detailed Essay: Write the pseudocode of Dijkstra algorithm using min-priority queue. Trace it on a 5-vertex graph and derive the asymptotic time complexity for adjacency matrix vs binary min-heap implementation.',
        modelAnswer: 'Structured 10-Mark Answer:\n1. Pseudocode with initialization, while loop, extract-min, and relaxation (2.5 marks)\n2. Step-by-step trace table showing d[v] and visited set across all iterations (3.5 marks)\n3. Complexity Analysis (3 marks):\n   - Adjacency Matrix: O(V²) since searching for min takes O(V) per step.\n   - Binary Heap + Adjacency List: O((V + E) log V).\n   - Fibonacci Heap: O(E + V log V).\n4. Space complexity justification O(V) (1 mark).',
        keyPointsExpected: ['Complete pseudocode', 'Tabular trace', 'Complexity for both implementations'],
        commonDeductions: ['Failing to explain decrease-key complexity (-1 mark)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'dijk-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: "Which algorithmic paradigm does Dijkstra's algorithm belong to?",
      options: [
        { id: '1a', text: 'Divide and Conquer', isCorrect: false },
        { id: '1b', text: 'Dynamic Programming', isCorrect: false },
        { id: '1c', text: 'Greedy Method', isCorrect: true },
        { id: '1d', text: 'Backtracking', isCorrect: false }
      ],
      correctExplanation: "Dijkstra's algorithm is a classic greedy algorithm because it always chooses the unvisited vertex with the minimum tentative distance at each step."
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-dijk-1',
      question: 'What is the time complexity of Dijkstra with a binary min-heap and adjacency list?',
      expectedKeywords: ['O((V + E) log V)', 'heap', 'log V'],
      idealAnswer: 'O((V + E) log V)'
    }
  ],
  masteryCriteria: [
    'Can write the relaxation rule without looking at notes',
    'Understands why negative weights break the greedy invariant',
    'Can trace distance table step-by-step for a 5-node graph',
    'Analyzes time complexity for array vs binary min-heap implementations'
  ]
};
