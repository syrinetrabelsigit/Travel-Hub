package com.travelhub.service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;
import com.amadeus.resources.HotelOfferSearch;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AmadeusService {

    @Value("${amadeus.api.key}")
    private String apiKey;

    @Value("${amadeus.api.secret}")
    private String apiSecret;

    private Amadeus amadeus;

    private void initAmadeus() {
        if (amadeus == null) {
            amadeus = Amadeus.builder(apiKey, apiSecret).build();
        }
    }

    // VOLS ✅
    public List<Map<String, Object>> searchFlights(String origin, String destination, String departureDate, int adults) {
        initAmadeus();
        List<Map<String, Object>> flights = new ArrayList<>();

        try {
            FlightOfferSearch[] flightOffers = amadeus.shopping.flightOffersSearch.get(
                    Params.with("originLocationCode", origin)
                            .and("destinationLocationCode", destination)
                            .and("departureDate", departureDate)
                            .and("adults", adults)
                            .and("max", 10)
            );

            for (FlightOfferSearch offer : flightOffers) {
                Map<String, Object> flight = new HashMap<>();
                flight.put("id", offer.getId());
                flight.put("price", offer.getPrice().getTotal());
                flight.put("currency", offer.getPrice().getCurrency());

                if (offer.getItineraries() != null && offer.getItineraries().length > 0) {
                    var itinerary = offer.getItineraries()[0];
                    if (itinerary.getSegments() != null && itinerary.getSegments().length > 0) {
                        var segment = itinerary.getSegments()[0];
                        flight.put("departureTime", segment.getDeparture().getAt());
                        flight.put("arrivalTime", segment.getArrival().getAt());
                        flight.put("origin", segment.getDeparture().getIataCode());
                        flight.put("destination", segment.getArrival().getIataCode());
                        flight.put("duration", itinerary.getDuration());
                        if (segment.getCarrierCode() != null) {
                            flight.put("airline", segment.getCarrierCode());
                        }
                        flight.put("stops", itinerary.getSegments().length - 1);
                    }
                }
                flights.add(flight);
            }
        } catch (ResponseException e) {
            System.err.println("Amadeus Flights Error: " + e.getMessage());
        }
        return flights;
    }

    // HÔTELS - VRAIE API ✨
    public List<Map<String, Object>> searchHotels(String cityCode, String checkInDate, String checkOutDate, int adults) {
        initAmadeus();
        List<Map<String, Object>> hotels = new ArrayList<>();

        try {
            HotelOfferSearch[] hotelOffers = amadeus.shopping.hotelOffersSearch.get(
                    Params.with("cityCode", cityCode)
                            .and("checkInDate", checkInDate)
                            .and("checkOutDate", checkOutDate)
                            .and("adults", adults)
                            .and("roomQuantity", 1)
                            .and("bestRateOnly", true)
            );

            for (HotelOfferSearch hotelOffer : hotelOffers) {
                Map<String, Object> hotel = new HashMap<>();

                // Informations de base
                hotel.put("id", hotelOffer.getHotel().getHotelId());
                hotel.put("name", hotelOffer.getHotel().getName());
                hotel.put("hotelId", hotelOffer.getHotel().getHotelId());

                // Prix (première offre)
                if (hotelOffer.getOffers() != null && hotelOffer.getOffers().length > 0) {
                    var offer = hotelOffer.getOffers()[0];
                    hotel.put("price", offer.getPrice().getTotal());
                    hotel.put("currency", offer.getPrice().getCurrency());
                    hotel.put("pricePerNight", offer.getPrice().getTotal());
                }

                // Localisation
                hotel.put("cityCode", cityCode);

                // Note (simulée car pas dans toutes les réponses)
                hotel.put("rating", 3.5 + (Math.random() * 1.5)); // 3.5-5.0
                hotel.put("stars", 3 + (int)(Math.random() * 3)); // 3-5

                hotels.add(hotel);
            }

        } catch (ResponseException e) {
            System.err.println("Amadeus Hotels Error: " + e.getMessage());
            e.printStackTrace();
        }

        return hotels;
    }
}