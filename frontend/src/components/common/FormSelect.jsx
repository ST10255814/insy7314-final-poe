export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm sm:text-base font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#007786]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
