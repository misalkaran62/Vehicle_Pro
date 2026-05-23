package com.skbit.tms.service;

import java.util.List;

import com.skbit.tms.entity.UserLog;
import com.skbit.tms.response.ApiResponse;

public interface UserLogService {

	ApiResponse createUserLog(UserLog userLog);

	ApiResponse updateUserLog(UserLog userLog);

	ApiResponse deleteUserLog(long id);
	
	UserLog findById(long id);

	List<UserLog> findAll();
	

}
