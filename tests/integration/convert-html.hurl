# 1. POST HTML fragment to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This is a fragment!`

# Confirm server returns a 201
HTTP/1.1 201
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# 2. Get fragment info
GET {{url}}/info
[BasicAuth]
user1@email.com:password1

# Confirm that server returns 201
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 21

# 4. Convert to Markdown
GET {{url}}.html
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-type: text/html
Content-Length: 29
[Asserts]
body == "<h1>This is a fragment!</h1>\n"
