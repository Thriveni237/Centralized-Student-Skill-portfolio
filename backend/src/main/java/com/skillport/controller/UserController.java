package com.skillport.controller;

import com.skillport.model.User;
import com.skillport.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public String healthCheck() {
        try {
            long count = userRepository.count();
            return "Backend is running on port 8082 and connected to MySQL! Total users in DB: " + count;
        } catch (Exception e) {
            return "Backend is running, but CANNOT connect to MySQL. Error: " + e.getMessage();
        }
    }

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users = userRepository.findAll();
        if (role != null && !role.isEmpty()) {
            return users.stream()
                    .filter(u -> role.equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());
        }
        return users;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"message\": \"Email is required\"}");
        }

        user.setEmail(user.getEmail().toLowerCase().trim());
        
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"message\": \"User already exists with this email\"}");
        }
        
        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"message\": \"Error saving user: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        if (loginUser.getEmail() == null || loginUser.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"message\": \"Email and password are required\"}");
        }

        String email = loginUser.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email);
        
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok(user);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("{\"message\": \"Invalid email or password\"}");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, @RequestParam(required = false) boolean incrementView) {
        return userRepository.findById(id)
            .map(user -> {
                if (incrementView) {
                    user.setViews((user.getViews() == null ? 0 : user.getViews()) + 1);
                    userRepository.save(user);
                }
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body((User) null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            if (updatedUser.getBio() != null) user.setBio(updatedUser.getBio());
            if (updatedUser.getLocation() != null) user.setLocation(updatedUser.getLocation());
            if (updatedUser.getGithub() != null) user.setGithub(updatedUser.getGithub());
            if (updatedUser.getLinkedin() != null) user.setLinkedin(updatedUser.getLinkedin());
            if (updatedUser.getWebsite() != null) user.setWebsite(updatedUser.getWebsite());
            
            // Settings fields
            if (updatedUser.getLanguage() != null) user.setLanguage(updatedUser.getLanguage());
            user.setDarkMode(updatedUser.isDarkMode());
            user.setNotifMessages(updatedUser.isNotifMessages());
            user.setNotifApplications(updatedUser.isNotifApplications());
            user.setNotifMarketing(updatedUser.isNotifMarketing());
            
            // Password change (if provided)
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }
            
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body((User) null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok("{\"message\": \"Account deleted successfully\"}");
        }).orElse(ResponseEntity.notFound().build());
    }
}