# 🎓 Campus Notice Board – College Android Application

A modern, responsive, and offline-capable College Notice Board Android application developed using **Flutter (3.35+)**, **Dart with null safety**, **Provider State Management**, **SharedPreferences**, and **Material Design 3**.

Developed as a major academic project to replace traditional physical college notice boards with an organized, searchable, and department-specific digital notice board.

---

## 📱 Application Overview & Key Features

- **Four Mandatory Screens**:
  1. **Home / Notice List Screen**: View all active announcements with search bar, department filter chips, loading indicator, error state with retry, and empty state.
  2. **Notice Details Screen**: Clean typography layout showing complete notice title, department badge, exact published timestamp, full description, and quick copy/delete actions.
  3. **Add New Notice Screen**: Validated form with Title (character counter), Department dropdown (CSE, ECE, EEE, ME, Civil, IT), multiline Description, and Date picker.
  4. **Academic Departments Screen**: Grid of engineering department cards with custom icons and live notice counters. Tapping filters notices specific to that branch.
- **Offline Persistence**: Uses `SharedPreferences` to serialize and store notices in JSON format locally. No Firebase or paid APIs required; works completely offline!
- **State Management**: Built on `Provider` with `ChangeNotifier` (`NoticeProvider`) ensuring reactive UI updates, centralized business logic, and error recovery.
- **Material Design 3**: Modern Blue and White collegiate theme, rounded cards, subtle elevation, and accessible contrast.

---

## 📸 Screenshots Placeholders

| Home Notice Feed | Notice Details | Add Notice Form | Department Grid |
|:---:|:---:|:---:|:---:|
| `[Screenshot: Home Feed with search & chips]` | `[Screenshot: Formatted Notice Details]` | `[Screenshot: Form with Validation Errors]` | `[Screenshot: Department Cards Grid]` |

---

## 🏗️ Project Architecture & Structure

```
campus_notice_board/
├── android/                        # Android native project configuration
│   └── app/
│       ├── build.gradle            # Android Gradle build config (minSdk 21, targetSdk 34)
│       └── src/main/
│           └── AndroidManifest.xml # App package, permissions, and launcher setup
├── lib/
│   ├── main.dart                   # Application entry point with MultiProvider / ChangeNotifier
│   ├── models/
│   │   └── notice.dart             # Notice data model with JSON serialization
│   ├── providers/
│   │   └── notice_provider.dart    # ChangeNotifier provider handling fetch, add, filter & search
│   ├── services/
│   │   └── notice_storage_service.dart # SharedPreferences local storage helper
│   ├── screens/
│   │   ├── home_screen.dart        # Screen 1: Home notice list with search & chips
│   │   ├── notice_detail_screen.dart # Screen 2: Notice details screen
│   │   ├── add_notice_screen.dart  # Screen 3: Validated notice creation form
│   │   └── departments_screen.dart # Screen 4: Department portal cards & filtered view
│   ├── widgets/
│   │   ├── notice_card.dart        # Reusable notice summary card
│   │   ├── department_card.dart    # Department card with icon & notice count
│   │   ├── empty_state.dart        # Empty list state widget
│   │   └── loading_widget.dart     # Loading indicator & error retry widget
│   └── theme/
│       └── app_theme.dart          # Material Design 3 theme (Blue & White palette)
├── test/
│   └── widget_test.dart            # Flutter widget tests for validation, card, and empty state
├── pubspec.yaml                    # Flutter dependencies (provider, shared_preferences, intl)
└── README.md                       # Complete documentation & run guide
```

---

## 🚀 Getting Started

### Prerequisites

1. Install **Flutter SDK** (Version 3.22.0 or newer).
2. Install **Android Studio** with the **Flutter** and **Dart** plugins.
3. Install **Android SDK** (API Level 34 recommended) and set up an Android Emulator or physical device with USB Debugging enabled.

### Verification Checklist

Check your Flutter installation in your terminal:
```bash
flutter doctor
```
Ensure that Flutter and Android toolchain have green checkmarks.

---

## 💻 Instructions to Run in Android Studio

1. **Clone or Extract the Project**:
   Place the `campus_notice_board` directory on your machine.
2. **Open in Android Studio**:
   - Open Android Studio.
   - Click **Open** and select the `campus_notice_board` project directory.
   - Wait for Android Studio to index files.
3. **Install Dependencies**:
   Open the built-in terminal or run:
   ```bash
   flutter pub get
   ```
4. **Select Device**:
   - In the top toolbar device selector, pick your running Android Emulator or connected physical phone.
5. **Run the App**:
   - Click the green **Run (▶)** button or press `Shift + F10` (Windows/Linux) or `Control + R` (macOS).
   - Alternatively, execute from the terminal:
     ```bash
     flutter run
     ```

---

## 🧪 Running Widget Tests

Run the included automated widget tests verifying the posting form validation, notice card rendering, and empty states:

```bash
flutter test
```

To run with full test coverage and verbosity:
```bash
flutter test --reporter expanded
```

---

## 📦 Instructions to Generate a Release APK

To build a standalone APK for college presentation and installation on real Android devices:

1. **Run Static Code Analysis**:
   ```bash
   flutter analyze
   ```
2. **Clean previous build artifacts**:
   ```bash
   flutter clean
   flutter pub get
   ```
3. **Build the Release APK**:
   ```bash
   flutter build apk --release
   ```
   *For split per-ABI APKs (smaller file size):*
   ```bash
   flutter build apk --split-per-abi
   ```
4. **Locate the Output APK**:
   The generated release APK file will be located at:
   ```
   build/app/outputs/flutter-apk/app-release.apk
   ```
5. **Install onto Device via ADB**:
   ```bash
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

---

## 👥 Team Contribution Section

| Name / Roll No. | Role & Modules Handled |
|:---|:---|
| **Student 1 (Team Lead)** | Architecture setup, `NoticeProvider` state management, `notice_storage_service.dart`, SharedPreferences integration. |
| **Student 2** | `HomeScreen`, Search bar, Department filtering chips, `EmptyState` and `LoadingWidget`. |
| **Student 3** | `AddNoticeScreen`, Form validation logic, character length counters, DatePicker integration. |
| **Student 4** | `NoticeDetailScreen`, `DepartmentsScreen`, Material 3 theme (`app_theme.dart`), widget tests. |

---

## 📝 Viva / Project Defense Questions

1. **Why use Provider and ChangeNotifier instead of setState?**
   - Centralizes notice data in a single source of truth.
   - When a notice is added in `AddNoticeScreen`, calling `notifyListeners()` instantly updates the `HomeScreen` and `DepartmentsScreen` without tight coupling or messy callbacks.
2. **How does data persist without internet or backend database?**
   - Notices are serialized into JSON format and written into device storage via `SharedPreferences`. The data survives app restarts and works completely offline.
3. **How does the search and filter work together?**
   - `NoticeProvider.filteredNotices` computes the intersection of `_selectedDepartment` and `_searchQuery`, returning matched items instantaneously.
