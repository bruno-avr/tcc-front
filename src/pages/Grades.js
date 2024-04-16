import React, { useContext, useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import GradeAPI from "../services/API/GradeAPI";
import requester from "../services/Requester/Requester";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../context/AppContext";

export default function Grades() {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);
  const [grades, setGrades] = useState([]);
  const [deleteGrade, setDeleteGrade] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [newGradeName, setNewGradeName] = useState("");

  async function getGrades() {
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getGrades();
      setGrades(response);
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getGrades();
  }, []);

  const handleDelete = (grade) => {
    setDeleteGrade(grade);
  };
  const handleCloseDelete = () => {
    setDeleteGrade(null);
  };
  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      const gradeApi = new GradeAPI(requester);
      await gradeApi.deleteGrade(deleteGrade.id);
      await getGrades();
      setDeleteGrade(null);
      toast.success("Série excluída com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoadingDelete(false);
  };

  const handleAddGrade = async () => {
    setLoadingAdd(true);
    try {
      const gradeApi = new GradeAPI(requester);
      await gradeApi.addGrade(newGradeName);
      await getGrades();
      closeAddModal();
      setNewGradeName("");
      toast.success("Nova série adicionada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoadingAdd(false);
  };

  return (
    <Grid container spacing={3}>
      {grades.map((grade) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={grade.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {grade.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Número de turmas: {grade.classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disciplinas:
                <ul>
                  {grade.subjects.map((subject, index) => (
                    <li key={index}>{subject.name}</li>
                  ))}
                </ul>
              </Typography>
            </CardContent>
            <CardActions>
              <Box sx={{ ml: "auto" }}>
                <IconButton>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(grade)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <Dialog open={Boolean(deleteGrade)} onClose={handleCloseDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir a série{" "}
          {deleteGrade && deleteGrade.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <LoadingButton
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            loading={loadingDelete}
          >
            Excluir
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddModalOpen} onClose={closeAddModal}>
        <DialogTitle>Adicionar Série</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newGradeName"
            label="Nome da Série"
            type="text"
            fullWidth
            value={newGradeName}
            onChange={(e) => setNewGradeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddModal}>Cancelar</Button>
          <LoadingButton
            onClick={handleAddGrade}
            variant="contained"
            color="success"
            loading={loadingAdd}
          >
            Adicionar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
