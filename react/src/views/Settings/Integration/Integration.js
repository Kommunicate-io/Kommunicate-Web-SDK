import React, { Component } from "react";
import { getConfig } from "../../.../../../config/config.js";
import MultiEmail from '../../MultiEmail/';

import {getJsCode,getJsInstructions} from '../../../utils/customerSetUp';


const pluginBaseUrl = getConfig().kommunicateApi.pluginUrl;
class Integration extends Component {
  constructor(props) {
    super(props);
    this.applicationKey = localStorage.getItem("applicationId");
    this.state = {
      copySuccess: "Copy To Clipboard"
    };
    this.script = getJsCode();
  }

  copyToClipboard = e => {
    e.preventDefault();
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card">
              <div className="row">
                <h4 className="instruction-heading">
                  Add Chat in your product within a minute!
                </h4>
              </div>
              <div className="card-header">
                <div className="card-block">
                  <div>
                    <form>
                      <div className="row">
                        <div className="form-group col-md-5">
                          <textarea
                            className="form-group instruction-text-area"
                            rows="16"
                            value={getJsInstructions()}
                            readOnly
                          />
                        </div>
                        <div className="form-group col-md-7">
                          <textarea
                            className="form-group script-text-area"
                            ref={textarea => (this.textArea = textarea)}
                            rows="16"
                            value={this.script}
                            readOnly
                          />
                        </div>
                      </div>
                      {document.queryCommandSupported("copy") && (
                        <div className="form-group">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.copyToClipboard}
                          >
                            {this.state.copySuccess}
                          </button>
                        </div>
                      )}
                      <MultiEmail />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Integration;
