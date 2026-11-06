import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:campus_notice_board/models/notice.dart';
import 'package:campus_notice_board/providers/notice_provider.dart';
import 'package:campus_notice_board/screens/add_notice_screen.dart';
import 'package:campus_notice_board/widgets/empty_state.dart';
import 'package:campus_notice_board/widgets/notice_card.dart';

void main() {
  group('Campus Notice Board Widget Tests', () {
    testWidgets('EmptyState widget displays custom title and description',
        (WidgetTester tester) async {
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
      expect(find.text('Check back later for new college announcements.'),
          findsOneWidget);
    });

    testWidgets('NoticeCard renders title, department and date properly',
        (WidgetTester tester) async {
      final sampleNotice = Notice(
        id: 'test-1',
        title: 'Mid-Term Exam Schedule',
        department: 'Computer Science and Engineering (CSE)',
        description: 'Examinations start on Nov 20 in Hall B.',
        publishedDate: DateTime(2026, 11, 15, 10, 30),
      );

      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NoticeCard(
              notice: sampleNotice,
              onTap: () {
                tapped = true;
              },
            ),
          ),
        ),
      );

      // Verify title is rendered
      expect(find.text('Mid-Term Exam Schedule'), findsOneWidget);

      // Verify department text is rendered
      expect(
          find.text('Computer Science and Engineering (CSE)'), findsOneWidget);

      // Tap on card and verify callback
      await tester.tap(find.byType(NoticeCard));
      expect(tapped, isTrue);
    });

    testWidgets('AddNoticeScreen form validates empty inputs',
        (WidgetTester tester) async {
      final mockProvider = NoticeProvider();

      await tester.pumpWidget(
        ChangeNotifierProvider<NoticeProvider>.value(
          value: mockProvider,
          child: const MaterialApp(
            home: AddNoticeScreen(),
          ),
        ),
      );

      // Look for the Publish Notice button
      final publishButton = find.text('Publish Notice');
      expect(publishButton, findsOneWidget);

      // Tap Publish Notice without filling fields
      await tester.tap(publishButton);
      await tester.pumpAndSettle();

      // Expect validation error messages
      expect(find.text('Please select a department.'), findsOneWidget);
      expect(find.text('Notice title cannot be empty.'), findsOneWidget);
      expect(find.text('Notice description cannot be empty.'), findsOneWidget);
    });
  });
}
