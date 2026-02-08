package com.travelhub.service;

import com.travelhub.model.User;
import com.travelhub.model.UserPreferences;
import com.travelhub.model.FrequentTraveler;
import com.travelhub.repository.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private UserService userService;

    public UserPreferences getPreferences() {
        User currentUser = userService.getCurrentUser();

        return userPreferencesRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    // Créer des préférences par défaut
                    UserPreferences prefs = new UserPreferences();
                    prefs.setUserId(currentUser.getId());
                    prefs.setTravelClass("economy");
                    prefs.setPreferredAirlines(new ArrayList<>());
                    prefs.setHotelStars(new ArrayList<>());
                    prefs.setFrequentTravelers(new ArrayList<>());
                    prefs.setEmailNotifications(true);
                    prefs.setPriceAlerts(true);
                    return userPreferencesRepository.save(prefs);
                });
    }

    public UserPreferences updatePreferences(UserPreferences updatedPrefs) {
        User currentUser = userService.getCurrentUser();

        UserPreferences prefs = userPreferencesRepository.findByUserId(currentUser.getId())
                .orElse(new UserPreferences());

        prefs.setUserId(currentUser.getId());
        prefs.setTravelClass(updatedPrefs.getTravelClass());
        prefs.setPreferredAirlines(updatedPrefs.getPreferredAirlines());
        prefs.setBudgetMin(updatedPrefs.getBudgetMin());
        prefs.setBudgetMax(updatedPrefs.getBudgetMax());
        prefs.setHotelStars(updatedPrefs.getHotelStars());
        prefs.setEmailNotifications(updatedPrefs.getEmailNotifications());
        prefs.setPriceAlerts(updatedPrefs.getPriceAlerts());

        return userPreferencesRepository.save(prefs);
    }

    public UserPreferences addFrequentTraveler(FrequentTraveler traveler) {
        UserPreferences prefs = getPreferences();

        if (prefs.getFrequentTravelers() == null) {
            prefs.setFrequentTravelers(new ArrayList<>());
        }

        prefs.getFrequentTravelers().add(traveler);
        return userPreferencesRepository.save(prefs);
    }

    public UserPreferences removeFrequentTraveler(int index) {
        UserPreferences prefs = getPreferences();

        if (index < 0 || index >= prefs.getFrequentTravelers().size()) {
            throw new RuntimeException("Voyageur non trouvé");
        }

        prefs.getFrequentTravelers().remove(index);
        return userPreferencesRepository.save(prefs);
    }
}