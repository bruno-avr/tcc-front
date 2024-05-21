import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5">Acessar horários</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate("/schedules/view");
              }}
            >
              View Existing
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5">Gerar novo horário</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/schedules/generate");
              }}
            >
              Get Started
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Schedules;
