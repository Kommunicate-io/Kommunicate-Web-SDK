import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';

const pie = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
};

class Reports extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="card-columns cols-2">
          <div className="card">
            <div className="card-header">
              Pie Chart
              <div className="card-actions">
                <a href="http://www.chartjs.org"><small className="text-muted">docs</small></a>
              </div>
            </div>
            <div className="card-block">
              <div className="chart-wrapper">
                <Pie data={pie} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports;
