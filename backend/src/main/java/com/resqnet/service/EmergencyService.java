package com.resqnet.service;

import com.resqnet.dto.request.EmergencyRequest;
import com.resqnet.dto.request.StatusUpdateRequest;
import com.resqnet.dto.response.EmergencyResponse;
import com.resqnet.entity.Emergency;
import com.resqnet.entity.User;
import com.resqnet.enums.EmergencyStatus;
import com.resqnet.enums.NotificationType;
import com.resqnet.exception.BusinessException;
import com.resqnet.exception.ResourceNotFoundException;
import com.resqnet.repository.EmergencyRepository;
import com.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;
    private final ResponderMatchingService matchingService;
    private final NotificationService notificationService;

    @Transactional
    public EmergencyResponse createEmergency(EmergencyRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String code = generateEmergencyCode();

        Emergency emergency = Emergency.builder()
                .emergencyCode(code)
                .user(user)
                .emergencyType(request.getEmergencyType())
                .severity(request.getSeverity())
                .description(request.getDescription())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(EmergencyStatus.REPORTED)
                .build();

        emergency = emergencyRepository.save(emergency);
        log.info("Emergency created: {} by {}", code, email);

        // Notify user
        notificationService.createNotification(user,
                "Emergency Reported",
                "Your emergency " + code + " has been reported. We are finding responders.",
                NotificationType.EMERGENCY_CREATED);

        // Attempt responder matching
        int assigned = matchingService.matchAndAssign(emergency);
        if (assigned > 0) {
            emergency.setStatus(EmergencyStatus.ASSIGNED);
            emergency = emergencyRepository.save(emergency);
            notificationService.createNotification(user,
                    "Responders Found",
                    assigned + " responder(s) have been assigned to your emergency " + code,
                    NotificationType.RESPONDER_ASSIGNED);
        }

        return toResponse(emergency);
    }

    public List<EmergencyResponse> getMyEmergencies(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return emergencyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EmergencyResponse getEmergencyById(Long id) {
        return toResponse(findById(id));
    }

    public List<EmergencyResponse> getAllEmergencies() {
        return emergencyRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public EmergencyResponse updateStatus(Long id, StatusUpdateRequest request, String responderEmail) {
        Emergency emergency = findById(id);
        EmergencyStatus newStatus = request.getStatus();

        // Validate status transition
        validateStatusTransition(emergency.getStatus(), newStatus);

        EmergencyStatus oldStatus = emergency.getStatus();
        emergency.setStatus(newStatus);
        emergency = emergencyRepository.save(emergency);

        // Notify the emergency reporter
        notificationService.createNotification(emergency.getUser(),
                "Emergency Status Updated",
                "Your emergency " + emergency.getEmergencyCode() + " status changed from "
                        + oldStatus + " to " + newStatus,
                NotificationType.STATUS_UPDATE);

        if (newStatus == EmergencyStatus.RESOLVED) {
            notificationService.createNotification(emergency.getUser(),
                    "Emergency Resolved",
                    "Your emergency " + emergency.getEmergencyCode() + " has been resolved. Stay safe!",
                    NotificationType.EMERGENCY_RESOLVED);
        }

        return toResponse(emergency);
    }

    private void validateStatusTransition(EmergencyStatus current, EmergencyStatus next) {
        boolean valid = switch (current) {
            case REPORTED, ASSIGNED -> next == EmergencyStatus.ACCEPTED || next == EmergencyStatus.CANCELLED;
            case ACCEPTED -> next == EmergencyStatus.ON_THE_WAY || next == EmergencyStatus.CANCELLED;
            case ON_THE_WAY -> next == EmergencyStatus.REACHED;
            case REACHED -> next == EmergencyStatus.RESOLVED;
            default -> false;
        };
        if (!valid) {
            throw new BusinessException("Invalid status transition: " + current + " → " + next);
        }
    }

    private Emergency findById(Long id) {
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency not found with id: " + id));
    }

    private String generateEmergencyCode() {
        String year = String.valueOf(LocalDateTime.now().getYear());
        int attempts = 0;
        while (attempts < 100) {
            int seq = new Random().nextInt(9999) + 1;
            String code = "RSQ-" + year + "-" + String.format("%04d", seq);
            if (!emergencyRepository.existsByEmergencyCode(code)) {
                return code;
            }
            attempts++;
        }
        // Fallback with timestamp
        return "RSQ-" + year + "-" + System.currentTimeMillis() % 100000;
    }

    public EmergencyResponse toResponse(Emergency e) {
        return EmergencyResponse.builder()
                .id(e.getId())
                .emergencyCode(e.getEmergencyCode())
                .userId(e.getUser().getId())
                .userFullName(e.getUser().getFullName())
                .emergencyType(e.getEmergencyType())
                .severity(e.getSeverity())
                .description(e.getDescription())
                .address(e.getAddress())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
