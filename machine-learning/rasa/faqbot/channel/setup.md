
### Run the server 
   1. python `channel/input_channel.py`  (this will run a server in port 5001 )
   2.  In different tab, Curl the server         
                ``` curl -X GET 
                'http://localhost:5001/webhook/?message=What%20is%20MAU?' ```
   3. Check for output in `channel/input_channel.py ` tab console