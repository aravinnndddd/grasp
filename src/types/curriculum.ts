export type MasteryState = 
  | 'UNKNOWN' 
  | 'INTRODUCED' 
  | 'UNDERSTOOD' 
  | 'PRACTICED' 
  | 'APPLIED' 
  | 'MASTERED' 
  | 'NEEDS_REVISION';

export type ConceptDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExamImportance = 'standard' | 'high' | 'critical_ktu';

export type ConceptCategory = 
  | 'mathematical'
  | 'algorithm'
  | 'data_structure'
  | 'system_architecture'
  | 'theoretical'
  | 'database'
  | 'networking';

export interface ConceptVariable {
  symbol: string;
  name: string;
  meaning: string;
  unit?: string;
  effectWhenIncreased: string;
}

export interface FormulaData {
  title: string;
  tex: string;
  plain: string;
  explanation: string;
  variables: ConceptVariable[];
}

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ExamAnswerItem {
  marks: 2 | 5 | 10;
  question: string;
  modelAnswer: string;
  keyPointsExpected: string[];
  commonDeductions: string[];
  diagramDescription?: string;
}

export interface PracticeProblem {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  levelLabel: string; // e.g. "Level 1: Recognition" or "Level 6: KTU University Exam"
  question: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  correctExplanation: string;
  starterCode?: string;
  expectedOutput?: string;
}

export interface ActiveRecallPrompt {
  id: string;
  question: string;
  expectedKeywords: string[];
  idealAnswer: string;
}

export interface ConceptDetail {
  id: string;
  title: string;
  subjectId: string;
  subjectTitle: string;
  moduleId: string;
  moduleTitle: string;
  difficulty: ConceptDifficulty;
  category: ConceptCategory;
  estimatedMinutes: number;
  examImportance: ExamImportance;
  prerequisites: { id: string; title: string; reason: string }[];
  unlocks: { id: string; title: string }[];

  // 17-part learning framework data
  idea: {
    simpleExplanation: string;
    intuitionSummary: string;
    analogy?: { title: string; story: string; moral: string };
  };
  whyItExists: {
    historicalProblem: string;
    naiveApproachFailed: string;
    coreInsight: string;
  };
  formulaExplorer?: FormulaData;
  breakIt: {
    scenarioTitle: string;
    brokenCondition: string;
    symptom: string;
    whyItFailed: string;
    preventionRule: string;
  };
  underTheHood: {
    formalDefinition: string;
    keyProperties: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    invariants?: string[];
  };
  stepThroughGuide: {
    steps: {
      index: number;
      actionTitle: string;
      description: string;
      internalState: Record<string, string | number>;
      highlightNote: string;
    }[];
  };
  predictionChallenge: {
    prompt: string;
    contextState: string;
    options: PredictionOption[];
  };
  codePlayground?: {
    language: 'python' | 'c' | 'sql' | 'javascript';
    starterCode: string;
    solutionCode: string;
    description: string;
    expectedBehavior: string;
  };
  commonMisconceptions: {
    wrongBelief: string;
    whyWrong: string;
    truth: string;
    consequenceInCodeOrExam: string;
  }[];
  comparison?: {
    conceptA: string;
    conceptB: string;
    dimensions: { metric: string; valA: string; valB: string; takeaway: string }[];
  };
  examMode: {
    ktuSubjectCode: string;
    examDefinition: string;
    answers: ExamAnswerItem[];
    frequentYearQuestions: string[];
  };
  practiceProblems: PracticeProblem[];
  activeRecallPrompts: ActiveRecallPrompt[];
  masteryCriteria: string[];
}

export interface Topic {
  id: string;
  title: string;
  concepts: ConceptDetail[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  hours: number;
  weightagePercent: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  credits: number;
  scheme: string;
  semester: string;
  description: string;
  modules: Module[];
}

export interface CurriculumHierarchy {
  university: string;
  universityFull: string;
  regulationScheme: string;
  programme: string;
  branch: string;
  branchFull: string;
  semester: string;
  academicYear: string;
  subjects: Subject[];
}
