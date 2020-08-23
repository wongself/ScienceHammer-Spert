from configparser import ConfigParser
import datetime
import nltk
from pathlib import Path

from .model.logger import Logger
from .model.trainer import SpanTrainer


cfg = None
trainer = None
logger = None


def entity_query(source):
    jsentences = nltk.sent_tokenize(source)
    jtokens = [nltk.word_tokenize(jsentence) for jsentence in jsentences]
    print(jtokens)

    # Parse document
    jdocument = []
    for jtoken in jtokens:
        doc = {"tokens": jtoken, "entities": []}
        jdocument.append(doc)
    logger.info('Document Parsed:\n%s' % jdocument)

    # Predict
    start_time = datetime.datetime.now()
    jpredictions = trainer.eval(jdoc=jdocument)
    end_time = datetime.datetime.now()
    logger.info('Predicting time : %d' % (end_time - start_time).seconds)

    return jpredictions


def inst_entity():
    global cfg
    global trainer
    global logger
    cfg = ConfigParser()
    configuration_path = Path(__file__).resolve(strict=True).parent / 'configs' / 'entity_eval.conf'
    cfg.read(configuration_path)
    logger = Logger(cfg)
    logger.info('Configuration Parsed: %s' % cfg.sections())
    trainer = SpanTrainer(cfg, logger)
