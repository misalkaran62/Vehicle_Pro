package com.skbit.tms.exception;


import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.skbit.tms.response.ApiResponse;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
@RestControllerAdvice
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler{
	
	
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ApiResponse> handleNotFoundException(NotFoundException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse> ConstraintViolationExceptionHandler(ConstraintViolationException ex){
		
		 Set<ConstraintViolation<?>> constraintViolations = ex.getConstraintViolations();
	        StringBuilder messages = new StringBuilder();

	        for (ConstraintViolation<?> violation : constraintViolations) {
	            messages.append(violation.getMessage()).append("\n");
	            System.out.println(violation.getMessage());
	        }
	        ApiResponse apires=new ApiResponse(messages.toString().trim(), false);
	       
		
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	@ExceptionHandler(AlreadyExistsException.class)
	public ResponseEntity<ApiResponse> AlreadyExistsExceptionHandler(AlreadyExistsException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(NotEnabledException.class)
	public ResponseEntity<ApiResponse> NotEnabledExceptionHandler(NotEnabledException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(SQLIntegrityConstraintViolationException.class)
	public ResponseEntity<ApiResponse> SQLIntegrityConstraintViolationExceptionHandler(SQLIntegrityConstraintViolationException ex){
		String message = ex.getMessage();
		
		 if (message.contains("branch")&&message.contains("delete")) {
		        message = "You must delete the associated driver, manager, and vehicles before deleting the branch.";
		    }
		 if (message.contains("parent")&&message.contains("trip")&&message.contains("user")) {
		        message = "You must delete  associated trip before deleting the driver.";
		    }
		 if (message.contains("parent")&&message.contains("trip")&&message.contains("vehicle")) {
		        message = "You must delete  associated trip before deleting the vehicle.";
		    }
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}

	
	@ExceptionHandler(InvalidUserException.class)
	public ResponseEntity<ApiResponse> InvalidUserExceptionHandler(InvalidUserException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(PasswordViolationException.class)
	public ResponseEntity<ApiResponse> PasswordViolationExceptionHandler(PasswordViolationException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(InvalidPasswordException.class)
	public ResponseEntity<ApiResponse> InvalidPasswordExceptionHandler(InvalidPasswordException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	
	@ExceptionHandler(FileException.class)
	public ResponseEntity<ApiResponse> FileExceptionHandler(FileException ex){
		String message = ex.getMessage();
		ApiResponse apires=new ApiResponse(message, false);
		return new ResponseEntity<ApiResponse> (apires,HttpStatus.OK);
	}
	

}
