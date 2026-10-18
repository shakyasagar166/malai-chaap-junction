package com.malaichaap.junction.repository;

import com.malaichaap.junction.model.RestaurantInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantInfoRepository extends JpaRepository<RestaurantInfo, Long> {
}
