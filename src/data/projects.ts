// Case-study content. Background statements describe genuine projects; every number shown in a
// dashboard comes from a SYNTHETIC demonstration dataset (or, for the UAE study, from public sources
// listed with links). Figures are copied from the output tables of the linked GitHub repositories.
import kitchenware from './kitchenware.json';

export type Tone = 'pos' | 'neg' | 'neutral';
export type Kpi = { label: string; value: string; note?: string };
export type Bar = { label: string; value: number; note?: string };
export type Segment = { key: string; value: number };
export type Block =
  | { kind: 'bars'; title: string; subtitle?: string; unit?: string; diverging?: boolean; max?: number; data: Bar[] }
  | { kind: 'stacked'; title: string; subtitle?: string; keys: string[]; data: { label: string; segments: Segment[] }[] }
  | { kind: 'heatmap'; title: string; subtitle?: string; cols: string[]; rows: { label: string; values: number[] }[]; min: number; max: number; diverging?: boolean }
  | { kind: 'table'; title: string; subtitle?: string; head: string[]; rows: (string | number)[][] }
  | { kind: 'facts'; title: string; subtitle?: string; items: { text: string; sources: { label: string; url: string }[] }[] };

export type Project = {
  slug: string;
  title: string;
  short: string;
  sector: string;
  context: string;
  dataLabel: 'Synthetic demonstration data' | 'Verified public sources + synthetic survey';
  confidential?: boolean;
  tags: string[];
  problem: string;
  background: string[];
  objectives: string[];
  methodology: { step: string; detail: string }[];
  implementation: string[];
  deliverables: string[];
  kpis: Kpi[];
  dashboard: Block[];
  findings: string[];
  dataNote: string;
  tools: string[];
  repo: string;
  report: string;
  extraDownloads?: { label: string; href: string }[];
};

const KW = kitchenware as {
  observations: number;
  channels: { id: string; name: string; type: string }[];
  medianByCategoryChannel: Record<string, string | number>[];
  priceIndex: { channel: string; index: number }[];
  channelStats: { channel: string; type: string; skus: number; onDealPct: number; avgDiscountWhenOnDeal: number; inStockPct: number }[];
  tierMix: Record<string, string | number>[];
};

const aed = (n: number) => `AED ${n.toLocaleString('en-US')}`;

export const projects: Project[] = [
  {
    slug: 'automotive-nps-feedback-analysis',
    title: 'Automotive Customer NPS & Feedback Analysis',
    short: 'Two-wheeler customer satisfaction and NPS benchmarking of TVS against Bajaj and Haojue across Nigeria, Egypt, the Philippines and DR Congo.',
    sector: 'Automotive · Customer experience',
    context: 'Customer experience research at The Digital Tantra',
    dataLabel: 'Synthetic demonstration data',
    tags: ['NPS', 'CSAT', 'Competitor benchmarking', 'Verbatim coding', 'Python', 'Excel'],
    problem: 'A two-wheeler brand needed to understand how its customers in four emerging markets felt about ownership compared with two key competitors, which issues pushed customers to become detractors, and how sentiment changed over the ownership period.',
    background: [
      'The original work was customer experience research undertaken at The Digital Tantra, analysing customer feedback for TVS motorcycles and benchmarking against Bajaj and Haojue.',
      'Markets covered: Nigeria, Egypt, the Philippines and DR Congo, with customer vehicle ownership periods as a key cut.',
      'Customer responses and results from that work are confidential. This public version recreates the analysis on a simulated dataset of the same shape.'
    ],
    objectives: [
      'Measure NPS and CSAT by country and by brand, with confidence intervals',
      'Classify every respondent as Promoter, Passive or Detractor and compare the mix by market',
      'Show how NPS changes with ownership duration',
      'Categorise open-ended feedback into themes and identify the main detractor drivers per country',
      'Turn the analysis into clear charts and a written report'
    ],
    methodology: [
      { step: 'Data preparation', detail: 'Validated scores (0–10), standardised country and brand labels, removed duplicates and flagged incomplete records in a cleaning log.' },
      { step: 'NPS classification', detail: 'Promoters 9–10, Passives 7–8, Detractors 0–6. NPS = % Promoters − % Detractors, with a standard error and 95% confidence interval for each segment.' },
      { step: 'Segmentation', detail: 'Cross-tabulated NPS by country, brand, brand × country, ownership band, usage type and survey channel. Segments under 50 responses are flagged as low sample.' },
      { step: 'Verbatim analysis', detail: 'Coded open-ended comments into eight themes (spare parts, after-sales service, dealer experience, price, durability, comfort, resale value, fuel efficiency).' },
      { step: 'Benchmarking', detail: 'Computed TVS vs competitor NPS gaps per market and tested whether differences were statistically meaningful.' },
      { step: 'Reporting', detail: 'Built charts and an automated PDF report whose text is generated from the results, so numbers and narrative always agree.' }
    ],
    implementation: [
      'Python pipeline (pandas, numpy, matplotlib) from raw survey file to tables, 11 charts and a PDF report',
      'Every table exported to CSV and Excel for further work in Excel or Power BI',
      'Unit tests check the NPS maths, segment classification and confidence intervals'
    ],
    deliverables: ['NPS & CSAT dashboard tables', '11 analytical charts', 'Country and brand benchmarking', 'Detractor theme analysis', 'Sample PDF report'],
    kpis: [
      { label: 'Responses', value: '3,112', note: '4 markets · 3 brands' },
      { label: 'Overall NPS', value: '−16.0', note: '95% CI −18.7 to −13.3' },
      { label: 'Promoters / Detractors', value: '22.8% / 38.7%' },
      { label: 'Mean CSAT', value: '3.78 / 5' }
    ],
    dashboard: [
      { kind: 'bars', title: 'NPS by country', subtitle: 'All brands combined', diverging: true, max: 50, data: [
        { label: 'Philippines', value: 1.6, note: 'n=795' }, { label: 'Nigeria', value: -13.1, note: 'n=926' },
        { label: 'Egypt', value: -16.7, note: 'n=747' }, { label: 'DR Congo', value: -41.0, note: 'n=644' }] },
      { kind: 'stacked', title: 'Promoter, Passive and Detractor mix', subtitle: 'Share of respondents by country (%)', keys: ['Detractor', 'Passive', 'Promoter'], data: [
        { label: 'Philippines', segments: [{ key: 'Detractor', value: 28.8 }, { key: 'Passive', value: 40.8 }, { key: 'Promoter', value: 30.4 }] },
        { label: 'Nigeria', segments: [{ key: 'Detractor', value: 36.5 }, { key: 'Passive', value: 40.1 }, { key: 'Promoter', value: 23.4 }] },
        { label: 'Egypt', segments: [{ key: 'Detractor', value: 38.7 }, { key: 'Passive', value: 39.4 }, { key: 'Promoter', value: 22.0 }] },
        { label: 'DR Congo', segments: [{ key: 'Detractor', value: 54.2 }, { key: 'Passive', value: 32.6 }, { key: 'Promoter', value: 13.2 }] }] },
      { kind: 'heatmap', title: 'NPS by brand and market', subtitle: 'TVS benchmarked against Bajaj and Haojue', cols: ['TVS', 'Bajaj', 'Haojue'], min: -50, max: 50, diverging: true, rows: [
        { label: 'Philippines', values: [2.4, -4.2, 4.8] }, { label: 'Nigeria', values: [-8.9, -12.5, -19.7] },
        { label: 'Egypt', values: [-18.4, -15.1, -16.7] }, { label: 'DR Congo', values: [-38.8, -37.3, -45.1] }] },
      { kind: 'bars', title: 'NPS by ownership period', subtitle: 'Sentiment dips after the first six months', diverging: true, max: 30, data: [
        { label: '0–6 months', value: 7.3 }, { label: '6–12 months', value: -12.9 }, { label: '12–24 months', value: -25.5 },
        { label: '24–36 months', value: -20.7 }, { label: '36+ months', value: -13.4 }] },
      { kind: 'bars', title: 'NPS by main feedback theme', subtitle: 'Customers whose comment mentions each theme', diverging: true, max: 60, data: [
        { label: 'Fuel efficiency', value: 40.4 }, { label: 'Resale value', value: 10.4 }, { label: 'Durability & build', value: 2.4 },
        { label: 'Ride comfort', value: 0.8 }, { label: 'Price & value', value: -24.9 }, { label: 'Dealer experience', value: -38.8 },
        { label: 'After-sales service', value: -47.8 }, { label: 'Spare parts availability', value: -59.8 }] },
      { kind: 'bars', title: 'Top detractor themes: DR Congo', subtitle: '% of commenting detractors mentioning each theme', unit: '%', max: 50, data: [
        { label: 'Spare parts availability', value: 39.9 }, { label: 'After-sales service', value: 35.2 },
        { label: 'Durability & build quality', value: 12.7 }, { label: 'Price & value for money', value: 10.7 }, { label: 'Dealer experience', value: 7.1 }] }
    ],
    findings: [
      'The Philippines is the only market with a positive NPS (+1.6); DR Congo trails at −41.0, driven by a 54% detractor share.',
      'TVS leads its competitors in Nigeria (−8.9 vs −12.5 and −19.7) but trails Bajaj in Egypt, showing the benchmark is market-specific.',
      'NPS falls from +7.3 in the first six months to −25.5 at 12–24 months, pointing to the service and parts experience after purchase.',
      'Spare parts availability and after-sales service are the strongest negative themes; fuel efficiency is the strongest positive one.'
    ],
    dataNote: 'All figures on this page come from a simulated dataset of 3,112 responses built to mirror the structure of the original study. They are not TVS, Bajaj or Haojue results and must not be read as real market findings.',
    tools: ['Python', 'pandas', 'matplotlib', 'Excel', 'Power BI-ready tables'],
    repo: 'https://github.com/Rohithmohan123/automotive-customer-nps-feedback-analysis',
    report: '/reports/automotive-nps-sample-report.pdf'
  },
  {
    slug: 'uae-higher-education-demand-employment',
    title: 'UAE Higher Education Demand & Employment Research',
    short: 'Demand assessment, competitor benchmarking and employment mapping for two proposed bachelor programmes in the UAE.',
    sector: 'Education · Market assessment',
    context: 'Market research at The Digital Tantra',
    dataLabel: 'Verified public sources + synthetic survey',
    tags: ['Market assessment', 'Secondary research', 'Competitor analysis', 'Employer mapping', 'Survey design'],
    problem: 'An education provider wanted to know whether there is demand in the UAE for a BSc in Library and Information Science and a BSc in Cognitive Science and Artificial Intelligence, who already offers similar programmes, and which jobs graduates could move into.',
    background: [
      'The original market research was conducted at The Digital Tantra for two proposed programmes: BSc Library and Information Science and BSc Cognitive Science and Artificial Intelligence.',
      'This reconstruction separates two kinds of evidence: facts verified against public sources (linked below) and a simulated student survey used to demonstrate the demand-sizing method.',
      'No confidential client material is reproduced.'
    ],
    objectives: [
      'Assess student demand and stated intention to apply for each programme',
      'Benchmark existing UAE programmes and identify competitor universities',
      'Map employment sectors, employer demand, job roles and the skills employers need',
      'Estimate first-year intake under conservative, base and optimistic scenarios',
      'Summarise market opportunities and recommendations'
    ],
    methodology: [
      { step: 'Desk research', detail: 'Searched the CAA accredited-programme register, university websites, government strategy documents and reputable news sources. Each fact is stored with its source and access date.' },
      { step: 'Competitor benchmarking', detail: 'Listed every closely related programme found in the UAE with institution, emirate, level and status.' },
      { step: 'Survey design', detail: 'Designed a student and professional questionnaire covering interest (5-point scale), intention to apply, preferred study mode, budget and decision priorities.' },
      { step: 'Demand sizing', detail: 'Converted stated intent into applicants and intake using addressable pool × intent × conversion × yield, with sensitivity tables for each assumption.' },
      { step: 'Employment mapping', detail: 'Mapped graduate roles to sectors and core skills, and set out employer-demand assumptions as ranges rather than single numbers.' },
      { step: 'Synthesis', detail: 'Compared both courses side by side and wrote recommendations, marking every simulated or assumed value.' }
    ],
    implementation: [
      'Verified-facts register (CSV) with 17 public sources and URLs',
      'Simulated survey of 1,200 respondents across four segments, weighted analysis with confidence intervals',
      'Scenario model and sensitivity tables, exported to Excel',
      'Automated PDF report that labels each statement as verified, simulated or assumption'
    ],
    deliverables: ['Course comparison matrix', 'Verified competitor programme list', 'Demand and intake scenarios', 'Roles & skills map', 'Sample PDF report'],
    kpis: [
      { label: 'Public sources', value: '17', note: 'verified, with URLs' },
      { label: 'UAE AI bachelors found', value: '4', note: 'verified' },
      { label: 'Survey respondents', value: '1,200', note: 'simulated' },
      { label: 'Base-case intake', value: '20 / 132', note: 'LIS / CogSci & AI (scenario)' }
    ],
    dashboard: [
      { kind: 'facts', title: 'Verified market facts', subtitle: 'Each statement links to its public source', items: [
        { text: 'Al Wasl University (Dubai) offers a CAA-accredited Bachelor in Library and Information Sciences, reported as launched in 2020.', sources: [{ label: 'CAA', url: 'https://www.caa.ae/Pages/Programs/Details.aspx?GUID=4111' }, { label: 'QS', url: 'https://www.topuniversities.com/node/295315' }] },
        { text: 'MBZUAI announced its first undergraduate programme, a BSc in Artificial Intelligence, in March 2025; its first cohort was 115 students from more than 2,000 applications.', sources: [{ label: 'MBZUAI', url: 'https://mbzuai.ac.ae/?p=21709' }, { label: 'The National', url: 'https://www.thenationalnews.com/future/technology/2025/08/14/mohamed-bin-zayed-university-of-artificial-intelligence-welcomes-first-undergraduate-students' }] },
        { text: 'University of Sharjah, Canadian University Dubai and Al Ain University also offer or have announced AI bachelor programmes.', sources: [{ label: 'UoS', url: 'https://www.sharjah.ac.ae/Academics/Degree/Undergraduate/Artificial-Intelligence' }, { label: 'CUD', url: 'https://www.cud.ac.ae/node/25957' }, { label: 'AAU', url: 'https://aau.ac.ae/en/news/2025/al-ain-university-reaffirms-its-commitment-to-advancing-artificial-intelligence-education' }] },
        { text: 'UAE University offers a minor (not a major) in Cognitive Science through its Department of Cognitive Sciences.', sources: [{ label: 'UAEU', url: 'https://uaeu.ac.ae/en/chss/departments/cognitive_sciences.shtml' }] },
        { text: 'The UAE National Strategy for Artificial Intelligence 2031 includes attracting and training talent for AI-enabled jobs.', sources: [{ label: 'u.ae', url: 'https://u.ae/-/media/AI-publications/UAE-National-Strategy-for-Artificial-Intelligence-2031.pdf' }, { label: 'OECD.AI', url: 'https://oecd.ai/en/dashboards/policy-initiatives/uae-national-strategy-for-ai-8711' }] },
        { text: 'From the 2025–26 academic year, AI is taught as a subject in UAE public schools from kindergarten to Grade 12.', sources: [{ label: 'Gulf News', url: 'https://gulfnews.com/uae/education/uae-schools-to-introduce-ai-curriculum-in-new-academic-year-1.500242831' }] },
        { text: 'The Mohammed bin Rashid Library in Dubai opened to the public on 16 June 2022.', sources: [{ label: 'Dubai Media Office', url: 'https://mediaoffice.ae/en/news/2022/June/13-06/Ruler-of-Dubai-inaugurates-AED1-billion-Mohammed-bin-Rashid-Library' }, { label: 'Khaleej Times', url: 'https://www.khaleejtimes.com/travel/uae-attractions/dubais-mohammed-bin-rashid-library-opens-to-public-today-all-you-need-to-know' }] }
      ] },
      { kind: 'table', title: 'Competitor programmes in the UAE', subtitle: 'Verified against public sources (Nov 2026)', head: ['Institution', 'Emirate', 'Programme', 'Status'], rows: [
        ['Al Wasl University', 'Dubai', 'Bachelor in Library and Information Sciences', 'Launched 2020; CAA Active'],
        ['American University in the Emirates', 'Dubai', 'Master of Information & Library Science', 'Launched'],
        ['MBZUAI', 'Abu Dhabi', 'BSc Artificial Intelligence', 'First cohort Fall 2025'],
        ['University of Sharjah', 'Sharjah', 'BSc Artificial Intelligence', 'Active'],
        ['Canadian University Dubai', 'Dubai', 'BSc Artificial Intelligence', 'Announced July 2025'],
        ['Al Ain University', 'Abu Dhabi (Al Ain)', 'BSc Artificial Intelligence and Robotics', 'Introduced 2025'],
        ['UAE University', 'Abu Dhabi (Al Ain)', 'Minor in Cognitive Science', 'Active']] },
      { kind: 'heatmap', title: 'Top-2-box interest by segment', subtitle: 'Simulated survey · % rating 4 or 5 out of 5', cols: ['Library & Info Science', 'Cognitive Science & AI'], min: 0, max: 70, rows: [
        { label: 'Grade 12 · UAE national', values: [19.5, 57.4] }, { label: 'Grade 12 · expatriate', values: [9.6, 60.4] },
        { label: 'Working professional', values: [28.7, 39.3] }, { label: 'Career changer', values: [29.4, 52.3] },
        { label: 'All respondents', values: [20.2, 53.3] }] },
      { kind: 'table', title: 'First-year intake scenarios', subtitle: 'Scenario model: pool × intent × conversion × yield', head: ['Programme', 'Conservative', 'Base', 'Optimistic'], rows: [
        ['BSc Library & Information Science', 11, 20, 31], ['BSc Cognitive Science & AI', 73, 132, 205]] },
      { kind: 'table', title: 'Graduate roles and core skills', subtitle: 'Analyst-compiled employment map', head: ['Programme', 'Role', 'Typical sectors', 'Core skills'], rows: [
        ['LIS', 'Librarian / information services officer', 'Public, academic and school libraries', 'Cataloguing & metadata; reference services; information literacy'],
        ['LIS', 'Records & archives specialist', 'Government entities, large companies', 'Records management; retention schedules; document systems'],
        ['LIS', 'Knowledge management officer', 'Corporate, consulting, government', 'Taxonomy design; intranet & search; knowledge sharing'],
        ['CogSci & AI', 'Conversational AI / NLP developer', 'Technology, government services', 'NLP; Arabic language technology; linguistics; Python'],
        ['CogSci & AI', 'UX researcher / human-AI interaction', 'Technology, banking, government', 'Experimental design; cognitive psychology; usability testing'],
        ['CogSci & AI', 'AI product analyst', 'Technology, consulting, fintech', 'Data analysis; product thinking; AI governance']] }
    ],
    findings: [
      'Verified: the UAE already has one accredited LIS bachelor and at least four AI bachelors, but this desk search found no programme combining Cognitive Science with AI.',
      'Verified: national AI policy and the K-12 AI curriculum create a long-term pipeline for AI-related study.',
      'Simulated: interest in Cognitive Science & AI (53% top-2-box) is far higher than in LIS (20%), especially among Grade 12 students.',
      'Scenario: base-case intake of about 132 students for Cognitive Science & AI versus about 20 for LIS suggests LIS fits better as a niche or part-time offer.'
    ],
    dataNote: 'Facts in the "Verified market facts" and competitor table come from the linked public sources. Survey results and intake figures are SIMULATED to demonstrate the method and are labelled as such; they are not findings from the original study.',
    tools: ['Desk research', 'Python', 'pandas', 'Excel', 'Scenario modelling'],
    repo: 'https://github.com/Rohithmohan123/uae-higher-education-demand-employment-research',
    report: '/reports/uae-higher-education-sample-report.pdf'
  },
  {
    slug: 'uae-judicial-services-mystery-shopping',
    title: 'Confidential UAE Judicial Services Mystery Shopping Programme – W1 2026',
    short: 'Service quality evaluation across email, telephone, social media, registry and ancillary services, with scorecards and response-time analysis.',
    sector: 'Government & public services · Service quality',
    context: 'Confidential mystery shopping research at The Digital Tantra',
    dataLabel: 'Synthetic demonstration data',
    confidential: true,
    tags: ['Mystery shopping', 'Service quality', 'Scorecards', 'Response time', 'NPS'],
    problem: 'A UAE judicial services organisation wanted an objective view of how consistently its public-facing channels deliver accurate, timely and professional service, and where to focus improvement.',
    background: [
      'The original project was a confidential mystery shopping and service quality programme (Wave 1, 2026) at The Digital Tantra, covering five service channels.',
      'The client is not named. No client records, customer information, internal reports, recordings or real findings are reproduced here.',
      'This page demonstrates the evaluation framework and analysis on simulated visits.'
    ],
    objectives: [
      'Evaluate email, telephone, social media, registry and ancillary services against a common framework',
      'Score response time, communication quality, professionalism, information accuracy, resolution effectiveness and customer experience',
      'Build channel scorecards and compare performance with targets',
      'Analyse response times and service consistency, with an indicative NPS question'
    ],
    methodology: [
      { step: 'Framework design', detail: 'Six weighted dimensions with observable pass/fail criteria for each channel, combined into a 0–100 Service Quality Index (SQI).' },
      { step: 'Scenario planning', detail: 'Realistic enquiry scenarios per channel, spread across days and times so each channel is tested fairly.' },
      { step: 'Fieldwork & QA', detail: 'Standardised shopper forms, timestamped evidence and a shopper calibration check to spot over- or under-scoring.' },
      { step: 'Data cleaning', detail: 'Validated scores and timestamps, recorded every correction in a cleaning log.' },
      { step: 'Analysis', detail: 'SQI with confidence intervals, gap-to-target, registry vs ancillary comparison with effect sizes, time-of-day and wave comparisons.' },
      { step: 'Reporting', detail: 'Per-channel scorecards, top-10 improvement gaps and an evaluation report.' }
    ],
    implementation: [
      'Python pipeline: framework definition, simulated visit generator, cleaning, scoring and analysis',
      'Excel service-quality scorecard and PNG channel scorecards',
      'Statistical tests (Welch t-tests, Benjamini-Hochberg correction) for fair comparisons'
    ],
    deliverables: ['Evaluation framework', 'Channel scorecards', 'Response-time analysis', 'Gap-to-target and priority actions', 'Sample evaluation report'],
    kpis: [
      { label: 'Simulated visits', value: '597', note: '5 channels' },
      { label: 'Overall SQI', value: '71.5', note: 'out of 100' },
      { label: 'Visits meeting target', value: '34.3%' },
      { label: 'First-contact resolution', value: '45.1%' }
    ],
    dashboard: [
      { kind: 'bars', title: 'Service Quality Index by channel', subtitle: '0–100 · target 80', max: 100, data: [
        { label: 'Registry', value: 83.2 }, { label: 'Email', value: 79.5 }, { label: 'Telephone', value: 70.9 },
        { label: 'Ancillary services', value: 63.7 }, { label: 'Social media', value: 60.6 }] },
      { kind: 'heatmap', title: 'Dimension scores by channel', subtitle: 'Average score (0–100)', cols: ['Response time', 'Communication', 'Professionalism', 'Accuracy', 'Resolution', 'Experience'], min: 35, max: 92, rows: [
        { label: 'Registry', values: [83.8, 90.3, 90.5, 80.1, 75.5, 83.4] }, { label: 'Email', values: [74.8, 84.9, 89.9, 76.3, 73.5, 82.4] },
        { label: 'Telephone', values: [67.9, 80.5, 85.7, 72.7, 52.5, 71.2] }, { label: 'Ancillary', values: [65.8, 72.4, 82.6, 47.2, 58.5, 70.4] },
        { label: 'Social media', values: [37.3, 69.9, 76.2, 59.9, 56.9, 67.3] }] },
      { kind: 'bars', title: 'Response standard met', subtitle: '% of visits answered within the channel standard', unit: '%', max: 100, data: [
        { label: 'Registry', value: 80.7 }, { label: 'Email', value: 70.6 }, { label: 'Telephone', value: 61.3 },
        { label: 'Ancillary services', value: 60.0 }, { label: 'Social media', value: 22.5 }] },
      { kind: 'bars', title: 'Registry vs ancillary services', subtitle: 'Gap in points (all significant at 5%)', max: 40, data: [
        { label: 'Information accuracy', value: 32.9 }, { label: 'Response time', value: 18.0 }, { label: 'Communication quality', value: 18.0 },
        { label: 'Resolution effectiveness', value: 17.0 }, { label: 'Customer experience', value: 13.0 }, { label: 'Professionalism', value: 7.8 }] },
      { kind: 'stacked', title: 'Indicative NPS by channel', subtitle: 'Shopper "likelihood to recommend" (%)', keys: ['Detractor', 'Passive', 'Promoter'], data: [
        { label: 'Registry', segments: [{ key: 'Detractor', value: 5.9 }, { key: 'Passive', value: 29.4 }, { key: 'Promoter', value: 64.7 }] },
        { label: 'Email', segments: [{ key: 'Detractor', value: 9.3 }, { key: 'Passive', value: 36.4 }, { key: 'Promoter', value: 54.2 }] },
        { label: 'Telephone', segments: [{ key: 'Detractor', value: 14.4 }, { key: 'Passive', value: 43.2 }, { key: 'Promoter', value: 42.4 }] },
        { label: 'Ancillary', segments: [{ key: 'Detractor', value: 28.6 }, { key: 'Passive', value: 42.0 }, { key: 'Promoter', value: 29.4 }] },
        { label: 'Social media', segments: [{ key: 'Detractor', value: 36.7 }, { key: 'Passive', value: 42.5 }, { key: 'Promoter', value: 20.8 }] }] }
    ],
    findings: [
      'Registry is the strongest channel (SQI 83.2) and the only one above the 80-point target; social media is weakest (60.6).',
      'Social media meets its response standard in only 22.5% of visits, so response time is its biggest gap (37.3).',
      'Information accuracy is the largest registry-vs-ancillary gap (32.9 points), pointing to training and knowledge resources for ancillary staff.',
      'Telephone scores well on professionalism but resolves fewer enquiries (52.5), suggesting a need for clearer escalation paths.'
    ],
    dataNote: 'The client is not identified and no real records or findings are shown. All visits and scores on this page are SIMULATED to demonstrate the evaluation framework and analysis.',
    tools: ['Mystery shopping framework', 'Python', 'pandas', 'scipy', 'Excel scorecards'],
    repo: 'https://github.com/Rohithmohan123/uae-judicial-services-mystery-shopping-analysis',
    report: '/reports/mystery-shopping-sample-report.pdf'
  },
  {
    slug: 'kitchenware-market-research-uae',
    title: 'Kitchenware Market Research – UAE',
    short: 'Channel, pricing and assortment benchmarking for kitchenware across e-commerce marketplaces, organised retail and showrooms.',
    sector: 'Retail · Pricing & competitor benchmarking',
    context: 'Market research at The Digital Tantra',
    dataLabel: 'Synthetic demonstration data',
    tags: ['Market assessment', 'Price benchmarking', 'E-commerce research', 'Retail audit', 'Excel'],
    problem: 'A kitchenware business wanted to understand how products are priced, discounted and ranged across the main UAE sales channels before setting its own channel and pricing strategy.',
    background: [
      'The original market research, carried out at The Digital Tantra, assessed the UAE kitchenware market across e-commerce (including Noon and Amazon.ae), organised retail and supermarkets, and specialist showrooms.',
      'The original observations and findings are confidential and are not reproduced.',
      'This demonstration uses a simulated price audit. Channels and brands are anonymised (Marketplace A/B, Hypermarket chain, Specialist showroom, Brand A–F), so no figure can be mistaken for a real retailer’s price.'
    ],
    objectives: [
      'Assess the kitchenware market and the role of each sales channel',
      'Benchmark prices by product category and channel',
      'Compare discounting, availability and brand-tier assortment between channels',
      'Summarise market observations for pricing and channel decisions'
    ],
    methodology: [
      { step: 'Scope & categories', detail: 'Six categories: cookware sets, non-stick frying pans, pressure cookers, kitchen knives, food storage and bakeware.' },
      { step: 'Channel audit design', detail: 'Standard capture sheet per listing: category, brand, tier, list price, selling price, discount, rating and stock status.' },
      { step: 'Online research', detail: 'Marketplace listings captured with consistent search terms and filters so results are comparable.' },
      { step: 'Store & showroom visits', detail: 'Shelf audits in hypermarkets and showrooms using the same capture sheet.' },
      { step: 'Benchmarking', detail: 'Median prices by category and channel, a channel price index (Marketplace A = 100), discount depth and tier mix.' },
      { step: 'Reporting', detail: 'Observations and implications summarised in a short report with tables and charts.' }
    ],
    implementation: [
      `Seeded generator script producing ${KW.observations} simulated listing observations (CSV included)`,
      'Summary tables computed from the observations and charted on this page',
      'Sample report generated from the same numbers'
    ],
    deliverables: ['Price benchmark tables', 'Channel price index', 'Discount and availability comparison', 'Brand-tier assortment mix', 'Sample report and dataset'],
    kpis: [
      { label: 'Listings audited', value: KW.observations.toLocaleString('en-US'), note: 'simulated' },
      { label: 'Channels', value: '4', note: 'anonymised' },
      { label: 'Categories', value: '6' },
      { label: 'Showroom price index', value: String(KW.priceIndex.find((p) => p.channel === 'Specialist showroom')?.index), note: 'Marketplace A = 100' }
    ],
    dashboard: [
      { kind: 'bars', title: 'Channel price index', subtitle: 'Average of category median prices · Marketplace A = 100', max: 200, data: KW.priceIndex.map((p) => ({ label: p.channel, value: p.index })) },
      { kind: 'table', title: 'Median selling price by category (AED)', subtitle: 'Simulated audit', head: ['Category', ...KW.channels.map((c) => c.name)], rows: KW.medianByCategoryChannel.map((r) => [String(r.category), ...KW.channels.map((c) => aed(Number(r[c.id])))]) },
      { kind: 'bars', title: 'Listings on promotion', subtitle: '% of listings with a discount', unit: '%', max: 50, data: KW.channelStats.map((c) => ({ label: c.channel, value: c.onDealPct, note: `avg ${c.avgDiscountWhenOnDeal}% off` })) },
      { kind: 'stacked', title: 'Brand-tier assortment mix', subtitle: '% of listings by brand tier', keys: ['Value', 'Mid-market', 'Premium'], data: KW.tierMix.map((t) => ({ label: String(t.channel), segments: ['Value', 'Mid-market', 'Premium'].map((k) => ({ key: k, value: Number(t[k]) })) })) },
      { kind: 'table', title: 'Channel overview', subtitle: 'Simulated audit', head: ['Channel', 'Type', 'Listings', 'On promotion', 'In stock'], rows: KW.channelStats.map((c) => [c.channel, c.type, c.skus, `${c.onDealPct}%`, `${c.inStockPct}%`]) }
    ],
    findings: [
      'Marketplaces carry the widest range and promote most often, making them the price reference point for shoppers.',
      'The showroom index is high mainly because showrooms stock premium and mid-market brands only, a mix effect rather than like-for-like overpricing.',
      'Hypermarkets sit close to marketplace prices with less discounting, competing on convenience and in-store availability.',
      'A brand entering the market would need clear price positioning per channel to avoid undercutting its own showroom partners online.'
    ],
    dataNote: 'Every price, discount and rating on this page is SIMULATED. Channels and brands are anonymised; the figures are not observations from Noon, Amazon.ae or any named retailer, and they are not the original study’s findings.',
    tools: ['Retail audit', 'E-commerce research', 'Excel', 'JavaScript (data generator)'],
    repo: 'https://github.com/Rohithmohan123/rohith-mohan-market-research-portfolio/tree/main/scripts',
    report: '/reports/kitchenware-sample-report.pdf',
    extraDownloads: [{ label: 'Simulated dataset (CSV)', href: '/data/kitchenware_synthetic_observations.csv' }]
  }
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
