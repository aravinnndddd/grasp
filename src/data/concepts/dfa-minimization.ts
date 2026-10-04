import { ConceptDetail } from '../../types/curriculum';

export const dfaMinimizationConcept: ConceptDetail = {
  id: 'dfa-minimization',
  title: 'DFA State Minimization & Equivalence (Myhill-Nerode)',
  subjectId: 'cst-301-flat',
  subjectTitle: 'Formal Languages and Automata Theory',
  moduleId: 'mod-1-automata',
  moduleTitle: 'Module 1: Finite Automata & Regular Languages',
  difficulty: 'intermediate',
  category: 'theoretical',
  estimatedMinutes: 30,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: 'dfa-definition', title: 'Deterministic Finite Automata 5-Tuple', reason: 'Must know Q, Sigma, delta, q0, F and deterministic transitions' },
    { id: 'equivalence-relations', title: 'Equivalence Relations & Partitions', reason: 'Needed to understand indistinguishable state pairs' }
  ],
  unlocks: [
    { id: 'myhill-nerode-theorem', title: 'Myhill-Nerode Theorem & Regularity Proofs' },
    { id: 'lexical-analyzer-gen', title: 'Lexical Analyzer Generators (Lex/Flex)' }
  ],
  idea: {
    simpleExplanation: 'Suppose you have a light switch controller with 6 internal gears. If two different gears respond identically to every button press, produces the exact same light output, and lead to identical outcomes forever, having both gears is wasteful. DFA minimization is the mathematical process of detecting redundant duplicate states and merging them into the smallest possible unique state machine that recognizes the exact same language.',
    intuitionSummary: 'Two states are equivalent if no input string w can ever distinguish them (i.e. one accepts and the other rejects). If they cannot be distinguished, merge them!',
    analogy: {
      title: 'The Identical Twins at the Gate',
      story: 'Two twin guards, Guard A and Guard B, stand at a fortress checkpoint. For every password spoken (0 or 1), both guards point to the exact same next rooms and give the exact same thumbs up or thumbs down. The fortress master realizes they are paying two guards for the work of one.',
      moral: 'Combine Guard A and Guard B into a single merged guard without changing fortress security.'
    }
  },
  whyItExists: {
    historicalProblem: 'When automated tools convert Regular Expressions or NFAs into DFAs (using subset construction), the generated DFA often contains dozens of redundant, unreachable, or clone states. In hardware design (ASICs, microprocessors) and compiler lexical analyzers, every state corresponds to flip-flops, silicon gates, or memory table entries. Unminimized DFAs waste silicon area and consume unnecessary electrical power.',
    naiveApproachFailed: 'Testing every possible string to see if two states behave identically is impossible because there are an infinite number of candidate strings (Σ* is infinite).',
    coreInsight: 'Instead of testing infinite strings, use inductive partition refinement or the Table Filling (Myhill-Nerode) algorithm: start with only 1-length differences (accepting vs non-accepting states), then propagate backwards in finite polynomial time O(n²).'
  },
  formulaExplorer: {
    title: 'Formal Indistinguishability Condition',
    tex: 'p \\equiv q \\iff \\forall w \\in \\Sigma^*, \\, \\hat{\\delta}(p, w) \\in F \\iff \\hat{\\delta}(q, w) \\in F',
    plain: 'p and q are equivalent if for all strings w, delta_hat(p, w) and delta_hat(q, w) are either both in F or both not in F',
    explanation: 'Two states p and q are equivalent if and only if every possible string w leads either both of them to an accepting state, or both to a rejecting state.',
    variables: [
      {
        symbol: 'p, q \\in Q',
        name: 'States Under Test',
        meaning: 'Any pair of distinct states in the DFA state set Q.',
        effectWhenIncreased: 'Increases comparison pairs by n(n-1)/2.'
      },
      {
        symbol: '\\hat{\\delta}',
        name: 'Extended Transition Function',
        meaning: 'Applies a string of symbols w sequentially starting from state p.',
        effectWhenIncreased: 'Traces full path through graph.'
      },
      {
        symbol: 'F \\subseteq Q',
        name: 'Set of Final (Accepting) States',
        meaning: 'The target states where valid input strings terminate with acceptance.',
        effectWhenIncreased: 'Divides the state universe into initial partitions.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Unreachable Trap State Trap',
    brokenCondition: 'Attempting state minimization without first eliminating unreachable states from the start state q0.',
    symptom: 'The algorithm groups an unreachable disconnected island of states into an equivalence class with live states, or wastes cycles calculating transitions that no user input can ever trigger.',
    whyItFailed: 'A state that can never be reached from start state q0 has zero impact on the accepted language L(M), but violates uniqueness of the canonical minimum DFA unless pruned first.',
    preventionRule: 'Always perform Step 0: Run a BFS/DFS from start state q0 and delete all unreachable states before running table-filling or partitioning.'
  },
  underTheHood: {
    formalDefinition: 'Given DFA M = (Q, Σ, δ, q₀, F), find M\' = (Q\', Σ, δ\', q₀\', F\') such that L(M\') = L(M) and |Q\'| is minimum. The minimal DFA is unique up to state isomorphism.',
    keyProperties: [
      'Uniqueness: Every regular language has a unique minimal DFA up to state relabeling.',
      'Initial Partition: P₀ = { F, Q \\ F } (accepting vs non-accepting are 0-distinguishable by the empty string ε).',
      'Refinement: Split a group G if two states p, q ∈ G have δ(p, a) and δ(q, a) landing in different groups for some symbol a ∈ Σ.',
      'Termination: Halts when a full pass produces no new partition splits.'
    ],
    timeComplexity: 'Hopcroft algorithm: O(n log n · |Σ|); Table-filling (Moore): O(|Σ| · n²)',
    spaceComplexity: 'O(n²) for triangular table representation',
    invariants: [
      'Final states and non-final states can NEVER be merged together (distinguished by string ε).'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Step 0: Reachability Sweep',
        description: 'Traverse from start state q0. Mark reachable states: {q0, q1, q2, q3, q4}. Prune unreachable state q5.',
        internalState: { reachableCount: 5, prunedStates: 'q5', status: 'Ready for table creation' },
        highlightNote: 'State q5 had no incoming arrows from q0. Deleted immediately.'
      },
      {
        index: 2,
        actionTitle: 'Step 1: Mark (F, Q \\ F) Pairs',
        description: 'Construct lower-triangular table. For every pair (p, q) where one is in F and the other is not, place an X mark.',
        internalState: { markedPairs: '(q0,q4), (q1,q4), (q2,q4), (q3,q4)', basis: 'Distinguishable by empty string ε' },
        highlightNote: 'Accepting state q4 is immediately distinguished from all non-accepting states.'
      },
      {
        index: 3,
        actionTitle: 'Step 2: Propagate Transition Distinguishability',
        description: 'For unmarked pair (q1, q2): on input 0, δ(q1,0)=q3 and δ(q2,0)=q3 (same). On input 1, δ(q1,1)=q4 (final) and δ(q2,1)=q4 (final).',
        internalState: { currentPair: '(q1, q2)', on_0: 'q3 vs q3', on_1: 'q4 vs q4', verdict: 'Unmarked (Equivalent!)' },
        highlightNote: 'States q1 and q2 transition to identical states on both 0 and 1! They cannot be distinguished.'
      },
      {
        index: 4,
        actionTitle: 'Step 3: Construct Minimal DFA',
        description: 'Merge unmarked pairs: {q1, q2} becomes single compound state [q1q2]. States count drops from 5 to 4.',
        internalState: { originalStates: 5, minimalStates: 4, states: '[q0], [q1q2], [q3], [q4]' },
        highlightNote: 'Resulting 4-state DFA is provably minimal and unique.'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'You have two states, p and q. On input "0", both transition to final state F. On input "1", p goes to final state F, but q goes to dead state D (non-final). Are p and q equivalent?',
    contextState: 'δ(p, 0) = F | δ(q, 0) = F | δ(p, 1) = F | δ(q, 1) = D',
    options: [
      {
        id: 'pred-1',
        text: 'Yes, because on input "0" they behave identically.',
        isCorrect: false,
        explanation: 'Incorrect. Equivalence requires identical acceptance behavior on ALL possible input strings, not just one.'
      },
      {
        id: 'pred-2',
        text: 'No, they are distinguishable by string "1" (1-distinguishable).',
        isCorrect: true,
        explanation: 'Correct! The single-symbol string "1" distinguishes them: δ̂(p, 1) ∈ F (accepts), whereas δ̂(q, 1) ∉ F (rejects). Therefore, p ≢ q.'
      },
      {
        id: 'pred-3',
        text: 'They can be merged if we invert the accepting states.',
        isCorrect: false,
        explanation: 'False. Inverting accepting states complements the language but does not make these two states behave identically.'
      }
    ]
  },
  codePlayground: {
    language: 'python',
    starterCode: `# DFA Simulator: Test if string is accepted
# DFA accepts strings ending with '01' over {0, 1}

def dfa_simulate(input_str):
    # States: q0 (start), q1 (saw 0), q2 (accept, saw 01)
    # Transitions: delta[state][char] -> next_state
    transitions = {
        'q0': {'0': 'q1', '1': 'q0'},
        'q1': {'0': 'q1', '1': 'q2'},
        'q2': {'0': 'q1', '1': 'q0'}
    }
    current_state = 'q0'
    accepting_states = {'q2'}
    
    trace = [current_state]
    for char in input_str:
        current_state = transitions[current_state][char]
        trace.append(f"--({char})--> {current_state}")
        
    is_accepted = current_state in accepting_states
    return is_accepted, trace

test_str = "1001"
accepted, log = dfa_simulate(test_str)
print(f"String '{test_str}' Accepted? {accepted}")
print("Trace:", " ".join(log))
`,
    solutionCode: `def dfa_simulate(input_str):
    transitions = {
        'q0': {'0': 'q1', '1': 'q0'},
        'q1': {'0': 'q1', '1': 'q2'},
        'q2': {'0': 'q1', '1': 'q0'}
    }
    current_state = 'q0'
    for char in input_str:
        current_state = transitions[current_state][char]
    return current_state in {'q2'}`,
    description: 'Execute state transitions step-by-step over the alphabet {0, 1}.',
    expectedBehavior: 'String ending with 01 terminates in accept state q2.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'You can merge a final state and a non-final state if they have the same transitions.',
      whyWrong: 'A final state accepts the empty string ε, while a non-final state rejects ε. They are immediately 0-distinguishable by ε!',
      truth: 'A final state and a non-final state can NEVER be merged under any circumstance.',
      consequenceInCodeOrExam: 'Exam evaluators instantly award 0 marks if final and non-final states appear in the same partition.'
    },
    {
      wrongBelief: 'NFA can also be minimized using the exact same table-filling algorithm directly.',
      whyWrong: 'NFA states have non-deterministic branching and subset relations. The Myhill-Nerode theorem applies directly only to DFAs.',
      truth: 'To minimize an NFA, you must first convert it to a DFA using subset construction, then minimize that DFA.',
      consequenceInCodeOrExam: 'Common KTU 5-mark question trick: asking to minimize an NFA without converting first.'
    }
  ],
  comparison: {
    conceptA: 'Deterministic Finite Automaton (DFA)',
    conceptB: 'Nondeterministic Finite Automaton (NFA)',
    dimensions: [
      {
        metric: 'Transition Output',
        valA: 'Exactly 1 state: δ(q, a) ∈ Q',
        valB: 'Set of states: δ(q, a) ⊆ 2^Q (can include empty set)',
        takeaway: 'DFA is predictable and directly implementable in hardware.'
      },
      {
        metric: 'Epsilon (ε) Transitions',
        valA: 'Strictly NOT allowed',
        valB: 'Allowed (spontaneous jumps without input)',
        takeaway: 'ε-NFA is easiest for human regular expression construction.'
      },
      {
        metric: 'Hardware Execution Speed',
        valA: 'O(1) time per character (instant)',
        valB: 'Requires tracking state sets or backtracking',
        takeaway: 'Compilers always convert NFAs to minimized DFAs for fast lexing.'
      },
      {
        metric: 'Expressive Power',
        valA: 'Recognizes exactly Regular Languages',
        valB: 'Recognizes exactly Regular Languages (Identical power)',
        takeaway: 'Both models accept the exact same family of languages.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 301 (Theory of Computation)',
    examDefinition: 'DFA Minimization is the transformation of a given DFA into an equivalent DFA having the minimum number of states, achieved by identifying and collapsing indistinguishable state equivalence classes using the Myhill-Nerode theorem or partition refinement.',
    frequentYearQuestions: [
      'KTU Dec 2022: Minimize the given DFA using Table Filling Algorithm. (10 Marks)',
      'KTU May 2023: State Myhill-Nerode theorem. When are two states called k-distinguishable? (5 Marks)',
      'KTU July 2024: Define DFA formally. Show why an unreachable state must be removed before minimization. (3 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'Define equivalent states in a DFA.',
        modelAnswer: 'Two states p and q in a DFA M are equivalent (p ≡ q) if for all input strings w ∈ Σ*, the extended transition function yields δ̂(p, w) ∈ F if and only if δ̂(q, w) ∈ F. That is, no string w can distinguish them.',
        keyPointsExpected: ['Formal condition for all w in Sigma*', 'Both in F or both not in F'],
        commonDeductions: ['Stating only single character transitions instead of all strings w (-1 mark)']
      },
      {
        marks: 5,
        question: 'Explain the Table Filling (Moore’s) algorithm for DFA minimization.',
        modelAnswer: '1. Step 1: Remove all unreachable states from start state q0.\n2. Step 2: Draw a lower triangular table for all pairs (p, q) with p ≠ q.\n3. Step 3: Mark an X for all pairs where p ∈ F and q ∉ F (0-distinguishable by ε).\n4. Step 4: Iteratively check each unmarked pair (p, q). If for some symbol a ∈ Σ, the pair (δ(p, a), δ(q, a)) is already marked, mark (p, q). Repeat until no new marks are made.\n5. Step 5: Merge all remaining unmarked pairs into compound states.',
        keyPointsExpected: ['Reachability step mentioned', 'Initialization of F vs non-F', 'Iterative propagation formula', 'Termination condition'],
        commonDeductions: ['Omitting Step 0 reachability removal (-1 mark)', 'Marking pairs without showing transition check steps (-1 mark)'],
        diagramDescription: 'Lower triangular matrix with marked X cells and unmarked equivalent pairs circled.'
      },
      {
        marks: 10,
        question: 'Given a 6-state DFA with transition table, perform complete minimization using Table Filling algorithm and draw the final state diagram.',
        modelAnswer: 'Structured 10-Mark Answer:\n1. State table representation and verification of reachability (2 marks)\n2. Initial table setup: Mark pairs with one final state (2 marks)\n3. Iteration 1 & Iteration 2 step-by-step checks showing transition outputs for each symbol (3 marks)\n4. Identification of equivalence classes (e.g. {q1, q2} and {q3, q5}) (1.5 marks)\n5. Final transition table and clean state diagram of minimized DFA (1.5 marks)',
        keyPointsExpected: ['Clear arithmetic traces for checked pairs', 'Correct final transition table', 'Neat state transition diagram with double circles for final states'],
        commonDeductions: ['Failing to show work for why a cell was marked (-2 marks)', 'Wrong final state transition (-2 marks)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'dfa-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: 'Which string of length 0 distinguishes any accepting state from any non-accepting state?',
      options: [
        { id: '1a', text: 'The null symbol ∅', isCorrect: false },
        { id: '1b', text: 'The empty string ε', isCorrect: true },
        { id: '1c', text: 'The string "0"', isCorrect: false },
        { id: '1d', text: 'The string "1"', isCorrect: false }
      ],
      correctExplanation: 'The empty string ε has length 0. When processed, δ̂(q, ε) = q. If p ∈ F, it accepts; if q ∉ F, it rejects. Thus ε distinguishes them immediately.'
    },
    {
      id: 'dfa-p2',
      level: 4,
      levelLabel: 'Level 4: Problem Solving',
      question: 'If a DFA has 8 states and we partition it into 5 equivalence classes after minimization, how many states does the minimized DFA contain?',
      options: [
        { id: '4a', text: '3 states', isCorrect: false },
        { id: '4b', text: '5 states', isCorrect: true },
        { id: '4c', text: '8 states', isCorrect: false },
        { id: '4d', text: 'Cannot be determined without transitions', isCorrect: false }
      ],
      correctExplanation: 'Each equivalence class of indistinguishable states merges into exactly ONE state in the minimal DFA. Therefore, 5 equivalence classes = 5 states.'
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-dfa-1',
      question: 'What is the very first step you must perform before drawing the table in DFA minimization?',
      expectedKeywords: ['remove', 'unreachable', 'prune', 'start state', 'q0'],
      idealAnswer: 'Eliminate all unreachable states that cannot be reached from the start state q0.'
    },
    {
      id: 'rec-dfa-2',
      question: 'Why can an accepting state NEVER be in the same equivalence class as a non-accepting state?',
      expectedKeywords: ['epsilon', 'empty string', 'distinguishable', 'accepts', 'rejects'],
      idealAnswer: 'Because on the empty string ε, the accepting state accepts while the non-accepting state rejects, making them immediately distinguishable.'
    }
  ],
  masteryCriteria: [
    'Can formally define DFA 5-tuple M = (Q, Σ, δ, q₀, F)',
    'Identifies and removes unreachable states from transition graphs',
    'Fills triangular table without missing transitive marks',
    'Derives the unique canonical minimum state transition diagram',
    'Explains connection to lexical analyzer token generation in compilers'
  ]
};
