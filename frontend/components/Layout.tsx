"use client";

import { Button } from "@/components/ui/button";
import Keycloak from "keycloak-js";
import { LogOut, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const keycloakConfig = {
  url: "http://localhost:8181",
  realm: "petit-spring-boot-security-domaine",
  clientId: "ecommerce-client",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const router = useRouter();

  const initKeycloak = useCallback(async () => {
    if (keycloak) {
      try {
        const authenticated = await keycloak.init({ onLoad: "login-required" });
        if (!authenticated) {
          window.location.reload();
        } else {
          setAuthenticated(true);
          if (keycloak.tokenParsed) {
            const role =
              keycloak.tokenParsed.realm_access?.roles.find((role: string) =>
                ["commercial", "user", "admin"].includes(role)
              ) || "";
            setUserRole(role);
            setUserNumber(keycloak.tokenParsed.preferred_username || "");
            router.push(`/${role}`);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Keycloak", error);
      }
    }
  }, [keycloak, router]);

  useEffect(() => {
    const keycloakInstance = new Keycloak(keycloakConfig);
    setKeycloak(keycloakInstance);
  }, []);

  useEffect(() => {
    if (keycloak) {
      initKeycloak();
    }
  }, [keycloak, initKeycloak]);

  const logout = useCallback(() => {
    if (keycloak) {
      keycloak.logout();
    }
  }, [keycloak]);

  if (!authenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              E-Commerce
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-700">
              User: {userNumber}
            </span>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Rôle de l&#39;utilisateur : {userRole}
          </h1>
          {children}
        </div>
      </main>

      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Moncef Mostaine.
          </p>
        </div>
      </footer>
    </div>
  );
}
