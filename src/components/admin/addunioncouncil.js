import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";

function AddUnionCouncil() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState(null); // State to hold the admin user status
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Check if the admin user is logged in (from localStorage/session)
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (!storedAdmin || !storedAdmin.isAdmin) {
      router.push("/admin/adminloginpage");
    } else {
      setAdmin(storedAdmin);
    }
    setLoading(false); // Stop loading after checking admin status
  }, [router]);

  const handleAddUnionCouncil = async () => {
    if (!admin) {
      alert("You must be logged in as an admin to add a Union Council.");
      return;
    }

    try {
      const response = await fetch("/api/admin/addunioncouncil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Union Council added successfully!");
        setName(""); // Clear the input
      } else {
        alert(data.message || "Error adding Union Council");
      }
    } catch (error) {
      console.error("Error adding Union Council:", error);
      alert("Error adding Union Council: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Optional: Loading state while checking auth
  }

  return (
    <Container className="add-union-council-container py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Add Union Council</h2>
          <Form>
            <FormGroup>
              <Label for="name">Union Council Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                placeholder="Enter Union Council Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <Button color="primary" block onClick={handleAddUnionCouncil}>
              Add Union Council
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddUnionCouncil;
