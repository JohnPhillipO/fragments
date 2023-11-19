# Posting without including "BasicAuth"
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`This is a fragment!`

# Expect a 401 unauthenticated response
HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
