# Intro

`xcalib-gui` is a GUI for [`xcalib`](https://man.archlinux.org/man/xcalib.1.en).

> **NOTE:** `xcalib` (and hence this tool) does not work with Wayland!

# Usage

**Step 1: Install `xcalib`.**

```bash
# for example, in debian-based systems:
sudo apt install -y xcalib
```

**Step 2: Install `xcalib-gui`.**

```bash
git clone https://github.com/jrc03c/xcalib-gui
cd xcalib-gui
npm install
```

**Step 3: Run it.**

```bash
# (while still inside the cloned xcalib-gui repo folder)
npx electron .
```
