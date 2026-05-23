package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.DriverStatus;
import com.skbit.tms.entity.Trip;
import com.skbit.tms.entity.TripStatus;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.TripRepo;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.repo.VehicleServicingRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.TripService;

@Service
public class TripServiceImpl implements TripService{

	
	@Autowired
	private TripRepo tripRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Autowired
	private VehicleServicingRepo vehicleServicingRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Override
	public ApiResponse createTrip(Trip trip) {
		trip.setStartDate(LocalDate.now());
		
		System.out.println("in service"+trip.getTripStatus());
		tripRepo.save(trip);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("trip created successfully").build() ;
	}

	@Override
	public ApiResponse updateTrip(Trip trip) {
		if (trip.getEndKm()!=null) {
			trip.setTotalDistance(trip.getEndKm()-trip.getStartKm());;
		}
		System.out.println("trip status update"+trip.getTripStatus());
		tripRepo.save(trip);
		
		// get vehicle servicing from trip, last meaning from the treeset the last one
		Vehicle vehicle=vehicleRepo.findById(trip.getVehicle().getVehicleId()).get();
		VehicleServicing vehicleServicing=vehicle.getVehicleServicings().stream()
                .max(Comparator.comparing(VehicleServicing::getServicingDate)).get();
		
//		 update next km servicing
		if (trip.getTotalDistance()!=null) {
			vehicleServicing.setNextKmServicing(vehicleServicing.getNextKmServicing()-trip.getTotalDistance());
		}
		
		vehicleServicingRepo.save(vehicleServicing);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("trip updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteTrip(long id) {
		Optional<Trip> optional=tripRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("trip not found with given id"+id);
		}
		Trip trip=optional.get();
		User user=trip.getUser();
		user.setDriverStatus(DriverStatus.AVAILABLE);
		userRepo.save(user);
		
		Vehicle vehicle =trip.getVehicle();
		vehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
		vehicleRepo.save(vehicle);
		tripRepo.delete(trip);
		return ApiResponse.builder().status(true).message("trip deleted successfully").build();
	}
	
	@Override
	public Trip findById(long id) {
		// TODO Auto-generated method stub
		Optional<Trip> optional=tripRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("trip not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<Trip> findAll() {
		return tripRepo.findAll();
	}

	@Override
	public List<Trip> findByVehicle(long vehicleId) {
		
		return tripRepo.findByVehicleVehicleId(vehicleId);
	}
	
	@Override
	public ApiResponse updateTripStatus(long id, TripStatus tripStatus) {
	    // Fetch the trip and ensure it exists
	    Trip trip = tripRepo.findById(id).orElseThrow(() -> new NotFoundException("Trip not found"));

	    // Update the trip status
	    trip.setTripStatus(tripStatus);

	    // Update driver and vehicle statuses based on the new trip status
	    switch (tripStatus) {
	        case IN_PROGRESS:
	            trip.getUser().setDriverStatus(DriverStatus.ON_TRIP);
	            trip.getVehicle().setVehicleStatus(VehicleStatus.ON_TRIP);
	            break;

	        case COMPLETED:
	        case CANCELLED:
	            trip.getUser().setDriverStatus(DriverStatus.AVAILABLE);
	            trip.getVehicle().setVehicleStatus(VehicleStatus.AVAILABLE);
	            break;

	        // Handle any additional cases if necessary
	        default:
	            break;
	    }

	    // Save changes to the trip, driver, and vehicle entities
	    tripRepo.save(trip);  // TripRepo is assumed to cascade to Driver and Vehicle

	    return new ApiResponse("Trip status updated successfully", true);
	}
	
	@Override
	public ApiResponse updateTripStatusCancelled(long id, String cancellationTrip) {
		 Trip trip = tripRepo.findById(id).orElseThrow(() -> new NotFoundException("Trip not found"));

		 trip.setTripStatus(TripStatus.CANCELLED);
		 trip.setCancellationReason(cancellationTrip);
		 
		 tripRepo.save(trip);
		 
		 User user=trip.getUser();
		 user.setDriverStatus(DriverStatus.AVAILABLE);
		 userRepo.save(user);
		 
		 
		 Vehicle vehicle=trip.getVehicle();
		 vehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
		 vehicleRepo.save(vehicle);
		 
		 
		 
		 return new ApiResponse("Trip status updated successfully", true);
	}

	@Override
	public List<Trip> findByBranchId(long id) {
		return tripRepo.findByBranchId(id);
	}

	@Override
	public List<Trip> findByUserId(long userId) {
		return tripRepo.findByUserId(userId);
	}

	@Override
	public List<Trip> findByStartDate(LocalDate startDate) {
		return tripRepo.findByStartDate(startDate);
	}

	@Override
	public List<Trip> findByEndDate(LocalDate endDate) {
		return tripRepo.findByEndDate(endDate);
	}

	@Override
	public List<Trip> findByBranches(List<Long> ids) {
		return tripRepo.findByBranches(ids);
	}




}
