package com.skillport.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String type; // Full-time, Internship, etc.
    private String salary;
    
    @Column(length = 2000)
    private String description;
    
    private String tags;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private Long recruiterId;

    // Tracking fields
    private Integer views = 0;
    private Integer applicants = 0;
}