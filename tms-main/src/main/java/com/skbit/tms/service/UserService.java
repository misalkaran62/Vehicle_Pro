package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.DriverStatus;
import com.skbit.tms.entity.User;
import com.skbit.tms.response.ApiResponse;

public interface UserService {

	ApiResponse createUser(User user);

	ApiResponse updateUser(User user);

	ApiResponse deleteUser(long id);
	
	User findById(long id);

	List<User> findAll();

	User findByEmail(String email);

	List<User> findByBranchId(long branchId);

	List<User> findByRoleAndBranchId(String role, long branchId);

	User findUserByName(String name);

	List<User> findByRole(String role);
	
	 ApiResponse updateDriverStatus(long id, DriverStatus driverStatus) ;

	ApiResponse updateUserStatus(Long userId, Boolean status);

	User findByMobileNo(long mobileNo);

	List<User> findByBranches(List<Long> ids);
	

}
