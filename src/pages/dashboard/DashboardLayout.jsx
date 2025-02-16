import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart as AnalyticsIcon,
  LocalOffer as CouponIcon,
  Redeem as RedeemIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../utils/contexts/AuthContext";

const drawerWidth = 240;

const DashboardLayout = ({ toggleTheme }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Coupons", icon: <CouponIcon />, path: "/coupons" },
    {
      text: "Redeemed Coupons",
      icon: <RedeemIcon />,
      path: "/redeemed-coupons",
    },
    { text: "Profile", icon: <ProfileIcon />, path: "/profile" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open &&
            !isMobile && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", fontSize: "1.5rem" }}
          >
            Vendor Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : theme.spacing(7),
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.1)",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            ...(!isMobile && {
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          },
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              py: 2,
            }}
          >
            <img
              src="https://nanoinfluencers.io/wp-content/uploads/2024/11/nanoinfluencers.io_Logo_small-removebg-preview.png"
              alt="Logo"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </Box>
        </Toolbar>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "8px",
                  margin: "4px 8px",
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : "inherit",
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.main
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: "8px",
                margin: "4px 8px",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
