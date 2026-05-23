package com.skbit.tms.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skbit.tms.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

	User findByEmail(String email);

	List<User> findByBranches_IdAndRolesContaining(Long branchId, String role);

	List<User> findByRolesContaining(String role);

	User findByMobileNo(long mobileNo);

	@Query("SELECT u FROM User u JOIN u.branches b WHERE b.id IN :branchIds")
    List<User> findByBranches(@Param("branchIds") List<Long> branchIds);
	
	User findByDrivingLicenseNumber(String licenseNumber);
}