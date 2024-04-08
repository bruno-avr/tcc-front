import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TEACHERS = [
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
  { nome: "teste" },
];

export default function Teachers() {
  const [teachers, setTeachers] = useState(TEACHERS);

  function getFirstLetter(str) {
    if (!str?.length) return "";
    return str[0].toUpperCase();
  }

  return (
    <div>
      <Grid container spacing={2}>
        {teachers.map((teacher) => (
          <Grid item xs={12} sm={6} md={4} key={teacher.nome}>
            <Card key={teacher.nome} sx={{ maxWidth: 345 }}>
              <CardHeader
                avatar={<Avatar>{getFirstLetter(teacher.nome)}</Avatar>}
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={teacher.nome}
                subheader="September 14, 2016"
              />
              <CardMedia
                component="img"
                height="194"
                image="/static/images/cards/paella.jpg"
                alt="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal
                  to cook together with your guests. Add 1 cup of frozen peas
                  along with the mussels, if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Box sx={{ ml: "auto" }}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
