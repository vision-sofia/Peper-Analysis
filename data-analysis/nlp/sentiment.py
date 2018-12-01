from textblob import TextBlob

__all__ = [
    "get_sentiment",
]


def get_sentiment(text):
    return TextBlob(text).sentiment.polarity
