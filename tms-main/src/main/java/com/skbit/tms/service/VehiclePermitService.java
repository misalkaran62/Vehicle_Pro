package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.response.ApiResponse;

public interface VehiclePermitService {

	ApiResponse createVehiclePermit(VehiclePermit vehiclePermit,Long vehicleId);

	ApiResponse updateVehiclePermit(VehiclePermit vehiclePermit);

	ApiResponse deleteVehiclePermit(long id);
	
	VehiclePermit findById(long id);

	List<VehiclePermit> findAll();
	
	VehiclePermit updateRenewalDue(long roadTaxId);

	VehiclePermit updateFormFillStatus(long roadTaxId, boolean status);
	

}
