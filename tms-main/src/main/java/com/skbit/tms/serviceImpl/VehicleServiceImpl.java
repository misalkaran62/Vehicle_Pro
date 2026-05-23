package com.skbit.tms.serviceImpl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.skbit.tms.entity.NotificationType;
import com.skbit.tms.entity.PartMapping;
import com.skbit.tms.entity.RenewalDue;
import com.skbit.tms.entity.User;
import com.skbit.tms.entity.Vehicle;
import com.skbit.tms.entity.VehicleFinance;
import com.skbit.tms.entity.VehicleFitness;
import com.skbit.tms.entity.VehicleInsurance;
import com.skbit.tms.entity.VehicleNotification;
import com.skbit.tms.entity.VehiclePUC;
import com.skbit.tms.entity.VehiclePermit;
import com.skbit.tms.entity.VehicleRoadTax;
import com.skbit.tms.entity.VehicleServicing;
import com.skbit.tms.entity.VehicleStatus;
import com.skbit.tms.enumProvider.TaxType;
import com.skbit.tms.exception.InvalidUserException;
import com.skbit.tms.exception.NotFoundException;
import com.skbit.tms.repo.BranchRepo;
import com.skbit.tms.repo.UserRepo;
import com.skbit.tms.repo.VehicleNotificationsRepo;
import com.skbit.tms.repo.VehicleRepo;
import com.skbit.tms.response.ApiResponse;
import com.skbit.tms.service.EmailService;
import com.skbit.tms.service.VehicleFitnessService;
import com.skbit.tms.service.VehicleInsuranceService;
import com.skbit.tms.service.VehiclePUCService;
import com.skbit.tms.service.VehiclePermitService;
import com.skbit.tms.service.VehicleRoadTaxService;
import com.skbit.tms.service.VehicleService;

@Service
@EnableScheduling

public class VehicleServiceImpl implements VehicleService {

	@Autowired
	private VehicleRepo vehicleRepo;
	
	@Autowired
	private BranchRepo branchRepo;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private EmailService emailService;

	@Autowired
	private VehicleFitnessService fitnessService;

	@Autowired
	private VehicleInsuranceService insuranceService;

	@Autowired
	private VehiclePermitService permitService;

	@Autowired
	private VehiclePUCService pucService;

	@Autowired
	private VehicleRoadTaxService roadTaxService;

	@Autowired
	private VehicleNotificationsRepo vehicleNotificationsRepo;

	@Override
	public ApiResponse createVehicle(Vehicle vehicle) {
		List<User> managerList = userRepo.findByBranches_IdAndRolesContaining(vehicle.getBranch().getId(),
				"Manager");
		
		
		String branchName=branchRepo.findById(vehicle.getBranch().getId()).get().getBranchName();
		if(managerList.size()==0) {
			throw new NotFoundException("Manager not found in given branch: "+branchName);
		}
		vehicle.setCreatedAt(LocalDate.now());
		vehicle.setVehicleStatus(VehicleStatus.AVAILABLE);
		vehicleRepo.save(vehicle);
		updateFormFillStatus(vehicle);

		return ApiResponse.builder().status(true).message("vehicle created successfully").build();
	}

	@Override
	public ApiResponse updateVehicle(Vehicle vehicle) {

		Vehicle dbVehicle = findById(vehicle.getVehicleId());
		vehicle.setCreatedAt(dbVehicle.getCreatedAt());
		vehicle.setVehicleStatus(dbVehicle.getVehicleStatus());
		vehicle.setCreatedByEmail(dbVehicle.getCreatedByEmail());
		vehicle.setFormFillStatus(updateFormFillStatus(dbVehicle));
		System.out.println(updateFormFillStatus(dbVehicle));
		vehicleRepo.save(vehicle);
		return ApiResponse.builder().status(true).message("vehicle updated successfully").build();

	}

	@Override
	public ApiResponse deleteVehicle(long id) {
		Optional<Vehicle> optional = vehicleRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicle not found with given id" + id);
		}
		vehicleRepo.delete(optional.get());
		new ApiResponse();
		return ApiResponse.builder().status(true).message("vehicle deleted successfully").build();
	}

	@Override
	public Vehicle findById(long id) {
		Optional<Vehicle> optional = vehicleRepo.findById(id);
		if (optional.isEmpty()) {
			throw new NotFoundException("vehicle not found with given id");
		}
		return optional.get();
	}

	@Override
	public List<Vehicle> findAll() {
		return vehicleRepo.findAll();
	}

	@Override
	public List<Vehicle> vehiclesByBranch(long branchId) {
		return vehicleRepo.findByBranchId(branchId);
	}

	@Override
	public boolean updateFormFillStatus(Vehicle vehicle) {

		boolean financeStatus = false;
		boolean fitnessStatus = false;
		boolean insuranceStatus = false;
		boolean pucStatus = false;
		boolean permitStatus = false;
		boolean roadTaxStatus = false;
		if (vehicle.getVehicleFinances() != null) {
			VehicleFinance latestFinance = vehicle.getVehicleFinances().stream()
					.max(Comparator.comparing(VehicleFinance::getEndDate)).orElse(null);
			financeStatus = (latestFinance != null) && latestFinance.isFormFillStatus();
		}

		if (vehicle.getVehicleFitnesses() != null) {
			VehicleFitness latestFitness = vehicle.getVehicleFitnesses().stream()
					.max(Comparator.comparing(VehicleFitness::getEndDate)).orElse(null);
			fitnessStatus = (latestFitness != null) && latestFitness.isFormFillStatus();
		}

		if (vehicle.getVehicleInsurances() != null) {
			VehicleInsurance latestInsurance = vehicle.getVehicleInsurances().stream()
					.max(Comparator.comparing(VehicleInsurance::getEndDate)).orElse(null);
			insuranceStatus = (latestInsurance != null) && latestInsurance.isFormFillStatus();
		}

		if (vehicle.getVehiclePUCs() != null) {
			VehiclePUC latestPUC = vehicle.getVehiclePUCs().stream().max(Comparator.comparing(VehiclePUC::getEndDate))
					.orElse(null);
			pucStatus = (latestPUC != null) && latestPUC.isFormFillStatus();
		}

		if (vehicle.getVehiclePermits() != null) {
			VehiclePermit latestPermit = vehicle.getVehiclePermits().stream()
					.max(Comparator.comparing(VehiclePermit::getEndDate)).orElse(null);
			permitStatus = (latestPermit != null) && latestPermit.isFormFillStatus();
		}
		if (vehicle.getVehicleRoadTaxes() != null) {
			VehicleRoadTax latestRoadTax = vehicle.getVehicleRoadTaxes().stream()
					.max(Comparator.comparing(VehicleRoadTax::getEndDate)).orElse(null);
			roadTaxStatus = (latestRoadTax != null) && latestRoadTax.isFormFillStatus();
		}

		boolean status = (financeStatus && fitnessStatus && insuranceStatus && pucStatus && permitStatus
				&& roadTaxStatus);

		Vehicle dbVehicle = vehicleRepo.findByVehicleReg(vehicle.getVehicleReg());
		dbVehicle.setFormFillStatus(status);
		vehicleRepo.save(dbVehicle);
		return status;

	}

	@Override
	public Vehicle updateExpiryStatus(long id) {
		Optional<Vehicle> optional = vehicleRepo.findById(id);
		if (optional.isPresent()) {
			Vehicle vehicle = optional.get();

			RenewalDue worstStatus = RenewalDue.LATER;
			// Update the status based on each component, checking for the worst status
//			VehicleFinance latestFinance = vehicle.getVehicleFinances().stream()
//					.max(Comparator.comparing(VehicleFinance::getEndDate)).orElse(null);
//			if (latestFinance != null) {
//				if (latestFinance.getRenewalDue().compareTo(worstStatus) < 0) {
//					worstStatus = latestFinance.getRenewalDue(); // Update if it's worse than current
//				}
//			}

			VehicleFitness latestFitness = vehicle.getVehicleFitnesses().stream()
					.max(Comparator.comparing(VehicleFitness::getEndDate)).orElse(null);
			if (latestFitness != null) {
				if (latestFitness.getRenewalDue().compareTo(worstStatus) < 0) {
					worstStatus = latestFitness.getRenewalDue();
				}
			}

			VehicleInsurance latestInsurance = vehicle.getVehicleInsurances().stream()
					.max(Comparator.comparing(VehicleInsurance::getEndDate)).orElse(null);
			if (latestInsurance != null) {
				if (latestInsurance.getRenewalDue().compareTo(worstStatus) < 0) {
					worstStatus = latestInsurance.getRenewalDue();
				}
			}

			VehiclePUC latestPUC = vehicle.getVehiclePUCs().stream().max(Comparator.comparing(VehiclePUC::getEndDate))
					.orElse(null);
			if (latestPUC != null) {
				if (latestPUC.getRenewalDue().compareTo(worstStatus) < 0) {
					worstStatus = latestPUC.getRenewalDue();
				}
			}

			VehiclePermit latestPermit = vehicle.getVehiclePermits().stream()
					.max(Comparator.comparing(VehiclePermit::getEndDate)).orElse(null);
			if (latestPermit != null) {
				if (latestPermit.getRenewalDue().compareTo(worstStatus) < 0) {
					worstStatus = latestPermit.getRenewalDue();
				}
			}

			VehicleRoadTax latestRoadTax = vehicle.getVehicleRoadTaxes().stream()
					.max(Comparator.comparing(VehicleRoadTax::getEndDate)).orElse(null);
			if (latestRoadTax != null) {
				if (latestRoadTax.getTaxType() == TaxType.LIMITED) {
					if (latestRoadTax.getRenewalDue().compareTo(worstStatus) < 0) {
						worstStatus = latestRoadTax.getRenewalDue();
					}
				}
			}

			// Now we have the worst status, update the vehicle's expiry status
			vehicle.setRenewalDue(worstStatus);

			// Save the updated vehicle entity
			return vehicleRepo.save(vehicle);

		} else {
			throw new NotFoundException("Vehicle not found with id: " + id);
		}
	}

	@Override
	public List<Vehicle> getAllAvailableVehicles() {
		return vehicleRepo.findByVehicleStatus(VehicleStatus.AVAILABLE);
	}

	@Override
	public ApiResponse updateVehicleStatus(long id, VehicleStatus vehicleStatus) {
		Vehicle vehicle = vehicleRepo.findById(id).orElseThrow(() -> new NotFoundException("Vehicle not found"));
		vehicle.setVehicleStatus(vehicleStatus);
		vehicleRepo.save(vehicle);
		return new ApiResponse("Vehicle status updated successfully", true);
	}

	@Override
	public List<Vehicle> findByBranchId(long id) {
		return vehicleRepo.findByBranchId(id);
	}

	@Override
	public Vehicle findByVehicleReg(String vehicleReg) {
		return vehicleRepo.findByVehicleReg(vehicleReg);
	}

	@Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
//	@Scheduled(cron = "0 */5 * ? * *")// every 5min
	@Override
	public ApiResponse createNotification() {

		LocalDate today = LocalDate.now();

		List<Vehicle> vehicles = vehicleRepo.findAll();

		// Check and send notifications for each document type
		for (Vehicle vehicle : vehicles) {
			checkAndSendNotification(vehicle.getVehicleFitnesses(), "fitness", vehicle, today);
			checkAndSendNotification(vehicle.getVehicleInsurances(), "insurance", vehicle, today);
			checkAndSendNotification(vehicle.getVehiclePermits(), "permit", vehicle, today);
			checkAndSendNotification(vehicle.getVehiclePUCs(), "PUC", vehicle, today);
			checkAndSendNotification(vehicle.getVehicleRoadTaxes(), "RoadTax", vehicle, today);
			updateExpiryStatus(vehicle.getVehicleId());
		}

		return new ApiResponse("Notifications created", true);
	}

	private <T> void checkAndSendNotification(List<T> documents, String type, Vehicle vehicle, LocalDate today) {
		System.out.println("this is type" + type + "this is vehicle id" + vehicle.getVehicleId());
		System.out.println("");
		List<User> users = userRepo.findByRolesContaining("SUPERADMIN");
		User superAdmin = users.get(0);
		String superAdminEmail = superAdmin.getEmail();
		documents.stream().filter(doc -> getEndDate(doc) != null).max(Comparator.comparing(this::getEndDate))
				.ifPresent(document -> {
					LocalDate endDate = getEndDate(document);
					long daysDifference = ChronoUnit.DAYS.between(today, endDate);

					boolean isWithin10Days = daysDifference >= 0 && daysDifference <= 10;
					boolean expired = daysDifference < 0;

					Long documentId=null;
					switch (type) {
					case "fitness": {
						VehicleFitness fitness = (VehicleFitness) document;
						documentId=fitness.getFitnessId();
						fitnessService.updateRenewalDue(fitness.getFitnessId());
					}
						break;
					case "insurance": {
						VehicleInsurance insurance = (VehicleInsurance) document;
						documentId=insurance.getInsuranceId();
						insuranceService.updateRenewalDue(insurance.getInsuranceId());
					}
						break;
					case "permit": {
						VehiclePermit permit = (VehiclePermit) document;
						documentId=permit.getPermitId();
						permitService.updateRenewalDue(permit.getPermitId());
					}
						break;
					case "PUC": {
						VehiclePUC puc = (VehiclePUC) document;
						documentId=puc.getPucId();
						pucService.updateRenewalDue(puc.getPucId());
					}
						break;
					case "RoadTax": {
						VehicleRoadTax tax = (VehicleRoadTax) document;
						documentId=tax.getRoadTaxId();
						roadTaxService.updateRenewalDue(tax.getRoadTaxId());
					}
						break;
					}

					String notificationMessage = type+ " of vehicle with registration no "+ vehicle.getVehicleReg()  + " "
							+ (isWithin10Days ? " is going to expire within 10 days" : "is expired");

					List<User> managerList = userRepo.findByBranches_IdAndRolesContaining(vehicle.getBranch().getId(),
							"Manager");
					User manager = null;
					String email = null;
					
					if (managerList.size()!=0) {
						 manager = managerList.get(0);
						 email = manager.getEmail();
					}
					

					
					boolean notificationExists = vehicleNotificationsRepo.existsByDocumentIdAndTypeAndExpired(documentId, type, expired);
					
					
					if (!notificationExists && (isWithin10Days || expired)) {
						emailService.sendMail(superAdminEmail, "Request for " + type + " renewal", notificationMessage);
						if (email!=null) {
							emailService.sendMail(email, "Request for " + type + " renewal", notificationMessage);
						}
						
						VehicleNotification vehicleNotification = new VehicleNotification();
						vehicleNotification.setNotificationType(NotificationType.AUTOMATIC);
						vehicleNotification.setNotification(notificationMessage);
						vehicleNotification.setNotificationDate(today);
						if (manager!=null) {
							vehicleNotification.setUserName(manager.getFirstName()+manager.getLastName());
						}
						vehicleNotification.setVehilceRegNo(vehicle.getVehicleReg());
						vehicleNotification.setDocumentId(documentId);
						vehicleNotification.setExpired(expired);
						vehicleNotification.setType(type);
						vehicleNotification.setBranch(vehicle.getBranch());
						vehicleNotificationsRepo.save(vehicleNotification);
					}
				});
	}

	// Helper method to get end date based on document type
	private LocalDate getEndDate(Object document) {
		if (document instanceof VehicleFitness) {
			return ((VehicleFitness) document).getEndDate();
		} else if (document instanceof VehicleInsurance) {
			return ((VehicleInsurance) document).getEndDate();
		} else if (document instanceof VehiclePermit) {
			return ((VehiclePermit) document).getEndDate();
		} else if (document instanceof VehiclePUC) {
			return ((VehiclePUC) document).getEndDate();
		} else if (document instanceof VehicleRoadTax) {
			return ((VehicleRoadTax) document).getEndDate();
		}
		return null;
	}

	@Override
	public List<PartMapping> getReplacedParts(Long vehicleId) {
		List<PartMapping> replacedParts=new ArrayList<PartMapping>();
		vehicleRepo.findById(vehicleId).get().getVehicleServicings().forEach((ser)->replacedParts.addAll(ser.getOldPartMappings()));
		return replacedParts;
	}


}
