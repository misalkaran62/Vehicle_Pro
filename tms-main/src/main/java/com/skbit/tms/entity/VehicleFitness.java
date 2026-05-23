package com.skbit.tms.entity;

import java.time.LocalDate;

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
public class VehicleFitness {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long fitnessId;

	private LocalDate startDate;
	private LocalDate endDate;
    private String fitnessReceiptNO;

	private String fitnessReceiptName;

	private boolean formFillStatus;

	private RenewalDue renewalDue;
	
	@PrePersist
    @PreUpdate
    public void updateFormFillStatus() {
        this.formFillStatus = (this.startDate != null &&
                               this.endDate != null &&
                               this.fitnessReceiptNO!=null
                               );
    }

}
