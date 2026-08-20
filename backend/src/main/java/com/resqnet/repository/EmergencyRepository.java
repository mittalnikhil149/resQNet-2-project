package com.resqnet.repository;

import com.resqnet.entity.Emergency;
import com.resqnet.entity.User;
import com.resqnet.enums.EmergencyStatus;
import com.resqnet.enums.Severity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRepository extends JpaRepository<Emergency, Long> {
    List<Emergency> findByUserOrderByCreatedAtDesc(User user);
    List<Emergency> findByStatusOrderByCreatedAtDesc(EmergencyStatus status);
    List<Emergency> findAllByOrderByCreatedAtDesc();
    long countByStatus(EmergencyStatus status);
    long countBySeverity(Severity severity);
    boolean existsByEmergencyCode(String emergencyCode);
}
