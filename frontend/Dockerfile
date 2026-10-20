# ETAPA 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=https://asn-api-william.azurewebsites.net/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ETAPA 2: Servidor Web
FROM nginx:alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
