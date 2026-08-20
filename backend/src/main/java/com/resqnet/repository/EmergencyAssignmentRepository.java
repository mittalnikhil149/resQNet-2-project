package com.resqnet.repository;

import com.resqnet.entity.EmergencyAssignment;
import com.resqnet.entity.Emergency;
import com.resqnet.entity.ResponderProfile;
import com.resqnet.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyAssignmentRepository extends JpaRepository<EmergencyAssignment, Long> {
    List<EmergencyAssignment> findByResponderOrderByAssignedAtDesc(ResponderProfile responder);
    List<EmergencyAssignment> findByEmergencyOrderByDistanceAsc(Emergency emergency);
    List<EmergencyAssignment> findByResponderAndStatus(ResponderProfile responder, AssignmentStatus status);
    Optional<EmergencyAssignment> findByEmergencyAndResponder(Emergency emergency, ResponderProfile responder);
    List<EmergencyAssignment> findByStatusOrderByAssignedAtDesc(AssignmentStatus status);
    boolean existsByEmergencyAndResponder(Emergency emergency, ResponderProfile responder);
}
