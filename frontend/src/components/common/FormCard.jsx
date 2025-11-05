import BackgroundBlobs from "./BackgroundBlobs";

export default function FormCard({
  title,
  children,
  maxWidth = "max-w-md",
  paddingTop = "pt-52",
}) {
  return (
    <div
      className={`min-h-screen flex justify-center items-start relative overflow-hidden bg-gradient-to-br from-gray-50 via-[#d9f3f0] to-[#e6f7f5] ${paddingTop} px-3 sm:px-4 pb-8`}
    >
      <BackgroundBlobs />
      <div className={`relative z-10 w-full ${maxWidth}`}>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#007768]/30 p-5 sm:p-8">
          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#007768] text-center mb-4 sm:mb-6 drop-shadow-sm">
              {title}
            </h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
