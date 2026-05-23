package com.skbit.tms.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.UserLog;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.UserLogRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserLogService;

@Service
public class UserLogServiceImpl implements UserLogService{

	
	@Autowired
	private UserLogRepo userLogRepo;
	
	@Override
	public ApiResponse createUserLog(UserLog userLog) {
		userLog.setUpdatedAt(LocalDateTime.now());
		userLogRepo.save(userLog);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("userLog created successfully").build() ;
	}

	@Override
	public ApiResponse updateUserLog(UserLog userLog) {
		userLog.setUpdatedAt(LocalDateTime.now());
		userLogRepo.save(userLog);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("userLog updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteUserLog(long id) {
		Optional<UserLog> optional=userLogRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("userLog not found with given id"+id);
		}
		userLogRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("userLog deleted successfully").build();
	}
	
	@Override
	public UserLog findById(long id) {
		// TODO Auto-generated method stub
		Optional<UserLog> optional=userLogRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("userLog not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<UserLog> findAll() {
		return userLogRepo.findAll();
	}

}
