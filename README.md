# Madhan P: portfolio

A personal site styled after the Linux kernel's `make menuconfig`. Visitors choose a role or switch modules on and off, and the page rebuilds around their choice. Each choice has its own link to share, such as `?role=devops`.

It is plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Change the content

| To change | Edit |
|---|---|
| Projects, studied topics, wins, background | `index.html` |
| Colours and layout | `style.css` |
| Role names, role text, module names | `app.js` |
| Photo and resume | `assets/` |

To add a project or topic, copy one `<li>` in `index.html` and edit its text. Its `data-m` attribute lists the modules it belongs to:

`lowlevel linux gpu security devops cloud server backend frontend`

## Preview on your computer

```bash
python -m http.server 8123
```

Then open http://localhost:8123.

## Publish a change

GitHub Pages updates the site about a minute after each push:

```bash
git add .
```

```bash
git commit -m "Update portfolio"
```

```bash
git push
```
