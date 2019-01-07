
/** post https://metabase.applozic.com/api/card/103/query (get query result)*/
exports.cardObj = {
    "archived": false,
    "labels": [],
    "table_id": null,
    "result_metadata": null,
    "creator": {
        "email": "anand@applozic.com",
        "first_name": "Anand",
        "last_login": "2019-01-02T08:01:22.913Z",
        "is_qbnewb": false,
        "is_superuser": false,
        "id": 15,
        "last_name": "Kumar",
        "date_joined": "2018-03-21T11:41:14.736Z",
        "common_name": "Anand Kumar"
    },
    "can_write": true,
    "database_id": 2,
    "enable_embedding": false,
    "collection_id": null,
    "query_type": "native",
    "dashboard_count": 0,
    "creator_id": 15,
    "updated_at": "2019-01-02T08:07:17.842Z",
    "made_public_by_id": null,
    "embedding_params": null,
    "cache_ttl": null,
    "dataset_query": {
        "database": 2,
        "type": "native",
        "native": {
            "query": "select u.name, u.email as customerEmail, ga.group_key as ConversationId, \n CASE ga.status\n   when 0 then 'Open'\n   when 2 then 'closed'\n   when 6  then 'Not Responded'\n   when 3 then 'Spam'\n   when 4 then 'Duplicate'\nEND as state, ga.agent_id as Agent, ga.created_at as StartTime, ga.closed_at as ClosedTime from group_analytics ga \ninner join channel_user_mapper ch on ga.group_key=ch.group_key\n inner join user u on ch.user_key=u.id \n where  \n ga.application_key ='16de1dc9-a98a-4d52-a88b-de4e56cd3fe4' \n and  ga.created_at between now() and :end\n and ch.role=3 and ga.status in (0,2,3,4,6);",
            "collection": "app_module",
            "template_tags": {}
        }
    },
    "display": "table",
    "visualization_settings": {},
    "collection": null,
    "created_at": "2019-01-02T08:07:17.842Z",
    "public_uuid": null,
    "name": "Group Analytics report template",
    "description": "This card is using into kommunicate for getting group analytics between date.",
    "metadata_checksum": null
}