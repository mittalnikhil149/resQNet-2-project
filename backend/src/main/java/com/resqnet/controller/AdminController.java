package com.resqnet.controller;

import com.resqnet.dto.response.AssignmentResponse;
import com.resqnet.dto.response.DashboardStats;
import com.resqnet.dto.response.EmergencyResponse;
import com.resqnet.dto.response.ResponderResponse;
import com.resqnet.dto.response.UserResponse;
import com.resqnet.service.AdminService;
import com.resqnet.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final EmergencyService emergencyService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/responders")
    public ResponseEntity<List<ResponderResponse>> getResponders() {
        return ResponseEntity.ok(adminService.getAllResponders());
    }

    @PutMapping("/responders/{id}/approve")
    public ResponseEntity<ResponderResponse> approveResponder(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveResponder(id));
    }

    @PutMapping("/responders/{id}/deactivate")
    public ResponseEntity<ResponderResponse> deactivateResponder(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deactivateResponder(id));
    }

    @GetMapping("/emergencies")
    public ResponseEntity<List<EmergencyResponse>> getEmergencies() {
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentResponse>> getAssignments() {
        return ResponseEntity.ok(adminService.getAllAssignments());
    }
}
