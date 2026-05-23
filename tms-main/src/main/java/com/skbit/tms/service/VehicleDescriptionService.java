package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleDescription;
import com.skbit.tms.response.ApiResponse;

public interface VehicleDescriptionService {

	ApiResponse createVehicleDescription(VehicleDescription vehicleDescription);

	ApiResponse updateVehicleDescription(VehicleDescription vehicleDescription);

	ApiResponse deleteVehicleDescription(long id);
	
	VehicleDescription findById(long id);

	List<VehicleDescription> findAll();
	

}
