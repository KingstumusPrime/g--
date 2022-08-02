try:
    file = open("test.gpp")
    doc_text = file.read()
except FileNotFoundError:
    print("error file not found")
    quit()



TT_PLUS = "PLUS"
TT_MINUS = "MINUS"
TT_MUL = "MUL"
TT_DIV = "DIV"
TT_LPAREN = "LPAREN"
TT_RPAREN = "RPAREN"
TT_INT = "INT"
TT_FLOAT = "FLOAT"
NUMBERS = "0123456789"

class Error:
    def __init__(self,errorName, details) -> None:
        self.errorName = errorName
        self.details = details
    def as_string(self):
        result = f"{self.errorName}: {self.details}"
        result += f" File <main>"
        # result += "\n\n" + string_with_arrows(self.posStart.ftxt, self.posStart, self.posEnd)
        return result
        
class IllegalCharError(Error):
    def __init__(self, details) -> None:
        super().__init__("Illegal Character Error", details)
        
class Token:
    def __init__(self, type_, value=None) -> None:
        self.type = type_
        self.value = value

    def __repr__(self) -> str:
        if self.value:
            return f"{self.type}:{self.value}"
        return f"{self.type}"
class Lexer:
    def __init__(self, text) -> None:
        self.text = text
        self.currentChar = None
        self.pos = -1
        self.advance()

    def advance(self):
        self.pos = self.pos + 1
        self.currentChar = self.text[self.pos] if self.pos < len(self.text) else None
    def make_tokens(self):
        tokens = []
        while self.currentChar != None:
            if self.currentChar == "+":
                tokens.append(Token(TT_PLUS))
                self.advance()
            elif self.currentChar == "-":
                tokens.append(Token(TT_MINUS))
                self.advance()
            elif self.currentChar == "*":
                tokens.append(Token(TT_MUL))
                self.advance()
            elif self.currentChar == "/":
                tokens.append(Token(TT_DIV))
                self.advance()
            elif self.currentChar == "(":
                tokens.append(Token(TT_LPAREN))
                self.advance()
            elif self.currentChar == ")":
                tokens.append(Token(TT_RPAREN))
                self.advance()
            elif self.currentChar in NUMBERS:
                tokens.append(self.make_number())
            elif self.currentChar in " \n":
                self.advance()
            else:
                return None, IllegalCharError(f'Unexpected character "{self.currentChar}"')
        return tokens, None

    
    def make_number(self):
        num_str = ""
        dot_count = 0
        while self.currentChar is not None and self.currentChar in NUMBERS + ".":
            if self.currentChar == ".":
                if dot_count == 1:
                    print("error")
                    break
                else:
                    dot_count += 1
                    num_str +=  "."
            else:
                num_str += self.currentChar
            self.advance()

        if dot_count > 0:
            return Token(TT_FLOAT, float(num_str))
        else:
            return Token(TT_INT, int(num_str))


lexer = Lexer(doc_text)
tokens, error = lexer.make_tokens()
if error:
    print(error.as_string())
else:
    print(tokens)
          


