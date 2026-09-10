import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#16a34a", "#dc2626"];

export default function DGTSummaryChart({ aprobados, suspendidos }) {
  const data = [
    {
      name: "Aprobados",
      value: aprobados,
    },
    {
      name: "Suspendidos",
      value: suspendidos,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
