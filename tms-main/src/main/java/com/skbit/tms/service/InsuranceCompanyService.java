package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.InsuranceCompany;
import com.skbit.tms.response.ApiResponse;

public interface InsuranceCompanyService {

	ApiResponse createInsuranceCompany(InsuranceCompany insuranceCompany);

	ApiResponse updateInsuranceCompany(InsuranceCompany insuranceCompany);

	ApiResponse deleteInsuranceCompany(long id);
	
	InsuranceCompany findById(long id);

	List<InsuranceCompany> findAll();

}
