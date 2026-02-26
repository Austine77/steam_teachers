export type CourseLevel = "STEAM ONE" | "STEAM TWO" | "STEAM THREE";

export type Course = {
  id: string;
  title: string;
  level: CourseLevel;
  priceNGN: number;
  summary: string;
  modules: string[];
  standards: string[];
};

export type Teacher = {
  id: string;
  name: string;
  badges: CourseLevel[];
  experienceYears: number;
  skills: string[];
  location: string;
};

export const courses: Course[] = [
  {
    id: "steam-one",
    title: "STEAM ONE — Introductory Modules",
    level: "STEAM ONE",
    priceNGN: 25000,
    summary:
      "Introductory classes for pre-service and in-service teachers. Foundations of STEAM pedagogy and digital teaching basics.",
    modules: [
      "Orientation & learning outcomes",
      "Digital classroom basics",
      "Assessment & feedback fundamentals",
      "Lesson planning for STEAM",
      "Micro-teaching practice"
    ],
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"]
  },
  {
    id: "steam-two",
    title: "STEAM TWO — Technology for Teaching",
    level: "STEAM TWO",
    priceNGN: 50000,
    summary:
      "Practical skillset for teachers to use technology across subjects: tools, content creation, and blended learning delivery.",
    modules: [
      "Instructional technology toolkit",
      "Digital content creation",
      "LMS workflows & assignments",
      "Data-driven instruction",
      "Classroom management with tech"
    ],
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"]
  },
  {
    id: "steam-three",
    title: "STEAM THREE — Expert Educator & AI Integration",
    level: "STEAM THREE",
    priceNGN: 90000,
    summary:
      "For expert educators: lead digital transformation, leverage AI for lesson design, and deploy creativity across schools.",
    modules: [
      "Leading digital transformation",
      "AI-assisted lesson & assessment design",
      "Learning tools & assistive tech",
      "Coaching & mentoring",
      "Capstone: impact project"
    ],
    standards: ["ISTE", "UNESCO ICT CFT", "PISA"]
  }
];

export const teachers: Teacher[] = [
  {
    id: "t-001",
    name: "Miss Kemi A.",
    badges: ["STEAM ONE", "STEAM TWO"],
    experienceYears: 6,
    skills: ["Microsoft 365 Education", "Blended Learning", "STEM Projects", "Classroom Assessment"],
    location: "Oyo, Nigeria"
  },
  {
    id: "t-002",
    name: "Mr. Daniel O.",
    badges: ["STEAM ONE"],
    experienceYears: 3,
    skills: ["Lesson Planning", "Google Classroom", "Digital Literacy", "Learning Support"],
    location: "Lagos, Nigeria"
  },
  {
    id: "t-003",
    name: "Mrs. Adaeze C.",
    badges: ["STEAM ONE", "STEAM TWO", "STEAM THREE"],
    experienceYears: 9,
    skills: ["AI for Education", "Teacher Coaching", "Curriculum Design", "Instructional Design"],
    location: "Abuja, Nigeria"
  }
];
