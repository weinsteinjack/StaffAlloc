# Product Requirements Document: StaffAlloc
**Version:** 1.0
**Date:** November 5, 2025
**Author:** Senior Product Manager
**Status:** Draft

## 1. Executive Summary & Vision

### Product Name
StaffAlloc

### Overview
StaffAlloc is an intelligent, AI-powered staffing management application designed to replace cumbersome and error-prone spreadsheets. It provides project managers, directors, and resource managers with a centralized platform to create projects, allocate employee hours, track budgets, and optimize resource utilization across the entire organization.

### Purpose
The primary purpose of StaffAlloc is to solve the critical business challenges of manual resource planning. By automating calculations, providing real-time validation, and offering AI-driven insights, StaffAlloc empowers organizations to make faster, data-driven staffing decisions. This leads to improved project outcomes, increased financial efficiency, and a more balanced workload for employees.

### Vision
Our vision is to transform resource management from a reactive, administrative chore into a proactive, strategic function. StaffAlloc will become the single source of truth for "who is working on what, when, and for how long," enabling organizations to perfectly align their talent with their strategic objectives and anticipate future needs before they arise.

## 2. The Problem

### Problem Statement
Organizations rely on a fragmented system of spreadsheets to manage project staffing and resource allocation. This manual process is inefficient, prone to costly errors, and lacks real-time visibility. Project managers struggle to prevent budget overruns and employee burnout, while leadership lacks the consolidated data needed for strategic forecasting and decision-making. There is no effective way to see cross-project dependencies, identify available talent quickly, or optimize the deployment of the company's most valuable asset: its people.

### User Personas and Scenarios

*   **Priya, the Hands-On PM:** Spends hours each week in spreadsheets manually calculating FTEs and tracking funded hours. She constantly worries about formula errors and has accidentally double-booked key employees because she lacks a unified view of their commitments. She needs a tool that automates the math and provides instant warnings to keep her projects on track and on budget.

*   **David, the Portfolio Overseer:** Is accountable for the financial health and utilization of his entire division but has no easy way to get a consolidated view. He spends days aggregating data from multiple PMs' spreadsheets for his executive reports, and he lacks confidence in the data's accuracy. He needs a real-time dashboard to monitor portfolio health, mitigate risks, and forecast future hiring needs.

*   **Maria, the Utilization Optimizer:** Is responsible for ensuring employees are effectively and equitably utilized across the company. The siloed nature of spreadsheets makes it impossible for her to see who is overworked, who is on the bench, or who has the right skills and availability for a new project. She operates in a constant state of reactive firefighting and needs a global, unified view to proactively manage the company's talent pool.

## 3. Goals & Success Metrics

| Goal | Key Performance Indicator (KPI) | Target |
| :--- | :--- | :--- |
| **Improve Operational Efficiency for PMs** | Time required to create or update a project staffing plan. | Reduce by 50% compared to spreadsheet methods within 3 months of launch. |
| | Number of allocation errors (over-budget, over-FTE) caught by the system vs. reported manually. | Reduce manually reported errors by 90% within 6 months. |
| **Increase Resource Utilization & Financial Health** | Overall billable employee utilization rate (Allocated Hours / Capacity). | Increase by 10% in the first 6 months. |
| | Percentage of employees on the "bench" (FTE < 25%). | Decrease bench time by 25% in the first year. |
| **Enhance Strategic Decision Making** | Time to generate a portfolio-level staffing report for executive review. | Reduce from 2-3 days to <5 minutes. |
| | Weekly engagement with AI features (RAG queries, recommendations). | 50% of weekly active users engage with an AI feature at least once by Q2 post-launch. |
| **Drive User Adoption & Satisfaction** | Percentage of PMs and Directors actively using the platform weekly. | 80% adoption within 2 months of rollout. |
| | Net Promoter Score (NPS). | Achieve an NPS of +40 within 6 months. |

## 4. Functional Requirements & User Stories

### Epic 1: Project & Staffing Setup
Core functionality for establishing the foundational elements of projects, teams, and organizational standards.

*   **US001:** As a Priya, the Hands-On PM, I want to create a new project with a name, client, start date, and duration in sprints, so that I can establish the project's basic framework and timeline.
    *   **Acceptance Criteria:**
        *   Given I am on the main project dashboard,
        *   When I click the 'Create New Project' button,
        *   Then a form appears with fields for Project Name, Code, Client, Start Date, and Number of Sprints.
        *   When I fill in the details and enter '18' for the number of sprints,
        *   And I click 'Save',
        *   Then the new project is created, its timeline is set to 36 weeks, and I am taken to its allocation grid.
*   **US002:** As a Priya, the Hands-On PM, I want to add an employee to my project by selecting them from a central list and assigning their Role, LCAT, and total Funded Hours, so that I can establish their budget cap for the project.
    *   **Acceptance Criteria:**
        *   Given I am on the project allocation grid for 'Project Alpha',
        *   When I click the 'Add Employee' button,
        *   And I search for and select 'John Smith' from the employee list,
        *   Then a new row is added to the grid for John Smith.
        *   When I set his Role to 'SW Engineer', LCAT to 'Level 3', and Funded Hours to '1000',
        *   Then the row is saved, and the 'Remaining Hours' column for John shows '1000'.
*   **US007:** As a Priya, the Hands-On PM, I want the ability to override the system-calculated full-time hours for a specific month on my project, so that I can account for unique project schedules or billing requirements.
    *   **Acceptance Criteria:**
        *   Given the system calculates 168 full-time hours for September based on business days,
        *   When I navigate to the project settings and find the 'Monthly Hours' configuration,
        *   And I override the September hours to '160',
        *   Then all FTE calculations for September on my project grid are now based on a denominator of 160 hours.
*   **US018:** As a Maria, the Utilization Optimizer, I want a settings area to define and manage a standardized list of Roles and LCATs, so that all PMs use consistent terminology, ensuring data accuracy for my roll-up reports.
    *   **Acceptance Criteria:**
        *   Given I am logged in with administrative privileges,
        *   When I navigate to 'System Settings' -> 'Roles & LCATs',
        *   Then I see a list of existing roles.
        *   When I click 'Add New Role' and enter 'Data Scientist' and save,
        *   Then 'Data Scientist' becomes a selectable option for all PMs when they add an employee to a project.

### Epic 2: Core Allocation Experience
The primary interface for PMs to plan and manage employee hours, designed for speed, clarity, and real-time validation.

*   **US003:** As a Priya, the Hands-On PM, I want to allocate hours to an employee for a specific month by typing a number directly into the grid cell, so that I can quickly build my staffing plan in a familiar, spreadsheet-like interface.
    *   **Acceptance Criteria:**
        *   Given John Smith is on my project with 1000 funded hours,
        *   And I am viewing the allocation grid with monthly columns,
        *   When I click on the cell for John Smith under 'September 2024' and type '80',
        *   Then the cell value updates to '80' and the 'Total Allocated Hours' for John becomes '80'.
*   **US004:** As a Priya, the Hands-On PM, I want the system to automatically calculate and display the FTE percentage in a cell as soon as I enter hours, so that I can immediately understand the workload I'm assigning without manual calculations.
    *   **Acceptance Criteria:**
        *   Given the standard full-time hours for September 2024 are calculated by the system as 168,
        *   And I have entered '84' hours for Jane Doe in the September 2024 cell,
        *   When I finish editing the cell,
        *   Then the cell instantly displays both '84 hrs' and '50% FTE' without requiring a page refresh.
*   **US005:** As a Priya, the Hands-On PM, I want the 'Remaining Hours' cell for an employee to turn red and show a negative number if their total allocated hours exceed their funded hours, so that I am immediately alerted to a budget overrun.
    *   **Acceptance Criteria:**
        *   Given Jane Doe has 500 funded hours on my project,
        *   And she already has 450 hours allocated across several months,
        *   When I allocate another 80 hours to her in a new month,
        *   Then her 'Total Allocated Hours' column updates to '530',
        *   And the 'Remaining Hours' column updates to '-30' and its background color changes to red.
*   **US006:** As a Priya, the Hands-On PM, I want to see a clear warning if my allocation causes an employee to exceed 100% FTE for a month across all their projects, so that I can avoid unknowingly over-booking a team member.
    *   **Acceptance Criteria:**
        *   Given Sarah is already allocated 100 hours (60% FTE) on 'Project Beta' for May,
        *   And I am staffing my 'Project Alpha',
        *   When I try to allocate 80 hours (48% FTE) to Sarah for May on 'Project Alpha',
        *   Then the cell for Sarah in May is flagged with a red warning icon.
        *   When I hover over the icon,
        *   Then a tooltip appears stating 'Warning: This allocation puts Sarah at 108% FTE for May across all projects.'
*   **US008:** As a Priya, the Hands-On PM, I want the allocation grid cells to be color-coded in a heatmap style based on FTE percentage, so that I can get an at-a-glance understanding of team utilization.
    *   **Acceptance Criteria:**
        *   Given I am viewing the project allocation grid,
        *   When a cell has an FTE between 1% and 40%, then it is colored light green.
        *   When a cell has an FTE between 81% and 100%, then it is colored dark green.
        *   When a cell has an FTE of 100%, then it is colored yellow.
        *   When a cell has an FTE over 100%, then it is colored red.
*   **US017:** As a Priya, the Hands-On PM, I want to toggle the allocation grid's timeline between a monthly view and a sprint-based view, so that I can align my staffing plan with different planning needs.
    *   **Acceptance Criteria:**
        *   Given I am viewing the allocation grid with columns for 'Jan', 'Feb', 'Mar',
        *   When I click the 'View by Sprints' toggle button,
        *   Then the columns change to 'Sprint 1', 'Sprint 2', 'Sprint 3', etc., with the allocated hours correctly distributed across the sprints.

### Epic 3: Dashboards & Reporting
Providing aggregated, high-level views for strategic oversight, analysis, and sharing.

*   **US011:** As a David, the Portfolio Overseer, I want to view an organization-wide roll-up dashboard, so that I can see the total FTE by Role and a list of all over-allocated employees across my entire portfolio.
    *   **Acceptance Criteria:**
        *   Given I am logged in as a Director,
        *   When I navigate to the 'Portfolio Dashboard',
        *   Then I see widgets displaying 'Overall FTE by Role', 'Over-allocated Employees', and 'Employees on the Bench'.
        *   When I see the 'SW Engineer' role is at 110% FTE,
        *   Then I can click on it to drill down and see a breakdown by project and employee.
*   **US012:** As a Maria, the Utilization Optimizer, I want to view a single employee's timeline that shows all their project commitments on one screen, so that I can easily identify their availability and resolve scheduling conflicts.
    *   **Acceptance Criteria:**
        *   Given I am on the employee database page,
        *   When I click on 'Sarah Jones',
        *   Then I am taken to a timeline view for Sarah Jones.
        *   When I look at the month of May,
        *   Then I see two distinct colored blocks representing her 60% allocation to 'Project Beta' and her 48% allocation to 'Project Alpha'.
*   **US016:** As a David, the Portfolio Overseer, I want to export the project roll-up view to an Excel file, so that I can easily share the data with C-suite executives or perform my own custom analysis.
    *   **Acceptance Criteria:**
        *   Given I am viewing the Portfolio Dashboard,
        *   When I click the 'Export to Excel' button,
        *   Then a .xlsx file is downloaded to my computer.
        *   When I open the file,
        *   Then the data and layout mirror the on-screen dashboard, with projects as rows and months as columns.
*   **US019:** As a Priya, the Hands-On PM, I want a project-specific dashboard that summarizes my total funded vs. allocated hours and shows a burn-down chart, so that I can quickly assess the staffing health of my project.
    *   **Acceptance Criteria:**
        *   Given I am on my 'Project Alpha' page,
        *   When I click the 'Dashboard' tab,
        *   Then I see a summary metric 'Funded Hours: 5000 / Allocated Hours: 4850'.
        *   And I see a line chart showing the planned FTE burn-down over the project's timeline.

### Epic 4: AI-Powered RAG & Querying
Leveraging a conversational interface to provide users with instant answers to complex staffing questions.

*   **US009:** As a David, the Portfolio Overseer, I want to use a chat interface to ask 'What is John Smith's total allocation for Q4?', so that I can get quick answers without navigating through multiple project pages.
    *   **Acceptance Criteria:**
        *   Given I am on the main dashboard,
        *   When I open the AI chat interface and type 'What is John Smith's total allocation for Q4?',
        *   Then the chat responds with a clear summary, such as 'John Smith is allocated for 480 hours in Q4 across Project Alpha (320 hrs) and Project Beta (160 hrs).'
*   **US010:** As a Maria, the Utilization Optimizer, I want to ask the AI assistant 'Show me all Cyber Analysts with less than 50% FTE in November', so that I can quickly identify available staff to fill new project needs.
    *   **Acceptance Criteria:**
        *   Given I am using the AI chat interface,
        *   When I type 'Show me all Cyber Analysts with less than 50% FTE in November',
        *   Then the assistant returns a formatted list of employee names, their current FTE for November, and the projects they are assigned to.

### Epic 5: AI Agent for Optimization & Recommendations
Proactively using AI to guide users toward better staffing decisions, resolve conflicts, and forecast future needs.

*   **US013:** As a Priya, the Hands-On PM, I want the AI agent to recommend suitable employees when I need to fill a role, so that I can staff my project faster with people who have the right skills and availability.
    *   **Acceptance Criteria:**
        *   Given I have an unfilled 'Senior Developer' role on my project for Q3,
        *   When I click the 'Get Recommendations' button for that role,
        *   Then the AI agent suggests 3 employees, showing their name, current Q3 FTE, and relevant skills (e.g., 'David - 60% FTE, Skills: Python, AWS').
*   **US014:** As a Maria, the Utilization Optimizer, I want the AI agent to not only detect cross-project over-allocations but also suggest concrete resolutions, so that I can proactively solve resource conflicts.
    *   **Acceptance Criteria:**
        *   Given Sarah has been allocated to 120% FTE in May,
        *   When I view the conflict alert on the dashboard,
        *   Then the AI agent presents actionable options like '1. Reduce Sarah's hours on Project Beta by 32 hours.' or '2. Reassign 32 hours of Sarah's work on Project Alpha to Mark, who is at 50% FTE.'
*   **US015:** As a David, the Portfolio Overseer, I want the AI agent to provide predictive resource forecasts, so that I can anticipate future hiring needs based on our project pipeline.
    *   **Acceptance Criteria:**
        *   Given I am on the Portfolio Dashboard,
        *   When I view the 'Forecast' widget,
        *   Then I see a message like 'Based on planned projects, you will have a shortage of 3 Senior Developers in Q3. Consider hiring or cross-training.'
*   **US020:** As a Maria, the Utilization Optimizer, I want the AI agent to suggest workload balancing opportunities, so that I can prevent employee burnout and maximize team efficiency.
    *   **Acceptance Criteria:**
        *   Given I am viewing the Portfolio Dashboard,
        *   When the AI agent detects an imbalance,
        *   Then a suggestion appears, such as 'The SW Engineer team on Project Alpha has an average FTE of 95%, while the Cyber team is at 50%. Consider shifting non-specialized tasks to balance the load.'

## 5. Non-Functional Requirements (NFRs)

*   **Performance:**
    *   The allocation grid must provide a near-instant, spreadsheet-like experience. All cell updates, calculations, and validations must render in under 200ms.
    *   Dashboard pages (Project, Portfolio) must load in under 2 seconds.
    *   AI RAG query responses should be returned in under 3 seconds for typical queries.
*   **Security:**
    *   Implement Role-Based Access Control (RBAC). PMs can only edit their assigned projects. Directors have read-only access to all projects in their portfolio. Admins have full system access.
    *   All data must be encrypted at rest (AES-256) and in transit (TLS 1.2+).
    *   The application will undergo regular security audits and penetration testing.
*   **Accessibility:**
    *   The application must be compliant with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
    *   The allocation grid must be fully navigable and editable using only a keyboard.
    *   All components must be compatible with modern screen readers.
*   **Scalability:**
    *   The system must be architected to support at least 1,000 employees and 500 concurrent projects in its first year without performance degradation.
    *   Database queries must be optimized for efficient cross-project and cross-employee aggregation.
*   **Usability:**
    *   The user interface should be clean, intuitive, and familiar to users accustomed to modern web applications and spreadsheets.
    *   Onboarding for new PMs should be self-service and take less than 30 minutes.
    *   AI-generated recommendations must be presented clearly, with the underlying rationale explained, to build user trust.
*   **Reliability:**
    *   The service must maintain 99.9% uptime.
    *   Automated daily backups of the database must be in place, with a documented disaster recovery plan.

## 6. Technical Considerations

*   **Technology Stack Recommendations:**
    *   **Frontend:** A modern JavaScript framework like React or Vue.js to build a highly interactive and component-based UI, especially for the allocation grid.
    *   **Backend:** Python with a framework like Django or FastAPI, given its strong ecosystem for AI/ML (e.g., LangChain, Pandas, scikit-learn).
    *   **Database:** A relational database like PostgreSQL is ideal for structured staffing data. A vector database (e.g., Pinecone, Chroma) will be required to support the RAG AI chat feature efficiently.
*   **Database Design Considerations:**
    *   Core tables will include `Projects`, `Employees`, `Roles`, `LCATs`, and `Allocations`.
    *   The `Allocations` table will be central, linking an employee to a project for a specific time period (month or sprint) with the allocated hours.
    *   The schema must be designed to prevent database locks during frequent updates to the allocation grid and to allow for fast, aggregated queries for dashboards.
*   **API Design Principles:**
    *   A RESTful or GraphQL API will expose the application's functionality.
    *   The API must be stateless and enforce all RBAC security rules at the endpoint level.
    *   Consider using WebSockets for real-time updates on dashboards when a PM modifies a staffing plan.

## 7. Release Plan & Milestones

The release will be phased to deliver value incrementally, starting with the core workflow for our primary persona.

*   **V1.0 (MVP): The PM's Command Center**
    *   **Focus:** Empower Priya, the Hands-On PM, to ditch her spreadsheet.
    *   **Features:** Epics 1 & 2. (Project/Staff Setup, Core Allocation Experience). This provides the fundamental utility and data-capturing mechanism.
*   **V1.1: The Strategic Overview**
    *   **Focus:** Provide value to David, the Portfolio Overseer.
    *   **Features:** Portfolio Dashboard (US011), Project Dashboard (US019), Excel Export (US016).
*   **V1.2: The Optimizer's Toolkit**
    *   **Focus:** Equip Maria, the Utilization Optimizer, with cross-portfolio tools.
    *   **Features:** Employee Timeline View (US012), Admin Settings for Roles/LCATs (US018).
*   **V1.3: Conversational Insights (AI RAG)**
    *   **Focus:** Introduce the first layer of AI for fast data retrieval.
    *   **Features:** AI Chat Interface (US009, US010).
*   **V1.4: Proactive Intelligence (AI Agent)**
    *   **Focus:** Evolve from data retrieval to proactive decision support.
    *   **Features:** AI Recommendations, Conflict Resolution, Forecasting, and Workload Balancing (US013, US014, US015, US020).

## 8. Out of Scope & Future Considerations

### Out of Scope for V1.0
*   Direct integration with HRIS, payroll, or accounting systems.
*   Employee time tracking (StaffAlloc is a forward-looking planning tool, not a time-sheeting tool).
*   Detailed skills management (e.g., proficiency levels in Python, AWS certifications).
*   Financial budgeting beyond funded hours (e.g., tracking hourly rates, project costs in currency).
*   A native mobile application.

### Future Considerations
*   Integration with project management tools like Jira or Asana to link staffing plans to specific tasks and epics.
*   "What-if" scenario planning to model the impact of new projects on overall resource capacity.
*   More granular allocation periods (e.g., weekly).
*   Automated email summaries and alerts for stakeholders.

## 9. Appendix & Open Questions

### Open Questions
1.  **Data Source:** What is the source of truth for the employee list? Will it be a manual CSV import for V1, or is there an HRIS system we need to plan for integrating with in the future?
2.  **Holiday Calendars:** How are company holidays and non-working days defined? Is there a central calendar we can use to auto-calculate full-time hours per month, or will this be a manual setting?
3.  **Permissions Granularity:** What are the specific permissions needed? Can PMs view other PMs' projects in a read-only capacity, or is it a hard wall?
4.  **Heatmap Logic:** The user story for the FTE heatmap (US008) provides an example. Do we need to confirm the exact percentage thresholds and corresponding colors with stakeholders?

### Dependencies and Assumptions
*   **Assumption:** A clean, standardized list of employees, their roles, and LCATs can be provided for initial system setup.
*   **Assumption:** The target users (PMs) are proficient with spreadsheet-like interfaces, which will reduce the learning curve for the core allocation grid.
*   **Dependency:** Access to anonymized historical staffing data will be crucial for training and validating the predictive AI forecasting models (V1.4).
*   **Dependency:** Stakeholder availability is required to clarify the open questions above before the development of related features begins.