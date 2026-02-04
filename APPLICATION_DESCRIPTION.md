# 🎓 ProjectVerse - Student Project Management System (SPMS)

## Application Overview

**ProjectVerse** is a comprehensive web-based Student Project Management System designed for engineering colleges to streamline the entire lifecycle of final year project management. The system facilitates problem statement creation, student batch management, faculty coordination, and project assignment through an intuitive domain-based workflow.

---

## 🎯 Purpose & Problem Solved

### The Problem
Engineering colleges face significant challenges in managing final year projects:
- Manual assignment of projects to students
- Difficulty tracking faculty quotas and availability
- Lack of organized problem statement repositories
- Poor coordination between faculty, students, and administration
- Time-consuming batch management processes

### The Solution
ProjectVerse provides a centralized platform that:
- Automates project assignment workflows
- Manages faculty quotas intelligently
- Organizes problem statements by department and domain
- Enables bulk data operations via CSV uploads
- Provides role-based dashboards for all stakeholders
- Implements single-device session management for security

---

## 👥 User Roles & Capabilities

### 1. **Admin (tadmin)**
**Primary Responsibilities:** Complete system oversight and management

**Capabilities:**
- Create, update, and delete faculty accounts
- Create, update, and delete student batches
- Create and manage problem statements
- Assign problem statements to faculty members
- View all batches and their project selections
- Bulk upload faculty, batches, and problem statements via CSV
- Monitor system-wide analytics
- Manage department configurations (AIDS, Civil, Mech, BME, ECE, EEE, CSBS, CSE, IT)

### 2. **Faculty**
**Primary Responsibilities:** Create problem statements and supervise student projects

**Capabilities:**
- View personal dashboard with quota information
- Create problem statements in their domain expertise
- View assigned batches and their project selections
- Track quota usage (quotaLimit vs quotaUsed)
- Delete their own problem statements
- View batch details for assigned projects

### 3. **Batch (Student Groups)**
**Primary Responsibilities:** Select and work on final year projects

**Capabilities:**
- Enter student details (up to 7 students per batch)
- Browse problem statements by domain
- Select domain of interest from available options
- View filtered problem statements based on selected domain
- Choose one problem statement for the batch
- View project details and faculty information
- Access Google Drive links for project resources
- Generate batch reports

---

## 🔄 Complete Application Workflow

### **Phase 1: Setup (Admin)**
```
1. Admin logs in
2. Creates faculty accounts (manually or bulk CSV upload)
3. Sets faculty quota limits
4. Creates student batches (manually or bulk CSV upload)
5. Creates problem statements OR assigns faculty to create them
```

### **Phase 2: Problem Statement Creation (Admin/Faculty)**
```
Admin/Faculty creates PS with:
├── Title
├── Description
├── Department (AIDS, Civil, Mech, etc.)
├── Domain (AGENTIC AI, MACHINE LEARNING, etc.)
├── Google Drive Link (resources)
└── Faculty Assignment (Admin only)
```

### **Phase 3: Student Selection (Batch)**
```
Batch Login
    ↓
Enter Student Details (Max 7)
    ↓
Choose Department Domain
    ↓
View Filtered Problem Statements
    ↓
Select Problem Statement
    ↓
Locked & Assigned
```

### **Phase 4: Monitoring (All Roles)**
```
Admin: View all batches, faculty quotas, PS assignments
Faculty: View assigned batches, quota usage
Batch: View selected project, faculty details
```

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Form Management:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Inter, Space Grotesk (Google Fonts)
- **Analytics:** Vercel Analytics

### **Backend Integration**
- **API Base URL:** `https://spms-backend-api.vercel.app/api/v1`
- **Authentication:** JWT-based tokens
- **Session Management:** Single device login enforcement
- **File Upload:** CSV bulk upload support

### **Key Features**
- Server-side rendering (SSR) with Next.js
- Client-side state management with React Hooks
- Type-safe API calls with TypeScript
- Responsive design (mobile, tablet, desktop)
- SEO optimized with metadata and structured data
- Progressive Web App (PWA) ready

---

## 📡 API Documentation

### **Base URL**
```
https://spms-backend-api.vercel.app/api/v1
```

### **Authentication Endpoints**

#### **1. Login**
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@example.com",      // For admin/faculty
  "username": "batch_username",      // For batch
  "password": "password123",
  "apiKey": "temp-key"
}

Response (Success - 200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "tadmin" | "faculty" | "batch",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "batch_username"
  }
}

Response (Already Logged In - 403):
{
  "success": false,
  "message": "You are already logged in on another device",
  "code": "ALREADY_LOGGED_IN",
  "hasActiveSession": true
}

Response (Invalid Credentials - 401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### **2. Force Login**
```http
POST /auth/force-login
Content-Type: application/json

Request Body:
{
  "email": "admin@example.com",
  "password": "password123",
  "apiKey": "temp-key"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... },
  "message": "Previous session terminated. Logged in successfully."
}
```

#### **3. Logout**
```http
POST /auth/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **Admin Endpoints**

#### **Faculty Management**

**Get All Faculties**
```http
GET /admin/faculties
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 10,
  "faculties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Smith",
      "email": "john.smith@college.edu",
      "department": "AIDS",
      "quotaLimit": 5,
      "quotaUsed": 3,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

**Create Faculty**
```http
POST /admin/faculties
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Dr. Jane Doe",
  "email": "jane.doe@college.edu",
  "password": "securePassword123",
  "department": "CSE",
  "quotaLimit": 5
}

Response (201):
{
  "success": true,
  "faculty": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dr. Jane Doe",
    "email": "jane.doe@college.edu",
    "department": "CSE",
    "quotaLimit": 5,
    "quotaUsed": 0
  }
}
```

**Update Faculty**
```http
PUT /admin/faculties/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Dr. Jane Smith",
  "quotaLimit": 7
}

Response (200):
{
  "success": true,
  "faculty": { ... }
}
```

**Delete Faculty**
```http
DELETE /admin/faculties/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Faculty deleted successfully"
}
```

#### **Batch Management**

**Get All Batches**
```http
GET /admin/batches
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 25,
  "batches": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "batchName": "AIDS-IV-A-01",
      "username": "aids_iv_a_01",
      "department": "AIDS",
      "year": "IV",
      "section": "A",
      "students": [...],
      "projectId": "507f1f77bcf86cd799439014",
      "isLocked": true
    }
  ]
}
```

**Create Batch**
```http
POST /admin/batches
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "batchName": "CSE-IV-B-02",
  "username": "cse_iv_b_02",
  "password": "batchPass123"
}

Response (201):
{
  "success": true,
  "batch": {
    "_id": "507f1f77bcf86cd799439015",
    "batchName": "CSE-IV-B-02",
    "username": "cse_iv_b_02",
    "isLocked": false
  }
}
```

**Update Batch**
```http
PUT /admin/batches/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "batchName": "CSE-IV-B-03"
}

Response (200):
{
  "success": true,
  "batch": { ... }
}
```

**Delete Batch**
```http
DELETE /admin/batches/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

**Get Batch Details (Admin)**
```http
GET /admin/batches/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "batch": {
    "_id": "507f1f77bcf86cd799439013",
    "batchName": "AIDS-IV-A-01",
    "students": [
      {
        "name": "Student Name",
        "rollNo": "20CS001",
        "email": "student@college.edu",
        "phone": "9876543210"
      }
    ],
    "projectId": {
      "_id": "507f1f77bcf86cd799439014",
      "title": "AI-Powered Chatbot",
      "facultyId": {
        "name": "Dr. John Smith",
        "email": "john.smith@college.edu"
      }
    }
  }
}
```

#### **Problem Statement Management**

**Get All Problem Statements**
```http
GET /admin/problem-statements
GET /admin/problem-statements?department=AIDS
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 50,
  "problemStatements": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "AI-Powered Healthcare Diagnosis System",
      "description": "Develop an AI system for medical diagnosis...",
      "department": "AIDS",
      "domain": "MACHINE LEARNING",
      "gDriveLink": "https://drive.google.com/...",
      "facultyId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Dr. John Smith",
        "email": "john.smith@college.edu"
      },
      "isAssigned": false,
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ]
}
```

**Create Problem Statement**
```http
POST /admin/problem-statements
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Blockchain-Based Voting System",
  "description": "Create a secure voting system using blockchain technology...",
  "department": "CSE",
  "domain": "BLOCKCHAIN",
  "gDriveLink": "https://drive.google.com/file/d/...",
  "facultyId": "507f1f77bcf86cd799439011"
}

Response (201):
{
  "success": true,
  "ps": {
    "_id": "507f1f77bcf86cd799439017",
    "title": "Blockchain-Based Voting System",
    "department": "CSE",
    "domain": "BLOCKCHAIN",
    "facultyId": { ... },
    "isAssigned": false
  }
}
```

**Delete Problem Statement**
```http
DELETE /admin/problem-statements/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Problem statement deleted successfully"
}
```

---

### **Faculty Endpoints**

**Get Faculty Dashboard**
```http
GET /faculty/dashboard
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "dashboard": {
    "facultyDetails": {
      "name": "Dr. John Smith",
      "email": "john.smith@college.edu",
      "department": "AIDS",
      "quotaLimit": 5,
      "quotaUsed": 3
    },
    "totalProblemStatements": 8,
    "assignedBatches": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "batchName": "AIDS-IV-A-01",
        "projectId": {
          "_id": "507f1f77bcf86cd799439016",
          "title": "AI-Powered Healthcare Diagnosis System"
        }
      }
    ]
  }
}
```

**Get My Problem Statements**
```http
GET /faculty/problem-statements
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "list": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "AI-Powered Healthcare Diagnosis System",
      "description": "...",
      "domain": "MACHINE LEARNING",
      "department": "AIDS",
      "gDriveLink": "https://drive.google.com/...",
      "isAssigned": true
    }
  ]
}
```

**Create Problem Statement (Faculty)**
```http
POST /faculty/problem-statements
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Natural Language Processing for Medical Records",
  "description": "Develop an NLP system to extract insights from medical records...",
  "domain": "NLP",
  "gDriveLink": "https://drive.google.com/file/d/..."
}

Response (201):
{
  "success": true,
  "ps": {
    "_id": "507f1f77bcf86cd799439018",
    "title": "Natural Language Processing for Medical Records",
    "domain": "NLP",
    "facultyId": "507f1f77bcf86cd799439011",
    "isAssigned": false
  }
}
```

**Delete Problem Statement (Faculty)**
```http
DELETE /faculty/problem-statements/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Problem statement deleted successfully"
}
```

**Get Batch Details (Faculty)**
```http
GET /faculty/batches/:batchId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "batch": {
    "_id": "507f1f77bcf86cd799439013",
    "batchName": "AIDS-IV-A-01",
    "students": [...],
    "projectId": { ... }
  }
}
```

---

### **Batch Endpoints**

**Get Available Domains**
```http
GET /batch/domains?department=AIDS
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "department": "AIDS",
  "domains": [
    "AGENTIC AI",
    "MACHINE LEARNING",
    "DEEP LEARNING",
    "NLP",
    "COMPUTER VISION"
  ]
}
```

**Get Problem Statements by Domain**
```http
GET /batch/problem-statements?department=AIDS&domain=MACHINE%20LEARNING
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "ps": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "AI-Powered Healthcare Diagnosis System",
      "description": "...",
      "department": "AIDS",
      "domain": "MACHINE LEARNING",
      "gDriveLink": "https://drive.google.com/...",
      "facultyId": {
        "name": "Dr. John Smith",
        "email": "john.smith@college.edu"
      },
      "isAssigned": false
    }
  ]
}
```

**Get Batch Details**
```http
GET /batch/:batchId/details
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "batch": {
    "_id": "507f1f77bcf86cd799439013",
    "batchName": "AIDS-IV-A-01",
    "department": "AIDS",
    "students": [...],
    "projectId": { ... },
    "isLocked": true
  }
}
```

**Save Students**
```http
POST /batch/:batchId/students
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "students": [
    {
      "name": "John Doe",
      "rollNo": "20CS001",
      "email": "john.doe@college.edu",
      "phone": "9876543210"
    },
    {
      "name": "Jane Smith",
      "rollNo": "20CS002",
      "email": "jane.smith@college.edu",
      "phone": "9876543211"
    }
  ]
}

Response (200):
{
  "success": true,
  "batch": {
    "_id": "507f1f77bcf86cd799439013",
    "students": [...]
  }
}
```

**Choose Problem Statement**
```http
PUT /batch/:batchId/choose-ps
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "psId": "507f1f77bcf86cd799439016"
}

Response (200):
{
  "success": true,
  "message": "Problem statement selected successfully",
  "batch": {
    "_id": "507f1f77bcf86cd799439013",
    "projectId": "507f1f77bcf86cd799439016",
    "isLocked": true
  }
}
```

**Generate Batch Report**
```http
GET /batch/:batchId/report
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "report": {
    "batchName": "AIDS-IV-A-01",
    "department": "AIDS",
    "students": [...],
    "project": {
      "title": "AI-Powered Healthcare Diagnosis System",
      "domain": "MACHINE LEARNING",
      "faculty": {
        "name": "Dr. John Smith",
        "email": "john.smith@college.edu"
      }
    },
    "generatedAt": "2026-02-02T20:00:00Z"
  }
}
```

---

### **Public Endpoints**

**Get Unassigned Problem Statements**
```http
GET /problem-statements/unassigned

Response (200):
{
  "success": true,
  "count": 20,
  "problemStatements": [...]
}
```

---

### **Bulk Upload Endpoints**

**Bulk Upload Faculty**
```http
POST /faculty/bulk-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: faculty.csv

CSV Format:
name,email,password,department,quotaLimit
Dr. John Smith,john.smith@college.edu,pass123,AIDS,5
Dr. Jane Doe,jane.doe@college.edu,pass456,CSE,7

Response (200):
{
  "success": true,
  "message": "Bulk upload successful",
  "created": 2,
  "failed": 0,
  "errors": []
}
```

**Bulk Upload Batches**
```http
POST /batch/bulk-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: batches.csv

CSV Format:
batchName,username,password,department,year,section
AIDS-IV-A-01,aids_iv_a_01,pass123,AIDS,IV,A
CSE-IV-B-02,cse_iv_b_02,pass456,CSE,IV,B

Response (200):
{
  "success": true,
  "message": "Bulk upload successful",
  "created": 2,
  "failed": 0,
  "errors": []
}
```

**Bulk Upload Problem Statements**
```http
POST /problem-statements/bulk-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: problem_statements.csv

CSV Format:
title,description,department,domain,gDriveLink,facultyEmail
AI Healthcare System,Develop an AI system...,AIDS,MACHINE LEARNING,https://drive.google.com/...,john.smith@college.edu

Response (200):
{
  "success": true,
  "message": "Bulk upload successful",
  "created": 1,
  "failed": 0,
  "errors": []
}
```

---

## 🔐 Authentication & Security

### **JWT Token Management**
- Tokens are stored in `localStorage` on the client
- All protected routes require `Authorization: Bearer <token>` header
- Tokens expire after a configurable period
- Session termination on multiple device login

### **Session Management**
- **Single Device Login:** Only one active session per user
- **Force Login:** Terminates previous session and creates new one
- **Auto Logout:** Automatic logout on token expiration or session termination
- **Error Codes:**
  - `ALREADY_LOGGED_IN`: User has active session on another device
  - `SESSION_TERMINATED`: Session was terminated by another login
  - `TOKEN_EXPIRED`: JWT token has expired

### **Role-Based Access Control**
- **Admin:** Full system access
- **Faculty:** Limited to own problem statements and assigned batches
- **Batch:** Limited to own batch data and available problem statements

---

## 📊 Data Models

### **Faculty**
```typescript
{
  _id: string;
  name: string;
  email: string;
  department: "AIDS" | "Civil" | "Mech" | "BME" | "ECE" | "EEE" | "CSBS" | "CSE" | "IT";
  quotaLimit: number;
  quotaUsed: number;
  createdAt: Date;
}
```

### **Batch**
```typescript
{
  _id: string;
  batchName: string;
  username: string;
  department: string;
  year: "I" | "II" | "III" | "IV";
  section: string;
  students: Student[];
  projectId: string | null;
  isLocked: boolean;
  createdAt: Date;
}
```

### **Student**
```typescript
{
  name: string;
  rollNo: string;
  email: string;
  phone: string;
}
```

### **Problem Statement**
```typescript
{
  _id: string;
  title: string;
  description: string;
  department: string;
  domain: string;
  gDriveLink: string;
  facultyId: {
    _id: string;
    name: string;
    email: string;
  };
  isAssigned: boolean;
  createdAt: Date;
}
```

---

## 🎨 UI/UX Design

### **Color Palette**
- **Primary:** Deep Purple (#ad005c) - Intellect and creativity
- **Background:** Light Lavender (#f9fafb) - Calm atmosphere
- **Accent:** Soft Blue (#001c70) - Refreshing contrast
- **Text:** Dark Gray (#1f2937)
- **Success:** Green (#10b981)
- **Error:** Red (#ef4444)

### **Typography**
- **Headlines:** Space Grotesk (Sans-serif)
- **Body Text:** Inter (Sans-serif)

### **Design Principles**
- Clean, grid-based layouts
- Outline-style icons (Lucide React)
- Subtle transitions and animations
- Responsive design (mobile-first)
- Consistent spacing and alignment
- Accessible color contrasts

---

## 🚀 Getting Started for Developers

### **Prerequisites**
```bash
- Node.js 18 or higher
- npm or yarn package manager
- Git
```

### **Installation Steps**

1. **Clone the Repository**
```bash
git clone https://github.com/Tharvesh588/SPMS_Frontend.git
cd SPMS_Frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://spms-backend-api.vercel.app/api/v1
```

4. **Run Development Server**
```bash
npm run dev
```
Application will be available at `http://localhost:9000`

5. **Build for Production**
```bash
npm run build
npm start
```

### **Project Structure**
```
SPMS_Frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard & features
│   │   ├── faculty/           # Faculty dashboard & features
│   │   ├── batch/             # Batch dashboard & features
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── faculty/          # Faculty-specific components
│   │   ├── batch/            # Batch-specific components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                   # Utility functions
│   │   ├── api.ts            # API client functions
│   │   └── utils.ts          # Helper utilities
│   └── types/                 # TypeScript type definitions
│       └── index.ts          # Shared types
├── public/                    # Static assets
├── docs/                      # Documentation
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
└── next.config.ts            # Next.js config
```

### **Key Files to Understand**

1. **`src/lib/api.ts`** - All API integration functions
2. **`src/types/index.ts`** - TypeScript type definitions
3. **`src/app/*/dashboard/page.tsx`** - Role-specific dashboards
4. **`src/components/ui/*`** - Reusable UI components

---

## 🔧 Development Guidelines

### **Adding New Features**

1. **Define Types** in `src/types/index.ts`
2. **Create API Functions** in `src/lib/api.ts`
3. **Build Components** in `src/components/`
4. **Create Pages** in `src/app/`
5. **Test Thoroughly** before deployment

### **Code Standards**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations
- Validate forms with Zod schemas
- Use Tailwind CSS for styling

### **API Integration Pattern**
```typescript
// 1. Define types
type MyData = {
  id: string;
  name: string;
};

// 2. Create API function
export async function getMyData(): Promise<MyData[]> {
  const response = await fetcher<{ success: boolean, data: MyData[] }>('/my-endpoint');
  return response.data;
}

// 3. Use in component
const [data, setData] = useState<MyData[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      const result = await getMyData();
      setData(result);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

---

## 📈 Deployment

### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### **Environment Variables (Production)**
```env
NEXT_PUBLIC_API_URL=https://spms-backend-api.vercel.app/api/v1
```

---

## 🐛 Common Issues & Solutions

### **Issue: Login fails with "Invalid credentials"**
**Solution:** Verify the API base URL and check network tab for errors

### **Issue: Token expired errors**
**Solution:** Implement token refresh logic or re-login

### **Issue: Bulk upload fails**
**Solution:** Verify CSV format matches expected schema

### **Issue: Session terminated on login**
**Solution:** Use force login to terminate previous session

---

## 📞 Support & Contact

**Developer:** Tharvesh Muhaideen A  
**Organization:** TM Nexus Tools  
**Website:** [imtharvesh.me](https://imtharvesh.me)  
**Live Application:** [spms.egspgroup.in](https://spms.egspgroup.in)  
**GitHub:** [@Tharvesh588](https://github.com/Tharvesh588)

---

## 📄 License

© 2026 TM Nexus Tools - Tharvesh Muhaideen A. All rights reserved.

Developed for **EGSP Group** - EGS Pillay Engineering College

---

## 🎯 Future Enhancements

- [ ] Domain search and filtering
- [ ] Problem statement count per domain
- [ ] Domain descriptions and tags
- [ ] Analytics dashboard with charts
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced search and filters
- [ ] Project progress tracking

---

**Built with ❤️ by Tharvesh Muhaideen A (TM Nexus Tools)**

*Making academic project management seamless for engineering colleges worldwide.*
