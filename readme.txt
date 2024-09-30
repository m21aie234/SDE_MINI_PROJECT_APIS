# Fitness Application - Backend Services

This project consists of two main microservices: Exercise Service and Workout Service. These microservices work together to manage and track fitness-related data, including exercises, workouts, and their status.

## Features

1. **Exercise Service**
   - Create, read, and delete exercises.
   - Exercise fields include `name`, `muscle group`, `equipment`, `description`, and `repetitions`.
   - Exercise pagination for efficient data loading.
   - install node_modules by npm install in microservices/exercise-service folder
   
2. **Workout Service**
   - Create, read, update, and delete workouts.
   - A workout consists of multiple exercises (referencing exercise IDs).
   - Fields include `name`, `exercises`, `duration`, `difficulty`, and `calories burned`.
   - Update workout status between "in progress" and "completed."
   - Get workout details including exercise details via referencing.
   - install node_modules by npm install in microservices/workout-service folder

3. **Visual Representation**
   - A dashboard with data visualizations using `chart.js` (workout status and exercise distribution).
   - Integration with React for the front end.
   
## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository:
