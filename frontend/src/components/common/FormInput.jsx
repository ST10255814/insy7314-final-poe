export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
}) {
  return (
    <div>
      <label className="block mb-1 text-sm sm:text-base text-gray-700 font-medium">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#007768] text-base sm:text-lg" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${
            Icon ? "pl-10 sm:pl-12" : "pl-3 sm:pl-4"
          } pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007768] focus:border-[#007768] bg-white/70 transition duration-300`}
        />
      </div>
    </div>
  );
}
