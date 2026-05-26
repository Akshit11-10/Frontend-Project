const StatCard = ({ icon: Icon, label, value, color = 'blue', delay = '' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700/50 animate-fadeInUp ${delay} group cursor-pointer`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <Icon className="h-6 w-6 text-white group-hover:animate-pulse" />
        </div>
        <div>
          <p className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{value}</p>
          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;