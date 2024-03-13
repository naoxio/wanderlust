# Wanderlust

Wanderlust is a location-marking app that allows you to track your adventures on a 3D or 2D world map.

## Docker Instructions

To run Wanderlust using Docker, follow these steps:

1. Clone the repository:
```sh
git clone https://github.com/naoxio/wanderlust.git
cd wanderlust
```

2. Build the Docker image:
```sh
docker build -t wanderlust .
```

3. Run the Docker container:
```sh
docker run -d wanderlust
```

4. Access the app in your browser at http://localhost:3000.

This will start the Wanderlust app using Docker, allowing you to explore and mark your adventures on the world map.