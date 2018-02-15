package io.kommunicate;

import com.applozic.mobicomkit.feed.ErrorResponseFeed;

import java.util.List;

/**
 * Created by ashish on 09/02/18.
 */

public class KmResponse {

    Object response;
    Exception exception;
    boolean isSuccess;
    List<ErrorResponseFeed> errorFeed;

    public Object getResponse() {
        return response;
    }

    public void setResponse(Object response) {
        this.response = response;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

    public List<ErrorResponseFeed> getErrorFeed() {
        return errorFeed;
    }

    public void setErrorFeed(List<ErrorResponseFeed> errorFeed) {
        this.errorFeed = errorFeed;
    }
}
