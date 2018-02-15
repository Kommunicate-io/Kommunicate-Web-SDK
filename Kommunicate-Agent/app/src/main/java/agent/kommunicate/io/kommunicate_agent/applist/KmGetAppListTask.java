package agent.kommunicate.io.kommunicate_agent.applist;

import android.content.Context;
import android.os.AsyncTask;
import android.text.TextUtils;
import android.util.Patterns;

import java.lang.ref.WeakReference;
import java.util.Map;

import io.kommunicate.services.KmUserService;


/**
 * Created by ashish on 09/02/18.
 */

public class KmGetAppListTask extends AsyncTask<Void, Void, Map<String, String>> {

    private WeakReference<Context> context;
    private AppListHandler handler;
    private String userId;

    public KmGetAppListTask(Context context, AppListHandler handler, String userId) {
        this.context = new WeakReference<Context>(context);
        this.handler = handler;
        this.userId = userId;
    }

    @Override
    protected Map<String, String> doInBackground(Void... voids) {
        boolean isEmail = !TextUtils.isEmpty(userId) && Patterns.EMAIL_ADDRESS.matcher(userId).matches();
        return new KmUserService(context.get()).getApplicationList(userId, isEmail);
    }

    @Override
    protected void onPostExecute(Map<String, String> s) {
        super.onPostExecute(s);
        if (s != null && !s.isEmpty()) {
            if (handler != null) {
                handler.onSuccess(context.get(), s);
            }
        } else {
            if (handler != null) {
                String message = "Some error occured";
                if (s != null && s.isEmpty()) {
                    message = "No Applications found for user, Please register on kommunicate.io to get one...";
                }
                handler.onFailure(context.get(), message);
            }
        }
    }

    public interface AppListHandler {
        void onSuccess(Context context, Map<String, String> s);

        void onFailure(Context context, String error);
    }
}
