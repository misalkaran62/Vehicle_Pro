package com.skbit.tms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Dashboard {
	@Id
	private long id;
	
	private int totalNotification;
	
	private int totalTrip;
	
	private int totalVehicle;
	

}
