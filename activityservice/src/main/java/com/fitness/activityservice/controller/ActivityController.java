package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.AcitivityRequest;
import com.fitness.activityservice.dto.ActivityRespose;
import com.fitness.activityservice.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    @PostMapping("/")
    public ResponseEntity<ActivityRespose> trackActivities(@RequestBody AcitivityRequest request) {
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping("/")
    public ResponseEntity<List<ActivityRespose>> getUserActivitesById(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivity(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityRespose> getActivityById(@PathVariable String id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }
}
