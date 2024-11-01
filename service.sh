if [ "$1" == "start" ]; then
    echo "Démarrage de tous les servicess..."
    for dir in gateway product order inventory; do
        echo "Lancement de $dir..."
        (cd $dir && docker-compose up -d)
    done
    echo "Tous les services sont démarréés."
elif [ "$1" == "stop" ]; then
    echo "Arrêt de tous les services..."
    for dir in gateway product order inventory; do
        echo "Arrêt de $dir..."
        (cd $dir && docker-compose down)
    done
    echo "Tous les services sont arrêtés."
else
    echo "Usage: $0 start|stop"
fi