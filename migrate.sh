#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting database migration process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until docker exec db pg_isready -U postgres > /dev/null 2>&1; do
        echo -n "."
        sleep 1
    done
    echo -e "\n${GREEN}PostgreSQL is ready!${NC}"
}

# Start the database container if it's not running
if ! docker ps | grep -q "db"; then
    echo "Starting database container..."
    docker compose up -d db
    wait_for_postgres
fi

# Run Liquibase migrations
echo "Running database migrations..."
docker compose up liquibase

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database migrations completed successfully!${NC}"
else
    echo -e "${RED}Database migrations failed. Please check the logs above for errors.${NC}"
    exit 1
fi

echo "Migration process completed."
