package agent.kommunicate.io.kommunicate_agent.applist;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.Map;

import agent.kommunicate.io.kommunicate_agent.R;


/**
 * Created by ashish on 09/02/18.
 */

public class AppListAdapter extends RecyclerView.Adapter {

    private Context context;
    private Map<String, String> appMap;

    public AppListAdapter(Context context, Map<String, String> appMap) {
        this.context = context;
        this.appMap = appMap;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        if (inflater == null) {
            return null;
        }
        return new MyViewHolder(inflater.inflate(R.layout.app_list_item_layout, parent, false));
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        MyViewHolder myViewHolder = (MyViewHolder) holder;

        String appKey = appMap.values().toArray()[position].toString();
        String appName = appMap.keySet().toArray()[position].toString();

        if (!TextUtils.isEmpty(appName)) {
            myViewHolder.appName.setVisibility(View.VISIBLE);
            myViewHolder.appName.setText(appName);
        } else {
            myViewHolder.appName.setVisibility(View.GONE);
        }

        if (!TextUtils.isEmpty(appKey)) {
            myViewHolder.appKey.setVisibility(View.VISIBLE);
            myViewHolder.appKey.setText(appKey);
        } else {
            myViewHolder.appKey.setVisibility(View.GONE);
        }

    }

    @Override
    public int getItemCount() {
        return appMap.size();
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        TextView appName;
        TextView appKey;
        RelativeLayout appLayout;

        public MyViewHolder(View itemView) {
            super(itemView);

            appName = itemView.findViewById(R.id.applicationName);
            appKey = itemView.findViewById(R.id.applicationKey);
            appLayout = itemView.findViewById(R.id.applicationListLayout);
        }

    }
}
