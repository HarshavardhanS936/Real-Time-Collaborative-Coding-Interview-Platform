package com.codingplatform.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinPayload {
    private String roomId;
    private String username;
    private String type; // JOIN or LEAVE
}
