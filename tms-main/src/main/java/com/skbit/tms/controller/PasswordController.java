package com.skbit.tms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skbit.tms.entity.User;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.PasswordService;
import com.skbit.tms.service.UserService;

@RestController
@RequestMapping("/password")
public class PasswordController {
	
	@Autowired
	private PasswordService passwordService;
	
	@Autowired
	private PasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private UserService userService;
	
	
	@GetMapping("/forgot")
	public ResponseEntity<ApiResponse> forgotPassword(@RequestParam String email){
		return passwordService.forgotPassword(email);
	}
	
	@GetMapping("/change")
	public ResponseEntity<ApiResponse> changePassword(@RequestParam String email, @RequestParam String oldPassword,@RequestParam String newPassword){
		return passwordService.changePassword(email,oldPassword,newPassword);
	}
	
	@GetMapping("/check")
	public Boolean checkPassword(@RequestParam String email,@RequestParam String password) {
		User user=userService.findByEmail(email);
		return bCryptPasswordEncoder.matches(password, user.getPassword());
	}

}
