import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="p-4">{children}</div>
    </div>
  );
}

export default MainLayout;