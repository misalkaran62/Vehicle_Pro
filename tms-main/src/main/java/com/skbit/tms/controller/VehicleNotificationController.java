package com.skbit.tms.controller;

import java.security.Principal;
import java.time.LocalDate;
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

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.VehicleNotification;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserService;
import com.skbit.tms.service.VehicleNotificationService;

@RestController
@RequestMapping("/vehicleNotification")
public class VehicleNotificationController {

	@Autowired
	private VehicleNotificationService vehicleNotificationService;
	
	@Autowired
	private UserService userService;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicleNotification(@RequestBody VehicleNotification vehicleNotification,
			Principal principal) {
		return new ResponseEntity<ApiResponse>(
				this.vehicleNotificationService.createVehicleNotification(vehicleNotification), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicleNotification(@RequestBody VehicleNotification vehicleNotification) {
		return new ResponseEntity<ApiResponse>(
				this.vehicleNotificationService.updateVehicleNotification(vehicleNotification), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicleNotification(@RequestParam long id) {
		return new ResponseEntity<ApiResponse>(this.vehicleNotificationService.deleteVehicleNotification(id),
				HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public VehicleNotification findById(@PathVariable long id) {
		return this.vehicleNotificationService.findById(id);
	}

	@GetMapping("/")
	public List<VehicleNotification> findall(Principal principal) {
		User user=userService.findByEmail(principal.getName());
		if (user.getRoles().contains("Manager")) {
			Branch branch=user.getBranches().get(0);
			return this.vehicleNotificationService.findByBranchId(branch.getId());
		}
		return this.vehicleNotificationService.findAll();
	}

	@GetMapping("/byDate")
	public List<VehicleNotification> findAllByDate( @RequestParam( required = false) LocalDate createdAt){
		 LocalDate filterDate = (createdAt != null) ? createdAt : LocalDate.now().minusWeeks(1);
		return this.vehicleNotificationService.findAll()
				.stream().filter(notification -> notification.getNotificationDate() != null && !notification.getNotificationDate().isBefore(filterDate))
				.toList();
	}

}
