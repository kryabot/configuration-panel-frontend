# Build

FROM node:current-alpine as builder
COPY package.json package-lock.json ./

RUN npm ci
WORKDIR /ng-app
COPY . .
RUN npm update
RUN npm audit fix
RUN npm install --save-dev  --unsafe-perm node-sass
RUN npm run ng build -- --prod --output-path=dist

# Deploy

FROM nginx:stable-alpine
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html

# Run
CMD ["nginx", "-g", "daemon off;"]