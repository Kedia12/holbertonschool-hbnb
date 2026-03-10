from app.models.user import User

class UserRepository:
    def __init__(self):
        self.users = {}
        self.next_id = 1

    def add(self, user: User):
        if not hasattr(user, "id") or user.id is None:
            import uuid
            user.id = str(uuid.uuid4())
        self.users[user.id] = user
        return user

    def get(self, user_id):
        return self.users.get(str(user_id))

    def get_by_attribute(self, attr_name: str, value):
        for u in self.users.values():
            if getattr(u, attr_name, None) == value:
                return u
        return None

    def get_all(self):
        return list(self.users.values())

    def update(self, user_id, data: dict):
        user = self.get(user_id)
        if not user:
            return None
        for k, v in data.items():
            setattr(user, k, v)
        return user
