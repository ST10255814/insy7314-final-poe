export default function LoadingButton({
  loading,
  loadingText,
  children,
  type = "submit",
  className = "",
  ...props
}) {
  const defaultClassName =
    "w-full py-2.5 sm:py-3 text-sm sm:text-base rounded-2xl font-semibold text-white bg-gradient-to-r from-[#007768] to-[#005f57] hover:from-[#005f57] hover:to-[#007768] active:scale-95 transition duration-300 flex justify-center items-center shadow-lg hover:shadow-2xl";

  return (
    <button
      type={type}
      disabled={loading}
      className={className || defaultClassName}
      {...props}
    >
      {loading ? (
        <span className="animate-pulse cursor-not-allowed">{loadingText}</span>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
