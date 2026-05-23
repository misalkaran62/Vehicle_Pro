package com.skbit.tms.configuration;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.skbit.tms.entity.User;
import com.skbit.tms.repo.UserRepo; 

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // आपण आता थेट 'superadmin' नावाने नवीन युझर बनवत आहोत
        if (userRepo.findByEmail("superadmin@gmail.com") == null) {
            User admin = new User();
            
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setUserNname("superadmin");
            
            // नवीन ईमेल
            admin.setEmail("superadmin@gmail.com");
            
            admin.setPassword(passwordEncoder.encode("12345678"));
            
            admin.setMobileNo(9999999998L); 
            admin.setStatus(true);
            admin.setCreatedAt(LocalDate.now());

            // इथे आपण 'SUPERADMIN' हा रोल देत आहोत जो Angular ला पाहिजे आहे
            Set<String> roles = new HashSet<>();
            roles.add("SUPERADMIN"); 
            admin.setRoles(roles);

            userRepo.save(admin);
            
            System.out.println("=========================================================");
            System.out.println("✅ SUPERADMIN READY! Email: superadmin@gmail.com");
            System.out.println("=========================================================");
        } else {
            System.out.println("=========================================================");
            System.out.println("✅ SUPERADMIN ALREADY EXISTS!");
            System.out.println("=========================================================");
        }
    }
}