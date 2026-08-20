package com.resqnet.controller;

import com.resqnet.dto.response.AssignmentResponse;
import com.resqnet.service.ResponderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final ResponderService responderService;

    @PostMapping("/{id}/accept")
    public ResponseEntity<AssignmentResponse> accept(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.acceptAssignment(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<AssignmentResponse> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(responderService.rejectAssignment(id, userDetails.getUsername()));
    }
}
