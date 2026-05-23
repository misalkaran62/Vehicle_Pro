package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleInsurance;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleInsuranceRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleInsuranceService;

@Service
public class VehicleInsuranceServiceImpl implements VehicleInsuranceService{

	
	@Autowired
	private VehicleInsuranceRepo vehicleInsuranceRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Override
	public ApiResponse createVehicleInsurance(VehicleInsurance vehicleInsurance,Long vehicleId) {
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehicleInsurances().add(vehicleInsurance);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehicleInsurance created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleInsurance(VehicleInsurance vehicleInsurance) {
		vehicleInsuranceRepo.save(vehicleInsurance);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleInsurance updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleInsurance(long id) {
	    Optional<VehicleInsurance> optional = vehicleInsuranceRepo.findById(id);
	    if (optional.isEmpty()) {
	        throw new NotFoundException("vehicleInsurance not found with given id" + id);
	    }
	    VehicleInsurance vehicleInsurance = optional.get();
	    Long vehicleId = vehicleInsuranceRepo.findVehicleIdByInsuranceId(id);
	    Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
	    List<VehicleInsurance> vehicleInsurances = vehicle.getVehicleInsurances();
	    
	    vehicleInsurances.remove(vehicleInsurance);
	    vehicle.setVehicleInsurances(vehicleInsurances);
	    vehicleRepo.save(vehicle);
	    
	    vehicleInsuranceRepo.delete(vehicleInsurance);
	    new ApiResponse();
	    return ApiResponse.builder().status(true).message("vehicleInsurance deleted successfully").build();
	}

	@Override
	public VehicleInsurance findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleInsurance> optional=vehicleInsuranceRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleInsurance not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleInsurance> findAll() {
		return vehicleInsuranceRepo.findAll();
	}

	
	@Override
	public VehicleInsurance updateRenewalDue(long roadTaxId) {
		Optional<VehicleInsurance> optional = vehicleInsuranceRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehicleInsurance vehicleInsurance = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = vehicleInsurance.getEndDate();

			if (endDate.isBefore(today)) {
				// If expired, set expiryStatus to RED
				vehicleInsurance.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(10).isBefore(today)) {
				// If not expired but within 3 days, set expiryStatus to ORANGE
				vehicleInsurance.setRenewalDue(RenewalDue.SOON);
			} 
			else {
				vehicleInsurance.setRenewalDue(RenewalDue.LATER);
			}

			return vehicleInsuranceRepo.save(vehicleInsurance);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
	
	@Override
	public VehicleInsurance updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehicleInsurance> optionalRoadTax = vehicleInsuranceRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehicleInsurance roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehicleInsuranceRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
}

