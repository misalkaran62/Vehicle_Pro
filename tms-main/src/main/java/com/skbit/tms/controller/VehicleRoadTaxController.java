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

import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.entity.VehicleRoadTax;
import com.skbit.tms.exception.FileException;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.VehicleRoadTaxService;

@RestController
@RequestMapping("/vehicleRoadTax")
public class VehicleRoadTaxController {

	@Autowired
	private VehicleRoadTaxService vehicleRoadTaxService;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");
//	private static final String FILE_DIRECTORY = "C:\\Anant\\skbit projects\\tms files"; // Your specific directory

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createVehicleRCBook(@RequestPart MultipartFile file,
			@RequestPart VehicleRoadTax vehicleRoadTax, @RequestParam Long vehicleId) {

		String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
			return new ResponseEntity<>(
					ApiResponse.builder().status(false)
							.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
					HttpStatus.BAD_REQUEST);
		}

		try {
			String fileName=generateUniqueFilename(file.getOriginalFilename());
			vehicleRoadTax.setTaxReceiptName(fileName);

			File directory = new File(FILE_DIRECTORY);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			File serverFile = new File(directory,fileName);

			file.transferTo(serverFile);

			vehicleRoadTaxService.createVehicleRoadTax(vehicleRoadTax, vehicleId);

			return new ResponseEntity<>(new ApiResponse("Vehicle road tax uploaded successfully", true), HttpStatus.OK);
		} catch (IOException e) {
			return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateVehicleRCBook(@RequestPart VehicleRoadTax vehicleRoadTax,
			@RequestPart(required = false) MultipartFile file) {

		if (file != null) {
			String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
			if (fileExtension == null || !ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
				return new ResponseEntity<>(
						ApiResponse.builder().status(false)
								.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
						HttpStatus.BAD_REQUEST);
			}
			VehicleRoadTax dbRoadTax = vehicleRoadTaxService.findById(vehicleRoadTax.getRoadTaxId());
			deleteFile(dbRoadTax.getTaxReceiptName());
			try {
				String fileName=generateUniqueFilename(file.getOriginalFilename());
				vehicleRoadTax.setTaxReceiptName(fileName);

				File directory = new File(FILE_DIRECTORY);
				if (!directory.exists()) {
					directory.mkdirs();
				}

				File serverFile = new File(directory, fileName);

				file.transferTo(serverFile);

			} catch (Exception e) {

				return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		
		return new ResponseEntity<>(this.vehicleRoadTaxService.updateVehicleRoadTax(vehicleRoadTax), HttpStatus.OK);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteVehicleRoadTax(@RequestParam long id) {
		VehicleRoadTax dbRoadTax = vehicleRoadTaxService.findById(id);
		deleteFile(dbRoadTax.getTaxReceiptName());
		return new ResponseEntity<ApiResponse>(this.vehicleRoadTaxService.deleteVehicleRoadTax(id), HttpStatus.OK);
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
	public VehicleRoadTax findById(@PathVariable long id) {
		return this.vehicleRoadTaxService.findById(id);
	}

	@GetMapping("/")
	public List<VehicleRoadTax> findall() {
		return this.vehicleRoadTaxService.findAll();
	}

	@PatchMapping("/expiry-status/{roadTaxId}")
	public VehicleRoadTax updateRenewalDue(@PathVariable long roadTaxId) {
		return vehicleRoadTaxService.updateRenewalDue(roadTaxId);
	}

	@PatchMapping("/formFillStatus/{roadTaxId}/{status}")
	public VehicleRoadTax updateFormFillStatus(@PathVariable long roadTaxId, @PathVariable boolean status) {
		return vehicleRoadTaxService.updateFormFillStatus(roadTaxId, status);
	}

	@GetMapping("/document/{id}")
	public ResponseEntity<byte[]> getPermitDocument(@PathVariable long id) {
		try {
			// Fetch the VehiclePermit by ID
			VehicleRoadTax roadTax = vehicleRoadTaxService.findById(id);
			if (roadTax == null || roadTax.getRoadTaxReceiptNo() == null) {
				System.out.println("here");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Or a meaningful error response as per
																				// your design
			}

			// Get the file path
			Path filePath = Paths.get(FILE_DIRECTORY, roadTax.getTaxReceiptName());
			if (!Files.exists(filePath)) {
				System.out.println("there");
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
	
	public String generateUniqueFilename(String originalFilename) {
	    String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
	    return timestamp + "_" + originalFilename;
	}


}
