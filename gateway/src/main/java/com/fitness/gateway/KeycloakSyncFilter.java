package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        RegisterRequest registerRequest = getUserDetails(token);

        if(userId == null) {
            userId = registerRequest.getKeycloakId();
        }
        if(userId != null && token != null) {
            String finalUserID = userId;
            return userService.validateUser(finalUserID)
                    .flatMap(exist -> {
                        if(!exist) {
                            //Register user
                            if(registerRequest != null) {
                                return  userService.registerUser(registerRequest).then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists, skipping sync ");
                            return Mono.empty();
                        }
                    })
                    .then (Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserID).build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            RegisterRequest request = new RegisterRequest();

            request.setEmail(claimsSet.getStringClaim("email"));
            request.setKeycloakId(claimsSet.getStringClaim("sub"));
            request.setPassword("Dummy@123");
            request.setFirstName(claimsSet.getStringClaim("given_name"));
            request.setLastName(claimsSet.getStringClaim("family_name"));
            return  request;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
