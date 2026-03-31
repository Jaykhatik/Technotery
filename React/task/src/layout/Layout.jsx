import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";


function Layout({ children }) {
  return (
    <div className="container">
      < Sidebar/>

      <div className="main">
        <Header />

        <div className="content">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;