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
import java.util.List;
import java.util.Set;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.skbit.tms.entity.Branch;
import com.skbit.tms.entity.DriverStatus;
import com.skbit.tms.entity.Trip;
import com.skbit.tms.entity.TripStatus;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.TripRepo;
import com.skbit.tms.request.TripUpdateRequest;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.response.TripWithPhotosResponse;
import com.skbit.tms.service.TripService;
import com.skbit.tms.service.UserService;
import com.skbit.tms.service.VehicleService;

@RestController
@RequestMapping("/trip")
public class TripController {

	@Autowired
	private TripService tripService;

	@Autowired
	private UserService userService;

	@Autowired
	private VehicleService vehicleService;

	private static final List<String> ALLOWED_FILE_EXTENSIONS = Arrays.asList("pdf", "jpeg", "png", "jpg");
//	private static final String FILE_DIRECTORY = "C:\\Anant\\skbit projects\\tms files"; // Your specific directory

	@Value("${file.storage.directory}")
	private String FILE_DIRECTORY;

	@PostMapping("/")
	public ResponseEntity<ApiResponse> createTrip(@RequestBody Trip trip, Principal principal) {
		User admin = userService.findByEmail(principal.getName());

		if (admin.getRoles().contains("Manager")) {
			trip.setBranch(admin.getBranches().get(0));
		}

		User user = userService.findById(trip.getUser().getId());
		Vehicle vehicle = vehicleService.findById(trip.getVehicle().getVehicleId());
		trip.setTripStatus(TripStatus.CREATED);
		trip.setUser(user);
		trip.setVehicle(vehicle);
		System.out.println("in controller trip status" + trip.getTripStatus());
		this.tripService.createTrip(trip);
		ApiResponse api = new ApiResponse();
		api.setMessage("trip created successfully");
		api.setStatus(true);

		updateVehicleAndUserStatus(trip, DriverStatus.ON_TRIP, VehicleStatus.ON_TRIP);
		return new ResponseEntity<ApiResponse>(api, HttpStatus.OK);

	}

	@PutMapping("/")
	public ResponseEntity<ApiResponse> updateTrip(@RequestPart TripUpdateRequest tripUpdateRequest,
			@RequestPart(required = false) MultipartFile startPhoto,
			@RequestPart(required = false) MultipartFile endPhoto,
			Principal principal) {
		Trip trip = tripService.findById(tripUpdateRequest.getTripId());
		
		String startLoc=tripUpdateRequest.getStartLoc();
		String endLoc=tripUpdateRequest.getEndLoc();
		if (startLoc!=null) {
			trip.setStartLocation(startLoc);
		}
		if (endLoc!=null) {
			trip.setEndLocation(endLoc);;
		}
		
		if (tripUpdateRequest.getStartKm() != null) {
			trip.setStartKm(tripUpdateRequest.getStartKm());
			if (startPhoto!=null) {
				
			
				if (!isValidFileExtension(startPhoto)) {
					return new ResponseEntity<>(
							ApiResponse.builder().status(false)
									.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
							HttpStatus.BAD_REQUEST);
				}
			}
			
		}
		if (tripUpdateRequest.getEndKm() != null) {
			trip.setEndKm(tripUpdateRequest.getEndKm());
			if(endPhoto !=null){
				if (!isValidFileExtension(endPhoto)) {
					return new ResponseEntity<>(
							ApiResponse.builder().status(false)
									.message("Invalid file type. Allowed types are pdf, jpeg, png, jpg.").build(),
							HttpStatus.BAD_REQUEST);
				}
			}
		}
		
		try {
			if (trip.getTripStatus() == TripStatus.CREATED) {
				handleFileUpload(trip, startPhoto, true);
				trip.setTripStatus(TripStatus.IN_PROGRESS);

			} else if (trip.getTripStatus() == TripStatus.IN_PROGRESS) {
				if (startPhoto!=null) {
					handleFileUpload(trip, startPhoto, true);
				}
				if (endPhoto!=null) {
					handleFileUpload(trip, endPhoto, false);
					trip.setTripStatus(TripStatus.COMPLETED);
					trip.setEndDate(LocalDate.now());
					updateVehicleAndUserStatus(trip, DriverStatus.AVAILABLE, VehicleStatus.AVAILABLE);
				}
				
			} else {
				if (startPhoto!=null) {
					handleFileUpload(trip, startPhoto, true);
				}
				if (endPhoto!=null) {
					handleFileUpload(trip, endPhoto, false);
				}
//				return new ResponseEntity<>(new ApiResponse("Invalid attributes", false), HttpStatus.BAD_REQUEST);
			}

			tripService.updateTrip(trip);
			return new ResponseEntity<>(new ApiResponse("Trip updated successfully", true), HttpStatus.OK);
		} catch (IOException e) {
			return new ResponseEntity<>(new ApiResponse("File upload failed: " + e.getMessage(), false),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PutMapping("/managerUpdate")
	public ResponseEntity<ApiResponse> managerUpdate(@RequestBody Trip trip) {
		Trip dbTrip = tripService.findById(trip.getTripId());
		trip.setStartDate(dbTrip.getStartDate());
		trip.setTotalDistance(dbTrip.getTotalDistance());
		trip.setTripStatus(dbTrip.getTripStatus());
		tripService.updateTrip(trip);
		return new ResponseEntity<ApiResponse>(new ApiResponse("updated successfully", true), HttpStatus.OK);
	}

	private boolean isValidFileExtension(MultipartFile file) {
		String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
		return fileExtension != null && ALLOWED_FILE_EXTENSIONS.contains(fileExtension.toLowerCase());
	}

	private void handleFileUpload(Trip trip, MultipartFile file, boolean isStart) throws IOException {
		String fileName = generateUniqueFilename(file.getOriginalFilename());
		if (isStart) {
			trip.setStartKmPhotoName(fileName);
		} else {
			trip.setEndKmPhotoName(fileName);
		}

		File directory = new File(FILE_DIRECTORY);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		File serverFile = new File(directory, fileName);
		file.transferTo(serverFile);
	}

	private void updateVehicleAndUserStatus(Trip trip, DriverStatus driverStatus, VehicleStatus vehicleStatus) {
		User user = trip.getUser();
		user.setDriverStatus(driverStatus);
		userService.updateUser(user);

		Vehicle vehicle = trip.getVehicle();
		vehicle.setVehicleStatus(vehicleStatus);
		vehicleService.updateVehicle(vehicle);
	}

	@DeleteMapping("/")
	public ResponseEntity<ApiResponse> deleteTrip(@RequestParam long id) {
		return new ResponseEntity<ApiResponse>(this.tripService.deleteTrip(id), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TripWithPhotosResponse> findById(@PathVariable long id) {
		Trip trip = this.tripService.findById(id);
		if (trip == null) {
			return ResponseEntity.notFound().build();
		}

		String startKmPhotoBase64 = null;
		String endKmPhotoBase64 = null;

		try {
			if (trip.getStartKmPhotoName() != null) {
				Path startPath = Paths.get(FILE_DIRECTORY).resolve(trip.getStartKmPhotoName()).normalize();
				byte[] startBytes = Files.readAllBytes(startPath);
				startKmPhotoBase64 = Base64.getEncoder().encodeToString(startBytes);
			}
			if (trip.getEndKmPhotoName() != null) {
				Path endPath = Paths.get(FILE_DIRECTORY).resolve(trip.getEndKmPhotoName()).normalize();
				byte[] endBytes = Files.readAllBytes(endPath);
				endKmPhotoBase64 = Base64.getEncoder().encodeToString(endBytes);
			}
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		TripWithPhotosResponse response = new TripWithPhotosResponse(trip, startKmPhotoBase64, endKmPhotoBase64);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/")
	public List<Trip> findAllOrByBranch(
	    Principal principal,
	    @RequestParam( required = false) LocalDate startDate) {
	    
	    User user = userService.findUserByName(principal.getName());
	    Set<String> roles = user.getRoles();

	    List<Trip> trips = new ArrayList<>();

	    if (roles.contains("Manager")) {
	        trips = this.tripService.findByBranchId(user.getBranches().get(0).getId());
	    } else if (roles.contains("Driver")) {
	        trips = this.tripService.findByUserId(user.getId());
	    } else if (roles.contains("RegionalManager")) {
	        List<Branch> branches = user.getBranches();
	        List<Long> ids = branches.stream().map(Branch::getId).toList();
	        trips = tripService.findByBranches(ids);
	    } else {
	        trips = this.tripService.findAll();
	    }

	    LocalDate filterDate = (startDate != null) ? startDate : LocalDate.now().minusWeeks(1);

	    return trips.stream()
	        .filter(trip -> trip.getStartDate() != null && !trip.getStartDate().isBefore(filterDate))
	        .sorted((t1, t2) -> Long.compare(t2.getTripId(), t1.getTripId()))
	        .toList();
	}

	@GetMapping("/all")
	public List<Trip> findAllOrByBranchAll(
	    Principal principal) {
	    
	    User user = userService.findUserByName(principal.getName());
	    Set<String> roles = user.getRoles();

	    List<Trip> trips = new ArrayList<>();

	    if (roles.contains("Manager")) {
	        trips = this.tripService.findByBranchId(user.getBranches().get(0).getId());
	    } else if (roles.contains("Driver")) {
	        trips = this.tripService.findByUserId(user.getId());
	    } else if (roles.contains("RegionalManager")) {
	        List<Branch> branches = user.getBranches();
	        List<Long> ids = branches.stream().map(Branch::getId).toList();
	        trips = tripService.findByBranches(ids);
	    } else {
	        trips = this.tripService.findAll();
	    }
	    return trips.stream()
	        .sorted((t1, t2) -> Long.compare(t2.getTripId(), t1.getTripId()))
	        .toList();
	}
	@GetMapping("/getByVehicle")
	public List<Trip> findByVehicle(@RequestParam long vehicleId) {
		return this.tripService.findByVehicle(vehicleId);
	}

	@PatchMapping("/status")
	public ResponseEntity<ApiResponse> updateTripStatus(@RequestParam long id, @RequestParam TripStatus tripStatus,
			@RequestParam(required = false) String cancellationReason, Principal principal) {
		User user = userService.findByEmail(principal.getName());

		if (user.getRoles().contains("Driver")) {
			throw new NotFoundException("driver cannot cancel trip");
		}
		if (cancellationReason != null) {
			return new ResponseEntity<>(tripService.updateTripStatusCancelled(id, cancellationReason), HttpStatus.OK);
		}

		return new ResponseEntity<>(tripService.updateTripStatus(id, tripStatus), HttpStatus.OK);
	}

	@GetMapping("/findByDriver")
	public List<Trip> findByDriver(@RequestParam long userId) {
		return tripService.findByUserId(userId);
	}

	@GetMapping("/findByStartDate")
	public List<Trip> findByStartDate(@RequestParam LocalDate startDate) {
		return tripService.findByStartDate(startDate);
	}

	@GetMapping("/findByEndDate")
	public List<Trip> findByEndDate(@RequestParam LocalDate endDate) {
		return tripService.findByEndDate(endDate);
	}
	
	public String generateUniqueFilename(String originalFilename) {
	    String timestamp = new SimpleDateFormat("yyyyMMddHHm-mssSSS").format(new Date());
	    return timestamp + "_" + originalFilename;
	}


}
