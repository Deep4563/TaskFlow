export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegisterInput(data: {
  name?: string;
  email?: string;
  password?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email" });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" });
  }

  return errors;
}

export function validateLoginInput(data: {
  email?: string;
  password?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email" });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
}