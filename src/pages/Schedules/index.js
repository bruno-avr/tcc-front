import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { styled } from "@mui/system";

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
  padding: theme.spacing(4),
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const Schedules = () => {
  const navigate = useNavigate();

  return (
    <BackgroundBox>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent sx={{ textAlign: "center" }}>
              <AccessTimeIcon color="primary" sx={{ fontSize: 50 }} />
              <Typography variant="h4" gutterBottom>
                Acessar horários
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Visualize seus horários existentes. Clique abaixo para começar a
                explorar os horários disponíveis.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/schedules/view");
                }}
              >
                Acessar
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent sx={{ textAlign: "center" }}>
              <AddCircleIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="h4" gutterBottom>
                Gerar novo horário
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Crie novos horários de forma rápida e fácil. Clique abaixo para
                começar a gerar novos horários.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  navigate("/schedules/generate");
                }}
              >
                Começar
              </Button>
            </CardActions>
          </StyledCard>
        </Grid>
      </Grid>
    </BackgroundBox>
  );
};

export default Schedules;
