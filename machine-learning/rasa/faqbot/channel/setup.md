
### Run the server
   1. python `channel/input_channel.py`  (this will run a server in port 5001 )
   2. In different tab, Curl the server         
                ``` curl -X POST \
                http://localhost:5001/webhook/ \
                -H 'cache-control: no-cache' \
                -H 'content-type: application/json' \
                -H 'postman-token: 80c9f9cb-77dd-b1ba-d0bd-ab8356044baf' \
                -d '{
                  "applicationKey": "kommunicate-support",
                  "authorization": "Basic cmFzYS10ZXN0OnJhc2EtdGVzdA==",
                  "groupId": "245485",
                  "botId": "rasa-test",
                  "message": "messages are not getting delivered"}'
                  ```              
   3. Check for output in `channel/input_channel.py ` tab console
