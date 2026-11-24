package com.gardenadvisor.service;

import com.gardenadvisor.dto.FertilizerRecommendationDto;
import com.gardenadvisor.dto.RecommendationRequest;
import com.gardenadvisor.dto.RecommendationResponse;
import com.gardenadvisor.model.Crop;
import com.gardenadvisor.model.Fertilizer;
import com.gardenadvisor.model.User;
import com.gardenadvisor.model.UserCropHistory;
import com.gardenadvisor.repository.CropRepository;
import com.gardenadvisor.repository.FertilizerRepository;
import com.gardenadvisor.repository.UserCropHistoryRepository;
import com.gardenadvisor.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FertilizerRepository fertilizerRepository;

    @Autowired
    private UserCropHistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public RecommendationResponse getRecommendation(RecommendationRequest request, String userEmail) {

        // Try to find the crop in DB
        Optional<Crop> cropOpt = cropRepository.findByNameIgnoreCase(request.getCropName());

        // Get fertilizers for this crop
        List<Fertilizer> fertilizers = fertilizerRepository.findByCropName(request.getCropName());

        // If no specific fertilizers found, use general ones
        if (fertilizers.isEmpty()) {
            fertilizers = fertilizerRepository.findAll();
        }

        // Build fertilizer recommendations
        List<FertilizerRecommendationDto> fertRecommendations = buildFertilizerRecommendations(fertilizers, request);

        // Build full response
        RecommendationResponse response = buildResponse(request, cropOpt.orElse(null), fertRecommendations);

        // Save history
        saveHistory(request, response, userEmail);

        return response;
    }

    private List<FertilizerRecommendationDto> buildFertilizerRecommendations(
            List<Fertilizer> fertilizers, RecommendationRequest request) {

        List<FertilizerRecommendationDto> recommendations = new ArrayList<>();

        // Prioritize fertilizers based on space type and crop category
        for (Fertilizer f : fertilizers) {
            String priority = determinePriority(f, request);
            String purpose = determinePurpose(f);

            recommendations.add(FertilizerRecommendationDto.builder()
                    .fertilizerName(f.getName())
                    .type(f.getType())
                    .dosage(adjustDosageForSpaceType(f.getDosageInstruction(), request.getSpaceType()))
                    .timing(f.getTiming())
                    .purpose(purpose)
                    .priority(priority)
                    .nitrogenPct(f.getNitrogenPct())
                    .phosphorusPct(f.getPhosphorusPct())
                    .potassiumPct(f.getPotassiumPct())
                    .build());
        }

        // Sort: PRIMARY first, then SECONDARY
        recommendations.sort(Comparator.comparing(r -> {
            switch (r.getPriority()) {
                case "PRIMARY": return 0;
                case "SECONDARY": return 1;
                default: return 2;
            }
        }));

        // Limit to top 5
        return recommendations.stream().limit(5).collect(Collectors.toList());
    }

    private String determinePriority(Fertilizer f, RecommendationRequest request) {
        String spaceType = request.getSpaceType().toUpperCase();

        // For organic options in pots/indoors → organic fertilizers are primary
        if ((spaceType.equals("POTS") || spaceType.equals("INDOORS")) &&
                f.getType() != null && f.getType().toLowerCase().contains("organic")) {
            return "PRIMARY";
        }

        // NPK balanced → always primary for beginners
        if (f.getName().contains("NPK")) {
            return "PRIMARY";
        }

        // Urea/DAP for garden beds → primary
        if ((spaceType.equals("GARDEN_BED") || spaceType.equals("RAISED_BED")) &&
                (f.getName().contains("Urea") || f.getName().contains("DAP"))) {
            return "PRIMARY";
        }

        // Vermicompost is always secondary (supplementary)
        if (f.getName().toLowerCase().contains("vermicompost") || f.getName().toLowerCase().contains("compost")) {
            return "SECONDARY";
        }

        return "OPTIONAL";
    }

    private String determinePurpose(Fertilizer f) {
        if (f.getNitrogenPct() != null && f.getNitrogenPct() > 20) {
            return "Promotes leafy growth & green color";
        }
        if (f.getPhosphorusPct() != null && f.getPhosphorusPct() > 20) {
            return "Strengthens roots & promotes flowering";
        }
        if (f.getPotassiumPct() != null && f.getPotassiumPct() > 20) {
            return "Improves fruit quality & plant immunity";
        }
        if (f.getType() != null && f.getType().toLowerCase().contains("organic")) {
            return "Improves soil health & provides balanced nutrition";
        }
        return "Provides essential nutrients for overall plant health";
    }

    private String adjustDosageForSpaceType(String originalDosage, String spaceType) {
        if (originalDosage == null) return "Follow package instructions";

        switch (spaceType.toUpperCase()) {
            case "POTS":
                return "For pots: 1/4 of field dose. Mix into top 2 inches of soil or dissolve in water.";
            case "INDOORS":
                return "For indoor plants: Use very diluted liquid form. 1/8th of outdoor dose every 3 weeks.";
            case "RAISED_BED":
                return "For raised beds: Use 1/2 of field dose. Mix evenly into top 4 inches of growing medium.";
            case "GARDEN_BED":
                return originalDosage;
            default:
                return originalDosage;
        }
    }

    private RecommendationResponse buildResponse(RecommendationRequest request, Crop crop,
                                                   List<FertilizerRecommendationDto> fertilizers) {
        String cropName = request.getCropName();
        String spaceType = request.getSpaceType();

        String wateringSchedule = getWateringSchedule(spaceType, crop);
        String sunlight = crop != null ? crop.getSunlightRequirement() : "Full Sun (6-8 hours daily)";
        String soilPrep = getSoilPreparation(spaceType, request.getSoilType());
        String harvestTime = crop != null ? crop.getDaysToHarvest() + " days approximately" : "Varies by variety";

        List<String> commonMistakes = getCommonMistakes(cropName, spaceType);
        List<String> careTips = getCareTips(cropName, spaceType, crop);

        return RecommendationResponse.builder()
                .cropName(cropName)
                .spaceType(spaceType)
                .generalTips("Growing " + cropName + " in " + formatSpaceType(spaceType) +
                        " is " + (crop != null ? crop.getDifficultyLevel() : "manageable") +
                        " level. " + (crop != null ? crop.getDescription() : "Follow care instructions for best results."))
                .wateringSchedule(wateringSchedule)
                .sunlightNeeds(sunlight)
                .soilPreparation(soilPrep)
                .fertilizers(fertilizers)
                .commonMistakes(commonMistakes)
                .careTips(careTips)
                .harvestTime(harvestTime)
                .build();
    }

    private String getWateringSchedule(String spaceType, Crop crop) {
        String baseSchedule = crop != null ? crop.getWaterRequirement() : "Regular";
        switch (spaceType.toUpperCase()) {
            case "POTS":
                return "Check daily — pots dry out faster. Water when top 1 inch of soil feels dry. " + baseSchedule + ".";
            case "INDOORS":
                return "Water every 3-4 days. Ensure drainage holes are clear. Mist leaves in dry weather.";
            case "RAISED_BED":
                return "Water every 1-2 days. Raised beds drain well — check moisture regularly. " + baseSchedule + ".";
            case "GARDEN_BED":
                return "Water at base of plants 2-3 times per week. Adjust based on rainfall. " + baseSchedule + ".";
            default:
                return "Water regularly based on weather conditions.";
        }
    }

    private String getSoilPreparation(String spaceType, String soilType) {
        switch (spaceType.toUpperCase()) {
            case "POTS":
                return "Use 60% potting mix + 20% vermicompost + 20% cocopeat. Ensure drainage holes are not blocked.";
            case "INDOORS":
                return "Use premium potting mix with perlite for drainage. Avoid garden soil in pots — it compacts and blocks drainage.";
            case "RAISED_BED":
                return "Fill with 50% topsoil + 30% compost + 20% cocopeat or perlite for drainage. pH target: 6.0-7.0.";
            case "GARDEN_BED":
                return (soilType != null && !soilType.isEmpty())
                        ? "Your " + soilType + " soil: dig 12 inches deep, mix in compost (2-3 kg per sq meter), check pH (ideal 6.0-7.0)."
                        : "Loosen soil 12 inches deep. Add 2-3 kg compost per sq meter. Ensure good drainage.";
            default:
                return "Prepare well-draining, nutrient-rich soil. Add compost before planting.";
        }
    }

    private String formatSpaceType(String spaceType) {
        switch (spaceType.toUpperCase()) {
            case "POTS": return "Pots / Containers";
            case "INDOORS": return "Indoors";
            case "RAISED_BED": return "Raised Bed / Grow Bag";
            case "GARDEN_BED": return "Garden Bed";
            default: return spaceType;
        }
    }

    private List<String> getCommonMistakes(String cropName, String spaceType) {
        List<String> mistakes = new ArrayList<>(Arrays.asList(
                "Overwatering — the #1 killer. Always check soil moisture before watering",
                "Using garden soil in pots — it compacts and kills roots",
                "Too much fertilizer at once — causes salt burn on roots",
                "Ignoring drainage — waterlogging causes root rot"
        ));

        if (spaceType.equalsIgnoreCase("INDOORS")) {
            mistakes.add("Placing in low-light corners — most crops need 4-6 hrs of light minimum");
        }

        if (cropName.toLowerCase().contains("tomato") || cropName.toLowerCase().contains("chilli")) {
            mistakes.add("Not staking plants when they grow tall — leads to stem breakage");
        }

        return mistakes;
    }

    private List<String> getCareTips(String cropName, String spaceType, Crop crop) {
        List<String> tips = new ArrayList<>(Arrays.asList(
                "Start with quality seeds or seedlings from a trusted nursery",
                "Monitor for pests weekly — early detection saves the plant",
                "Remove yellowing leaves promptly to prevent disease spread",
                "Label your pots/beds with planting date to track progress"
        ));

        if (crop != null && crop.getGrowingSeason() != null) {
            tips.add("Best planting season: " + crop.getGrowingSeason());
        }

        if (spaceType.equalsIgnoreCase("POTS")) {
            tips.add("Upgrade pot size as plant grows — root-bound plants stop producing");
        }

        return tips;
    }

    private void saveHistory(RecommendationRequest request, RecommendationResponse response, String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) return;

            String responseJson = objectMapper.writeValueAsString(response);

            UserCropHistory history = UserCropHistory.builder()
                    .user(user)
                    .cropName(request.getCropName())
                    .spaceType(request.getSpaceType())
                    .location(request.getLocation())
                    .soilType(request.getSoilType())
                    .recommendationJson(responseJson)
                    .build();

            historyRepository.save(history);
        } catch (Exception e) {
            // Don't fail the request if history saving fails
        }
    }

    public List<UserCropHistory> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return historyRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
