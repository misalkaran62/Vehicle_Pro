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
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.entity.VehicleFitness;
import com.skbit.tms.entity.VehicleInsurance;
import com.skbit.tms.entity.VehiclePUC;
import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.entity.VehicleRCBook;
import com.skbit.tms.entity.VehicleRoadTax;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.enumProvider.CompletionStatus;
import com.skbit.tms.enumProvider.ServicingType;
import com.skbit.tms.exception.AlreadyExistsException;
import com.skbit.tms.exception.FileException;
import com.skbit.tms.exception.NotEnabledException;
import com.skbit.tms.repo.VehicleFinanceRepo;
import com.skbit.tms.repo.VehicleFitnessRepo;
import com.skbit.tms.repo.VehicleInsuranceRepo;
import com.skbit.tms.repo.VehiclePUCRepo;
import com.skbit.tms.repo.VehiclePermitRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.repo.VehicleRoadTaxRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.UserService;
import com.skbit.tms.service.VehicleService;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private VehicleRepo vehicleRepo;

	@Autowired
	private UserService userService;

	@Autowired
	private VehicleFinanceRepo financeRepo;

	@Autowired
	private VehicleFitnessRepo vehicleFitnessRepo;

	@Autowired
	private VehicleInsuranceRepo vehicleInsuranceRepo;

	@Autowired
	private VehiclePermitRepo vehiclePermitRepo;

	@Autowired
	private VehiclePUCRepo vehiclePUCRepo;

	@Autowired
	private VehicleRoadTaxRepo vehicleRoadTaxRepo;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");
//	private static final String FILE_DIRECTORY = "C:\\Anant\\skbit projects\\tms files"; // Your specific directory

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;
	private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicle(@RequestPart Vehicle vehicle, Principal principal,
			@RequestPart(required = false) MultipartFile vehicleImage,
			@RequestPart(required = false) MultipartFile rcReceipt,
			@RequestPart(required = false) MultipartFile repaymentSchedule,
			@RequestPart(required = false) MultipartFile sanctionLetter,
			@RequestPart(required = false) MultipartFile fitnessReceipt,
			@RequestPart(required = false) List<MultipartFile> insuranceReceipts,
			@RequestPart(required = false) List<MultipartFile> permitReceipts,
			@RequestPart(required = false) MultipartFile pucReceipt,
			@RequestPart(required = false) MultipartFile taxReceipt) {
		logger.info(FILE_DIRECTORY);

		// File upload validations
		vehicle.getVehicleServicings().stream().findFirst().ifPresent(servicing ->

		{
			servicing.setCompletionStatus(CompletionStatus.SERVICING_RAISED);
			servicing.setServicingType(ServicingType.REGULAR);

		});

		System.out.println(fitnessReceipt);
		if (vehicleImage != null) {
			String fileExtension = StringUtils.getFilenameExtension(vehicleImage.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}
		}

		try {
			// Upload files and set their names in the vehicle entity
			if (vehicleImage != null) {
				vehicle.setVehicleImageName(uploadFile(vehicleImage, FILE_DIRECTORY));
			} else {
				vehicle.setVehicleImageName(null);
			}
			if (vehicle.getVehicleRCBook() != null) {
				if (rcReceipt != null) {
					VehicleRCBook rcBook = vehicle.getVehicleRCBook();
					rcBook.setRCBookName(uploadFile(rcReceipt, FILE_DIRECTORY));
					vehicle.setVehicleRCBook(rcBook);
				} else {
					VehicleRCBook rcBook = vehicle.getVehicleRCBook();
					rcBook.setRCBookName(null);
					vehicle.setVehicleRCBook(rcBook);
				}
			}
			if (repaymentSchedule != null) {
				vehicle.getVehicleFinances().stream().findFirst().ifPresent(finance -> {
					try {
						finance.setRepaymentScheduleFileName(uploadFile(repaymentSchedule, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}

			else if (vehicle.getVehicleFinances() != null) {
				vehicle.getVehicleFinances().stream().findFirst().ifPresent(finance -> {
					finance.setRepaymentScheduleFileName(null);
				});
			}
			if (sanctionLetter != null) {
				vehicle.getVehicleFinances().stream().findFirst().ifPresent(finance -> {
					try {
						finance.setSanctionLetterFileName(uploadFile(sanctionLetter, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}

			else if (vehicle.getVehicleFinances() != null) {
				vehicle.getVehicleFinances().stream().findFirst().ifPresent(finance -> {
					finance.setSanctionLetterFileName(null);
				});
			}
			if (fitnessReceipt != null) {
				vehicle.getVehicleFitnesses().stream().findFirst().ifPresent(fitness -> {
					try {
						fitness.setFitnessReceiptName(uploadFile(fitnessReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			} else if (vehicle.getVehicleFitnesses() != null) {
				vehicle.getVehicleFitnesses().stream().findFirst().ifPresent(fitness -> {
					fitness.setFitnessReceiptName(null);
				});
			}
			if (insuranceReceipts != null) {
				for (int i = 0; i < insuranceReceipts.size(); i++) {
					MultipartFile insuranceReceipt = insuranceReceipts.get(i);
					System.out.println("outside setting: "
							+ (insuranceReceipt != null ? insuranceReceipt.getOriginalFilename() : "null"));

					if (insuranceReceipt != null) {
						try {
							vehicle.getVehicleInsurances().get(i)
									.setInsuranceReceiptName(uploadFile(insuranceReceipt, FILE_DIRECTORY));
							System.out.println("inside setting: "
									+ vehicle.getVehicleInsurances().get(i).getInsuranceReceiptName());
						} catch (IOException e) {
							e.printStackTrace();
						}
					} else {
						vehicle.getVehicleInsurances().get(i).setInsuranceReceiptName(null);
						System.out.println("Set to null for index " + i);
					}
				}
			} else if (vehicle.getVehicleInsurances() != null) {
				vehicle.getVehicleInsurances().stream().forEach((insurance) -> insurance.setInsuranceReceiptName(null));
			}

			if (permitReceipts != null) {
				for (int i = 0; i < permitReceipts.size(); i++) {
					MultipartFile permitReceipt = permitReceipts.get(i);
					if (permitReceipt != null) {
						try {
							vehicle.getVehiclePermits().get(i)
									.setPermitReceiptName(uploadFile(permitReceipt, FILE_DIRECTORY));
						} catch (IOException e) {
							e.printStackTrace();
						}
					} else {
						vehicle.getVehiclePermits().get(i).setPermitReceiptName(null);
						System.out.println("Set to null for index " + i);
					}
				}
			} else if (vehicle.getVehiclePermits() != null) {
				vehicle.getVehiclePermits().stream().forEach((permit) -> permit.setPermitReceiptName(null));
			}
			if (pucReceipt != null) {
				vehicle.getVehiclePUCs().stream().findFirst().ifPresent(puc -> {
					try {
						puc.setPucReceiptName(uploadFile(pucReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			} else if (vehicle.getVehiclePUCs() != null) {
				vehicle.getVehiclePUCs().stream().findFirst().ifPresent(puc -> puc.setPucReceiptName(null));
			}
			if (taxReceipt != null) {
				vehicle.getVehicleRoadTaxes().stream().findFirst().ifPresent(tax -> {
					try {
						tax.setTaxReceiptName(uploadFile(taxReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			} else if (vehicle.getVehicleRoadTaxes() != null) {
				vehicle.getVehicleRoadTaxes().stream().findFirst().ifPresent(tax -> tax.setTaxReceiptName(null));
			}

		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(ApiResponse.builder().status(false).message(e.getMessage()).build(),
					HttpStatus.BAD_REQUEST);
		} catch (IOException e) {
			return new ResponseEntity<>(
					ApiResponse.builder().status(false).message("File upload failed: " + e.getMessage()).build(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}

		Vehicle dbVehicle = vehicleService.findByVehicleReg(vehicle.getVehicleReg());
		if (dbVehicle != null) {
			throw new AlreadyExistsException("Vehicle already exists with given registration number");
		}

		User user = userService.findByEmail(principal.getName());
		Set<String> roles = user.getRoles();
		for (String role : roles) {
			if ((!role.equalsIgnoreCase("SUPERADMIN")) && (!role.equalsIgnoreCase("RegionalManager"))) {
				throw new NotEnabledException("Only SUPERADMIN or RegionalManager can create vehicle");
			}
		}

		// Check for duplicate receipt numbers in all related entities
		validateVehicleFitness(vehicle);
		validateVehicleInsurance(vehicle);
		validateVehiclePermit(vehicle);
		validateVehiclePUC(vehicle);
		validateVehicleRoadTax(vehicle);

		vehicle.setCreatedByEmail(principal.getName());
		return new ResponseEntity<ApiResponse>(this.vehicleService.createVehicle(vehicle), HttpStatus.OK);
	}

	private void validateVehicleFitness(Vehicle vehicle) {
		if (vehicle.getVehicleFitnesses() != null) {
			for (VehicleFitness fitness : vehicle.getVehicleFitnesses()) {
				if (fitness.getFitnessReceiptNO() != null
						&& vehicleFitnessRepo.existsByFitnessReceiptNO(fitness.getFitnessReceiptNO())) {
					throw new AlreadyExistsException(
							"Duplicate fitness receipt number found: " + fitness.getFitnessReceiptNO());
				}
			}
		}
	}

	private void validateVehicleInsurance(Vehicle vehicle) {
		if (vehicle.getVehicleInsurances() != null) {
			for (VehicleInsurance insurance : vehicle.getVehicleInsurances()) {
				if (insurance.getInsuranceNumber() != null
						&& vehicleInsuranceRepo.existsByInsuranceNumber(insurance.getInsuranceNumber())) {
					throw new AlreadyExistsException(
							"Duplicate insurance number found: " + insurance.getInsuranceNumber());
				}
			}
		}
	}

	private void validateVehiclePermit(Vehicle vehicle) {
		if (vehicle.getVehiclePermits() != null) {
			for (VehiclePermit permit : vehicle.getVehiclePermits()) {
				if (permit.getPermitReceiptNo() != null
						&& vehiclePermitRepo.existsByPermitReceiptNo(permit.getPermitReceiptNo())) {
					throw new AlreadyExistsException(
							"Duplicate permit receipt number found: " + permit.getPermitReceiptNo());
				}
			}
		}
	}

	private void validateVehiclePUC(Vehicle vehicle) {
		if (vehicle.getVehiclePUCs() != null) {
			for (VehiclePUC puc : vehicle.getVehiclePUCs()) {
				if (puc.getPucReceiptNo() != null && vehiclePUCRepo.existsByPucReceiptNo(puc.getPucReceiptNo())) {
					throw new AlreadyExistsException("Duplicate PUC receipt number found: " + puc.getPucReceiptNo());
				}
			}
		}
	}

	private void validateVehicleRoadTax(Vehicle vehicle) {
		if (vehicle.getVehicleRoadTaxes() != null) {
			for (VehicleRoadTax roadTax : vehicle.getVehicleRoadTaxes()) {
				if (roadTax.getRoadTaxReceiptNo() != null
						&& vehicleRoadTaxRepo.existsByRoadTaxReceiptNo(roadTax.getRoadTaxReceiptNo())) {
					throw new AlreadyExistsException(
							"Duplicate road tax receipt number found: " + roadTax.getRoadTaxReceiptNo());
				}
			}
		}
	}

	private String uploadFile(MultipartFile file, String directoryPath) throws IOException {
		if (file == null || file.isEmpty()) {
			return null; // Skip if the file is not provided
		}

		String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
			throw new IllegalArgumentException("Invalid file type. Allowed types are pdf, jpeg, png, jpg.");
		}

		File directory = new File(directoryPath);
		if (!directory.exists()) {
			boolean created = directory.mkdirs();
			if (!created) {
				throw new IOException("Failed to create directory: " + directoryPath);
			}
		}

		String fileName = generateUniqueFilename(file.getOriginalFilename());
		File serverFile = new File(directory, fileName);
		file.transferTo(serverFile);

		return fileName; // Return the uploaded file name
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicle(@RequestPart Vehicle vehicle,
			@RequestPart(required = false) MultipartFile vehicleImage,
			@RequestPart(required = false) MultipartFile rcReceipt,
			@RequestPart(required = false) MultipartFile repaymentSchedule,
			@RequestPart(required = false) MultipartFile sanctionLetter,
			@RequestPart(required = false) MultipartFile fitnessReceipt,
			@RequestPart(required = false) List<MultipartFile> insuranceReceipts,
			@RequestPart(required = false) List<MultipartFile> permitReceipts,
			@RequestPart(required = false) MultipartFile pucReceipt,
			@RequestPart(required = false) MultipartFile taxReceipt) {
		System.out.println(vehicle);

		if (vehicle == null) {
			return new ResponseEntity<>(ApiResponse.builder().status(false).message("Vehicle not found").build(),
					HttpStatus.NOT_FOUND);
		}

		try {
			// Update only the provided fields/documents
			if (vehicleImage != null) {
				deleteFile(vehicle.getVehicleImageName());
				vehicle.setVehicleImageName(uploadFile(vehicleImage, FILE_DIRECTORY));
			}

			if (rcReceipt != null) {

				VehicleRCBook rcBook = vehicle.getVehicleRCBook();
				deleteFile(rcBook.getRCBookName());
				rcBook.setRCBookName(uploadFile(rcReceipt, FILE_DIRECTORY));
				vehicle.setVehicleRCBook(rcBook);
			}
			if (repaymentSchedule != null) {
				vehicle.getVehicleFinances().stream().findFirst().ifPresent(finance -> {
					try {
						Long id = finance.getFinance_id();
						if (id != null) {
							System.out.println("finance id" + id);
							VehicleFinance dbFinance = financeRepo.findById(id).get();
							deleteFile(dbFinance.getRepaymentScheduleFileName());
						}
						finance.setRepaymentScheduleFileName(uploadFile(repaymentSchedule, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}
			if (fitnessReceipt != null) {
				vehicle.getVehicleFitnesses().stream().findFirst().ifPresent(fitness -> {
					try {
						Long id = fitness.getFitnessId();
						if (id != null) {
							VehicleFitness dbFitness = vehicleFitnessRepo.findById(id).get();
							deleteFile(dbFitness.getFitnessReceiptName());
						}
						fitness.setFitnessReceiptName(uploadFile(fitnessReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}
			if (insuranceReceipts != null) {
				for (int i = 0; i < insuranceReceipts.size(); i++) {
					MultipartFile insuranceReceipt = insuranceReceipts.get(i);
					if (insuranceReceipt != null && i < vehicle.getVehicleInsurances().size()) {
						try {

							Long id = vehicle.getVehicleInsurances().get(i).getInsuranceId();
							if (id != null&&id!=0) {
								VehicleInsurance dbInsurance = vehicleInsuranceRepo.findById(id).get();
								deleteFile(dbInsurance.getInsuranceReceiptName());
							}
							vehicle.getVehicleInsurances().get(i)
									.setInsuranceReceiptName(uploadFile(insuranceReceipt, FILE_DIRECTORY));
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
			if (permitReceipts != null) {
				for (int i = 0; i < permitReceipts.size(); i++) {
					MultipartFile permitReceipt = permitReceipts.get(i);
					if (permitReceipt != null && i < vehicle.getVehiclePermits().size()) {
						try {
							Long id = vehicle.getVehiclePermits().get(i).getPermitId();
							if (id != null&&id!=0) {
								VehiclePermit dbPermit = vehiclePermitRepo.findById(id).get();
								deleteFile(dbPermit.getPermitReceiptName());
							}
							vehicle.getVehiclePermits().get(i)
									.setPermitReceiptName(uploadFile(permitReceipt, FILE_DIRECTORY));
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
			if (pucReceipt != null) {
				vehicle.getVehiclePUCs().stream().findFirst().ifPresent(puc -> {
					try {
						Long id = puc.getPucId();
						if (id != null) {
							VehiclePUC dbPUC = vehiclePUCRepo.findById(id).get();
							deleteFile(dbPUC.getPucReceiptName());
						}
						puc.setPucReceiptName(uploadFile(pucReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}
			if (taxReceipt != null) {
				vehicle.getVehicleRoadTaxes().stream().findFirst().ifPresent(tax -> {
					try {
						Long id = tax.getRoadTaxId();
						if (id != null) {
							VehicleRoadTax dbTax = vehicleRoadTaxRepo.findById(id).get();
							deleteFile(dbTax.getTaxReceiptName());
						}
						tax.setTaxReceiptName(uploadFile(taxReceipt, FILE_DIRECTORY));
					} catch (IOException e) {
						e.printStackTrace();
					}
				});
			}

			// Save the updated vehicle
			vehicleService.updateVehicle(vehicle);

		} catch (IOException e) {
			return new ResponseEntity<>(
					ApiResponse.builder().status(false).message("File upload failed: " + e.getMessage()).build(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(ApiResponse.builder().status(true).message("Vehicle updated successfully").build(),
				HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicle(@RequestParam long id) {
		Vehicle dbVehicle = vehicleService.findById(id);
		this.deleteVehicleFiles(dbVehicle);
		return new ResponseEntity<ApiResponse>(this.vehicleService.deleteVehicle(id), HttpStatus.OK);
	}

	private void deleteVehicleFiles(Vehicle vehicle) {

		vehicle.getVehicleFinances().stream().forEach((finance) -> {
			deleteFile(finance.getRepaymentScheduleFileName());
			deleteFile(finance.getSanctionLetterFileName());
		});
		vehicle.getVehicleFitnesses().stream().forEach((fitness) -> deleteFile(fitness.getFitnessReceiptName()));
		vehicle.getVehicleInsurances().stream().forEach((finance) -> deleteFile(finance.getInsuranceReceiptName()));
		vehicle.getVehiclePermits().stream().forEach((finance) -> deleteFile(finance.getPermitReceiptName()));
		vehicle.getVehiclePUCs().stream().forEach((finance) -> deleteFile(finance.getPucReceiptName()));
		vehicle.getVehicleRoadTaxes().stream().forEach((finance) -> deleteFile(finance.getTaxReceiptName()));
		vehicle.getVehicleServicings().stream().forEach((servicing) -> {
			List<String> names = servicing.getPartChangeNames();
			names.forEach(name -> deleteFile(name));
//				deleteFile(finance.getPartChangeName());
			deleteFile(servicing.getPaymentReceiptName());

		});
	}

	private void deleteFile(String fileName) {

		if (fileName != null) {
			if (fileName.length()>0) {
				Path filePath = Paths.get(FILE_DIRECTORY, fileName);
				try {
					Files.deleteIfExists(filePath);
				} catch (IOException e) {
					e.printStackTrace();
					throw new FileException("Failed to delete file: " + fileName + e.getMessage());
				}
			}
		}
	}

	@GetMapping("/{id}")
	public Vehicle findById(@PathVariable long id) {
		return this.vehicleService.findById(id);
	}

	@GetMapping("/")
	public List<Vehicle> findAll(Principal principal) {

		List<Vehicle> vehicles = new ArrayList<>();

		if (userService.findUserByName(principal.getName()).getRoles().contains("Manager")) {
			vehicles = vehicleService
					.findByBranchId(userService.findUserByName(principal.getName()).getBranches().get(0).getId());
		} else if (userService.findUserByName(principal.getName()).getRoles().contains("RegionalManager")) {
			List<Branch> branches = userService.findUserByName(principal.getName()).getBranches();
			for (Branch branch : branches) {
				vehicles.addAll(vehicleService.findByBranchId(branch.getId()));
			}
		} else {
			vehicles = this.vehicleService.findAll();
		}

		return vehicles.stream().sorted((v1, v2) -> Long.compare(v2.getVehicleId(), v1.getVehicleId())).toList();
	}

	@GetMapping("/dateFilter")
	public List<Vehicle> findAllDateFilter(Principal principal, @RequestParam(required = false) LocalDate createdAt) {

		List<Vehicle> vehicles = new ArrayList<>();

		if (userService.findUserByName(principal.getName()).getRoles().contains("Manager")) {
			vehicles = vehicleService
					.findByBranchId(userService.findUserByName(principal.getName()).getBranches().get(0).getId());
		} else if (userService.findUserByName(principal.getName()).getRoles().contains("RegionalManager")) {
			List<Branch> branches = userService.findUserByName(principal.getName()).getBranches();
			for (Branch branch : branches) {
				vehicles.addAll(vehicleService.findByBranchId(branch.getId()));
			}
		} else {
			vehicles = this.vehicleService.findAll();
		}

		LocalDate filterDate = (createdAt != null) ? createdAt : LocalDate.now().minusWeeks(1);

		return vehicles.stream()
				.filter(vehicle -> vehicle.getCreatedAt() != null && !vehicle.getCreatedAt().isBefore(filterDate))
				.sorted((v1, v2) -> Long.compare(v2.getVehicleId(), v1.getVehicleId())).toList();
	}

	// find vehicles by branch
	@GetMapping("/branch")
	public List<Vehicle> vehiclesByBranch(@RequestParam long branchId) {
		return this.vehicleService.vehiclesByBranch(branchId);
	}

	@PatchMapping("/expiry-status/{id}")
	public Vehicle updateExpiryStatus(@PathVariable long id) {
		return vehicleService.updateExpiryStatus(id);
	}

//	@PatchMapping("/formFillStatus/{id}/{status}")
//	public Vehicle updateFormFillStatus(@PathVariable long id) {
//		return vehicleService.updateFormFillStatus(id);
//	}

	// find active by branch
	@GetMapping("/available")
	public List<Vehicle> getAllAvailableVehicles(Principal principal, @RequestParam(required = false) Long branchId) {

		if (branchId != null) {
			System.out.println("branch id hai" + vehicleService.getAllAvailableVehicles().stream()
					.filter(vehicle -> vehicle.getBranch().getId() == branchId).collect(Collectors.toList()));
			return vehicleService.getAllAvailableVehicles().stream()
					.filter(vehicle -> vehicle.getBranch().getId() == branchId).collect(Collectors.toList());
		}

		return vehicleService.getAllAvailableVehicles().stream().filter(vehicle -> vehicle.getBranch()
				.getId() == userService.findByEmail(principal.getName()).getBranches().get(0).getId())
				.collect(Collectors.toList());

	}

	@PatchMapping("/status")
	public ResponseEntity<ApiResponse> updateVehicleStatus(@RequestParam long id,
			@RequestParam VehicleStatus vehicleStatus) {
		ApiResponse response = vehicleService.updateVehicleStatus(id, vehicleStatus);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/notification")
	public ResponseEntity<ApiResponse> createNotification() {
		return new ResponseEntity<ApiResponse>(vehicleService.createNotification(), HttpStatus.OK);

	}

	@GetMapping("/servicings")
	public List<VehicleServicing> getServicing(long id) {
		Vehicle vehicle = vehicleService.findById(id);
		return vehicle.getVehicleServicings();
	}

	@GetMapping("/document/{id}")
	public ResponseEntity<byte[]> getPermitDocument(@PathVariable long id) {
		try {
			// Fetch the VehiclePermit by ID
			Vehicle vehicle = vehicleService.findById(id);
			if (vehicle == null || vehicle.getVehicleImageName() == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as per
																				// your design
			}

			// Get the file path
			Path filePath = Paths.get(FILE_DIRECTORY, vehicle.getVehicleImageName());
			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			// Read the file as byte array
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

	@GetMapping("/getLatestPart")
	public PartMapping getLatestPart(@RequestParam Long vehicleId, @RequestParam String partName) {
		return this.vehicleRepo.findPartMappingsByVehicleIdAndPartName(vehicleId, partName).stream()
				.max((pm1, pm2) -> pm1.getDateOfValidity().compareTo(pm2.getDateOfValidity())).get();
	}

	@GetMapping("/replaced parts")
	public List<PartMapping> getReplacedParts(@RequestParam Long vehicleId) {
		return vehicleService.getReplacedParts(vehicleId);
	}

	public String generateUniqueFilename(String originalFilename) {
		String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
		return timestamp + "_" + originalFilename;
	}

}
