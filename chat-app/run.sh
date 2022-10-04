#!/bin/bash
npm install
npx prisma db push
npx prisma generate
npm start