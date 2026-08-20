package com.resqnet.dto.response;

import com.resqnet.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyResponse {
    private Long id;
    private String emergencyCode;
    private Long userId;
    private String userFullName;
    private EmergencyType emergencyType;
    private Severity severity;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private EmergencyStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
