package com.skbit.tms.service;

import java.util.List;


import com.skbit.tms.entity.Branch;
import com.skbit.tms.response.ApiResponse;

public interface BranchService {

	ApiResponse createBranch(Branch Branch);

	ApiResponse updateBranch(Branch branch);

	ApiResponse deleteBranch(long id);

	Branch findById(long id);

	List<Branch> findAll();

	List<Branch> findUnassignedBranchesForRole(String string);
	

}
