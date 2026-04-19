$token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJub21lIjoiQWRtaW5pc3RyYWRvciIsInVzZXJJZCI6IjA2NTJmYzQ0LTFkMzgtNGIyMC05MWI5LWFlZjBlNWMwYWYyYyIsInN1YiI6ImFkbWluQHNpc3RlbWEuZ292LmFvIiwiaWF0IjoxNzc2MTgwMzYxLCJleHAiOjE3NzYxODM5NjF9.r3d4XQn8vAD0Vco7iSEt9fCLiVkp9g19fgm6ZsV9Xjs"

$body = @{
    termo = "furto qualificado"
    limite = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/busca/semantica" -Method POST -ContentType "application/json" -Header @{Authorization="Bearer $token"} -Body $body | ConvertTo-Json -Depth 10
