package com.travelhub.service;

import com.travelhub.model.Cart;
import com.travelhub.model.CartItem;
import com.travelhub.model.User;
import com.travelhub.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    /**
     * Récupérer le panier de l'utilisateur connecté
     */
    public Cart getCart() {
        User currentUser = userService.getCurrentUser();

        return cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    // Créer un nouveau panier vide
                    Cart cart = new Cart();
                    cart.setUserId(currentUser.getId());
                    cart.setItems(new ArrayList<>());
                    cart.setTotalPrice(0.0);
                    cart.setCurrency("EUR");
                    cart.setCreatedAt(LocalDateTime.now());
                    cart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(cart);
                });
    }

    /**
     * Ajouter un article au panier
     */
    public Cart addItem(CartItem item) {
        Cart cart = getCart();

        // ✅ Validation
        if (item.getPrice() == null || item.getPrice() <= 0) {
            throw new RuntimeException("Le prix est requis et doit être supérieur à 0");
        }

        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            item.setQuantity(1); // ✅ Valeur par défaut
        }

        if (item.getAddedAt() == null) {
            item.setAddedAt(LocalDateTime.now()); // ✅ Date automatique
        }

        cart.getItems().add(item);
        updateTotalPrice(cart);
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    /**
     * Mettre à jour un article du panier
     */
    public Cart updateItem(int index, CartItem updatedItem) {
        Cart cart = getCart();

        if (index < 0 || index >= cart.getItems().size()) {
            throw new RuntimeException("Article non trouvé dans le panier");
        }

        cart.getItems().set(index, updatedItem);
        updateTotalPrice(cart);
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    /**
     * Supprimer un article du panier
     */
    public Cart removeItem(int index) {
        Cart cart = getCart();

        if (index < 0 || index >= cart.getItems().size()) {
            throw new RuntimeException("Article non trouvé dans le panier");
        }

        cart.getItems().remove(index);
        updateTotalPrice(cart);
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    /**
     * Vider le panier
     */
    public Cart clearCart() {
        Cart cart = getCart();

        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    /**
     * Calculer le prix total du panier
     */
    private void updateTotalPrice(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> {
                    Double price = item.getPrice() != null ? item.getPrice() : 0.0;
                    Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;
                    return price * quantity;
                })
                .sum();
        cart.setTotalPrice(total);
    }
}