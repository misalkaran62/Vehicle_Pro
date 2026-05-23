package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.Supplier;
import com.skbit.tms.response.ApiResponse;

public interface SupplierService {

	ApiResponse createSupplier(Supplier supplier);

	ApiResponse updateSupplier(Supplier supplier);

	ApiResponse deleteSupplier(long id);
	
	Supplier findById(long id);

	List<Supplier> findAll();
	
	

}
