package com.malaichaap.junction.controller;

import com.malaichaap.junction.model.Category;
import com.malaichaap.junction.model.MenuItem;
import com.malaichaap.junction.repository.CategoryRepository;
import com.malaichaap.junction.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public MenuItemController(MenuItemRepository menuItemRepository, CategoryRepository categoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean special,
            @RequestParam(required = false) Boolean bestseller) {

        if (categoryId != null) {
            return ResponseEntity.ok(menuItemRepository.findByCategoryId(categoryId));
        }
        if (categorySlug != null && !categorySlug.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(menuItemRepository.findByCategorySlug(categorySlug));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(menuItemRepository.findByNameContainingIgnoreCase(search.trim()));
        }
        if (Boolean.TRUE.equals(special)) {
            return ResponseEntity.ok(menuItemRepository.findByIsChefSpecialTrue());
        }
        if (Boolean.TRUE.equals(bestseller)) {
            return ResponseEntity.ok(menuItemRepository.findByIsBestsellerTrue());
        }
        return ResponseEntity.ok(menuItemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItem menuItem) {
        if (menuItem.getName() == null || menuItem.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Dish name is required");
        }

        // Resolve Category
        Category category = null;
        if (menuItem.getCategory() != null) {
            if (menuItem.getCategory().getId() != null) {
                category = categoryRepository.findById(menuItem.getCategory().getId()).orElse(null);
            }
            if (category == null && menuItem.getCategory().getSlug() != null) {
                category = categoryRepository.findBySlug(menuItem.getCategory().getSlug()).orElse(null);
            }
        }

        // Fallback: If no category found, default to first category (Veg Tandoori)
        if (category == null) {
            category = categoryRepository.findAllByOrderByDisplayOrderAsc().stream().findFirst().orElse(null);
        }

        if (category == null) {
            return ResponseEntity.badRequest().body("No valid category found for this dish");
        }

        menuItem.setCategory(category);
        menuItem.setAvailable(true);
        menuItem.setVeg(true);

        MenuItem saved = menuItemRepository.save(menuItem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem updated) {
        return menuItemRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    if (updated.getCategory() != null) {
                        if (updated.getCategory().getId() != null) {
                            categoryRepository.findById(updated.getCategory().getId()).ifPresent(existing::setCategory);
                        } else if (updated.getCategory().getSlug() != null) {
                            categoryRepository.findBySlug(updated.getCategory().getSlug()).ifPresent(existing::setCategory);
                        }
                    }
                    existing.setDescription(updated.getDescription());
                    existing.setPriceHalf(updated.getPriceHalf());
                    existing.setPriceFull(updated.getPriceFull());
                    existing.setSinglePrice(updated.getSinglePrice());
                    existing.setHasSinglePrice(updated.isHasSinglePrice());
                    existing.setPortionUnit(updated.getPortionUnit());
                    existing.setVeg(updated.isVeg());
                    existing.setAvailable(updated.isAvailable());
                    existing.setChefSpecial(updated.isChefSpecial());
                    existing.setBestseller(updated.isBestseller());
                    existing.setSpiceLevel(updated.getSpiceLevel());
                    existing.setImageUrl(updated.getImageUrl());
                    return ResponseEntity.ok(menuItemRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-stock")
    public ResponseEntity<MenuItem> toggleStock(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(item -> {
                    item.setAvailable(!item.isAvailable());
                    return ResponseEntity.ok(menuItemRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/image")
    public ResponseEntity<MenuItem> updateDishImage(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        return menuItemRepository.findById(id)
                .map(item -> {
                    item.setImageUrl(imageUrl);
                    return ResponseEntity.ok(menuItemRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        if (menuItemRepository.existsById(id)) {
            menuItemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
