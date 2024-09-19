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

  useEffect(() => {
    const fetchUnionCouncils = async () => {
      try {
        const response = await fetch("/api/union-councils");
        const data = await response.json();
        setUnionCouncils(data);
      } catch (error) {
        console.error("Error fetching union councils:", error);
      }
    };

    fetchUnionCouncils();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUnionCouncil) {
      alert("Please select a Union Council.");
      return;
    }

    try {
      const response = await fetch(`/api/voters/${selectedUnionCouncil}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        router.push("/user/addvoter");
      } else {
        const errorData = await response.json();
        console.error("Error submitting voter details:", errorData);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <>
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
              id="property"
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
    </>
  );
}

export default AddVoterData;
