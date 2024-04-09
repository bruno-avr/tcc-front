import React from "react";

import { Grid, Card, CardContent, Typography } from "@mui/material";

const GradeCardGrid = ({ grades }) => {
  return (
    <Grid container spacing={3}>
      {grades.map((grade) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={grade.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                {grade.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subjects: {grade.subjects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes: {grade.classes.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const grades = [
  {
    id: "1",
    name: "Grade 1",
    subjects: [
      { id: "1", name: "Math" },
      { id: "2", name: "Science" },
    ],
    classes: [
      { id: "1", name: "Class A" },
      { id: "2", name: "Class B" },
    ],
  },
  {
    id: "2",
    name: "Grade 2",
    subjects: [
      { id: "3", name: "History" },
      { id: "4", name: "Geography" },
    ],
    classes: [
      { id: "3", name: "Class C" },
      { id: "4", name: "Class D" },
    ],
  },
];

export default function Grades() {
  return (
    <div>
      <GradeCardGrid grades={grades} />
    </div>
  );
}
