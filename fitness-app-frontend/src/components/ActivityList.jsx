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
  RUNNING: { icon: <DirectionsRunIcon />, color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  WALKING: { icon: <DirectionsWalkIcon />, color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  CYCLING: { icon: <DirectionsBikeIcon />, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  CARDIO: { icon: <FitnessCenterIcon />, color: "#f87171", bg: "rgba(248,113,113,0.1)" },
}

const ActivityCard = ({ activity, onClick }) => {
  const config = activityConfig[activity.type] || activityConfig.CARDIO
  const date = new Date(activity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card onClick={onClick} sx={{
      cursor: "pointer", transition: "all 0.2s ease",
      "&:hover": { border: "1px solid #4c4c6d", transform: "translateY(-2px)" },
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ background: config.bg, borderRadius: 2, p: 1, display: "flex", color: config.color }}>
              {config.icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "#f1f0ff", fontSize: 15, lineHeight: 1.2 }}>
                {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: 12, mt: 0.3 }}>{date}</Typography>
            </Box>
          </Box>
          <ChevronRightIcon sx={{ color: "#4b5563", fontSize: 20, mt: 0.5 }} />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Chip
            icon={<TimerIcon sx={{ fontSize: "14px !important", color: "#9ca3af !important" }} />}
            label={`${activity.duration} min`}
            size="small"
            sx={{ background: "#12121a", color: "#9ca3af", border: "1px solid #2d2d3d", fontSize: 12 }}
          />
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: "14px !important", color: "#f97316 !important" }} />}
            label={`${activity.caloriesBurnt} kcal`}
            size="small"
            sx={{ background: "#12121a", color: "#9ca3af", border: "1px solid #2d2d3d", fontSize: 12 }}
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
          <Skeleton variant="rounded" height={130} sx={{ bgcolor: "#1a1a24" }} />
        </Grid>
      ))}
    </Grid>
  )

  if (activities.length === 0) return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <FitnessCenterIcon sx={{ fontSize: 48, color: "#2d2d3d", mb: 2 }} />
      <Typography sx={{ color: "#6b7280" }}>No activities yet. Log your first workout above!</Typography>
    </Box>
  )

  return (
    <>
      <Typography variant="h6" sx={{ color: "#f1f0ff", mb: 2 }}>
        Recent Activities
        <Chip label={activities.length} size="small" sx={{ ml: 1.5, bgcolor: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 12 }} />
      </Typography>
      <Grid container spacing={2}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <ActivityCard activity={activity} onClick={() => navigate(`/activity/${activity.id}`)} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ActivityList