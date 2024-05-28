import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import SubjectIcon from "@mui/icons-material/Subject";
import { useNavigate } from "react-router-dom";

const BackgroundBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
  },
}));

const routesData = [
  {
    title: "Horários",
    route: "/schedules",
    Icon: CalendarMonthIcon,
  },
  {
    title: "Professores",
    route: "/teachers",
    Icon: PeopleIcon,
  },
  {
    title: "Séries",
    route: "/grades",
    Icon: SchoolIcon,
  },
  {
    title: "Turmas",
    route: "/classes",
    Icon: ClassIcon,
  },
  {
    title: "Disciplinas",
    route: "/subjects",
    Icon: SubjectIcon,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <BackgroundBox>
      <Grid container spacing={4} justifyContent="center">
        {routesData.map((route) => (
          <Grid item xs={6} md={4}>
            <StyledCard onClick={() => navigate(route.route)}>
              <CardContent sx={{ textAlign: "center" }}>
                <route.Icon color="primary" sx={{ fontSize: 50 }} />
                <Typography variant="h5" gutterBottom>
                  {route.title}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </BackgroundBox>
  );
}
