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
      <Typography variant="h6" sx={{ color: "#f1f0ff", fontSize: 15, fontWeight: 600 }}>{title}</Typography>
    </Box>
    <List dense disablePadding>
      {items?.map((item, i) => (
        <ListItem key={i} disablePadding sx={{ alignItems: "flex-start", mb: 0.8 }}>
          <ListItemIcon sx={{ minWidth: 20, mt: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 6, color }} />
          </ListItemIcon>
          <ListItemText
            primary={item}
            primaryTypographyProps={{ sx: { color: "#d1d5db", fontSize: 14, lineHeight: 1.7 } }}
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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0f0f13" }}>
      <CircularProgress sx={{ color: "#a78bfa", mb: 2 }} />
      <Typography sx={{ color: "#9ca3af" }}>Generating AI recommendation...</Typography>
      <Typography sx={{ color: "#6b7280", fontSize: 13, mt: 0.5 }}>This may take a few seconds</Typography>
    </Box>
  )

  if (error) return (
    <Box sx={{ maxWidth: 600, mx: "auto", pt: 14, px: 3, textAlign: "center" }}>
      <Typography sx={{ color: "#f87171", mb: 2 }}>{error}</Typography>
      <Button onClick={() => navigate("/activities")} startIcon={<ArrowBackIcon />} sx={{ color: "#a78bfa" }}>
        Back to Activities
      </Button>
    </Box>
  )

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, md: 4 }, pt: 12, pb: 6 }}>
      <Button onClick={() => navigate("/activities")} startIcon={<ArrowBackIcon />}
        sx={{ color: "#9ca3af", mb: 3, "&:hover": { color: "#f1f0ff" } }}>
        Back to Activities
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ background: "rgba(167,139,250,0.15)", borderRadius: 2, p: 1, display: "flex" }}>
              <AutoAwesomeIcon sx={{ color: "#a78bfa" }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: "#f1f0ff", fontWeight: 700, letterSpacing: "-0.3px" }}>
                AI Analysis
              </Typography>
              <Chip label={recommendation?.activityType} size="small"
                sx={{ bgcolor: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 12, mt: 0.3 }} />
            </Box>
          </Box>

          <Typography sx={{ color: "#d1d5db", lineHeight: 1.8, fontSize: 14 }}>
            {recommendation?.recommendation}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Section
            icon={<TrendingUpIcon fontSize="small" />}
            title="Improvements"
            color="#34d399"
            items={recommendation?.improvements}
          />
          <Divider sx={{ borderColor: "#2d2d3d", my: 2 }} />
          <Section
            icon={<LightbulbIcon fontSize="small" />}
            title="Next Workout Suggestions"
            color="#60a5fa"
            items={recommendation?.suggestions}
          />
          <Divider sx={{ borderColor: "#2d2d3d", my: 2 }} />
          <Section
            icon={<ShieldIcon fontSize="small" />}
            title="Safety Guidelines"
            color="#f87171"
            items={recommendation?.safety}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default ActivityDetail