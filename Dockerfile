FROM mcr.microsoft.com/playwright:v1.53.2-noble

WORKDIR /app

# Use preinstalled Playwright browsers from the base image.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install --prefix backend && npm install --prefix frontend

COPY . .

RUN npm run build --prefix frontend

EXPOSE 5001

CMD ["npm", "run", "start", "--prefix", "backend"]
