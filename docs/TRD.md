# 🧾 **Technical Requirements Document (TRD)**

## **Project: CompCode (LeetCode Full Frontend + API Integration)**

---

# 🧠 1. SYSTEM OVERVIEW

**CompCode** is a web application that replicates core functionality of LeetCode using:

* Public GraphQL APIs
* Session-based authentication
* Real code execution + submission
* Modern frontend (Vite + React + shadcn)

---

## 🎯 Objectives

* Provide real LeetCode problem browsing
* Enable **login via LeetCode session**
* Allow **real code execution & submission**
* Maintain **clean UI/UX (shadcn)**
* Avoid backend where possible, but introduce **minimal proxy layer if required**

---

# ⚠️ 2. CRITICAL CONSTRAINTS (READ FIRST)

### 🚫 Official Limitations

* LeetCode does **NOT provide public APIs** for:

  * Login
  * Code submission
  * Running code

### ⚠️ Workaround Strategy

We rely on:

* Browser session cookies:

  * `LEETCODE_SESSION`
  * `csrftoken`

* Reverse-engineered endpoints from:

  * GraphQL queries repo
  * Network inspection

👉 This means:

* Fragile system (may break anytime)
* Must design **fallbacks + abstraction layer**

---

# 🧱 3. TECH STACK

## Frontend

* Vite + React (latest)
* TypeScript (strict)
* Tailwind CSS
* shadcn/ui (latest)
* Monaco Editor

## State & Data

* TanStack Query (React Query)
* Zustand (optional UI state)

## API Layer

* Custom API client (fetch-based)

## Optional (Recommended)

* Lightweight backend proxy (Node / Express or Vite server middleware)

---

# 🏗️ 4. ARCHITECTURE

## High-Level Flow

```
Frontend (Vite React)
   ↓
API Layer (client)
   ↓
[Optional Proxy Layer]
   ↓
LeetCode APIs (GraphQL + REST)
```

---

## 📁 Folder Structure

```
/src
  /components
  /components/ui
  /features
    /auth
    /problems
    /editor
    /submissions
  /lib
    api-client.ts
    graphql-client.ts
    leetcode-client.ts
  /hooks
  /store
  /pages
```

---

# 🔐 5. AUTHENTICATION SYSTEM

## 🔹 Approach: Cookie-Based Auth (User Input)

Since LeetCode doesn’t allow OAuth:

### ✅ Method 1 (Recommended)

User manually inputs:

* `LEETCODE_SESSION`
* `csrftoken`

Store in:

* localStorage (encrypted if possible)

---

## 🔹 Auth Flow

1. User opens "Login"
2. Prompt:

   * Paste session cookie
   * Paste csrf token
3. Validate using:

   * `matchedUser` GraphQL query
4. Store session
5. Mark user as logged in

---

## 🔹 API Headers

```
Cookie: LEETCODE_SESSION=xxx; csrftoken=xxx;
x-csrftoken: xxx
```

---

## 🔹 Risks

* Session expiry
* Invalid tokens
* CORS issues

---

# 📡 6. API INTEGRATION

---

## 🧩 6.1 GraphQL APIs

Endpoint:

```
https://leetcode.com/graphql
```

### Queries Used

* `questionList`
* `question`
* `matchedUser`
* `submissionList`

Reference:
[https://github.com/akarsh1995/leetcode-graphql-queries](https://github.com/akarsh1995/leetcode-graphql-queries)

---

## ⚙️ 6.2 Submission API (CRITICAL)

### Endpoint (reverse engineered)

```
POST https://leetcode.com/problems/{slug}/submit/
```

### Payload

```
{
  lang: "javascript",
  question_id: "two-sum-id",
  typed_code: "user code"
}
```

---

## 🧪 6.3 Run Code API

```
POST https://leetcode.com/problems/{slug}/interpret_solution/
```

---

## 🔁 6.4 Submission Result Polling

```
GET https://leetcode.com/submissions/detail/{submission_id}/check/
```

---

# 💻 7. CORE FEATURES

---

## 📄 7.1 Problem List

* Fetch via GraphQL
* Filters:

  * Difficulty
  * Tags
* Infinite scroll

---

## 📘 7.2 Problem Detail

* Description (HTML)
* Examples
* Constraints
* Code snippets

---

## 🧠 7.3 Code Editor

* Monaco Editor
* Multi-language
* Auto-save
* Code templates

---

## ▶️ 7.4 Run Code

Flow:

1. Send request to interpret API
2. Show:

   * stdout
   * runtime
   * errors

---

## 🚀 7.5 Submit Code

Flow:

1. Send submission request
2. Receive submission ID
3. Poll result API
4. Display:

   * Accepted / Wrong Answer
   * Runtime
   * Memory

---

## 📊 7.6 Submissions

* Fetch using GraphQL
* Show history

---

## 👤 7.7 User Dashboard

* Stats
* Problems solved
* Ranking (if accessible)

---

# 🎨 8. UI REQUIREMENTS

* Use ONLY shadcn
* Layout:

  * Left: problem
  * Right: editor
* Responsive
* Dark/light mode

---

# ⚡ 9. PERFORMANCE

* React Query:

  * caching
  * deduplication
* Debounced search
* Prefetch problem data

---

# 🔐 10. SECURITY

### MUST:

* Never expose cookies in logs
* Avoid storing raw cookies insecurely
* Use proxy if CORS issues arise

---

# 🚨 11. RISKS & MITIGATION

| Risk            | Mitigation        |
| --------------- | ----------------- |
| API breaks      | abstraction layer |
| CORS blocked    | proxy server      |
| session expires | re-login flow     |
| rate limiting   | caching           |

---

# 🧪 12. TESTING

* Manual testing (primary)
* Edge cases:

  * invalid session
  * failed submission
  * slow polling

---

# 🚀 13. FUTURE EXTENSIONS

* AI hints
* Code review
* Contest mode
* Collaborative coding

---

# 🏁 14. FINAL DELIVERABLE

A working app that:

✅ Uses real LeetCode data
✅ Authenticates via session
✅ Runs & submits real code
✅ Displays real results
✅ Has modern UI

---

# ⚠️ FINAL REALITY CHECK

This is **NOT a simple frontend project anymore**.

You are effectively:

* Reverse engineering LeetCode
* Building an unofficial client

👉 Expect:

* Breakages
* Debugging network calls
* CORS issues

---
