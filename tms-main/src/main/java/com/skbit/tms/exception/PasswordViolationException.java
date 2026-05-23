package com.skbit.tms.exception;

public class PasswordViolationException extends RuntimeException {
	private String msg;

	public PasswordViolationException(String msg) {
		super();
		this.msg = msg;
	}
	@Override
	public String getMessage() {
		return msg;
	}

}
