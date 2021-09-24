import React from "react"
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
// core components
import CardsHeader from "MyComponents/common/CardHeader";

import {
  chartOptions,
  parseOptions,
  chartExample2,
  chartExample3,
  chartExample4,
  chartExample7,
} from "../variables/charts";

function Charts() {
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  return (
    <>
      <CardsHeader />
      <Container className="mt--6" fluid>
        <Row>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Overview</h6>
                <h5 className="h3 mb-0">Total PR</h5>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line
                    data={chartExample3.data}
                    options={chartExample3.options}
                    id="chart-sales"
                    className="chart-canvas"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Performance</h6>
                <h5 className="h3 mb-0">Total weight</h5>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                    className="chart-canvas"
                    id="chart-bars"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Overview</h6>
                <h5 className="h3 mb-0">GAINS comparison with buddies</h5>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={chartExample7.data}
                    options={chartExample7.options}
                    className="chart-canvas"
                    id="chart-bar-stacked"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card>
              <CardHeader>
                <h6 className="surtitle">Growth</h6>
                <h5 className="h3 mb-0">Sales value</h5>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                    id="chart-points"
                    className="chart-canvas"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>          
        </Row>
      </Container>
    </>
  );
}

export default Charts;
