run:
	docker compose -f docker-compose.yml down
	@echo "Deploying app on docker ...."
	docker compose -f docker-compose.yml up --build

stop:
	@echo "Shutting down app.."
	docker compose -f docker-compose.yml down
