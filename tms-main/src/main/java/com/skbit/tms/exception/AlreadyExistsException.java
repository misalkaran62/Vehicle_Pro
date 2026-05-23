package com.skbit.tms.exception;

public class AlreadyExistsException extends RuntimeException{
	private String msg;

	public AlreadyExistsException(String msg) {
		super();
		this.msg = msg;
	}
	@Override
	public String getMessage() {
		return msg;
	}

}
