import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { Box, Button, AppBar, Toolbar, Typography, Avatar, IconButton, Chip } from "@mui/material"
import { useEffect, useState, useContext } from "react"
import { useDispatch } from "react-redux"
import { AuthContext } from "react-oauth2-code-pkce"
import { setCredentials } from "./store/authSlice"
import ActivityForm from "./components/ActivityForm"
import ActivityList from "./components/ActivityList"
import ActivityDetail from "./components/ActivityDetail"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import LogoutIcon from "@mui/icons-material/Logout"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#a78bfa" },
    secondary: { main: "#34d399" },
    background: { default: "#0f0f13", paper: "#1a1a24" },
    text: { primary: "#f1f0ff", secondary: "#9ca3af" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
        containedPrimary: {
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          "&:hover": { background: "linear-gradient(135deg, #6d28d9, #8b5cf6)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "& fieldset": { borderColor: "#2d2d3d" },
            "&:hover fieldset": { borderColor: "#7c3aed" },
            "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#1a1a24",
          border: "1px solid #2d2d3d",
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
})

const Navbar = ({ tokenData, logOut }) => (
  <AppBar position="fixed" elevation={0} sx={{ background: "rgba(15,15,19,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2d2d3d" }}>
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", borderRadius: 2, p: 0.7, display: "flex" }}>
          <FitnessCenterIcon sx={{ fontSize: 20, color: "#fff" }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#f1f0ff", letterSpacing: "-0.3px" }}>
          FitTracker
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          avatar={<Avatar sx={{ bgcolor: "#7c3aed", width: 26, height: 26, fontSize: 12 }}>{tokenData?.given_name?.[0] || "U"}</Avatar>}
          label={tokenData?.given_name || "User"}
          sx={{ bgcolor: "#1a1a24", border: "1px solid #2d2d3d", color: "#f1f0ff", fontSize: 13 }}
        />
        <IconButton onClick={logOut} sx={{ color: "#9ca3af", "&:hover": { color: "#f87171" } }} size="small">
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
)

const LoginPage = ({ logIn }) => (
  <Box sx={{
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", background: "#0f0f13",
    position: "relative", overflow: "hidden"
  }}>
    <Box sx={{
      position: "absolute", width: 600, height: 600, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
      top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none"
    }} />
    <Box sx={{ textAlign: "center", zIndex: 1, maxWidth: 420, px: 3 }}>
      <Box sx={{
        background: "linear-gradient(135deg, #7c3aed, #a78bfa)", borderRadius: 3,
        p: 1.5, display: "inline-flex", mb: 3
      }}>
        <FitnessCenterIcon sx={{ fontSize: 36, color: "#fff" }} />
      </Box>
      <Typography variant="h4" sx={{ color: "#f1f0ff", mb: 1.5, letterSpacing: "-0.5px" }}>
        Welcome to FitTracker
      </Typography>
      <Typography sx={{ color: "#9ca3af", mb: 4, lineHeight: 1.7 }}>
        Track your workouts and get AI-powered recommendations to crush your fitness goals.
      </Typography>
      <Button variant="contained" size="large" onClick={() => logIn()} fullWidth
        sx={{ py: 1.5, fontSize: 16, mb: 2 }}>
        Sign In
      </Button>
      <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
        Powered by Keycloak OAuth2 + Google Gemini AI
      </Typography>
    </Box>
  </Box>
)

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, pt: 12, pb: 6 }}>
      <Typography variant="h4" sx={{ color: "#f1f0ff", mb: 0.5, letterSpacing: "-0.5px" }}>
        My Activities
      </Typography>
      <Typography sx={{ color: "#9ca3af", mb: 4 }}>
        Log your workouts and get personalized AI insights
      </Typography>
      <ActivityForm onActivitiesAdded={() => setRefreshKey(k => k + 1)} />
      <ActivityList key={refreshKey} />
    </Box>
  )
}

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext)
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && tokenData?.sub) {
      dispatch(setCredentials({ token, user: tokenData }))
    }
  }, [token, tokenData, dispatch])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {!token ? (
          <LoginPage logIn={logIn} />
        ) : (
          <>
            <Navbar tokenData={tokenData} logOut={logOut} />
            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
              <Route path="*" element={<Navigate to="/activities" replace />} />
            </Routes>
          </>
        )}
      </Router>
    </ThemeProvider>
  )
}

export default App