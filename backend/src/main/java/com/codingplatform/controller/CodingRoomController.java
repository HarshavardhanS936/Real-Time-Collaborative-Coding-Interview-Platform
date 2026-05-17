package com.codingplatform.controller;

import com.codingplatform.dto.request.CreateRoomRequest;
import com.codingplatform.dto.response.RoomResponse;
import com.codingplatform.service.CodingRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class CodingRoomController {

    private final CodingRoomService codingRoomService;

    @PostMapping("/create")
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(codingRoomService.createRoom(request, userDetails.getUsername()));
    }

    @GetMapping("/join/{roomId}")
    public ResponseEntity<RoomResponse> joinRoom(
            @PathVariable String roomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(codingRoomService.joinRoom(roomId, userDetails.getUsername()));
    }
}
