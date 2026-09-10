import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function DGTChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="realizados" fill="#2563eb" name="Tests" />

        <Bar dataKey="aprobados" fill="#16a34a" name="Aprobados" />
      </BarChart>
    </ResponsiveContainer>
  );
}
