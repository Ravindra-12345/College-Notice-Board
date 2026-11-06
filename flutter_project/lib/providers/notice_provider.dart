import 'package:flutter/foundation.dart';
import '../models/notice.dart';
import '../services/notice_storage_service.dart';

enum NoticeLoadingStatus { initial, loading, loaded, error }

/// State management provider for notices using ChangeNotifier.
class NoticeProvider with ChangeNotifier {
  final NoticeStorageService _storageService;

  NoticeProvider({NoticeStorageService? storageService})
      : _storageService = storageService ?? NoticeStorageService();

  List<Notice> _notices = [];
  NoticeLoadingStatus _status = NoticeLoadingStatus.initial;
  String _errorMessage = '';
  String _searchQuery = '';
  String _selectedDepartment = 'All';

  // Getters
  NoticeLoadingStatus get status => _status;
  bool get isLoading => _status == NoticeLoadingStatus.loading;
  bool get hasError => _status == NoticeLoadingStatus.error;
  String get errorMessage => _errorMessage;
  String get searchQuery => _searchQuery;
  String get selectedDepartment => _selectedDepartment;

  /// Returns all raw notices stored in memory.
  List<Notice> get allNotices => List.unmodifiable(_notices);

  /// Returns notices filtered by both department and search query.
  List<Notice> get filteredNotices {
    return _notices.where((notice) {
      final matchesDepartment = _selectedDepartment == 'All' ||
          notice.department.toLowerCase() == _selectedDepartment.toLowerCase();

      final matchesSearch = _searchQuery.isEmpty ||
          notice.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          notice.description.toLowerCase().contains(_searchQuery.toLowerCase());

      return matchesDepartment && matchesSearch;
    }).toList();
  }

  /// Get count of notices for a specific department
  int getNoticeCountForDepartment(String departmentName) {
    return _notices
        .where((n) => n.department.toLowerCase() == departmentName.toLowerCase())
        .length;
  }

  /// Load notices from local SharedPreferences storage.
  Future<void> fetchNotices() async {
    _status = NoticeLoadingStatus.loading;
    _errorMessage = '';
    notifyListeners();

    try {
      _notices = await _storageService.loadNotices();
      // Sort notices so newest appear first
      _notices.sort((a, b) => b.publishedDate.compareTo(a.publishedDate));
      _status = NoticeLoadingStatus.loaded;
    } catch (e) {
      _status = NoticeLoadingStatus.error;
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
    } finally {
      notifyListeners();
    }
  }

  /// Retry fetching notices after an error.
  Future<void> retry() async {
    await fetchNotices();
  }

  /// Add a new notice, persist to local storage, and notify listeners.
  Future<bool> addNotice({
    required String title,
    required String department,
    required String description,
    required DateTime publishedDate,
  }) async {
    try {
      final newNotice = Notice(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title.trim(),
        department: department.trim(),
        description: description.trim(),
        publishedDate: publishedDate,
      );

      _notices.insert(0, newNotice);
      await _storageService.saveNotices(_notices);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to save notice: $e';
      notifyListeners();
      return false;
    }
  }

  /// Delete a notice by ID
  Future<void> deleteNotice(String id) async {
    _notices.removeWhere((notice) => notice.id == id);
    await _storageService.saveNotices(_notices);
    notifyListeners();
  }

  /// Set the search filter query
  void setSearchQuery(String query) {
    _searchQuery = query.trim();
    notifyListeners();
  }

  /// Set the department filter
  void setDepartment(String department) {
    _selectedDepartment = department;
    notifyListeners();
  }

  /// Reset all filters back to default
  void clearFilters() {
    _searchQuery = '';
    _selectedDepartment = 'All';
    notifyListeners();
  }

  /// Helper for college demo / testing to seed initial sample notices if empty.
  Future<void> seedSampleNotices() async {
    final sampleNotices = [
      Notice(
        id: '1',
        title: 'Mid-Semester Examination Schedule Announced',
        department: 'Computer Science and Engineering (CSE)',
        description:
            'The Mid-Semester Examinations for B.Tech Semester V and VII are scheduled to commence from November 18, 2026. Detailed seating arrangement and timetable are available on the student portal. Hall tickets must be collected from the department coordinator before November 15.',
        publishedDate: DateTime.now().subtract(const Duration(hours: 4)),
      ),
      Notice(
        id: '2',
        title: 'Annual Tech Fest "Innovista 2026" Registrations Open',
        department: 'Information Technology (IT)',
        description:
            'Registrations are officially open for Innovista 2026! Exciting events include 24-hour Hackathon, Coding Battles, IoT Showcase, and RoboWars. Total cash prizes worth 2 Lakh INR. Register your team before November 20 at techfest.college.edu.',
        publishedDate: DateTime.now().subtract(const Duration(days: 1)),
      ),
      Notice(
        id: '3',
        title: 'Campus Recruitment Drive – Core Electronics Companies',
        department: 'Electronics and Communication Engineering (ECE)',
        description:
            'Leading semiconductor and embedded systems companies will conduct on-campus placement drives for final year ECE and EEE students starting next Monday. Eligible students must carry three updated resumes and valid college ID cards.',
        publishedDate: DateTime.now().subtract(const Duration(days: 2)),
      ),
      Notice(
        id: '4',
        title: 'Industrial Visit to Hydroelectric Power Generation Plant',
        department: 'Electrical and Electronics Engineering (EEE)',
        description:
            'A one-day educational field trip to Nagarjuna Sagar Hydroelectric Plant is scheduled for November 25. Interested students must submit parent consent forms to Prof. Sharma by Friday.',
        publishedDate: DateTime.now().subtract(const Duration(days: 3)),
      ),
      Notice(
        id: '5',
        title: 'CAD/CAM Workshop and 3D Printing Hands-on Training',
        department: 'Mechanical Engineering',
        description:
            'The Department of Mechanical Engineering is hosting a 3-day practical workshop on SolidWorks and additive manufacturing in CAD Lab 2. Certificates will be provided to all attendees upon completion of the mini-project.',
        publishedDate: DateTime.now().subtract(const Duration(days: 4)),
      ),
      Notice(
        id: '6',
        title: 'Structural Design Seminar & Concrete Cube Strength Contest',
        department: 'Civil Engineering',
        description:
            'Join the national level seminar on Earthquake Resistant Structures followed by the annual Concrete Cube Compressive Strength testing contest. Register with faculty advisor Mr. Rao.',
        publishedDate: DateTime.now().subtract(const Duration(days: 5)),
      ),
    ];

    _notices = sampleNotices;
    await _storageService.saveNotices(_notices);
    _status = NoticeLoadingStatus.loaded;
    notifyListeners();
  }

  /// Clear all notices
  Future<void> clearAll() async {
    _notices.clear();
    await _storageService.clearAllNotices();
    notifyListeners();
  }
}
