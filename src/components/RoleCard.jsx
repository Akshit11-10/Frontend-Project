import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Role card component for displaying interview roles with dark theme
const RoleCard = ({ icon: Icon, title, description, role, delay = '', isActive, onClick }) => {
  const Wrapper = onClick ? 'div' : Link;
  const wrapperProps = onClick
    ? { onClick, role: 'button', tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter') onClick(); } }
    : { to: `/interview?role=${encodeURIComponent(role)}` };

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative flex flex-col p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl
        ${isActive
          ? 'bg-blue-600/12 border-blue-500/55 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/70 border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-700/60'
        } ${delay}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
            ${isActive
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/25'
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}
          >
            <Icon className="h-6 w-6 text-white group-hover:animate-pulse" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300
            ${isActive ? 'text-blue-300' : 'text-white group-hover:text-blue-300'}`}
          >
            {title}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors duration-300
            ${isActive ? 'text-blue-400/70' : 'text-slate-400 group-hover:text-slate-300'}`}
          >
            {description}
          </p>
        </div>
        <ArrowRight className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-blue-400 -rotate-45' : 'text-slate-600 group-hover:text-blue-400 group-hover:translate-x-2 group-hover:-rotate-6'}`} />
      </div>

      {isActive && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-sm animate-scaleIn">
          <ArrowRight className="h-3 w-3 text-white -rotate-45" />
        </span>
      )}
    </Wrapper>
  );
};

export default RoleCard;
