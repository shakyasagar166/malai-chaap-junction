package com.malaichaap.junction.controller;

import com.malaichaap.junction.model.RestaurantInfo;
import com.malaichaap.junction.repository.RestaurantInfoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant-info")
public class RestaurantInfoController {

    private final RestaurantInfoRepository repository;

    public RestaurantInfoController(RestaurantInfoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<RestaurantInfo> getInfo() {
        return ResponseEntity.ok(
                repository.findAll().stream().findFirst().orElseGet(() -> {
                    RestaurantInfo info = new RestaurantInfo();
                    return repository.save(info);
                })
        );
    }

    @PutMapping
    public ResponseEntity<RestaurantInfo> updateInfo(@RequestBody RestaurantInfo updated) {
        RestaurantInfo existing = repository.findAll().stream().findFirst().orElseGet(RestaurantInfo::new);
        existing.setName(updated.getName());
        existing.setTagline(updated.getTagline());
        existing.setAddress(updated.getAddress());
        existing.setPhonePrimary(updated.getPhonePrimary());
        existing.setPhoneSecondary(updated.getPhoneSecondary());
        existing.setWhatsappNumber(updated.getWhatsappNumber());
        existing.setOpeningHours(updated.getOpeningHours());
        existing.setPureVeg(updated.isPureVeg());
        existing.setGstRate(updated.getGstRate());
        return ResponseEntity.ok(repository.save(existing));
    }
}
