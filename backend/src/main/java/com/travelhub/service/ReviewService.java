package com.travelhub.service;

import com.travelhub.model.Review;
import com.travelhub.model.User;
import com.travelhub.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserService userService;

    public List<Review> getReviewsByItem(String itemType, String itemId) {
        return reviewRepository.findByItemTypeAndItemId(itemType, itemId);
    }

    public Review createReview(Review review) {
        User currentUser = userService.getCurrentUser();

        // Validation
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("La note doit être entre 1 et 5");
        }

        review.setUserId(currentUser.getId());
        review.setHelpful(0);
        review.setNotHelpful(0);
        review.setStatus("approved"); // Auto-approuvé pour l'instant
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public Review updateReview(String id, Review updatedReview) {
        User currentUser = userService.getCurrentUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        // Vérifier que l'avis appartient à l'utilisateur
        if (!review.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Accès non autorisé");
        }

        review.setRating(updatedReview.getRating());
        review.setComment(updatedReview.getComment());
        review.setPhotos(updatedReview.getPhotos());
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        User currentUser = userService.getCurrentUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        // Vérifier que l'avis appartient à l'utilisateur
        if (!review.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Accès non autorisé");
        }

        reviewRepository.delete(review);
    }

    public Review voteReview(String id, boolean helpful) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        if (helpful) {
            review.setHelpful(review.getHelpful() + 1);
        } else {
            review.setNotHelpful(review.getNotHelpful() + 1);
        }

        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public List<Review> getUserReviews() {
        User currentUser = userService.getCurrentUser();
        return reviewRepository.findByUserId(currentUser.getId());
    }

    public Double getAverageRating(String itemType, String itemId) {
        List<Review> reviews = reviewRepository.findByItemTypeAndItemId(itemType, itemId);

        if (reviews.isEmpty()) {
            return 0.0;
        }

        double sum = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();

        return sum / reviews.size();
    }
}