package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.VehicleFitness;
import com.skbit.tms.response.ApiResponse;

public interface VehicleFitnessService {

	ApiResponse createVehicleFitness(VehicleFitness vehicleFitness,Long vehicleId);

	ApiResponse updateVehicleFitness(VehicleFitness vehicleFitness);

	ApiResponse deleteVehicleFitness(long id);
	
	VehicleFitness findById(long id);

	List<VehicleFitness> findAll();
	
	VehicleFitness updateRenewalDue(long id);
	
	VehicleFitness updateFormFillStatus(long id,boolean status);	

}
