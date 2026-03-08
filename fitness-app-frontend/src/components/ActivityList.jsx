import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router";
import { getActivitites } from "../services/api";

const ActivityList = () => {

  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async() => {
    try {
      const response = await getActivitites();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  } 


  useEffect(() => {
    fetchActivities();
  }, []);
  return (
    <div>
      <Grid container spacing={2}>
          {activities.map((activity) => {
            <Grid container spacing={{xs:2, md:3}} columns={{xs:4, sm:8, md:12}}>
                <Card sx={{cursor: "pointer"}}
                onClisck = {() => navigate(`/activites/${activity.id}`)}>
                    <CardContent>
                        <Typography variant="h6">{activity.type}</Typography>
                        <Typography > Duration: {activity.duration}</Typography>
                        <Typography >Calories Burnt: {activity.caloriesBurnt}</Typography>
                    </CardContent>
                </Card>
            </Grid>
          })}
          </Grid>
    </div>
  );
};

export default ActivityList;