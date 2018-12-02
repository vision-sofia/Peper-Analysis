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
    def __init__(self, text, num_topics=3, passes=400, iterations=800, verbose=False):
        self.text = text
        self.num_topics = num_topics
        self.passes = passes
        self.iterations = iterations
        self.verbose = verbose

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
        pass

    def get_topics(self):
        ldamodel = LDA(self.doc_term_matrix, num_topics=self.num_topics, id2word=self.id2word,
            passes=self.passes, iterations=self.iterations)

        if self.verbose:
            print("Modelling...")
        return [
            [self.id2word[pair[0]] for pair in ldamodel.get_topic_terms(i, topn=3)]
            for i in range(self.num_topics)
        ]
