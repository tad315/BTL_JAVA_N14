package myapp.service;

import myapp.model.Category;
import myapp.model.User;
import myapp.repository.CategoryRepository;
import myapp.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class InitDataLoader {
    private static final Logger logger = LoggerFactory.getLogger(InitDataLoader.class);

    private final UserRepository userRepo;
    private final CategoryRepository catRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public InitDataLoader(UserRepository userRepo, CategoryRepository catRepo, BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.catRepo = catRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void load() {
        try {
            if (userRepo.count() == 0) {
                String hashed = passwordEncoder.encode("password");
                User user = new User("User", "user@example.com", "0123456789", hashed);
                userRepo.save(user);
                logger.info("Created sample user: user@example.com");
            }

            // Kiểm tra và tạo categories mẫu
            if (catRepo.count() == 0) {
                String[] categories = {
                        "Ăn uống", "Sinh hoạt", "Đi lại",
                        "Giải trí", "Giáo dục", "Y tế"
                };

                for (String categoryName : categories) {
                    Category category = new Category(categoryName);
                    catRepo.save(category);
                }
                logger.info("Created {} sample categories", categories.length);
            }

            logger.info("Database initialization completed successfully");

        } catch (Exception e) {
            logger.error("Error during database initialization: {}", e.getMessage());
        }
    }
}