package com.skbit.tms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.skbit.tms.service.UserService;
import com.skbit.tms.serviceImpl.UserServiceImpl;

@SpringBootApplication
public class tms implements CommandLineRunner {

	@Autowired
	private UserServiceImpl userServiceImpl;

	public static void main(String[] args) {
		SpringApplication.run(tms.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		 userServiceImpl.createSuperAdmin();
	}

}
