package com.example.security.user.Event;

import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByUserId(Integer userId) {
        return eventRepository.findByUserId(userId);
    }

    public Optional<Event> getEventByIdAndUserId(Integer eventId, Integer userId) {
        return Optional.ofNullable(eventRepository.findByIdAndUserId(eventId, userId));
    }

    public Event createEvent(Integer userId, Event event) {
        User user = new User();
        user.setId(userId);
        event.setUser(user);
        return eventRepository.save(event);
    }

    public Optional<Event> updateEvent(Integer userId, Integer eventId, Event eventDetails) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId);
        if (event == null) return Optional.empty();
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setTime(eventDetails.getTime());
        event.setEventDateTime(eventDetails.getEventDateTime());
        return Optional.of(eventRepository.save(event));
    }

    public boolean deleteEvent(Integer userId, Integer eventId) {
        Event event = eventRepository.findByIdAndUserId(eventId, userId);
        if (event == null) return false;
        eventRepository.delete(event);
        return true;
    }
}
