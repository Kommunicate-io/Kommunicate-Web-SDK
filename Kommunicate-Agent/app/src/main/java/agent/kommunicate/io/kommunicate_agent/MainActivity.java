package agent.kommunicate.io.kommunicate_agent;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.text.TextUtils;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.applozic.mobicomkit.api.account.register.RegistrationResponse;
import com.applozic.mobicommons.commons.core.utils.Utils;

import java.util.Map;

import agent.kommunicate.io.kommunicate_agent.applist.KmForgotPasswordActivity;
import agent.kommunicate.io.kommunicate_agent.applist.KmGetAppListTask;
import io.kommunicate.Kommunicate;
import io.kommunicate.async.KmUserLoginTask;
import io.kommunicate.callbacks.KMLoginHandler;
import io.kommunicate.callbacks.KMLogoutHandler;
import io.kommunicate.services.KmUserClientService;
import io.kommunicate.users.KMUser;

public class MainActivity extends AppCompatActivity {

    TextView emailIdTv;
    TextView passwordTv;
    TextView forgotPasswordTv;
    TextView showHideTv;
    AppCompatButton loginBt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        emailIdTv = findViewById(R.id.userId_editText);
        passwordTv = findViewById(R.id.password_editText);
        forgotPasswordTv = findViewById(R.id.forgotPassword);
        showHideTv = findViewById(R.id.showPassword);
        loginBt = findViewById(R.id.btn_login);

        forgotPasswordTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, KmForgotPasswordActivity.class);
                startActivity(intent);
            }
        });

        showHideTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if ("Show".equals(showHideTv.getText().toString())) {
                    passwordTv.setTransformationMethod(null);
                    showHideTv.setText("Hide");
                } else if ("Hide".equals(showHideTv.getText().toString())) {
                    passwordTv.setTransformationMethod(new PasswordTransformationMethod());
                    showHideTv.setText("Show");
                }
            }
        });

        loginBt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!TextUtils.isEmpty(emailIdTv.getText().toString())) {

                    if (!TextUtils.isEmpty(passwordTv.getText().toString())) {
                        final ProgressDialog dialog = new ProgressDialog(MainActivity.this);
                        dialog.setMessage("Please Wait...Patience leads to a  better life...");
                        dialog.setCancelable(false);
                        dialog.show();

                        KmGetAppListTask.AppListHandler handler = new KmGetAppListTask.AppListHandler() {
                            @Override
                            public void onSuccess(Context context, Map<String, String> s) {
                                if (!s.isEmpty()) {
                                    String appKey = s.keySet().toArray()[0].toString();
                                    String appName = s.values().toArray()[0].toString();

                                    Kommunicate.init(context, appKey);

                                    KMLoginHandler listener = new KMLoginHandler() {
                                        @Override
                                        public void onSuccess(RegistrationResponse registrationResponse, Context context) {
                                            dialog.dismiss();
                                            Kommunicate.openConversation(context);
                                            finish();
                                        }

                                        @Override
                                        public void onFailure(RegistrationResponse registrationResponse, Exception exception) {
                                            dialog.dismiss();
                                            Toast.makeText(MainActivity.this, registrationResponse != null ? registrationResponse.getMessage() : exception != null ? exception.getMessage() : "Some error occured", Toast.LENGTH_SHORT).show();
                                        }
                                    };

                                    KMUser user = new KMUser();
                                    user.setUserName(emailIdTv.getText().toString());
                                    user.setPassword(passwordTv.getText().toString());
                                    user.setApplicationId(appKey);
                                    user.setApplicationName(appName);

                                    new KmUserLoginTask(user, listener, context).execute();
                                }
                            }

                            @Override
                            public void onFailure(Context context, String error) {
                                dialog.dismiss();
                                Toast.makeText(MainActivity.this, error, Toast.LENGTH_LONG).show();
                            }
                        };

                        new KmGetAppListTask(MainActivity.this, handler, emailIdTv.getText().toString()).execute();
                    } else {
                        Toast.makeText(MainActivity.this, "Password field cannot be blank...", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(MainActivity.this, "EmailId field cannot be blank...", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    public static void performLogout(Context context, final Object object) {
        final ProgressDialog dialog = new ProgressDialog(context);
        dialog.setMessage("Logging out, please wait...");
        dialog.setCancelable(false);
        dialog.show();
        Kommunicate.logout(context, new KMLogoutHandler() {
            @Override
            public void onSuccess(Context context) {
                dialog.dismiss();
                Toast.makeText(context, context.getString(com.applozic.mobicomkit.uiwidgets.R.string.user_logout_info), Toast.LENGTH_SHORT).show();
                Intent intent = null;
                try {
                    intent = new Intent(context, Class.forName((String) object));
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    context.startActivity(intent);
                    ((FragmentActivity) context).finish();
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(Exception exception) {
                dialog.dismiss();
            }
        });
    }
}
