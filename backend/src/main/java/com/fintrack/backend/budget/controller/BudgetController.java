package com.fintrack.backend.budget.controller;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/budgets")

public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    @GetMapping("/wallet/{walletId}")
    public List<Budget> getByWallet(@PathVariable Long walletId) {
        return budgetRepository.findByWalletId(walletId);
    }

    @PostMapping
    public Budget createBudget(@RequestBody Budget budget) {
        if (budget.getSpent() == null) {
            budget.setSpent(0.0);
        }
        return budgetRepository.save(budget);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id, @RequestBody Budget updated) {
        Budget budget = budgetRepository.findById(id).orElseThrow();
        budget.setCategory(updated.getCategory());
        budget.setLimitAmount(updated.getLimitAmount());
        budget.setSpent(updated.getSpent());
        budget.setMonth(updated.getMonth());
        budget.setWalletId(updated.getWalletId());
        return budgetRepository.save(budget);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetRepository.deleteById(id);
    }
}
