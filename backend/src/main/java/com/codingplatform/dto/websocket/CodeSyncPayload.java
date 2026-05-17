package com.codingplatform.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSyncPayload {
    private String roomId;
    private String codeContent;
    private String username;
}
