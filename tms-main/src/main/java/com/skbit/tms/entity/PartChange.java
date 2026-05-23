package com.skbit.tms.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class PartChange {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String partName;
	private String brandName;
	private String remark;
	
}
