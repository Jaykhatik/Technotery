import Layout from "../layout/Layout";
import DashboardChart from "../components/DashboardChart";


function Dashboard() {
  return (
    <Layout>
      <h2>Welcome to Dashboard</h2>
      <p>This is your admin panel content.</p>
      <DashboardChart/>
    </Layout>
  );
}

export default Dashboard;