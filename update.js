const fs = require('fs');
const file = 'components/audience/audience-page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import {',
  'import {\n  Lightbulb,\n  Target,\n  FlaskConical,\n  BookOpen,'
);

content = content.replace(
  /researchTitle: 'للباحثين'/,
  `researchTitle: 'بوابة البحث والابتكار'`
);

content = content.replace(
  /researchDescription:\s+'واجهة بحثية منظمة لبيانات التعليم والاقتصاد في السودان، مخصصة للباحثين، الجامعات، المنظمات، الصحفيين، والمحللين\.',/,
  `researchDescription:
      'منصة مخصصة للباحثين لنشر أبحاثهم وإبداعاتهم، وللشركات وأصحاب الأعمال لطرح المشاكل والمنتجات التي يريدون من طلاب الجامعات والباحثين العمل عليها لإيجاد حلول مبتكرة.',`
);

content = content.replace(
  /qualityDesc: 'لوحة مستقبلية للتكرارات، النواقص، البيانات القديمة، ومستوى الثقة\.'/g,
  `qualityDesc: 'لوحة مستقبلية للتكرارات، النواقص، البيانات القديمة، ومستوى الثقة.',
      addIdea: 'أضف فكرة أو بحث',
      addIdeaDesc: 'شارك مشروعك، بحثك، أو إبداعك مع المجتمع الأكاديمي والشركات لتعزيز الابتكار.',
      addProblem: 'طرح مشكلة أو تطوير منتج',
      addProblemDesc: 'للشركات وأصحاب الأعمال: اطرح التحديات التي تواجهك ليقوم الطلاب بإيجاد حلول لها.',
      researchData: 'البيانات البحثية',
      researchDataDesc: 'بيانات ومعلومات مفتوحة ومخصصة لمساعدة الباحثين في دراساتهم وتحليلاتهم.'`
);

content = content.replace(
  /researchTitle: 'For Researchers'/,
  `researchTitle: 'Research & Innovation Portal'`
);

content = content.replace(
  /researchDescription:\s+'A structured research interface for Sudanese education and economic data. Designed for researchers, universities, organizations, journalists, and analysts\.',/,
  `researchDescription:
      'A dedicated platform for researchers to publish their work, and for companies to post technical problems and product developments for university students to solve.',`
);

content = content.replace(
  /qualityDesc: 'Future dashboard for duplicates, missing fields, outdated records, and confidence labels\.'/g,
  `qualityDesc: 'Future dashboard for duplicates, missing fields, outdated records, and confidence labels.',
      addIdea: 'Add an Idea or Research',
      addIdeaDesc: 'Share your project, research, or idea with the academic community and businesses.',
      addProblem: 'Post a Problem or Product',
      addProblemDesc: 'For businesses: post the challenges you face so students and researchers can find solutions.',
      researchData: 'Research Data',
      researchDataDesc: 'Open data and information designed to help researchers with their studies and analysis.'`
);

fs.writeFileSync(file, content);
console.log('Translations updated successfully.');
