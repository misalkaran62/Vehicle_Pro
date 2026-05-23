package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehiclePermitRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehiclePermitService;

@Service
public class VehiclePermitServiceImpl implements VehiclePermitService{

	
	@Autowired
	private VehiclePermitRepo vehiclePermitRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Override
	public ApiResponse createVehiclePermit(VehiclePermit vehiclePermit,Long vehicleId) {
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehiclePermits().add(vehiclePermit);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehiclePermit created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehiclePermit(VehiclePermit vehiclePermit) {
		vehiclePermitRepo.save(vehiclePermit);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehiclePermit updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehiclePermit(long id) {
	    Optional<VehiclePermit> optional = vehiclePermitRepo.findById(id);
	    if (optional.isEmpty()) {
	        throw new NotFoundException("vehiclePermit not found with given id" + id);
	    }
	    VehiclePermit vehiclePermit = optional.get();
	    Long vehicleId = vehiclePermitRepo.findVehicleIdByPermitId(id);
	    Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
	    List<VehiclePermit> vehiclePermits = vehicle.getVehiclePermits();
	    
	    vehiclePermits.remove(vehiclePermit);
	    vehicle.setVehiclePermits(vehiclePermits);
	    vehicleRepo.save(vehicle);
	    
	    vehiclePermitRepo.delete(vehiclePermit);
	    new ApiResponse();
	    return ApiResponse.builder().status(true).message("vehiclePermit deleted successfully").build();
	}

	@Override
	public VehiclePermit findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehiclePermit> optional=vehiclePermitRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehiclePermit not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehiclePermit> findAll() {
		return vehiclePermitRepo.findAll();
	}
	@Override
	public VehiclePermit updateRenewalDue(long roadTaxId) {
		Optional<VehiclePermit> optional = vehiclePermitRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehiclePermit roadTax = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = roadTax.getEndDate();

			if (endDate.isBefore(today)) {
				// If expired, set expiryStatus to RED
				roadTax.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(10).isBefore(today)) {
				// If not expired but within 3 days, set expiryStatus to ORANGE
				roadTax.setRenewalDue(RenewalDue.SOON);
			} 
			
			else {
				roadTax.setRenewalDue(RenewalDue.LATER);
			}

			return vehiclePermitRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
	@Override
	public VehiclePermit updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehiclePermit> optionalRoadTax = vehiclePermitRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehiclePermit roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehiclePermitRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

}
