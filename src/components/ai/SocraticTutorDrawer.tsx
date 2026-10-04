import React, { useState } from 'react';
import { ConceptDetail } from '../../types/curriculum';
import { StudentConceptProgress } from '../../types/learning';
import { GrokTutoringEngine, TutorResponse } from '../../lib/ai/grok-tutor';
import { JevCognitiveRouter } from '../../lib/ai/jev-router';
import { GroqClient } from '../../lib/ai/groq-client';
import { Bot, X, Send, Sparkles, HelpCircle, ArrowRight, BookOpen, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptDetail;
  progress: StudentConceptProgress;
}

export const SocraticTutorDrawer: React.FC<TutorDrawerProps> = ({
  isOpen,
  onClose,
  concept,
  progress
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'tutor' | 'student'; title?: string; text: string; routingBadge?: string }>>([
    {
      role: 'tutor',
      title: 'JEV Cognitive Tutor & Groq AI',
      text: `Hello! I am grounded in the official KTU curriculum for ${concept.subjectTitle} (${concept.moduleTitle}). How can I guide your intuition regarding "${concept.title}"?`
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleShortcutClick = (
    type: 'explain_simpler' | 'give_analogy' | 'show_mathematically' | 'explain_for_exam' | 'show_failure' | 'test_me',
    label: string
  ) => {
    // Append student shortcut prompt
    setMessages(prev => [...prev, { role: 'student', text: label }]);
    setIsTyping(true);

    setTimeout(() => {
      const resp: TutorResponse = GrokTutoringEngine.generateTutorResponse(concept, type);
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          title: resp.title,
          text: resp.body + (resp.followUpPrompt ? `\n\n💭 ${resp.followUpPrompt}` : ''),
          routingBadge: 'JEV Core Socratic Engine'
        }
      ]);
      setIsTyping(false);
    }, 350);
  };

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQ = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'student', text: userQ }]);
    setIsTyping(true);

    try {
      const result = await JevCognitiveRouter.executeQuery(userQ, {
        subjectTitle: concept.subjectTitle,
        subjectCode: concept.subjectId.toUpperCase(),
        moduleTitle: concept.moduleTitle,
        concept,
        progress
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          title: `${result.decision.task.replace(/_/g, ' ')}`,
          text: result.response,
          routingBadge: `Routed to ${result.decision.targetAI === 'GROQ_LLM' ? `Groq (${result.decision.modelName})` : result.decision.modelName}`
        }
      ]);
    } catch (err: any) {
      const fallbackResp = GrokTutoringEngine.generateTutorResponse(concept, 'custom_query', userQ);
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          title: fallbackResp.title,
          text: fallbackResp.body,
          routingBadge: 'Local Grounded Fallback'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-line-border shadow-2xl flex flex-col font-sans animate-slideLeft">
      {/* Header */}
      <div className="p-4 border-b border-line-border bg-paper-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-terracotta text-white rounded flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono-code font-bold text-ink-900 uppercase">
              Grok Socratic Tutor
            </h3>
            <div className="text-[10px] font-mono-code text-ink-500 truncate max-w-[260px]">
              Grounded: {concept.title}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-ink-500 hover:text-ink-900 rounded hover:bg-paper-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Banner */}
      <div className="bg-paper-200/80 px-4 py-2 border-b border-line-border text-[11px] font-mono-code text-ink-700 flex items-center justify-between">
        <span>Current Module: {concept.moduleId}</span>
        <span className="text-terracotta font-semibold">Mastery: {progress.state}</span>
      </div>

      {/* Quick Socratic Prompt Buttons */}
      <div className="p-3 border-b border-line-border bg-paper-50 space-y-2">
        <div className="text-[10px] font-mono-code uppercase text-ink-500 font-semibold">
          GUIDED INQUIRY SHORTCUTS:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleShortcutClick('explain_simpler', 'Explain simpler')}
            className="px-2.5 py-1 text-xs font-mono-code bg-white border border-line-border rounded hover:border-terracotta text-ink-800 transition-colors"
          >
            Explain simpler
          </button>
          <button
            onClick={() => handleShortcutClick('give_analogy', 'Give analogy')}
            className="px-2.5 py-1 text-xs font-mono-code bg-white border border-line-border rounded hover:border-terracotta text-ink-800 transition-colors"
          >
            Give analogy
          </button>
          <button
            onClick={() => handleShortcutClick('show_failure', 'Show failure case')}
            className="px-2.5 py-1 text-xs font-mono-code bg-white border border-red-200 text-red-900 rounded hover:bg-red-50 transition-colors"
          >
            Show failure case
          </button>
          <button
            onClick={() => handleShortcutClick('show_mathematically', 'Explain mathematically')}
            className="px-2.5 py-1 text-xs font-mono-code bg-white border border-line-border rounded hover:border-terracotta text-ink-800 transition-colors"
          >
            Explain mathematically
          </button>
          <button
            onClick={() => handleShortcutClick('explain_for_exam', 'Explain for KTU exam')}
            className="px-2.5 py-1 text-xs font-mono-code bg-white border border-line-border rounded hover:border-terracotta text-ink-800 transition-colors"
          >
            Explain for exam
          </button>
          <button
            onClick={() => handleShortcutClick('test_me', 'Test me')}
            className="px-2.5 py-1 text-xs font-mono-code bg-ink-900 text-paper-50 rounded hover:bg-ink-800 transition-colors"
          >
            Test me
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-paper-50/40">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`space-y-1 ${
              m.role === 'student' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3.5 rounded text-xs leading-relaxed max-w-[92%] shadow-notebook ${
                m.role === 'student'
                  ? 'bg-ink-900 text-white font-mono-code'
                  : 'bg-white border border-line-border text-ink-900 font-sans'
              }`}
            >
              {m.title && (
                <div className="flex items-center justify-between font-mono-code text-[10px] font-bold text-terracotta uppercase border-b border-line-border pb-1 mb-1.5 gap-2">
                  <span>{m.title}</span>
                  {m.routingBadge && (
                    <span className="text-[9px] font-normal text-ink-500 bg-paper-200 px-1.5 py-0.2 rounded border border-line-border">
                      {m.routingBadge}
                    </span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-left">
            <div className="inline-block p-2.5 rounded bg-white border border-line-border text-xs font-mono-code text-ink-500 animate-pulse flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-terracotta animate-spin" />
              JEV Router evaluating & querying Groq LPU...
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendCustom} className="p-3 border-t border-line-border bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about this concept..."
          className="flex-1 p-2 text-xs font-sans border border-line-border rounded focus:outline-none focus:border-terracotta"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
