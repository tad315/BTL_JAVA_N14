package myapp.controller;

import myapp.model.User;
import myapp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepo, BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        Optional<User> u = userRepo.findByEmail(email);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();

        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("phone", user.getPhone());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateProfile(@PathVariable String email, @RequestBody Map<String, String> body) {
        Optional<User> u = userRepo.findByEmail(email);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
        User user = u.get();
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userRepo.save(user);

        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password/{email}")
    public ResponseEntity<?> changePassword(@PathVariable String email, @RequestBody Map<String, String> body) {
        String current = body.get("currentPassword");
        String news = body.get("newPassword");
        Optional<User> u = userRepo.findByEmail(email);
        if (u.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.status(404).body(errorResponse);
        }

        User user = u.get();

        // Sử dụng Spring Security BCrypt
        if (user.getPassword() == null || !passwordEncoder.matches(current, user.getPassword())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Sai mật khẩu hiện tại");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String hashed = passwordEncoder.encode(news);
        user.setPassword(hashed);
        userRepo.save(user);

        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        userRepo.deleteByEmail(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}