# 🚀 How to Run on Localhost

There are **multiple ways** to run the Meiosis Explorer on localhost. Choose the method that works best for you!

---

## ⚡ Quick Start (Easiest Methods)

### **Method 1: Double-Click Script** (Recommended for Windows)

1. **Double-click** `start-server.bat`
2. Your browser will automatically serve the site
3. Open `http://localhost:8000` or `http://localhost:3000` (depending on what's available)

### **Method 2: Double-Click Script** (Mac/Linux)

1. Make the script executable:
   ```bash
   chmod +x start-server.sh
   ```
2. **Double-click** `start-server.sh` or run in terminal:
   ```bash
   ./start-server.sh
   ```
3. Open `http://localhost:8000` or `http://localhost:3000`

---

## 📋 Method 3: Using Node.js (Most Features)

### Prerequisites
- Install [Node.js](https://nodejs.org/) (if not already installed)

### Steps
1. Open terminal/command prompt in the project folder
2. Run the server:
   ```bash
   node server.js
   ```
3. Open your browser to: **http://localhost:3000**
4. Press `Ctrl+C` to stop the server

### Alternative with npm
```bash
npm start
```

---

## 🐍 Method 4: Using Python (Simple)

### If you have Python 3:
```bash
python -m http.server 8000
```

### If you have Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

---

## 🌐 Method 5: Using VS Code Live Server

If you use Visual Studio Code:

1. Install the **Live Server** extension
2. Right-click on `index.html`
3. Select **"Open with Live Server"**
4. Site will open automatically!

---

## 📦 Method 6: Using npx (No Installation)

If you have Node.js but don't want to set up anything:

```bash
npx http-server -p 3000
```

Or:

```bash
npx serve
```

---

## 🔧 Method 7: Other Quick Servers

### PHP (if installed):
```bash
php -S localhost:8000
```

### Ruby (if installed):
```bash
ruby -run -ehttpd . -p8000
```

---

## ✅ Verification

Once your server is running, you should see:

```
🧬 Meiosis Explorer Server Running!
📡 Server: http://localhost:PORT
```

Open that URL in your browser!

---

## 🎯 Which Method Should I Use?

| Method | Best For | Pros |
|--------|----------|------|
| **Batch/Shell Script** | Beginners | Easiest - just double-click |
| **Node.js Server** | Development | Full control, custom port |
| **Python** | Quick testing | Usually pre-installed |
| **VS Code Live Server** | VS Code users | Auto-reload on changes |
| **npx serve** | One-time use | No setup needed |

---

## 🐛 Troubleshooting

### Port Already in Use?
If you see "port already in use", either:
- Close the other application using that port
- Change the port in `server.js` (line 7)
- Use a different method with a different port

### "Command not found"?
- Make sure Node.js or Python is installed
- Try restarting your terminal
- Use the batch/shell script instead

### Can't access localhost?
- Make sure the server is running (check terminal)
- Try `127.0.0.1:PORT` instead of `localhost:PORT`
- Check your firewall settings

### Files not loading?
- Make sure you're in the correct directory
- Check that all files (HTML, CSS, JS) are in the same folder
- Clear browser cache (Ctrl+Shift+R)

---

## 🌟 No Server? No Problem!

The website also works by simply **opening `index.html`** directly in your browser!

- Just double-click `index.html`
- Or right-click → Open with → Your browser

The only limitation is that some browsers might restrict certain features when not running from a server.

---

## 🎉 You're All Set!

Choose any method above and start exploring meiosis in 3D!

**Default URLs:**
- Node.js: `http://localhost:3000`
- Python: `http://localhost:8000`
- VS Code Live Server: `http://localhost:5500` (usually)

---

**Need help?** Check the README.md for more information!

