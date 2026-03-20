import { Box, Card, CardContent, Grid, Typography, Chip, Skeleton } from "@mui/material"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk"
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import TimerIcon from "@mui/icons-material/Timer"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useEffect, useState } from "react"
import React from "react"
import { useNavigate } from "react-router"
import { getActivitites } from "../services/api"

const activityConfig = {
  RUNNING: { icon: <DirectionsRunIcon sx={{ fontSize: 18 }} />, color: "#94a3b8", bg: "rgba(148,163,184,0.08)" },
  WALKING: { icon: <DirectionsWalkIcon sx={{ fontSize: 18 }} />, color: "#7dd3a8", bg: "rgba(125,211,168,0.08)" },
  CYCLING: { icon: <DirectionsBikeIcon sx={{ fontSize: 18 }} />, color: "#7eb8d4", bg: "rgba(126,184,212,0.08)" },
  CARDIO: { icon: <FitnessCenterIcon sx={{ fontSize: 18 }} />, color: "#b0a0c8", bg: "rgba(176,160,200,0.08)" },
}

const ActivityCard = ({ activity, onClick, index }) => {
  const config = activityConfig[activity.type] || activityConfig.CARDIO
  const date = new Date(activity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card onClick={onClick} sx={{
      cursor: "pointer",
      animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
      "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      "&:hover": {
        border: "1px solid #334155",
        transform: "translateY(-3px)",
        "& .chevron": { transform: "translateX(3px)", color: "#64748b" }
      },
    }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              background: config.bg, border: `1px solid ${config.color}22`,
              borderRadius: 2, p: 0.9, display: "flex", color: config.color
            }}>
              {config.icon}
            </Box>
            <Box>
              <Typography sx={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
              </Typography>
              <Typography sx={{ color: "#334155", fontSize: 12, mt: 0.3 }}>{date}</Typography>
            </Box>
          </Box>
          <ChevronRightIcon className="chevron" sx={{ color: "#1e293b", fontSize: 18, mt: 0.3, transition: "all 0.2s ease" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<TimerIcon sx={{ fontSize: "13px !important", color: "#475569 !important" }} />}
            label={`${activity.duration} min`} size="small"
            sx={{ background: "#0d0d10", color: "#64748b", border: "1px solid #1e293b", fontSize: 11, height: 24 }}
          />
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: "13px !important", color: "#7d5a3a !important" }} />}
            label={`${activity.caloriesBurnt} kcal`} size="small"
            sx={{ background: "#0d0d10", color: "#64748b", border: "1px solid #1e293b", fontSize: 11, height: 24 }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivitites()
        setActivities(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  if (loading) return (
    <Grid container spacing={2}>
      {[1, 2, 3].map(i => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Skeleton variant="rounded" height={120} sx={{ bgcolor: "#13131a", borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  )

  if (activities.length === 0) return (
    <Box sx={{ textAlign: "center", py: 10, border: "1px dashed #1e293b", borderRadius: 3 }}>
      <FitnessCenterIcon sx={{ fontSize: 40, color: "#1e293b", mb: 2 }} />
      <Typography sx={{ color: "#334155" }}>No activities yet. Log your first workout above!</Typography>
    </Box>
  )

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Typography variant="h6" sx={{ color: "#e2e8f0", fontSize: 15 }}>Recent Activities</Typography>
        <Chip label={activities.length} size="small"
          sx={{ bgcolor: "#1e293b", color: "#64748b", border: "1px solid #334155", fontSize: 11, height: 20 }} />
      </Box>
      <Grid container spacing={2}>
        {activities.map((activity, index) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <ActivityCard activity={activity} index={index} onClick={() => navigate(`/activity/${activity.id}`)} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ActivityList