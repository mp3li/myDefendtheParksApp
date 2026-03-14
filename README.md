![Version](https://img.shields.io/badge/Version-Pre--Release%20v0.1-8A2BE2?labelColor=2E2E2E)
![Status](https://img.shields.io/badge/Status-Active%20Development-8A2BE2?labelColor=2E2E2E)
![Development](https://img.shields.io/badge/Development-Source%20First-8A2BE2?labelColor=2E2E2E)
![Platform](https://img.shields.io/badge/Platform-Expo%20React%20Native-8A2BE2?labelColor=2E2E2E)
![Language](https://img.shields.io/badge/Language-TypeScript-8A2BE2?labelColor=2E2E2E)
![Navigation](https://img.shields.io/badge/Navigation-Expo%20Router-8A2BE2?labelColor=2E2E2E)
![Persistence](https://img.shields.io/badge/Persistence-AsyncStorage-8A2BE2?labelColor=2E2E2E)
![Data](https://img.shields.io/badge/Data-NPS%20API%20%2B%20Native%20Land%20API-8A2BE2?labelColor=2E2E2E)
![Interface](https://img.shields.io/badge/Interface-Mobile%20App-8A2BE2?labelColor=2E2E2E)
![Focus](https://img.shields.io/badge/Focus-Support%20the%20Parks%20%2B%20Indigenous%20History%20Education-8A2BE2?labelColor=2E2E2E)

# myDefendtheParksApp by mp3li

myDefendtheParksApp is an Expo React Native mobile app focused on U.S. national parks, public-land stewardship, and Indigenous history connected to those lands.

*This README is not final and is currently being polished as the app develops*

- Built as a multi-screen mobile app with Expo Router.
- Pulls live park data from the National Park Service API.
- Adds Indigenous land context using the Native Land API.
- Lets users save parks locally and revisit them later.
- In active development before publishing on Apple App Store and Google Play Store.

### What This App Does:
- Helps users explore National Park Service sites by state.
- Shows a "Featured Park of the Day" on the home screen.
- Provides park profile pages with overview, hours, weather, fees, passes, contact info, image gallery, and action links from National Park Service API.
- Adds Indigenous context for park locations, including territories, languages, treaties, and place-name information when available from Native Land API.
- Lets users save and remove parks using persistent local storage.
- Emphasizes accessibility, responsive layout behavior, and clear mobile navigation.

### What This Repo Contains:
<details>
<summary><em>Open What This Repo Contains</em></summary>
<br>

- `learning-react-native-app/`:
  - full Expo React Native source code for the app
  - tabs, dynamic routes, screens, components, hooks, services, and context providers
- `README.md`:
  - repo-level documentation for setup, app flow, and portfolio context
- NPS + Native Land service integration:
  - park lookup by state
  - park detail lookup by park code
  - featured park selection logic
  - Indigenous context lookup by coordinates
- Local persistence layer:
  - saved parks are stored with AsyncStorage and restored on app launch

</details>

--------------------------------------------------

### Table of Contents:
<details>
<summary><em>Open Table of Contents</em></summary>
<br>

- [What This App Does](#what-this-app-does)
- [What This Repo Contains](#what-this-repo-contains)
- [Requirements](#requirements)
  - [What beginners should expect](#what-beginners-should-expect)
  - [How this release is provided](#how-this-release-is-provided)
  - [Runtime requirements list](#runtime-requirements-list)
  - [Beginner-friendly requirements download links (if needed)](#beginner-friendly-requirements-download-links-if-needed)
  - [Terminal requirements install instructions](#terminal-requirements-install-instructions)
  - [Notes](#notes)
- [How to Download, Open, and Use myDefendtheParksApp](#how-to-download-open-and-use-mydefendtheparksapp)
  - [How to Download myDefendtheParksApp](#how-to-download-mydefendtheparksapp)
  - [How to Open myDefendtheParksApp](#how-to-open-mydefendtheparksapp)
  - [How to Use myDefendtheParksApp](#how-to-use-mydefendtheparksapp)
- [Full Feature List](#full-feature-list)
  - [Home Screen](#home-screen)
  - [States Screen](#states-screen)
  - [State Detail Screen](#state-detail-screen)
  - [Park Profile Screen](#park-profile-screen)
  - [Saved Parks Screen](#saved-parks-screen)
  - [Shared Systems](#shared-systems)
- [Future Updates](#future-updates)
- [Development Notes](#development-notes)
  - [Development Status](#development-status)
  - [Development & Testing Environment](#development--testing-environment)
- [Source Availability](#source-availability)
- [Technical Specs](#technical-specs)

</details>

--------------------------------------------------

### Requirements:
<details>
<summary><em>Open Requirements</em></summary>
<br>

#### What beginners should expect:
- This repository is source code, not a double-click compiled app package.
- You will run it through Expo from a terminal.
- If you have never used Expo before, the easiest starting point is:
  - install Node.js
  - install project dependencies with `npm install`
  - start the app with `npx expo start`
  - open it in Expo Go, iOS Simulator, Android Emulator, or web preview

#### How this release is provided:
- This app is currently provided as a GitHub source repository.
- The main application lives inside `learning-react-native-app/`.
- There are no compiled desktop binaries or mobile store releases included in this repo at this time.
- Source availability for the current published version is governed by the custom terms in `LICENSE`, and future versions may be distributed differently.

#### Runtime requirements list:
- Node.js 20+ recommended
- npm
- Expo CLI via `npx expo`
- One of the following to preview the app:
  - Expo Go on a phone
  - iOS Simulator
  - Android Emulator
  - web browser via Expo web
- Optional but recommended:
  - `EXPO_PUBLIC_NPS_API_KEY`
  - `EXPO_PUBLIC_NATIVE_LAND_API_KEY`

#### Beginner-friendly requirements download links (if needed):
- Node.js: https://nodejs.org/
- Expo: https://docs.expo.dev/
- Expo Go: https://expo.dev/go
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode/

#### Terminal requirements install instructions:

##### macOS
1. Install Node.js 20+.
   - easiest beginner option: download from `nodejs.org`
   - Homebrew option: `brew install node`
2. Confirm installs:
   - `node --version`
   - `npm --version`
3. Open a terminal in `learning-react-native-app/`.
4. Install dependencies:
   - `npm install`
5. Start Expo:
   - `npx expo start`

##### Windows
1. Install Node.js 20+.
   - easiest beginner option: download from `nodejs.org`
   - winget option: `winget install OpenJS.NodeJS`
2. Confirm installs:
   - `node --version`
   - `npm --version`
3. Open a terminal in `learning-react-native-app/`.
4. Install dependencies:
   - `npm install`
5. Start Expo:
   - `npx expo start`

#### Notes:
- `EXPO_PUBLIC_NATIVE_LAND_API_KEY` is important if you want Indigenous context records to load reliably.
- Add your own `EXPO_PUBLIC_NPS_API_KEY` if you want live NPS data in your local setup.
- Saved parks are local to the device/emulator because they use AsyncStorage.
- The app currently uses the folder/app config name `soft210` in some Expo metadata because it grew out of course work, but the app itself is being presented and documented as `myDefendtheParksApp`.

</details>

--------------------------------------------------

### How to Download, Open, and Use myDefendtheParksApp:

#### How to Download myDefendtheParksApp:
- Clone this repo:
  - `git clone https://github.com/mp3li/myDefendtheParksApp.git`
- Or download the repository ZIP from GitHub and extract it.

#### How to Open myDefendtheParksApp:
- Open a terminal in the app folder:
  - `cd myDefendtheParksApp/learning-react-native-app`
- Install dependencies:
  - `npm install`
- Start the Expo development server:
  - `npx expo start`
- From there you can:
  - press `i` for iOS Simulator
  - press `a` for Android Emulator
  - press `w` for web
  - scan the QR code with Expo Go on a physical phone

#### How to Use myDefendtheParksApp:
- Start on the Home tab:
  - read the project intro
  - review the Featured Park of the Day
  - save or remove the featured park
- Open the States tab:
  - search a state
  - select it
  - browse parks returned by the NPS API
- Open a Park Profile:
  - read the overview
  - review Indigenous context when available
  - check hours, address, weather, fees, passes, images, and support links
- Open the Saved Parks tab:
  - revisit parks you saved earlier
  - remove parks from the list

--------------------------------------------------


### Full Feature List:

<details>
<summary><em>Open Full Feature List</em></summary>
<br>

#### Home Screen:
- Introductory project messaging about conservation, land history, and stewardship.
- Featured Park of the Day:
  - selected from live NPS data using date-based logic
  - includes image, title, state, save/remove action, and full park content preview
- Quick actions for:
  - browsing all 50 states
  - opening saved parks
  - refreshing the featured park

#### States Screen:
- Searchable list of all 50 U.S. states.
- Filters by state name or abbreviation.
- Simple tap-through navigation into each state's park list.

#### State Detail Screen:
- Loads parks for the selected state from the NPS API.
- Sort order is alphabetical by park name.
- Each park row can include:
  - NPS image
  - full park name
  - designation
  - brief description
- Opens a dedicated park profile page for the selected park.

#### Park Profile Screen:
- Full park profile built from NPS park data.
- Indigenous context lookup using the park's coordinates and the Native Land API.
- Content sections include:
  - Indigenous peoples connected to the land
  - place-name meanings when returned
  - territories, languages, and treaties
  - overview/description
  - activities
  - topics
  - weather
  - operating hours
  - address
  - contact information
  - entrance fees
  - entrance passes
  - image gallery with tap-to-expand modal
  - "Get Involved and Defend this Park" resource links
- Supports saving/removing the park from the local saved list.
- Refreshes data when the screen regains focus.

#### Saved Parks Screen:
- Hydrates local saved parks from AsyncStorage on startup.
- Lists saved parks with:
  - name
  - designation
  - state codes
  - saved date/time
- Supports reopening a saved park profile.
- Supports removing saved items from the list.
- Tab badge updates to reflect current saved count.

#### Shared Systems:
- Responsive layout helpers for phone/tablet sizing.
- Accessible button component designed around minimum touch-target sizing.
- Snackbar system for info/error feedback.
- Theme-aware UI behavior.
- Mobile-first navigation using Expo Router tabs plus dynamic routes.

</details>

--------------------------------------------------

### Future Updates:
- Continue polishing README, repo naming, and public presentation.
- Replace remaining course-era naming where appropriate.
- Strengthen testing and validation beyond linting/manual checks.
- Improve empty states, loading states, and API failure messaging.
- Expand portfolio documentation around architecture and development decisions.

--------------------------------------------------

### Development Notes:

<details>
<summary><em>Open Development Notes</em></summary>
<br>

#### Development Status:
- Active development.
- Originally built as course work, now being reshaped into a stronger standalone app.
- Core app flow is already implemented:
  - home
  - states search
  - state park list
  - park detail
  - saved parks persistence
- Current work is centered on cleanup, presentation, and continued polish.

#### Development & Testing Environment:
- Expo `~54.0.31`
- React `19.1.0`
- React Native `0.81.5`
- Expo Router `~6.0.21`
- TypeScript `~5.9.2`
- Local checks currently available in repo:
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npx expo start`

</details>

--------------------------------------------------

### Source Availability:
- This repository is source-visible on GitHub.
- The current published version is provided under the custom source-available terms in `LICENSE`.
- This is not an open-source license.
- Future versions of this project may not remain source-available.
- Please do not assume unrestricted reuse, redistribution, or commercial use rights.

--------------------------------------------------

### Technical Specs:

<details>
<summary><em>Open Technical Specs</em></summary>
<br>

- App type:
  - Expo React Native mobile app
- Language:
  - TypeScript
- Routing:
  - Expo Router
- Data sources:
  - National Park Service API
  - Native Land API
- Persistence:
  - AsyncStorage
- Core app sections:
  - Home
  - States
  - Park Profile
  - Saved Parks

</details>

--------------------------------------------------
