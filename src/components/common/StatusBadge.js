export default function StatusBadge({ status, type = "warranty" }) {
  if (type === "warranty") {
    const isExpired =
      status === "Expired" ||
      status === false ||
      (typeof status === "string" && status.toLowerCase() === "expired");

    return isExpired ? (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
        Expired
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
        Active
      </span>
    );
  }

  // Repair Status Badge
  const formattedStatus = (status || "Pending").toLowerCase();
  
  const statusStyles = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "in progress": "bg-blue-500/10 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const currentStyle = statusStyles[formattedStatus] || statusStyles.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status || "Pending"}
    </span>
  );
}
