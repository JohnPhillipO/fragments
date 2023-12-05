# 1. POST a fragment 
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# 2. GET 201 response
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. Unauthenticated PUT request
PUT {{url}}
Content-Type: text/plain
`I updated this fragment!`

# Confirm server returns 401 (Unauthenticated user)
HTTP/1.1 401

# 4. Invalid ID PUT request
PUT {{url}}Invalid
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`I updated this fragment!`

# Confirm server returns 404 (Invalid ID)
HTTP/1.1 404

# 5. Invalid Type PUT request
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`## I updated this fragment!`

# Confirm server returns 400 (Invalid type)
HTTP/1.1 400
