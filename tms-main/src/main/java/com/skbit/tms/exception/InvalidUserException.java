package com.skbit.tms.exception;

public class InvalidUserException extends RuntimeException {
	private String msg;

	public InvalidUserException(String msg) {
		super();
		this.msg = msg;
	}
	
	@Override
	public String getMessage() {
		return msg;
	}

}
