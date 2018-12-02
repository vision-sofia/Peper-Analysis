import sys
import json
from pprint import pprint
from statistics import mean

import pandas as pd
from nlp.search_tags import get_search_tags
from nlp.similarity import calc_similarity
from nlp.topic_modelling import TopicModelling

__all__ = [
    "analyse_by",
]


sofia_airbnb = pd.read_csv("./data/sofia_airbnb_reviews.csv")

def analyse_by(user_input, loc):
    scores = []
    # topics = json.loads(loc["topics"])

    # for topic in topics:
    #     scores.append(
    #         calc_similarity(user_input, topic)
    #     )

    for review in json.loads(loc["reviews"]):
        main_topic = ' '.join(TopicModelling(review, passes=10, iterations=20).get_topics()[0])
        scores.append(
            calc_similarity(user_input, main_topic)
        )
        break

    return mean(scores)

if __name__ == "__main__":
    user_input = sys.argv[1:]
    text = ' '.join(user_input)
    tags = get_search_tags(text, verbose=False)
    # print("Search Tags:", tags)

    json_objects = []

    for index, loc in sofia_airbnb.iterrows():
        json_objects.append(
            {
                "lat": loc["lat"],
                "long": loc["long"],
                "weight": analyse_by(' '.join(tags), loc),
            }
        )

    pprint(json_objects)
    json.dump(json_objects, open("./parsed_data/res.json", mode="w"))
