# 🚀 DevDocs

**devdocs** is a lightweight CLI tool for creating, organizing, and maintaining technical documentation in Markdown format — directly from your terminal.

It’s designed for **development teams working on complex projects**, where documenting issues, features, and common errors needs to be **fast, standardized, and collaborative**.

---

## 🚀 Features

- ⚡ **Quick setup** — initialize a documentation workspace in seconds.
- 🧩 **Predefined templates** for issues, features, errors, and guides.
- 🔁 **Automatic index generation** for easy navigation.
- 🪶 **Markdown-based** — works with any editor (VSCode, Obsidian, etc.).
- 🧠 **Custom placeholders** — dynamic values like `{{title}}` or `{{@date}}`.
- 🧱 **Structured and extensible** — add your own templates and categories.
- 🧰 **CLI-based workflow** — no external tools, no vendor lock-in.

---

## 📦 Installation

```bash
# via npm
npm install -g @cobodev/devdocs
```

---

## 🧑‍💻 Usage

### Initialize a new documentation workspace

```bash
devdocs init
```

This command creates the basic folder structure (e.g. `/features`, `/issues`, `/guides`, `/common_errors`) and copies the default Markdown templates.

---

### Create a new document

```bash
devdocs new doc
```

Follow the interactive prompts to choose the type (feature, issue, guide, etc.) and fill in details like title and description.

A new `.md` file will be generated automatically with all placeholders replaced.

---

### Create a new module

```bash
devdocs new module
```

Follow the interactive prompts to choose name of the new module.

A new folder and template will be generated.

---

## 📁 Folder Structure

Example after initialization:

```
docs/
├── features/
│   ├── new_auth_flow.md
│   └── index.md
├── issues/
│   ├── api_timeout.md
│   └── index.md
├── errors/
│   ├── db_connection_lost.md
│   └── index.md
├── guides/
│   ├── local_setup.md
│   └── ...
└── templates/
    ├── _TEMPLATE_features.md
    ├── _TEMPLATE_issues.md
    ├── _TEMPLATE_errors.md
    └── _TEMPLATE_guides.md
```

---

## 🧩 Placeholders

Templates support two types of placeholders:

| Type | Example | Description |
|------|----------|-------------|
| Manual | `{{title}}` | Filled by user input |
| Automatic | `{{@date}}` | Filled automatically (e.g. date, author, etc.) |

Regex ensures placeholders contain only valid identifiers (`{{exampleName}}` ✅ / `{{...}}` ❌).

---

## 🧑‍🔧 Contributing

Pull requests are welcome!  
If you’d like to add new templates, commands, or configuration options, please open an issue or PR.

Before submitting:
```bash
npm run lint
npm run build
```

---

## 🧾 License

ISC © 2025 CoboDev

---

## 🌟 Roadmap

- [ ] Command to regenerate indexes automatically
- [ ] Command to delete modules or docs  
- [ ] Template customization via config  
- [ ] Support for YAML frontmatter  
- [ ] Integration with git hooks for auto-updating docs  

---

## 🧠 Inspiration

This tool was born from the need to make internal documentation **fast, searchable, and standardized** for complex enterprise projects — without depending on heavy tools like Confluence or Notion.

---

> 💡 *“If it’s not documented, it doesn’t exist.” — every senior developer ever.*
