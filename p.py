#!/usr/bin/env python3
"""
Transform lottery data from:
  Winning Numbers
  11 21 27 36 62 24
  14 18 36 49 67 18

To:
  Number
  11
  21
  27
  ...
"""

import csv

# Input and output file names
input_file = 'winnning-data.csv'
output_file = 'numbers_for_tableau.csv'

# Read input and write output
with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    # Write header
    writer.writerow(['Number'])
    
    # Skip header row
    header = next(reader)
    
    # Process each row
    for row in reader:
        if row:  # Make sure row is not empty
            winning_numbers = row[0]  # Get the "Winning Numbers" column
            
            # Split the numbers by space
            numbers = winning_numbers.strip().split()
            
            # Write each number as a separate row
            for num in numbers:
                writer.writerow([num])

print(f"✓ Transformation complete!")
print(f"✓ Input: {input_file}")
print(f"✓ Output: {output_file}")
print(f"\nNow load '{output_file}' into Tableau and create your bar chart:")
print("  - Columns: Number")
print("  - Rows: CNT(Number)")