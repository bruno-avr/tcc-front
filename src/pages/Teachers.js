import React, { useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TeacherAPI from "../services/API/TeacherAPI";
import Requester from "../services/Requester/Requester";

export default function Teachers() {
  const [deleteTeacher, setDeleteTeacher] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);
  const [editName, setEditName] = useState("");
  const [teachers, setTeachers] = useState([]);

  async function getTeachers() {
    try {
      const teacherApi = new TeacherAPI(Requester);
      const response = await teacherApi.getTeachers();
      setTeachers(response);
      return response;
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  }

  useEffect(() => {
    getTeachers();
  });

  const handleDelete = (teacher) => {
    setDeleteTeacher(teacher);
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setEditName(teacher.name);
  };

  const handleClose = () => {
    setDeleteTeacher(null);
  };

  const handleCloseEdit = () => {
    setEditTeacher(null);
    setEditName("");
  };

  const handleConfirmDelete = () => {
    console.log("Deleting teacher:", deleteTeacher.name);
    setDeleteTeacher(null);
  };

  const handleConfirmEdit = () => {
    console.log("Editing teacher:", editTeacher.name, "to", editName);
    setEditTeacher(null);
    setEditName("");
  };

  const handleNameChange = (event) => {
    setEditName(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="teacher table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "15%" }}>Nome</TableCell>
                <TableCell>Detalhes</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Excluir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.name}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>
                    This impressive paella is a perfect party dish and a fun
                    meal to cook together with your guests. Add 1 cup of frozen
                    peas along with the mussels, if you like.
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(teacher)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(teacher)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={Boolean(deleteTeacher)} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            {deleteTeacher && deleteTeacher.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={Boolean(editTeacher)} onClose={handleCloseEdit}>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editName}
              onChange={handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button
              onClick={handleConfirmEdit}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}
