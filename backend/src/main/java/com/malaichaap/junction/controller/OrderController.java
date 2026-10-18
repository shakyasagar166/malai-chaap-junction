package com.malaichaap.junction.controller;

import com.malaichaap.junction.dto.OrderItemRequestDto;
import com.malaichaap.junction.dto.OrderRequestDto;
import com.malaichaap.junction.model.CustomerOrder;
import com.malaichaap.junction.model.OrderItem;
import com.malaichaap.junction.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final Random random = new Random();
    private static final AtomicLong ORDER_COUNTER = new AtomicLong(System.currentTimeMillis() % 10000);

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    @Transactional
    public synchronized ResponseEntity<CustomerOrder> placeOrder(@RequestBody OrderRequestDto dto) {
        CustomerOrder order = new CustomerOrder();
        
        // High-concurrency collision-proof order number: MCJ-YYMMDD-HHMMSS-XXXX
        String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd-HHmmss"));
        long seq = ORDER_COUNTER.incrementAndGet() % 10000;
        int rand = 100 + random.nextInt(900);
        order.setOrderNumber("MCJ-" + timeStr + "-" + String.format("%03d", rand));

        order.setOrderType(dto.getOrderType() != null ? dto.getOrderType() : "DINE_IN");
        order.setTableNumber(dto.getTableNumber());
        order.setCustomerName(dto.getCustomerName() != null ? dto.getCustomerName() : "Guest");
        order.setCustomerPhone(dto.getCustomerPhone() != null ? dto.getCustomerPhone() : "");
        order.setNotes(dto.getNotes());
        order.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "UPI / Counter");
        order.setStatus("PENDING");

        double subtotal = 0.0;
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (OrderItemRequestDto itemDto : dto.getItems()) {
                OrderItem item = new OrderItem();
                item.setMenuItemId(itemDto.getMenuItemId());
                item.setItemName(itemDto.getItemName());
                item.setPortion(itemDto.getPortion() != null ? itemDto.getPortion() : "FULL");
                int qty = itemDto.getQuantity() != null && itemDto.getQuantity() > 0 ? itemDto.getQuantity() : 1;
                item.setQuantity(qty);
                double unitPrice = itemDto.getPricePerUnit() != null ? itemDto.getPricePerUnit() : 0.0;
                item.setPricePerUnit(unitPrice);
                double total = unitPrice * qty;
                item.setTotalPrice(total);
                item.setNotes(itemDto.getNotes());
                subtotal += total;

                order.addItem(item);
            }
        }

        order.setSubtotal(subtotal);
        double tax = Math.round(subtotal * 0.05 * 100.0) / 100.0; // 5% GST
        order.setTax(tax);
        order.setTotal(subtotal + tax);

        CustomerOrder saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<CustomerOrder>> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(orderRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase()));
        }
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<CustomerOrder> getOrderByNumber(@PathVariable String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/table/{tableNumber}")
    public ResponseEntity<List<CustomerOrder>> getOrdersByTable(@PathVariable Integer tableNumber) {
        return ResponseEntity.ok(orderRepository.findByTableNumberOrderByCreatedAtDesc(tableNumber));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CustomerOrder> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(newStatus.toUpperCase());
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Order #" + id + " deleted successfully"));
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<?> clearAllOrders() {
        orderRepository.deleteAll();
        return ResponseEntity.ok(Map.of("success", true, "message", "All customer orders cleared successfully"));
    }
}
