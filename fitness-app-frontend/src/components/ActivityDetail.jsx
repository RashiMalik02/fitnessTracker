import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { getActivityDetail } from "../services/api"
import {
  Box, Card, CardContent, Typography, Chip, CircularProgress,
  Divider, Button, List, ListItem, ListItemIcon, ListItemText
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import ShieldIcon from "@mui/icons-material/Shield"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

const Section = ({ icon, title, color, items }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
      <Box sx={{ color, display: "flex" }}>{icon}</Box>
      <Typography sx={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{title}</Typography>
    </Box>
    <List dense disablePadding>
      {items?.map((item, i) => (
        <ListItem key={i} disablePadding sx={{ alignItems: "flex-start", mb: 1 }}>
          <ListItemIcon sx={{ minWidth: 18, mt: 0.9 }}>
            <FiberManualRecordIcon sx={{ fontSize: 5, color }} />
          </ListItemIcon>
          <ListItemText
            primary={item}
            primaryTypographyProps={{ sx: { color: "#94a3b8", fontSize: 14, lineHeight: 1.7 } }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
)

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 10

    const fetchWithRetry = async () => {
      try {
        const response = await getActivityDetail(id)
        setRecommendation(response.data)
        setLoading(false)
      } catch {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(fetchWithRetry, 3000)
        } else {
          setError("Recommendation not ready yet. Please try again in a moment.")
          setLoading(false)
        }
      }
    }
    fetchWithRetry()
  }, [id])

  if (loading) return (
    <Box sx={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#0d0d10"
    }}>
      <CircularProgress size={28} sx={{ color: "#334155", mb: 2 }} thickness={2} />
      <Typography sx={{ color: "#475569", fontSize: 14 }}>Generating AI recommendation...</Typography>
      <Typography sx={{ color: "#1e293b", fontSize: 12, mt: 0.5 }}>This may take a few seconds</Typography>
    </Box>
  )

  if (error) return (
    <Box sx={{ maxWidth: 600, mx: "auto", pt: 14, px: 3, textAlign: "center" }}>
      <Typography sx={{ color: "#64748b", mb: 2 }}>{error}</Typography>
      <Button onClick={() => navigate("/activities")} startIcon={<ArrowBackIcon />}
        sx={{ color: "#475569", "&:hover": { color: "#94a3b8" } }}>
        Back to Activities
      </Button>
    </Box>
  )

  return (
    <Box sx={{
      maxWidth: 800, mx: "auto", px: { xs: 2, md: 4 }, pt: 12, pb: 6,
      animation: "fadeUp 0.4s ease both",
      "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } }
    }}>
      <Button onClick={() => navigate("/activities")} startIcon={<ArrowBackIcon />}
        sx={{ color: "#334155", mb: 3, transition: "all 0.2s ease", "&:hover": { color: "#94a3b8", background: "transparent" } }}>
        Back
      </Button>

      <Card sx={{ mb: 2.5, "&:hover": { border: "1px solid #334155" } }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Box sx={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 2, p: 0.8, display: "flex" }}>
              <AutoAwesomeIcon sx={{ color: "#64748b", fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "#e2e8f0", fontSize: 16 }}>AI Analysis</Typography>
              <Chip label={recommendation?.activityType} size="small"
                sx={{ bgcolor: "#1e293b", color: "#64748b", border: "1px solid #334155", fontSize: 11, height: 20, mt: 0.3 }} />
            </Box>
          </Box>
          <Typography sx={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 14 }}>
            {recommendation?.recommendation}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ "&:hover": { border: "1px solid #334155" } }}>
        <CardContent sx={{ p: 3 }}>
          <Section icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} title="Improvements" color="#7dd3a8" items={recommendation?.improvements} />
          <Divider sx={{ borderColor: "#1e293b", my: 2 }} />
          <Section icon={<LightbulbIcon sx={{ fontSize: 16 }} />} title="Next Workout Suggestions" color="#7eb8d4" items={recommendation?.suggestions} />
          <Divider sx={{ borderColor: "#1e293b", my: 2 }} />
          <Section icon={<ShieldIcon sx={{ fontSize: 16 }} />} title="Safety Guidelines" color="#b0a0c8" items={recommendation?.safety} />
        </CardContent>
      </Card>
    </Box>
  )
}

export default ActivityDetail