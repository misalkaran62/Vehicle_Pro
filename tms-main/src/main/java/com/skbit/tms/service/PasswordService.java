package com.skbit.tms.service;

import org.springframework.http.ResponseEntity;

import com.skbit.tms.response.ApiResponse;

public interface PasswordService {

	ResponseEntity<ApiResponse> forgotPassword(String email);

	ResponseEntity<ApiResponse> changePassword(String email, String oldPassword, String newPassword);


}
