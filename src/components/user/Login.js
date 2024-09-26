import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/auth/authSlice";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa"; // Icons for social media
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import Link from "next/link";

function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        dispatch(loginSuccess({ token, user }));
        router.push("/"); // Redirect after successful login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100 bg-body-tertiary">
      <div
        className="login-form p-4 shadow bg-white rounded"
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "linear-gradient(90deg, #007bff, #00d4ff)",
        }}
      >
        <h2 className="text-center mb-4">Sign In</h2>

        {/* Display error if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Controlled input for email
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Controlled input for password
              required
            />
          </FormGroup>

          <FormGroup check className="mb-3">
            <Label check>
              <Input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{" "}
              Remember Me
            </Label>
          </FormGroup>

          <Button color="primary" block type="submit" className="mb-3">
            Sign In
          </Button>

          <p className="text-center">
            Not a user?{" "}
            <Link href="/contactus" className="text-black">
              Contact Us
            </Link>
          </p>

          <p className="text-center">Email: truesalman7@gmail.com </p>

          <div className="social-icons d-flex justify-content-center mt-3">
            <Link href="https://facebook.com" target="_blank" className="me-3">
              <FaFacebook size={30} color="#3b5998" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="me-3">
              <FaInstagram size={30} color="#E4405F" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <FaLinkedin size={30} color="#0077B5" />
            </Link>
          </div>
        </Form>
      </div>

      <style jsx>{`
        .login-container {
          background-color: #f8f9fa;
        }
        .login-form {
          width: 100%;
          max-width: 400px;
        }
        .social-icons a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
