from datetime import datetime


class TokenStore:
    def __init__(self):
        self.tokens = {}

    def set(self, access_token, token_info):
        self.tokens[access_token] = token_info

    def get(self, access_token):
        token = self.tokens.get(access_token)
        if not token or token.get("expires_at") < datetime.utcnow():
            return None
        return token

    def delete(self, access_token):
        if access_token in self.tokens:
            del self.tokens[access_token]

    def clear(self):
        self.tokens.clear()


TOKENS = TokenStore()
