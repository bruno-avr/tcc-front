import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import React, { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import SubjectIcon from "@mui/icons-material/Subject";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const drawerWidth = 240;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    }),
  },
}));

const routesData = [
  {
    title: "Início",
    route: "/",
    Icon: HomeIcon,
    hasContainer: true,
  },
  {
    title: "Horários",
    route: "/schedules",
    Icon: CalendarMonthIcon,
    hasContainer: true,
  },
  {
    title: "Acesso de Horários",
    route: "/schedules/view",
    hasContainer: true,
  },
  {
    title: "Gerar novo horário",
    route: "/schedules/generate",
  },
  {
    title: "Professores",
    route: "/teachers",
    Icon: PeopleIcon,
    hasAddButton: true,
    hasContainer: true,
  },
  {
    title: "Prioridades dos professores",
    route: "/teachers/priorities",
  },
  {
    title: "Séries",
    route: "/grades",
    Icon: SchoolIcon,
    hasAddButton: true,
    hasContainer: true,
  },
  {
    title: "Turmas",
    route: "/classes",
    Icon: ClassIcon,
    hasAddButton: true,
    hasContainer: true,
  },
  {
    title: "Disciplinas",
    route: "/subjects",
    Icon: SubjectIcon,
    hasAddButton: true,
    hasContainer: true,
  },
];

export default function Layout({ children }) {
  const { openAddModal } = useContext(AppContext);
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const navigate = useNavigate();

  function goBack() {
    const aux = location.pathname.split("/");
    aux.pop();
    navigate(aux.join("/"));
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <StyledAppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {location.pathname.split("/").length > 2 && (
            <IconButton sx={{ mr: 2 }} color="inherit" onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {
              (
                routesData.find((e) => e.route === location.pathname) ||
                routesData.find(
                  (e) =>
                    e.route ===
                    location.pathname.substring(
                      0,
                      location.pathname.lastIndexOf("/")
                    )
                ) ||
                routesData[0]
              ).title
            }
          </Typography>
          {location.pathname === "/teachers" && (
            <Tooltip title="Prioridades" arrow>
              <IconButton color="inherit" onClick={() => navigate(`${location.pathname }/priorities`)}>
                <BarChartIcon />
              </IconButton>
            </Tooltip>
          )}
          {routesData.find((e) => e.route === location.pathname)
            ?.hasAddButton && (
            <Tooltip title="Adicionar" arrow>
              <IconButton color="inherit" onClick={openAddModal}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {routesData
            .filter((el) => !!el.Icon)
            .map(({ route, title, Icon }) => (
              <ListItemButton key={route} onClick={() => navigate(route)}>
                <ListItemIcon>
                  <Icon
                    color={
                      route.split("/")[1] === location.pathname.split("/")[1]
                        ? "primary"
                        : undefined
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body1"
                      color={
                        route.split("/")[1] === location.pathname.split("/")[1]
                          ? "primary"
                          : undefined
                      }
                    >
                      {title}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
        </List>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {routesData.find((e) => e.route === location.pathname)?.hasContainer ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        autoClose={4000}
        newestOnTop
        style={{ marginTop: 56 }}
      />
    </Box>
  );
}
