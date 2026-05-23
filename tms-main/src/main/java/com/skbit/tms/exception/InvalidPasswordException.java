package com.skbit.tms.exception;

public class InvalidPasswordException extends RuntimeException {
	
	private String msg;

	public InvalidPasswordException(String msg) {
		super();
		this.msg = msg;
	}
	@Override
	public String getMessage() {
		return msg;
	}

}
