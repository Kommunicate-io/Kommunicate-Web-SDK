package agent.kommunicate.io.kommunicate_agent.applist;

import android.app.ProgressDialog;
import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;

import java.util.Map;

import agent.kommunicate.io.kommunicate_agent.R;
import io.kommunicate.async.GetUserListAsyncTask;

public class AppListActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    String userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_app_list);

        recyclerView = findViewById(R.id.appListRecycler);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(linearLayoutManager);

        if (getIntent() != null) {
            userId = getIntent().getStringExtra("kmUserId");
        }

        final ProgressDialog dialog = new ProgressDialog(this);
        dialog.setCancelable(false);
        dialog.setMessage("Please wait.. Loading applications...");
        dialog.show();

        KmGetAppListTask.AppListHandler handler = new KmGetAppListTask.AppListHandler() {
            @Override
            public void onSuccess(Context context, Map<String, String> s) {
                dialog.dismiss();
                AppListAdapter adapter = new AppListAdapter(context, s);
                recyclerView.setAdapter(adapter);
            }

            @Override
            public void onFailure(Context context, String error) {
                dialog.dismiss();
            }
        };

        new KmGetAppListTask(this, handler, userId).execute();
    }
}
