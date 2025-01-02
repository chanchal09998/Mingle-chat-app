// Signup validation middleware
const signupValidation = (req, res, next) => {
  const { name, email, password } = req.body;

  // Name validation: must be present and have at least 3 characters
  if (!name || name.length < 3) {
    return res.status(400).json({
      message: "Name is required and should be at least 3 characters",
    });
  }

  // Email validation: must be provided and valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password validation: must be provided and at least 6 characters
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password is required and should be at least 6 characters long",
    });
  }

  // Pass the request to the next middleware/controller
  next();
};

// Login validation middleware
const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  // Email validation: must be provided and valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password validation: must be provided and at least 6 characters
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password is required and should be at least 6 characters long",
    });
  }

  // Pass the request to the next middleware/controller
  next();
};

export { signupValidation, loginValidation };
