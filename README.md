# Simpler

Simpler is a powerful desktop application designed to streamline software project development by leveraging OpenAI and Anthropic APIs. It provides an intuitive interface for managing project components and facilitates AI-assisted development.

## Features

- **AI Integration**: Send requests to OpenAI and Anthropic APIs for intelligent assistance throughout your development process.
- **Project State Management**: Efficiently manage your project state using a JSON file, ensuring easy tracking and updates.
- **User-Friendly Interface**: Intuitive UI for managing:
  - Project descriptions
  - Requirements
  - Tasks
  - Project files
- **Cross-Platform**: Built with Tauri, ensuring compatibility across multiple operating systems.

## Getting Started

Follow these steps to set up and run Simpler on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gitkola/simpler
   cd simpler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Keys:**
   - Open the application settings.
   - Enter your OpenAI and Anthropic API keys in the designated fields.

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Technologies Used

Simpler is built using a modern tech stack to ensure performance, scalability, and ease of development:

- **Tauri**: A framework for building lightweight, secure desktop applications.
- **TypeScript**: Adds static typing to JavaScript, enhancing code quality and developer productivity.
- **React.js**: A popular JavaScript library for building user interfaces.
- **Redux Toolkit**: State management solution for React applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Development

### Recommended IDE Setup

For the best development experience, we recommend using:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Tauri VS Code Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer VS Code Extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

This setup provides excellent support for both the frontend (TypeScript/React) and backend (Rust) components of the application.

## Contributing

We welcome contributions to Simpler! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Submit a pull request with a clear description of your changes

Please ensure your code adheres to the existing style conventions and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository. We appreciate your feedback and contributions to making Simpler even better!