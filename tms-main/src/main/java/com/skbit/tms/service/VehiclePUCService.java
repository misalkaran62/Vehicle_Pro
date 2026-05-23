package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehiclePUC;
import com.skbit.tms.response.ApiResponse;

public interface VehiclePUCService {

	ApiResponse createVehiclePUC(VehiclePUC vehiclePUC,Long vehicleId);

	ApiResponse updateVehiclePUC(VehiclePUC vehiclePUC);

	ApiResponse deleteVehiclePUC(long id);
	
	VehiclePUC findById(long id);

	List<VehiclePUC> findAll();
	
	VehiclePUC updateRenewalDue(long id);
	
	VehiclePUC updateFormFillStatus(long roadTaxId, boolean status);
	

}
