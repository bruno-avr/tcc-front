import React, { useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import requester from "../../../services/Requester/Requester";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "../../../context/AppContext";
import ClassAPI from "../../../services/API/ClassAPI";
import GradeAPI from "../../../services/API/GradeAPI";

export default function AddModal({ getData }) {
  const { isAddModalOpen, closeAddModal } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState({});
  const [section, setSection] = useState(null);
  const [grades, setGrades] = useState([]);

  async function getNames() {
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getNames();
      setGrades(response);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    setSelectedGrade({});
    setSection("");
    getNames();
  }, [isAddModalOpen]);

  const handleAddGrade = async () => {
    setLoading(true);
    try {
      const classApi = new ClassAPI(requester);
      await classApi.addClass({
        section,
        gradeId: selectedGrade.id,
      });
      await getData();
      closeAddModal();
      toast.success("Nova turma adicionada com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  function getClassName() {
    let className = "";
    if (selectedGrade.name) className += selectedGrade.name;
    if (selectedGrade.name && section) className += " - ";
    if (section) className += section;
    return className;
  }

  return (
    <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth>
      <DialogTitle>Adicionar Turma</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl required fullWidth sx={{ mt: 1 }}>
              <InputLabel id="grade-label">Série</InputLabel>
              <Select
                labelId="grade-label"
                id="grade"
                value={selectedGrade.name}
                label="Série"
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                }}
              >
                {grades.map((grade) => (
                  <MenuItem key={grade.name} value={grade}>
                    {grade.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="section"
              label="Código da Turma"
              type="text"
              fullWidth
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              id="section"
              label="Nome da Turma (preenchido automáticamente)"
              type="text"
              fullWidth
              value={getClassName()}
              onChange={(e) => setSection(e.target.value)}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAddModal}>Cancelar</Button>
        <LoadingButton
          onClick={handleAddGrade}
          variant="contained"
          color="success"
          loading={loading}
          startIcon={<AddIcon />}
        >
          Adicionar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
