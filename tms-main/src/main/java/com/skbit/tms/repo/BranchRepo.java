package com.skbit.tms.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skbit.tms.entity.Branch;

public interface BranchRepo extends JpaRepository<Branch, Long>{

	boolean existsByBranchName(String branchName);

	boolean existsByBranchContactPersonMobile(String branchContactPersonMobile);

	boolean existsByBranchLocation(String branchLocation);

}
