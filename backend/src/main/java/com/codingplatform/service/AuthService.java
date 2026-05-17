package com.codingplatform.service;

import com.codingplatform.dto.request.LoginRequest;
import com.codingplatform.dto.request.RegisterRequest;
import com.codingplatform.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
