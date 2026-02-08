package com.travelhub.controller;

import com.travelhub.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "http://localhost:3000")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @GetMapping("/supported")
    public ResponseEntity<?> getSupportedCurrencies() {
        return ResponseEntity.ok(currencyService.getSupportedCurrencies());
    }

    @GetMapping("/convert")
    public ResponseEntity<?> convertCurrency(
            @RequestParam double amount,
            @RequestParam String from,
            @RequestParam String to
    ) {
        Map<String, Object> result = currencyService.convertBookingPrice(amount, from, to);
        return ResponseEntity.ok(result);
    }
}