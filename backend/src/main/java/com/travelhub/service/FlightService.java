package com.travelhub.service;

import com.travelhub.dto.FlightSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FlightService {

    @Autowired
    private AmadeusService amadeusService;

    public List<Map<String, Object>> searchFlights(FlightSearchRequest request) {
        // Essayer d'utiliser Amadeus
        List<Map<String, Object>> amadeusFlights = amadeusService.searchFlights(
                request.getOrigin(),
                request.getDestination(),
                request.getDepartureDate(),
                request.getPassengers()
        );

        // Si Amadeus retourne des résultats, les utiliser
        if (!amadeusFlights.isEmpty()) {
            return amadeusFlights;
        }

        // Sinon, fallback sur mock data
        return getMockFlights(request);
    }

    // Mock data en backup
    private List<Map<String, Object>> getMockFlights(FlightSearchRequest request) {
        List<Map<String, Object>> flights = new ArrayList<>();

        Map<String, Object> flight1 = new HashMap<>();
        flight1.put("id", "FL001");
        flight1.put("airline", "Air France");
        flight1.put("origin", request.getOrigin());
        flight1.put("destination", request.getDestination());
        flight1.put("departureTime", request.getDepartureDate() + "T08:00:00");
        flight1.put("arrivalTime", request.getDepartureDate() + "T12:00:00");
        flight1.put("duration", "4h 00min");
        flight1.put("price", 250.00);
        flight1.put("currency", "EUR");
        flight1.put("cabinClass", request.getCabinClass());
        flight1.put("stops", 0);
        flights.add(flight1);
        flight1.put("airlineLogo", getAirlineLogo("Air France"));


        return flights;
    }

    private String getAirlineLogo(String airline) {
        Map<String, String> logos = new HashMap<>();

        // Compagnies européennes
        logos.put("Air France", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/200px-Air_France_Logo.svg.png");
        logos.put("Lufthansa", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/200px-Lufthansa_Logo_2018.svg.png");
        logos.put("British Airways", "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/British_Airways_Logo.svg/200px-British_Airways_Logo.svg.png");
        logos.put("KLM", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/KLM_logo.svg/200px-KLM_logo.svg.png");
        logos.put("Ryanair", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ryanair_logo.svg/200px-Ryanair_logo.svg.png");
        logos.put("EasyJet", "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/EasyJet_logo.svg/200px-EasyJet_logo.svg.png");

        // Compagnies africaines
        logos.put("Tunisair", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tunisair_Logo.svg/200px-Tunisair_Logo.svg.png");
        logos.put("Royal Air Maroc", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Royal_Air_Maroc_Logo.svg/200px-Royal_Air_Maroc_Logo.svg.png");

        // Compagnies moyen-orientales
        logos.put("Emirates", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png");
        logos.put("Qatar Airways", "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Qatar_Airways_Logo.svg/200px-Qatar_Airways_Logo.svg.png");
        logos.put("Turkish Airlines", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/200px-Turkish_Airlines_logo_2019_compact.svg.png");

        // Logo par défaut
        return logos.getOrDefault(airline, "https://via.placeholder.com/200x50?text=" + airline);
    }

    public Map<String, Object> getFlightById(String id) {
        Map<String, Object> flight = new HashMap<>();
        flight.put("id", id);
        flight.put("airline", "Air France");
        flight.put("origin", "TUN");
        flight.put("destination", "CDG");
        flight.put("departureTime", "2026-03-15T08:00:00");
        flight.put("arrivalTime", "2026-03-15T12:00:00");
        flight.put("duration", "4h 00min");
        flight.put("price", 250.00);
        flight.put("currency", "EUR");
        return flight;
    }
}