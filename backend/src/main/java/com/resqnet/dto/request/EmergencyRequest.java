package com.resqnet.dto.request;

import com.resqnet.enums.EmergencyType;
import com.resqnet.enums.Severity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmergencyRequest {

    @NotNull(message = "Emergency type is required")
    private EmergencyType emergencyType;

    @NotNull(message = "Severity is required")
    private Severity severity;

    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
}
