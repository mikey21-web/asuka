// Basic Input Validation without external dependencies (e.g., Zod)
// Helps protect against prompt injection and excessive token usage

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const validateStylistRequest = (body: any): ValidationResult<{ message: string; session_id?: string }> => {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }

  const { message, session_id } = body;

  if (typeof message !== 'string') {
    return { success: false, error: 'Message must be a string' };
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length < 2) {
    return { success: false, error: 'Message is too short' };
  }

  if (trimmedMessage.length > 300) {
    return { success: false, error: 'Message exceeds the maximum length of 300 characters' };
  }

  if (session_id && typeof session_id !== 'string') {
    return { success: false, error: 'Session ID must be a string' };
  }

  if (session_id && session_id.length > 100) {
    return { success: false, error: 'Session ID exceeds the maximum length' };
  }

  return { 
    success: true, 
    data: { 
      message: trimmedMessage, 
      session_id: session_id ? session_id.trim() : undefined 
    } 
  };
};

export const validateDesignRequest = (body: any): ValidationResult<{ message: string; session_id?: string }> => {
  // Uses identical validation logic as stylist request for now
  return validateStylistRequest(body);
};

export const validateSizerRequest = (body: any): ValidationResult<{ mode: string; brand?: string; size?: string; product_type: string }> => {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }

  const { mode, brand, size, product_type } = body;

  if (typeof mode !== 'string' || !['brand_size', 'measurements'].includes(mode)) {
    return { success: false, error: 'Mode must be either "brand_size" or "measurements"' };
  }

  if (typeof product_type !== 'string' || product_type.trim().length === 0) {
    return { success: false, error: 'Product type is required' };
  }

  if (product_type.length > 50) {
    return { success: false, error: 'Product type exceeds maximum length' };
  }

  if (mode === 'brand_size') {
    if (typeof brand !== 'string' || brand.trim().length === 0) {
      return { success: false, error: 'Brand is required when mode is "brand_size"' };
    }
    if (typeof size !== 'string' || size.trim().length === 0) {
      return { success: false, error: 'Size is required when mode is "brand_size"' };
    }
    if (brand.length > 50 || size.length > 20) {
      return { success: false, error: 'Brand or Size exceeds maximum length' };
    }
  }

  return {
    success: true,
    data: {
      mode: mode as string,
      brand: brand ? (brand as string).trim() : undefined,
      size: size ? (size as string).trim() : undefined,
      product_type: (product_type as string).trim()
    }
  };
};

export const validateMIYChatRequest = (body: any): ValidationResult<{ message: string; inputs?: any; history?: any[] }> => {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }

  const { message, inputs, history } = body;

  if (typeof message !== 'string') {
    return { success: false, error: 'Message must be a string' };
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length < 2) {
    return { success: false, error: 'Message is too short' };
  }

  if (trimmedMessage.length > 1000) {
    return { success: false, error: 'Message exceeds the maximum length' };
  }

  return {
    success: true,
    data: {
      message: trimmedMessage,
      inputs,
      history: Array.isArray(history) ? history : undefined
    }
  };
};

export const validateMIYVisualizeRequest = (body: any): ValidationResult<{ prompt: string }> => {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }

  const { prompt } = body;

  if (typeof prompt !== 'string' || prompt.trim().length < 2) {
    return { success: false, error: 'Valid prompt is required' };
  }

  if (prompt.length > 500) {
    return { success: false, error: 'Prompt exceeds the maximum length' };
  }

  return {
    success: true,
    data: {
      prompt: prompt.trim()
    }
  };
};
