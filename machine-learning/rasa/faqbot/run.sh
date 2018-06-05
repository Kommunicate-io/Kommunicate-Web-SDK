#!/bin/bash
rm -rf models/
python -m rasa_nlu.train --config faq_config.yml --data faq_data.json --path models/nlu --fixed_model_name faq_model_v1
python -m rasa_core.train -d faq_domain.yml -s faq_stories.md -o models/current/dialogue --epochs 300
exit 0
