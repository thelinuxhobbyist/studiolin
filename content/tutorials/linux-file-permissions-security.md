---
title: "Linux File Permissions and Security"
date: 2024-10-08
draft: false
noindex: true
tags: ["Linux", "Security", "Permissions", "System Administration"]
categories: ["Tutorials"]
category: "security"
level: "intermediate"
description: "Master Linux file permissions, ownership, and security fundamentals"
author: "Neil Cass"
---

# Linux File Permissions and Security

Understanding file permissions is crucial for Linux security. This tutorial covers everything you need to know about managing access to files and directories.

## What You'll Learn

- Linux permission system fundamentals
- Reading and setting permissions
- Ownership and groups
- Special permissions and attributes
- Security best practices

## The Permission System

Linux uses a robust permission system based on three types of access:

- **Read (r)**: View file contents or list directory contents
- **Write (w)**: Modify file contents or create/delete files in directory
- **Execute (x)**: Run file as program or enter directory

## Understanding Permission Display

When you run `ls -l`, you see something like:

```
-rw-r--r-- 1 user group 1024 Oct 19 10:30 file.txt
drwxr-xr-x 2 user group 4096 Oct 19 10:31 directory
```

Let's break this down:

```
-rw-r--r--
^^^^^^^^^^
|||||||||└─ Other permissions (r--)
||||||||└── Group permissions (r--)
|||||||└─── Owner permissions (rw-)
||||||└──── Sticky bit/SGID/SUID
|||||└───── Hard link count
||||└────── File type (- = file, d = directory, l = link)
```

## Permission Values

### Symbolic Notation

- `r` = Read (4)
- `w` = Write (2)
- `x` = Execute (1)

### Numeric Notation

Permissions are calculated by adding values:

- `rwx` = 4+2+1 = 7
- `rw-` = 4+2+0 = 6
- `r-x` = 4+0+1 = 5
- `r--` = 4+0+0 = 4

Common permission combinations:

- `755` = rwxr-xr-x (executable files, directories)
- `644` = rw-r--r-- (regular files)
- `600` = rw------- (private files)
- `700` = rwx------ (private directories)

## Setting Permissions

### Using chmod

```bash
# Numeric method
chmod 755 script.sh
chmod 644 document.txt
chmod 600 private.key

# Symbolic method
chmod u+x script.sh        # Add execute for owner
chmod g-w file.txt          # Remove write for group
chmod o-r secret.txt        # Remove read for others
chmod a+r public.txt        # Add read for all

# Multiple changes
chmod u+x,g-w,o-r file.txt
```

### Permission Classes

- `u` = User/Owner
- `g` = Group
- `o` = Others
- `a` = All (user + group + others)

### Operations

- `+` = Add permission
- `-` = Remove permission
- `=` = Set exact permission

## Ownership Management

### Changing Ownership

```bash
# Change owner
sudo chown newuser file.txt

# Change owner and group
sudo chown newuser:newgroup file.txt

# Change only group
sudo chgrp newgroup file.txt

# Recursive ownership change
sudo chown -R user:group directory/
```

### Finding Files by Owner

```bash
# Find files owned by specific user
find /home -user username

# Find files owned by specific group
find /var -group apache

# Find files with specific permissions
find /etc -perm 644

# Find files with SUID bit set
find /usr -perm -4000
```

## Special Permissions

### SUID (Set User ID)

When set on executable files, runs with owner's privileges:

```bash
# Set SUID
chmod u+s executable
chmod 4755 executable

# Example: passwd command
ls -l /usr/bin/passwd
# -rwsr-xr-x root root /usr/bin/passwd
```

### SGID (Set Group ID)

For files: runs with group's privileges
For directories: new files inherit directory's group

```bash
# Set SGID
chmod g+s file_or_directory
chmod 2755 directory

# Example: shared directory
chmod 2775 /shared/project
```

### Sticky Bit

On directories: only owner can delete their files

```bash
# Set sticky bit
chmod +t directory
chmod 1755 directory

# Example: /tmp directory
ls -ld /tmp
# drwxrwxrwt root root /tmp
```

## Advanced Permission Concepts

### Access Control Lists (ACLs)

For more granular permissions:

```bash
# Install ACL tools (if needed)
sudo apt install acl

# Set ACL for specific user
setfacl -m u:alice:rwx file.txt

# Set ACL for specific group
setfacl -m g:developers:rw file.txt

# View ACLs
getfacl file.txt

# Remove ACL
setfacl -x u:alice file.txt
```

### File Attributes

Additional file attributes using `chattr`:

```bash
# Make file immutable
sudo chattr +i important.conf

# Make file append-only
sudo chattr +a logfile.log

# View attributes
lsattr file.txt

# Remove immutable attribute
sudo chattr -i important.conf
```

## Security Best Practices

### 1. Principle of Least Privilege

```bash
# Good: specific permissions
chmod 640 config.file    # Owner read/write, group read

# Bad: overly permissive
chmod 777 config.file    # Everyone can do everything
```

### 2. Secure File Creation

```bash
# Set secure umask
umask 022    # New files: 644, directories: 755
umask 077    # New files: 600, directories: 700

# Check current umask
umask
```

### 3. Regular Permission Audits

```bash
# Find world-writable files
find / -type f -perm -002 2>/dev/null

# Find SUID/SGID files
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null

# Find files without owner
find / -nouser -o -nogroup 2>/dev/null
```

### 4. Protect Sensitive Files

```bash
# SSH keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys

# Configuration files
chmod 600 ~/.bashrc
chmod 600 ~/.vimrc
```

## Common Permission Scenarios

### Web Server Files

```bash
# Web content
chmod 644 *.html *.css *.js
chmod 755 directories/

# CGI scripts
chmod 755 *.cgi *.pl

# Configuration files
chmod 600 database.conf
```

### Database Files

```bash
# Data files
chmod 600 database.db
chown mysql:mysql database.db

# Log files
chmod 640 mysql.log
chown mysql:mysql mysql.log
```

### Backup Scripts

```bash
# Script executable by owner only
chmod 700 backup.sh

# Backup files readable by owner only
chmod 600 backup.tar.gz
```

## Troubleshooting Permissions

### Common Issues

1. **"Permission denied" when executing script**

   ```bash
   chmod +x script.sh
   ```

2. **Cannot write to file**

   ```bash
   # Check ownership and permissions
   ls -l file.txt

   # Fix if you own it
   chmod u+w file.txt
   ```

3. **Cannot enter directory**

   ```bash
   chmod u+x directory/
   ```

4. **Group members cannot access shared files**
   ```bash
   # Ensure group ownership and permissions
   chgrp groupname file.txt
   chmod g+rw file.txt
   ```

### Debugging Tools

```bash
# Check current permissions
ls -la file.txt

# Check effective user
id

# Check group membership
groups

# Test access
[ -r file.txt ] && echo "Readable" || echo "Not readable"
[ -w file.txt ] && echo "Writable" || echo "Not writable"
[ -x file.txt ] && echo "Executable" || echo "Not executable"
```

## Security Monitoring

### Log Analysis

```bash
# Monitor permission changes
sudo ausearch -f /etc/passwd

# Check for unusual SUID files
find /usr -perm -4000 -newer /var/log/lastcheck
```

### Automated Checks

Create a script to regularly check permissions:

```bash
#!/bin/bash

# Check for world-writable files
echo "World-writable files:"
find /home -type f -perm -002 2>/dev/null

# Check for unusual SUID files
echo "SUID files:"
find /usr -type f -perm -4000 2>/dev/null

# Check for files without owner
echo "Orphaned files:"
find /home -nouser 2>/dev/null
```

## Best Practices Summary

1. **Use least privilege principle**
2. **Set restrictive umask (022 or 077)**
3. **Regularly audit permissions**
4. **Monitor SUID/SGID files**
5. **Use groups for shared access**
6. **Protect configuration files (600)**
7. **Make scripts executable only when needed**
8. **Use ACLs for complex requirements**
9. **Document permission requirements**
10. **Test permission changes before applying**

## Exercises

1. **Secure a Directory**: Set up a shared project directory with proper group permissions
2. **Audit System Files**: Find all SUID files and verify they're legitimate
3. **Create User Scripts**: Write scripts to set permissions for different file types
4. **ACL Practice**: Use ACLs to give specific users access to shared files

Understanding and properly managing file permissions is fundamental to Linux security. Take time to practice these concepts and always think about the security implications of permission changes.
