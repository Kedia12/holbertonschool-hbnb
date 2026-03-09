class ReviewRepository:
    def __init__(self):
        self.items = {}
        self.next_id = 1

    def add(self, review):
        review.id = self.next_id
        self.items[self.next_id] = review
        self.next_id += 1
        return review

    def get(self, review_id):
        return self.items.get(int(review_id))

    def get_all(self):
        return list(self.items.values())

    def update(self, review_id, data):
        review = self.get(review_id)
        if not review:
            return None
        for key, value in data.items():
            setattr(review, key, value)
        return review

    def delete(self, review_id):
        return self.items.pop(int(review_id), None)
