package com.skbit.tms.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
public class VehicleNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long notificationId;

    private NotificationType notificationType;

    @NotBlank(message = "Notification is required")
    @Size(max = 255, message = "Notification should not exceed 255 characters")
    private String notification;
    
    private String userName;
    
    private String vehilceRegNo;
    
    private Long documentId;
    
    private String type;
    
    private boolean expired;
    
    private boolean distLimitReached;

    private LocalDate notificationDate;

    private boolean status;
    
    @OneToOne
    private Branch branch;
}
