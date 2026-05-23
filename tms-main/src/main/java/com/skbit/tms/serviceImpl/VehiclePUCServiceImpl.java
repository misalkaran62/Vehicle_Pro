package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehiclePUC;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehiclePUCRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehiclePUCService;

@Service
public class VehiclePUCServiceImpl implements VehiclePUCService{

	
	@Autowired
	private VehiclePUCRepo vehiclePUCRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo; 
	
	@Override
	public ApiResponse createVehiclePUC(VehiclePUC vehiclePUC,Long vehicleId) {
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehiclePUCs().add(vehiclePUC);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehiclePUC created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehiclePUC(VehiclePUC vehiclePUC) {
		vehiclePUCRepo.save(vehiclePUC);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehiclePUC updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehiclePUC(long id) {
	    Optional<VehiclePUC> optional = vehiclePUCRepo.findById(id);
	    if (optional.isEmpty()) {
	        throw new NotFoundException("vehiclePUC not found with given id" + id);
	    }
	    VehiclePUC vehiclePUC = optional.get();
	    Long vehicleId = vehiclePUCRepo.findVehicleIdByPUCId(id);
	    Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
	    List<VehiclePUC> vehiclePUCs = vehicle.getVehiclePUCs();
	    
	    vehiclePUCs.remove(vehiclePUC);
	    vehicle.setVehiclePUCs(vehiclePUCs);
	    vehicleRepo.save(vehicle);
	    
	    vehiclePUCRepo.delete(vehiclePUC);
	    new ApiResponse();
	    return ApiResponse.builder().status(true).message("vehiclePUC deleted successfully").build();
	}

	@Override
	public VehiclePUC findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehiclePUC> optional=vehiclePUCRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehiclePUC not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehiclePUC> findAll() {
		return vehiclePUCRepo.findAll();
	}
	
	@Override
	public VehiclePUC updateRenewalDue(long roadTaxId) {
		Optional<VehiclePUC> optional = vehiclePUCRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehiclePUC vehiclePUC = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = vehiclePUC.getEndDate();

			if (endDate.isBefore(today)) {
				vehiclePUC.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(10).isBefore(today)) {
				vehiclePUC.setRenewalDue(RenewalDue.SOON);
			} else {
				vehiclePUC.setRenewalDue(RenewalDue.LATER);
			}
			

			return vehiclePUCRepo.save(vehiclePUC);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
	
	@Override
	public VehiclePUC updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehiclePUC> optionalRoadTax = vehiclePUCRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehiclePUC roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehiclePUCRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

}
