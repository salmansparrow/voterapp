import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function ManageVoters() {
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editVoter, setEditVoter] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voterToDelete, setVoterToDelete] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await fetch("/api/voters"); // Replace with your actual API
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setVoters(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (voter) => {
    setEditVoter(voter);
    setEditDialogOpen(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteConfirmation = (voter) => {
    setVoterToDelete(voter);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/voters/${voterToDelete._id}`, {
        // Use the admin API for deletion
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting voter");
      console.log("Voter deleted successfully");

      setVoters(voters.filter((voter) => voter._id !== voterToDelete._id));
      setDeleteDialogOpen(false); // Close dialog after deletion
      setVoterToDelete(null); // Reset voterToDelete state
    } catch (error) {
      console.error("Failed to delete voter:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`/api/admin/voters/${editVoter._id}`, {
        // Use the admin API for update
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editVoter),
      });
      if (!response.ok) throw new Error("Error updating voter");

      setVoters(
        voters.map((voter) => (voter._id === editVoter._id ? editVoter : voter))
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update voter:", error);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditVoter({ ...editVoter, [name]: value });
  };

  const filteredVoters = voters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.nic.includes(searchTerm)
  );

  if (loading) return <p>Loading...</p>;

  if (error)
    return <p className="search-voter-error">Error: {error.message}</p>;

  return (
    <>
      <div className="container">
        <TableContainer component={Paper} className="text-center mt-3 py-2">
          <h1>Manage Voters</h1>
        </TableContainer>

        <TableContainer component={Paper} className="mt-5">
          {/* Search Field */}
          <TextField
            label="Search Voters"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-3"
          />

          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>NIC</TableCell>
                <TableCell>Vote Number</TableCell>
                <TableCell>Book Number</TableCell>
                <TableCell>Union Council</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVoters
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((voter) => (
                  <TableRow key={voter._id}>
                    <TableCell>{voter.name}</TableCell>
                    <TableCell>{voter.nic}</TableCell>
                    <TableCell>{voter.voteNumber}</TableCell>
                    <TableCell>{voter.bookNumber}</TableCell>
                    <TableCell>{voter.unionCouncil}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          alignItems: isMobile ? "stretch" : "center",
                          justifyContent: isMobile ? "center" : "flex-start",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginBottom: isMobile ? "10px" : "0" }}
                          onClick={() => handleEdit(voter)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{
                            marginLeft: isMobile ? "0" : "10px",
                          }}
                          onClick={() => handleDeleteConfirmation(voter)} // Use confirmation handler
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVoters.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>

      {/* Edit Dialog */}
      {editVoter && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Voter</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={editVoter.name}
              onChange={handleEditChange}
            />
            <TextField
              label="NIC"
              variant="outlined"
              fullWidth
              margin="normal"
              name="nic"
              value={editVoter.nic}
              onChange={handleEditChange}
            />
            <TextField
              label="Vote Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="voteNumber"
              value={editVoter.voteNumber}
              onChange={handleEditChange}
            />
            <TextField
              label="Book Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="bookNumber"
              value={editVoter.bookNumber}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {voterToDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>
              Are you sure you want to delete voter{" "}
              <strong>{voterToDelete.name}</strong>?
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ManageVoters;
