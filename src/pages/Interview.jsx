import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';

import {
  Clock, ChevronLeft, ChevronRight, AlertTriangle,
  CheckCircle, Circle, Send, ArrowRight,
  Code, Server, Layers, Atom, User,
} from 'lucide-react';
import { questionSets, otherRoles, genericQuestions } from '../data/questions';

// Build the full list of roles (from questionSets + otherRoles, no duplicates)
const allRoles = (() => {
  const mainRoles = Object.keys(questionSets).map((r) => ({ role: r }));
  const extraRoles = otherRoles.map((r) => ({ role: r }));
  const mainRoleNames = new Set(mainRoles.map((r) => r.role));
  const uniqueExtras = extraRoles.filter((r) => !mainRoleNames.has(r.role));
  return [...mainRoles, ...uniqueExtras];
})();

const roleIcons = {
  'Frontend Developer': Code,
  'Backend Developer': Server,
  'Full Stack Developer': Layers,
  'React Developer': Atom,
  'HR Interview': User,
};

const getIcon = (roleName) => roleIcons[roleName] || Code;
const getQuestions = (roleName) => questionSets[roleName] || genericQuestions;

// Card shown in role selection screen
function RoleCard({ role: roleName, isActive, onClick }) {
  const Icon = getIcon(roleName);
  const questionCount = getQuestions(roleName).length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      className={`group relative flex flex-col p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl magnetic-hover parallax-tilt card-glow
        ${isActive
          ? 'bg-blue-600/12 border-blue-500/55 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/50 border-white/10 hover:border-blue-500/40 hover:bg-slate-700/60'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
          ${isActive
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/25'
            : 'bg-slate-700/80 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-purple-600/40'
          }`}
        >
          <Icon className={`h-5 w-5 transition-colors duration-300 group-hover:text-white ${isActive ? 'text-white' : 'text-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold leading-tight transition-colors duration-300 group-hover:text-white ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>
            {roleName}
          </h4>
          <p className={`text-xs mt-0.5 transition-colors duration-300 group-hover:text-slate-400 ${isActive ? 'text-blue-400/70' : 'text-slate-500'}`}>
            {questionCount} question{questionCount !== 1 ? 's' : ''} · 15 min
          </p>
        </div>
      </div>

      {isActive && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-sm animate-scaleIn">
          <ArrowRight className="h-3 w-3 text-white -rotate-45" />
        </span>
      )}
    </div>
  );
}

// Role selection + interview details screen
function InterviewSetup({ selectedRole, onSelectRole, onStart }) {
  return (
    <div className="min-h-screen bg-[#0f172a] py-12 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-[#111827] rounded-2xl shadow-xl p-8 md:p-12 border border-slate-700 animate-fadeInUp">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Interview</h1>
            <p className="text-lg text-slate-300">
              Select a role and begin your mock interview. You&apos;ll have 15 minutes to answer all MCQ questions.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">Select Your Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRoles.map(({ role: roleName }, index) => (
                  <RoleCard
                    key={index}
                    role={roleName}
                    isActive={selectedRole === roleName}
                    onClick={() => onSelectRole(roleName)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">Interview Details:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Duration: 15 minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" /> {getQuestions(selectedRole).length} MCQ questions
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-400" /> Auto-submits when time runs out
                </li>
              </ul>
            </div>

            <button
              onClick={onStart}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 group"
            >
              <Send className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Start Interview
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Active interview screen with timer and questions
function InterviewPlayer({ role, onFinish }) {
  const questions = getQuestions(role);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef(null);

  // Build result object from current state
  const buildResult = useCallback(() => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });

    const score = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

    return {
      role,
      questions,
      answers,
      score,
      correctCount,
      timeSpent: 900 - timeLeft,
      date: new Date().toLocaleDateString(),
    };
  }, [questions, answers, timeLeft, role]);

  // Start countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Show warning at 2 minutes left
  useEffect(() => {
    if (timeLeft === 120) setShowWarning(true);
  }, [timeLeft]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0) onFinish(buildResult());
  }, [timeLeft, onFinish, buildResult]);

  // Save the currently selected option to answers
  const saveCurrentAnswer = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: selectedOption }));
    }
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    onFinish(buildResult());
  };

  // Go to a specific question index and load its saved answer
  const goToQuestion = (index) => {
    saveCurrentAnswer();
    const savedAnswer = answers[questions[index].id];
    setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Timer color based on time left
  const timerStyle =
    timeLeft <= 120 ? 'bg-red-900/50 text-red-300 border-red-800 animate-timerPulse'
    : timeLeft <= 300 ? 'bg-orange-900/30 text-orange-300 border-orange-800'
    : 'bg-blue-900/30 text-blue-300 border-blue-800';

  return (
    <div className="min-h-screen bg-[#0f172a]">

      {showWarning && timeLeft <= 120 && (
        <div className="bg-red-900/50 border-b border-red-800 px-4 py-3 flex items-center justify-center gap-2 animate-fadeInUp">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-red-300 font-medium">Warning: Only {formatTime(timeLeft)} remaining!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 animate-fadeInUp">
          <div>
            <h1 className="text-2xl font-bold text-white">{role} Interview</h1>
            <p className="text-sm text-slate-400">Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${timerStyle}`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
              Submit
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Question area */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-xl shadow-md p-6 md:p-8 border border-slate-700 animate-fadeInUp stagger-1">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-sm font-medium rounded-full mb-4">
                  Multiple Choice
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 card-hover ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        selectedOption === index ? 'bg-blue-500 text-white scale-110' : 'bg-slate-600 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" /> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button onClick={goNext} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                    Next <ChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    Submit Interview <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Progress bar */}
            <div className="bg-[#111827] rounded-xl shadow-md p-6 border border-slate-700 animate-fadeInUp stagger-2">
              <h3 className="font-semibold text-white mb-4">Progress</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Answered</span>
                <span className="font-medium text-white">{answeredCount}/{questions.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question palette */}
            <div className="bg-[#111827] rounded-xl shadow-md p-6 border border-slate-700 animate-fadeInUp stagger-3">
              <h3 className="font-semibold text-white mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      index === currentIndex ? 'bg-blue-600 text-white scale-105'
                      : answers[q.id] !== undefined ? 'bg-green-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-600" /> Current</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-600" /> Answered</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-800" /> Unanswered</div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl shadow-md p-6 border border-blue-800/50 animate-fadeInUp stagger-4">
              <h3 className="font-semibold text-white mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {[
                  'Read questions carefully before answering',
                  'Keep an eye on the timer',
                  'You can navigate between questions',
                  'Review answers before submitting',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Circle className="h-3 w-3 text-blue-400 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Interview() {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'Frontend Developer');
  const [activeRole, setActiveRole] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const { user } = useAuth();

  const startInterview = () => setActiveRole(selectedRole);

  const finishInterview = (result) => {
    try {
      const userId = user?.id;

      // Save summary for Dashboard stats
      const resultsKey = `interviewResults_${userId}`;
      const prevResults = JSON.parse(localStorage.getItem(resultsKey) || '[]');
      const newResult = { ...result, id: Date.now() };
      prevResults.push(newResult);
      localStorage.setItem(resultsKey, JSON.stringify(prevResults));

      // Save detailed data for Results page reviews
      const detailedKey = `aceRoundDetailedResults_${userId}`;
      const prevDetailed = JSON.parse(localStorage.getItem(detailedKey) || '[]');
      prevDetailed.push({
        id: newResult.id,
        role: result.role,
        score: result.score,
        date: result.date,
        questions: result.questions,
        userAnswers: result.answers,
      });
      localStorage.setItem(detailedKey, JSON.stringify(prevDetailed));

    } catch (e) {
      console.error('Failed to save results:', e);
    }
    setRedirect(result);
  };

  if (redirect) return <Navigate to="/results" state={redirect} replace />;

  if (!activeRole) {
    return (
      <InterviewSetup
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onStart={startInterview}
      />
    );
  }

  return <InterviewPlayer role={activeRole} onFinish={finishInterview} />;
}