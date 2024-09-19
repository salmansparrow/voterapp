import { useEffect, useState } from "react";
import { Table, Button, Input, FormGroup, Label, Row, Col } from "reactstrap";
import AdminLayout from "@/components/layout/AdminLayout";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPassword, setEditUserPassword] = useState(""); // State for new password

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditUserEmail(user.email);
    setEditUserPassword(""); // Reset new password field on edit
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/users/${editUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editUserEmail,
          password: editUserPassword || undefined, // Only send new password if it's not empty
        }),
      });
      setUsers(
        users.map((user) =>
          user._id === editUserId ? { ...user, email: editUserEmail } : user
        )
      );
      setEditUserId(null);
      setEditUserEmail("");
      setEditUserPassword(""); // Reset state
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <AdminLayout>
        <div className="container">
          <h2 className="mb-4">Manage Users</h2>
          <Table striped responsive className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editUserId === user._id ? (
                      <FormGroup>
                        <Label for={`email-${user._id}`}>Email</Label>
                        <Input
                          type="email"
                          id={`email-${user._id}`}
                          value={editUserEmail}
                          onChange={(e) => setEditUserEmail(e.target.value)}
                        />
                      </FormGroup>
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editUserId === user._id ? (
                      <FormGroup>
                        <Label for={`password-${user._id}`}>Password</Label>
                        <Input
                          type="password"
                          id={`password-${user._id}`}
                          placeholder="Enter new password (leave empty to keep current)"
                          value={editUserPassword}
                          onChange={(e) => setEditUserPassword(e.target.value)}
                        />
                      </FormGroup>
                    ) : (
                      "********" // Masked password for non-edit mode
                    )}
                  </td>
                  <td>
                    {editUserId === user._id ? (
                      <div className="d-flex flex-column flex-md-row">
                        <Button
                          color="success"
                          onClick={handleSave}
                          className="mb-2 mb-md-0 me-md-2"
                        >
                          Save
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => setEditUserId(null)}
                          className="mb-2 mb-md-0"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column flex-md-row">
                        <Button
                          color="primary"
                          onClick={() => handleEdit(user)}
                          className="mb-2 mb-md-0 me-md-2"
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleDelete(user._id)}
                          className="mb-2 mb-md-0"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </AdminLayout>
    </>
  );
};

export default ManageUsers;
