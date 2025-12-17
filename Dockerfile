# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build Next.js
ENV NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
