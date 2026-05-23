package com.skbit.tms.service;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.enumProvider.CompletionStatus;
import com.skbit.tms.enumProvider.ServicingType;
import com.skbit.tms.response.ApiResponse;

public interface VehicleServicingService {

	ApiResponse createVehicleServicing(VehicleServicing vehicleServicing,Long vehicleId);

	ApiResponse updateVehicleServicing(VehicleServicing vehicleServicing);

	ApiResponse deleteVehicleServicing(long id,long vehicleId);
	
	VehicleServicing findById(long id);

	List<VehicleServicing> findAll();

	ApiResponse createRequestForm();

	List<VehicleServicing> findByBranchId(long id);

	ApiResponse updateApprovalStatus(Long servicingId, Boolean status);

	ApiResponse updateServicingType(Long servicingId, ServicingType servicingType);

	ApiResponse updateCompletionStatus(Long servicingId, CompletionStatus completionStatus);

	@Query("SELECT vs FROM VehicleServicing vs WHERE vs.vehicle.id = :vehicleId")
	List<VehicleServicing> findServicingByVehicleId(@Param("vehicleId") Long vehicleId);

	List<VehicleServicing> findAllServicingByVehicleId(long id);
	





}
