export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full sm:w-72 max-w-xs mx-auto hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
      <Icon className="text-[#007768] text-4xl sm:text-5xl mb-3 sm:mb-4 mx-auto" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
    </div>
  );
}
