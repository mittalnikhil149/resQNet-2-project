package com.resqnet.service;

import com.resqnet.entity.Emergency;
import com.resqnet.entity.EmergencyAssignment;
import com.resqnet.entity.ResponderProfile;
import com.resqnet.enums.Availability;
import com.resqnet.enums.EmergencyType;
import com.resqnet.enums.ResponderType;
import com.resqnet.repository.EmergencyAssignmentRepository;
import com.resqnet.repository.ResponderProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResponderMatchingService {

    private static final double MAX_RADIUS_KM = 50.0;
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final ResponderProfileRepository responderProfileRepository;
    private final EmergencyAssignmentRepository assignmentRepository;

    /**
     * Haversine formula to calculate distance between two lat/lng points in km.
     */
    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Map emergency type to the best-matching responder type.
     */
    private ResponderType mapEmergencyTypeToResponderType(EmergencyType emergencyType) {
        return switch (emergencyType) {
            case FIRE -> ResponderType.FIRE;
            case MEDICAL -> ResponderType.MEDICAL;
            case ROAD_ACCIDENT -> ResponderType.ACCIDENT;
            case DISASTER -> ResponderType.DISASTER;
            case COLLAPSE -> ResponderType.DISASTER;
        };
    }

    /**
     * Find and assign the best available responders to an emergency.
     * Creates PENDING assignments for the top 3 nearest matching responders.
     */
    @Transactional
    public int matchAndAssign(Emergency emergency) {
        if (emergency.getLatitude() == null || emergency.getLongitude() == null) {
            log.warn("Emergency {} has no location — skipping responder matching", emergency.getEmergencyCode());
            return 0;
        }

        ResponderType preferredType = mapEmergencyTypeToResponderType(emergency.getEmergencyType());

        // Get all approved + available responders
        List<ResponderProfile> candidates = responderProfileRepository
                .findByApprovedTrueAndAvailability(Availability.AVAILABLE);

        // Calculate distances and filter by radius
        record Candidate(ResponderProfile profile, double distance) {}

        List<Candidate> matches = candidates.stream()
                .filter(r -> r.getLatitude() != null && r.getLongitude() != null)
                .filter(r -> !assignmentRepository.existsByEmergencyAndResponder(emergency, r))
                .map(r -> {
                    double dist = haversine(
                            emergency.getLatitude(), emergency.getLongitude(),
                            r.getLatitude(), r.getLongitude());
                    return new Candidate(r, dist);
                })
                .filter(c -> c.distance() <= MAX_RADIUS_KM)
                // Prefer matching type, then GENERAL; still include all sorted by distance
                .sorted(Comparator
                        .comparingInt((Candidate c) ->
                                (c.profile().getResponderType() == preferredType ||
                                 c.profile().getResponderType() == ResponderType.GENERAL) ? 0 : 1)
                        .thenComparingDouble(Candidate::distance))
                .limit(3)
                .toList();

        if (matches.isEmpty()) {
            log.info("No available responders found within {}km for emergency {}",
                    MAX_RADIUS_KM, emergency.getEmergencyCode());
            return 0;
        }

        for (Candidate c : matches) {
            EmergencyAssignment assignment = EmergencyAssignment.builder()
                    .emergency(emergency)
                    .responder(c.profile())
                    .distance(Math.round(c.distance() * 100.0) / 100.0)
                    .build();
            assignmentRepository.save(assignment);
            log.info("Assigned responder {} ({}km) to emergency {}",
                    c.profile().getUser().getFullName(), c.distance(), emergency.getEmergencyCode());
        }

        return matches.size();
    }
}
