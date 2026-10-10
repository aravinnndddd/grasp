import React, { useState, useEffect } from 'react';
import { ktuS5CseCurriculum, conceptMap, allConceptsList } from './data/ktu-s5-cse';
import { ConceptDetail } from './types/curriculum';
import { StudentProfile, StudentConceptProgress } from './types/learning';
import { HeaderNav } from './components/layout/HeaderNav';
import { SubjectStationBar } from './components/layout/SubjectStationBar';
import { ModuleNotesView } from './components/notes/ModuleNotesView';
import { SubjectPracticeView } from './components/practice/SubjectPracticeView';
import { ExamPrepView } from './components/exam/ExamPrepView';
import { SocraticTutorDrawer } from './components/ai/SocraticTutorDrawer';
import { KnowledgeSearchModal } from './components/search/KnowledgeSearchModal';
import { GroqSettingsModal } from './components/ai/GroqSettingsModal';
import { HeroSection } from './components/home/HeroSection';
import { GitHubRepoImporterModal } from './components/notes/GitHubRepoImporterModal';
import { UploadedNotesVaultView } from './components/notes/UploadedNotesVaultView';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Aravind',
  university: 'KTU',
  scheme: '2024 Scheme',
  branch: 'CSE',
  semester: 'S5',
  streakDays: 6,
  currentSubjectId: 'pccst501',
  currentModuleId: 'mod-1-networks',
  currentConceptId: 'tcp-congestion-control',
  totalTimeMinutes: 240,
  progressMap: {
    'tcp-congestion-control': {
      conceptId: 'tcp-congestion-control',
      state: 'UNDERSTOOD',
      score: { understanding: 85, application: 80, recall: 90, exam: 85, overall: 85 },
      attemptsCount: 3,
      timeSpentSeconds: 1420,
      lastStudiedAt: new Date().toISOString(),
      completedRubrics: ['Can clearly articulate the difference between rwnd and cwnd']
    },
    'gradient-descent': {
      conceptId: 'gradient-descent',
      state: 'UNDERSTOOD',
      score: { understanding: 82, application: 64, recall: 85, exam: 75, overall: 76 },
      attemptsCount: 3,
      timeSpentSeconds: 1420,
      lastStudiedAt: new Date().toISOString(),
      completedRubrics: [
        'Can explain why normal equation fails on massive parameter spaces',
        'Understands mathematical role of the minus sign in -α∇J'
      ]
    },
    'dijkstra-algorithm': {
      conceptId: 'dijkstra-algorithm',
      state: 'INTRODUCED',
      score: { understanding: 70, application: 60, recall: 65, exam: 55, overall: 63 },
      attemptsCount: 1,
      timeSpentSeconds: 650,
      lastStudiedAt: new Date().toISOString(),
      completedRubrics: []
    }
  }
};

// Subject to primary concept mapping
const SUBJECT_PRIMARY_CONCEPT: Record<string, string> = {
  'pccst501': 'tcp-congestion-control',
  'pccst503': 'gradient-descent',
  'pccst502': 'dijkstra-algorithm',
  'pecst522': 'astar-search',
  'pbcst504': 'microcontroller-8051',
  'cst-305-ml': 'gradient-descent',
  'cst-303-cn': 'tcp-congestion-control',
  'cst-306-daa': 'dijkstra-algorithm',
  'cst-308-ai': 'astar-search',
  'cst-307-mpmc': 'microcontroller-8051',
  'cst-301-flat': 'dfa-minimization'
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'HOME' | 'NOTES' | 'UPLOADED' | 'PRACTICE' | 'EXAM'>('HOME');
  const [currentSubjectId, setCurrentSubjectId] = useState<string>('pccst501');
  const [currentConceptId, setCurrentConceptId] = useState<string>('tcp-congestion-control');
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGroqSettingsOpen, setIsGroqSettingsOpen] = useState<boolean>(false);
  const [isGhImportModalOpen, setIsGhImportModalOpen] = useState<boolean>(false);

  // Load profile from localStorage if exists
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('intuition_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_PROFILE;
  });

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('intuition_student_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
  }, [profile]);

  // Global keyboard shortcuts (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsTutorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentConcept: ConceptDetail = conceptMap[currentConceptId] || allConceptsList[0];
  const currentProgress: StudentConceptProgress = profile.progressMap[currentConceptId] || {
    conceptId: currentConceptId,
    state: 'INTRODUCED',
    score: { understanding: 60, application: 50, recall: 60, exam: 50, overall: 55 },
    attemptsCount: 0,
    timeSpentSeconds: 0,
    lastStudiedAt: new Date().toISOString(),
    completedRubrics: []
  };

  const handleSelectSubject = (subjectId: string) => {
    setCurrentSubjectId(subjectId);
    const targetConcept = SUBJECT_PRIMARY_CONCEPT[subjectId];
    if (targetConcept && conceptMap[targetConcept]) {
      setCurrentConceptId(targetConcept);
    }
  };

  const handleSelectConcept = (id: string) => {
    if (conceptMap[id]) {
      setCurrentConceptId(id);
      setCurrentSubjectId(conceptMap[id].subjectId);
      setCurrentTab('NOTES');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 text-ink-900 flex flex-col font-sans selection:bg-terracotta/20 selection:text-terracotta">
      {/* Universal Technical Navigation */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        currentConcept={currentConcept}
        currentSubjectId={currentSubjectId}
        onSelectSubject={handleSelectSubject}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleTutor={() => setIsTutorOpen(!isTutorOpen)}
        onOpenGroqSettings={() => setIsGroqSettingsOpen(true)}
        isTutorOpen={isTutorOpen}
        masteryPercentage={currentProgress.score.overall}
      />

      {/* 100vh Landing Home Page */}
      {currentTab === 'HOME' && (
        <HeroSection
          currentSubjectId={currentSubjectId}
          onSelectSubject={handleSelectSubject}
          currentTab={currentTab}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGhImporter={() => setIsGhImportModalOpen(true)}
        />
      )}

      {/* Prominent S5 CSE Subject Station Bar (Shown on Study Tabs) */}
      {currentTab !== 'HOME' && (
        <SubjectStationBar
          currentSubjectId={currentSubjectId}
          onSelectSubject={handleSelectSubject}
        />
      )}

      {/* Main Workspace Body: Only Notes, Practice, and Exam Qs for the Selected Subject */}
      {currentTab !== 'HOME' && (
        <main id="study-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {currentTab === 'NOTES' && (
          <ModuleNotesView
            initialSubjectId={currentSubjectId}
            onOpenGroqSettings={() => setIsGroqSettingsOpen(true)}
            onSelectSubject={handleSelectSubject}
            onOpenGhImporter={() => setIsGhImportModalOpen(true)}
          />
        )}

        {currentTab === 'UPLOADED' && (
          <UploadedNotesVaultView
            currentSubjectId={currentSubjectId}
            onOpenGroqSettings={() => setIsGroqSettingsOpen(true)}
          />
        )}

        {currentTab === 'PRACTICE' && (
          <SubjectPracticeView
            currentSubjectId={currentSubjectId}
            onSelectSubject={handleSelectSubject}
            onOpenNotes={() => setCurrentTab('NOTES')}
            onOpenExam={() => setCurrentTab('EXAM')}
          />
        )}

        {currentTab === 'EXAM' && (
          <ExamPrepView
            curriculum={ktuS5CseCurriculum}
            onSelectConcept={handleSelectConcept}
            currentSubjectId={currentSubjectId}
            onSelectSubject={handleSelectSubject}
          />
        )}
      </main>
      )}

      {/* Groq AI Configuration Modal */}
      <GroqSettingsModal
        isOpen={isGroqSettingsOpen}
        onClose={() => setIsGroqSettingsOpen(false)}
      />

      {/* Socratic AI Tutor Side Drawer */}
      <SocraticTutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        concept={currentConcept}
        progress={currentProgress}
      />

      {/* Global Knowledge Search Modal */}
      <KnowledgeSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectConcept={handleSelectConcept}
      />

      {/* GitHub Note Repo Importer Modal (like Kurose) */}
      <GitHubRepoImporterModal
        isOpen={isGhImportModalOpen}
        onClose={() => setIsGhImportModalOpen(false)}
        currentSubjectId={currentSubjectId}
        onRepoImported={() => {
          setCurrentTab('NOTES');
          setIsGhImportModalOpen(false);
        }}
      />

      {/* Clean Engineering Footer */}
      <footer className="border-t border-line-border bg-paper-100 py-6 text-center text-xs font-mono-code text-ink-500 space-y-1">
        <div>
          GRASP // APJ Abdul Kalam Technological University (KTU) 2024 Scheme S5 CSE
        </div>
        <div className="text-[11px] text-ink-400">
          "Master concepts from first principles." · Module Notes · Practice Drills · University Exam Blueprints
        </div>
      </footer>
    </div>
  );
};
export default App;
