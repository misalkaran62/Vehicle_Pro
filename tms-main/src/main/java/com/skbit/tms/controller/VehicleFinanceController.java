package com.skbit.tms.controller;

import java.io.File;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skbit.tms.entity.User;
import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.exception.FileException;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleFinanceService;

@RestController
@RequestMapping("/vehicleFinance")
public class VehicleFinanceController {

	@Autowired
	private VehicleFinanceService vehicleFinanceService;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");
//	private static final String FILE_DIRECTORY = "C:\\Anant\\skbit projects\\tms files"; // Your specific directory

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicleFinance(
			@RequestPart(required = false) MultipartFile repaymentSchedule,
			@RequestPart(required = false) MultipartFile sanctionLetter, @RequestPart VehicleFinance vehicleFinance) {

		if (repaymentSchedule != null) {

			String fileExtension = StringUtils.getFilenameExtension(repaymentSchedule.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			try {
				String fileName=generateUniqueFilename(repaymentSchedule.getOriginalFilename());
				vehicleFinance.setRepaymentScheduleFileName(fileName);

				File directory = new File(FILE_DIRECTORY);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				File serverFile = new File(directory, fileName);

				repaymentSchedule.transferTo(serverFile);

			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		if (sanctionLetter != null) {

			String fileExtension = StringUtils.getFilenameExtension(sanctionLetter.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			try {
				String fileName=generateUniqueFilename(sanctionLetter.getOriginalFilename());
				vehicleFinance.setSanctionLetterFileName(fileName);

				File directory = new File(FILE_DIRECTORY);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				File serverFile = new File(directory, fileName);

				sanctionLetter.transferTo(serverFile);

			} catch (IOException e) {
				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		vehicleFinanceService.createVehicleFinance(vehicleFinance);
		return new ResponseEntity<>(new ApiResponse("Vehicle finance created successfully", true), HttpStatus.OK);
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicleFinance(@RequestPart VehicleFinance vehicleFinance,
			@RequestPart MultipartFile repaymentSchedule, @RequestPart MultipartFile sanctionLetter) {

		if (repaymentSchedule != null) {
			String fileExtension = StringUtils.getFilenameExtension(repaymentSchedule.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			VehicleFinance dbFinance = vehicleFinanceService.findById(vehicleFinance.getFinance_id());
			deleteFile(dbFinance.getRepaymentScheduleFileName());
			try {
				String fileName=generateUniqueFilename(repaymentSchedule.getOriginalFilename());
				vehicleFinance.setRepaymentScheduleFileName(fileName);

				File directory = new File(FILE_DIRECTORY);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				File serverFile = new File(directory, fileName);

				repaymentSchedule.transferTo(serverFile);

			} catch (Exception e) {

				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		if (sanctionLetter != null) {
			String fileExtension = StringUtils.getFilenameExtension(sanctionLetter.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}

			VehicleFinance dbFinance = vehicleFinanceService.findById(vehicleFinance.getFinance_id());
			deleteFile(dbFinance.getSanctionLetterFileName());
			try {
				String fileName=generateUniqueFilename(sanctionLetter.getOriginalFilename());
				vehicleFinance.setFinanceName(fileName);

				File directory = new File(FILE_DIRECTORY);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				File serverFile = new File(directory, fileName);

				sanctionLetter.transferTo(serverFile);

			} catch (Exception e) {

				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<>(this.vehicleFinanceService.updateVehicleFinance(vehicleFinance), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicleFinance(@RequestParam long id) {
		VehicleFinance finance = vehicleFinanceService.findById(id);
		deleteFile(finance.getRepaymentScheduleFileName());
		deleteFile(finance.getRepaymentScheduleFileName());
		return new ResponseEntity<ApiResponse>(this.vehicleFinanceService.deleteVehicleFinance(id), HttpStatus.OK);
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
	public VehicleFinance findById(@PathVariable long id) {
		return this.vehicleFinanceService.findById(id);
	}

	@GetMapping("/")
	public List<VehicleFinance> findall() {
		return this.vehicleFinanceService.findAll();
	}

	@PatchMapping("/expiry-status/{financeId}")
	public VehicleFinance updateRenewalDue(@PathVariable long financeId) {
		return vehicleFinanceService.updateRenewalDue(financeId);
	}

	@PatchMapping("/formFillStatus/{roadTaxId}/{status}")
	public VehicleFinance updateFormFillStatus(@PathVariable long roadTaxId, @PathVariable boolean status) {
		return vehicleFinanceService.updateFormFillStatus(roadTaxId, status);
	}

	@GetMapping("/document/{id}")
	public ResponseEntity<byte[]> getPermitDocument(@PathVariable long id, @RequestParam String type) {
		if (type.equals("repaymentSchedule")) {
			try {
				// Fetch the VehiclePermit by ID
				VehicleFinance finance = vehicleFinanceService.findById(id);
				if (finance == null || finance.getRepaymentScheduleFileName() == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as
																					// per
																					// your design
				}

				// Get the file path
				Path filePath = Paths.get(FILE_DIRECTORY, finance.getRepaymentScheduleFileName());
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
		} else if (type.equals("sanctionLetter")) {
			try {
				// Fetch the VehiclePermit by ID
				VehicleFinance finance = vehicleFinanceService.findById(id);
				if (finance == null || finance.getSanctionLetterFileName() == null) {
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as
																					// per
																					// your design
				}

				// Get the file path
				Path filePath = Paths.get(FILE_DIRECTORY, finance.getSanctionLetterFileName());
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
		return null;

	}
	
	public String generateUniqueFilename(String originalFilename) {
	    String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
	    return timestamp + "_" + originalFilename;
	}


}