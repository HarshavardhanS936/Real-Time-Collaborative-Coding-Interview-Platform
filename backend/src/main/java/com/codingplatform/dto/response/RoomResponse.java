package com.codingplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private String roomId;
    private String ownerUsername;
    private String language;
    private String codeContent;
}
