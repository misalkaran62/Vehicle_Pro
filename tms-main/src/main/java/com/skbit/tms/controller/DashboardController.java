package com.skbit.tms.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.Dashboard;
import com.skbit.tms.entity.User;
import com.skbit.tms.repo.VehicleNotificationsRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.DashboardService;
import com.skbit.tms.service.TripService;
import com.skbit.tms.service.UserService;
import com.skbit.tms.service.VehicleNotificationService;
import com.skbit.tms.service.VehicleService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private UserService userService;

	@Autowired
	private TripService tripService;
	
	@Autowired
	private VehicleService vehicleService;
	

	@Autowired
	private VehicleNotificationService notificationService;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createDashboard(@RequestBody Dashboard dashboard) {
		return new ResponseEntity<>(dashboardService.createDashboard(dashboard), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateDashboard(@RequestBody Dashboard dashboard) {
		return new ResponseEntity<>(dashboardService.updateDashboard(dashboard), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteDashboard(@RequestParam Long id) {
		return new ResponseEntity<>(dashboardService.deleteDashboard(id), HttpStatus.OK);
	}

	@GetMapping("/")
	public Dashboard getDashboard(Principal principal) {
		User user=userService.findByEmail(principal.getName());
		
		Dashboard dashboard=new Dashboard();
		
		
		if (user.getRoles().contains("Manager")){
			Branch branch=user.getBranches().get(0);
			dashboard.setTotalTrip(tripService.findByBranchId(branch.getId()).size());
			dashboard.setTotalVehicle(vehicleService.findByBranchId(branch.getId()).size());
			dashboard.setTotalNotification(notificationService.findByBranchId(branch.getId()).size());
			return dashboard;
		}
		else if(user.getRoles().contains("Driver")) {
			dashboard.setTotalTrip(tripService.findByUserId(user.getId()).size());
			return dashboard;
			
		}
		else if(user.getRoles().contains("RegionalManager")) {
			List<Branch> branches=user.getBranches();
			int totalTrip=0;
			int totalVehicle=0;
			int totalNotification=0;
			for (Branch branch2 : branches) {
				totalTrip+=tripService.findByBranchId(branch2.getId()).size();
				totalVehicle+=vehicleService.findByBranchId(branch2.getId()).size();
				totalNotification+=notificationService.findByBranchId(branch2.getId()).size();
			}
			dashboard.setTotalTrip(totalTrip);
			dashboard.setTotalVehicle(totalVehicle);
			dashboard.setTotalNotification(totalNotification);
			return dashboard;
			
		}
		dashboard.setTotalTrip(tripService.findAll().size());
		dashboard.setTotalVehicle(vehicleService.findAll().size());
		dashboard.setTotalNotification(notificationService.findAll().size());
		return dashboard;
	}

}
