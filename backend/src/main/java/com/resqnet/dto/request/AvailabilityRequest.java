package com.resqnet.dto.request;

import com.resqnet.enums.Availability;
import lombok.Data;

@Data
public class AvailabilityRequest {
    private Availability availability;
}
