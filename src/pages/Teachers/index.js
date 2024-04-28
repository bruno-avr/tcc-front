import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
} from "@mui/material";
import TeacherAPI from "../../services/API/TeacherAPI";
import Requester from "../../services/Requester/Requester";
import ViewModal from "./Modals/ViewModal";
import AddModal from "./Modals/AddModal";
import EditModal from "./Modals/EditModal";
import DeleteModal from "./Modals/DeleteModal";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [modalOpen, setModalOpen] = useState(null);

  async function getData() {
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

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen("view");
  };

  useEffect(() => {
    getData();
  });

  return (
    <Grid container spacing={3}>
      {teachers.map((teacher) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                {teacher.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Box sx={{ ml: "auto" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleView(teacher)}
                >
                  Ver mais
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <ViewModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedTeacher={selectedTeacher}
        setSelectedTeacher={setSelectedTeacher}
      />

      <AddModal getData={getData} />

      <EditModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedTeacher={selectedTeacher}
        getData={getData}
      />

      <DeleteModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedTeacher={selectedTeacher}
        getData={getData}
      />
    </Grid>
  );
}
