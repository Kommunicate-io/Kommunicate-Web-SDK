#!/bin/bash
rm -rf models/
python -m rasa_nlu.train -c faq_config.json --fixed_model_name faq_model_v1
python -m rasa_core.train -s faq_stories.md -d faq_domain.yml -o models/dialogue --epochs 300
exit 0
