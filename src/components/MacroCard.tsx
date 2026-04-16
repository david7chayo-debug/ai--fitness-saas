interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  color: "green" | "blue" | "yellow" | "red";
  percentage?: number;
}

const colorMap = {
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
};

const barMap = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export default function MacroCard({ label, value, unit, color, percentage }: MacroCardProps) {
  return (
    <div className={`border rounded-xl p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">
        {value}
        <span className="text-sm font-normal ml-1 opacity-70">{unit}</span>
      </p>
      {percentage !== undefined && (
        <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${barMap[color]} rounded-full transition-all`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
