import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Grid } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk"
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import React, { useState } from "react"
import { postActivity } from "../services/api"

const activityIcons = {
  RUNNING: <DirectionsRunIcon sx={{ fontSize: 18 }} />,
  WALKING: <DirectionsWalkIcon sx={{ fontSize: 18 }} />,
  CYCLING: <DirectionsBikeIcon sx={{ fontSize: 18 }} />,
  CARDIO: <FitnessCenterIcon sx={{ fontSize: 18 }} />,
}

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({ type: "RUNNING", duration: "", caloriesBurnt: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await postActivity(activity)
      onActivitiesAdded()
      setActivity({ type: "RUNNING", duration: "", caloriesBurnt: "" })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      background: "#13131a", border: "1px solid #1e293b", borderRadius: 3, p: 3, mb: 4,
      transition: "border-color 0.2s ease",
      "&:hover": { borderColor: "#334155" }
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box sx={{
          background: "#1e293b", border: "1px solid #334155",
          borderRadius: 2, p: 0.8, display: "flex", color: "#64748b"
        }}>
          <AddIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#e2e8f0", fontSize: 15 }}>Log Activity</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#475569" }}>Activity Type</InputLabel>
              <Select
                value={activity.type}
                label="Activity Type"
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                sx={{
                  color: "#e2e8f0", borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e293b" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                }}
              >
                {["RUNNING", "WALKING", "CYCLING", "CARDIO"].map(type => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#94a3b8" }}>
                      {activityIcons[type]}
                      <span style={{ color: "#e2e8f0" }}>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Duration (minutes)" type="number"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              InputLabelProps={{ sx: { color: "#475569" } }}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Calories Burnt" type="number"
              value={activity.caloriesBurnt}
              onChange={(e) => setActivity({ ...activity, caloriesBurnt: e.target.value })}
              InputLabelProps={{ sx: { color: "#475569" } }}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>

        <Button variant="contained" type="submit" disabled={loading}
          startIcon={<AddIcon />} sx={{ mt: 2.5, px: 3, py: 1.1 }}>
          {loading ? "Logging..." : "Log Activity"}
        </Button>
      </Box>
    </Box>
  )
}

export default ActivityForm