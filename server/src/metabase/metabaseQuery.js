exports.getGroupAnalyticsQuery = params => {
    let query = `select u.name, u.email as customerEmail, ga.group_key as ConversationId,CASE ga.status
                  when 0 then 'Open'
                  when 2 then 'closed'
                  when 6  then 'Not Responded'
                  when 3 then 'Spam'
                  when 4 then 'Duplicate'
                  END as state, 
                  ga.agent_id as Agent, ga.created_at as StartTime, ga.closed_at as ClosedTime from group_analytics ga 
                  inner join channel_user_mapper ch on ga.group_key=ch.group_key
                  inner join user u on ch.user_key=u.id 
                  where  
                  ga.application_key = '${params.appKey}'
                  and ga.created_at < '${params.startDate}'
                  and ga.created_at > '${params.endDate}'
                  and ch.role=3
                  and ga.status in (0,2,3,4,6);`;
   return query;
};
