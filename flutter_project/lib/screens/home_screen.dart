import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/notice_card.dart';
import '../widgets/empty_state.dart';
import '../widgets/loading_widget.dart';
import 'notice_detail_screen.dart';
import 'add_notice_screen.dart';
import 'departments_screen.dart';

/// Screen 1: Home Screen displaying search bar, department filters, and notice list.
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
    // Load notices on first launch
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<NoticeProvider>(context, listen: false);
      provider.fetchNotices();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final noticeProvider = Provider.of<NoticeProvider>(context);

    // If bottom navigation is switched to Departments (index 1)
    if (_currentNavIndex == 1) {
      return DepartmentsScreen(
        onBackToHome: () {
          setState(() {
            _currentNavIndex = 0;
          });
        },
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
            tooltip: 'Refresh Notices',
            onPressed: () => noticeProvider.fetchNotices(),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert_rounded),
            onSelected: (value) async {
              if (value == 'seed') {
                await noticeProvider.seedSampleNotices();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Sample college notices loaded successfully!'),
                      backgroundColor: AppTheme.secondaryBlue,
                      duration: Duration(seconds: 2),
                    ),
                  );
                }
              } else if (value == 'clear') {
                await noticeProvider.clearAll();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('All notices cleared.'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                }
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'seed',
                child: Row(
                  children: [
                    Icon(Icons.download_rounded, size: 18, color: AppTheme.primaryBlue),
                    SizedBox(width: 8),
                    Text('Load Sample Data'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'clear',
                child: Row(
                  children: [
                    Icon(Icons.delete_outline_rounded, size: 18, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Clear All Data'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => noticeProvider.fetchNotices(),
        color: AppTheme.primaryBlue,
        child: Column(
          children: [
            // Search Bar Container
            _buildSearchBar(noticeProvider),

            // Department Filter Chips Horizontal List
            _buildDepartmentFilterChips(noticeProvider),

            const Divider(height: 1, thickness: 1, color: Color(0xFFE2E8F0)),

            // Notice List / State Handler
            Expanded(
              child: _buildNoticeBody(noticeProvider),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AddNoticeScreen(),
            ),
          );
          if (result == true && mounted) {
            // Notice was added successfully
          }
        },
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Post Notice',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentNavIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentNavIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppTheme.primaryBlue),
            label: 'All Notices',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_tree_outlined),
            selectedIcon: Icon(Icons.account_tree_rounded, color: AppTheme.primaryBlue),
            label: 'Departments',
          ),
        ],
      ),
    );
  }

  /// Search Bar with instant search and clear button
  Widget _buildSearchBar(NoticeProvider provider) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      color: Colors.white,
      child: TextField(
        controller: _searchController,
        onChanged: (value) => provider.setSearchQuery(value),
        decoration: InputDecoration(
          hintText: 'Search notices by title or keywords...',
          prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primaryBlue),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear_rounded, size: 20),
                  onPressed: () {
                    _searchController.clear();
                    provider.setSearchQuery('');
                  },
                )
              : null,
          contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(30),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }

  /// Horizontal scrollable chips for filtering by department
  Widget _buildDepartmentFilterChips(NoticeProvider provider) {
    final filterOptions = ['All', ...AppTheme.departments];

    return Container(
      height: 48,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: filterOptions.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final dept = filterOptions[index];
          final isSelected = provider.selectedDepartment == dept;

          // Shorten label for chips
          String label = dept;
          if (dept.contains('(') && dept.contains(')')) {
            label = dept.split('(').last.replaceAll(')', '');
          }

          return ChoiceChip(
            label: Text(label),
            selected: isSelected,
            onSelected: (selected) {
              if (selected) {
                provider.setDepartment(dept);
              }
            },
            selectedColor: AppTheme.primaryBlue,
            labelStyle: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? Colors.white : AppTheme.textDark,
            ),
            backgroundColor: const Color(0xFFF1F5F9),
            showCheckmark: false,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
          );
        },
      ),
    );
  }

  /// Handle loading, error, empty, and populated states
  Widget _buildNoticeBody(NoticeProvider provider) {
    if (provider.isLoading) {
      return const LoadingWidget(message: 'Fetching college notices...');
    }

    if (provider.hasError) {
      return ErrorStateWidget(
        errorMessage: provider.errorMessage,
        onRetry: () => provider.retry(),
      );
    }

    final notices = provider.filteredNotices;

    if (notices.isEmpty) {
      if (provider.searchQuery.isNotEmpty || provider.selectedDepartment != 'All') {
        return EmptyState(
          title: 'No Matching Notices',
          message: 'No notices matched your current search criteria or department filter.',
          icon: Icons.search_off_rounded,
          actionLabel: 'Reset Filters',
          onAction: () {
            _searchController.clear();
            provider.clearFilters();
          },
        );
      }

      return EmptyState(
        title: 'Notice Board is Empty',
        message: 'No college notices published yet. Tap the button below to post your first announcement.',
        icon: Icons.note_add_outlined,
        actionLabel: 'Post New Notice',
        onAction: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AddNoticeScreen(),
            ),
          );
        },
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.only(top: 8, bottom: 88),
      itemCount: notices.length,
      itemBuilder: (context, index) {
        final notice = notices[index];
        return NoticeCard(
          notice: notice,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => NoticeDetailScreen(notice: notice),
              ),
            );
          },
        );
      },
    );
  }
}
