package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleInsurance;
import com.skbit.tms.response.ApiResponse;

public interface VehicleInsuranceService {

	ApiResponse createVehicleInsurance(VehicleInsurance vehicleInsurance,Long vehicleId);

	ApiResponse updateVehicleInsurance(VehicleInsurance vehicleInsurance);

	ApiResponse deleteVehicleInsurance(long id);
	
	VehicleInsurance findById(long id);

	List<VehicleInsurance> findAll();
	
	VehicleInsurance updateRenewalDue(long id);
	
	VehicleInsurance updateFormFillStatus(long roadTaxId, boolean status);
}
