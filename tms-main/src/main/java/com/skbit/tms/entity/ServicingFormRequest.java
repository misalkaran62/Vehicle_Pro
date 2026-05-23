package com.skbit.tms.entity;

import com.skbit.tms.enumProvider.ServicingType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data

public class ServicingFormRequest {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private ServicingType servicingType;
	private String description;
	private String partImageName;
	
	

}
