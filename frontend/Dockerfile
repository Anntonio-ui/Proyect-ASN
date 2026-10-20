# La misma versión de Node en desarrollo, CI y construcción.
FROM node:24.19.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=https://asn-api-william.azurewebsites.net/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:stable-alpine
ENV PORT=8080
# La imagen oficial sustituye las variables del template antes de iniciar Nginx.
ENV NGINX_ENVSUBST_FILTER=^PORT$
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
