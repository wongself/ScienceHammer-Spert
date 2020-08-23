import json
from .config import Args


class KG:
    def __init__(self):
        self.args = Args()
        self.triplets = json.load(open(self.args.triplet_path))
        print("knowledge initialization finished")

    def graph_query(self, inputs):
        res = []
        for triplet in self.triplets:
            if triplet["h"]["name"] == inputs:
                cur_res = dict()
                cur_res["source"] = triplet["h"]["name"]
                cur_res["target"] = triplet["t"]["name"]
                cur_res["rela"] = triplet["rel"]
                cur_res["id"] = 1
                cur_res["type"] = "resolved"
                res.append(cur_res)

        return {'link': res}


kg = KG()
