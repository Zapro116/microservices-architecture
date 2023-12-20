#!/bin/bash

# Main directory (where the script is located)
main_dir="$(dirname "$(readlink -f "$0")")"

# Subdirectories (add more as needed)
sub_dirs=("client" "comments" "event-bus" "moderation" "posts" "query")

# Run npm install in main directory
echo "Running npm install in the main directory..."
(cd "$main_dir" && npm install)

# Run npm install in specified subdirectories
for sub_dir in "${sub_dirs[@]}"; do
  dir_path="$main_dir/$sub_dir"
  if [ -d "$dir_path" ]; then
    echo "Running npm install in $sub_dir..."
    (cd "$dir_path" && npm install)
  else
    echo "Directory $sub_dir not found."
  fi
done

echo "npm install completed."
