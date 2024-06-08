import React, {useEffect, useState} from "react";
import styled from "styled-components";
// Components
import ProjectBox from "../Elements/ProjectBox";
import FullButton from "../Buttons/FullButton";

export default function Projects() {
  // Fungsi untuk membagi array menjadi sub-array berisi maksimal size item
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      let responseProduct = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Referer: "127.0.0.1:8000",
            Accept: "application/json",
          },
        }
      );
      if (!responseProduct.ok) {
        throw new Error("Failed to fetch products");
      }
      let responseProductJson = await responseProduct.json();
      setProducts(responseProductJson.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Membagi produk menjadi chunk dengan maksimal 3 produk per chunk
  const chunkedProducts = chunkArray(products, 3);

  return (
    <Wrapper id="projects" data-aos="fade-down">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Katalog Produk</h1>
            <p className="font13">
              Berikut adalah produk-produk kami
              <br/>
              yang dijamin memiliki kualitas terbaik dan original.
            </p>
          </HeaderInfo>
          {chunkedProducts.map((productChunk, chunkIndex) => (
            <div className="row textCenter" key={chunkIndex}>
              {productChunk.map((product, productIndex) => (
                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" key={productIndex}>
                  <ProjectBox
                    img={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/stores/${product.resources[0].image_path}`}
                    title={product.name}
                    text={product.description}
                    action={() => alert("clicked")}
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="row flexCenter">
            <div style={{margin: "50px 0", width: "200px"}}>
              <FullButton title="Load More" action={() => alert("clicked")}/>
            </div>
          </div>
        </div>
      </div>
      <div className="lightBg">
        <div className="container">
          <Advertising className="flexSpaceCenter">
            <AddLeft>
              <AddLeftInner>
                <ImgWrapper className="flexCenter">
                  <img className="radius8" src={"/display-stationery.jpg"} alt="add"/>
                </ImgWrapper>
              </AddLeftInner>
            </AddLeft>
            <AddRight>
              <h4 className="font15 semiBold">Kunjungi Offline Store Kami</h4>
              <h2 className="font40 extraBold">Lokasi</h2>
              <p className="font12">
                Kunjungi Offline Store Kami di Pasar Prumnas Klender BKS 182-183, Malaka Jaya, Duren Sawit, Jakarta
                Timur dan dapatkan penawaran menarik dan Anda juga dapat mencoba produk sebelum membeli
              </p>
              <ButtonsRow className="flexNullCenter" style={{margin: "30px 0"}}>
                <div style={{width: "190px"}}>
                  <FullButton title="Get Started" action={() => alert("clicked")}/>
                </div>
                <div style={{width: "190px", marginLeft: "15px"}}>
                  <FullButton title="Contact Us" action={() => alert("clicked")} border/>
                </div>
              </ButtonsRow>
            </AddRight>
          </Advertising>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
`;
const HeaderInfo = styled.div`
  @media (max-width: 860px) {
    text-align: center;
  }
`;
const Advertising = styled.div`
  padding: 100px 0;
  margin: 100px 0;
  position: relative;
  @media (max-width: 1160px) {
    padding: 60px 0 40px 0;
  }
  @media (max-width: 860px) {
    flex-direction: column;
    padding: 0 0 30px 0;
    margin: 80px 0 0px 0;
  }
`;
const ButtonsRow = styled.div`
  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;
const AddLeft = styled.div`
  position: relative;
  width: 50%;

  p {
    max-width: 475px;
  }

  @media (max-width: 860px) {
    width: 80%;
    order: 2;
    text-align: center;
    h2 {
      line-height: 3rem;
      margin: 15px 0;
    }

    p {
      margin: 0 auto;
    }
  }
`;
const AddRight = styled.div`
  width: 50%;
  @media (max-width: 860px) {
    width: 80%;
    order: 2;
  }
`;
const AddLeftInner = styled.div`
  width: 100%;
  position: absolute;
  top: -300px;
  left: 0;
  @media (max-width: 1190px) {
    top: -250px;
  }
  @media (max-width: 920px) {
    top: -200px;
  }
  @media (max-width: 860px) {
    order: 1;
    position: relative;
    top: -60px;
    left: 0;
  }
`;
const ImgWrapper = styled.div`
  width: 100%;
  padding: 0 15%;

  img {
    width: 100%;
    height: auto;
  }

  @media (max-width: 400px) {
    padding: 0;
  }
`;
