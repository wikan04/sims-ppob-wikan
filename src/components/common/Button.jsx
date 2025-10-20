const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyle =
    "w-full py-3 px-4 rounded-md font-semibold transition duration-200";

  const variants = {
    primary: "bg-primary hover:bg-red-600 text-white disabled:bg-gray-300",
    outline:
      "border-2 border-primary text-primary hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
