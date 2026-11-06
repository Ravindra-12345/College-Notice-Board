export interface FlutterCodeFile {
  path: string;
  category: 'Entry' | 'Models' | 'Providers' | 'Services' | 'Screens' | 'Widgets' | 'Theme' | 'Tests' | 'Config' | 'Documentation';
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterCodeFile[] = [
  {
    path: 'pubspec.yaml',
    category: 'Config',
    description: 'Project manifest with dependencies: provider, shared_preferences, intl, and flutter_lints.',
    content: `name: campus_notice_board
description: "A modern College Notice Board Flutter Android application using Provider and SharedPreferences."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    path: 'lib/main.dart',
    category: 'Entry',
    description: 'Application entry point initializing ChangeNotifierProvider and Material 3 theme.',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/notice_provider.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CampusNoticeBoardApp());
}

/// Root application widget for Campus Notice Board.
class CampusNoticeBoardApp extends StatelessWidget {
  const CampusNoticeBoardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => NoticeProvider()..fetchNotices(),
      child: MaterialApp(
        title: 'Campus Notice Board',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const HomeScreen(),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/notice.dart',
    category: 'Models',
    description: 'Notice data model with id, title, department, description, date, and JSON serialization.',
    content: `/// Model class representing a college notice.
class Notice {
  final String id;
  final String title;
  final String department;
  final String description;
  final DateTime publishedDate;

  Notice({
    required this.id,
    required this.title,
    required this.department,
    required this.description,
    required this.publishedDate,
  });

  /// Convert Notice instance to a JSON Map for SharedPreferences persistence.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'department': department,
      'description': description,
      'publishedDate': publishedDate.toIso8601String(),
    };
  }

  /// Construct a Notice instance from a JSON Map.
  factory Notice.fromJson(Map<String, dynamic> json) {
    return Notice(
      id: json['id'] as String,
      title: json['title'] as String,
      department: json['department'] as String,
      description: json['description'] as String,
      publishedDate: DateTime.parse(json['publishedDate'] as String),
    );
  }

  /// Create a modified copy of this Notice.
  Notice copyWith({
    String? id,
    String? title,
    String? department,
    String? description,
    DateTime? publishedDate,
  }) {
    return Notice(
      id: id ?? this.id,
      title: title ?? this.title,
      department: department ?? this.department,
      description: description ?? this.description,
      publishedDate: publishedDate ?? this.publishedDate,
    );
  }
}
`,
  },
  {
    path: 'lib/services/notice_storage_service.dart',
    category: 'Services',
    description: 'Encapsulates SharedPreferences JSON serialization, loading, and persistence.',
    content: `import 'dart:convert';
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

  /// Clear all notices from local storage.
  Future<void> clearAllNotices() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
  }
}
`,
  },
  {
    path: 'lib/providers/notice_provider.dart',
    category: 'Providers',
    description: 'ChangeNotifier provider managing notice state, filters, searches, loading, and error retry.',
    content: `import 'package:flutter/foundation.dart';
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

  List<Notice> get allNotices => List.unmodifiable(_notices);

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

  int getNoticeCountForDepartment(String departmentName) {
    return _notices
        .where((n) => n.department.toLowerCase() == departmentName.toLowerCase())
        .length;
  }

  Future<void> fetchNotices() async {
    _status = NoticeLoadingStatus.loading;
    _errorMessage = '';
    notifyListeners();

    try {
      _notices = await _storageService.loadNotices();
      _notices.sort((a, b) => b.publishedDate.compareTo(a.publishedDate));
      _status = NoticeLoadingStatus.loaded;
    } catch (e) {
      _status = NoticeLoadingStatus.error;
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
    } finally {
      notifyListeners();
    }
  }

  Future<void> retry() async {
    await fetchNotices();
  }

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

  Future<void> deleteNotice(String id) async {
    _notices.removeWhere((notice) => notice.id == id);
    await _storageService.saveNotices(_notices);
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query.trim();
    notifyListeners();
  }

  void setDepartment(String department) {
    _selectedDepartment = department;
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = '';
    _selectedDepartment = 'All';
    notifyListeners();
  }

  Future<void> seedSampleNotices() async {
    final sampleNotices = [
      Notice(
        id: '1',
        title: 'Mid-Semester Examination Schedule Announced',
        department: 'Computer Science and Engineering (CSE)',
        description:
            'The Mid-Semester Examinations for B.Tech Semester V and VII are scheduled to commence from November 18, 2026. Detailed seating arrangement and timetable are available on the student portal.',
        publishedDate: DateTime.now().subtract(const Duration(hours: 4)),
      ),
      Notice(
        id: '2',
        title: 'Annual Tech Fest "Innovista 2026" Registrations Open',
        department: 'Information Technology (IT)',
        description:
            'Registrations are officially open for Innovista 2026! Exciting events include 24-hour Hackathon, Coding Battles, IoT Showcase, and RoboWars. Register at techfest.college.edu.',
        publishedDate: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];

    _notices = sampleNotices;
    await _storageService.saveNotices(_notices);
    _status = NoticeLoadingStatus.loaded;
    notifyListeners();
  }

  Future<void> clearAll() async {
    _notices.clear();
    await _storageService.clearAllNotices();
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    category: 'Theme',
    description: 'Material 3 Blue and White collegiate palette, department icons, and color badges.',
    content: `import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF1E40AF);
  static const Color secondaryBlue = Color(0xFF3B82F6);
  static const Color accentBlue = Color(0xFF60A5FA);
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);

  static const List<String> departments = [
    'Computer Science and Engineering (CSE)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology (IT)',
  ];

  static Color getDepartmentColor(String department) {
    if (department.contains('CSE') || department.contains('Computer')) {
      return const Color(0xFF2563EB);
    } else if (department.contains('ECE') || department.contains('Electronics')) {
      return const Color(0xFF7C3AED);
    } else if (department.contains('EEE') || department.contains('Electrical')) {
      return const Color(0xFFD97706);
    } else if (department.contains('Mechanical')) {
      return const Color(0xFFDC2626);
    } else if (department.contains('Civil')) {
      return const Color(0xFF059669);
    } else if (department.contains('IT') || department.contains('Information')) {
      return const Color(0xFF0284C7);
    }
    return primaryBlue;
  }

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
        backgroundColor: primaryBlue,
        foregroundColor: Colors.white,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
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
    );
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    category: 'Screens',
    description: 'Screen 1: Search bar, department filter chips, loading/error/empty states, notice list, and FAB.',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/notice_card.dart';
import '../widgets/empty_state.dart';
import '../widgets/loading_widget.dart';
import 'notice_detail_screen.dart';
import 'add_notice_screen.dart';
import 'departments_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _currentNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NoticeProvider>(context, listen: false).fetchNotices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final noticeProvider = Provider.of<NoticeProvider>(context);

    if (_currentNavIndex == 1) {
      return DepartmentsScreen(
        onBackToHome: () => setState(() => _currentNavIndex = 0),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.campaign_rounded, size: 26, color: Colors.white),
            SizedBox(width: 10),
            Text('Campus Notice Board'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => noticeProvider.fetchNotices(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => noticeProvider.fetchNotices(),
        child: Column(
          children: [
            _buildSearchBar(noticeProvider),
            _buildFilterChips(noticeProvider),
            const Divider(height: 1, color: Color(0xFFE2E8F0)),
            Expanded(child: _buildNoticeBody(noticeProvider)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const AddNoticeScreen()),
        ),
        icon: const Icon(Icons.add_rounded),
        label: const Text('Post Notice'),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentNavIndex,
        onDestinationSelected: (idx) => setState(() => _currentNavIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'All Notices'),
          NavigationDestination(icon: Icon(Icons.account_tree_outlined), selectedIcon: Icon(Icons.account_tree_rounded), label: 'Departments'),
        ],
      ),
    );
  }

  Widget _buildSearchBar(NoticeProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: TextField(
        controller: _searchController,
        onChanged: (val) => provider.setSearchQuery(val),
        decoration: InputDecoration(
          hintText: 'Search notices by title...',
          prefixIcon: const Icon(Icons.search_rounded),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear_rounded),
                  onPressed: () {
                    _searchController.clear();
                    provider.setSearchQuery('');
                  },
                )
              : null,
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(30), borderSide: BorderSide.none),
        ),
      ),
    );
  }

  Widget _buildFilterChips(NoticeProvider provider) {
    final list = ['All', ...AppTheme.departments];
    return Container(
      height: 48,
      color: Colors.white,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: list.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final dept = list[i];
          final selected = provider.selectedDepartment == dept;
          return ChoiceChip(
            label: Text(dept.contains('(') ? dept.split('(').last.replaceAll(')', '') : dept),
            selected: selected,
            onSelected: (_) => provider.setDepartment(dept),
          );
        },
      ),
    );
  }

  Widget _buildNoticeBody(NoticeProvider provider) {
    if (provider.isLoading) return const LoadingWidget();
    if (provider.hasError) return ErrorStateWidget(errorMessage: provider.errorMessage, onRetry: () => provider.retry());

    final notices = provider.filteredNotices;
    if (notices.isEmpty) {
      return EmptyState(
        title: 'No Notices Found',
        message: 'Tap the button below to publish a notice.',
        actionLabel: 'Post Notice',
        onAction: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AddNoticeScreen())),
      );
    }

    return ListView.builder(
      itemCount: notices.length,
      itemBuilder: (context, i) => NoticeCard(
        notice: notices[i],
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => NoticeDetailScreen(notice: notices[i])),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/notice_detail_screen.dart',
    category: 'Screens',
    description: 'Screen 2: Full notice title, department badge, formatted timestamp, readable description, and copy.',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../models/notice.dart';
import '../theme/app_theme.dart';

class NoticeDetailScreen extends StatelessWidget {
  final Notice notice;

  const NoticeDetailScreen({super.key, required this.notice});

  @override
  Widget build(BuildContext context) {
    final deptColor = AppTheme.getDepartmentColor(notice.department);
    final deptIcon = AppTheme.getDepartmentIcon(notice.department);
    final formattedDate = DateFormat('EEEE, MMMM dd, yyyy – hh:mm a').format(notice.publishedDate);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notice Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.copy_rounded),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: '\${notice.title}\\n\\n\${notice.description}'));
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Notice copied!')));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: deptColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(deptIcon, size: 16, color: deptColor),
                  const SizedBox(width: 8),
                  Text(notice.department, style: TextStyle(fontWeight: FontWeight.bold, color: deptColor)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text('Published: \$formattedDate', style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
            const SizedBox(height: 16),
            Text(notice.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const Divider(height: 32),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: SelectableText(
                notice.description,
                style: const TextStyle(fontSize: 15, height: 1.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/add_notice_screen.dart',
    category: 'Screens',
    description: 'Screen 3: Validated notice creation form with department dropdown, counters, date picker, and save.',
    content: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../theme/app_theme.dart';

class AddNoticeScreen extends StatefulWidget {
  final String? initialDepartment;
  const AddNoticeScreen({super.key, this.initialDepartment});

  @override
  State<AddNoticeScreen> createState() => _AddNoticeScreenState();
}

class _AddNoticeScreenState extends State<AddNoticeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String? _selectedDepartment;
  DateTime _selectedDate = DateTime.now();
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _selectedDepartment = widget.initialDepartment;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    final provider = Provider.of<NoticeProvider>(context, listen: false);

    final ok = await provider.addNotice(
      title: _titleController.text,
      department: _selectedDepartment!,
      description: _descriptionController.text,
      publishedDate: _selectedDate,
    );

    setState(() => _isSubmitting = false);

    if (ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Notice published successfully!')),
      );
      Navigator.pop(context, true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Post New Notice')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                value: _selectedDepartment,
                hint: const Text('Select Department *'),
                items: AppTheme.departments.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                onChanged: (val) => setState(() => _selectedDepartment = val),
                validator: (val) => val == null || val.isEmpty ? 'Please select a department.' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _titleController,
                maxLength: 120,
                decoration: const InputDecoration(labelText: 'Notice Title *'),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Notice title cannot be empty.';
                  if (val.trim().length < 5) return 'Title must be at least 5 characters.';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                maxLines: 6,
                maxLength: 2000,
                decoration: const InputDecoration(labelText: 'Notice Description *'),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Notice description cannot be empty.';
                  if (val.trim().length < 15) return 'Description must be at least 15 characters.';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submit,
                  child: const Text('Publish Notice'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/departments_screen.dart',
    category: 'Screens',
    description: 'Screen 4: Grid of 6 engineering departments with custom icons, badges, and branch-wise notice filtering.',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/department_card.dart';
import '../widgets/notice_card.dart';
import 'notice_detail_screen.dart';

class DepartmentsScreen extends StatefulWidget {
  final VoidCallback? onBackToHome;
  const DepartmentsScreen({super.key, this.onBackToHome});

  @override
  State<DepartmentsScreen> createState() => _DepartmentsScreenState();
}

class _DepartmentsScreenState extends State<DepartmentsScreen> {
  String? _selectedDept;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<NoticeProvider>(context);

    if (_selectedDept != null) {
      final notices = provider.allNotices.where((n) => n.department == _selectedDept).toList();
      return Scaffold(
        appBar: AppBar(
          title: Text(_selectedDept!),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => setState(() => _selectedDept = null),
          ),
        ),
        body: notices.isEmpty
            ? const Center(child: Text('No notices in this department.'))
            : ListView.builder(
                itemCount: notices.length,
                itemBuilder: (_, i) => NoticeCard(
                  notice: notices[i],
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => NoticeDetailScreen(notice: notices[i]))),
                ),
              ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Departments'),
        leading: widget.onBackToHome != null ? IconButton(icon: const Icon(Icons.arrow_back), onPressed: widget.onBackToHome) : null,
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12),
        itemCount: AppTheme.departments.length,
        itemBuilder: (_, i) {
          final dept = AppTheme.departments[i];
          return DepartmentCard(
            departmentName: dept,
            noticeCount: provider.getNoticeCountForDepartment(dept),
            onTap: () => setState(() => _selectedDept = dept),
          );
        },
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/notice_card.dart',
    category: 'Widgets',
    description: 'Reusable card widget displaying notice title, department icon & color, date, and preview snippet.',
    content: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/notice.dart';
import '../theme/app_theme.dart';

class NoticeCard extends StatelessWidget {
  final Notice notice;
  final VoidCallback onTap;

  const NoticeCard({super.key, required this.notice, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final deptColor = AppTheme.getDepartmentColor(notice.department);
    final deptIcon = AppTheme.getDepartmentIcon(notice.department);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(deptIcon, size: 14, color: deptColor),
                  const SizedBox(width: 6),
                  Text(notice.department, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: deptColor)),
                  const Spacer(),
                  Text(DateFormat('dd MMM yyyy').format(notice.publishedDate), style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
              const SizedBox(height: 10),
              Text(notice.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold), maxLines: 2),
              const SizedBox(height: 6),
              Text(notice.description, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.black87, fontSize: 13)),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/department_card.dart',
    category: 'Widgets',
    description: 'Card widget displaying department icon, code badge, name, and active notice count.',
    content: `import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class DepartmentCard extends StatelessWidget {
  final String departmentName;
  final int noticeCount;
  final VoidCallback onTap;

  const DepartmentCard({super.key, required this.departmentName, required this.noticeCount, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.getDepartmentColor(departmentName);
    final icon = AppTheme.getDepartmentIcon(departmentName);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 28),
              Text(departmentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              Text('\$noticeCount notices', style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/empty_state.dart',
    category: 'Widgets',
    description: 'Empty list state widget with friendly icon, title, description, and action button.',
    content: `import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class EmptyState extends StatelessWidget {
  final String title;
  final String message;
  final IconData icon;
  final String? actionLabel;
  final VoidCallback? onAction;

  const EmptyState({
    super.key,
    required this.title,
    required this.message,
    this.icon = Icons.assignment_late_outlined,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: AppTheme.primaryBlue),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted)),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 20),
              ElevatedButton(onPressed: onAction, child: Text(actionLabel!)),
            ],
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/loading_widget.dart',
    category: 'Widgets',
    description: 'Loading progress indicator and ErrorStateWidget with retry callback.',
    content: `import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class LoadingWidget extends StatelessWidget {
  final String message;
  const LoadingWidget({super.key, this.message = 'Loading notices...'});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: AppTheme.primaryBlue),
          const SizedBox(height: 16),
          Text(message, style: const TextStyle(color: AppTheme.textMuted)),
        ],
      ),
    );
  }
}

class ErrorStateWidget extends StatelessWidget {
  final String errorMessage;
  final VoidCallback onRetry;

  const ErrorStateWidget({super.key, required this.errorMessage, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 48, color: Colors.red),
          const SizedBox(height: 16),
          Text(errorMessage, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'test/widget_test.dart',
    category: 'Tests',
    description: 'Automated Flutter widget tests for form validation, notice card rendering, and empty states.',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:campus_notice_board/models/notice.dart';
import 'package:campus_notice_board/providers/notice_provider.dart';
import 'package:campus_notice_board/screens/add_notice_screen.dart';
import 'package:campus_notice_board/widgets/empty_state.dart';
import 'package:campus_notice_board/widgets/notice_card.dart';

void main() {
  group('Campus Notice Board Widget Tests', () {
    testWidgets('EmptyState widget displays custom title and description', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: EmptyState(
              title: 'No Notices Found',
              message: 'Check back later for new college announcements.',
            ),
          ),
        ),
      );

      expect(find.text('No Notices Found'), findsOneWidget);
    });

    testWidgets('AddNoticeScreen form validates empty inputs', (WidgetTester tester) async {
      final mockProvider = NoticeProvider();

      await tester.pumpWidget(
        ChangeNotifierProvider<NoticeProvider>.value(
          value: mockProvider,
          child: const MaterialApp(
            home: AddNoticeScreen(),
          ),
        ),
      );

      final publishButton = find.text('Publish Notice');
      expect(publishButton, findsOneWidget);

      await tester.tap(publishButton);
      await tester.pumpAndSettle();

      expect(find.text('Please select a department.'), findsOneWidget);
      expect(find.text('Notice title cannot be empty.'), findsOneWidget);
      expect(find.text('Notice description cannot be empty.'), findsOneWidget);
    });
  });
}
`,
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    category: 'Config',
    description: 'Android manifest configuration with package name, launcher activity, and theme.',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.college.campus_notice_board">
    <application
        android:label="Campus Notice Board"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`,
  },
  {
    path: 'android/app/build.gradle',
    category: 'Config',
    description: 'Android Gradle build script defining compileSdk 34, minSdk 21, and application ID.',
    content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace "com.college.campus_notice_board"
    compileSdkVersion 34

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    defaultConfig {
        applicationId "com.college.campus_notice_board"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}
`,
  },
  {
    path: 'README.md',
    category: 'Documentation',
    description: 'Complete documentation, screenshots placeholders, Android Studio guide, APK instructions, and team info.',
    content: `# Campus Notice Board – College Android Application

A modern, responsive, and offline-capable College Notice Board Android application developed using **Flutter (3.35+)**, **Dart with null safety**, **Provider State Management**, **SharedPreferences**, and **Material Design 3**.

## Setup & Run
\`\`\`bash
flutter pub get
flutter run
flutter test
flutter build apk --release
\`\`\`
`,
  },
];
