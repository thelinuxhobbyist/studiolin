---
title: "Linux Command Line Fundamentals"
date: 2024-10-12
draft: false
noindex: true
tags: ["Linux", "Command Line", "Terminal", "Basics"]
categories: ["Tutorials"]
category: "system-admin"
level: "beginner"
description: "Learn the essential Linux command line skills every user should know"
author: "Neil Cass"
---

# Linux Command Line Fundamentals

The command line is the heart of Linux. This comprehensive tutorial will teach you everything you need to know to become proficient with the Linux terminal.

## What You'll Learn

- Essential navigation commands
- File and directory operations
- Text manipulation and searching
- Process management
- System monitoring
- Basic scripting concepts

## Prerequisites

- Basic computer literacy
- A Linux system or virtual machine
- Willingness to practice

## Getting Started

Open your terminal application. You'll see a prompt that looks something like:

```bash
user@hostname:~$
```

This is your command prompt, and it's where the magic happens.

## Navigation Basics

### pwd - Print Working Directory

The `pwd` command shows you exactly where you are in the filesystem:

```bash
pwd
```

### ls - List Directory Contents

List files and directories in your current location:

```bash
# Basic listing
ls

# Detailed listing with permissions, sizes, dates
ls -la

# List only directories
ls -d */
```

### cd - Change Directory

Navigate through the filesystem:

```bash
# Go to home directory
cd ~

# Go to root directory
cd /

# Go up one level
cd ..

# Go to a specific directory
cd /var/log
```

## File Operations

### Creating Files and Directories

```bash
# Create a new file
touch newfile.txt

# Create a new directory
mkdir new-directory

# Create nested directories
mkdir -p path/to/new/directory
```

### Copying and Moving

```bash
# Copy a file
cp source.txt destination.txt

# Copy a directory recursively
cp -r source-dir/ destination-dir/

# Move/rename a file
mv oldname.txt newname.txt

# Move to different directory
mv file.txt /path/to/directory/
```

### Viewing File Contents

```bash
# Display entire file
cat filename.txt

# Display file page by page
less filename.txt

# Display first 10 lines
head filename.txt

# Display last 10 lines
tail filename.txt

# Follow file changes (great for logs)
tail -f /var/log/syslog
```

## Text Processing

### grep - Search Text

```bash
# Search for a pattern in a file
grep "search term" filename.txt

# Case-insensitive search
grep -i "search term" filename.txt

# Search recursively in directories
grep -r "search term" /path/to/directory/

# Count matching lines
grep -c "pattern" filename.txt
```

### sed - Stream Editor

```bash
# Replace first occurrence
sed 's/old/new/' filename.txt

# Replace all occurrences
sed 's/old/new/g' filename.txt

# Edit file in place
sed -i 's/old/new/g' filename.txt
```

## Process Management

### ps - View Running Processes

```bash
# Show your processes
ps

# Show all processes
ps aux

# Show process tree
ps auxf
```

### top/htop - Monitor System

```bash
# Dynamic process viewer
top

# Better version (if installed)
htop
```

### kill - Terminate Processes

```bash
# Kill process by PID
kill 1234

# Force kill
kill -9 1234

# Kill by name
killall firefox
```

## File Permissions

Understanding Linux file permissions is crucial:

```bash
# View permissions
ls -l filename.txt

# Change permissions (owner: read/write, group: read, others: read)
chmod 644 filename.txt

# Make file executable
chmod +x script.sh

# Change ownership
sudo chown user:group filename.txt
```

## Redirection and Pipes

### Output Redirection

```bash
# Redirect output to file (overwrite)
ls > filelist.txt

# Redirect output to file (append)
ls >> filelist.txt

# Redirect errors
command 2> error.log

# Redirect both output and errors
command > output.log 2>&1
```

### Pipes

Chain commands together:

```bash
# Count lines in output
ls | wc -l

# Search through command output
ps aux | grep firefox

# Complex pipeline
cat /var/log/nginx/access.log | grep "GET" | awk '{print $1}' | sort | uniq -c | sort -nr
```

## Useful Keyboard Shortcuts

- `Ctrl + C`: Stop current command
- `Ctrl + Z`: Suspend current command
- `Ctrl + D`: Exit terminal
- `Ctrl + R`: Search command history
- `Tab`: Auto-complete commands and filenames
- `↑/↓`: Navigate command history

## System Information

```bash
# System information
uname -a

# Disk usage
df -h

# Directory sizes
du -sh *

# Memory usage
free -h

# Current users
who

# System uptime
uptime
```

## Practice Exercises

1. **Navigation Practice**

   - Navigate to `/tmp`
   - Create a directory called `practice`
   - Create a file called `test.txt` inside it

2. **File Operations**

   - Copy `/etc/passwd` to your practice directory
   - Search for your username in the copied file
   - Count how many users have `/bin/bash` as their shell

3. **Process Management**
   - List all running processes
   - Find the process ID of your terminal
   - Monitor system resources with `top`

## Next Steps

Now that you've learned the fundamentals:

1. Practice these commands daily
2. Learn about shell scripting
3. Explore advanced tools like `awk`, `sed`, and `find`
4. Study system administration concepts
5. Learn about package management for your distribution

## Common Mistakes to Avoid

- Running commands as root unnecessarily
- Not understanding file permissions
- Forgetting to backup before making changes
- Not reading error messages carefully
- Using `rm -rf` without double-checking the path

The command line might seem intimidating at first, but with practice, it becomes an incredibly powerful tool that will make you much more efficient at managing Linux systems.
