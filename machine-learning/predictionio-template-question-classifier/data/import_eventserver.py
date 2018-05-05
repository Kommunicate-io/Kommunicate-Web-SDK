"""
Import sample data for classification engine
"""

import predictionio
import argparse

def import_events(client, file):
  f = open(file, 'r')
  count = 0
  print("Importing data...")
  for line in f:
    data = line.rstrip('\r\n').split(",")
    plan = data[0] 
    #Not strictly CSV, after the first comma, no longer delimiting
    text = ",".join(data[1:])
    client.create_event(
      event="$set",
      entity_type="user",
      entity_id=str(count), # use the count num as user ID
      properties= {
        "text" : text,
        "category" : plan,
        "label" : int(plan)
      }
    )
    count += 1
  f.close()
  print("%s events are imported." % count)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(
    description="Import sample data for classification engine")
  parser.add_argument('--access_key', default='invald_access_key')
  parser.add_argument('--url', default="http://localhost:7070")
  parser.add_argument('--file', default="./data/Twitter140sample.txt")

  args = parser.parse_args()
  print(args)

  client = predictionio.EventClient(
    access_key=args.access_key,
    url=args.url,
    threads=5,
    qsize=500)
  import_events(client, args.file)
