package agent.kommunicate.io.kommunicate_agent.applist;

import android.app.ProgressDialog;
import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.applozic.mobicomkit.api.account.register.RegistrationResponse;
import com.applozic.mobicommons.commons.core.utils.Utils;

import java.util.Map;

import agent.kommunicate.io.kommunicate_agent.MainActivity;
import agent.kommunicate.io.kommunicate_agent.R;
import io.kommunicate.Kommunicate;
import io.kommunicate.async.KmUserLoginTask;
import io.kommunicate.async.KmUserPasswordResetTask;
import io.kommunicate.async.KmUserPasswordResetTask.KmPassResetHandler;
import io.kommunicate.callbacks.KMLoginHandler;
import io.kommunicate.users.KMUser;

public class KmForgotPasswordActivity extends AppCompatActivity {

    private LinearLayout forgotPasswordLayout;
    private LinearLayout resetPassworLayout;
    private EditText registeredEmailIdEt;
    private AppCompatButton sendInstructionsBt;
    private AppCompatButton backToLoginBt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_km_forgot_password);

        forgotPasswordLayout = findViewById(R.id.forgotPasswordLayout);
        resetPassworLayout = findViewById(R.id.resetConfirmationLayout);
        registeredEmailIdEt = findViewById(R.id.registered_email_id);
        sendInstructionsBt = findViewById(R.id.sendInstructionButton);
        backToLoginBt = findViewById(R.id.backToLoginButton);

        sendInstructionsBt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (!TextUtils.isEmpty(registeredEmailIdEt.getText().toString())) {

                    final ProgressDialog dialog = new ProgressDialog(KmForgotPasswordActivity.this);
                    dialog.setMessage("Please Wait...Patience leads to a  better life...");
                    dialog.setCancelable(false);
                    dialog.show();

                    KmGetAppListTask.AppListHandler handler = new KmGetAppListTask.AppListHandler() {
                        @Override
                        public void onSuccess(Context context, Map<String, String> s) {
                            if (!s.isEmpty()) {
                                String appKey = s.keySet().toArray()[0].toString();

                                KmPassResetHandler handler = new KmPassResetHandler() {

                                    @Override
                                    public void onSuccess(Context context, String response) {
                                        dialog.dismiss();
                                        forgotPasswordLayout.setVisibility(View.GONE);
                                        resetPassworLayout.setVisibility(View.VISIBLE);
                                    }

                                    @Override
                                    public void onFailure(Context context, String error) {
                                        dialog.dismiss();
                                    }
                                };

                                new KmUserPasswordResetTask(KmForgotPasswordActivity.this, registeredEmailIdEt.getText().toString(), appKey, handler).execute();
                            }
                        }

                        @Override
                        public void onFailure(Context context, String error) {
                            dialog.dismiss();
                            Toast.makeText(KmForgotPasswordActivity.this, error, Toast.LENGTH_LONG).show();
                        }
                    };

                    new KmGetAppListTask(KmForgotPasswordActivity.this, handler, registeredEmailIdEt.getText().toString()).execute();
                } else {
                    Toast.makeText(KmForgotPasswordActivity.this, "Email field cannot be blank...", Toast.LENGTH_SHORT).show();
                }
            }
        });

        backToLoginBt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }
}
