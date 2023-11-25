# Testing AWS S3

# POST Fragment Test
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

# Expect a HTTP 201 and Location header
HTTP/1.1 201
[Captures]
url: header "Location"

# Get fragment created
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns expected result
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9
`Hello S3!`

# Try to delete posted fragment using same URL
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Server returns HTTP 200 (Successful deletion)
HTTP/1.1 200

# Get the fragment again
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Server returns HTTP 404 (No fragment found)
HTTP/1.1 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Id not found!"
