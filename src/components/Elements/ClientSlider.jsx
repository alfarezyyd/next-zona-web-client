import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import {Image} from "@nextui-org/react";

export default function ClientSlider() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
      <Slider {...settings}>
        <LogoWrapper>
          <ImgStyle  src={"/faber-castell.png"}  alt="client logo" />
        </LogoWrapper>
        <LogoWrapper>
          <ImgStyle  src={"/joyko.png"}  alt="client logo" />
        </LogoWrapper>
        <LogoWrapper>
          <ImgStyle src={"/kenko.png"} alt="client logo" />
        </LogoWrapper>
        <LogoWrapper>
          <ImgStyle src={"/snowman.png"} alt="client logo" />
        </LogoWrapper>
        <LogoWrapper>
          <ImgStyle src={"/grebel.png"} alt="client logo" />
        </LogoWrapper>
              <LogoWrapper>
          <ImgStyle src={"/casio.png"} alt="client logo" />
        </LogoWrapper>
      </Slider>
  );
}

const LogoWrapper = styled.div`
 
  width: 100%;
  height: 100px;
  cursor: pointer;
  :focus-visible {
    outline: none;
    border: 0px;
  }
`;

const ImgStyle = styled.img`
  width: 100%;
  height: 100%;
  padding: 10%;
`;
