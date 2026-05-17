package com.codingplatform.service;

import com.codingplatform.dto.request.CodeExecutionRequest;
import com.codingplatform.dto.response.CodeExecutionResponse;

public interface CodeExecutionService {
    CodeExecutionResponse execute(CodeExecutionRequest request);
}
