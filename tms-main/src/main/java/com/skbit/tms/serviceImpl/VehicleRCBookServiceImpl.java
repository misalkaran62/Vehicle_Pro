package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.VehicleRCBook;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleRCBookRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleRCBookService;

@Service
public class VehicleRCBookServiceImpl implements VehicleRCBookService{

	
	@Autowired
	private VehicleRCBookRepo vehicleRCBookRepo;
	
	@Override
	public ApiResponse createVehicleRCBook(VehicleRCBook vehicleRCBook) {
		vehicleRCBookRepo.save(vehicleRCBook);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleRCBook created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleRCBook(VehicleRCBook vehicleRCBook) {
		vehicleRCBookRepo.save(vehicleRCBook);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleRCBook updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleRCBook(long id) {
		Optional<VehicleRCBook> optional=vehicleRCBookRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleRCBook not found with given id"+id);
		}
		vehicleRCBookRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleRCBook deleted successfully").build();
	}
	@Override
	public VehicleRCBook findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleRCBook> optional=vehicleRCBookRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleRCBook not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleRCBook> findAll() {
		return vehicleRCBookRepo.findAll();
	}

}
