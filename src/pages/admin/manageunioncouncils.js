import { useEffect, useState } from "react";
import { Table, Button, Input } from "reactstrap";
import AdminLayout from "@/components/layout/AdminLayout";

const ManageUnionCouncils = () => {
  const [unionCouncils, setUnionCouncils] = useState([]);
  const [editCouncilId, setEditCouncilId] = useState(null);
  const [editCouncilName, setEditCouncilName] = useState("");

  // Fetch all Union Councils from API
  useEffect(() => {
    const fetchUnionCouncils = async () => {
      try {
        const res = await fetch("/api/union-councils");
        const data = await res.json();
        setUnionCouncils(data);
      } catch (error) {
        console.error("Error fetching union councils:", error);
      }
    };

    fetchUnionCouncils();
  }, []);

  // Handle Delete operation
  const handleDelete = async (councilId) => {
    try {
      const res = await fetch(`/api/union-councils/${councilId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUnionCouncils(
          unionCouncils.filter((council) => council._id !== councilId)
        );
      } else {
        console.error("Error deleting union council");
      }
    } catch (error) {
      console.error("Error deleting union council:", error);
    }
  };

  // Handle Edit operation
  const handleEdit = (council) => {
    setEditCouncilId(council._id);
    setEditCouncilName(council.name);
  };

  // Save the edited council name via API
  const handleSave = async (councilId) => {
    try {
      const res = await fetch(`/api/union-councils/${councilId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editCouncilName }),
      });

      if (res.ok) {
        setUnionCouncils(
          unionCouncils.map((council) =>
            council._id === councilId
              ? { ...council, name: editCouncilName }
              : council
          )
        );
        setEditCouncilId(null);
        setEditCouncilName("");
      } else {
        console.error("Error updating union council");
      }
    } catch (error) {
      console.error("Error updating union council:", error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2>Manage Union Councils</h2>
        <Table striped>
          <thead>
            <tr>
              <th>Union Council</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unionCouncils.map((council) => (
              <tr key={council._id}>
                <td>
                  {editCouncilId === council._id ? (
                    <Input
                      type="text"
                      value={editCouncilName}
                      onChange={(e) => setEditCouncilName(e.target.value)}
                    />
                  ) : (
                    council.name
                  )}
                </td>
                <td>
                  {editCouncilId === council._id ? (
                    <Button
                      color="success"
                      onClick={() => handleSave(council._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button color="primary" onClick={() => handleEdit(council)}>
                      Edit
                    </Button>
                  )}
                  <Button
                    color="danger"
                    onClick={() => handleDelete(council._id)}
                    className="ms-2"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageUnionCouncils;
