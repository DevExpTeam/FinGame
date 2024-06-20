export default function ScoreboardItem({ label, value, bgColor, textColor }) {
  return (
    <div className={`mb-12 w-40 p-4 ${bgColor} rounded-lg shadow-md text-center`}>
      <div className={`text-sm font-semibold ${textColor} mb-1`}>{label}</div>
      <div className={`text-2xl font-extrabold ${textColor}`}>{value}</div>
    </div>
  );
}