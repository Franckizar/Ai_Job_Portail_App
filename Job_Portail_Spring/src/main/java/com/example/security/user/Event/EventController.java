package com.example.security.user.Event;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    // Get all events (admin/global)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Get all events for a user
    @GetMapping("/user/{userId}")
    public List<Event> getUserEvents(@PathVariable Integer userId) {
        return eventService.getEventsByUserId(userId);
    }

    // Get a single event for a user
    @GetMapping("/user/{userId}/{eventId}")
    public ResponseEntity<Event> getEvent(@PathVariable Integer userId, @PathVariable Integer eventId) {
        return eventService.getEventByIdAndUserId(eventId, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create an event for a user
    @PostMapping("/user/{userId}")
    public Event createEvent(@PathVariable Integer userId, @RequestBody Event event) {
        return eventService.createEvent(userId, event);
    }

    // Update an event for a user
    @PutMapping("/user/{userId}/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Integer userId,
            @PathVariable Integer eventId,
            @RequestBody Event eventDetails) {
        return eventService.updateEvent(userId, eventId, eventDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete an event for a user
    @DeleteMapping("/user/{userId}/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer userId, @PathVariable Integer eventId) {
        boolean deleted = eventService.deleteEvent(userId, eventId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
