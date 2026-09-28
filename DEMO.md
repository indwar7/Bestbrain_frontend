# EduLearn - Manager Demo Runbook

Role-based signup/login with three separate dashboards (Student / Teacher / Parent),
backed by a real Node + Express + MongoDB backend.

## One-time: nothing to install if already done
Backend deps are installed. Uses an **in-memory database**, no MongoDB setup needed.

---

## Start the demo (2 terminals)

### Terminal 1 - Backend (shows live registrations & logins)
```bash
cd /Users/abhayindwar/Documents/edulearn-backend
npm run demo
```
You'll see a banner + the API starts on `http://localhost:4000`.
**Keep this visible during the demo**, every signup/login/dashboard call prints here live:
```
🟢 POST /api/auth/login → 200 (67ms)
🟢 GET  /api/dashboard → 200 (9ms)
```

### Terminal 2 - Frontend
```bash
cd /Users/abhayindwar/Documents/edu
python3 -m http.server 8000
```
Then open: **http://localhost:8000/edulearn-frontend/login.html**

---

## Demo script (what to show the manager)

**1. Three separate logins (role tabs)**
- On the login page, point out the **Student / Teacher / Parent** tabs.
- Each tab = a different login. Picking a tab and using the wrong account is rejected.

**2. Log in as each role → different dashboard**
Password for all demo accounts: **`Demo@2024`**

| Tab | Email | Lands on |
|-----|-------|----------|
| Student | `student@edulearn.com` | Student dashboard (own streak, minutes, badges) |
| Teacher | `teacher@edulearn.com` | Teacher dashboard (class roster + averages) |
| Parent | `parent@edulearn.com` | Parent dashboard (their child's progress) |

→ Each user is **locked to their own view**, the role switcher is hidden. A student
can only see the student dashboard, etc.

**3. Show the backend reacting (Terminal 1)**
As you log in, point to Terminal 1, the request appears instantly with status 200.
"The login hit the backend, it verified credentials, issued a JWT, and returned this
user's role-specific data."

**4. Sign up a brand-new user (role-specific fields)**
- Click "Sign up", switch between tabs to show fields **change per role**:
  - **Student** → roll number, class, section, board
  - **Teacher** → teacher ID, class, section, subject
  - **Parent** → child's roll number + name + class (links to the child)
- Create a student → watch Terminal 1 show `POST /api/auth/signup/student → 201`.
- "It registered in the database and logged them straight into their dashboard."

**5. Show parent verification (optional, impressive)**
- Try a parent signup with a wrong child roll number → it's **rejected** ("No student
  found"). The parent link is verified against real student records.

**6. Logout**
- Top-right **Logout** button clears the session and returns to login.

---

## Talking points
- **One backend, role-based access**, single `users` collection, JWT carries the role.
- **Architecture follows PW / Unacademy / school-management patterns** (researched).
- **Parent→student linking is verified** (roll number + name + class must match), can't
  link to a random child.
- **Each feature is scoped to the logged-in role**, the dashboard data endpoint returns
  different data for student vs teacher vs parent.

## Reset
The in-memory DB resets every time you restart `npm run demo`, fresh demo each run.
