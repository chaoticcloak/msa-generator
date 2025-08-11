# MSA Generator

A production-ready web application for generating professional Mutual Service Agreement (MSA) documents. Built with Flask and designed for deployment on Render.

## Features

- **Dynamic MSA Generation**: Create customized MSA documents based on client information
- **Flexible Pricing Models**: Support for both workstation-based and user-based pricing
- **Optional Services**: Include compliance and security plus services
- **Professional Templates**: Uses Word document templates for consistent formatting
- **User-Friendly Interface**: Clean, responsive web interface
- **Production Ready**: Configured for deployment on Render with gunicorn

## Deployment

This application is configured for deployment on Render:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select this repository
4. Render will automatically detect the `render.yaml` configuration
5. Deploy!

## Local Development

### Prerequisites

- Python 3.11+
- pip

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd msa-generator

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The application will be available at `http://localhost:5000`

## Configuration

### Environment Variables

- `SECRET_KEY`: Flask secret key (automatically generated on Render)
- `PORT`: Port number (automatically set by Render)

### Template Customization

The application uses `original_template.docx` as the base template. To customize:

1. Edit the template file with your preferred content
2. Use placeholders like `{{client_name}}` for dynamic content
3. Redeploy the application

## Usage

1. **Fill Client Information**: Enter client details including name, email, address, and phone
2. **Select Services**: Choose additional services (Compliance, Security Plus)
3. **Choose Pricing Model**: Select between workstation-based or user-based pricing
4. **Generate Document**: Click generate to create and download the MSA

## File Structure

```
msa-generator/
├── app.py                 # Main Flask application
├── docx_builder.py        # Document generation logic
├── original_template.docx # Word document template
├── templates/
│   └── form.html         # Web form template
├── static/
│   ├── css/style.css     # Styles
│   └── js/form.js        # Client-side JavaScript
├── requirements.txt       # Python dependencies
├── Procfile              # Gunicorn configuration
├── render.yaml           # Render deployment config
├── runtime.txt           # Python version specification
└── README.md             # This file
```

## Technical Details

- **Framework**: Flask 2.3.3
- **Document Processing**: python-docx 0.8.11
- **Production Server**: gunicorn 21.2.0
- **Python Version**: 3.11.0

## License

Proprietary - All rights reserved