export const profile = {
  name: 'Robert Rankin',
  title: 'Senior AI Engineer / Software Engineer',
  location: 'North Las Vegas, NV',
  email: 'rob.rankin.16@gmail.com',
  summary: [
    'Senior AI Engineer and Backend Engineer with 12+ years of experience building scalable backend platforms, including 4+ years delivering AI-driven products across Fortune 500 companies. Extensive experience developing microservices, REST/GraphQL APIs and cloud-native applications, with a strong background in production AI systems.',
    'At Hedra, I contributed to generative AI technologies for video creation by building scalable backend services, AI orchestration pipelines, and cloud infrastructure supporting multimodal models. I integrate LLMs, diffusion models, and AI inference services to deliver high-performance, production-ready applications.',
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/robert-rankin-bb4864420/' },
    // TODO: replace with your GitHub URL or delete this entry
    { label: 'GitHub', href: 'https://github.com/robrankin313' },
  ],
}

export const roles = [
  'Multimodal inference pipelines',
  'Production LLM systems',
  'Scalable backend platforms',
  'Generative video & avatars',
]

// All figures come directly from the resume
export const stats = [
  { to: 12, suffix: '+', label: 'years building backend platforms' },
  { to: 37, suffix: '%', label: 'lower video-generation latency at Hedra' },
  { to: 40, suffix: '%', label: 'less call-center workload (healthcare voice bot)' },
  { to: 30, suffix: 'M', label: 'telemetry events processed per day' },
]

export const skills = [
  { group: 'AI / GenAI', items: ['LLMs (OpenAI, Azure OpenAI)', 'RAG', 'Prompt Orchestration', 'LangChain', 'LangGraph', 'AutoGen', 'CrewAI', 'Semantic Kernel', 'NLP', 'Embeddings & Semantic Search', 'Pinecone', 'pgvector', 'MCP', 'LLM Evaluation', 'Claude Code', 'Hugging Face', 'DeepSeek'] },
  { group: 'Machine Learning', items: ['PyTorch', 'TensorFlow', 'Supervised Learning', 'XGBoost', 'Recommendation Systems'] },
  { group: 'Backend', items: ['Python', 'FastAPI', 'Django', 'JavaScript', 'TypeScript', 'Node.js', 'REST', 'GraphQL', 'Microservices', 'Celery', 'JWT', 'RBAC', 'System Architecture'] },
  { group: 'Frontend', items: ['React', 'Next.js'] },
  { group: 'Data', items: ['PostgreSQL', 'Redis', 'MongoDB', 'Neo4j', 'Data Modeling'] },
  { group: 'Cloud & DevOps', items: ['AWS (EKS, RDS, S3, CloudWatch)', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'GitHub Actions', 'Helm', 'Vertex AI', 'MLOps'] },
  { group: 'Quality & Delivery', items: ['Jest', 'Supertest', 'Integration Testing', 'Agile/Scrum', 'Mentoring & Code Review'] },
]

export const experience = [
  {
    role: 'Senior AI Engineer',
    company: 'Hedra',
    place: 'San Francisco, CA',
    period: 'May 2025 - Jun 2026',
    about: 'A frontier AI lab building the unified creative superintelligence to power content creators and marketers.',
    bullets: [
      'Led development of multimodal inference pipelines powering Character-3, reducing end-to-end video generation latency by 37% through optimized GPU scheduling, KV-cache reuse, and asynchronous media preprocessing.',
      'Built an AI Talking Avatar pipeline connecting speech-to-phoneme alignment outputs with facial animation models, enabling lip-synced video from static images and audio.',
      'Built an asynchronous Video Ad generation pipeline that converts marketing prompts into structured scene JSON via LLMs, orchestrating image, video, and TTS services with FFmpeg-based assembly and job queues.',
      'Developed GPU-accelerated media preprocessing using CUDA-enabled image decoding.',
      'Implemented an LLM-as-judge evaluation system to score scripts and intermediate outputs for coherence, visual consistency, and prompt adherence before committing GPU resources to full rendering.',
      'Established MLOps pipelines for CI/CD of inference models using Kubernetes orchestration.',
    ],
    tech: ['Python', 'CUDA', 'LLM', 'RAG', 'LangChain', 'PostgreSQL', 'FFmpeg', 'MLOps'],
  },
  {
    role: 'AI Engineer',
    company: 'Elevance Systems',
    place: 'Cupertino, CA',
    period: 'Jul 2022 - May 2025',
    about: 'Managed IT service provider for healthcare organizations.',
    bullets: [
      'Led AI/ML and Generative AI initiatives for healthcare automation, claim processing, and clinical workflow optimization.',
      'Built an AI-driven healthcare IVR voice bot with Azure Speech Services, LangChain, and Vertex AI, supporting HIPAA-compliant handling of PHI and reducing call center workload by 40%.',
      'Engineered a prompt orchestration layer combining user input, vector-search context, and system constraints to reduce hallucination and improve accuracy.',
      'Created a denial reduction application using XGBoost, NLP models, and LLM-based recommendations to prevent insurance claim denials before submission.',
      'Trained and fine-tuned transformer-based NLP classifiers in PyTorch for clinical text categorization and denial-risk scoring.',
    ],
    tech: ['Python', 'FastAPI', 'Django', 'LangChain', 'PyTorch', 'XGBoost', 'Azure', 'Docker', 'GitHub Actions'],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Extreme Networks',
    place: 'San Jose, CA',
    period: 'Mar 2020 - Jun 2022',
    about: 'Wired, wireless, and SD-WAN infrastructure with analytics, orchestration, and security services.',
    bullets: [
      'Built a Device Telemetry Ingestion API (FastAPI) processing over 30M telemetry events per day with Kafka-based buffering.',
      'Developed a React/Next.js (TypeScript) dashboard rendering live latency, packet loss, and uptime via WebSocket subscriptions with sub-second updates.',
      'Integrated Google Maps into the network management platform for real-time visualization of enterprise Wi-Fi access points.',
      'Fixed memory leaks in long-running Celery workers caused by unbounded in-memory caching of telemetry payloads.',
      'Led backend design discussions and guided 3 junior engineers.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'Kafka', 'Celery', 'AWS', 'Kubernetes'],
  },
  {
    role: 'Backend Engineer',
    company: 'Extreme Networks',
    place: 'San Jose, CA',
    period: 'Sep 2017 - Feb 2020',
    bullets: [
      'Built RESTful APIs for device inventory and configuration, reducing average API latency by 32% through query optimization, connection pooling, and Redis caching.',
      'Implemented asynchronous event processing with Kafka, cutting event propagation from minutes to seconds.',
      'Automated deployments to AWS (EKS, RDS, S3, CloudWatch) using Docker, Kubernetes, GitHub Actions, and Helm.',
      'Raised regression test coverage to 85% with Jest integration and unit testing pipelines.',
    ],
    tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Kafka', 'AWS', 'Helm', 'Jest'],
  },
  {
    role: 'Junior Software Engineer',
    company: 'AT&T',
    place: 'San Ramon, CA',
    period: 'Mar 2015 - Aug 2017',
    bullets: [
      'Improved API response times by optimizing SQL queries and adding indexes in PostgreSQL.',
      'Implemented JWT-based authentication and role-based authorization.',
    ],
    tech: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT', 'Docker'],
  },
  {
    role: 'Software Engineer Intern',
    company: 'AT&T',
    place: 'San Ramon, CA',
    period: 'Jun 2014 - Mar 2015',
    bullets: ['Developed and maintained internal web application features using JavaScript and React.'],
    tech: ['JavaScript', 'React', 'Git'],
  },
]

export const education = {
  degree: 'B.S. Computer Science',
  school: 'University of Nebraska at Omaha',
  period: 'Aug 2010 - Dec 2014',
}
