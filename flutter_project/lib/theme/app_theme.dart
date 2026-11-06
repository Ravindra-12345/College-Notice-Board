import 'package:flutter/material.dart';

/// App-wide Material Design 3 theme with a professional Blue and White palette.
class AppTheme {
  // Brand colors
  static const Color primaryBlue = Color(0xFF1E40AF); // Deep Indigo/Royal Blue
  static const Color secondaryBlue = Color(0xFF3B82F6); // Vibrant Blue
  static const Color accentBlue = Color(0xFF60A5FA); // Sky Blue
  static const Color lightBackground = Color(0xFFF8FAFC); // Clean slate white
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);

  /// List of college departments with official names and abbreviations.
  static const List<String> departments = [
    'Computer Science and Engineering (CSE)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology (IT)',
  ];

  /// Get a color badge based on department
  static Color getDepartmentColor(String department) {
    if (department.contains('CSE') || department.contains('Computer')) {
      return const Color(0xFF2563EB); // Royal Blue
    } else if (department.contains('ECE') || department.contains('Electronics')) {
      return const Color(0xFF7C3AED); // Purple
    } else if (department.contains('EEE') || department.contains('Electrical')) {
      return const Color(0xFFD97706); // Amber
    } else if (department.contains('Mechanical')) {
      return const Color(0xFFDC2626); // Crimson
    } else if (department.contains('Civil')) {
      return const Color(0xFF059669); // Emerald
    } else if (department.contains('IT') || department.contains('Information')) {
      return const Color(0xFF0284C7); // Cyan
    }
    return primaryBlue;
  }

  /// Get icon data based on department
  static IconData getDepartmentIcon(String department) {
    if (department.contains('CSE') || department.contains('Computer')) {
      return Icons.computer_rounded;
    } else if (department.contains('ECE') || department.contains('Electronics')) {
      return Icons.memory_rounded;
    } else if (department.contains('EEE') || department.contains('Electrical')) {
      return Icons.bolt_rounded;
    } else if (department.contains('Mechanical')) {
      return Icons.precision_manufacturing_rounded;
    } else if (department.contains('Civil')) {
      return Icons.architecture_rounded;
    } else if (department.contains('IT') || department.contains('Information')) {
      return Icons.devices_other_rounded;
    }
    return Icons.school_rounded;
  }

  /// Light theme definition
  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: primaryBlue,
      brightness: Brightness.light,
      primary: primaryBlue,
      secondary: secondaryBlue,
      surface: cardBackground,
      background: lightBackground,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: lightBackground,
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: primaryBlue,
        foregroundColor: Colors.white,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          letterSpacing: 0.2,
        ),
        iconTheme: IconThemeData(color: Colors.white),
      ),
      cardTheme: CardTheme(
        elevation: 1.5,
        color: cardBackground,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryBlue, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        labelStyle: const TextStyle(color: textMuted),
        hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primaryBlue,
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFFF1F5F9),
        selectedColor: primaryBlue.withOpacity(0.15),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
      ),
    );
  }
}
