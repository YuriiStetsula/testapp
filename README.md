# BSG App

A React Native mobile application for Börse Stuttgart, built with Expo Router and featuring dynamic menu navigation and deep link support.

## Setup Instructions

### Prerequisites

- Node.js (v20.19.x or higher recommended)
- npm
- Expo CLI (optional, but recommended)
- For iOS development: Xcode and CocoaPods
- For Android development: Android Studio and JDK

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bsgapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the App

- **Prebuild native projects** (required before first run on iOS/Android, or when native config changes):

  ```bash
   npx expo prebuild
  ```

  For iOS, after prebuild, install CocoaPods dependencies:

  ```bash
   cd ios
   pod install
   cd ..
  ```

- **Start the development server:**

  ```bash
   npm start
  ```

- **Run on iOS:**

  ```bash
   npm run ios
  ```

- **Run on Android:**

  ```bash
   npm run android
  ```

- **Run on Web:**

  ```bash
   npm run web
  ```

## Framework Choice

This project uses **Expo Router** (v6) with React Native (v0.81.5) and Expo SDK (~54). Key framework decisions:

- **Expo Router**: File-based routing system that provides native navigation with a web-like routing experience. Enables deep linking out of the box and simplifies navigation setup.

- **React Native**: Cross-platform mobile development framework allowing code sharing between iOS and Android.

- **TanStack Query (React Query)**: Used for server state management, providing caching, background updates, and error handling for API requests.

- **React Navigation Drawer**: Provides the drawer navigation component for the menu system.

- **TypeScript**: Full type safety throughout the application.

The app uses Expo's new architecture (`newArchEnabled: true`) and supports typed routes with React Compiler enabled.

## Menu Rendering Approach

The menu system is dynamically fetched from a remote API and rendered as an expandable tree structure in a right-side drawer.

### Architecture

1. **Data Fetching**: The menu data is fetched using TanStack Query via `useMenuQuery()` hook, which calls the API endpoint

2. **Menu Structure**: Menu items are hierarchical with support for nested submenus. Each menu item contains:
   - `menuLabel`: Display text
   - `url`: Navigation URL
   - `secure`: Security flag
   - `menuItems`: Optional array of child menu items

3. **Rendering**: The `DrawerContent` component:
   - Displays a branded header with "Börse Stuttgart" title
   - Uses `DrawerTreeFlatList` to render the menu items in a flat list with expand/collapse functionality
   - Manages expanded state for nested menu items using a `Set` of expanded keys
   - Handles navigation by calling the `onNavigate` callback with the selected menu URL

4. **Navigation**: When a menu item is selected, it navigates to the main WebView screen with the selected URL as a parameter, which then loads the corresponding web content.

## Deep Link Handling

Deep linking is handled using Expo Router's catch-all route pattern (`[...deeplink].tsx`).

### Implementation

- **Route Pattern**: The `src/app/[...deeplink].tsx` file catches all unmatched routes and processes them as deep links.

- **URL Scheme**: The app uses the custom URL scheme `bsgapp://` (configured in `app.config.ts`).

- **Current Handlers**:
  - `bsgapp://events` → Redirects to `/anlegerclub/events/`
  - All other deep links → Redirect to home page (`/`)

- **Processing Flow**:
  1. Deep link URL is parsed to extract route segments
  2. The first segment determines the route type
  3. Appropriate redirect is performed using Expo Router's `Redirect` component
  4. Redirects pass URL parameters to the main index route, which loads the content in a WebView

- **Testing Deep Links**: You can test deep links via terminal using the `uri-scheme` package:

  ```bash
  npx uri-scheme open bsgapp://events --ios
  npx uri-scheme open bsgapp://events --android
  ```

### Adding New Deep Links

To add new deep link handlers, update the `DeepLinkCatchAll` component in `src/app/[...deeplink].tsx`:

```typescript
if (route === 'your-route') {
  return (
    <Redirect
      href={{
        pathname: '/',
        params: {
          url: '/your/target/url/',
        },
      }}
    />
  )
}
```
