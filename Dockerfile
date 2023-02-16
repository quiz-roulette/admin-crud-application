FROM node:18.14.0-alpine as build-step
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build --prod
RUN ls

FROM nginx:1.20.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/dist/admin-crud-application /usr/share/nginx/html