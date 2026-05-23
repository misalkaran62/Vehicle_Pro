package com.skbit.tms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.File;

@Service
public class EmailService {

	@Autowired
	private final JavaMailSender javaMailSender;

	@Value("${spring.mail.username}")
	private String fromEmail;

	

	@Value("${log.file.path:./logs/application.log}") // Default log file path
	private String logFilePath;

	public EmailService(JavaMailSender javaMailSender) {
		super();
		this.javaMailSender = javaMailSender;
	}

	public void sendMail(String toEmail, String subject, String message) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(toEmail);
		mailMessage.setSubject(subject);
		mailMessage.setText(message);
		mailMessage.setFrom("navnathdoke2222@gmail.com");
		javaMailSender.send(mailMessage);
	}

	// ✅ New method to send daily log file
	public void sendLogFileEmail() {
		try {
			File logFile = new File(logFilePath);
			if (!logFile.exists()) {
				System.out.println("Log file not found: " + logFilePath);
				return;
			}

			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

			helper.setFrom(fromEmail);
			helper.setTo("navnathdoke2222@gmail.com");
			helper.setSubject("Daily Log File");
			helper.setText("Attached is the daily log file.");

			helper.addAttachment("application.log", logFile);

			javaMailSender.send(mimeMessage);
			System.out.println("Daily log file email sent successfully!");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// ✅ Automatically send log file at midnight
	@Scheduled(cron = "0 0 0 * * ?")
	public void scheduleLogFileEmail() {
		sendLogFileEmail();
	}
}
