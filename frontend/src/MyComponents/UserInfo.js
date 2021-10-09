import React from "react";
// JavaScript library for creating fancy carousels like components
import Glide from "@glidejs/glide";
// reactstrap components
import { Form, Input , Container, Row, Col } from "reactstrap";

// Core Components

function Testimonials3() {
  React.useEffect(() => {
    new Glide(".testimonial-glide", {
      type: "carousel",
      startAt: 0,
      focusAt: 1,
      perTouch: 1,
      perView: 3,
    }).mount();
  }, []);
  return (
    <>
      <div className="testimonials-3">
        <Container fluid>
          <Row>
            <Col md="12">
              <div className="testimonial-glide">
                <div className="glide__track" data-glide-el="track">
                  <ul className="glide__slides">
                    <li className="glide__slide">
                      <div className="info text-left">
                        <p className="description">
                          "Take up one idea. Make that one idea your life -
                          think of it, dream of it, live on that idea. Let the
                          brain, muscles, nerves, every part of your body, be
                          full of that idea, and just leave every other idea
                          alone. This is the way to success. A single rose can
                          be my garden... a single friend, my world."
                        </p>
                      </div>
                    </li>
                    <li className="glide__slide">
                      <div className="info text-left">
                        <p className="description">
                          Artist is a term applied to a person who engages in an
                          activity deemed to be an art. An artist also may be
                          defined unofficially as "a person who expresses him-
                          or herself through a medium". He is a descriptive term
                          applied to a person who engages in an activity deemed
                          to be an art."
                        </p>
                      </div>
                    </li>

                    <li className="glide__slide">
                      <div className="info text-left">
                        <p className="description">
                          "The simplest visual description uses ordinary words
                          to convey what the writer sees. First he or she must
                          look at the subject – slowly, carefully, and
                          repeatedly, if possible – to identify the parts that
                          make the whole"
                        </p>
                      </div>
                    </li>

                    <li className="glide__slide">
                      <div className="info text-left">
                        <p className="description">
                          "Finding temporary housing for your dog should be as
                          easy as renting an Airbnb. That’s the idea behind
                          Rover, which raised $65 million to expand its pet
                          sitting and dog-walking businesses..Finding temporary
                          housing for your dog should be as easy as renting an
                          Airbnb."
                        </p>
                      </div>
                    </li>
                    
                    <li className="glide__slide">
                      <div className="info text-left">
                        <p className="description">
                          "Venture investment in U.S. startups rose sequentially
                          in the second quarter of 2017, boosted by large,
                          late-stage financings and a few outsized early-stage
                          rounds in tech and healthcare..enture investment in
                          U.S. startups rose sequentially in the second quarter
                          of 2017, boosted by large."
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="glide__arrows" data-glide-el="controls">
                  <button
                    className="glide__arrow glide__arrow--left text-default"
                    data-glide-dir="<"
                  >
                    <i className="ni ni-bold-left"></i>
                  </button>
                  <button
                    className="glide__arrow glide__arrow--right text-default"
                    data-glide-dir=">"
                  >
                    <i className="ni ni-bold-right"></i>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Testimonials3;
