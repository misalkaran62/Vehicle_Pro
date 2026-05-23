package com.skbit.tms.serviceImpl;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.User;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.EmailService;
import com.skbit.tms.service.PasswordService;
import com.skbit.tms.service.UserService;
@Service
public class PasswordServiceImpl implements PasswordService{
	
	@Autowired
	private UserService userService; 
	
	@Autowired
	private PasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private EmailService emailService;
	

	@Override
	public ResponseEntity<ApiResponse> forgotPassword(String email) {
		User user=userService.findByEmail(email);
		if (user==null) {
			throw new NotFoundException("user not registered with given email");
		}
		Random random= new Random();
		int nextInt = random.nextInt(999999);
		String word=user.getFirstName();
		String password=Character.toUpperCase(word.charAt(0))+word.substring(1).toLowerCase()+"@"+nextInt;
		user.setPassword(bCryptPasswordEncoder.encode(password));
		userService.updateUser(user);
		String message = "Your VIMS password has been successfully changed.\n Password is : " + password
				+ " \n the Username is " + user.getUsername();
		emailService.sendMail(email, "Resetting Password - VIMS", message);

		ApiResponse apResp = new ApiResponse();
		apResp.setMessage("If you are registered, check email we have sent new  password");
		apResp.setStatus(true);
		return new ResponseEntity<ApiResponse>(apResp, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<ApiResponse> changePassword(String email, String oldPassword, String newPassword) {
		
		User user=userService.findByEmail(email);
		if (user!=null) {
			if (bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
//				user.setPassword(newPassword);
			
				user.setPassword(bCryptPasswordEncoder.encode(newPassword));
				userService.updateUser(user);
				ApiResponse apiResponse= new ApiResponse();
				apiResponse.setMessage("password changed successfully");
				apiResponse.setStatus(true);
				return new ResponseEntity<ApiResponse>(apiResponse,HttpStatus.OK);
			} else {
				ApiResponse apResp = new ApiResponse();
				apResp.setMessage("Incorrect password");
				apResp.setStatus(false);
				return new ResponseEntity<ApiResponse>(apResp, HttpStatus.INTERNAL_SERVER_ERROR);

			}
		}
		throw new NotFoundException("Employee not found with given email");
	}

}
