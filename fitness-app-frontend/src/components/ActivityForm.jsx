import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { postActivity } from "../services/api";

const ActivityForm = ({onActivitiesAdded}) => {
    const [activity, setActivity] = useState({type : "RUNNING", duration: "", caloriesBurnt: "", 
        additionMetrics: {}
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // await addactivity(activity);
            await postActivity(activity);
            onActivitiesAdded();
            setActivity({type : "RUNNING", duration: "", caloriesBurnt: ""});
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Activity type</InputLabel>
            <Select value={activity.type}
            onChange={(e) => setActivity({...activity, type: e.target.value})}>
                <MenuItem value="RUNNING">Running</MenuItem>
                <MenuItem value="WALKING">Walking</MenuItem>
                <MenuItem value="CYCLING">Cycling</MenuItem>
            </Select>
        </FormControl>
        <TextField fullWidth 
                    label="Duration (minutes)" 
                    type="number" 
                    sx={{ mb: 2 }} 
                    value={activity.duration} onChange={(e) => setActivity({...activity, duration: e.target.value})} />
        <TextField fullWidth 
                    label="Calories Burnt" 
                    type="number" 
                    sx={{ mb: 2 }} 
                    value={activity.caloriesBurnt} onChange={(e) => setActivity({...activity, caloriesBurnt: e.target.value})} />

        <Button variant="contained" type="submit">
            Add Activity
            </Button>
    
    </Box>
  );
};

export default ActivityForm;