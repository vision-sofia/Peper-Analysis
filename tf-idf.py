from sklearn.feature_extraction.text import TfidfVectorizer

with open('all_reviews.csv') as f:
    for line in f:
        [lat, lng, reviews] = line.split(',')
        corpus = json.loads(reviews)
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(corpus)
        print(vectorizer.get_feature_names())

        print(X.shape)
