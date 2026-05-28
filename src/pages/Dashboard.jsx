import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Clock, Target, TrendingUp, Award, Calendar,
  ChevronRight, Code, Server, Layers, Atom, User, Lightbulb,LogOut, Menu, X, Brain
} from 'lucide-react';
import {
  LineChart, Line, PieChart as RePieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ef4444', '#ec4897', '#06b6d4', '#eab308'];

const roleIcons = {
  'Frontend Developer': Code,
  'Backend Developer': Server,
  'Full Stack Developer': Layers,
  'React Developer': Atom,
  'HR Interview': User,
};

const roleColors = {
  'Frontend Developer': 'blue',
  'Backend Developer': 'green',
  'Full Stack Developer': 'purple',
  'React Developer': 'blue',
  'HR Interview': 'orange',
};

const ringClasses = {
  blue: 'ring-blue-500/30',
  green: 'ring-green-500/30',
  purple: 'ring-purple-500/30',
  orange: 'ring-orange-500/30',
};

const performanceSkills = [
  { label: 'Technical Skills', pct: '88%', color: 'bg-blue-500' },
  { label: 'Problem Solving',  pct: '82%', color: 'bg-purple-500' },
  { label: 'Communication',    pct: '91%', color: 'bg-green-500' },
  { label: 'Time Management',  pct: '76%', color: 'bg-orange-500' },
];

const studyTips = [
  'Review explanations for every wrong answer immediately.',
  'Focus on weak topics for 20 min before every next interview.',
  'Aim for 80%+ before moving to the next role.',
  'Track trends — improving scores show your progress is working.',
];


const Dashboard = () => {
  const { user} = useAuth();

  const [interviewHistory, setInterviewHistory] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    bestScore: 0,
    totalTime: 0,
  });

  // Load this user's interview results from localStorage
  useEffect(() => {
    if (!user) return;

    const key = `interviewResults_${user.id}`;
    const results = JSON.parse(localStorage.getItem(key) || '[]');

    if (results.length > 0) {
      const total = results.length;
      const avg = Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / total);
      const best = Math.max(...results.map((r) => r.score || 0));
      const time = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

      setStats({ totalInterviews: total, avgScore: avg, bestScore: best, totalTime: time });
    }

    setInterviewHistory(results);
  }, [user]);

  // Format seconds to "Xm"
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}m`;

  // Get last 5 interviews in reverse order
  const recentInterviews = [...interviewHistory]
    .reverse()
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      role: item.role,
      score: item.score,
      date: item.date,
      icon: roleIcons[item.role] || Code,
      color: roleColors[item.role] || 'blue',
    }));

  // Only use interviews that have a score
  const scoredInterviews = interviewHistory.filter((r) => r.score != null);

  // Data for line chart
  const lineData = scoredInterviews.map((r, i) => ({
    label: `#${i + 1}`,
    score: r.score,
    goal: 80,
  }));

  // Data for pie chart
  const correctAnswers = scoredInterviews.reduce((sum, r) => {
    return sum + Math.round((r.score / 100) * (r.questions?.length || 10));
  }, 0);

  const wrongAnswers = scoredInterviews.reduce((sum, r) => {
    return sum + Math.round(((100 - r.score) / 100) * (r.questions?.length || 10));
  }, 0);

  const pieData = [
    { name: 'Correct',   value: correctAnswers || 1, fill: '#22c55e' },
    { name: 'Incorrect', value: wrongAnswers   || 1, fill: '#ef4444' },
  ];

  // Data for bar chart (last 5)
  const barData = scoredInterviews.slice(-5).map((r) => ({
    role: (r.role || 'R')
      .replace(' Developer', '')
      .replace(' Interview', '')
      .slice(0, 8),
    Score: r.score,
  }));

  return ( 
    
    <div className="min-h-screen bg-[#0a0f1e] py-10 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/4 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Welcome heading */}
        <div className="mb-10 animate-fadeInUp">
          <h1 className="text-3xl font-bold text-white mb-2 animate-gradientShift">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400">Track your interview preparation progress and continue practicing.</p>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Target}     label="Interviews Completed" value={stats.totalInterviews.toString()} color="blue" />
          <StatCard icon={Clock}      label="Total Practice Time"  value={formatTime(stats.totalTime)}      color="purple" />
          <StatCard icon={TrendingUp} label="Average Score"        value={`${stats.avgScore}%`}             color="green" />
          <StatCard icon={Award}      label="Best Score"           value={`${stats.bestScore}%`}            color="orange" />
        </div>

        

        

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Start interview banner */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] rounded-2xl shadow-xl p-8 text-white animate-fadeInUp hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-500 magnetic-hover">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready for another interview?</h2>
                  <p className="text-blue-100 max-w-md text-[15px] leading-relaxed">
                    Practice makes perfect. Start a new mock interview to improve your skills and boost your confidence.
                  </p>
                </div>
                <Link
                  to="/interview"
                  className="flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-xl border border-white/10 text-white font-semibold rounded-xl hover:bg-white/20 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-500 shrink-0 group magnetic-hover"
                >
                  <Play className="h-5 w-5 fill-white/50 group-hover:scale-110 transition-transform duration-300" />
                  Start Interview
                </Link>
              </div>
                    
            </div>

            {/* Recent interviews list */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/10 animate-fadeInUp stagger-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Interviews</h2>
                <Link
                  to="/results"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors duration-300 group magnetic-hover"
                >
                  View All
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {recentInterviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-5">No interviews completed yet.</p>
                  <Link
                    to="/interview"
                    className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group magnetic-hover"
                  >
                    <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    Start Your First Interview
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 magnetic-hover"
                    >
                      <div className={`p-3 rounded-xl bg-slate-700/80 ring-2 ${ringClasses[interview.color]} transition-all duration-300 hover:scale-110`}>
                        <interview.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{interview.role}</h3>
                        <p className="text-sm text-slate-400">{interview.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-white">{interview.score}%</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analytics charts */}
            {scoredInterviews.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/10 animate-fadeInUp stagger-2">
                <h2 className="text-xl font-semibold text-white mb-6">Analytics</h2>

                <div className="space-y-8">

                  {/* Line chart */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Score Progress</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={lineData} margin={{ top: 8, right: 20, left: -10, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#475569" />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#475569" domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 12, color: '#e2e8f0', fontSize: 13 }} itemStyle={{ color: '#60a5fa' }} />
                        <Line type="monotone" dataKey="goal"  name="Goal (80%)" stroke="#475569" strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="score" name="Score"      stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-2 gap-7">

                    {/* Pie chart */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Accuracy Breakdown</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <RePieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                            {CHART_COLORS.map((color, i) => (
                              <Cell key={i} fill={color} fillOpacity={0.85} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 12, color: '#e2e8f0', fontSize: 13 }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Bar chart */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recent Scores by Role</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} margin={{ top: 8, right: 20, left: -10, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="role" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#475569" domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 12, color: '#e2e8f0', fontSize: 13 }} itemStyle={{ color: '#c084fc' }} />
                          <Bar dataKey="Score" radius={[8, 8, 0, 0]}>
                            {barData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">

            {/* Performance bars */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/10 animate-fadeInUp stagger-2">
              <h2 className="text-xl font-semibold text-white mb-6">Performance Summary</h2>
              <div className="space-y-4">
                {performanceSkills.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className="text-sm font-medium text-white">{item.pct}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className={`${item.color} h-2 rounded-full animate-progress`} style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study tips */}
            <div className="bg-gradient-to-br from-blue-900/25 to-indigo-900/20 rounded-2xl shadow-md p-6 border border-blue-800/40 animate-fadeInUp stagger-3 magnetic-hover">
              <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                Study Tips
              </h2>
              <ul className="space-y-3">
                {studyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reminders */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/10 animate-fadeInUp stagger-4">
              <h2 className="text-xl font-semibold text-white mb-5">Reminders</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 bg-blue-900/25 rounded-xl border border-blue-800/40 hover:scale-[1.02] transition-transform duration-300 magnetic-hover">
                  <Calendar className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Practice Session</p>
                    <p className="text-xs text-slate-400">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-purple-900/25 rounded-xl border border-purple-800/40 hover:scale-[1.02] transition-transform duration-300 magnetic-hover">
                  <Target className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Weekly Goal</p>
                    <p className="text-xs text-slate-400">3/5 interviews completed</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;