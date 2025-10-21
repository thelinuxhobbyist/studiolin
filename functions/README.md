This folder contains a demo Netlify function `views.js` which implements a simple view counter API.

Endpoints:
- POST /.netlify/functions/views with JSON { key: "/posts/my-post" } will increment the view counter for that key.
- GET /.netlify/functions/views returns an array of top keys and their counts.

Notes:
- The provided implementation stores counts in-memory (COUNTS) which is only suitable for local testing. For production you should persist counts to a database (DynamoDB, Fauna, Redis) or S3.
- To deploy on Netlify, place this folder at `functions/` in your repository root and Netlify will auto-deploy it.
- You will likely want to secure the POST endpoint or use a token to avoid abuse. Another option is to rate-limit on the client side and use server-side verification.

Suggested production architecture:
- Use DynamoDB or Redis for counts; the function increments the count atomically.
- Optionally, aggregate counts periodically and store top N in a `data/trending.yaml` for Hugo builds.
