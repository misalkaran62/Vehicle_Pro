package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleNotification;
import com.skbit.tms.response.ApiResponse;

public interface VehicleNotificationService {

	ApiResponse createVehicleNotification(VehicleNotification vehicleNotification);

	ApiResponse updateVehicleNotification(VehicleNotification vehicleNotification);

	ApiResponse deleteVehicleNotification(long id);
	
	VehicleNotification findById(long id);

	List<VehicleNotification> findAll();
	
	List<VehicleNotification> findByBranchId(long id);
	
	
	

}
