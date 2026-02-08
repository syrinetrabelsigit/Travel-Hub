package com.travelhub.controller;

import com.travelhub.dto.ActivitySearchRequest;
import com.travelhub.dto.FlightSearchRequest;
import com.travelhub.dto.HotelSearchRequest;
import com.travelhub.dto.MessageResponse;
import com.travelhub.service.ActivityService;
import com.travelhub.service.FlightService;
import com.travelhub.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {

    @Autowired
    private FlightService flightService;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private ActivityService activityService;

    @PostMapping("/flights")
    public ResponseEntity<?> searchFlights(@RequestBody FlightSearchRequest request) {
        try {
            List<Map<String, Object>> flights = flightService.searchFlights(request);
            return ResponseEntity.ok(flights);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/flight/{id}")
    public ResponseEntity<?> getFlightById(@PathVariable String id) {
        try {
            Map<String, Object> flight = flightService.getFlightById(id);
            return ResponseEntity.ok(flight);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/hotels")
    public ResponseEntity<?> searchHotels(@RequestBody HotelSearchRequest request) {
        try {
            List<Map<String, Object>> hotels = hotelService.searchHotels(request);
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/hotel/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable String id) {
        try {
            Map<String, Object> hotel = hotelService.getHotelById(id);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/activities")
    public ResponseEntity<?> searchActivities(@RequestBody ActivitySearchRequest request) {
        try {
            List<Map<String, Object>> activities = activityService.searchActivities(request);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/activity/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable String id) {
        try {
            Map<String, Object> activity = activityService.getActivityById(id);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}