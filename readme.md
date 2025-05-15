# Local Gemma3:1b
## From [Ollama](https://github.com/ollama) Docs
### Generate a response
```
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt":"Why is the sky blue?"
}'
```
### Chat with a model
```
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    { "role": "user", "content": "why is the sky blue?" }
  ]
}'
```
---

