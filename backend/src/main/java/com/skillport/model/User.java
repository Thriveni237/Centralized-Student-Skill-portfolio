package com.skillport.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;
    private String role; // student, recruiter, admin
    private String bio;
    private String location;
    
    // Social Links
    private String github;
    private String linkedin;
    private String website;

    // Settings
    private String language = "English (US)";
    private boolean darkMode = false;
    private boolean notifMessages = true;
    private boolean notifApplications = true;
    private boolean notifMarketing = false;

    // Tracking
    private Integer views = 0;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Project> projects;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Skill> skills;

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public boolean isDarkMode() { return darkMode; }
    public void setDarkMode(boolean darkMode) { this.darkMode = darkMode; }

    public boolean isNotifMessages() { return notifMessages; }
    public void setNotifMessages(boolean notifMessages) { this.notifMessages = notifMessages; }

    public boolean isNotifApplications() { return notifApplications; }
    public void setNotifApplications(boolean notifApplications) { this.notifApplications = notifApplications; }

    public boolean isNotifMarketing() { return notifMarketing; }
    public void setNotifMarketing(boolean notifMarketing) { this.notifMarketing = notifMarketing; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
}