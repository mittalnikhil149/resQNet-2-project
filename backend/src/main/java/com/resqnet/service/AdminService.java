package com.resqnet.service;

import com.resqnet.dto.response.AssignmentResponse;
import com.resqnet.dto.response.DashboardStats;
import com.resqnet.dto.response.ResponderResponse;
import com.resqnet.dto.response.UserResponse;
import com.resqnet.entity.ResponderProfile;
import com.resqnet.enums.Availability;
import com.resqnet.enums.EmergencyStatus;
import com.resqnet.enums.Role;
import com.resqnet.enums.Severity;
import com.resqnet.exception.ResourceNotFoundException;
import com.resqnet.repository.EmergencyAssignmentRepository;
import com.resqnet.repository.EmergencyRepository;
import com.resqnet.repository.ResponderProfileRepository;
import com.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ResponderProfileRepository responderProfileRepository;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyAssignmentRepository assignmentRepository;
    private final ResponderService responderService;

    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.USER).count();
        long totalResponders = responderProfileRepository.count();
        long availableResponders = responderProfileRepository
                .countByApprovedTrueAndAvailability(Availability.AVAILABLE);

        long reportedEmergencies = emergencyRepository.countByStatus(EmergencyStatus.REPORTED);
        long assignedEmergencies = emergencyRepository.countByStatus(EmergencyStatus.ASSIGNED);
        long acceptedEmergencies = emergencyRepository.countByStatus(EmergencyStatus.ACCEPTED);
        long onWayEmergencies = emergencyRepository.countByStatus(EmergencyStatus.ON_THE_WAY);
        long reachedEmergencies = emergencyRepository.countByStatus(EmergencyStatus.REACHED);
        long resolvedEmergencies = emergencyRepository.countByStatus(EmergencyStatus.RESOLVED);
        long criticalEmergencies = emergencyRepository.countBySeverity(Severity.CRITICAL);
        long totalEmergencies = emergencyRepository.count();

        long activeEmergencies = reportedEmergencies + assignedEmergencies
                + acceptedEmergencies + onWayEmergencies + reachedEmergencies;

        return DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalResponders(totalResponders)
                .availableResponders(availableResponders)
                .activeEmergencies(activeEmergencies)
                .criticalEmergencies(criticalEmergencies)
                .resolvedEmergencies(resolvedEmergencies)
                .reportedEmergencies(reportedEmergencies)
                .assignedEmergencies(assignedEmergencies)
                .totalEmergencies(totalEmergencies)
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ResponderResponse> getAllResponders() {
        return responderProfileRepository.findAll().stream()
                .map(responderService::toResponderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResponderResponse approveResponder(Long responderId) {
        ResponderProfile profile = responderProfileRepository.findById(responderId)
                .orElseThrow(() -> new ResourceNotFoundException("Responder not found with id: " + responderId));
        profile.setApproved(true);
        return responderService.toResponderResponse(responderProfileRepository.save(profile));
    }

    @Transactional
    public ResponderResponse deactivateResponder(Long responderId) {
        ResponderProfile profile = responderProfileRepository.findById(responderId)
                .orElseThrow(() -> new ResourceNotFoundException("Responder not found with id: " + responderId));
        profile.setApproved(false);
        profile.setAvailability(Availability.OFFLINE);
        return responderService.toResponderResponse(responderProfileRepository.save(profile));
    }

    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(responderService::toAssignmentResponse)
                .collect(Collectors.toList());
    }
}
