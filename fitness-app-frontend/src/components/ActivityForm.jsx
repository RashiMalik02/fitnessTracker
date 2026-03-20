import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Grid } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk"
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import React, { useState } from "react"
import { postActivity } from "../services/api"

const activityIcons = {
  RUNNING: <DirectionsRunIcon />,
  WALKING: <DirectionsWalkIcon />,
  CYCLING: <DirectionsBikeIcon />,
  CARDIO: <FitnessCenterIcon />,
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
      background: "#1a1a24", border: "1px solid #2d2d3d", borderRadius: 3,
      p: 3, mb: 4
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box sx={{ background: "rgba(124,58,237,0.15)", borderRadius: 2, p: 0.8, display: "flex" }}>
          <AddIcon sx={{ color: "#a78bfa", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#f1f0ff" }}>Log Activity</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#9ca3af" }}>Activity Type</InputLabel>
              <Select
                value={activity.type}
                label="Activity Type"
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                sx={{ color: "#f1f0ff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2d2d3d" } }}
              >
                {["RUNNING", "WALKING", "CYCLING", "CARDIO"].map(type => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {activityIcons[type]}
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Duration (minutes)" type="number"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              InputLabelProps={{ sx: { color: "#9ca3af" } }}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Calories Burnt" type="number"
              value={activity.caloriesBurnt}
              onChange={(e) => setActivity({ ...activity, caloriesBurnt: e.target.value })}
              InputLabelProps={{ sx: { color: "#9ca3af" } }}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained" type="submit" disabled={loading}
          startIcon={<AddIcon />}
          sx={{ mt: 2.5, px: 3, py: 1.2 }}
        >
          {loading ? "Logging..." : "Log Activity"}
        </Button>
      </Box>
    </Box>
  )
}

export default ActivityForm