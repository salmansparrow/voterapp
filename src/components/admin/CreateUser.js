import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the admin user is logged in
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (!storedAdmin || !storedAdmin.isAdmin) {
      router.push("/admin/adminloginpage");
    } else {
      setAdmin(storedAdmin);
    }
  }, [router]);

  const handleCreateUser = async () => {
    if (!admin) {
      alert("You must be logged in as an admin to create a user.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully!");
      } else {
        alert(data.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  if (admin === null) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="create-user-container py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Create User</h2>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button
              color="primary"
              block
              onClick={handleCreateUser}
              disabled={loading}
            >
              {loading ? "Creating User..." : "Create User"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateUser;
