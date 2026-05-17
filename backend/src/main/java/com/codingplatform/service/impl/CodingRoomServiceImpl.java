package com.codingplatform.service.impl;

import com.codingplatform.dto.request.CreateRoomRequest;
import com.codingplatform.dto.response.RoomResponse;
import com.codingplatform.model.CodingRoom;
import com.codingplatform.repository.CodingRoomRepository;
import com.codingplatform.repository.UserRepository;
import com.codingplatform.service.CodingRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CodingRoomServiceImpl implements CodingRoomService {

    private final CodingRoomRepository codingRoomRepository;
    private final UserRepository userRepository;

    @Override
    public RoomResponse createRoom(CreateRoomRequest request, String ownerUsername) {
        // Note: ownerUsername here is actually the user's email due to UserDetails mapping
        var owner = userRepository.findByEmail(ownerUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uniqueRoomId = UUID.randomUUID().toString().substring(0, 8);

        var room = CodingRoom.builder()
                .roomId(uniqueRoomId)
                .owner(owner)
                .language(request.getLanguage())
                .codeContent("// Start coding here...")
                .createdAt(LocalDateTime.now())
                .build();

        codingRoomRepository.save(room);

        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .ownerUsername(owner.getUsername())
                .language(room.getLanguage())
                .codeContent(room.getCodeContent())
                .build();
    }

    @Override
    public RoomResponse joinRoom(String roomId, String username) {
        var room = codingRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        return RoomResponse.builder()
                .roomId(room.getRoomId())
                .ownerUsername(room.getOwner().getUsername())
                .language(room.getLanguage())
                .codeContent(room.getCodeContent())
                .build();
    }
}
