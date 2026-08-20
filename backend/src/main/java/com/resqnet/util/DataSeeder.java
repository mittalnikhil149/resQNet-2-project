package com.resqnet.util;

import com.resqnet.entity.ResponderProfile;
import com.resqnet.entity.User;
import com.resqnet.enums.Availability;
import com.resqnet.enums.ResponderType;
import com.resqnet.enums.Role;
import com.resqnet.repository.ResponderProfileRepository;
import com.resqnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DEV ONLY — Seeds initial data on startup if not already present.
 * IMPORTANT: Change admin credentials before deploying to production!
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResponderProfileRepository responderProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedResponders();
        log.info("=== ResQNet DataSeeder completed ===");
    }

    private void seedAdmin() {
        String adminEmail = "admin@resqnet.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .fullName("ResQNet Admin")
                    .email(adminEmail)
                    .phoneNumber("+91-9000000001")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin seeded: {}", adminEmail);
        }
    }

    private void seedResponders() {
        // Sample responders near Delhi/NCR area (lat/lng approximate)
        Object[][] responders = {
                { "Fire Station Alpha", "fire.alpha@resqnet.com", "+91-9100000001", 28.6139, 77.2090,
                        ResponderType.FIRE },
                { "Medical Unit Bravo", "medical.bravo@resqnet.com", "+91-9100000002", 28.6304, 77.2177,
                        ResponderType.MEDICAL },
                { "Accident Team Charlie", "accident.charlie@resqnet.com", "+91-9100000003", 28.5535, 77.2588,
                        ResponderType.ACCIDENT },
                { "Disaster Relief Delta", "disaster.delta@resqnet.com", "+91-9100000004", 28.7041, 77.1025,
                        ResponderType.DISASTER },
                { "General Rescue Echo", "general.echo@resqnet.com", "+91-9100000005", 28.4595, 77.0266,
                        ResponderType.GENERAL },
                { "Fire Station Foxtrot", "fire.foxtrot@resqnet.com", "+91-9100000006", 28.6692, 77.4538,
                        ResponderType.FIRE },
                { "Medical Unit Golf", "medical.golf@resqnet.com", "+91-9100000007", 28.4089, 77.3178,
                        ResponderType.MEDICAL },
        };

        for (Object[] r : responders) {
            String email = (String) r[1];
            if (!userRepository.existsByEmail(email)) {
                User user = User.builder()
                        .fullName((String) r[0])
                        .email(email)
                        .phoneNumber((String) r[2])
                        .password(passwordEncoder.encode("Responder@123"))
                        .role(Role.RESPONDER)
                        .build();
                user = userRepository.save(user);

                ResponderProfile profile = ResponderProfile.builder()
                        .user(user)
                        .responderType((ResponderType) r[5])
                        .availability(Availability.AVAILABLE)
                        .latitude((Double) r[3])
                        .longitude((Double) r[4])
                        .serviceRadius(50.0)
                        .approved(true)
                        .build();
                responderProfileRepository.save(profile);
                log.info("Responder seeded: {} ({})", r[0], r[5]);
            }
        }
    }
}
