package com.skbit.tms.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VehicleFinance {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long finance_id;
	@NotBlank(message = "Finance type is required")
//	@Size(max = 50, message = "Finance type should not exceed 50 characters")
//	@Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
	private String financeType;
	private String financeName;
	private LocalDate startDate;
	private LocalDate endDate;
	private double rateOfInterest;
	private double emiAmount;
	private int emiDate;
	private int purchaseAmount;
	private LocalDate purchaseDate;
	private String repaymentScheduleFileName;
	private String sanctionLetterFileName;
	private double forceClosureAmount;
	private LocalDate forceClosureDate;
	private boolean formFillStatus;
	private RenewalDue renewalDue;
	
	@PrePersist
    @PreUpdate
    public void updateFormFillStatus() {
		if (this.financeType.equals("cash")) {
			this.formFillStatus = (this.financeType != null &&
                    this.purchaseAmount != 0 &&
                    this.purchaseDate != null );
		}
		else {
			this.formFillStatus = (this.financeType != null &&
				    this.purchaseAmount != 0 &&
				    this.purchaseDate != null &&
                    this.financeName != null &&
                    this.startDate != null &&
                    this.endDate != null &&
                    this.emiAmount!=0 &&
                    this.emiDate != 0 
                    );
		}
    }

	
	
}