# Travel Planner

React + TypeScript + Vite frontend and AWS SAM serverless backend

## Stack
React, TypeScript, React Router, Cognito, API Gateway HTTP API, Lambda, DynamoDB, S3, AWS SDK v3, Open-Meteo.

## Run
1. `cd backend && npm install && sam build && sam deploy --guided`
2. Copy CloudFormation outputs to `frontend/.env` using `.env.example`.
3. `cd ../frontend && npm install && npm run dev`

Never put AWS access keys in the frontend. Protected routes use Cognito JWTs.
