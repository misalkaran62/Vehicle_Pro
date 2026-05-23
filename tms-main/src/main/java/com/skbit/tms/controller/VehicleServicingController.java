package com.skbit.tms.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

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
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.enumProvider.CompletionStatus;
import com.skbit.tms.enumProvider.ServicingType;
import com.skbit.tms.exception.FileException;
import com.skbit.tms.exception.InvalidUserException;
import com.skbit.tms.repo.VehicleServicingRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserService;
import com.skbit.tms.service.VehicleServicingService;

@RestController
@RequestMapping("/vehicleServicing")

public class VehicleServicingController {

	@Autowired
	private VehicleServicingService vehicleServicingService;

	@Autowired
	private VehicleServicingRepo vehicleServicingRepo;

	@Autowired
	private UserService userService;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicleServicing(@RequestPart VehicleServicing vehicleServicing,
			@RequestParam Long vehicleId, @RequestPart(required = false) List<MultipartFile> partChangeFiles) {

		File directory = new File(FILE_DIRECTORY);
		if (!directory.exists()) {
			directory.mkdirs();
		}
		if (partChangeFiles != null) {
			for (MultipartFile multipartFile : partChangeFiles) {
				String fileExtension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());

				if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
					return new ResponseEntity<>(
							ApiResponse.builder().status(false)
									.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
							HttpStatus.BAD_REQUEST);
				}

				try {
					String fileName = generateUniqueFilename(multipartFile.getOriginalFilename());
					vehicleServicing.getPartChangeNames().add(fileName);
					File serverFile = new File(directory, fileName);
					multipartFile.transferTo(serverFile);

				} catch (IOException e) {
					return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
			}
		}
		return new ResponseEntity<ApiResponse>(
				this.vehicleServicingService.createVehicleServicing(vehicleServicing, vehicleId), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicleServicing(@RequestPart VehicleServicing vehicleServicing,
			@RequestPart(required = false) List<MultipartFile> partChangeFiles,
			@RequestPart(required = false) MultipartFile paymentReceipt) {
		if (vehicleServicing.getPartChangeNames().isEmpty()){
			VehicleServicing findById = vehicleServicingService.findById(vehicleServicing.getServicingId());
			vehicleServicing.setPartChangeNames(findById.getPartChangeNames());
			}
		
		System.out.println("this is to check servcing part names"+vehicleServicing);

		File directory = new File(FILE_DIRECTORY);
		if (!directory.exists()) {
			directory.mkdirs();
		}
		if (partChangeFiles != null) {
			for (MultipartFile multipartFile : partChangeFiles){
				String fileExtension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());

				if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
					return new ResponseEntity<>(
							ApiResponse.builder().status(false)
									.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
							HttpStatus.BAD_REQUEST);
				}
//				VehicleServicing dbServicing = vehicleServicingService.findById(vehicleServicing.getServicingId());
//				dbServicing.getPartChangeNames().stream().forEach((name) -> deleteFile((name)));

				try {
					String fileName = generateUniqueFilename(multipartFile.getOriginalFilename());
					deleteFile((fileName));
					vehicleServicing.getPartChangeNames().add(fileName);
					File serverFile = new File(directory, fileName);
					multipartFile.transferTo(serverFile);

				} catch (IOException e) {
					return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
							HttpStatus.INTERNAL_SERVER_ERROR);
				}
			}

		}
		if (paymentReceipt != null) {
			String fileExtension = StringUtils.getFilenameExtension(paymentReceipt.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			VehicleServicing dbServicing = vehicleServicingService.findById(vehicleServicing.getServicingId());
			deleteFile(dbServicing.getPaymentReceiptName());
			try {
				String fileName = generateUniqueFilename(paymentReceipt.getOriginalFilename());
				vehicleServicing.setPaymentReceiptName(fileName);
				File serverFile = new File(directory, fileName);
				paymentReceipt.transferTo(serverFile);
			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}
		vehicleServicing.setTotalAmount(vehicleServicing.getCost() + vehicleServicing.getGst());

		return new ResponseEntity<ApiResponse>(this.vehicleServicingService.updateVehicleServicing(vehicleServicing),
				HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicleServicing(@RequestParam long id) {
		VehicleServicing service = vehicleServicingService.findById(id);
		service.getPartChangeNames().stream().forEach((name) -> deleteFile((name)));
//		deleteFile(service.getPartChangeName());
		deleteFile(service.getPaymentReceiptName());

		Long vehicleId = vehicleServicingRepo.findVehicleIdByServicingId(id);
		return new ResponseEntity<ApiResponse>(this.vehicleServicingService.deleteVehicleServicing(id, vehicleId),
				HttpStatus.OK);
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
	public VehicleServicing findById(@PathVariable long id) {
		return this.vehicleServicingService.findById(id);
	}


  @GetMapping("/vehileId/{id}")
   public List<VehicleServicing> findAllServicingByVehicleId(@PathVariable long id){
	List<VehicleServicing> vehicleServicings=this.vehicleServicingService.findAllServicingByVehicleId(id);
    return vehicleServicings;
   }
	
	@GetMapping("/")
	public List<VehicleServicing> findall(Principal principal, @RequestParam(required = false) LocalDate createdAt) {
		User user = userService.findUserByName(principal.getName());
		List<VehicleServicing> vehicleServicings = new ArrayList<VehicleServicing>();
		if (user.getRoles().contains("Manager")) {

			vehicleServicings = this.vehicleServicingService
					.findByBranchId(userService.findUserByName(principal.getName()).getBranches().get(0).getId());
		} else if (user.getRoles().contains("RegionalManager")) {

			List<Branch> branches = user.getBranches();
			for (Branch branch : branches) {
				vehicleServicings.addAll(vehicleServicingService.findByBranchId(branch.getId()));
			}
		} else {
			vehicleServicings = this.vehicleServicingService.findAll().stream()
					.sorted((s1, s2) -> Long.compare(s2.getServicingId(), s1.getServicingId())).toList();
		}
		LocalDate filterDate = (createdAt != null) ? createdAt : LocalDate.now().minusWeeks(1);
		return vehicleServicings.stream()
				.filter(servicing -> servicing.getCreatedAt() != null && !servicing.getCreatedAt().isBefore(filterDate))
				.sorted((s1, s2) -> Long.compare(s2.getServicingId(), s1.getServicingId())).toList();
	}

	@PostMapping("/serviceRequest")
	public ResponseEntity<ApiResponse> createRequestForm() {

		return new ResponseEntity<ApiResponse>(this.vehicleServicingService.createRequestForm(), HttpStatus.OK);
	}

	@GetMapping("/getVehicleId")
	public Long getVehicleIdByServicingId(@RequestParam Long servicingId) {
		return vehicleServicingRepo.findVehicleIdByServicingId(servicingId);
	}

	@PatchMapping("/servicingapprovalstatus")
	public ApiResponse updateApprovalStatus(@RequestParam Long servicingId, @RequestParam Boolean status,
			Principal principal) {
		User user = userService.findByEmail(principal.getName());
		if (user.getRoles().contains("Driver") || user.getRoles().contains("Manager")) {
			throw new InvalidUserException("Only superadmin can approve vehicle servicing");
		}
		return this.vehicleServicingService.updateApprovalStatus(servicingId, status);
	}

	@PatchMapping("/changeServicingType")
	public ApiResponse changeServicingType(@RequestParam Long servicingId, @RequestParam ServicingType servicingType) {

		return this.vehicleServicingService.updateServicingType(servicingId, servicingType);
	}

	@PatchMapping("/changeCompletionStatus")
	public ApiResponse changeCompletionStatus(@RequestParam Long servicingId,
			@RequestParam CompletionStatus completionStatus) {

		return this.vehicleServicingService.updateCompletionStatus(servicingId, completionStatus);
	}

	@GetMapping("/document/{id}")
	public ResponseEntity<byte[]> getPermitDocument(@PathVariable long id, @RequestParam String type,
			@RequestParam(required = false) Integer index) {

		try {
			// Fetch the VehiclePermit by ID
			VehicleServicing vehicleServicing = vehicleServicingService.findById(id);

			if (type.equals("partChange")) {
				String partChangeName = vehicleServicing.getPartChangeNames().get(index);
//	        	if (vehicleServicing == null || vehicleServicing.getPartChangeName() == null) {
				if (vehicleServicing == null || partChangeName == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as
																					// per your design
				}

				// Get the file path
//		        Path filePath = Paths.get(FILE_DIRECTORY, vehicleServicing.getPartChangeName());
				Path filePath = Paths.get(FILE_DIRECTORY, partChangeName);
				if (!Files.exists(filePath)) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
				}

				// Read the file as byte array
				byte[] fileContent = Files.readAllBytes(filePath);

				// Determine Content-Type based on the file extension
				String contentType = Files.probeContentType(filePath);

				// Return the file as response
				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(fileContent);

			} else {

				if (vehicleServicing == null || vehicleServicing.getPaymentReceiptName() == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as
																					// per your design
				}

				// Get the file path
				Path filePath = Paths.get(FILE_DIRECTORY, vehicleServicing.getPaymentReceiptName());
				if (!Files.exists(filePath)) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
				}

				// Read the file as byte array
				byte[] fileContent = Files.readAllBytes(filePath);

				// Determine Content-Type based on the file extension
				String contentType = Files.probeContentType(filePath);

				// Return the file as response
				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(fileContent);
			}

		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	public String generateUniqueFilename(String originalFilename) {
		String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
		return timestamp + "_" + originalFilename;
	}

}
