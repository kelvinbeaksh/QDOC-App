#!/bin/sh

npx --no-install @beam-australia/react-env --dest build/env

TZ="Asia/Singapore" node server.js