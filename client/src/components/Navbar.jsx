import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">TVR DeployStack</h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400">
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;