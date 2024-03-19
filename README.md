# Traveltint

Traveltint is a location-marking app that allows you to track your adventures on a 3D or 2D world map.

## Docker Instructions

To run Traveltint using Docker, follow these steps:

1. Clone the repository:
```sh
git clone https://github.com/naoxio/traveltint.git
cd traveltint
```

2. Build the Docker image:
```sh
docker build -t traveltint .
```

3. Run the Docker container:
```sh
docker run -d traveltint
```

4. Access the app in your browser at http://localhost:3000.

This will start the Traveltint app using Docker, allowing you to explore and mark your adventures on the world map.