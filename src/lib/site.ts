// Single source of truth for personal details shown across the site.
// Only facts confirmed by Rohith are listed here; anything unknown is left out rather than guessed.

export const site = {
  name: 'Rohith Mohan',
  title: 'Market Research Analyst',
  positioning: 'Market Research Analyst | Consumer Insights | Customer Experience | Research Analytics',
  location: 'Open to roles in Dubai, Abu Dhabi and Sharjah, UAE',
  availability: 'Available to start immediately',
  // Set before publishing. Leave empty to hide the email address and send the contact form to LinkedIn.
  email: '',
  linkedin: 'https://www.linkedin.com/in/rohith-mohan-analyst',
  github: 'https://github.com/Rohithmohan123',
  cv: '/cv/Rohith-Mohan-Market-Research-Analyst-CV.pdf',
  url: 'https://rohithmohan123.github.io/rohith-mohan-market-research-portfolio'
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** Prefix a public-folder path with the deployment base path (needed for plain <a>/<img> links). */
export const asset = (path: string) => `${basePath}${path}`;

export const targetRoles = [
  'Market Research Analyst', 'Research Analyst', 'Research Executive', 'Consumer Insights Analyst',
  'Customer Experience Analyst', 'Customer Insights Analyst', 'NPS Analyst', 'Market Intelligence Analyst',
  'Research Associate', 'Junior Business Analyst', 'Category Analyst', 'Marketing Research Analyst'
];

export const industries = [
  'Market Research', 'FMCG', 'Automotive', 'Retail', 'Banking & Financial Services', 'Education',
  'Consulting', 'Customer Experience', 'Government & Public Services'
];

export const skillGroups = [
  { title: 'Research methods', items: ['Primary & secondary research', 'Quantitative research', 'Qualitative research', 'Mystery shopping', 'Customer experience research', 'Market assessment', 'Competitor benchmarking'] },
  { title: 'Survey & data', items: ['Survey design', 'Questionnaire development', 'Data cleaning & validation', 'Verbatim analysis', 'Cross-tabulation'] },
  { title: 'Customer metrics', items: ['NPS analysis', 'Customer satisfaction (CSAT) analysis', 'Service quality scorecards', 'Driver & theme analysis'] },
  { title: 'Tools', items: ['Excel', 'Power BI', 'SQL', 'Python (basic)'] },
  { title: 'Reporting', items: ['Research reporting', 'Data visualisation', 'Dashboards', 'Insight presentations'] }
];

export const experience = [
  {
    role: 'Market Intelligence & Business Insights',
    org: 'The Digital Tantra',
    place: 'Remote (Bengaluru, India)',
    period: 'Oct 2024 – Oct 2026',
    current: false,
    points: [
      'Research, survey analysis and research reporting',
      'Customer feedback analysis and Net Promoter Score (NPS) analysis',
      'Consumer insights and competitor benchmarking',
      'Data visualisation and reporting in Excel and Power BI'
    ],
    projects: ['automotive-nps-feedback-analysis', 'uae-higher-education-demand-employment']
  },
  {
    role: 'Junior Software Engineer Trainee',
    org: 'Ezses Company',
    place: 'Kochi, India',
    period: 'Aug 2023 – Jun 2024',
    current: false,
    points: [
      'Delivered client web projects in a cross-functional team of designers and backend developers',
      'Designed entity-relationship models and relational database schemas (MySQL)',
      'Validated REST APIs in Postman (GET, POST, PUT, DELETE) before frontend integration'
    ],
    projects: []
  },
  {
    role: 'Data Analyst Intern',
    org: 'Quest Innovative Solutions',
    place: 'India',
    period: '',
    current: false,
    points: [],
    projects: []
  }
];

export const education = [
  { degree: 'Master of Computer Applications (MCA)', school: 'CMS College of Science and Commerce', period: '2022 – 2024', grade: 'GPA 8.7' },
  { degree: 'BSc Computer Science', school: 'Prajyothi Niketan College', period: '2019 – 2022', grade: 'GPA 6.6' }
];

export const certifications = [
  { name: 'Market Research Specialization', issuer: '', year: '2026' },
  { name: 'Advanced Diploma in Data Analytics & Business Intelligence', issuer: 'Quest Innovative Solutions', year: '' },
  { name: 'Revealing Deeper Insights', issuer: 'Aytm', year: '' },
  { name: 'Google Analytics', issuer: 'Google Skillshop', year: '' },
  { name: 'Project Management Fundamentals', issuer: 'IBM', year: '' },
  { name: 'Java Programming Features', issuer: 'Infosys', year: '' }
];
