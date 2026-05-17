package com.codingplatform.controller;

import com.codingplatform.dto.request.CodeExecutionRequest;
import com.codingplatform.dto.response.CodeExecutionResponse;
import com.codingplatform.service.CodeExecutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/compiler")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@Valid @RequestBody CodeExecutionRequest request) {
        return ResponseEntity.ok(codeExecutionService.execute(request));
    }
}
