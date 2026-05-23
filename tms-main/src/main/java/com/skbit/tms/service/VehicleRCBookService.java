package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleRCBook;
import com.skbit.tms.response.ApiResponse;

public interface VehicleRCBookService {

	ApiResponse createVehicleRCBook(VehicleRCBook vehicleRCBook);

	ApiResponse updateVehicleRCBook(VehicleRCBook vehicleRCBook);

	ApiResponse deleteVehicleRCBook(long id);
	
	VehicleRCBook findById(long id);

	List<VehicleRCBook> findAll();
	
	
	

}
