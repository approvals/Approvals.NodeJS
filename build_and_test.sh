#!/bin/bash -e

npm ci
npm run build
npm test

