- A psql console connection to the database can be opened as follows:
	flyctl postgres connect -a <app_name-db>
- Creates new container from postgres image with name blog-postgres:
	docker run --name blog-postgres -e POSTGRES_PASSWORD=VJzU1nicJdAMjxe -p 5432:5432 postgres
- psql console connection to the database:
	docker exec -it blog-postgres psql -U postgres postgres
