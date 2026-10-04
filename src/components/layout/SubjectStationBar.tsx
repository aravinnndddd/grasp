import React from 'react';
import { ktuS5CseCurriculum } from '../../data/ktu-s5-cse';
import { BookOpen, Check } from 'lucide-react';

interface SubjectBarProps {
  currentSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  className?: string;
}

export const SubjectStationBar: React.FC<SubjectBarProps> = ({
  currentSubjectId,
  onSelectSubject,
  className = ''
}) => {
  // Primary core courses
  const primaryCodes = ['PCCST503', 'PCCST501', 'PCCST502', 'PECST522', 'PBCST504', 'PCCST501-FLAT'];
  const primarySubjects = ktuS5CseCurriculum.subjects.filter(s => 
    primaryCodes.includes(s.code) || ['pccst503', 'pccst501', 'pccst502', 'pecst522', 'pbcst504', 'cst-301-flat'].includes(s.id)
  );
  
  const allSubjects = ktuS5CseCurriculum.subjects;
  const activeSubject = allSubjects.find(s => s.id === currentSubjectId) || allSubjects[0];

  return (
    <div className={`bg-paper-200/90 border-b border-line-border py-2 px-3 sm:px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-mono-code">
        
        {/* Left: Active Subject Indicator & One-Click Switcher Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full lg:w-auto">
          <span className="text-ink-500 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden xs:inline">SUBJECT:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {primarySubjects.slice(0, 6).map(sub => {
              const isSelected = sub.id === currentSubjectId;
              let shortTag = 'PAPER';
              if (sub.code === 'PCCST503') shortTag = 'ML';
              else if (sub.code === 'PCCST501') shortTag = 'CN';
              else if (sub.code === 'PCCST502') shortTag = 'DAA';
              else if (sub.code === 'PECST522') shortTag = 'AI';
              else if (sub.code === 'PBCST504') shortTag = 'MCU';
              else if (sub.code.includes('301') || sub.id.includes('flat')) shortTag = 'FLAT';

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-ink-900 text-white font-bold shadow-xs'
                      : 'bg-white text-ink-700 border border-line-border hover:border-terracotta hover:text-ink-900'
                  }`}
                  title={`${sub.code}: ${sub.title}`}
                >
                  <span className={isSelected ? 'text-terracotta font-bold' : 'text-ink-400 font-semibold'}>
                    [{shortTag}]
                  </span>
                  <span>{sub.title.split(' ')[0]}</span>
                  {isSelected && <Check className="w-2.5 h-2.5 text-lab-success ml-0.5" />}
                </button>
              );
            })}

            {/* Comprehensive Dropdown for All 15 Papers */}
            <select
              value={currentSubjectId}
              onChange={(e) => {
                if (e.target.value) onSelectSubject(e.target.value);
              }}
              className="bg-white border border-line-border rounded px-2.5 py-1 text-xs font-mono-code font-semibold text-ink-800 hover:border-terracotta cursor-pointer shrink-0 max-w-[130px] sm:max-w-none truncate"
            >
              {allSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  [{sub.code}] {sub.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Active subject feedback */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-ink-600 font-mono-code shrink-0">
          <span className="text-ink-400">Active Course:</span>
          <span className="font-bold text-ink-900 bg-white px-2 py-0.5 border border-line-border rounded-xs">
            {activeSubject.code} — {activeSubject.title}
          </span>
        </div>

      </div>
    </div>
  );
};
