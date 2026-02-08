package com.travelhub.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CurrencyService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Taux de change fixes (backup si l'API ne marche pas)
    private final Map<String, Double> fallbackRates = Map.of(
            "EUR", 1.0,
            "USD", 1.08,
            "TND", 3.42,
            "GBP", 0.85,
            "MAD", 10.90
    );

    public double convert(double amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        try {
            // Essayer l'API réelle
            Map<String, Object> rates = getExchangeRates(fromCurrency);

            if (rates != null && rates.containsKey(toCurrency)) {
                double rate = ((Number) rates.get(toCurrency)).doubleValue();
                return amount * rate;
            }
        } catch (Exception e) {
            System.err.println("Exchange API Error: " + e.getMessage());
        }

        // Fallback sur taux fixes
        return convertWithFallback(amount, fromCurrency, toCurrency);
    }

    private Map<String, Object> getExchangeRates(String baseCurrency) {
        try {
            String url = "https://api.exchangerate-api.com/v4/latest/" + baseCurrency;
            Map response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.containsKey("rates")) {
                return (Map<String, Object>) response.get("rates");
            }
        } catch (Exception e) {
            System.err.println("Could not fetch live rates: " + e.getMessage());
        }
        return null;
    }

    private double convertWithFallback(double amount, String from, String to) {
        // Convertir via EUR comme base
        double amountInEur = amount / fallbackRates.getOrDefault(from, 1.0);
        return amountInEur * fallbackRates.getOrDefault(to, 1.0);
    }

    public Map<String, String> getSupportedCurrencies() {
        Map<String, String> currencies = new HashMap<>();
        currencies.put("EUR", "Euro");
        currencies.put("USD", "US Dollar");
        currencies.put("TND", "Tunisian Dinar");
        currencies.put("GBP", "British Pound");
        currencies.put("MAD", "Moroccan Dirham");
        return currencies;
    }

    public Map<String, Object> convertBookingPrice(double price, String fromCurrency, String toCurrency) {
        double convertedPrice = convert(price, fromCurrency, toCurrency);

        Map<String, Object> result = new HashMap<>();
        result.put("originalAmount", price);
        result.put("originalCurrency", fromCurrency);
        result.put("convertedAmount", Math.round(convertedPrice * 100.0) / 100.0);
        result.put("targetCurrency", toCurrency);
        result.put("exchangeRate", convertedPrice / price);

        return result;
    }
}