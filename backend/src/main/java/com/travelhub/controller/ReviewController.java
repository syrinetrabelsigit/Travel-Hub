package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.model.Review;
import com.travelhub.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{itemType}/{itemId}")
    public ResponseEntity<?> getReviewsByItem(@PathVariable String itemType, @PathVariable String itemId) {
        try {
            List<Review> reviews = reviewService.getReviewsByItem(itemType, itemId);
            Double averageRating = reviewService.getAverageRating(itemType, itemId);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("averageRating", averageRating);
            response.put("totalReviews", reviews.size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<?> getUserReviews() {
        try {
            List<Review> reviews = reviewService.getUserReviews();
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        try {
            Review created = reviewService.createReview(review);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody Review review) {
        try {
            Review updated = reviewService.updateReview(id, review);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok(new MessageResponse("Avis supprimé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<?> voteReview(@PathVariable String id, @RequestBody Map<String, Boolean> vote) {
        try {
            boolean helpful = vote.getOrDefault("helpful", true);
            Review updated = reviewService.voteReview(id, helpful);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}