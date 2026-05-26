const FeatureCard = ({ icon: Icon, title, description, delay = '' }) => {
  return (
    <div className={`bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700/50 animate-fadeInUp ${delay} group cursor-pointer`}>
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30">
        <Icon className="h-7 w-7 text-white group-hover:animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{description}</p>
    </div>
  );
};

export default FeatureCard;