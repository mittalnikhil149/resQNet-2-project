package com.resqnet.controller;

import com.resqnet.dto.request.AvailabilityRequest;
import com.resqnet.dto.request.LocationRequest;
import com.resqnet.dto.response.AssignmentResponse;
import com.resqnet.dto.response.ResponderResponse;
import com.resqnet.service.ResponderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/responders")
@RequiredArgsConstructor
public class ResponderController {

    private final ResponderService responderService;

    @GetMapping("/profile")
    public ResponseEntity<ResponderResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.getMyProfile(userDetails.getUsername()));
    }

    @PutMapping("/availability")
    public ResponseEntity<ResponderResponse> updateAvailability(
            @RequestBody AvailabilityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.updateAvailability(userDetails.getUsername(), request));
    }

    @PutMapping("/location")
    public ResponseEntity<ResponderResponse> updateLocation(
            @RequestBody LocationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.updateLocation(userDetails.getUsername(), request));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentResponse>> getMyAssignments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.getMyAssignments(userDetails.getUsername()));
    }
}
