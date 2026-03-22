Perfect — since you already have **Vite + React + shadcn + theme** ready, we’ll go straight into **serious, iterative build prompts** for the *real LeetCode-integrated version* of CompCode.

This version is more complex, so the prompts are **carefully ordered to avoid breaking things**.

---

# 🧠 HOW TO USE THESE PROMPTS

* Run **one prompt at a time**
* Test manually after each
* Do NOT skip steps
* If something fails → fix before proceeding

---

# 🚀 PHASE 1 — CORE API LAYER

---

## 🔹 Prompt 1: Base API Client

```
Create a reusable API client in /src/lib/api-client.ts

Requirements:
- Use fetch
- Base config for requests
- Support:
  - GET
  - POST
- Automatically include headers:
  - Content-Type: application/json

Make it extensible for adding cookies later

Export:
- get()
- post()
```

---

## 🔹 Prompt 2: GraphQL Client

```
Create /src/lib/graphql-client.ts

Requirements:
- POST to https://leetcode.com/graphql
- Accept:
  - query
  - variables
- Return JSON response
- Handle errors cleanly

Use api-client internally
```

---

## 🔹 Prompt 3: LeetCode Auth Header Injection

```
Enhance api-client to support dynamic headers.

Add:
- Ability to inject cookies:
  - LEETCODE_SESSION
  - csrftoken

Store tokens in localStorage:
- leetcode_session
- leetcode_csrf

Automatically attach headers:
Cookie: LEETCODE_SESSION=...; csrftoken=...
x-csrftoken: ...

Ensure headers update dynamically
```

---

# 🔐 PHASE 2 — AUTH SYSTEM

---

## 🔹 Prompt 4: Auth Store

```
Create auth store using Zustand:

State:
- isAuthenticated
- session
- csrf
- user

Actions:
- login(session, csrf)
- logout()

Persist in localStorage
```

---

## 🔹 Prompt 5: Validate Session

```
Create function:

/src/features/auth/api/validateSession.ts

Use GraphQL query:
- matchedUser

If valid:
- return user data

If invalid:
- throw error
```

---

## 🔹 Prompt 6: Login UI

```
Create Login modal/page:

Fields:
- LEETCODE_SESSION
- csrftoken

On submit:
- Save tokens
- Call validateSession
- If success:
  - store user
  - mark authenticated
- If fail:
  - show error

Use shadcn components
```

---

## 🔹 Prompt 7: Auth Guard

```
Create a wrapper/hook:

- Protect features requiring login
- Redirect or show login modal if not authenticated
```

---

# 📄 PHASE 3 — PROBLEMS

---

## 🔹 Prompt 8: Fetch Problems

```
Create:

/src/features/problems/api/getProblems.ts

Use questionList query

Return:
- title
- titleSlug
- difficulty
- tags

Test with console log
```

---

## 🔹 Prompt 9: React Query Setup

```
Install TanStack Query and configure:

- QueryClient
- QueryClientProvider

Enable devtools (optional)
```

---

## 🔹 Prompt 10: Problem List UI

```
Create homepage:

- Fetch problems using React Query
- Display in shadcn table

Columns:
- Title
- Difficulty
- Tags

Add loading + error states
```

---

## 🔹 Prompt 11: Filters + Search

```
Enhance problem list:

- Search by title
- Filter by difficulty

Client-side filtering
```

---

# 📘 PHASE 4 — PROBLEM DETAIL

---

## 🔹 Prompt 12: Dynamic Routing

```
Setup React Router:

Route:
- /problems/:slug
```

---

## 🔹 Prompt 13: Fetch Problem Details

```
Create:

/src/features/problems/api/getProblemDetails.ts

Query:
- question(titleSlug)

Return:
- description
- examples
- codeSnippets
```

---

## 🔹 Prompt 14: Problem Detail UI

```
Create split layout:

Left:
- problem description (render HTML safely)

Right:
- placeholder for editor
```

---

# 💻 PHASE 5 — CODE EDITOR

---

## 🔹 Prompt 15: Monaco Editor

```
Integrate Monaco Editor:

- Display in right panel
- Default language: JavaScript
```

---

## 🔹 Prompt 16: Language Selector

```
Add language dropdown:

- JavaScript
- Python
- C++

Switch editor language dynamically
```

---

## 🔹 Prompt 17: Load Starter Code

```
Load codeSnippets from API:

- Match selected language
- Populate editor
```

---

## 🔹 Prompt 18: Auto Save Code

```
Persist code:

- localStorage key:
  problemSlug + language

Load saved code on revisit
```

---

# ⚙️ PHASE 6 — REAL EXECUTION (CRITICAL)

---

## 🔹 Prompt 19: Run Code API

```
Implement run code:

POST:
https://leetcode.com/problems/{slug}/interpret_solution/

Payload:
- lang
- question_id
- typed_code

Include headers:
- Cookie
- x-csrftoken

Show:
- output
- errors
```

---

## 🔹 Prompt 20: Handle Run Response

```
Parse run API response:

Display:
- stdout
- runtime
- error messages

Create output panel UI
```

---

# 🚀 PHASE 7 — SUBMISSION SYSTEM (CRITICAL)

---

## 🔹 Prompt 21: Submit Code API

```
Implement submit:

POST:
https://leetcode.com/problems/{slug}/submit/

Payload:
- lang
- question_id
- typed_code

Return submission_id
```

---

## 🔹 Prompt 22: Poll Submission Result

```
Poll:

GET:
https://leetcode.com/submissions/detail/{id}/check/

Repeat until:
- status != PENDING

Return:
- Accepted / Wrong Answer
- runtime
- memory
```

---

## 🔹 Prompt 23: Submission UI

```
Display submission result:

- Status badge
- Runtime
- Memory
- Error messages
```

---

# 📊 PHASE 8 — SUBMISSIONS HISTORY

---

## 🔹 Prompt 24: Fetch Submissions

```
Use GraphQL:

- submissionList

Display:
- list of past submissions
```

---

## 🔹 Prompt 25: Submissions Table

```
Show submissions in table:

- Status
- Language
- Runtime
- Timestamp
```

---

# ⚠️ PHASE 9 — HARD PARTS (IMPORTANT)

---

## 🔹 Prompt 26: CORS Handling

```
If requests fail due to CORS:

- Create a proxy server using Vite middleware or Express

Forward requests to LeetCode

Ensure cookies are forwarded correctly
```

---

## 🔹 Prompt 27: Error Handling

```
Handle:

- Invalid session
- Expired cookies
- Failed submissions

Show user-friendly messages
```

---

# 🎨 PHASE 10 — POLISH

---

## 🔹 Prompt 28: UI Improvements

```
Improve UI:

- Loading skeletons
- Better spacing
- Responsive layout
```

---

## 🔹 Prompt 29: Keyboard Shortcuts

```
Add:

- Cmd/Ctrl + Enter → Submit
```

---

## 🔹 Prompt 30: Performance

```
Optimize:

- React Query caching
- Prefetch problem details
- Avoid duplicate calls
```

---

# 🧩 WHAT YOU’LL END UP WITH

If you execute this properly:

✅ Real data from LeetCode
✅ Real code execution
✅ Real submissions
✅ Auth via session
✅ Production-level frontend

---

# 🔥 VERY IMPORTANT (REALITY CHECK)

This WILL break at some point because:

* LeetCode changes APIs
* Cloudflare may block requests
* CORS issues may appear

👉 That’s expected. Design with **debugging mindset**.

---

# 🚀 If You Want Next Level

I can now give you:

* 🔍 Exact **network payloads from browser (guaranteed working)**
* 🛠️ **Proxy server code (plug & play)**
* 🤖 AI features (auto-solve, hints, debugging)

Just tell me 👍
