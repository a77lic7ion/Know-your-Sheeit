# Know Your Sheeeit - AI Legal Assistant

![AI Legal Assistant Banner](https://storage.googleapis.com/aistudio-ux-team-public/readme_images/know-your-sheeit-banner.png)

A multi-agent AI legal assistant for South African law, providing answers from a structured knowledge base using Retrieval-Augmented Generation (RAG). This application features agent education, document review capabilities, and a persistent chat history, all wrapped in a modern and responsive user interface.

---

## Table of Contents

- [✨ Features](#-features)
- [⚙️ How It Works](#️-how-it-works)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Installation & Setup](#-installation--setup)
- [☁️ Deployment](#️-deployment)
- [👑 Admin Features](#-admin-features)

---

## ✨ Features

-   **Multi-Agent System**: Dedicated AI agents for different areas of South African law (POPIA, Rental, Consumer Protection, and General).
-   **Retrieval-Augmented Generation (RAG)**: Answers are grounded in a managed knowledge base, ensuring accuracy, relevance, and reducing hallucinations.
-   **Agent Education Panel**: An admin-only interface to train agents by feeding them documents and URLs, which are processed into a structured knowledge base.
-   **Dynamic Knowledge Base**: The RAG knowledge base is stored on Vercel KV (a serverless Redis database) for persistence and scalability.
-   **User Authentication**: A mock but functional login and registration system to manage user access and persist data.
-   **Chat History**: Conversations are saved per user, allowing them to revisit past discussions.
-   **Conversation Export**: Users can export their chat logs as plain text or use AI to draft formal letters and emails based on the conversation.
-   **Customizable Settings**: Users can manage their third-party API keys and switch between light and dark themes.
-   **Responsive UI**: A modern, clean interface built with Tailwind CSS that works seamlessly on both desktop and mobile devices.

---

## ⚙️ How It Works

The application is a single-page application (SPA) that intelligently combines a React frontend, a serverless backend via Vercel KV, and the Google Gemini API for its AI capabilities.

1.  **Frontend**: Built with **React** and **TypeScript**, using **Tailwind CSS** for styling. It provides a dynamic and responsive user experience.

2.  **Backend (Serverless)**:
    -   **Authentication**: A mock `authService` uses `localStorage` and `sessionStorage` to simulate a persistent user database.
    -   **Knowledge Base & Chat History**: **Vercel KV** is used as a serverless Redis database to store both the structured knowledge base for the RAG system and user-specific chat histories. This makes the application stateful without a traditional backend server.

3.  **AI Core (Google Gemini API)**:
    -   **Chat (RAG)**: When a user sends a message, the `generateResponse` function retrieves relevant knowledge for the active agent from Vercel KV. This context is combined with a system prompt and the user's question, then sent to the Gemini API for a grounded, context-aware response.
    -   **Agent Training**: The "Agent Education" panel uses Gemini with a specific JSON schema (`KNOWLEDGE_BASE_SCHEMA`) to parse documents and URLs. The `processUrlForRAG` function instructs the model to structure the content into a summary, key concepts, and relevant clauses. This structured JSON is then saved to Vercel KV.
    -   **Export Formatting**: The `formatConversationForExport` function uses Gemini to re-contextualize a raw chat log into a professionally formatted formal letter or email.

---

## 🛠️ Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Database**: Vercel KV (`@vercel/kv`) for serverless data storage.
-   **Development Environment**: Vite (implied by the project setup)

---

## 🚀 Installation & Setup

Follow these steps to run the application in a local development environment.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   `npm` or a compatible package manager
-   A [Google Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)
-   A [Vercel Account](https://vercel.com/signup) for Vercel KV

### Step-by-Step Guide

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/ai-legal-assistant.git
    cd ai-legal-assistant
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Vercel KV**
    -   Go to your Vercel dashboard and create a new **KV Database (Redis)**.
    -   Connect to the database and navigate to the **`.env.local`** tab.
    -   Copy all the environment variables provided (`KV_URL`, `KV_REST_API_URL`, etc.).

4.  **Configure Environment Variables**
    -   Create a file named `.env` in the root of your project.
    -   Paste the Vercel KV variables you copied.
    -   Add your Google Gemini API key. Your `.env` file should look like this:

    ```env
    # Vercel KV Variables
    KV_URL=...
    KV_REST_API_URL=...
    KV_REST_API_TOKEN=...
    KV_REST_API_READ_ONLY_TOKEN=...

    # Since this project is configured for an environment that injects process.env.API_KEY,
    # for local development with Vite, you must name it VITE_API_KEY.
    # The code will need to be adjusted to read `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY`.
    VITE_API_KEY=your_gemini_api_key_here
    ```
    > **Note:** The current `geminiService.ts` expects `process.env.API_KEY`. For local development with Vite, you would typically use `import.meta.env.VITE_API_KEY`. You may need to adjust the service files to accommodate both deployment and local environments.

5.  **Set Up Admin Access**
    Admin features are hardcoded to the email `shaunwg@outlook.com`. To use them with your own account, open the following files and replace the email address with your own:
    -   `src/App.tsx`
    -   `src/components/Sidebar.tsx`

6.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

---

## ☁️ Deployment

The recommended deployment platform is **Vercel** due to its seamless integration with Vercel KV.

1.  **Push to a Git Repository**: Ensure your code is on GitHub, GitLab, or Bitbucket.

2.  **Create a Vercel Project**:
    -   On your Vercel dashboard, click "Add New... -> Project".
    -   Import your Git repository.
    -   Vercel will automatically detect the Vite/React setup.

3.  **Connect Vercel KV**:
    -   In the project settings, navigate to the "Storage" tab.
    -   Connect the project to the Vercel KV database you created earlier. This will automatically set the required `KV_*` environment variables.

4.  **Add Gemini API Key**:
    -   In the project settings, go to "Environment Variables".
    -   Add your Google Gemini API key with the name `API_KEY`. This key will be securely available as `process.env.API_KEY` in the deployed environment.

5.  **Deploy**: Click the "Deploy" button. Vercel will build and deploy your application.

---

## 👑 Admin Features

The "Agent Education" panel is a powerful tool for building and maintaining the RAG knowledge base.

### Workflow

1.  **Access**: Log in with the designated admin email address and click "Agent Education" in the sidebar.
2.  **Select Agent**: Choose which agent you want to train from the dropdown menu.
3.  **Provide Source**:
    -   Enter a URL to a legal document or article.
    -   OR, upload a file (`.pdf`, `.docx`, `.txt`).
4.  **Process**: Click "Process". The Gemini API will analyze the source content (or its inferred content based on the name) and generate a structured JSON preview containing a summary, key concepts, and relevant clauses.
5.  **Review**: Examine the generated JSON in the preview panel to ensure it's accurate and well-structured.
6.  **Approve**: If the preview is correct, click "Approve Knowledge Base". This action saves the structured data to Vercel KV, associating it with the selected agent. This new information is now part of the agent's knowledge base and will be used to answer future user queries.
