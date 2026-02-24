package com.skillport.controller;

import com.skillport.model.Application;
import com.skillport.model.Job;
import com.skillport.repository.ApplicationRepository;
import com.skillport.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/health")
    public String health() {
        return "Application Controller is active and reachable";
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(@PathVariable Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @PostMapping
    public Application applyForJob(@RequestBody Application application) {
        Application savedApp = applicationRepository.save(application);
        
        // Increment applicant count on the job
        if (application.getJobId() != null) {
            jobRepository.findById(application.getJobId()).ifPresent(job -> {
                job.setApplicants((job.getApplicants() == null ? 0 : job.getApplicants()) + 1);
                jobRepository.save(job);
            });
        }
        
        return savedApp;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return applicationRepository.findById(id).map(app -> {
            String cleanStatus = status.replace("\"", "");
            app.setStatus(cleanStatus);
            Application saved = applicationRepository.save(app);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}