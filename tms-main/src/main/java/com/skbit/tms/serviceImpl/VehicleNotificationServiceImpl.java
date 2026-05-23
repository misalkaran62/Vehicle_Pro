package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.VehicleNotification;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleNotificationsRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleNotificationService;

@Service
public class VehicleNotificationServiceImpl implements VehicleNotificationService{

	
	@Autowired
	private VehicleNotificationsRepo vehicleNotificationRepo;
	
	@Override
	public ApiResponse createVehicleNotification(VehicleNotification vehicleNotification) {
		vehicleNotificationRepo.save(vehicleNotification);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleNotification created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleNotification(VehicleNotification vehicleNotification) {
		vehicleNotificationRepo.save(vehicleNotification);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleNotification updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleNotification(long id) {
		Optional<VehicleNotification> optional=vehicleNotificationRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleNotification not found with given id"+id);
		}
		vehicleNotificationRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleNotification deleted successfully").build();
	}
	@Override
	public VehicleNotification findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleNotification> optional=vehicleNotificationRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleNotification not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleNotification> findAll() {
		return vehicleNotificationRepo.findAll();
	}

	@Override
	public List<VehicleNotification> findByBranchId(long id) {
		return vehicleNotificationRepo.findByBranchId(id);
	}

}
