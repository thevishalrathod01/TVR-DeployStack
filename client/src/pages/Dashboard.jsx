import { useEffect, useState } from "react";

function Dashboard() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("UP");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchServices = () => {
    fetch("http://localhost:5000/api/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async (e) => {
    e.preventDefault();

    if (editId) {
      await fetch(`http://localhost:5000/api/services/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, status }),
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, status }),
      });
    }

    setName("");
    setStatus("UP");
    fetchServices();
  };

  const deleteService = async (id) => {
    await fetch(`http://localhost:5000/api/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchServices();
  };

  const startEdit = (service) => {
    setEditId(service._id);
    setName(service.name);
    setStatus(service.status);
  };

  const total = services.length;
  const active = services.filter((s) => s.status === "UP").length;
  const down = services.filter((s) => s.status === "DOWN").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <form onSubmit={addService} className="bg-white p-4 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold">
          {editId ? "Edit Service" : "Add Service"}
        </h2>

        <input
          type="text"
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="UP">UP</option>
          <option value="DOWN">DOWN</option>
        </select>

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          {editId ? "Update Service" : "Add Service"}
        </button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2>Total</h2>
          <p className="text-2xl">{total}</p>
        </div>

        <div className="bg-green-100 p-4 shadow rounded">
          <h2>Active</h2>
          <p className="text-2xl text-green-600">{active}</p>
        </div>

        <div className="bg-red-100 p-4 shadow rounded">
          <h2>Down</h2>
          <p className="text-2xl text-red-600">{down}</p>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-4 text-xl">Services</h2>

        <ul className="space-y-2">
          {services.map((service) => (
            <li
              key={service._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{service.name}</span>

              <div className="flex gap-3">
                <span
                  className={
                    service.status === "UP"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {service.status}
                </span>

                <button
                  onClick={() => startEdit(service)}
                  className="bg-yellow-500 text-white px-2 py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteService(service._id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;