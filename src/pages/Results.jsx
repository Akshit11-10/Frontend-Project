import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Trophy,
  CheckCircle,
  XCircle,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Brain,
  ArrowLeft,
  FileText,
  Eye,
} from 'lucide-react';

// Results page - displays interview results and analytics
const Results = () => {
  // Get state passed from interview page
  const location = useLocation();
  const { role, questions, answers, timeSpent } = location.state || {};

  // Local state for expanded cards and review functionality
  const [expandedCards, setExpandedCards] = useState({});
  const [detailedResults, setDetailedResults] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [expandedReviewCards, setExpandedReviewCards] = useState({});

  // Load detailed results from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('aceRoundDetailedResults') || '[]');
    setDetailedResults([...stored].reverse());
  }, []);

  // Show no data message if user hasn't completed an interview
  if (!questions || !answers) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-12">
        <div className="text-center animate-fadeInUp">
          <h1 className="text-2xl font-bold text-white mb-4">No Interview Data Found</h1>
          <p className="text-slate-400 mb-6">
            Complete an interview first to see your results.
          </p>
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Interview
          </Link>
        </div>
      </div>
    );
  }

  // Calculate correct/wrong answers
  let correctCount = 0;
  let wrongCount = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (userAnswer !== undefined && userAnswer !== '') {
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  // Calculate accuracy percentage
  const totalQuestions = questions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // Format time helper function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Toggle card expansion
  const toggleCard = (questionId) => {
    setExpandedCards((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleReviewCard = (questionId) => {
    setExpandedReviewCards((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Get performance message based on accuracy
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { bg: 'bg-green-900/30', border: 'border-green-700' };
    if (accuracy >= 70) return { bg: 'bg-blue-900/30', border: 'border-blue-700' };
    if (accuracy >= 50) return { bg: 'bg-orange-900/30', border: 'border-orange-700' };
    return { bg: 'bg-red-900/30', border: 'border-red-700' };
  };

  const performance = getPerformanceMessage();

  // Show detailed review view
  if (selectedReview) {
    const reviewCorrectCount = selectedReview.questions.reduce((count, q) => {
      const userAnswer = selectedReview.userAnswers[q.id];
      return userAnswer === q.correctAnswer ? count + 1 : count;
    }, 0);

    return (
      <div className="min-h-screen bg-[#0f172a] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Review Header */}
          <div className="mb-8 animate-fadeInUp">
            <button
              onClick={() => setSelectedReview(null)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Results
            </button>
            <h1 className="text-3xl font-bold text-white">Detailed Review</h1>
            <p className="text-slate-400 mt-2">{selectedReview.role} • {selectedReview.date}</p>
          </div>

          {/* Review Score Section */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-1">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Score Circle */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{selectedReview.score}%</p>
                    <p className="text-sm text-blue-100">Score</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 grid grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-green-900/30 rounded-xl border border-green-800/50">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{reviewCorrectCount}</p>
                  <p className="text-sm text-slate-400">Correct</p>
                </div>
                <div className="p-4 bg-red-900/30 rounded-xl border border-red-800/50">
                  <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedReview.questions.length - reviewCorrectCount}</p>
                  <p className="text-sm text-slate-400">Wrong</p>
                </div>
                <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{Math.round((reviewCorrectCount / selectedReview.questions.length) * 100)}%</p>
                  <p className="text-sm text-slate-400">Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-2">
            <h2 className="text-2xl font-bold text-white mb-6">Question Analysis</h2>

            <div className="space-y-4">
              {selectedReview.questions.map((question, index) => {
                const userAnswer = selectedReview.userAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const isAnswered = userAnswer !== undefined && userAnswer !== null;
                const isExpanded = expandedReviewCards[question.id];

                // Determine card border and background colors
                const cardClasses = isAnswered
                  ? isCorrect
                    ? 'border-green-800 bg-green-900/20'
                    : 'border-red-800 bg-red-900/20'
                  : 'border-slate-600 bg-slate-800/30';

                // Determine icon circle colors
                const iconClasses = isAnswered
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-slate-600 text-white';

                return (
                  <div key={question.id} className={`border rounded-xl overflow-hidden transition-all ${cardClasses}`}>
                    {/* Question Header */}
                    <div className="p-4 flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${iconClasses}`}>
                        {isAnswered ? (isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />) : <span className="text-sm font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{question.question}</p>
                        {isAnswered && <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>Your answer: {question.options[userAnswer]}</p>}
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <div className="px-4 pb-4 pl-12">
                      <button
                        onClick={() => toggleReviewCard(question.id)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300 group"
                      >
                        <Brain className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        {isExpanded ? 'Hide' : 'Show'} AI Answer
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {/* Expanded Answer Explanation */}
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/50 animate-fadeInUp">
                          <p className="text-slate-200 mb-2">
                            <span className="font-medium">Correct Option:</span>{' '}
                            <span className="text-green-400 font-medium">{question.options[question.correctAnswer]}</span>
                          </p>
                          <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center animate-fadeInUp stagger-3">
            <button
              onClick={() => setSelectedReview(null)}
              className="flex items-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl shadow-md hover:shadow-lg border border-slate-700 hover:border-blue-500 transition-all"
            >
              <ArrowLeft className="h-5 w-5" /> Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Results View
  return (
    <div className="min-h-screen bg-[#0f172a] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-fadeInUp">
          <Link to="/interview" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Interview
          </Link>
          <h1 className="text-3xl font-bold text-white">Interview Results</h1>
          <p className="text-slate-400 mt-2">{role} • {formatTime(timeSpent || 300)}</p>
        </div>

        {/* Results Summary */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-slate-700/50 animate-fadeInUp stagger-1">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Score Circle */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{accuracy}%</p>
                  <p className="text-sm text-blue-100">Score</p>
                </div>
              </div>
              <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full ${performance.bg} flex items-center justify-center shadow-lg border ${performance.border}`}>
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-green-900/30 rounded-xl border border-green-800/50">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{correctCount}</p>
                <p className="text-sm text-slate-400">Correct</p>
              </div>
              <div className="p-4 bg-red-900/30 rounded-xl border border-red-800/50">
                <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{wrongCount}</p>
                <p className="text-sm text-slate-400">Wrong</p>
              </div>
              <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
                <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{accuracy}%</p>
                <p className="text-sm text-slate-400">Accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Analysis */}
        <div className="bg-[#111827] rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-slate-700/50 animate-fadeInUp stagger-2 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">Question Analysis</h2>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const isAnswered = userAnswer !== undefined && userAnswer !== null;
              const isExpanded = expandedCards[question.id];

              // Determine card border and background colors
              const cardClasses = isAnswered
                ? isCorrect
                  ? 'border-green-800 bg-green-900/20'
                  : 'border-red-800 bg-red-900/20'
                : 'border-slate-600 bg-slate-800/30';

              // Determine icon circle colors
              const iconClasses = isAnswered
                ? isCorrect
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-slate-600 text-white';

              return (
                <div key={question.id} className={`border rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 ${cardClasses}`}>
                  {/* Question Header */}
                  <div className="p-4 flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${iconClasses}`}>
                      {isAnswered ? (isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />) : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{question.question}</p>
                      {isAnswered && <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>Your answer: {question.options[userAnswer]}</p>}
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="px-4 pb-4 pl-12">
                    <button
                      onClick={() => toggleCard(question.id)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300 group"
                    >
                      <Brain className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      {isExpanded ? 'Hide' : 'Show'} AI Answer
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {/* Expanded Answer Explanation */}
                    {isExpanded && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/50 animate-fadeInUp">
                        <p className="text-slate-200 mb-2">
                          <span className="font-medium">Correct Option:</span>{' '}
                          <span className="text-green-400 font-medium">{question.options[question.correctAnswer]}</span>
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Previous Reviews Section */}
        {detailedResults.length > 0 && (
          <div className="bg-[#111827] rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-3">
            <h2 className="text-2xl font-bold text-white mb-6">Previous Result Reviews</h2>

            <div className="space-y-4">
              {detailedResults.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
                  {/* Review Info */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{review.role}</h3>
                      <p className="text-sm text-slate-400">{review.date}</p>
                    </div>
                  </div>

                  {/* Review Score and Action */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{review.score}%</p>
                      <p className="text-xs text-slate-500">Score</p>
                    </div>
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" /> View Detailed Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp stagger-4">
          <Link
            to="/interview"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 group"
          >
            <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Another Interview
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl shadow-md hover:shadow-lg border border-slate-700 hover:border-blue-500 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;