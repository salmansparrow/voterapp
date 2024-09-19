import { useState } from "react";
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

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Add error state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save admin data in localStorage after successful login
        localStorage.setItem("admin", JSON.stringify(data.user));

        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        // Show error message from the server
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container className="admin-login-container py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Admin Login</h2>
          <Form onSubmit={handleLogin}>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button color="primary" block disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLoginPage;
