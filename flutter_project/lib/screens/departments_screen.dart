import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/department_card.dart';
import '../widgets/notice_card.dart';
import '../widgets/empty_state.dart';
import 'notice_detail_screen.dart';
import 'add_notice_screen.dart';

/// Screen 4: College Departments screen displaying cards for all engineering departments.
class DepartmentsScreen extends StatefulWidget {
  final VoidCallback? onBackToHome;

  const DepartmentsScreen({super.key, this.onBackToHome});

  @override
  State<DepartmentsScreen> createState() => _DepartmentsScreenState();
}

class _DepartmentsScreenState extends State<DepartmentsScreen> {
  String? _selectedDepartmentDetail;

  @override
  Widget build(BuildContext context) {
    final noticeProvider = Provider.of<NoticeProvider>(context);

    // If a specific department has been tapped to view its notice archive
    if (_selectedDepartmentDetail != null) {
      return _buildDepartmentDetailView(noticeProvider, _selectedDepartmentDetail!);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Academic Departments'),
        leading: widget.onBackToHome != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: widget.onBackToHome,
              )
            : null,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Info Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryBlue, AppTheme.secondaryBlue],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.domain_rounded, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Department Portals',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Browse curated announcements, circulars & schedules for each branch.',
                          style: TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Select a Department',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),

            // Grid of Department Cards
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.95,
              ),
              itemCount: AppTheme.departments.length,
              itemBuilder: (context, index) {
                final deptName = AppTheme.departments[index];
                final count = noticeProvider.getNoticeCountForDepartment(deptName);

                return DepartmentCard(
                  departmentName: deptName,
                  noticeCount: count,
                  onTap: () {
                    setState(() {
                      _selectedDepartmentDetail = deptName;
                    });
                  },
                );
              },
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  /// Specific view for the selected department
  Widget _buildDepartmentDetailView(NoticeProvider provider, String departmentName) {
    final deptColor = AppTheme.getDepartmentColor(departmentName);
    final deptIcon = AppTheme.getDepartmentIcon(departmentName);

    // Get notices matching this department
    final notices = provider.allNotices
        .where((n) => n.department.toLowerCase() == departmentName.toLowerCase())
        .toList();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: deptColor,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () {
            setState(() {
              _selectedDepartmentDetail = null;
            });
          },
        ),
        title: Text(
          departmentName.contains('(')
              ? departmentName.split('(').first.trim()
              : departmentName,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            tooltip: 'Post notice to this department',
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AddNoticeScreen(initialDepartment: departmentName),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Department Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            color: deptColor.withOpacity(0.08),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: deptColor.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(deptIcon, color: deptColor, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        departmentName,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: deptColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${notices.length} active announcements',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // Notices list or empty state
          Expanded(
            child: notices.isEmpty
                ? EmptyState(
                    title: 'No Notices in this Department',
                    message:
                        'There are currently no active notices for $departmentName. Be the first faculty or student coordinator to post one!',
                    icon: Icons.folder_open_rounded,
                    actionLabel: 'Post to Department',
                    onAction: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              AddNoticeScreen(initialDepartment: departmentName),
                        ),
                      );
                    },
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
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
                  ),
          ),
        ],
      ),
    );
  }
}
