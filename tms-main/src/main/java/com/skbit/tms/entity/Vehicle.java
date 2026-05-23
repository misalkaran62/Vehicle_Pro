package com.skbit.tms.entity;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long vehicleId;
    
    private String vehicleImageName;

    @NotBlank(message = "Vehicle registration is required")
//    @Pattern(regexp = "[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}", message = "vehicle registration number should follow the pattern")
    private String vehicleReg;

    @NotBlank(message = "Vehicle type is required")
    @Pattern(regexp = "[a-zA-z ]+", message = "vehicle type should be alphabetic")
    private String vehicleType;

    private String vehicleBrand;
 
    private String vehicleModel;
    
    private VehicleStatus vehicleStatus;

    @OneToOne
    private Supplier supplier;

    @ManyToOne
    private Branch branch;
    

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private VehicleDescription vehicleDescription;


    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<VehicleFinance> vehicleFinances ;
 
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<VehicleFitness> vehicleFitnesses ;

 
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<VehicleInsurance> vehicleInsurances ;

  
    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<VehiclePermit> vehiclePermits;
   
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<VehiclePUC> vehiclePUCs ;

  
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private VehicleRCBook vehicleRCBook;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<VehicleRoadTax> vehicleRoadTaxes;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<VehicleServicing> vehicleServicings;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<PartMapping> partMappings;

    private String createdByEmail;

    private LocalDate createdAt;
    private boolean formFillStatus;
    private RenewalDue renewalDue;
    private boolean status;
    

}

