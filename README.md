- A psql console connection to the database can be opened as follows:
	```javascript
	**flyctl postgres connect -a <app_name-db>**
	```
- Creates new container from postgres image with name blog-postgres:
	```javascript
	**docker run --name blog-postgres -e POSTGRES_PASSWORD=VJzU1nicJdAMjxe -p 5432:5432 postgres**
	```
- psql console connection to the database:
	```javascript
	**docker exec -it blog-postgres psql -U postgres postgres**
	```
