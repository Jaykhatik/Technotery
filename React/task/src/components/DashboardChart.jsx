import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 200 },
  { name: "May", sales: 700 },
];

function DashboardChart() {
  return (
    <div className="card">
      <h3>Sales Overview</h3>

      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
      </LineChart>
    </div>
  );
}

export default DashboardChart;