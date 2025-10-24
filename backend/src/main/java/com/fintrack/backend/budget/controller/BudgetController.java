package com.fintrack.backend.budget.controller;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping("/create")
    public Budget createBudget(@RequestBody Budget budget) {
        return budgetService.createBudget(budget);
    }

    @GetMapping("/{userId}")
    public List<Budget> getBudgetsByUser(@PathVariable Long userId) {
        return budgetService.getBudgetsByUser(userId);
    }

    @PutMapping("/{budgetId}/add-spent")
    public Budget addSpent(@PathVariable Long budgetId, @RequestParam Double delta) {
        return budgetService.updateSpent(budgetId, delta);
    }

    @GetMapping("/{userId}/exceeded")
    public List<Budget> getExceeded(@PathVariable Long userId) {
        return budgetService.getExceededBudgets(userId);
    }
}
