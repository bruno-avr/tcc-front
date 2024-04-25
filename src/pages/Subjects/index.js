import React, { useEffect, useState } from "react";
import SubjectAPI from "../../services/API/SubjectAPI";
import requester from "../../services/Requester/Requester";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Button,
} from "@mui/material";
import ViewModal from "./Modals/ViewModal";
import AddModal from "./Modals/AddModal";
import EditModal from "./Modals/EditModal";
import DeleteModal from "./Modals/DeleteModal";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState({});
  const [modalOpen, setModalOpen] = useState(null);

  async function getData() {
    try {
      const subjectApi = new SubjectAPI(requester);
      const response = await subjectApi.getSubjects();
      setSubjects(response);
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  }

  const handleView = (subject) => {
    setSelectedSubject(subject);
    setModalOpen("view");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid container spacing={3}>
      {subjects.map((subject) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                {subject.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Box sx={{ ml: "auto" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleView(subject)}
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
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />

      <AddModal getData={getData} />

      <EditModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedSubject={selectedSubject}
        getData={getData}
      />

      <DeleteModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedSubject={selectedSubject}
        getData={getData}
      />
    </Grid>
  );
}
