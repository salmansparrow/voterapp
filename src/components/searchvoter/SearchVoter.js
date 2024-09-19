import { useEffect, useState } from "react";
import { Table } from "reactstrap";

const ITEMS_PER_PAGE = 10; // Number of items per page

function SearchVoter() {
  const [voters, setVoters] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await fetch("/api/voters");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setVoters(data);
        setFilteredVoters(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

  useEffect(() => {
    const results = voters.filter(
      (voter) =>
        voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.nic.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVoters(results);
  }, [searchQuery, voters]);

  const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const paginatedVoters = filteredVoters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p className="search-voter-loading">Loading...</p>;
  if (error)
    return <p className="search-voter-error">Error: {error.message}</p>;

  return (
    <section className="search-voter container">
      <div className="search-voter-container">
        <form className="search-voter-form">
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Search Voter
            </span>
            <input
              type="text"
              className="search-voter-input form-control"
              aria-label="Search Voter"
              aria-describedby="inputGroup-sizing-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name or NIC"
            />
          </div>
        </form>

        <div className="search-voter-table-container ">
          {paginatedVoters.length > 0 ? (
            <>
              <Table
                striped
                responsive
                className="border-black border-5 search-voter-table "
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>NIC Number</th>
                    <th>Vote Number</th>
                    <th>Book Number</th>
                    <th>Union Council</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVoters.map((voter) => (
                    <tr key={voter._id}>
                      <td>{voter.name}</td>
                      <td>{voter.nic}</td>
                      <td>{voter.voteNumber}</td>
                      <td>{voter.bookNumber}</td>
                      <td>{voter.unionCouncil}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((pageNumber) => (
                    <li
                      key={pageNumber + 1}
                      className={`page-item ${
                        currentPage === pageNumber + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber + 1)}
                      >
                        {pageNumber + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <p className="search-voter-no-results">No voters found</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchVoter;
