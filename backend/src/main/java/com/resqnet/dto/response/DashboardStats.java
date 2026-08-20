package com.resqnet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalUsers;
    private long totalResponders;
    private long availableResponders;
    private long activeEmergencies;
    private long criticalEmergencies;
    private long resolvedEmergencies;
    private long reportedEmergencies;
    private long assignedEmergencies;
    private long totalEmergencies;
}
