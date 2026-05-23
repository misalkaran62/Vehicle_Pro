package com.skbit.tms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToOne
    private User user;

    @NotBlank(message = "Module is required")
    @Size(max = 50, message = "Module name should not exceed 50 characters")
    
    private String module;

    @NotBlank(message = "Action is required")
    @Size(max = 100, message = "Action should not exceed 100 characters")
    @Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
    private String action;

    @Size(max = 255, message = "Details should not exceed 255 characters")
    
    private String details;

    private LocalDateTime updatedAt;
}
