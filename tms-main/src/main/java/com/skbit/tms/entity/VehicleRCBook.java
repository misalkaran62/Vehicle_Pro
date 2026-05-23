package com.skbit.tms.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VehicleRCBook {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

//    @NotBlank(message = "Owner type is required")
//	@Size(max = 50, message = "Owner type should not exceed 50 characters")
//	@Pattern(regexp = "[a-zA-z]+", message = "alphabetic")
	private String ownerType;

	private LocalDate startDate;
	private LocalDate endDate;
	private String rcBookReceiptNo;

	private String RCBookName;

	private boolean formFillStatus = true;

	// @PrePersist
	// @PreUpdate
	// public void updateFormFillStatus() {
	// 	this.formFillStatus = (this.startDate != null  && this.RCBookName != null);
	// }

}
