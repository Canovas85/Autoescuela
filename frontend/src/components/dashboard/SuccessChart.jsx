import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { mes: "Ene", aprobados: 12 },
  { mes: "Feb", aprobados: 18 },
  { mes: "Mar", aprobados: 15 },
  { mes: "Abr", aprobados: 25 },
  { mes: "May", aprobados: 30 },
  { mes: "Jun", aprobados: 28 },
  { mes: "Jul", aprobados: 35 },
  { mes: "Ago", aprobados: 41 },
];

export default function SuccessChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="mes" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="aprobados"
          stroke="#2563eb"
          strokeWidth={4}
          dot={{
            fill: "#2563eb",
            r: 5,
          }}
          activeDot={{
            r: 8,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
