import spacy
nlp = spacy.load("en_core_web_sm")

__all__ = [
    "get_named_entities",
]


def get_named_entities(a):
    return [(x.text, x.label_) for x in nlp(a).ents]
