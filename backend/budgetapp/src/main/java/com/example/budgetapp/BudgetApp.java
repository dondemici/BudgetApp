package com.example.budgetapp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.budgetapp.model.TransactionRepository;

@SpringBootApplication
public class BudgetApp {

    public static void main(String[] args) {
        SpringApplication.run(BudgetApp.class, args);
    }

    @Bean
    public CommandLineRunner seedData(TransactionRepository transactionRepository) {
        return args -> {
            // Check if the database already has data
            if (transactionRepository.count() == 0) {
                System.out.println("Database is empty. No initial transactions added.");
            } else {
                System.out.println("Database already contains data. No seeding required.");
            }
        };
    }
}
