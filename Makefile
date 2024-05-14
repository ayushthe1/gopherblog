run:
	sudo docker compose -f docker-compose.yml down
	@echo "Deploying app on docker ...."
	sudo docker compose -f docker-compose.yml up --build

stop:
	@echo "Shutting down app.."
	sudo docker compose -f docker-compose.yml down
