---
title: "Bash Scripting for Beginners"
date: 2024-10-10
draft: false
tags: ["Bash", "Scripting", "Automation", "Linux"]
categories: ["Tutorials"]
category: "shell"
level: "intermediate"
description: "Learn to automate tasks with powerful Bash scripts"
---

# Bash Scripting for Beginners

Bash scripting is one of the most valuable skills for Linux users. It allows you to automate repetitive tasks, create powerful tools, and manage systems efficiently.

## What You'll Learn

- Bash scripting fundamentals
- Variables and user input
- Control structures (if/else, loops)
- Functions and error handling
- Real-world scripting examples

## Prerequisites

- Basic command line knowledge
- Familiarity with common Linux commands
- A text editor (vim, nano, or VS Code)

## Your First Script

Let's start with the classic "Hello World":

```bash
#!/bin/bash
echo "Hello, World!"
```

Save this as `hello.sh`, make it executable, and run it:

```bash
chmod +x hello.sh
./hello.sh
```

## Variables

### Basic Variables

```bash
#!/bin/bash

# String variables
name="John"
message="Hello, $name!"

# Numeric variables
age=25
year=2024

echo $message
echo "Age: $age"
echo "Year: $year"
```

### Command Substitution

```bash
#!/bin/bash

# Capture command output
current_date=$(date)
current_user=$(whoami)
file_count=$(ls | wc -l)

echo "Today is: $current_date"
echo "Current user: $current_user"
echo "Files in current directory: $file_count"
```

## User Input

```bash
#!/bin/bash

echo "What's your name?"
read name

echo "What's your favorite color?"
read color

echo "Hello $name! I like $color too!"
```

## Conditional Statements

### Basic If Statement

```bash
#!/bin/bash

echo "Enter a number:"
read number

if [ $number -gt 10 ]; then
    echo "Number is greater than 10"
elif [ $number -eq 10 ]; then
    echo "Number is exactly 10"
else
    echo "Number is less than 10"
fi
```

### File Tests

```bash
#!/bin/bash

file="test.txt"

if [ -f "$file" ]; then
    echo "File exists"
    if [ -r "$file" ]; then
        echo "File is readable"
    fi
    if [ -w "$file" ]; then
        echo "File is writable"
    fi
else
    echo "File does not exist"
fi
```

## Loops

### For Loops

```bash
#!/bin/bash

# Loop through a list
for fruit in apple banana orange; do
    echo "I like $fruit"
done

# Loop through files
for file in *.txt; do
    echo "Processing $file"
    # Do something with the file
done

# Numeric loop
for i in {1..5}; do
    echo "Count: $i"
done
```

### While Loops

```bash
#!/bin/bash

counter=1

while [ $counter -le 5 ]; do
    echo "Iteration $counter"
    counter=$((counter + 1))
done
```

## Functions

```bash
#!/bin/bash

# Define a function
greet() {
    local name=$1
    echo "Hello, $name!"
}

# Function with return value
calculate_square() {
    local number=$1
    local result=$((number * number))
    echo $result
}

# Call functions
greet "Alice"
square=$(calculate_square 5)
echo "Square of 5 is: $square"
```

## Arrays

```bash
#!/bin/bash

# Create an array
fruits=("apple" "banana" "orange" "grape")

# Access elements
echo "First fruit: ${fruits[0]}"
echo "All fruits: ${fruits[@]}"
echo "Number of fruits: ${#fruits[@]}"

# Loop through array
for fruit in "${fruits[@]}"; do
    echo "Processing: $fruit"
done
```

## Error Handling

```bash
#!/bin/bash

# Exit on any error
set -e

# Function to handle errors
handle_error() {
    echo "Error occurred in script at line $1"
    exit 1
}

# Trap errors
trap 'handle_error $LINENO' ERR

# Check if command succeeded
if ! command -v git &> /dev/null; then
    echo "Git is not installed"
    exit 1
fi

echo "Git is available"
```

## Practical Examples

### System Information Script

```bash
#!/bin/bash

echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "Current User: $(whoami)"
echo "Current Date: $(date)"
echo "Uptime: $(uptime -p)"
echo "Disk Usage:"
df -h | head -5
echo "Memory Usage:"
free -h
```

### Backup Script

```bash
#!/bin/bash

# Configuration
SOURCE_DIR="$HOME/Documents"
BACKUP_DIR="$HOME/Backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup of $SOURCE_DIR..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$SOURCE_DIR"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_DIR/$BACKUP_NAME"
else
    echo "Backup failed!"
    exit 1
fi

# Keep only last 5 backups
cd "$BACKUP_DIR"
ls -t backup_*.tar.gz | tail -n +6 | xargs rm -f
echo "Old backups cleaned up"
```

### Log Analyzer

```bash
#!/bin/bash

log_file="/var/log/nginx/access.log"

if [ ! -f "$log_file" ]; then
    echo "Log file not found: $log_file"
    exit 1
fi

echo "=== Log Analysis for $log_file ==="
echo "Total requests: $(wc -l < "$log_file")"
echo "Unique IPs: $(awk '{print $1}' "$log_file" | sort | uniq | wc -l)"
echo "Top 10 IPs:"
awk '{print $1}' "$log_file" | sort | uniq -c | sort -nr | head -10
echo "Top 10 requested pages:"
awk '{print $7}' "$log_file" | sort | uniq -c | sort -nr | head -10
```

## Best Practices

### 1. Always Use Shebang

```bash
#!/bin/bash
```

### 2. Quote Variables

```bash
# Good
if [ -f "$filename" ]; then
    echo "File: $filename"
fi

# Bad (can break with spaces)
if [ -f $filename ]; then
    echo "File: $filename"
fi
```

### 3. Use `set` Options

```bash
#!/bin/bash

# Exit on error
set -e

# Treat unset variables as error
set -u

# Make pipes fail if any command fails
set -o pipefail
```

### 4. Add Comments

```bash
#!/bin/bash

# This script backs up important files
# Author: Your Name
# Date: 2024-10-19

# Configuration section
BACKUP_DIR="/backup"
SOURCE_DIR="/home/user"

# Main backup function
create_backup() {
    # Implementation here
}
```

## Common Pitfalls

1. **Not quoting variables** - Can cause issues with spaces
2. **Not checking exit codes** - Scripts continue after errors
3. **Using `==` instead of `=`** - Use single `=` for string comparison
4. **Forgetting to make scripts executable** - Use `chmod +x`
5. **Not handling edge cases** - Empty inputs, missing files, etc.

## Advanced Topics to Explore

- Regular expressions with `grep`, `sed`, `awk`
- Process substitution
- Advanced parameter expansion
- Signal handling
- Debugging with `set -x`
- Unit testing for scripts

## Exercises

1. **File Organizer**: Create a script that organizes files by extension
2. **System Monitor**: Write a script that alerts when disk space is low
3. **User Manager**: Script to add/remove users with proper validation
4. **Log Rotator**: Implement log rotation with compression

Bash scripting is incredibly powerful and will save you countless hours once you master it. Start small, practice regularly, and gradually build more complex scripts as your confidence grows.