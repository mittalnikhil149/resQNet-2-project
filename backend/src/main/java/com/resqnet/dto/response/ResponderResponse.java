package com.resqnet.dto.response;

import com.resqnet.enums.Availability;
import com.resqnet.enums.ResponderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponderResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private ResponderType responderType;
    private Availability availability;
    private Double latitude;
    private Double longitude;
    private Double serviceRadius;
    private Boolean approved;
}
