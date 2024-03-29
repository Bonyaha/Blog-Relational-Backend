 - creating a table:
```sql
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);```


- inserting rows:
```sql
INSERT INTO blogs (author, url, title, likes) VALUES 
    ('John Doe', 'http://example.com/blog1', 'First Blog', 10),
    ('Jane Smith', 'http://example.com/blog2', 'Second Blog', 5);
```
- selecting rows:
```sql
  select * from blogs;
```