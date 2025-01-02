# 3D Human Body Model Viewer

An interactive 3D human body model viewer built with Three.js and Vite. This web application allows users to explore a detailed 3D model of the human body with interactive features.

## Features

- **Interactive 3D Model**: Fully rotatable and zoomable 3D human body model
- **Organ Highlighting**: Click on different organs to highlight them
- **Smooth Animations**: 
  - Continuous model rotation
  - Rotation stops when an organ is selected
  - Rotation resumes from the current position when deselected
- **Responsive Design**: Adapts to different screen sizes

## Technology Stack

- Three.js for 3D rendering
- Vite for build tooling and development server
- Modern JavaScript (ES6+)

## Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:sun409377708/3DWebDemo.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/`
  - `ModelController.js`: Handles model loading and interaction
  - `SceneManager.js`: Manages Three.js scene setup
  - `main.js`: Application entry point
- `models/`: Contains 3D model files
- `public/`: Static assets

## Usage

- **Rotate Model**: Click and drag to rotate the model
- **Zoom**: Use mouse wheel to zoom in/out
- **Select Organ**: Click on any organ to highlight it
- **Deselect**: Click the same organ again to deselect it

## License

MIT License
