package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleRoadTax;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.repo.VehicleRoadTaxRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleRoadTaxService;

@Service
public class VehicleRoadTaxServiceImpl implements VehicleRoadTaxService {

	@Autowired
	private VehicleRoadTaxRepo vehicleRoadTaxRepo;
	
	@Autowired
	private VehicleRepo vehicleRepo;

	@Override
	public ApiResponse createVehicleRoadTax(VehicleRoadTax vehicleRoadTax,Long vehicleId) {
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehicleRoadTaxes().add(vehicleRoadTax);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehicleRoadTax created successfully").build();
	}

	@Override
	public ApiResponse updateVehicleRoadTax(VehicleRoadTax vehicleRoadTax) {
		vehicleRoadTaxRepo.save(vehicleRoadTax);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleRoadTax updated successfully").build();

	}

	@Override
	public ApiResponse deleteVehicleRoadTax(long id) {
		Optional<VehicleRoadTax> optional = vehicleRoadTaxRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleRoadTax not found with given id" + id);
		}
		VehicleRoadTax vehicleRoadTax=optional.get();
		Long vehicleId=vehicleRoadTaxRepo.findVehicleIdByRoadTaxId(id);
		Vehicle vehicle=vehicleRepo.findById(vehicleId).get();
		List<VehicleRoadTax> vehicleRoadTaxes = vehicle.getVehicleRoadTaxes();
		
		vehicleRoadTaxes.remove(vehicleRoadTax);
		vehicle.setVehicleRoadTaxes(vehicleRoadTaxes);
		vehicleRepo.save(vehicle);
		
		vehicleRoadTaxRepo.delete(vehicleRoadTax);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleRoadTax deleted successfully").build();
	}

	@Override
	public VehicleRoadTax findById(long id) {
		// TODO Auto-generated method stub
		Optional<VehicleRoadTax> optional = vehicleRoadTaxRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleRoadTax not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleRoadTax> findAll() {
		return vehicleRoadTaxRepo.findAll();
	}

	@Override
	public VehicleRoadTax updateRenewalDue(long roadTaxId) {
		Optional<VehicleRoadTax> optional = vehicleRoadTaxRepo.findById(roadTaxId);

		if (optional.isPresent()) {
			VehicleRoadTax roadTax = optional.get();
			LocalDate today = LocalDate.now();
			LocalDate endDate = roadTax.getEndDate();

			if (endDate.isBefore(today)) {
				// If expired, set expiryStatus to RED
				roadTax.setRenewalDue(RenewalDue.EXPIRED);
			} else if (endDate.minusDays(3).isBefore(today)) {
				// If not expired but within 3 days, set expiryStatus to ORANGE
				roadTax.setRenewalDue(RenewalDue.SOON);
			} else {
				roadTax.setRenewalDue(RenewalDue.LATER);
			}

			return vehicleRoadTaxRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

	@Override
	public VehicleRoadTax updateFormFillStatus(long roadTaxId,boolean status) {
		Optional<VehicleRoadTax> optionalRoadTax = vehicleRoadTaxRepo.findById(roadTaxId);
		if (optionalRoadTax.isPresent()) {
			VehicleRoadTax roadTax = optionalRoadTax.get();
			roadTax.setFormFillStatus(status);	
			
			return vehicleRoadTaxRepo.save(roadTax);
		} else {
			throw new NotFoundException("VehicleRoadTax not found with id: " + roadTaxId);
		}
	}

}
