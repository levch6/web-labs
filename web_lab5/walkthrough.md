### 1. Text Swap (Block 2 & 6)

- **Behavior**: Upon page load, the content of the Header (Block 2, "Світ Подорожей") and Footer (Block 6, "© 2025...") is swapped.
- **Verification**: Check if the footer text is now at the top and the header text is at the bottom.

### 2. Rhombus Area Calculation

- **Behavior**: Calculates the area of a rhombus (d1=12, d2=16) and displays it in Block 5.
- **Verification**: Look for "Площа ромба..." at the bottom of the main content area (Block 5).

### 3. Min/Max Calculator (Cookies)

- **Behavior**:
  - A form with 10 number inputs appears in Block 5.
  - **Submit**: Calculates Min/Max, shows an alert, and saves the result to a cookie.
  - **Reload**:
    - If a cookie exists, a confirmation dialog appears.
    - **OK**: Deletes cookie, reloads page, shows form again.
    - **Cancel**: Shows alert about existing cookies, form remains hidden.

### 4. Border Color (Focus & LocalStorage)

- **Behavior**:
  - Click or Tab to **Block 1 (Left Sidebar)** or **Block 4 (Right Sidebar)** to focus it.
  - A prompt will ask for a border color (e.g., `red`, `#00ff00`).
  - The entered color is applied to **all** blocks (1-6) and saved.
  - Clicking other blocks (2, 3, 5, 6) will **not** trigger the prompt.
  - **Reload**: The saved border color is restored automatically.

### 5. Image Gallery (Selection & LocalStorage)

- **Behavior**:
  - Select text in the Footer Slogan (Block Y, now likely in Block 2 due to swap, or Block 6 depending on swap logic - _Note: The swap moves innerHTML, but the class `.footer-slogan` moves with it. So select text in the block that contains "© 2025..."_).
  - A form "Додати зображення" appears in Block 5.
  - **Add**: Enter a URL and click "Зберегти". Image appears in the Right Sidebar (Block 4).
  - **Clear**: Click "Видалити все" to remove images and clear storage.
