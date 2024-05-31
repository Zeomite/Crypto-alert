**Cryptocurrency Price Alert App**

**Introduction:**
This project aims to create a cryptocurrency price alert application that enables users to set price alerts for specific cryptocurrencies and receive email notifications when the price reaches the set target. The application utilizes technologies like Node.js, Express.js, MongoDB, Redis, Socket.io, and Axios for real-time price fetching and communication.

**Features:**
- Set price alerts for specific cryptocurrencies.
- Real-time price updates through WebSocket communication.
- Email notifications when target prices are reached.
- Periodic fetching and caching of cryptocurrency prices.

**Requirements:**
1. Node.js and npm installed on your machine.
2. MongoDB database for storing user data.
3. Redis database for caching cryptocurrency prices.
4. SMTP server for sending email notifications.
5. CoinAPI account for fetching cryptocurrency prices (or any alternative cryptocurrency API).

**Installation:**
1. Clone the repository to your local machine:
   ```
   git clone https://github.com/your_username/cryptocurrency-price-alert.git
   ```
2. Navigate to the project directory:
   ```
   cd cryptocurrency-price-alert
   ```
3. Install dependencies using npm:
   ```
   npm install
   ```
4. Set up environment variables by creating a `.env` file and filling in the required details (refer to the provided `.env.example` file).
5. Start the application:
   ```
   npm start
   ```
6. Access the application through the specified port (default: 5000).

**Usage:**
1. Visit the homepage ("/") to confirm that the server is running.
2. Use the "/set-alert" endpoint to set price alerts for specific cryptocurrencies by sending a POST request with the required parameters (email, password, coin, targetPrice).
3. Subscribe to WebSocket channels to receive real-time price updates.
4. Check your email for notifications when the target price is reached.

**App Flow:**
The application initializes by configuring necessary modules, setting up environment variables, creating database connections, and initializing a Socket.io server. Users can set price alerts through HTTP requests, and real-time price updates are sent via WebSocket communication. Periodic price fetching and comparison with user-defined targets trigger email notifications when necessary.

