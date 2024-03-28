import React from "react";
import QRCode from "qrcode.react";
import "./QRGenerator.scss";

const QRGenerator = ({ text, qr_code_size }) => {
  // console.log(<QRCode/>)
  return (
    <>
      <div className="qrcode-container">
        {{ text } && (
          <QRCode
            value={text}
            size={qr_code_size}
            fgColor="#008080"
            style={{ color: "red", margin: "0 auto" }}
          />
        )}
      </div>
      {/* {console.log(<QRCode/>)} */}
    </>
  );
};

export default QRGenerator;
