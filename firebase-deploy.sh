#!/bin/bash

# Set build environment based on your input
BUILD_ENV=$1

echo "Build env:" $BUILD_ENV

# Install dependencies
npm install

# Run the corresponding build based on environment
if [ "$BUILD_ENV" = "test" ]; then
    npm run build-test
elif [ "$BUILD_ENV" = "release" ]; then
    npm run build-release
elif [ "$BUILD_ENV" = "staging" ]; then
    npm run build-staging
elif [ "$BUILD_ENV" = "prod-beta" ]; then
    npm run build-beta
elif [ "$BUILD_ENV" = "prod" ]; then
    npm run build-prod
elif [ "$BUILD_ENV" = "prod-enterprise" ]; then
    npm run build-prod-enterprise
elif [ "$BUILD_ENV" = "prod-in" ]; then
    npm run build-prod-in
elif [ "$BUILD_ENV" = "prod-eu" ]; then
    npm run build-prod-eu
elif [ "$BUILD_ENV" = "prod-cn" ]; then
    npm run build-prod-cn
else
    echo "No environment variable provided, running build-test by default."
    npm run build-test
fi

# Deploy to Firebase
firebase deploy --only hosting
    