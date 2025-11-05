const {
  VALIDATION_PATTERNS,
  validateAndSanitize,
  sanitizeInput,
  validateAmount,
  containsXSSPatterns
} = require('../../utils/validation');

describe('Validation Utils', () => {
  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const result = sanitizeInput(input);
      expect(result).toBe('hello world');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });
  });

  describe('containsXSSPatterns', () => {
    it('should detect script tags', () => {
      expect(containsXSSPatterns('<script>alert("xss")</script>')).toBe(true);
      expect(containsXSSPatterns('hello world')).toBe(false);
    });

    it('should detect javascript: protocol', () => {
      expect(containsXSSPatterns('javascript:alert("xss")')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(containsXSSPatterns('onclick=alert("xss")')).toBe(true);
      expect(containsXSSPatterns('onload=malicious()')).toBe(true);
    });

    it('should detect iframe tags', () => {
      expect(containsXSSPatterns('<iframe src="malicious"></iframe>')).toBe(true);
    });
  });

  describe('validateAndSanitize', () => {
    it('should validate and sanitize valid input', () => {
      const result = validateAndSanitize('Username', 'validUser123', VALIDATION_PATTERNS.USERNAME);
      expect(result).toBe('validUser123');
    });

    it('should throw error for empty input', () => {
      expect(() => {
        validateAndSanitize('Username', '', VALIDATION_PATTERNS.USERNAME);
      }).toThrow('Username is required');
    });

    it('should throw error for invalid pattern', () => {
      expect(() => {
        validateAndSanitize('Username', '123invalid', VALIDATION_PATTERNS.USERNAME);
      }).toThrow('Invalid Username format');
    });

    it('should throw error for XSS patterns', () => {
      expect(() => {
        validateAndSanitize('Input', '<script>alert("xss")</script>');
      }).toThrow('Input contains invalid characters');
    });

    it('should sanitize HTML in valid input', () => {
      const result = validateAndSanitize('Name', 'John & Jane', VALIDATION_PATTERNS.FULLNAME);
      expect(result).toBe('John &amp; Jane');
    });
  });

  describe('validateAmount', () => {
    it('should validate and return valid amounts', () => {
      expect(validateAmount('100.50')).toBe(100.50);
      expect(validateAmount('1000')).toBe(1000);
      expect(validateAmount('0.01')).toBe(0.01);
    });

    it('should throw error for invalid amount format', () => {
      expect(() => validateAmount('abc')).toThrow('Invalid amount format');
      expect(() => validateAmount('100.123')).toThrow('Invalid amount format');
      expect(() => validateAmount('-100')).toThrow('Invalid amount format');
    });

    it('should throw error for amounts out of range', () => {
      expect(() => validateAmount('0')).toThrow('Amount must be between 0.01 and 1,000,000');
      expect(() => validateAmount('1000001')).toThrow('Amount must be between 0.01 and 1,000,000');
    });

    it('should handle string and number inputs', () => {
      expect(validateAmount(100.50)).toBe(100.50);
      expect(validateAmount('100.50')).toBe(100.50);
    });
  });

  describe('VALIDATION_PATTERNS', () => {
    describe('PASSWORD', () => {
      it('should validate strong passwords', () => {
        expect(VALIDATION_PATTERNS.PASSWORD.test('StrongPass123!')).toBe(true);
        expect(VALIDATION_PATTERNS.PASSWORD.test('AnotherGood#45')).toBe(true);
      });

      it('should reject weak passwords', () => {
        expect(VALIDATION_PATTERNS.PASSWORD.test('weak')).toBe(false);
        expect(VALIDATION_PATTERNS.PASSWORD.test('NoSpecialChar123')).toBe(false);
        expect(VALIDATION_PATTERNS.PASSWORD.test('nouppercase123!')).toBe(false);
        expect(VALIDATION_PATTERNS.PASSWORD.test('NOLOWERCASE123!')).toBe(false);
        expect(VALIDATION_PATTERNS.PASSWORD.test('NoNumbers!')).toBe(false);
      });
    });

    describe('SWIFTCODE', () => {
      it('should validate correct SWIFT codes', () => {
        expect(VALIDATION_PATTERNS.SWIFTCODE.test('ABCDUS33')).toBe(true);
        expect(VALIDATION_PATTERNS.SWIFTCODE.test('ABCDUS33XXX')).toBe(true);
      });

      it('should reject invalid SWIFT codes', () => {
        expect(VALIDATION_PATTERNS.SWIFTCODE.test('ABCD33')).toBe(false);
        expect(VALIDATION_PATTERNS.SWIFTCODE.test('123CDUS33')).toBe(false);
        expect(VALIDATION_PATTERNS.SWIFTCODE.test('ABCDUS')).toBe(false);
      });
    });

    describe('ACCOUNTNUMBER', () => {
      it('should validate account numbers', () => {
        expect(VALIDATION_PATTERNS.ACCOUNTNUMBER.test('12345678')).toBe(true);
        expect(VALIDATION_PATTERNS.ACCOUNTNUMBER.test('123456789012')).toBe(true);
      });

      it('should reject invalid account numbers', () => {
        expect(VALIDATION_PATTERNS.ACCOUNTNUMBER.test('1234567')).toBe(false);
        expect(VALIDATION_PATTERNS.ACCOUNTNUMBER.test('1234567890123')).toBe(false);
        expect(VALIDATION_PATTERNS.ACCOUNTNUMBER.test('abcd1234')).toBe(false);
      });
    });

    describe('CURRENCY', () => {
      it('should validate supported currencies', () => {
        expect(VALIDATION_PATTERNS.CURRENCY.test('USD')).toBe(true);
        expect(VALIDATION_PATTERNS.CURRENCY.test('EUR')).toBe(true);
        expect(VALIDATION_PATTERNS.CURRENCY.test('GBP')).toBe(true);
        expect(VALIDATION_PATTERNS.CURRENCY.test('ZAR')).toBe(true);
      });

      it('should reject unsupported currencies', () => {
        expect(VALIDATION_PATTERNS.CURRENCY.test('JPY')).toBe(false);
        expect(VALIDATION_PATTERNS.CURRENCY.test('invalid')).toBe(false);
      });
    });
  });
});
