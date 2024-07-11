# Backend Test Case REST API

This project is a backend test case REST API designed for experimenting and testing backend functionalities. The application is built using Node.js (v20.0.0^).

### Install Packages

You can install the required packages using your preferred package manager: yarn, npm, or pnpm.

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Setup Environment

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

```dotenv
DATABASE_NAME=<your_database_name>
DATABASE_USER=<your_database_user>
DATABASE_PASS=<your_database_password>
DATABASE_HOST=<your_database_host>

APP_PORT=<your_app_port>
APP_BASE_URL=<your_app_base_url>

BASIC_AUTH_USER=<your_app_basic_auth_username>
BASIC_AUTH_PASS=<your_app_basic_auth_password>
```

> [!NOTE]
> The database used in this project is MySQL. Ensure you have MySQL installed and running.

### Start Development

To start the development server, use the following commands:

```bash
# Using npm
npm run start:dev

# Using yarn
yarn start:dev

# Using pnpm
pnpm run start:dev
```

### Build Application

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm run build
```

### Run Production Server

After building the application, you can start the production server using:

```bash
# Using npm
npm start:prod

# Using yarn
yarn start:prod

# Using pnpm
pnpm start:prod
```

### Run Production Server with Docker

You can also run the production server using Docker:

```bash
docker-compose up
```

And then change the host of your DATABASE_HOST env to be `mysql`.

> [!NOTE]
> The DATABASE_USER value in your env must not be root.

### Run Seeder

To run the database seeder, use the following commands:

```bash
# Using npm
npm run scripts seed:config
npm run scripts seed:run

# Using yarn
yarn run scripts seed:config
yarn run scripts seed:run

# Using pnpm
pnpm run scripts seed:config
pnpm run scripts seed:run
```

## Access API Documentation

You can access the API documentation at:  
[http://localhost:<your_app_port>/api/v1/docs](http://localhost:<your_app_port>/api/v1/docs)

Replace `<your_app_port>` with the port number specified in your `.env` file.
