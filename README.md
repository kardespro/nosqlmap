# NoSQLMap CLI Tool

NoSQLMap CLI Tool is a command-line interface (CLI) tool designed to test for NoSQL injection vulnerabilities using Node.js, TypeScript, and Axios. It supports both HTTP and HTTPS requests and works with all HTTP methods.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/kardespro/nosqlmap
cd nosqlmap
npm install
```

## Build

Compile the TypeScript files:

```bash
npm run nsq-build
```

## Usage

You can run the tool using the defined NPM script.

### Example Usage

Run the tool with the following command:

```bash
npm run nsq -- --url=http://target.com/api --method=POST --field=username --json --header="Authorization: Bearer token" --cookie="sessionId=abc123" --proxy="http://localhost:8080"
```

### Parameters

- `--url`: The URL to scan (Required)
- `--method`: The HTTP method to use (GET, POST, PUT, DELETE, etc.) (Default: `POST`)
- `--field`: The form field name to test for NoSQL injection
- `--json`: Indicates if the payload should be sent as JSON (Default: `true`)
- `--cookie`: Cookies to include in the request
- `--header`: Headers to include in the request (key:value format)
- `--proxy`: Proxy server to use (format: `http://host:port`)
- `--burp`: Path to Burp Suite request file (Optional)
- `--ai`: Use AI for payload generation.
- `--config`: Configuration (format: `GEMINI_API_KEY=xxxx`).

### Example Command

```bash
npm run nsq -- --url=http://target.com/api --method=POST --field=username --json --header="Authorization: Bearer token" --cookie="sessionId=abc123" --proxy="http://localhost:8080"
```

### Explanation

- `--url`: The target URL to scan.
- `--method`: The HTTP method to use. Defaults to `POST`.
- `--field`: The form field name to test for NoSQL injection.
- `--json`: Indicates if the payload should be sent as JSON.
- `--header`: Headers to include in the request (key:value format).
- `--cookie`: Cookies to include in the request.
- `--proxy`: Proxy server to use (format: `http://host:port`).
- `--ai`: Use AI for payload generation.
- `--config`: Configuration (format: `GEMINI_API_KEY=xxxx`).



## Development

To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/fooBar`).
3. Commit your changes (`git commit -am 'Add some fooBar'`).
4. Push to the branch (`git push origin feature/fooBar`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
