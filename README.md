# HCMUT Internship Data Crawler

A web scraping tool designed to collect and manage internship data from the HCMUT internship portal for CS/CE students.

## Project Overview

This project provides a backend service that crawls the HCMUT internship portal to collect information about companies offering internships, including their details, requirements, and available positions. The system uses scheduled crawling to keep data updated and provides API endpoints to access the collected information.

## Features

- Automated data crawling from the HCMUT internship portal
- Scheduled crawling using a built-in scheduler
- Data storage in JSON format
- RESTful API to access the collected data
- Cross-origin resource sharing (CORS) support

## Tech Stack

- Node.js
- Express.js
- React.js, TailwindCSS for frontend
- Puppeteer for web scraping

## Simple usage for just crawling data
If you just want to crawl data and store into json file, you can simply copy the code that is currently commented in backend/src/index.js and put into  
your javascript file in your own npm project init, remember to install these dependencies:
   ```
   "dependencies": {
       "cors": "^2.8.5",
       "express": "^4.18.2",
       "puppeteer": "^21.0.0"
   }
   ```

1. Create a folder and use
   ```
   npm init -y
   ```
2. Install dependencies
   ```
   npm install cors express puppeteer
   ```
3. create a javascript file and copy the commented code in backend/src/index.js
4. run the project (npm run dev or npm start ) as your config



## Installation

1. Clone the repository:

   ```
   https://github.com/HeroKeyboardUT/HCMUT-CSE-Internship-Crawler.git
   ```

2. Install dependencies:

   ```
   cd frontend
   npm install
   ```

   ```
   cd backend
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── crawl/           # Web crawling implementation
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions and scheduler
│   │   └── index.js         # Express application entry point
│   ├── data/                # Scraped data storage
│   └── package.json         # Backend dependencies
├── frontend/                # React frontend application
└── package.json             # Root project configuration
```

## Usage

The project provides a RESTful API to access the collected data. The backend server automatically crawls the HCMUT internship portal at scheduled intervals.

### Example API Endpoints

- `GET /api/crawl/hcmut` - Trigger the HCMUT crawler and retrieve the latest data

## Data Structure

The crawler collects the following information for each company:

- Company ID
- Index number
- Short name and full name
- Address and contact email
- Company logo/image
- Description and work details
- Number of registered and accepted students
- Maximum number of accepted students
- Internship files and documentation (including file names and URLs)

## Development

The project consists of a backend server for data crawling and a frontend React application for displaying the data. Both can be started simultaneously using the root `npm start` command.

To run only the backend:

```
cd backend
npm start
```

To run only the frontend:

```
cd frontend
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
