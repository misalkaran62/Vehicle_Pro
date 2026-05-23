package com.skbit.tms.service;

import java.time.LocalDate;
import java.util.List;

import com.skbit.tms.entity.Trip;
import com.skbit.tms.entity.TripStatus;
import com.skbit.tms.response.ApiResponse;

public interface TripService {

	ApiResponse createTrip(Trip trip);

	ApiResponse updateTrip(Trip trip);

	ApiResponse deleteTrip(long id);
	
	Trip findById(long id);

	List<Trip> findAll();

	List<Trip> findByVehicle(long vehicleId);

	ApiResponse updateTripStatus(long id, TripStatus tripStatus);

	List<Trip> findByBranchId(long id);

	List<Trip> findByUserId(long userId);

	List<Trip> findByStartDate(LocalDate startDate);

	List<Trip> findByEndDate(LocalDate endDate);

	ApiResponse updateTripStatusCancelled(long id,String cancellationReason);

	List<Trip> findByBranches(List<Long> ids);
	

}
