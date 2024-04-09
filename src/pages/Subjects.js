import React, { useEffect, useState } from "react";
import SubjectAPI from "../services/API/SubjectAPI";
import requester from "../services/Requester/Requester";

import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);

  async function getSubjects() {
    try {
      const subjectApi = new SubjectAPI(requester);
      const response = await subjectApi.getSubjects();
      setSubjects(response);
      return response;
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  }

  useEffect(() => {
    getSubjects();
  });

  return (
    <div>
      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {subject.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
