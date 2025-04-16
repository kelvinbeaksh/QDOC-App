#!/bin/bash
find src/validation-rules -type f -name "*.ts" -exec sed -i '' 's/from "express-validator\/src\/chain\/validation-chain"/from "express-validator"/g' {} +
