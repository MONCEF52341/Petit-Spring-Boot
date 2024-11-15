describe("Tests d'Authentification et d'Accès", () => {
  const users = {
    commercial: {
      username: "commercial@psb.com",
      password: "P@sser123",
      role: "commercial",
    },
    admin: {
      username: "admin@psb.com",
      password: "P@sser123",
      role: "admin",
    },
    user: {
      username: "user@psb.com",
      password: "P@sser123",
      role: "user",
    },
  };

  Object.entries(users).forEach(([userType, userData]) => {
    describe(`Utilisateur ${userType}`, () => {
      beforeEach(() => {
        // Visiter la page d'accueil
        cy.visit("http://localhost:3000");

        // Intercepter la redirection vers Keycloak
        cy.intercept(
          "GET",
          "http://localhost:8181/realms/petit-spring-boot-security-domaine/protocol/openid-connect/auth*"
        ).as("keycloakAuth");

        // Attendre la redirection vers Keycloak
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cy.wait("@keycloakAuth").then((interception) => {
          // Simuler le remplissage du formulaire de login Keycloak
          cy.origin(
            "http://localhost:8181",
            { args: { userData } },
            ({ userData }) => {
              cy.get("#username").type(userData.username);
              cy.get("#password").type(userData.password);
              cy.get("#kc-login").click();
            }
          );
        });

        // Intercepter la redirection de retour vers l'application
        cy.intercept("GET", "http://localhost:3000/**").as("appRedirect");
        cy.wait("@appRedirect");
      });

      it(`devrait rediriger vers la page /${userData.role} après la connexion`, () => {
        cy.url().should("include", `/${userData.role}`);
      });

      it(`devrait afficher le rôle correct sur la page`, () => {
        cy.contains(`Rôle de l'utilisateur : ${userData.role}`).should(
          "be.visible"
        );
      });

      it(`devrait avoir accès à sa propre page`, () => {
        cy.visit(`http://localhost:3000/${userData.role}`);
        cy.contains(
          `Page ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
        ).should("be.visible");
      });

      // Tester l'accès non autorisé aux autres pages
      Object.keys(users).forEach((otherUserType) => {
        if (otherUserType !== userType) {
          it(`ne devrait pas avoir accès à la page /${users[otherUserType].role}`, () => {
            cy.visit(`http://localhost:3000/${users[otherUserType].role}`);
            cy.contains(`${userData.role}`).should("be.visible");
          });
        }
      });
    });
  });

  it("devrait rediriger vers la page de connexion Keycloak lorsque non authentifié", () => {
    cy.visit("http://localhost:3000");
    cy.url().should(
      "include",
      "http://localhost:8181/realms/petit-spring-boot-security-domaine/protocol/openid-connect/auth"
    );
  });
});
