import React, { useState } from 'react';
import { ConceptDetail } from '../../types/curriculum';
import { JevDecisionEngine } from '../../lib/ai/jev-engine';
import { Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeynmanProps {
  concept: ConceptDetail;
  onGraded?: (score: number) => void;
}

export const FeynmanPrompt: React.FC<FeynmanProps> = ({ concept, onGraded }) => {
  const [userText, setUserText] = useState<string>('');
  const [result, setResult] = useState<{
    score: number;
    rating: string;
    feedback: string;
    missingKeywords: string[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const evaluation = JevDecisionEngine.gradeOwnExplanation(concept, userText);
      setResult(evaluation);
      setIsSubmitting(false);
      if (onGraded) {
        onGraded(evaluation.score);
      }
    }, 400);
  };

  return (
    <div className="bg-paper-50 border border-line-border rounded p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-line-border pb-2">
        <span className="text-xs uppercase tracking-wider font-mono-code text-ink-500">
          SYNTHESIS // FEYNMAN EXPLANATION TEST
        </span>
        <span className="text-xs font-mono-code text-ink-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" /> Socratic Rubric Evaluator
        </span>
      </div>

      <div>
        <h4 className="text-base font-semibold text-ink-900 font-serif-heading">
          Explain {concept.title} in your own words
        </h4>
        <p className="text-xs text-ink-600 mt-1 leading-relaxed">
          Pretend you are explaining this to a 2nd year engineering student who has never encountered it. Explain <strong>what problem it solves</strong>, <strong>why the naive approach fails</strong>, and <strong>how it works</strong>. Avoid copying definitions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={4}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Start typing your explanation here... e.g. 'In machine learning we want to find optimal weights, but inverting large matrices is too expensive...'"
          className="w-full p-3 text-xs font-sans border border-line-border rounded bg-white focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-colors leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono-code text-ink-500">
            {userText.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <button
            type="submit"
            disabled={isSubmitting || userText.trim().length < 15}
            className="px-3.5 py-1.5 text-xs font-mono-code bg-ink-900 text-paper-50 rounded hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'EVALUATING...' : 'SUBMIT EXPLANATION'}
          </button>
        </div>
      </form>

      {/* Evaluator feedback */}
      {result && (
        <div className="bg-white border border-line-border rounded p-4 space-y-3 shadow-notebook paper-grid">
          <div className="flex items-center justify-between border-b border-line-border pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lab-success" />
              <span className="text-xs font-mono-code font-bold text-ink-900">
                {result.rating.toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-paper-200 text-ink-800 font-semibold">
              Mastery Score: {result.score} / 100
            </span>
          </div>

          <p className="text-xs text-ink-700 leading-relaxed font-sans">
            {result.feedback}
          </p>

          {result.missingKeywords.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200 p-2.5 rounded text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-mono-code text-[11px] font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                MISSING CONCEPTS / SUGGESTED INCLUSIONS:
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {result.missingKeywords.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-amber-300 rounded font-mono-code text-[11px] text-amber-800">
                    +{k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
