package com.resqnet.dto.request;

import com.resqnet.enums.EmergencyStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private EmergencyStatus status;
}
