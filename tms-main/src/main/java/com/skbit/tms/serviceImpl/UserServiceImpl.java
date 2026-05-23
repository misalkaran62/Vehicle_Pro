package com.skbit.tms.serviceImpl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.DriverStatus;
import com.skbit.tms.entity.User;
import com.skbit.tms.exception.AlreadyExistsException;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.exception.PasswordViolationException;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserService;
@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserRepo userRepo;
	
//	@Autowired
//	private  BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	private  PasswordEncoder passwordEncoder;

	@Override
	public ApiResponse createUser(User user) {
		if (!(Pattern.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$", user.getPassword()))) {
			throw new PasswordViolationException("password must be at least 8 chars long and must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special char");
		}
		user.setCreatedAt(LocalDate.now());
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		User findByEmail=userRepo.findByEmail(user.getEmail());
		User findByLicenseNumber=null;
		if (user.getRoles().contains("Driver")){
			findByLicenseNumber=userRepo.findByDrivingLicenseNumber(user.getDrivingLicenseNumber());
		}
		
		
		if (findByEmail!=null) {
			throw new AlreadyExistsException("user is already present with given email");
		}
		if (findByLicenseNumber!=null) {
			throw new AlreadyExistsException("user is already present with given Driving License No.");
		}
		
		userRepo.save(user);
		return ApiResponse.builder().status(true).message("user created successfully").build() ;
	}

	@Override
	public ApiResponse updateUser(User user) {
		User dbUser=userRepo.findById(user.getId()).get();
		User findByEmail=userRepo.findByEmail(user.getEmail());
		if (findByEmail!=null&&(!user.getEmail().equals(dbUser.getEmail()))) {
			throw new AlreadyExistsException("user is already present with given email");
		}
		user.setPassword(dbUser.getPassword());
		user.setCreatedAt(dbUser.getCreatedAt());
		user.setUpdatedAt(LocalDate.now());
		user.setStatus(dbUser.isStatus());
		userRepo.save(user);
		new ApiResponse();
		if (user.getRoles().contains("Driver")) {
			return ApiResponse.builder().status(true).message("driver updated successfully").build();
		}
		return ApiResponse.builder().status(true).message("user updated successfully").build();
		
	}

	@Override
	public ApiResponse deleteUser(long id) {
		Optional<User> optional=userRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("user not found with given id"+id);
		}
		userRepo.delete(optional.get());
		if(optional.get().getRoles().contains("Driver")) {
			
			return ApiResponse.builder().status(true).message("driver deleted successfully").build();
		}
		else {
			return ApiResponse.builder().status(true).message("user deleted successfully").build();
		}
		
	}
	@Override
	public User findById(long id) {
		Optional<User> optional=userRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("user not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<User> findAll() {
		return userRepo.findAll();
	}

	@Override
	public User findByEmail(String email) {
		return userRepo.findByEmail(email);
	}

	@Override
	public List<User> findByBranchId(long branchId) {
		return userRepo.findByBranches_IdAndRolesContaining(branchId, "DRIVER");
	}

	@Override
	public List<User> findByRoleAndBranchId(String role, long branchId) {
		return userRepo.findByBranches_IdAndRolesContaining(branchId, role);
	}

	@Override
	public User findUserByName(String name) {
		return userRepo.findByEmail(name);
	}

	@Override
	public List<User> findByRole(String role) {
		return userRepo.findByRolesContaining(role);
	}

	@Override
	public ApiResponse updateDriverStatus(long id, DriverStatus driverStatus) {
	    User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
	    user.setDriverStatus(driverStatus);
	    userRepo.save(user);
	    return new ApiResponse("Driver status updated successfully", true);
	}

	@Override
	public ApiResponse updateUserStatus(Long userId, Boolean status) {

		  User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		    user.setStatus(status);
		    userRepo.save(user);
		    return new ApiResponse("User status updated successfully", true);
	}

	@Override
	public User findByMobileNo(long mobileNo) {
		return userRepo.findByMobileNo(mobileNo);
	}

	@Override
	public List<User> findByBranches(List<Long> ids) {
		return userRepo.findByBranches(ids);
	}
	
	
	public ApiResponse createSuperAdmin() {
		
		
		List<User> users=userRepo.findByRolesContaining("SUPERADMIN");
		
		ApiResponse response=new ApiResponse();
		if (users.size()==0) {
			User user=new User();
			user.setEmail("tms@gmail.com");
			user.setPassword(passwordEncoder.encode("Transport@123"));
			user.setRoles(new HashSet<String>(Set.of("SUPERADMIN")));
			user.setFirstName("Arvind");
			user.setLastName("kumar");
			user.setMobileNo(8600861273l);
			user.setStatus(true);
			userRepo.save(user);;
			response.setMessage("nill");
			response.setStatus(true);
			
			return response;
		}
		response.setMessage("create successfully");
		response.setStatus(false);
		return response;
		
		
	}
	
	
}
