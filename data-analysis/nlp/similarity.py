from nltk.corpus import wordnet as wn
from gensim.models import Word2Vec

__all__ = [
    "noun_syncheck",
    "get_most_similar_to",
]


def noun_syncheck(wordA, wordB):
    syn_setA, syn_setB = wn.synsets(wordA), wn.synsets(wordB)
    best_score = 0

    for x in syn_setA:
        for y in syn_setB:
            score = x.wup_similarity(y) # Wu-Palmer Similarity
            if score == None:
                score = -1
            best_score = score if best_score < score else best_score

    return best_score


def get_most_similar_to(doc, corpus):
    return Word2Vec(corpus).most_similar(doc, topn=5)
