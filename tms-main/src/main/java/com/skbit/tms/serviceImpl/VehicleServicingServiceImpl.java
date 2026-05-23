package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.NotificationType;
import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.ServicingFormRequest;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleNotification;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.enumProvider.CompletionStatus;
import com.skbit.tms.enumProvider.ServicingType;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.ServicingFormRequestRepo;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.repo.VehicleNotificationsRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.repo.VehicleServicingRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.EmailService;
import com.skbit.tms.service.VehicleServicingService;

@Service
@EnableScheduling
public class VehicleServicingServiceImpl implements VehicleServicingService {

	@Autowired
	private VehicleServicingRepo vehicleServicingRepo;

	@Autowired
	private VehicleRepo vehicleRepo;

	@Autowired
	private ServicingFormRequestRepo requestRepo;

	@Autowired
	private EmailService emailService;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private VehicleNotificationsRepo vehicleNotificationsRepo;

	@Override
	public ApiResponse createVehicleServicing(VehicleServicing vehicleServicing, Long vehicleId) {

		vehicleServicing.setCreatedAt(LocalDate.now());
		vehicleServicing.setCompletionStatus(CompletionStatus.SERVICING_RAISED);
		Vehicle vehicle = vehicleRepo.findById(vehicleId)
				.orElseThrow(() -> new NotFoundException("Vehicle not found with given id:" + vehicleId));
		vehicle.getVehicleServicings().add(vehicleServicing);
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehicleServicing created successfully").build();
	}

	@Override
	public ApiResponse updateVehicleServicing(VehicleServicing vehicleServicing) {
		VehicleServicing dbVehicleServicing=vehicleServicingRepo.findById(vehicleServicing.getServicingId()).get();
		vehicleServicing.setCreatedAt(dbVehicleServicing.getCreatedAt());
		if (vehicleServicing.getOldPartMappings()!=null) {
			Vehicle vehicle=vehicleRepo.findById(vehicleServicingRepo.findVehicleIdByServicingId(vehicleServicing.getServicingId())).get();
			List<PartMapping> mappings=vehicle.getPartMappings();
			mappings.removeAll(vehicleServicing.getOldPartMappings());
			mappings.addAll(vehicleServicing.getNewPartMappings());
			vehicleRepo.save(vehicle);
			Vehicle vehicleForId=vehicleRepo.findByVehicleReg(vehicle.getVehicleReg());
			vehicleServicing.setNewPartMappings(
				    vehicleForId.getPartMappings().stream()
				        .filter(part -> vehicleServicing.getNewPartMappings().stream()
				            .anyMatch(newPart -> newPart.getSerialNumber().equals(part.getSerialNumber())))
				        .toList() // Collect all matching parts into a list
				);
		}
		vehicleServicingRepo.save(vehicleServicing);
		return ApiResponse.builder().status(true).message("vehicleServicing updated successfully").build();
	}

	@Override
	public ApiResponse deleteVehicleServicing(long id, long vehicleId) {

		Optional<VehicleServicing> optional = vehicleServicingRepo.findById(id);

		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleServicing not found with given id" + id);
		}
		VehicleServicing vehicleServicing = optional.get();

		Vehicle vehicle = vehicleRepo.findById(vehicleId).get();
		List<VehicleServicing> vehicleServicings = vehicle.getVehicleServicings();

		vehicleServicings.remove(vehicleServicing);
		vehicle.setVehicleServicings(vehicleServicings);
		vehicleRepo.save(vehicle);
		vehicleServicingRepo.delete(vehicleServicing);
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicleServicing deleted successfully").build();
	}

	@Override
	public VehicleServicing findById(long id) {
		Optional<VehicleServicing> optional = vehicleServicingRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicleServicing not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<VehicleServicing> findAll() {
		return vehicleServicingRepo.findAll();
	}

	@Scheduled(cron = "0 0 0 * * ?")
	// @Scheduled(cron = "0 */5 * ? * *")
	@Override
	public ApiResponse createRequestForm() {

		List<Vehicle> vehicles = vehicleRepo.findAll();
		List<User> users = userRepo.findByRolesContaining("SUPERADMIN");
		User superAdmin = users.get(0);
		String superAdminEmail = superAdmin.getEmail();

		boolean checkCreate = false;
		for (Vehicle vehicle : vehicles) {

			List<User> managerList = userRepo.findByBranches_IdAndRolesContaining(vehicle.getBranch().getId(),
					"Manager");
			System.out.println("in servicing, creating request form of branch"+vehicle.getBranch().getBranchName()+"and size of branch manager list"+managerList.size());
			User manager = managerList.get(0);
			String managerEmail = manager.getEmail();
			Optional<VehicleServicing> latestServicing = vehicle.getVehicleServicings().stream()
					.max(Comparator.comparing(VehicleServicing::getServicingDate));

			VehicleServicing vehicleServicing = latestServicing.get();

			LocalDate servicingDate = vehicleServicing.getServicingDate();
			LocalDate today = LocalDate.now();

			// Calculate days between today and servicingDate
			long daysDifference = ChronoUnit.DAYS.between(today, servicingDate);

			// Check if the servicing date is within 10 days from today
			boolean isWithin10Days = daysDifference >= 0 && daysDifference <= 10;

			boolean expired = daysDifference < 0;

			Double nextKmServicing = vehicleServicing.getNextKmServicing();
			boolean distLimitReached = nextKmServicing < 100.00;

			boolean distNotificationExists = vehicleNotificationsRepo
					.existsByDocumentIdAndTypeAndDistLimitReached(vehicleServicing.getServicingId(), "servicing", true);
			boolean notificationExists = vehicleNotificationsRepo
					.existsByDocumentIdAndTypeAndExpired(vehicleServicing.getServicingId(), "servicing", expired);

			if (!distNotificationExists && distLimitReached) {
				ServicingFormRequest request = new ServicingFormRequest();
				request.setServicingType(ServicingType.REGULAR);
				request.setDescription("The vehicle is nearing the distance limit for its next servicing.");
				requestRepo.save(request);

				checkCreate = true;
				String emailSubject = "Request for Servicing";
				String emailBody = "The vehicle with registration number " + vehicle.getVehicleReg()
						+ " needs servicing soon as it is approaching the distance limit.";
				emailService.sendMail(superAdminEmail, emailSubject, emailBody);
				emailService.sendMail(managerEmail, emailSubject, emailBody);
				VehicleNotification vehicleNotification = new VehicleNotification();
				vehicleNotification.setDocumentId(vehicleServicing.getServicingId());
				vehicleNotification.setType("servicing");
				vehicleNotification.setDistLimitReached(distLimitReached);
				vehicleNotification.setNotificationType(NotificationType.AUTOMATIC);
				vehicleNotification.setNotification(emailBody);
				vehicleNotification.setNotificationDate(today);
				vehicleNotification.setVehilceRegNo(vehicle.getVehicleReg());
				vehicleNotification.setUserName(manager.getFirstName() + manager.getLastName());
				vehicleNotification.setBranch(vehicle.getBranch());
				vehicleNotificationsRepo.save(vehicleNotification);
			}

			if (!distNotificationExists && !notificationExists && isWithin10Days && !distLimitReached) {
				String emailSubject = "Request for servicing";
				String emailBody = vehicle.getVehicleReg() + "Vehicle servicing is due in 10 days";
				ServicingFormRequest request = new ServicingFormRequest();
				request.setServicingType(ServicingType.REGULAR);
				request.setDescription(emailBody);
				requestRepo.save(request);

				checkCreate = true;

				emailService.sendMail(superAdminEmail, emailSubject, emailBody);
				emailService.sendMail(managerEmail, emailSubject, emailBody);

				VehicleNotification vehicleNotification = new VehicleNotification();
				vehicleNotification.setDocumentId(vehicleServicing.getServicingId());
				vehicleNotification.setType("servicing");
				vehicleNotification.setNotificationType(NotificationType.AUTOMATIC);
				vehicleNotification.setNotification(emailBody);
				vehicleNotification.setNotificationDate(today);
				vehicleNotification.setVehilceRegNo(vehicle.getVehicleReg());
				vehicleNotification.setUserName(manager.getFirstName() + manager.getLastName());
				vehicleNotification.setExpired(expired);
				vehicleNotification.setBranch(vehicle.getBranch());
				vehicleNotificationsRepo.save(vehicleNotification);

			} else if (!distNotificationExists && !notificationExists && expired && !distLimitReached) {

				String emailSubject = "Request for servicing";
				String emailBody = vehicle.getVehicleReg()
						+ " Vehicle servicing is due, date for renewal has passed already!";
				ServicingFormRequest request = new ServicingFormRequest();
				request.setServicingType(ServicingType.REGULAR);
				request.setDescription("expired");
				requestRepo.save(request);

				checkCreate = true;

				emailService.sendMail(superAdminEmail, emailSubject, emailBody);
				emailService.sendMail(managerEmail, emailSubject, emailBody);

				VehicleNotification vehicleNotification = new VehicleNotification();
				vehicleNotification.setDocumentId(vehicleServicing.getServicingId());
				vehicleNotification.setType("servicing");
				vehicleNotification.setNotificationType(NotificationType.AUTOMATIC);
				vehicleNotification.setNotification(emailBody);
				vehicleNotification.setNotificationDate(today);
				vehicleNotification.setVehilceRegNo(vehicle.getVehicleReg());
				vehicleNotification.setUserName(manager.getFirstName() + manager.getLastName());
				vehicleNotification.setBranch(vehicle.getBranch());
				vehicleNotificationsRepo.save(vehicleNotification);
			}

		}
		if (checkCreate) {
			return ApiResponse.builder().status(true).message("Atleast one service form is created").build();
		} else {
			return ApiResponse.builder().status(true).message("No servicing form created").build();
		}

	}

	@Override
	public List<VehicleServicing> findByBranchId(long id) {

		return vehicleServicingRepo.findVehicleServicingsByBranchId(id);
	}

	@Override
	public ApiResponse updateApprovalStatus(Long servicingId, Boolean status) {
		VehicleServicing vehicleServicing = vehicleServicingRepo.findById(servicingId)
				.orElseThrow(() -> new NotFoundException("Vehicle Servicing not found"));
		vehicleServicing.setApproved(status);
		vehicleServicingRepo.save(vehicleServicing);
		return new ApiResponse("servicing approval status updated successfully", true);
	}

	@Override
	public ApiResponse updateServicingType(Long servicingId, ServicingType servicingType) {
		VehicleServicing vehicleServicing = vehicleServicingRepo.findById(servicingId)
				.orElseThrow(() -> new NotFoundException("Vehicle Servicing not found"));
		vehicleServicing.setServicingType(servicingType);
		vehicleServicingRepo.save(vehicleServicing);
		return new ApiResponse("servicing type updated successfully", true);
	}

	@Override
	public ApiResponse updateCompletionStatus(Long servicingId, CompletionStatus completionStatus) {
		VehicleServicing vehicleServicing = vehicleServicingRepo.findById(servicingId)
				.orElseThrow(() -> new NotFoundException("Vehicle Servicing not found"));

		Long vehicleId = vehicleServicingRepo.findVehicleIdByServicingId(servicingId);
		Vehicle dbVehicle = vehicleRepo.findById(vehicleId).get();

		if (completionStatus == CompletionStatus.ON_SERVICING) {
			dbVehicle.setVehicleStatus(VehicleStatus.SERVICING);
			vehicleRepo.save(dbVehicle);
		} else if (completionStatus == CompletionStatus.SERVICING_COMPLETED) {
			dbVehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
			vehicleRepo.save(dbVehicle);
		}
		vehicleServicing.setCompletionStatus(completionStatus);
		vehicleServicingRepo.save(vehicleServicing);
		return new ApiResponse("completion status updated successfully", true);
	}

	



	@Override
	public List<VehicleServicing> findServicingByVehicleId(Long vehicleId) {
		List<VehicleServicing> servcie=this.vehicleRepo.findVehicleServicingsByVehicleId(vehicleId);	
		return servcie;
	}

	@Override
	public List<VehicleServicing> findAllServicingByVehicleId(long id) {
		List<VehicleServicing> servcie=this.vehicleRepo.findVehicleServicingsByVehicleId(id);	
		return servcie;
	}

}