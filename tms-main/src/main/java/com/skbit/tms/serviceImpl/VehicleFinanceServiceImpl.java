package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleFinanceRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleFinanceService;

@Service
public class VehicleFinanceServiceImpl implements VehicleFinanceService{

	
	@Autowired
	private VehicleFinanceRepo vehicleFinanceRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Override
	public ApiResponse createVehicleFinance(VehicleFinance vehicleFinance) {
		vehicleFinanceRepo.save(vehicleFinance);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleFinance created successfully").build() ;
	}

	@Override
	public ApiResponse updateVehicleFinance(VehicleFinance vehicleFinance) {
		vehicleFinanceRepo.save(vehicleFinance);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleFinance updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteVehicleFinance(long id) {
	    Optional<VehicleFinance> optional = vehicleFinanceRepo.findById(id);
	    if (optional.isEmpty()) {
	        throw new NotFoundException("vehicleFinance not found with given id" + id);
	    }
	    VehicleFinance vehicleFinance = optional.get();
	    Long vehicleId = vehicleFinanceRepo.findVehicleIdByFinanceId(id);
	    Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
	    List<VehicleFinance> vehicleFinances = vehicle.getVehicleFinances();
	    
	    vehicleFinances.remove(vehicleFinance);
	    vehicle.setVehicleFinances(vehicleFinances);
	    vehicleRepo.save(vehicle);
	    
	    vehicleFinanceRepo.delete(vehicleFinance);
	    new ApiResponse();
	    return ApiResponse.builder().status(true).message("vehicleFinance deleted successfully").build();
	}

	@Override
	public VehicleFinance findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleFinance> optional=vehicleFinanceRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleFinance not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleFinance> findAll() {
		return vehicleFinanceRepo.findAll();
	}
	
	@Override
	public VehicleFinance updateRenewalDue(long roadTaxId) {
		Optional<VehicleFinance> optional = vehicleFinanceRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehicleFinance vehicleFinance = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = vehicleFinance.getEndDate();

			if (endDate.isBefore(today)) {
				// If expired, set expiryStatus to RED
				vehicleFinance.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(10).isBefore(today)) {
				// If not expired but within 3 days, set expiryStatus to ORANGE
				vehicleFinance.setRenewalDue(RenewalDue.SOON);
			} 

			return vehicleFinanceRepo.save(vehicleFinance);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

	@Override
	public VehicleFinance updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehicleFinance> optionalRoadTax = vehicleFinanceRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehicleFinance roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehicleFinanceRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}
	

}
