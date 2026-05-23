package com.skbit.tms.exception;

public class NotFoundException extends RuntimeException {
	private String msg;

	public NotFoundException(String msg) {
		super();
		this.msg = msg;
	}
	@Override
	public String getMessage() {
		return msg;
	}

}
