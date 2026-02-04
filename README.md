# PMB Frontend

This is the frontend for the PMB Pascasarjana system, built with Nuxt 3/4 and Nuxt UI.

## Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

## Project Structure

- `pages/` - Application routes
- `layouts/` - Layouts (default, pendaftar, admin)
- `components/` - Vue components
- `tailwind.config.ts` - Tailwind configuration including custom colors and fonts
- `nuxt.config.ts` - Nuxt configuration

## Implemented Pages

- **Public**:
  - `/` - Landing Page & Registration
  - `/login` - Pendaftar Login
  - `/cek-kelulusan` - Cek Kelulusan
  - `/login/admin` - Admin/Staff Login
- **Pendaftar**:
  - `/pendaftar` - Dashboard
  - `/pendaftar/biodata` - Biodata Form
  - `/pendaftar/dokumen` - Document Upload
- **Admin**:
  - `/admin` - Dashboard Overview

## Notes

- The UI is sliced based on the provided design HTML/Tailwind.
- Logic is currently mocked (no API integration yet).
