import Link from "next/link";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          number,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setNumber("");
        setMessage("");
      } else {
        alert(result.error || "There was an error sending your message.");
      }
    } catch (error) {
      alert("An error occurred while sending your message.");
    }

    setLoading(false);
  };

  return (
    <>
      <section
        className="contactus"
        style={{
          background: "linear-gradient(90deg, #007bff, #00d4ff)",
        }}
      >
        <div className="container">
          <div
            className="login-container d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <div
              className="login-form p-3 shadow bg-white rounded"
              style={{ maxWidth: "400px", width: "100%" }}
            >
              <h2
                className="text-center mb-4"
                style={{
                  background: "linear-gradient(90deg, #007bff, #00d4ff)",
                  color: "white",
                  borderRadius: "5px",
                  padding: "15px",
                  fontWeight: "bold",
                }}
              >
                Contact Us
              </h2>
              {!submitted ? (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="number">Contact No #</Label>
                    <Input
                      type="tel"
                      id="number"
                      name="number"
                      placeholder="Enter Your Contact Number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="message">Message</Label>
                    <Input
                      id="message"
                      name="message"
                      type="textarea"
                      className="textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <Button
                    color="primary"
                    block
                    type="submit"
                    className="mb-3"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit"}
                  </Button>

                  <div
                    className="footer-copyright text-center py-3"
                    style={{
                      background: "linear-gradient(90deg, #007bff, #00d4ff)",
                      color: "white",
                      borderRadius: "5px",
                      padding: "15px",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    <p className="mb-0">
                      © Copyright{" "}
                      <a
                        href="https://salman-three.vercel.app/"
                        style={{ color: "black", textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SALMAN
                      </a>{" "}
                      2024
                    </p>
                    <p className="mb-0">All Rights Reserved</p>
                  </div>
                </Form>
              ) : (
                <div className="text-center">
                  <h4>Thank you for contacting us!</h4>
                  <p>We will get back to you shortly.</p>
                  <Button
                    className="text-decoration-none"
                    style={{
                      background: "linear-gradient(90deg, #007bff, #00d4ff)",
                    }}
                  >
                    <Link href="/user/login" className="text-dark fs-5">
                      Login
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
