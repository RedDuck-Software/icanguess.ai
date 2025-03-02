# icanguess.ai

This mono-repository contains a codebase for a `icanguess.ai` project developed specifically for One Trillion Agents Hackathon.

## Project structure

- ./apps/api - contains server related logic
- ./apps/contracts - contains project`s smart contracts implementations, tests and deployment scripts
- ./apps/indexer - contains blockchain indexer application
- ./apps/web - contains frontend app and all related ui components
- ./apps/eliza - contains character definition for elizaOS AI Agent

### To run the project locally you need to have the following installed

- node
- redis
- postgresql
- eliza

### Start guide

1) Define all .env files in `apps/api`, `apps/api/prisma`, `apps/indexer/`, `apps/web`
2) Install dependencies using `yarn install`
3) Run indexer: `cd apps/indexer && yarn dev`
4) Run api: `cd apps/api && yarn start:dev`
5) Run web: `cd apps/web && yarn dev`
