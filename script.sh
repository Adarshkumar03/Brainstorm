#!/bin/bash

cd server

npm install

npm start &

cd ..

cd frontend

npm install

npm run dev