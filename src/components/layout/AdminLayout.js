import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse,
} from "reactstrap";
import Link from "next/link"; // Import Link from next/link
import AdminProfile from "../admin/AdminProfile";

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      // Get user details from localStorage/sessionStorage or API
      const storedUser = JSON.parse(localStorage.getItem("admin")); // Use localStorage for session management
      if (!storedUser || !storedUser.isAdmin) {
        router.push("/admin/adminloginpage"); // Redirect if not an admin
      } else {
        setUser(storedUser); // Set the admin user
      }
    };

    fetchAdminData();
  }, [router]);

  const handleSignOut = () => {
    // Clear session data and redirect to login page
    localStorage.removeItem("admin");
    router.push("/admin/adminloginpage");
  };

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/admin">Admin Panel</NavbarBrand>
        {user && (
          <>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <Link href="/admin" passHref>
                    <Button color="link">Home</Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/admin/createuser" passHref>
                    <Button color="link">Add User</Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/admin/addunioncouncil" passHref>
                    <Button color="link">Add Union Council</Button>
                  </Link>
                </NavItem>
                {/* New Navigation Links */}
                <NavItem>
                  <Link href="/admin/manageusers" passHref>
                    <Button color="link">Manage Users</Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/admin/manageunioncouncils" passHref>
                    <Button color="link">Manage Union Councils</Button>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/admin/managevoters" passHref>
                    <Button color="link">Manage Voters</Button>
                  </Link>
                </NavItem>
              </Nav>
              <div className="d-flex align-items-center ms-auto">
                <AdminProfile user={user} /> {/* Display AdminProfile */}
                <Button color="danger" onClick={handleSignOut} className="ms-2">
                  Sign Out
                </Button>
              </div>
            </Collapse>
          </>
        )}
      </Navbar>
      <Container>{children}</Container>
    </div>
  );
};

export default AdminLayout;
