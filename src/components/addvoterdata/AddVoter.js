import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function AddVoterData() {
  const [unionCouncils, setUnionCouncils] = useState([]);
  const [selectedUnionCouncil, setSelectedUnionCouncil] = useState("");
  const [voterDetails, setVoterDetails] = useState({
    name: "",
    nic: "",
    voteNumber: "",
    bookNumber: "",
  });
  const router = useRouter();

  // Fetch Union Councils when component mounts
  const fetchUnionCouncils = async () => {
    try {
      const response = await fetch("/api/union-councils");
      const data = await response.json();
      setUnionCouncils(data);
    } catch (error) {
      console.error("Error fetching union councils:", error);
    }
  };

  useEffect(() => {
    fetchUnionCouncils();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to log in to add voter details.");
      router.push("/user/login");
      return;
    }

    if (!selectedUnionCouncil) {
      alert("Please select a Union Council.");
      return;
    }

    try {
      const response = await fetch(`/api/voters/${selectedUnionCouncil}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
        body: JSON.stringify(voterDetails),
      });

      if (response.ok) {
        console.log("Voter details submitted successfully.");
        // Clear form fields
        setVoterDetails({
          name: "",
          nic: "",
          voteNumber: "",
          bookNumber: "",
        });
        setSelectedUnionCouncil(""); // Clear the selected UC
        router.push("/user/addvoter"); // Redirect after submission
      } else if (response.status === 401) {
        // If unauthorized (token expired or invalid), clear token and redirect to login
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/user/login");
      } else {
        const errorData = await response.json();
        console.error("Error submitting voter details:", errorData);
        alert("An error occurred while submitting voter details.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container p-5">
      <h2 className="text-center mb-4">Voter Information Form</h2>

      <form onSubmit={handleSubmit}>
        {/* Union Council Dropdown */}
        <div className="mb-3">
          <label htmlFor="unionCouncil" className="form-label">
            Union Council
          </label>
          <select
            className="form-select"
            id="unionCouncil"
            value={selectedUnionCouncil}
            onChange={(e) => setSelectedUnionCouncil(e.target.value)}
            required
          >
            <option value="">Select your Union Council</option>
            {unionCouncils.map((uc) => (
              <option key={uc._id} value={uc._id}>
                {uc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={voterDetails.name}
            onChange={(e) =>
              setVoterDetails({ ...voterDetails, name: e.target.value })
            }
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* NIC Number */}
        <div className="mb-3">
          <label htmlFor="nic" className="form-label">
            NIC Number
          </label>
          <input
            type="text"
            className="form-control"
            id="nic"
            value={voterDetails.nic}
            onChange={(e) =>
              setVoterDetails({ ...voterDetails, nic: e.target.value })
            }
            placeholder="Enter your NIC number"
            required
          />
        </div>

        {/* Vote Number */}
        <div className="mb-3">
          <label htmlFor="voteNumber" className="form-label">
            Vote Number
          </label>
          <input
            type="text"
            className="form-control"
            id="voteNumber"
            value={voterDetails.voteNumber}
            onChange={(e) =>
              setVoterDetails({ ...voterDetails, voteNumber: e.target.value })
            }
            placeholder="Enter your vote number"
            required
          />
        </div>

        {/* Book Number */}
        <div className="mb-3">
          <label htmlFor="bookNumber" className="form-label">
            Book Number
          </label>
          <input
            type="text"
            className="form-control"
            id="bookNumber"
            value={voterDetails.bookNumber}
            onChange={(e) =>
              setVoterDetails({ ...voterDetails, bookNumber: e.target.value })
            }
            placeholder="Enter your book number"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddVoterData;
