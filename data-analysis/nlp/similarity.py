import json
import numpy as np

from math import sqrt
from collections import Counter

import nltk
from nltk.corpus import wordnet as wn

__all__ = [
    "noun_syncheck",

    "word2vec",
    "distance",
    "calc_similarity",
]

words = {}
i = 0
with open('../data/glove_review_vocab.txt', 'r') as f:
    for line in f:
        splitted  = line.split()
        word = splitted[0]
        try:
            vec = np.array(list(map(float, splitted[1:])))
            words[word] = vec            
        except:
            pass

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

def distance(w1, w2):
    v1 = words[w1]
    v2 = words[w2]
    return np.linalg.norm(np.subtract(v1, v2))

def calc_similarity(wordA, wordB):
    return distance(word2vec(wordA), word2vec(wordB))
