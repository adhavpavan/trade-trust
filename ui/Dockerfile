FROM node:14 as builder

WORKDIR /usr/src/app
COPY . ./
RUN npm install --legacy-peer-deps
RUN npm run-script build

# Stage 2 - Deploy with NGNIX
FROM nginx:1.15.2-alpine

COPY --from=builder /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]