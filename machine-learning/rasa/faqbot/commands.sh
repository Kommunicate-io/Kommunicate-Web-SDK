# Train NLU
python -m rasa_nlu.train --config faq_config.yml --data faq_data.json --path models/nlu --fixed_model_name faq_model_v1

#Train Dialogue
python -m rasa_core.train -d faq_domain.yml -s faq_stories.md -o models/dialogue --epochs 300

#Run Bot Shell
python -m rasa_core.run -d models/dialogue -u models/nlu/default/faq_model_v1

#Run server
python -m rasa_core.server -u models/nlu/default/faq_model_v1/  -d models/dialogue/ -o out.log

#Visualize
python -m rasa_core.visualize -d faq_domain.yml -s faq_stories.md -o graph.png
