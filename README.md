# BetterHealth Website Design

Production-ready static implementation of the supplied BetterHealth bilingual website design.

## Included

- Responsive English/German website
- Separate URLs for Home, Our Approach, Programs, Assessment, FAQ, and Contact
- Accessible mobile navigation and FAQ accordions
- Persisted language preference
- Reduced-motion and keyboard support
- GitHub Pages deployment workflow
- Contact form validation, honeypot protection, asynchronous submission states, and honest failure handling

## Local preview

No build step is required.

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

The repository contains a Pages workflow. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions** if it is not already selected.

Expected project URL:

`https://hendrivi.github.io/BetterHealth-Website-Design/`

## Connect the consultation form

GitHub Pages cannot receive or securely store form submissions by itself. Before public launch, connect a privacy-reviewed HTTPS endpoint.

In `contact/index.html`, find:

```html
<form class="form" data-endpoint="" id="consultation-form" method="post">
```

Set `data-endpoint` to your approved form processor or backend endpoint. It must accept `multipart/form-data` and return a successful HTTP response. Do not send sensitive medical information to a generic marketing form service.

Until an endpoint is configured, the form does not show a false success message. It explains that delivery is not connected.

## Verify before public launch

- Exact practice address, telephone number, office hours, and secure contact details
- Final form endpoint and data-retention policy
- Privacy policy, terms, medical disclaimer, cookie policy, and Swiss Impressum
- Physician and team biographies and professional credentials
- Statements about what each fee includes
- External diagnostics and partner availability
- Correct Swiss emergency information
- Custom domain and canonical URLs

All medical and legal copy should receive final Swiss professional review.
