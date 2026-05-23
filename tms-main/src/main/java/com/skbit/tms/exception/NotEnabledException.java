package com.skbit.tms.exception;

public class NotEnabledException extends RuntimeException {
	
	private String msg;

	public NotEnabledException(String msg) {
		super();
		this.msg = msg;
	}
	
	public String getMessage() {
		return msg;
	}

}
