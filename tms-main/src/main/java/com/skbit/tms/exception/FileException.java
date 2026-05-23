package com.skbit.tms.exception;

public class FileException extends RuntimeException {
	private String msg;

	public FileException(String msg) {
		super();
		this.msg = msg;
	}
	@Override
	public String getMessage() {
		return msg;
	}

}
