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
    primary: { main: "#94a3b8" },
    secondary: { main: "#64748b" },
    background: { default: "#0d0d10", paper: "#13131a" },
    text: { primary: "#e2e8f0", secondary: "#64748b" },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "'Inter', sans-serif", h4: { fontWeight: 700 }, h6: { fontWeight: 600 } },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10, transition: "all 0.2s ease" },
        containedPrimary: {
          background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0",
          "&:hover": { background: "#273549", borderColor: "#475569", transform: "translateY(-1px)" },
          "&:active": { transform: "translateY(0px)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10, transition: "all 0.2s ease",
            "& fieldset": { borderColor: "#1e293b" },
            "&:hover fieldset": { borderColor: "#334155" },
            "&.Mui-focused fieldset": { borderColor: "#475569" },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { background: "#13131a", border: "1px solid #1e293b", borderRadius: 16, transition: "all 0.25s ease" },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
})

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 })
  const [hue, setHue] = useState(210)
  useEffect(() => {
    let frame
    const move = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY })
        setHue(h => (h + 0.3) % 360)
      })
    }
    window.addEventListener("mousemove", move)
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(frame) }
  }, [])
  return (
    <div style={{
      position: "fixed", left: pos.x, top: pos.y, width: 350, height: 350,
      borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      transform: "translate(-50%, -50%)",
      background: `radial-gradient(circle, hsla(${hue}, 30%, 60%, 0.08) 0%, transparent 65%)`,
      transition: "left 0.08s ease, top 0.08s ease",
    }} />
  )
}

const Navbar = ({ tokenData, logOut }) => (
  <AppBar position="fixed" elevation={0} sx={{
    background: "rgba(13,13,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1e293b"
  }}>
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{
          background: "#1e293b", border: "1px solid #334155", borderRadius: 2,
          p: 0.7, display: "flex", transition: "all 0.2s ease",
          "&:hover": { background: "#273549", borderColor: "#475569" }
        }}>
          <FitnessCenterIcon sx={{ fontSize: 20, color: "#94a3b8" }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#e2e8f0", letterSpacing: "-0.3px", fontWeight: 700 }}>
          FitTracker
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          avatar={<Avatar sx={{ bgcolor: "#1e293b", border: "1px solid #334155", width: 26, height: 26, fontSize: 12, color: "#94a3b8" }}>
            {tokenData?.given_name?.[0] || "U"}
          </Avatar>}
          label={tokenData?.given_name || "User"}
          sx={{ bgcolor: "#13131a", border: "1px solid #1e293b", color: "#94a3b8", fontSize: 13 }}
        />
        <IconButton onClick={() => logOut()} size="small" sx={{
          color: "#475569", transition: "all 0.2s ease",
          "&:hover": { color: "#94a3b8", background: "#1e293b" }
        }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
)

const LoginPage = ({ logIn }) => (
  <Box sx={{
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0d0d10",
    position: "relative", overflow: "hidden",
  }}>
    <style>{`
      @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes subtlePulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.5; } }
      .fade-1 { animation: fadeUp 0.5s ease 0.0s both; }
      .fade-2 { animation: fadeUp 0.5s ease 0.1s both; }
      .fade-3 { animation: fadeUp 0.5s ease 0.2s both; }
      .fade-4 { animation: fadeUp 0.5s ease 0.3s both; }
      .fade-5 { animation: fadeUp 0.5s ease 0.4s both; }
    `}</style>

    <CursorGlow />

    <Box sx={{
      position: "absolute", width: 600, height: 600, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(30,41,59,0.4) 0%, transparent 70%)",
      top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      animation: "subtlePulse 8s ease infinite", pointerEvents: "none", zIndex: 0
    }} />

    <Box sx={{ textAlign: "center", zIndex: 1, maxWidth: 380, px: 3 }}>
      <Box className="fade-1" sx={{
        background: "#1e293b", border: "1px solid #334155",
        borderRadius: 3, p: 1.5, display: "inline-flex", mb: 3
      }}>
        <FitnessCenterIcon sx={{ fontSize: 32, color: "#94a3b8" }} />
      </Box>

      <Typography className="fade-2" variant="h4" sx={{ color: "#e2e8f0", mb: 1.5, letterSpacing: "-0.5px" }}>
        FitTracker
      </Typography>

      <Typography className="fade-3" sx={{ color: "#475569", mb: 4, lineHeight: 1.8, fontSize: 15 }}>
        Track your workouts and get AI-powered recommendations to reach your fitness goals.
      </Typography>

      <Button className="fade-4" variant="contained" size="large" onClick={() => logIn()} fullWidth
        sx={{ py: 1.5, fontSize: 15, mb: 2 }}>
        Sign In
      </Button>

      <Typography className="fade-5" sx={{ color: "#1e293b", fontSize: 12 }}>
        Secured with Keycloak OAuth2
      </Typography>
    </Box>
  </Box>
)

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 4 }, pt: 12, pb: 6 }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Box sx={{ mb: 4, animation: "fadeUp 0.5s ease both" }}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", mb: 0.5, letterSpacing: "-0.5px" }}>
          My Activities
        </Typography>
        <Typography sx={{ color: "#475569" }}>
          Log your workouts and get personalized AI insights
        </Typography>
      </Box>
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