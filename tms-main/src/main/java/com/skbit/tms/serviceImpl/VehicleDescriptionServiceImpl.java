package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.VehicleDescription;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleDescriptionRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleDescriptionService;

@Service
public class VehicleDescriptionServiceImpl implements VehicleDescriptionService{

	
	@Autowired
	private VehicleDescriptionRepo vehicleDescriptionRepo;
	
	@Override
	public ApiResponse createVehicleDescription(VehicleDescription vehicleDescription) {
		vehicleDescriptionRepo.save(vehicleDescription);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleDescription created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleDescription(VehicleDescription vehicleDescription) {
		vehicleDescriptionRepo.save(vehicleDescription);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleDescription updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleDescription(long id) {
		Optional<VehicleDescription> optional=vehicleDescriptionRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleDescription not found with given id"+id);
		}
		vehicleDescriptionRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleDescription deleted successfully").build();
	}
	
	@Override
	public VehicleDescription findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleDescription> optional=vehicleDescriptionRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleDescription not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleDescription> findAll() {
		return vehicleDescriptionRepo.findAll();
	}

}
