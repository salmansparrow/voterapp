import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const toggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    // Fetch user information from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setUser(storedUser);
  }, []);

  const handleSignOut = () => {
    // Clear the token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to the login page
    router.push("/user/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" href="#">
            Navbar
          </Link>
          <button
            onClick={toggle}
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarTogglerDemo02"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/user/addvoter">
                  Add Voter Info
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/user/searchvoter">
                  Search Voter Info
                </Link>
              </li>
            </ul>

            {/* User Profile Dropdown */}
            {user ? (
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                className="ms-auto"
              >
                <DropdownToggle tag="button" className="btn btn-secondary">
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                  {user.email || "Profile"}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem disabled>
                    <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                    {user.email || "Profile"}
                  </DropdownItem>
                  <DropdownItem onClick={handleSignOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <span className="text-muted">Not logged in</span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default MainNavbar;
