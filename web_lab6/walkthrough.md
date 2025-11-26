# Walkthrough - Web Lab 6: Tabs with PHP Backend & Full-Width Layout

I have implemented the Frontend-Backend interaction for the Tabs component and switched to a Full-Width Fluid Layout with a clean Horizontal Scroll Tabs UI.

## Changes Overview

### 1. Project Structure

- **JavaScript Refactoring**: Moved inline JavaScript to external files in the `js/` directory for better organization.
  - `js/admin.js`: Contains logic for the Admin Page (`index.html`).
  - `js/client.js`: Contains logic for the Client Page (`index2.html`).

### 2. Layout Updates (`style.css`)

- **Full-Width**: Removed body padding and container max-width/margins.
- **Fluid Grid**: Changed grid columns to `minmax(200px, 250px) 1fr minmax(200px, 250px)` to keep sidebars fixed-ish and content fluid.
- **Full Height**: Set `min-height: 100vh` to fill the screen vertically.
- **Scroll Fix**: Added `min-width: 0` to `.block-5` and `max-width: 100%` to `.tabs-container` to ensure the horizontal scrollbar stays within the tabs block.

### 3. Tabs UI Updates (`style.css`)

- **Horizontal Scroll**: The tab headers container scrolls horizontally if there are many tabs.
- **Clean Look**: Scrollbar is hidden for a sleek, Instagram-stories-like feel.
- **No Truncation**: Tabs maintain their full width to show complete titles.

### 4. Backend (`server.php`)

- Created a simple PHP script to handle `GET` and `POST` requests.
- Stores data in a `data.json` file in the same directory.

### 5. Admin Interface (`index.html`)

- Modified the Main Content block (`.block-5`).
- Added a form to input "Tab Title" and "Tab Content".
- Added a "Save to Server" button that sends the data to `server.php` via `fetch` (POST).
- Includes a preview list of added tabs.
- **Sync on Load**: The page now fetches existing tabs from the server when loaded.
- **Delete All**: Added a red "Очистити всі дані" button to clear all tabs from the server (with confirmation).

### 6. Client Interface (`index2.html`)

- Created a new file based on `index.html`.
- Implemented the Tabs component in `.block-5`.
- Fetches data from `server.php` on load and every 3 seconds (auto-update).
- Interactive tabs: Clicking a header shows the corresponding content.

## How to Test

> [!IMPORTANT]
> You need a PHP server running to test the backend functionality.

1.  **Start PHP Server**:
    Open your terminal in the `webLabs/web_lab6` directory and run:

    ```bash
    php -S localhost:8000
    ```

2.  **Verify Layout**:

    - Open `http://localhost:8000/index.html`.
    - The page should now take up the full width and height of the browser window.

3.  **Admin Flow**:

    - Open `http://localhost:8000/index.html`.
    - **Verify Sync**: You should see the list of existing tabs (if any) immediately.
    - Enter a title and content for a tab.
    - Click "Додати Таб".
    - Click "Зберегти на сервер".
    - **Verify Delete**: Click "Очистити всі дані", confirm the dialog, and verify the list clears.

4.  **Client Flow**:
    - Open `http://localhost:8000/index2.html`.
    - Verify tabs appear and auto-update works.
    - **Test Scrolling**: Add many tabs (10+) via Admin and check if you can scroll horizontally in Client.
