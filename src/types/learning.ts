import { MasteryState } from './curriculum';

export interface MasteryScoreProfile {
  understanding: number; // 0 - 100
  application: number;   // 0 - 100
  recall: number;        // 0 - 100
  exam: number;          // 0 - 100
  overall: number;       // 0 - 100
}

export interface StudentConceptProgress {
  conceptId: string;
  state: MasteryState;
  score: MasteryScoreProfile;
  attemptsCount: number;
  timeSpentSeconds: number;
  lastStudiedAt: string;
  completedRubrics: string[];
  ownExplanationSubmission?: {
    text: string;
    score: number;
    feedback: string;
    missingKeywords: string[];
  };
}

export interface StudentProfile {
  name: string;
  university: string;
  scheme: string;
  branch: string;
  semester: string;
  streakDays: number;
  currentSubjectId: string;
  currentModuleId: string;
  currentConceptId: string;
  totalTimeMinutes: number;
  progressMap: Record<string, StudentConceptProgress>;
}

export interface JevDiagnostic {
  conceptId: string;
  weakPrerequisiteId?: string;
  weakPrerequisiteTitle?: string;
  detectedMisconception?: string;
  suggestedAction: string;
  timeEstimateMinutes: number;
  confidence: number;
}

export interface SocraticPromptOption {
  label: string;
  queryType: 
    | 'explain_simpler'
    | 'give_analogy'
    | 'show_mathematically'
    | 'explain_for_exam'
    | 'show_failure'
    | 'test_me';
}
