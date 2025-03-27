![hero](github.png)

# LeadInsight

LeadInsight is an AI-driven lead management and tracking tool designed to optimize lead engagement and streamline follow-up processes. It processes leads from CSV files, evaluates them using advanced AI models, and provides real-time tracking and automated actions to enhance lead conversion.

## Features

- **CSV Upload and Validation:** Upload CSV files containing leads and validate them against a predefined structure.
- **AI-Powered Lead Processing:** Utilize AI models to evaluate leads and generate personalized messages.
- **Real-Time Tracking:** Monitor lead processing in real-time with a comprehensive logging system.
- **Leads Dashboard:** View, filter, and sort leads. Download leads as CSV files for further analysis.
- **Automated Follow-Up Actions:** Track lead follow-up steps and automate actions like sending messages after a specified delay.
- **Cost Tracking:** Monitor AI processing costs in real-time with an integrated dashboard.

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database
- API keys for AI models (Undrstnd Labs)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/undrstnd-labs/lead-insight.git
   cd lead-insight
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your database URL and API keys:

   ```
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/lead-insight
   ```

4. Run Prisma migrations:

   ```bash
   pnpm db:migrate
   ```

5. Start the development server:
   ```bash
   pnpm run dev
   ```

## Usage

1. **Upload CSV:** Navigate to the home page and upload your CSV file containing leads.
2. **Monitor Processing:** View real-time processing status on the lead processing page.
3. **Manage Leads:** Use the leads dashboard to filter, sort, and download leads.
4. **Track Follow-Up:** Monitor lead follow-up steps and automate actions on the lead tracking page.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [malek@undrstnd.dev](mailto:malek@undrstnd.dev).
