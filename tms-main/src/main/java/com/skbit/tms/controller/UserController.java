package com.skbit.tms.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.DriverStatus;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.exception.AlreadyExistsException;
import com.skbit.tms.exception.FileException;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");
//	private static final String FILE_DIRECTORY = "C:\\Anant\\skbit projects\\tms files"; // Your specific directory

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> create(@RequestPart User user,
			@RequestPart(required = false) MultipartFile aadharCard,
			@RequestPart(required = false) MultipartFile panCard,
			@RequestPart(required = false) MultipartFile driverLicense, Principal principal) {

		User admin = userService.findByEmail(principal.getName());

		if (admin.getRoles().contains("Manager")) {
			List<Branch> branches = new ArrayList<Branch>();
			branches.add(admin.getBranches().get(0));
			user.setBranches(branches);
		}

		if (userService.findByMobileNo(user.getMobileNo()) != null) {
			throw new AlreadyExistsException("user is already present with given mobile no");
		}

		if (user.getRoles().contains("Driver")) {
			if (aadharCard == null || panCard == null || driverLicense == null) {
				throw new NotFoundException(
						"All identity documents, Aadhar Card, Pan Card and Driver License are compulsory to be uploaded");
			}
			user.setDriverStatus(DriverStatus.AVAILABLE);
		}

		File directory = new File(FILE_DIRECTORY);
		if (!directory.exists()) {
			directory.mkdirs();
		}
		if (aadharCard != null) {
			String fileExtension = StringUtils.getFilenameExtension(aadharCard.getOriginalFilename());

			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			try {
				
				String aadharName=generateUniqueFilename(aadharCard.getOriginalFilename());
				user.setAadharCardName(aadharName);
				File serverFile = new File(directory, aadharName);
				aadharCard.transferTo(serverFile);

			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}
		if (panCard != null) {

			String fileExtension = StringUtils.getFilenameExtension(panCard.getOriginalFilename());

			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			try {
				String panName=generateUniqueFilename(panCard.getOriginalFilename());
				user.setPanCardName(panName);
				File serverFile = new File(directory, panName);
				panCard.transferTo(serverFile);
			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}
		if (driverLicense != null) {

			String fileExtension = StringUtils.getFilenameExtension(driverLicense.getOriginalFilename());

			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}
			try {
				String licenseName=generateUniqueFilename(driverLicense.getOriginalFilename());
				user.setDriverLicenseName(licenseName);
				File serverFile = new File(directory, licenseName);
				driverLicense.transferTo(serverFile);

			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}

		userService.createUser(user);
		if (user.getRoles().contains("Driver")) {
			return new ResponseEntity<>(new ApiResponse("driver created successfully", true), HttpStatus.OK);
		}
		return new ResponseEntity<>(new ApiResponse("user created successfully", true), HttpStatus.OK);

	}

	@PutMapping("/")
	public ApiResponse update(@RequestPart User user, @RequestPart(required = false) MultipartFile aadharCard,
			@RequestPart(required = false) MultipartFile panCard,
			@RequestPart(required = false) MultipartFile driverLicense) {
		User dbUser = userService.findById(user.getId());

		// Replace files if new ones are provided
		if (aadharCard != null) {
			replaceFile(dbUser.getAadharCardName(), aadharCard);
			user.setAadharCardName(aadharCard.getOriginalFilename());
		}
		if (panCard != null) {
			replaceFile(dbUser.getPanCardName(), panCard);
			user.setPanCardName(panCard.getOriginalFilename());
		}
		if (driverLicense != null) {
			replaceFile(dbUser.getDriverLicenseName(), driverLicense);
			user.setDriverLicenseName(driverLicense.getOriginalFilename());
		}

		user.setDriverStatus(dbUser.getDriverStatus());

		return this.userService.updateUser(user);
	}

	private void replaceFile(String oldFileName, MultipartFile newFile) {
		// Delete the old file
		deleteFile(oldFileName);

		// Save the new file
		try {
			File directory = new File(FILE_DIRECTORY);
			if (!directory.exists()) {
				directory.mkdirs();
			}
			File serverFile = new File(directory, newFile.getOriginalFilename());
			newFile.transferTo(serverFile);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("Failed to save new file: " + newFile.getOriginalFilename());
		}
	}

	@PutMapping("/userstatus")
	public ApiResponse updateUserStatus(@RequestParam Long userId, @RequestParam Boolean status) {
		return this.userService.updateUserStatus(userId, status);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteUser(@RequestParam long id) {
		User user = userService.findById(id);
		deleteUserFiles(user);
		return new ResponseEntity<ApiResponse>(this.userService.deleteUser(id), HttpStatus.OK);
	}

	private void deleteUserFiles(User user) {
		deleteFile(user.getAadharCardName());
		deleteFile(user.getPanCardName());
		deleteFile(user.getDriverLicenseName());
	}

	private void deleteFile(String fileName) {
		if (fileName != null) {
			Path filePath = Paths.get(FILE_DIRECTORY, fileName);
			try {
				Files.deleteIfExists(filePath);
			} catch (IOException e) {
				e.printStackTrace();
				throw new FileException("Failed to delete file: " + fileName);
			}
		}
	}

	@GetMapping("/{id}")
	public User findById(@PathVariable long id) {
		return this.userService.findById(id);
	}
//fetch all managers,regional,superadmin within last week
	@GetMapping("/")
	public List<User> findAll(Principal principal, @RequestParam(required = false) LocalDate fromDate) {

		User user = userService.findByEmail(principal.getName());

		List<User> users = new ArrayList<User>();

		if (user.getRoles().contains("Manager")) {
			users = this.userService.findByBranchId( user.getBranches().get(0).getId());
		}
		else if (user.getRoles().contains("RegionalManager")) {
			List<Branch> branches = user.getBranches();
			List<Long> ids = branches.stream().map(Branch::getId).toList();

			users = userService.findByBranches(ids);

		} else {
			users = userService.findAll();

		}
		LocalDate filterDate = fromDate != null ? fromDate : LocalDate.now().minusWeeks(1);
		return users.stream()
				.filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(filterDate))
				.filter(u -> u.getRoles().stream().noneMatch(role -> role.equalsIgnoreCase("Driver")))
				.sorted((u1, u2) -> Long.compare(u2.getId(), u1.getId())).toList();

	}
//fetch all managers,regional,superadmin
	@GetMapping("/all")
	public List<User> findAll(Principal principal) {

		User user = userService.findByEmail(principal.getName());

		List<User> users = new ArrayList<User>();

		if (user.getRoles().contains("Manager")) {
			users = this.userService.findByBranchId( user.getBranches().get(0).getId());
		}
		else if (user.getRoles().contains("RegionalManager")) {
			List<Branch> branches = user.getBranches();
			List<Long> ids = branches.stream().map(Branch::getId).toList();

			users = userService.findByBranches(ids);

		} else {
			users = userService.findAll();

		}
	
		return users.stream()
				.filter(u -> u.getRoles().stream().noneMatch(role -> role.equalsIgnoreCase("Driver")))
				.sorted((u1, u2) -> Long.compare(u2.getId(), u1.getId())).toList();

	}
//fetch drivers within last week
	@GetMapping("/roleBranch")
	public List<User> findByRole(@RequestParam String role, Principal principal,
			@RequestParam(required = false) LocalDate fromDate) {
		LocalDate filterDate = fromDate != null ? fromDate : LocalDate.now().minusWeeks(1);
		User user = userService.findUserByName(principal.getName());
		List<User> drivers = new ArrayList<User>();
		if (user.getRoles().contains("Manager")) {
			drivers = this.userService.findByRoleAndBranchId(role, user.getBranches().get(0).getId());
		}
		else if (user.getRoles().contains("RegionalManager")) {
			List<Branch> branches = user.getBranches();
			for (Branch branch : branches) {
				drivers.addAll(this.userService.findByRoleAndBranchId(role, branch.getId()));
			}
		} else {
			drivers = this.userService.findByRole(role);

		}
		return drivers.stream()
				.filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(filterDate))
				.sorted((u1, u2) -> Long.compare(u2.getId(), u1.getId())).toList();
	}

	//fetch all drivers
	@GetMapping("/allDrivers")
	public List<User> findByRole(@RequestParam String role, Principal principal) {
		User user = userService.findUserByName(principal.getName());
		List<User> drivers = new ArrayList<User>();
		if (user.getRoles().contains("Manager")) {
			drivers = this.userService.findByRoleAndBranchId(role, user.getBranches().get(0).getId());
		}
		else if (user.getRoles().contains("RegionalManager")) {
			List<Branch> branches = user.getBranches();
			for (Branch branch : branches) {
				drivers.addAll(this.userService.findByRoleAndBranchId(role, branch.getId()));
			}
		} else {
			drivers = this.userService.findByRole(role);

		}
		return drivers.stream()
				.sorted((u1, u2) -> Long.compare(u2.getId(), u1.getId())).toList();
	}

	@GetMapping("/activeDriver")
	public List<User> findActiveDriver(@RequestParam(required = false) Long branchId, Principal principal) {
		if (branchId == null) {
			return this.userService
					.findByRoleAndBranchId("Driver",
							userService.findUserByName(principal.getName()).getBranches().get(0).getId())
					.stream().filter(user -> user.getDriverStatus() == DriverStatus.AVAILABLE)
					.collect(Collectors.toList());
		}
		return this.userService.findByRoleAndBranchId("Driver", branchId).stream()
				.filter(user -> user.getDriverStatus() == DriverStatus.AVAILABLE).collect(Collectors.toList());
	}

	@PatchMapping("/status")
	public ResponseEntity<ApiResponse> updateDriverStatus(@RequestParam long id,
			@RequestParam DriverStatus driverStatus) {
		ApiResponse response = userService.updateDriverStatus(id, driverStatus);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/document/{id}/{doc}")
	public ResponseEntity<byte[]> getDriverDocument(@PathVariable long id, @PathVariable String doc) {
		User user = userService.findById(id);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		String documentName;
		try {
			// Fetch the document name based on the input type
			documentName = getDocumentName(user, doc);
			if (documentName == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			// Get the file path
			Path filePath = Paths.get(FILE_DIRECTORY, documentName);
			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			// Read the file as a byte array
			byte[] fileContent = Files.readAllBytes(filePath);

			// Determine Content-Type based on the file extension
			String contentType = Files.probeContentType(filePath);

			// Return the file as response
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(fileContent);

		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	private String getDocumentName(User user, String documentType) {
		switch (documentType.toLowerCase()) {
		case "aadharcard":
			return user.getAadharCardName();
		case "pancard":
			return user.getPanCardName();
		case "drivinglicense":
			return user.getDriverLicenseName();
		default:
			throw new IllegalArgumentException("Invalid document type: " + documentType);
		}
	}
	
	public String generateUniqueFilename(String originalFilename) {
	    String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
	    return timestamp + "_" + originalFilename;
	}

}
