package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleRoadTax;
import com.skbit.tms.response.ApiResponse;

public interface VehicleRoadTaxService {

	ApiResponse createVehicleRoadTax(VehicleRoadTax vehicleRoadTax,Long vehicleId);

	ApiResponse updateVehicleRoadTax(VehicleRoadTax vehicleRoadTax);

	ApiResponse deleteVehicleRoadTax(long id);
	
	VehicleRoadTax findById(long id);

	List<VehicleRoadTax> findAll();

	VehicleRoadTax updateRenewalDue(long roadTaxId);

	VehicleRoadTax updateFormFillStatus(long roadTaxId, boolean status);
	

}
