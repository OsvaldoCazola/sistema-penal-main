$token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJub21lIjoiQWRtaW5pc3RyYWRvciIsInVzZXJJZCI6IjA2NTJmYzQ0LTFkMzgtNGIyMC05MWI5LWFlZjBlNWMwYWYyYyIsInN1YiI6ImFkbWluQHNpc3RlbWEuZ292LmFvIiwiaWF0IjoxNzc2MTgwMzYxLCJleHAiOjE3NzYxODM5NjF9.r3d4XQn8vAD0Vco7iSEt9fCLiVkp9g19fgm6ZsV9Xjs"

# Listar leis para verificar dados
Invoke-RestMethod -Uri "http://localhost:8080/api/leis?page=0&size=5" -Method GET -Header @{Authorization="Bearer $token"} | ConvertTo-Json -Depth 10
