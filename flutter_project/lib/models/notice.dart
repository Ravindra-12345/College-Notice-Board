/// Model class representing a college notice.
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
