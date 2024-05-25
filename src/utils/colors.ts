const colors = [
    "#FFD1DC", // Light Pink
    "#FF9AA2", // Pastel Red
    "#FFB7B2", // Light Coral
    "#FFDAC1", // Light Orange
    "#E2F0CB", // Light Green
    "#B5EAD7", // Light Cyan
    "#C7CEEA", // Light Lavender
    "#C1C8E4", // Light Blue
    "#B2EBF2", // Light Aqua
    "#FFDFD3", // Light Peach
    "#FFF0F5", // Lighter Pink
    "#FCE4EC", // Lighter Pastel Red
    "#FCEAEA", // Lighter Light Coral
    "#FFF5E0", // Lighter Light Orange
    "#F1FAEE", // Lighter Light Green
    "#D1F2E8", // Lighter Light Cyan
    "#E2EBF3", // Lighter Light Lavender
    "#DAE0E8", // Lighter Light Blue
    "#D2E3EE", // Lighter Light Aqua
    "#FFF3E0", // Lighter Light Peach
    "#FDF5DD", // Very Light Cream
  "#FCE4E1", // Very Light Peach
  "#EAEAF2", // Very Light Lavender
  "#D7EEE9", // Very Light Sky Blue
  "#CCE5FF", // Very Light Blue
  "#E0FFFF", // Light Blue
  "#F0FFF0", // Honeydew
  "#FAFAD2", // Light Goldenrod Yellow
  "#FFE4E1", // Light Salmon

  // Shades of existing colors (darker)
  "#E6B8B2", // Darker Light Coral
  "#D9E2B4", // Darker Light Green
  "#A9D6C4", // Darker Light Cyan
  "#B2C2CF", // Darker Light Blue
  "#A2D1E4", // Darker Light Aqua
];

export const getRandomColor = () => {
    console.log(colors[Math.floor(Math.random() * colors.length)])
    return colors[Math.floor(Math.random() * colors.length)];
};