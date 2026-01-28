const Badge = ({ status = "", className = "" }) => {
  const normalized = status?.toUpperCase();

  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };

  const style = styles[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;
