package com.malaichaap.junction.controller;

import com.malaichaap.junction.dto.AdminLoginDto;
import com.malaichaap.junction.model.CustomerOrder;
import com.malaichaap.junction.repository.MenuItemRepository;
import com.malaichaap.junction.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public AdminController(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AdminLoginDto dto) {
        Map<String, Object> response = new HashMap<>();
        String pin = dto.getPin() != null ? dto.getPin().trim() : "";
        String username = dto.getUsername() != null ? dto.getUsername().trim() : "";
        String password = dto.getPassword() != null ? dto.getPassword().trim() : "";
        
        // 1. PIN Login: 1234 or 9911
        boolean isPinValid = "1234".equals(pin) || "9911".equals(pin);

        // 2. Username & Password Login: admin / malai@2026 or admin / admin123
        boolean isUserPassValid = "admin".equalsIgnoreCase(username) && 
                ("malai@2026".equals(password) || "admin123".equals(password) || "admin".equals(password));

        if (isPinValid || isUserPassValid) {
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("username", "admin");
            response.put("token", "mcj-admin-session-token-2026");
            response.put("message", "Welcome Admin to Svad Malai Chaap Junction Portal");
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Galat username/password ya PIN. Kripya sahi credentials enter karein.");
        return ResponseEntity.status(401).body(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        List<CustomerOrder> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<CustomerOrder> todayOrders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startOfDay, endOfDay);

        double totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(CustomerOrder::getTotal)
                .sum();

        double todayRevenue = todayOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(CustomerOrder::getTotal)
                .sum();

        long pendingCount = allOrders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()) || "PREPARING".equals(o.getStatus()))
                .count();

        long totalMenuItems = menuItemRepository.count();

        stats.put("totalOrdersCount", allOrders.size());
        stats.put("todayOrdersCount", todayOrders.size());
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        stats.put("todayRevenue", Math.round(todayRevenue * 100.0) / 100.0);
        stats.put("activeOrdersCount", pendingCount);
        stats.put("totalMenuItems", totalMenuItems);

        return ResponseEntity.ok(stats);
    }
}
