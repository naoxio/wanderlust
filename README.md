# Traveltint

Traveltint is an interactive world map application built with Dioxus that allows users to visually track their travel experiences and aspirations.

## Features

- Interactive world map with country selection
- Mark countries as:
  - Visited
  - Lived in
  - Want to visit
- Infinite horizontal scrolling for seamless navigation
- Responsive design for various screen sizes

## Technology Stack

- Frontend: Rust with Dioxus framework
- Development Environment: devenv shell
- Styling: CSS with custom variables for easy theming

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/traveltint.git
   ```

2. Navigate to the project directory:
   ```
   cd traveltint
   ```

3. Enter the devenv shell:
   ```
   devenv shell
   ```

4. Install dependencies:
   ```
   cargo build
   ```

5. Run the application in development mode:
   ```
   dx serve
   ```

6. Open your browser and visit `http://localhost:8080` (or the port specified in your Dioxus configuration)

## Usage

- Click on a country to select it
- Use the buttons to mark the selected country as visited, lived in, or want to visit
- Drag the map to pan and explore
- Enjoy tracking your global adventures!

## Development

To work on Traveltint, make sure you have [devenv](https://devenv.sh/) installed. The project uses a devenv shell for a consistent development environment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
