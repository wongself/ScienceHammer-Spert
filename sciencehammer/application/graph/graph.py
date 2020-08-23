from .graph_model import kg


def graph_query(jtokens):
    jpredictions = kg.graph_query(jtokens)
    return jpredictions
