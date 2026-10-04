import { ConceptDetail } from '../../types/curriculum';
import { JevDiagnostic, MasteryScoreProfile, StudentConceptProgress } from '../../types/learning';
import { conceptMap } from '../../data/ktu-s5-cse';

export class JevDecisionEngine {
  /**
   * Evaluates student's learning attempts and diagnoses potential prerequisite gaps.
   */
  static diagnoseGap(
    concept: ConceptDetail,
    practiceAccuracy: number,
    breakItUnderstood: boolean,
    failedQuestions: string[]
  ): JevDiagnostic {
    if (concept.id === 'gradient-descent') {
      if (practiceAccuracy < 50) {
        return {
          conceptId: concept.id,
          weakPrerequisiteId: 'math-derivatives',
          weakPrerequisiteTitle: 'Multivariate Partial Derivatives',
          detectedMisconception: 'Struggling with negative gradient direction and slope magnitude',
          suggestedAction: 'Review how partial derivatives ∂J/∂θ dictate directional steepness for 8 minutes before re-attempting practice problems.',
          timeEstimateMinutes: 8,
          confidence: 0.88
        };
      }
      if (!breakItUnderstood) {
        return {
          conceptId: concept.id,
          weakPrerequisiteId: 'cost-function',
          weakPrerequisiteTitle: 'Cost Function Geometry',
          detectedMisconception: 'Unclear why large learning rates cause explosive divergence',
          suggestedAction: 'Experiment with the Failure Mode slider in Section 05: Break It to see how overshooting creates runaway error.',
          timeEstimateMinutes: 4,
          confidence: 0.92
        };
      }
    }

    if (concept.id === 'dfa-minimization') {
      if (practiceAccuracy < 60) {
        return {
          conceptId: concept.id,
          weakPrerequisiteId: 'dfa-definition',
          weakPrerequisiteTitle: 'DFA 5-Tuple & String Acceptance',
          detectedMisconception: 'Attempting to merge accepting and non-accepting states',
          suggestedAction: 'Re-examine 0-distinguishability: any final state accepts the empty string ε, whereas non-final rejects it.',
          timeEstimateMinutes: 5,
          confidence: 0.94
        };
      }
    }

    if (concept.id === 'tcp-congestion-control') {
      if (practiceAccuracy < 60) {
        return {
          conceptId: concept.id,
          weakPrerequisiteId: 'tcp-handshake',
          weakPrerequisiteTitle: 'Flow Window (rwnd) vs Congestion Window (cwnd)',
          detectedMisconception: 'Confusing buffer overrun at receiver with network queue drops at routers',
          suggestedAction: 'Review the comparison table in Section 12: Compare (Flow Control vs Congestion Control).',
          timeEstimateMinutes: 6,
          confidence: 0.89
        };
      }
    }

    return {
      conceptId: concept.id,
      suggestedAction: 'Concept fundamentals are solid. Proceed to Section 14: KTU Exam Mode for 10-mark essay preparation.',
      timeEstimateMinutes: 10,
      confidence: 0.95
    };
  }

  /**
   * Computes multi-dimensional mastery across 4 pillars: Understanding, Application, Recall, Exam.
   */
  static evaluateMastery(
    progress: Partial<StudentConceptProgress>,
    totalPracticeCount: number,
    correctPracticeCount: number,
    recallAccuracy: number,
    examReviewed: boolean
  ): { score: MasteryScoreProfile; newState: StudentConceptProgress['state'] } {
    const understanding = Math.min(100, Math.round(
      (progress.completedRubrics?.length || 0) * 14 + (progress.ownExplanationSubmission ? 30 : 0)
    ));

    const application = totalPracticeCount > 0 
      ? Math.round((correctPracticeCount / totalPracticeCount) * 100)
      : 0;

    const recall = Math.round(recallAccuracy);
    const exam = examReviewed ? 85 : 30;

    const overall = Math.round(
      understanding * 0.35 +
      application * 0.25 +
      recall * 0.20 +
      exam * 0.20
    );

    let newState: StudentConceptProgress['state'] = 'INTRODUCED';
    if (overall >= 80 && understanding >= 75 && application >= 70 && recall >= 75) {
      newState = 'MASTERED';
    } else if (overall >= 60) {
      newState = 'APPLIED';
    } else if (understanding >= 60) {
      newState = 'UNDERSTOOD';
    }

    return {
      score: {
        understanding,
        application,
        recall,
        exam,
        overall
      },
      newState
    };
  }

  /**
   * Evaluates Feynman "Explain in your own words" student submission.
   */
  static gradeOwnExplanation(concept: ConceptDetail, userText: string) {
    const textLower = userText.toLowerCase().trim();
    if (textLower.length < 25) {
      return {
        score: 25,
        rating: 'Insufficient Depth',
        feedback: 'Your explanation is too brief. Try to explain what it is, why it is needed, and what happens at each step as if teaching a classmate.',
        missingKeywords: ['motivation', 'mechanism', 'result']
      };
    }

    let matchedKeywords = 0;
    const missing: string[] = [];

    const expectedKeys: Record<string, string[]> = {
      'gradient-descent': ['slope', 'derivative', 'step', 'learning rate', 'minimum', 'cost'],
      'dfa-minimization': ['equivalent', 'distinguish', 'states', 'string', 'merge', 'final'],
      'tcp-congestion-control': ['window', 'router', 'packet', 'loss', 'halved', 'slow start']
    };

    const keys = expectedKeys[concept.id] || ['algorithm', 'problem', 'steps', 'output'];
    keys.forEach(k => {
      if (textLower.includes(k)) matchedKeywords++;
      else missing.push(k);
    });

    const matchRatio = matchedKeywords / keys.length;
    let score = Math.round(40 + matchRatio * 55);
    let rating = 'Developing Understanding';
    let feedback = '';

    if (matchRatio >= 0.75) {
      rating = 'Exceptional Conceptual Clarity';
      feedback = 'Outstanding! You have captured both the motivation and the exact mathematical/algorithmic mechanics without falling into common oversimplifications.';
    } else if (matchRatio >= 0.4) {
      rating = 'Good Foundation with Minor Gaps';
      feedback = `Solid grasp of the core intuition. To achieve full mastery, be sure to address: ${missing.slice(0, 3).join(', ')}.`;
    } else {
      feedback = `You have the general high-level picture, but crucial technical mechanisms are missing: ${missing.join(', ')}. Review Section 06: Under the Hood.`;
    }

    return {
      score,
      rating,
      feedback,
      missingKeywords: missing
    };
  }
}
