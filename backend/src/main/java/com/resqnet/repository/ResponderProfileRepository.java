package com.resqnet.repository;

import com.resqnet.entity.ResponderProfile;
import com.resqnet.entity.User;
import com.resqnet.enums.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponderProfileRepository extends JpaRepository<ResponderProfile, Long> {
    Optional<ResponderProfile> findByUser(User user);
    Optional<ResponderProfile> findByUserId(Long userId);
    List<ResponderProfile> findByApprovedTrueAndAvailability(Availability availability);
    List<ResponderProfile> findByApprovedTrue();
    long countByApprovedTrueAndAvailability(Availability availability);
}
