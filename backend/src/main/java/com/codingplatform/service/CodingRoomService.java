package com.codingplatform.service;

import com.codingplatform.dto.request.CreateRoomRequest;
import com.codingplatform.dto.response.RoomResponse;

public interface CodingRoomService {
    RoomResponse createRoom(CreateRoomRequest request, String ownerUsername);
    RoomResponse joinRoom(String roomId, String username);
}
