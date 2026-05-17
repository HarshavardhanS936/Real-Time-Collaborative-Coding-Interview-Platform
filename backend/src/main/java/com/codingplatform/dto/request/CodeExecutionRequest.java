package com.codingplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodeExecutionRequest {
    @NotBlank(message = "Language is required")
    private String language;
    
    @NotBlank(message = "Code content is required")
    private String code;
}
