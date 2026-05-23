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

import com.skbit.tms.entity.Supplier;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.SupplierService;

@RestController
@RequestMapping("/supplier")
public class SupplierController {
	
	@Autowired
	private SupplierService supplierService;
	
	@PostMapping("/")
	public ResponseEntity<ApiResponse> createSupplier(@RequestBody Supplier supplier){
		return new ResponseEntity<ApiResponse>(this.supplierService.createSupplier(supplier),HttpStatus.OK);
	}
	
	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateSupplier(@RequestBody Supplier supplier){
		return new ResponseEntity<ApiResponse>(this.supplierService.updateSupplier(supplier),HttpStatus.OK);
	}
	
	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteSupplier(@RequestParam long id){
		return new ResponseEntity<ApiResponse>(this.supplierService.deleteSupplier(id),HttpStatus.OK);
	}
	@GetMapping("/{id}")
	public Supplier findById(@PathVariable long id){
		return this.supplierService.findById(id);
	}
	
	@GetMapping("/")
	public List<Supplier> findall(){
		return this.supplierService.findAll();
	}
	

}
