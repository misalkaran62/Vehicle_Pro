package com.skbit.tms.entity;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.skbit.tms.enumProvider.CompletionStatus;
import com.skbit.tms.enumProvider.ServicingType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class VehicleServicing {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long servicingId;
    private ServicingType servicingType;
    private LocalDate lastServicing;
    private Double nextKmServicing;
    private LocalDate servicingDate;
//    @Size(max = 500, message = "Servicing description should not exceed 500 characters")
    private String servicingDescription;

   
    private boolean isApproved;
    private CompletionStatus completionStatus;
    private String servicingVendor;
    
    private LocalDate createdAt;
    
    private double cost;
    
    private double gst;
    
    private double totalAmount;
    
    @ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "vehicle_servicing_partChangeNames", joinColumns = @JoinColumn(name = "servicing_id"))
	@Column(name = "partChange")
    private List<String> partChangeNames= new ArrayList<String>();
    private String paymentReceiptName;
    
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<PartMapping> oldPartMappings;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<PartMapping> newPartMappings;
    
}
