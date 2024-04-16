import React, { useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Button,
} from "@mui/material";
import GradeAPI from "../../services/API/GradeAPI";
import requester from "../../services/Requester/Requester";
import { toast } from "react-toastify";
import ViewModal from "./Modals/ViewModal";
import EditModal from "./Modals/EditModal";
import AddModal from "./Modals/AddModal";
import DeleteModal from "./Modals/DeleteModal";

export default function Grades() {
  const [grades, setGrades] = useState([]);

  const [selectedGrade, setSelectedGrade] = useState({});
  const [modalOpen, setModalOpen] = useState(null);

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

  const handleView = (grade) => {
    setSelectedGrade(grade);
    setModalOpen("view");
  };

  return (
    <Grid container spacing={3}>
      {grades.map((grade) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={grade.id}>
          <Card on>
            <CardContent>
              <Typography variant="h5" component="div">
                {grade.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Número de turmas: {grade.classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Número de disciplinas: {grade.subjects.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Box sx={{ ml: "auto" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleView(grade)}
                >
                  Ver mais
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <DeleteModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedGrade={selectedGrade}
        getGrades={getGrades}
      />

      <AddModal getGrades={getGrades} />

      <EditModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedGrade={selectedGrade}
        getGrades={getGrades}
      />

      <ViewModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />
    </Grid>
  );
}
