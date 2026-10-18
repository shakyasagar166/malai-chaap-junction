package com.malaichaap.junction.repository;

import com.malaichaap.junction.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByOrderNumber(String orderNumber);
    List<CustomerOrder> findByTableNumberOrderByCreatedAtDesc(Integer tableNumber);
    List<CustomerOrder> findByStatusOrderByCreatedAtDesc(String status);
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
    List<CustomerOrder> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}
