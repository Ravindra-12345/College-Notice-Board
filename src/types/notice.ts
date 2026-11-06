export interface Notice {
  id: string;
  title: string;
  department: string;
  description: string;
  publishedDate: string; // ISO date string
}

export type DepartmentType =
  | 'Computer Science and Engineering (CSE)'
  | 'Electronics and Communication Engineering (ECE)'
  | 'Electrical and Electronics Engineering (EEE)'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Information Technology (IT)';

export const DEPARTMENTS: { name: DepartmentType; code: string; color: string; bg: string; icon: string }[] = [
  {
    name: 'Computer Science and Engineering (CSE)',
    code: 'CSE',
    color: '#2563eb',
    bg: '#eff6ff',
    icon: 'code',
  },
  {
    name: 'Electronics and Communication Engineering (ECE)',
    code: 'ECE',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: 'cpu',
  },
  {
    name: 'Electrical and Electronics Engineering (EEE)',
    code: 'EEE',
    color: '#d97706',
    bg: '#fffbeb',
    icon: 'zap',
  },
  {
    name: 'Mechanical Engineering',
    code: 'MECH',
    color: '#dc2626',
    bg: '#fef2f2',
    icon: 'cog',
  },
  {
    name: 'Civil Engineering',
    code: 'CIVIL',
    color: '#059669',
    bg: '#ecfdf5',
    icon: 'building',
  },
  {
    name: 'Information Technology (IT)',
    code: 'IT',
    color: '#0284c7',
    bg: '#f0f9ff',
    icon: 'globe',
  },
];

export const INITIAL_SAMPLE_NOTICES: Notice[] = [
  {
    id: '1',
    title: 'Mid-Semester Examination Schedule Announced',
    department: 'Computer Science and Engineering (CSE)',
    description:
      'The Mid-Semester Examinations for B.Tech Semester V and VII are scheduled to commence from November 18, 2026. Detailed seating arrangement and timetable are available on the student portal. Hall tickets must be collected from the department coordinator before November 15. Students are strictly advised not to carry mobile phones into the examination hall.',
    publishedDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Annual Tech Fest "Innovista 2026" Registrations Open',
    department: 'Information Technology (IT)',
    description:
      'Registrations are officially open for Innovista 2026! Exciting events include 24-hour Hackathon, Coding Battles, IoT Showcase, and RoboWars. Total cash prizes worth 2 Lakh INR. Register your team before November 20 at techfest.college.edu.',
    publishedDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Campus Recruitment Drive – Core Electronics Companies',
    department: 'Electronics and Communication Engineering (ECE)',
    description:
      'Leading semiconductor and embedded systems companies will conduct on-campus placement drives for final year ECE and EEE students starting next Monday. Eligible students must carry three updated resumes and valid college ID cards in formal attire.',
    publishedDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Industrial Visit to Hydroelectric Power Generation Plant',
    department: 'Electrical and Electronics Engineering (EEE)',
    description:
      'A one-day educational field trip to Nagarjuna Sagar Hydroelectric Plant is scheduled for November 25. Interested students must submit parent consent forms to Prof. Sharma by Friday. Transportation and refreshments will be provided by the college.',
    publishedDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'CAD/CAM Workshop and 3D Printing Hands-on Training',
    department: 'Mechanical Engineering',
    description:
      'The Department of Mechanical Engineering is hosting a 3-day practical workshop on SolidWorks and additive manufacturing in CAD Lab 2. Certificates will be provided to all attendees upon completion of the mini-project.',
    publishedDate: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Structural Design Seminar & Concrete Cube Strength Contest',
    department: 'Civil Engineering',
    description:
      'Join the national level seminar on Earthquake Resistant Structures followed by the annual Concrete Cube Compressive Strength testing contest. Register with faculty advisor Mr. Rao by Friday 4 PM.',
    publishedDate: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
  },
];
