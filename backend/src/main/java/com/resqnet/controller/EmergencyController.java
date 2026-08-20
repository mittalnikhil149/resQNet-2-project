package com.resqnet.controller;

import com.resqnet.dto.request.EmergencyRequest;
import com.resqnet.dto.request.StatusUpdateRequest;
import com.resqnet.dto.response.EmergencyResponse;
import com.resqnet.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping
    public ResponseEntity<EmergencyResponse> createEmergency(
            @Valid @RequestBody EmergencyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emergencyService.createEmergency(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EmergencyResponse>> getMyEmergencies(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(emergencyService.getMyEmergencies(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyResponse> getEmergencyById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.getEmergencyById(id));
    }

    @GetMapping
    public ResponseEntity<List<EmergencyResponse>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EmergencyResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(emergencyService.updateStatus(id, request, userDetails.getUsername()));
    }
}
