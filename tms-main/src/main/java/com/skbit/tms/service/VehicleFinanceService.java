package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.response.ApiResponse;

public interface VehicleFinanceService {

	ApiResponse createVehicleFinance(VehicleFinance vehicleFinance);

	ApiResponse updateVehicleFinance(VehicleFinance vehicleFinance);

	ApiResponse deleteVehicleFinance(long id);
	
	VehicleFinance findById(long id);

	List<VehicleFinance> findAll();
	
	VehicleFinance updateRenewalDue(long id);
	
	VehicleFinance updateFormFillStatus(long roadTaxId, boolean status);	

}
