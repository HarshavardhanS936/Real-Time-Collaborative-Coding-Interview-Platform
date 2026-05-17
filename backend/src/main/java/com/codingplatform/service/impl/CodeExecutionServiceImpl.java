package com.codingplatform.service.impl;

import com.codingplatform.dto.request.CodeExecutionRequest;
import com.codingplatform.dto.response.CodeExecutionResponse;
import com.codingplatform.service.CodeExecutionService;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionServiceImpl implements CodeExecutionService {

    @Override
    public CodeExecutionResponse execute(CodeExecutionRequest request) {
        String lang = request.getLanguage().toLowerCase();
        String code = request.getCode();
        
        List<String> command = new ArrayList<>();
        command.add("docker");
        command.add("run");
        command.add("--rm");
        command.add("-i");
        command.add("--net=none"); 
        command.add("--memory=128m"); 
        command.add("--cpus=0.5"); 
        
        if (lang.equals("javascript") || lang.equals("js")) {
            command.add("node:20-alpine");
            command.add("sh");
            command.add("-c");
            command.add("cat > index.js && node index.js");
        } else if (lang.equals("java")) {
            command.add("openjdk:21-slim");
            command.add("sh");
            command.add("-c");
            command.add("cat > Main.java && javac Main.java && java Main");
        } else {
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Unsupported execution language: " + lang)
                    .exitCode(-1)
                    .build();
        }

        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            Process process = pb.start();

            try (OutputStream os = process.getOutputStream()) {
                os.write(code.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            StringBuilder stdout = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    stdout.append(line).append("\n");
                }
            }

            StringBuilder stderr = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    stderr.append(line).append("\n");
                }
            }

            boolean finished = process.waitFor(10, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return CodeExecutionResponse.builder()
                        .stdout(stdout.toString())
                        .stderr(stderr.toString() + "\n[Execution Timeout after 10 seconds]")
                        .exitCode(124)
                        .build();
            }

            return CodeExecutionResponse.builder()
                    .stdout(stdout.toString().trim())
                    .stderr(stderr.toString().trim())
                    .exitCode(process.exitValue())
                    .build();

        } catch (IOException | InterruptedException e) {
            return CodeExecutionResponse.builder()
                    .stdout("")
                    .stderr("Executor internal error: " + e.getMessage())
                    .exitCode(-1)
                    .build();
        }
    }
}
