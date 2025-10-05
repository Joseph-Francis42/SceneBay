# SceneBay — AI-Powered Location Discovery

**Team Members:** Joseph (Developer), Adithya (Developer), Job (Developer)

---

### Elevator Pitch

SceneBay is a modern web application that transforms how you discover new places. Instead of just searching for existing venues, you can describe the features you're looking for—like "a quiet coffee shop with outdoor seating and fast wifi"—and our AI will generate a list of fictional, yet plausible, locations that match your criteria, displaying them on an interactive map.

---

### Key Features

*   **AI-Powered Search:** Leverages the Google Gemini API to generate custom location data based on natural language descriptions.
*   **Interactive Map:** Displays results on a dynamic and responsive map using Leaflet and OpenStreetMap.
*   **Synchronized Views:** Selecting a location in the results list automatically pans the map to its pin, and clicking a pin highlights the corresponding item in the list.
*   **Clean & Modern UI:** A desktop-friendly, responsive interface built with React and Tailwind CSS for a seamless user experience.
*   **Customizable Search:** Filter by location, a specific radius (in km or miles), and detailed features.

---

### Tech Stack

| Category         | Technology / Library                                       | Purpose                                            |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| **UI Library**   | [React](https://react.dev/)                                | Building the component-based user interface.       |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)              | Adds static typing for robust and scalable code.   |
| **Styling**      | [Tailwind CSS](https://tailwindcss.com/)                   | Utility-first CSS framework for rapid UI design.   |
| **Mapping**      | [Leaflet.js](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/) | Renders the interactive map and location markers.  |
| **AI Service**   | [Google Gemini API](https://ai.google.dev/)                | Generates location data based on user input.       |
| **Module Loading**| ES Modules & Import Maps                                 | Loads dependencies directly in the browser from a CDN. |

---

### Quick Start (Local Development)

This project is configured to run directly in the browser without a build step.

#### 1. Clone the repository

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

#### 2. Set up the Environment Variable

The application requires a Google Gemini API key to function. The code expects this key to be available in the execution environment as `process.env.API_KEY`.

When deploying or running in a compatible environment, ensure this variable is set. For a quick local test, you could temporarily replace `process.env.API_KEY` in `services/geminiService.ts` with your actual key (not recommended for production).

#### 3. Serve the application

Since there is no build process, you need a simple local server to serve the `index.html` file.

**Using Python:**
If you have Python installed, run this command from the project's root directory:
```bash
python -m http.server
```

**Using VS Code:**
You can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

#### 4. Open the application
Once the server is running, open your web browser and navigate to the provided local address (e.g., `http://localhost:8000`).