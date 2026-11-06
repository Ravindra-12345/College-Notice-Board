# 🎓 Campus Notice Board – College Android Application (Flutter)

A modern, responsive, and offline-capable College Notice Board application developed using **Flutter (3.35+)**, **Dart with null safety**, **Provider State Management**, **SharedPreferences**, and **Material Design 3**.

---

## 📂 Project Structure

```
campus_notice_board/
├── android/
│   └── app/
│       ├── build.gradle
│       └── src/main/AndroidManifest.xml
├── lib/
│   ├── main.dart                   # Application entry point with ChangeNotifierProvider
│   ├── models/
│   │   └── notice.dart             # Notice model with JSON serialization
│   ├── providers/
│   │   └── notice_provider.dart    # Central state management with ChangeNotifier
│   ├── services/
│   │   └── notice_storage_service.dart # SharedPreferences JSON persistence
│   ├── screens/
│   │   ├── home_screen.dart        # Screen 1: Home notice feed with search & filter chips
│   │   ├── notice_detail_screen.dart # Screen 2: Notice details screen
│   │   ├── add_notice_screen.dart  # Screen 3: Validated notice posting form
│   │   └── departments_screen.dart # Screen 4: 6 Engineering department cards & filtered view
│   ├── widgets/
│   │   ├── notice_card.dart        # Reusable notice card
│   │   ├── department_card.dart    # Department card with icon & live counter
│   │   ├── empty_state.dart        # Friendly empty state widget
│   │   └── loading_widget.dart     # Loading indicator & error retry widget
│   └── theme/
│       └── app_theme.dart          # Material Design 3 Blue & White palette
├── test/
│   └── widget_test.dart            # Flutter widget tests for validation, card, and empty state
├── pubspec.yaml                    # Flutter dependencies (provider, shared_preferences, intl)
└── README.md                       # Complete documentation & run guide
```

---

## ⚡ Quick Start Commands

```bash
# 1. Fetch dependencies
flutter pub get

# 2. Analyze code for errors or warnings
flutter analyze

# 3. Run automated widget tests
flutter test

# 4. Run on connected Android phone or emulator
flutter run

# 5. Build release APK for college submission
flutter build apk --release
```

---

## 🌟 Interactive Preview & Zip Exporter

The web application hosted in this repository provides:
1. **Interactive Android 14 Device Simulator**: Test all four screens, real-time search, department filtering, posting new notices with validation, and persistence directly in your browser.
2. **Flutter Project ZIP Exporter**: Click **"Flutter Code & ZIP"** in the web app to download `campus_notice_board_flutter.zip` containing all source code ready to import into Android Studio!
3. **Android Studio & Viva Guide**: Comprehensive defense questions, step-by-step terminal execution, and release APK instructions.
