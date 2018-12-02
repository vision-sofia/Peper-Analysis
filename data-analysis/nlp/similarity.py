from math import sqrt
from collections import Counter

import nltk
from nltk.corpus import wordnet as wn

__all__ = [
    "noun_syncheck",

    "word2vec",
    "cosdis",
    "calc_similarity",
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


def word2vec(word):
    cw = Counter(word)
    sw = set(cw)
    lw = sqrt(sum(c*c for c in cw.values()))

    return cw, sw, lw

def cosdis(v1, v2):
    common = v1[1].intersection(v2[1])
    return sum(v1[0][ch]*v2[0][ch] for ch in common)/v1[2]/v2[2]

def calc_similarity(wordA, wordB):
    return cosdis(word2vec(wordA), word2vec(wordB))
