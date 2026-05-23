package com.skbit.tms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.VehicleDescription;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleDescriptionService;

@RestController
@RequestMapping("/vehicleDescription")
public class VehicleDescriptionController {
	
	@Autowired
	private VehicleDescriptionService vehicleDescriptionService;
	
	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicleDescription(@RequestBody VehicleDescription vehicleDescription){
		return new ResponseEntity<ApiResponse>(this.vehicleDescriptionService.createVehicleDescription(vehicleDescription),HttpStatus.OK);
	}
	
	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicleDescription(@RequestBody VehicleDescription vehicleDescription){
		return new ResponseEntity<ApiResponse>(this.vehicleDescriptionService.updateVehicleDescription(vehicleDescription),HttpStatus.OK);
	}
	
	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicleDescription(@RequestParam long id){
		return new ResponseEntity<ApiResponse>(this.vehicleDescriptionService.deleteVehicleDescription(id),HttpStatus.OK);
	}
	@GetMapping("/{id}")
	public VehicleDescription findById(@PathVariable long id){
		return this.vehicleDescriptionService.findById(id);
	}
	
	@GetMapping("/")
	public List<VehicleDescription> findall(){
		return this.vehicleDescriptionService.findAll();
	}
	

}
