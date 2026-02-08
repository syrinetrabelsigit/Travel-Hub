package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.model.Cart;
import com.travelhub.model.CartItem;
import com.travelhub.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            Cart cart = cartService.getCart();
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody CartItem item) {
        try {
            Cart cart = cartService.addItem(item);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/items/{index}")
    public ResponseEntity<?> updateItem(@PathVariable int index, @RequestBody CartItem item) {
        try {
            Cart cart = cartService.updateItem(index, item);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/items/{index}")
    public ResponseEntity<?> removeItem(@PathVariable int index) {
        try {
            Cart cart = cartService.removeItem(index);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart();
            return ResponseEntity.ok(new MessageResponse("Panier vidé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}