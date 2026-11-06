import 'package:flutter/material.dart';
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
