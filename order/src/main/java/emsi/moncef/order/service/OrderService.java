package emsi.moncef.order.service;


import emsi.moncef.order.client.InventoryClient;
import emsi.moncef.order.dto.OrderRequest;
import emsi.moncef.order.event.OrderPlacedEvent;
import emsi.moncef.order.model.Order;
import emsi.moncef.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public void placeOrder(OrderRequest orderRequest) {
        var isProductInStock = inventoryClient.isInStock(orderRequest.skuCode(), orderRequest.quantity());
        if (isProductInStock) {
            Order order = new Order();
            order.setOrderNumber(UUID.randomUUID().toString());
            order.setPrice(orderRequest.price());
            order.setSkuCode(orderRequest.skuCode());
            order.setQuantity(orderRequest.quantity());
            orderRepository.save(order);

            // Après que la commande ait été enregistée dans la BDD
            // il faut enyer un message sur Kafka
            OrderPlacedEvent orderPlacedEvent = new OrderPlacedEvent(order.getOrderNumber());
            log.info("Start - Sending OrderPlacedEvent {} to Kafka topic commande_placed",orderPlacedEvent);
            kafkaTemplate.send("commande-placed", orderPlacedEvent);
            log.info("End - Sending OrderPlacedEvent {} to Kafka topic commande_placed",orderPlacedEvent);

        } else {
            throw new RuntimeException("Le produit " + orderRequest.skuCode() + " n'est pas en stock");
        }
    }
}
