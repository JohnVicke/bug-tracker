docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bugtracker -p 5432:5432 -d postgres;
docker run --name redis -p 6379:6379 -d redis
