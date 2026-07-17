# BetterHealth Website Design

Static bilingual website for BetterHealth, based on the approved HTML design prototype.

## Local preview

Open `index.html` directly in a browser, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The included GitHub Actions workflow publishes the repository to GitHub Pages whenever `main` is updated. In the repository settings, set **Pages → Source** to **GitHub Actions** if it is not selected automatically.

## Contact form

The public form intentionally does not transmit medical information until a verified secure endpoint is configured. Set `config.contactEndpoint` near the bottom of `index.html` to an HTTPS serverless/API endpoint that accepts JSON.

Do not connect health-related form fields to advertising platforms, ordinary analytics logs, or an insecure email relay.

## Content requiring verification before launch

- Full practice address
- Telephone and secure contact address
- Office hours
- Legal entity and Swiss Impressum information
- Privacy policy and terms
- Correct emergency contacts
- Final clinician biographies and credentials
- Secure form endpoint
