package com.skbit.tms.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.exception.AlreadyExistsException;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.BranchRepo;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.BranchService;

@Service
public class BranchServiceImpl implements BranchService{

	
	@Autowired
	private BranchRepo branchRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Override
	public ApiResponse createBranch(Branch branch) {
	  
		if(branchRepo.existsByBranchName(branch.getBranchName())) {
			throw new AlreadyExistsException("branch already exists with given name");
		}
		if(branchRepo.existsByBranchContactPersonMobile(branch.getBranchContactPersonMobile())) {
			throw new AlreadyExistsException("branch already exists with given mobile number");
		}
		if(branchRepo.existsByBranchLocation(branch.getBranchLocation())) {
			throw new AlreadyExistsException("branch already exists with given location");
		}
		branchRepo.save(branch);
		return ApiResponse.builder().status(true).message("branch created successfully").build() ;
	}

	@Override
	public ApiResponse updateBranch(Branch branch) {
		Branch dbBranch=branchRepo.findById(branch.getId()).get();
		if(branchRepo.existsByBranchName(branch.getBranchName())&&!(dbBranch.getBranchName().equals(branch.getBranchName()))) {
			return ApiResponse.builder().status(false).message("branch already exists with given name").build();
		}
	
		branchRepo.save(branch);
		
		return ApiResponse.builder().status(true).message("branch updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteBranch(long id) {
		Optional<Branch> optional=branchRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("branch not found with given id"+id);
		}
		branchRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("branch deleted successfully").build();
	}

	@Override
	public Branch findById(long id) {
		Optional<Branch> optional=branchRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("branch not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<Branch> findAll() {
		return branchRepo.findAll();
	}

	@Override
	public List<Branch> findUnassignedBranchesForRole(String role) {
		
		 // Fetch branches assigned to users with the specified role
        List<Branch> assignedBranches = userRepo.findByRolesContaining(role)
                .stream()
                .flatMap(user -> user.getBranches().stream())
                .collect(Collectors.toList());

        // Fetch all branches and filter out assigned ones
        List<Branch> allBranches = branchRepo.findAll();
        return allBranches.stream()
                .filter(branch -> !assignedBranches.contains(branch))
                .collect(Collectors.toList());
    }
	

}
