package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.InsuranceCompany;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.InsuranceCompanyRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.InsuranceCompanyService;

@Service
public class InsuranceCompanyServiceImpl implements InsuranceCompanyService{

	
	@Autowired
	private InsuranceCompanyRepo insuranceCompanyRepo;
	
	@Override
	public ApiResponse createInsuranceCompany(InsuranceCompany insuranceCompany) {
		System.out.println(" im in service nd saving to db");
		insuranceCompanyRepo.save(insuranceCompany);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("insuranceCompany created successfully").build() ;
	}

	@Override
	public ApiResponse updateInsuranceCompany(InsuranceCompany insuranceCompany) {
		insuranceCompanyRepo.save(insuranceCompany);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("insuranceCompany updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteInsuranceCompany(long id) {
		Optional<InsuranceCompany> optional=insuranceCompanyRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("insuranceCompany not found with given id"+id);
		}
		insuranceCompanyRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("insuranceCompany deleted successfully").build();
	}
	
	@Override
	public InsuranceCompany findById(long id) {
		// TODO Auto-generated method stub
		Optional<InsuranceCompany> optional=insuranceCompanyRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("insuranceCompany not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<InsuranceCompany> findAll() {
		return insuranceCompanyRepo.findAll();
	}

}
