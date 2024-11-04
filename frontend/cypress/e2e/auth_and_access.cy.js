describe("Authentication and Access Tests", () => {
  const users = {
    commercial: {
      username: "commercial@example.com",
      password: "password123",
      role: "commercial",
    },
    admin: {
      username: "admin@example.com",
      password: "password123",
      role: "admin",
    },
    user: {
      username: "user@example.com",
      password: "password123",
      role: "user",
    },
  };

  Object.entries(users).forEach(([userType, userData]) => {
    describe(`${userType} user`, () => {
      beforeEach(() => {
        // Simuler l'authentification Keycloak
        cy.intercept(
          "POST",
          "http://localhost:8181/realms/ypetit-spring-boot-security-domaine/openid-connect/token",
          {
            statusCode: 200,
            body: {
              access_token: "fake_token",
              expires_in: 300,
              refresh_expires_in: 1800,
              refresh_token: "fake_refresh_token",
              token_type: "bearer",
              "not-before-policy": 0,
              session_state: "fake_session_state",
              scope: "openid",
            },
          }
        ).as("tokenRequest");

        cy.intercept(
          "GET",
          "http://localhost:8181/realms/petit-spring-boot-security-domaine/protocol/openid-connect/userinfo",
          {
            statusCode: 200,
            body: {
              sub: `user-${userData.role}`,
              email_verified: true,
              name: `${userType} User`,
              preferred_username: userData.username,
              given_name: userType,
              family_name: "User",
              email: userData.username,
              realm_access: {
                roles: [userData.role],
              },
            },
          }
        ).as("userInfoRequest");

        // Visiter la page d'accueil (qui déclenchera l'authentification)
        cy.visit("/");
        cy.wait("@tokenRequest");
        cy.wait("@userInfoRequest");
      });

      it(`should redirect to /${userData.role} page after login`, () => {
        cy.url().should("include", `/${userData.role}`);
      });

      it(`should display the correct role on the page`, () => {
        cy.contains(`Rôle de l'utilisateur : ${userData.role}`).should(
          "be.visible"
        );
      });

      it(`should have access to their own page`, () => {
        cy.visit(`/${userData.role}`);
        cy.contains(
          `Page ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
        ).should("be.visible");
      });

      // Tester l'accès non autorisé aux autres pages
      Object.keys(users).forEach((otherUserType) => {
        if (otherUserType !== userType) {
          it(`should not have access to /${users[otherUserType].role} page`, () => {
            cy.visit(`/${users[otherUserType].role}`);
            cy.contains("Accès Non Autorisé").should("be.visible");
          });
        }
      });
    });
  });

  it("should redirect to login page when not authenticated", () => {
    // Simuler une absence de token
    cy.intercept(
      "POST",
      "http://localhost:8181/realms/petit-spring-boot-security-domaine/protocol/openid-connect/token",
      {
        statusCode: 401,
        body: "Unauthorized",
      }
    ).as("failedTokenRequest");

    cy.visit("/");
    cy.wait("@failedTokenRequest");

    // Vérifier la redirection vers la page de login de Keycloak
    cy.url().should(
      "include",
      "http://localhost:8181/realms/petit-spring-boot-security-domaine/protocol/openid-connect/auth"
    );
  });
});
