# 🪲 {{issueId}} - {{title}}

## 🧾 Information
**Date:** {{@date}}  
**Author:** {{author}}  
**Description:** Brief summary of the issue and its impact on the system or users.

---

## 🔍 Analysis
- **Symptom:**  
  (e.g., The report X fails when the user has more than 1,000 records.)
- **Root cause:**  
  (e.g., PL/SQL cursor without pagination limit.)

---

## 🧰 Solution applied
Describe what was done to fix the issue.  
Include relevant file names, queries, or code snippets if necessary.

```sql
UPDATE config_table
SET value = 'Y'
WHERE key = 'ENABLE_TIMEOUT';
```

---

## 💡 Lessons learned / Prevention
- What was learned from this issue.
- How to prevent it from happening again.
- Optional: add quick checks or recommendations.

---

## 🔗 Related items
- [Related functionality](../features/example.md)
- [Similar error](../errors/error_timeout_db.md)

---