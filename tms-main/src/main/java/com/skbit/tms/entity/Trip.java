package com.skbit.tms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long tripId;

    @ManyToOne
    private Route route;
    
    private LocalDate startDate;

    private LocalDate endDate;

    private String tripDescription;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Branch branch;

    private Double startKm;

    @Size(max = 255, message = "Start KM photo URL should not exceed 255 characters")
    private String startKmPhotoName;

    private Double endKm;

    @Size(max = 255, message = "End KM photo URL should not exceed 255 characters")
    private String endKmPhotoName;

    // Trip status (START, IN_BETWEEN, END)
    private TripStatus tripStatus; 
    
    private Double totalDistance;

    private String startLocation;
    
    private String endLocation;
    
    private String cancellationReason;
    //driver
     @ManyToOne
    private User user;
}
