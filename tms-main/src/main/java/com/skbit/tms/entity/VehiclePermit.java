package com.skbit.tms.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VehiclePermit {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long permitId;

	private String permitType;
	private String permitReceiptNo;
	private LocalDate startDate;
	private LocalDate endDate;

	private String permitReceiptName;
	private boolean formFillStatus;

	private RenewalDue renewalDue;

	@PrePersist
	@PreUpdate
	public void updateFormFillStatus() {
		this.formFillStatus =
				(this.permitReceiptNo !=null &&
				this.permitType != null &&
				this.startDate != null &&
				this.endDate != null
				);
	}

}
