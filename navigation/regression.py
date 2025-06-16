import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Given data
study_hours = [5, 6, 7, 8, 9, 6, 7, 10, 4, 6, 11, 8, 9]
exam_scores = [55, 60, 65, 70, 75, 62, 66, 85, 50, 58, 90, 73, 78]

# Convert to arrays
X = np.array(study_hours).reshape(-1, 1)
y = np.array(exam_scores)

# Perform linear regression
model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

# Get parameters
intercept = model.intercept_
coefficient = model.coef_[0]
r_squared = model.score(X, y)

# Plot with equation and R² annotation
plt.figure(figsize=(8, 5))
plt.scatter(X, y, color='blue', label='Actual Data')
plt.plot(X, y_pred, color='red', label='Regression Line')
plt.xlabel('Study Hours per Week')
plt.ylabel('Exam Score')
plt.title('Linear Regression: Study Hours vs Exam Score')
plt.legend()

# Annotation of regression equation and R² on the plot
equation_text = f"y = {coefficient:.2f}x + {intercept:.2f}\nR² = {r_squared:.4f}"
plt.text(6, 55, equation_text, fontsize=10, bbox=dict(facecolor='white', edgecolor='black'))

plt.grid(True)
plt.tight_layout()
plt.show()
