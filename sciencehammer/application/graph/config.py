from pathlib import Path


class Args(object):
    def __init__(self):
        self.args = self.__get_args()
        for key in self.args:
            setattr(self, key, self.args[key])

    def __get_args(self):
        args = dict()
        args["triplet_path"] = Path(__file__).resolve(
            strict=True).parent / 'resource' / 'scierc-kg.json'
        return args
