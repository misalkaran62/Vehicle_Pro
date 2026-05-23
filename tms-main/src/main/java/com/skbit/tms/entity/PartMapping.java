package com.skbit.tms.entity;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class PartMapping {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String serialNumber;
	private String vendorName;
	private double vehiclekm ;
	private LocalDate dateOfPurchase;
	private LocalDate dateOfValidity;
	@ManyToOne()
	private PartChange partChange;
	
    
}
