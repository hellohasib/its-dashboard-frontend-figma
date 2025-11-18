# Docker Setup for ATMS Frontend

This document explains how to run the ATMS Frontend application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Production Build

Build and run the production-optimized container:

```bash
# Build the Docker image
docker build -t atms-frontend .

# Run the container
docker run -d -p 3000:80 --name atms-frontend atms-frontend

# Or use Docker Compose
docker-compose up -d
```

The application will be available at: http://localhost:3000

### Development Mode

For development with hot reload:

```bash
# Start development container
docker-compose -f docker-compose.dev.yml up

# Or build and run manually
docker build -f Dockerfile.dev -t atms-frontend-dev .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules atms-frontend-dev
```

The development server will be available at: http://localhost:5173

## Docker Commands

### Production

```bash
# Build image
docker-compose build

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Restart container
docker-compose restart

# View container status
docker-compose ps
```

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## Docker Architecture

### Production Build (Multi-stage)

**Stage 1: Builder**
- Uses Node.js 18 Alpine image
- Installs dependencies with `npm ci`
- Builds the application with `npm run build`

**Stage 2: Nginx Server**
- Uses lightweight Nginx Alpine image
- Copies built static files from builder stage
- Serves application on port 80
- Includes custom Nginx configuration for React Router support

**Benefits:**
- Small image size (~50MB)
- Fast startup time
- Production-ready configuration
- Includes health checks

### Development Build

- Uses Node.js 18 Alpine image
- Mounts source code as volume for hot reload
- Runs Vite dev server
- Preserves node_modules in container

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API endpoints (when needed)
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Environment
NODE_ENV=production
```

### Nginx Configuration

The `nginx.conf` file includes:
- Gzip compression for better performance
- Security headers (X-Frame-Options, CSP, etc.)
- Static asset caching
- React Router support (SPA routing)
- Health check endpoint at `/health`

### Port Configuration

Default ports:
- Production: `3000:80` (host:container)
- Development: `5173:5173` (host:container)

To change the host port, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

## Health Checks

The production container includes health checks:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' atms-frontend

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' atms-frontend
```

Health check endpoint: http://localhost:3000/health

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs atms-frontend

# Check if port is already in use
lsof -i :3000

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### Hot reload not working in development

```bash
# Ensure volumes are mounted correctly
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Build fails

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Check disk space
docker system df
docker system prune
```

## Integration with Backend

To integrate with the backend services:

```yaml
# Add to docker-compose.yml
services:
  atms-frontend:
    # ... existing config ...
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
  
  backend:
    # Your backend service configuration
```

## Production Deployment

### Using Docker Swarm

```bash
docker stack deploy -c docker-compose.yml atms
```

### Using Kubernetes

Create a Kubernetes deployment from the Docker image:

```bash
# Build and push to registry
docker build -t your-registry/atms-frontend:latest .
docker push your-registry/atms-frontend:latest

# Deploy to Kubernetes
kubectl create deployment atms-frontend --image=your-registry/atms-frontend:latest
kubectl expose deployment atms-frontend --type=LoadBalancer --port=80
```

## Security Best Practices

1. **Use specific image versions** in production (not `latest`)
2. **Scan images** for vulnerabilities:
   ```bash
   docker scan atms-frontend
   ```
3. **Run as non-root user** (already configured in Nginx image)
4. **Keep images updated** regularly
5. **Use secrets** for sensitive data instead of environment variables

## Performance Optimization

The production build includes:
- ✅ Multi-stage build for minimal image size
- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ No-cache for HTML (for updates)
- ✅ Health checks for orchestration

## Monitoring

### View logs

```bash
# All logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Resource usage

```bash
# Container stats
docker stats atms-frontend

# Detailed info
docker inspect atms-frontend
```

## Maintenance

### Update application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Cleanup

```bash
# Remove stopped containers
docker-compose down

# Remove volumes (careful - this deletes data)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify configuration: `docker-compose config`
- Test health: `curl http://localhost:3000/health`

