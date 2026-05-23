package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleFitness;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleFitnessRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleFitnessService;

@Service
public class VehicleFitnessServiceImpl implements VehicleFitnessService{

	
	@Autowired
	private VehicleFitnessRepo vehicleFitnessRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Override
	public ApiResponse createVehicleFitness(VehicleFitness vehicleFitness,Long vehicleId) {
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehicleFitnesses().add(vehicleFitness);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehicleFitness created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleFitness(VehicleFitness vehicleFitness) {
		vehicleFitnessRepo.save(vehicleFitness);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleFitness updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleFitness(long id) {
	    Optional<VehicleFitness> optional = vehicleFitnessRepo.findById(id);
	    if (optional.isEmpty()) {
	        throw new NotFoundException("vehicleFitness not found with given id" + id);
	    }
	    VehicleFitness vehicleFitness = optional.get();
	    Long vehicleId = vehicleFitnessRepo.findVehicleIdByFitnessId(id);
	    Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
	    List<VehicleFitness> vehicleFitnesses = vehicle.getVehicleFitnesses();
	    
	    vehicleFitnesses.remove(vehicleFitness);
	    vehicle.setVehicleFitnesses(vehicleFitnesses);
	    vehicleRepo.save(vehicle);
	    
	    vehicleFitnessRepo.delete(vehicleFitness);
	    new ApiResponse();
	    return ApiResponse.builder().status(true).message("vehicleFitness deleted successfully").build();
	}

	
	@Override
	public VehicleFitness findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleFitness> optional=vehicleFitnessRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleFitness not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleFitness> findAll() {
		return vehicleFitnessRepo.findAll();
	}
	
	@Override
	public VehicleFitness updateRenewalDue(long roadTaxId) {
		Optional<VehicleFitness> optional = vehicleFitnessRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehicleFitness vehicleFitness = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = vehicleFitness.getEndDate();

			if (endDate.isBefore(today)) {
				// If expired, set expiryStatus to RED
				vehicleFitness.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(10).isBefore(today)) {
				// If not expired but within 3 days, set expiryStatus to ORANGE
				vehicleFitness.setRenewalDue(RenewalDue.SOON);
			}
			else {
				vehicleFitness.setRenewalDue(RenewalDue.LATER);
			}
			return vehicleFitnessRepo.save(vehicleFitness);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
	
	@Override
	public VehicleFitness updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehicleFitness> optionalRoadTax = vehicleFitnessRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehicleFitness roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehicleFitnessRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

}
