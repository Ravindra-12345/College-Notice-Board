import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notice.dart';

/// Service responsible for persisting notices locally using SharedPreferences.
class NoticeStorageService {
  static const String _storageKey = 'college_campus_notices_v1';

  /// Load all saved notices from SharedPreferences.
  Future<List<Notice>> loadNotices() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? noticesJson = prefs.getString(_storageKey);

      if (noticesJson == null || noticesJson.trim().isEmpty) {
        return [];
      }

      final List<dynamic> decodedList = jsonDecode(noticesJson) as List<dynamic>;
      return decodedList
          .map((item) => Notice.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      // Re-throw to let provider handle error states and retry mechanism
      throw Exception('Failed to load notices from local storage: $e');
    }
  }

  /// Save the full list of notices to SharedPreferences as a JSON string.
  Future<void> saveNotices(List<Notice> notices) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> jsonList =
          notices.map((n) => n.toJson()).toList();
      final String encodedJson = jsonEncode(jsonList);
      await prefs.setString(_storageKey, encodedJson);
    } catch (e) {
      throw Exception('Failed to save notices to local storage: $e');
    }
  }

  /// Add a single notice to persistent storage.
  Future<void> addNotice(Notice notice) async {
    final currentNotices = await loadNotices();
    currentNotices.insert(0, notice);
    await saveNotices(currentNotices);
  }

  /// Clear all notices from local storage (useful for resets or testing).
  Future<void> clearAllNotices() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
  }
}
