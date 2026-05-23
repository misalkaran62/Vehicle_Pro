package com.skbit.tms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.response.ApiResponse;

public interface VehicleService {

	ApiResponse createVehicle(Vehicle vehicle);

	ApiResponse updateVehicle(Vehicle vehicle);

	ApiResponse deleteVehicle(long id);
	
	Vehicle findById(long id);

	List<Vehicle> findAll();

	List<Vehicle> vehiclesByBranch(long branchId);

	Vehicle updateExpiryStatus(long id);

	boolean updateFormFillStatus(Vehicle vehicle);

	List<Vehicle> getAllAvailableVehicles();

	ApiResponse updateVehicleStatus(long id, VehicleStatus vehicleStatus);

	List<Vehicle> findByBranchId(long id);

	Vehicle findByVehicleReg(String vehicleReg);

	ApiResponse createNotification();

	List<PartMapping> getReplacedParts(Long vehicleId);

	

}
