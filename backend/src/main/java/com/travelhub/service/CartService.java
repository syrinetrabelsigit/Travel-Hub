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

    public Cart getCart() {
        User currentUser = userService.getCurrentUser();

        return cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    // Créer un nouveau panier si n'existe pas
                    Cart newCart = new Cart();
                    newCart.setUserId(currentUser.getId());
                    newCart.setItems(new ArrayList<>());
                    newCart.setTotalPrice(0.0);
                    newCart.setCurrency("EUR");
                    newCart.setCreatedAt(LocalDateTime.now());
                    newCart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });
    }

    public Cart addItem(CartItem item) {
        Cart cart = getCart();

        item.setAddedAt(LocalDateTime.now());
        cart.getItems().add(item);

        // Recalculer le total
        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart updateItem(int itemIndex, CartItem updatedItem) {
        Cart cart = getCart();

        if (itemIndex < 0 || itemIndex >= cart.getItems().size()) {
            throw new RuntimeException("Item non trouvé");
        }

        cart.getItems().set(itemIndex, updatedItem);

        // Recalculer le total
        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart removeItem(int itemIndex) {
        Cart cart = getCart();

        if (itemIndex < 0 || itemIndex >= cart.getItems().size()) {
            throw new RuntimeException("Item non trouvé");
        }

        cart.getItems().remove(itemIndex);

        // Recalculer le total
        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public void clearCart() {
        Cart cart = getCart();
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private void calculateTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalPrice(total);
    }
}