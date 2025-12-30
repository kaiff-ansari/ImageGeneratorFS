package com.img.generator.service;

import com.img.generator.models.ImageRequest;
import com.img.generator.models.ImageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private final WebClient webClient;

    @Value("${stability.api.key}")
    private String apiKey;

    @Value("${stability.api.url}")
    private String apiUrl;

    public ImageService() {

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();

        this.webClient = WebClient.builder()
                .exchangeStrategies(strategies)
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    public ImageResponse generateImage(ImageRequest request) {
        try {
            // Build request body
            Map<String, Object> requestBody = Map.of(
                    "text_prompts", List.of(
                            Map.of("text", request.getPrompt(), "weight", 1.0)
                    ),
                    "cfg_scale", request.getCfgScale() != null ? request.getCfgScale() : 7,
                    "height", request.getHeight() != null ? request.getHeight() : 1024,
                    "width", request.getWidth() != null ? request.getWidth() : 1024,
                    "samples", 1,
                    "steps", request.getSteps() != null ? request.getSteps() : 30
            );

            System.out.println(" Generating image for: " + request.getPrompt());

            // Make API call
            Map<String, Object> response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

            // Extract image from response
            if (response != null && response.containsKey("artifacts")) {
                List<Map<String, Object>> artifacts = (List<Map<String, Object>>) response.get("artifacts");
                if (!artifacts.isEmpty()) {
                    String base64Image = (String) artifacts.get(0).get("base64");

                    System.out.println(" Image generated successfully!");

                    ImageResponse imageResponse = new ImageResponse();
                    imageResponse.setImageBase64("data:image/png;base64," + base64Image);
                    imageResponse.setPrompt(request.getPrompt());
                    imageResponse.setStatus("success");
                    return imageResponse;
                }
            }

            throw new RuntimeException("No image generated");

        } catch (Exception e) {
            System.err.println(" Error: " + e.getMessage());
            e.printStackTrace();

            ImageResponse errorResponse = new ImageResponse();
            errorResponse.setStatus("error");
            errorResponse.setMessage("Failed: " + e.getMessage());
            return errorResponse;
        }
    }
}