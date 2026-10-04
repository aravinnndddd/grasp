import { ConceptDetail } from '../../types/curriculum';

export interface TutorResponse {
  title: string;
  body: string;
  followUpPrompt?: string;
  suggestedAction?: string;
}

export class GrokTutoringEngine {
  /**
   * Generates grounded, contextual Socratic explanations based on curriculum data.
   */
  static generateTutorResponse(
    concept: ConceptDetail,
    actionType: 
      | 'explain_simpler'
      | 'give_analogy'
      | 'show_mathematically'
      | 'explain_for_exam'
      | 'show_failure'
      | 'test_me'
      | 'custom_query',
    customQuery?: string
  ): TutorResponse {
    switch (actionType) {
      case 'explain_simpler':
        return {
          title: `Simple Intuition: ${concept.title}`,
          body: `${concept.idea.simpleExplanation}\n\nKey Takeaway: ${concept.idea.intuitionSummary}`,
          followUpPrompt: 'Does this mental picture make sense, or would you like to see the dynamic experiment in Section 04?'
        };

      case 'give_analogy':
        if (concept.idea.analogy) {
          return {
            title: `Analogy: ${concept.idea.analogy.title}`,
            body: `${concept.idea.analogy.story}\n\n*Moral:* ${concept.idea.analogy.moral}`,
            followUpPrompt: 'Now, how does this story translate to computer memory and registers?'
          };
        }
        return {
          title: 'Practical Metaphor',
          body: `Think of ${concept.title} like tuning an acoustic guitar by turning the peg until the dissonant beats disappear.`,
          followUpPrompt: 'Notice how each small turn brings the string closer to harmony.'
        };

      case 'show_mathematically':
        if (concept.formulaExplorer) {
          return {
            title: `Mathematical Formalism: ${concept.formulaExplorer.title}`,
            body: `Equation:\n${concept.formulaExplorer.plain}\n\nWhy it works:\n${concept.formulaExplorer.explanation}\n\nKey Variables:\n${concept.formulaExplorer.variables.map(v => `• ${v.name} (${v.symbol}): ${v.meaning}`).join('\n')}`,
            followUpPrompt: 'Try changing one variable in Section 04 to observe how the output responds.'
          };
        }
        return {
          title: 'Formal Definition',
          body: concept.underTheHood.formalDefinition,
          followUpPrompt: 'Notice how the formal mathematical invariants prevent illegal computational states.'
        };

      case 'explain_for_exam':
        return {
          title: `KTU Exam Strategy (${concept.examMode.ktuSubjectCode})`,
          body: `Official Definition:\n"${concept.examMode.examDefinition}"\n\nFrequently Tested Questions:\n${concept.examMode.frequentYearQuestions.join('\n')}\n\nEvaluator Tip: In KTU valuation, missing the formal notation or diagram immediately costs 2 marks. Ensure you draw the annotated chart shown in Section 14.`,
          suggestedAction: 'Jump to Section 14: Exam Mode to practice 5-mark and 10-mark model answers.'
        };

      case 'show_failure':
        return {
          title: `Failure Mode Analysis: ${concept.breakIt.scenarioTitle}`,
          body: `Broken Condition:\n${concept.breakIt.brokenCondition}\n\nObserved Symptom:\n${concept.breakIt.symptom}\n\nRoot Cause:\n${concept.breakIt.whyItFailed}\n\nGolden Engineering Rule:\n${concept.breakIt.preventionRule}`,
          followUpPrompt: 'Go to Section 05: Break It to trigger this failure live and watch the system crash!'
        };

      case 'test_me':
        const randProb = concept.practiceProblems[Math.floor(Math.random() * concept.practiceProblems.length)];
        return {
          title: `Rapid Check: ${randProb.levelLabel}`,
          body: `${randProb.question}\n\n${randProb.options ? randProb.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o.text}`).join('\n') : ''}`,
          followUpPrompt: 'Take a minute to reason through the problem before checking the answer.'
        };

      case 'custom_query':
      default:
        return this.handleCustomStudentQuery(concept, customQuery || '');
    }
  }

  private static handleCustomStudentQuery(concept: ConceptDetail, query: string): TutorResponse {
    const q = query.toLowerCase();

    if (q.includes('why') || q.includes('reason') || q.includes('need')) {
      return {
        title: `Why ${concept.title} is necessary`,
        body: `Before ${concept.title} was invented: ${concept.whyItExists.historicalProblem}\n\nThe naive fix failed because: ${concept.whyItExists.naiveApproachFailed}\n\nThe core breakthrough was: ${concept.whyItExists.coreInsight}`,
        followUpPrompt: 'Would you like to trace how this algorithm executes step-by-step?'
      };
    }

    if (q.includes('exam') || q.includes('mark') || q.includes('question')) {
      return {
        title: 'KTU Exam Marking Insight',
        body: `For KTU examinations, this concept carries ${concept.examImportance} weightage. Evaluators specifically look for:\n1. Exact formal definition.\n2. Labeled schematic diagram or transition table.\n3. Step-by-step derivation or trace algorithm.`,
        suggestedAction: 'Review the 2, 5, and 10 mark KTU answers in Section 14.'
      };
    }

    if (q.includes('fail') || q.includes('diverge') || q.includes('wrong') || q.includes('break')) {
      return {
        title: 'How it can fail',
        body: `${concept.breakIt.scenarioTitle}\nSymptom: ${concept.breakIt.symptom}\nWhy it fails: ${concept.breakIt.whyItFailed}`,
        suggestedAction: 'Check Section 05: Break It to see the failure live.'
      };
    }

    return {
      title: `Guidance on ${concept.title}`,
      body: `Let's break this down together. ${concept.idea.simpleExplanation}\n\nWhat specifically feels counterintuitive about this step?`,
      followUpPrompt: 'Feel free to ask for a simpler analogy, a mathematical derivation, or an exam-oriented summary!'
    };
  }
}
