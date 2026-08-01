# Agastya Kommanamanchi — Portfolio

A fast, accessible, dependency-free portfolio built with semantic HTML, modern CSS and lightweight JavaScript. The site is designed for GitHub Pages at [agstya.github.io](https://agstya.github.io/).

## Preview locally

Open `index.html` directly, or serve this folder with any static web server. No build command or package installation is required.

## Content maintenance

- **Current positioning, metrics, experience, case studies, patent, education and conferences:** edit `index.html`.
- **Credly credentials, GitHub repositories, DEV articles and Tableau visualizations:** edit the corresponding arrays in `assets/js/data.js`.
- **Professional and casual photos:** replace the `.webp` and `.jpg` files in `assets/images/`, preserving filenames and dimensions where possible.
- **Social sharing preview:** replace `assets/images/og-card.png` with a 1200 × 630 PNG.
- **Colors and layout:** edit the design tokens near the top of `assets/css/site.css`.

When adding an external item, use its exact public URL. Mark GitHub samples and forks with `fork: true`; use `exact: false` for a Tableau title when only the profile-level destination has been verified.

## Publish free on GitHub Pages

1. On GitHub, create a new **public** repository named exactly `agstya.github.io` under the `agstya` account. Do not add starter files—the finished site already includes them.
2. Copy the contents of this folder to the repository root. Keep `.nojekyll`; do not commit the locally ignored source résumé or original portrait files.
3. Commit the files to the `main` branch and push them to GitHub.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.
6. After GitHub finishes the first deployment, verify `https://agstya.github.io/` in a private browser window and test the email and profile links.

GitHub may need several minutes for the first publication. A custom domain can be added later without changing the site architecture.

## Pre-publish checklist

- Confirm the current role and dates.
- Refresh public counts and destinations for Credly, GitHub, Tableau and DEV.
- Test both themes at phone and desktop sizes.
- Open every newly added external link.
- Check that no phone number, citizenship detail or private source document was added.

