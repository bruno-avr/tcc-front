import React, { useEffect, useState } from "react";
import ClassAPI from "../../services/API/ClassAPI";
import requester from "../../services/Requester/Requester";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AddModal from "./Modals/AddModal";
import ViewModal from "./Modals/ViewModal";
import EditModal from "./Modals/EditModal";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(null);
  const [selectedClass, setSelectedClass] = useState({});

  async function getData() {
    try {
      const gradeApi = new ClassAPI(requester);
      const response = await gradeApi.getClasses();
      setClasses(response);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleView = (_class) => {
    setSelectedClass(_class);
    setModalOpen("view");
  };

  return (
    <Grid container spacing={3}>
      {classes.map((_class) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={_class.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {`${_class.grade.name} - ${_class.section}`}
              </Typography>
            </CardContent>
            <CardActions>
              <Box sx={{ ml: "auto" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleView(_class)}
                >
                  Ver mais
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <AddModal getData={getData} classes={classes} />
      <ViewModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />
      <EditModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedClass={selectedClass}
        getData={getData}
        classes={classes}
      />
    </Grid>
  );
}
