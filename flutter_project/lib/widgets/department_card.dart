import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Card widget to display a college department with notice count.
class DepartmentCard extends StatelessWidget {
  final String departmentName;
  final int noticeCount;
  final VoidCallback onTap;

  const DepartmentCard({
    super.key,
    required this.departmentName,
    required this.noticeCount,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.getDepartmentColor(departmentName);
    final icon = AppTheme.getDepartmentIcon(departmentName);

    // Extract short code if available (e.g. CSE from "Computer Science and Engineering (CSE)")
    String code = departmentName;
    if (departmentName.contains('(') && departmentName.contains(')')) {
      code = departmentName.split('(').last.replaceAll(')', '').trim();
    } else if (departmentName.contains('Mechanical')) {
      code = 'MECH';
    } else if (departmentName.contains('Civil')) {
      code = 'CIVIL';
    }

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: color.withOpacity(0.2), width: 1.2),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Icon and Code Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(icon, color: color, size: 24),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      code,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Full Department Title
              Text(
                departmentName,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textDark,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 8),

              // Active Notices count pill & arrow
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '$noticeCount ${noticeCount == 1 ? "Notice" : "Notices"}',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: noticeCount > 0 ? color : Colors.grey.shade500,
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 13,
                    color: color,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
