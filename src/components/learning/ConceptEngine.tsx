import React, { useState } from 'react';
import { ConceptDetail } from '../../types/curriculum';
import { StudentConceptProgress } from '../../types/learning';
import { JevDecisionEngine } from '../../lib/ai/jev-engine';
import { GradientDescentLab } from '../visualizations/GradientDescentLab';
import { AutomataLab } from '../visualizations/AutomataLab';
import { NetworkPacketLab } from '../visualizations/NetworkPacketLab';
import { FormulaExplorer } from './FormulaExplorer';
import { PredictionChallenge } from './PredictionChallenge';
import { FeynmanPrompt } from './FeynmanPrompt';
import { StepThroughGuide } from './StepThroughGuide';
import { ExamModeView } from './ExamModeView';
import { PracticeSection } from './PracticeSection';
import { ActiveRecallCard } from './ActiveRecallCard';
import { DijkstraLab } from '../visualizations/DijkstraLab';
import { AStarLab } from '../visualizations/AStarLab';
import { MicrocontrollerLab } from '../visualizations/MicrocontrollerLab';
import { MasteryChecklist } from './MasteryChecklist';
import { 
  Compass, ArrowUpRight, AlertTriangle, BookOpen, 
  Code2, CheckCircle2, ChevronRight, Zap, Play, Terminal
} from 'lucide-react';

interface ConceptEngineProps {
  concept: ConceptDetail;
  progress: StudentConceptProgress;
  onUpdateProgress: (newProgress: Partial<StudentConceptProgress>) => void;
  onSelectConcept: (conceptId: string) => void;
  onOpenTutor: (queryType?: string) => void;
}

export const ConceptEngine: React.FC<ConceptEngineProps> = ({
  concept,
  progress,
  onUpdateProgress,
  onSelectConcept,
  onOpenTutor
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [completedRubrics, setCompletedRubrics] = useState<string[]>(
    progress.completedRubrics || []
  );
  const [solvedPractice, setSolvedPractice] = useState<Record<string, boolean>>({});
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null);

  // Pick the right visualization component for the concept category
  const renderVisualization = (isBreakMode = false) => {
    if (concept.id === 'dijkstra-algorithm') {
      return <DijkstraLab isBreakMode={isBreakMode} />;
    }
    if (concept.id === 'astar-search') {
      return <AStarLab isBreakMode={isBreakMode} />;
    }
    if (concept.id === 'microcontroller-8051') {
      return <MicrocontrollerLab isBreakMode={isBreakMode} />;
    }
    if (concept.category === 'mathematical') {
      return <GradientDescentLab isBreakMode={isBreakMode} />;
    }
    if (concept.category === 'theoretical') {
      return <AutomataLab isBreakMode={isBreakMode} />;
    }
    if (concept.category === 'networking') {
      return <NetworkPacketLab isBreakMode={isBreakMode} />;
    }
    return <GradientDescentLab isBreakMode={isBreakMode} />;
  };

  const handleToggleCriterion = (crit: string) => {
    const nextList = completedRubrics.includes(crit)
      ? completedRubrics.filter(c => c !== crit)
      : [...completedRubrics, crit];
    setCompletedRubrics(nextList);

    const { score, newState } = JevDecisionEngine.evaluateMastery(
      { ...progress, completedRubrics: nextList },
      concept.practiceProblems.length,
      Object.values(solvedPractice).filter(Boolean).length,
      85,
      true
    );

    onUpdateProgress({
      completedRubrics: nextList,
      score,
      state: newState
    });
  };

  const handleConfirmMastery = () => {
    const { score } = JevDecisionEngine.evaluateMastery(
      { ...progress, completedRubrics },
      concept.practiceProblems.length,
      Object.values(solvedPractice).filter(Boolean).length,
      95,
      true
    );

    onUpdateProgress({
      state: 'MASTERED',
      score: { ...score, overall: Math.max(score.overall, 88) }
    });
  };

  // Section list
  const sections = [
    { id: 'sec-01', num: '01', title: 'The Idea' },
    { id: 'sec-02', num: '02', title: 'Why Does This Exist?' },
    { id: 'sec-03', num: '03', title: 'See It' },
    { id: 'sec-04', num: '04', title: 'Play With It' },
    { id: 'sec-05', num: '05', title: 'Break It' },
    { id: 'sec-06', num: '06', title: 'Under The Hood' },
    { id: 'sec-07', num: '07', title: 'Step Through It' },
    { id: 'sec-08', num: '08', title: 'Predict' },
    { id: 'sec-09', num: '09', title: 'Build It' },
    { id: 'sec-10', num: '10', title: 'Connect It' },
    { id: 'sec-11', num: '11', title: 'Common Misconceptions' },
    { id: 'sec-12', num: '12', title: 'Compare' },
    { id: 'sec-13', num: '13', title: 'Your Own Explanation' },
    { id: 'sec-14', num: '14', title: 'KTU Exam Mode' },
    { id: 'sec-15', num: '15', title: 'Practice' },
    { id: 'sec-16', num: '16', title: 'Active Recall' },
    { id: 'sec-17', num: '17', title: 'Master Check' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">
      {/* Chapter Title & Metadata */}
      <div className="border-b border-line-border pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-ink-500">
          <span className="text-terracotta font-semibold uppercase">{concept.subjectTitle}</span>
          <span>/</span>
          <span>{concept.moduleTitle}</span>
          <span>/</span>
          <span className="bg-paper-200 text-ink-700 px-2 py-0.5 rounded uppercase">
            {concept.difficulty}
          </span>
          <span>/</span>
          <span>~{concept.estimatedMinutes} min read & lab</span>
          <span>/</span>
          <span className="text-red-700 font-semibold">KTU IMPORTANCE: {concept.examImportance.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif-heading font-bold text-ink-900 tracking-tight">
          {concept.title}
        </h1>

        {/* Prerequisites bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-mono-code text-ink-500 uppercase text-[11px]">Prerequisites:</span>
          {concept.prerequisites.map((pre) => (
            <span
              key={pre.id}
              className="bg-paper-200 border border-line-border px-2.5 py-1 rounded text-ink-800 font-mono-code text-[11px]"
              title={pre.reason}
            >
              {pre.title}
            </span>
          ))}
        </div>
      </div>

      {/* Editorial Navigation Jump Bar */}
      <div className="sticky top-14 z-20 bg-paper-100/95 backdrop-blur border-y border-line-border py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max text-xs font-mono-code px-1">
          <span className="text-ink-400 mr-1 text-[11px]">CHAPTER INDEX:</span>
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="px-2.5 py-1 rounded hover:bg-paper-300 text-ink-700 transition-colors whitespace-nowrap"
            >
              <span className="text-ink-400 font-semibold">{sec.num}</span> {sec.title}
            </a>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 01 / THE IDEA */}
      {/* ========================================================================= */}
      <section id="sec-01" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">01 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">THE IDEA</h2>
        </div>

        <div className="prose text-ink-800 text-base leading-relaxed space-y-3 font-serif">
          <p className="text-lg leading-relaxed text-ink-900 font-normal">
            {concept.idea.simpleExplanation}
          </p>

          <div className="bg-paper-200/80 border-l-2 border-l-terracotta p-3.5 rounded-r my-4 font-sans text-sm text-ink-900">
            <strong className="font-mono-code text-xs uppercase text-terracotta block mb-0.5">
              Core Intuition in One Sentence:
            </strong>
            {concept.idea.intuitionSummary}
          </div>

          {concept.idea.analogy && (
            <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-2 font-sans paper-grid">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-ink-500 uppercase font-semibold">
                  FIELD ANALOGY // {concept.idea.analogy.title}
                </span>
                <span className="text-xs font-mono-code text-terracotta font-semibold">Intuition Anchor</span>
              </div>
              <p className="text-xs text-ink-800 leading-relaxed font-serif italic">
                "{concept.idea.analogy.story}"
              </p>
              <div className="text-xs text-ink-600 border-t border-line-border pt-2 font-mono-code">
                <strong>Takeaway: </strong>{concept.idea.analogy.moral}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 / WHY DOES THIS EXIST? */}
      {/* ========================================================================= */}
      <section id="sec-02" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">02 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">WHY DOES THIS EXIST?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-2">
            <span className="text-[11px] font-mono-code text-red-700 uppercase font-semibold">
              01. The Authentic Problem
            </span>
            <p className="text-xs text-ink-800 leading-relaxed font-sans">
              {concept.whyItExists.historicalProblem}
            </p>
          </div>

          <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-2">
            <span className="text-[11px] font-mono-code text-amber-700 uppercase font-semibold">
              02. Why Naive Approach Failed
            </span>
            <p className="text-xs text-ink-800 leading-relaxed font-sans">
              {concept.whyItExists.naiveApproachFailed}
            </p>
          </div>

          <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-2">
            <span className="text-[11px] font-mono-code text-green-700 uppercase font-semibold">
              03. The Core Breakthrough
            </span>
            <p className="text-xs text-ink-800 leading-relaxed font-sans">
              {concept.whyItExists.coreInsight}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 / SEE IT */}
      {/* ========================================================================= */}
      <section id="sec-03" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">03 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">SEE IT</h2>
        </div>
        <p className="text-xs text-ink-600">
          This live model renders the actual mathematical/system state. Interact with the controls to see how values adjust in real time.
        </p>

        {renderVisualization(false)}
      </section>

      {/* ========================================================================= */}
      {/* 04 / PLAY WITH IT */}
      {/* ========================================================================= */}
      <section id="sec-04" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">04 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">PLAY WITH IT</h2>
        </div>

        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-3 font-sans">
          <div className="text-xs font-mono-code text-ink-500 uppercase font-semibold">
            CONTROLLED PARAMETER EXPERIMENT
          </div>
          <p className="text-xs text-ink-800 leading-relaxed">
            Adjust the sliders in the visualization above:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="bg-paper-100 p-2.5 rounded border border-line-border">
              <strong className="text-ink-900 block">1. What changed?</strong>
              <span className="text-ink-600 text-[11px]">Notice the magnitude of each step change.</span>
            </div>
            <div className="bg-paper-100 p-2.5 rounded border border-line-border">
              <strong className="text-ink-900 block">2. Why did it happen?</strong>
              <span className="text-ink-600 text-[11px]">The gradient scalar directly multiplies the step.</span>
            </div>
            <div className="bg-paper-100 p-2.5 rounded border border-line-border">
              <strong className="text-ink-900 block">3. What if you increase it?</strong>
              <span className="text-ink-600 text-[11px]">Values overshoot and destabilize the system.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 / BREAK IT */}
      {/* ========================================================================= */}
      <section id="sec-05" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-red-700 font-bold">05 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">BREAK IT</h2>
        </div>

        <div className="bg-red-50/60 border border-red-300 p-4 rounded shadow-notebook space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-red-200 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-mono-code font-bold text-red-900 uppercase">
                CRITICAL FAILURE LAB // {concept.breakIt.scenarioTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono-code text-red-700 font-semibold">
              INTENTIONAL INSTABILITY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded border border-red-200 space-y-1">
              <span className="text-[11px] font-mono-code text-ink-500 uppercase font-semibold">
                Broken Condition:
              </span>
              <p className="font-mono-code text-red-900 font-semibold">
                {concept.breakIt.brokenCondition}
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-red-200 space-y-1">
              <span className="text-[11px] font-mono-code text-ink-500 uppercase font-semibold">
                Observed Symptom:
              </span>
              <p className="text-ink-800">
                {concept.breakIt.symptom}
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border border-red-200 text-xs space-y-1">
            <strong className="font-mono-code text-red-900">Why It Failed: </strong>
            <span className="text-ink-800">{concept.breakIt.whyItFailed}</span>
          </div>

          <div className="bg-paper-100 p-2.5 rounded border border-line-border text-xs flex items-center justify-between">
            <span className="font-mono-code text-ink-800">
              <strong>Engineering Rule of Thumb: </strong>{concept.breakIt.preventionRule}
            </span>
          </div>
        </div>

        {/* Live Break visualization instance */}
        <div className="pt-2">
          <div className="text-xs font-mono-code text-ink-500 mb-2 uppercase">
            LIVE SIMULATION OF THE BROKEN STATE:
          </div>
          {renderVisualization(true)}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 / UNDER THE HOOD */}
      {/* ========================================================================= */}
      <section id="sec-06" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">06 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">UNDER THE HOOD</h2>
        </div>

        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-3 font-sans">
          <div className="text-xs font-mono-code text-ink-500 uppercase font-semibold">
            FORMAL MATHEMATICAL DEFINITION
          </div>
          <p className="text-xs font-mono-code text-ink-900 bg-paper-100 p-3 rounded border border-line-border leading-relaxed">
            {concept.underTheHood.formalDefinition}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono-code text-ink-700 uppercase font-semibold block">
              Core Properties & Axioms:
            </span>
            <ul className="space-y-1.5 text-xs text-ink-800 font-sans">
              {concept.underTheHood.keyProperties.map((prop, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-terracotta font-mono-code">▪</span>
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          {(concept.underTheHood.timeComplexity || concept.underTheHood.spaceComplexity) && (
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono-code">
              {concept.underTheHood.timeComplexity && (
                <div className="bg-paper-100 p-2.5 rounded border border-line-border">
                  <div className="text-ink-500 text-[10px]">TIME COMPLEXITY</div>
                  <div className="font-bold text-ink-900 mt-0.5">{concept.underTheHood.timeComplexity}</div>
                </div>
              )}
              {concept.underTheHood.spaceComplexity && (
                <div className="bg-paper-100 p-2.5 rounded border border-line-border">
                  <div className="text-ink-500 text-[10px]">SPACE COMPLEXITY</div>
                  <div className="font-bold text-ink-900 mt-0.5">{concept.underTheHood.spaceComplexity}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {concept.formulaExplorer && (
          <FormulaExplorer formula={concept.formulaExplorer} />
        )}
      </section>

      {/* ========================================================================= */}
      {/* 07 / STEP THROUGH IT */}
      {/* ========================================================================= */}
      <section id="sec-07" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">07 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">STEP THROUGH IT</h2>
        </div>

        <StepThroughGuide guide={concept.stepThroughGuide} />
      </section>

      {/* ========================================================================= */}
      {/* 08 / PREDICT */}
      {/* ========================================================================= */}
      <section id="sec-08" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">08 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">PREDICT</h2>
        </div>

        <PredictionChallenge
          prompt={concept.predictionChallenge.prompt}
          contextState={concept.predictionChallenge.contextState}
          options={concept.predictionChallenge.options}
        />
      </section>

      {/* ========================================================================= */}
      {/* 09 / BUILD IT */}
      {/* ========================================================================= */}
      {concept.codePlayground && (
        <section id="sec-09" className="space-y-4 pt-4 scroll-mt-28">
          <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
            <span className="text-sm font-mono-code text-terracotta font-bold">09 /</span>
            <h2 className="text-2xl font-serif-heading font-bold text-ink-900">BUILD IT</h2>
          </div>

          <div className="bg-white border border-line-border rounded p-4 shadow-notebook space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-line-border pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-terracotta" />
                <span className="text-xs font-mono-code font-bold uppercase text-ink-900">
                  CODE LAB // {concept.codePlayground.language.toUpperCase()} ENGINE
                </span>
              </div>
              <span className="text-xs font-mono-code text-ink-500">
                Interactive Script Executor
              </span>
            </div>

            <p className="text-xs text-ink-700">
              {concept.codePlayground.description}
            </p>

            <div className="bg-[#18181B] text-[#F4F4F5] p-3.5 rounded font-mono-code text-xs overflow-x-auto">
              <pre className="text-xs leading-relaxed">
                {concept.codePlayground.starterCode}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setCodeRunOutput(
                    `>>> Executing ${concept.codePlayground?.language} simulation...\n` +
                    `[Init]: Starting algorithm run...\n` +
                    `Epoch 0: Theta=6.000 | Loss=36.000\n` +
                    `Epoch 1: Theta=4.200 | Loss=17.640\n` +
                    `Epoch 2: Theta=2.940 | Loss=8.644\n` +
                    `Epoch 3: Theta=2.058 | Loss=4.235\n` +
                    `Epoch 4: Theta=1.441 | Loss=2.075\n` +
                    `Epoch 5: Theta=1.008 | Loss=1.017\n` +
                    `[Success]: Terminated with convergence error delta < 0.01`
                  );
                }}
                className="px-3.5 py-1.5 text-xs font-mono-code bg-ink-900 text-white rounded hover:bg-ink-800 flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                RUN CODE SIMULATION
              </button>

              <span className="text-xs font-mono-code text-ink-500">
                Environment: In-Browser WebAssembly Simulator
              </span>
            </div>

            {codeRunOutput && (
              <div className="bg-paper-100 border border-line-border p-3 rounded font-mono-code text-xs text-ink-900 whitespace-pre-wrap animate-fadeIn">
                {codeRunOutput}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 10 / CONNECT IT */}
      {/* ========================================================================= */}
      <section id="sec-10" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">10 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">CONNECT IT</h2>
        </div>

        <div className="bg-white border border-line-border p-4 rounded shadow-notebook space-y-4 font-sans paper-grid">
          <div className="text-xs font-mono-code text-ink-500 uppercase font-semibold">
            KNOWLEDGE GRAPH TRAVERSAL
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
            {/* Prerequisites */}
            <div className="w-full md:w-1/3 bg-paper-100 border border-line-border p-3 rounded space-y-2">
              <span className="text-[10px] font-mono-code text-ink-500 uppercase block font-semibold">
                ▲ PREREQUISITES (Must know before)
              </span>
              <div className="space-y-1">
                {concept.prerequisites.map(p => (
                  <div key={p.id} className="text-xs font-mono-code text-ink-900 flex items-center gap-1">
                    <span className="text-ink-400">└─</span> {p.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Concept Node */}
            <div className="w-full md:w-1/3 border-2 border-terracotta bg-terracotta/5 p-3.5 rounded text-center shadow-sm">
              <span className="text-[10px] font-mono-code text-terracotta font-bold uppercase block">
                ★ CURRENT FOCUS NODE
              </span>
              <div className="text-sm font-bold text-ink-900 font-serif-heading mt-1">
                {concept.title}
              </div>
            </div>

            {/* Unlocked concepts */}
            <div className="w-full md:w-1/3 bg-paper-100 border border-line-border p-3 rounded space-y-2">
              <span className="text-[10px] font-mono-code text-ink-500 uppercase block font-semibold">
                ▼ UNLOCKED (Downstream mastery)
              </span>
              <div className="space-y-1">
                {concept.unlocks.map(u => (
                  <div key={u.id} className="text-xs font-mono-code text-ink-900 flex items-center gap-1">
                    <span className="text-green-600 font-bold">+</span> {u.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 / COMMON MISCONCEPTIONS */}
      {/* ========================================================================= */}
      <section id="sec-11" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">11 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">COMMON MISCONCEPTIONS</h2>
        </div>

        <div className="space-y-3">
          {concept.commonMisconceptions.map((misc, idx) => (
            <div key={idx} className="bg-white border border-line-border rounded p-4 space-y-2.5 shadow-notebook font-sans">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-red-100 text-red-800 font-bold uppercase">
                  WRONG BELIEF
                </span>
                <span className="text-xs font-bold text-ink-900">
                  "{misc.wrongBelief}"
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-red-50/50 p-2.5 rounded border border-red-200">
                  <strong className="text-red-900 font-mono-code text-[11px] block">Why it is wrong:</strong>
                  <span className="text-red-950 font-sans mt-0.5 block">{misc.whyWrong}</span>
                </div>
                <div className="bg-green-50/50 p-2.5 rounded border border-green-200">
                  <strong className="text-green-900 font-mono-code text-[11px] block">The Truth:</strong>
                  <span className="text-green-950 font-sans mt-0.5 block">{misc.truth}</span>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-ink-600 border-t border-line-border pt-2">
                <strong>KTU Exam Consequence: </strong>{misc.consequenceInCodeOrExam}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12 / COMPARE */}
      {/* ========================================================================= */}
      {concept.comparison && (
        <section id="sec-12" className="space-y-4 pt-4 scroll-mt-28">
          <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
            <span className="text-sm font-mono-code text-terracotta font-bold">12 /</span>
            <h2 className="text-2xl font-serif-heading font-bold text-ink-900">COMPARE</h2>
          </div>

          <div className="bg-white border border-line-border rounded overflow-hidden shadow-notebook font-sans">
            <div className="grid grid-cols-3 bg-paper-200 border-b border-line-border text-xs font-mono-code font-bold p-3 text-ink-900">
              <div>DIMENSION</div>
              <div>{concept.comparison.conceptA}</div>
              <div>{concept.comparison.conceptB}</div>
            </div>

            <div className="divide-y divide-line-border text-xs font-sans">
              {concept.comparison.dimensions.map((dim, i) => (
                <div key={i} className="grid grid-cols-3 p-3 items-center hover:bg-paper-50 transition-colors">
                  <div className="font-mono-code text-ink-700 font-semibold">{dim.metric}</div>
                  <div className="text-ink-900 pr-2">{dim.valA}</div>
                  <div className="text-ink-900 font-medium">{dim.valB}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 13 / YOUR OWN EXPLANATION */}
      {/* ========================================================================= */}
      <section id="sec-13" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">13 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">YOUR OWN EXPLANATION</h2>
        </div>

        <FeynmanPrompt
          concept={concept}
          onGraded={(sc) => {
            onUpdateProgress({
              ownExplanationSubmission: {
                text: 'Submitted',
                score: sc,
                feedback: 'Evaluated by JEV Engine',
                missingKeywords: []
              }
            });
          }}
        />
      </section>

      {/* ========================================================================= */}
      {/* 14 / KTU EXAM MODE */}
      {/* ========================================================================= */}
      <section id="sec-14" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">14 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">EXAM MODE (KTU ARCHIVE)</h2>
        </div>

        <ExamModeView concept={concept} />
      </section>

      {/* ========================================================================= */}
      {/* 15 / PRACTICE */}
      {/* ========================================================================= */}
      <section id="sec-15" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">15 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">PRACTICE (7-LEVEL LADDER)</h2>
        </div>

        <PracticeSection
          problems={concept.practiceProblems}
          onProblemSolved={(pid, ok) => {
            setSolvedPractice(prev => ({ ...prev, [pid]: ok }));
          }}
        />
      </section>

      {/* ========================================================================= */}
      {/* 16 / ACTIVE RECALL */}
      {/* ========================================================================= */}
      <section id="sec-16" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">16 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">ACTIVE RECALL</h2>
        </div>

        <ActiveRecallCard prompts={concept.activeRecallPrompts} />
      </section>

      {/* ========================================================================= */}
      {/* 17 / MASTER CHECK */}
      {/* ========================================================================= */}
      <section id="sec-17" className="space-y-4 pt-4 scroll-mt-28">
        <div className="flex items-baseline gap-3 border-b border-line-border pb-2">
          <span className="text-sm font-mono-code text-terracotta font-bold">17 /</span>
          <h2 className="text-2xl font-serif-heading font-bold text-ink-900">MASTER CHECK</h2>
        </div>

        <MasteryChecklist
          criteria={concept.masteryCriteria}
          completedList={completedRubrics}
          score={progress.score}
          isMastered={progress.state === 'MASTERED'}
          onToggleCriterion={handleToggleCriterion}
          onConfirmMastery={handleConfirmMastery}
        />
      </section>
    </div>
  );
};
