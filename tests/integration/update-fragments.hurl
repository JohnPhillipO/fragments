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

# 3. Get the fragment created
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19
[Asserts]
body == "This is a fragment!"

# 4. Try and update the fragment using the url
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`I updated this fragment!`

# Server returns HTTP 200 (Successful update)
HTTP/1.1 200

# 5. Get Fragment to check if it updated.
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Server returns 200 (Fragment found)
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 24
[Asserts]
body == "I updated this fragment!"
