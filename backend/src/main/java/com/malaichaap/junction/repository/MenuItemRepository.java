package com.malaichaap.junction.repository;

import com.malaichaap.junction.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryId(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.category.slug = :categorySlug")
    List<MenuItem> findByCategorySlug(@Param("categorySlug") String categorySlug);

    List<MenuItem> findByCategory_Slug(String categorySlug);

    List<MenuItem> findByNameContainingIgnoreCase(String keyword);
    List<MenuItem> findByIsAvailableTrue();
    List<MenuItem> findByIsChefSpecialTrue();
    List<MenuItem> findByIsBestsellerTrue();
}

