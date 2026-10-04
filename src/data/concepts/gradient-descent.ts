import { ConceptDetail } from '../../types/curriculum';

export const gradientDescentConcept: ConceptDetail = {
  id: 'gradient-descent',
  title: 'Gradient Descent & Parameter Optimization',
  subjectId: 'cst-305-ml',
  subjectTitle: 'Machine Learning Foundations',
  moduleId: 'mod-2-linear',
  moduleTitle: 'Module 2: Linear Models & Convex Optimization',
  difficulty: 'intermediate',
  category: 'mathematical',
  estimatedMinutes: 25,
  examImportance: 'critical_ktu',
  prerequisites: [
    { id: 'math-derivatives', title: 'Multivariate Derivatives', reason: 'Needed to understand partial derivatives ∂J/∂θ representing steepness' },
    { id: 'cost-function', title: 'Mean Squared Error Cost Function', reason: 'Defines the error landscape we are navigating down' }
  ],
  unlocks: [
    { id: 'backprop', title: 'Backpropagation in Neural Networks' },
    { id: 'adam-opt', title: 'Adaptive Optimizers (Adam, RMSprop)' }
  ],
  idea: {
    simpleExplanation: 'Imagine being blindfolded on a foggy mountainside. You cannot see the valley at the bottom. But with your feet, you can feel which direction slopes downward. If you take small steps in that downhill direction repeatedly, you will eventually reach the lowest point of the valley. Gradient descent is simply this downhill walking algorithm done mathematically.',
    intuitionSummary: 'Compute the slope of the error curve at your current position, and take a step in the exact opposite direction to reduce the error.',
    analogy: {
      title: 'The Blindfolded Hiker in the Mist',
      story: 'A hiker is trapped in deep fog on a hillside. Their goal is to find the camp located at the lowest basin. At every second, they feel the angle of the ground beneath their boots. If the ground slopes upwards to the North, they step South. They keep taking steps until the ground feels completely flat beneath their feet.',
      moral: 'Zero slope means you have arrived at the valley floor (minimum error).'
    }
  },
  whyItExists: {
    historicalProblem: 'In machine learning, we need to find model weights θ that minimize prediction error J(θ). For simple linear equations, you can solve for zero derivative directly with calculus (Normal Equation: θ = (XᵀX)⁻¹Xᵀy). But when you have millions of parameters or complex nonlinear models, inverting huge matrices requires O(N³) computation and crashes computer memory.',
    naiveApproachFailed: 'Randomly guessing parameters or testing every possible combination (grid search) takes trillions of years for even moderate dimensional models.',
    coreInsight: 'Instead of finding the minimum in one giant impossible equation or guessing blindly, start anywhere and use calculus to point you toward the steepest downward slope step-by-step.'
  },
  formulaExplorer: {
    title: 'The Parameter Update Equation',
    tex: '\\theta_{j} := \\theta_{j} - \\alpha \\frac{\\partial}{\\partial \\theta_{j}} J(\\theta)',
    plain: 'theta_next = theta_current - (learning_rate * slope)',
    explanation: 'At each iteration, we update weight theta by subtracting a fraction (alpha) of the partial derivative of the cost function.',
    variables: [
      {
        symbol: '\\theta_j',
        name: 'Model Parameter (Weight)',
        meaning: 'The adjustable knob in our machine learning model that controls predictions.',
        effectWhenIncreased: 'Shifts the model hypothesis line.'
      },
      {
        symbol: ':=',
        name: 'Assignment Operator',
        meaning: 'Denotes simultaneous computer overwrite of the variable at step t+1.',
        effectWhenIncreased: 'Forces atomic synchronized updates.'
      },
      {
        symbol: '\\alpha',
        name: 'Learning Rate (Step Size)',
        meaning: 'A hyperparameter controlling how big of a stride the algorithm takes down the slope.',
        unit: 'scalar (e.g. 0.01 - 0.1)',
        effectWhenIncreased: 'Takes larger steps. If too large, steps overshoot the minimum and explode to infinity!'
      },
      {
        symbol: '\\frac{\\partial}{\\partial \\theta_j} J(\\theta)',
        name: 'Partial Derivative (Gradient)',
        meaning: 'The slope of the cost function with respect to parameter theta_j.',
        unit: 'rate of change',
        effectWhenIncreased: 'Steeper slope causes larger corrective steps.'
      }
    ]
  },
  breakIt: {
    scenarioTitle: 'The Catastrophic Divergence Trap (Exploding Gradient)',
    brokenCondition: 'Set learning rate alpha >= 1.25 on a convex quadratic surface.',
    symptom: 'Instead of descending into the minimum, the step overshoots the opposite rim so violently that the error J(θ) doubles, then quadruples, quickly hitting NaN or +Infinity.',
    whyItFailed: 'The gradient vector points in the right direction, but the step size alpha was larger than the diameter of the valley itself! It leapfrogged across the valley floor and landed higher up on the opposite cliff.',
    preventionRule: 'Always start with conservative learning rates (e.g. 0.01, 0.001) or use learning rate decay and gradient clipping.'
  },
  underTheHood: {
    formalDefinition: 'An iterative first-order optimization algorithm for finding a local minimum of a differentiable objective function J: Rⁿ → R.',
    keyProperties: [
      'Guaranteed to converge to global minimum on strictly convex functions with appropriate learning rate.',
      'Batch Gradient Descent uses all m training samples per step (O(m·n) per step).',
      'Stochastic Gradient Descent (SGD) uses 1 sample per step (fast, noisy trajectory).',
      'Mini-batch SGD strikes the optimal balance between vector parallelization and convergence stability.'
    ],
    timeComplexity: 'O(k · m · n) where k is epochs, m is dataset size, n is feature count',
    spaceComplexity: 'O(n) memory to store gradient vectors',
    invariants: [
      'When slope = 0 (at local minimum), gradient = 0, update becomes theta := theta - 0, so the algorithm stops naturally.'
    ]
  },
  stepThroughGuide: {
    steps: [
      {
        index: 1,
        actionTitle: 'Random Initialization',
        description: 'Initialize weight theta to a starting position far from optimum (e.g., theta = 8.0).',
        internalState: { step: 1, theta: '8.00', cost_J: '64.00', gradient: '+16.00', nextAction: 'Evaluate slope' },
        highlightNote: 'Slope is strongly positive (+16). Moving right increases error; moving left decreases error.'
      },
      {
        index: 2,
        actionTitle: 'First Gradient Step',
        description: 'Apply theta := 8.0 - (0.1 * 16.0) = 8.0 - 1.6 = 6.4.',
        internalState: { step: 2, theta: '6.40', cost_J: '40.96', gradient: '+12.80', nextAction: 'Calculate updated loss' },
        highlightNote: 'Error dropped from 64.00 down to 40.96. The hiker took a substantial step downhill.'
      },
      {
        index: 3,
        actionTitle: 'Midway Flattening',
        description: 'As we approach the bottom, the slope naturally gets gentler (gradient drops to +3.28).',
        internalState: { step: 6, theta: '1.64', cost_J: '2.68', gradient: '+3.28', nextAction: 'Self-decelerating steps' },
        highlightNote: 'Notice how the step size naturally shrinks even with a constant alpha! The slope itself acts as a natural brake.'
      },
      {
        index: 4,
        actionTitle: 'Convergence at Zero Derivative',
        description: 'Theta reaches 0.05, cost J ≈ 0.002. Gradient is nearly zero.',
        internalState: { step: 15, theta: '0.05', cost_J: '0.002', gradient: '+0.10', nextAction: 'Stop criterion reached' },
        highlightNote: 'Delta update is smaller than threshold ε (1e-4). Algorithm terminates successfully.'
      }
    ]
  },
  predictionChallenge: {
    prompt: 'Look at the current state: Theta = -4.0, Gradient = -8.0, and Learning Rate alpha = 0.1. What will be the value of Theta after one gradient descent step?',
    contextState: 'Current Theta: -4.0 | Gradient ∂J/∂θ: -8.0 | Alpha: 0.1',
    options: [
      {
        id: 'opt-a',
        text: 'Theta becomes -4.8 (moves further left)',
        isCorrect: false,
        explanation: 'Incorrect. Remember the formula has a minus sign: theta - (alpha * grad). Subtracting a negative number adds to theta!'
      },
      {
        id: 'opt-b',
        text: 'Theta becomes -3.2 (moves right toward zero)',
        isCorrect: true,
        explanation: 'Exact! theta := -4.0 - (0.1 * -8.0) = -4.0 - (-0.8) = -3.2. Because the slope is negative, moving right (increasing theta) reduces loss!'
      },
      {
        id: 'opt-c',
        text: 'Theta remains -4.0 because negative gradients are ignored',
        isCorrect: false,
        explanation: 'Incorrect. Negative gradients are crucial; they tell us the slope declines to the right.'
      }
    ]
  },
  codePlayground: {
    language: 'python',
    starterCode: `# Interactive Gradient Descent Simulator
# Task: Complete the parameter update rule inside the loop

def gradient_descent(x_start=8.0, alpha=0.1, epochs=10):
    theta = x_start
    history = []
    
    for epoch in range(epochs):
        # Loss function: J(theta) = theta^2
        loss = theta ** 2
        
        # Derivative: dJ/dtheta = 2 * theta
        grad = 2.0 * theta
        
        history.append((epoch, round(theta, 3), round(loss, 3)))
        
        # TODO: Implement the update step below!
        # theta = theta - ...
        theta = theta - (alpha * grad)
        
    return history

results = gradient_descent(x_start=6.0, alpha=0.15, epochs=6)
for r in results:
    print(f"Epoch {r[0]}: Theta={r[1]} | Loss={r[2]}")
`,
    solutionCode: `def gradient_descent(x_start=8.0, alpha=0.1, epochs=10):
    theta = x_start
    history = []
    for epoch in range(epochs):
        loss = theta ** 2
        grad = 2.0 * theta
        history.append((epoch, round(theta, 3), round(loss, 3)))
        theta = theta - (alpha * grad)
    return history`,
    description: 'Run the simulated Python engine to observe how parameters adjust across iterations.',
    expectedBehavior: 'Loss should decrease progressively with each epoch toward zero.'
  },
  commonMisconceptions: [
    {
      wrongBelief: 'Gradient descent always moves directly toward the global minimum.',
      whyWrong: 'In non-convex functions (like deep neural networks), gradient descent only follows the local slope. It can easily get stuck in local minima or saddle points where gradient is zero.',
      truth: 'Gradient descent guarantees finding the global minimum ONLY on convex surfaces. For non-convex surfaces, it finds stationary points.',
      consequenceInCodeOrExam: 'In KTU exams, writing that GD always finds the global optimum loses 2-3 marks on theoretical analysis.'
    },
    {
      wrongBelief: 'You must decrease alpha manually at every step to prevent overshooting.',
      whyWrong: 'As theta approaches the minimum, the slope (derivative) automatically shrinks toward 0. Thus the product alpha * derivative shrinks automatically even with constant alpha.',
      truth: 'Step size automatically decelerates near the minimum because gradient diminishes.',
      consequenceInCodeOrExam: 'Students mistakenly implement complex decay schedules when fixed alpha already converges smoothly on convex problems.'
    }
  ],
  comparison: {
    conceptA: 'Batch Gradient Descent',
    conceptB: 'Stochastic Gradient Descent (SGD)',
    dimensions: [
      {
        metric: 'Data used per step',
        valA: 'Entire dataset of m samples',
        valB: 'Exactly 1 random sample',
        takeaway: 'Batch is deterministic; SGD is noisy.'
      },
      {
        metric: 'Computational Cost per step',
        valA: 'O(m · n) - Slow on big data',
        valB: 'O(n) - Ultra fast updates',
        takeaway: 'SGD makes progress immediately without reading gigabytes of data.'
      },
      {
        metric: 'Loss Curve Trajectory',
        valA: 'Monotonically smooth descent',
        valB: 'Fluctuating / zigzag oscillation',
        takeaway: 'SGD noise actually helps escape shallow local minima!'
      },
      {
        metric: 'Vectorization efficiency',
        valA: 'High (BLAS matrix ops)',
        valB: 'Low (cannot utilize GPU batching)',
        takeaway: 'Mini-batch SGD combines benefits of both.'
      }
    ]
  },
  examMode: {
    ktuSubjectCode: 'CST 305 / PEC (Machine Learning)',
    examDefinition: 'Gradient Descent is a first-order iterative optimization algorithm used to minimize a differentiable cost function J(θ) by iteratively updating parameter values in the direction opposite to the gradient vector of the function at the current point.',
    frequentYearQuestions: [
      'KTU Dec 2023: Explain the working of Batch Gradient Descent with suitable mathematical formulation. (5 Marks)',
      'KTU July 2024: Differentiate Batch, Stochastic and Mini-Batch Gradient Descent. Explain learning rate sensitivity. (10 Marks)'
    ],
    answers: [
      {
        marks: 2,
        question: 'What is Gradient Descent and what role does the learning rate play?',
        modelAnswer: 'Gradient Descent is an optimization algorithm that minimizes an objective function J(θ) by updating parameters iteratively: θ := θ - α∇J(θ). The learning rate α determines the step size taken in the direction of the negative gradient; if too small, convergence is slow; if too large, it diverges.',
        keyPointsExpected: ['Correct update equation with minus sign', 'Definition of alpha as step size', 'Divergence vs slow convergence consequence'],
        commonDeductions: ['Missing the minus sign in update equation (-1 mark)', 'Failing to state what happens when alpha is too large (-0.5 mark)']
      },
      {
        marks: 5,
        question: 'Derive the Batch Gradient Descent update rule for Linear Regression with Mean Squared Error cost function.',
        modelAnswer: '1. Hypothesis: h_θ(x) = θ₀ + θ₁x\n2. Cost Function: J(θ) = (1/2m) ∑_{i=1}^m (h_θ(x^(i)) - y^(i))²\n3. Partial derivative with respect to θ_j:\n   ∂J/∂θ_j = (1/m) ∑_{i=1}^m (h_θ(x^(i)) - y^(i)) · x_j^(i)\n4. Update Rule:\n   θ_j := θ_j - α · (1/m) ∑_{i=1}^m (h_θ(x^(i)) - y^(i)) · x_j^(i) (simultaneously for all j)\n5. Diagram: Draw convex bowl / parabola with contour steps converging to center.',
        keyPointsExpected: ['Factor of 1/2m cancellation during differentiation', 'Correct chain rule differentiation', 'Simultaneous update specification', 'Labeled diagram of 2D convex contour'],
        commonDeductions: ['Forgetting the (1/m) scalar factor (-1 mark)', 'Omission of simultaneous update condition (-1 mark)'],
        diagramDescription: 'Convex parabola with tangent vectors pointing downhill toward minimum (θ*, J*).'
      },
      {
        marks: 10,
        question: 'Detailed Essay: Compare Batch GD, SGD, and Mini-batch GD. Discuss challenges including learning rate tuning, saddle points, and local minima.',
        modelAnswer: 'Structured 10-Mark Answer Structure:\n1. Introduction & Formal Definition of Gradient Descent (1.5 marks)\n2. Comparative Matrix (Batch vs SGD vs Mini-batch across data size, memory, speed, convergence) (3 marks)\n3. Mathematical formulation for all three variants (2 marks)\n4. Key Challenges:\n   a. Choice of learning rate α (Overshooting vs Stagnation)\n   b. Saddle points and plateaus where ∇J ≈ 0\n   c. Ill-conditioned ravines\n5. Advanced Remedies (Momentum, AdaGrad, RMSprop, Adam) (2 marks)\n6. Labeled visual trajectories for each algorithm (1.5 marks)',
        keyPointsExpected: ['Equations for all 3 variants', 'Clear trade-off explanation', 'Saddle point vs local minima distinction', 'Diagram showing smooth path vs oscillation'],
        commonDeductions: ['Treating SGD as having no noise (-1 mark)', 'No mention of Mini-Batch batch sizes (32, 64, 128) (-1 mark)']
      }
    ]
  },
  practiceProblems: [
    {
      id: 'gd-p1',
      level: 1,
      levelLabel: 'Level 1: Recognition',
      question: 'Which of the following mathematical operators determines the direction of steepest ascent of a multivariable function?',
      options: [
        { id: '1a', text: 'The Hessian matrix determinant', isCorrect: false },
        { id: '1b', text: 'The Gradient vector (∇J)', isCorrect: true },
        { id: '1c', text: 'The Laplacian operator (∇²J)', isCorrect: false },
        { id: '1d', text: 'The Jacobian determinant', isCorrect: false }
      ],
      correctExplanation: 'The gradient vector ∇J contains the first-order partial derivatives and always points in the direction of greatest rate of increase (steepest ascent). Hence -∇J points in the direction of steepest descent.'
    },
    {
      id: 'gd-p2',
      level: 2,
      levelLabel: 'Level 2: Understanding',
      question: 'Why does gradient descent naturally take smaller steps as it approaches the minimum, even if the learning rate α is held constant?',
      options: [
        { id: '2a', text: 'Because computer floating point precision degrades near zero', isCorrect: false },
        { id: '2b', text: 'Because the magnitude of the gradient (slope) approaches zero at the minimum', isCorrect: true },
        { id: '2c', text: 'Because modern compilers automatically halve alpha every epoch', isCorrect: false }
      ],
      correctExplanation: 'The step size is α · (∂J/∂θ). As θ nears the optimum, the tangent flattens, making ∂J/∂θ → 0. Therefore, the total step size shrinks automatically!'
    },
    {
      id: 'gd-p3',
      level: 5,
      levelLabel: 'Level 5: Numerical Calculation (KTU Standard)',
      question: 'Given cost function J(θ) = θ² - 4θ + 4. Current θ = 5.0. Learning rate α = 0.2. What is the updated value of θ after one iteration?',
      options: [
        { id: '5a', text: 'θ = 4.0', isCorrect: false },
        { id: '5b', text: 'θ = 3.8', isCorrect: true },
        { id: '5c', text: 'θ = 3.2', isCorrect: false },
        { id: '5d', text: 'θ = 2.0', isCorrect: false }
      ],
      correctExplanation: 'Derivative dJ/dθ = 2θ - 4. At θ = 5.0: dJ/dθ = 2(5) - 4 = 6.0. Update: θ_new = 5.0 - (0.2 * 6.0) = 5.0 - 1.2 = 3.8.'
    }
  ],
  activeRecallPrompts: [
    {
      id: 'rec-1',
      question: 'Write from memory the exact parameter update equation for gradient descent with respect to weight θ_j.',
      expectedKeywords: ['theta', 'alpha', 'minus', 'partial derivative', 'cost function'],
      idealAnswer: 'θ_j := θ_j - α · (∂J / ∂θ_j)'
    },
    {
      id: 'rec-2',
      question: 'What catastrophic behavior happens if the learning rate α is chosen excessively large?',
      expectedKeywords: ['overshoot', 'diverge', 'explode', 'infinite', 'oscillate'],
      idealAnswer: 'The algorithm overshoots the minimum, landing higher up on opposite walls, causing the cost function to diverge toward infinity.'
    },
    {
      id: 'rec-3',
      question: 'Why does Stochastic Gradient Descent oscillate more than Batch Gradient Descent?',
      expectedKeywords: ['single sample', 'noise', 'approximation', 'variance'],
      idealAnswer: 'Because each step is calculated from a single training sample rather than the true average of the whole dataset, introducing stochastic variance in direction.'
    }
  ],
  masteryCriteria: [
    'Can explain why normal equation fails on massive parameter spaces',
    'Understands mathematical role of the minus sign in -α∇J',
    'Has visualized and prevented the exploding gradient divergence trap',
    'Can perform manual single-step numerical update on paper',
    'Can write the full KTU 5-mark linear regression derivation',
    'Can distinguish Batch, SGD, and Mini-batch trade-offs'
  ]
};
