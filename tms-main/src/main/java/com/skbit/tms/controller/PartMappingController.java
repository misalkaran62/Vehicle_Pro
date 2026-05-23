// PartMappingController.java
package com.skbit.tms.controller;

import com.skbit.tms.entity.PartChange;
import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.PartChangeService;
import com.skbit.tms.service.PartMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/partMapping")
public class PartMappingController {

	@Autowired
	private PartMappingService partMappingService;
	@Autowired
	private PartChangeService partChangeService;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createPartMapping(@RequestBody PartMapping partMapping,
			@RequestParam Long vehicleId) {

		

		PartMapping part = new PartMapping();

		PartChange partChange = this.partChangeService.getById(partMapping.getPartChange().getId());

		part.setDateOfPurchase(partMapping.getDateOfPurchase());
		part.setDateOfValidity(partMapping.getDateOfValidity());
		part.setSerialNumber(partMapping.getSerialNumber());
		part.setVendorName(partMapping.getVendorName());
		part.setPartChange(partChange);

		partMappingService.save(part, vehicleId);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("part mappping created successfully")
				.build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.CREATED);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updatePartMapping(@RequestBody PartMapping partMapping) {
		System.out.println("part mapping data" + partMapping);
		PartMapping part =  this.partMappingService.findById(partMapping.getId());
		part.setDateOfPurchase(partMapping.getDateOfPurchase());
		part.setDateOfValidity(partMapping.getDateOfValidity());
		part.setSerialNumber(partMapping.getSerialNumber());
		part.setVendorName(partMapping.getVendorName());
		part.setPartChange(this.partChangeService.getById(partMapping.getPartChange().getId()));

		partMappingService.update(part);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("part mappping updated successfully")
				.build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> deletePartMapping(@PathVariable long id) {
		partMappingService.deleteById(id);
		ApiResponse apiResponse = ApiResponse.builder().status(true).message("part mappping deleted successfully")
				.build();
		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public PartMapping findById(@PathVariable long id) {
		return partMappingService.findById(id);
	}

	@GetMapping
	public List<PartMapping> findAll() {
		return partMappingService.findAll();
	}
}
