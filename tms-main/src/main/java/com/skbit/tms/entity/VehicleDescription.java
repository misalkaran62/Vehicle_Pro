package com.skbit.tms.entity;

import com.skbit.tms.enumProvider.FuelMeasurement;
import com.skbit.tms.enumProvider.FuelType;
import com.skbit.tms.enumProvider.TruckUsages;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class VehicleDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long vehicle_description_id;

    @Min(value = 1886, message = "Manufacturing year must be no earlier than 1886")
    @Max(value = 2024, message = "Manufacturing year must not be in the future")
    private int manufacturingYear;


    @Size(max = 30, message = "Color should not exceed 30 characters")
    private String color;

    @Size(max = 255, message = "Vehicle image URL should not exceed 255 characters")
    private String vehicleImage;

    @NotBlank(message = "Registration number is required")
    @Size(max = 20, message = "Registration number should not exceed 20 characters")
    private String registrationNumber;


    @Size(max = 30, message = "Engine number should not exceed 30 characters")
    private String engineNumber;


    @Size(max = 30, message = "Chassis number should not exceed 30 characters")
    private String chasisNumber;

    private FuelType fuelType;
    private FuelMeasurement fuelMeasurement;
    private TruckUsages truckUsages;
    private boolean secondaryMeter;

  
}
