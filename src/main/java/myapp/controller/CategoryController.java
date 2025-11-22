package myapp.controller;

import myapp.model.Category;
import myapp.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Category> list() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Tên danh mục rỗng");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        Category c = new Category(name.trim());
        repo.save(c);
        Map<String, Boolean> successResponse = new HashMap<>();
        successResponse.put("success", true);
        return ResponseEntity.ok(successResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        Map<String, Boolean> successResponse = new HashMap<>();
        successResponse.put("success", true);
        return ResponseEntity.ok(successResponse);
    }
}