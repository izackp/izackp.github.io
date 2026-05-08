var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/.pnpm/latexium@0.1.1/node_modules/latexium/dist/index.esm.js
var RESERVED_FUNCTIONS = /* @__PURE__ */ new Set([
  "sin",
  "cos",
  "tan",
  "log",
  "ln",
  "exp",
  "sqrt",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "abs",
  "d"
  // dは予約語（変数名不可）
]);
var RESERVED_SYMBOLS = /* @__PURE__ */ new Set(["\u221E", "infinity", "\u2205"]);
var FUNCTION_ARG_COUNTS = {
  sin: 1,
  cos: 1,
  tan: 1,
  asin: 1,
  acos: 1,
  atan: 1,
  sinh: 1,
  cosh: 1,
  tanh: 1,
  log: 1,
  ln: 1,
  exp: 1,
  sqrt: 1,
  abs: 1
};
var MATH_CONSTANTS = {
  e: Math.E,
  \u03C0: Math.PI,
  pi: Math.PI
};
var _LaTeXTokenizer = class _LaTeXTokenizer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[0] || null;
  }
  /**
   * Advance to the next character
   */
  advance() {
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] ?? null : null;
  }
  /**
   * Peek at the next character without advancing
   */
  peek() {
    const peekPos = this.position + 1;
    return peekPos < this.input.length ? this.input[peekPos] ?? null : null;
  }
  /**
   * Skip whitespace characters
   */
  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }
  /**
   * Read a number (integer or decimal)
   */
  readNumber() {
    let result = "";
    while (this.currentChar && /[0-9.]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }
  /**
   * Read an identifier (variable name)
   * For mathematical expressions, we treat each single letter as a separate variable
   * to enable proper implicit multiplication (e.g., "xx" becomes "x * x")
   */
  readIdentifier() {
    if (this.currentChar && /[a-zA-Z]/.test(this.currentChar)) {
      const result2 = this.currentChar;
      this.advance();
      return result2;
    }
    let result = "";
    while (this.currentChar && /[a-zA-Z_]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }
  /**
   * Read a LaTeX command starting with backslash
   */
  readCommand() {
    let result = "\\";
    this.advance();
    while (this.currentChar && /[a-zA-Z]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return result;
  }
  /**
   * Get the next token from the input
   */
  nextToken() {
    while (this.currentChar) {
      const position = this.position;
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }
      if (/[0-9]/.test(this.currentChar)) {
        return {
          type: "NUMBER",
          value: this.readNumber(),
          position
        };
      }
      if (this.currentChar === "\\") {
        const command = this.readCommand();
        switch (command) {
          case "\\cdot":
            return { type: "OPERATOR", value: "*", position };
          case "\\times":
            return { type: "OPERATOR", value: "*", position };
          case "\\div":
            return { type: "OPERATOR", value: "/", position };
          case "\\star":
            return { type: "OPERATOR", value: "*", position };
          case "\\ast":
            return { type: "OPERATOR", value: "*", position };
          default:
            return { type: "COMMAND", value: command, position };
        }
      }
      switch (this.currentChar) {
        case "(":
          this.advance();
          return { type: "LPAREN", value: "(", position };
        case ")":
          this.advance();
          return { type: "RPAREN", value: ")", position };
        case "{":
          this.advance();
          return { type: "LBRACE", value: "{", position };
        case "}":
          this.advance();
          return { type: "RBRACE", value: "}", position };
        case "[":
          this.advance();
          return { type: "LBRACKET", value: "[", position };
        case "]":
          this.advance();
          return { type: "RBRACKET", value: "]", position };
        case "_":
          this.advance();
          return { type: "UNDERSCORE", value: "_", position };
        case "^":
          this.advance();
          return { type: "CARET", value: "^", position };
        case ",":
          this.advance();
          return { type: "COMMA", value: ",", position };
        case "!":
          this.advance();
          return { type: "FACTORIAL", value: "\\factorial", position };
        case "+":
        case "-":
        case "*":
        case "/":
        case "=":
        case ">":
        case "<": {
          const op = this.currentChar;
          this.advance();
          if ((op === ">" || op === "<") && this.currentChar === "=") {
            const extendedOp = op + this.currentChar;
            this.advance();
            return { type: "OPERATOR", value: extendedOp, position };
          }
          return { type: "OPERATOR", value: op, position };
        }
      }
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return {
          type: "IDENTIFIER",
          value: this.readIdentifier(),
          position
        };
      }
      if (/[π∞∅]/.test(this.currentChar)) {
        const symbol = this.currentChar;
        this.advance();
        return { type: "IDENTIFIER", value: symbol, position };
      }
      const unknownChar = this.currentChar;
      this.advance();
      return {
        type: "ERROR",
        value: unknownChar,
        position
      };
    }
    return {
      type: "EOF",
      value: "",
      position: this.position
    };
  }
  /**
   * Tokenize the entire input into an array of tokens
   */
  tokenize() {
    const tokens = [];
    let token;
    do {
      token = this.nextToken();
      tokens.push(token);
    } while (token.type !== "EOF");
    return tokens;
  }
};
__name(_LaTeXTokenizer, "LaTeXTokenizer");
var LaTeXTokenizer = _LaTeXTokenizer;
function generateUniqueId(variableName, bindingDepth, bindingContext) {
  return `bound_${variableName}_${bindingDepth}_${bindingContext}`;
}
__name(generateUniqueId, "generateUniqueId");
function generateFreeVariableId(variableName) {
  return `free_${variableName}`;
}
__name(generateFreeVariableId, "generateFreeVariableId");
function resolveScopeInAST(node, bindingStack = []) {
  switch (node.type) {
    case "NumberLiteral":
      return node;
    case "Identifier":
      return resolveIdentifierScope(node, bindingStack);
    case "BinaryExpression":
      return {
        ...node,
        left: resolveScopeInAST(node.left, bindingStack),
        right: resolveScopeInAST(node.right, bindingStack)
      };
    case "UnaryExpression":
      return {
        ...node,
        operand: resolveScopeInAST(node.operand, bindingStack)
      };
    case "FunctionCall":
      return {
        ...node,
        args: node.args.map((arg) => resolveScopeInAST(arg, bindingStack))
      };
    case "Fraction":
      return {
        ...node,
        numerator: resolveScopeInAST(node.numerator, bindingStack),
        denominator: resolveScopeInAST(node.denominator, bindingStack)
      };
    case "Integral":
      return resolveIntegralScope(node, bindingStack);
    case "Sum":
      return resolveSumScope(node, bindingStack);
    case "Product":
      return resolveProductScope(node, bindingStack);
    default:
      return node;
  }
}
__name(resolveScopeInAST, "resolveScopeInAST");
function resolveIdentifierScope(node, bindingStack) {
  for (let i = bindingStack.length - 1; i >= 0; i--) {
    const context = bindingStack[i];
    if (context && context.variable === node.name) {
      return {
        ...node,
        scope: "bound",
        bindingDepth: context.bindingDepth,
        bindingContext: context.bindingType,
        uniqueId: context.uniqueId
      };
    }
  }
  return {
    ...node,
    scope: "free",
    uniqueId: generateFreeVariableId(node.name)
  };
}
__name(resolveIdentifierScope, "resolveIdentifierScope");
function resolveIntegralScope(node, bindingStack) {
  const newBindingDepth = bindingStack.length + 1;
  const uniqueId = generateUniqueId(node.variable, newBindingDepth, "integral");
  const newBinding = {
    variable: node.variable,
    uniqueId,
    bindingDepth: newBindingDepth,
    bindingType: "integral"
  };
  const newBindingStack = [...bindingStack, newBinding];
  const result = {
    ...node,
    integrand: resolveScopeInAST(node.integrand, newBindingStack)
  };
  if (node.lowerBound !== void 0) {
    result.lowerBound = resolveScopeInAST(node.lowerBound, bindingStack);
  }
  if (node.upperBound !== void 0) {
    result.upperBound = resolveScopeInAST(node.upperBound, bindingStack);
  }
  return result;
}
__name(resolveIntegralScope, "resolveIntegralScope");
function resolveSumScope(node, bindingStack) {
  const newBindingDepth = bindingStack.length + 1;
  const uniqueId = generateUniqueId(node.variable, newBindingDepth, "sum");
  const newBinding = {
    variable: node.variable,
    uniqueId,
    bindingDepth: newBindingDepth,
    bindingType: "sum"
  };
  const newBindingStack = [...bindingStack, newBinding];
  return {
    ...node,
    expression: resolveScopeInAST(node.expression, newBindingStack),
    lowerBound: resolveScopeInAST(node.lowerBound, bindingStack),
    upperBound: resolveScopeInAST(node.upperBound, bindingStack)
  };
}
__name(resolveSumScope, "resolveSumScope");
function resolveProductScope(node, bindingStack) {
  const newBindingDepth = bindingStack.length + 1;
  const uniqueId = generateUniqueId(node.variable, newBindingDepth, "product");
  const newBinding = {
    variable: node.variable,
    uniqueId,
    bindingDepth: newBindingDepth,
    bindingType: "product"
  };
  const newBindingStack = [...bindingStack, newBinding];
  return {
    ...node,
    expression: resolveScopeInAST(node.expression, newBindingStack),
    lowerBound: resolveScopeInAST(node.lowerBound, bindingStack),
    upperBound: resolveScopeInAST(node.upperBound, bindingStack)
  };
}
__name(resolveProductScope, "resolveProductScope");
function validateFunctionArgs(functionName, argCount) {
  const expectedCount = FUNCTION_ARG_COUNTS[functionName];
  if (expectedCount === void 0) {
    return null;
  }
  if (argCount !== expectedCount) {
    return `Function \\${functionName} expects ${expectedCount} argument(s), but ${argCount} were provided`;
  }
  return null;
}
__name(validateFunctionArgs, "validateFunctionArgs");
var DEFAULTS = {
  MAX_EXPANSION_POWER: 10,
  IS_STEPS_INCLUDE_LATEX: true,
  FACTORIZATION: {
    applyFactorPlusOperate: false,
    useLLL: false,
    useBerlekampZassenhaus: false
  },
  DEFAULT_SIMPLIFY_OPTIONS: {
    expandPowers: false,
    combineLikeTerms: true,
    factorCommonFactors: false
  },
  COMMON_FUNCTION_NAMES: ["f", "g", "h", "F", "G", "H"],
  LATEX_BRACKET: {
    LEFT: "$",
    RIGHT: "$"
  }
};
var config = {
  MAX_EXPANSION_POWER: DEFAULTS.MAX_EXPANSION_POWER,
  IS_STEPS_INCLUDE_LATEX: DEFAULTS.IS_STEPS_INCLUDE_LATEX,
  FACTORIZATION: { ...DEFAULTS.FACTORIZATION },
  DEFAULT_SIMPLIFY_OPTIONS: { ...DEFAULTS.DEFAULT_SIMPLIFY_OPTIONS },
  COMMON_FUNCTION_NAMES: new Set(DEFAULTS.COMMON_FUNCTION_NAMES),
  LATEX_BRACKET: { ...DEFAULTS.LATEX_BRACKET }
};
var _LaTeXParser = class _LaTeXParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
    this.currentToken = tokens[0] || { type: "EOF", value: "", position: 0 };
  }
  /**
   * Advance to the next token
   */
  advance() {
    this.currentTokenIndex++;
    if (this.currentTokenIndex < this.tokens.length) {
      this.currentToken = this.tokens[this.currentTokenIndex] ?? {
        type: "EOF",
        value: "",
        position: 0
      };
    }
  }
  /**
   * Peek at the next token without advancing
   */
  peek() {
    const nextIndex = this.currentTokenIndex + 1;
    return nextIndex < this.tokens.length ? this.tokens[nextIndex] ?? { type: "EOF", value: "", position: 0 } : { type: "EOF", value: "", position: 0 };
  }
  /**
   * Check if current token matches expected type
   */
  expectToken(expectedType) {
    return this.currentToken.type === expectedType;
  }
  /**
   * Consume a token of expected type or throw error
   */
  consume(expectedType) {
    if (this.currentToken.type !== expectedType) {
      throw new Error(`Expected ${expectedType} but got ${this.currentToken.type} at position ${this.currentToken.position}`);
    }
    const token = this.currentToken;
    this.advance();
    return token;
  }
  /**
   * Parse a number literal
   */
  parseNumber() {
    const token = this.consume("NUMBER");
    const value = parseFloat(token.value);
    if (isNaN(value)) {
      throw new Error(`Invalid number: ${token.value} at position ${token.position}`);
    }
    return {
      type: "NumberLiteral",
      value
    };
  }
  /**
   * Parse an identifier (variable or function name)
   */
  /**
   * Parse an identifier (variable or function name)
   * @param allowReserved - trueなら予約語チェックをスキップ（d専用）
   */
  parseIdentifier(allowReserved = false) {
    const token = this.consume("IDENTIFIER");
    if (!allowReserved && (RESERVED_FUNCTIONS.has(token.value) || RESERVED_SYMBOLS.has(token.value))) {
      throw new Error(`Reserved word cannot be used as variable name: ${token.value} at position ${token.position}`);
    }
    return {
      type: "Identifier",
      name: token.value
    };
  }
  /**
   * Parse a function call
   */
  parseFunctionCall(functionName, position) {
    this.consume("LPAREN");
    const args = [];
    if (!this.expectToken("RPAREN")) {
      args.push(this.parseExpression());
      while (this.expectToken("COMMA")) {
        this.advance();
        args.push(this.parseExpression());
      }
    }
    this.consume("RPAREN");
    const argError = validateFunctionArgs(functionName, args.length);
    if (argError) {
      throw new Error(`${argError} at position ${position}`);
    }
    return {
      type: "FunctionCall",
      name: functionName,
      args
    };
  }
  /**
   * Parse a primary expression (numbers, identifiers, parentheses, functions)
   */
  parsePrimary() {
    if (this.expectToken("NUMBER")) {
      return this.parseNumber();
    }
    if (this.expectToken("IDENTIFIER")) {
      const token = this.currentToken;
      const identifier = this.parseIdentifier();
      if (this.expectToken("LPAREN")) {
        const isReservedFunction = this.isFunction(identifier.name);
        const isCommonFunction = config.COMMON_FUNCTION_NAMES.has(identifier.name);
        let startsWithNegative = false;
        if (this.currentTokenIndex + 1 < this.tokens.length) {
          const nextToken = this.tokens[this.currentTokenIndex + 1];
          startsWithNegative = nextToken?.type === "OPERATOR" && nextToken?.value === "-";
        }
        const shouldTreatAsFunction = isReservedFunction || isCommonFunction;
        const shouldTreatAsMultiplication = startsWithNegative || !shouldTreatAsFunction && identifier.name.length === 1;
        if (shouldTreatAsMultiplication) {
          return identifier;
        }
        const functionCall = this.parseFunctionCall(identifier.name, token.position);
        if (this.expectToken("CARET")) {
          this.advance();
          let exponent;
          if (this.expectToken("LBRACE")) {
            this.consume("LBRACE");
            exponent = this.parseAddition();
            this.consume("RBRACE");
          } else {
            exponent = this.parseUnary();
          }
          return {
            type: "BinaryExpression",
            operator: "^",
            left: functionCall,
            right: exponent
          };
        }
        return functionCall;
      }
      return identifier;
    }
    if (this.expectToken("LPAREN")) {
      this.advance();
      const expr = this.parseExpression();
      this.consume("RPAREN");
      return expr;
    }
    if (this.expectToken("COMMAND")) {
      return this.parseCommand();
    }
    throw new Error(`Unexpected token: ${this.currentToken.value} at position ${this.currentToken.position}`);
  }
  /**
   * Parse a LaTeX command
   */
  parseCommand() {
    const token = this.consume("COMMAND");
    switch (token.value) {
      case "\\int": {
        let lowerBound = void 0;
        let upperBound = void 0;
        if (this.expectToken("UNDERSCORE")) {
          this.advance();
          if (this.expectToken("LBRACE")) {
            this.consume("LBRACE");
            lowerBound = this.parseExpression();
            this.consume("RBRACE");
          } else {
            lowerBound = this.parsePrimary();
          }
        }
        if (this.expectToken("CARET")) {
          this.advance();
          if (this.expectToken("LBRACE")) {
            this.consume("LBRACE");
            upperBound = this.parseExpression();
            this.consume("RBRACE");
          } else {
            upperBound = this.parsePrimary();
          }
        }
        let integrandEnd = this.currentTokenIndex;
        while (integrandEnd < this.tokens.length) {
          const t = this.tokens[integrandEnd];
          if (!t)
            break;
          if (t.type === "IDENTIFIER") {
            if (t.value === "d") {
              const next = this.tokens[integrandEnd + 1];
              if (next && next.type === "IDENTIFIER" && /^[a-zA-Z]$/.test(next.value)) {
                break;
              }
              break;
            } else if (/^d[a-zA-Z]$/.test(t.value)) {
              break;
            }
          }
          integrandEnd++;
        }
        const integrandTokens = this.tokens.slice(this.currentTokenIndex, integrandEnd);
        if (integrandTokens.length === 0) {
          throw new Error("Missing integrand before dx/dt/du");
        }
        const subParser = new _LaTeXParser(integrandTokens.concat([{ type: "EOF", value: "", position: 0 }]));
        const integrand = subParser.parseExpression();
        this.currentTokenIndex = integrandEnd;
        this.currentToken = this.tokens[this.currentTokenIndex] || {
          type: "EOF",
          value: "",
          position: 0
        };
        let variable = void 0;
        while (this.currentToken.type === "WHITESPACE")
          this.advance();
        if (this.expectToken("IDENTIFIER")) {
          const first = this.currentToken;
          if (first.value === "d") {
            this.advance();
            if (this.expectToken("IDENTIFIER") && /^[a-zA-Z]$/.test(this.currentToken.value)) {
              const second = this.currentToken;
              variable = second.value;
              this.advance();
            } else {
              throw new Error(`Expected dx/dt/du etc. after integrand at position ${first.position}`);
            }
          } else if (/^d[a-zA-Z]$/.test(first.value)) {
            variable = first.value.substring(1);
            this.advance();
          } else {
            throw new Error(`Expected dx/dt/du etc. after integrand at position ${first.position}`);
          }
        } else {
          throw new Error(`Expected dx/dt/du etc. after integrand at position ${this.currentToken.position}`);
        }
        return {
          type: "Integral",
          integrand,
          variable,
          ...lowerBound !== void 0 ? { lowerBound } : {},
          ...upperBound !== void 0 ? { upperBound } : {}
        };
      }
      case "\\frac":
        return this.parseFraction();
      case "\\sqrt":
        return this.parseSqrt();
      case "\\sin":
      case "\\cos":
      case "\\tan":
      case "\\log":
      case "\\ln":
      case "\\exp": {
        const functionName = token.value.substring(1);
        if (this.expectToken("CARET")) {
          this.advance();
          let exponent;
          if (this.expectToken("LBRACE")) {
            this.consume("LBRACE");
            exponent = this.parseAddition();
            this.consume("RBRACE");
          } else {
            exponent = this.parseUnary();
          }
          if (!this.expectToken("LPAREN")) {
            throw new Error(`Expected function arguments after exponent at position ${this.currentToken.position}`);
          }
          const functionCall = this.parseFunctionCall(functionName, token.position);
          return {
            type: "BinaryExpression",
            operator: "^",
            left: functionCall,
            right: exponent
          };
        }
        return this.parseFunctionCall(functionName, token.position);
      }
      case "\\pi":
        return {
          type: "Identifier",
          name: "\u03C0"
        };
      case "\\e":
        return {
          type: "Identifier",
          name: "e"
        };
      case "\\factorial": {
        let argument;
        if (this.expectToken("LBRACE")) {
          this.consume("LBRACE");
          argument = this.parseExpression();
          this.consume("RBRACE");
        } else if (this.expectToken("LPAREN")) {
          this.consume("LPAREN");
          argument = this.parseExpression();
          this.consume("RPAREN");
        } else {
          argument = this.parsePrimary();
        }
        return {
          type: "Factorial",
          argument
        };
      }
      default:
        throw new Error(`Unsupported LaTeX command: ${token.value} at position ${token.position}`);
    }
  }
  /**
   * Parse a fraction \\frac{numerator}{denominator}
   */
  /**
   * Parse a fraction \frac{numerator}{denominator}
   * Special handling for \frac{d}{dx}[expr] → Derivative node
   */
  parseFraction() {
    this.consume("LBRACE");
    let numerator;
    let isNumeratorD = false;
    if (this.expectToken("IDENTIFIER") && this.currentToken.value === "d") {
      numerator = this.parseIdentifier(true);
      isNumeratorD = true;
    } else {
      numerator = this.parseExpression();
    }
    this.consume("RBRACE");
    this.consume("LBRACE");
    let denominator;
    let denominatorVar = null;
    let isDenominatorDStar = false;
    if (this.expectToken("IDENTIFIER") && this.currentToken.value.length >= 1 && this.currentToken.value[0] === "d") {
      const token = this.currentToken;
      if (token.value.length >= 2) {
        denominator = this.parseIdentifier(true);
        denominatorVar = token.value.substring(1);
        isDenominatorDStar = true;
      } else if (token.value === "d") {
        this.advance();
        if (this.expectToken("IDENTIFIER")) {
          const xToken = this.currentToken;
          denominatorVar = xToken.value;
          this.advance();
          denominator = { type: "Identifier", name: "d" + denominatorVar };
          isDenominatorDStar = true;
        } else {
          denominator = { type: "Identifier", name: "d" };
        }
      } else {
        denominator = this.parseIdentifier();
      }
    } else {
      denominator = this.parseExpression();
    }
    this.consume("RBRACE");
    if (isNumeratorD && isDenominatorDStar && typeof denominatorVar === "string" && denominatorVar.length >= 1) {
      while (this.currentToken.type === "WHITESPACE")
        this.advance();
      let expr = null;
      if (this.expectToken("LBRACE")) {
        this.consume("LBRACE");
        expr = this.parseExpression();
        this.consume("RBRACE");
      } else if (this.expectToken("LPAREN")) {
        this.consume("LPAREN");
        expr = this.parseExpression();
        this.consume("RPAREN");
      } else if (this.expectToken("LBRACKET")) {
        this.consume("LBRACKET");
        expr = this.parseExpression();
        this.consume("RBRACKET");
      } else {
        const restTokens = this.tokens.slice(this.currentTokenIndex, this.tokens.length - 1);
        if (restTokens.length === 0) {
          throw new Error("Expected expression after \\frac{d}{d*}");
        }
        const subParser = new _LaTeXParser(restTokens.concat([{ type: "EOF", value: "", position: 0 }]));
        expr = subParser.parseExpression();
        this.currentTokenIndex = this.tokens.length - 1;
        this.currentToken = this.tokens[this.currentTokenIndex] || {
          type: "EOF",
          value: "",
          position: 0
        };
      }
      return {
        type: "Derivative",
        variable: denominatorVar,
        expression: expr
      };
    }
    return {
      type: "Fraction",
      numerator,
      denominator
    };
  }
  /**
   * Parse a square root \\sqrt{expression}
   */
  parseSqrt() {
    this.consume("LBRACE");
    const argument = this.parseExpression();
    this.consume("RBRACE");
    return {
      type: "FunctionCall",
      name: "sqrt",
      args: [argument]
    };
  }
  /**
   * Parse unary expressions (+ and - operators)
   */
  parseUnary() {
    if (this.expectToken("OPERATOR") && (this.currentToken.value === "+" || this.currentToken.value === "-")) {
      const operator = this.currentToken.value;
      this.advance();
      const operand = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator,
        operand
      };
    }
    return this.parsePower();
  }
  /**
   * Parse power expressions (^ operator)
   */
  parsePower() {
    let left = this.parsePrimary();
    while (this.expectToken("CARET")) {
      this.advance();
      let right;
      if (this.expectToken("LBRACE")) {
        this.consume("LBRACE");
        right = this.parseAddition();
        this.consume("RBRACE");
      } else {
        right = this.parseUnary();
      }
      left = {
        type: "BinaryExpression",
        operator: "^",
        left,
        right
      };
    }
    while (this.expectToken("COMMAND") && this.currentToken.value === "\\factorial" || this.expectToken("FACTORIAL")) {
      this.advance();
      left = {
        type: "Factorial",
        argument: left
      };
    }
    return left;
  }
  /**
   * Parse multiplication and division (including implicit multiplication)
   */
  parseTerm() {
    let left = this.parseUnary();
    function toFractionDeep(node) {
      if (node.type === "BinaryExpression" && node.operator === "/") {
        return {
          type: "Fraction",
          numerator: toFractionDeep(node.left),
          denominator: toFractionDeep(node.right)
        };
      }
      return node;
    }
    __name(toFractionDeep, "toFractionDeep");
    while (true) {
      if (this.expectToken("OPERATOR") && (this.currentToken.value === "*" || this.currentToken.value === "/")) {
        const operator = this.currentToken.value;
        this.advance();
        const right = this.parseUnary();
        if (operator === "/") {
          left = {
            type: "Fraction",
            numerator: toFractionDeep(left),
            denominator: toFractionDeep(right)
          };
        } else {
          left = {
            type: "BinaryExpression",
            operator,
            left: toFractionDeep(left),
            right: toFractionDeep(right)
          };
        }
      } else if (this.isImplicitMultiplication()) {
        const right = this.parseUnary();
        left = {
          type: "BinaryExpression",
          operator: "*",
          left: toFractionDeep(left),
          right: toFractionDeep(right)
        };
      } else {
        break;
      }
    }
    return toFractionDeep(left);
  }
  /**
   * Check if current position indicates implicit multiplication
   */
  isImplicitMultiplication() {
    const currentType = this.currentToken.type;
    return currentType === "IDENTIFIER" || currentType === "NUMBER" || currentType === "LPAREN" || currentType === "COMMAND";
  }
  /**
   * Check if a command is a function
   */
  isFunction(command) {
    return RESERVED_FUNCTIONS.has(command);
  }
  /**
   * Parse equality and comparison operators (lowest precedence)
   */
  parseEquality() {
    let left = this.parseAddition();
    while (this.expectToken("OPERATOR") && (this.currentToken.value === "=" || this.currentToken.value === ">" || this.currentToken.value === "<" || this.currentToken.value === ">=" || this.currentToken.value === "<=")) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseAddition();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right
      };
    }
    return left;
  }
  /**
   * Parse addition and subtraction
   */
  parseAddition() {
    let left = this.parseTerm();
    while (this.expectToken("OPERATOR") && (this.currentToken.value === "+" || this.currentToken.value === "-")) {
      let toFraction = function(node) {
        if (node.type === "BinaryExpression" && node.operator === "/") {
          return {
            type: "Fraction",
            numerator: node.left,
            denominator: node.right
          };
        }
        return node;
      };
      __name(toFraction, "toFraction");
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseTerm();
      left = {
        type: "BinaryExpression",
        operator,
        left: toFraction(left),
        right: toFraction(right)
      };
    }
    function toFractionDeep(node) {
      if (node.type === "BinaryExpression" && node.operator === "/") {
        return {
          type: "Fraction",
          numerator: toFractionDeep(node.left),
          denominator: toFractionDeep(node.right)
        };
      }
      if (node.type === "BinaryExpression") {
        return {
          ...node,
          left: toFractionDeep(node.left),
          right: toFractionDeep(node.right)
        };
      }
      return node;
    }
    __name(toFractionDeep, "toFractionDeep");
    return toFractionDeep(left);
  }
  /**
   * Parse the complete expression (top level)
   */
  parseExpression() {
    return this.parseEquality();
  }
  /**
   * Parse the complete expression
   */
  parse() {
    const ast = this.parseExpression();
    if (!this.expectToken("EOF")) {
      throw new Error(`Unexpected token at end of input: ${this.currentToken.value} at position ${this.currentToken.position}`);
    }
    return ast;
  }
};
__name(_LaTeXParser, "LaTeXParser");
var LaTeXParser = _LaTeXParser;
function parseLatex(input) {
  try {
    let toFractionDeep = function(node) {
      if (!node || typeof node !== "object")
        return node;
      if (node.type === "BinaryExpression" && node.operator === "/") {
        return {
          type: "Fraction",
          numerator: toFractionDeep(node.left),
          denominator: toFractionDeep(node.right)
        };
      }
      const newNode = { ...node };
      for (const key of Object.keys(newNode)) {
        const value = newNode[key];
        if (Array.isArray(value)) {
          newNode[key] = value.map((item) => toFractionDeep(item));
        } else if (typeof value === "object" && value !== null) {
          newNode[key] = toFractionDeep(value);
        }
      }
      return newNode;
    };
    __name(toFractionDeep, "toFractionDeep");
    const tokenizer = new LaTeXTokenizer(input);
    const tokens = tokenizer.tokenize();
    const errorToken = tokens.find((token) => token.type === "ERROR");
    if (errorToken) {
      return {
        ast: null,
        error: `Invalid character: ${errorToken.value} at position ${errorToken.position}`
      };
    }
    const parser = new LaTeXParser(tokens);
    const rawAST = parser.parse();
    const resolvedAST = resolveScopeInAST(rawAST);
    return {
      ast: toFractionDeep(resolvedAST),
      error: null
    };
  } catch (error) {
    return {
      ast: null,
      error: error instanceof Error ? error.message : "Unknown parsing error"
    };
  }
}
__name(parseLatex, "parseLatex");
function stepsAstToLatex(node, leftAppendCharacter, rightAppendCharacter) {
  return config.IS_STEPS_INCLUDE_LATEX ? config.LATEX_BRACKET.LEFT + (leftAppendCharacter || "") + astToLatex(node) + "" + config.LATEX_BRACKET.RIGHT : "";
}
__name(stepsAstToLatex, "stepsAstToLatex");
function bracketAppend(string) {
  return (config.LATEX_BRACKET.LEFT || "") + string + (config.LATEX_BRACKET.RIGHT || "");
}
__name(bracketAppend, "bracketAppend");
function astToLatex(node) {
  switch (node.type) {
    case "NumberLiteral":
      return node.value.toString();
    case "Identifier":
      switch (node.name) {
        case "\u03C0":
          return "\\pi";
        case "e":
          return "e";
        // e is typically not escaped in LaTeX
        case "i":
          return "i";
        // imaginary unit
        default:
          return node.name;
      }
    case "BinaryExpression":
      return binaryExpressionToLatex(node);
    case "UnaryExpression":
      return unaryExpressionToLatex(node);
    case "FunctionCall":
      return functionCallToLatex(node);
    case "Fraction":
      return `\\frac{${astToLatex(node.numerator)}}{${astToLatex(node.denominator)}}`;
    case "Integral":
      return integralToLatex(node);
    case "Sum":
      return `\\sum_{${node.variable}=${astToLatex(node.lowerBound)}}^{${astToLatex(node.upperBound)}} ${astToLatex(node.expression)}`;
    case "Product":
      return `\\prod_{${node.variable}=${astToLatex(node.lowerBound)}}^{${astToLatex(node.upperBound)}} ${astToLatex(node.expression)}`;
    case "Factorial":
      return `\\factorial{${astToLatex(node.argument)}}`;
    default:
      throw new Error(`Unsupported AST node type: ${node.type}`);
  }
}
__name(astToLatex, "astToLatex");
function simplifyVariableMultiplication(node) {
  if (node.operator !== "*")
    return null;
  const variableCounts = /* @__PURE__ */ new Map();
  function countVariables(expr) {
    if (expr.type === "Identifier") {
      const count = variableCounts.get(expr.name) || 0;
      variableCounts.set(expr.name, count + 1);
    } else if (expr.type === "BinaryExpression" && expr.operator === "*") {
      countVariables(expr.left);
      countVariables(expr.right);
    }
  }
  __name(countVariables, "countVariables");
  countVariables(node);
  const parts = [];
  for (const [variable, count] of variableCounts) {
    if (count === 1) {
      parts.push(variable);
    } else {
      parts.push(`${variable}^{${count}}`);
    }
  }
  if (Array.from(variableCounts.values()).some((count) => count > 1)) {
    return parts.join("");
  }
  return null;
}
__name(simplifyVariableMultiplication, "simplifyVariableMultiplication");
function binaryExpressionToLatex(node) {
  const left = astToLatex(node.left);
  const right = astToLatex(node.right);
  switch (node.operator) {
    case "+":
      return `${left} + ${right}`;
    case "-":
      return `${left} - ${right}`;
    case "*": {
      let flattenMul = function(node2) {
        if (node2.type === "BinaryExpression" && node2.operator === "*") {
          return [...flattenMul(node2.left), ...flattenMul(node2.right)];
        }
        return [node2];
      };
      __name(flattenMul, "flattenMul");
      const factors = flattenMul(node);
      if (factors.length > 1 && factors.every((f) => f.type === "BinaryExpression" && f.operator === "^" && f.right.type === "NumberLiteral")) {
        const firstExp = factors[0].right;
        const allSameExp = factors.every((f) => f.right.value === firstExp.value);
        if (allSameExp) {
          const baseProduct = factors.slice(1).reduce((acc, f) => ({
            type: "BinaryExpression",
            operator: "*",
            left: acc,
            right: f.left
          }), factors[0].left);
          let baseLatex = astToLatex(baseProduct);
          baseLatex = `(${baseLatex})`;
          return `${baseLatex}^{${firstExp.value}}`;
        }
      }
      if (node.left.type === "NumberLiteral") {
        if (node.right.type === "Identifier" && (node.right.name === "\u03C0" || node.right.name === "pi" || node.right.name === "e")) {
          return `${left}${node.right.name === "pi" ? "\\pi" : node.right.name}`;
        }
        if (node.right.type === "Identifier") {
          return `${left}${right}`;
        }
        if (node.right.type === "BinaryExpression" && (node.right.operator === "+" || node.right.operator === "-")) {
          return `${left}(${right})`;
        }
        if (node.right.type === "BinaryExpression" && node.right.operator === "*" && node.right.left.type === "Identifier" && node.right.right.type === "Identifier") {
          return `${left}${right}`;
        }
        if (node.right.type === "BinaryExpression" && node.right.operator === "*") {
          const isAllVariables = /* @__PURE__ */ __name((expr) => {
            if (expr.type === "Identifier")
              return true;
            if (expr.type === "BinaryExpression" && expr.operator === "*") {
              return isAllVariables(expr.left) && isAllVariables(expr.right);
            }
            return false;
          }, "isAllVariables");
          if (isAllVariables(node.right)) {
            return `${left}${right}`;
          }
        }
        return `${left}${right}`;
      }
      if (node.right.type === "NumberLiteral" && node.left.type === "Identifier") {
        if (node.left.name === "\u03C0" || node.left.name === "pi" || node.left.name === "e") {
          return `${right}${node.left.name === "pi" ? "\\pi" : node.left.name}`;
        }
        return `${right}${left}`;
      }
      const simplifiedMultiplication = simplifyVariableMultiplication(node);
      if (simplifiedMultiplication !== null) {
        return simplifiedMultiplication;
      }
      const leftNeedsParens = node.left.type === "BinaryExpression" && (node.left.operator === "+" || node.left.operator === "-");
      const rightNeedsParens = node.right.type === "BinaryExpression" && (node.right.operator === "+" || node.right.operator === "-");
      if (leftNeedsParens && rightNeedsParens) {
        return `(${left})(${right})`;
      } else if (leftNeedsParens) {
        return `(${left})${right}`;
      } else if (rightNeedsParens) {
        return `${left}(${right})`;
      }
      return `${left}${right}`;
    }
    case "/":
      return `\\frac{${left}}{${right}}`;
    case "^": {
      let baseStr = left;
      if (node.left.type === "BinaryExpression" && (node.left.operator === "+" || node.left.operator === "-" || node.left.operator === "*" || node.left.operator === "/")) {
        baseStr = `(${left})`;
      }
      if (node.right.type === "NumberLiteral" && Number.isInteger(node.right.value) && node.right.value >= 0 && node.right.value <= 9) {
        return `${baseStr}^{${right}}`;
      }
      return `${baseStr}^{${right}}`;
    }
    case "=":
      return `${left} = ${right}`;
    case ">":
      return `${left} > ${right}`;
    case "<":
      return `${left} < ${right}`;
    case ">=":
      return `${left} \\geq ${right}`;
    case "<=":
      return `${left} \\leq ${right}`;
    default:
      throw new Error(`Unsupported binary operator: ${node.operator}`);
  }
}
__name(binaryExpressionToLatex, "binaryExpressionToLatex");
function unaryExpressionToLatex(node) {
  const operand = astToLatex(node.operand);
  if (node.operator === "-") {
    if (node.operand.type === "BinaryExpression" && node.operand.operator === "*") {
      const leftIsNumber = node.operand.left.type === "NumberLiteral";
      const rightIsVariable = node.operand.right.type === "Identifier";
      const leftIsVariable = node.operand.left.type === "Identifier";
      const rightIsNumber = node.operand.right.type === "NumberLiteral";
      if (leftIsNumber && rightIsVariable || leftIsVariable && rightIsVariable || leftIsVariable && rightIsNumber) {
        return `-${operand}`;
      }
    }
    return `-${operand}`;
  }
  return `+${operand}`;
}
__name(unaryExpressionToLatex, "unaryExpressionToLatex");
function functionCallToLatex(node) {
  const args = node.args.map((arg) => astToLatex(arg)).join(", ");
  switch (node.name) {
    case "sin":
    case "cos":
    case "tan":
    case "asin":
    case "acos":
    case "atan":
    case "sinh":
    case "cosh":
    case "tanh":
      return `\\${node.name}(${args})`;
    case "log":
      return `\\log(${args})`;
    case "ln":
      return `\\ln(${args})`;
    case "exp":
      return `\\exp(${args})`;
    case "sqrt":
      return `\\sqrt{${args}}`;
    default:
      return `${node.name}(${args})`;
  }
}
__name(functionCallToLatex, "functionCallToLatex");
function integralToLatex(node) {
  if (node.lowerBound && node.upperBound) {
    return `\\int_{${astToLatex(node.lowerBound)}}^{${astToLatex(node.upperBound)}} ${astToLatex(node.integrand)} \\, d${node.variable}`;
  } else {
    return `\\int ${astToLatex(node.integrand)} \\, d${node.variable}`;
  }
}
__name(integralToLatex, "integralToLatex");
var _FactorizationEngine = class _FactorizationEngine {
  constructor() {
    this.strategies = [];
    this.initializeStrategies();
  }
  /**
   * Register a factorization strategy
   */
  registerStrategy(strategy) {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => b.priority - a.priority);
  }
  /**
   * Factor an expression using all available strategies
   */
  factor(node, variable = "x", preferences = {}) {
    const context = {
      variable,
      maxIterations: 10,
      currentIteration: 0,
      steps: [],
      preferences: {
        preferCompleteFactorization: true,
        allowIrrationalFactors: false,
        allowComplexFactors: false,
        simplifyCoefficients: true,
        extractCommonFactors: true,
        ...preferences
      }
    };
    context.steps.push(`Starting factorization of: ${stepsAstToLatex(node)}`);
    let currentNode;
    try {
      currentNode = this.deepClone(node);
    } catch (cloneError) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: [
          `Error during factorization: ${cloneError instanceof Error ? cloneError.message : "Unknown clone error"}`
        ],
        strategyUsed: "Error",
        canContinue: false
      };
    }
    let hasChanged = false;
    [...context.steps];
    let shouldContinue = true;
    while (context.currentIteration < context.maxIterations && shouldContinue) {
      context.currentIteration++;
      let iterationChanged = false;
      for (const strategy of this.strategies) {
        if (strategy.canApply(currentNode, context)) {
          context.steps.push(`Attempting ${strategy.name}...`);
          const result = strategy.apply(currentNode, context);
          if (result.success && result.changed) {
            currentNode = result.ast;
            hasChanged = true;
            iterationChanged = true;
            if (Array.isArray(result.steps)) {
              context.steps.push(...result.steps);
            }
            try {
              const latexStr = astToLatex(currentNode);
              context.steps.push(`\u2713 Applied ${strategy.name}: ${latexStr}`);
            } catch (latexError) {
              context.steps.push(`\u2713 Applied ${strategy.name}: [LaTeX conversion failed]`);
              throw new Error(`LaTeX conversion failed after ${strategy.name}: ${latexError instanceof Error ? latexError.message : "Unknown error"}`);
            }
            context.steps.push(`Strategy ${strategy.name} requested to stop further factorization. (canContinue=false)`);
            shouldContinue = result.canContinue;
            break;
          } else if (!result.success) {
            context.steps.push(`\u2717 ${strategy.name} failed: ${stepsAstToLatex(result.ast)}`, result.steps);
          }
        }
      }
      if (!iterationChanged) {
        context.steps.push("No further factorization possible");
        break;
      }
      if (!shouldContinue) {
        context.steps.push("Factorization complete");
        break;
      }
    }
    if (context.currentIteration >= context.maxIterations) {
      context.steps.push("Maximum iterations reached");
    }
    if (!shouldContinue) {
      context.steps.push("Factorization halted by strategy request");
      return {
        success: true,
        ast: currentNode,
        changed: hasChanged,
        steps: context.steps,
        strategyUsed: hasChanged ? "Multiple strategies" : "No change",
        canContinue: false
      };
    }
    context.steps.push("Attempting recursive factorization of subexpressions...");
    currentNode = this.recursivelyFactorSubexpressions(currentNode, context);
    context.steps.push(stepsAstToLatex(currentNode));
    return {
      success: true,
      ast: currentNode,
      changed: hasChanged,
      steps: context.steps,
      strategyUsed: hasChanged ? "Multiple strategies" : "No change",
      canContinue: false
    };
  }
  /**
   * Recursively factor subexpressions in the result
   */
  recursivelyFactorSubexpressions(node, context) {
    if (this.isMonomial(node)) {
      return node;
    }
    if (node.type === "BinaryExpression") {
      const left = this.recursivelyFactorSubexpressions(node.left, context);
      const right = this.recursivelyFactorSubexpressions(node.right, context);
      let newNode = { ...node, left, right };
      if (node.operator === "*" || node.operator === "+" && config.FACTORIZATION.applyFactorPlusOperate) {
        const leftFactored = this.factor(left, context.variable, context.preferences);
        const rightFactored = this.factor(right, context.variable, context.preferences);
        newNode = { ...node, left: leftFactored.ast, right: rightFactored.ast };
        if (!this.isMonomial(leftFactored.ast)) {
          context.steps.push("leftFactored", leftFactored.steps, `[recursive-factor] factored left: ${stepsAstToLatex(leftFactored.ast)}`);
        }
        if (!this.isMonomial(rightFactored.ast)) {
          context.steps.push("rightFactored", rightFactored.steps, `[recursive-factor] factored right: ${stepsAstToLatex(rightFactored.ast)}`);
        }
      }
      return newNode;
    } else if (node.type === "UnaryExpression") {
      context.steps.push(`Recursively factoring unary expression: ${stepsAstToLatex(node)}`);
      const operand = this.recursivelyFactorSubexpressions(node.operand, context);
      return { ...node, operand };
    } else if (node.type === "FunctionCall") {
      const args = node.args.map((arg) => this.recursivelyFactorSubexpressions(arg, context));
      return { ...node, args };
    }
    return node;
  }
  /**
   * Check if the node is a monomial (single term, e.g. c*x^n, x, 3, -x^2, etc.)
   */
  isMonomial(node) {
    if (node.type === "NumberLiteral" || node.type === "Identifier")
      return true;
    if (node.type === "UnaryExpression" && node.operator === "-") {
      return this.isMonomial(node.operand);
    }
    if (node.type === "BinaryExpression") {
      if (node.operator === "*") {
        return this.isMonomial(node.left) && this.isMonomial(node.right);
      }
      if (node.operator === "^") {
        return this.isMonomial(node.left) && this.isMonomial(node.right);
      }
    }
    return false;
  }
  /**
   * Combine factored left and right sides of multiplication
   * Handles cases where either side might be a product of multiple factors
   */
  combineFactoredMultiplication(left, right, context) {
    const leftFactors = this.extractMultiplicationFactors(left);
    const rightFactors = this.extractMultiplicationFactors(right);
    const allFactors = [...leftFactors, ...rightFactors];
    if (allFactors.length <= 1) {
      return allFactors[0] || { type: "NumberLiteral", value: 1 };
    }
    let result = allFactors[0];
    for (let i = 1; i < allFactors.length; i++) {
      result = {
        type: "BinaryExpression",
        operator: "*",
        left: result,
        right: allFactors[i]
      };
    }
    return result;
  }
  /**
   * Extract all factors from a multiplication expression
   * Returns an array of individual factors
   */
  extractMultiplicationFactors(node) {
    if (node.type === "BinaryExpression" && node.operator === "*") {
      return [
        ...this.extractMultiplicationFactors(node.left),
        ...this.extractMultiplicationFactors(node.right)
      ];
    }
    return [node];
  }
  /**
   * Initialize all available strategies
   */
  initializeStrategies() {
  }
  /**
   * Deep clone an AST node
   */
  deepClone(node) {
    switch (node.type) {
      case "NumberLiteral":
        return { ...node };
      case "Identifier":
        return { ...node };
      case "BinaryExpression":
        return {
          ...node,
          left: this.deepClone(node.left),
          right: this.deepClone(node.right)
        };
      case "UnaryExpression":
        return {
          ...node,
          operand: this.deepClone(node.operand)
        };
      case "FunctionCall":
        return {
          ...node,
          args: node.args.map((arg) => this.deepClone(arg))
        };
      case "Fraction":
        return {
          ...node,
          numerator: this.deepClone(node.numerator),
          denominator: this.deepClone(node.denominator)
        };
      case "Integral":
        return {
          ...node,
          integrand: this.deepClone(node.integrand),
          ...node.lowerBound && { lowerBound: this.deepClone(node.lowerBound) },
          ...node.upperBound && { upperBound: this.deepClone(node.upperBound) }
        };
      case "Sum":
        return {
          ...node,
          expression: this.deepClone(node.expression),
          lowerBound: this.deepClone(node.lowerBound),
          upperBound: this.deepClone(node.upperBound)
        };
      case "Product":
        return {
          ...node,
          expression: this.deepClone(node.expression),
          lowerBound: this.deepClone(node.lowerBound),
          upperBound: this.deepClone(node.upperBound)
        };
      default: {
        const nodeType = node.type;
        throw new Error(`Unsupported AST node type for cloning: ${nodeType || "undefined"} - Full node: ${JSON.stringify(node, null, 2)}`);
      }
    }
  }
};
__name(_FactorizationEngine, "FactorizationEngine");
var FactorizationEngine = _FactorizationEngine;
var _PolynomialAnalyzer = class _PolynomialAnalyzer {
  /**
   * Extract terms from an addition/subtraction expression
   * Returns array of {coefficient: number, variables: Map<string, number>, sign: 1|-1}
   */
  static extractTerms(node) {
    const terms = [];
    this.collectTerms(node, terms, 1);
    return terms;
  }
  /**
   * Recursively collect terms from expression
   */
  static collectTerms(node, terms, sign) {
    if (node.type === "BinaryExpression" && (node.operator === "+" || node.operator === "-")) {
      this.collectTerms(node.left, terms, sign);
      this.collectTerms(node.right, terms, node.operator === "+" ? sign : -sign);
    } else {
      const term = this.analyzeTerm(node, sign);
      terms.push({ ...term, originalNode: node });
    }
  }
  /**
   * Analyze a single term to extract coefficient and variables
   */
  static analyzeTerm(node, sign) {
    const variables = /* @__PURE__ */ new Map();
    const result = this.extractTermComponents(node, variables);
    return {
      coefficient: result.coefficient,
      variables,
      sign
    };
  }
  /**
   * Extract coefficient and variables from a term
   */
  static extractTermComponents(node, variables) {
    switch (node.type) {
      case "NumberLiteral":
        return { coefficient: node.value };
      case "Identifier":
        variables.set(node.name, (variables.get(node.name) || 0) + 1);
        return { coefficient: 1 };
      case "BinaryExpression":
        return this.handleTermBinaryExpression(node, variables);
      case "UnaryExpression":
        if (node.operator === "-") {
          const result = this.extractTermComponents(node.operand, variables);
          return { coefficient: -result.coefficient };
        }
        return { coefficient: 1 };
      default:
        return { coefficient: 1 };
    }
  }
  /**
   * Handle binary expressions within a term
   */
  static handleTermBinaryExpression(node, variables) {
    switch (node.operator) {
      case "*": {
        const leftResult = this.extractTermComponents(node.left, variables);
        const rightResult = this.extractTermComponents(node.right, variables);
        return { coefficient: leftResult.coefficient * rightResult.coefficient };
      }
      case "^": {
        if (node.left.type === "Identifier" && node.right.type === "NumberLiteral") {
          const varName = node.left.name;
          const power = node.right.value;
          variables.set(varName, (variables.get(varName) || 0) + power);
          return { coefficient: 1 };
        }
        return { coefficient: 1 };
      }
      case "/": {
        const numerResult = this.extractTermComponents(node.left, variables);
        const denomResult = this.extractTermComponents(node.right, /* @__PURE__ */ new Map());
        return { coefficient: numerResult.coefficient / denomResult.coefficient };
      }
      default:
        return { coefficient: 1 };
    }
  }
  /**
   * Find the greatest common divisor of coefficients
   */
  static findGCD(numbers) {
    if (numbers.length === 0)
      return 1;
    if (numbers.length === 1)
      return Math.abs(numbers[0] || 0);
    let result = Math.abs(numbers[0] || 0);
    for (let i = 1; i < numbers.length; i++) {
      result = this.gcd(result, Math.abs(numbers[i] || 0));
      if (result === 1)
        break;
    }
    return result;
  }
  /**
   * Calculate GCD of two numbers
   */
  static gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  /**
   * Find common variable factors among terms
   */
  static findCommonVariableFactors(terms) {
    if (terms.length === 0)
      return /* @__PURE__ */ new Map();
    const commonFactors = /* @__PURE__ */ new Map();
    const firstTerm = terms[0];
    if (!firstTerm)
      return /* @__PURE__ */ new Map();
    for (const [variable, power] of firstTerm.variables) {
      let minPower = power;
      let existsInAll = true;
      for (let i = 1; i < terms.length; i++) {
        const term = terms[i];
        if (!term) {
          existsInAll = false;
          break;
        }
        const termPower = term.variables.get(variable) || 0;
        if (termPower === 0) {
          existsInAll = false;
          break;
        }
        minPower = Math.min(minPower, termPower);
      }
      if (existsInAll && minPower > 0) {
        commonFactors.set(variable, minPower);
      }
    }
    return commonFactors;
  }
  /**
   * Convert AST to polynomial representation (legacy compatibility)
   */
  static analyzePolynomial(node, variable) {
    const terms = this.extractTerms(node);
    if (terms.length === 0)
      return null;
    const coefficients = /* @__PURE__ */ new Map();
    const variables = /* @__PURE__ */ new Set();
    for (const term of terms) {
      for (const [varName, power] of term.variables) {
        variables.add(varName);
        if (varName === variable) {
          const coeff = term.coefficient * term.sign;
          coefficients.set(power, (coefficients.get(power) || 0) + coeff);
        }
      }
      if (term.variables.size === 0) {
        const coeff = term.coefficient * term.sign;
        coefficients.set(0, (coefficients.get(0) || 0) + coeff);
      }
    }
    if (coefficients.size === 0)
      return null;
    const degree = Math.max(...Array.from(coefficients.keys()));
    const leadingCoeff = coefficients.get(degree) || 0;
    const constantTerm = coefficients.get(0) || 0;
    const isUnivariate = variables.size <= 1;
    return {
      degree,
      coefficients,
      leadingCoeff,
      constantTerm,
      isUnivariate,
      variables
    };
  }
  /**
   * Evaluate polynomial at given value
   */
  static evaluatePolynomial(poly, value) {
    let result = 0;
    for (const [power, coeff] of poly.coefficients) {
      result += coeff * Math.pow(value, power);
    }
    return result;
  }
  /**
   * Find rational roots using rational root theorem
   */
  static findRationalRoots(poly) {
    if (poly.degree === 0)
      return [];
    const constantTerm = poly.constantTerm;
    const leadingCoeff = poly.leadingCoeff;
    if (constantTerm === 0) {
      return [0];
    }
    const pFactors = this.getFactors(Math.abs(constantTerm));
    const qFactors = this.getFactors(Math.abs(leadingCoeff));
    const possibleRoots = [];
    for (const p of pFactors) {
      for (const q of qFactors) {
        possibleRoots.push(p / q, -p / q);
      }
    }
    const uniqueRoots = [...new Set(possibleRoots)];
    const actualRoots = [];
    for (const root of uniqueRoots) {
      if (Math.abs(this.evaluatePolynomial(poly, root)) < 1e-10) {
        actualRoots.push(root);
      }
    }
    return actualRoots.sort((a, b) => a - b);
  }
  /**
   * Get factors of a number
   */
  static getFactors(n) {
    const factors = [];
    const absN = Math.abs(n);
    for (let i = 1; i <= Math.sqrt(absN); i++) {
      if (absN % i === 0) {
        factors.push(i);
        if (i !== absN / i) {
          factors.push(absN / i);
        }
      }
    }
    return factors.sort((a, b) => a - b);
  }
};
__name(_PolynomialAnalyzer, "PolynomialAnalyzer");
var PolynomialAnalyzer = _PolynomialAnalyzer;
var _ASTBuilder = class _ASTBuilder {
  /**
   * Create a number literal node
   */
  static number(value) {
    return { type: "NumberLiteral", value };
  }
  /**
   * Create an identifier node
   */
  static variable(name) {
    return {
      type: "Identifier",
      name,
      scope: "free",
      uniqueId: `free_${name}`
    };
  }
  /**
   * Create a binary expression node
   */
  static binary(operator, left, right) {
    return { type: "BinaryExpression", operator, left, right };
  }
  /**
   * Create a multiplication node
   */
  static multiply(left, right) {
    return this.binary("*", left, right);
  }
  /**
   * Create an addition node
   */
  static add(left, right) {
    return this.binary("+", left, right);
  }
  /**
   * Create a subtraction node
   */
  static subtract(left, right) {
    return this.binary("-", left, right);
  }
  /**
   * Create a power node
   */
  static power(base, exponent) {
    return this.binary("^", base, exponent);
  }
  /**
   * Create a linear factor (x - root)
   */
  static linearFactor(variable, root) {
    if (root === 0) {
      return this.variable(variable);
    }
    if (root > 0) {
      return this.subtract(this.variable(variable), this.number(root));
    } else {
      return this.add(this.variable(variable), this.number(-root));
    }
  }
  /**
   * Build a polynomial from coefficients
   */
  static buildPolynomial(coefficients, variable) {
    const terms = [];
    const powers = Array.from(coefficients.keys()).sort((a, b) => b - a);
    for (const power of powers) {
      const coeff = coefficients.get(power);
      if (Math.abs(coeff) < 1e-12)
        continue;
      let term;
      if (power === 0) {
        term = this.number(coeff);
      } else if (power === 1) {
        term = coeff === 1 ? this.variable(variable) : this.multiply(this.number(coeff), this.variable(variable));
      } else {
        const varPower = this.power(this.variable(variable), this.number(power));
        term = coeff === 1 ? varPower : this.multiply(this.number(coeff), varPower);
      }
      terms.push(term);
    }
    if (terms.length === 0) {
      return this.number(0);
    }
    if (terms.length === 1) {
      return terms[0];
    }
    let result = terms[0];
    for (let i = 1; i < terms.length; i++) {
      result = this.add(result, terms[i]);
    }
    return result;
  }
};
__name(_ASTBuilder, "ASTBuilder");
var ASTBuilder = _ASTBuilder;
function basicSimplify(node) {
  if (!node)
    return node;
  switch (node.type) {
    case "NumberLiteral":
    case "Identifier":
      return node;
    case "UnaryExpression":
      return simplifyUnaryBasic(node);
    case "BinaryExpression":
      return simplifyBinaryBasic(node);
    case "Fraction":
      return simplifyFractionBasic(node);
    case "Factorial":
      return simplifyFactorialBasic(node);
    default:
      return node;
  }
}
__name(basicSimplify, "basicSimplify");
function simplifyFactorialBasic(node) {
  const arg = basicSimplify(node.argument);
  if (arg.type === "NumberLiteral" && Number.isInteger(arg.value) && arg.value >= 0) {
    return { type: "NumberLiteral", value: factorial(arg.value) };
  }
  if (arg.type === "Identifier" || arg.type === "BinaryExpression" && (arg.operator === "+" || arg.operator === "-")) {
    return {
      type: "Product",
      expression: { type: "Identifier", name: "k" },
      variable: "k",
      lowerBound: { type: "NumberLiteral", value: 1 },
      upperBound: arg
    };
  }
  return { type: "Factorial", argument: arg };
}
__name(simplifyFactorialBasic, "simplifyFactorialBasic");
function factorial(n) {
  let res = 1;
  for (let i = 2; i <= n; ++i)
    res *= i;
  return res;
}
__name(factorial, "factorial");
function simplifyUnaryBasic(node) {
  const operand = basicSimplify(node.operand);
  if (node.operator === "-" && operand.type === "UnaryExpression" && operand.operator === "-") {
    return operand.operand;
  }
  if (node.operator === "-" && operand.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: -operand.value };
  }
  if (node.operator === "+") {
    return operand;
  }
  return { ...node, operand };
}
__name(simplifyUnaryBasic, "simplifyUnaryBasic");
function simplifyBinaryBasic(node) {
  const left = basicSimplify(node.left);
  const right = basicSimplify(node.right);
  switch (node.operator) {
    case "+":
      return simplifyAdditionBasic(left, right);
    case "-":
      return simplifySubtractionBasic(left, right);
    case "*":
      return simplifyMultiplicationBasic(left, right);
    case "/":
      return simplifyDivisionBasic(left, right);
    case "^":
      return simplifyPowerBasic(left, right);
    default:
      return { ...node, left, right };
  }
}
__name(simplifyBinaryBasic, "simplifyBinaryBasic");
function simplifyAdditionBasic(left, right) {
  if (right.type === "NumberLiteral" && right.value === 0)
    return left;
  if (left.type === "NumberLiteral" && left.value === 0)
    return right;
  if (right.type === "UnaryExpression" && right.operator === "-") {
    return simplifySubtractionBasic(left, right.operand);
  }
  if (right.type === "NumberLiteral" && right.value < 0) {
    return {
      type: "BinaryExpression",
      operator: "-",
      left,
      right: { type: "NumberLiteral", value: -right.value }
    };
  }
  if (right.type === "BinaryExpression") {
    if (right.operator === "+" && right.left.type === "UnaryExpression" && right.left.operator === "-" && JSON.stringify(right.left.operand) === JSON.stringify(left) && right.right.type === "NumberLiteral") {
      return right.right;
    }
    if (right.operator === "-" && JSON.stringify(right.right) === JSON.stringify(left) && right.left.type === "NumberLiteral") {
      return right.left;
    }
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value + right.value };
  }
  return { type: "BinaryExpression", operator: "+", left, right };
}
__name(simplifyAdditionBasic, "simplifyAdditionBasic");
function simplifySubtractionBasic(left, right) {
  if (right.type === "NumberLiteral" && right.value === 0)
    return left;
  if (left.type === "NumberLiteral" && left.value === 0) {
    return { type: "UnaryExpression", operator: "-", operand: right };
  }
  if (right.type === "UnaryExpression" && right.operator === "-") {
    return simplifyAdditionBasic(left, right.operand);
  }
  if (right.type === "NumberLiteral" && right.value < 0) {
    return simplifyAdditionBasic(left, { type: "NumberLiteral", value: -right.value });
  }
  if (right.type === "BinaryExpression" && right.operator === "+") {
    const step1 = simplifySubtractionBasic(left, right.left);
    return simplifySubtractionBasic(step1, right.right);
  }
  if (right.type === "BinaryExpression" && right.operator === "-") {
    const step1 = simplifySubtractionBasic(left, right.left);
    return simplifyAdditionBasic(step1, right.right);
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value - right.value };
  }
  return { type: "BinaryExpression", operator: "-", left, right };
}
__name(simplifySubtractionBasic, "simplifySubtractionBasic");
function simplifyMultiplicationBasic(left, right) {
  if (left.type === "NumberLiteral" && left.value === 0 || right.type === "NumberLiteral" && right.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (left.type === "NumberLiteral" && left.value === 1)
    return right;
  if (right.type === "NumberLiteral" && right.value === 1)
    return left;
  if (right.type === "UnaryExpression" && right.operator === "-") {
    const positiveResult = simplifyMultiplicationBasic(left, right.operand);
    return { type: "UnaryExpression", operator: "-", operand: positiveResult };
  }
  if (left.type === "UnaryExpression" && left.operator === "-") {
    const positiveResult = simplifyMultiplicationBasic(left.operand, right);
    return { type: "UnaryExpression", operator: "-", operand: positiveResult };
  }
  if (left.type === "UnaryExpression" && left.operator === "-" && right.type === "UnaryExpression" && right.operator === "-") {
    return simplifyMultiplicationBasic(left.operand, right.operand);
  }
  if (left.type === "NumberLiteral" && left.value < 0) {
    return {
      type: "UnaryExpression",
      operator: "-",
      operand: simplifyMultiplicationBasic({ type: "NumberLiteral", value: -left.value }, right)
    };
  }
  if (right.type === "NumberLiteral" && right.value < 0) {
    return {
      type: "UnaryExpression",
      operator: "-",
      operand: simplifyMultiplicationBasic(left, { type: "NumberLiteral", value: -right.value })
    };
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value * right.value };
  }
  if (left.type === "NumberLiteral" && right.type === "Fraction") {
    const numerator = simplifyMultiplicationBasic(left, right.numerator);
    return simplifyFractionBasic({ numerator, denominator: right.denominator });
  }
  if (left.type === "Fraction" && right.type === "NumberLiteral") {
    const numerator = simplifyMultiplicationBasic(left.numerator, right);
    return simplifyFractionBasic({ numerator, denominator: left.denominator });
  }
  return { type: "BinaryExpression", operator: "*", left, right };
}
__name(simplifyMultiplicationBasic, "simplifyMultiplicationBasic");
function simplifyDivisionBasic(left, right) {
  if (right.type === "NumberLiteral" && right.value === 1)
    return left;
  if (left.type === "NumberLiteral" && left.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral" && right.value !== 0) {
    const result = left.value / right.value;
    if (Number.isInteger(result)) {
      return { type: "NumberLiteral", value: result };
    }
    const reduced = reduceFraction$1(left.value, right.value);
    return {
      type: "Fraction",
      numerator: { type: "NumberLiteral", value: reduced.num },
      denominator: { type: "NumberLiteral", value: reduced.den }
    };
  }
  return { type: "Fraction", numerator: left, denominator: right };
}
__name(simplifyDivisionBasic, "simplifyDivisionBasic");
function simplifyPowerBasic(base, exponent) {
  if (exponent.type === "NumberLiteral" && exponent.value === 0) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (exponent.type === "NumberLiteral" && exponent.value === 1) {
    return base;
  }
  if (base.type === "NumberLiteral" && exponent.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: Math.pow(base.value, exponent.value) };
  }
  return { type: "BinaryExpression", operator: "^", left: base, right: exponent };
}
__name(simplifyPowerBasic, "simplifyPowerBasic");
function simplifyFractionBasic(node) {
  const numerator = basicSimplify(node.numerator);
  const denominator = basicSimplify(node.denominator);
  if (numerator.type === "Factorial" && denominator.type === "Factorial") {
    const n = numerator.argument;
    const k = denominator.argument;
    if (JSON.stringify(n) === JSON.stringify(k)) {
      return { type: "NumberLiteral", value: 1 };
    }
    if (n.type === "NumberLiteral" && k.type === "NumberLiteral") {
      if (n.value > k.value) {
        let prod = null;
        for (let i = n.value; i > k.value; --i) {
          const term = { type: "NumberLiteral", value: i };
          prod = prod ? { type: "BinaryExpression", operator: "*", left: prod, right: term } : term;
        }
        return prod ? prod : { type: "NumberLiteral", value: 1 };
      } else if (n.value < k.value) {
        let prod = null;
        for (let i = k.value; i > n.value; --i) {
          const term = { type: "NumberLiteral", value: i };
          prod = prod ? { type: "BinaryExpression", operator: "*", left: prod, right: term } : term;
        }
        return {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: prod ? prod : { type: "NumberLiteral", value: 1 }
        };
      } else {
        return { type: "NumberLiteral", value: 1 };
      }
    }
    return simplifyGeneralFactorialFraction(n, k);
  }
  function simplifyGeneralFactorialFraction(n, k) {
    if (JSON.stringify(n) === JSON.stringify(k)) {
      return { type: "NumberLiteral", value: 1 };
    }
    return {
      type: "Product",
      expression: { type: "Identifier", name: "i" },
      variable: "i",
      lowerBound: {
        type: "BinaryExpression",
        operator: "+",
        left: k,
        right: { type: "NumberLiteral", value: 1 }
      },
      upperBound: n
    };
  }
  __name(simplifyGeneralFactorialFraction, "simplifyGeneralFactorialFraction");
  if (numerator.type === "Fraction" && denominator.type === "Fraction") {
    return simplifyFractionBasic({
      numerator: simplifyMultiplicationBasic(numerator.numerator, denominator.denominator),
      denominator: simplifyMultiplicationBasic(numerator.denominator, denominator.numerator)
    });
  }
  if (numerator.type === "Fraction") {
    return simplifyFractionBasic({
      numerator: numerator.numerator,
      denominator: simplifyMultiplicationBasic(numerator.denominator, denominator)
    });
  }
  if (denominator.type === "Fraction") {
    return simplifyFractionBasic({
      numerator: simplifyMultiplicationBasic(numerator, denominator.denominator),
      denominator: denominator.numerator
    });
  }
  if (denominator.type === "NumberLiteral" && denominator.value === 1) {
    return numerator;
  }
  if (numerator.type === "NumberLiteral" && numerator.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (numerator.type === "NumberLiteral" && denominator.type === "NumberLiteral" && denominator.value !== 0) {
    const reduced = reduceFraction$1(numerator.value, denominator.value);
    if (reduced.den === 1) {
      return { type: "NumberLiteral", value: reduced.num };
    }
    return {
      type: "Fraction",
      numerator: { type: "NumberLiteral", value: reduced.num },
      denominator: { type: "NumberLiteral", value: reduced.den }
    };
  }
  return { type: "Fraction", numerator, denominator };
}
__name(simplifyFractionBasic, "simplifyFractionBasic");
function reduceFraction$1(num, den) {
  const g = gcd$1(Math.abs(num), Math.abs(den));
  return { num: num / g, den: den / g };
}
__name(reduceFraction$1, "reduceFraction$1");
function gcd$1(a, b) {
  return b === 0 ? a : gcd$1(b, a % b);
}
__name(gcd$1, "gcd$1");
function extractAllTerms(node) {
  if (node.type !== "BinaryExpression") {
    return [{ term: node, sign: 1 }];
  }
  const expr = node;
  if (expr.operator === "+") {
    return [...extractAllTerms(expr.left), ...extractAllTerms(expr.right)];
  }
  if (expr.operator === "-") {
    const leftTerms = extractAllTerms(expr.left);
    const rightTerms = extractAllTerms(expr.right).map((t) => ({
      term: t.term,
      sign: -t.sign
    }));
    return [...leftTerms, ...rightTerms];
  }
  return [{ term: node, sign: 1 }];
}
__name(extractAllTerms, "extractAllTerms");
function buildExpressionFromTerms(terms) {
  if (terms.length === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  let expr = null;
  for (const { term, sign } of terms) {
    const signedTerm = sign === 1 ? term : {
      type: "BinaryExpression",
      operator: "*",
      left: { type: "NumberLiteral", value: -1 },
      right: term
    };
    if (expr === null) {
      expr = signedTerm;
    } else {
      expr = {
        type: "BinaryExpression",
        operator: "+",
        left: expr,
        right: signedTerm
      };
    }
  }
  return basicSimplify(expr);
}
__name(buildExpressionFromTerms, "buildExpressionFromTerms");
function multiplyTerms(left, right) {
  if (left.type === "NumberLiteral" && left.value === 0 || right.type === "NumberLiteral" && right.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (left.type === "NumberLiteral" && left.value === 1) {
    return right;
  }
  if (right.type === "NumberLiteral" && right.value === 1) {
    return left;
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return {
      type: "NumberLiteral",
      value: left.value * right.value
    };
  }
  const result = {
    type: "BinaryExpression",
    operator: "*",
    left,
    right
  };
  return basicSimplify(result);
}
__name(multiplyTerms, "multiplyTerms");
function distributeMultiplication(left, right) {
  const leftTerms = extractAllTerms(left);
  const rightTerms = extractAllTerms(right);
  const expandedTerms = [];
  for (const leftTerm of leftTerms) {
    for (const rightTerm of rightTerms) {
      const product = multiplyTerms(leftTerm.term, rightTerm.term);
      const sign = leftTerm.sign * rightTerm.sign;
      expandedTerms.push({ term: product, sign });
    }
  }
  const result = buildExpressionFromTerms(expandedTerms);
  return basicSimplify(result);
}
__name(distributeMultiplication, "distributeMultiplication");
function canDistribute(node) {
  if (node.type !== "BinaryExpression" || node.operator !== "*") {
    return false;
  }
  const expr = node;
  const leftIsSum = expr.left.type === "BinaryExpression" && (expr.left.operator === "+" || expr.left.operator === "-");
  const rightIsSum = expr.right.type === "BinaryExpression" && (expr.right.operator === "+" || expr.right.operator === "-");
  return leftIsSum || rightIsSum;
}
__name(canDistribute, "canDistribute");
function applyDistributiveLaw(node) {
  if (node.type !== "BinaryExpression") {
    return node;
  }
  const expr = node;
  if (expr.operator === "^") {
    const base = expr.left;
    const exponent = expr.right;
    if (exponent.type === "NumberLiteral" && Number.isInteger(exponent.value) && exponent.value > 0) {
      if (base.type === "BinaryExpression" && (base.operator === "+" || base.operator === "-")) {
        const expanded = expandPower(base, exponent.value);
        return basicSimplify(expanded);
      }
    }
    const processedBase = applyDistributiveLaw(base);
    const processedExponent = applyDistributiveLaw(exponent);
    if (processedBase !== base || processedExponent !== exponent) {
      const result = {
        type: "BinaryExpression",
        operator: "^",
        left: processedBase,
        right: processedExponent
      };
      return basicSimplify(result);
    }
    return node;
  }
  if (expr.operator === "*") {
    const left2 = applyDistributiveLaw(expr.left);
    const right2 = applyDistributiveLaw(expr.right);
    const currentNode = {
      type: "BinaryExpression",
      operator: "*",
      left: left2,
      right: right2
    };
    if (canDistribute(currentNode)) {
      const distributed = distributeMultiplication(left2, right2);
      const result = applyDistributiveLaw(distributed);
      return basicSimplify(result);
    }
    if (left2.type === "BinaryExpression" && (left2.operator === "+" || left2.operator === "-") && right2.type === "Identifier") {
      const distributed = distributeMultiplication(left2, right2);
      const result = applyDistributiveLaw(distributed);
      return basicSimplify(result);
    }
    if (right2.type === "BinaryExpression" && (right2.operator === "+" || right2.operator === "-") && left2.type === "Identifier") {
      const distributed = distributeMultiplication(left2, right2);
      const result = applyDistributiveLaw(distributed);
      return basicSimplify(result);
    }
    if (left2 !== expr.left || right2 !== expr.right) {
      return basicSimplify(currentNode);
    }
    return node;
  }
  const left = applyDistributiveLaw(expr.left);
  const right = applyDistributiveLaw(expr.right);
  if (left !== expr.left || right !== expr.right) {
    const result = {
      type: "BinaryExpression",
      operator: expr.operator,
      left,
      right
    };
    return basicSimplify(result);
  }
  return node;
}
__name(applyDistributiveLaw, "applyDistributiveLaw");
function expandExpression(node) {
  const expanded = applyDistributiveLaw(node);
  return basicSimplify(expanded);
}
__name(expandExpression, "expandExpression");
function expandPower(base, exponent) {
  if (exponent === 0) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (exponent === 1) {
    return base;
  }
  if (exponent > config.MAX_EXPANSION_POWER) {
    return {
      type: "BinaryExpression",
      operator: "^",
      left: base,
      right: { type: "NumberLiteral", value: exponent }
    };
  }
  let result = base;
  for (let i = 1; i < exponent; i++) {
    result = distributeMultiplication(result, base);
    result = basicSimplify(result);
  }
  return result;
}
__name(expandPower, "expandPower");
function applyTrigonometricIdentities(node) {
  if (isSin2PlusCos2(node)) {
    return { type: "NumberLiteral", value: 1 };
  }
  return node;
}
__name(applyTrigonometricIdentities, "applyTrigonometricIdentities");
function isSin2PlusCos2(node) {
  if (node.type !== "BinaryExpression" || node.operator !== "+")
    return false;
  const { left, right } = node;
  return isSinSquared(left) && isCosSquared(right) && sameArg(left, right) || isSinSquared(right) && isCosSquared(left) && sameArg(left, right);
}
__name(isSin2PlusCos2, "isSin2PlusCos2");
function isSinSquared(node) {
  return node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "FunctionCall" && node.left.name === "sin" && node.right.type === "NumberLiteral" && node.right.value === 2;
}
__name(isSinSquared, "isSinSquared");
function isCosSquared(node) {
  return node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "FunctionCall" && node.left.name === "cos" && node.right.type === "NumberLiteral" && node.right.value === 2;
}
__name(isCosSquared, "isCosSquared");
function sameArg(a, b) {
  function getArg(n) {
    if (n.type === "BinaryExpression" && n.left.type === "FunctionCall") {
      return n.left.args[0];
    }
    return void 0;
  }
  __name(getArg, "getArg");
  const argA = getArg(a);
  const argB = getArg(b);
  if (!argA || !argB)
    return false;
  return JSON.stringify(argA) === JSON.stringify(argB);
}
__name(sameArg, "sameArg");
var _AdvancedTermAnalyzer = class _AdvancedTermAnalyzer {
  /**
   * Analyze any mathematical expression into canonical algebraic form
   */
  static analyze(node) {
    if (!node)
      return this.ZERO_TERM;
    try {
      return this.deepAnalyze(node, 0);
    } catch (error) {
      return {
        coefficient: 1,
        variables: /* @__PURE__ */ new Map(),
        constants: [node],
        complexity: 100
      };
    }
  }
  /**
   * Deep recursive analysis with cycle detection
   */
  static deepAnalyze(node, depth) {
    if (depth > 20) {
      return {
        coefficient: 1,
        variables: /* @__PURE__ */ new Map(),
        constants: [node],
        complexity: depth
      };
    }
    switch (node.type) {
      case "NumberLiteral":
        return this.analyzeNumber(node);
      case "Identifier":
        return this.analyzeVariable(node);
      case "Fraction":
        return this.analyzeFraction(node);
      case "BinaryExpression":
        return this.analyzeBinaryExpression(node, depth);
      default:
        return this.analyzeComplex(node);
    }
  }
  /**
   * Analyze numerical literals
   */
  static analyzeNumber(node) {
    return {
      coefficient: node.value,
      variables: /* @__PURE__ */ new Map(),
      constants: [],
      complexity: 1
    };
  }
  /**
   * Analyze variable identifiers
   */
  static analyzeVariable(node) {
    const variables = /* @__PURE__ */ new Map();
    variables.set(node.name, 1);
    return {
      coefficient: 1,
      variables,
      constants: [],
      complexity: 2
    };
  }
  /**
   * Analyze fraction nodes
   */
  static analyzeFraction(node) {
    if (node.numerator.type === "NumberLiteral" && node.denominator.type === "NumberLiteral") {
      const numerator = node.numerator;
      const denominator = node.denominator;
      if (denominator.value !== 0) {
        return {
          coefficient: numerator.value / denominator.value,
          variables: /* @__PURE__ */ new Map(),
          constants: [],
          complexity: 1
        };
      }
    }
    return this.analyzeComplex(node);
  }
  /**
   * Analyze binary expressions with operator-specific logic
   */
  static analyzeBinaryExpression(node, depth) {
    const left = this.deepAnalyze(node.left, depth + 1);
    const right = this.deepAnalyze(node.right, depth + 1);
    switch (node.operator) {
      case "*":
        return this.multiplyTerms(left, right);
      case "^":
        return this.powerTerm(left, right, node);
      case "+":
      case "-":
        return this.analyzeComplex(node);
      default:
        return this.analyzeComplex(node);
    }
  }
  /**
   * Multiply two algebraic terms
   */
  static multiplyTerms(left, right) {
    const coefficient = left.coefficient * right.coefficient;
    const variables = new Map(left.variables);
    for (const [name, power] of right.variables) {
      variables.set(name, (variables.get(name) || 0) + power);
    }
    for (const [name, power] of variables) {
      if (power === 0) {
        variables.delete(name);
      }
    }
    const constants = [...left.constants, ...right.constants];
    return {
      coefficient,
      variables,
      constants,
      complexity: left.complexity + right.complexity + 1
    };
  }
  /**
   * Handle power operations
   */
  static powerTerm(base, exponent, original) {
    if (exponent.variables.size > 0 || exponent.constants.length > 0) {
      return this.analyzeComplex(original);
    }
    const exp = exponent.coefficient;
    if (Number.isInteger(exp) && exp >= 0 && exp <= 10) {
      const coefficient = Math.pow(base.coefficient, exp);
      const variables = /* @__PURE__ */ new Map();
      for (const [name, power] of base.variables) {
        variables.set(name, power * exp);
      }
      return {
        coefficient,
        variables,
        constants: base.constants.length > 0 ? [original] : [],
        complexity: base.complexity * exp + 5
      };
    }
    return this.analyzeComplex(original);
  }
  /**
   * Handle complex expressions that cannot be simplified
   */
  static analyzeComplex(node) {
    return {
      coefficient: 1,
      variables: /* @__PURE__ */ new Map(),
      constants: [node],
      complexity: 50
    };
  }
  /**
   * Create a unique grouping key for like terms
   */
  static createGroupingKey(term) {
    const varEntries = Array.from(term.variables.entries()).sort();
    const varsKey = varEntries.map(([name, power]) => `${name}^${power}`).join("*");
    const constantsKey = term.constants.map((c) => this.normalizeConstant(c)).sort().join("|");
    return `${varsKey}||${constantsKey}`;
  }
  /**
   * Normalize constant for consistent comparison
   */
  static normalizeConstant(node) {
    const cleaned = JSON.parse(JSON.stringify(node, (key, value) => {
      if (key === "scope" || key === "uniqueId")
        return void 0;
      return value;
    }));
    return JSON.stringify(cleaned);
  }
};
__name(_AdvancedTermAnalyzer, "AdvancedTermAnalyzer");
var AdvancedTermAnalyzer = _AdvancedTermAnalyzer;
AdvancedTermAnalyzer.ZERO_TERM = {
  coefficient: 0,
  variables: /* @__PURE__ */ new Map(),
  constants: [],
  complexity: 0
};
var _AdvancedTermCombiner = class _AdvancedTermCombiner {
  /**
   * Combine like terms with maximum efficiency
   */
  static combineTerms(terms) {
    if (terms.length === 0)
      return [];
    if (terms.length === 1)
      return terms;
    const groups = /* @__PURE__ */ new Map();
    for (const { term, sign } of terms) {
      const analyzed = AdvancedTermAnalyzer.analyze(term);
      const key = AdvancedTermAnalyzer.createGroupingKey(analyzed);
      if (groups.has(key)) {
        const group = groups.get(key);
        group.totalCoefficient += sign * analyzed.coefficient;
        group.originalTerms.push({ term, sign });
      } else {
        groups.set(key, {
          totalCoefficient: sign * analyzed.coefficient,
          canonicalTerm: analyzed,
          originalTerms: [{ term, sign }]
        });
      }
    }
    const result = [];
    for (const group of groups.values()) {
      if (Math.abs(group.totalCoefficient) < 1e-10) {
        continue;
      }
      try {
        const reconstructed = this.reconstructTerm(group.canonicalTerm, group.totalCoefficient);
        if (group.totalCoefficient > 0) {
          result.push({ term: reconstructed, sign: 1 });
        } else {
          result.push({ term: reconstructed, sign: -1 });
        }
      } catch (error) {
        const fallback = group.originalTerms[0];
        if (fallback) {
          result.push(fallback);
        }
      }
    }
    return result;
  }
  /**
   * Reconstruct AST from canonical algebraic term
   */
  static reconstructTerm(canonical, totalCoefficient) {
    const absCoeff = Math.abs(totalCoefficient);
    const variablePart = this.buildVariablePart(canonical.variables);
    let result = variablePart;
    for (const constant of canonical.constants) {
      if (result) {
        result = {
          type: "BinaryExpression",
          operator: "*",
          left: result,
          right: constant
        };
      } else {
        result = constant;
      }
    }
    if (absCoeff === 1 && result) {
      return result;
    }
    if (!result) {
      if (!Number.isInteger(absCoeff)) {
        const fraction = this.decimalToFraction(absCoeff);
        return {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: fraction.numerator },
          denominator: { type: "NumberLiteral", value: fraction.denominator }
        };
      }
      return { type: "NumberLiteral", value: absCoeff };
    }
    if (absCoeff !== 1) {
      if (!Number.isInteger(absCoeff)) {
        const fraction = this.decimalToFraction(absCoeff);
        const coeffNode = {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: fraction.numerator },
          denominator: { type: "NumberLiteral", value: fraction.denominator }
        };
        return {
          type: "BinaryExpression",
          operator: "*",
          left: coeffNode,
          right: result
        };
      }
      return {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "NumberLiteral", value: absCoeff },
        right: result
      };
    }
    return result;
  }
  /**
   * Convert decimal to fraction
   */
  static decimalToFraction(decimal) {
    const tolerance = 1e-10;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    while (Math.abs(decimal - h1 / k1) > tolerance) {
      const a = Math.floor(b);
      const temp = h1;
      h1 = a * h1 + h2;
      h2 = temp;
      const temp2 = k1;
      k1 = a * k1 + k2;
      k2 = temp2;
      b = 1 / (b - a);
    }
    return { numerator: h1, denominator: k1 };
  }
  /**
   * Build variable part from variable map
   */
  static buildVariablePart(variables) {
    if (variables.size === 0)
      return null;
    const entries = Array.from(variables.entries()).sort();
    let result = null;
    for (const [name, power] of entries) {
      if (power === 0)
        continue;
      let varNode;
      if (power === 1) {
        varNode = { type: "Identifier", name };
      } else {
        varNode = {
          type: "BinaryExpression",
          operator: "^",
          left: { type: "Identifier", name },
          right: { type: "NumberLiteral", value: power }
        };
      }
      if (!result) {
        result = varNode;
      } else {
        result = {
          type: "BinaryExpression",
          operator: "*",
          left: result,
          right: varNode
        };
      }
    }
    return result;
  }
};
__name(_AdvancedTermCombiner, "AdvancedTermCombiner");
var AdvancedTermCombiner = _AdvancedTermCombiner;
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
__name(gcd, "gcd");
function reduceFraction(numerator, denominator) {
  if (denominator === 0) {
    throw new Error("Division by zero");
  }
  const sign = numerator < 0 !== denominator < 0 ? -1 : 1;
  const absNum = Math.abs(numerator);
  const absDen = Math.abs(denominator);
  const commonDivisor = gcd(absNum, absDen);
  return {
    num: sign * (absNum / commonDivisor),
    den: absDen / commonDivisor
  };
}
__name(reduceFraction, "reduceFraction");
function areEquivalentExpressions(left, right) {
  if (left.type !== right.type)
    return false;
  switch (left.type) {
    case "NumberLiteral":
      return Math.abs(left.value - right.value) < 1e-10;
    case "Identifier":
      return left.name === right.name;
    case "BinaryExpression": {
      const leftBin = left;
      const rightBin = right;
      if (leftBin.operator !== rightBin.operator)
        return false;
      if (leftBin.operator === "+" || leftBin.operator === "*") {
        return areEquivalentExpressions(leftBin.left, rightBin.left) && areEquivalentExpressions(leftBin.right, rightBin.right) || areEquivalentExpressions(leftBin.left, rightBin.right) && areEquivalentExpressions(leftBin.right, rightBin.left);
      }
      return areEquivalentExpressions(leftBin.left, rightBin.left) && areEquivalentExpressions(leftBin.right, rightBin.right);
    }
    case "Fraction": {
      const leftFrac = left;
      const rightFrac = right;
      return areEquivalentExpressions(leftFrac.numerator, rightFrac.numerator) && areEquivalentExpressions(leftFrac.denominator, rightFrac.denominator);
    }
    default:
      return false;
  }
}
__name(areEquivalentExpressions, "areEquivalentExpressions");
var DEFAULT_EXPONENTIAL_OPTIONS = {
  convertRootsToExponential: true,
  simplifyExponentials: true,
  maxDepth: 15,
  applyAdvancedIdentities: true
};
function simplifyExponentialForm(node, options = {}) {
  const opts = { ...DEFAULT_EXPONENTIAL_OPTIONS, ...options };
  return applyExponentialSimplification(node, opts, 0);
}
__name(simplifyExponentialForm, "simplifyExponentialForm");
function convertRootsToExponential(node) {
  if (!node)
    return node;
  switch (node.type) {
    case "FunctionCall":
      return convertFunctionToExponential(node);
    case "BinaryExpression": {
      const expr = node;
      return {
        ...expr,
        left: convertRootsToExponential(expr.left),
        right: convertRootsToExponential(expr.right)
      };
    }
    case "UnaryExpression": {
      const expr = node;
      return {
        ...expr,
        operand: convertRootsToExponential(expr.operand)
      };
    }
    case "Fraction": {
      const frac = node;
      return {
        ...frac,
        numerator: convertRootsToExponential(frac.numerator),
        denominator: convertRootsToExponential(frac.denominator)
      };
    }
    default:
      return node;
  }
}
__name(convertRootsToExponential, "convertRootsToExponential");
function convertFunctionToExponential(func) {
  switch (func.name) {
    case "sqrt":
      if (func.args.length === 1 && func.args[0]) {
        const base = convertRootsToExponential(func.args[0]);
        return createPowerExpression(base, createFraction(1, 2));
      }
      break;
    case "cbrt":
      if (func.args.length === 1 && func.args[0]) {
        const base = convertRootsToExponential(func.args[0]);
        return createPowerExpression(base, createFraction(1, 3));
      }
      break;
    case "root":
      if (func.args.length === 2 && func.args[0] && func.args[1]) {
        const base = convertRootsToExponential(func.args[0]);
        const rootOrder = func.args[1];
        if (rootOrder.type === "NumberLiteral") {
          const exponent2 = createFraction(1, rootOrder.value);
          return createPowerExpression(base, exponent2);
        }
        const exponent = {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: convertRootsToExponential(rootOrder)
        };
        return createPowerExpression(base, exponent);
      }
      break;
    default:
      return {
        ...func,
        args: func.args.map((arg) => arg ? convertRootsToExponential(arg) : arg).filter(Boolean)
      };
  }
  return {
    ...func,
    args: func.args.map((arg) => arg ? convertRootsToExponential(arg) : arg).filter(Boolean)
  };
}
__name(convertFunctionToExponential, "convertFunctionToExponential");
function createPowerExpression(base, exponent) {
  return {
    type: "BinaryExpression",
    operator: "^",
    left: base,
    right: exponent
  };
}
__name(createPowerExpression, "createPowerExpression");
function createFraction(numerator, denominator) {
  const reduced = reduceFraction(numerator, denominator);
  return {
    type: "Fraction",
    numerator: { type: "NumberLiteral", value: reduced.num },
    denominator: { type: "NumberLiteral", value: reduced.den }
  };
}
__name(createFraction, "createFraction");
function applyExponentialSimplification(node, options, depth) {
  if (depth > options.maxDepth) {
    return node;
  }
  let result = options.convertRootsToExponential ? convertRootsToExponential(node) : node;
  result = basicSimplify(result);
  if (options.simplifyExponentials) {
    result = simplifyExponentialExpressions(result, options, depth);
  }
  if (options.applyAdvancedIdentities) {
    result = applyAdvancedExponentialIdentities(result);
  }
  if (areEquivalentExpressions(node, result)) {
    return result;
  }
  return applyExponentialSimplification(result, options, depth + 1);
}
__name(applyExponentialSimplification, "applyExponentialSimplification");
function simplifyExponentialExpressions(node, options, depth) {
  if (!node)
    return node;
  switch (node.type) {
    case "BinaryExpression":
      return simplifyExponentialBinaryExpression(node, options, depth);
    case "UnaryExpression": {
      const expr = node;
      const operand = applyExponentialSimplification(expr.operand, options, depth + 1);
      return { ...expr, operand };
    }
    case "Fraction": {
      const frac = node;
      const numerator = applyExponentialSimplification(frac.numerator, options, depth + 1);
      const denominator = applyExponentialSimplification(frac.denominator, options, depth + 1);
      return simplifyExponentialFraction({ type: "Fraction", numerator, denominator });
    }
    default:
      return node;
  }
}
__name(simplifyExponentialExpressions, "simplifyExponentialExpressions");
function simplifyExponentialBinaryExpression(expr, options, depth) {
  const left = applyExponentialSimplification(expr.left, options, depth + 1);
  const right = applyExponentialSimplification(expr.right, options, depth + 1);
  if (expr.operator === "^") {
    return simplifyPowerExpression(left, right);
  }
  if (expr.operator === "*") {
    return simplifyExponentialMultiplication(left, right);
  }
  if (expr.operator === "/") {
    return simplifyExponentialDivision(left, right);
  }
  return { ...expr, left, right };
}
__name(simplifyExponentialBinaryExpression, "simplifyExponentialBinaryExpression");
function simplifyPowerExpression(base, exponent, options, depth) {
  if (isZero$1(exponent)) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (isOne$1(exponent)) {
    return base;
  }
  if (isZero$1(base) && isPositive(exponent)) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (isOne$1(base)) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (base.type === "BinaryExpression" && base.operator === "^") {
    const innerBase = base.left;
    const innerExponent = base.right;
    const newExponent = simplifyExponentialMultiplication(innerExponent, exponent);
    return createPowerExpression(innerBase, newExponent);
  }
  if (exponent.type === "Fraction") {
    return simplifyFractionalPower(base, exponent);
  }
  if (base.type === "BinaryExpression" && base.operator === "*") {
    if (canDistributePower(exponent)) {
      const leftPower = createPowerExpression(base.left, exponent);
      const rightPower = createPowerExpression(base.right, exponent);
      return simplifyExponentialMultiplication(leftPower, rightPower);
    }
  }
  if (base.type === "NumberLiteral" && exponent.type === "NumberLiteral") {
    const baseVal = base.value;
    const expVal = exponent.value;
    if (Number.isInteger(expVal)) {
      return { type: "NumberLiteral", value: Math.pow(baseVal, expVal) };
    }
    if (expVal === 0.5 && baseVal >= 0) {
      const sqrt = Math.sqrt(baseVal);
      if (Number.isInteger(sqrt)) {
        return { type: "NumberLiteral", value: sqrt };
      }
    }
  }
  return createPowerExpression(base, exponent);
}
__name(simplifyPowerExpression, "simplifyPowerExpression");
function simplifyFractionalPower(base, exponent, options, depth) {
  const num = exponent.numerator;
  const den = exponent.denominator;
  if (isOne$1(num)) {
    if (den.type === "NumberLiteral") {
      const rootOrder = den.value;
      if (rootOrder === 2) {
        if (base.type === "NumberLiteral") {
          const baseVal = base.value;
          if (baseVal >= 0) {
            const sqrt = Math.sqrt(baseVal);
            if (Number.isInteger(sqrt)) {
              return { type: "NumberLiteral", value: sqrt };
            }
          }
        }
      }
      if (rootOrder === 3) {
        if (base.type === "NumberLiteral") {
          const baseVal = base.value;
          const cbrt = Math.cbrt(baseVal);
          if (Math.abs(cbrt - Math.round(cbrt)) < 1e-10) {
            return { type: "NumberLiteral", value: Math.round(cbrt) };
          }
        }
      }
    }
  }
  if (isOne$1(den)) {
    return createPowerExpression(base, num);
  }
  const simplifiedExponent = simplifyExponentialFraction(exponent);
  if (simplifiedExponent.type !== "Fraction") {
    return createPowerExpression(base, simplifiedExponent);
  }
  return createPowerExpression(base, simplifiedExponent);
}
__name(simplifyFractionalPower, "simplifyFractionalPower");
function simplifyExponentialMultiplication(left, right, options, depth) {
  if (left.type === "BinaryExpression" && left.operator === "^" && right.type === "BinaryExpression" && right.operator === "^") {
    const leftBase = left.left;
    const leftExp = left.right;
    const rightBase = right.left;
    const rightExp = right.right;
    if (areEquivalentExpressions(leftBase, rightBase)) {
      const sumExponent = addExponents(leftExp, rightExp);
      return createPowerExpression(leftBase, sumExponent);
    }
  }
  if (right.type === "BinaryExpression" && right.operator === "^") {
    const rightBase = right.left;
    const rightExp = right.right;
    if (areEquivalentExpressions(left, rightBase)) {
      const newExponent = addExponents({ type: "NumberLiteral", value: 1 }, rightExp);
      return createPowerExpression(left, newExponent);
    }
  }
  if (left.type === "BinaryExpression" && left.operator === "^") {
    const leftBase = left.left;
    const leftExp = left.right;
    if (areEquivalentExpressions(leftBase, right)) {
      const newExponent = addExponents(leftExp, { type: "NumberLiteral", value: 1 });
      return createPowerExpression(leftBase, newExponent);
    }
  }
  return {
    type: "BinaryExpression",
    operator: "*",
    left,
    right
  };
}
__name(simplifyExponentialMultiplication, "simplifyExponentialMultiplication");
function simplifyExponentialDivision(left, right, options, depth) {
  if (left.type === "BinaryExpression" && left.operator === "^" && right.type === "BinaryExpression" && right.operator === "^") {
    const leftBase = left.left;
    const leftExp = left.right;
    const rightBase = right.left;
    const rightExp = right.right;
    if (areEquivalentExpressions(leftBase, rightBase)) {
      const diffExponent = subtractExponents(leftExp, rightExp);
      return createPowerExpression(leftBase, diffExponent);
    }
  }
  if (right.type === "BinaryExpression" && right.operator === "^") {
    const rightBase = right.left;
    const rightExp = right.right;
    if (areEquivalentExpressions(left, rightBase)) {
      const newExponent = subtractExponents({ type: "NumberLiteral", value: 1 }, rightExp);
      return createPowerExpression(left, newExponent);
    }
  }
  if (left.type === "BinaryExpression" && left.operator === "^") {
    const leftBase = left.left;
    const leftExp = left.right;
    if (areEquivalentExpressions(leftBase, right)) {
      const newExponent = subtractExponents(leftExp, { type: "NumberLiteral", value: 1 });
      return createPowerExpression(leftBase, newExponent);
    }
  }
  return {
    type: "Fraction",
    numerator: left,
    denominator: right
  };
}
__name(simplifyExponentialDivision, "simplifyExponentialDivision");
function simplifyExponentialFraction(frac) {
  const numerator = frac.numerator;
  const denominator = frac.denominator;
  if (isOne$1(numerator) && denominator.type === "BinaryExpression" && denominator.operator === "^") {
    const base = denominator.left;
    const exp = denominator.right;
    const negativeExp = negateExponent(exp);
    return createPowerExpression(base, negativeExp);
  }
  if (numerator.type === "BinaryExpression" && numerator.operator === "^" && denominator.type === "BinaryExpression" && denominator.operator === "^") {
    const numBase = numerator.left;
    const numExp = numerator.right;
    const denBase = denominator.left;
    const denExp = denominator.right;
    if (areEquivalentExpressions(numBase, denBase)) {
      const diffExponent = subtractExponents(numExp, denExp);
      return createPowerExpression(numBase, diffExponent);
    }
  }
  return frac;
}
__name(simplifyExponentialFraction, "simplifyExponentialFraction");
function applyAdvancedExponentialIdentities(node, options, depth) {
  if (!node)
    return node;
  switch (node.type) {
    case "BinaryExpression": {
      const expr = node;
      const left = applyAdvancedExponentialIdentities(expr.left);
      const right = applyAdvancedExponentialIdentities(expr.right);
      if (expr.operator === "^" && left.type === "BinaryExpression" && left.operator === "^") {
        const base = left.left;
        const innerExp = left.right;
        const outerExp = right;
        const newExp = multiplyExponents(innerExp, outerExp);
        return createPowerExpression(base, newExp);
      }
      return { ...expr, left, right };
    }
    case "Fraction": {
      const frac = node;
      const numerator = applyAdvancedExponentialIdentities(frac.numerator);
      const denominator = applyAdvancedExponentialIdentities(frac.denominator);
      return { type: "Fraction", numerator, denominator };
    }
    default:
      return node;
  }
}
__name(applyAdvancedExponentialIdentities, "applyAdvancedExponentialIdentities");
function addExponents(left, right) {
  return basicSimplify({
    type: "BinaryExpression",
    operator: "+",
    left,
    right
  });
}
__name(addExponents, "addExponents");
function subtractExponents(left, right) {
  return basicSimplify({
    type: "BinaryExpression",
    operator: "-",
    left,
    right
  });
}
__name(subtractExponents, "subtractExponents");
function multiplyExponents(left, right) {
  return basicSimplify({
    type: "BinaryExpression",
    operator: "*",
    left,
    right
  });
}
__name(multiplyExponents, "multiplyExponents");
function negateExponent(exp) {
  return basicSimplify({
    type: "UnaryExpression",
    operator: "-",
    operand: exp
  });
}
__name(negateExponent, "negateExponent");
function isZero$1(node) {
  return node.type === "NumberLiteral" && node.value === 0;
}
__name(isZero$1, "isZero$1");
function isOne$1(node) {
  return node.type === "NumberLiteral" && node.value === 1;
}
__name(isOne$1, "isOne$1");
function isPositive(node) {
  return node.type === "NumberLiteral" && node.value > 0;
}
__name(isPositive, "isPositive");
function canDistributePower(exponent) {
  return exponent.type === "NumberLiteral" && Number.isInteger(exponent.value);
}
__name(canDistributePower, "canDistributePower");
function convertSqrtToExponential(node) {
  return convertRootsToExponential(node);
}
__name(convertSqrtToExponential, "convertSqrtToExponential");
function combineExponentialTerms(node) {
  if (!node)
    return node;
  const terms = extractMultiplicationTerms(node);
  if (terms.length <= 1) {
    return node;
  }
  const groups = /* @__PURE__ */ new Map();
  const otherTerms = [];
  for (const term of terms) {
    let base = { type: "NumberLiteral", value: 1 }, exponent = { type: "NumberLiteral", value: 1 }, coefficient = 1;
    if (term.type === "BinaryExpression" && term.operator === "^") {
      base = term.left;
      exponent = term.right;
    } else if (term.type === "Identifier" || term.type === "BinaryExpression" || term.type === "FunctionCall") {
      base = term;
      exponent = { type: "NumberLiteral", value: 1 };
    } else if (term.type === "NumberLiteral") {
      coefficient = term.value;
      otherTerms.push(term);
      continue;
    } else {
      otherTerms.push(term);
      continue;
    }
    const baseKey = JSON.stringify(base);
    if (groups.has(baseKey)) {
      const group = groups.get(baseKey);
      group.exponentSum = addExponents(group.exponentSum, exponent);
      group.count++;
      group.coefficient *= coefficient;
    } else {
      groups.set(baseKey, {
        base,
        exponentSum: exponent,
        count: 1,
        coefficient
      });
    }
  }
  const combinedTerms = [];
  for (const group of groups.values()) {
    let result;
    if (group.count > 1 && group.exponentSum.type === "NumberLiteral" && group.exponentSum.value === group.count) {
      result = createPowerExpression(group.base, { type: "NumberLiteral", value: group.count });
    } else {
      result = createPowerExpression(group.base, group.exponentSum);
    }
    if (group.coefficient !== 1) {
      result = multiplyByCoefficient(result, group.coefficient);
    }
    combinedTerms.push(result);
  }
  combinedTerms.push(...otherTerms);
  return reconstructMultiplication(combinedTerms);
}
__name(combineExponentialTerms, "combineExponentialTerms");
function extractMultiplicationTerms(node) {
  if (node.type !== "BinaryExpression" || node.operator !== "*") {
    return [node];
  }
  const expr = node;
  return [...extractMultiplicationTerms(expr.left), ...extractMultiplicationTerms(expr.right)];
}
__name(extractMultiplicationTerms, "extractMultiplicationTerms");
function multiplyByCoefficient(term, coefficient) {
  if (coefficient === 1) {
    return term;
  }
  if (coefficient === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  return {
    type: "BinaryExpression",
    operator: "*",
    left: { type: "NumberLiteral", value: coefficient },
    right: term
  };
}
__name(multiplyByCoefficient, "multiplyByCoefficient");
function reconstructMultiplication(terms) {
  if (terms.length === 0) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (terms.length === 1) {
    const firstTerm = terms[0];
    return firstTerm || { type: "NumberLiteral", value: 1 };
  }
  let result = terms[0] || { type: "NumberLiteral", value: 1 };
  for (let i = 1; i < terms.length; i++) {
    const currentTerm = terms[i];
    if (currentTerm) {
      result = {
        type: "BinaryExpression",
        operator: "*",
        left: result,
        right: currentTerm
      };
    }
  }
  return result;
}
__name(reconstructMultiplication, "reconstructMultiplication");
function enhancedExponentialSimplification(node) {
  let result = fullExponentialSimplification(node);
  result = combineExponentialTerms(result);
  result = basicSimplify(result);
  return result;
}
__name(enhancedExponentialSimplification, "enhancedExponentialSimplification");
function fullExponentialSimplification(node) {
  return simplifyExponentialForm(node, {
    convertRootsToExponential: true,
    simplifyExponentials: true,
    applyAdvancedIdentities: true,
    maxDepth: 15
  });
}
__name(fullExponentialSimplification, "fullExponentialSimplification");
function simplifyPolynomialFraction(numerator, denominator, steps) {
  if (Array.isArray(steps))
    steps.push("Start simplifyPolynomialFraction");
  function extractFactors(node) {
    if (node.type === "BinaryExpression" && node.operator === "*") {
      return [...extractFactors(node.left), ...extractFactors(node.right)];
    }
    if (node.type === "BinaryExpression" && node.operator === "^" && node.right.type === "NumberLiteral" && Number.isInteger(node.right.value) && node.right.value >= 1) {
      const count = node.right.value;
      const baseFactors = extractFactors(node.left);
      let result = [];
      for (let i = 0; i < count; ++i) {
        result = result.concat(baseFactors);
      }
      return result;
    }
    return [node];
  }
  __name(extractFactors, "extractFactors");
  let numFactors = extractFactors(numerator);
  let denFactors = extractFactors(denominator);
  const used = new Array(denFactors.length).fill(false);
  numFactors = numFactors.filter((nf) => {
    for (let i = 0; i < denFactors.length; ++i) {
      const df = denFactors[i];
      if (!used[i] && df !== void 0 && areEquivalentExpressions(nf, df)) {
        used[i] = true;
        if (Array.isArray(steps))
          steps.push("Cancel common factor" + stepsAstToLatex(nf));
        return false;
      }
    }
    return true;
  });
  denFactors = denFactors.filter((_, i) => !used[i]);
  if (Array.isArray(steps))
    steps.push(["After cancellation"]);
  function buildProduct(factors) {
    const filtered = factors.filter((f) => f !== void 0);
    if (filtered.length === 0)
      return { type: "NumberLiteral", value: 1 };
    if (filtered.length === 1)
      return filtered[0];
    return filtered.reduce((a, b) => ({
      type: "BinaryExpression",
      operator: "*",
      left: a,
      right: b
    }));
  }
  __name(buildProduct, "buildProduct");
  const newNum = buildProduct(numFactors);
  const newDen = buildProduct(denFactors);
  if (newDen.type === "NumberLiteral" && newDen.value === 1) {
    if (Array.isArray(steps))
      steps.push("Denominator is 1, returning numerator as fraction");
    return {
      type: "Fraction",
      numerator: newNum,
      denominator: { type: "NumberLiteral", value: 1 }
    };
  }
  if (newNum.type === "NumberLiteral" && newNum.value === 0) {
    if (Array.isArray(steps))
      steps.push("Numerator is 0, returning 0 as fraction");
    return {
      type: "Fraction",
      numerator: { type: "NumberLiteral", value: 0 },
      denominator: newDen
    };
  }
  if (JSON.stringify(newNum) === JSON.stringify(numerator) && JSON.stringify(newDen) === JSON.stringify(denominator)) {
    if (Array.isArray(steps))
      steps.push("No reduction, returning original fraction");
    return { type: "Fraction", numerator, denominator };
  }
  if (Array.isArray(steps))
    steps.push("Reduction complete, returning reduced fraction");
  return { type: "Fraction", numerator: newNum, denominator: newDen };
}
__name(simplifyPolynomialFraction, "simplifyPolynomialFraction");
var DEFAULT_SIMPLIFY_OPTIONS$1 = {
  combineLikeTerms: true,
  expand: true,
  // Enable expansion by default for polynomial handling
  simplifyFractions: true,
  applyIdentities: true,
  convertSqrtToExponential: true,
  // Convert sqrt to exponential form by default
  advancedExponentialSimplification: true,
  // Apply advanced exponential simplification
  maxDepth: 10
};
function simplify$1(node, options = {}, steps) {
  const opts = { ...DEFAULT_SIMPLIFY_OPTIONS$1, ...options };
  if (!node)
    return node;
  try {
    let result = node;
    if (opts.convertSqrtToExponential) {
      const before = result;
      result = convertSqrtToExponential(result);
      if (Array.isArray(steps) && before !== result)
        steps.push(`Converted sqrt to exponential form: ${stepsAstToLatex(result)}`);
    }
    if (opts.advancedExponentialSimplification) {
      const before = result;
      result = enhancedExponentialSimplification(result);
      if (Array.isArray(steps) && before !== result)
        steps.push(`Applied advanced exponential simplification: ${stepsAstToLatex(result)}`);
    }
    if (result.type === "Fraction") {
      const before = result;
      result = simplifyPolynomialFraction(result.numerator, result.denominator, steps);
      if (Array.isArray(steps) && before !== result)
        steps.push(`Simplified fraction: ${stepsAstToLatex(result)}`);
      if (result.type === "Fraction") {
        const num = recursiveBasicSimplify(result.numerator, opts, 0);
        const den = recursiveBasicSimplify(result.denominator, opts, 0);
        const simplifiedFrac = { ...result, numerator: num, denominator: den };
        if (Array.isArray(steps))
          steps.push(`Finished basic simplification (fraction): ${stepsAstToLatex(simplifiedFrac)}`);
        return simplifiedFrac;
      }
    }
    if (opts.expand) {
      if (needsExpansion(result)) {
        if (Array.isArray(steps))
          steps.push("Detected need for expansion");
        const before = result;
        const expanded = expandExpression(result);
        if (Array.isArray(steps))
          steps.push("Applying basic simplification after expansion", stepsAstToLatex(expanded));
        const simplified2 = recursiveBasicSimplify(expanded, opts, 0);
        if (Array.isArray(steps))
          steps.push(`Finished basic simplification after expansion: ${stepsAstToLatex(simplified2)}`);
        return simplified2;
      }
    }
    if (Array.isArray(steps))
      steps.push("Applying basic simplification out", stepsAstToLatex(result));
    const simplified = recursiveBasicSimplify(result, opts, 0);
    if (Array.isArray(steps))
      steps.push(`Finished basic simplification: ${stepsAstToLatex(simplified)}`);
    return simplified;
  } catch (error) {
    if (Array.isArray(steps))
      steps.push("Simplification failed, returning original node: ", String(error));
    return node;
  }
}
__name(simplify$1, "simplify$1");
function needsExpansion(node) {
  if (node.type === "BinaryExpression") {
    if (node.operator === "*") {
      return hasComplexStructure(node.left) || hasComplexStructure(node.right);
    }
    return needsExpansion(node.left) || needsExpansion(node.right);
  }
  if (node.type === "UnaryExpression") {
    if (node.operator === "-" && hasComplexStructure(node.operand)) {
      return true;
    }
    return needsExpansion(node.operand);
  }
  return false;
}
__name(needsExpansion, "needsExpansion");
function hasComplexStructure(node) {
  if (node.type === "BinaryExpression") {
    if (node.operator === "+" || node.operator === "-") {
      return true;
    }
    if (node.operator === "*") {
      return hasComplexStructure(node.left) || hasComplexStructure(node.right);
    }
    return hasComplexStructure(node.left) || hasComplexStructure(node.right);
  }
  if (node.type === "UnaryExpression") {
    return hasComplexStructure(node.operand);
  }
  return false;
}
__name(hasComplexStructure, "hasComplexStructure");
function recursiveBasicSimplify(node, options, depth) {
  if (depth > options.maxDepth) {
    return node;
  }
  const basicSimplified = applyBasicSimplifications(node, options, depth);
  if (areEquivalentExpressions(node, basicSimplified)) {
    return basicSimplified;
  }
  return recursiveBasicSimplify(basicSimplified, options, depth + 1);
}
__name(recursiveBasicSimplify, "recursiveBasicSimplify");
function applyBasicSimplifications(node, options, depth) {
  if (options.applyIdentities) {
    const trigResult = applyTrigonometricIdentities(node);
    if (trigResult !== node)
      return trigResult;
  }
  switch (node.type) {
    case "NumberLiteral":
    case "Identifier":
      return node;
    case "UnaryExpression":
      return simplifyUnaryExpression(node, options, depth);
    case "BinaryExpression":
      return simplifyBinaryExpression(node, options, depth);
    case "FunctionCall": {
      {
        let extractFamousConstantValue = function(node2) {
          if (node2.type === "NumberLiteral")
            return node2.value;
          if (node2.type === "Identifier") {
            if (node2.name === "\u03C0" || node2.name === "pi")
              return Math.PI;
            if (node2.name === "e")
              return Math.E;
          }
          if (node2.type === "Fraction") {
            const num = extractFamousConstantValue(node2.numerator);
            const den = extractFamousConstantValue(node2.denominator);
            if (num !== void 0 && den !== void 0 && den !== 0) {
              return num / den;
            }
          }
          if (node2.type === "BinaryExpression") {
            const left = node2.left, right = node2.right;
            if (node2.operator === "*") {
              const lval = extractFamousConstantValue(left);
              const rval = extractFamousConstantValue(right);
              if (lval !== void 0 && rval !== void 0) {
                return lval * rval;
              }
            } else if (node2.operator === "/") {
              const lval = extractFamousConstantValue(left);
              const rval = extractFamousConstantValue(right);
              if (lval !== void 0 && rval !== void 0 && rval !== 0) {
                return lval / rval;
              }
            } else if (node2.operator === "+") {
              const lval = extractFamousConstantValue(left);
              const rval = extractFamousConstantValue(right);
              if (lval !== void 0 && rval !== void 0) {
                return lval + rval;
              }
            } else if (node2.operator === "-") {
              const lval = extractFamousConstantValue(left);
              const rval = extractFamousConstantValue(right);
              if (lval !== void 0 && rval !== void 0) {
                return lval - rval;
              }
            }
          }
          if (node2.type === "UnaryExpression") {
            const val = extractFamousConstantValue(node2.operand);
            if (val !== void 0) {
              if (node2.operator === "-")
                return -val;
              if (node2.operator === "+")
                return val;
            }
          }
          return void 0;
        };
        __name(extractFamousConstantValue, "extractFamousConstantValue");
        const simplifiedArgs = node.args.map((arg) => recursiveBasicSimplify(arg, options, depth + 1));
        const funcName = node.name;
        if (simplifiedArgs.length === 1) {
          const arg = simplifiedArgs[0];
          let argVal = void 0;
          argVal = extractFamousConstantValue(arg);
          if (argVal !== void 0 && typeof argVal === "number") {
            let result = void 0;
            switch (funcName) {
              case "sin":
                result = Math.sin(argVal);
                break;
              case "cos":
                result = Math.cos(argVal);
                break;
              case "tan":
                result = Math.tan(argVal);
                break;
              case "log":
              case "ln":
                result = Math.log(argVal);
                break;
              case "exp":
                result = Math.exp(argVal);
                break;
              case "sqrt":
                result = Math.sqrt(argVal);
                break;
              case "abs":
                result = Math.abs(argVal);
                break;
            }
            if (result !== void 0 && isFinite(result)) {
              if (Math.abs(result) < 1e-14)
                result = 0;
              if (Math.abs(result - 1) < 1e-14)
                result = 1;
              if (Math.abs(result + 1) < 1e-14)
                result = -1;
              return { type: "NumberLiteral", value: result };
            }
          }
        }
        return {
          ...node,
          args: simplifiedArgs
        };
      }
    }
    case "Fraction":
      return simplifyFraction(node, options, depth);
    case "Integral": {
      const result = {
        ...node,
        integrand: recursiveBasicSimplify(node.integrand, options, depth + 1)
      };
      if (node.lowerBound) {
        result.lowerBound = recursiveBasicSimplify(node.lowerBound, options, depth + 1);
      }
      if (node.upperBound) {
        result.upperBound = recursiveBasicSimplify(node.upperBound, options, depth + 1);
      }
      return result;
    }
    case "Sum":
    case "Product":
      return {
        ...node,
        expression: recursiveBasicSimplify(node.expression, options, depth + 1),
        lowerBound: recursiveBasicSimplify(node.lowerBound, options, depth + 1),
        upperBound: recursiveBasicSimplify(node.upperBound, options, depth + 1)
      };
    default:
      return node;
  }
}
__name(applyBasicSimplifications, "applyBasicSimplifications");
function simplifySubtraction(left, right, options, depth) {
  if (right.type === "NumberLiteral" && right.value === 0)
    return left;
  if (left.type === "NumberLiteral" && left.value === 0) {
    return { type: "UnaryExpression", operator: "-", operand: right };
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value - right.value };
  }
  if (areEquivalentExpressions(left, right)) {
    return { type: "NumberLiteral", value: 0 };
  }
  const negativeRight = {
    type: "UnaryExpression",
    operator: "-",
    operand: right
  };
  return simplifyAddition(left, negativeRight, options, depth);
}
__name(simplifySubtraction, "simplifySubtraction");
function simplifyMultiplication(left, right, options, depth) {
  if (left.type === "NumberLiteral" && left.value === 0 || right.type === "NumberLiteral" && right.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (left.type === "NumberLiteral" && left.value === 1)
    return right;
  if (right.type === "NumberLiteral" && right.value === 1)
    return left;
  if (right.type === "UnaryExpression" && right.operator === "-" && right.operand.type === "NumberLiteral" && right.operand.value === 1) {
    return { type: "UnaryExpression", operator: "-", operand: left };
  }
  if (left.type === "UnaryExpression" && left.operator === "-" && left.operand.type === "NumberLiteral" && left.operand.value === 1) {
    return { type: "UnaryExpression", operator: "-", operand: right };
  }
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value * right.value };
  }
  if (left.type === "Fraction" && right.type === "Fraction") {
    const newNumerator = simplifyMultiplication(left.numerator, right.numerator, options, depth + 1);
    const newDenominator = simplifyMultiplication(left.denominator, right.denominator, options, depth + 1);
    return simplifyFraction({
      numerator: newNumerator,
      denominator: newDenominator
    }, options, depth + 1);
  }
  if (left.type === "NumberLiteral" && right.type === "Fraction") {
    const newNumerator = simplifyMultiplication(left, right.numerator, options, depth + 1);
    return simplifyFraction({
      numerator: newNumerator,
      denominator: right.denominator
    }, options, depth + 1);
  }
  if (left.type === "Fraction" && right.type === "NumberLiteral") {
    const newNumerator = simplifyMultiplication(left.numerator, right, options, depth + 1);
    return simplifyFraction({
      numerator: newNumerator,
      denominator: left.denominator
    }, options, depth + 1);
  }
  if (right.type === "UnaryExpression" && right.operator === "-") {
    const positiveResult = simplifyMultiplication(left, right.operand, options, depth + 1);
    return { type: "UnaryExpression", operator: "-", operand: positiveResult };
  }
  if (left.type === "UnaryExpression" && left.operator === "-") {
    const positiveResult = simplifyMultiplication(left.operand, right, options, depth + 1);
    return { type: "UnaryExpression", operator: "-", operand: positiveResult };
  }
  if (left.type === "UnaryExpression" && left.operator === "-" && right.type === "UnaryExpression" && right.operator === "-") {
    return simplifyMultiplication(left.operand, right.operand, options, depth + 1);
  }
  if (left.type === "NumberLiteral" && left.value < 0) {
    return {
      type: "UnaryExpression",
      operator: "-",
      operand: simplifyMultiplication({ type: "NumberLiteral", value: -left.value }, right, options, depth + 1)
    };
  }
  if (right.type === "NumberLiteral" && right.value < 0) {
    return {
      type: "UnaryExpression",
      operator: "-",
      operand: simplifyMultiplication(left, { type: "NumberLiteral", value: -right.value }, options, depth + 1)
    };
  }
  if (options.combineLikeTerms) {
    const analyzed = AdvancedTermAnalyzer.analyze({
      type: "BinaryExpression",
      operator: "*",
      left,
      right
    });
    if (analyzed.coefficient !== 1 || analyzed.variables.size > 0) {
      const reconstructed = AdvancedTermCombiner["reconstructTerm"](analyzed, analyzed.coefficient);
      if (reconstructed) {
        return reconstructed;
      }
    }
  }
  if (options.advancedExponentialSimplification) {
    const multiplicationNode = {
      type: "BinaryExpression",
      operator: "*",
      left,
      right
    };
    const exponentialCombined = enhancedExponentialSimplification(multiplicationNode);
    if (!areEquivalentExpressions(multiplicationNode, exponentialCombined)) {
      return exponentialCombined;
    }
  }
  return { type: "BinaryExpression", operator: "*", left, right };
}
__name(simplifyMultiplication, "simplifyMultiplication");
function simplifyUnaryExpression(node, options, depth) {
  const operand = recursiveBasicSimplify(node.operand, options, depth + 1);
  if (node.operator === "-" && operand.type === "UnaryExpression" && operand.operator === "-") {
    return operand.operand;
  }
  if (node.operator === "-" && operand.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: -operand.value };
  }
  if (node.operator === "+") {
    return operand;
  }
  if (node.operator === "-" && operand.type === "BinaryExpression") {
    const binaryOperand = operand;
    const terms = extractAdditionTerms(binaryOperand);
    const negatedTerms = terms.map(({ term, sign }) => ({ term, sign: -sign }));
    const result = buildAdditionFromTerms(negatedTerms);
    return recursiveBasicSimplify(result, options, depth + 1);
  }
  return { ...node, operand };
}
__name(simplifyUnaryExpression, "simplifyUnaryExpression");
function simplifyBinaryExpression(node, options, depth) {
  const left = recursiveBasicSimplify(node.left, options, depth + 1);
  const right = recursiveBasicSimplify(node.right, options, depth + 1);
  switch (node.operator) {
    case "+":
      return simplifyAddition(left, right, options, depth);
    case "-":
      return simplifySubtraction(left, right, options, depth);
    case "*":
      return simplifyMultiplication(left, right, options, depth);
    case "/":
      return simplifyDivision(left, right);
    case "^":
      return simplifyPower(left, right);
    default:
      return { type: "BinaryExpression", operator: node.operator, left, right };
  }
}
__name(simplifyBinaryExpression, "simplifyBinaryExpression");
function simplifyAddition(left, right, options, depth) {
  if (left.type === "NumberLiteral" && left.value === 0)
    return right;
  if (right.type === "NumberLiteral" && right.value === 0)
    return left;
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: left.value + right.value };
  }
  if (left.type === "Fraction" && right.type === "Fraction") {
    const lnum = left.numerator, lden = left.denominator;
    const rnum = right.numerator, rden = right.denominator;
    return simplifyFraction({
      numerator: simplifyAddition(simplifyMultiplication(lnum, rden, options, depth + 1), simplifyMultiplication(rnum, lden, options, depth + 1), options, depth + 1),
      denominator: simplifyMultiplication(lden, rden, options, depth + 1)
    }, options, depth + 1);
  }
  if (left.type === "Fraction" && right.type === "NumberLiteral") {
    const lnum = left.numerator, lden = left.denominator;
    return simplifyFraction({
      numerator: simplifyAddition(lnum, simplifyMultiplication(right, lden, options, depth + 1), options, depth + 1),
      denominator: lden
    }, options, depth + 1);
  }
  if (left.type === "NumberLiteral" && right.type === "Fraction") {
    return simplifyAddition(right, left, options, depth);
  }
  if (options.combineLikeTerms) {
    const terms = extractAdditionTerms({ type: "BinaryExpression", operator: "+", left, right });
    const advancedTerms = terms.map((t) => ({
      term: t.term,
      sign: t.sign
    }));
    const simplified = AdvancedTermCombiner.combineTerms(advancedTerms);
    if (simplified.length === 0) {
      return { type: "NumberLiteral", value: 0 };
    }
    if (simplified.length === 1) {
      const term = simplified[0];
      if (term && term.sign === 1) {
        return term.term;
      } else if (term && term.sign === -1) {
        return { type: "UnaryExpression", operator: "-", operand: term.term };
      }
    }
    return buildAdditionFromTerms(simplified);
  }
  return { type: "BinaryExpression", operator: "+", left, right };
}
__name(simplifyAddition, "simplifyAddition");
function simplifyDivision(left, right) {
  if (left.type === "NumberLiteral" && left.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (right.type === "NumberLiteral" && right.value === 1)
    return left;
  if (left.type === "NumberLiteral" && right.type === "NumberLiteral" && right.value !== 0) {
    const result = left.value / right.value;
    if (Number.isInteger(result)) {
      return { type: "NumberLiteral", value: result };
    }
    const reduced = reduceFraction(left.value, right.value);
    if (reduced.den === 1) {
      return { type: "NumberLiteral", value: reduced.num };
    }
    return {
      type: "Fraction",
      numerator: { type: "NumberLiteral", value: reduced.num },
      denominator: { type: "NumberLiteral", value: reduced.den }
    };
  }
  if (areEquivalentExpressions(left, right)) {
    return { type: "NumberLiteral", value: 1 };
  }
  return { type: "Fraction", numerator: left, denominator: right };
}
__name(simplifyDivision, "simplifyDivision");
function simplifyPower(base, exponent) {
  if (exponent.type === "NumberLiteral" && exponent.value === 0) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (exponent.type === "NumberLiteral" && exponent.value === 1)
    return base;
  if (base.type === "NumberLiteral" && exponent.type === "NumberLiteral") {
    return { type: "NumberLiteral", value: Math.pow(base.value, exponent.value) };
  }
  return { type: "BinaryExpression", operator: "^", left: base, right: exponent };
}
__name(simplifyPower, "simplifyPower");
function simplifyFraction(node, options, depth) {
  let numerator = node.numerator;
  let denominator = node.denominator;
  if (numerator.type === "Fraction" && denominator.type === "Fraction") {
    const newNumerator = {
      type: "BinaryExpression",
      operator: "*",
      left: numerator.numerator,
      right: denominator.denominator
    };
    const newDenominator = {
      type: "BinaryExpression",
      operator: "*",
      left: numerator.denominator,
      right: denominator.numerator
    };
    return simplifyFraction({
      numerator: newNumerator,
      denominator: newDenominator
    }, options, depth + 1);
  }
  if (numerator.type === "Fraction") {
    const newDenominator = {
      type: "BinaryExpression",
      operator: "*",
      left: numerator.denominator,
      right: denominator
    };
    return simplifyFraction({
      numerator: numerator.numerator,
      denominator: newDenominator
    }, options, depth + 1);
  }
  if (denominator.type === "Fraction") {
    const newNumerator = {
      type: "BinaryExpression",
      operator: "*",
      left: numerator,
      right: denominator.denominator
    };
    return simplifyFraction({
      numerator: newNumerator,
      denominator: denominator.numerator
    }, options, depth + 1);
  }
  if (options.expand) {
    numerator = expandExpression(numerator);
    denominator = expandExpression(denominator);
  }
  numerator = recursiveBasicSimplify(numerator, options, depth + 1);
  denominator = recursiveBasicSimplify(denominator, options, depth + 1);
  if (denominator.type === "NumberLiteral" && denominator.value === 1) {
    return numerator;
  }
  if (numerator.type === "NumberLiteral" && numerator.value === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (numerator.type === "NumberLiteral" && denominator.type === "NumberLiteral" && denominator.value !== 0 && options.simplifyFractions) {
    const reduced = reduceFraction(numerator.value, denominator.value);
    if (reduced.den === 1) {
      return { type: "NumberLiteral", value: reduced.num };
    }
    return {
      type: "Fraction",
      numerator: { type: "NumberLiteral", value: reduced.num },
      denominator: { type: "NumberLiteral", value: reduced.den }
    };
  }
  if (options.simplifyFractions) {
    const simplified = draftSimplifyPolynomialFraction(numerator, denominator);
    if (simplified) {
      return simplified;
    }
  }
  return { type: "Fraction", numerator, denominator };
}
__name(simplifyFraction, "simplifyFraction");
function draftSimplifyPolynomialFraction(numerator, denominator) {
  if (areEquivalentExpressions(numerator, denominator)) {
    return { type: "NumberLiteral", value: 1 };
  }
  if (numerator.type === "BinaryExpression" && numerator.operator === "*") {
    if (areEquivalentExpressions(numerator.left, denominator)) {
      return numerator.right;
    }
    if (areEquivalentExpressions(numerator.right, denominator)) {
      return numerator.left;
    }
  }
  if (denominator.type === "BinaryExpression" && denominator.operator === "*") {
    if (areEquivalentExpressions(numerator, denominator.left)) {
      return {
        type: "Fraction",
        numerator: { type: "NumberLiteral", value: 1 },
        denominator: denominator.right
      };
    }
    if (areEquivalentExpressions(numerator, denominator.right)) {
      return {
        type: "Fraction",
        numerator: { type: "NumberLiteral", value: 1 },
        denominator: denominator.left
      };
    }
  }
  return null;
}
__name(draftSimplifyPolynomialFraction, "draftSimplifyPolynomialFraction");
function extractAdditionTerms(node) {
  if (node.type === "UnaryExpression" && node.operator === "-") {
    const innerTerms = extractAdditionTerms(node.operand);
    return innerTerms.map((t) => ({ term: t.term, sign: -t.sign }));
  }
  if (node.type === "UnaryExpression" && node.operator === "+") {
    return extractAdditionTerms(node.operand);
  }
  if (node.type !== "BinaryExpression") {
    return [{ term: node, sign: 1 }];
  }
  const expr = node;
  if (expr.operator === "+") {
    return [...extractAdditionTerms(expr.left), ...extractAdditionTerms(expr.right)];
  }
  if (expr.operator === "-") {
    const leftTerms = extractAdditionTerms(expr.left);
    const rightTerms = extractAdditionTerms(expr.right).map((t) => ({
      term: t.term,
      sign: -t.sign
    }));
    return [...leftTerms, ...rightTerms];
  }
  return [{ term: node, sign: 1 }];
}
__name(extractAdditionTerms, "extractAdditionTerms");
function buildAdditionFromTerms(terms) {
  if (terms.length === 0) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (terms.length === 1) {
    const term = terms[0];
    if (term && term.sign === 1) {
      return term.term;
    } else if (term && term.sign === -1) {
      return { type: "UnaryExpression", operator: "-", operand: term.term };
    }
  }
  function getDegree2(node) {
    if (node.type === "BinaryExpression" && node.operator === "^") {
      if (node.right.type === "NumberLiteral") {
        return typeof node.right.value === "number" ? node.right.value : 1;
      }
      return 1;
    }
    if (node.type === "Identifier")
      return 1;
    if (node.type === "NumberLiteral")
      return 0;
    if (node.type === "BinaryExpression" && node.operator === "*") {
      return Math.max(getDegree2(node.left), getDegree2(node.right));
    }
    return 0;
  }
  __name(getDegree2, "getDegree");
  const sorted = [...terms].sort((a, b) => getDegree2(b.term) - getDegree2(a.term));
  let result = sorted[0]?.term;
  if (!result)
    return { type: "NumberLiteral", value: 0 };
  if (sorted[0]?.sign === -1) {
    result = { type: "UnaryExpression", operator: "-", operand: result };
  }
  for (let i = 1; i < sorted.length; i++) {
    const term = sorted[i];
    if (!term)
      continue;
    if (term.sign === 1) {
      result = {
        type: "BinaryExpression",
        operator: "+",
        left: result,
        right: term.term
      };
    } else {
      result = {
        type: "BinaryExpression",
        operator: "-",
        left: result,
        right: term.term
      };
    }
  }
  return result;
}
__name(buildAdditionFromTerms, "buildAdditionFromTerms");
var _CommonFactorStrategy = class _CommonFactorStrategy {
  constructor() {
    this.name = "Common Factor";
    this.description = "Extract greatest common factors from polynomial terms";
    this.priority = 150;
  }
  canApply(node, context) {
    const terms = PolynomialAnalyzer.extractTerms(node);
    return terms.length >= 2 && this.hasCommonFactors(terms);
  }
  apply(node, context) {
    const steps = [];
    const terms = PolynomialAnalyzer.extractTerms(node);
    steps.push(`Analyzing ${terms.length} terms for common factors`);
    const coefficients = terms.map((term) => Math.abs(term.coefficient * term.sign));
    const numericGCD = PolynomialAnalyzer.findGCD(coefficients);
    const commonVariables = PolynomialAnalyzer.findCommonVariableFactors(terms);
    steps.push(`Numeric GCD: ${numericGCD}`);
    if (commonVariables.size > 0) {
      const varFactors = Array.from(commonVariables.entries()).map(([var_, power]) => power === 1 ? var_ : `${var_}^${power}`).join("");
      steps.push(`Common variable factors: ${varFactors}`);
    }
    if (numericGCD === 1 && commonVariables.size === 0) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["No common factors found"],
        strategyUsed: this.name,
        canContinue: true
      };
    }
    const factorParts = [];
    if (numericGCD > 1) {
      factorParts.push(ASTBuilder.number(numericGCD));
    }
    for (const [variable, power] of commonVariables) {
      if (power === 1) {
        factorParts.push(ASTBuilder.variable(variable));
      } else {
        factorParts.push(ASTBuilder.binary("^", ASTBuilder.variable(variable), ASTBuilder.number(power)));
      }
    }
    let commonFactor;
    if (factorParts.length === 0) {
      commonFactor = ASTBuilder.number(1);
    } else if (factorParts.length === 1) {
      commonFactor = factorParts[0];
    } else {
      commonFactor = factorParts.reduce((acc, part) => ASTBuilder.binary("*", acc, part));
    }
    const remainingTerms = [];
    for (const term of terms) {
      const coeff = term.coefficient * term.sign;
      let newCoeff = coeff;
      if (numericGCD > 1)
        newCoeff = coeff / numericGCD;
      const newVars = new Map(term.variables);
      for (const [v, pow] of commonVariables) {
        const tPow = newVars.get(v) || 0;
        const restPow = tPow - pow;
        if (restPow > 0)
          newVars.set(v, restPow);
        else
          newVars.delete(v);
      }
      let node2 = null;
      if (newCoeff === 0) {
        node2 = ASTBuilder.number(0);
      } else {
        const parts = [];
        if (Math.abs(newCoeff) !== 1 || newVars.size === 0)
          parts.push(ASTBuilder.number(newCoeff));
        for (const [v, pow] of newVars) {
          if (pow === 1)
            parts.push(ASTBuilder.variable(v));
          else
            parts.push(ASTBuilder.binary("^", ASTBuilder.variable(v), ASTBuilder.number(pow)));
        }
        if (parts.length === 0)
          node2 = ASTBuilder.number(1);
        else if (parts.length === 1)
          node2 = parts[0];
        else
          node2 = parts.reduce((acc, p) => ASTBuilder.binary("*", acc, p));
      }
      remainingTerms.push(node2);
    }
    let remainingExpression;
    if (remainingTerms.length === 1)
      remainingExpression = remainingTerms[0];
    else
      remainingExpression = remainingTerms.reduce((acc, t) => ASTBuilder.binary("+", acc, t));
    remainingExpression = simplify$1(remainingExpression);
    const result = ASTBuilder.binary("*", commonFactor, remainingExpression);
    steps.push(`Factored form: common factor times remaining expression`);
    return {
      success: true,
      ast: result,
      changed: true,
      steps,
      strategyUsed: this.name,
      canContinue: true
    };
  }
  hasCommonFactors(terms) {
    const coefficients = terms.map((term) => Math.abs(term.coefficient * term.sign));
    if (PolynomialAnalyzer.findGCD(coefficients) > 1) {
      return true;
    }
    const commonVariables = PolynomialAnalyzer.findCommonVariableFactors(terms);
    return commonVariables.size > 0;
  }
};
__name(_CommonFactorStrategy, "CommonFactorStrategy");
var CommonFactorStrategy = _CommonFactorStrategy;
var _DifferenceOfSquaresStrategy = class _DifferenceOfSquaresStrategy {
  constructor() {
    this.name = "Difference of Squares";
    this.description = "Factor expressions of the form a\xB2 - b\xB2 into (a + b)(a - b)";
    this.priority = 140;
  }
  canApply(node, context) {
    return this.isDifferenceOfSquares(node);
  }
  apply(node, context) {
    const steps = [];
    try {
      if (!this.isDifferenceOfSquares(node)) {
        return {
          success: false,
          ast: node,
          changed: false,
          steps: ["Not a difference of squares"],
          strategyUsed: this.name,
          canContinue: false
        };
      }
      const binaryNode = node;
      let leftSquareRoot = null;
      let rightSquareRoot = null;
      if (binaryNode.operator === "-") {
        leftSquareRoot = this.extractSquareRoot(binaryNode.left);
        rightSquareRoot = this.extractSquareRoot(binaryNode.right);
      } else if (binaryNode.operator === "+" && binaryNode.right.type === "UnaryExpression" && binaryNode.right.operator === "-") {
        leftSquareRoot = this.extractSquareRoot(binaryNode.left);
        rightSquareRoot = this.extractSquareRoot(binaryNode.right.operand);
      }
      if (!leftSquareRoot || !rightSquareRoot) {
        return {
          success: false,
          ast: node,
          changed: false,
          steps: ["Could not extract square roots"],
          strategyUsed: this.name,
          canContinue: false
        };
      }
      steps.push(`Identified difference of squares: (${astToLatex(leftSquareRoot)})\xB2 - (${astToLatex(rightSquareRoot)})\xB2`);
      steps.push("Applying formula: a\xB2 - b\xB2 = (a + b)(a - b)");
      const sumFactor = ASTBuilder.add(leftSquareRoot, rightSquareRoot);
      const differenceFactor = ASTBuilder.subtract(leftSquareRoot, rightSquareRoot);
      const result = ASTBuilder.multiply(sumFactor, differenceFactor);
      steps.push(`Result: (${astToLatex(leftSquareRoot)} + ${astToLatex(rightSquareRoot)})(${astToLatex(leftSquareRoot)} - ${astToLatex(rightSquareRoot)})`);
      return {
        success: true,
        ast: result,
        changed: true,
        steps,
        strategyUsed: this.name,
        canContinue: false
        // Allow further factorization of the result
      };
    } catch (error) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: [`Error: ${error instanceof Error ? error.message : "Unknown error"}`],
        strategyUsed: this.name,
        canContinue: false
      };
    }
  }
  /**
   * Check if expression is a difference of squares
   */
  isDifferenceOfSquares(node) {
    if (node.type === "BinaryExpression" && node.operator === "-") {
      const leftIsSquare = this.isSquareExpression(node.left);
      const rightIsSquare = this.isSquareExpression(node.right);
      return leftIsSquare && rightIsSquare;
    }
    if (node.type === "BinaryExpression" && node.operator === "+") {
      if (node.right.type === "UnaryExpression" && node.right.operator === "-") {
        const leftIsSquare = this.isSquareExpression(node.left);
        const rightIsSquare = this.isSquareExpression(node.right.operand);
        return leftIsSquare && rightIsSquare;
      }
    }
    return false;
  }
  /**
   * Check if expression is a perfect square
   */
  isSquareExpression(node) {
    if (node.type === "BinaryExpression" && node.operator === "^") {
      if (node.right.type === "NumberLiteral" && node.right.value === 2) {
        return true;
      }
      if (node.right.type === "NumberLiteral" && node.right.value % 2 === 0) {
        return true;
      }
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      if (this.areEquivalentExpressions(node.left, node.right)) {
        return true;
      }
      if (node.left.type === "NumberLiteral") {
        const coeff = node.left.value;
        const coeffSqrt = Math.sqrt(Math.abs(coeff));
        return Number.isInteger(coeffSqrt) && this.isSquareExpression(node.right);
      }
      if (node.right.type === "NumberLiteral") {
        const coeff = node.right.value;
        const coeffSqrt = Math.sqrt(Math.abs(coeff));
        return Number.isInteger(coeffSqrt) && this.isSquareExpression(node.left);
      }
    }
    if (node.type === "NumberLiteral") {
      const sqrt = Math.sqrt(Math.abs(node.value));
      return Number.isInteger(sqrt);
    }
    return false;
  }
  /**
   * Extract the square root of a square expression
   */
  extractSquareRoot(node) {
    if (node.type === "BinaryExpression" && node.operator === "^") {
      if (node.right.type === "NumberLiteral") {
        if (node.right.value === 2) {
          return node.left;
        }
        if (node.right.value % 2 === 0) {
          const halfPower = node.right.value / 2;
          return ASTBuilder.binary("^", node.left, ASTBuilder.number(halfPower));
        }
      }
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      if (this.areEquivalentExpressions(node.left, node.right)) {
        return node.left;
      }
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      if (node.left.type === "NumberLiteral") {
        const coeff = node.left.value;
        const coeffSqrt = Math.sqrt(Math.abs(coeff));
        const rightRoot = this.extractSquareRoot(node.right);
        if (Number.isInteger(coeffSqrt) && rightRoot) {
          return ASTBuilder.multiply(ASTBuilder.number(coeffSqrt), rightRoot);
        }
      }
      if (node.right.type === "NumberLiteral") {
        const coeff = node.right.value;
        const coeffSqrt = Math.sqrt(Math.abs(coeff));
        const leftRoot = this.extractSquareRoot(node.left);
        if (Number.isInteger(coeffSqrt) && leftRoot) {
          return ASTBuilder.multiply(leftRoot, ASTBuilder.number(coeffSqrt));
        }
      }
    }
    if (node.type === "NumberLiteral") {
      const sqrt = Math.sqrt(Math.abs(node.value));
      if (Number.isInteger(sqrt)) {
        return ASTBuilder.number(sqrt);
      }
    }
    if (node.type === "Identifier") {
      return node;
    }
    return null;
  }
  /**
   * Check if two expressions are equivalent
   */
  areEquivalentExpressions(left, right) {
    if (left.type !== right.type) {
      return false;
    }
    switch (left.type) {
      case "NumberLiteral":
        return Math.abs(left.value - right.value) < 1e-10;
      case "Identifier":
        return left.name === right.name;
      case "BinaryExpression": {
        const rightBinary = right;
        return left.operator === rightBinary.operator && this.areEquivalentExpressions(left.left, rightBinary.left) && this.areEquivalentExpressions(left.right, rightBinary.right);
      }
      case "UnaryExpression": {
        const rightUnary = right;
        return left.operator === rightUnary.operator && this.areEquivalentExpressions(left.operand, rightUnary.operand);
      }
      default:
        return false;
    }
  }
};
__name(_DifferenceOfSquaresStrategy, "DifferenceOfSquaresStrategy");
var DifferenceOfSquaresStrategy = _DifferenceOfSquaresStrategy;
var _GroupingStrategy = class _GroupingStrategy {
  constructor() {
    this.name = "Factorization by Grouping";
    this.description = "Factor polynomials by grouping terms and extracting common factors";
    this.priority = 100;
    this.commonFactorStrategy = new CommonFactorStrategy();
  }
  canApply(node, context) {
    const terms = this.extractTerms(node);
    return terms.length >= 4;
  }
  apply(node, context) {
    const steps = [];
    try {
      const terms = this.extractTerms(node);
      if (terms.length < 4) {
        return {
          success: false,
          ast: node,
          changed: false,
          steps: ["Need at least 4 terms for grouping"],
          strategyUsed: this.name,
          canContinue: false
        };
      }
      steps.push(`Found ${terms.length} terms: 
        ${terms.map((t) => stepsAstToLatex(t.term, t.sign > 0 ? "" : "-")).join(",")}`);
      const groupingPatterns = this.generateGroupingPatterns(terms.length);
      for (let i = 0; i < groupingPatterns.length; i++) {
        const pattern = groupingPatterns[i];
        steps.push(`Trying grouping pattern ${i + 1}: ${pattern.map((g) => `(${g.join(", ")})`).join(" + ")}`);
        const result = this.tryGroupingPattern(terms, pattern, context, steps);
        if (result) {
          return {
            success: true,
            ast: result.ast,
            changed: true,
            steps: result.steps,
            strategyUsed: this.name,
            canContinue: true
          };
        }
      }
      return {
        success: true,
        ast: node,
        changed: false,
        steps: [...steps, "No successful grouping pattern found"],
        strategyUsed: this.name,
        canContinue: true
      };
    } catch (error) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: [`Error: ${error instanceof Error ? error.message : "Unknown error"}`],
        strategyUsed: this.name,
        canContinue: false
      };
    }
  }
  /**
   * Extract all terms from expression
   */
  extractTerms(node) {
    const terms = [];
    const extractRecursive = /* @__PURE__ */ __name((n, currentSign) => {
      if (n.type === "BinaryExpression") {
        if (n.operator === "+") {
          extractRecursive(n.left, currentSign);
          extractRecursive(n.right, currentSign);
        } else if (n.operator === "-") {
          extractRecursive(n.left, currentSign);
          extractRecursive(n.right, -currentSign);
        } else {
          terms.push({ term: n, sign: currentSign });
        }
      } else {
        terms.push({ term: n, sign: currentSign });
      }
    }, "extractRecursive");
    extractRecursive(node, 1);
    return terms;
  }
  /**
   * Generate different grouping patterns for n terms
   */
  generateGroupingPatterns(n) {
    const patterns = [];
    if (n === 4) {
      patterns.push([
        [0, 1],
        [2, 3]
        // (term1 + term2) + (term3 + term4)
      ]);
      patterns.push([
        [0, 2],
        [1, 3]
        // (term1 + term3) + (term2 + term4)
      ]);
      patterns.push([
        [0, 3],
        [1, 2]
        // (term1 + term4) + (term2 + term3)
      ]);
    } else if (n === 6) {
      patterns.push([
        [0, 1, 2],
        [3, 4, 5]
      ]);
      patterns.push([
        [0, 2, 4],
        [1, 3, 5]
      ]);
      patterns.push([
        [0, 1],
        [2, 3],
        [4, 5]
      ]);
    } else {
      const mid = Math.floor(n / 2);
      const firstHalf = Array.from({ length: mid }, (_, i) => i);
      const secondHalf = Array.from({ length: n - mid }, (_, i) => i + mid);
      patterns.push([firstHalf, secondHalf]);
    }
    return patterns;
  }
  /**
   * Try a specific grouping pattern
   */
  tryGroupingPattern(terms, pattern, context, steps) {
    const groups = [];
    const groupFactors = [];
    for (let i = 0; i < pattern.length; i++) {
      const groupIndices = pattern[i];
      const groupTerms = groupIndices.map((idx) => terms[idx]);
      steps.push(`Group ${i + 1}: ${groupTerms.map((t) => `${t.sign > 0 ? "+" : "-"}${astToLatex(t.term)}`).join(" ")}`);
      const groupExpression = this.buildExpression(groupTerms);
      const factorResult = this.commonFactorStrategy.apply(groupExpression, context);
      if (factorResult.success && factorResult.changed) {
        const { commonFactor, remaining } = this.extractFactorAndRemainder(factorResult.ast);
        if (commonFactor && remaining) {
          groups.push(remaining);
          groupFactors.push(commonFactor);
          steps.push(`Factored group ${i + 1}: ${stepsAstToLatex(commonFactor)} * (${stepsAstToLatex(remaining)})`);
        } else {
          groups.push(groupExpression);
          groupFactors.push(ASTBuilder.number(1));
        }
      } else {
        groups.push(groupExpression);
        groupFactors.push(ASTBuilder.number(1));
      }
    }
    if (groups.length < 2) {
      return null;
    }
    const firstGroup = groups[0];
    const allGroupsSame = groups.every((group) => this.areEquivalentExpressions(group, firstGroup));
    if (!allGroupsSame) {
      steps.push("Groups do not have common factors after factoring");
      return null;
    }
    steps.push(`All groups have common factor: ${astToLatex(firstGroup)}`);
    let coefficientSum = groupFactors[0];
    for (let i = 1; i < groupFactors.length; i++) {
      coefficientSum = ASTBuilder.add(coefficientSum, groupFactors[i]);
    }
    let result = ASTBuilder.multiply(coefficientSum, firstGroup);
    steps.push(`[Grouping] Final result: (${astToLatex(coefficientSum)}) * (${astToLatex(firstGroup)})`);
    result = simplify$1(result, { expand: false });
    return { ast: result, steps: [...steps] };
  }
  /**
   * Extract common factor and remainder from factored expression
   */
  extractFactorAndRemainder(node) {
    if (node.type === "BinaryExpression" && node.operator === "*") {
      return {
        commonFactor: node.left,
        remaining: node.right
      };
    }
    return {
      commonFactor: null,
      remaining: node
    };
  }
  /**
   * Build expression from terms with signs
   */
  buildExpression(terms) {
    if (terms.length === 0) {
      return ASTBuilder.number(0);
    }
    if (terms.length === 1) {
      const { term, sign } = terms[0];
      return sign === 1 ? term : ASTBuilder.multiply(ASTBuilder.number(-1), term);
    }
    let result = terms[0].sign === 1 ? terms[0].term : ASTBuilder.multiply(ASTBuilder.number(-1), terms[0].term);
    for (let i = 1; i < terms.length; i++) {
      const { term, sign } = terms[i];
      if (sign === 1) {
        result = ASTBuilder.add(result, term);
      } else {
        result = ASTBuilder.subtract(result, term);
      }
    }
    return result;
  }
  /**
   * Check if two expressions are equivalent
   */
  areEquivalentExpressions(left, right) {
    if (left.type !== right.type) {
      return false;
    }
    switch (left.type) {
      case "NumberLiteral":
        return Math.abs(left.value - right.value) < 1e-10;
      case "Identifier":
        return left.name === right.name;
      case "BinaryExpression": {
        const rightBinary = right;
        if (left.operator === rightBinary.operator && this.areEquivalentExpressions(left.left, rightBinary.left) && this.areEquivalentExpressions(left.right, rightBinary.right)) {
          return true;
        }
        if ((left.operator === "+" || left.operator === "*") && left.operator === rightBinary.operator && this.areEquivalentExpressions(left.left, rightBinary.right) && this.areEquivalentExpressions(left.right, rightBinary.left)) {
          return true;
        }
        return false;
      }
      case "UnaryExpression": {
        const rightUnary = right;
        return left.operator === rightUnary.operator && this.areEquivalentExpressions(left.operand, rightUnary.operand);
      }
      default:
        return false;
    }
  }
};
__name(_GroupingStrategy, "GroupingStrategy");
var GroupingStrategy = _GroupingStrategy;
var _ModularArithmetic = class _ModularArithmetic {
  /**
   * Compute (a + b) mod p
   */
  static add(a, b, p) {
    return ((a + b) % p + p) % p;
  }
  /**
   * Compute (a - b) mod p
   */
  static subtract(a, b, p) {
    return ((a - b) % p + p) % p;
  }
  /**
   * Compute (a * b) mod p
   */
  static multiply(a, b, p) {
    return (a * b % p + p) % p;
  }
  /**
   * Compute a^exp mod p using binary exponentiation
   */
  static power(a, exp, p) {
    if (exp === 0)
      return 1;
    if (exp === 1)
      return (a % p + p) % p;
    let result = 1;
    let base = (a % p + p) % p;
    let exponent = exp;
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = this.multiply(result, base, p);
      }
      base = this.multiply(base, base, p);
      exponent = Math.floor(exponent / 2);
    }
    return result;
  }
  /**
   * Compute modular inverse of a mod p using extended Euclidean algorithm
   * Returns null if inverse doesn't exist
   */
  static inverse(a, p) {
    const [gcd2, x] = this.extendedGcd(a, p);
    if (gcd2 !== 1)
      return null;
    return (x % p + p) % p;
  }
  /**
   * Extended Euclidean algorithm
   * Returns [gcd(a, b), x, y] where ax + by = gcd(a, b)
   */
  static extendedGcd(a, b) {
    if (b === 0)
      return [a, 1, 0];
    const [gcd2, x1, y1] = this.extendedGcd(b, a % b);
    const x = y1;
    const y = x1 - Math.floor(a / b) * y1;
    return [gcd2, x, y];
  }
  /**
   * Check if a number is prime (simple trial division)
   */
  static isPrime(n) {
    if (n < 2)
      return false;
    if (n === 2)
      return true;
    if (n % 2 === 0)
      return false;
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0)
        return false;
    }
    return true;
  }
};
__name(_ModularArithmetic, "ModularArithmetic");
var ModularArithmetic = _ModularArithmetic;
var _FiniteFieldPolynomial = class _FiniteFieldPolynomial {
  constructor(coefficients, prime) {
    this.coefficients = coefficients;
    this.prime = prime;
    this.coefficients = coefficients.map((c) => (c % prime + prime) % prime);
    this.removeLeadingZeros();
  }
  /**
   * Remove leading zero coefficients
   */
  removeLeadingZeros() {
    while (this.coefficients.length > 1 && this.coefficients[this.coefficients.length - 1] === 0) {
      this.coefficients.pop();
    }
  }
  /**
   * Get the degree of the polynomial
   */
  get degree() {
    return this.coefficients.length - 1;
  }
  /**
   * Check if polynomial is zero
   */
  get isZero() {
    return this.coefficients.length === 1 && this.coefficients[0] === 0;
  }
  /**
   * Add two polynomials in finite field
   */
  add(other) {
    if (this.prime !== other.prime) {
      throw new Error("Cannot add polynomials with different primes");
    }
    const maxLength = Math.max(this.coefficients.length, other.coefficients.length);
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const a = this.coefficients[i] || 0;
      const b = other.coefficients[i] || 0;
      result.push(ModularArithmetic.add(a, b, this.prime));
    }
    return new _FiniteFieldPolynomial(result, this.prime);
  }
  /**
   * Subtract two polynomials in finite field
   */
  subtract(other) {
    if (this.prime !== other.prime) {
      throw new Error("Cannot subtract polynomials with different primes");
    }
    const maxLength = Math.max(this.coefficients.length, other.coefficients.length);
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const a = this.coefficients[i] || 0;
      const b = other.coefficients[i] || 0;
      result.push(ModularArithmetic.subtract(a, b, this.prime));
    }
    return new _FiniteFieldPolynomial(result, this.prime);
  }
  /**
   * Multiply two polynomials in finite field
   */
  multiply(other) {
    if (this.prime !== other.prime) {
      throw new Error("Cannot multiply polynomials with different primes");
    }
    if (this.isZero || other.isZero) {
      return new _FiniteFieldPolynomial([0], this.prime);
    }
    const resultDegree = this.degree + other.degree;
    const result = new Array(resultDegree + 1).fill(0);
    for (let i = 0; i < this.coefficients.length; i++) {
      for (let j = 0; j < other.coefficients.length; j++) {
        const coeff = ModularArithmetic.multiply(this.coefficients[i] || 0, other.coefficients[j] || 0, this.prime);
        result[i + j] = ModularArithmetic.add(result[i + j] || 0, coeff, this.prime);
      }
    }
    return new _FiniteFieldPolynomial(result, this.prime);
  }
  /**
   * Compute polynomial division with remainder
   * Returns [quotient, remainder]
   */
  divmod(divisor) {
    if (this.prime !== divisor.prime) {
      throw new Error("Cannot divide polynomials with different primes");
    }
    if (divisor.isZero) {
      throw new Error("Division by zero polynomial");
    }
    const remainder = new _FiniteFieldPolynomial([...this.coefficients], this.prime);
    const quotientCoeffs = [];
    const divisorLeadCoeff = Number(divisor.coefficients[divisor.degree]);
    const divisorLeadInverse = ModularArithmetic.inverse(divisorLeadCoeff, this.prime);
    if (divisorLeadInverse === null) {
      throw new Error("Leading coefficient is not invertible");
    }
    while (remainder.degree >= divisor.degree && !remainder.isZero) {
      const leadCoeff = Number(remainder.coefficients[remainder.degree]);
      const quotCoeff = ModularArithmetic.multiply(leadCoeff, divisorLeadInverse, this.prime);
      const degreeDiff = remainder.degree - divisor.degree;
      while (quotientCoeffs.length <= degreeDiff) {
        quotientCoeffs.push(0);
      }
      quotientCoeffs[degreeDiff] = quotCoeff;
      for (let i = 0; i <= divisor.degree; i++) {
        const pos = i + degreeDiff;
        if (pos < remainder.coefficients.length) {
          const subtrahend = ModularArithmetic.multiply(divisor.coefficients[i] || 0, quotCoeff, this.prime);
          remainder.coefficients[pos] = ModularArithmetic.subtract(remainder.coefficients[pos] || 0, subtrahend, this.prime);
        }
      }
      remainder.removeLeadingZeros();
    }
    const quotient = new _FiniteFieldPolynomial(quotientCoeffs.reverse(), this.prime);
    return [quotient, remainder];
  }
  /**
   * Compute GCD of two polynomials using Euclidean algorithm
   */
  gcd(other) {
    if (this.prime !== other.prime) {
      throw new Error("Cannot compute GCD of polynomials with different primes");
    }
    let a = new _FiniteFieldPolynomial([...this.coefficients], this.prime);
    let b = new _FiniteFieldPolynomial([...other.coefficients], this.prime);
    while (!b.isZero) {
      const [, remainder] = a.divmod(b);
      a = b;
      b = remainder;
    }
    if (!a.isZero) {
      const leadCoeff = Number(a.coefficients[a.degree]);
      const leadInverse = ModularArithmetic.inverse(leadCoeff, this.prime);
      if (leadInverse !== null) {
        const newCoeffs = a.coefficients.map((c) => ModularArithmetic.multiply(c, leadInverse, this.prime));
        return new _FiniteFieldPolynomial(newCoeffs, this.prime);
      }
    }
    return a;
  }
  /**
   * Evaluate polynomial at a given point
   */
  evaluate(x) {
    let result = 0;
    let power = 1;
    for (const coeff of this.coefficients) {
      result = ModularArithmetic.add(result, ModularArithmetic.multiply(coeff, power, this.prime), this.prime);
      power = ModularArithmetic.multiply(power, x, this.prime);
    }
    return result;
  }
  /**
   * Create a copy of the polynomial
   */
  clone() {
    return new _FiniteFieldPolynomial([...this.coefficients], this.prime);
  }
  /**
   * Convert to string representation
   */
  toString() {
    if (this.isZero)
      return "0";
    const terms = [];
    for (let i = this.degree; i >= 0; i--) {
      const coeff = Number(this.coefficients[i]);
      if (coeff === 0)
        continue;
      let term = "";
      if (i === 0) {
        term = coeff.toString();
      } else if (i === 1) {
        term = coeff === 1 ? "x" : `${coeff}x`;
      } else {
        term = coeff === 1 ? `x^${i}` : `${coeff}x^${i}`;
      }
      terms.push(term);
    }
    return terms.join(" + ");
  }
};
__name(_FiniteFieldPolynomial, "FiniteFieldPolynomial");
var FiniteFieldPolynomial = _FiniteFieldPolynomial;
var _BerlekampAlgorithm = class _BerlekampAlgorithm {
  /**
   * Factor a square-free polynomial in a finite field
   *
   * @param coefficients - Polynomial coefficients (constant term first)
   * @param prime - Prime for finite field
   * @returns Array of irreducible factor polynomials
   */
  factorInFiniteField(coefficients, prime, steps) {
    const polynomial = new FiniteFieldPolynomial(coefficients, prime);
    if (polynomial.degree <= 1) {
      return [coefficients];
    }
    try {
      const Q = this.constructBerlekampMatrix(polynomial, prime);
      if (steps)
        steps.push(`[BZ:FF] Berlekamp\u884C\u5217Q: ${JSON.stringify(Q)}`);
      const nullSpace = this.findNullSpace(Q, prime);
      if (nullSpace.length <= 1) {
        if (steps)
          steps.push(`[BZ:FF] Null\u7A7A\u9593\u6B21\u51431\u2192\u65E2\u7D04`);
        return [coefficients];
      }
      const nonConstNulls = nullSpace.filter((v) => v.some((c, i) => i > 0 && c !== 0));
      const factors = this.extractFactors(polynomial, nonConstNulls, prime, steps);
      if (steps)
        steps.push(`[BZ:FF] \u6709\u9650\u4F53\u56E0\u6570\u5206\u89E3\u7D50\u679C: ${JSON.stringify(factors.map((f) => f.coefficients))}`);
      return factors.map((factor) => factor.coefficients);
    } catch (error) {
      if (steps)
        steps.push(`[BZ:FF] \u4F8B\u5916\u767A\u751F: ${error instanceof Error ? error.message : String(error)}`);
      return [coefficients];
    }
  }
  /**
   * Construct the Berlekamp matrix Q
   * Q[i,j] = coefficient of x^j in x^(p*i) mod f(x)
   */
  constructBerlekampMatrix(polynomial, prime) {
    const n = polynomial.degree;
    const Q = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      const powerPoly = this.computeXPowerMod(prime * i, polynomial, prime);
      for (let j = 0; j < n; j++) {
        let val = 0;
        if (powerPoly.coefficients && Array.isArray(powerPoly.coefficients)) {
          const v = powerPoly.coefficients[j];
          val = typeof v === "number" && Number.isFinite(v) ? v : 0;
        }
        if (!Q[i])
          Q[i] = Array(n).fill(0);
        Q[i][j] = val;
      }
    }
    return Q;
  }
  /**
   * Compute x^exp mod polynomial in finite field
   */
  computeXPowerMod(exp, polynomial, prime) {
    let result = new FiniteFieldPolynomial([1], prime);
    let base = new FiniteFieldPolynomial([0, 1], prime);
    let e = exp;
    while (e > 0) {
      if (e % 2 === 1) {
        result = result.multiply(base);
        const [, remainder] = result.divmod(polynomial);
        result = remainder;
      }
      e = Math.floor(e / 2);
      if (e > 0) {
        base = base.multiply(base);
        const [, remainder] = base.divmod(polynomial);
        base = remainder;
      }
    }
    return result;
  }
  /**
   * Find null space of (Q - I) matrix over finite field
   */
  findNullSpace(Q, prime) {
    const n = Q.length;
    const QMinusI = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const qVal = Q[i][j];
        QMinusI[i][j] = Number(qVal);
        if (i === j) {
          QMinusI[i][j] = ModularArithmetic.subtract(Number(QMinusI[i][j]), 1, prime);
        }
      }
    }
    return this.gaussianEliminationNullSpace(QMinusI, prime);
  }
  /**
   * Gaussian elimination to find null space over finite field
   */
  gaussianEliminationNullSpace(matrix, prime) {
    const m = matrix.length;
    const n = matrix[0]?.length ?? 0;
    const augmented = matrix.map((row) => [...row]);
    let rank = 0;
    const pivotCols = [];
    for (let col = 0; col < n && rank < m; col++) {
      let pivotRow = -1;
      for (let row = rank; row < m; row++) {
        if ((augmented[row]?.[col] ?? 0) !== 0) {
          pivotRow = row;
          break;
        }
      }
      if (pivotRow === -1)
        continue;
      if (pivotRow !== rank) {
        const temp = augmented[rank];
        augmented[rank] = augmented[pivotRow] ?? [];
        augmented[pivotRow] = temp ?? [];
      }
      pivotCols.push(col);
      const pivotElement = augmented[rank]?.[col] ?? 0;
      const pivotInverse = ModularArithmetic.inverse(pivotElement, prime);
      if (pivotInverse === null)
        continue;
      for (let j = 0; j < n; j++) {
        augmented[rank][j] = ModularArithmetic.multiply(Number(augmented[rank][j]), pivotInverse, prime);
      }
      for (let i = 0; i < m; i++) {
        if (i !== rank && (augmented[i]?.[col] ?? 0) !== 0) {
          const factor = augmented[i]?.[col] ?? 0;
          for (let j = 0; j < n; j++) {
            const subtract = ModularArithmetic.multiply(factor, augmented[rank]?.[j] ?? 0, prime);
            augmented[i][j] = ModularArithmetic.subtract(Number(augmented[i][j]), subtract, prime);
          }
        }
      }
      rank++;
    }
    const nullSpace = [];
    const freeCols = [];
    for (let col = 0; col < n; col++) {
      if (!pivotCols.includes(col)) {
        freeCols.push(col);
      }
    }
    for (const freeCol of freeCols) {
      const vector = new Array(n).fill(0);
      vector[freeCol] = 1;
      for (let i = rank - 1; i >= 0; i--) {
        const pivotCol = pivotCols[i];
        if (pivotCol !== void 0 && pivotCol < n) {
          vector[pivotCol] = ModularArithmetic.subtract(0, augmented[i]?.[freeCol] ?? 0, prime);
        }
      }
      nullSpace.push(vector);
    }
    return nullSpace;
  }
  /**
   * Extract factors using null space vectors
   */
  extractFactors(polynomial, nullSpace, prime, steps) {
    const factors = [polynomial.clone()];
    for (const nullVector of nullSpace) {
      const newFactors = [];
      for (const factor of factors) {
        if (factor.degree <= 1) {
          newFactors.push(factor);
          continue;
        }
        const subFactors = this.splitUsingNullVector(factor, nullVector, prime, steps);
        if (steps)
          steps.push(`[BZ:FF] nullVector=${JSON.stringify(nullVector)}\u3067\u5206\u5272: ${subFactors.map((f) => JSON.stringify(f.coefficients)).join(" | ")}`);
        newFactors.push(...subFactors);
      }
      factors.length = 0;
      factors.push(...newFactors);
    }
    return factors;
  }
  /**
   * Split a polynomial using a null space vector
   */
  splitUsingNullVector(factor, nullVector, prime, steps) {
    const nullPoly = new FiniteFieldPolynomial(nullVector, prime);
    for (let a = 0; a < prime; a++) {
      const constantPoly = new FiniteFieldPolynomial([a], prime);
      const testPoly = nullPoly.subtract(constantPoly);
      const gcdResult = factor.gcd(testPoly);
      if (steps)
        steps.push(`[BZ:FF] split: a=${a}, gcd=${JSON.stringify(gcdResult.coefficients)}`);
      if (!gcdResult.isZero && gcdResult.degree > 0 && gcdResult.degree < factor.degree) {
        const [quotient] = factor.divmod(gcdResult);
        if (steps)
          steps.push(`[BZ:FF] \u5206\u5272\u6210\u529F: gcd=${JSON.stringify(gcdResult.coefficients)}, quotient=${JSON.stringify(quotient.coefficients)}`);
        return [gcdResult, quotient];
      }
    }
    if (steps)
      steps.push(`[BZ:FF] \u5206\u5272\u5931\u6557: ${JSON.stringify(factor.coefficients)}`);
    return [factor];
  }
};
__name(_BerlekampAlgorithm, "BerlekampAlgorithm");
var BerlekampAlgorithm = _BerlekampAlgorithm;
var _HenselLifting = class _HenselLifting {
  /**
   * Lift factors from mod p to mod p^k using Hensel's lemma
   *
   * @param originalCoeffs - Original polynomial coefficients
   * @param factorCoeffs - Factor coefficients in finite field
   * @param prime - Prime used in finite field
   * @param targetPrecision - Target precision (p^k)
   * @returns Array of lifted factor coefficients
   */
  liftFactors(originalCoeffs, factorCoeffs, prime, targetPrecision, steps) {
    if (factorCoeffs.length <= 1) {
      if (steps)
        steps.push(`[Hensel] 1\u56E0\u5B50\u306A\u306E\u3067\u30EA\u30D5\u30C8\u4E0D\u8981`);
      return factorCoeffs;
    }
    const triedPrimes = [];
    let currentPrime = prime;
    let lastError = null;
    const primeCandidates = [3, 5, 7, 11, 13];
    if (prime !== 2 && !primeCandidates.includes(prime))
      primeCandidates.unshift(prime);
    for (const p of primeCandidates) {
      if (triedPrimes.includes(p))
        continue;
      triedPrimes.push(p);
      currentPrime = p;
      try {
        let divisors = function(n) {
          n = Math.abs(n);
          if (n === 0)
            return [1, -1];
          const divs = /* @__PURE__ */ new Set();
          for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
              divs.add(i);
              divs.add(n / i);
            }
          }
          return Array.from(divs).flatMap((d) => [d, -d]);
        };
        __name(divisors, "divisors");
        const monicFactors = factorCoeffs.map((coeffs) => {
          if (!coeffs || coeffs.length === 0)
            return [];
          const arr = [...coeffs];
          while (arr.length > 1 && arr[arr.length - 1] === 0)
            arr.pop();
          const lead = arr[arr.length - 1];
          if (lead === void 0)
            throw new Error("Leading coefficient is undefined, cannot monicize");
          const leadMod = (lead % currentPrime + currentPrime) % currentPrime;
          if (leadMod === 0)
            throw new Error("Leading coefficient is zero, cannot monicize");
          const g = this.gcd(leadMod, currentPrime);
          if (g !== 1)
            throw new Error(`Leading coefficient not coprime to modulus: gcd=${g}`);
          const inv = this.modInv(leadMod, currentPrime, steps);
          const monic = arr.map((c) => (c * inv % currentPrime + currentPrime) % currentPrime);
          if (steps)
            steps.push(`[Hensel-DEBUG] monicize: input=${JSON.stringify(coeffs)}, trimmed=${JSON.stringify(arr)}, lead=${lead}, inv=${inv}, monic=${JSON.stringify(monic)}`);
          return monic;
        });
        const currentFactors = monicFactors.map((coeffs) => [...coeffs]);
        const currentMod = currentPrime;
        if (steps)
          steps.push(`[Hensel] \u521D\u671F\u56E0\u5B50(\u30E2\u30CB\u30C3\u30AF\u5316): ${JSON.stringify(currentFactors)}, mod ${currentMod}`);
        let k = 1;
        let m = Math.pow(currentPrime, k);
        while (m < targetPrecision) {
          k++;
          let nextMod = Math.pow(currentPrime, k);
          if (nextMod > targetPrecision)
            nextMod = targetPrecision;
          if (steps)
            steps.push(`[Hensel-DEBUG] modulus update: m=${m}, nextMod=${nextMod}, prime=${currentPrime}, k=${k}`);
          const prod = this.multiplyPolyList(currentFactors);
          if (steps)
            steps.push(`[Hensel-DEBUG] currentFactors: ${JSON.stringify(currentFactors)}, prod: ${JSON.stringify(prod)}`);
          const h = this.modPoly(this.subtractPolynomials(originalCoeffs, prod), nextMod);
          if (steps) {
            const leadCoeffs = currentFactors.map((fac) => Array.isArray(fac) && fac.length > 0 ? Number(fac[fac.length - 1]) : 0);
            const safeCoeffs = leadCoeffs.filter((x) => typeof x === "number" && Number.isFinite(x));
            let gcdAll = 0;
            if (safeCoeffs.length > 0) {
              gcdAll = safeCoeffs.reduce((acc, v) => this.gcd(acc, v));
            }
            steps.push(`[Hensel-DEBUG] mod ${m} \u5404\u56E0\u5B50\u306E\u6700\u9AD8\u6B21\u4FC2\u6570: ${JSON.stringify(leadCoeffs)}, gcd: ${gcdAll}`);
          }
          const Qs = currentFactors.map((_, i) => this.multiplyPolyList(currentFactors.filter((_2, idx) => idx !== i)));
          const Ss = [];
          for (let i = 0; i < currentFactors.length; i++) {
            const cf = currentFactors[i];
            const qf = Qs[i];
            const [d, s, t] = this.extendedEuclidean(cf, qf, nextMod, steps);
            if (!d || d.length !== 1 || d[0] !== 1) {
              if (steps)
                (steps ?? []).push(`[Hensel] f_i, Q\u304C\u4E92\u3044\u306B\u7D20\u3067\u306A\u3044\u305F\u3081\u30EA\u30D5\u30C8\u5931\u6557`);
              throw new Error("Not coprime");
            }
            Ss.push(s);
          }
          const deltas = Ss.map((s, i) => this.polyMod(this.multiplyPolynomials(s, h), Array.isArray(Qs[i]) ? Qs[i] : [], nextMod));
          for (let i = 0; i < currentFactors.length; i++) {
            const arr = [...currentFactors[i]];
            while (arr.length > 1 && arr[arr.length - 1] === 0)
              arr.pop();
            const cf2 = arr;
            const delta = deltas[i];
            let updatedFactor = this.modPoly(this.addPolynomials(cf2, delta), nextMod);
            if (updatedFactor.length > 0) {
              if (steps)
                steps.push(`[Hensel-DEBUG] before monicize: updatedFactor (low\u2192high) = ${JSON.stringify(updatedFactor)}, (high\u2192low) = ${JSON.stringify([...updatedFactor].reverse())}`);
              while (updatedFactor.length > 1 && updatedFactor[updatedFactor.length - 1] === 0)
                updatedFactor.pop();
              const lead = updatedFactor[updatedFactor.length - 1];
              if (lead === void 0) {
                if (steps)
                  steps.push(`[Hensel] Leading coefficient is undefined, cannot monicize`);
                throw new Error("Leading coefficient is undefined, cannot monicize");
              }
              const leadMod = (lead % nextMod + nextMod) % nextMod;
              if (leadMod === 0) {
                if (steps)
                  steps.push(`[Hensel] Leading coefficient is zero, cannot monicize`);
                throw new Error("Leading coefficient is zero, cannot monicize");
              }
              const g = this.gcd(leadMod, nextMod);
              if (g !== 1) {
                if (steps)
                  steps.push(`[Hensel] Leading coefficient not coprime to modulus: gcd=${g}`);
                throw new Error(`Leading coefficient not coprime to modulus: gcd=${g}`);
              }
              if (steps)
                steps.push(`[Hensel-DEBUG] monicize: lead=${lead}, nextMod=${nextMod}`);
              const inv = this.modInv(leadMod, nextMod, steps);
              updatedFactor = updatedFactor.map((c) => (c * inv % nextMod + nextMod) % nextMod);
              if (steps)
                steps.push(`[Hensel-DEBUG] after monicize: updatedFactor (low\u2192high) = ${JSON.stringify(updatedFactor)}, (high\u2192low) = ${JSON.stringify([...updatedFactor].reverse())}`);
            }
            if (updatedFactor.some((coeff) => isNaN(coeff))) {
              if (steps)
                steps.push(`[Hensel] Invalid factor encountered during lifting, aborting.`);
              throw new Error("Invalid factor");
            }
            currentFactors[i] = updatedFactor;
          }
          m = nextMod;
          k++;
          if (steps)
            (steps ?? []).push(`[Hensel] mod ${m} \u3067\u30EA\u30D5\u30C8: ${JSON.stringify(currentFactors)}`);
        }
        const normalizedHensel = currentFactors.map((fac) => (fac ?? []).map((c) => (c % m + m) % m));
        if (steps)
          (steps ?? []).push(`[Hensel] \u672C\u683C\u30EA\u30D5\u30C8\u6607\u683C: ${JSON.stringify(normalizedHensel)}`);
        const modArr = /* @__PURE__ */ __name((arr, mod) => arr.map((x) => (x % mod + mod) % mod), "modArr");
        const trimZeros = /* @__PURE__ */ __name((arr) => {
          const res = arr.slice();
          while (res.length > 1 && (res[res.length - 1] ?? 0) === 0)
            res.pop();
          return res;
        }, "trimZeros");
        const productHensel = trimZeros(this.multiplyPolyList(normalizedHensel));
        const originalTrim = trimZeros(originalCoeffs);
        const productHenselMod = modArr(productHensel, m);
        const originalMod = modArr(originalTrim, m);
        if (!this.arraysEqual(productHenselMod, originalMod)) {
          if (steps)
            (steps ?? []).push(`[Hensel] \u672C\u683C\u30EA\u30D5\u30C8\u5F8C\u306E\u7A4D\u304C\u5143\u591A\u9805\u5F0F\u3068\u4E00\u81F4\u3057\u306A\u3044\u305F\u3081\u5931\u6557`);
          throw new Error("Product mismatch");
        }
        function* allSetPartitions(arr) {
          const n = arr.length;
          if (n < 2)
            return;
          function* helper(idx, groups) {
            if (idx === n) {
              if (groups.length > 1)
                yield groups.map((g) => [...g]);
              return;
            }
            for (let i = 0; i < groups.length; ++i) {
              const group = groups[i];
              if (!group)
                continue;
              group.push(arr[idx]);
              yield* helper(idx + 1, groups);
              group.pop();
            }
            groups.push([arr[idx]]);
            yield* helper(idx + 1, groups);
            groups.pop();
          }
          __name(helper, "helper");
          yield* helper(0, []);
        }
        __name(allSetPartitions, "allSetPartitions");
        const isEqual = /* @__PURE__ */ __name((a, b) => {
          const aT = trimZeros(a);
          const bT = trimZeros(b);
          return this.arraysEqual(modArr(aT, m), modArr(bT, m));
        }, "isEqual");
        const constantTerm = originalCoeffs[0] ?? 0;
        const allDivs = divisors(constantTerm);
        const constChoices = normalizedHensel.map((_) => allDivs);
        const cartesian = /* @__PURE__ */ __name((arr) => {
          return arr.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
        }, "cartesian");
        const permute = /* @__PURE__ */ __name((arr) => {
          if (arr.length <= 1)
            return [arr];
          const result = [];
          for (let i = 0; i < arr.length; i++) {
            const rest = arr.slice(0, i).concat(arr.slice(i + 1));
            for (const p2 of permute(rest)) {
              result.push([arr[i], ...p2]);
            }
          }
          return result;
        }, "permute");
        const allConstCombos = cartesian(constChoices);
        const foundModMatch = [];
        for (const constSet of allConstCombos) {
          const scaled = normalizedHensel.map((fac, i) => fac.map((c) => (c * constSet[i] % m + m) % m));
          for (const perm of permute(scaled)) {
            for (const partition of allSetPartitions(perm)) {
              const prods = partition.map((g) => this.multiplyPolyList(g));
              if (prods.every((p2) => p2.length > 1) && isEqual(this.multiplyPolyList(prods), originalMod)) {
                foundModMatch.push(partition.map((g) => Array.isArray(g) ? [...g] : []));
              }
            }
          }
        }
        for (const match of foundModMatch) {
          const toInt = /* @__PURE__ */ __name((arr) => arr.map((c) => {
            let v = c % m;
            if (v > m / 2)
              v -= m;
            if (v < -m / 2)
              v += m;
            return v;
          }), "toInt");
          const allConstCombosInt = cartesian(constChoices);
          for (const constSet of allConstCombosInt) {
            const scaled = match.map((fac, i) => fac.map((c) => (c * constSet[i] % m + m) % m));
            for (const perm of permute(scaled)) {
              const intFactors = perm.map((fac) => toInt(fac));
              const intProd = this.multiplyPolyList(intFactors);
              const trimZeros2 = /* @__PURE__ */ __name((arr) => {
                const res = arr.slice();
                while (res.length > 1 && (res[res.length - 1] ?? 0) === 0)
                  res.pop();
                return res;
              }, "trimZeros");
              if (this.arraysEqual(trimZeros2(intProd), trimZeros2(originalCoeffs))) {
                if (steps)
                  steps.push(`[Hensel] \u6574\u6570\u4FC2\u6570\u306B\u623B\u3057\u3066\u7A4D\u304C\u4E00\u81F4: ${JSON.stringify(intFactors)}`);
                return intFactors;
              }
            }
          }
        }
        if (steps && foundModMatch.length > 0)
          steps.push(`[Hensel] mod m \u3067\u4E00\u81F4\u3057\u305F\u56E0\u5B50\u30BB\u30C3\u30C8: ${JSON.stringify(foundModMatch)}`);
        return normalizedHensel;
      } catch (error) {
        lastError = error;
        if (steps)
          (steps ?? []).push(`[Hensel] \u4F8B\u5916\u767A\u751F: ${error instanceof Error ? error.message : String(error)} (prime=${currentPrime})`);
        continue;
      }
    }
    if (steps) {
      let msg = "";
      if (lastError && typeof lastError === "object" && "message" in lastError) {
        const maybeMsg = lastError.message;
        if (typeof maybeMsg === "string") {
          msg = maybeMsg;
        }
      }
      (steps ?? []).push(`[Hensel] \u5168\u3066\u306E\u7D20\u6570\u3067\u30EA\u30D5\u30C8\u5931\u6557: ${msg}`);
    }
    return factorCoeffs;
  }
  // 多項式の各係数をmodで正規化
  modPoly(a, mod) {
    return a.map((x) => (x % mod + mod) % mod);
  }
  // 多項式配列の積
  multiplyPolyList(list) {
    return list.reduce((acc, arr) => this.multiplyPolynomials(acc, arr ?? []), [1]);
  }
  // 多項式のユークリッド拡張（a, b, mod）: [gcd, s, t] で a*s + b*t = gcd (mod mod)
  extendedEuclidean(a, b, mod, steps) {
    let old_r = a.slice();
    let r = b.slice();
    let old_s = [1], s = [0];
    let old_t = [0], t = [1];
    while (r.length > 0 && !(r.length === 1 && r[0] === 0)) {
      const [q, rem] = this.polyDivMod(old_r, r, mod);
      const new_r = rem;
      const new_s = this.subtractPolynomials(old_s, this.multiplyPolynomials(q, s)).map((x) => (x % mod + mod) % mod);
      const new_t = this.subtractPolynomials(old_t, this.multiplyPolynomials(q, t)).map((x) => (x % mod + mod) % mod);
      old_r = r;
      r = new_r;
      old_s = s;
      s = new_s;
      old_t = t;
      t = new_t;
    }
    try {
      const inv = this.modInv(old_r[0] !== void 0 ? old_r[0] : 1, mod, steps);
      const gcd2 = old_r.map((x) => x * inv % mod);
      const sNorm = old_s.map((x) => x * inv % mod);
      const tNorm = old_t.map((x) => x * inv % mod);
      return [gcd2, sNorm, tNorm];
    } catch (error) {
      if (steps && error instanceof Error) {
        steps.push(`[Hensel] modInv failed: ${error.message}`);
      }
      throw new Error(`Hensel lifting failed at mod ${mod}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  // 多項式の割り算（商と余り、mod付き）
  polyDivMod(a, b, mod) {
    const dividend = a.slice();
    const divisor = b.slice();
    const result = [];
    while (dividend.length >= divisor.length && divisor.length > 0 && (divisor[divisor.length - 1] ?? 0) !== 0) {
      const leadDiv = dividend[dividend.length - 1] ?? 0;
      const leadDivisor = divisor[divisor.length - 1] ?? 1;
      const coeff = this.modDiv(leadDiv, leadDivisor, mod);
      const deg = dividend.length - divisor.length;
      result[deg] = coeff;
      for (let i = 0; i < divisor.length; i++) {
        dividend[deg + i] = dividend[deg + i] ?? 0;
        dividend[deg + i] = ((dividend[deg + i] ?? 0) - coeff * (divisor[i] ?? 0)) % mod;
        if ((dividend[deg + i] ?? 0) < 0)
          dividend[deg + i] = (dividend[deg + i] ?? 0) + mod;
      }
      while (dividend.length > 0 && (dividend[dividend.length - 1] ?? 0) === 0)
        dividend.pop();
    }
    return [result.map((x) => (x % mod + mod) % mod), dividend.map((x) => (x % mod + mod) % mod)];
  }
  // 多項式の剰余（a mod b, mod付き）
  polyMod(a, b, mod) {
    const [, rem] = this.polyDivMod(a, b, mod);
    return rem;
  }
  // modでの逆元
  modInv(a, mod, steps) {
    const gcd2 = this.gcd(a, mod);
    if (gcd2 !== 1) {
      if (steps)
        steps.push(`Value ${a} is not invertible under mod ${mod} (gcd = ${gcd2})`);
      throw new Error(`Value ${a} is not invertible under mod ${mod} (gcd = ${gcd2})`);
    }
    let t = 0, newt = 1;
    let r = mod, newr = a % mod;
    while (newr !== 0) {
      const quotient = Math.floor(r / newr);
      [t, newt] = [newt, t - quotient * newt];
      [r, newr] = [newr, r - quotient * newr];
    }
    if (t < 0) {
      t += mod;
    }
    return t;
  }
  // Helper method to calculate gcd
  gcd(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return Math.abs(a);
  }
  // modでの割り算
  modDiv(a, b, mod) {
    return a * this.modInv(b, mod) % mod;
  }
  // mod n の範囲 [0, n-1] に正規化
  normalizeCoeff(c, mod) {
    return (c % mod + mod) % mod;
  }
  // 多項式の減算
  subtractPolynomials(a, b) {
    const maxLength = Math.max(a.length, b.length);
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const aCoeff = i < a.length ? a[i] ?? 0 : 0;
      const bCoeff = i < b.length ? b[i] ?? 0 : 0;
      result.push(aCoeff - bCoeff);
    }
    return result;
  }
  // 多項式の加算
  addPolynomials(a, b) {
    const maxLength = Math.max(a.length, b.length);
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const aCoeff = i < a.length ? a[i] ?? 0 : 0;
      const bCoeff = i < b.length ? b[i] ?? 0 : 0;
      result.push(aCoeff + bCoeff);
    }
    return result;
  }
  // 多項式の乗算
  multiplyPolynomials(a, b) {
    if (a.length === 0 || b.length === 0)
      return [0];
    const result = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        result[i + j] += (a[i] ?? 0) * (b[j] ?? 0);
      }
    }
    return result;
  }
  // 配列が等しいか
  arraysEqual(a, b) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if ((a[i] ?? 0) !== (b[i] ?? 0))
        return false;
    }
    return true;
  }
  // 末尾の0を除去
  trimZeros(arr) {
    const res = arr.slice();
    while (res.length > 1 && (res[res.length - 1] ?? 0) === 0)
      res.pop();
    return res;
  }
};
__name(_HenselLifting, "HenselLifting");
var HenselLifting = _HenselLifting;
var _PolynomialUtils = class _PolynomialUtils {
  /**
   * Check if an AST node represents a polynomial in the given variable
   */
  isPolynomial(node, variable) {
    if (!node)
      return false;
    switch (node.type) {
      case "NumberLiteral":
        return true;
      case "Identifier":
        return node.name === variable || this.isConstant(node.name);
      case "BinaryExpression":
        return this.isBinaryPolynomial(node, variable);
      default:
        return false;
    }
  }
  /**
   * Check if a binary expression represents a polynomial operation
   */
  isBinaryPolynomial(node, variable) {
    const { operator, left, right } = node;
    switch (operator) {
      case "+":
      case "-":
        return this.isPolynomial(left, variable) && this.isPolynomial(right, variable);
      case "*":
        return this.isPolynomial(left, variable) && this.isPolynomial(right, variable);
      case "^":
        return this.isPolynomial(left, variable) && right.type === "NumberLiteral" && Number.isInteger(right.value) && right.value >= 0;
      default:
        return false;
    }
  }
  /**
   * Check if an identifier represents a constant (not the main variable)
   */
  isConstant(name) {
    return name.length === 1 && !["x", "y", "z"].includes(name.toLowerCase());
  }
  /**
   * Extract polynomial coefficients from AST node
   * Returns array where index i contains coefficient of x^i
   */
  extractCoefficients(node, variable) {
    const coeffs = [];
    this.extractCoeffsRecursive(node, variable, coeffs);
    while (coeffs.length > 1 && coeffs[coeffs.length - 1] === 0) {
      coeffs.pop();
    }
    return coeffs.length > 0 ? coeffs : [0];
  }
  /**
   * Recursive helper for coefficient extraction
   */
  extractCoeffsRecursive(node, variable, coeffs) {
    if (!node)
      return;
    switch (node.type) {
      case "NumberLiteral":
        this.addToCoeff(coeffs, 0, node.value);
        break;
      case "Identifier":
        if (node.name === variable) {
          this.addToCoeff(coeffs, 1, 1);
        } else {
          this.addToCoeff(coeffs, 0, 1);
        }
        break;
      case "BinaryExpression":
        this.extractBinaryCoeffs(node, variable, coeffs);
        break;
    }
  }
  /**
   * Extract coefficients from binary expressions
   */
  extractBinaryCoeffs(node, variable, coeffs) {
    const { operator, left, right } = node;
    switch (operator) {
      case "+":
        this.extractCoeffsRecursive(left, variable, coeffs);
        this.extractCoeffsRecursive(right, variable, coeffs);
        break;
      case "-": {
        this.extractCoeffsRecursive(left, variable, coeffs);
        const rightCoeffs = [];
        this.extractCoeffsRecursive(right, variable, rightCoeffs);
        for (let i = 0; i < rightCoeffs.length; i++) {
          this.addToCoeff(coeffs, i, -rightCoeffs[i]);
        }
        break;
      }
      case "*":
        this.extractMultiplicationCoeffs(left, right, variable, coeffs);
        break;
      case "^":
        this.extractPowerCoeffs(left, right, variable, coeffs);
        break;
    }
  }
  /**
   * Extract coefficients from multiplication
   */
  extractMultiplicationCoeffs(left, right, variable, coeffs) {
    const leftCoeffs = [];
    const rightCoeffs = [];
    this.extractCoeffsRecursive(left, variable, leftCoeffs);
    this.extractCoeffsRecursive(right, variable, rightCoeffs);
    for (let i = 0; i < leftCoeffs.length; i++) {
      for (let j = 0; j < rightCoeffs.length; j++) {
        const leftVal = leftCoeffs[i];
        const rightVal = rightCoeffs[j];
        if (leftVal !== void 0 && rightVal !== void 0) {
          this.addToCoeff(coeffs, i + j, leftVal * rightVal);
        }
      }
    }
  }
  /**
   * Extract coefficients from power expressions
   */
  extractPowerCoeffs(base, exponent, variable, coeffs) {
    if (exponent.type !== "NumberLiteral" || !Number.isInteger(exponent.value)) {
      throw new Error("Non-integer exponents not supported in polynomial extraction");
    }
    const exp = exponent.value;
    if (exp < 0) {
      throw new Error("Negative exponents not supported in polynomial extraction");
    }
    if (exp === 0) {
      this.addToCoeff(coeffs, 0, 1);
      return;
    }
    if (base.type === "Identifier" && base.name === variable) {
      this.addToCoeff(coeffs, exp, 1);
    } else {
      const baseCoeffs = [];
      this.extractCoeffsRecursive(base, variable, baseCoeffs);
      const resultCoeffs = this.polynomialPower(baseCoeffs, exp);
      for (let i = 0; i < resultCoeffs.length; i++) {
        const coeff = resultCoeffs[i];
        if (coeff !== void 0) {
          this.addToCoeff(coeffs, i, coeff);
        }
      }
    }
  }
  /**
   * Compute polynomial raised to integer power
   */
  polynomialPower(coeffs, power) {
    if (power === 0)
      return [1];
    if (power === 1)
      return [...coeffs];
    let result = [1];
    let base = [...coeffs];
    let exp = power;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = this.multiplyPolynomials(result, base);
      }
      base = this.multiplyPolynomials(base, base);
      exp = Math.floor(exp / 2);
    }
    return result;
  }
  /**
   * Multiply two polynomials represented as coefficient arrays
   */
  multiplyPolynomials(a, b) {
    const result = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        const aVal = a[i];
        const bVal = b[j];
        if (aVal !== void 0 && bVal !== void 0) {
          result[i + j] += aVal * bVal;
        }
      }
    }
    return result;
  }
  /**
   * Add value to coefficient at given degree
   */
  addToCoeff(coeffs, degree, value) {
    while (coeffs.length <= degree) {
      coeffs.push(0);
    }
    const existing = coeffs[degree];
    if (existing !== void 0) {
      coeffs[degree] = existing + value;
    }
  }
  /**
   * Convert coefficient array back to AST node
   */
  coefficientsToAST(coeffs, variable) {
    if (coeffs.length === 0) {
      return { type: "NumberLiteral", value: 0 };
    }
    let degree = coeffs.length - 1;
    while (degree > 0 && coeffs[degree] === 0) {
      degree--;
    }
    if (degree === 0) {
      const constantCoeff = coeffs[0];
      return { type: "NumberLiteral", value: constantCoeff || 0 };
    }
    let result = null;
    for (let i = degree; i >= 0; i--) {
      const coeff = coeffs[i];
      if (coeff === void 0 || coeff === 0)
        continue;
      const term = this.createTerm(Math.abs(coeff), i, variable);
      if (result === null) {
        if (coeff < 0) {
          result = {
            type: "UnaryExpression",
            operator: "-",
            operand: term
          };
        } else {
          result = term;
        }
      } else {
        if (coeff > 0) {
          result = {
            type: "BinaryExpression",
            operator: "+",
            left: result,
            right: term
          };
        } else {
          result = {
            type: "BinaryExpression",
            operator: "-",
            left: result,
            right: term
          };
        }
      }
    }
    return result || { type: "NumberLiteral", value: 0 };
  }
  /**
   * Create a single term (coefficient * variable^degree)
   * Note: coeff should always be positive (sign handled in coefficientsToAST)
   */
  createTerm(coeff, degree, variable) {
    if (degree === 0) {
      return { type: "NumberLiteral", value: coeff };
    }
    const varNode = { type: "Identifier", name: variable };
    const powerNode = degree === 1 ? varNode : {
      type: "BinaryExpression",
      operator: "^",
      left: varNode,
      right: { type: "NumberLiteral", value: degree }
    };
    if (coeff === 1) {
      return powerNode;
    }
    return {
      type: "BinaryExpression",
      operator: "*",
      left: { type: "NumberLiteral", value: coeff },
      right: powerNode
    };
  }
  /**
   * Negate a term (used for subtraction)
   */
  negateTerm(term) {
    if (term.type === "NumberLiteral") {
      return { type: "NumberLiteral", value: -term.value };
    }
    return {
      type: "UnaryExpression",
      operator: "-",
      operand: term
    };
  }
};
__name(_PolynomialUtils, "PolynomialUtils");
var PolynomialUtils = _PolynomialUtils;
var DEFAULT_BZ_OPTIONS = {
  prime: 2,
  // Will be automatically selected
  targetPrecision: 1e3,
  // High precision for coefficient bounds
  maxDegree: 20,
  useBigInt: true
};
var _BerlekampZassenhausFactorizer = class _BerlekampZassenhausFactorizer {
  constructor() {
    this.berlekamp = new BerlekampAlgorithm();
    this.henselLifting = new HenselLifting();
    this.polynomialUtils = new PolynomialUtils();
  }
  /**
   * Factor a polynomial using Berlekamp-Zassenhaus algorithm
   *
   * @param polynomial - Input polynomial as AST node
   * @param variable - Variable name (default: 'x')
   * @param options - Factorization options
   * @returns Array of factored polynomials or null if irreducible
   */
  factor(polynomial, variable = "x", options = {}, steps) {
    const opts = { ...DEFAULT_BZ_OPTIONS, ...options };
    try {
      if (steps)
        steps.push(`[BZ] \u5165\u529BAST: ${stepsAstToLatex(polynomial)}`);
      if (!this.polynomialUtils.isPolynomial(polynomial, variable)) {
        if (steps)
          steps.push(`[BZ] \u5165\u529B\u306F\u591A\u9805\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
        return null;
      }
      const coefficients = this.polynomialUtils.extractCoefficients(polynomial, variable);
      const degree = coefficients.length - 1;
      if (steps)
        steps.push(`[BZ] \u4FC2\u6570\u914D\u5217: ${JSON.stringify(coefficients)}, \u6B21\u6570: ${degree}`);
      if (degree < 2) {
        if (steps)
          steps.push(`[BZ] \u6B21\u6570\u304C2\u672A\u6E80\u306A\u306E\u3067\u56E0\u6570\u5206\u89E3\u3057\u307E\u305B\u3093`);
        return null;
      }
      if (degree > opts.maxDegree) {
        if (steps)
          steps.push(`[BZ] \u6B21\u6570\u304C\u6700\u5927\u5024${opts.maxDegree}\u3092\u8D85\u3048\u3066\u3044\u307E\u3059`);
        throw new Error(`Polynomial degree ${degree} exceeds maximum ${opts.maxDegree}`);
      }
      const primes = [3, 5, 7, 11];
      let foundFactors = null;
      let usedPrime = null;
      for (const prime of primes) {
        if (steps)
          steps.push(`[BZ] \u7D20\u6570${prime}\u3067\u6709\u9650\u4F53\u5206\u89E3\u3092\u8A66\u884C`);
        const finiteFieldFactors = this.berlekamp.factorInFiniteField(coefficients, prime, steps);
        if (steps)
          steps.push(`[BZ] \u6709\u9650\u4F53\u56E0\u6570\u5206\u89E3\u7D50\u679C@p=${prime}: ${JSON.stringify(finiteFieldFactors)}`);
        if (finiteFieldFactors.length > 1) {
          foundFactors = finiteFieldFactors;
          usedPrime = prime;
          break;
        }
      }
      if (foundFactors && usedPrime) {
        if (steps)
          steps.push(`[BZ] \u7D20\u6570${usedPrime}\u3067\u5206\u89E3\u6210\u529F\u3002Hensel\u30EA\u30D5\u30C8\u958B\u59CB`);
        const liftedFactors = this.henselLifting.liftFactors(coefficients, foundFactors, usedPrime, opts.targetPrecision, steps);
        if (steps)
          steps.push(`[BZ] Hensel\u30EA\u30D5\u30C8\u7D50\u679C: ${JSON.stringify(liftedFactors)}`);
        const astFactors = this.convertCoefficientsToAST(liftedFactors, variable);
        if (steps)
          steps.push(`[BZ] AST\u56E0\u6570\u30EA\u30B9\u30C8: ${astFactors.map((f) => stepsAstToLatex(f)).join(", ")}`);
        return astFactors;
      } else {
        if (steps)
          steps.push(`[BZ] \u3059\u3079\u3066\u306E\u7D20\u6570\u3067\u6709\u9650\u4F53\u5206\u89E3\u3067\u304D\u305A\u3001\u57FA\u672C\u56E0\u6570\u5206\u89E3\u306B\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF`);
        return this.attemptBasicFactorization(polynomial, variable);
      }
    } catch (error) {
      if (steps)
        steps.push(`[BZ] \u4F8B\u5916\u767A\u751F: ${error instanceof Error ? error.message : String(error)}`);
      return this.attemptBasicFactorization(polynomial, variable);
    }
  }
  /**
   * Fallback: Basic factorization for simple cases
   */
  attemptBasicFactorization(polynomial, variable) {
    const coefficients = this.polynomialUtils.extractCoefficients(polynomial, variable);
    if (coefficients.length === 4) {
      const d = coefficients[0];
      const c = coefficients[1];
      const b = coefficients[2];
      const a = coefficients[3];
      if (a === 1 && b === 0 && c === 0 && typeof d === "number") {
        const cubeRoot = Math.cbrt(Math.abs(d));
        if (Number.isInteger(cubeRoot)) {
          if (d > 0) {
            const lin = this.createLinearFactor(1, cubeRoot, variable);
            const quad = this.polynomialUtils.coefficientsToAST([cubeRoot * cubeRoot, -cubeRoot, 1], variable);
            return [lin, quad];
          } else if (d < 0) {
            const lin = this.createLinearFactor(1, -cubeRoot, variable);
            const quad = this.polynomialUtils.coefficientsToAST([cubeRoot * cubeRoot, cubeRoot, 1], variable);
            return [lin, quad];
          }
        }
      }
    }
    try {
      const coefficients2 = this.polynomialUtils.extractCoefficients(polynomial, variable);
      if (coefficients2.length === 3) {
        const c = coefficients2[0];
        const b = coefficients2[1];
        const a = coefficients2[2];
        if (a === 1 && typeof c === "number" && typeof b === "number") {
          for (let p = -50; p <= 50; p++) {
            if (p === 0)
              continue;
            if (c % p === 0) {
              const q = c / p;
              if (Math.abs(p + q - b) < 1e-4) {
                const factor1 = this.createLinearFactor(1, p, variable);
                const factor2 = this.createLinearFactor(1, q, variable);
                return [factor1, factor2];
              }
            }
          }
        }
      }
      if (coefficients2.length === 4) {
        const d = coefficients2[0];
        const c = coefficients2[1];
        const b = coefficients2[2];
        const a = coefficients2[3];
        if (typeof d === "number" && typeof a === "number") {
          const factorsD = this.getFactors(Math.abs(d));
          const factorsA = this.getFactors(Math.abs(a));
          for (const fd of factorsD) {
            for (const fa of factorsA) {
              for (const sign of [1, -1]) {
                const root = sign * fd / fa;
                if (this.isRoot(coefficients2, root)) {
                  const remaining = this.syntheticDivision(coefficients2, root, variable);
                  if (remaining) {
                    const rootFactor = this.createLinearFactor(1, -root, variable);
                    return [rootFactor, remaining];
                  }
                }
              }
            }
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }
  /**
   * Create a linear factor AST node: coeff*variable + constant
   */
  createLinearFactor(coeff, constant, variable) {
    const variableTerm = coeff === 1 ? { type: "Identifier", name: variable } : {
      type: "BinaryExpression",
      operator: "*",
      left: { type: "NumberLiteral", value: coeff },
      right: { type: "Identifier", name: variable }
    };
    if (constant === 0) {
      return variableTerm;
    } else if (constant > 0) {
      return {
        type: "BinaryExpression",
        operator: "+",
        left: variableTerm,
        right: { type: "NumberLiteral", value: constant }
      };
    } else {
      return {
        type: "BinaryExpression",
        operator: "-",
        left: variableTerm,
        right: { type: "NumberLiteral", value: -constant }
      };
    }
  }
  /**
   * Get integer factors of a number
   */
  getFactors(n) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
          factors.push(n / i);
        }
      }
    }
    return factors.sort((a, b) => a - b);
  }
  /**
   * Check if a value is a root of the polynomial
   */
  isRoot(coefficients, root) {
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
      const coeff = coefficients[i];
      if (typeof coeff === "number") {
        result += coeff * Math.pow(root, i);
      }
    }
    return Math.abs(result) < 1e-4;
  }
  /**
   * Synthetic division to factor out (x - root)
   */
  syntheticDivision(coefficients, root, variable) {
    const newCoeffs = [...coefficients];
    if (newCoeffs.length === 4) {
      const c0 = newCoeffs[0];
      const c1 = newCoeffs[1];
      const c2 = newCoeffs[2];
      if (typeof c0 === "number" && typeof c1 === "number" && typeof c2 === "number") {
        return this.polynomialUtils.coefficientsToAST([c0, c1, c2], variable);
      }
    }
    return null;
  }
  /**
   * Select a prime that doesn't divide any coefficient
   * and is suitable for finite field operations
   */
  selectPrime(coefficients, suggestedPrime) {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    if (suggestedPrime && this.isPrimeValid(suggestedPrime, coefficients)) {
      return suggestedPrime;
    }
    for (const prime of primes) {
      if (this.isPrimeValid(prime, coefficients)) {
        return prime;
      }
    }
    const nonZeroCoeffs = coefficients.filter((c) => c !== 0).map((c) => Math.abs(c));
    const constant = nonZeroCoeffs[0] ?? 1;
    const leading = nonZeroCoeffs[nonZeroCoeffs.length - 1] ?? 1;
    const gcd2 = /* @__PURE__ */ __name((a, b) => b === 0 ? a : gcd2(b, a % b), "gcd");
    const g = gcd2(constant, leading);
    for (const prime of primes) {
      if (g % prime !== 0) {
        return prime;
      }
    }
    return primes[0] ?? null;
  }
  /**
   * Check if a prime is valid (doesn't divide any coefficient)
   */
  isPrimeValid(prime, coefficients) {
    return coefficients.every((coeff) => coeff % prime !== 0);
  }
  // Square-free decomposition and substitutions (e.g., t = x^k) are handled by other strategies.
  /**
   * Convert coefficient arrays back to AST node representation
   */
  convertCoefficientsToAST(factorCoefficients, variable) {
    function isNumberLiteral(node) {
      return node.type === "NumberLiteral" && typeof node.value === "number";
    }
    __name(isNumberLiteral, "isNumberLiteral");
    const astFactors = factorCoefficients.map((coeffs) => this.polynomialUtils.coefficientsToAST(coeffs, variable)).filter((node) => node !== void 0 && node !== null);
    const constantFactors = astFactors.filter(isNumberLiteral).filter((node) => node.value !== 1 && node.value !== 0);
    const polyFactors = astFactors.filter((node) => !isNumberLiteral(node) || node.value === 1 || node.value === 0);
    let constantProduct = 1;
    for (const node of constantFactors) {
      if (isNumberLiteral(node)) {
        constantProduct *= node.value;
      }
    }
    if (constantProduct === 0) {
      return [{ type: "NumberLiteral", value: 0 }];
    }
    let resultFactors = polyFactors.filter((node) => !(isNumberLiteral(node) && node.value === 1 && node !== void 0));
    resultFactors = resultFactors.filter((node) => node !== void 0 && node !== null);
    if (constantProduct !== 1) {
      resultFactors = [{ type: "NumberLiteral", value: constantProduct }, ...resultFactors];
    }
    if (!resultFactors || resultFactors.length === 0) {
      return [{ type: "NumberLiteral", value: 1 }];
    } else if (resultFactors.length === 1) {
      return [resultFactors[0]];
    } else {
      let acc = resultFactors[0];
      for (let i = 1; i < resultFactors.length; i++) {
        acc = {
          type: "BinaryExpression",
          operator: "*",
          left: acc,
          right: resultFactors[i]
        };
      }
      return [acc];
    }
  }
};
__name(_BerlekampZassenhausFactorizer, "BerlekampZassenhausFactorizer");
var BerlekampZassenhausFactorizer = _BerlekampZassenhausFactorizer;
function berlekampZassenhausFactor(polynomial, variable = "x", options = {}, steps) {
  const factorizer = new BerlekampZassenhausFactorizer();
  return factorizer.factor(polynomial, variable, options, steps);
}
__name(berlekampZassenhausFactor, "berlekampZassenhausFactor");
var _BerlekampZassenhausStrategy = class _BerlekampZassenhausStrategy {
  constructor() {
    this.name = "berlekamp-zassenhaus";
    this.priority = 10;
    this.description = "Advanced polynomial factorization using Berlekamp-Zassenhaus algorithm";
  }
  canApply(node, context) {
    if (this.containsMultiplication(node)) {
      return false;
    }
    if (!this.isPolynomial(node, context.variable)) {
      return false;
    }
    const degree = this.getPolynomialDegree(node, context.variable);
    return degree >= 2 && degree <= 8 || context.currentIteration > 1;
  }
  apply(node, context) {
    const steps = [];
    try {
      const originalLatex = astToLatex(node);
      steps.push(`[DEBUG] originalLatex: ${originalLatex}`);
      const factors = berlekampZassenhausFactor(node, context.variable, {}, steps);
      steps.push(`[DEBUG] raw factors count: ${factors ? factors.length : "null"}`);
      if (factors) {
        steps.push(`[DEBUG] raw factors LaTeX: ${factors.map(astToLatex).join(" | ")}`);
      }
      if (!factors || factors.length <= 1) {
        steps.push("Berlekamp-Zassenhaus: Polynomial appears to be irreducible over the integers");
        return {
          success: false,
          ast: node,
          changed: false,
          steps,
          strategyUsed: this.name,
          canContinue: false
        };
      }
      const factoredExpression = this.constructFactoredExpression(factors);
      steps.push(`[DEBUG] factoredExpression LaTeX: ${astToLatex(factoredExpression)}`);
      const simplifiedExpression = basicSimplify(factoredExpression);
      const factoredLatex = astToLatex(simplifiedExpression);
      steps.push(`[DEBUG] simplifiedExpression LaTeX: ${factoredLatex}`);
      if (factoredLatex === originalLatex) {
        steps.push("Berlekamp-Zassenhaus: No further factorization possible");
        return {
          success: false,
          ast: node,
          changed: false,
          steps,
          strategyUsed: this.name,
          canContinue: false
        };
      }
      steps.push("Applied Berlekamp-Zassenhaus algorithm");
      steps.push(`Factored into ${factors.length} irreducible factors`);
      steps.push(`Result: ${factoredLatex}`);
      return {
        success: true,
        ast: simplifiedExpression,
        changed: true,
        steps,
        strategyUsed: this.name,
        canContinue: true
      };
    } catch (error) {
      steps.push(`Berlekamp-Zassenhaus failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return {
        success: false,
        ast: node,
        changed: false,
        steps,
        strategyUsed: this.name,
        canContinue: false
      };
    }
  }
  /**
   * Check if node represents a polynomial in the given variable
   */
  isPolynomial(node, variable) {
    switch (node.type) {
      case "NumberLiteral":
        return true;
      case "Identifier":
        return node.name === variable || this.isConstant(node.name);
      case "BinaryExpression": {
        const { operator, left, right } = node;
        switch (operator) {
          case "+":
          case "-":
          case "*":
            return this.isPolynomial(left, variable) && this.isPolynomial(right, variable);
          case "^":
            return this.isPolynomial(left, variable) && right.type === "NumberLiteral" && Number.isInteger(right.value) && right.value >= 0;
          default:
            return false;
        }
      }
      default:
        return false;
    }
  }
  /**
   * Check if identifier represents a constant
   */
  isConstant(name) {
    return name.length === 1 && !["x", "y", "z"].includes(name.toLowerCase());
  }
  /**
   * Get polynomial degree (simplified estimation)
   */
  getPolynomialDegree(node, variable) {
    switch (node.type) {
      case "NumberLiteral":
        return 0;
      case "Identifier":
        return node.name === variable ? 1 : 0;
      case "BinaryExpression": {
        const { operator, left, right } = node;
        switch (operator) {
          case "+":
          case "-":
            return Math.max(this.getPolynomialDegree(left, variable), this.getPolynomialDegree(right, variable));
          case "*":
            return this.getPolynomialDegree(left, variable) + this.getPolynomialDegree(right, variable);
          case "^":
            if (left.type === "Identifier" && left.name === variable && right.type === "NumberLiteral") {
              return right.value;
            }
            return this.getPolynomialDegree(left, variable);
          default:
            return 0;
        }
      }
      default:
        return 0;
    }
  }
  /**
   * Construct factored expression from factor array
   */
  constructFactoredExpression(factors) {
    if (factors.length === 0) {
      return { type: "NumberLiteral", value: 1 };
    }
    if (factors.length === 1) {
      return factors[0];
    }
    let result = factors[0];
    for (let i = 1; i < factors.length; i++) {
      result = {
        type: "BinaryExpression",
        operator: "*",
        left: result,
        right: factors[i]
      };
    }
    return result;
  }
  /**
   * Check if node contains multiplication (indicating it's already factored)
   */
  containsMultiplication(node) {
    switch (node.type) {
      case "BinaryExpression":
        if (node.operator === "*") {
          return true;
        }
        return this.containsMultiplication(node.left) || this.containsMultiplication(node.right);
      default:
        return false;
    }
  }
};
__name(_BerlekampZassenhausStrategy, "BerlekampZassenhausStrategy");
var BerlekampZassenhausStrategy = _BerlekampZassenhausStrategy;
function createLatticeBases(coefficients, bound = 1e3) {
  const n = coefficients.length - 1;
  const bases = [];
  for (let m = 1; m <= n - 1; m++) {
    const basis = [];
    for (let i = 0; i < n - m; i++) {
      const row = new Array(n + 1).fill(0);
      row[i] = bound;
      basis.push(row);
    }
    for (let k = 0; k <= m; k++) {
      const row = new Array(n + 1).fill(0);
      for (let j = 0; j <= n; j++) {
        if (j - k >= 0 && j - k <= n) {
          row[j] = coefficients[j - k];
        }
      }
      basis.push(row);
    }
    bases.push(basis);
  }
  return bases;
}
__name(createLatticeBases, "createLatticeBases");
function lllReduce(basis, delta = 0.75) {
  const m = basis.length;
  const n = basis[0]?.length ?? 0;
  if (n === 0)
    return [];
  const B = basis.map((row) => row.slice());
  const mu = Array.from({ length: m }, () => new Array(m).fill(0));
  const Bstar = Array.from({ length: m }, () => new Array(n).fill(0));
  const BstarNorm = new Array(m).fill(0);
  if (B[0] && Bstar[0]) {
    for (let j = 0; j < n; j++)
      Bstar[0][j] = B[0][j] ?? 0;
    BstarNorm[0] = dot(Bstar[0], Bstar[0]);
  }
  for (let i = 1; i < m; i++) {
    const Bi = Array.isArray(B[i]) ? B[i] : new Array(n).fill(0);
    const Bstari = Array.isArray(Bstar[i]) ? Bstar[i] : new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      Bstari[j] = Bi[j] ?? 0;
    }
    for (let k2 = 0; k2 < i; k2++) {
      const Bstark = Array.isArray(Bstar[k2]) ? Bstar[k2] : new Array(n).fill(0);
      const mu_i = Array.isArray(mu[i]) ? mu[i] : new Array(m).fill(0);
      if (typeof BstarNorm[k2] !== "number" || BstarNorm[k2] === 0) {
        mu_i[k2] = 0;
        mu[i] = mu_i;
        continue;
      }
      mu_i[k2] = dot(Bi, Bstark) / BstarNorm[k2];
      mu[i] = mu_i;
      for (let j = 0; j < n; j++) {
        Bstari[j] -= (mu_i[k2] ?? 0) * (Bstark[j] ?? 0);
      }
    }
    BstarNorm[i] = dot(Bstari, Bstari);
    Bstar[i] = Bstari;
  }
  let k = 1;
  while (k < m) {
    for (let j = k - 1; j >= 0; j--) {
      const mu_k2 = Array.isArray(mu[k]) ? mu[k] : new Array(m).fill(0);
      const mu_j = Array.isArray(mu[j]) ? mu[j] : new Array(m).fill(0);
      const muKJ = typeof mu_k2[j] === "number" ? mu_k2[j] : 0;
      const q = Math.round(muKJ ?? 0);
      if (q !== 0) {
        const Bk = Array.isArray(B[k]) ? B[k] : new Array(n).fill(0);
        const Bj = Array.isArray(B[j]) ? B[j] : new Array(n).fill(0);
        for (let l = 0; l < n; l++) {
          Bk[l] -= (q ?? 0) * (Bj[l] ?? 0);
        }
        for (let i = 0; i < j; i++) {
          mu_k2[i] = (mu_k2[i] ?? 0) - (q ?? 0) * (mu_j[i] ?? 0);
        }
        mu_k2[j] = (mu_k2[j] ?? 0) - (q ?? 0);
        mu[k] = mu_k2;
      }
    }
    const lhs = typeof BstarNorm[k] === "number" ? BstarNorm[k] : 0;
    const mu_k = Array.isArray(mu[k]) ? mu[k] : new Array(m).fill(0);
    const muKKm1 = typeof mu_k[k - 1] === "number" ? mu_k[k - 1] : 0;
    let rhs = 0;
    if (BstarNorm[k - 1] !== void 0) {
      rhs = (delta - Number(muKKm1 ?? 0) ** 2) * BstarNorm[k - 1];
    }
    if (lhs < rhs) {
      if (!Array.isArray(B[k]) || !Array.isArray(B[k - 1]))
        break;
      const temp = B[k];
      B[k] = B[k - 1];
      B[k - 1] = temp;
      k = Math.max(k - 1, 1);
      for (let i = 0; i < m; i++) {
        const Bi = Array.isArray(B[i]) ? B[i] : new Array(n).fill(0);
        const Bstari = Array.isArray(Bstar[i]) ? Bstar[i] : new Array(n).fill(0);
        for (let j = 0; j < n; j++) {
          Bstari[j] = Bi[j] ?? 0;
        }
        for (let l = 0; l < i; l++) {
          const Bstarl = Array.isArray(Bstar[l]) ? Bstar[l] : new Array(n).fill(0);
          const mu_i = Array.isArray(mu[i]) ? mu[i] : new Array(m).fill(0);
          if (typeof BstarNorm[l] !== "number" || BstarNorm[l] === 0) {
            mu_i[l] = 0;
            mu[i] = mu_i;
            continue;
          }
          mu_i[l] = dot(Bi, Bstarl) / BstarNorm[l];
          mu[i] = mu_i;
          for (let j = 0; j < n; j++) {
            Bstari[j] -= (mu_i[l] ?? 0) * (Bstarl[j] ?? 0);
          }
        }
        BstarNorm[i] = dot(Bstari, Bstari);
        Bstar[i] = Bstari;
      }
    } else {
      k++;
    }
  }
  return B;
}
__name(lllReduce, "lllReduce");
function findShortVectors(basis, maxNorm = 1e4) {
  return basis.filter((v) => vectorNorm(v) > 0 && vectorNorm(v) < maxNorm);
}
__name(findShortVectors, "findShortVectors");
function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    sum += ai * bi;
  }
  return sum;
}
__name(dot, "dot");
function vectorNorm(v) {
  return Math.sqrt(dot(v, v));
}
__name(vectorNorm, "vectorNorm");
var DEFAULT_LLL_OPTIONS = {
  delta: 0.75,
  maxDegree: 15,
  precision: 1e3
};
var _LLLFactorizer = class _LLLFactorizer {
  constructor() {
    this.polynomialUtils = new PolynomialUtils();
  }
  /**
   * Factor a polynomial using LLL algorithm
   *
   * @param polynomial - Input polynomial as AST node
   * @param variable - Variable name (default: 'x')
   * @param options - LLL options
   * @returns Array of factored polynomials or null if irreducible
   */
  factor(polynomial, variable = "x", options = {}, context) {
    const opts = { ...DEFAULT_LLL_OPTIONS, ...options };
    try {
      if (!this.polynomialUtils.isPolynomial(polynomial, variable)) {
        return polynomial;
      }
      const coefficients = this.polynomialUtils.extractCoefficients(polynomial, variable);
      const degree = coefficients.length - 1;
      if (degree < 2) {
        return polynomial;
      }
      if (degree > opts.maxDegree) {
        return polynomial;
      }
      const ctx = context ?? {
        variable,
        maxIterations: 1,
        currentIteration: 1,
        steps: [],
        preferences: {
          preferCompleteFactorization: true,
          allowIrrationalFactors: false,
          allowComplexFactors: false,
          simplifyCoefficients: true,
          extractCommonFactors: false
        }
      };
      const factors = this.attemptLLLFactorization(coefficients, ctx, opts);
      if (!factors || factors.length === 0) {
        return polynomial;
      }
      let result;
      if (factors.length === 1) {
        result = factors[0];
      } else {
        result = factors.reduce((acc, f) => ({
          type: "BinaryExpression",
          operator: "*",
          left: acc,
          right: f
        }));
      }
      return simplify$1(result, { expand: false });
    } catch (error) {
      return polynomial;
    }
  }
  /**
   * Attempt LLL-based factorization
   *
   * Note: This is called only after all simpler strategies (common-factor, difference-of-squares, etc.) have failed.
   *       No pattern検出や共通因数除去はここでは行わない。
   */
  attemptLLLFactorization(coefficients, context, options) {
    const degree = coefficients.length - 1;
    if (degree < 3)
      return null;
    const bound = 1e3;
    const bases = createLatticeBases(coefficients, bound);
    if (!bases || bases.length === 0)
      return null;
    const allCandidates = [];
    for (let m = 1; m <= bases.length; m++) {
      const basis = bases[m - 1];
      if (!basis)
        continue;
      const reduced = lllReduce(basis);
      if (!reduced || reduced.length === 0)
        continue;
      const shortVecs = findShortVectors(reduced, 1e4);
      if (!shortVecs || shortVecs.length === 0)
        continue;
      for (const v of shortVecs) {
        const coeffs = v.map((x) => Math.round(x));
        const deg = coeffs.findIndex((x) => Math.abs(x) > 1e-8);
        const actualDegree = coeffs.length - 1 - deg;
        if (deg < 0)
          continue;
        if (actualDegree !== m)
          continue;
        const lead = coeffs[deg];
        if (typeof lead !== "number" || Math.abs(lead) !== 1)
          continue;
        if (coeffs.length <= 1)
          continue;
        if (!coeffs.some((x) => Math.abs(x) > 1e-8))
          continue;
        const div = tryPolyDivide(coefficients, coeffs.slice(deg));
        if (div && div.remainder.every((x) => Math.abs(x ?? 0) < 1e-8) && div.quotient.length > 0) {
          allCandidates.push(coeffs.slice(deg));
        }
      }
    }
    if (allCandidates.length === 0)
      return null;
    const variable = context.variable || "x";
    const utils = this.polynomialUtils;
    function recursiveFactor(coeffs, remainingCandidates, used2) {
      if (coeffs.length <= 1 || coeffs.length === 2 && Math.abs(coeffs[0] ?? 0) < 1e-8) {
        return [utils.coefficientsToAST(coeffs, variable)];
      }
      for (let i = 0; i < remainingCandidates.length; i++) {
        if (used2[i])
          continue;
        const cand = remainingCandidates[i];
        if (!cand || cand[0] === 0 || cand[cand.length - 1] === 0)
          continue;
        const div = tryPolyDivide(coeffs, cand);
        if (div && div.remainder.every((x) => Math.abs(x ?? 0) < 1e-8) && div.quotient.length > 0) {
          used2[i] = true;
          const subfactors = recursiveFactor(div.quotient, remainingCandidates, used2);
          used2[i] = false;
          if (subfactors) {
            return [utils.coefficientsToAST(cand, variable), ...subfactors];
          }
        }
      }
      return null;
    }
    __name(recursiveFactor, "recursiveFactor");
    const used = new Array(allCandidates.length).fill(false);
    const result = recursiveFactor(coefficients, allCandidates, used);
    if (result && result.length > 0) {
      return result;
    }
    return null;
  }
};
__name(_LLLFactorizer, "LLLFactorizer");
var LLLFactorizer = _LLLFactorizer;
function tryPolyDivide(dividend, divisor) {
  const n = dividend.length - 1;
  const m = divisor.length - 1;
  if (m < 0 || n < m)
    return null;
  const quotient = new Array(n - m + 1).fill(0);
  const remainder = dividend.slice();
  for (let k = n - m; k >= 0; k--) {
    if (typeof divisor[m] !== "number" || Math.abs(divisor[m] ?? 0) < 1e-8)
      return null;
    if (typeof remainder[m + k] !== "number")
      return null;
    const q = remainder[m + k] / divisor[m];
    quotient[k] = q;
    for (let j = 0; j <= m; j++) {
      if (typeof divisor[j] !== "number")
        return null;
      remainder[j + k] = (remainder[j + k] ?? 0) - q * divisor[j];
    }
  }
  return { quotient, remainder };
}
__name(tryPolyDivide, "tryPolyDivide");
function lllFactor(polynomial, variable = "x", options = {}) {
  const factorizer = new LLLFactorizer();
  return factorizer.factor(polynomial, variable, options);
}
__name(lllFactor, "lllFactor");
var _LLLFactorizationStrategy = class _LLLFactorizationStrategy {
  constructor() {
    this.name = "lll-factorization";
    this.priority = 80;
    this.description = "Advanced polynomial factorization using LLL lattice basis reduction";
  }
  canApply(node, context) {
    if (this.containsMultiplication(node)) {
      return false;
    }
    if (!this.isPolynomial(node, context.variable)) {
      return false;
    }
    const degree = this.getPolynomialDegree(node, context.variable);
    return degree >= 3 || context.currentIteration > 1;
  }
  apply(node, context) {
    try {
      const originalLatex = astToLatex(node);
      const debugSteps = [`LLL: called with node ${originalLatex}`];
      const lllOptions = {
        delta: 0.75,
        maxDegree: 15,
        precision: 1e3
      };
      const factored = lllFactor(node, context.variable, { ...lllOptions });
      if (!factored || astToLatex(factored) === originalLatex) {
        return {
          success: false,
          ast: node,
          changed: false,
          steps: [...debugSteps, `LLL: Polynomial appears to be irreducible or too complex`],
          strategyUsed: this.name,
          canContinue: false
        };
      }
      const simplifiedExpression = basicSimplify(factored);
      const factoredLatex = astToLatex(simplifiedExpression);
      debugSteps.push(`LLL: factoredLatex = ${factoredLatex}`);
      return {
        success: true,
        ast: simplifiedExpression,
        changed: true,
        steps: [...debugSteps, `Applied LLL factorization algorithm`, `Result: ${factoredLatex}`],
        strategyUsed: this.name,
        canContinue: true
      };
    } catch (error) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: [`LLL failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        strategyUsed: this.name,
        canContinue: false
      };
    }
  }
  /**
   * Check if node represents a polynomial in the given variable
   */
  isPolynomial(node, variable) {
    switch (node.type) {
      case "NumberLiteral":
        return true;
      case "Identifier":
        return node.name === variable || this.isConstant(node.name);
      case "BinaryExpression": {
        const { operator, left, right } = node;
        switch (operator) {
          case "+":
          case "-":
          case "*":
            return this.isPolynomial(left, variable) && this.isPolynomial(right, variable);
          case "^":
            return this.isPolynomial(left, variable) && right.type === "NumberLiteral" && Number.isInteger(right.value) && right.value >= 0;
          default:
            return false;
        }
      }
      default:
        return false;
    }
  }
  /**
   * Check if identifier represents a constant
   */
  isConstant(name) {
    return name.length === 1 && !["x", "y", "z"].includes(name.toLowerCase());
  }
  /**
   * Get polynomial degree (simplified estimation)
   */
  getPolynomialDegree(node, variable) {
    switch (node.type) {
      case "NumberLiteral":
        return 0;
      case "Identifier":
        return node.name === variable ? 1 : 0;
      case "BinaryExpression": {
        const { operator, left, right } = node;
        switch (operator) {
          case "+":
          case "-":
            return Math.max(this.getPolynomialDegree(left, variable), this.getPolynomialDegree(right, variable));
          case "*":
            return this.getPolynomialDegree(left, variable) + this.getPolynomialDegree(right, variable);
          case "^":
            if (left.type === "Identifier" && left.name === variable && right.type === "NumberLiteral") {
              return right.value;
            }
            return this.getPolynomialDegree(left, variable);
          default:
            return 0;
        }
      }
      default:
        return 0;
    }
  }
  /**
   * Construct factored expression from factor array
   */
  constructFactoredExpression(factors) {
    if (factors.length === 0) {
      return { type: "NumberLiteral", value: 1 };
    }
    if (factors.length === 1) {
      return factors[0];
    }
    let result = factors[0];
    for (let i = 1; i < factors.length; i++) {
      result = {
        type: "BinaryExpression",
        operator: "*",
        left: result,
        right: factors[i]
      };
    }
    return result;
  }
  /**
   * Check if node contains multiplication (indicating it's already factored)
   */
  containsMultiplication(node) {
    switch (node.type) {
      case "BinaryExpression":
        if (node.operator === "*") {
          return true;
        }
        return this.containsMultiplication(node.left) || this.containsMultiplication(node.right);
      default:
        return false;
    }
  }
};
__name(_LLLFactorizationStrategy, "LLLFactorizationStrategy");
var LLLFactorizationStrategy = _LLLFactorizationStrategy;
var _PowerSubstitutionStrategy = class _PowerSubstitutionStrategy {
  constructor() {
    this.name = "power-substitution";
    this.description = "Factors polynomials by substitution t = x^k (k >= 2)";
    this.priority = 110;
  }
  canApply(node, context) {
    const detected = this.detectPowerSubstitution(node, context.variable);
    if (!detected)
      return false;
    const { k, coeffs } = detected;
    return k >= 2 && coeffs.length >= 3 && this.canFactorAsPolynomial(coeffs);
  }
  apply(node, context) {
    const detected = this.detectPowerSubstitution(node, context.variable);
    if (!detected) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["Applied power substitution strategy"],
        strategyUsed: this.name,
        canContinue: false
      };
    }
    const { k, coeffs } = detected;
    if (k < 2 || coeffs.length < 3) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["Applied power substitution strategy"],
        strategyUsed: this.name,
        canContinue: false
      };
    }
    const roots = this.solvePolynomial(coeffs);
    if (!roots || roots.length === 0) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["Applied power substitution strategy"],
        strategyUsed: this.name,
        canContinue: false
      };
    }
    let factored = this.buildPowerFactor(roots[0] ?? 0, context.variable, k);
    for (let i = 1; i < roots.length; ++i) {
      factored = {
        type: "BinaryExpression",
        operator: "*",
        left: factored,
        right: this.buildPowerFactor(roots[i] ?? 0, context.variable, k)
      };
    }
    const simplified = simplify$1(factored, { expand: false });
    return {
      success: true,
      ast: simplified,
      changed: true,
      steps: [
        `Applied power substitution: ${bracketAppend(`t = ${context.variable}^${k}`)}`,
        "middle-simplify (expand: false) applied"
      ],
      strategyUsed: this.name,
      canContinue: false
    };
  }
  // --- ユーティリティ ---
  // x^{nk} + ... の形か判定し、kと係数配列を返す
  detectPowerSubstitution(node, variable) {
    const terms = this.extractTerms(node).filter(Boolean);
    if (terms.length === 0)
      return null;
    const powers = terms.map((term) => this.getPower(term, variable)).filter((p) => typeof p === "number");
    if (powers.length === 0)
      return null;
    const k = powers.reduce((a, b) => this.gcd(a, b));
    if (!k || k < 1)
      return null;
    const maxN = Math.max(...powers.map((p) => p / k));
    if (!Number.isFinite(maxN) || maxN < 0)
      return null;
    const coeffs = Array(Math.floor(maxN) + 1).fill(0);
    for (let i = 0; i < terms.length; ++i) {
      const p = powers[i];
      const term = terms[i];
      if (typeof p !== "number" || typeof term === "undefined")
        continue;
      const n = p / k;
      const idx = Math.floor(maxN - n);
      if (Number.isInteger(n) && n >= 0 && n <= maxN && idx >= 0 && idx < coeffs.length && typeof coeffs[idx] === "number") {
        coeffs[idx] += this.getCoefficient(term, variable);
      }
    }
    return { k, coeffs };
  }
  extractTerms(node) {
    if (node.type === "BinaryExpression") {
      const expr = node;
      if (expr.operator === "+") {
        return [...this.extractTerms(expr.left), ...this.extractTerms(expr.right)];
      } else if (expr.operator === "-") {
        return [
          ...this.extractTerms(expr.left),
          ...this.extractTerms(expr.right).map((t) => this.negateTerm(t))
        ];
      }
    }
    return [node];
  }
  negateTerm(term) {
    return {
      type: "BinaryExpression",
      operator: "*",
      left: { type: "NumberLiteral", value: -1 },
      right: term
    };
  }
  getPower(term, variable) {
    if (term.type === "NumberLiteral")
      return 0;
    if (term.type === "Identifier")
      return term.name === variable ? 1 : 0;
    if (term.type === "BinaryExpression") {
      const expr = term;
      if (expr.operator === "^" && expr.left.type === "Identifier" && expr.left.name === variable && expr.right.type === "NumberLiteral") {
        return expr.right.value;
      }
      if (expr.operator === "*") {
        return this.getPower(expr.left, variable) + this.getPower(expr.right, variable);
      }
    }
    return 0;
  }
  getCoefficient(term, variable) {
    if (term.type === "NumberLiteral")
      return term.value;
    if (term.type === "Identifier")
      return term.name === variable ? 1 : 0;
    if (term.type === "BinaryExpression") {
      const expr = term;
      if (expr.operator === "^") {
        return this.getCoefficient(expr.left, variable);
      }
      if (expr.operator === "*") {
        return this.getCoefficient(expr.left, variable) * this.getCoefficient(expr.right, variable);
      }
    }
    return 1;
  }
  gcd(a, b) {
    if (!b)
      return Math.abs(a);
    return this.gcd(b, a % b);
  }
  // 係数配列が因数分解可能か（判定は簡易）
  canFactorAsPolynomial(coeffs) {
    if (coeffs.length === 3) {
      const [a, b, c] = coeffs;
      if (typeof a !== "number" || typeof b !== "number" || typeof c !== "number")
        return false;
      const D = b * b - 4 * a * c;
      return D >= 0 && Number.isInteger(Math.sqrt(D));
    }
    if (coeffs.length === 4) {
      for (let r = -20; r <= 20; ++r) {
        if (aPolyEval(coeffs, r) === 0)
          return true;
      }
      return false;
    }
    return false;
  }
  // 2次・3次のみサポート
  solvePolynomial(coeffs) {
    if (coeffs.length === 3) {
      const [a, b, c] = coeffs;
      if (typeof a !== "number" || typeof b !== "number" || typeof c !== "number")
        return null;
      const D = b * b - 4 * a * c;
      if (D < 0)
        return null;
      const sqrtD = Math.sqrt(D);
      return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
    }
    if (coeffs.length === 4) {
      const roots = [];
      let poly = coeffs.slice();
      for (let r = -20; r <= 20; ++r) {
        while (poly.length > 1 && aPolyEval(poly, r) === 0) {
          roots.push(r);
          poly = aPolyDiv(poly, r);
        }
      }
      if (roots.length === 3)
        return roots;
      return null;
    }
    return null;
  }
  buildPowerFactor(root, variable, k) {
    const powerExpr = {
      type: "BinaryExpression",
      operator: "^",
      left: { type: "Identifier", name: variable, scope: "free", uniqueId: `free_${variable}` },
      right: { type: "NumberLiteral", value: k }
    };
    if (root === 0)
      return powerExpr;
    const operator = root > 0 ? "-" : "+";
    function decimalToFraction(x, tol = 1e-10) {
      if (Number.isInteger(x))
        return { num: x, den: 1 };
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      let denominator = 1;
      while (Math.abs(x * denominator - Math.round(x * denominator)) > tol && denominator < 1e4) {
        denominator *= 10;
      }
      const numerator = Math.round(x * denominator);
      function gcd2(a, b) {
        return b ? gcd2(b, a % b) : Math.abs(a);
      }
      __name(gcd2, "gcd");
      const g = gcd2(numerator, denominator);
      return { num: sign * numerator / g, den: denominator / g };
    }
    __name(decimalToFraction, "decimalToFraction");
    let rightNode;
    const absRoot = Math.abs(root);
    if (Number.isInteger(absRoot)) {
      rightNode = { type: "NumberLiteral", value: absRoot };
    } else {
      const frac = decimalToFraction(absRoot);
      if (frac && frac.den !== 1) {
        rightNode = {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: frac.num },
          denominator: { type: "NumberLiteral", value: frac.den }
        };
      } else {
        rightNode = { type: "NumberLiteral", value: absRoot };
      }
    }
    return {
      type: "BinaryExpression",
      operator,
      left: powerExpr,
      right: rightNode
    };
  }
};
__name(_PowerSubstitutionStrategy, "PowerSubstitutionStrategy");
var PowerSubstitutionStrategy = _PowerSubstitutionStrategy;
function aPolyEval(coeffs, x) {
  return coeffs.reduce((acc, c) => acc * x + c, 0);
}
__name(aPolyEval, "aPolyEval");
function aPolyDiv(coeffs, r) {
  const out = [];
  let acc = 0;
  for (let i = 0; i < coeffs.length; ++i) {
    if (typeof coeffs[i] !== "number")
      continue;
    acc = acc * r + coeffs[i];
    if (i < coeffs.length - 1)
      out.push(acc);
  }
  return out;
}
__name(aPolyDiv, "aPolyDiv");
var _PerfectPowerStrategy = class _PerfectPowerStrategy {
  constructor() {
    this.name = "perfect-power";
    this.description = "Detects and converts perfect power polynomials (e.g. (x+a)^k)";
    this.priority = 130;
  }
  canApply(node, context) {
    if (this.hasOtherVariables(node, context.variable)) {
      return false;
    }
    const result = this.detectPerfectPower(node, context.variable);
    if (!result)
      return false;
    if (this.isAlreadyPerfectPower(node, result, context.variable))
      return false;
    return true;
  }
  // nodeにx以外の変数が含まれていればtrue
  hasOtherVariables(node, variable) {
    if (node.type === "Identifier") {
      return node.name !== variable;
    }
    if (node.type === "BinaryExpression") {
      return this.hasOtherVariables(node.left, variable) || this.hasOtherVariables(node.right, variable);
    }
    if (node.type === "UnaryExpression") {
      return this.hasOtherVariables(node.operand, variable);
    }
    if (node.type === "FunctionCall") {
      return node.args.some((arg) => this.hasOtherVariables(arg, variable));
    }
    return false;
  }
  apply(node, context) {
    const result = this.detectPerfectPower(node, context.variable);
    if (!result || this.isAlreadyPerfectPower(node, result, context.variable)) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["Applied perfect power strategy"],
        strategyUsed: this.name,
        canContinue: false
      };
    }
    const { a, b, k } = result;
    const axb = {
      type: "BinaryExpression",
      operator: "+",
      left: a === 1 ? {
        type: "Identifier",
        name: context.variable,
        scope: "free",
        uniqueId: `free_${context.variable}`
      } : {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "NumberLiteral", value: a },
        right: {
          type: "Identifier",
          name: context.variable,
          scope: "free",
          uniqueId: `free_${context.variable}`
        }
      },
      right: { type: "NumberLiteral", value: b }
    };
    const resultAst = {
      type: "BinaryExpression",
      operator: "^",
      left: axb,
      right: { type: "NumberLiteral", value: k }
    };
    const simplifiedAst = simplify$1(resultAst, { expand: false });
    if (JSON.stringify(simplifiedAst) === JSON.stringify(node)) {
      return {
        success: false,
        ast: node,
        changed: false,
        steps: ["Applied perfect power strategy"],
        strategyUsed: this.name,
        canContinue: false
      };
    }
    return {
      success: true,
      ast: simplifiedAst,
      changed: true,
      steps: [
        `Detected perfect power: (${a === 1 ? context.variable : a + context.variable} + ${b})^${k}`
      ],
      strategyUsed: this.name,
      canContinue: false
    };
  }
  // 既に (ax+b)^k の形や単項式 x^k ならtrue
  isAlreadyPerfectPower(node, result, variable) {
    if (node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "BinaryExpression" && node.left.operator === "+" && (node.left.left.type === "Identifier" && result.a === 1 && node.left.left.name === variable || node.left.left.type === "BinaryExpression" && node.left.left.operator === "*" && node.left.left.left.type === "NumberLiteral" && node.left.left.left.value === result.a && node.left.left.right.type === "Identifier" && node.left.left.right.name === variable) && node.left.right.type === "NumberLiteral" && node.left.right.value === result.b && node.right.type === "NumberLiteral" && node.right.value === result.k) {
      return true;
    }
    if (node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral" && result.a === 1 && result.b === 0 && node.right.value === result.k) {
      return true;
    }
    return false;
  }
  // --- ユーティリティ ---
  // (ax+b)^k の展開形か判定し、a, b, kを返す
  detectPerfectPower(node, variable) {
    const terms = this.extractTerms(node);
    const deg = Math.max(...terms.map((term) => this.getPower(term, variable)));
    if (deg < 2 || deg > 8)
      return null;
    const coeffs = Array(deg + 1).fill(0);
    for (const term of terms) {
      const p = this.getPower(term, variable);
      const c = this.getCoefficient(term, variable);
      const idx = deg - p;
      if (typeof p === "number" && typeof c === "number" && p >= 0 && p <= deg && idx >= 0 && idx < coeffs.length && typeof coeffs[idx] === "number") {
        coeffs[idx] += c;
      }
    }
    for (let k = 2; k <= deg; ++k) {
      for (let a = 1; a <= 3; ++a) {
        for (let b = -10; b <= 10; ++b) {
          const binom = this.expandBinomial(a, b, k, deg);
          if (binom.length !== coeffs.length)
            continue;
          let match = true;
          for (let i = 0; i < coeffs.length; ++i) {
            if (typeof binom[i] !== "number" || typeof coeffs[i] !== "number" || Math.abs(binom[i] - coeffs[i]) > 1e-8) {
              match = false;
              break;
            }
          }
          if (match)
            return { a, b, k };
        }
      }
    }
    return null;
  }
  extractTerms(node) {
    if (node.type === "BinaryExpression") {
      const expr = node;
      if (expr.operator === "+") {
        return [...this.extractTerms(expr.left), ...this.extractTerms(expr.right)];
      } else if (expr.operator === "-") {
        return [
          ...this.extractTerms(expr.left),
          ...this.extractTerms(expr.right).map((t) => this.negateTerm(t))
        ];
      }
    }
    return [node];
  }
  negateTerm(term) {
    return {
      type: "BinaryExpression",
      operator: "*",
      left: { type: "NumberLiteral", value: -1 },
      right: term
    };
  }
  getPower(term, variable) {
    if (term.type === "NumberLiteral")
      return 0;
    if (term.type === "Identifier")
      return term.name === variable ? 1 : 0;
    if (term.type === "BinaryExpression") {
      const expr = term;
      if (expr.operator === "^" && expr.left.type === "Identifier" && expr.left.name === variable && expr.right.type === "NumberLiteral") {
        return expr.right.value;
      }
      if (expr.operator === "*") {
        return this.getPower(expr.left, variable) + this.getPower(expr.right, variable);
      }
    }
    return 0;
  }
  getCoefficient(term, variable) {
    if (term.type === "NumberLiteral")
      return term.value;
    if (term.type === "Identifier")
      return term.name === variable ? 1 : 0;
    if (term.type === "BinaryExpression") {
      const expr = term;
      if (expr.operator === "^") {
        return this.getCoefficient(expr.left, variable);
      }
      if (expr.operator === "*") {
        return this.getCoefficient(expr.left, variable) * this.getCoefficient(expr.right, variable);
      }
    }
    return 1;
  }
  // (ax+b)^k の展開係数
  expandBinomial(a, b, k, deg) {
    const coeffs = Array(deg + 1).fill(0);
    for (let i = 0; i <= k; ++i) {
      coeffs[deg - i] = this.binom(k, i) * Math.pow(a, i) * Math.pow(b, k - i);
    }
    return coeffs;
  }
  binom(n, k) {
    if (k < 0 || k > n)
      return 0;
    let res = 1;
    for (let i = 1; i <= k; ++i) {
      res *= n - (k - i);
      res /= i;
    }
    return res;
  }
};
__name(_PerfectPowerStrategy, "PerfectPowerStrategy");
var PerfectPowerStrategy = _PerfectPowerStrategy;
var _PatternUtils = class _PatternUtils {
  static getCoefficient(node) {
    if (node.type === "NumberLiteral") {
      return node.value;
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      if (node.left.type === "NumberLiteral") {
        return node.left.value;
      }
      if (node.right.type === "NumberLiteral") {
        return node.right.value;
      }
    }
    return 1;
  }
  static getVariablePart(node) {
    if (node.type === "Identifier") {
      return node;
    }
    if (node.type === "BinaryExpression" && node.operator === "^") {
      return node;
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      if (node.left.type === "NumberLiteral") {
        return node.right;
      }
      if (node.right.type === "NumberLiteral") {
        return node.left;
      }
    }
    return null;
  }
  static gcd(a, b) {
    if (b === 0)
      return Math.abs(a);
    return this.gcd(b, a % b);
  }
  static gcdArray(numbers) {
    if (numbers.length === 0)
      return 1;
    if (numbers.length === 1) {
      const first = numbers[0];
      return first !== void 0 ? Math.abs(first) : 1;
    }
    let result = numbers[0];
    if (result === void 0)
      return 1;
    for (let i = 1; i < numbers.length; i++) {
      const current = numbers[i];
      if (current === void 0)
        continue;
      result = this.gcd(result, current);
      if (result === 1)
        break;
    }
    return Math.abs(result);
  }
  static areStructurallyEqual(a, b) {
    if (a.type !== b.type)
      return false;
    switch (a.type) {
      case "NumberLiteral":
        return a.value === b.value;
      case "Identifier": {
        const idA = a;
        const idB = b;
        return idA.name === idB.name;
      }
      case "BinaryExpression": {
        const binA = a;
        const binB = b;
        return binA.operator === binB.operator && this.areStructurallyEqual(binA.left, binB.left) && this.areStructurallyEqual(binA.right, binB.right);
      }
      default:
        return false;
    }
  }
  static createNumber(value) {
    return {
      type: "NumberLiteral",
      value
    };
  }
  static createIdentifier(name) {
    return {
      type: "Identifier",
      name
    };
  }
  static createBinaryExpression(left, operator, right) {
    return {
      type: "BinaryExpression",
      left,
      operator,
      right
    };
  }
};
__name(_PatternUtils, "PatternUtils");
var PatternUtils = _PatternUtils;
var _CyclotomicPattern = class _CyclotomicPattern {
  constructor() {
    this.name = "cyclotomic";
    this.description = "Factor x^n - 1, x^n + 1 into cyclotomic polynomials";
    this.priority = 90;
  }
  canApply(node, _context) {
    return this.matches(node);
  }
  apply(node, _context) {
    const factored = this.factor(node);
    return {
      success: !!factored,
      ast: factored ?? node,
      changed: !!factored,
      steps: factored ? [`[CyclotomicPattern] Factored: ...`] : ["No cyclotomic factorization found"],
      strategyUsed: this.name,
      canContinue: true
    };
  }
  matches(node) {
    if (node.type !== "BinaryExpression")
      return false;
    if (node.operator !== "-" && node.operator !== "+")
      return false;
    const left = node.left;
    const right = node.right;
    if (left.type === "BinaryExpression" && left.operator === "^" && left.left.type === "Identifier" && left.right.type === "NumberLiteral" && right.type === "NumberLiteral" && right.value === 1) {
      const n = left.right.value;
      if (n < 2)
        return false;
      if (node.operator === "+") {
        if (n % 2 === 0) {
          let m = n;
          while (m % 2 === 0) {
            m = m / 2;
          }
          if (m === 1)
            return false;
        }
      }
      return true;
    }
    return false;
  }
  factor(node) {
    if (!this.matches(node))
      return null;
    const bin = node;
    const left = bin.left;
    const variable = left.left.name;
    const n = left.right.value;
    const isMinus = bin.operator === "-";
    if (isMinus) {
      return this.factorXNMinus1(variable, n);
    } else {
      return this.factorXNPlus1(variable, n);
    }
  }
  factorXNMinus1(variable, n) {
    const x = PatternUtils.createIdentifier(variable);
    const one = PatternUtils.createNumber(1);
    const xMinus1 = PatternUtils.createBinaryExpression(x, "-", one);
    let sum = PatternUtils.createNumber(1);
    for (let k = n - 1; k >= 1; k--) {
      const term = PatternUtils.createBinaryExpression(PatternUtils.createIdentifier(variable), "^", PatternUtils.createNumber(k));
      sum = PatternUtils.createBinaryExpression(sum, "+", term);
    }
    return PatternUtils.createBinaryExpression(xMinus1, "*", sum);
  }
  factorXNPlus1(variable, n) {
    const x = PatternUtils.createIdentifier(variable);
    const one = PatternUtils.createNumber(1);
    const xPlus1 = PatternUtils.createBinaryExpression(x, "+", one);
    let sum = PatternUtils.createNumber(1);
    for (let k = n - 1; k >= 1; k--) {
      const term = PatternUtils.createBinaryExpression(PatternUtils.createIdentifier(variable), "^", PatternUtils.createNumber(k));
      const sign = (n - 1 - k) % 2 === 0 ? 1 : -1;
      const signedTerm = sign === 1 ? term : PatternUtils.createBinaryExpression(PatternUtils.createNumber(-1), "*", term);
      sum = PatternUtils.createBinaryExpression(sum, "+", signedTerm);
    }
    return PatternUtils.createBinaryExpression(xPlus1, "*", sum);
  }
};
__name(_CyclotomicPattern, "CyclotomicPattern");
var CyclotomicPattern = _CyclotomicPattern;
var _QuadraticPattern = class _QuadraticPattern {
  constructor() {
    this.name = "quadratic-factorization";
    this.description = "Factor quadratic expressions ax\xB2 + bx + c";
    this.priority = 120;
  }
  canApply(node, _context) {
    return this.matches(node);
  }
  apply(node, _context) {
    const factored = this.factor(node);
    return {
      success: !!factored,
      ast: factored ?? node,
      changed: !!factored,
      steps: factored ? [`[QuadraticPattern] Factored: ...`] : ["No quadratic factorization found"],
      strategyUsed: this.name,
      canContinue: true
    };
  }
  matches(node) {
    if (node.type === "BinaryExpression") {
      const quadratic = this.extractQuadraticCoefficients(node);
      return quadratic !== null && quadratic.a !== 0 && (quadratic.b !== 0 || quadratic.c !== 0);
    }
    return false;
  }
  factor(node) {
    if (!this.matches(node))
      return null;
    const quadratic = this.extractQuadraticCoefficients(node);
    if (!quadratic)
      return null;
    const { a, b, c, variable } = quadratic;
    const factors = this.findQuadraticFactors(a, b, c);
    if (!factors)
      return null;
    const { p, q, r, s } = factors;
    const firstFactor = this.buildLinearFactor(p, q, variable);
    const secondFactor = this.buildLinearFactor(r, s, variable);
    const factored = PatternUtils.createBinaryExpression(firstFactor, "*", secondFactor);
    if (JSON.stringify(factored) === JSON.stringify(node)) {
      return null;
    }
    return factored;
  }
  buildLinearFactor(coeff, constant, variable) {
    const coeffTerm = coeff === 1 ? PatternUtils.createIdentifier(variable) : PatternUtils.createBinaryExpression(PatternUtils.createNumber(coeff), "*", PatternUtils.createIdentifier(variable));
    if (constant === 0) {
      return coeffTerm;
    } else if (constant > 0) {
      return PatternUtils.createBinaryExpression(coeffTerm, "+", PatternUtils.createNumber(constant));
    } else {
      return PatternUtils.createBinaryExpression(coeffTerm, "-", PatternUtils.createNumber(-constant));
    }
  }
  extractQuadraticCoefficients(node) {
    const terms = this.parsePolynomialTerms(node);
    if (terms.length === 0)
      return null;
    let a = 0, b = 0, c = 0;
    let variable = "x";
    for (const term of terms) {
      if (term.degree === 2) {
        a = term.coefficient;
        variable = term.variable;
      } else if (term.degree === 1) {
        b = term.coefficient;
      } else if (term.degree === 0) {
        c = term.coefficient;
      }
    }
    return a !== 0 ? { a, b, c, variable } : null;
  }
  parsePolynomialTerms(node) {
    const terms = [];
    const collectTerms = /* @__PURE__ */ __name((n) => {
      if (n.type === "BinaryExpression" && (n.operator === "+" || n.operator === "-")) {
        collectTerms(n.left);
        if (n.operator === "-") {
          terms.push({
            type: "BinaryExpression",
            operator: "*",
            left: { type: "NumberLiteral", value: -1 },
            right: n.right
          });
        } else {
          terms.push(n.right);
        }
      } else {
        terms.push(n);
      }
    }, "collectTerms");
    collectTerms(node);
    const parsed = terms.map((term) => {
      let coefficient = 1;
      let degree = 0;
      let variable = "";
      if (term.type === "NumberLiteral") {
        coefficient = term.value;
        degree = 0;
        variable = "x";
      } else if (term.type === "Identifier") {
        coefficient = 1;
        degree = 1;
        variable = term.name;
      } else if (term.type === "BinaryExpression") {
        if (term.operator === "*") {
          const left = term.left;
          const right = term.right;
          if (left.type === "NumberLiteral" && right.type === "Identifier") {
            coefficient = left.value;
            degree = 1;
            variable = right.name;
          } else if (left.type === "Identifier" && right.type === "NumberLiteral") {
            coefficient = right.value;
            degree = 1;
            variable = left.name;
          } else if (left.type === "BinaryExpression" && left.operator === "^" && right.type === "NumberLiteral") {
            if (left.left.type === "Identifier" && left.right.type === "NumberLiteral") {
              coefficient = right.value;
              degree = left.right.value;
              variable = left.left.name;
            }
          } else if (left.type === "Identifier" && right.type === "BinaryExpression" && right.operator === "^") {
            if (right.left.type === "Identifier" && right.right.type === "NumberLiteral" && left.name === right.left.name) {
              coefficient = 1;
              degree = 1 + right.right.value;
              variable = left.name;
            }
          } else if (left.type === "NumberLiteral" && right.type === "BinaryExpression" && right.operator === "*") {
            coefficient = left.value;
            degree = 1;
            variable = "?";
          } else if (left.type === "NumberLiteral" && right.type === "NumberLiteral") {
            coefficient = left.value * right.value;
            degree = 0;
            variable = "x";
          } else if (left.type === "NumberLiteral" && right.type === "BinaryExpression" && right.operator === "^") {
            if (right.left.type === "Identifier" && right.right.type === "NumberLiteral") {
              coefficient = left.value;
              degree = right.right.value;
              variable = right.left.name;
            }
          } else if (left.type === "NumberLiteral" && right.type === "BinaryExpression") {
            coefficient = left.value;
            degree = 1;
            variable = "?";
          } else if (left.type === "NumberLiteral") {
            coefficient = left.value;
            degree = 0;
            variable = "x";
          }
        } else if (term.operator === "^") {
          if (term.left.type === "Identifier" && term.right.type === "NumberLiteral") {
            coefficient = 1;
            degree = term.right.value;
            variable = term.left.name;
          }
        }
      }
      return { coefficient, degree, variable };
    });
    return parsed;
  }
  findQuadraticFactors(a, b, c) {
    if (a === 1) {
      for (let p = -20; p <= 20; p++) {
        for (let q = p; q <= 20; q++) {
          if (p * q === c && p + q === b) {
            return { p: 1, q: p, r: 1, s: q };
          }
          if (p !== q && q * p === c && q + p === b) {
            return { p: 1, q, r: 1, s: p };
          }
        }
      }
    }
    return null;
  }
};
__name(_QuadraticPattern, "QuadraticPattern");
var QuadraticPattern = _QuadraticPattern;
var factorizationEngine = new FactorizationEngine();
try {
  factorizationEngine.registerStrategy(new CommonFactorStrategy());
  factorizationEngine.registerStrategy(new QuadraticPattern());
  factorizationEngine.registerStrategy(new CyclotomicPattern());
  factorizationEngine.registerStrategy(new PerfectPowerStrategy());
  factorizationEngine.registerStrategy(new CommonFactorStrategy());
  factorizationEngine.registerStrategy(new DifferenceOfSquaresStrategy());
  factorizationEngine.registerStrategy(new GroupingStrategy());
  factorizationEngine.registerStrategy(new PowerSubstitutionStrategy());
  if (config.FACTORIZATION.useLLL) {
    factorizationEngine.registerStrategy(new LLLFactorizationStrategy());
  }
  if (config.FACTORIZATION.useBerlekampZassenhaus) {
    factorizationEngine.registerStrategy(new BerlekampZassenhausStrategy());
  }
} catch (strategyError) {
  throw new Error(`Strategy registration failed: ${strategyError instanceof Error ? strategyError.message : "Unknown error"}`);
}
function factorWithSteps(node, variable = "x", preferences = {}, steps = []) {
  try {
    let collectFactors = function(expr) {
      if (expr.type === "BinaryExpression" && expr.operator === "*") {
        return [...collectFactors(expr.left), ...collectFactors(expr.right)];
      } else {
        return [expr];
      }
    };
    __name(collectFactors, "collectFactors");
    let currentAst = node;
    let changed = false;
    const initialResult = factorizationEngine.factor(currentAst, variable, preferences);
    steps.push(...initialResult.steps);
    currentAst = initialResult.ast;
    changed = initialResult.changed;
    const factors = collectFactors(currentAst);
    const processedFactors = factors.flatMap((factor) => {
      if (factor.type === "BinaryExpression" && factor.operator === "^" && factor.right.type === "NumberLiteral" && Number.isInteger(factor.right.value) && factor.right.value >= 2) {
        const base = factor.left;
        const exponent = factor.right.value;
        const baseResult = factorWithSteps(base, variable, preferences, steps);
        const baseFactors = collectFactors(baseResult.ast);
        const poweredFactors = baseFactors.map((baseFactor) => ({
          type: "BinaryExpression",
          operator: "^",
          left: baseFactor,
          right: { type: "NumberLiteral", value: exponent }
        }));
        steps.push(`Factored base and distributed power: ${stepsAstToLatex(factor)}`);
        changed = changed || baseResult.changed;
        return poweredFactors;
      } else {
        const result = factorizationEngine.factor(factor, variable, preferences);
        steps.push(...result.steps);
        changed = changed || result.changed;
        return [result.ast];
      }
    });
    const finalAst = processedFactors.reduce((acc, factor) => {
      return acc ? {
        type: "BinaryExpression",
        operator: "*",
        left: acc,
        right: factor
      } : factor;
    }, null);
    return {
      ast: finalAst || currentAst,
      steps,
      changed
    };
  } catch (error) {
    throw new Error(`Factorization engine error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
__name(factorWithSteps, "factorWithSteps");
var DEFAULT_SIMPLIFY_OPTIONS = {
  combineLikeTerms: true,
  expand: true,
  simplifyFractions: true,
  applyIdentities: true,
  convertSqrtToExponential: true,
  advancedExponentialSimplification: true,
  maxDepth: 10,
  usePatternRecognition: true,
  factor: true
};
function simplify(node, options = {}, steps, overlapExpand) {
  const opts = { ...DEFAULT_SIMPLIFY_OPTIONS, ...options };
  if (!node)
    return node;
  try {
    if (Array.isArray(steps))
      steps.push("Starting unified simplification");
    let result;
    const msSteps = [];
    result = simplify$1(node, {
      combineLikeTerms: opts.combineLikeTerms,
      expand: overlapExpand,
      simplifyFractions: opts.simplifyFractions,
      applyIdentities: opts.applyIdentities,
      convertSqrtToExponential: opts.convertSqrtToExponential,
      advancedExponentialSimplification: opts.advancedExponentialSimplification,
      maxDepth: opts.maxDepth
    }, msSteps);
    if (Array.isArray(steps) && msSteps.length > 0)
      steps.push(["After middle-simplify", msSteps]);
    if (opts.factor) {
      const factorSteps = [];
      if (Array.isArray(steps))
        steps.push("Applying advanced factorization");
      const factorResult = factorWithSteps(result, "x", {
        preferCompleteFactorization: true,
        extractCommonFactors: true,
        simplifyCoefficients: true
      }, factorSteps);
      if (factorResult && factorResult.ast) {
        result = factorResult.ast;
        if (Array.isArray(steps) && Array.isArray(factorResult.steps)) {
          factorResult.steps.forEach((s) => factorSteps.push(s));
          steps.push(["Advanced factorization applied", factorSteps]);
        } else if (Array.isArray(steps)) {
          steps.push("Advanced factorization applied");
        }
      }
    }
    const finalExpand = opts.factor ? false : opts.expand;
    const finalSteps = [];
    if (Array.isArray(steps))
      steps.push([`Final pass with expand: ${finalExpand}`, stepsAstToLatex(result)]);
    result = simplify$1(result, {
      combineLikeTerms: opts.combineLikeTerms,
      expand: finalExpand,
      simplifyFractions: opts.simplifyFractions,
      applyIdentities: opts.applyIdentities,
      convertSqrtToExponential: opts.convertSqrtToExponential,
      advancedExponentialSimplification: opts.advancedExponentialSimplification,
      maxDepth: opts.maxDepth
    }, finalSteps);
    if (Array.isArray(steps) && finalSteps.length > 0)
      steps.push(["Unified simplification complete", finalSteps]);
    return result;
  } catch (error) {
    if (Array.isArray(steps))
      steps.push("Unified simplification failed, returning original node", String(error));
    return node;
  }
}
__name(simplify, "simplify");
function simplifyPolynomialFractionWithFactorization(numerator, denominator, steps = []) {
  try {
    const factorNum = factorWithSteps(numerator, "x", {
      preferCompleteFactorization: true,
      extractCommonFactors: true,
      simplifyCoefficients: true
    }, steps);
    const factorDen = factorWithSteps(denominator, "x", {
      preferCompleteFactorization: true,
      extractCommonFactors: true,
      simplifyCoefficients: true
    }, steps);
    const factoredNumerator = factorNum && factorNum.ast ? factorNum.ast : numerator;
    const factoredDenominator = factorDen && factorDen.ast ? factorDen.ast : denominator;
    return simplifyPolynomialFraction(factoredNumerator, factoredDenominator, steps);
  } catch {
    return simplifyPolynomialFraction(numerator, denominator, steps);
  }
}
__name(simplifyPolynomialFractionWithFactorization, "simplifyPolynomialFractionWithFactorization");
function deepFractionSimplify(node, steps) {
  if (node.type === "Fraction") {
    const fracSteps = [];
    if (Array.isArray(fracSteps))
      fracSteps.push("Applying polynomial fraction reduction (deep)", stepsAstToLatex(node));
    const reduced = simplifyPolynomialFractionWithFactorization(deepFractionSimplify(node.numerator, fracSteps), deepFractionSimplify(node.denominator, fracSteps), steps);
    if (JSON.stringify(reduced) !== JSON.stringify({ type: "Fraction", numerator: node.numerator, denominator: node.denominator })) {
      if (Array.isArray(fracSteps))
        fracSteps.push("Polynomial fraction reduction applied (deep)", stepsAstToLatex(reduced));
      if (Array.isArray(steps))
        steps.push(fracSteps);
      return reduced;
    }
    if (Array.isArray(steps))
      steps.push(fracSteps);
    return {
      type: "Fraction",
      numerator: deepFractionSimplify(node.numerator, steps),
      denominator: deepFractionSimplify(node.denominator, steps)
    };
  }
  if (node.type === "BinaryExpression") {
    return {
      ...node,
      left: deepFractionSimplify(node.left, steps),
      right: deepFractionSimplify(node.right, steps)
    };
  }
  if (node.type === "UnaryExpression") {
    return {
      ...node,
      operand: deepFractionSimplify(node.operand, steps)
    };
  }
  if (node.type === "FunctionCall") {
    return {
      ...node,
      args: node.args.map((arg) => deepFractionSimplify(arg, steps))
    };
  }
  if (node.type === "Integral") {
    const base = {
      type: "Integral",
      integrand: deepFractionSimplify(node.integrand, steps),
      variable: node.variable
    };
    return {
      ...base,
      ...node.lowerBound !== void 0 ? { lowerBound: deepFractionSimplify(node.lowerBound, steps) } : {},
      ...node.upperBound !== void 0 ? { upperBound: deepFractionSimplify(node.upperBound, steps) } : {}
    };
  }
  if (node.type === "Sum" || node.type === "Product") {
    return {
      ...node,
      expression: deepFractionSimplify(node.expression, steps),
      lowerBound: deepFractionSimplify(node.lowerBound, steps),
      upperBound: deepFractionSimplify(node.upperBound, steps)
    };
  }
  return node;
}
__name(deepFractionSimplify, "deepFractionSimplify");
function overlapSimplify(node, options = {}, steps, maxIterations = 5) {
  let current = node;
  let prevStr = JSON.stringify(current);
  let count = 1;
  if (Array.isArray(steps))
    steps.push("--- overlapSimplify start ---");
  while (count <= maxIterations) {
    const passSteps = [];
    if (Array.isArray(passSteps))
      passSteps.push(`overlapSimplify pass #${count}`);
    let result = deepFractionSimplify(current, passSteps);
    result = simplify(result, options, passSteps, count === 1);
    const nextStr = JSON.stringify(result);
    if (nextStr === prevStr) {
      if (Array.isArray(steps))
        steps.push("No further change detected, stopping.");
      current = result;
      break;
    } else {
      if (Array.isArray(steps))
        steps.push(passSteps);
      current = result;
      prevStr = nextStr;
      count++;
    }
  }
  if (Array.isArray(steps))
    steps.push("--- overlapSimplify end ---");
  return current;
}
__name(overlapSimplify, "overlapSimplify");
function differentiate(node, variable, steps) {
  const derivative = differentiateAST(node, variable, steps);
  const simplified = overlapSimplify(derivative, { factor: false, expand: false }, steps);
  steps.push(`Simplified derivative: ${stepsAstToLatex(simplified)}`);
  return simplified;
}
__name(differentiate, "differentiate");
function differentiateAST(node, variable, steps) {
  switch (node.type) {
    case "NumberLiteral": {
      if (steps)
        steps.push(`d/d${variable}(${node.value}) = 0`);
      return { type: "NumberLiteral", value: 0 };
    }
    case "Identifier": {
      let val = 0;
      if (node.name === variable && (node.scope === "free" || node.scope === void 0)) {
        val = 1;
      }
      if (steps)
        steps.push(`d/d${variable}(${node.name}) = ${val}`);
      return { type: "NumberLiteral", value: val };
    }
    case "BinaryExpression": {
      const subSteps = [];
      const result = differentiateBinaryExpression(node, variable, subSteps);
      if (steps && subSteps.length > 0)
        steps.push(...[`BinaryExpression (${node.operator})`, ...subSteps]);
      return result;
    }
    case "UnaryExpression": {
      const subSteps = [];
      const result = differentiateUnaryExpression(node, variable, subSteps);
      if (steps && subSteps.length > 0)
        steps.push(...[`UnaryExpression (${node.operator})`, ...subSteps]);
      return result;
    }
    case "FunctionCall": {
      const subSteps = [];
      const result = differentiateFunctionCall(node, variable, subSteps);
      if (steps && subSteps.length > 0)
        steps.push(...[`FunctionCall (${node.name})`, ...subSteps]);
      return result;
    }
    case "Fraction": {
      const subSteps = [];
      const result = differentiateFraction(node, variable, subSteps);
      if (steps && subSteps.length > 0)
        steps.push(...[`Fraction`, subSteps]);
      return result;
    }
    case "Integral":
    case "Sum":
    case "Product":
      throw new Error(`Differentiation of ${node.type} not yet implemented`);
    case "Derivative":
      return differentiateAST(node.expression, node.variable, steps);
    default:
      throw new Error(`Unsupported AST node type for differentiation: ${node.type}`);
  }
}
__name(differentiateAST, "differentiateAST");
function differentiateBinaryExpression(node, variable, steps) {
  const left = node.left;
  const right = node.right;
  switch (node.operator) {
    case "+":
    case "-": {
      const leftSteps = [];
      const rightSteps = [];
      const leftDiff = differentiateAST(left, variable, leftSteps);
      const rightDiff = differentiateAST(right, variable, rightSteps);
      const result = overlapSimplify({
        type: "BinaryExpression",
        operator: node.operator,
        left: leftDiff,
        right: rightDiff
      }, { factor: false, expand: false });
      if (steps)
        steps.push([
          `Sum/Difference rule: d/d${variable}(u ${node.operator} v) = u' ${node.operator} v'`,
          ["Left", ...leftSteps],
          ["Right", ...rightSteps]
        ]);
      return result;
    }
    case "*": {
      const leftSteps = [];
      const rightSteps = [];
      const leftDerivative = differentiateAST(left, variable, leftSteps);
      const rightDerivative = differentiateAST(right, variable, rightSteps);
      const prodResult = {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "BinaryExpression",
          operator: "*",
          left: leftDerivative,
          right
        },
        right: {
          type: "BinaryExpression",
          operator: "*",
          left,
          right: rightDerivative
        }
      };
      const result = overlapSimplify(prodResult, { factor: false, expand: false });
      if (steps)
        steps.push([
          `Product rule: d/d${variable}(uv) = u'v + uv'`,
          ["Left", ...leftSteps],
          ["Right", ...rightSteps]
        ]);
      return result;
    }
    case "/": {
      const uSteps = [];
      const vSteps = [];
      const uPrime = differentiateAST(left, variable, uSteps);
      const vPrime = differentiateAST(right, variable, vSteps);
      const fracResult = {
        type: "Fraction",
        numerator: overlapSimplify({
          type: "BinaryExpression",
          operator: "-",
          left: overlapSimplify({
            type: "BinaryExpression",
            operator: "*",
            left: uPrime,
            right
          }, { factor: false, expand: false }),
          right: overlapSimplify({
            type: "BinaryExpression",
            operator: "*",
            left,
            right: vPrime
          }, { factor: false, expand: false })
        }, { factor: false, expand: false }),
        denominator: overlapSimplify({
          type: "BinaryExpression",
          operator: "^",
          left: right,
          right: {
            type: "NumberLiteral",
            value: 2
          }
        }, { factor: false, expand: false })
      };
      const result = overlapSimplify(fracResult, { factor: false, expand: false });
      if (steps)
        steps.push([
          `Quotient rule: d/d${variable}(u/v) = (u'v - uv')/v^2`,
          ["Numerator", ...uSteps],
          ["Denominator", ...vSteps]
        ]);
      return result;
    }
    case "^": {
      const result = overlapSimplify(differentiatePower(left, right, variable), {
        factor: false,
        expand: false
      });
      if (steps)
        steps.push([`Power rule: d/d${variable}(u^v)`]);
      return result;
    }
    default:
      throw new Error(`Differentiation of operator ${node.operator} not supported`);
  }
}
__name(differentiateBinaryExpression, "differentiateBinaryExpression");
function differentiateUnaryExpression(node, variable, steps) {
  const derivative = differentiateAST(node.operand, variable, steps);
  switch (node.operator) {
    case "+":
      if (steps)
        steps.push([`Unary plus: d/d${variable}(+u) = u'`]);
      return derivative;
    case "-": {
      const result = overlapSimplify({
        type: "UnaryExpression",
        operator: "-",
        operand: derivative
      }, { factor: false, expand: false });
      if (steps)
        steps.push([`Unary minus: d/d${variable}(-u) = -u'`]);
      return result;
    }
    default:
      throw new Error(`Unsupported unary operator for differentiation: ${node.operator}`);
  }
}
__name(differentiateUnaryExpression, "differentiateUnaryExpression");
function differentiateFunctionCall(node, variable, steps) {
  if (node.args.length !== 1) {
    throw new Error(`Differentiation of function ${node.name} with ${node.args.length} arguments not supported`);
  }
  const argument = node.args[0];
  if (!argument) {
    throw new Error(`Function ${node.name} missing required argument`);
  }
  const argumentDerivative = differentiateAST(argument, variable, steps);
  let innerDerivative;
  switch (node.name) {
    case "sin":
      innerDerivative = { type: "FunctionCall", name: "cos", args: [argument] };
      break;
    case "cos":
      innerDerivative = {
        type: "UnaryExpression",
        operator: "-",
        operand: { type: "FunctionCall", name: "sin", args: [argument] }
      };
      break;
    case "tan":
      innerDerivative = {
        type: "Fraction",
        numerator: { type: "NumberLiteral", value: 1 },
        denominator: {
          type: "BinaryExpression",
          operator: "^",
          left: { type: "FunctionCall", name: "cos", args: [argument] },
          right: { type: "NumberLiteral", value: 2 }
        }
      };
      break;
    case "exp":
      innerDerivative = { type: "FunctionCall", name: "exp", args: [argument] };
      break;
    case "ln":
      innerDerivative = {
        type: "Fraction",
        numerator: { type: "NumberLiteral", value: 1 },
        denominator: argument
      };
      break;
    case "log":
      innerDerivative = {
        type: "Fraction",
        numerator: { type: "NumberLiteral", value: 1 },
        denominator: {
          type: "BinaryExpression",
          operator: "*",
          left: argument,
          right: { type: "NumberLiteral", value: Math.LN10 }
        }
      };
      break;
    case "sqrt":
      innerDerivative = {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: { type: "NumberLiteral", value: 2 }
        },
        right: {
          type: "BinaryExpression",
          operator: "^",
          left: argument,
          right: {
            type: "BinaryExpression",
            operator: "-",
            left: { type: "NumberLiteral", value: 1 / 2 },
            right: { type: "NumberLiteral", value: 1 }
          }
        }
      };
      break;
    default:
      throw new Error(`Differentiation of function ${node.name} not supported`);
  }
  if (isZero(argumentDerivative)) {
    if (steps)
      steps.push([`Chain rule: argument derivative is zero, so result is 0`]);
    return { type: "NumberLiteral", value: 0 };
  }
  if (isOne(argumentDerivative)) {
    if (steps)
      steps.push([`Chain rule: argument derivative is one, so result is innerDerivative`]);
    return innerDerivative;
  }
  const chainResult = {
    type: "BinaryExpression",
    operator: "*",
    left: innerDerivative,
    right: argumentDerivative
  };
  const result = overlapSimplify(chainResult, { factor: false, expand: false });
  if (steps)
    steps.push([`Chain rule`]);
  return result;
}
__name(differentiateFunctionCall, "differentiateFunctionCall");
function differentiateFraction(node, variable, steps) {
  const u = node.numerator;
  const v = node.denominator;
  const uPrime = differentiateAST(u, variable, steps);
  const vPrime = differentiateAST(v, variable, steps);
  const uPrimeIsZero = isZero(uPrime);
  const vPrimeIsZero = isZero(vPrime);
  if (vPrimeIsZero) {
    const result2 = overlapSimplify({
      type: "Fraction",
      numerator: uPrime,
      denominator: v
    }, { factor: false, expand: false });
    if (steps)
      steps.push([`Fraction rule: denominator is constant, so d/d${variable}(u/v) = u'/v`]);
    return result2;
  }
  if (uPrimeIsZero) {
    const result2 = overlapSimplify({
      type: "Fraction",
      numerator: {
        type: "UnaryExpression",
        operator: "-",
        operand: {
          type: "BinaryExpression",
          operator: "*",
          left: u,
          right: vPrime
        }
      },
      denominator: {
        type: "BinaryExpression",
        operator: "^",
        left: v,
        right: {
          type: "NumberLiteral",
          value: 2
        }
      }
    }, { factor: false, expand: false });
    if (steps)
      steps.push([`Fraction rule: numerator is constant, so d/d${variable}(c/v) = -c v'/v^2`]);
    return result2;
  }
  const result = overlapSimplify({
    type: "Fraction",
    numerator: {
      type: "BinaryExpression",
      operator: "-",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: uPrime,
        right: v
      },
      right: {
        type: "BinaryExpression",
        operator: "*",
        left: u,
        right: vPrime
      }
    },
    denominator: {
      type: "BinaryExpression",
      operator: "^",
      left: v,
      right: {
        type: "NumberLiteral",
        value: 2
      }
    }
  }, { factor: false, expand: false });
  if (steps)
    steps.push([`Fraction rule: d/d${variable}(u/v) = (u'v - uv')/v^2`]);
  return result;
}
__name(differentiateFraction, "differentiateFraction");
function differentiatePower(base, exponent, variable) {
  const baseDerivative = differentiateAST(base, variable);
  const exponentDerivative = differentiateAST(exponent, variable);
  if (isConstant$3(base, variable) && isConstant$3(exponent, variable)) {
    return { type: "NumberLiteral", value: 0 };
  }
  if (isConstant$3(exponent, variable)) {
    return overlapSimplify({
      type: "BinaryExpression",
      operator: "*",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: exponent,
        right: {
          type: "BinaryExpression",
          operator: "^",
          left: base,
          right: {
            type: "BinaryExpression",
            operator: "-",
            left: exponent,
            right: { type: "NumberLiteral", value: 1 }
          }
        }
      },
      right: baseDerivative
    }, { factor: false, expand: false });
  }
  if (isConstant$3(base, variable)) {
    return overlapSimplify({
      type: "BinaryExpression",
      operator: "*",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "BinaryExpression",
          operator: "^",
          left: base,
          right: exponent
        },
        right: {
          type: "FunctionCall",
          name: "ln",
          args: [base]
        }
      },
      right: exponentDerivative
    }, { factor: false, expand: false });
  }
  return overlapSimplify({
    type: "BinaryExpression",
    operator: "*",
    left: {
      type: "BinaryExpression",
      operator: "^",
      left: base,
      right: exponent
    },
    right: {
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: exponentDerivative,
        right: {
          type: "FunctionCall",
          name: "ln",
          args: [base]
        }
      },
      right: {
        type: "BinaryExpression",
        operator: "*",
        left: exponent,
        right: {
          type: "Fraction",
          numerator: baseDerivative,
          denominator: base
        }
      }
    }
  }, { factor: false, expand: false });
}
__name(differentiatePower, "differentiatePower");
function isConstant$3(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return true;
    case "Identifier":
      return node.name !== variable || node.scope !== "free" && node.scope !== void 0;
    case "BinaryExpression":
      return isConstant$3(node.left, variable) && isConstant$3(node.right, variable);
    case "UnaryExpression":
      return isConstant$3(node.operand, variable);
    case "FunctionCall":
      return node.args.every((arg) => isConstant$3(arg, variable));
    case "Fraction":
      return isConstant$3(node.numerator, variable) && isConstant$3(node.denominator, variable);
    default:
      return false;
  }
}
__name(isConstant$3, "isConstant$3");
function isZero(node) {
  return node.type === "NumberLiteral" && node.value === 0;
}
__name(isZero, "isZero");
function isOne(node) {
  return node.type === "NumberLiteral" && node.value === 1;
}
__name(isOne, "isOne");
function isMathematicalConstant(name) {
  const constants = ["e", "\u03C0", "pi", "i", "I"];
  return constants.includes(name);
}
__name(isMathematicalConstant, "isMathematicalConstant");
function extractFreeVariables(node) {
  const variables = /* @__PURE__ */ new Set();
  function traverse(node2) {
    switch (node2.type) {
      case "NumberLiteral":
        break;
      case "Identifier":
        if (node2.scope === "free" || !node2.scope) {
          if (!isMathematicalConstant(node2.name)) {
            variables.add(node2.name);
          }
        }
        break;
      case "BinaryExpression":
        traverse(node2.left);
        traverse(node2.right);
        break;
      case "UnaryExpression":
        traverse(node2.operand);
        break;
      case "FunctionCall":
        node2.args.forEach((arg) => traverse(arg));
        break;
      case "Fraction":
        traverse(node2.numerator);
        traverse(node2.denominator);
        break;
      case "Integral":
        traverse(node2.integrand);
        if (node2.lowerBound)
          traverse(node2.lowerBound);
        if (node2.upperBound)
          traverse(node2.upperBound);
        break;
      case "Sum":
        traverse(node2.expression);
        traverse(node2.lowerBound);
        traverse(node2.upperBound);
        break;
      case "Product":
        traverse(node2.expression);
        traverse(node2.lowerBound);
        traverse(node2.upperBound);
        break;
    }
  }
  __name(traverse, "traverse");
  traverse(node);
  return variables;
}
__name(extractFreeVariables, "extractFreeVariables");
function inferVariable(node) {
  const freeVars = extractFreeVariables(node);
  if (freeVars.size === 0) {
    return null;
  }
  if (freeVars.size === 1) {
    const varArray = Array.from(freeVars);
    return varArray[0] || null;
  }
  const priority = ["x", "y", "z", "t", "u", "v", "w"];
  for (const varName of priority) {
    if (freeVars.has(varName)) {
      return varName;
    }
  }
  const sortedVars = Array.from(freeVars).sort();
  return sortedVars[0] || null;
}
__name(inferVariable, "inferVariable");
function getAnalysisVariable(node, explicitVariable) {
  if (explicitVariable) {
    return explicitVariable;
  }
  const inferred = inferVariable(node);
  if (inferred) {
    return inferred;
  }
  return "x";
}
__name(getAnalysisVariable, "getAnalysisVariable");
function analyzeDifferentiate(ast, options) {
  const steps = [];
  try {
    let variable;
    let expr;
    if (ast.type === "Derivative") {
      variable = ast.variable;
      expr = ast.expression;
      steps.push(`Differentiating with respect to ${variable}`);
      steps.push(`Expression: ${astToLatex(expr)}`);
    } else {
      variable = getAnalysisVariable(ast, options.variable);
      expr = ast;
      const freeVars = extractFreeVariables(ast);
      if (!options.variable && freeVars.size > 1) {
        steps.push(`Multiple variables found: {${Array.from(freeVars).join(", ")}}. Using '${variable}' for differentiation.`);
      } else if (!options.variable && freeVars.size === 1) {
        steps.push(`Auto-detected variable: ${variable}`);
      }
      steps.push(`Differentiating with respect to ${variable}`);
      steps.push(`Expression: ${astToLatex(expr)}`);
    }
    const diffSteps = [];
    const derivative = differentiate(expr, variable, diffSteps);
    steps.push(...diffSteps);
    const derivativeLatex = astToLatex(derivative);
    return {
      steps,
      value: derivativeLatex,
      valueType: "symbolic",
      ast: derivative,
      error: null
    };
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Differentiation error"
    };
  }
}
__name(analyzeDifferentiate, "analyzeDifferentiate");
function evaluateAST(node, values = {}) {
  switch (node.type) {
    case "NumberLiteral":
      return node.value;
    case "Identifier":
      if (node.name in MATH_CONSTANTS) {
        return MATH_CONSTANTS[node.name];
      }
      if (node.name === "i" || node.name === "I") {
        throw new Error("Imaginary unit i cannot be evaluated numerically");
      }
      if (node.name in values) {
        return values[node.name];
      }
      if (node.scope === "bound") {
        throw new Error(`Bound variable ${node.name} cannot be evaluated without context`);
      }
      throw new Error(`Undefined variable: ${node.name}`);
    case "BinaryExpression":
      return evaluateBinaryExpression(node, values);
    case "UnaryExpression":
      return evaluateUnaryExpression(node, values);
    case "FunctionCall":
      return evaluateFunctionCall(node, values);
    case "Fraction": {
      const numerator = evaluateAST(node.numerator, values);
      const denominator = evaluateAST(node.denominator, values);
      if (denominator === 0) {
        throw new Error("Division by zero");
      }
      return numerator / denominator;
    }
    case "Integral":
    case "Sum":
    case "Product":
      throw new Error(`${node.type} evaluation not yet implemented`);
    default:
      throw new Error(`Unsupported AST node type: ${node.type}`);
  }
}
__name(evaluateAST, "evaluateAST");
function evaluateBinaryExpression(node, values) {
  const left = evaluateAST(node.left, values);
  const right = evaluateAST(node.right, values);
  switch (node.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new Error("Division by zero");
      }
      return left / right;
    case "^":
      return Math.pow(left, right);
    case "=":
      return left === right ? 1 : 0;
    // Boolean to number conversion
    case ">":
      return left > right ? 1 : 0;
    case "<":
      return left < right ? 1 : 0;
    case ">=":
      return left >= right ? 1 : 0;
    case "<=":
      return left <= right ? 1 : 0;
    default:
      throw new Error(`Unsupported binary operator: ${node.operator}`);
  }
}
__name(evaluateBinaryExpression, "evaluateBinaryExpression");
function evaluateUnaryExpression(node, values) {
  const operand = evaluateAST(node.operand, values);
  switch (node.operator) {
    case "+":
      return operand;
    case "-":
      return -operand;
    default:
      throw new Error(`Unsupported unary operator: ${node.operator}`);
  }
}
__name(evaluateUnaryExpression, "evaluateUnaryExpression");
function evaluateFunctionCall(node, values) {
  const args = node.args.map((arg) => evaluateAST(arg, values));
  if (args.length === 0) {
    throw new Error(`Function ${node.name} requires at least one argument`);
  }
  const firstArg = args[0];
  switch (node.name) {
    case "sin":
      return Math.sin(firstArg);
    case "cos":
      return Math.cos(firstArg);
    case "tan":
      return Math.tan(firstArg);
    case "asin":
      return Math.asin(firstArg);
    case "acos":
      return Math.acos(firstArg);
    case "atan":
      return Math.atan(firstArg);
    case "sinh":
      return Math.sinh(firstArg);
    case "cosh":
      return Math.cosh(firstArg);
    case "tanh":
      return Math.tanh(firstArg);
    case "log":
      return Math.log10(firstArg);
    case "ln":
      return Math.log(firstArg);
    case "exp":
      return Math.exp(firstArg);
    case "sqrt":
      return Math.sqrt(firstArg);
    case "abs":
      return Math.abs(firstArg);
    default:
      throw new Error(`Unsupported function: ${node.name}`);
  }
}
__name(evaluateFunctionCall, "evaluateFunctionCall");
function containsImaginaryUnit(node) {
  switch (node.type) {
    case "NumberLiteral":
      return false;
    case "Identifier":
      return node.name === "i" || node.name === "I";
    case "BinaryExpression":
      return containsImaginaryUnit(node.left) || containsImaginaryUnit(node.right);
    case "UnaryExpression":
      return containsImaginaryUnit(node.operand);
    case "FunctionCall":
      return node.args.some((arg) => containsImaginaryUnit(arg));
    case "Fraction":
      return containsImaginaryUnit(node.numerator) || containsImaginaryUnit(node.denominator);
    case "Integral":
      return containsImaginaryUnit(node.integrand) || (node.lowerBound ? containsImaginaryUnit(node.lowerBound) : false) || (node.upperBound ? containsImaginaryUnit(node.upperBound) : false);
    case "Sum":
    case "Product":
      return containsImaginaryUnit(node.expression) || containsImaginaryUnit(node.lowerBound) || containsImaginaryUnit(node.upperBound);
    default:
      return false;
  }
}
__name(containsImaginaryUnit, "containsImaginaryUnit");
function containsFractions(node) {
  switch (node.type) {
    case "Fraction":
      return true;
    case "BinaryExpression":
      return containsFractions(node.left) || containsFractions(node.right);
    case "UnaryExpression":
      return containsFractions(node.operand);
    case "FunctionCall":
      return node.args.some((arg) => containsFractions(arg));
    default:
      return false;
  }
}
__name(containsFractions, "containsFractions");
function containsFunctions(node) {
  switch (node.type) {
    case "FunctionCall":
      return true;
    case "BinaryExpression":
      return containsFunctions(node.left) || containsFunctions(node.right);
    case "UnaryExpression":
      return containsFunctions(node.operand);
    case "Fraction":
      return containsFunctions(node.numerator) || containsFunctions(node.denominator);
    default:
      return false;
  }
}
__name(containsFunctions, "containsFunctions");
function hasFloatingPointInValues(values) {
  return Object.values(values).some((value) => !Number.isInteger(value));
}
__name(hasFloatingPointInValues, "hasFloatingPointInValues");
function substituteMathConstants(node, convertConstants = true) {
  switch (node.type) {
    case "NumberLiteral":
      return node;
    case "Identifier":
      if (node.name in MATH_CONSTANTS && convertConstants) {
        return {
          type: "NumberLiteral",
          value: MATH_CONSTANTS[node.name]
        };
      }
      return node;
    case "BinaryExpression":
      return {
        ...node,
        left: substituteMathConstants(node.left, convertConstants),
        right: substituteMathConstants(node.right, convertConstants)
      };
    case "UnaryExpression":
      return {
        ...node,
        operand: substituteMathConstants(node.operand, convertConstants)
      };
    case "FunctionCall":
      return {
        ...node,
        args: node.args.map((arg) => substituteMathConstants(arg, convertConstants))
      };
    case "Fraction":
      return {
        ...node,
        numerator: substituteMathConstants(node.numerator, convertConstants),
        denominator: substituteMathConstants(node.denominator, convertConstants)
      };
    default:
      return node;
  }
}
__name(substituteMathConstants, "substituteMathConstants");
function formatNumber(value, precision = 6) {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toPrecision(precision);
}
__name(formatNumber, "formatNumber");
function analyzeEvaluate(ast, options) {
  let steps = [];
  const values = options.values || {};
  try {
    steps = [
      `Original expression: ${astToLatex(ast)}`,
      [
        // サブステップとして定数置換
        "Substituted mathematical constants (symbolic)"
      ]
    ];
    const astWithConstants = substituteMathConstants(ast, false);
    const freeVars = extractFreeVariables(astWithConstants);
    const containsImaginary = containsImaginaryUnit(astWithConstants);
    const unassignedVars = Array.from(freeVars).filter((varName) => values[varName] === void 0);
    if (unassignedVars.length > 0 || containsImaginary) {
      const simplifiedAST2 = overlapSimplify(astWithConstants, {
        combineLikeTerms: true,
        expand: false,
        // Keep expressions compact for evaluation
        factor: true,
        // Factor when possible for cleaner representation
        simplifyFractions: true,
        applyIdentities: true
      });
      const symbolicResult2 = astToLatex(simplifiedAST2);
      const substeps = [];
      if (unassignedVars.length > 0) {
        substeps.push(`Expression contains undefined variables: ${unassignedVars.join(", ")}`);
      }
      if (containsImaginary) {
        substeps.push("Expression contains imaginary unit: cannot evaluate numerically");
      }
      substeps.push(`Simplified result: ${symbolicResult2}`);
      steps[1].push(...substeps);
      return {
        steps,
        value: symbolicResult2,
        valueType: "symbolic",
        ast: simplifiedAST2,
        error: null
      };
    }
    const simplifiedAST = overlapSimplify(astWithConstants, {
      combineLikeTerms: true,
      simplifyFractions: true,
      applyIdentities: true
    });
    const symbolicResult = astToLatex(simplifiedAST);
    steps[1].push("Final symbolic result");
    steps[1].push(`Result: ${symbolicResult}`);
    return {
      steps,
      value: symbolicResult,
      valueType: "exact",
      ast: simplifiedAST,
      error: null
    };
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "exact",
      ast: null,
      error: error instanceof Error ? error.message : "Evaluation error"
    };
  }
}
__name(analyzeEvaluate, "analyzeEvaluate");
function analyzeApprox(ast, options) {
  let steps = [];
  const values = options.values || {};
  const precision = options.precision || 6;
  try {
    steps = [
      `Original expression: ${astToLatex(ast)}`,
      ["Substituted mathematical constants (decimal)"]
    ];
    const astWithConstants = substituteMathConstants(ast, true);
    const freeVars = extractFreeVariables(astWithConstants);
    const containsImaginary = containsImaginaryUnit(astWithConstants);
    const unassignedVars = Array.from(freeVars).filter((varName) => values[varName] === void 0);
    if (unassignedVars.length > 0 || containsImaginary) {
      const simplifiedAST = overlapSimplify(astWithConstants, {
        combineLikeTerms: true,
        simplifyFractions: true,
        applyIdentities: true
      });
      const symbolicResult = astToLatex(simplifiedAST);
      const substeps = [];
      if (unassignedVars.length > 0) {
        substeps.push(`Expression contains undefined variables: ${unassignedVars.join(", ")}`);
      }
      if (containsImaginary) {
        substeps.push("Expression contains imaginary unit: cannot evaluate numerically");
      }
      substeps.push(`Simplified result with decimal constants: ${symbolicResult}`);
      steps[1].push(...substeps);
      return {
        steps,
        value: symbolicResult,
        valueType: "symbolic",
        ast: simplifiedAST,
        error: null
      };
    }
    const containsFunctionsToEvaluate = containsFunctions(astWithConstants);
    const shouldPreserveExact = containsFractions(astWithConstants) && !hasFloatingPointInValues(values) && !containsFunctionsToEvaluate;
    if (shouldPreserveExact) {
      const simplifiedAST = overlapSimplify(astWithConstants, {
        combineLikeTerms: true,
        simplifyFractions: true,
        applyIdentities: true
      });
      const symbolicResult = astToLatex(simplifiedAST);
      steps[1].push("Exact simplification applied with decimal constants");
      steps[1].push(`Result: ${symbolicResult}`);
      return {
        steps,
        value: symbolicResult,
        valueType: "exact",
        ast: simplifiedAST,
        error: null
      };
    }
    const substSteps = [];
    Object.entries(values).forEach(([varName, varValue]) => {
      substSteps.push(`Substitution: ${varName} = ${formatNumber(varValue, precision)}`);
    });
    if (substSteps.length > 0) {
      steps[1].push(substSteps);
    }
    const result = evaluateAST(astWithConstants, values);
    const formattedResult = formatNumber(result, precision);
    steps[1].push(`Approximate result: ${formattedResult}`);
    const analyzeResult = {
      steps,
      value: formattedResult,
      valueType: Number.isInteger(result) ? "exact" : "approximate",
      ast: {
        type: "NumberLiteral",
        value: result
      },
      error: null
    };
    if (!Number.isInteger(result)) {
      analyzeResult.precision = precision;
    }
    return analyzeResult;
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "exact",
      ast: null,
      error: error instanceof Error ? error.message : "Evaluation error"
    };
  }
}
__name(analyzeApprox, "analyzeApprox");
function calculateComplexity(node) {
  switch (node.type) {
    case "NumberLiteral":
      return 0;
    case "Identifier":
      return 0.5;
    case "BinaryExpression":
      return 1 + calculateComplexity(node.left) + calculateComplexity(node.right);
    case "UnaryExpression":
      return 0.5 + calculateComplexity(node.operand);
    case "FunctionCall":
      return 1 + node.args.reduce((sum, arg) => sum + calculateComplexity(arg), 0);
    case "Fraction":
      return 1.5 + calculateComplexity(node.numerator) + calculateComplexity(node.denominator);
    default:
      return 2;
  }
}
__name(calculateComplexity, "calculateComplexity");
function isConstant$2(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return true;
    case "Identifier":
      return node.name !== variable || node.scope !== "free";
    case "BinaryExpression":
      return isConstant$2(node.left, variable) && isConstant$2(node.right, variable);
    case "UnaryExpression":
      return isConstant$2(node.operand, variable);
    case "FunctionCall":
      return node.args.every((arg) => isConstant$2(arg, variable));
    case "Fraction":
      return isConstant$2(node.numerator, variable) && isConstant$2(node.denominator, variable);
    default:
      return false;
  }
}
__name(isConstant$2, "isConstant$2");
function containsVariable(node, variable) {
  return !isConstant$2(node, variable);
}
__name(containsVariable, "containsVariable");
function createVariableNode(variable) {
  return {
    type: "Identifier",
    name: variable,
    scope: "free",
    uniqueId: `free_${variable}`
  };
}
__name(createVariableNode, "createVariableNode");
function createNumberNode(value) {
  return {
    type: "NumberLiteral",
    value
  };
}
__name(createNumberNode, "createNumberNode");
function createBinaryNode(operator, left, right) {
  return {
    type: "BinaryExpression",
    operator,
    left,
    right
  };
}
__name(createBinaryNode, "createBinaryNode");
function createFunctionNode(name, args) {
  return {
    type: "FunctionCall",
    name,
    args
  };
}
__name(createFunctionNode, "createFunctionNode");
function createFractionNode(numerator, denominator) {
  return {
    type: "Fraction",
    numerator,
    denominator
  };
}
__name(createFractionNode, "createFractionNode");
var _BasicIntegrationStrategy = class _BasicIntegrationStrategy {
  constructor() {
    this.name = "Basic Integration";
    this.priority = 1;
  }
  canHandle(node, context) {
    return [
      "NumberLiteral",
      "Identifier",
      "BinaryExpression",
      "UnaryExpression",
      "FunctionCall"
    ].includes(node.type);
  }
  integrate(node, context) {
    const steps = [];
    try {
      const result = this.integrateNode(node, context.variable, steps);
      return {
        result,
        success: true,
        strategy: this.name,
        steps,
        complexity: calculateComplexity(result)
      };
    } catch (error) {
      return {
        result: null,
        success: false,
        strategy: this.name,
        steps: [...steps, error instanceof Error ? error.message : "Unknown error"],
        complexity: Infinity
      };
    }
  }
  integrateNode(node, variable, steps) {
    switch (node.type) {
      case "NumberLiteral":
        steps.push(`\u222B${node.value} dx = ${node.value}x`);
        return createBinaryNode("*", node, createVariableNode(variable));
      case "Identifier":
        if (node.name === variable && node.scope === "free") {
          steps.push(`\u222Bx dx = x\xB2/2`);
          return createFractionNode(createBinaryNode("^", createVariableNode(variable), createNumberNode(2)), createNumberNode(2));
        } else {
          steps.push(`\u222B${node.name} dx = ${node.name}x (constant)`);
          return createBinaryNode("*", node, createVariableNode(variable));
        }
      case "BinaryExpression":
        return this.integrateBinaryExpression(node, variable, steps);
      case "UnaryExpression":
        return this.integrateUnaryExpression(node, variable, steps);
      case "FunctionCall":
        return this.integrateFunctionCall(node, variable, steps);
      default:
        throw new Error(`Basic integration cannot handle ${node.type}`);
    }
  }
  integrateBinaryExpression(node, variable, steps) {
    switch (node.operator) {
      case "+":
      case "-":
        steps.push(`\u222B(u ${node.operator} v) dx = \u222Bu dx ${node.operator} \u222Bv dx`);
        return createBinaryNode(node.operator, this.integrateNode(node.left, variable, steps), this.integrateNode(node.right, variable, steps));
      case "*":
        if (isConstant$2(node.left, variable)) {
          steps.push(`\u222Bc\xB7f(x) dx = c\xB7\u222Bf(x) dx`);
          return createBinaryNode("*", node.left, this.integrateNode(node.right, variable, steps));
        } else if (isConstant$2(node.right, variable)) {
          steps.push(`\u222Bf(x)\xB7c dx = c\xB7\u222Bf(x) dx`);
          return createBinaryNode("*", node.right, this.integrateNode(node.left, variable, steps));
        } else {
          throw new Error("Product integration requires advanced strategies");
        }
      case "/":
        if (isConstant$2(node.right, variable)) {
          steps.push(`\u222Bf(x)/c dx = (1/c)\xB7\u222Bf(x) dx`);
          return createFractionNode(this.integrateNode(node.left, variable, steps), node.right);
        } else {
          throw new Error("Complex fraction integration requires advanced strategies");
        }
      case "^":
        return this.integratePower(node, variable, steps);
      default:
        throw new Error(`Basic integration cannot handle operator ${node.operator}`);
    }
  }
  integratePower(node, variable, steps) {
    if (node.left.type === "Identifier" && node.left.name === variable && isConstant$2(node.right, variable)) {
      const exponent = node.right;
      if (exponent.type === "NumberLiteral" && exponent.value === -1) {
        steps.push(`\u222Bx\u207B\xB9 dx = ln|x|`);
        return createFunctionNode("ln", [
          createFunctionNode("abs", [createVariableNode(variable)])
        ]);
      }
      steps.push(`\u222Bx^n dx = x^(n+1)/(n+1) (Power rule)`);
      const newExponent = createBinaryNode("+", exponent, createNumberNode(1));
      return createFractionNode(createBinaryNode("^", createVariableNode(variable), newExponent), newExponent);
    }
    throw new Error("Complex power integration requires advanced strategies");
  }
  integrateUnaryExpression(node, variable, steps) {
    const integral = this.integrateNode(node.operand, variable, steps);
    switch (node.operator) {
      case "+":
        return integral;
      case "-":
        steps.push(`\u222B(-f(x)) dx = -\u222Bf(x) dx`);
        return {
          type: "UnaryExpression",
          operator: "-",
          operand: integral
        };
      default:
        throw new Error(`Unsupported unary operator: ${node.operator}`);
    }
  }
  integrateFunctionCall(node, variable, steps) {
    if (node.args.length !== 1) {
      throw new Error(`Function ${node.name} requires exactly 1 argument for basic integration`);
    }
    const arg = node.args[0];
    if (arg.type === "Identifier" && arg.name === variable) {
      return this.integrateBasicFunction(node.name, arg, steps);
    }
    throw new Error(`Complex function arguments require substitution strategy`);
  }
  integrateBasicFunction(functionName, arg, steps) {
    switch (functionName) {
      case "sin":
        steps.push(`\u222Bsin(x) dx = -cos(x)`);
        return {
          type: "UnaryExpression",
          operator: "-",
          operand: createFunctionNode("cos", [arg])
        };
      case "cos":
        steps.push(`\u222Bcos(x) dx = sin(x)`);
        return createFunctionNode("sin", [arg]);
      case "exp":
        steps.push(`\u222Be^x dx = e^x`);
        return createFunctionNode("exp", [arg]);
      case "tan":
        steps.push(`\u222Btan(x) dx = -ln|cos(x)|`);
        return {
          type: "UnaryExpression",
          operator: "-",
          operand: createFunctionNode("ln", [
            createFunctionNode("abs", [createFunctionNode("cos", [arg])])
          ])
        };
      case "sqrt":
        steps.push(`\u222B\u221Ax dx = (2/3)x^(3/2)`);
        return createBinaryNode("*", createFractionNode(createNumberNode(2), createNumberNode(3)), createBinaryNode("^", arg, createFractionNode(createNumberNode(3), createNumberNode(2))));
      case "sinh":
        steps.push(`\u222Bsinh(x) dx = cosh(x)`);
        return createFunctionNode("cosh", [arg]);
      case "cosh":
        steps.push(`\u222Bcosh(x) dx = sinh(x)`);
        return createFunctionNode("sinh", [arg]);
      case "tanh":
        steps.push(`\u222Btanh(x) dx = ln(cosh(x))`);
        return createFunctionNode("ln", [createFunctionNode("cosh", [arg])]);
      default:
        throw new Error(`Basic integration of ${functionName} not supported`);
    }
  }
};
__name(_BasicIntegrationStrategy, "BasicIntegrationStrategy");
var BasicIntegrationStrategy = _BasicIntegrationStrategy;
var _IntegrationByPartsStrategy = class _IntegrationByPartsStrategy {
  constructor() {
    this.name = "Integration by Parts";
    this.priority = 5;
    this.LIATE_PRIORITY = {
      ln: 1,
      // Logarithmic
      log: 1,
      asin: 2,
      // Inverse trigonometric
      acos: 2,
      atan: 2,
      polynomial: 3,
      // Algebraic (polynomial)
      sin: 4,
      // Trigonometric
      cos: 4,
      tan: 4,
      exp: 5
      // Exponential
    };
  }
  canHandle(node, context) {
    return this.canApplyIntegrationByParts(node, context.variable);
  }
  integrate(node, context) {
    const steps = [];
    try {
      if (context.depth >= context.maxDepth) {
        throw new Error("Maximum recursion depth reached");
      }
      const result = this.integrateByParts(node, context, steps);
      return {
        result,
        success: true,
        strategy: this.name,
        steps,
        complexity: calculateComplexity(result)
      };
    } catch (error) {
      return {
        result: null,
        success: false,
        strategy: this.name,
        steps: [...steps, error instanceof Error ? error.message : "Unknown error"],
        complexity: Infinity
      };
    }
  }
  canApplyIntegrationByParts(node, variable) {
    if (node.type === "FunctionCall") {
      return ["ln", "log", "asin", "acos", "atan"].includes(node.name);
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      const left = node.left;
      const right = node.right;
      if (!containsVariable(left, variable) || !containsVariable(right, variable)) {
        return false;
      }
      if (this.isPolynomial(left) && right.type === "FunctionCall" && ["ln", "log"].includes(right.name)) {
        return true;
      }
      if (this.isPolynomial(right) && left.type === "FunctionCall" && ["ln", "log"].includes(left.name)) {
        return true;
      }
      if (this.isPolynomial(left) && right.type === "FunctionCall" && right.name === "exp") {
        return true;
      }
      if (this.isPolynomial(right) && left.type === "FunctionCall" && left.name === "exp") {
        return true;
      }
      if (this.isPolynomial(left) && right.type === "FunctionCall" && ["asin", "acos", "atan"].includes(right.name)) {
        return true;
      }
      if (this.isPolynomial(right) && left.type === "FunctionCall" && ["asin", "acos", "atan"].includes(left.name)) {
        return true;
      }
      if (this.isPolynomial(left) && right.type === "FunctionCall" && ["sin", "cos", "tan"].includes(right.name)) {
        return true;
      }
      if (this.isPolynomial(right) && left.type === "FunctionCall" && ["sin", "cos", "tan"].includes(left.name)) {
        return true;
      }
    }
    return false;
  }
  integrateByParts(node, context, steps) {
    const variable = context.variable;
    if (node.type === "FunctionCall" && ["ln", "log", "asin", "acos", "atan"].includes(node.name)) {
      return this.integrateSingleFunctionByParts(node, variable, steps);
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      const productNode = node;
      return this.integrateProductByParts(productNode, context, steps);
    }
    throw new Error("Node not suitable for integration by parts");
  }
  integrateSingleFunctionByParts(node, variable, steps) {
    const arg = node.args[0];
    if (!arg || arg.type !== "Identifier" || arg.name !== variable) {
      throw new Error("Complex arguments not supported in single function integration by parts");
    }
    const x = createVariableNode(variable);
    switch (node.name) {
      case "ln":
        steps.push(`\u222Bln(x) dx: Let u = ln(x), dv = dx`);
        steps.push(`Then du = (1/x)dx, v = x`);
        steps.push(`\u222Bln(x) dx = x\xB7ln(x) - \u222Bx\xB7(1/x) dx = x\xB7ln(x) - \u222B1 dx = x\xB7ln(x) - x`);
        return createBinaryNode("-", createBinaryNode("*", x, createFunctionNode("ln", [x])), x);
      case "log":
        steps.push(`\u222Blog\u2081\u2080(x) dx: Let u = log\u2081\u2080(x), dv = dx`);
        steps.push(`\u222Blog\u2081\u2080(x) dx = x\xB7log\u2081\u2080(x) - x/ln(10)`);
        return createBinaryNode("-", createBinaryNode("*", x, createFunctionNode("log", [x])), createBinaryNode("*", x, createBinaryNode("/", createNumberNode(1), createFunctionNode("ln", [createNumberNode(10)]))));
      case "asin":
        steps.push(`\u222Barcsin(x) dx: Let u = arcsin(x), dv = dx`);
        steps.push(`\u222Barcsin(x) dx = x\xB7arcsin(x) + \u221A(1-x\xB2)`);
        return createBinaryNode("+", createBinaryNode("*", x, createFunctionNode("asin", [x])), createFunctionNode("sqrt", [
          createBinaryNode("-", createNumberNode(1), createBinaryNode("^", x, createNumberNode(2)))
        ]));
      case "acos":
        steps.push(`\u222Barccos(x) dx: Let u = arccos(x), dv = dx`);
        steps.push(`\u222Barccos(x) dx = x\xB7arccos(x) - \u221A(1-x\xB2)`);
        return createBinaryNode("-", createBinaryNode("*", x, createFunctionNode("acos", [x])), createFunctionNode("sqrt", [
          createBinaryNode("-", createNumberNode(1), createBinaryNode("^", x, createNumberNode(2)))
        ]));
      case "atan":
        steps.push(`\u222Barctan(x) dx: Let u = arctan(x), dv = dx`);
        steps.push(`\u222Barctan(x) dx = x\xB7arctan(x) - (1/2)ln(1+x\xB2)`);
        return createBinaryNode("-", createBinaryNode("*", x, createFunctionNode("atan", [x])), createBinaryNode("*", createBinaryNode("/", createNumberNode(1), createNumberNode(2)), createFunctionNode("ln", [
          createBinaryNode("+", createNumberNode(1), createBinaryNode("^", x, createNumberNode(2)))
        ])));
      default:
        throw new Error(`Single function integration by parts for ${node.name} not implemented`);
    }
  }
  integrateProductByParts(node, context, steps) {
    const divisions = this.identifyPartsDivisions(node.left, node.right, context.variable);
    if (divisions.length === 0) {
      throw new Error("No suitable division found for integration by parts");
    }
    const bestDivision = divisions.reduce((best, current) => current.priority < best.priority ? current : best);
    steps.push(`Integration by parts: ${bestDivision.reasoning}`);
    steps.push(`Let u = ${this.nodeToString(bestDivision.u)}, dv = ${this.nodeToString(bestDivision.dv)} dx`);
    return this.applyIntegrationByParts(bestDivision, context, steps);
  }
  identifyPartsDivisions(left, right, variable) {
    const divisions = [];
    const leftPriority = this.getFunctionPriority(left);
    const rightPriority = this.getFunctionPriority(right);
    if (leftPriority <= rightPriority) {
      divisions.push({
        u: left,
        dv: right,
        priority: leftPriority,
        reasoning: `LIATE rule: ${this.getFunctionType(left)} before ${this.getFunctionType(right)}`
      });
    }
    if (rightPriority <= leftPriority) {
      divisions.push({
        u: right,
        dv: left,
        priority: rightPriority,
        reasoning: `LIATE rule: ${this.getFunctionType(right)} before ${this.getFunctionType(left)}`
      });
    }
    return divisions;
  }
  getFunctionPriority(node) {
    if (node.type === "FunctionCall") {
      return this.LIATE_PRIORITY[node.name] || 6;
    }
    if (this.isPolynomial(node)) {
      return this.LIATE_PRIORITY["polynomial"];
    }
    return 6;
  }
  getFunctionType(node) {
    if (node.type === "FunctionCall") {
      if (["ln", "log"].includes(node.name))
        return "Logarithmic";
      if (["asin", "acos", "atan"].includes(node.name))
        return "Inverse Trigonometric";
      if (["sin", "cos", "tan"].includes(node.name))
        return "Trigonometric";
      if (node.name === "exp")
        return "Exponential";
    }
    if (this.isPolynomial(node))
      return "Algebraic";
    return "Unknown";
  }
  isPolynomial(node) {
    switch (node.type) {
      case "NumberLiteral":
        return true;
      case "Identifier":
        return true;
      case "BinaryExpression":
        if (node.operator === "^" && node.left.type === "Identifier" && node.right.type === "NumberLiteral" && node.right.value >= 0) {
          return true;
        }
        if (["+", "-", "*"].includes(node.operator)) {
          return this.isPolynomial(node.left) && this.isPolynomial(node.right);
        }
        return false;
      default:
        return false;
    }
  }
  applyIntegrationByParts(division, context, steps) {
    const u = division.u;
    const dv = division.dv;
    const variable = context.variable;
    steps.push(`Computing du and v...`);
    if (this.isSpecificCase(u, dv, variable)) {
      return this.handleSpecificCase(u, dv, variable, steps);
    }
    steps.push(`Applying formula: \u222Bu dv = uv - \u222Bv du`);
    throw new Error("General integration by parts not yet fully implemented");
  }
  isSpecificCase(u, dv, variable) {
    if (u.type === "Identifier" && u.name === variable && dv.type === "FunctionCall" && dv.name === "exp" && dv.args.length === 1 && dv.args[0]?.type === "Identifier" && dv.args[0].name === variable) {
      return true;
    }
    if (dv.type === "FunctionCall" && dv.name === "ln" && dv.args.length === 1 && dv.args[0]?.type === "Identifier" && dv.args[0].name === variable) {
      return true;
    }
    return false;
  }
  handleSpecificCase(u, dv, variable, steps) {
    const x = createVariableNode(variable);
    if (u.type === "Identifier" && u.name === variable && dv.type === "FunctionCall" && dv.name === "exp" && dv.args.length === 1 && dv.args[0]?.type === "Identifier" && dv.args[0].name === variable) {
      steps.push(`\u222Bx\xB7e^x dx: Let u = x, dv = e^x dx`);
      steps.push(`Then du = dx, v = e^x`);
      steps.push(`\u222Bx\xB7e^x dx = x\xB7e^x - \u222Be^x dx = x\xB7e^x - e^x = e^x(x-1)`);
      return createBinaryNode("*", createFunctionNode("exp", [x]), createBinaryNode("-", x, createNumberNode(1)));
    }
    if (u.type === "BinaryExpression" && u.operator === "^" && u.left.type === "Identifier" && u.left.name === variable && u.right.type === "NumberLiteral" && u.right.value === 2 && dv.type === "FunctionCall" && dv.name === "ln" && dv.args.length === 1 && dv.args[0]?.type === "Identifier" && dv.args[0].name === variable) {
      steps.push(`\u222Bx\xB2\xB7ln(x) dx: Let u = ln(x), dv = x\xB2 dx`);
      steps.push(`Then du = (1/x)dx, v = x\xB3/3`);
      steps.push(`\u222Bx\xB2\xB7ln(x) dx = (x\xB3/3)ln(x) - \u222B(x\xB3/3)\xB7(1/x) dx = (x\xB3/3)ln(x) - \u222Bx\xB2/3 dx = (x\xB3/3)ln(x) - x\xB3/9`);
      return createBinaryNode("-", createBinaryNode("*", createBinaryNode("/", createBinaryNode("^", x, createNumberNode(3)), createNumberNode(3)), createFunctionNode("ln", [x])), createBinaryNode("/", createBinaryNode("^", x, createNumberNode(3)), createNumberNode(9)));
    }
    if (u.type === "Identifier" && u.name === variable && dv.type === "FunctionCall" && dv.name === "ln" && dv.args.length === 1 && dv.args[0]?.type === "Identifier" && dv.args[0].name === variable) {
      steps.push(`\u222Bx\xB7ln(x) dx: Let u = ln(x), dv = x dx`);
      steps.push(`Then du = (1/x)dx, v = x\xB2/2`);
      steps.push(`\u222Bx\xB7ln(x) dx = (x\xB2/2)ln(x) - \u222B(x\xB2/2)\xB7(1/x) dx = (x\xB2/2)ln(x) - \u222Bx/2 dx = (x\xB2/2)ln(x) - x\xB2/4`);
      return createBinaryNode("-", createBinaryNode("*", createBinaryNode("/", createBinaryNode("^", x, createNumberNode(2)), createNumberNode(2)), createFunctionNode("ln", [x])), createBinaryNode("/", createBinaryNode("^", x, createNumberNode(2)), createNumberNode(4)));
    }
    throw new Error("Specific case not implemented");
  }
  nodeToString(node) {
    switch (node.type) {
      case "NumberLiteral":
        return node.value.toString();
      case "Identifier":
        return node.name;
      case "FunctionCall":
        return `${node.name}(${node.args.map((arg) => this.nodeToString(arg)).join(", ")})`;
      case "BinaryExpression":
        return `(${this.nodeToString(node.left)} ${node.operator} ${this.nodeToString(node.right)})`;
      default:
        return node.type;
    }
  }
};
__name(_IntegrationByPartsStrategy, "IntegrationByPartsStrategy");
var IntegrationByPartsStrategy = _IntegrationByPartsStrategy;
var _RationalFunctionStrategy = class _RationalFunctionStrategy {
  constructor() {
    this.name = "Rational Functions";
    this.priority = 4;
  }
  canHandle(node, context) {
    return this.isRationalFunction(node, context.variable);
  }
  integrate(node, context) {
    const steps = [];
    try {
      const result = this.integrateRational(node, context.variable, steps);
      return {
        result,
        success: true,
        strategy: this.name,
        steps,
        complexity: calculateComplexity(result)
      };
    } catch (error) {
      return {
        result: null,
        success: false,
        strategy: this.name,
        steps: [...steps, error instanceof Error ? error.message : "Unknown error"],
        complexity: Infinity
      };
    }
  }
  isRationalFunction(node, variable) {
    if (node.type === "Fraction") {
      return this.isPolynomial(node.numerator, variable) && this.isPolynomial(node.denominator, variable);
    }
    if (node.type === "BinaryExpression" && node.operator === "/" && node.left.type === "NumberLiteral" && node.left.value === 1) {
      return this.isPolynomial(node.right, variable);
    }
    return false;
  }
  isPolynomial(node, variable) {
    switch (node.type) {
      case "NumberLiteral":
        return true;
      case "Identifier":
        return true;
      case "BinaryExpression":
        if (["+", "-"].includes(node.operator)) {
          return this.isPolynomial(node.left, variable) && this.isPolynomial(node.right, variable);
        }
        if (node.operator === "*") {
          return isConstant$2(node.left, variable) && this.isPolynomial(node.right, variable) || isConstant$2(node.right, variable) && this.isPolynomial(node.left, variable) || this.isPolynomial(node.left, variable) && this.isPolynomial(node.right, variable);
        }
        if (node.operator === "^" && node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral" && Number.isInteger(node.right.value) && node.right.value >= 0) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }
  integrateRational(node, variable, steps) {
    if (node.type === "Fraction") {
      return this.integrateFraction(node, variable, steps);
    }
    if (node.type === "BinaryExpression" && node.operator === "/") {
      return this.integrateFraction({
        numerator: node.left,
        denominator: node.right
      }, variable, steps);
    }
    throw new Error("Not a rational function");
  }
  integrateFraction(node, variable, steps) {
    const numerator = node.numerator;
    const denominator = node.denominator;
    if (numerator.type === "NumberLiteral" && numerator.value === 1 && denominator.type === "Identifier" && denominator.name === variable) {
      steps.push(`\u222B1/x dx = ln|x|`);
      return createFunctionNode("ln", [createFunctionNode("abs", [createVariableNode(variable)])]);
    }
    if (this.isSimplifiableFraction(numerator, denominator, variable)) {
      return this.integrateSimplifiedFraction(numerator, denominator, variable, steps);
    }
    if (this.isFormXSquaredPlusConstant(denominator, variable)) {
      return this.integrateXSquaredPlusConstant(numerator, denominator, variable, steps);
    }
    if (this.isFormXSquaredMinusConstant(denominator, variable)) {
      return this.integrateXSquaredMinusConstant(numerator, denominator, variable, steps);
    }
    if (this.isLinearOverQuadratic(numerator, denominator, variable)) {
      return this.integrateLinearOverQuadratic(numerator, denominator, variable, steps);
    }
    if (this.isLinearOverQuadratic(numerator, denominator, variable)) {
      return this.integrateLinearOverQuadratic(numerator, denominator, variable, steps);
    }
    if (this.isFormSqrtASquaredMinusXSquared(denominator, variable)) {
      return this.integrateSqrtASquaredMinusXSquared(numerator, denominator, variable, steps);
    }
    steps.push(`Attempting partial fraction decomposition...`);
    return this.attemptPartialFractions(numerator, denominator, variable, steps);
  }
  isSimplifiableFraction(numerator, denominator, variable) {
    if (numerator.type === "BinaryExpression" && numerator.operator === "+" && numerator.left.type === "Identifier" && numerator.left.name === variable && numerator.right.type === "NumberLiteral" && numerator.right.value === 1 && denominator.type === "BinaryExpression" && denominator.operator === "-" && denominator.left.type === "BinaryExpression" && denominator.left.operator === "^" && denominator.left.left.type === "Identifier" && denominator.left.left.name === variable && denominator.left.right.type === "NumberLiteral" && denominator.left.right.value === 2 && denominator.right.type === "NumberLiteral" && denominator.right.value === 1) {
      return true;
    }
    return false;
  }
  integrateSimplifiedFraction(numerator, denominator, variable, steps) {
    steps.push(`Simplifying: (x+1)/(x\xB2-1) = (x+1)/((x-1)(x+1)) = 1/(x-1)`);
    steps.push(`\u222B1/(x-1) dx = ln|x-1|`);
    return createFunctionNode("ln", [
      createFunctionNode("abs", [
        createBinaryNode("-", createVariableNode(variable), createNumberNode(1))
      ])
    ]);
  }
  isFormXSquaredPlusConstant(node, variable) {
    if (node.type === "BinaryExpression" && node.operator === "+") {
      const left = node.left;
      const right = node.right;
      if (left.type === "BinaryExpression" && left.operator === "^" && left.left.type === "Identifier" && left.left.name === variable && left.right.type === "NumberLiteral" && left.right.value === 2 && isConstant$2(right, variable)) {
        return true;
      }
    }
    return false;
  }
  integrateXSquaredPlusConstant(numerator, denominator, variable, steps) {
    if (numerator.type === "NumberLiteral" && numerator.value === 1) {
      const denom = denominator;
      const a = denom.right;
      if (a.type === "NumberLiteral" && a.value > 0) {
        const sqrtA = Math.sqrt(a.value);
        steps.push(`\u222B1/(x\xB2+${a.value}) dx = (1/${sqrtA})arctan(x/${sqrtA})`);
        return createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(sqrtA)), createFunctionNode("atan", [
          createFractionNode(createVariableNode(variable), createNumberNode(sqrtA))
        ]));
      }
    }
    throw new Error("Complex x\xB2+a\xB2 form not supported");
  }
  isFormXSquaredMinusConstant(node, variable) {
    if (node.type === "BinaryExpression" && node.operator === "-") {
      const left = node.left;
      const right = node.right;
      if (left.type === "BinaryExpression" && left.operator === "^" && left.left.type === "Identifier" && left.left.name === variable && left.right.type === "NumberLiteral" && left.right.value === 2 && isConstant$2(right, variable)) {
        return true;
      }
    }
    return false;
  }
  integrateXSquaredMinusConstant(numerator, denominator, variable, steps) {
    if (numerator.type === "NumberLiteral" && numerator.value === 1) {
      const denom = denominator;
      const a = denom.right;
      if (a.type === "NumberLiteral" && a.value > 0) {
        const sqrtA = Math.sqrt(a.value);
        steps.push(`\u222B1/(x\xB2-${a.value}) dx = (1/${2 * sqrtA})ln|(x-${sqrtA})/(x+${sqrtA})|`);
        return createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(2 * sqrtA)), createFunctionNode("ln", [
          createFunctionNode("abs", [
            createFractionNode(createBinaryNode("-", createVariableNode(variable), createNumberNode(sqrtA)), createBinaryNode("+", createVariableNode(variable), createNumberNode(sqrtA)))
          ])
        ]));
      }
    }
    throw new Error("Complex x\xB2-a\xB2 form not supported");
  }
  isLinearOverQuadratic(numerator, denominator, variable) {
    if (numerator.type === "Identifier" && numerator.name === variable || numerator.type === "BinaryExpression" && ["+", "-", "*"].includes(numerator.operator)) {
      return this.isQuadratic(denominator, variable);
    }
    return false;
  }
  isQuadratic(node, variable) {
    if (node.type === "BinaryExpression" && ["+", "-"].includes(node.operator)) {
      const hasXSquared = this.containsXSquared(node, variable);
      const hasLinearOrConstant = true;
      return hasXSquared && hasLinearOrConstant;
    }
    return false;
  }
  containsXSquared(node, variable) {
    if (node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral" && node.right.value === 2) {
      return true;
    }
    if (node.type === "BinaryExpression") {
      return this.containsXSquared(node.left, variable) || this.containsXSquared(node.right, variable);
    }
    return false;
  }
  integrateLinearOverQuadratic(numerator, denominator, variable, steps) {
    if (numerator.type === "BinaryExpression" && (numerator.operator === "+" || numerator.operator === "-") && denominator.type === "BinaryExpression" && denominator.operator === "+" && this.isFormXSquaredPlusConstant(denominator, variable)) {
      const leftTerm = numerator.left;
      const rightTerm = numerator.right;
      numerator.operator === "+" ? 1 : -1;
      steps.push(`Splitting: \u222B(${this.termToString(leftTerm)}${numerator.operator}${this.termToString(rightTerm)})/(x\xB2+c) dx = \u222B${this.termToString(leftTerm)}/(x\xB2+c) dx ${numerator.operator} \u222B${this.termToString(rightTerm)}/(x\xB2+c) dx`);
      const leftResult = this.integrateSingleTermOverQuadratic(leftTerm, denominator, variable, steps);
      const rightResult = this.integrateSingleTermOverQuadratic(rightTerm, denominator, variable, steps);
      return createBinaryNode(numerator.operator, leftResult, rightResult);
    }
    if (numerator.type === "Identifier" && numerator.name === variable && this.isFormXSquaredPlusConstant(denominator, variable)) {
      steps.push(`\u222Bx/(x\xB2+a\xB2) dx = (1/2)ln(x\xB2+a\xB2)`);
      return createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(2)), createFunctionNode("ln", [denominator]));
    }
    throw new Error("Linear over quadratic form not supported");
  }
  integrateSingleTermOverQuadratic(term, denominator, variable, steps) {
    if (isConstant$2(term, variable)) {
      const denom = denominator;
      const a = denom.right;
      if (a.type === "NumberLiteral" && a.value > 0) {
        const sqrtA = Math.sqrt(a.value);
        const coefficient = term.type === "NumberLiteral" ? term.value : 1;
        steps.push(`\u222B${coefficient}/(x\xB2+${a.value}) dx = (${coefficient}/${sqrtA})arctan(x/${sqrtA})`);
        return createBinaryNode("*", createFractionNode(createNumberNode(coefficient), createNumberNode(sqrtA)), createFunctionNode("atan", [
          createFractionNode(createVariableNode(variable), createNumberNode(sqrtA))
        ]));
      }
    }
    if (term.type === "BinaryExpression" && term.operator === "*" && (isConstant$2(term.left, variable) && term.right.type === "Identifier" && term.right.name === variable || isConstant$2(term.right, variable) && term.left.type === "Identifier" && term.left.name === variable)) {
      const coefficient = isConstant$2(term.left, variable) ? term.left : term.right;
      const coeffValue = coefficient.type === "NumberLiteral" ? coefficient.value : 1;
      steps.push(`\u222B${coeffValue}x/(x\xB2+a\xB2) dx = (${coeffValue}/2)ln(x\xB2+a\xB2)`);
      return createBinaryNode("*", createFractionNode(createNumberNode(coeffValue), createNumberNode(2)), createFunctionNode("ln", [denominator]));
    }
    if (term.type === "Identifier" && term.name === variable) {
      steps.push(`\u222Bx/(x\xB2+a\xB2) dx = (1/2)ln(x\xB2+a\xB2)`);
      return createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(2)), createFunctionNode("ln", [denominator]));
    }
    throw new Error(`Single term integration not supported for: ${this.termToString(term)}`);
  }
  termToString(node) {
    if (node.type === "NumberLiteral")
      return node.value.toString();
    if (node.type === "Identifier")
      return node.name;
    if (node.type === "BinaryExpression") {
      return `(${this.termToString(node.left)} ${node.operator} ${this.termToString(node.right)})`;
    }
    return "unknown";
  }
  isFormSqrtASquaredMinusXSquared(node, variable) {
    if (node.type === "FunctionCall" && node.name === "sqrt" && node.args.length === 1) {
      const arg = node.args[0];
      return this.isFormASquaredMinusXSquared(arg, variable);
    }
    return false;
  }
  isFormASquaredMinusXSquared(node, variable) {
    if (node.type === "BinaryExpression" && node.operator === "-") {
      const left = node.left;
      const right = node.right;
      if (isConstant$2(left, variable) && right.type === "BinaryExpression" && right.operator === "^" && right.left.type === "Identifier" && right.left.name === variable && right.right.type === "NumberLiteral" && right.right.value === 2) {
        return true;
      }
    }
    return false;
  }
  integrateSqrtASquaredMinusXSquared(numerator, denominator, variable, steps) {
    if (numerator.type === "NumberLiteral" && numerator.value === 1) {
      steps.push(`\u222B1/\u221A(a\xB2-x\xB2) dx = arcsin(x/a)`);
      const sqrt = denominator;
      const inner = sqrt.args[0];
      if (inner && inner.type === "BinaryExpression") {
        const a = inner.left;
        if (a.type === "NumberLiteral") {
          const sqrtA = Math.sqrt(a.value);
          return createFunctionNode("asin", [
            createFractionNode(createVariableNode(variable), createNumberNode(sqrtA))
          ]);
        }
      }
    }
    throw new Error("\u221A(a\xB2-x\xB2) form not supported");
  }
  attemptPartialFractions(numerator, denominator, variable, steps) {
    steps.push(`Partial fraction decomposition not fully implemented`);
    if (isConstant$2(numerator, variable)) {
      throw new Error("Complex partial fractions not yet implemented");
    }
    throw new Error("Partial fractions decomposition requires advanced algebraic manipulation");
  }
};
__name(_RationalFunctionStrategy, "RationalFunctionStrategy");
var RationalFunctionStrategy = _RationalFunctionStrategy;
var _SubstitutionStrategy = class _SubstitutionStrategy {
  constructor() {
    this.name = "Substitution";
    this.priority = 3;
  }
  canHandle(node, context) {
    const candidates = this.identifySubstitutionCandidates(node, context.variable);
    return candidates.length > 0;
  }
  integrate(node, context) {
    const steps = [];
    try {
      const result = this.integrateBySubstitution(node, context, steps);
      return {
        result,
        success: true,
        strategy: this.name,
        steps,
        complexity: calculateComplexity(result)
      };
    } catch (error) {
      return {
        result: null,
        success: false,
        strategy: this.name,
        steps: [...steps, error instanceof Error ? error.message : "Unknown error"],
        complexity: Infinity
      };
    }
  }
  identifySubstitutionCandidates(node, variable) {
    const candidates = [];
    if (node.type === "FunctionCall" && node.args[0]) {
      const arg = node.args[0];
      if (containsVariable(arg, variable)) {
        candidates.push({
          u: arg,
          du: this.estimateDerivative(arg, variable),
          confidence: 0.8,
          technique: "Basic u-substitution"
        });
      }
    }
    if (node.type === "FunctionCall" && node.name === "exp") {
      const arg = node.args[0];
      if (arg && containsVariable(arg, variable)) {
        candidates.push({
          u: arg,
          du: this.estimateDerivative(arg, variable),
          confidence: 0.9,
          technique: "Exponential substitution"
        });
      }
    }
    if (node.type === "FunctionCall" && node.name === "sqrt") {
      const arg = node.args[0];
      if (arg && this.isQuadraticForm(arg, variable)) {
        candidates.push({
          u: arg,
          du: this.estimateDerivative(arg, variable),
          confidence: 0.85,
          technique: "Square root substitution"
        });
      }
    }
    if (node.type === "Fraction" && node.numerator.type === "NumberLiteral" && node.numerator.value === 1 && node.denominator.type === "FunctionCall" && node.denominator.name === "sqrt") {
      const sqrtArg = node.denominator.args[0];
      if (sqrtArg && this.isTrigSubstitutionForm(sqrtArg, variable)) {
        candidates.push({
          u: sqrtArg,
          du: this.estimateDerivative(sqrtArg, variable),
          confidence: 0.95,
          technique: "Trigonometric substitution"
        });
      }
    }
    if (node.type === "BinaryExpression" && node.operator === "*") {
      const productNode = node;
      const productCandidates = this.findProductSubstitutions(productNode, variable);
      candidates.push(...productCandidates);
    }
    if (node.type === "Fraction") {
      const fractionCandidates = this.findFractionSubstitutions(node, variable);
      candidates.push(...fractionCandidates);
    }
    return candidates.sort((a, b) => b.confidence - a.confidence);
  }
  isQuadraticForm(node, variable) {
    if (node.type === "BinaryExpression" && ["+", "-"].includes(node.operator)) {
      const hasSquaredTerm = this.containsSquaredVariable(node, variable);
      return hasSquaredTerm;
    }
    return false;
  }
  containsSquaredVariable(node, variable) {
    if (node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral" && node.right.value === 2) {
      return true;
    }
    if (node.type === "BinaryExpression") {
      return this.containsSquaredVariable(node.left, variable) || this.containsSquaredVariable(node.right, variable);
    }
    return false;
  }
  isTrigSubstitutionForm(node, variable) {
    if (node.type === "BinaryExpression" && ["+", "-"].includes(node.operator)) {
      const left = node.left;
      const right = node.right;
      const hasXSquared = left.type === "BinaryExpression" && left.operator === "^" && left.left.type === "Identifier" && left.left.name === variable && left.right.type === "NumberLiteral" && left.right.value === 2 || right.type === "BinaryExpression" && right.operator === "^" && right.left.type === "Identifier" && right.left.name === variable && right.right.type === "NumberLiteral" && right.right.value === 2;
      const hasConstant = isConstant$2(left, variable) || isConstant$2(right, variable);
      return hasXSquared && hasConstant;
    }
    return false;
  }
  findProductSubstitutions(node, variable) {
    const candidates = [];
    const left = node.left;
    const right = node.right;
    if (right.type === "FunctionCall" && right.args[0]) {
      const innerFunc = right.args[0];
      if (this.isDerivativeOf(left, innerFunc, variable)) {
        candidates.push({
          u: innerFunc,
          du: left,
          confidence: 0.95,
          technique: "Chain rule reversal"
        });
      }
    }
    if (left.type === "FunctionCall" && left.args[0]) {
      const innerFunc = left.args[0];
      if (this.isDerivativeOf(right, innerFunc, variable)) {
        candidates.push({
          u: innerFunc,
          du: right,
          confidence: 0.95,
          technique: "Chain rule reversal"
        });
      }
    }
    return candidates;
  }
  findFractionSubstitutions(node, variable) {
    const candidates = [];
    if (this.isDerivativeOf(node.numerator, node.denominator, variable)) {
      candidates.push({
        u: node.denominator,
        du: node.numerator,
        confidence: 0.9,
        technique: "Logarithmic substitution"
      });
    }
    if (node.numerator.type === "FunctionCall" && node.numerator.name === "ln" && node.numerator.args[0]?.type === "Identifier" && node.numerator.args[0].name === variable && node.denominator.type === "Identifier" && node.denominator.name === variable) {
      candidates.push({
        u: node.numerator,
        // ln(x)
        du: createFractionNode(createNumberNode(1), createVariableNode(variable)),
        // 1/x
        confidence: 0.95,
        technique: "ln(x)/x substitution"
      });
    }
    return candidates;
  }
  isDerivativeOf(candidate, original, variable) {
    if (original.type === "BinaryExpression" && original.operator === "^" && original.left.type === "Identifier" && original.left.name === variable && original.right.type === "NumberLiteral") {
      const n = original.right.value;
      if (candidate.type === "BinaryExpression" && candidate.operator === "*" && candidate.left.type === "NumberLiteral" && candidate.left.value === n && candidate.right.type === "BinaryExpression" && candidate.right.operator === "^" && candidate.right.left.type === "Identifier" && candidate.right.left.name === variable && candidate.right.right.type === "NumberLiteral" && candidate.right.right.value === n - 1) {
        return true;
      }
    }
    return false;
  }
  estimateDerivative(node, variable) {
    switch (node.type) {
      case "Identifier":
        if (node.name === variable) {
          return createNumberNode(1);
        }
        return createNumberNode(0);
      case "BinaryExpression":
        if (node.operator === "*" && node.left.type === "NumberLiteral") {
          return createBinaryNode("*", node.left, this.estimateDerivative(node.right, variable));
        }
        if (node.operator === "^" && node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral") {
          const n = node.right.value;
          return createBinaryNode("*", createNumberNode(n), createBinaryNode("^", createVariableNode(variable), createNumberNode(n - 1)));
        }
        break;
      default:
        return createNumberNode(1);
    }
    return createNumberNode(1);
  }
  integrateBySubstitution(node, context, steps) {
    const candidates = this.identifySubstitutionCandidates(node, context.variable);
    if (candidates.length === 0) {
      throw new Error("No substitution candidates found");
    }
    const bestCandidate = candidates[0];
    if (!bestCandidate) {
      throw new Error("No suitable substitution found");
    }
    steps.push(`Using ${bestCandidate.technique}`);
    steps.push(`Let u = ${this.nodeToString(bestCandidate.u)}`);
    steps.push(`Then du = ${this.nodeToString(bestCandidate.du)} dx`);
    return this.applySubstitution(node, bestCandidate, context, steps);
  }
  applySubstitution(node, candidate, context, steps) {
    if (node.type === "FunctionCall" && node.name === "exp" && candidate.technique === "Exponential substitution") {
      const arg = node.args[0];
      if (arg.type === "BinaryExpression" && arg.operator === "*" && (arg.left.type === "NumberLiteral" && arg.right.type === "Identifier" || arg.right.type === "NumberLiteral" && arg.left.type === "Identifier")) {
        const coefficient = arg.left.type === "NumberLiteral" ? arg.left : arg.right;
        if (coefficient.type === "NumberLiteral") {
          steps.push(`\u222Be^(${coefficient.value}x) dx = (1/${coefficient.value})e^(${coefficient.value}x)`);
        } else {
          steps.push(`\u222Be^(ax) dx = (1/a)e^(ax)`);
        }
        return createBinaryNode("*", createFractionNode(createNumberNode(1), coefficient), createFunctionNode("exp", [arg]));
      }
    }
    if (candidate.technique === "Logarithmic substitution") {
      steps.push(`\u222Bf'(x)/f(x) dx = ln|f(x)|`);
      return createFunctionNode("ln", [createFunctionNode("abs", [candidate.u])]);
    }
    if (candidate.technique === "ln(x)/x substitution") {
      steps.push(`\u222Bln(x)/x dx: Let u = ln(x), then du = (1/x)dx`);
      steps.push(`\u222Bln(x)/x dx = \u222Bu du = u\xB2/2 = (ln(x))\xB2/2`);
      return createBinaryNode("/", createBinaryNode("^", createFunctionNode("ln", [createVariableNode(context.variable)]), createNumberNode(2)), createNumberNode(2));
    }
    if (candidate.technique === "Trigonometric substitution") {
      steps.push(`\u222B1/\u221A(a\xB2-x\xB2) dx = arcsin(x/a)`);
      return createFunctionNode("asin", [createVariableNode(context.variable)]);
    }
    if (candidate.technique === "Square root substitution") {
      steps.push(`Complex square root substitution detected`);
      throw new Error("Complex square root integration requires advanced techniques");
    }
    if (node.type === "FunctionCall" && candidate.technique === "Basic u-substitution") {
      const arg = node.args[0];
      if (arg.type === "BinaryExpression" && arg.operator === "*" && arg.left.type === "NumberLiteral") {
        const coefficient = arg.left.value;
        steps.push(`\u222B${node.name}(${coefficient}x) dx = (-1/${coefficient})${this.getAntiderivative(node.name)}(${coefficient}x)`);
        return createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(coefficient)), createFunctionNode(this.getAntiderivative(node.name), [arg]));
      }
    }
    throw new Error(`Substitution technique '${candidate.technique}' not fully implemented`);
  }
  getAntiderivative(functionName) {
    const antiderivatives = {
      sin: "cos",
      cos: "sin",
      tan: "ln",
      // Actually -ln|cos(x)|, but simplified
      exp: "exp"
    };
    return antiderivatives[functionName] || functionName;
  }
  nodeToString(node) {
    switch (node.type) {
      case "NumberLiteral":
        return node.value.toString();
      case "Identifier":
        return node.name;
      case "FunctionCall":
        return `${node.name}(${node.args.map((arg) => this.nodeToString(arg)).join(", ")})`;
      case "BinaryExpression":
        return `(${this.nodeToString(node.left)} ${node.operator} ${this.nodeToString(node.right)})`;
      default:
        return node.type;
    }
  }
};
__name(_SubstitutionStrategy, "SubstitutionStrategy");
var SubstitutionStrategy = _SubstitutionStrategy;
var _TrigonometricStrategy = class _TrigonometricStrategy {
  constructor() {
    this.name = "Trigonometric";
    this.priority = 2;
  }
  canHandle(node, context) {
    return this.hasTrigonometricPattern(node);
  }
  integrate(node, context) {
    const steps = [];
    try {
      const result = this.integrateTrigonometric(node, context.variable, steps);
      return {
        result,
        success: true,
        strategy: this.name,
        steps,
        complexity: calculateComplexity(result)
      };
    } catch (error) {
      return {
        result: null,
        success: false,
        strategy: this.name,
        steps: [...steps, error instanceof Error ? error.message : "Unknown error"],
        complexity: Infinity
      };
    }
  }
  hasTrigonometricPattern(node) {
    switch (node.type) {
      case "FunctionCall":
        return ["sin", "cos", "tan", "sec", "csc", "cot"].includes(node.name);
      case "BinaryExpression":
        if (node.operator === "^" && node.left.type === "FunctionCall" && ["sin", "cos", "tan"].includes(node.left.name) && node.right.type === "NumberLiteral") {
          return true;
        }
        return this.hasTrigonometricPattern(node.left) || this.hasTrigonometricPattern(node.right);
      default:
        return false;
    }
  }
  integrateTrigonometric(node, variable, steps) {
    if (this.isTrigonometricSquare(node)) {
      const powerNode = node;
      return this.integrateTrigSquare(powerNode, variable, steps);
    }
    if (this.isSinCosProduct(node)) {
      const productNode = node;
      return this.integrateSinCosProduct(productNode, variable, steps);
    }
    if (this.isTrigonometricPower(node)) {
      const powerNode = node;
      return this.integrateTrigPower(powerNode, variable, steps);
    }
    throw new Error("Trigonometric pattern not recognized");
  }
  isTrigonometricSquare(node) {
    return node.type === "BinaryExpression" && node.operator === "^" && node.right.type === "NumberLiteral" && node.right.value === 2 && node.left.type === "FunctionCall" && ["sin", "cos", "tan"].includes(node.left.name);
  }
  integrateTrigSquare(node, variable, steps) {
    const funcName = node.left.name;
    const arg = node.left.args[0];
    if (!arg || arg.type !== "Identifier" || arg.name !== variable) {
      throw new Error("Complex arguments not supported in trigonometric square");
    }
    const x = createVariableNode(variable);
    switch (funcName) {
      case "sin":
        steps.push(`\u222Bsin\xB2(x) dx = x/2 - sin(2x)/4 (Using identity: sin\xB2(x) = (1-cos(2x))/2)`);
        return createBinaryNode("-", createFractionNode(x, createNumberNode(2)), createFractionNode(createFunctionNode("sin", [createBinaryNode("*", createNumberNode(2), x)]), createNumberNode(4)));
      case "cos":
        steps.push(`\u222Bcos\xB2(x) dx = x/2 + sin(2x)/4 (Using identity: cos\xB2(x) = (1+cos(2x))/2)`);
        return createBinaryNode("+", createFractionNode(x, createNumberNode(2)), createFractionNode(createFunctionNode("sin", [createBinaryNode("*", createNumberNode(2), x)]), createNumberNode(4)));
      case "tan":
        steps.push(`\u222Btan\xB2(x) dx = tan(x) - x (Using identity: tan\xB2(x) = sec\xB2(x) - 1)`);
        return createBinaryNode("-", createFunctionNode("tan", [x]), x);
      default:
        throw new Error(`Trigonometric square ${funcName} not supported`);
    }
  }
  isSinCosProduct(node) {
    if (node.type !== "BinaryExpression" || node.operator !== "*") {
      return false;
    }
    const left = node.left;
    const right = node.right;
    return left.type === "FunctionCall" && left.name === "sin" && right.type === "FunctionCall" && right.name === "cos" || left.type === "FunctionCall" && left.name === "cos" && right.type === "FunctionCall" && right.name === "sin";
  }
  integrateSinCosProduct(node, variable, steps) {
    steps.push(`\u222Bsin(x)cos(x) dx = -cos\xB2(x)/2 (Using substitution u = cos(x))`);
    const x = createVariableNode(variable);
    return createBinaryNode("*", createNumberNode(-0.5), createBinaryNode("^", createFunctionNode("cos", [x]), createNumberNode(2)));
  }
  isTrigonometricPower(node) {
    return node.type === "BinaryExpression" && node.operator === "^" && node.left.type === "FunctionCall" && ["sin", "cos", "tan"].includes(node.left.name) && node.right.type === "NumberLiteral" && node.right.value > 2;
  }
  integrateTrigPower(node, variable, steps) {
    const funcName = node.left.name;
    const power = node.right.value;
    const arg = node.left.args[0];
    if (!arg || arg.type !== "Identifier" || arg.name !== variable) {
      throw new Error("Complex arguments not supported in trigonometric power");
    }
    if (funcName === "sin" || funcName === "cos") {
      if (power % 2 === 1) {
        steps.push(`\u222B${funcName}^${power}(x) dx (Odd power: use substitution)`);
        return this.integrateOddTrigPower(funcName, power, variable, steps);
      } else {
        steps.push(`\u222B${funcName}^${power}(x) dx (Even power: use reduction formula)`);
        return this.integrateEvenTrigPower(funcName, power, variable, steps);
      }
    }
    throw new Error(`High power integration of ${funcName} not implemented`);
  }
  integrateOddTrigPower(funcName, power, variable, steps) {
    const x = createVariableNode(variable);
    if (funcName === "sin") {
      steps.push(`Factor out sin(x) and use substitution u = cos(x)`);
      return createBinaryNode("*", createNumberNode(-1 / power), createBinaryNode("^", createFunctionNode("cos", [x]), createNumberNode(power)));
    } else if (funcName === "cos") {
      steps.push(`Factor out cos(x) and use substitution u = sin(x)`);
      return createBinaryNode("*", createNumberNode(1 / power), createBinaryNode("^", createFunctionNode("sin", [x]), createNumberNode(power)));
    }
    throw new Error(`Odd power integration of ${funcName} not implemented`);
  }
  integrateEvenTrigPower(funcName, power, variable, steps) {
    steps.push(`Use reduction formula repeatedly`);
    const x = createVariableNode(variable);
    if (funcName === "sin") {
      return createBinaryNode("+", createBinaryNode("*", createFractionNode(createNumberNode(power - 1), createNumberNode(power)), x), createBinaryNode("*", createNumberNode(-1), createBinaryNode("*", createFractionNode(createNumberNode(1), createNumberNode(power)), createBinaryNode("*", createBinaryNode("^", createFunctionNode("sin", [x]), createNumberNode(power - 1)), createFunctionNode("cos", [x])))));
    }
    throw new Error(`Even power integration of ${funcName} not fully implemented`);
  }
};
__name(_TrigonometricStrategy, "TrigonometricStrategy");
var TrigonometricStrategy = _TrigonometricStrategy;
var _IntegrationEngine = class _IntegrationEngine {
  constructor() {
    this.strategies = [
      new BasicIntegrationStrategy(),
      new TrigonometricStrategy(),
      new SubstitutionStrategy(),
      new RationalFunctionStrategy(),
      new IntegrationByPartsStrategy()
    ];
  }
  /**
   * Integrate an AST node using multiple strategies
   */
  integrate(node, context) {
    const steps = [];
    let bestResult = null;
    let minComplexity = Infinity;
    const sortedStrategies = [...this.strategies].sort((a, b) => a.priority - b.priority);
    for (const strategy of sortedStrategies) {
      if (context.attemptedStrategies.has(strategy.name)) {
        continue;
      }
      if (!strategy.canHandle(node, context)) {
        continue;
      }
      try {
        steps.push(`Trying ${strategy.name}...`);
        const result = strategy.integrate(node, context);
        if (result.success && result.result) {
          steps.push(`${strategy.name}: Success`);
          if (strategy.priority <= 2) {
            return {
              ...result,
              steps: [...steps, ...result.steps]
            };
          }
          if (result.complexity < minComplexity) {
            bestResult = result;
            minComplexity = result.complexity;
          }
          if (result.complexity <= 1) {
            break;
          }
        } else {
          steps.push(`Attempted ${strategy.name}: Failed - ${result.steps.join("; ")}`);
        }
      } catch (error) {
        steps.push(`Attempted ${strategy.name}: Error - ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      context.attemptedStrategies.add(strategy.name);
    }
    if (bestResult) {
      return {
        ...bestResult,
        steps: [...steps, ...bestResult.steps]
      };
    }
    return {
      result: null,
      success: false,
      steps: [...steps, "No suitable integration strategy found"],
      complexity: Infinity
    };
  }
  /**
   * Integrate with automatic context creation
   */
  integrateAST(node, variable, maxDepth = 3) {
    const context = {
      variable,
      depth: 0,
      maxDepth,
      attemptedStrategies: /* @__PURE__ */ new Set()
    };
    return this.integrate(node, context);
  }
};
__name(_IntegrationEngine, "IntegrationEngine");
var IntegrationEngine = _IntegrationEngine;
var modernIntegrationEngine = new IntegrationEngine();
function integrateAST(node, variable) {
  try {
    const context = {
      variable,
      depth: 0,
      maxDepth: 5,
      attemptedStrategies: /* @__PURE__ */ new Set()
    };
    const result = modernIntegrationEngine.integrate(node, context);
    if (result.success && result.result) {
      return result.result;
    }
  } catch (error) {
  }
  return legacyIntegrateAST(node, variable);
}
__name(integrateAST, "integrateAST");
function legacyIntegrateAST(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return {
        type: "BinaryExpression",
        operator: "*",
        left: node,
        right: {
          type: "Identifier",
          name: variable,
          scope: "free",
          uniqueId: `free_${variable}`
        }
      };
    case "Identifier":
      if (node.name === variable && node.scope === "free") {
        return {
          type: "Fraction",
          numerator: {
            type: "BinaryExpression",
            operator: "^",
            left: {
              type: "Identifier",
              name: variable,
              scope: "free",
              uniqueId: `free_${variable}`
            },
            right: {
              type: "NumberLiteral",
              value: 2
            }
          },
          denominator: {
            type: "NumberLiteral",
            value: 2
          }
        };
      } else {
        return {
          type: "BinaryExpression",
          operator: "*",
          left: node,
          right: {
            type: "Identifier",
            name: variable,
            scope: "free",
            uniqueId: `free_${variable}`
          }
        };
      }
    case "BinaryExpression":
      return integrateBinaryExpression(node, variable);
    case "UnaryExpression":
      return integrateUnaryExpression(node, variable);
    case "FunctionCall":
      return integrateFunctionCall(node, variable);
    case "Fraction":
      return integrateFraction(node, variable);
    case "Integral":
    case "Sum":
    case "Product":
      throw new Error(`Integration of ${node.type} not yet implemented`);
    default:
      throw new Error(`Unsupported AST node type for integration: ${node.type}`);
  }
}
__name(legacyIntegrateAST, "legacyIntegrateAST");
function handleSpecialIntegration(node, variable) {
  if (node.type === "BinaryExpression" && node.operator === "^" && node.right.type === "NumberLiteral" && node.right.value === 2 && node.left.type === "FunctionCall") {
    const func = node.left;
    if (func.args.length === 1 && func.args[0]?.type === "Identifier" && func.args[0].name === variable) {
      switch (func.name) {
        case "sin":
          return {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "Fraction",
              numerator: {
                type: "Identifier",
                name: variable,
                scope: "free",
                uniqueId: `free_${variable}`
              },
              denominator: { type: "NumberLiteral", value: 2 }
            },
            right: {
              type: "Fraction",
              numerator: {
                type: "FunctionCall",
                name: "sin",
                args: [
                  {
                    type: "BinaryExpression",
                    operator: "*",
                    left: { type: "NumberLiteral", value: 2 },
                    right: {
                      type: "Identifier",
                      name: variable,
                      scope: "free",
                      uniqueId: `free_${variable}`
                    }
                  }
                ]
              },
              denominator: { type: "NumberLiteral", value: 4 }
            }
          };
        case "cos":
          return {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Fraction",
              numerator: {
                type: "Identifier",
                name: variable,
                scope: "free",
                uniqueId: `free_${variable}`
              },
              denominator: { type: "NumberLiteral", value: 2 }
            },
            right: {
              type: "Fraction",
              numerator: {
                type: "FunctionCall",
                name: "sin",
                args: [
                  {
                    type: "BinaryExpression",
                    operator: "*",
                    left: { type: "NumberLiteral", value: 2 },
                    right: {
                      type: "Identifier",
                      name: variable,
                      scope: "free",
                      uniqueId: `free_${variable}`
                    }
                  }
                ]
              },
              denominator: { type: "NumberLiteral", value: 4 }
            }
          };
        case "tan":
          return {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "FunctionCall",
              name: "tan",
              args: [
                { type: "Identifier", name: variable, scope: "free", uniqueId: `free_${variable}` }
              ]
            },
            right: {
              type: "Identifier",
              name: variable,
              scope: "free",
              uniqueId: `free_${variable}`
            }
          };
      }
    }
  }
  return null;
}
__name(handleSpecialIntegration, "handleSpecialIntegration");
function integrateBinaryExpression(node, variable) {
  const left = node.left;
  const right = node.right;
  const specialCase = handleSpecialIntegration(node, variable);
  if (specialCase) {
    return specialCase;
  }
  switch (node.operator) {
    case "+":
    case "-":
      return {
        type: "BinaryExpression",
        operator: node.operator,
        left: integrateAST(left, variable),
        right: integrateAST(right, variable)
      };
    case "*":
      if (isConstant$1(left, variable)) {
        return {
          type: "BinaryExpression",
          operator: "*",
          left,
          right: integrateAST(right, variable)
        };
      } else if (isConstant$1(right, variable)) {
        return {
          type: "BinaryExpression",
          operator: "*",
          left: right,
          right: integrateAST(left, variable)
        };
      } else {
        throw new Error("Integration by parts not yet implemented");
      }
    case "/":
      if (isConstant$1(right, variable)) {
        return {
          type: "Fraction",
          numerator: integrateAST(left, variable),
          denominator: right
        };
      } else {
        throw new Error("Complex fraction integration not yet implemented");
      }
    case "^":
      if (left.type === "Identifier" && left.name === variable && isConstant$1(right, variable)) {
        const exponent = right;
        if (exponent.type === "NumberLiteral" && exponent.value === -1) {
          return {
            type: "FunctionCall",
            name: "ln",
            args: [
              {
                type: "FunctionCall",
                name: "abs",
                args: [left]
              }
            ]
          };
        }
        const newExponent = {
          type: "BinaryExpression",
          operator: "+",
          left: exponent,
          right: {
            type: "NumberLiteral",
            value: 1
          }
        };
        return {
          type: "Fraction",
          numerator: {
            type: "BinaryExpression",
            operator: "^",
            left,
            right: newExponent
          },
          denominator: newExponent
        };
      } else {
        throw new Error("Complex power integration not yet implemented");
      }
    case "=":
    case ">":
    case "<":
    case ">=":
    case "<=":
      throw new Error("Integration of comparison operators not supported");
    default:
      throw new Error(`Integration of operator ${node.operator} not supported`);
  }
}
__name(integrateBinaryExpression, "integrateBinaryExpression");
function integrateUnaryExpression(node, variable) {
  const integral = integrateAST(node.operand, variable);
  switch (node.operator) {
    case "+":
      return integral;
    case "-":
      return {
        type: "UnaryExpression",
        operator: "-",
        operand: integral
      };
    default:
      throw new Error(`Unsupported unary operator for integration: ${node.operator}`);
  }
}
__name(integrateUnaryExpression, "integrateUnaryExpression");
function integrateFunctionCall(node, variable) {
  if (node.args.length !== 1) {
    throw new Error(`Integration of function ${node.name} with ${node.args.length} arguments not supported`);
  }
  const argument = node.args[0];
  if (!argument) {
    throw new Error(`Function ${node.name} missing required argument`);
  }
  if (argument.type === "Identifier" && argument.name === variable) {
    switch (node.name) {
      case "sin":
        return {
          type: "UnaryExpression",
          operator: "-",
          operand: {
            type: "FunctionCall",
            name: "cos",
            args: [argument]
          }
        };
      case "cos":
        return {
          type: "FunctionCall",
          name: "sin",
          args: [argument]
        };
      case "exp":
        return {
          type: "FunctionCall",
          name: "exp",
          args: [argument]
        };
      case "tan":
        return {
          type: "UnaryExpression",
          operator: "-",
          operand: {
            type: "FunctionCall",
            name: "ln",
            args: [
              {
                type: "FunctionCall",
                name: "abs",
                args: [
                  {
                    type: "FunctionCall",
                    name: "cos",
                    args: [argument]
                  }
                ]
              }
            ]
          }
        };
      case "ln":
        return {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: argument,
            right: {
              type: "FunctionCall",
              name: "ln",
              args: [argument]
            }
          },
          right: argument
        };
      case "log":
        return {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: argument,
            right: {
              type: "FunctionCall",
              name: "log",
              args: [argument]
            }
          },
          right: {
            type: "Fraction",
            numerator: argument,
            denominator: {
              type: "FunctionCall",
              name: "ln",
              args: [{ type: "NumberLiteral", value: 10 }]
            }
          }
        };
      case "sqrt":
        return {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "Fraction",
            numerator: { type: "NumberLiteral", value: 2 },
            denominator: { type: "NumberLiteral", value: 3 }
          },
          right: {
            type: "BinaryExpression",
            operator: "^",
            left: argument,
            right: {
              type: "Fraction",
              numerator: { type: "NumberLiteral", value: 3 },
              denominator: { type: "NumberLiteral", value: 2 }
            }
          }
        };
      case "asin":
        return {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: argument,
            right: {
              type: "FunctionCall",
              name: "asin",
              args: [argument]
            }
          },
          right: {
            type: "FunctionCall",
            name: "sqrt",
            args: [
              {
                type: "BinaryExpression",
                operator: "-",
                left: { type: "NumberLiteral", value: 1 },
                right: {
                  type: "BinaryExpression",
                  operator: "^",
                  left: argument,
                  right: { type: "NumberLiteral", value: 2 }
                }
              }
            ]
          }
        };
      case "acos":
        return {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: argument,
            right: {
              type: "FunctionCall",
              name: "acos",
              args: [argument]
            }
          },
          right: {
            type: "FunctionCall",
            name: "sqrt",
            args: [
              {
                type: "BinaryExpression",
                operator: "-",
                left: { type: "NumberLiteral", value: 1 },
                right: {
                  type: "BinaryExpression",
                  operator: "^",
                  left: argument,
                  right: { type: "NumberLiteral", value: 2 }
                }
              }
            ]
          }
        };
      case "atan":
        return {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "*",
            left: argument,
            right: {
              type: "FunctionCall",
              name: "atan",
              args: [argument]
            }
          },
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "Fraction",
              numerator: { type: "NumberLiteral", value: 1 },
              denominator: { type: "NumberLiteral", value: 2 }
            },
            right: {
              type: "FunctionCall",
              name: "ln",
              args: [
                {
                  type: "BinaryExpression",
                  operator: "+",
                  left: { type: "NumberLiteral", value: 1 },
                  right: {
                    type: "BinaryExpression",
                    operator: "^",
                    left: argument,
                    right: { type: "NumberLiteral", value: 2 }
                  }
                }
              ]
            }
          }
        };
      case "sinh":
        return {
          type: "FunctionCall",
          name: "cosh",
          args: [argument]
        };
      case "cosh":
        return {
          type: "FunctionCall",
          name: "sinh",
          args: [argument]
        };
      case "tanh":
        return {
          type: "FunctionCall",
          name: "ln",
          args: [
            {
              type: "FunctionCall",
              name: "cosh",
              args: [argument]
            }
          ]
        };
      case "abs":
        return {
          type: "Fraction",
          numerator: {
            type: "BinaryExpression",
            operator: "^",
            left: argument,
            right: { type: "NumberLiteral", value: 2 }
          },
          denominator: { type: "NumberLiteral", value: 2 }
        };
      default:
        throw new Error(`Integration of function ${node.name} not yet implemented`);
    }
  }
  if (node.name === "exp" && argument.type === "BinaryExpression" && argument.operator === "*") {
    const { left, right } = argument;
    if (isConstant$1(left, variable) && right.type === "Identifier" && right.name === variable) {
      return {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: left
        },
        right: {
          type: "FunctionCall",
          name: "exp",
          args: [argument]
        }
      };
    } else if (isConstant$1(right, variable) && left.type === "Identifier" && left.name === variable) {
      return {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: right
        },
        right: {
          type: "FunctionCall",
          name: "exp",
          args: [argument]
        }
      };
    }
  }
  throw new Error("Integration with substitution not yet implemented");
}
__name(integrateFunctionCall, "integrateFunctionCall");
function integrateFraction(node, variable) {
  const numerator = node.numerator;
  const denominator = node.denominator;
  if (isConstant$1(denominator, variable)) {
    return {
      type: "Fraction",
      numerator: integrateAST(numerator, variable),
      denominator
    };
  }
  if (numerator.type === "NumberLiteral" && numerator.value === 1 && denominator.type === "Identifier" && denominator.name === variable) {
    return {
      type: "FunctionCall",
      name: "ln",
      args: [
        {
          type: "FunctionCall",
          name: "abs",
          args: [denominator]
        }
      ]
    };
  }
  if (numerator.type === "NumberLiteral" && numerator.value === 1 && denominator.type === "BinaryExpression" && denominator.operator === "+" && denominator.left.type === "BinaryExpression" && denominator.left.operator === "^" && denominator.left.left.type === "Identifier" && denominator.left.left.name === variable && denominator.left.right.type === "NumberLiteral" && denominator.left.right.value === 2 && isConstant$1(denominator.right, variable)) {
    const a = denominator.right;
    if (a.type === "NumberLiteral" && a.value > 0) {
      const sqrtA = Math.sqrt(a.value);
      return {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Fraction",
          numerator: { type: "NumberLiteral", value: 1 },
          denominator: { type: "NumberLiteral", value: sqrtA }
        },
        right: {
          type: "FunctionCall",
          name: "atan",
          args: [
            {
              type: "Fraction",
              numerator: {
                type: "Identifier",
                name: variable,
                scope: "free",
                uniqueId: `free_${variable}`
              },
              denominator: { type: "NumberLiteral", value: sqrtA }
            }
          ]
        }
      };
    }
  }
  throw new Error("Complex fraction integration not yet implemented");
}
__name(integrateFraction, "integrateFraction");
function isConstant$1(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return true;
    case "Identifier":
      return node.name !== variable || node.scope !== "free";
    case "BinaryExpression":
      return isConstant$1(node.left, variable) && isConstant$1(node.right, variable);
    case "UnaryExpression":
      return isConstant$1(node.operand, variable);
    case "FunctionCall":
      return node.args.every((arg) => isConstant$1(arg, variable));
    case "Fraction":
      return isConstant$1(node.numerator, variable) && isConstant$1(node.denominator, variable);
    default:
      return false;
  }
}
__name(isConstant$1, "isConstant$1");
function analyzeIntegrate(ast, options) {
  const steps = [];
  try {
    const variable = getAnalysisVariable(ast, options.variable);
    const freeVars = extractFreeVariables(ast);
    if (!options.variable && freeVars.size > 1) {
      steps.push(`Multiple variables found: {${Array.from(freeVars).join(", ")}}. Using '${variable}' for integration.`);
    } else if (!options.variable && freeVars.size === 1) {
      steps.push(`Auto-detected variable: ${variable}`);
    }
    steps.push(`Integrating with respect to ${variable}`);
    steps.push(`Expression: ${astToLatex(ast)}`);
    try {
      const context = {
        variable,
        depth: 0,
        maxDepth: 5,
        attemptedStrategies: /* @__PURE__ */ new Set()
      };
      const result = modernIntegrationEngine.integrate(ast, context);
      if (result.success && result.result) {
        if (result.steps && result.steps.length > 0) {
          steps.push(`Strategy: ${result.strategy}`);
          steps.push(...result.steps);
        }
        return {
          steps,
          value: astToLatex(result.result) + " + C",
          valueType: "symbolic",
          ast: result.result,
          error: null
        };
      }
    } catch (modernError) {
      steps.push(`Modern strategy failed: ${modernError instanceof Error ? modernError.message : "Unknown error"}`);
      steps.push(`Falling back to legacy integration...`);
    }
    const integral = legacyIntegrateAST(ast, variable);
    const simplifiedIntegral = overlapSimplify(integral);
    const integralLatex = astToLatex(simplifiedIntegral);
    steps.push(`Legacy integration successful`);
    steps.push(`Integral: ${integralLatex} + C`);
    return {
      steps,
      value: `${integralLatex} + C`,
      valueType: "symbolic",
      ast: simplifiedIntegral,
      error: null
    };
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Integration error"
    };
  }
}
__name(analyzeIntegrate, "analyzeIntegrate");
function solveEquation(equation, variable) {
  const degree = getDegree(equation, variable);
  switch (degree) {
    case 0:
      return solveConstantEquation(equation);
    case 1:
      return solveLinearEquation(equation, variable);
    case 2:
      return solveQuadraticEquation(equation, variable);
    default:
      throw new Error(`Equations of degree ${degree} are not yet supported`);
  }
}
__name(solveEquation, "solveEquation");
function getDegree(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return 0;
    case "Identifier":
      if (node.name === variable && node.scope === "free") {
        return 1;
      }
      return 0;
    case "BinaryExpression":
      switch (node.operator) {
        case "+":
        case "-":
          return Math.max(getDegree(node.left, variable), getDegree(node.right, variable));
        case "*":
          return getDegree(node.left, variable) + getDegree(node.right, variable);
        case "/":
          if (getDegree(node.right, variable) > 0) {
            throw new Error("Rational equations not yet supported");
          }
          return getDegree(node.left, variable);
        case "^":
          if (node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral" && Number.isInteger(node.right.value)) {
            return node.right.value;
          }
          if (getDegree(node.left, variable) === 0) {
            return 0;
          }
          throw new Error("Complex power expressions not yet supported");
        default:
          throw new Error(`Operator ${node.operator} not supported in equation solving`);
      }
    case "UnaryExpression":
      return getDegree(node.operand, variable);
    case "FunctionCall":
      if (getDegree(node.args[0] || { type: "NumberLiteral" }, variable) > 0) {
        throw new Error("Transcendental equations not yet supported");
      }
      return 0;
    case "Fraction":
      return getDegree(node.numerator, variable) - getDegree(node.denominator, variable);
    default:
      throw new Error(`Node type ${node.type} not supported in equation solving`);
  }
}
__name(getDegree, "getDegree");
function solveConstantEquation(equation) {
  const value = evaluateConstant(equation);
  if (Math.abs(value) < 1e-10) {
    throw new Error("Equation has infinitely many solutions");
  } else {
    return [];
  }
}
__name(solveConstantEquation, "solveConstantEquation");
function solveLinearEquation(equation, variable) {
  const coefficients = extractLinearCoefficients(equation, variable);
  const a = coefficients.a;
  const b = coefficients.b;
  if (Math.abs(a) < 1e-10) {
    return solveConstantEquation({
      type: "NumberLiteral",
      value: b
    });
  }
  const solution = {
    type: "Fraction",
    numerator: {
      type: "UnaryExpression",
      operator: "-",
      operand: {
        type: "NumberLiteral",
        value: b
      }
    },
    denominator: {
      type: "NumberLiteral",
      value: a
    }
  };
  return [solution];
}
__name(solveLinearEquation, "solveLinearEquation");
function solveQuadraticEquation(equation, variable) {
  const coefficients = extractQuadraticCoefficients(equation, variable);
  const a = coefficients.a;
  const b = coefficients.b;
  const c = coefficients.c;
  if (Math.abs(a) < 1e-10) {
    return solveLinearEquation(equation, variable);
  }
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return [];
  } else if (Math.abs(discriminant) < 1e-10) {
    const solution = {
      type: "Fraction",
      numerator: {
        type: "UnaryExpression",
        operator: "-",
        operand: {
          type: "NumberLiteral",
          value: b
        }
      },
      denominator: {
        type: "NumberLiteral",
        value: 2 * a
      }
    };
    return [solution];
  } else {
    const sqrtDiscriminant = {
      type: "FunctionCall",
      name: "sqrt",
      args: [
        {
          type: "NumberLiteral",
          value: discriminant
        }
      ]
    };
    const solution1 = {
      type: "Fraction",
      numerator: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "UnaryExpression",
          operator: "-",
          operand: {
            type: "NumberLiteral",
            value: b
          }
        },
        right: sqrtDiscriminant
      },
      denominator: {
        type: "NumberLiteral",
        value: 2 * a
      }
    };
    const solution2 = {
      type: "Fraction",
      numerator: {
        type: "BinaryExpression",
        operator: "-",
        left: {
          type: "UnaryExpression",
          operator: "-",
          operand: {
            type: "NumberLiteral",
            value: b
          }
        },
        right: sqrtDiscriminant
      },
      denominator: {
        type: "NumberLiteral",
        value: 2 * a
      }
    };
    return [solution1, solution2];
  }
}
__name(solveQuadraticEquation, "solveQuadraticEquation");
function extractLinearCoefficients(node, variable) {
  let a = 0;
  let b = 0;
  function extract(n, sign = 1) {
    switch (n.type) {
      case "NumberLiteral":
        b += sign * n.value;
        break;
      case "Identifier":
        if (n.name === variable && n.scope === "free") {
          a += sign;
        } else {
          b += sign * evaluateConstant(n);
        }
        break;
      case "BinaryExpression":
        switch (n.operator) {
          case "+":
            extract(n.left, sign);
            extract(n.right, sign);
            break;
          case "-":
            extract(n.left, sign);
            extract(n.right, -sign);
            break;
          case "*":
            if (isConstant(n.left, variable)) {
              const coeff = evaluateConstant(n.left);
              extract(n.right, sign * coeff);
            } else if (isConstant(n.right, variable)) {
              const coeff = evaluateConstant(n.right);
              extract(n.left, sign * coeff);
            } else if (n.left.type === "Fraction" && n.right.type === "Identifier" && n.right.name === variable) {
              const numerValue = evaluateConstant(n.left.numerator);
              const denomValue = evaluateConstant(n.left.denominator);
              const coeff = numerValue / denomValue;
              a += sign * coeff;
            } else if (n.right.type === "Fraction" && n.left.type === "Identifier" && n.left.name === variable) {
              const numerValue = evaluateConstant(n.right.numerator);
              const denomValue = evaluateConstant(n.right.denominator);
              const coeff = numerValue / denomValue;
              a += sign * coeff;
            } else {
              throw new Error("Complex multiplication not supported in linear extraction");
            }
            break;
          default:
            throw new Error(`Operator ${n.operator} not supported in linear extraction`);
        }
        break;
      case "UnaryExpression":
        if (n.operator === "-") {
          extract(n.operand, -sign);
        } else {
          extract(n.operand, sign);
        }
        break;
      case "Fraction": {
        const numerValue = evaluateConstant(n.numerator);
        const denomValue = evaluateConstant(n.denominator);
        const fracValue = numerValue / denomValue;
        b += sign * fracValue;
        break;
      }
      default:
        throw new Error(`Node type ${n.type} not supported in linear extraction`);
    }
  }
  __name(extract, "extract");
  extract(node);
  return { a, b };
}
__name(extractLinearCoefficients, "extractLinearCoefficients");
function extractQuadraticCoefficients(node, variable) {
  let a = 0;
  let b = 0;
  let c = 0;
  function extract(n, sign = 1) {
    switch (n.type) {
      case "NumberLiteral":
        c += sign * n.value;
        break;
      case "Identifier":
        if (n.name === variable && n.scope === "free") {
          b += sign;
        } else {
          c += sign * evaluateConstant(n);
        }
        break;
      case "BinaryExpression":
        switch (n.operator) {
          case "+":
            extract(n.left, sign);
            extract(n.right, sign);
            break;
          case "-":
            extract(n.left, sign);
            extract(n.right, -sign);
            break;
          case "*":
            extractMultiplication(n, sign);
            break;
          case "^":
            if (n.left.type === "Identifier" && n.left.name === variable && n.right.type === "NumberLiteral" && n.right.value === 2) {
              a += sign;
            } else {
              throw new Error("Complex power not supported in quadratic extraction");
            }
            break;
          default:
            throw new Error(`Operator ${n.operator} not supported in quadratic extraction`);
        }
        break;
      case "UnaryExpression":
        if (n.operator === "-") {
          extract(n.operand, -sign);
        } else {
          extract(n.operand, sign);
        }
        break;
      case "Fraction": {
        const numerValue = evaluateConstant(n.numerator);
        const denomValue = evaluateConstant(n.denominator);
        const fracValue = numerValue / denomValue;
        c += sign * fracValue;
        break;
      }
      default:
        throw new Error(`Node type ${n.type} not supported in quadratic extraction`);
    }
  }
  __name(extract, "extract");
  function extractMultiplication(n, sign) {
    const left = n.left;
    const right = n.right;
    if (isConstant(left, variable) && right.type === "BinaryExpression" && right.operator === "^" && right.left.type === "Identifier" && right.left.name === variable && right.right.type === "NumberLiteral" && right.right.value === 2) {
      a += sign * evaluateConstant(left);
      return;
    }
    if (isConstant(right, variable) && left.type === "BinaryExpression" && left.operator === "^" && left.left.type === "Identifier" && left.left.name === variable && left.right.type === "NumberLiteral" && left.right.value === 2) {
      a += sign * evaluateConstant(right);
      return;
    }
    if (isConstant(left, variable) && right.type === "Identifier" && right.name === variable) {
      b += sign * evaluateConstant(left);
      return;
    }
    if (isConstant(right, variable) && left.type === "Identifier" && left.name === variable) {
      b += sign * evaluateConstant(right);
      return;
    }
    if (isConstant(left, variable) && isConstant(right, variable)) {
      c += sign * evaluateConstant(left) * evaluateConstant(right);
      return;
    }
    if (left.type === "Identifier" && left.name === variable && right.type === "Identifier" && right.name === variable) {
      a += sign;
      return;
    }
    throw new Error("Complex multiplication not supported in quadratic extraction");
  }
  __name(extractMultiplication, "extractMultiplication");
  extract(node);
  return { a, b, c };
}
__name(extractQuadraticCoefficients, "extractQuadraticCoefficients");
function isConstant(node, variable) {
  switch (node.type) {
    case "NumberLiteral":
      return true;
    case "Identifier":
      return node.name !== variable || node.scope !== "free";
    case "BinaryExpression":
      return isConstant(node.left, variable) && isConstant(node.right, variable);
    case "UnaryExpression":
      return isConstant(node.operand, variable);
    case "FunctionCall":
      return node.args.every((arg) => isConstant(arg, variable));
    case "Fraction":
      return isConstant(node.numerator, variable) && isConstant(node.denominator, variable);
    default:
      return false;
  }
}
__name(isConstant, "isConstant");
function evaluateConstant(node) {
  switch (node.type) {
    case "NumberLiteral":
      return node.value;
    case "Identifier":
      if (node.name === "e")
        return Math.E;
      if (node.name === "\u03C0" || node.name === "pi")
        return Math.PI;
      throw new Error(`Unknown constant: ${node.name}`);
    case "BinaryExpression": {
      const left = evaluateConstant(node.left);
      const right = evaluateConstant(node.right);
      switch (node.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "^":
          return Math.pow(left, right);
        default:
          throw new Error(`Unsupported operator: ${node.operator}`);
      }
    }
    case "UnaryExpression": {
      const operand = evaluateConstant(node.operand);
      switch (node.operator) {
        case "+":
          return operand;
        case "-":
          return -operand;
        default:
          throw new Error(`Unsupported unary operator: ${node.operator}`);
      }
    }
    case "FunctionCall": {
      const arg = evaluateConstant(node.args[0] || { type: "NumberLiteral", value: 0 });
      switch (node.name) {
        case "sin":
          return Math.sin(arg);
        case "cos":
          return Math.cos(arg);
        case "tan":
          return Math.tan(arg);
        case "exp":
          return Math.exp(arg);
        case "ln":
          return Math.log(arg);
        case "log":
          return Math.log10(arg);
        case "sqrt":
          return Math.sqrt(arg);
        case "abs":
          return Math.abs(arg);
        default:
          throw new Error(`Unsupported function: ${node.name}`);
      }
    }
    case "Fraction": {
      const numerator = evaluateConstant(node.numerator);
      const denominator = evaluateConstant(node.denominator);
      if (denominator === 0) {
        throw new Error("Division by zero in fraction evaluation");
      }
      return numerator / denominator;
    }
    default:
      throw new Error(`Cannot evaluate node type: ${node.type}`);
  }
}
__name(evaluateConstant, "evaluateConstant");
function analyzeSolve(ast, options) {
  const steps = [];
  try {
    const variable = options.solveFor || getAnalysisVariable(ast, options.variable);
    const freeVars = extractFreeVariables(ast);
    if (!options.solveFor && !options.variable && freeVars.size > 1) {
      steps.push(`Multiple variables found: {${Array.from(freeVars).join(", ")}}. Solving for '${variable}'.`);
    } else if (!options.solveFor && !options.variable && freeVars.size === 1) {
      steps.push(`Auto-detected variable: ${variable}`);
    }
    steps.push(`Solving equation for ${variable}`);
    steps.push(`Equation: ${astToLatex(ast)} = 0`);
    const degree = getDegree(ast, variable);
    steps.push(`Detected ${degree === 0 ? "constant" : degree === 1 ? "linear" : degree === 2 ? "quadratic" : `degree ${degree}`} equation`);
    const solutions = solveEquation(ast, variable);
    if (solutions.length === 0) {
      steps.push("No real solutions found");
      return {
        steps,
        value: "No solutions",
        valueType: "symbolic",
        ast: null,
        error: null
      };
    }
    const simplifiedSolutions = solutions.map((sol) => overlapSimplify(sol));
    const solutionStrings = simplifiedSolutions.map((sol) => astToLatex(sol));
    steps.push(`Solutions: ${variable} = ${solutionStrings.join(", ")}`);
    return {
      steps,
      value: solutionStrings.join(", "),
      valueType: "symbolic",
      ast: simplifiedSolutions.length === 1 ? simplifiedSolutions[0] || null : null,
      error: null
    };
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Equation solving error"
    };
  }
}
__name(analyzeSolve, "analyzeSolve");
function analyzeFactorization(ast) {
  const steps = [];
  try {
    steps.push(`Original expression: ${stepsAstToLatex(ast)}`);
    const simplified = overlapSimplify(ast, { factor: true, expand: false }, steps);
    const simplifiedLatex = astToLatex(simplified);
    steps.push(`Final factored form: ${simplifiedLatex}`);
    return {
      steps,
      value: simplifiedLatex,
      valueType: "symbolic",
      ast: simplified,
      error: null
    };
  } catch (error) {
    steps.push(`Error during factorization: ${error instanceof Error ? error.message : "Unknown error"}`);
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Factorization failed"
    };
  }
}
__name(analyzeFactorization, "analyzeFactorization");
function analyzeDistribution(ast) {
  const steps = [];
  try {
    steps.push(`Original expression: ${astToLatex(ast)}`);
    const expanded = expandExpression(ast);
    const expandedLatex = stepsAstToLatex(expanded);
    const simplified = overlapSimplify(expanded, { factor: false, combineLikeTerms: true }, steps);
    const simplifiedLatex = astToLatex(simplified);
    if (expandedLatex !== astToLatex(ast)) {
      steps.push(`After distribution/expansion: ${bracketAppend(expandedLatex)}`);
    }
    if (simplifiedLatex !== expandedLatex) {
      steps.push(`After combining like terms: ${bracketAppend(simplifiedLatex)}`);
    }
    if (simplifiedLatex === astToLatex(ast)) {
      steps.push("Expression is already in simplified form");
    }
    return {
      steps,
      value: simplifiedLatex,
      valueType: "symbolic",
      ast: simplified,
      error: null
    };
  } catch (error) {
    steps.push(`Error during distribution: ${error instanceof Error ? error.message : "Unknown error"}`);
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Distribution failed"
    };
  }
}
__name(analyzeDistribution, "analyzeDistribution");
function analyzePolynomial(ast, options) {
  const steps = [];
  try {
    const variable = options.variable || "x";
    const originalLatex = astToLatex(ast);
    steps.push(`Analyzing polynomial: ${originalLatex}`);
    steps.push(`Variable: ${variable}`);
    const expanded = expandExpression(ast);
    const expandedLatex = astToLatex(expanded);
    if (expandedLatex !== originalLatex) {
      steps.push(`Expanded form: ${expandedLatex}`);
    }
    const degreeInfo = analyzePolynomialDegree(expanded, variable);
    if (degreeInfo) {
      steps.push(`Degree: ${degreeInfo.degree}`);
      steps.push(`Leading coefficient: ${degreeInfo.leadingCoeff}`);
      if (degreeInfo.degree === 0) {
        steps.push("This is a constant (degree 0)");
      } else if (degreeInfo.degree === 1) {
        steps.push("This is a linear polynomial");
      } else if (degreeInfo.degree === 2) {
        steps.push("This is a quadratic polynomial");
      } else if (degreeInfo.degree === 3) {
        steps.push("This is a cubic polynomial");
      } else {
        steps.push(`This is a polynomial of degree ${degreeInfo.degree}`);
      }
    } else {
      steps.push("Could not determine polynomial structure");
    }
    return {
      steps,
      value: expandedLatex,
      valueType: "symbolic",
      ast: expanded,
      error: null
    };
  } catch (error) {
    return {
      steps,
      value: null,
      valueType: "symbolic",
      ast: null,
      error: error instanceof Error ? error.message : "Polynomial analysis failed"
    };
  }
}
__name(analyzePolynomial, "analyzePolynomial");
function analyzePolynomialDegree(ast, variable) {
  let maxDegree = 0;
  const leadingCoeff = 1;
  function findDegree(node) {
    switch (node.type) {
      case "NumberLiteral":
        return 0;
      case "Identifier":
        return node.name === variable ? 1 : 0;
      case "BinaryExpression":
        switch (node.operator) {
          case "+":
          case "-":
            return Math.max(findDegree(node.left), findDegree(node.right));
          case "*":
            return findDegree(node.left) + findDegree(node.right);
          case "^":
            if (node.left.type === "Identifier" && node.left.name === variable && node.right.type === "NumberLiteral") {
              return node.right.value;
            }
            return findDegree(node.left);
          default:
            return 0;
        }
      default:
        return 0;
    }
  }
  __name(findDegree, "findDegree");
  maxDegree = findDegree(ast);
  return { degree: maxDegree, leadingCoeff };
}
__name(analyzePolynomialDegree, "analyzePolynomialDegree");
function analyze(ast, options) {
  if (!ast) {
    return {
      steps: [],
      value: null,
      valueType: "exact",
      ast: null,
      error: "Invalid AST: null"
    };
  }
  try {
    switch (options.task) {
      case "evaluate":
        return analyzeEvaluate(ast, options);
      case "approx":
        return analyzeApprox(ast, options);
      case "differentiate":
        return analyzeDifferentiate(ast, options);
      case "integrate":
        return analyzeIntegrate(ast, options);
      case "solve":
        return analyzeSolve(ast, options);
      case "factor":
        return analyzeFactorization(ast);
      case "distribute":
        return analyzeDistribution(ast);
      case "analyze-polynomial":
        return analyzePolynomial(ast, options);
      case "min":
      case "max":
        return {
          steps: [],
          value: null,
          valueType: "approximate",
          ast: null,
          error: "Optimization not yet implemented"
        };
      case "functional":
        return {
          steps: [],
          value: null,
          valueType: "symbolic",
          ast: null,
          error: "Functional analysis not yet implemented"
        };
      default:
        return {
          steps: [],
          value: null,
          valueType: "exact",
          ast: null,
          error: `Unsupported task: ${options.task}`
        };
    }
  } catch (error) {
    return {
      steps: [],
      value: null,
      valueType: "exact",
      ast: null,
      error: error instanceof Error ? error.message : "Analysis error"
    };
  }
}
__name(analyze, "analyze");

// extensions/calc/index.tsx
const React = window.__PYXIS_REACT__; const {useState, useEffect, useRef} = React;
const ReactMarkdown = window.__PYXIS_MARKDOWN__.ReactMarkdown || window.__PYXIS_MARKDOWN__;
const rehypeKatex = window.__PYXIS_MARKDOWN__.rehypeKatex || window.__PYXIS_MARKDOWN__;
const rehypeRaw = window.__PYXIS_MARKDOWN__.rehypeRaw || window.__PYXIS_MARKDOWN__;
const remarkGfm = window.__PYXIS_MARKDOWN__.remarkGfm || window.__PYXIS_MARKDOWN__;
const remarkMath = window.__PYXIS_MARKDOWN__.remarkMath || window.__PYXIS_MARKDOWN__;
var LATEX_SYMBOLS = [
  { label: "x\xB2", latex: "x^{2}" },
  { label: "\u221A", latex: "\\sqrt{}" },
  { label: "\u222B", latex: "\\int" },
  { label: "\u2211", latex: "\\sum" },
  { label: "\u03B1", latex: "\\alpha" },
  { label: "\u03B2", latex: "\\beta" },
  { label: "\xB1", latex: "\\pm" },
  { label: "\u2260", latex: "\\neq" },
  { label: "\u2264", latex: "\\leq" },
  { label: "\u2265", latex: "\\geq" },
  { label: "\u221E", latex: "\\infty" },
  { label: "\u03C0", latex: "\\pi" }
];
var PRESETS = [
  { label: "\u4E8C\u6B21\u65B9\u7A0B\u5F0F", latex: "ax^{2} + bx + c" },
  { label: "\u56E0\u6570\u5206\u89E3\u4F8B", latex: "x^{2} + 5x + 6" },
  { label: "\u5C55\u958B\u4F8B", latex: "(x+2)(x+3)" },
  { label: "\u4E09\u6B21\u5F0F", latex: "x^{3} + 2x^{2} - 3x" }
];
function createCalcPanel(context) {
  return /* @__PURE__ */ __name(function CalcPanel({ extensionId, panelId, isActive }) {
    const [input, setInput] = useState("x^{2} + 5x + 6");
    const [task, setTask] = useState("factor");
    const [result, setResult] = useState("");
    const [stepsMarkdown, setStepsMarkdown] = useState("");
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showSymbols, setShowSymbols] = useState(false);
    const textareaRef = useRef(null);
    useEffect(() => {
      const stored = localStorage.getItem("latexium-history");
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
    }, []);
    const saveHistory = /* @__PURE__ */ __name((item) => {
      const newHistory = [item, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem("latexium-history", JSON.stringify(newHistory));
    }, "saveHistory");
    const evaluateInput = /* @__PURE__ */ __name(async () => {
      setError(null);
      setResult("");
      setStepsMarkdown("");
      try {
        const parseResult = await parseLatex(input);
        const analyzeResult = await analyze(parseResult.ast, { task });
        const value = String(analyzeResult.value || "");
        setResult(value);
        setStepsMarkdown(JSON.stringify(analyzeResult.steps));
        saveHistory({
          id: Date.now().toString(),
          input,
          task,
          result: value,
          steps: JSON.stringify(analyzeResult.steps),
          timestamp: Date.now()
        });
      } catch (err) {
        setError(err?.message ?? String(err));
      }
    }, "evaluateInput");
    const insertSymbol = /* @__PURE__ */ __name((latex) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = input.slice(0, start) + latex + input.slice(end);
      setInput(newValue);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + latex.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    }, "insertSymbol");
    const insertPreset = /* @__PURE__ */ __name((latex) => {
      setInput(latex);
      textareaRef.current?.focus();
    }, "insertPreset");
    const restoreFromHistory = /* @__PURE__ */ __name((item) => {
      setInput(item.input);
      setTask(item.task);
      setResult(item.result);
      setStepsMarkdown(item.steps);
      setShowHistory(false);
    }, "restoreFromHistory");
    useEffect(() => {
      if (stepsMarkdown) {
        console.log("CalcPanel stepsMarkdown changed:", stepsMarkdown);
      }
    }, [stepsMarkdown]);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          padding: "12px",
          background: "#1e1e1e",
          color: "#d4d4d4",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: "bold", fontSize: "16px" } }, "LaTeX Calculator"), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setShowHistory(!showHistory),
          style: {
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#333",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer"
          }
        },
        showHistory ? "\u5165\u529B\u306B\u623B\u308B" : "\u5C65\u6B74"
      )),
      showHistory ? /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto" } }, history.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#888", padding: "20px", textAlign: "center" } }, "\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093") : history.map((item) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: item.id,
          onClick: () => restoreFromHistory(item),
          style: {
            padding: "12px",
            marginBottom: "8px",
            background: "#252526",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #333"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#888", marginBottom: "4px" } }, new Date(item.timestamp).toLocaleString(), " - ", item.task),
        /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "monospace", fontSize: "14px" } }, item.input),
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#4ade80", marginTop: "4px" } }, "\u2192 ", item.result)
      ))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, ["evaluate", "distribute", "factor"].map((t) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: t,
          onClick: () => setTask(t),
          style: {
            flex: 1,
            minWidth: "80px",
            padding: "10px",
            borderRadius: "6px",
            background: task === t ? "#0e639c" : "#333",
            color: "#fff",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: task === t ? "bold" : "normal"
          }
        },
        t === "evaluate" ? "\u8A08\u7B97" : t === "distribute" ? "\u5C55\u958B" : "\u56E0\u6570\u5206\u89E3"
      ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#888", marginBottom: "6px" } }, "\u30D7\u30EA\u30BB\u30C3\u30C8"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } }, PRESETS.map((preset) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: preset.label,
          onClick: () => insertPreset(preset.latex),
          style: {
            padding: "6px 10px",
            borderRadius: "4px",
            background: "#252526",
            color: "#9cdcfe",
            border: "1px solid #333",
            fontSize: "12px",
            cursor: "pointer"
          }
        },
        preset.label
      )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setShowSymbols(!showSymbols),
          style: {
            padding: "6px 10px",
            borderRadius: "4px",
            background: "#252526",
            color: "#d4d4d4",
            border: "1px solid #333",
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: "6px"
          }
        },
        showSymbols ? "\u8A18\u53F7\u3092\u96A0\u3059" : "\u8A18\u53F7\u3092\u8868\u793A"
      ), showSymbols && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" } }, LATEX_SYMBOLS.map((sym) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: sym.label,
          onClick: () => insertSymbol(sym.latex),
          style: {
            padding: "12px",
            borderRadius: "6px",
            background: "#252526",
            color: "#d4d4d4",
            border: "1px solid #333",
            fontSize: "16px",
            cursor: "pointer",
            minHeight: "48px"
          }
        },
        sym.label
      )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#888", marginBottom: "6px" } }, "LaTeX\u5165\u529B"), /* @__PURE__ */ React.createElement(
        "textarea",
        {
          ref: textareaRef,
          value: input,
          onChange: (e) => setInput(e.target.value),
          rows: 4,
          style: {
            width: "100%",
            background: "#252526",
            color: "#d4d4d4",
            border: "1px solid #333",
            padding: "12px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            resize: "vertical"
          },
          placeholder: "\u4F8B: x^{2} + 5x + 6"
        }
      )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: evaluateInput,
          style: {
            flex: 1,
            padding: "14px",
            borderRadius: "6px",
            background: "#0e639c",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }
        },
        "\u5B9F\u884C"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setInput("");
            setResult("");
            setStepsMarkdown("");
            setError(null);
          },
          style: {
            padding: "14px",
            borderRadius: "6px",
            background: "#333",
            color: "#fff",
            border: "none",
            fontSize: "14px",
            cursor: "pointer"
          }
        },
        "\u30AF\u30EA\u30A2"
      )), error && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            padding: "12px",
            background: "#3d1f1f",
            border: "1px solid #f48771",
            borderRadius: "6px",
            color: "#f48771",
            fontSize: "14px"
          }
        },
        error
      ), result && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#9cdcfe", marginBottom: "6px" } }, "\u7D50\u679C\uFF08LaTeX\uFF09"), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            padding: "12px",
            background: "#252526",
            border: "1px solid #333",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            wordBreak: "break-all",
            userSelect: "all"
          }
        },
        /* @__PURE__ */ React.createElement(
          ReactMarkdown,
          {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex]
          },
          `$$${result}$$`
        )
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            navigator.clipboard.writeText(result);
          },
          style: {
            marginTop: "6px",
            padding: "6px 10px",
            borderRadius: "4px",
            background: "#0e639c",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer"
          }
        },
        "\u30B3\u30D4\u30FC"
      )), stepsMarkdown && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#9cdcfe", marginBottom: "6px" } }, "\u8A08\u7B97\u30B9\u30C6\u30C3\u30D7\uFF08Markdown\uFF09"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            padding: "12px",
            background: "#252526",
            border: "1px solid #333",
            borderRadius: "6px",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "300px",
            overflow: "auto"
          }
        },
        /* @__PURE__ */ React.createElement(
          ReactMarkdown,
          {
            key: String(stepsMarkdown?.length ?? 0),
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeRaw]
          },
          stepsMarkdown
        )
      ))))
    );
  }, "CalcPanel");
}
__name(createCalcPanel, "createCalcPanel");
async function activate(context) {
  context.logger.info("LaTeX Calculator activating...");
  const Panel = createCalcPanel(context);
  context.sidebar.createPanel({
    id: "calc-panel",
    title: "LaTeX Calc",
    icon: "Calculator",
    component: Panel
  });
  context.commands.registerCommand("latexium", async (args, ctx) => {
    if (args.length === 0) {
      return `Usage: latexium "<expression>" [--task=evaluate|distribute|factor]

Examples:
  latexium "x^{2} + 5x + 6" --task=factor
  latexium "(x+2)(x+3)" --task=distribute
  latexium "2^3 + 1" --task=evaluate

Options:
  --task=<task>  Task to perform (default: evaluate)`;
    }
    let task = "evaluate";
    const taskArg = args.find((a) => a.startsWith("--task="));
    const argsForExpr = args.filter((a) => !a.startsWith("--task="));
    let expression = argsForExpr.join(" ").trim();
    if (expression.startsWith('"') && expression.endsWith('"') || expression.startsWith("'") && expression.endsWith("'")) {
      expression = expression.slice(1, -1).trim();
    }
    if (taskArg) {
      const t = taskArg.split("=")[1];
      if (["evaluate", "distribute", "factor"].includes(t)) task = t;
    }
    try {
      const parseResult = await parseLatex(expression);
      const analyzeResult = await analyze(parseResult.ast, { task });
      const value = String(analyzeResult.value || "");
      const resultLabel = task === "factor" ? "Factor Result" : "Result";
      const stepsJson = JSON.stringify(analyzeResult.steps || [], null, 2);
      const output = `${resultLabel}: ${value}

Steps (JSON):
${stepsJson}`;
      return output;
    } catch (err) {
      return `Error: ${err?.message ?? String(err)}`;
    }
  });
  context.logger.info("LaTeX Calculator activated");
  return {};
}
__name(activate, "activate");
async function deactivate() {
  console.log("LaTeX Calculator deactivated");
}
__name(deactivate, "deactivate");
export {
  activate,
  deactivate
};
