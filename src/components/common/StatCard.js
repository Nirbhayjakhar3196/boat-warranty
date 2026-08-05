export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "red",
}) {
  const colorMap = {
    red: "from-red-600 to-orange-600 text-red-400 border-red-500/30 shadow-red-500/10",
    emerald: "from-emerald-600 to-teal-600 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10",
    blue: "from-blue-600 to-cyan-600 text-blue-400 border-blue-500/30 shadow-blue-500/10",
    amber: "from-amber-600 to-orange-600 text-amber-400 border-amber-500/30 shadow-amber-500/10",
    purple: "from-purple-600 to-pink-600 text-purple-400 border-purple-500/30 shadow-purple-500/10",
  };

  const activeColor = colorMap[color] || colorMap.red;

  return (
    <div className="glass-panel p-6 rounded-2xl glass-panel-hover flex items-center justify-between relative overflow-hidden group">
      {/* Accent Background Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${activeColor} opacity-10 blur-xl group-hover:opacity-25 transition-opacity`} />

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          {value !== undefined && value !== null ? value : "--"}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1.5 flex items-center">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeColor} flex items-center justify-center shadow-lg border border-white/10`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
