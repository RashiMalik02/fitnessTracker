package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.AcitivityRequest;
import com.fitness.activityservice.dto.ActivityRespose;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;

    public ActivityRespose trackActivity(AcitivityRequest request) {
        if(!userValidationService.validateUser(request.getUserId())) {
            throw  new RuntimeException("User does not exist with user id: " + request.getUserId());
        }
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .caloriesBurnt(request.getCaloriesBurnt())
                .duration(request.getDuration())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity saved = activityRepository.save(activity);
        return requestToResponse(saved);

    }

    private ActivityRespose requestToResponse(Activity activity) {
        ActivityRespose response = new ActivityRespose();
        response.setId(activity.getId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurnt(activity.getCaloriesBurnt());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        response.setUserId(activity.getUserId());
        response.setStartTime(activity.getStartTime());

        return response;
    }

    public List<ActivityRespose> getUserActivity(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);

        return activities.stream()
                .map(this::requestToResponse)
                .collect(Collectors.toList());
    }

    public ActivityRespose getActivityById(String id) {
        return activityRepository.findById(id)
                .map(this::requestToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
    }
}
