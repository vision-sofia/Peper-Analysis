import gensim
import nltk
from gensim import corpora

from .preprocessing import clean

__all__ = [
    "LDA",
    "TopicModelling",
]


LDA = gensim.models.ldamodel.LdaModel

class TopicModelling:
    def __init__(self, text, passes=400, iterations=800):
        self.text = text
        self.passes = passes
        self.iterations = iterations

        self.corpus = None
        self.id2word = None
        self.doc_term_matrix = None

        self.set_corpus()
        self.set_id2word_mapping()
        self.set_doc_term_matrix()

    def set_corpus(self):
        corpus = nltk.tokenize.sent_tokenize(self.text)
        self.corpus = [clean(doc).split() for doc in corpus]

    def set_id2word_mapping(self):
        self.id2word = corpora.Dictionary(self.corpus)

    def set_doc_term_matrix(self):
        self.doc_term_matrix = [self.id2word.doc2bow(doc) for doc in self.corpus]

    def extract_topics(self, x):
        x = x[0][1].split('\"')
        return x[1]

    def get_topics(self):
        ldamodel = LDA(self.doc_term_matrix, num_topics=3, id2word=self.id2word, passes=self.passes, iterations=self.iterations)
        print("Modelling...")
        return self.extract_topics(ldamodel.print_topics(num_topics=3, num_words=3))
