import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Load csv
df = pd.read_csv("cars-data.csv")


# Remove zeros 
df = df[(df["city_mpg"] > 0) & 
        (df["highway_mpg"] > 0) & 
        (df["horsepower"] > 0)]

sns.set(style="whitegrid")


# histogram (City MPG)
plt.figure(figsize=(10,6))
sns.histplot(df["city_mpg"], bins=20, kde=False)

plt.title("Histogram of City MPG", fontsize=16, fontweight='bold')
plt.xlabel("City MPG")
plt.ylabel("Frequency")
plt.grid(alpha=0.3)

#plt.savefig("histogram_city_mpg.png", dpi=300, bbox_inches='tight')
plt.show()



# box(Highway MPG)

# 1. Use the SAME column for bounds and filtering
column = "horsepower" 

Q1 = df[column].quantile(0.25)
Q3 = df[column].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# 2. Filter the correct column
outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]

plt.figure(figsize=(8,6))
# Turn off native outliers so they don't double up
sns.boxplot(y=df[column], showfliers=False) 

# 3. Plot manual outliers
plt.scatter([0] * len(outliers), 
            outliers[column], 
            color="red", 
            s=50,  
            zorder=3,  
            label="Outliers")

plt.title(f"Box Plot of {column}", fontsize=16, fontweight='bold')
plt.ylabel(column)
plt.legend()
#plt.savefig("box-plot.png", dpi=300, bbox_inches='tight')

plt.show()

# strip (Horsepower)

plt.figure(figsize=(10,6))
sns.stripplot(y=df["highway_mpg"], 
              jitter=True, 
              alpha=0.5)

plt.title("Strip Plot of Highway MPG", fontsize=16, fontweight='bold')
plt.ylabel("Highway MPG")
plt.grid(alpha=0.3)

plt.savefig("stripplot_highway_mpg.png", dpi=300, bbox_inches='tight')
plt.show()


# ECDF 

plt.figure(figsize=(10,6))
sns.ecdfplot(df["city_mpg"])

plt.title("ECDF of City MPG", fontsize=16, fontweight='bold')
plt.xlabel("City MPG")
plt.ylabel("Cumulative Proportion")
plt.grid(alpha=0.3)

#plt.savefig("ecdf_city_mpg.png", dpi=300, bbox_inches='tight')
plt.show()
