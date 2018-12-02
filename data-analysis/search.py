import sys
import json
from statistics import mean

import pandas as pd
from nlp.similarity import calc_similarity
from nlp.topic_modelling import TopicModelling

from pprint import pprint

__all__ = [
    "analyse_by",
]


sofia_airbnb = pd.read_csv("./data/sofia_airbnb_reviews.csv")

def analyse_by(user_input, loc):
    scores = []
    reviews = json.loads(loc[2])

    for review in reviews:
        main_topic = TopicModelling(review).get_topics()[0][0]
        scores.append(
            calc_similarity(user_input, main_topic)
        )
        break

    return scores[0]

if __name__ == "__main__":
    user_input = sys.argv[1:]
    text = ' '.join(user_input)

    json_objects = []

    for loc in sofia_airbnb.values:
        json_objects.append(
            {
                "lat": loc[0],
                "long": loc[1],
                "score": analyse_by(text, loc),
            }
        )

    pprint(json_objects)
    json.dump(json_objects, open("./parsed_data/res.json", mode="w"))
