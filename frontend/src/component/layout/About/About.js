import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedIn from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/prasann-kumar-gupta-55a95b1aa/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dmortimyg/image/upload/v1680732268/avatars/Prasann_h0qmgq.jpg"
              alt="Founder"
            />
            <Typography>Prasann Kumar Gupta</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button>
            <span>
              This is a Shopping Website made by Prasann Kumar Gupta.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/prasann-kumar-gupta-55a95b1aa/"
              target="blank"
            >
              <LinkedIn className="youtubeSvgIcon" />
            </a>

            <a href="https://www.facebook.com/prasannkumargupta/" target="blank">
              <FacebookIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;