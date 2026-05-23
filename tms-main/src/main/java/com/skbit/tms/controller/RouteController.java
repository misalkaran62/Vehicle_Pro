package com.skbit.tms.controller;

import java.security.Principal;
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
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.Route;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.RouteService;

@RestController
@RequestMapping("/route")
public class RouteController {

	@Autowired
	private RouteService routeService;


	@PostMapping("/")
	public ResponseEntity<ApiResponse> create(@RequestBody Route route,Principal principal) {
	String	currentUser=principal.getName();



		return new ResponseEntity<ApiResponse>(this.routeService.addRoute(route,currentUser), HttpStatus.OK);
	}

	@GetMapping("/")
	public List<Route> getAll() {
		return routeService.getRoutes();
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> update(@RequestBody Route route) {
		return new ResponseEntity<ApiResponse>(this.routeService.update(route), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
		return new ResponseEntity<ApiResponse>(this.routeService.delete(id), HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public Route getRouteById(@PathVariable Long id) {
		return routeService.getRouteById(id);
	}
}
