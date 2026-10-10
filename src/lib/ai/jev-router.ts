import { GroqClient, GroqMessage } from './groq-client';
import { JevDecisionEngine } from './jev-engine';
import { ConceptDetail } from '../../types/curriculum';
import { StudentConceptProgress } from '../../types/learning';
import { SavedAnswersStorage } from '../storage/saved-answers';
import { findGfgLinks } from '../curriculum/gfg-links';

export type TaskClassification = 
  | 'PREREQUISITE_DIAGNOSIS'
  | 'MISCONCEPTION_CLASSIFICATION'
  | 'MASTERY_SCORING'
  | 'SOCRATIC_TUTORING'
  | 'CONCEPT_EXPLANATION'
  | 'EXAM_ANSWER_GENERATION'
  | 'GENERAL_QUERY';

export interface JevRoutingDecision {
  task: TaskClassification;
  targetAI: 'JEV_CLASSIFIER' | 'GROQ_LLM';
  modelName: string;
  reasoning: string;
  groundingSource: string;
  confidence: number;
}

export interface JevExecutionResult {
  decision: JevRoutingDecision;
  response: string;
  gfgLinks?: Array<{ title: string; url: string }>;
  savedId?: string;
  isFallback?: boolean;
}

export class JevCognitiveRouter {
  /**
   * Structured routing rules for decision making.
   */
  private static readonly ROUTING_RULES = [
    {
      pattern: /prerequisite\s+gap|diagnose\s+my\s+mistake|what\s+should\s+i\s+study\s+first|why\s+am\s+i\s+failing/i,
      task: 'PREREQUISITE_DIAGNOSIS',
      targetAI: 'JEV_CLASSIFIER',
      modelName: 'JEV-Deterministic-Engine-v2',
      reasoning: 'Diagnostic task requires deterministic prerequisite graph evaluation and student attempt history analysis. Routing to JEV Rule Engine for exact curriculum mapping.',
      confidence: 0.98
    },
    {
      pattern: /evaluate\s+my\s+explanation|grade\s+my\s+answer|is\s+this\s+misconception/i,
      task: 'MISCONCEPTION_CLASSIFICATION',
      targetAI: 'JEV_CLASSIFIER',
      modelName: 'JEV-Rubric-Classifier',
      reasoning: 'Answer evaluation requires rubric keyword matching and misconception detection against university valuation standards. Handled by JEV Classifier.',
      confidence: 0.96
    },
    {
      pattern: /exam\s+question|3\s+mark|5\s+mark|8\s+mark|10\s+mark|model\s+answer/i,
      task: 'EXAM_ANSWER_GENERATION',
      targetAI: 'GROQ_LLM',
      modelName: () => GroqClient.getSelectedModel(),
      reasoning: 'Structured exam synthesis requires high-fidelity pedagogical generation aligned with university question blueprints. Routing to Groq LLM.',
      confidence: 0.94
    }
  ];
  /**
   * Evaluates query and context to decide whether JEV executes locally or routes to Groq.
   */
  static routeRequest(
    query: string,
    context: {
      subjectTitle: string;
      subjectCode: string;
      moduleTitle: string;
      concept?: ConceptDetail;
      progress?: StudentConceptProgress;
    }
  ): JevRoutingDecision {
    // Rule-engine: iterate ROUTING_RULES and return the first match
    for (const rule of JevCognitiveRouter.ROUTING_RULES) {
      if (rule.pattern.test(query)) {
        const modelName = typeof rule.modelName === 'function'
          ? rule.modelName()
          : rule.modelName;
        const groundingSource = rule.targetAI === 'JEV_CLASSIFIER'
          ? `Standard Curriculum // ${context.subjectCode}`
          : `Course Syllabus // ${context.subjectCode} (${context.moduleTitle})`;
        return {
          task: rule.task as TaskClassification,
          targetAI: rule.targetAI as 'JEV_CLASSIFIER' | 'GROQ_LLM',
          modelName,
          reasoning: rule.reasoning,
          groundingSource,
          confidence: rule.confidence
        };
      }
    }

    // Default: Socratic tutoring via Groq
    return {
      task: 'SOCRATIC_TUTORING',
      targetAI: 'GROQ_LLM',
      modelName: GroqClient.getSelectedModel(),
      reasoning: 'Generative inquiry requires open-ended conversational intelligence and Socratic pedagogy grounded in academic textbooks. Routing to Groq LLM.',
      groundingSource: `Authoritative Engineering Textbooks // ${context.subjectCode}`,
      confidence: 0.92
    };
  }

  /**
   * Executes the query according to JEV routing decision.
   */
  static async executeQuery(
    query: string,
    context: {
      subjectTitle: string;
      subjectCode: string;
      moduleTitle: string;
      concept?: ConceptDetail;
      progress?: StudentConceptProgress;
    }
  ): Promise<JevExecutionResult> {
    const decision = this.routeRequest(query, context);

    // 1. If routed to local JEV Classifier
    if (decision.targetAI === 'JEV_CLASSIFIER') {
      if (context.concept) {
        if (decision.task === 'PREREQUISITE_DIAGNOSIS') {
          const diag = JevDecisionEngine.diagnoseGap(context.concept, 50, false, []);
          return {
            decision,
            response: `**[JEV PREREQUISITE DIAGNOSTIC]**\n\n- **Identified Gap:** ${diag.weakPrerequisiteTitle || 'None detected'}\n- **Root-Cause Analysis:** ${diag.detectedMisconception || 'Fundamentals verified'}\n- **Recommended Action:** ${diag.suggestedAction}\n- **Target Study Time:** ${diag.timeEstimateMinutes} minutes`
          };
        }
        if (decision.task === 'MISCONCEPTION_CLASSIFICATION') {
          const grade = JevDecisionEngine.gradeOwnExplanation(context.concept, query);
          return {
            decision,
            response: `**[JEV RUBRIC EVALUATION]**\n\n- **Rating:** ${grade.rating} (${grade.score}/100)\n- **Feedback:** ${grade.feedback}\n- **Missing Keywords:** ${grade.missingKeywords.join(', ') || 'None! Excellent coverage.'}`
          };
        }
      }
      return {
        decision,
        response: `JEV Classification Engine verified: Concept status is healthy. Grounded in ${context.subjectCode}.`
      };
    }

    const gfgLinks = findGfgLinks(query + ' ' + context.subjectTitle);

    // 2. If routed to Free AI LLM
    if (GroqClient.isConfigured()) {
      try {
        const systemPrompt = `You are GRASP AI, an elite Socratic computer science engineering tutor.
Current Subject: ${context.subjectCode} - ${context.subjectTitle}
Current Module: ${context.moduleTitle}
${context.concept ? `Active Concept: ${context.concept.title}\nCategory: ${context.concept.category}` : ''}

CRITICAL PEDAGOGICAL & FORMATTING REQUIREMENTS:
1. DETAILED CONCEPTUAL EXPLANATION:
   - "Don't just give facts; explain why it exists, the core intuition, and the failure case it solves."
   - Structure into clear sections: 1) Core Intuition, 2) Technical Mechanics & Formulas, 3) Exam Valuation Point.

2. VISUAL DIAGRAM (MANDATORY - MERMAID OR ARCHITECTURE SCHEMATIC):
   - ALWAYS include a visual diagram! For flows, layered architectures, state machines, or protocol handshakes, use a clean Mermaid diagram code block:
   Example:
   \`\`\`mermaid
   graph TD
     A[Client Application] -->|1. SYN| B[Transport Layer]
     B -->|2. SYN-ACK| C[Server Endpoint]
     C -->|3. ACK Established| A
   \`\`\`
   - Or include a clean ASCII architecture diagram. Evaluators award marks for clean diagrams!

3. CLEAN MARKDOWN TABLES (MANDATORY FOR COMPARISONS & MARK RUBRICS):
   - For mark distributions, algorithm comparisons (e.g., Pure vs Slotted ALOHA), or field specifications, ALWAYS use clean markdown tables with standard header separators:
   | Mark Allocation | Valuation Requirement |
   | :--- | :--- |
   | 2 Marks | Labeled Architecture Diagram |
   | 3 Marks | Step-by-step mathematical derivation |

4. EXAMINER'S PRO-TIP CALLOUT:
   - Use blockquote syntax for examiner secrets or common student blunders:
   > 💡 **EXAM TIP:** Write field names directly inside the packet boxes rather than arrows beside them to secure full evaluator marks!

5. GEEKSFORGEEKS REFERENCE LINKS (MANDATORY):
   - ALWAYS end the answer with a "### 📚 GeeksforGeeks Reference Links" section containing accurate clickable links to relevant GeeksforGeeks articles for further reading.`;

        const messages: GroqMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ];

        const rawResponse = await GroqClient.chatCompletion(messages, {
          model: decision.modelName as any,
          temperature: 0.3
        });

        // Ensure GFG links are present in the response
        let finalResponse = rawResponse;
        if (!finalResponse.toLowerCase().includes('geeksforgeeks')) {
          finalResponse += `\n\n---\n### 📚 GeeksforGeeks Reference Links:\n` +
            gfgLinks.map(g => `- [${g.title}](${g.url})`).join('\n');
        }

        // Auto-save answer to local repository
        const saved = SavedAnswersStorage.save({
          subjectCode: context.subjectCode,
          subjectTitle: context.subjectTitle,
          moduleTitle: context.moduleTitle,
          query,
          response: finalResponse,
          modelUsed: decision.modelName,
          routingTask: decision.task,
          gfgLinks
        });

        return {
          decision,
          response: finalResponse,
          gfgLinks,
          savedId: saved.id
        };
      } catch (err: any) {
        console.warn('AI API call failed, falling back to local grounded knowledge:', err);
        const fallbackText = this.getLocalFallbackResponse(query, context, gfgLinks);
        const saved = SavedAnswersStorage.save({
          subjectCode: context.subjectCode,
          subjectTitle: context.subjectTitle,
          moduleTitle: context.moduleTitle,
          query,
          response: fallbackText,
          modelUsed: 'JEV-Grounded-Fallback',
          routingTask: decision.task,
          gfgLinks
        });

        return {
          decision: {
            ...decision,
            reasoning: `AI API Error (${err?.message || 'Network issue'}). Falling back to JEV Grounded Knowledge Engine.`
          },
          response: fallbackText,
          gfgLinks,
          savedId: saved.id,
          isFallback: true
        };
      }
    }

    // If API key is not configured, inform student, save grounded response and provide rich fallback
    const fallbackText = this.getLocalFallbackResponse(query, context, gfgLinks) + 
      `\n\n---\n*💡 Tip: To enable real-time free AI responses with ${GroqClient.getSelectedModel()}, click "AI SETTINGS" to configure your API key.*`;

    const saved = SavedAnswersStorage.save({
      subjectCode: context.subjectCode,
      subjectTitle: context.subjectTitle,
      moduleTitle: context.moduleTitle,
      query,
      response: fallbackText,
      modelUsed: 'JEV-Deterministic-Engine',
      routingTask: decision.task,
      gfgLinks
    });

    return {
      decision: {
        ...decision,
        reasoning: 'API Key not yet configured in workstation. JEV automatically activated local grounded curriculum fallback.'
      },
      response: fallbackText,
      gfgLinks,
      savedId: saved.id,
      isFallback: true
    };
  }

  private static getLocalFallbackResponse(
    query: string,
    context: { subjectTitle: string; subjectCode: string; moduleTitle: string; concept?: ConceptDetail },
    gfgLinks?: Array<{ title: string; url: string }>
  ): string {
    const links = gfgLinks || findGfgLinks(query);
    const linksMarkdown = `\n\n### 📚 GeeksforGeeks Reference Links:\n` +
      links.map(g => `- [${g.title}](${g.url})`).join('\n');

    if (context.concept) {
      return `### 💡 Understand the Concept: ${context.concept.title}\n\n` +
        `**First-Principles Intuition:**\n${context.concept.idea.simpleExplanation}\n\n` +
        `**Historical Problem & Motivation:**\n${context.concept.whyItExists.historicalProblem}\n\n` +
        `### 📐 Architectural Figure / Diagram:\n` +
        `\`\`\`mermaid\n` +
        `graph TD\n` +
        `  A["Input Features Space\\n(Vector X)"] --> B["Compute Hypothesis State\\nh_θ(x)"]\n` +
        `  B --> C["Evaluate Loss Function\\nJ(θ)"]\n` +
        `  C --> D["Calculate Gradient Vector\\n∇J(θ)"]\n` +
        `  D -->|Iterative Update: θ := θ - α∇J| B\n` +
        `  style A fill:#F4F4F5,stroke:#71717A,stroke-width:1.5px\n` +
        `  style B fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px\n` +
        `  style C fill:#FEF2F2,stroke:#EF4444,stroke-width:2px\n` +
        `  style D fill:#ECFDF5,stroke:#10B981,stroke-width:2px\n` +
        `\`\`\`\n\n` +
        `### 🏷️ Official Exam Definition:\n${context.concept.examMode.examDefinition}\n\n` +
        `### 📝 Model Exam Question & Model Answer:\n` +
        `**Q:** ${context.concept.examMode.answers[1]?.question || context.concept.examMode.answers[0]?.question}\n\n` +
        `**A:**\n${context.concept.examMode.answers[1]?.modelAnswer || context.concept.examMode.answers[0]?.modelAnswer}` +
        linksMarkdown;
    }

    return `### 💡 Grounded Syllabus Overview: ${context.subjectCode} - ${context.subjectTitle}\n\n` +
      `**Module Context:** ${context.moduleTitle}\n` +
      `**Conceptual Focus:** Comprehensive university curriculum coverage.\n\n` +
      `### 📐 System Block Diagram:\n` +
      `\`\`\`mermaid\n` +
      `graph LR\n` +
      `  A["Syllabus Core Module\\n${context.subjectCode}"] --> B["Mathematical Modeling\\n& Theoretical Foundation"]\n` +
      `  B --> C["University Valuation\\n(Full Model Solution)"]\n` +
      `  style A fill:#FFF7ED,stroke:#EA580C,stroke-width:2px\n` +
      `  style B fill:#EFF6FF,stroke:#2563EB,stroke-width:2px\n` +
      `  style C fill:#ECFDF5,stroke:#059669,stroke-width:2px\n` +
      `\`\`\`\n` +
      linksMarkdown;
  }
}
