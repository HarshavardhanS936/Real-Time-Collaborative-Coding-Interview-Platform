package com.codingplatform.controller;

import com.codingplatform.dto.websocket.CodeSyncPayload;
import com.codingplatform.dto.websocket.UserJoinPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class CollaborationController {

    @MessageMapping("/room/{roomId}/join")
    @SendTo("/topic/room/{roomId}/users")
    public UserJoinPayload userJoined(@DestinationVariable String roomId, @Payload UserJoinPayload payload) {
        // Broadcasts that a new user joined the room
        return payload;
    }

    @MessageMapping("/room/{roomId}/sync")
    @SendTo("/topic/room/{roomId}/code")
    public CodeSyncPayload syncCode(@DestinationVariable String roomId, @Payload CodeSyncPayload payload) {
        // Broadcasts the live code text sync to all connected clients
        return payload;
    }
}
