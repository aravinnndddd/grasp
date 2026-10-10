import { GroqClient } from '../ai/groq-client';
import { resolveDiagram, ResolvedDiagram } from './diagram-resolver';

export interface VisualDiagramItem {
  id: string;
  title: string;
  code: string;
  caption: string;
  type: 'mermaid';
  diagramType?: 'mindmap' | 'flowchart' | 'architecture' | 'sequence' | 'state';
  sectionTitle?: string;
}

/**
 * Diagram Generator Engine: Generates interactive Mermaid flowcharts, architecture
 * blocks, or timeline diagrams for any technical topic in an uploaded document.
 */
export class DiagramGenerator {
  /**
   * Generates a Mermaid vector diagram for a given topic and document excerpt.
   */
  static async generateForTopic(
    topic: string,
    contextSnippet: string,
    diagramType: 'mindmap' | 'flowchart' | 'architecture' | 'sequence' | 'state' = 'architecture'
  ): Promise<VisualDiagramItem> {
    // 1. Try generating with AI if API key is configured
    if (GroqClient.isConfigured()) {
      try {
        const typeGuidance = {
          mindmap: 'Create an expansive Mermaid mindmap (mindmap\\n  root((Topic))...)',
          flowchart: 'Create a clear top-down flowchart (graph TD) with decision branches and states',
          architecture: 'Create a system architecture diagram (graph TD or graph LR) with subgraphs and styled blocks',
          sequence: 'Create a sequence diagram (sequenceDiagram\\n  autonumber...) showing messages/packets exchanged over time',
          state: 'Create a state machine diagram (stateDiagram-v2) showing transitions between operational states'
        }[diagramType] || 'Create a clean, validated Mermaid diagram (graph TD, graph LR, or sequenceDiagram)';

        const prompt = `
You are an expert technical illustrator creating clean, validated Mermaid diagrams for an engineering student.
${typeGuidance} for:
"${topic}"

RELEVANT DOCUMENT CONTEXT:
"""
${contextSnippet.slice(0, 2500)}
"""

RULES:
1. Output ONLY the valid Mermaid code inside \`\`\`mermaid and \`\`\` code fence.
2. Use clear node names and readable labels. Quote node text containing special characters: id["Text (Detail)"].
3. For graphs, add stylish inline styles or colors: style N0 fill:#FFF7ED,stroke:#EA580C,stroke-width:2px.
4. Keep the diagram concise, readable, and technically accurate.
5. NEVER include markdown other than the \`\`\`mermaid code block.
`;

        const res = await GroqClient.chatCompletion(
          [
            { role: 'system', content: 'You are an expert Mermaid diagram architect. Return only valid Mermaid diagram code.' },
            { role: 'user', content: prompt }
          ],
          { temperature: 0.2, maxTokens: 900 }
        );

        // Extract mermaid code from response
        const match = res.match(/```mermaid\s*([\s\S]*?)```/i);
        const code = match ? match[1].trim() : res.trim();

        if (code && (
          code.startsWith('graph') ||
          code.startsWith('flowchart') ||
          code.startsWith('sequenceDiagram') ||
          code.startsWith('stateDiagram') ||
          code.startsWith('classDiagram') ||
          code.startsWith('mindmap')
        )) {
          return {
            id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: topic,
            code,
            caption: `AI-Synthesized ${diagramType} schematic for ${topic} based on your uploaded document.`,
            type: 'mermaid',
            diagramType
          };
        }
      } catch (e) {
        console.warn('AI diagram generation failed, falling back to local resolver:', e);
      }
    }

    // 2. Fallback to specialized deterministic diagram generator
    const code = this.buildDeterministicDiagram(topic, contextSnippet, diagramType);
    return {
      id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: topic,
      code,
      caption: `Technical ${diagramType} schematic for "${topic}".`,
      type: 'mermaid',
      diagramType
    };
  }

  /**
   * Generates a deterministic, valid Mermaid diagram based on extracted keywords and structure
   */
  private static buildDeterministicDiagram(
    topic: string,
    contextSnippet: string,
    diagramType: 'mindmap' | 'flowchart' | 'architecture' | 'sequence' | 'state'
  ): string {
    // Check if the resolver already has a pre-built domain diagram
    const resolved: ResolvedDiagram = resolveDiagram(topic, contextSnippet);
    if (resolved && resolved.code && !resolved.code.includes('<b>[Step 1: Input / Initiation]</b>')) {
      return resolved.code;
    }

    // Extract bullet points or sentences from context
    const lines = contextSnippet
      .split('\n')
      .map(l => l.replace(/^[\*\-\#\d\.\s\>]+/, '').trim())
      .filter(l => l.length > 5 && l.length < 90)
      .slice(0, 6);

    const safeTopic = topic.replace(/["'\(\)\[\]]/g, ' ').trim();

    if (diagramType === 'mindmap') {
      const branches = lines.length >= 2 ? lines.map(l => `    ${l.slice(0, 35)}`).join('\n') : `    Foundations & Theory\n    Architecture & Modules\n    Algorithms & Proofs\n    Exam High-Yield Topics`;
      return `mindmap\n  root(("${safeTopic.slice(0, 30)}"))\n${branches}`;
    }

    if (diagramType === 'sequence') {
      return `sequenceDiagram
    autonumber
    actor Client as User / Client
    participant Engine as Processing Core
    participant Storage as State & Data Store

    Client->>Engine: Initiate Request ("${safeTopic.slice(0, 25)}")
    Engine->>Storage: Validate Parameters & Query Context
    Storage-->>Engine: Context Retrieved Successfully
    Engine->>Engine: Execute Transformation Logic
    Engine-->>Client: Return Verified Result & Diagram Metrics`;
    }

    if (diagramType === 'state') {
      return `stateDiagram-v2
    [*] --> Idle: Initialize ${safeTopic.slice(0, 20)}
    Idle --> Processing: Input Event Triggered
    Processing --> Validating: Run Consistency Checks
    Validating --> Verified: Conditions Satisfied ✅
    Validating --> Retrying: Validation Fault Detected
    Retrying --> Processing: Exponential Backoff
    Verified --> [*]: Operation Complete`;
    }

    // Default: Clean Flowchart / Architecture
    const step1 = lines[0] ? lines[0].slice(0, 45) : 'Initialize Parameters & Input';
    const step2 = lines[1] ? lines[1].slice(0, 45) : 'Core Transformation Logic';
    const step3 = lines[2] ? lines[2].slice(0, 45) : 'Validation & Integrity Check';
    const step4 = lines[3] ? lines[3].slice(0, 45) : 'Final State & Result Delivery';

    return `graph TD
    A["<b>1. Input Stage</b><br/>${step1}"] --> B["<b>2. Execution Core</b><br/>${step2}"]
    B --> C{"<b>3. Decision / Verification</b><br/>${step3}"}
    C -- Valid --> D["<b>4. Stable Output</b><br/>${step4} ✅"]
    C -- Needs Retry --> E["<b>5. Error Handling / Recovery</b><br/>Recompute or Fallback ⚠️"]
    E --> B

    style A fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px
    style B fill:#FEF3C7,stroke:#D97706,stroke-width:2px
    style C fill:#F1F5F9,stroke:#475569
    style D fill:#DCFCE7,stroke:#16A34A,stroke-width:2px
    style E fill:#FEE2E2,stroke:#DC2626`;
  }

  /**
   * Scans a note's markdown content to extract all embedded Mermaid diagrams
   */
  static extractDiagramsFromMarkdown(markdown: string): VisualDiagramItem[] {
    const diagrams: VisualDiagramItem[] = [];
    const regex = /```mermaid\s*([\s\S]*?)```/gi;
    let match;
    let counter = 0;

    // Split markdown by sections to know which section each diagram belongs to
    const sections = markdown.split(/(?=^##\s+)/gm);

    sections.forEach(sec => {
      const headingMatch = sec.match(/^##\s+(.+)$/m);
      const sectionTitle = headingMatch ? headingMatch[1].trim() : undefined;

      while ((match = regex.exec(sec)) !== null) {
        const code = match[1].trim();
        if (code.length > 10) {
          counter++;
          diagrams.push({
            id: `extracted-diag-${counter}`,
            title: sectionTitle || `Technical Schematic ${counter}`,
            code,
            caption: `Visual schematic extracted from ${sectionTitle || 'document content'}.`,
            type: 'mermaid',
            sectionTitle
          });
        }
      }
    });

    return diagrams;
  }

  /**
   * Automatically ensures that a note has at least 2-3 essential visual diagrams
   * (e.g. Concept Mind Map, System Workflow Flowchart, and Sequence Timeline).
   */
  static ensureEssentialDiagrams(
    documentTitle: string,
    sections: { title: string; content: string }[]
  ): VisualDiagramItem[] {
    const list: VisualDiagramItem[] = [];

    // 1. Concept Mind Map of the Document
    const subTopics = sections.slice(0, 5).map(s => `    ${s.title.replace(/["'\(\)]/g, '').slice(0, 30)}`).join('\n');
    const mindmapCode = `mindmap
  root(("${documentTitle.replace(/["'\(\)]/g, '').slice(0, 25)}"))
${subTopics || '    Foundations & Architecture\n    Key Algorithms & Protocols\n    Mathematical Models\n    Exam Ready Solutions'}`;

    list.push({
      id: `essential-mindmap-${Date.now()}`,
      title: `${documentTitle} — Global Concept Map`,
      code: mindmapCode,
      caption: 'Hierarchical overview of modules and core principles in this document.',
      type: 'mermaid',
      diagramType: 'mindmap'
    });

    // 2. Primary System Architecture / Workflow
    const leadSection = sections[0] || { title: documentTitle, content: '' };
    list.push({
      id: `essential-flowchart-${Date.now()}`,
      title: `${leadSection.title} — Technical Architecture Flowchart`,
      code: this.buildDeterministicDiagram(leadSection.title, leadSection.content, 'architecture'),
      caption: 'Operational architecture and workflow schematic.',
      type: 'mermaid',
      diagramType: 'architecture'
    });

    return list;
  }
}
