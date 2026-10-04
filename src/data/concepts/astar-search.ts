import { ConceptDetail } from '../../types/curriculum';

export const astarSearchConcept: ConceptDetail = {
  id: 'astar-search',
  title: 'A* Informed Heuristic Search & Admissibility',
  subjectId: 'cst-308-ai',
  subjectTitle: 'Artificial Intelligence & Expert Systems',
  moduleId: 'mod-2-search',
  moduleTitle: 'Module 2: Heuristic Search & Game Playing',
  difficulty: 'intermediate',
  category: 'algorithm',
  estimatedMinutes: 26,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: 'uninformed-bfs', title: 'Breadth-First and Uniform Cost Search', reason: 'Must understand path cost g(n)' },
    { id: 'priority-queues', title: 'Priority Queues & State Space Graphs', reason: 'Needed to manage Open and Closed lists' }
  ],
  unlocks: [
    { id: 'game-minimax', title: 'Adversarial Search (Minimax & Alpha-Beta)' },
    { id: 'motion-planning', title: 'Autonomous Robot Path Planning' }
  ],
  idea: {
    simpleExplanation: "Imagine you are navigating an unfamiliar city to reach the central railway station. If you only look at the distance you have already walked (Uniform Cost Search), you might wander in the exact opposite direction of the city center. If you only look at a straight compass line to the station (Greedy Best-First), you might get trapped in a dead-end canyon. A* combines both: it looks at how far you have walked PLUS an informed estimate of how far remains to the goal.",
    intuitionSummary: 'Evaluate nodes by f(n) = g(n) + h(n), balancing actual past cost with optimistic future promise.',
    analogy: {
      title: 'The Smart GPS Navigator',
      story: 'A driver uses a GPS. The GPS tracks exact odometer kilometers travelled so far (g) and combines it with satellite line-of-sight distance to the destination (h). It prioritizes roads that minimize the estimated total journey (f = g + h).',
      moral: 'Never explore expensive detours when a straight line shows a faster corridor exists.'
    }
  },
  whyItExists: {
    historicalProblem: 'In artificial intelligence state-space search (like 8-puzzle, automated theorem proving, or robot routing), the branching factor b causes the search tree to explode exponentially (O(b^d)), making uninformed search algorithms run out of memory within seconds.',
    naiveApproachFailed: 'Greedy Best-First Search selects nodes with minimum heuristic h(n) alone. It is fast, but it is neither complete nor optimal and can be easily led astray into massive loops.',
    coreInsight: 'By ranking nodes via f(n) = g(n) + h(n) where h(n) is an admissible heuristic (meaning it NEVER overestimates the true remaining cost to the goal), A* is mathematically guaranteed to find the optimal shortest path while expanding the minimum number of nodes possible.'
  },
  formulaExplorer: {
    title: 'The A* Evaluation Function',
    tex: 'f(n) = g(n) + h(n), \\quad \\text{where } h(n) \\le h^*(n)',
    plain: 'f(n) = g(n) + h(n), with h(n) <= h_star(n)',
    explanation: 'Total estimated path cost through node n to goal equals actual path cost from start to n plus heuristic estimate from n to goal.',
    variables: [
      {
        symbol: 'f(n)',
        name: 'Estimated Total Cost',
        meaning: 'Estimated cost of the cheapest solution passing through node n.',
        effectWhenIncreased: 'Deprioritizes node n in the OPEN priority queue.'
      },
      {
        symbol: 'g(n)',
        name: 'Past Path Cost',
        meaning: 'The exact cumulative cost incurred to reach node n from the start state.',
        unit: 'accumulated weight',
        effectWhenIncreased: 'Penalizes nodes reached via convoluted, winding paths.'
      },
      {
        symbol: 'h(n)',
        name: 'Heuristic Estimate',
        meaning: 'An estimated cost from node n to the goal. Must be admissible (h(n) <= h*(n)).',
        unit: 'estimated cost',
        effectWhenIncreased: 'If h exceeds true cost, optimality is destroyed.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Inadmissible Heuristic Trap',
    brokenCondition: 'Provide an inadmissible heuristic where h(n) > h*(n) (overestimates the true cost to goal).',
    symptom: 'A* returns a suboptimal, expensive goal path and completely overlooks the true shortest path!',
    whyItFailed: 'Because the heuristic overestimated the cost of the optimal corridor, A* pushed that optimal path to the back of the OPEN priority queue and prematurely terminated on a worse goal.',
    preventionRule: 'Always guarantee admissibility: for physical maps, straight-line Euclidean distance is always <= road distance.'
  },
  underTheHood: {
    formalDefinition: 'A* is a best-first graph search algorithm that expands nodes in order of non-decreasing f(n) = g(n) + h(n).',
    keyProperties: [
      'Admissibility: h(n) ≤ h*(n) for all n. Guarantees optimality on trees.',
      'Consistency (Monotonicity): h(n) ≤ c(n, a, n\') + h(n\'). Guarantees optimality on graphs without needing to reopen closed nodes.',
      'Optimal Efficiency: No other optimal algorithm with the same heuristic expands fewer nodes than A*.'
    ],
    timeComplexity: 'Exponential in worst case O(b^d), but linear with near-perfect heuristics',
    spaceComplexity: 'O(b^d) memory (all generated nodes reside in memory - major limitation of A*)',
    invariants: [
      'When A* terminates and selects a goal node from OPEN, that goal node has the lowest f-cost among all candidate paths.'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Step 0: Initialize OPEN with Start Node S',
        description: 'Set g(S) = 0, h(S) = 10, f(S) = 10. OPEN = {S(f=10)}, CLOSED = {}.',
        internalState: { open: 'S:10', closed: 'empty', current: 'S' },
        highlightNote: 'Start node has zero past cost; its f-value is entirely the heuristic.'
      },
      {
        index: 2,
        actionTitle: 'Step 1: Expand S to Neighbors A and B',
        description: 'For A: g=3, h=7 -> f=10. For B: g=5, h=3 -> f=8. OPEN = {B:8, A:10}. CLOSED = {S}.',
        internalState: { open: 'B:8, A:10', closed: 'S', current: 'B' },
        highlightNote: 'B has lower f-score (8) than A (10) despite higher g-cost because of a very promising heuristic!'
      },
      {
        index: 3,
        actionTitle: 'Step 2: Expand Node B',
        description: 'From B, we reach Goal G with step cost 4. For G: g = 5 + 4 = 9, h(G) = 0 -> f(G) = 9. OPEN = {G:9, A:10}.',
        internalState: { open: 'G:9, A:10', closed: 'S, B', current: 'G' },
        highlightNote: 'Goal G is discovered with f(G) = 9. Next node in priority queue is G.'
      },
      {
        index: 4,
        actionTitle: 'Step 3: Extract Goal G and Halt',
        description: 'Extract G from OPEN (min f = 9). Since G is a goal node, terminate! Optimal path S -> B -> G with total cost 9.',
        internalState: { open: 'A:10', closed: 'S, B, G', status: 'Optimal Path Found' },
        highlightNote: 'Notice node A was NEVER expanded because its f(A)=10 was higher than the goal cost 9! Saved compute.'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'You have two candidate nodes in the OPEN list: Node X with g=12, h=2 (f=14) and Node Y with g=4, h=11 (f=15). Which node will A* expand next?',
    contextState: 'OPEN list: Node X (g=12, h=2, f=14) | Node Y (g=4, h=11, f=15)',
    options: [
      {
        id: 'pred-astar-1',
        text: 'Node Y because it has a much lower past cost g(n) = 4.',
        isCorrect: false,
        explanation: 'Incorrect. Uniform Cost Search picks by g(n), but A* always picks by the minimum f(n) = g + h.'
      },
      {
        id: 'pred-astar-2',
        text: 'Node X because it has the minimum total estimated cost f(n) = 14.',
        isCorrect: true,
        explanation: 'Correct! A* orders its priority queue strictly by f(n). Since f(X) = 14 < f(Y) = 15, Node X is expanded first.'
      },
      {
        id: 'pred-astar-3',
        text: 'Both nodes are expanded in parallel.',
        isCorrect: false,
        explanation: 'Incorrect. Standard A* expands nodes sequentially from its priority queue.'
      }
    ]
  },
  codePlayground: {
    language: 'python',
    starterCode: `# A* Search Algorithm in Python
import heapq

def a_star_search(graph, heuristics, start, goal):
    # graph: { node: [(neighbor, cost), ...] }
    # heuristics: { node: h_val }
    open_set = [(heuristics[start], 0, start, [start])]
    g_scores = {start: 0}
    
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        
        if current == goal:
            return path, g
            
        for neighbor, weight in graph.get(current, []):
            tentative_g = g + weight
            if tentative_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = tentative_g
                f_score = tentative_g + heuristics[neighbor]
                heapq.heappush(open_set, (f_score, tentative_g, neighbor, path + [neighbor]))
                
    return None, float('inf')

graph = {
    'S': [('A', 1), ('B', 4)],
    'A': [('G', 7)],
    'B': [('G', 2)],
    'G': []
}
h = {'S': 5, 'A': 6, 'B': 2, 'G': 0}

path, cost = a_star_search(graph, h, 'S', 'G')
print(f"Optimal Path found by A*: {' -> '.join(path)} with Cost: {cost}")
`,
    solutionCode: `import heapq
def a_star_search(graph, heuristics, start, goal):
    open_set = [(heuristics[start], 0, start, [start])]
    g_scores = {start: 0}
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        if current == goal: return path, g
        for neighbor, weight in graph.get(current, []):
            t_g = g + weight
            if t_g < g_scores.get(neighbor, float('inf')):
                g_scores[neighbor] = t_g
                heapq.heappush(open_set, (t_g + heuristics[neighbor], t_g, neighbor, path + [neighbor]))
    return None, float('inf')`,
    description: 'Execute A* search using f(n) = g(n) + h(n) to find the goal state.',
    expectedBehavior: 'Finds optimal path S -> B -> G with total cost 6.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'A* stops the moment it generates a goal node.',
      whyWrong: 'A goal node might be generated via an expensive suboptimal path early on. A* must only terminate when the goal is EXTRACTED from the OPEN queue, guaranteeing that no other path with a lower f-score exists!',
      truth: 'A* terminates upon selecting a goal for expansion, not upon initial generation.',
      consequenceInCodeOrExam: 'In KTU exams, stating that A* halts on goal generation loses 2 marks.'
    }
  ],
  comparison: {
    conceptA: 'A* Search Algorithm',
    conceptB: 'Greedy Best-First Search',
    dimensions: [
      {
        metric: 'Evaluation Function',
        valA: 'f(n) = g(n) + h(n)',
        valB: 'f(n) = h(n) alone',
        takeaway: 'A* balances past distance with future estimate.'
      },
      {
        metric: 'Optimality',
        valA: 'Guaranteed optimal with admissible heuristic',
        valB: 'NOT optimal (can return terrible long paths)',
        takeaway: 'Greedy can get trapped in deep detours.'
      },
      {
        metric: 'Completeness',
        valA: 'Complete on finite graphs',
        valB: 'Incomplete (can get stuck in infinite loops)',
        takeaway: 'A* is robust against looping paths.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 308 (Artificial Intelligence)',
    examDefinition: 'A* is an informed heuristic search algorithm that computes the optimal path from a start node to a goal node by evaluating nodes using f(n) = g(n) + h(n), where g(n) is the exact cost from start to n and h(n) is an admissible heuristic function.',
    frequentYearQuestions: [
      'KTU Dec 2023: Explain A* algorithm. Prove that A* is optimal if the heuristic is admissible. (10 Marks)',
      'KTU May 2024: Differentiate between Admissible and Consistent heuristics with mathematical expressions. (5 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'Define an admissible heuristic in A* search.',
        modelAnswer: 'A heuristic function h(n) is admissible if it never overestimates the cost to reach the goal. Formally, for all nodes n, 0 ≤ h(n) ≤ h*(n), where h*(n) is the true optimal cost from node n to the nearest goal state.',
        keyPointsExpected: ['Never overestimates rule', 'Inequality 0 <= h(n) <= h*(n)', 'Definition of h*(n)'],
        commonDeductions: ['Stating h(n) must equal h*(n) instead of being an upper bound (-1 mark)']
      },
      {
        marks: 5,
        question: 'State and explain the consistency (monotonicity) condition for heuristics in A* search.',
        modelAnswer: '1. Definition: A heuristic h is consistent (monotonic) if for every node n and every successor n\' generated by action a:\n   h(n) ≤ c(n, a, n\') + h(n\')\n2. Triangle Inequality: This states that the estimated cost from n to goal cannot be greater than the step cost to n\' plus the estimated cost from n\' to goal.\n3. Consequence: If h is consistent, f(n) values are monotonically non-decreasing along any path, and the first time A* visits any state, its path is guaranteed to be optimal, meaning closed states never need to be reopened.',
        keyPointsExpected: ['Mathematical triangle inequality', 'Proof that f(n) is non-decreasing', 'Benefit: closed nodes never reopened'],
        commonDeductions: ['Confusing consistency with admissibility (-1.5 marks)']
      },
      {
        marks: 10,
        question: 'Detailed Essay: Trace A* algorithm on the 8-puzzle problem using Manhattan distance heuristic. Prove that A* tree search is optimal under an admissible heuristic.',
        modelAnswer: 'Structured 10-Mark Answer:\n1. Formulation of 8-puzzle state space and Manhattan distance formula (2 marks)\n2. Step-by-step trace showing OPEN and CLOSED lists with g, h, f values (3.5 marks)\n3. Mathematical Proof of Optimality by Contradiction (3 marks):\n   - Assume suboptimal goal G2 is selected before optimal goal G\n   - Show that there must exist an unexpanded node n on the optimal path to G in OPEN\n   - Prove f(n) < f(G2), contradicting that G2 was selected first!\n4. Time and space complexity trade-offs (1.5 marks).',
        keyPointsExpected: ['Clear proof by contradiction', 'Tabular trace of 8-puzzle states', 'Manhattan vs misplaced tiles comparison'],
        commonDeductions: ['Failing to prove by contradiction (-2 marks)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'astar-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: 'Which of the following heuristics is guaranteed to be admissible for road network pathfinding?',
      options: [
        { id: '1a', text: 'Euclidean (straight line) distance', isCorrect: true },
        { id: '1b', text: 'Straight line distance multiplied by 2', isCorrect: false },
        { id: '1c', text: 'Estimated driving time in rush hour', isCorrect: false }
      ],
      correctExplanation: 'Straight-line Euclidean distance is the shortest possible path between two points in geometry. Road distance can never be shorter than a straight line, so h(n) <= h*(n) always holds.'
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-astar-1',
      question: 'What happens to A* search if h(n) = 0 for all nodes?',
      expectedKeywords: ['Dijkstra', 'Uniform Cost Search', 'UCS'],
      idealAnswer: 'A* becomes identical to Dijkstra\'s algorithm / Uniform Cost Search.'
    }
  ],
  masteryCriteria: [
    'Can formally define the evaluation function f(n) = g(n) + h(n)',
    'Explains why admissible heuristics guarantee optimality',
    'Traces A* execution using OPEN and CLOSED priority queues',
    'Understands why straight line distance is admissible while road times may not be'
  ]
};
