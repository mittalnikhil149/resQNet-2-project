package com.resqnet.service;

import com.resqnet.dto.request.AvailabilityRequest;
import com.resqnet.dto.request.LocationRequest;
import com.resqnet.dto.response.AssignmentResponse;
import com.resqnet.dto.response.EmergencyResponse;
import com.resqnet.dto.response.ResponderResponse;
import com.resqnet.entity.EmergencyAssignment;
import com.resqnet.entity.ResponderProfile;
import com.resqnet.entity.User;
import com.resqnet.enums.AssignmentStatus;
import com.resqnet.enums.EmergencyStatus;
import com.resqnet.enums.NotificationType;
import com.resqnet.exception.BusinessException;
import com.resqnet.exception.ResourceNotFoundException;
import com.resqnet.repository.EmergencyAssignmentRepository;
import com.resqnet.repository.EmergencyRepository;
import com.resqnet.repository.ResponderProfileRepository;
import com.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResponderService {

    private final ResponderProfileRepository responderProfileRepository;
    private final EmergencyAssignmentRepository assignmentRepository;
    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ResponderResponse getMyProfile(String email) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        return toResponderResponse(profile);
    }

    @Transactional
    public ResponderResponse updateAvailability(String email, AvailabilityRequest request) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        profile.setAvailability(request.getAvailability());
        return toResponderResponse(responderProfileRepository.save(profile));
    }

    @Transactional
    public ResponderResponse updateLocation(String email, LocationRequest request) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        return toResponderResponse(responderProfileRepository.save(profile));
    }

    public List<AssignmentResponse> getMyAssignments(String email) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        return assignmentRepository.findByResponderOrderByAssignedAtDesc(profile)
                .stream().map(this::toAssignmentResponse).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentResponse acceptAssignment(Long assignmentId, String email) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        EmergencyAssignment assignment = getAssignment(assignmentId);

        if (!assignment.getResponder().getId().equals(profile.getId())) {
            throw new BusinessException("This assignment does not belong to you");
        }
        if (assignment.getStatus() != AssignmentStatus.PENDING) {
            throw new BusinessException("Assignment is already " + assignment.getStatus());
        }

        assignment.setStatus(AssignmentStatus.ACCEPTED);
        assignment.setAcceptedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);

        // Update emergency status
        var emergency = assignment.getEmergency();
        emergency.setStatus(EmergencyStatus.ACCEPTED);
        emergencyRepository.save(emergency);

        // Notify user
        notificationService.createNotification(emergency.getUser(),
                "Responder Accepted",
                profile.getUser().getFullName() + " has accepted your emergency " + emergency.getEmergencyCode(),
                NotificationType.RESPONDER_ACCEPTED);

        return toAssignmentResponse(assignment);
    }

    @Transactional
    public AssignmentResponse rejectAssignment(Long assignmentId, String email) {
        User user = getUser(email);
        ResponderProfile profile = getProfile(user);
        EmergencyAssignment assignment = getAssignment(assignmentId);

        if (!assignment.getResponder().getId().equals(profile.getId())) {
            throw new BusinessException("This assignment does not belong to you");
        }
        if (assignment.getStatus() != AssignmentStatus.PENDING) {
            throw new BusinessException("Assignment is already " + assignment.getStatus());
        }

        assignment.setStatus(AssignmentStatus.REJECTED);
        assignmentRepository.save(assignment);

        // Notify user
        var emergency = assignment.getEmergency();
        notificationService.createNotification(emergency.getUser(),
                "Responder Rejected",
                "A responder has rejected your emergency " + emergency.getEmergencyCode() + ". Finding another responder.",
                NotificationType.RESPONDER_REJECTED);

        return toAssignmentResponse(assignment);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ResponderProfile getProfile(User user) {
        return responderProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Responder profile not found for user: " + user.getEmail()));
    }

    private EmergencyAssignment getAssignment(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
    }

    public ResponderResponse toResponderResponse(ResponderProfile p) {
        return ResponderResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .phoneNumber(p.getUser().getPhoneNumber())
                .responderType(p.getResponderType())
                .availability(p.getAvailability())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .serviceRadius(p.getServiceRadius())
                .approved(p.getApproved())
                .build();
    }

    public AssignmentResponse toAssignmentResponse(EmergencyAssignment a) {
        EmergencyResponse emergencyResp = EmergencyResponse.builder()
                .id(a.getEmergency().getId())
                .emergencyCode(a.getEmergency().getEmergencyCode())
                .userId(a.getEmergency().getUser().getId())
                .userFullName(a.getEmergency().getUser().getFullName())
                .emergencyType(a.getEmergency().getEmergencyType())
                .severity(a.getEmergency().getSeverity())
                .description(a.getEmergency().getDescription())
                .address(a.getEmergency().getAddress())
                .latitude(a.getEmergency().getLatitude())
                .longitude(a.getEmergency().getLongitude())
                .status(a.getEmergency().getStatus())
                .createdAt(a.getEmergency().getCreatedAt())
                .updatedAt(a.getEmergency().getUpdatedAt())
                .build();

        return AssignmentResponse.builder()
                .id(a.getId())
                .emergency(emergencyResp)
                .responder(toResponderResponse(a.getResponder()))
                .distance(a.getDistance())
                .status(a.getStatus())
                .assignedAt(a.getAssignedAt())
                .acceptedAt(a.getAcceptedAt())
                .completedAt(a.getCompletedAt())
                .build();
    }
}
