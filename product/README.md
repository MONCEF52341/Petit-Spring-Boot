### README - Microservice Product (à CHANGER)

## Description

Ce microservice gère les produits pour un site e-commerce. Il utilise une base de données MongoDB et expose deux
endpoints pour interagir avec les produits.

## Endpoints

### 1. GET `http://localhost:8080/api/product`

Retourne la liste des produits.

#### Exemple de réponse

```json
[
    {
        "id": "671e9b3ac70b062d31ce1908",
        "name": "Produit 15",
        "description": "Description",
        "skuCode": "15",
        "price": 12
    }
]
```

### 2. POST `http://localhost:8080/api/product`

Ajoute un nouveau produit à la liste.

#### Exemple de requête

```json
{
    "name": "Produit 15",
    "description": "Description",
    "skuCode": "15",
    "price": 12
}
```

#### Exemple de réponse

```json
{
    "id": "671e9b3ac70b062d31ce1908",
    "name": "Produit 15",
    "description": "Description",
    "skuCode": "15",
    "price": 12
}
```

## Technologies Utilisées

- **Spring Boot** : Framework pour développer des applications Java.
- **MongoDB** : Base de données NoSQL pour stocker les produits.
- **Docker** : Pour tout.