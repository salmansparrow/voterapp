import Link from "next/link";
import { Button, Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";

function AdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Fetch the admin user from localStorage (or sessionStorage)
      const storedAdmin = JSON.parse(localStorage.getItem("admin"));

      // If no admin is found, redirect to the login page
      if (!storedAdmin || !storedAdmin.isAdmin) {
        router.push("/admin/adminloginpage");
      } else {
        // Set the admin user and stop the loading state
        setAdmin(storedAdmin);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  // Show a loading state while fetching admin details
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no admin is found, display access denied message
  if (admin === null) {
    return <div>Access Denied</div>;
  }

  return (
    <>
      <AdminLayout>
        <Container className="admin-panel py-5">
          <h1 className="text-center mb-5">Admin Panel</h1>
          <Row className="justify-content-center">
            <Col xs={12} sm={6} md={4} className="mb-3">
              <Link href="/admin/createuser" passHref>
                <Button color="primary" className="adminbutton btn-lg" block>
                  Create User
                </Button>
              </Link>
            </Col>
            <Col xs={12} sm={6} md={4} className="mb-3">
              <Link href="/admin/addunioncouncil" passHref>
                <Button color="secondary" className="adminbutton btn-lg" block>
                  Add Union Council
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </AdminLayout>
    </>
  );
}

export default AdminPanel;
