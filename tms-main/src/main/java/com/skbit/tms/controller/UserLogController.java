package com.skbit.tms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.UserLog;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserLogService;

@RestController
@RequestMapping("/userLog")
public class UserLogController {
	
	@Autowired
	private UserLogService userLogService;
	
	@PostMapping("/")
	public ResponseEntity<ApiResponse> createUserLog(@RequestBody UserLog userLog){
		return new ResponseEntity<ApiResponse>(this.userLogService.createUserLog(userLog),HttpStatus.OK);
	}
	
	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateUserLog(@RequestBody UserLog userLog){
		return new ResponseEntity<ApiResponse>(this.userLogService.updateUserLog(userLog),HttpStatus.OK);
	}
	
	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteUserLog(@RequestParam long id){
		return new ResponseEntity<ApiResponse>(this.userLogService.deleteUserLog(id),HttpStatus.OK);
	}
	@GetMapping("/{id}")
	public UserLog findById(@PathVariable long id){
		return this.userLogService.findById(id);
	}
	
	@GetMapping("/")
	public List<UserLog> findall(){
		return this.userLogService.findAll();
	}
	

}
