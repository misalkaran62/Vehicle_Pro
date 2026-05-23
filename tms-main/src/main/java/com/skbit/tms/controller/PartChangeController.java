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
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.PartChange;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.PartChangeService;


@RestController
@RequestMapping("partChange")
public class PartChangeController {
	
	@Autowired
	private PartChangeService partChangeService;
	
	
	@PostMapping("/")
	public ResponseEntity<ApiResponse> create(@RequestBody PartChange partChange) {
		partChangeService.create(partChange);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("vehicle part created successfully").build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.CREATED);
		
	}
	
	@PutMapping("/")
	public ResponseEntity<ApiResponse> update(@RequestBody PartChange partChange) {
		partChangeService.update(partChange);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("vehicle part updated successfully").build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.CREATED);
		
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
		partChangeService.delete(id);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("vehicle part deleted successfully").build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.CREATED);
		
	}
	
	@GetMapping("/{id}")
	public PartChange getById(@PathVariable Long id) {
		return partChangeService.getById(id);
		
	}
	
	@GetMapping("/")
	public List<PartChange> getAll() {
		return partChangeService.getAll();
		
	}

}
