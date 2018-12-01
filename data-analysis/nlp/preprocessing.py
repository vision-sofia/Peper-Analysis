import string

from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer

__all__ = [
    "STOP",
    "PUNCTUATION",
    "lemma",
    "clean",
]


STOP = set(stopwords.words("english"))
PUNCTUATION = set(string.punctuation)
lemma = WordNetLemmatizer()

def clean(doc):
    stop_free = ' '.join([i for i in doc.lower().split() if i not in STOP])
    punct_free = ''.join(ch for ch in stop_free if ch not in PUNCTUATION)
    normalized = ' '.join(lemma.lemmatize(word) for word in punct_free.split())
    return normalized
