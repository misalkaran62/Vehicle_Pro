package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.Supplier;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.SupplierRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.SupplierService;

@Service
public class SupplierServiceImpl implements SupplierService{

	
	@Autowired
	private SupplierRepo supplierRepo;
	
	@Override
	public ApiResponse createSupplier(Supplier supplier) {
		supplierRepo.save(supplier);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("supplier created successfully").build() ;
	}

	@Override
	public ApiResponse updateSupplier(Supplier supplier) {
		supplierRepo.save(supplier);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("supplier updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteSupplier(long id) {
		Optional<Supplier> optional=supplierRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("supplier not found with given id"+id);
		}
		supplierRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("supplier deleted successfully").build();
	}
	
	@Override
	public Supplier findById(long id) {
		// TODO Auto-generated method stub
		Optional<Supplier> optional=supplierRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("supplier not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<Supplier> findAll() {
		return supplierRepo.findAll();
	}

}
