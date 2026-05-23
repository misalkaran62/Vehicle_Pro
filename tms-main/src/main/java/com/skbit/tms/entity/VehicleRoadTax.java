package com.skbit.tms.entity;

import java.time.LocalDate;

import com.skbit.tms.enumProvider.TaxType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VehicleRoadTax {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long roadTaxId;
	private String roadTaxReceiptNo;
	private TaxType taxType;

	private LocalDate startDate;
	private LocalDate endDate;
	private String taxReceiptName;

	private boolean formFillStatus;

	private RenewalDue renewalDue;

	@PrePersist
	@PreUpdate
	public void updateFormFillStatus() {

		if (taxType.equals(TaxType.LIFETIME)) {
			this.formFillStatus = (this.roadTaxReceiptNo != null && this.startDate != null);
		} else {
			this.formFillStatus = (this.roadTaxReceiptNo != null && this.startDate != null && this.endDate != null);

		}

	}

}
