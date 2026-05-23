package com.skbit.tms.controller;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.skbit.tms.entity.InsuranceCompany;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.InsuranceCompanyService;

@RestController
@RequestMapping("/insuranceCompany")
public class InsuranceCompanyController {
	
	@Autowired
	private InsuranceCompanyService insuranceCompanyService;
    Logger logger=LoggerFactory.getLogger(InsuranceCompanyController.class);
	
	@PostMapping("/")
	public ResponseEntity<ApiResponse> createInsuranceCompany(@RequestBody InsuranceCompany insuranceCompany){
		logger.info("hi in backend");
		logger.info("insurance company",insuranceCompany);
		return new ResponseEntity<ApiResponse>(this.insuranceCompanyService.createInsuranceCompany(insuranceCompany),HttpStatus.OK);
	}
	
	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateInsuranceCompany(@RequestBody InsuranceCompany insuranceCompany){
		return new ResponseEntity<ApiResponse>(this.insuranceCompanyService.updateInsuranceCompany(insuranceCompany),HttpStatus.OK);
	}
	
	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteInsuranceCompany(@RequestParam long id){
		return new ResponseEntity<ApiResponse>(this.insuranceCompanyService.deleteInsuranceCompany(id),HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public InsuranceCompany findById(@PathVariable long id){
		return this.insuranceCompanyService.findById(id);
	}
	
	@GetMapping("/")
	public List<InsuranceCompany> findall(){
		return this.insuranceCompanyService.findAll();
	}
	

}
