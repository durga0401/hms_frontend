const Card = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  padding = "default",
  rounded = "2xl",
}) => {
  const variants = {
    default: "bg-white border border-gray-100",
    elevated: "bg-white shadow-soft-lg",
    outlined: "bg-white border-2 border-gray-200",
    glass: "bg-white/70 backdrop-blur-lg border border-white/20",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100",
    dark: "bg-gray-900 text-white border border-gray-800",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const roundedSizes = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`
        ${variants[variant]} 
        ${paddings[padding]} 
        ${roundedSizes[rounded]}
        shadow-soft
        ${hover ? "transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
